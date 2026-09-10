const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');
itemsContent = itemsContent.replace(/import.*?;\n/g, '');
itemsContent = itemsContent.replace(/export const items: Item\[\] = /, 'module.exports = ');
fs.writeFileSync('temp_items2.cjs', itemsContent);
const items = require('./temp_items2.cjs');

let itemInfoContent = fs.readFileSync('src/data/itemInfo.ts', 'utf-8');
const match = itemInfoContent.match(/export const itemData: Record<string, string\[\]> = (\{[\s\S]*?\});\s*$/);
let itemDataStr = match[1];
// This evaluates to an object, but safely
let itemDataObj = eval('(' + itemDataStr + ')');

const missing = items.filter(i => !itemDataObj[i.name]).map(i => ({ name: i.name, subcat: i.subcategoryId }));
console.log("Missing info for " + missing.length + " items.");
// group by subcat
const bySub = {};
missing.forEach(m => {
  bySub[m.subcat] = bySub[m.subcat] || [];
  bySub[m.subcat].push(m.name);
});
console.log(bySub);
