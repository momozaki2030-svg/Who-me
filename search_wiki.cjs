const https = require('https');

async function searchCommons(query) {
  return new Promise((resolve) => {
    // We search the English wikipedia for the player name to get the pageimage
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=400&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.query && parsed.query.pages) {
            const pageId = Object.keys(parsed.query.pages)[0];
            if (parsed.query.pages[pageId].thumbnail) {
              resolve(parsed.query.pages[pageId].thumbnail.source);
              return;
            }
          }
          resolve(null);
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const url = await searchCommons('Lionel Messi');
  console.log(url);
}
run();
