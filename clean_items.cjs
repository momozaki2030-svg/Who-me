const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');
itemsContent = itemsContent.replace(/import.*?;\n/g, '');
itemsContent = itemsContent.replace(/export const items: Item\[\] = /, 'module.exports = ');
fs.writeFileSync('temp_items5.cjs', itemsContent);
const items = require('./temp_items5.cjs');

const seen = new Set();
const uniqueItems = [];

items.forEach(item => {
  const key = item.name + '_' + item.subcategoryId;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueItems.push(item);
  }
});

// Specific images for the 13 fallback ones
const overrides = {
  'جافي': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Gavi_2022_%28cropped%29.jpg/500px-Gavi_2022_%28cropped%29.jpg',
  'لويس دياز': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Luis_D%C3%ADaz_2022.jpg/500px-Luis_D%C3%ADaz_2022.jpg',
  'كفيتشا كفاراتسخيليا': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Khvicha_Kvaratskhelia_2023.jpg/500px-Khvicha_Kvaratskhelia_2023.jpg',
  'توتنهام هوتسبير': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/500px-Tottenham_Hotspur.svg.png',
  'باير ليفركوزن': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/500px-Bayer_04_Leverkusen_logo.svg.png',
  'فاينورد': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Feyenoord_logo.svg/500px-Feyenoord_logo.svg.png',
  'سبورتينغ لشبونة': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Sporting_CP.svg/500px-Sporting_CP.svg.png',
  'النصر': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Al-Nassr_FC_logo.svg/500px-Al-Nassr_FC_logo.svg.png',
  'الاتحاد': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Al-Ittihad_Club_Logo.svg/500px-Al-Ittihad_Club_Logo.svg.png',
  'الأهلي': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Al-Ahli_Saudi_FC_Logo.svg/500px-Al-Ahli_Saudi_FC_Logo.svg.png',
  'الوداد البيضاوي': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Wydad_Athletic_Club_logo.svg/500px-Wydad_Athletic_Club_logo.svg.png',
  'الرجاء البيضاوي': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Raja_Club_Athletic_logo.svg/500px-Raja_Club_Athletic_logo.svg.png',
  'الترجي': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Esp%C3%A9rance_Sportive_de_Tunis.svg/500px-Esp%C3%A9rance_Sportive_de_Tunis.svg.png'
};

uniqueItems.forEach(i => {
  if (overrides[i.name]) {
    i.image = overrides[i.name];
  }
});

let output = 'import { Item } from "../types";\n\nexport const items: Item[] = ' + JSON.stringify(uniqueItems, null, 2).replace(/"([^"]+)":/g, '$1:') + ';\n';

fs.writeFileSync('src/data/items.ts', output, 'utf-8');
console.log("Cleaned duplicates and added proper images!");
