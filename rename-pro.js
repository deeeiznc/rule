const provider = $arguments.provider ?? "Provider",
  out = $arguments.out ?? "abbr",
  countryData = {
    "🇭🇰": { full: "Hong Kong", abbr: "HK" },
    "🇺🇸": { full: "United States", abbr: "US" },
    "🇯🇵": { full: "Japan", abbr: "JP" },
    "🇸🇬": { full: "Singapore", abbr: "SG" },
    "🇹🇼": { full: "Taiwan", abbr: "TW" },
    "🇨🇳": { full: "Taiwan", abbr: "TW" },
    "🇰🇷": { full: "South Korea", abbr: "KR" },
    "🇩🇪": { full: "Germany", abbr: "DE" },
    "🇹🇷": { full: "Türkiye", abbr: "TR" },
    "🇲🇾": { full: "Malaysia", abbr: "MY" },
    "🇦🇺": { full: "Australia", abbr: "AU" },
    "🇬🇧": { full: "United Kingdom", abbr: "UK" },
    "🇨🇦": { full: "Canada", abbr: "CA" },
    "🇲🇽": { full: "Mexico", abbr: "MX" },
    "🇧🇷": { full: "Brazil", abbr: "BR" },
    "🇨🇱": { full: "Chile", abbr: "CL" },
    "🇦🇷": { full: "Argentina", abbr: "AR" },
    "🇨🇴": { full: "Colombia", abbr: "CO" },
    "🇵🇪": { full: "Peru", abbr: "PE" },
    "🇧🇴": { full: "Bolivia", abbr: "BO" },
    "🇫🇷": { full: "France", abbr: "FR" },
    "🇳🇱": { full: "Netherlands", abbr: "NL" },
    "🇪🇸": { full: "Spain", abbr: "ES" },
    "🇮🇪": { full: "Ireland", abbr: "IE" },
    "🇮🇹": { full: "Italia", abbr: "IT" },
    "🇱🇺": { full: "Luxembourg", abbr: "LU" },
    "🇨🇭": { full: "Switzerland", abbr: "CH" },
    "🇩🇰": { full: "Denmark", abbr: "DK" },
    "🇫🇮": { full: "Finland", abbr: "FI" },
    "🇸🇪": { full: "Sweden", abbr: "SE" },
    "🇳🇴": { full: "Norway", abbr: "NO" },
    "🇦🇹": { full: "Austria", abbr: "AT" },
    "🇨🇿": { full: "Czech", abbr: "CZ" },
    "🇮🇸": { full: "Iceland", abbr: "IS" },
    "🇧🇪": { full: "Belgium", abbr: "BE" },
    "🇵🇹": { full: "Portugal", abbr: "PT" },
    "🇵🇱": { full: "Poland", abbr: "PL" },
    "🇪🇪": { full: "Estonia", abbr: "EE" },
    "🇭🇺": { full: "Hungary", abbr: "HU" },
    "🇷🇺": { full: "Russia", abbr: "RU" },
    "🇺🇦": { full: "Ukraine", abbr: "UA" },
    "🇲🇩": { full: "Moldova", abbr: "MD" },
    "🇷🇴": { full: "Romania", abbr: "RO" },
    "🇧🇬": { full: "Bulgaria", abbr: "BG" },
    "🇷🇸": { full: "Serbia", abbr: "RS" },
    "🇬🇷": { full: "Greece", abbr: "GR" },
    "🇮🇱": { full: "Israel", abbr: "IL" },
    "🇮🇶": { full: "Iraq", abbr: "IQ" },
    "🇹🇬": { full: "Togo", abbr: "TG" },
    "🇪🇬": { full: "Egypt", abbr: "EG" },
    "🇯🇴": { full: "Jordan", abbr: "JO" },
    "🇹🇳": { full: "Tunisia", abbr: "TN" },
    "🇦🇪": { full: "Dubai", abbr: "AE" },
    "🇸🇦": { full: "Saudi Arabia", abbr: "SA" },
    "🇺🇿": { full: "Uzbekistan", abbr: "UZ" },
    "🇵🇰": { full: "Pakistan", abbr: "PK" },
    "🇰🇿": { full: "Kazakhstan", abbr: "KZ" },
    "🇳🇬": { full: "Nigeria", abbr: "NG" },
    "🇦🇴": { full: "Angola", abbr: "AO" },
    "🇿🇦": { full: "South Africa", abbr: "ZA" },
    "🇦🇶": { full: "Antarctica", abbr: "AQ" },
    "🇮🇳": { full: "India", abbr: "IN" },
    "🇮🇩": { full: "Indonesia", abbr: "ID" },
    "🇵🇭": { full: "Philippines", abbr: "PH" },
    "🇲🇴": { full: "Macao", abbr: "MO" },
    "🇹🇭": { full: "Thailand", abbr: "TH" },
    "🇻🇳": { full: "Vietnam", abbr: "VN" },
    "🇰🇭": { full: "Cambodia", abbr: "KH" },
    "🇧🇩": { full: "Bangladesh", abbr: "BD" },
    "🇳🇵": { full: "Nepal", abbr: "NP" },
    "🇲🇳": { full: "Mongolia", abbr: "MN" },
    "🇳🇿": { full: "New Zealand", abbr: "NZ" }
  },
  abMap = Object.values(countryData).reduce((m, o) => (m[o.abbr] = o, m), {});

const flag = $server.name.match(/^[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || "",
  words = [...new Intl.Segmenter(undefined, { granularity: "word" })
    .segment($server.name.replace(flag, "").trim())]
    .filter(s => s.isWordLike || /[-.]/.test(s.segment))
    .map(s => s.segment),
  country = flag && countryData[flag]
    ? countryData[flag][out]
    : (words[0] ? abMap[words[0].slice(0, 2).toUpperCase()]?.[out] : ""),
  processed = [provider + " " + country].concat(
    words.slice(1).filter(x => !/ˣ|\b(x\d+|\d+x)/i.test(x.replace(/ˣ/g, "")))
  );

$server.name = flag + " " + processed.reduce((a, c) => /[-.]$/.test(a) ? a + c : a + " " + c);