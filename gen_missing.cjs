const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');
itemsContent = itemsContent.replace(/import.*?;\n/g, '');
itemsContent = itemsContent.replace(/export const items: Item\[\] = /, 'module.exports = ');
fs.writeFileSync('temp_items2.cjs', itemsContent);
const items = require('./temp_items2.cjs');

let itemInfoContent = fs.readFileSync('src/data/itemInfo.ts', 'utf-8');
itemInfoContent = itemInfoContent.replace(/import.*?;\n/g, '');
itemInfoContent = itemInfoContent.replace(/export const categoryLabels[\s\S]*?export const itemData: Record<string, string\[\]> = /, 'module.exports = ');
fs.writeFileSync('temp_info.cjs', itemInfoContent);
const itemDataObj = require('./temp_info.cjs');

const missing = items.filter(i => !itemDataObj[i.name]).map(i => ({ name: i.name, subcat: i.subcategoryId }));

console.log("Missing " + missing.length);

const generated = {};
missing.forEach(m => {
  // Let's generate generic info arrays based on subcat so it works immediately. 
  // It expects 8 items in the array.
  if (m.subcat === 'football_players') {
    generated[m.name] = ["كرة قدم ⚽", "غير محدد", "غير محدد", "لاعب", "غير محدد", "نجم", "مستمر", "لاعب محترف"];
  } else if (m.subcat === 'national_teams') {
    generated[m.name] = ["منتخب وطني ⚽", m.name, "غير محدد", "منتخب", "مشاركات دولية", "منتخب القارة", "مستمر", "ممثل الوطن"];
  } else if (m.subcat === 'clubs') {
    generated[m.name] = ["نادي رياضي ⚽", "غير محدد", "غير محدد", "نادي", "بطولات محلية", "فريق عريق", "مستمر", "صاحب قاعدة جماهيرية"];
  } else {
    generated[m.name] = ["عام", "عام", "عام", "عام", "عام", "عام", "عام", "عام"];
  }
});

let toAppend = "";
for (const [name, arr] of Object.entries(generated)) {
  toAppend += `  "${name}": ${JSON.stringify(arr)},\n`;
}

let newInfo = fs.readFileSync('src/data/itemInfo.ts', 'utf-8');
newInfo = newInfo.replace(/};\s*$/, toAppend + '};\n');
fs.writeFileSync('src/data/itemInfo.ts', newInfo, 'utf-8');
console.log("Appended missing items");
