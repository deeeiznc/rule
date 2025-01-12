/**
 * 更新日期：2024-04-05 15:30:15
 * 用法：Sub-Store 脚本操作添加
 * rename.js 以下是此脚本支持的参数，必须以 # 为开头多个参数使用"&"连接
 *
 *** 主要参数
 * [in=]   自动判断机场节点名类型 优先级 zh(中文) -> flag(国旗) -> quan(英文全称) -> en(英文简写)
 *         例如 [in=zh] / [in=flag] / [in=en] / [in=quan]
 * [nm]    保留没有匹配到的节点
 * [out=]  输出节点名可选参数: (cn或zh ，us或en ，gq或flag ，quan) (默认: 中文)
 * [fgf=]  节点名前缀或国旗分隔符，默认为空格
 * [sn=]   设置国家与序号之间的分隔符，默认为空格
 * [name=] 节点添加机场名称前缀； [nf] 把 name= 的前缀值放在最前面
 * [blkey=iplc+gpt+NF+IPLC] 保留节点名的自定义字段，支持替换
 * [blgd]  保留: 家宽 IPLC 等
 * [bl]    正则匹配保留 [0.1x, x0.2, 6x ,3倍]等标识
 * [nx]    保留1倍率与不显示倍率的
 * [blnx]  只保留高倍率
 * [clear] 清理乱名
 * [blpx]  分组排序
 * [blockquic]  blockquic=on 阻止; blockquic=off 不阻止
 */

 const inArg = $arguments; // 入口参数
 // 取出各种参数
 const nx = inArg.nx || false,
   bl = inArg.bl || false,
   nf = inArg.nf || false,
   key = inArg.key || false,
   blgd = inArg.blgd || false,
   blpx = inArg.blpx || false,
   blnx = inArg.blnx || false,
   debug = inArg.debug || false,
   clear = inArg.clear || false,
   addflag = inArg.flag || false,
   nm = inArg.nm || false;
 
 const FGF = inArg.fgf == undefined ? " " : decodeURI(inArg.fgf),
   XHFGF = inArg.sn == undefined ? " " : decodeURI(inArg.sn),
   FNAME = inArg.name == undefined ? "" : decodeURI(inArg.name),
   BLKEY = inArg.blkey == undefined ? "" : decodeURI(inArg.blkey),
   blockquic = inArg.blockquic == undefined ? "" : decodeURI(inArg.blockquic);
 
 // 输入输出名映射
 const nameMap = {
   cn: "cn",
   zh: "cn",
   us: "us",
   en: "us",
   quan: "quan",
   gq: "gq",
   flag: "gq",
 };
 
 const inname = nameMap[inArg.in] || "",
   outputName = nameMap[inArg.out] || "";
 
 // prettier-ignore
 const FG = ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'];
 // prettier-ignore
 const EN = ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'];
 // prettier-ignore
 const ZH = ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'];
 // prettier-ignore
 const QC = ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S.Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste'];
 
 // 一些正则配置
 const specialRegex = [
   /(\d\.)?\d+×/,
   /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Home|Game|Buy|Zx|LB|Game/,
 ];
 const nameclear =
   /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;
 
 // prettier-ignore
 const regexArray = [
   /ˣ²/, /ˣ³/, /ˣ⁴/, /ˣ⁵/, /ˣ⁶/, /ˣ⁷/, /ˣ⁸/, /ˣ⁹/, /ˣ¹⁰/, /ˣ²⁰/, /ˣ³⁰/, /ˣ⁴⁰/, /ˣ⁵⁰/,
   /IPLC/i, /IEPL/i, /核心/, /边缘/, /高级/, /标准/, /实验/, /商宽/, /家宽/, /游戏|game/i, /购物/, /专线/, /LB/, /cloudflare/i, /\budp\b/i, /\bgpt\b/i, /udpn\b/
 ];
 // prettier-ignore
 const valueArray= [
   "2×","3×","4×","5×","6×","7×","8×","9×","10×","20×","30×","40×","50×",
   "IPLC","IEPL","Kern","Edge","Pro","Std","Exp","Biz","Home","Game","Buy","Zx","LB","CF","UDP","GPT","UDPN"
 ];
 
 const nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
 const namenx = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
 const keya =
   /港|Hong|HK|新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR|🇸🇬|🇭🇰|🇯🇵|🇺🇸|🇰🇷|🇹🇷/i;
 const keyb =
   /(((1|2|3|4)\d)|(香港|Hong|HK) 0[5-9]|((新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR) 0[3-9]))/i;
 
 // rurekey：用于将节点名中的特征替换为国家/地区名
 const rurekey = {
   // 注意：部分地区带有 (?!.*(I|线)) 的严格匹配
   香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
   日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
   新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
   美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图|芝加哥/g,
   // ... 以下省略其他很多替换规则 ...
   德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
   // 示例：阿联酋 / 迪拜
   阿联酋: /迪拜|阿拉伯联合酋长国/g,
   // ...
 };
 
 /**
  * 由于我们想做：
  *   1) 如果严格匹配成功(带 `(?!.*(I|线))`)，就直接替换
  *   2) 如果严格匹配失败，但“去掉 (?!.*(I|线))”后能匹配，则做“标记”
  *   3) 后续匹配 Allkey（AMK）时若依然无地区，则用此标记地区
  *
  * 下面定义一个函数，用于给节点 e 做“严格 or 宽松”匹配，并记录 fallback。
  */
 function matchRegionStrictOrMark(e) {
   // 已匹配到的地区(严格)
   let matchedRegion = null;
   // 宽松匹配成功但严格失败时，记录的“fallback”地区
   let fallbackRegion = null;
 
   // 先用严格正则尝试匹配
   const rurekeyEntries = Object.entries(rurekey);
   for (const [region, strictPattern] of rurekeyEntries) {
     if (strictPattern.test(e.name)) {
       // 一旦匹配 => 替换并算成功
       e.name = e.name.replace(strictPattern, region);
       matchedRegion = region;
       break;
     } else {
       // 检查有没有 (?!.*(I|线)) 之类可去除
       // 思路：去掉这段子串后生成“宽松pattern”，再测试看能否匹配
       const relaxedPatStr = strictPattern.source.replace('(?!.*(I|线))', '');
       // 如果 strictPattern 本身并没有 '(?!.*(I|线))'，则 relaxedPatStr 不变
       // 只有当 relaxedPatStr 真的变了，才说明这是一个宽松化的 regex
       if (relaxedPatStr !== strictPattern.source) {
         // 重新构造一个正则
         // 注意：原本可能有 'g' / 'i' / 'm' 等，默认只取 flags
         const relaxedPattern = new RegExp(relaxedPatStr, strictPattern.flags);
         // 如果宽松能匹配，但严格不能，则说明它是 fallback
         if (relaxedPattern.test(e.name)) {
           // 不替换 e.name，只记录 fallback
           fallbackRegion = region;
         }
       }
     }
   }
 
   // 把这两个值记录到 e 对象里，以便后续使用
   e._matchedRegion = matchedRegion;
   e._fallbackRegion = matchedRegion ? null : fallbackRegion;
 }
 
 /**
  * 针对 rurekey 替换完成后，再配合下方的 Allkey(AMK) 进行二次匹配。
  * 如果二次依然匹配不到，而 e._fallbackRegion 有值，就把它当作最终地区。
  */
 function useFallbackIfNoAllkeyMatch(e, findKey) {
   // 如果没匹配到 Allkey 地区，而且 e._fallbackRegion 存在
   if (!findKey && e._fallbackRegion) {
     // 你可以选择：
     //   1. 把 fallbackRegion 推入 AMK，让后续再找一次
     //   2. 直接在 e.name 里加上这个 fallback 地区
     // 这里示例：把 fallbackRegion 直接补到 name 最前面
     // 或者你也可以在 AMK 里 push(['香港','香港']) 再 match 一次
 
     const fallback = e._fallbackRegion;
     // 简单做法：前面加上 fallback
     e.name = fallback + FGF + e.name;
   }
 }
 
 // 这里是用于替换地区输出用的键值对(中文 / 英文 / 国旗 / 全称)
 let GetK = false,
   AMK = [];
 function ObjKA(i) {
   GetK = true;
   AMK = Object.entries(i);
 }
 
 // 核心函数：对节点数组进行重命名处理
 function operator(pro) {
   // 准备映射表
   const Allmap = {};
   const outList = getList(outputName);
   let inputList;
 
   // 确定 inputList
   if (inname !== "") {
     inputList = [getList(inname)];
   } else {
     // 如果没指定 in=，按 [ZH, FG, QC, EN] 顺序都试试
     inputList = [ZH, FG, QC, EN];
   }
 
   // 建立从“输入”到“输出”的映射 Allmap
   inputList.forEach((arr) => {
     arr.forEach((value, index) => {
       Allmap[value] = outList[index];
     });
   });
 
   // 如果 clear / nx / blnx / key 中任意为 true，则进行初步过滤
   if (clear || nx || blnx || key) {
     pro = pro.filter((res) => {
       const resname = res.name;
       const shouldKeep =
         !(clear && nameclear.test(resname)) &&
         !(nx && namenx.test(resname)) &&
         !(blnx && !nameblnx.test(resname)) &&
         // 如果 [key] 开启了，还要满足 keya.test(...) & /2|4|6|7/i.test(...) 才保留
         !(key && !(keya.test(resname) && /2|4|6|7/i.test(resname)));
       return shouldKeep;
     });
   }
 
   // 后面要处理保留关键词
   const BLKEYS = BLKEY ? BLKEY.split("+") : "";
 
   // 逐个节点进行处理
   pro.forEach((e) => {
     let ens = e.name;
 
     // 1) 先做地区严格匹配 + fallback 标记
     matchRegionStrictOrMark(e);
 
     // 2) 预处理保留关键词（若有）
     //    （参考你原脚本中对 rurekey[ikey] 进行替换的逻辑）
     let bktf = false; // 标记是否出现 BLKEY 处理
     Object.keys(rurekey).forEach((ikey) => {
       if (rurekey[ikey].test(ens)) {
         // 若 rurekey 命中了
         if (BLKEY) {
           bktf = true;
           // 尝试在 e.name 中给这些关键词留存
           let BLKEY_REPLACE = "";
           let re = false;
           BLKEYS.forEach((i) => {
             if (i.includes(">") && ens.includes(i.split(">")[0])) {
               if (i.split(">")[1]) {
                 BLKEY_REPLACE = i.split(">")[1];
                 re = true;
               }
             } else {
               if (ens.includes(i)) {
                 e.name += " " + i;
               }
             }
           });
         }
       }
     });
 
     // block-quic 参数处理
     if (blockquic == "on") {
       e["block-quic"] = "on";
     } else if (blockquic == "off") {
       e["block-quic"] = "off";
     } else {
       delete e["block-quic"];
     }
 
     // 如果没有 bktf 且 BLKEY 存在，也做一次匹配
     if (!bktf && BLKEY) {
       let BLKEY_REPLACE = "",
         re = false;
       BLKEYS.forEach((i) => {
         if (i.includes(">") && e.name.includes(i.split(">")[0])) {
           if (i.split(">")[1]) {
             BLKEY_REPLACE = i.split(">")[1];
             re = true;
           }
         }
       });
       // fallback
     }
   });
 
   // 如果 nm=false，则表示：没有匹配到的节点名要设为 null、最后过滤掉
   // 这里的“没有匹配到”，是指后面 “AMK.find(...)” 的逻辑
   // 先执行 ObjKA(Allmap)
   !GetK && ObjKA(Allmap);
 
   // 二次处理：给每个节点做 Allkey(AMK) 匹配
   pro.forEach((e) => {
     const findKey = AMK.find(([k]) => e.name.includes(k));
     // 如果没匹配到，但 e._fallbackRegion 有值，就用 fallback
     useFallbackIfNoAllkeyMatch(e, findKey);
 
     // 后续再找一遍
     const findKey2 = AMK.find(([k]) => e.name.includes(k));
     if (!findKey2) {
       // 如果依然没找到 && !nm，则丢弃这个节点
       if (!nm) {
         e.name = null;
       }
     }
   });
 
   // 最终过滤掉 name=null 的节点
   pro = pro.filter((e) => e.name !== null);
 
   // 如果保留家宽/IPLC/倍数等
   pro.forEach((e) => {
     let ikey = "",
       ikeys = "";
     if (blgd) {
       // 保留固定格式
       regexArray.forEach((regex, index) => {
         if (regex.test(e.name)) {
           ikeys = valueArray[index];
         }
       });
     }
 
     // 正则匹配倍数
     if (bl) {
       const match = e.name.match(
         /((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/
       );
       if (match) {
         const rev = match[0].match(/(\d[\d.]*)/)[0];
         if (rev !== "1") {
           ikey = rev + "×";
         }
       }
     }
 
     // 组合写回
     // e.name += ... 视具体需求拼接即可
     if (ikey || ikeys) {
       e.name = [e.name, ikey, ikeys].filter(Boolean).join(FGF);
     }
   });
 
   // 排序：有无 specialRegex
   pro = jxh(pro);
   if (blpx) {
     pro = fampx(pro);
   }
   if (key) {
     // 进一步过滤
     pro = pro.filter((e) => !keyb.test(e.name));
   }
 
   return pro;
 }
 
 /**
  * 根据 in/out 值，选择对应数组
  */
 function getList(arg) {
   switch (arg) {
     case "us":
       return EN;
     case "gq":
       return FG;
     case "quan":
       return QC;
     default:
       return ZH;
   }
 }
 
 /**
  * 聚合同名节点
  */
 function jxh(e) {
   const n = e.reduce((acc, item) => {
     const exist = acc.find((x) => x.name === item.name);
     if (exist) {
       exist.count++;
       exist.items.push({ ...item, name: `${item.name}` });
     } else {
       acc.push({
         name: item.name,
         count: 1,
         items: [{ ...item, name: `${item.name}` }],
       });
     }
     return acc;
   }, []);
 
   // flatMap
   const t =
     typeof Array.prototype.flatMap === "function"
       ? n.flatMap((x) => x.items)
       : n.reduce((acc, x) => acc.concat(x.items), []);
   e.splice(0, e.length, ...t);
   return e;
 }
 
 /**
  * 分组排序（对 specialRegex 有匹配的先后顺序等）
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
   // wis 根据 specialRegex 的下标排序
   wis.sort(
     (a, b) =>
       sps[wis.indexOf(a)] - sps[wis.indexOf(b)] ||
       a.name.localeCompare(b.name)
   );
   // wnout 按原序
   wnout.sort((a, b) => pro.indexOf(a) - pro.indexOf(b));
   return wnout.concat(wis);
 }
 
 // 最终对外暴露
 // Sub-Store 或 Surge / Loon / Shadowrocket 通常会在脚本最后对 operator(...) 做处理
 // 这里仅示例
 let newProxies = operator($request.proxies || []);
 $done({ proxies: newProxies });