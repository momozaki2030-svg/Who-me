const fs = require('fs');
let content = fs.readFileSync('src/data/items.ts', 'utf-8');
const urls = [...content.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log("Total images:", urls.length);
console.log("Sample URLs:");
console.log(urls.slice(0, 5));
