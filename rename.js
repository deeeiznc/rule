/**
 * 更新日期：2024-04-05 15:30:15
 * 用法：Sub-Store 脚本操作添加
 * rename.js 以下是此脚本支持的参数，必须以 # 为开头多个参数使用"&"连接
 *
 *** 主要参数
 * [in=]    自动判断机场节点名类型：优先级 zh(中文) -> flag(国旗) -> quan(英文全称) -> en(英文简写)
 *          如果不准，加参数指定:
 *          [in=zh] 或 in=cn       -> 识别中文
 *          [in=en] 或 in=us       -> 识别英文缩写
 *          [in=flag] 或 in=gq     -> 识别国旗 (脚本操作前面不要添加国旗操作，否则移除国旗后面脚本识别不到)
 *          [in=quan]             -> 识别英文全称
 *
 * [nm]     保留没有匹配到的节点
 * [out=]   输出节点名，可选参数: (cn或zh, us或en, gq或flag, quan)
 *          对应(中文, 英文缩写, 国旗, 英文全称)，默认中文
 *
 *** 分隔符参数
 * [fgf=]   节点名前缀或国旗分隔符，默认为空格
 * [sn=]    设置国家与序号之间的分隔符，默认为空格
 *
 *** 前缀参数
 * [name=]  节点添加机场名称前缀
 * [nf]     把 name= 的前缀值放在最前面
 *
 *** 保留参数
 * [blkey=iplc+gpt+NF+IPLC] 用 + 号添加多个关键词，保留节点名的自定义字段(需要区分大小写!)
 *  如果需要修改“保留”的关键词成别的，可用 “>” 分割
 *    例如 [#blkey=GPT>新名字+其他关键词] 这将把【GPT】替换成【新名字】
 *
 * [blgd]   保留: 家宽 IPLC ˣ² 等
 * [bl]     正则匹配保留 [0.1x, x0.2, 6x ,3倍]等标识
 * [nx]     保留1倍率与不显示倍率的
 * [blnx]   只保留高倍率
 * [clear]  清理乱名
 * [blpx]   (若用 [bl] 保留了一些标识, 再使用 [blpx] 则对这些标识做分组排序)
 *
 * [blockquic=on/off] 阻止 or 不阻止 QUIC
 *
 * 参考示例: https://xxxx.com/xxxx/rename.js#flag&blkey=GPT>新名字+NF
 */

// const inArg = {'blkey':'iplc+GPT>GPTnewName+NF+IPLC', 'flag':true };
const inArg = $arguments; // console.log(inArg)

const nx     = inArg.nx      || false,
      bl     = inArg.bl      || false,
      nf     = inArg.nf      || false,
      key    = inArg.key     || false,
      blgd   = inArg.blgd    || false,
      blpx   = inArg.blpx    || false,
      blnx   = inArg.blnx    || false,
      debug  = inArg.debug   || false,
      clear  = inArg.clear   || false,
      addflag= inArg.flag    || false,
      nm     = inArg.nm      || false;

const FGF       = inArg.fgf       == undefined ? " " : decodeURI(inArg.fgf),
      XHFGF     = inArg.sn        == undefined ? " " : decodeURI(inArg.sn),
      FNAME     = inArg.name      == undefined ? ""  : decodeURI(inArg.name),
      BLKEY     = inArg.blkey     == undefined ? ""  : decodeURI(inArg.blkey),
      blockquic = inArg.blockquic == undefined ? ""  : decodeURI(inArg.blockquic),
      nameMap   = {
        cn:   "cn",
        zh:   "cn",
        us:   "us",
        en:   "us",
        quan: "quan",
        gq:   "gq",
        flag: "gq",
      },
      inname    = nameMap[inArg.in]  || "",
      outputName= nameMap[inArg.out] || "";

/**
 * 用于输出国旗或英文缩写 / 中文
 */
const FG = [
  '🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹',
  '🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲',
  '🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬',
  '🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺',
  '🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧',
  '🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪',
  '🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹',
  '🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿',
  '🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳',
  '🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'
];

// 英文缩写
const EN = [
  'HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT',
  'AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM',
  'CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG',
  'SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU',
  'IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB',
  'LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME',
  'MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT',
  'PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ',
  'SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN',
  'YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'
];

// 中文
const ZH = [
  '香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利',
  '阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆',
  '加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及',
  '萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利',
  '冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩',
  '莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国',
  '摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙',
  '波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰',
  '瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南',
  '也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'
];

// 英文全称
const QC = [
  'Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan',
  'Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada',
  'CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador',
  'Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland',
  'India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho',
  'Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco',
  'Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico',
  'Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland',
  'Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S.Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste'
];

/**
 * 用来做分组排序的标识
 */
const specialRegex = [
  /(\d\.)?\d+×/,
  /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Home|Game|Buy|Zx|LB|Game/,
];

// 用于清理无效节点名称
const nameclear =
  /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;

// 保留固定格式/倍数相关
// prettier-ignore
const regexArray = [
  /ˣ²/, /ˣ³/, /ˣ⁴/, /ˣ⁵/, /ˣ⁶/, /ˣ⁷/, /ˣ⁸/, /ˣ⁹/, /ˣ¹⁰/, /ˣ²⁰/, /ˣ³⁰/, /ˣ⁴⁰/, /ˣ⁵⁰/, 
  /IPLC/i, /IEPL/i, /核心/, /边缘/, /高级/, /标准/, /实验/, /商宽/, /家宽/, /游戏|game/i, /购物/, /专线/, /LB/, /cloudflare/i, /\budp\b/i, /\bgpt\b/i,/udpn\b/
];
// prettier-ignore
const valueArray = [
  "2×","3×","4×","5×","6×","7×","8×","9×","10×","20×","30×","40×","50×",
  "IPLC","IEPL","Kern","Edge","Pro","Std","Exp","Biz","Home","Game","Buy","Zx","LB","CF","UDP","GPT","UDPN"
];

// 保留高倍率 / 只保留高倍率
const nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
const namenx   = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;

// 关键字筛选
const keya = /港|Hong|HK|新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR|🇸🇬|🇭🇰|🇯🇵|🇺🇸|🇰🇷|🇹🇷/i;
const keyb = /(((1|2|3|4)\d)|(香港|Hong|HK) 0[5-9]|((新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR) 0[3-9]))/i;

/**
 * 1) 严格匹配表
 *   示例：带 (?!.*(I|线)) 等负向断言
 */
const strictRurekey = {
  德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|滬德/g,
  香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
  日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
  新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
  美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图/g,
  台湾: /新台|新北|台(?!.*线)/g,
};

/**
 * 2) 宽松匹配表
 *   若严格匹配失败再看这里
 */
const fallbackRurekey = {
  GB: /UK/g,
  "B-G-P": /BGP/g,
  "Russia Moscow": /Moscow/g,
  "Korea Chuncheon": /Chuncheon|Seoul/g,
  "Hong Kong": /Hongkong|HONG KONG/gi,
  "United Kingdom London": /London|Great Britain/g,
  "Dubai United Arab Emirates": /United Arab Emirates/g,
  "Taiwan TW 台湾 🇹🇼": /(台|Tai\s?wan|TW).*?🇨🇳|🇨🇳.*?(台|Tai\s?wan|TW)/g,
  "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
  澳大利亚: /澳|墨尔本|悉尼/g,
  德国: /法兰克福/g, // 若严格匹配的 “德(?!.*(I|线))” 等失败，可用此处兜底
  日本: /大坂|Tokyo|Osaka/g, 
  韩国: /韩|春川|首尔|Seoul/g,
  波斯尼亚和黑塞哥维那: /波黑共和国/g,
  印尼: /印度尼西亚|雅加达/g,
  印度: /孟买/g,
  阿联酋: /迪拜|阿拉伯联合酋长国/g,
  孟加拉国: /孟加拉/g,
  捷克: /捷克共和国/g,
  Taiwan: /Taipei/g,
  India: /Mumbai/g,
  Germany: /Frankfurt/g,
  Switzerland: /Zurich/g,
  俄罗斯: /俄|莫斯科/g,
  土耳其: /伊斯坦布尔/g,
  泰国: /泰國|曼谷/g,
  法国: /巴黎/g,
  G: /\d\s?GB/gi,
  Esnc: /esnc/gi,
};

/**
 * 3) 合并所有规则 (保留你原先针对 e.name 的后续处理需求)
 */
const allRurekey = { ...strictRurekey, ...fallbackRurekey };

// 是否已经生成了 AMK 映射
let GetK = false, AMK = [];
function ObjKA(i) {
  GetK = true;
  AMK = Object.entries(i); // 形如 [ [ '日本','日本' ], [ 'Hong Kong','🇭🇰'], ... ]
}

/**
 * 核心函数：对节点进行重命名
 */
function operator(pro) {
  const Allmap  = {};
  const outList = getList(outputName);
  let inputList, retainKey = "";

  // 判断输入地区表(中文/英文缩写/国旗/英文全称)
  if (inname !== "") {
    inputList = [ getList(inname) ];
  } else {
    // 如果没指定 in=，就一次尝试 ZH / FG / QC / EN
    inputList = [ ZH, FG, QC, EN ];
  }

  // 构造地区 => 输出名 的映射表(比如 “日本->JP”，“香港->HK”，“日本->🇯🇵” 等)
  inputList.forEach((arr) => {
    arr.forEach((value, valueIndex) => {
      Allmap[value] = outList[valueIndex]; 
    });
  });

  // 如果有清理 / 过滤需求
  if (clear || nx || blnx || key) {
    pro = pro.filter((res) => {
      const resname = res.name;
      const shouldKeep =
        !(clear && nameclear.test(resname)) &&           // 不要命中 nameclear 的
        !(nx && namenx.test(resname)) &&                 // 不要命中 nx
        !(blnx && !nameblnx.test(resname)) &&            // 不要不满足 blnx 的
        !(key && !(keya.test(resname) && /2|4|6|7/i.test(resname))); // key 条件
      return shouldKeep;
    });
  }

  // 解析保留关键词
  const BLKEYS = BLKEY ? BLKEY.split("+") : "";

  pro.forEach((e) => {
    let bktf = false, ens = e.name;

    // ========== 第 1 步：严格匹配 ==========
    let matchedStrict = false;
    for (const region in strictRurekey) {
      if ( strictRurekey[region].test(e.name) ) {
        e.name = e.name.replace(strictRurekey[region], region);
        matchedStrict = true;
        break; // 命中后立即跳出
      }
    }

    // ========== 第 2 步：宽松匹配 fallback ==========
    let matchedFallback = false;
    if (!matchedStrict) {
      for (const region in fallbackRurekey) {
        if ( fallbackRurekey[region].test(e.name) ) {
          // 不直接改 e.name，只先给节点标记
          e.fallbackRegion = region;
          matchedFallback = true;
          break;
        }
      }
    }

    // ========== 第 3 步：其他正则替换 & 保留关键词处理 (原逻辑) ==========
    Object.keys(allRurekey).forEach((ikey) => {
      if (allRurekey[ikey].test(e.name)) {
        e.name = e.name.replace(allRurekey[ikey], ikey);
        if (BLKEY) {
          bktf = true;
          let BLKEY_REPLACE = "", re = false;
          BLKEYS.forEach((i) => {
            if ( i.includes(">") && ens.includes(i.split(">")[0]) ) {
              if ( allRurekey[ikey].test(i.split(">")[0]) ) {
                e.name += " " + i.split(">")[0];
              }
              if ( i.split(">")[1] ) {
                BLKEY_REPLACE = i.split(">")[1];
                re = true;
              }
            } else {
              if ( ens.includes(i) ) {
                e.name += " " + i;
              }
            }
            retainKey = re
              ? BLKEY_REPLACE
              : BLKEYS.filter((items) => e.name.includes(items));
          });
        }
      }
    });

    // 是否 block-quic
    if (blockquic == "on") {
      e["block-quic"] = "on";
    } else if (blockquic == "off") {
      e["block-quic"] = "off";
    } else {
      delete e["block-quic"];
    }

    // 如果还没有保留字段，但 BLKEY 存在，再试一下
    if (!bktf && BLKEY) {
      let BLKEY_REPLACE = "", re = false;
      BLKEYS.forEach((i) => {
        if ( i.includes(">") && e.name.includes(i.split(">")[0]) ) {
          if (i.split(">")[1]) {
            BLKEY_REPLACE = i.split(">")[1];
            re = true;
          }
        }
      });
      retainKey = re
        ? BLKEY_REPLACE
        : BLKEYS.filter((items) => e.name.includes(items));
    }

    // 保留固定格式 (比如 IPLC, Kern...)
    let ikey = "", ikeys = "";
    if (blgd) {
      regexArray.forEach((regex, index) => {
        if (regex.test(e.name)) {
          ikeys = valueArray[index];
        }
      });
    }

    // 正则 匹配 倍率
    if (bl) {
      const match = e.name.match(
        /((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/
      );
      if (match) {
        const rev = match[0].match(/(\d[\d.]*)/)[0];
        if (rev !== "1") {
          const newValue = rev + "×";
          ikey = newValue;
        }
      }
    }

    // ========== 第 4 步：根据地区映射表(AMK) 或 fallbackRegion 做最终改名 ==========

    // 构造一次 Allmap => AMK
    if (!GetK) ObjKA(Allmap);
    const findKey = AMK.find(([k]) => e.name.includes(k));

    // 前缀优先 or 后缀的处理
    let firstName = "", nNames = "";
    if (nf) {
      firstName = FNAME;
    } else {
      nNames = FNAME;
    }

    if (findKey?.[1]) {
      // 如果 e.name 中已经能匹配到某个 key => findKey[1] 是对应的输出名(国旗/中文/英文)
      const findKeyValue = findKey[1];
      let keyover = [], usflag = "";

      // 如果开启了国旗
      if (addflag) {
        const index = outList.indexOf(findKeyValue);
        if (index !== -1) {
          usflag = FG[index];
          // 特别处理台湾国旗 => 改成中国国旗
          usflag = usflag === "🇹🇼" ? "🇨🇳" : usflag;
        }
      }
      keyover = keyover
        .concat(firstName, usflag, nNames, findKeyValue, retainKey, ikey, ikeys)
        .filter((k) => k !== "");
      e.name = keyover.join(FGF);

    } else {
      // 如果啥都没匹配到
      // 但若有 fallbackRegion，可以把它再映射一遍，得到国旗 or 中文/英文
      if (!matchedStrict && e.fallbackRegion) {
        const fallbackName = Allmap[e.fallbackRegion] || e.fallbackRegion; 
        let usflag = "";
        if (addflag) {
          const idx = outList.indexOf(fallbackName);
          if (idx !== -1) {
            usflag = FG[idx];
            usflag = usflag === "🇹🇼" ? "🇨🇳" : usflag;
          }
        }
        e.name = [FNAME, usflag, fallbackName, ikey, ikeys]
          .filter(Boolean)
          .join(FGF);

      } else if (nm) {
        // 如果用户指定 nm=保留没匹配到的节点 => 在名称前面拼接一下前缀
        e.name = [FNAME, e.name].filter(Boolean).join(FGF);
      } else {
        // 否则干脆不要这个节点
        e.name = null;
      }
    }
  });

  // 过滤掉被清空的节点
  pro = pro.filter((e) => e.name !== null);

  // 去重 / 计数处理
  pro = jxh(pro);

  // 如果要对“保留标识”的节点进行分组排序
  if (blpx) {
    pro = fampx(pro);
  }

  // 如果有 key 条件二次过滤
  if (key) {
    pro = pro.filter((e) => !keyb.test(e.name));
  }

  return pro;
}

/**
 * 根据参数 in= / out= 返回对应的数组
 */
function getList(arg) {
  switch (arg) {
    case 'us':
      return EN;
    case 'gq':
      return FG;
    case 'quan':
      return QC;
    default:
      return ZH;
  }
}

/**
 * jxh - 去重并计数
 */
function jxh(e) {
  const n = e.reduce((acc, cur) => {
    const found = acc.find((item) => item.name === cur.name);
    if (found) {
      found.count++;
      found.items.push({ ...cur, name: `${cur.name}` });
    } else {
      acc.push({
        name: cur.name,
        count: 1,
        items: [{ ...cur, name: `${cur.name}` }],
      });
    }
    return acc;
  }, []);
  // 扁平化
  const t = typeof Array.prototype.flatMap === "function"
    ? n.flatMap((e) => e.items)
    : n.reduce((acc, e) => acc.concat(e.items), []);
  e.splice(0, e.length, ...t);
  return e;
}

/**
 * fampx - 对保留标识节点进行二次分组排序
 */
function fampx(pro) {
  const wis = [];
  const wnout = [];
  for (const proxy of pro) {
    const fan = specialRegex.some((regex) => regex.test(proxy.name));
    if (fan) {
      wis.push(proxy);
    } else {
      wnout.push(proxy);
    }
  }
  const sps = wis.map((proxy) =>
    specialRegex.findIndex((regex) => regex.test(proxy.name))
  );
  wis.sort(
    (a, b) =>
      sps[wis.indexOf(a)] -
      sps[wis.indexOf(b)] ||
      a.name.localeCompare(b.name)
  );
  wnout.sort((a, b) => pro.indexOf(a) - pro.indexOf(b));
  return wnout.concat(wis);
}

// 最终导出 operator