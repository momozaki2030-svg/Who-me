const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');
itemsContent = itemsContent.replace(/import.*?;\n/g, '');
itemsContent = itemsContent.replace(/export const items: Item\[\] = /, 'module.exports = ');
fs.writeFileSync('temp_items4.cjs', itemsContent);
const items = require('./temp_items4.cjs');

// 1. Find duplicates
const seen = new Set();
const duplicates = [];
const uniqueItems = [];

items.forEach(item => {
  const key = item.name + '_' + item.subcategoryId;
  if (seen.has(key)) {
    duplicates.push(item);
  } else {
    seen.add(key);
    uniqueItems.push(item);
  }
});
console.log("Duplicates found:", duplicates.map(d => d.name));

// 2. Find fallback images
const fallbackItems = uniqueItems.filter(i => i.image && i.image.includes('ui-avatars'));
console.log("Fallback images found:", fallbackItems.length);
console.log(fallbackItems.map(f => f.name).slice(0, 10));

