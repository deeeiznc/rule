/**
 * Usage: Add a script operation to the Sub-Store
 * Parameter example: #flag&blkey=GPT>new name+NF
 */
const inArg = $arguments,
  {
    nx = false,
    bl = false,
    nf = false,
    blgd = false,
    blpx = false,
    blnx = false,
    debug = false,
    clear = false,
    nm = false,
    flag: addflag = false,
  } = inArg,
  FGF = decodeURI(inArg.fgf ?? " "),
  FNAME = decodeURI(inArg.name ?? ""),
  BLKEY = decodeURI(inArg.blkey ?? ""),
  blockquic = decodeURI(inArg.blockquic ?? "");

const abbr = [
    "HK",
    "JP",
    "SG",
    "US",
    "TW",
    "KR",
    "NL",
    "DE",
    "GB",
    "FR",
    "AU",
    "MO",
    "EU",
    "AE",
    "AF",
    "AL",
    "DZ",
    "AO",
    "AR",
    "AM",
    "AT",
    "AZ",
    "BH",
    "BD",
    "BY",
    "BE",
    "BZ",
    "BJ",
    "BT",
    "BO",
    "BA",
    "BW",
    "BR",
    "VG",
    "BN",
    "BG",
    "BF",
    "BI",
    "KH",
    "CM",
    "CA",
    "CV",
    "KY",
    "CF",
    "TD",
    "CL",
    "CO",
    "KM",
    "CG",
    "CD",
    "CR",
    "HR",
    "CY",
    "CZ",
    "DK",
    "DJ",
    "DO",
    "EC",
    "EG",
    "SV",
    "GQ",
    "ER",
    "EE",
    "ET",
    "FJ",
    "FI",
    "GA",
    "GM",
    "GE",
    "GH",
    "GR",
    "GL",
    "GT",
    "GN",
    "GY",
    "HT",
    "HN",
    "HU",
    "IS",
    "IN",
    "ID",
    "IR",
    "IQ",
    "IE",
    "IM",
    "IL",
    "IT",
    "CI",
    "JM",
    "JO",
    "KZ",
    "KE",
    "KW",
    "KG",
    "LA",
    "LV",
    "LB",
    "LS",
    "LR",
    "LY",
    "LT",
    "LU",
    "MK",
    "MG",
    "MW",
    "MY",
    "MV",
    "ML",
    "MT",
    "MR",
    "MU",
    "MX",
    "MD",
    "MC",
    "MN",
    "ME",
    "MA",
    "MZ",
    "MM",
    "NA",
    "NP",
    "NZ",
    "NI",
    "NE",
    "NG",
    "KP",
    "NO",
    "OM",
    "PK",
    "PA",
    "PY",
    "PE",
    "PH",
    "PT",
    "PR",
    "QA",
    "RO",
    "RU",
    "RW",
    "SM",
    "SA",
    "SN",
    "RS",
    "SL",
    "SK",
    "SI",
    "SO",
    "ZA",
    "ES",
    "LK",
    "SD",
    "SR",
    "SZ",
    "SE",
    "CH",
    "SY",
    "TJ",
    "TZ",
    "TH",
    "TG",
    "TO",
    "TT",
    "TN",
    "TR",
    "TM",
    "VI",
    "UG",
    "UA",
    "UY",
    "UZ",
    "VE",
    "VN",
    "YE",
    "ZM",
    "ZW",
    "AD",
    "RE",
    "PL",
    "GU",
    "VA",
    "LI",
    "CW",
    "SC",
    "AQ",
    "GI",
    "CU",
    "FO",
    "AX",
    "BM",
    "TL",
  ],
  zh = [
    "香港",
    "日本",
    "新加坡",
    "美国",
    "台湾",
    "韩国",
    "荷兰",
    "德国",
    "英国",
    "法国",
    "澳大利亚",
    "澳门",
    "欧洲",
    "阿联酋",
    "阿富汗",
    "阿尔巴尼亚",
    "阿尔及利亚",
    "安哥拉",
    "阿根廷",
    "亚美尼亚",
    "奥地利",
    "阿塞拜疆",
    "巴林",
    "孟加拉国",
    "白俄罗斯",
    "比利时",
    "伯利兹",
    "贝宁",
    "不丹",
    "玻利维亚",
    "波斯尼亚和黑塞哥维那",
    "博茨瓦纳",
    "巴西",
    "英属维京群岛",
    "文莱",
    "保加利亚",
    "布基纳法索",
    "布隆迪",
    "柬埔寨",
    "喀麦隆",
    "加拿大",
    "佛得角",
    "开曼群岛",
    "中非共和国",
    "乍得",
    "智利",
    "哥伦比亚",
    "科摩罗",
    "刚果(布)",
    "刚果(金)",
    "哥斯达黎加",
    "克罗地亚",
    "塞浦路斯",
    "捷克",
    "丹麦",
    "吉布提",
    "多米尼加共和国",
    "厄瓜多尔",
    "埃及",
    "萨尔瓦多",
    "赤道几内亚",
    "厄立特里亚",
    "爱沙尼亚",
    "埃塞俄比亚",
    "斐济",
    "芬兰",
    "加蓬",
    "冈比亚",
    "格鲁吉亚",
    "加纳",
    "希腊",
    "格陵兰",
    "危地马拉",
    "几内亚",
    "圭亚那",
    "海地",
    "洪都拉斯",
    "匈牙利",
    "冰岛",
    "印度",
    "印尼",
    "伊朗",
    "伊拉克",
    "爱尔兰",
    "马恩岛",
    "以色列",
    "意大利",
    "科特迪瓦",
    "牙买加",
    "约旦",
    "哈萨克斯坦",
    "肯尼亚",
    "科威特",
    "吉尔吉斯斯坦",
    "老挝",
    "拉脱维亚",
    "黎巴嫩",
    "莱索托",
    "利比里亚",
    "利比亚",
    "立陶宛",
    "卢森堡",
    "马其顿",
    "马达加斯加",
    "马拉维",
    "马来",
    "马尔代夫",
    "马里",
    "马耳他",
    "毛利塔尼亚",
    "毛里求斯",
    "墨西哥",
    "摩尔多瓦",
    "摩纳哥",
    "蒙古",
    "黑山共和国",
    "摩洛哥",
    "莫桑比克",
    "缅甸",
    "纳米比亚",
    "尼泊尔",
    "新西兰",
    "尼加拉瓜",
    "尼日尔",
    "尼日利亚",
    "朝鲜",
    "挪威",
    "阿曼",
    "巴基斯坦",
    "巴拿马",
    "巴拉圭",
    "秘鲁",
    "菲律宾",
    "葡萄牙",
    "波多黎各",
    "卡塔尔",
    "罗马尼亚",
    "俄罗斯",
    "卢旺达",
    "圣马力诺",
    "沙特阿拉伯",
    "塞内加尔",
    "塞尔维亚",
    "塞拉利昂",
    "斯洛伐克",
    "斯洛文尼亚",
    "索马里",
    "南非",
    "西班牙",
    "斯里兰卡",
    "苏丹",
    "苏里南",
    "斯威士兰",
    "瑞典",
    "瑞士",
    "叙利亚",
    "塔吉克斯坦",
    "坦桑尼亚",
    "泰国",
    "多哥",
    "汤加",
    "特立尼达和多巴哥",
    "突尼斯",
    "土耳其",
    "土库曼斯坦",
    "美属维尔京群岛",
    "乌干达",
    "乌克兰",
    "乌拉圭",
    "乌兹别克斯坦",
    "委内瑞拉",
    "越南",
    "也门",
    "赞比亚",
    "津巴布韦",
    "安道尔",
    "留尼汪",
    "波兰",
    "关岛",
    "梵蒂冈",
    "列支敦士登",
    "库拉索",
    "塞舌尔",
    "南极",
    "直布罗陀",
    "古巴",
    "法罗群岛",
    "奥兰群岛",
    "百慕达",
    "东帝汶",
  ],
  en = [
    "Hong Kong",
    "Japan",
    "Singapore",
    "United States",
    "Taiwan",
    "South Korea",
    "Netherlands",
    "Germany",
    "United Kingdom",
    "France",
    "Australia",
    "Macau",
    "Europe",
    "United Arab Emirates",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Angola",
    "Argentina",
    "Armenia",
    "Austria",
    "Azerbaijan",
    "Bahrain",
    "Bangladesh",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "Colombia",
    "Comoros",
    "Congo - Brazzaville",
    "Congo - Kinshasa",
    "Costa Rica",
    "Croatia",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Djibouti",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Greece",
    "Greenland",
    "Guatemala",
    "Guinea",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Côte d’Ivoire",
    "Jamaica",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "North Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nepal",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Paraguay",
    "Peru",
    "Philippines",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Sierra Leone",
    "Slovakia",
    "Slovenia",
    "Somalia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Eswatini",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "U.S. Virgin Islands",
    "Uganda",
    "Ukraine",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Andorra",
    "Réunion",
    "Poland",
    "Guam",
    "Vatican City",
    "Liechtenstein",
    "Curaçao",
    "Seychelles",
    "Antarctica",
    "Gibraltar",
    "Cuba",
    "Faroe Islands",
    "Åland Islands",
    "Bermuda",
    "Timor-Leste",
  ],
  flag = [
    "🇭🇰",
    "🇯🇵",
    "🇸🇬",
    "🇺🇸",
    "🇨🇳",
    "🇰🇷",
    "🇳🇱",
    "🇩🇪",
    "🇬🇧",
    "🇫🇷",
    "🇦🇺",
    "🇲🇴",
    "🇪🇺",
    "🇦🇪",
    "🇦🇫",
    "🇦🇱",
    "🇩🇿",
    "🇦🇴",
    "🇦🇷",
    "🇦🇲",
    "🇦🇹",
    "🇦🇿",
    "🇧🇭",
    "🇧🇩",
    "🇧🇾",
    "🇧🇪",
    "🇧🇿",
    "🇧🇯",
    "🇧🇹",
    "🇧🇴",
    "🇧🇦",
    "🇧🇼",
    "🇧🇷",
    "🇻🇬",
    "🇧🇳",
    "🇧🇬",
    "🇧🇫",
    "🇧🇮",
    "🇰🇭",
    "🇨🇲",
    "🇨🇦",
    "🇨🇻",
    "🇰🇾",
    "🇨🇫",
    "🇹🇩",
    "🇨🇱",
    "🇨🇴",
    "🇰🇲",
    "🇨🇬",
    "🇨🇩",
    "🇨🇷",
    "🇭🇷",
    "🇨🇾",
    "🇨🇿",
    "🇩🇰",
    "🇩🇯",
    "🇩🇴",
    "🇪🇨",
    "🇪🇬",
    "🇸🇻",
    "🇬🇶",
    "🇪🇷",
    "🇪🇪",
    "🇪🇹",
    "🇫🇯",
    "🇫🇮",
    "🇬🇦",
    "🇬🇲",
    "🇬🇪",
    "🇬🇭",
    "🇬🇷",
    "🇬🇱",
    "🇬🇹",
    "🇬🇳",
    "🇬🇾",
    "🇭🇹",
    "🇭🇳",
    "🇭🇺",
    "🇮🇸",
    "🇮🇳",
    "🇮🇩",
    "🇮🇷",
    "🇮🇶",
    "🇮🇪",
    "🇮🇲",
    "🇮🇱",
    "🇮🇹",
    "🇨🇮",
    "🇯🇲",
    "🇯🇴",
    "🇰🇿",
    "🇰🇪",
    "🇰🇼",
    "🇰🇬",
    "🇱🇦",
    "🇱🇻",
    "🇱🇧",
    "🇱🇸",
    "🇱🇷",
    "🇱🇾",
    "🇱🇹",
    "🇱🇺",
    "🇲🇰",
    "🇲🇬",
    "🇲🇼",
    "🇲🇾",
    "🇲🇻",
    "🇲🇱",
    "🇲🇹",
    "🇲🇷",
    "🇲🇺",
    "🇲🇽",
    "🇲🇩",
    "🇲🇨",
    "🇲🇳",
    "🇲🇪",
    "🇲🇦",
    "🇲🇿",
    "🇲🇲",
    "🇳🇦",
    "🇳🇵",
    "🇳🇿",
    "🇳🇮",
    "🇳🇪",
    "🇳🇬",
    "🇰🇵",
    "🇳🇴",
    "🇴🇲",
    "🇵🇰",
    "🇵🇦",
    "🇵🇾",
    "🇵🇪",
    "🇵🇭",
    "🇵🇹",
    "🇵🇷",
    "🇶🇦",
    "🇷🇴",
    "🇷🇺",
    "🇷🇼",
    "🇸🇲",
    "🇸🇦",
    "🇸🇳",
    "🇷🇸",
    "🇸🇱",
    "🇸🇰",
    "🇸🇮",
    "🇸🇴",
    "🇿🇦",
    "🇪🇸",
    "🇱🇰",
    "🇸🇩",
    "🇸🇷",
    "🇸🇿",
    "🇸🇪",
    "🇨🇭",
    "🇸🇾",
    "🇹🇯",
    "🇹🇿",
    "🇹🇭",
    "🇹🇬",
    "🇹🇴",
    "🇹🇹",
    "🇹🇳",
    "🇹🇷",
    "🇹🇲",
    "🇻🇮",
    "🇺🇬",
    "🇺🇦",
    "🇺🇾",
    "🇺🇿",
    "🇻🇪",
    "🇻🇳",
    "🇾🇪",
    "🇿🇲",
    "🇿🇼",
    "🇦🇩",
    "🇷🇪",
    "🇵🇱",
    "🇬🇺",
    "🇻🇦",
    "🇱🇮",
    "🇨🇼",
    "🇸🇨",
    "🇦🇶",
    "🇬🇮",
    "🇨🇺",
    "🇫🇴",
    "🇦🇽",
    "🇧🇲",
    "🇹🇱",
  ];

const specialRegex = [
    /(\d\.)?\d+×/,
    /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Fam|Game|Buy|Zx|Game/,
  ],
  nameclear =
    /套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|文档|USE|TOTAL|EXPIRE|EMAIL|TRAFFIC|\d\s?[GTM](?:[^AC-Z0-9]|$)/i,
  regexpUse = [
    /商宽|BUSINESS|BIZ/i,
    /家宽|HOME|\bHO\b/i,
    /DC1/,
    /DC2/,
    /DC3/,
    /DC4/,
    /DC5/,
    /EMBY/i,
    /游戏|GAME/i,
    /购物|SHOP/i,
    /GOOGLE PLAY|GOOGLEPLAY/i,
    /PORNHUB/i,
  ],
  valueUse1 = [
    "Biz",
    "Home",
    "DC1",
    "DC2",
    "DC3",
    "DC4",
    "DC5",
    "Emby",
    "Game",
    "Shop",
    "GooglePlay",
    "Pornhub",
  ],
  regexpLanding1 = [
    /\bEONS\b/i,
    /NEAROUTE/i,
    /\bHKT\b/i,
    /HKBN/i,
    /I-CABLE/i,
    /JINX/i,
    /MISAKA/i,
    /DMIT/i,
    /SALMON/i,
    /\bFXT\b/i,
    /UPNET/i,
    /AKARI/i,
    /SEEDNET/i,
    /PITTQIAO|\bPQS\b/i,
    /\bAPOL\b/i,
    /AKILE/i,
    /SG\.GS/i,
    /DIGITALOCEAN/i,
    /\bAWS\b/i,
    /SINGTEL/i,
    /NEROCLOUD/i,
    /TERABIX/i,
    /\bTM\b/,
    /\bCAT\b/,
    /BANGMOD/i,
    /EXETEL/i,
    /ORACLE/i,
    /VERIZON/i,
    /AT&T/i,
    /FRONTIER/i,
    /COMCAST/i,
    /VIDEOTRON/i,
    /WEBCONEX/i,
    /VODAFONE/i,
    /\bBT\b/,
    /\bLG\b/,
    /\bSK\b/,
    /\bKT\b/,
    /SEJONG/i,
    /KDDI/i,
    /MIKU/i,
    /BIGLOBE/i,
    /HINET/i,
    /BAGE/i,
    /SOFTBANK/i,
    /SONET/i,
    /EASTERN/i,
  ],
  valueLanding1 = [
    "Eons",
    "Nearoute",
    "HKT",
    "HKBN",
    "i-Cable",
    "Jinx",
    "Misaka",
    "Dmit",
    "Salmon",
    "FxT",
    "Upnet",
    "Akari",
    "Seednet",
    "PQS",
    "Apol",
    "Akile",
    "SG.GS",
    "DigitalOcean",
    "AWS",
    "Singtel",
    "Nerocloud",
    "Terabix",
    "TM",
    "CAT",
    "Bangmod",
    "Exetel",
    "Oracle",
    "Verizon",
    "AT&T",
    "Frontier",
    "Comcast",
    "Videotron",
    "Webconex",
    "Vodafone",
    "BT",
    "LG",
    "SK",
    "KT",
    "Sejong",
    "KDDI",
    "Miku",
    "Biglobe",
    "Hinet",
    "Bage",
    "SoftBank",
    "SoNet",
    "Eastern",
  ],
  regexpLanding2 = [/CLOUDFLARE/i],
  regexpLanding2b = [/\bCF\b/],
  valueLanding2 = ["CF"],
  regexpEntryRegion = [
    /深|SHENZHEN/i,
    /广|GUANGZHOU/i,
    /粤|GUANGDONG/i,
    /上海|沪|SHANGHAI/i,
    /北京|京|BEIJING/i,
    /宁波|甬|NINGBO/i,
    /杭州|杭|HANGZHOU/i,
  ],
  regexpEntryRegionb = [
    /\bSZ|SZ\b/,
    /\bGZ|GZ\b/,
    /\bGD|GD\b/,
    /\bSH|SH\b/,
    /\bBJ|BJ\b/,
    /\bNB|NB\b/,
    /\bHZ|HZ\b/,
  ],
  valueEntryRegion = ["SZ", "GZ", "GD", "SH", "BJ", "NB", "HZ"],
  regexpEntryCloud1 = [/萌凛云|OWO/i],
  valueEntryCloud1 = ["OwOCloud"],
  regexpEntryCloud2 = [
    /唯一|唯云|WEIYI|WEIYUN|WCLOUD/i,
    /优刻得|UCLOUD/i,
    /腾讯|TENCENT/i,
    /阿里|ALIBABA|ALIYUN|ALICLOUD/i,
    /火山|VOLCANO|VOLCLOUD/i,
    /网易|NETEASE/i,
    /微软|MICROSOFT/i,
    /百度|BAIDU/i,
  ],
  regexpEntryCloud2b = [
    /\bWY|WY\b/,
    /\bUDPN|UDPN\b/,
    /\bTX|TX\b/,
    /\bAli|Ali\b/,
    /\bHS|HS\b/,
    /\bNE|NE\b/,
    /\bMS|MS\b/,
    /\bBD|BD\b/,
  ],
  valueEntryCloud2 = [
    "WCloud",
    "UCloud",
    "Tencent",
    "Aliyun",
    "Volcano",
    "Netease",
    "Microsoft",
    "Baidu",
  ],
  regexpEntryISP = [/电信|TELECOM/i, /移动|MOBILE/i, /联通|UNICOM/i],
  regexpEntryISPb = [/\bCT|CT\b/, /\bCM|CM\b/, /\bCU|CU\b/],
  valueEntryISP = ["CT", "CM", "CU"],
  nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
  namenx = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i,
  rureRegExp = [
    /泰/,
    /俄/,
    /欧/,
    /澳/,
    /法/,
    /德/,
    /韩|Korea/,
    /台/,
    /美/,
    /新|坡/,
    /日/,
    /港/,
    /伊斯坦布尔/,
    /曼谷|泰國/,
    /Zurich|苏黎世/,
    /Moscow|莫斯科/,
    /印度尼西亚|雅加达/,
    /Mumbai|孟买/,
    /波黑共和国/,
    /孟加拉/,
    /Dubai|迪拜|阿拉伯联合酋长国/,
    /澳洲|Melbourne|墨尔本|Sydney|悉尼|(深|沪|呼|京|广|杭)澳/,
    /Paris|巴黎/,
    /UK|London|伦敦|Great Britain/,
    /(深|沪|呼|京|广|杭)德(?!.*(I|线))|Frankfurt|法兰克福|滬德/,
    /Amsterdam|阿姆斯特丹/,
    /Chuncheon|春川|Seoul|首尔/,
    /🇹🇼|新台|新北|台(?!.*线)/,
    /USA|Los Angeles|洛杉矶|San Jose|圣何塞|Silicon Valley|硅谷|Michigan|密西根|Portland|波特兰|Chicago|芝加哥|Columbus|哥伦布|New York|纽约|Oregon|俄勒冈|Seattle|西雅图|(深|沪|呼|京|广|杭)美/,
    /狮城|(深|沪|呼|京|广|杭)新/,
    /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|Tokyo|东京|Shinagawa|品川|Osaka|大坂/,
    /(深|沪|呼|京|广|杭)港(?!.*(I|线))|HongKong/,
  ],
  rureValue = [
    158, 137, 12, 10, 9, 7, 5, 4, 3, 2, 1, 0, 163, 158, 154, 137, 80, 79, 30,
    23, 13, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
  ];

function operator(proxies) {
  switch (inArg.out) {
    case "flag":
      outCountry = flag;
      break;
    case "en":
      outCountry = en;
      break;
    case "zh":
      outCountry = zh;
      break;
    default:
      outCountry = abbr;
  }
  if (clear) proxies = proxies.filter((proxy) => !nameclear.test(proxy.name));
  if (nx) proxies = proxies.filter((proxy) => !namenx.test(proxy.name));
  if (blnx) proxies = proxies.filter((proxy) => nameblnx.test(proxy.name));
  let i;
  if (addflag) {
    for (const proxy of proxies) {
      const nameBak = proxy.name;
      let retainKeys = [];
      if (blgd) {
        for (i = 0; i < regexpUse.length; i++)
          if (regexpUse[i].test(nameBak)) retainKeys.push(valueUse[i]);
        for (i = 0; i < regexpLanding1.length; i++)
          if (regexpLanding1[i].test(nameBak)) {
            retainKeys.push(valueLanding1[i]);
            break;
          }
        if (i == regexpLanding1.length)
          for (i = 0; i < regexpLanding2.length; i++)
            if (
              regexpLanding2[i].test(nameBak) ||
              regexpLanding2b[i].test(nameBak)
            ) {
              retainKeys.push(valueLanding2[i]);
              break;
            }
        for (i = 0; i < regexpEntryRegion.length; i++)
          if (
            regexpEntryRegion[i].test(nameBak) ||
            regexpEntryRegionb[i].test(nameBak)
          ) {
            retainKeys.push(valueEntryRegion[i]);
            break;
          }
        for (i = 0; i < regexpEntryCloud1.length; i++)
          if (regexpEntryCloud1[i].test(nameBak)) {
            retainKeys.push(valueEntryCloud1[i]);
            break;
          }
        if (i == regexpEntryCloud1.length)
          for (i = 0; i < regexpEntryCloud2.length; i++)
            if (
              regexpEntryCloud2[i].test(nameBak) ||
              regexpEntryCloud2b[i].test(nameBak)
            ) {
              retainKeys.push(valueEntryCloud2[i]);
              break;
            }
        for (i = 0; i < regexpEntryISP.length; i++)
          if (
            regexpEntryISP[i].test(nameBak) ||
            regexpEntryISPb[i].test(nameBak)
          )
            retainKeys.push(valueEntryISP[i]);
      }
      if (BLKEY)
        for (const k of BLKEY.split("+")) {
          const part = k.split(">");
          if (part[1]) {
            if (nameBak.includes(part[0])) retainKeys.push(part[1]);
          } else if (nameBak.includes(k)) retainKeys.push(k);
        }
      proxy["block-quic"] = /^(on|off)$/.test(blockquic)
        ? blockquic
        : (delete proxy["block-quic"], undefined);
      let ikey = "";
      if (bl) {
        const m = nameBak.match(
          /(?:倍率|[Xx×])\D?((?:\d{1,3}\.)?\d+)|((?:\d{1,3}\.)?\d+)(?:倍|[Xx×])/
        );
        if (m) {
          const rev = m[1] || m[2];
          rev !== "1" && (ikey = rev + "×");
        }
      }
      for (i = 0; i < 190; i++) {
        if (nameBak.includes(flag[i])) break;
        if (nameBak.includes(en[i])) break;
        if (nameBak.includes(zh[i])) break;
      }
      if (i == 190)
        for (i = 0; i < 190; i++) if (/\b${abbr[i]}\b/.test(nameBak)) break;
      if (i == 190)
        for (i = rureValue.length; i--; )
          if (rureRegExp[i].test(nameBak)) {
            i = rureValue[i];
            break;
          }
      if (i != -1) {
        if (nf)
          proxy.name = [
            FNAME,
            flag[i],
            i == 12 ? outCountry[i] + "-BGP" : outCountry[i],
            retainKeys.join(FGF),
            ikey,
          ]
            .filter(Boolean)
            .join(FGF);
        else
          proxy.name = [
            flag[i],
            FNAME,
            i == 12 ? outCountry[i] + "-BGP" : outCountry[i],
            retainKeys.join(FGF),
            ikey,
          ]
            .filter(Boolean)
            .join(FGF);
      } else proxy.name = nm ? FNAME + nameBak : null;
    }
  } else {
    for (const proxy of proxies) {
      const nameBak = proxy.name;
      let retainKeys = [];
      if (blgd) {
        for (i = 0; i < regexpUse.length; i++)
          if (regexpUse[i].test(nameBak)) retainKeys.push(valueUse[i]);
        for (i = 0; i < regexpLanding1.length; i++)
          if (regexpLanding1[i].test(nameBak)) {
            retainKeys.push(valueLanding1[i]);
            break;
          }
        if (i == regexpLanding1.length)
          for (i = 0; i < regexpLanding2.length; i++)
            if (
              regexpLanding2[i].test(nameBak) ||
              regexpLanding2b[i].test(nameBak)
            ) {
              retainKeys.push(valueLanding2[i]);
              break;
            }
        for (i = 0; i < regexpEntryRegion.length; i++)
          if (
            regexpEntryRegion[i].test(nameBak) ||
            regexpEntryRegionb[i].test(nameBak)
          ) {
            retainKeys.push(valueEntryRegion[i]);
            break;
          }
        for (i = 0; i < regexpEntryCloud1.length; i++)
          if (regexpEntryCloud1[i].test(nameBak)) {
            retainKeys.push(valueEntryCloud1[i]);
            break;
          }
        if (i == regexpEntryCloud1.length)
          for (i = 0; i < regexpEntryCloud2.length; i++)
            if (
              regexpEntryCloud2[i].test(nameBak) ||
              regexpEntryCloud2b[i].test(nameBak)
            ) {
              retainKeys.push(valueEntryCloud2[i]);
              break;
            }
        for (i = 0; i < regexpEntryISP.length; i++)
          if (
            regexpEntryISP[i].test(nameBak) ||
            regexpEntryISPb[i].test(nameBak)
          )
            retainKeys.push(valueEntryISP[i]);
      }
      if (BLKEY)
        for (const k of BLKEY.split("+")) {
          const part = k.split(">");
          if (part[1]) {
            if (nameBak.includes(part[0])) retainKeys.push(part[1]);
          } else if (nameBak.includes(k)) retainKeys.push(k);
        }
      proxy["block-quic"] = /^(on|off)$/.test(blockquic)
        ? blockquic
        : (delete proxy["block-quic"], undefined);
      let ikey = "";
      if (bl) {
        const m = nameBak.match(
          /(?:倍率|[Xx×])\D?((?:\d{1,3}\.)?\d+)|((?:\d{1,3}\.)?\d+)(?:倍|[Xx×])/
        );
        if (m) {
          const rev = m[1] || m[2];
          rev !== "1" && (ikey = rev + "×");
        }
      }
      for (i = 0; i < 190; i++) {
        if (nameBak.includes(flag[i])) break;
        if (nameBak.includes(en[i])) break;
        if (nameBak.includes(zh[i])) break;
      }
      if (i == 190)
        for (i = 0; i < 190; i++) if (/\b${abbr[i]}\b/.test(nameBak)) break;
      if (i == 190)
        for (i = rureValue.length; i--; )
          if (rureRegExp[i].test(nameBak)) {
            i = rureValue[i];
            break;
          }
      if (i != -1)
        proxy.name = [
          FNAME,
          i == 12 ? outCountry[i] + "-BGP" : outCountry[i],
          retainKeys.join(FGF),
          ikey,
        ]
          .filter(Boolean)
          .join(FGF);
      else proxy.name = nm ? FNAME + nameBak : null;
    }
  }
  proxies = proxies.filter((x) => x.name);
  const groups = new Map();
  for (const x of proxies) {
    let g = groups.get(x.name);
    if (g) {
      g.count++;
      g.items.push({
        ...x,
        name: `${x.name}${XHFGF}${g.count.toString().padStart(2, "0")}`,
      });
    } else
      groups.set(x.name, {
        count: 1,
        items: [{ ...x, name: `${x.name}${XHFGF}01` }],
      });
  }
  proxies = [].concat(...Array.from(groups.values(), (g) => g.items));
  if (inArg.one || false) {
    const groups = new Map();
    for (const x of proxies) {
      const k = x.name.replace(
        /[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/,
        ""
      );
      let arr = groups.get(k);
      if (!arr) groups.set(k, (arr = []));
      arr.push(x);
    }
    for (const arr of groups.values())
      if (arr.length === 1 && arr[0].name.endsWith("01"))
        arr[0].name = arr[0].name.replace(/[^.]01/, "");
  }
  if (blpx) {
    const wis = [],
      wnout = [];
    for (let i = 0; i < proxies.length; i++) {
      const x = proxies[i];
      if (specialRegex.some((r) => r.test(x.name)))
        wis.push({ x, i, sp: specialRegex.findIndex((r) => r.test(x.name)) });
      else wnout.push({ x, i });
    }
    wis.sort((a, b) => a.sp - b.sp || a.x.name.localeCompare(b.x.name));
    return wnout
      .sort((a, b) => a.i - b.i)
      .map((o) => o.x)
      .concat(wis.map((o) => o.x));
  }
  return proxies;
}
