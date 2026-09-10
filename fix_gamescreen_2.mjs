import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

// Insert getSubcategoryName
if (!content.includes('const getSubcategoryName')) {
  const insertIndex = content.indexOf('export function GameScreen');
  const helper = `const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';
const getSubcategoryName = (catId: string, subId: string) => {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return '';
  const sub = cat.subcategories?.find(s => s.id === subId);
  return sub ? sub.name : '';
};\n\n`;
  content = content.replace("const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';", '');
  content = content.slice(0, insertIndex) + helper + content.slice(insertIndex);
}

// Fix typescript issue in Object.entries(grouped).map
content = content.replace(/return Object\.entries\(grouped\)\.map/g, 'return (Object.entries(grouped) as [string, typeof searchResults][]).map');

fs.writeFileSync('src/screens/GameScreen.tsx', content);
