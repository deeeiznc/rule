const provider = $arguments.provider ?? "Provider";

const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });

const countryCodeToName = {
  HK: "Hong Kong",
  US: "United States",
  JP: "Japan",
  SG: "Singapore",
  TW: "Taiwan",
  MO: "Macao",
  KR: "South Korea",
  DE: "Germany",
  TR: "Türkiye",
  MY: "Malaysia",
  AU: "Australia",
  UK: "United Kingdom",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  CL: "Chile",
  AR: "Argentina",
  CO: "Colombia",
  PE: "Peru",
  BO: "Bolivia",
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
  AE: "Dubai",
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
  MO: "Macao",
  TH: "Thailand",
  VN: "Vietnam",
  KH: "Cambodia",
  BD: "Bangladesh",
  NP: "Nepal",
  MN: "Mongolia",
  NZ: "New Zealand",
};

const name = $server.name
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

const processedWords = [`${provider} ${countryCodeToName[words[0].substring(0, 2)]}`];

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

$server.name = finalName.trim();