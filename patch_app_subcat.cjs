const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Change handleStartElimination signature and logic
content = content.replace(
  /const handleStartElimination = \(players: Player\[\], categoryId: string\) => \{[\s\S]*?let pool = validItems\.filter\(i => i\.categoryId === categoryId\);/,
  `const handleStartElimination = (players: Player[], categoryId: string, subcategoryId: string) => {
    let pool = validItems.filter(i => i.categoryId === categoryId);
    if (subcategoryId && subcategoryId !== 'all') {
      pool = pool.filter(i => i.subcategoryId === subcategoryId);
    }`
);

// We need to also update the settings in handleStartElimination
content = content.replace(
  "settings: { mode: 'normal', categoryId, difficulty: 'all', targetScore: 1 },",
  "settings: { mode: 'normal', categoryId, subcategoryId, difficulty: 'all', targetScore: 1 },"
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Updated App.tsx");
