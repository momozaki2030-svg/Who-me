const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  "// Shuffle and pick up to 30",
  "// Remove duplicates by name to ensure clean list\\n    pool = pool.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);\\n    // Shuffle and pick up to 30"
);
fs.writeFileSync('src/App.tsx', content, 'utf-8');
