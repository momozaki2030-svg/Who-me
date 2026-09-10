const https = require('https');
const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');
itemsContent = itemsContent.replace(/import.*?;\n/g, '');
itemsContent = itemsContent.replace(/export const items: Item\[\] = /, 'module.exports = ');
fs.writeFileSync('temp_items2.cjs', itemsContent);
const items = require('./temp_items2.cjs');

async function searchArWiki(query) {
  return new Promise((resolve) => {
    const url = `https://ar.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=400&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
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
  let modifiedContent = fs.readFileSync('src/data/items.ts', 'utf-8');
  
  const toFix = items.filter(i => !i.image || i.image === '');
  console.log(`Found ${toFix.length} items to fix.`);

  for (let i = 0; i < toFix.length; i++) {
    const item = toFix[i];
    let img = await searchArWiki(item.name);
    
    // If not found, try searching just the first two words (e.g. for long club names)
    if (!img) {
      const shortName = item.name.split(' ').slice(0, 2).join(' ');
      img = await searchArWiki(shortName);
    }
    
    if (img) {
      // Find the specific item in the file and replace its image
      // Because we might have identical names in keywords, we find the block by id
      const idRegex = new RegExp(`id:\\s*'${item.id}'[\\s\\S]*?image:\\s*''`);
      modifiedContent = modifiedContent.replace(idRegex, match => match.replace(/image:\s*''/, `image: '${img}'`));
      console.log(`[${i+1}/${toFix.length}] Fixed ${item.name}`);
    } else {
      console.log(`[${i+1}/${toFix.length}] Still missing ${item.name}`);
    }
    await new Promise(r => setTimeout(r, 200)); // sleep to avoid rate limits
  }

  fs.writeFileSync('src/data/items.ts', modifiedContent, 'utf-8');
  console.log("Done fixing images.");
}
run();
