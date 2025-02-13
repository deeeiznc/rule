/**
 * Usage: Add a script operation to the Sub-Store
 * Parameter example: #flag&blkey=GPT>new name+NF
 */
const inArg = $arguments,
  { nx = false, bl = false, nf = false, blgd = false, blpx = false, blnx = false, debug = false, clear = false, nm = false, flag: addflag = false } = inArg,
  FGF = decodeURI(inArg.fgf ?? " "),
  FNAME = decodeURI(inArg.name ?? ""),
  BLKEY = decodeURI(inArg.blkey ?? ""),
  blockquic = decodeURI(inArg.blockquic ?? "");

const abbr = ['HK', 'MO', 'TW', 'JP', 'KR', 'SG', 'US', 'GB', 'FR', 'DE', 'AU', 'AE', 'AF', 'AL', 'DZ', 'AO', 'AR', 'AM', 'AT', 'AZ', 'BH', 'BD', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'VG', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CO', 'KM', 'CG', 'CD', 'CR', 'HR', 'CY', 'CZ', 'DK', 'DJ', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FJ', 'FI', 'GA', 'GM', 'GE', 'GH', 'GR', 'GL', 'GT', 'GN', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'CI', 'JM', 'JO', 'KZ', 'KE', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LT', 'LU', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MR', 'MU', 'MX', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'KP', 'NO', 'OM', 'PK', 'PA', 'PY', 'PE', 'PH', 'PT', 'PR', 'QA', 'RO', 'RU', 'RW', 'SM', 'SA', 'SN', 'RS', 'SL', 'SK', 'SI', 'SO', 'ZA', 'ES', 'LK', 'SD', 'SR', 'SZ', 'SE', 'CH', 'SY', 'TJ', 'TZ', 'TH', 'TG', 'TO', 'TT', 'TN', 'TR', 'TM', 'VI', 'UG', 'UA', 'UY', 'UZ', 'VE', 'VN', 'YE', 'ZM', 'ZW', 'AD', 'RE', 'PL', 'GU', 'VA', 'LI', 'CW', 'SC', 'AQ', 'GI', 'CU', 'FO', 'AX', 'BM', 'TL'],
  zh = ['香港', '澳门', '台湾', '日本', '韩国', '新加坡', '美国', '英国', '法国', '德国', '澳大利亚', '阿联酋', '阿富汗', '阿尔巴尼亚', '阿尔及利亚', '安哥拉', '阿根廷', '亚美尼亚', '奥地利', '阿塞拜疆', '巴林', '孟加拉国', '白俄罗斯', '比利时', '伯利兹', '贝宁', '不丹', '玻利维亚', '波斯尼亚和黑塞哥维那', '博茨瓦纳', '巴西', '英属维京群岛', '文莱', '保加利亚', '布基纳法索', '布隆迪', '柬埔寨', '喀麦隆', '加拿大', '佛得角', '开曼群岛', '中非共和国', '乍得', '智利', '哥伦比亚', '科摩罗', '刚果(布)', '刚果(金)', '哥斯达黎加', '克罗地亚', '塞浦路斯', '捷克', '丹麦', '吉布提', '多米尼加共和国', '厄瓜多尔', '埃及', '萨尔瓦多', '赤道几内亚', '厄立特里亚', '爱沙尼亚', '埃塞俄比亚', '斐济', '芬兰', '加蓬', '冈比亚', '格鲁吉亚', '加纳', '希腊', '格陵兰', '危地马拉', '几内亚', '圭亚那', '海地', '洪都拉斯', '匈牙利', '冰岛', '印度', '印尼', '伊朗', '伊拉克', '爱尔兰', '马恩岛', '以色列', '意大利', '科特迪瓦', '牙买加', '约旦', '哈萨克斯坦', '肯尼亚', '科威特', '吉尔吉斯斯坦', '老挝', '拉脱维亚', '黎巴嫩', '莱索托', '利比里亚', '利比亚', '立陶宛', '卢森堡', '马其顿', '马达加斯加', '马拉维', '马来', '马尔代夫', '马里', '马耳他', '毛利塔尼亚', '毛里求斯', '墨西哥', '摩尔多瓦', '摩纳哥', '蒙古', '黑山共和国', '摩洛哥', '莫桑比克', '缅甸', '纳米比亚', '尼泊尔', '荷兰', '新西兰', '尼加拉瓜', '尼日尔', '尼日利亚', '朝鲜', '挪威', '阿曼', '巴基斯坦', '巴拿马', '巴拉圭', '秘鲁', '菲律宾', '葡萄牙', '波多黎各', '卡塔尔', '罗马尼亚', '俄罗斯', '卢旺达', '圣马力诺', '沙特阿拉伯', '塞内加尔', '塞尔维亚', '塞拉利昂', '斯洛伐克', '斯洛文尼亚', '索马里', '南非', '西班牙', '斯里兰卡', '苏丹', '苏里南', '斯威士兰', '瑞典', '瑞士', '叙利亚', '塔吉克斯坦', '坦桑尼亚', '泰国', '多哥', '汤加', '特立尼达和多巴哥', '突尼斯', '土耳其', '土库曼斯坦', '美属维尔京群岛', '乌干达', '乌克兰', '乌拉圭', '乌兹别克斯坦', '委内瑞拉', '越南', '也门', '赞比亚', '津巴布韦', '安道尔', '留尼汪', '波兰', '关岛', '梵蒂冈', '列支敦士登', '库拉索', '塞舌尔', '南极', '直布罗陀', '古巴', '法罗群岛', '奥兰群岛', '百慕达', '东帝汶'],
  en = ['Hong Kong', 'Macao', 'Taiwan', 'Japan', 'Korea', 'Singapore', 'United States', 'United Kingdom', 'France', 'Germany', 'Australia', 'Dubai', 'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina-faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'CapeVerde', 'CaymanIslands', 'Central African Republic', 'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'CostaRica', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominican Republic', 'Ecuador', 'Egypt', 'EISalvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Greece', 'Greenland', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Jordan', 'Kazakstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar(Burma)', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'NorthKorea', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Portugal', 'PuertoRico', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'SanMarino', 'SaudiArabia', 'Senegal', 'Serbia', 'SierraLeone', 'Slovakia', 'Slovenia', 'Somalia', 'SouthAfrica', 'Spain', 'SriLanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tajikstan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'TrinidadandTobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'U.S.Virgin Islands', 'Uganda', 'Ukraine', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Andorra', 'Reunion', 'Poland', 'Guam', 'Vatican', 'Liechtensteins', 'Curacao', 'Seychelles', 'Antarctica', 'Gibraltar', 'Cuba', 'Faroe Islands', 'Ahvenanmaa', 'Bermuda', 'Timor-Leste'],
  flag = ['🇭🇰', '🇲🇴', '🇹🇼', '🇯🇵', '🇰🇷', '🇸🇬', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇦🇺', '🇦🇪', '🇦🇫', '🇦🇱', '🇩🇿', '🇦🇴', '🇦🇷', '🇦🇲', '🇦🇹', '🇦🇿', '🇧🇭', '🇧🇩', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇨🇻', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇷', '🇭🇷', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇫🇯', '🇫🇮', '🇬🇦', '🇬🇲', '🇬🇪', '🇬🇭', '🇬🇷', '🇬🇱', '🇬🇹', '🇬🇳', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇨🇮', '🇯🇲', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷', '🇱🇾', '🇱🇹', '🇱🇺', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇷', '🇲🇺', '🇲🇽', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇵', '🇳🇱', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇰🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇦', '🇵🇾', '🇵🇪', '🇵🇭', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇴', '🇷🇺', '🇷🇼', '🇸🇲', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇱', '🇸🇰', '🇸🇮', '🇸🇴', '🇿🇦', '🇪🇸', '🇱🇰', '🇸🇩', '🇸🇷', '🇸🇿', '🇸🇪', '🇨🇭', '🇸🇾', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇬', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇷', '🇹🇲', '🇻🇮', '🇺🇬', '🇺🇦', '🇺🇾', '🇺🇿', '🇻🇪', '🇻🇳', '🇾🇪', '🇿🇲', '🇿🇼', '🇦🇩', '🇷🇪', '🇵🇱', '🇬🇺', '🇻🇦', '🇱🇮', '🇨🇼', '🇸🇨', '🇦🇶', '🇬🇮', '🇨🇺', '🇫🇴', '🇦🇽', '🇧🇲', '🇹🇱'];

const specialRegex = [/(\d\.)?\d+×/, /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Fam|Game|Buy|Zx|LB|Game/],
  nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|文档|USE|Use|TOTAL|Total|EXPIRE|Expire|EMAIL|Email|TRAFFIC|Traffic)/i,
  regexArray = [/ˣ²/, /ˣ³/, /ˣ⁴/, /ˣ⁵/, /ˣ⁶/, /ˣ⁷/, /ˣ⁸/, /ˣ⁹/, /ˣ¹⁰/, /ˣ²⁰/, /ˣ³⁰/, /ˣ⁴⁰/, /ˣ⁵⁰/, /IPLC/i, /IEPL/i, /核心/, /边缘/, /高级/, /标准/, /实验/, /商宽/, /家宽/, /游戏|game/i, /购物/, /专线/, /LB/, /cloudflare/i, /\budp\b/i, /\bgpt\b/i, /udpn\b/],
  valueArray = ["2×", "3×", "4×", "5×", "6×", "7×", "8×", "9×", "10×", "20×", "30×", "40×", "50×", "IPLC", "IEPL", "Kern", "Edge", "Pro", "Std", "Exp", "Biz", "Fam", "Game", "Buy", "Zx", "LB", "CF", "UDP", "GPT", "UDPN"],
  nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
  namenx = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
  rurekey = {
    GB: /UK/g,
    "B-G-P": /BGP/g,
    "Russia Moscow": /Moscow/g,
    "Korea Chuncheon": /Chuncheon|Seoul/g,
    "Hong Kong": /Hongkong|HONG KONG/gi,
    "United Kingdom London": /London|Great Britain/g,
    "Dubai United Arab Emirates": /United Arab Emirates/g,
    "Taiwan TW 台湾 🇹🇼": /(台|Tai\s?wan|TW).*?🇨🇳|🇨🇳.*?(台|Tai\s?wan|TW)/g,
    "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
    澳大利亚: /澳洲|墨尔本|悉尼|土澳|(深|沪|呼|京|广|杭)澳/g,
    德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
    香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
    日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
    新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
    美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图|芝加哥/g,
    波斯尼亚和黑塞哥维那: /波黑共和国/g,
    印尼: /印度尼西亚|雅加达/g,
    印度: /孟买/g,
    阿联酋: /迪拜|阿拉伯联合酋长国/g,
    孟加拉国: /孟加拉/g,
    捷克: /捷克共和国/g,
    台湾: /新台|新北|台(?!.*线)/g,
    Taiwan: /Taipei/g,
    韩国: /春川|韩|首尔/g,
    Japan: /Tokyo|Osaka/g,
    英国: /伦敦/g,
    India: /Mumbai/g,
    Germany: /Frankfurt/g,
    Switzerland: /Zurich/g,
    俄罗斯: /莫斯科/g,
    土耳其: /伊斯坦布尔/g,
    泰国: /泰國|曼谷/g,
    法国: /巴黎/g,
    G: /\d\s?GB/gi,
    Esnc: /esnc/gi
  };

function operator(proxies) {
  const allMap = {};
  switch (inArg.in) {
    case 'flag': inCountry = flag; break;
    case 'en': inCountry = en; break;
    case 'zh': inCountry = zh; break;
    case 'abbr': inCountry = abbr; break;
    default: inCountry = [flag, en, zh, abbr];
  };
  switch (inArg.out) {
    case 'flag': outCountry = flag; break;
    case 'en': outCountry = en; break;
    case 'zh': outCountry = zh; break;
    default: outCountry = abbr;
  };
  (inCountry).forEach(arr => arr.forEach((value, index) => allMap[value] = outCountry[index]));
  if (clear) proxies = proxies.filter(proxy => !nameclear.test(proxy.name));
  if (nx) proxies = proxies.filter(proxy => !namenx.test(proxy.name));
  if (blnx) proxies = proxies.filter(proxy => nameblnx.test(proxy.name));
  if (addflag) {
    for (const proxy of proxies) {
      const nameBak = proxy.name;
      let nameCache = nameBak;
      for (const [rk, reg] of Object.entries(rurekey)) nameCache = nameCache.replace(reg, rk);
      let retainKeys = [];
      if (BLKEY) for (const k of BLKEY.split("+")) {
        const part = k.split(">");
        if (part[1]) {
          if (nameBak.includes(part[0])) retainKeys.push(part[1]);
        } else if (nameBak.includes(k)) retainKeys.push(k);
      }
      proxy["block-quic"] = /^(on|off)$/.test(blockquic) ? blockquic : (delete proxy["block-quic"], undefined);
      let ikey = "", ikeys = "";
      if (blgd) for (let i = 0; i < regexArray.length; i++) regexArray[i].test(nameBak) && (ikeys = valueArray[i]);
      if (bl) { const m = nameBak.match(/(?:倍率|[Xx×])\D?((?:\d{1,3}\.)?\d+)|((?:\d{1,3}\.)?\d+)(?:倍|[Xx×])/); if (m) { const rev = m[1] || m[2]; rev !== "1" && (ikey = rev + "×"); } }
      const keyVal = Object.entries(allMap).find(([k]) => nameCache.includes(k))?.[1] || ((m = nameCache.match(/[澳德港日新坡美台韩俄泰法]/)) ? { "澳": "AU", "德": "DE", "港": "HK", "日": "JP", "坡": "SG", "美": "US", "台": "TW", "韩": "KR", "俄": "RU", "泰": "TH", "法": "FR" }[m[0]] : null);
      if (keyVal) {
        const idx = outCountry.indexOf(keyVal);
        if (idx == -1) proxy.name = [FNAME, keyVal, retainKeys.join(FGF), ikey, ikeys].filter(Boolean).join(FGF);
        else {
          if (nf) proxy.name = [FNAME, flag[idx] === "🇹🇼" ? "🇨🇳" : flag[idx], keyVal, retainKeys.join(FGF), ikey, ikeys].filter(Boolean).join(FGF);
          else proxy.name = [flag[idx] === "🇹🇼" ? "🇨🇳" : flag[idx], FNAME, keyVal, retainKeys.join(FGF), ikey, ikeys].filter(Boolean).join(FGF);
        }
      } else proxy.name = nm ? FNAME + nameBak : null;
    }
  } else {
    for (const proxy of proxies) {
      const nameBak = proxy.name;
      let nameCache = nameBak;
      for (const [rk, reg] of Object.entries(rurekey)) nameCache = nameCache.replace(reg, rk);
      let retainKeys = [];
      if (BLKEY) for (const k of BLKEY.split("+")) { const part = k.split(">"); if (nameBak.includes(part[0])) retainKeys.push(part[1] || part[0]); }
      proxy["block-quic"] = /^(on|off)$/.test(blockquic) ? blockquic : (delete proxy["block-quic"], undefined);
      let ikey = "", ikeys = "";
      if (blgd) for (let i = 0; i < regexArray.length; i++) regexArray[i].test(nameBak) && (ikeys = valueArray[i]);
      if (bl) { const m = nameBak.match(/(?:倍率|[Xx×])\D?((?:\d{1,3}\.)?\d+)|((?:\d{1,3}\.)?\d+)(?:倍|[Xx×])/); if (m) { const rev = m[1] || m[2]; rev !== "1" && (ikey = rev + "×"); } }
      const keyVal = Object.entries(allMap).find(([k]) => nameCache.includes(k))?.[1] || ((m = nameCache.match(/[澳德港日新坡美台韩俄泰法]/)) ? { "澳": "AU", "德": "DE", "港": "HK", "日": "JP", "坡": "SG", "美": "US", "台": "TW", "韩": "KR", "俄": "RU", "泰": "TH", "法": "FR" }[m[0]] : null);
      if (keyVal) proxy.name = [FNAME, keyVal, retainKeys.join(FGF), ikey, ikeys].filter(Boolean).join(FGF); else proxy.name = nm ? FNAME + nameBak : null;
    }
  }
  proxies = proxies.filter(x => x.name);
  const groups = new Map();
  for (const x of proxies) {
    let g = groups.get(x.name);
    if (g) {
      g.count++;
      g.items.push({ ...x, name: `${x.name}${XHFGF}${g.count.toString().padStart(2, '0')}` });
    } else groups.set(x.name, { count: 1, items: [{ ...x, name: `${x.name}${XHFGF}01` }] });
  }
  proxies = [].concat(...Array.from(groups.values(), g => g.items));
  if (inArg.one || false) {
    const groups = new Map();
    for (const x of proxies) {
      const k = x.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, "");
      let arr = groups.get(k);
      if (!arr) groups.set(k, arr = []);
      arr.push(x);
    }
    for (const arr of groups.values()) if (arr.length === 1 && arr[0].name.endsWith("01")) arr[0].name = arr[0].name.replace(/[^.]01/, "");
  }
  if (blpx) {
    const wis = [], wnout = [];
    for (let i = 0; i < proxies.length; i++) {
      const x = proxies[i];
      if (specialRegex.some(r => r.test(x.name))) wis.push({ x, i, sp: specialRegex.findIndex(r => r.test(x.name)) });
      else wnout.push({ x, i });
    }
    wis.sort((a, b) => a.sp - b.sp || a.x.name.localeCompare(b.x.name));
    return wnout.sort((a, b) => a.i - b.i).map(o => o.x).concat(wis.map(o => o.x));
  }
  return proxies;
}