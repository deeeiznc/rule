function operator(proxies = [], targetPlatform, context) {
  const {
    $arguments,
    $options,
    $substore,
    scriptResourceCache,
    ProxyUtils,
    flowUtils,
  } = context;

  const provider = $arguments ?? 'Provider';

  // Define a mapping of country abbreviations to full country names
  const countryMapping = {
    'AF': 'Afghanistan',
    'AX': 'Aland Islands',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AS': 'American Samoa',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AI': 'Anguilla',
    'AQ': 'Antarctica',
    'AG': 'Antigua and Barbuda',
    'AR': 'Argentina',
    'AM': 'Armenia',
    'AW': 'Aruba',
    'AU': 'Australia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BS': 'Bahamas',
    'BH': 'Bahrain',
    'BD': 'Bangladesh',
    'BB': 'Barbados',
    'BY': 'Belarus',
    'BE': 'Belgium',
    'BZ': 'Belize',
    'BJ': 'Benin',
    'BM': 'Bermuda',
    'BT': 'Bhutan',
    'BO': 'Bolivia',
    'BQ': 'Bonaire',
    'BA': 'Bosnia and Herzegovina',
    'BW': 'Botswana',
    'BV': 'Bouvet Island',
    'BR': 'Brazil',
    'IO': 'British Indian Ocean Territory',
    'BN': 'Brunei Darussalam',
    'BG': 'Bulgaria',
    'BF': 'Burkina Faso',
    'BI': 'Burundi',
    'CV': 'Cabo Verde',
    'KH': 'Cambodia',
    'CM': 'Cameroon',
    'CA': 'Canada',
    'KY': 'Cayman Islands',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'CL': 'Chile',
    'CN': 'China',
    'CX': 'Christmas Island',
    'CC': 'Cocos Islands',
    'CO': 'Colombia',
    'KM': 'Comoros',
    'CG': 'Congo',
    'CD': 'Congo',
    'CK': 'Cook Islands',
    'CR': 'Costa Rica',
    'CI': 'Côte d\'Ivoire',
    'HR': 'Croatia',
    'CU': 'Cuba',
    'CW': 'Curaçao',
    'CY': 'Cyprus',
    'CZ': 'Czech',
    'DK': 'Denmark',
    'DJ': 'Djibouti',
    'DM': 'Dominica',
    'DO': 'Dominican',
    'EC': 'Ecuador',
    'EG': 'Egypt',
    'SV': 'El Salvador',
    'GQ': 'Equatorial Guinea',
    'ER': 'Eritrea',
    'EE': 'Estonia',
    'ET': 'Ethiopia',
    'FK': 'Falkland Islands',
    'FO': 'Faroe Islands',
    'FJ': 'Fiji',
    'FI': 'Finland',
    'FR': 'France',
    'GF': 'French Guiana',
    'PF': 'French Polynesia',
    'TF': 'French Southern Territories',
    'GA': 'Gabon',
    'GM': 'Gambia',
    'GE': 'Georgia',
    'DE': 'Germany',
    'GH': 'Ghana',
    'GI': 'Gibraltar',
    'GR': 'Greece',
    'GL': 'Greenland',
    'GD': 'Grenada',
    'GP': 'Guadeloupe',
    'GU': 'Guam',
    'GT': 'Guatemala',
    'GG': 'Guernsey',
    'GN': 'Guinea',
    'GW': 'Guinea-Bissau',
    'GY': 'Guyana',
    'HT': 'Haiti',
    'HM': 'Heard Island and McDonald Islands',
    'VA': 'Holy See',
    'HN': 'Honduras',
    'HK': 'Hong Kong',
    'HU': 'Hungary',
    'IS': 'Iceland',
    'IN': 'India',
    'ID': 'Indonesia',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'IE': 'Ireland',
    'IM': 'Isle of Man',
    'IL': 'Israel',
    'IT': 'Italy',
    'JM': 'Jamaica',
    'JP': 'Japan',
    'JE': 'Jersey',
    'JO': 'Jordan',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KI': 'Kiribati',
    'KP': 'Korea',
    'KR': 'Korea',
    'KW': 'Kuwait',
    'KG': 'Kyrgyzstan',
    'LA': 'Lao',
    'LV': 'Latvia',
    'LB': 'Lebanon',
    'LS': 'Lesotho',
    'LR': 'Liberia',
    'LY': 'Libya',
    'LI': 'Liechtenstein',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MO': 'Macao',
    'MK': 'Macedonia',
    'MG': 'Madagascar',
    'MW': 'Malawi',
    'MY': 'Malaysia',
    'MV': 'Maldives',
    'ML': 'Mali',
    'MT': 'Malta',
    'MH': 'Marshall Islands',
    'MQ': 'Martinique',
    'MR': 'Mauritania',
    'MU': 'Mauritius',
    'YT': 'Mayotte',
    'MX': 'Mexico',
    'FM': 'Micronesia',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'MN': 'Mongolia',
    'ME': 'Montenegro',
    'MS': 'Montserrat',
    'MA': 'Morocco',
    'MZ': 'Mozambique',
    'MM': 'Myanmar',
    'NA': 'Namibia',
    'NR': 'Nauru',
    'NP': 'Nepal',
    'NL': 'Netherlands',
    'NC': 'New Caledonia',
    'NZ': 'New Zealand',
    'NI': 'Nicaragua',
    'NE': 'Niger',
    'NG': 'Nigeria',
    'NU': 'Niue',
    'NF': 'Norfolk Island',
    'MP': 'Northern Mariana Islands',
    'NO': 'Norway',
    'OM': 'Oman',
    'PK': 'Pakistan',
    'PW': 'Palau',
    'PS': 'Palestine',
    'PA': 'Panama',
    'PG': 'Papua New Guinea',
    'PY': 'Paraguay',
    'PE': 'Peru',
    'PH': 'Philippines',
    'PN': 'Pitcairn',
    'PL': 'Poland',
    'PT': 'Portugal',
    'PR': 'Puerto Rico',
    'QA': 'Qatar',
    'RO': 'Romania',
    'RU': 'Russia',
    'RW': 'Rwanda',
    'BL': 'Saint Barthelemy',
    'SH': 'Saint Helena',
    'KN': 'Saint Kitts and Nevis',
    'LC': 'Saint Lucia',
    'MF': 'Saint Martin',
    'PM': 'Saint Pierre and Miquelon',
    'VC': 'Saint Vincent',
    'WS': 'Samoa',
    'SM': 'San Marino',
    'ST': 'Sao Tome and Principe',
    'SA': 'Saudi Arabia',
    'SN': 'Senegal',
    'RS': 'Serbia',
    'SC': 'Seychelles',
    'SL': 'Sierra Leone',
    'SG': 'Singapore',
    'SX': 'Sint Maarten',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'SB': 'Solomon Islands',
    'SO': 'Somalia',
    'ZA': 'South Africa',
    'GS': 'South Georgia',
    'SS': 'South Sudan',
    'ES': 'Spain',
    'LK': 'Sri Lanka',
    'SD': 'Sudan',
    'SR': 'Suriname',
    'SJ': 'Svalbard and Jan Mayen',
    'SZ': 'Swaziland',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'SY': 'Syrian Arab Republic',
    'TW': 'Taiwan',
    'TJ': 'Tajikistan',
    'TZ': 'Tanzania',
    'TH': 'Thailand',
    'TL': 'Timor-Leste',
    'TG': 'Togo',
    'TK': 'Tokelau',
    'TO': 'Tonga',
    'TT': 'Trinidad and Tobago',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'TM': 'Turkmenistan',
    'TC': 'Turks and Caicos Islands',
    'TV': 'Tuvalu',
    'UG': 'Uganda',
    'UA': 'Ukraine',
    'AE': 'United Arab Emirates',
    'GB': 'United Kingdom',
    'US': 'United States',
    'UM': 'United States Minor Outlying Islands',
    'UY': 'Uruguay',
    'UZ': 'Uzbekistan',
    'VU': 'Vanuatu',
    'VE': 'Venezuela',
    'VN': 'Viet Nam',
    'VG': 'Virgin Islands, British',
    'VI': 'Virgin Islands, U.S.',
    'WF': 'Wallis and Futuna',
    'EH': 'Western Sahara',
    'YE': 'Yemen',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe'
  };

  // Function to process each proxy
  function processProxyName(name) {
    // Retrieve flag emoji at the beginning, if any
    let emoji = '';
    let remainingName = name;

    const emojiRegex = /^\p{RI}\p{RI}|\p{Emoji_Presentation}/u;
    const match = name.match(emojiRegex);
    if (match) {
      emoji = match[0];
      remainingName = name.substring(match.index + match[0].length).trim();
    }

    // Segment the remaining name
    const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
    // Segments is an iterable
    const segments = [...segmenter.segment(remainingName)];

    // Filter segments where isWordLike is true or segment is '.'
    const filteredSegments = segments.filter(s => s.isWordLike || s.segment === '.');
    let words = filteredSegments.map(s => s.segment);

    // Process the first word
    let firstWord = words[0];

    // Check if firstWord is a known country abbreviation or country abbreviation + number
    let countryCodeMatch = firstWord.match(/^([A-Z]{2})(\d*)$/i);
    let countryName = '';

    if (countryCodeMatch) {
      let countryAbbrev = countryCodeMatch[1].toUpperCase();
      let countryNumber = countryCodeMatch[2]; // could be empty

      // Look up country name
      if (countryAbbrev in countryMapping) {
        countryName = countryMapping[countryAbbrev];
        firstWord = `${provider} ${countryName}`;
        words[0] = firstWord;
      }
    }

    // From 2nd word to last, remove words that are combination of number + x/X or x/X + number
    for (let i = 1; i < words.length;) {
      let word = words[i];
      if (/^\d+\.?\d*[xX]$/.test(word) || /^[xX]\d+\.?\d*$/.test(word)) {
        words.splice(i, 1);
      } else {
        i++;
      }
    }

    // Assemble the final name
    let finalName = [emoji, ...words].join(' ').replace(/\s+([.])/g, '$1').replace(/([.])\s+/g, '$1');

    return finalName.trim();
  }

  // Now process each proxy
  const nameCountMap = {}; // To count duplicates
  for (let proxy of proxies) {
    const originalName = proxy.name;
    const newName = processProxyName(proxy.name);
    proxy.name = newName;

    // Count duplicates
    if (!nameCountMap[newName]) {
      nameCountMap[newName] = { count: 1, indices: [proxy] };
    } else {
      nameCountMap[newName].count++;
      nameCountMap[newName].indices.push(proxy);
    }
  }

  // Now, for names that have duplicates, append numbers starting from 01
  for (let [name, info] of Object.entries(nameCountMap)) {
    if (info.count > 1) {
      let index = 1;
      const total = info.count;
      const padLength = Math.max(2, String(total).length);
      for (let proxy of info.indices) {
        proxy.name = `${proxy.name} ${String(index).padStart(padLength, '0')}`;
        index++;
      }
    }
  }

  return proxies;
}
