const fs = require('fs');
let content = fs.readFileSync('src/data/items.ts', 'utf-8');
content = content.replace(/import.*?;\n/g, '');
content = content.replace(/export const items: Item\[\] = /, 'module.exports = ');
fs.writeFileSync('temp_items.cjs', content);
const items = require('./temp_items.cjs');
const counts = {};
items.forEach(i => {
  const key = i.categoryId + '/' + i.subcategoryId;
  counts[key] = (counts[key] || 0) + 1;
});
console.log(counts);
