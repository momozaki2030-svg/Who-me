import fs from 'fs';

let content = fs.readFileSync('src/hooks/useItemInfo.ts', 'utf8');

const replacement = `
    // 1. Check local hardcoded info (Rich Info)
    if (localItemInfo[itemName]) {
      setInfo(localItemInfo[itemName]);
      return;
    }

    let isMounted = true;

    // 2. Try fetching very rich info from our Server API (Gemini Powered)
    const fetchRichInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(\`/api/item-info?item=\${encodeURIComponent(itemName)}\`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setInfo(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch rich info, falling back", err);
      }

      // 3. Fallback to structural categories + Wikipedia
      const baseFacts = getCategoryDetails(itemName);
      try {
        const url = \`https://ar.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(itemName.replace(/ /g, '_'))}\`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            const facts = [...baseFacts];
            if (data.extract) {
              const cleanSentence = data.extract
                .split(/[.،]/)[0]
                .replace(/ \\(.+?\\)/g, '')
                .trim();
              if (cleanSentence && cleanSentence.length > 10) {
                facts.push({ label: 'معلومة سريعة', value: cleanSentence + '.' });
              }
            }
            if (facts.length > 0) {
              setInfo(facts);
            } else {
              setInfo([{ label: 'معلومات', value: 'لا توجد معلومات إضافية.' }]);
            }
          }
        } else {
          if (isMounted) setInfo(baseFacts.length > 0 ? baseFacts : [{ label: 'معلومات', value: 'غير متوفر في قاعدة البيانات.' }]);
        }
      } catch (e) {
        if (isMounted) setInfo(baseFacts.length > 0 ? baseFacts : [{ label: 'معلومات', value: 'تعذر جلب المعلومات الإضافية.' }]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRichInfo();
`;

content = content.replace(/ \/\/ 1\. Check local hardcoded info \(Rich Info\)[\s\S]*fetchWiki\(\);\n/m, replacement);
fs.writeFileSync('src/hooks/useItemInfo.ts', content);
