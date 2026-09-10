const https = require('https');
const url = `https://ar.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('ساديو ماني')}&gsrlimit=1&prop=pageimages&pithumbsize=400&format=json`;
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
