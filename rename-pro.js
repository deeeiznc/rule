async function operator(proxies = [], targetPlatform, context) {
  const provider = $arguments.provider ?? 'Provider';

  // Map of country abbreviations to full English country names
  const countryMap = {
    'HK': 'Hong Kong',
    'SG': 'Singapore',
    'TW': 'Taiwan',
    'JP': 'Japan',
    'KR': 'Korea',
    'US': 'United States',
    'DE': 'Germany',
    'AU': 'Australia',
    'CN': 'China',
    'IN': 'India',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'MY': 'Malaysia',
    'MO': 'Macao',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'KH': 'Cambodia',
    'BD': 'Bangladesh',
    'NP': 'Nepal',
    'MN': 'Mongolia',
    'NZ': 'New Zealand',
    'CA': 'Canada',
    'BR': 'Brazil',
    'CL': 'Chile',
    'AR': 'Argentina',
    'CO': 'Colombia',
    'PE': 'Peru',
    'MX': 'Mexico',
    'RU': 'Russia',
    'TR': 'Turkey',
    'EG': 'Egypt',
    'ZA': 'South Africa',
    'AE': 'United Arab Emirates',
    // Add other country codes as needed
  };

  // Function to process node names
  function processNodeName(name, provider) {
    // Step 1: Extract flag emoji
    const flagEmojiMatch = name.match(/^(\p{RI}\p{RI}|\p{Emoji}[^\p{Letter}])\s*(.*)$/u);
    let flagEmoji = '';
    let restOfName = name;
    if (flagEmojiMatch) {
      flagEmoji = flagEmojiMatch[1].trim();
      restOfName = flagEmojiMatch[2].trim();
    }

    // Step 2: Segment the rest of the name using Intl.Segmenter
    const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
    const segments = Array.from(segmenter.segment(restOfName));
    const words = segments
      .filter(seg => seg.isWordLike || seg.segment === '-' || seg.segment === '.')
      .map(seg => seg.segment);

    // Step 3: Process the first word
    if (words.length > 0) {
      const firstWordMatch = words[0].match(/^([A-Za-z]{2})(\d*)$/);
      if (firstWordMatch) {
        const countryAbbrev = firstWordMatch[1].toUpperCase();
        if (countryMap[countryAbbrev]) {
          words[0] = `${provider}'s ${countryMap[countryAbbrev]}`;
        }
      }
    }

    // Step 4: Process remaining words
    const processedWords = [words[0]];
    for (let i = 1; i < words.length; i++) {
      let word = words[i];

      // Remove words matching 'number+x/X' or 'x/X+number'
      if (/^\d+(x|X)$/.test(word) || /^(x|X)\d+$/.test(word)) {
        continue;
      }

      // Remove 'ˣ' character if it exists
      word = word.replace(/ˣ/g, '');

      processedWords.push(word);
    }

    // Step 5: Construct the final name
    const newNameParts = flagEmoji ? [flagEmoji] : [];
    for (let i = 0; i < processedWords.length; i++) {
      const word = processedWords[i];
      if (word === '-' || word === '.') {
        // No spaces before or after '-' and '.'
        if (newNameParts[newNameParts.length - 1] === ' ') {
          newNameParts.pop();
        }
        newNameParts.push(word);
      } else {
        // Add spaces between words
        if (newNameParts.length > 0 && newNameParts[newNameParts.length - 1] !== ' ') {
          newNameParts.push(' ');
        }
        newNameParts.push(word);
        newNameParts.push(' ');
      }
    }
    // Remove any trailing space
    if (newNameParts[newNameParts.length - 1] === ' ') {
      newNameParts.pop();
    }

    return newNameParts.join('');
  }

  // Process all proxies
  const nameCounts = {};
  proxies.forEach(proxy => {
    const originalName = proxy.name;
    const newName = processNodeName(originalName, provider);
    proxy.name = newName;

    // Count occurrences for duplicate handling
    if (!nameCounts[newName]) {
      nameCounts[newName] = [];
    }
    nameCounts[newName].push(proxy);
  });

  // Step 6: Handle duplicate names by appending numbers
  Object.values(nameCounts).forEach(proxyList => {
    if (proxyList.length > 1) {
      proxyList.forEach((proxy, index) => {
        proxy.name = `${proxy.name} ${(index + 1).toString().padStart(2, '0')}`;
      });
    }
  });

  return proxies;
}
