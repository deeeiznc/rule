const provider = $arguments.provider ?? "Provider";
const out = $arguments.out ?? "abr";
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
const flagStr = ($server.name.match(/^[\u{1F1E6}-\u{1F1FF}]{2}/u) || [])[0] || "";
const cleanedName = $server.name.replace(flagStr, "").trim();
const words = [...new Intl.Segmenter(undefined, { granularity: "word" }).segment(cleanedName)]
  .filter(s => s.isWordLike || /[-.]/.test(s.segment)).map(s => s.segment);

const getCountry = (abbrKey, type = out.toLowerCase() === 'all' ? 'name' : 'abbr') => 
  Object.values(countryData).find(c => c.abbr === abbrKey)?.[type] || "";

let countryName = flagStr ? getCountry(countryData[flagStr]?.abbr) : words[0]?.substring(0,2).toUpperCase();

countryName = flagStr && countryData[flagStr] 
  ? (out === 'all' ? countryData[flagStr].name : countryData[flagStr].abbr) 
  : getCountry(words[0]?.substring(0,2).toUpperCase()) || "";

const processed = [`${provider} ${countryName}`].concat(
  words.slice(1).filter(w => !/ˣ|\b(x\d+|\d+x)/i.test(w.replace(/ˣ/g, "")))
);

$server.name = flagStr + processed.reduce((a,c,i) => `${a}${i&&!/[-.]/.test(a.slice(-1))?' ':''}${c}`);