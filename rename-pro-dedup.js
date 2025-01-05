async function operator(proxies = [], targetPlatform, context) {
  const cacheEnabled = $arguments.cache;
  const cache = scriptResourceCache;
  const provider = $arguments.provider ?? "Provider";

  const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });

  const countryData = {
    "🇭🇰": { name: "Hong Kong", abbr: "HK" },
    "🇺🇸": { name: "United States", abbr: "US" },
    "🇯🇵": { name: "Japan", abbr: "JP" },
    "🇸🇬": { name: "Singapore", abbr: "SG" },
    "🇹🇼": { name: "Taiwan", abbr: "TW" }, "🇨🇳": { name: "Taiwan", abbr: "TW" },
    "🇰🇷": { name: "South Korea", abbr: "KR" },
    "🇩🇪": { name: "Germany", abbr: "DE" },
    "🇹🇷": { name: "Türkiye", abbr: "TR" },
    "🇲🇾": { name: "Malaysia", abbr: "MY" },
    "🇦🇺": { name: "Australia", abbr: "AU" },
    "🇬🇧": { name: "United Kingdom", abbr: "UK" },
    "🇨🇦": { name: "Canada", abbr: "CA" },
    "🇲🇽": { name: "Mexico", abbr: "MX" },
    "🇧🇷": { name: "Brazil", abbr: "BR" },
    "🇨🇱": { name: "Chile", abbr: "CL" },
    "🇦🇷": { name: "Argentina", abbr: "AR" },
    "🇨🇴": { name: "Colombia", abbr: "CO" },
    "🇵🇪": { name: "Peru", abbr: "PE" },
    "🇧🇴": { name: "Bolivia", abbr: "BO" },
    "🇫🇷": { name: "France", abbr: "FR" },
    "🇳🇱": { name: "Netherlands", abbr: "NL" },
    "🇪🇸": { name: "Spain", abbr: "ES" },
    "🇮🇪": { name: "Ireland", abbr: "IE" },
    "🇮🇹": { name: "Italia", abbr: "IT" },
    "🇱🇺": { name: "Luxembourg", abbr: "LU" },
    "🇨🇭": { name: "Switzerland", abbr: "CH" },
    "🇩🇰": { name: "Denmark", abbr: "DK" },
    "🇫🇮": { name: "Finland", abbr: "FI" },
    "🇸🇪": { name: "Sweden", abbr: "SE" },
    "🇳🇴": { name: "Norway", abbr: "NO" },
    "🇦🇹": { name: "Austria", abbr: "AT" },
    "🇨🇿": { name: "Czech", abbr: "CZ" },
    "🇮🇸": { name: "Iceland", abbr: "IS" },
    "🇧🇪": { name: "Belgium", abbr: "BE" },
    "🇵🇹": { name: "Portugal", abbr: "PT" },
    "🇵🇱": { name: "Poland", abbr: "PL" },
    "🇪🇪": { name: "Estonia", abbr: "EE" },
    "🇭🇺": { name: "Hungary", abbr: "HU" },
    "🇷🇺": { name: "Russia", abbr: "RU" },
    "🇺🇦": { name: "Ukraine", abbr: "UA" },
    "🇲🇩": { name: "Moldova", abbr: "MD" },
    "🇷🇴": { name: "Romania", abbr: "RO" },
    "🇧🇬": { name: "Bulgaria", abbr: "BG" },
    "🇷🇸": { name: "Serbia", abbr: "RS" },
    "🇬🇷": { name: "Greece", abbr: "GR" },
    "🇮🇱": { name: "Israel", abbr: "IL" },
    "🇮🇶": { name: "Iraq", abbr: "IQ" },
    "🇹🇬": { name: "Togo", abbr: "TG" },
    "🇪🇬": { name: "Egypt", abbr: "EG" },
    "🇯🇴": { name: "Jordan", abbr: "JO" },
    "🇹🇳": { name: "Tunisia", abbr: "TN" },
    "🇦🇪": { name: "Dubai", abbr: "AE" },
    "🇸🇦": { name: "Saudi Arabia", abbr: "SA" },
    "🇺🇿": { name: "Uzbekistan", abbr: "UZ" },
    "🇵🇰": { name: "Pakistan", abbr: "PK" },
    "🇰🇿": { name: "Kazakhstan", abbr: "KZ" },
    "🇳🇬": { name: "Nigeria", abbr: "NG" },
    "🇦🇴": { name: "Angola", abbr: "AO" },
    "🇿🇦": { name: "South Africa", abbr: "ZA" },
    "🇦🇶": { name: "Antarctica", abbr: "AQ" },
    "🇮🇳": { name: "India", abbr: "IN" },
    "🇮🇩": { name: "Indonesia", abbr: "ID" },
    "🇵🇭": { name: "Philippines", abbr: "PH" },
    "🇲🇴": { name: "Macao", abbr: "MO" },
    "🇹🇭": { name: "Thailand", abbr: "TH" },
    "🇻🇳": { name: "Vietnam", abbr: "VN" },
    "🇰🇭": { name: "Cambodia", abbr: "KH" },
    "🇧🇩": { name: "Bangladesh", abbr: "BD" },
    "🇳🇵": { name: "Nepal", abbr: "NP" },
    "🇲🇳": { name: "Mongolia", abbr: "MN" },
    "🇳🇿": { name: "New Zealand", abbr: "NZ" },
  };

  function processName(name) {
    const flag = name.match(/^[\u{1F1E6}-\u{1F1FF}]{2}/u);
    const flagStr = flag ? flag[0] : "";
    const cleanedName = flag ? name.replace(flagStr, "").trim() : name;
    const segments = segmenter.segment(cleanedName);
    const words = [];

    for (const segment of segments) {
      if (segment.isWordLike || segment.segment === "-" || segment.segment === ".") {
        words.push(segment.segment);
      }
    }

    let countryName = "";
    if (flagStr && countryData[flagStr]) {
      // Search by flag first
      countryName = countryData[flagStr].name;
    } else if (words.length > 0) {
      // If no match by flag, then search by abbr
      const abbr = words[0].substring(0, 2).toUpperCase();
      // Look for the abbr in the countryData values
      for (const flag in countryData) {
        if (countryData[flag].abbr === abbr) {
          countryName = countryData[flag].name;
          break; // Stop searching once a match is found
        }
      }
    }

    const processedWords = [`${provider} ${countryName}`];

    for (let i = 1; i < words.length; i++) {
      const word = words[i].replace(/ˣ/g, "");
      if (/^\d+(\.\d+)?(x|X)$/i.test(word) || /^(x|X)\d+(\.\d+)?$/i.test(word)) {
        continue;
      } else {
        processedWords.push(word);
      }
    }

    let finalName = flagStr;
    for (let i = 0; i < processedWords.length; i++) {
      const word = processedWords[i];
      if (i === 0) {
        finalName += ` ${word}`;
      } else if (word === "-" || word === ".") {
        finalName += word;
      } else if (processedWords[i - 1] === "-" || processedWords[i - 1] === ".") {
        finalName += word;
      } else {
        finalName += ` ${word}`;
      }
    }
    return finalName.trim();
  }

  proxies.forEach((proxy) => {
    proxy.name = processName(proxy.name);
  });

  const nameCounts = {};
  proxies.forEach((proxy) => {
    nameCounts[proxy.name] = (nameCounts[proxy.name] || 0) + 1;
  });

  const duplicateNames = Object.keys(nameCounts).filter(
    (name) => nameCounts[name] > 1
  );

  if (duplicateNames.length > 0) {
    const nameCounters = {};
    proxies.forEach((proxy) => {
      if (duplicateNames.includes(proxy.name)) {
        nameCounters[proxy.name] = (nameCounters[proxy.name] || 0) + 1;
        proxy.name += ` ${(nameCounters[proxy.name]).toString().padStart(2, "0")}`;
      }
    });
  }

  return proxies;
}
