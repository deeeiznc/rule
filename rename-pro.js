/*
 * @name 节点名称格式化
 * @version 1.0.0
 * @description 格式化节点名称，包括语义分割、国家/地区替换、倍率移除和重复名称编号
 */
function operator(proxies = [], targetPlatform, context) {
  const {
    $arguments,
    $options,
    $substore,
    scriptResourceCache,
    ProxyUtils,
    flowUtils,
  } = context;

  // 国家/地区英文缩写到全称的映射
  const countryAbbreviationMap = {
    HK: "Hong Kong",
    SG: "Singapore",
    TW: "Taiwan",
    JP: "Japan",
    US: "United States",
    KR: "South Korea",
    DE: "Germany",
    TR: "Turkey",
    AU: "Australia",
    CA: "Canada",
    GB: "United Kingdom",
    FR: "France",
    NL: "Netherlands",
    ES: "Spain",
    IE: "Ireland",
    IT: "Italia",
    LU: "Luxembourg",
    CH: "Switzerland",
    DK: "Denmark",
    FI: "Finland",
    SE: "Sweden",
    NO: "Norway",
    AT: "Austria",
    CZ: "Czech",
    IS: "Iceland",
    BE: "Belgium",
    PT: "Portugal",
    PL: "Poland",
    EE: "Estonia",
    HU: "Hungary",
    RU: "Russia",
    UA: "Ukraine",
    MD: "Moldova",
    RO: "Romania",
    BG: "Bulgaria",
    RS: "Serbia",
    GR: "Greece",
    IL: "Israel",
    IQ: "Iraq",
    TG: "Togo",
    EG: "Egypt",
    JO: "Jordan",
    TN: "Tunisia",
    AE: "United Arab Emirates",
    SA: "Saudi Arabia",
    UZ: "Uzbekistan",
    PK: "Pakistan",
    KZ: "Kazakhstan",
    NG: "Nigeria",
    AO: "Angola",
    ZA: "South Africa",
    AQ: "Antarctica",
    IN: "India",
    ID: "Indonesia",
    PH: "Philippines",
    MY: "Malaysia",
    MO: "Macao",
    TH: "Thailand",
    VN: "Vietnam",
    KH: "Cambodia",
    BD: "Bangladesh",
    NP: "Nepal",
    MN: "Mongolia",
    NZ: "New Zealand",
    MX: "Mexico",
    BR: "Brazil",
    CL: "Chile",
    AR: "Argentina",
    CO: "Colombia",
    PE: "Peru",
    BO: "Bolivia",
  };

  // 判断一个词是否是单词或数字
  function isWordLike(word) {
    return /^[a-zA-Z0-9]+$/.test(word);
  }

  // 处理节点名称
  function processNodeName(nodeName) {
    let flag = "";
    let firstNonFlagIndex = 0;

    // 提取旗帜 emoji
    const flagMatch = nodeName.match(/^[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/);
    if (flagMatch) {
      flag = flagMatch[0];
      firstNonFlagIndex = flag.length;
    }

    // 移除名称开头可能存在的空格和特殊字符
    let cleanedName = nodeName.substring(firstNonFlagIndex).trim();

    // 移除名称结尾的特殊字符，除了 `.`
    cleanedName = cleanedName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+$/, "");

    // 语义分割
    const words = [];
    let currentWord = "";
    for (let i = 0; i < cleanedName.length; i++) {
      const char = cleanedName[i];
      if (char === "." || isWordLike(char)) {
        currentWord += char;
      } else if (currentWord) {
        words.push(currentWord);
        currentWord = "";
      }
    }
    if (currentWord) {
      words.push(currentWord);
    }

    // 处理第一个词
    if (words.length > 0) {
      const firstWord = words[0];
      const countryAbbreviationMatch = firstWord.match(
        /^([A-Z]{2})(\d+)?$/
      ); // 匹配国家/地区缩写和数字
      if (
        countryAbbreviationMatch &&
        countryAbbreviationMap[countryAbbreviationMatch[1]]
      ) {
        words[0] = `${$arguments.Provider} ${
          countryAbbreviationMap[countryAbbreviationMatch[1]]
        }`;
      } else if (countryAbbreviationMap[firstWord]) {
        words[0] = `${$arguments.Provider} ${countryAbbreviationMap[firstWord]}`;
      }
    }

    // 处理倍率
    for (let i = 1; i < words.length; i++) {
      if (/^(\d+[xX]|[xX]\d+)$/.test(words[i])) {
        words.splice(i, 1);
        i--;
      }
    }

    // 组装最终名称
    let finalName = flag;
    for (let i = 0; i < words.length; i++) {
      if (words[i] === ".") {
        finalName += ".";
      } else {
        finalName += (finalName ? " " : "") + words[i];
      }
    }
    return finalName;
  }

  // 处理节点名称并编号重复项
  const processedNodes = proxies.map(processNodeName);
  const nameCounts = {};
  const numberedNames = [];

  for (const name of processedNodes) {
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  }

  const nameCounters = {};
  for (const name of processedNodes) {
    if (nameCounts[name] > 1) {
      nameCounters[name] = (nameCounters[name] || 0) + 1;
      const count = nameCounters[name];
      const formattedCount = count.toString().padStart(2, "0");
      numberedNames.push(`${name} ${formattedCount}`);
    } else {
      numberedNames.push(name);
    }
  }

  // 更新节点名称
  proxies.forEach((proxy, index) => {
    proxy.name = numberedNames[index];
  });

  return proxies;
}
