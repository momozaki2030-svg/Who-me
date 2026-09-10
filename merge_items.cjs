const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');
let extraContent = fs.readFileSync('src/data/extra_items.ts', 'utf-8');

// Remove the import and export wrapper from extraContent
extraContent = extraContent.replace('import { Item } from "../types";\n\nexport const extraItems: Item[] = [\n', '');
extraContent = extraContent.replace(/\];\n$/, '');

// Insert it into items.ts
itemsContent = itemsContent.replace('];\n', ',\n' + extraContent + '];\n');

fs.writeFileSync('src/data/items.ts', itemsContent);
console.log("Merged extra items!");
