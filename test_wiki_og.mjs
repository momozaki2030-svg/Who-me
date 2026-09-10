import https from 'https';

const getOgImage = (title) => {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
    https.get(url, { headers: { 'User-Agent': 'MinAnaGame/2.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta property="og:image" content="([^"]+)"/);
        resolve(match ? match[1] : null);
      });
    }).on('error', () => resolve(null));
  });
}

async function test() {
  console.log('Minecraft:', await getOgImage('Minecraft'));
  console.log('Iron Man:', await getOgImage('Iron Man'));
  console.log('Cristiano Ronaldo:', await getOgImage('Cristiano Ronaldo'));
}
test();
