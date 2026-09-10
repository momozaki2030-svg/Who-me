const https = require('https');
const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/Lionel_Messi';
const options = {
  headers: {
    'User-Agent': 'CoolGameApp/1.0 (test@example.com)'
  }
};
https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(json.thumbnail ? json.thumbnail.source : 'No image');
    } catch(e) { console.log('Error parsing JSON:', data.substring(0, 50)); }
  });
}).on('error', (e) => console.error(e));
