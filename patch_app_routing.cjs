const fs = require('fs');

// 1. Update types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf-8');
typesContent = typesContent.replace("type GameMode = 'normal' | 'tournament'", "type GameMode = 'normal' | 'tournament' | 'elimination'");
fs.writeFileSync('src/types.ts', typesContent, 'utf-8');

// 2. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  "mode?: 'normal' | 'tournament'",
  "mode?: 'normal' | 'tournament' | 'elimination'"
);

appContent = appContent.replace(
  "settings: { mode: 'normal', categoryId, subcategoryId, difficulty: 'all', targetScore: 1 },",
  "settings: { mode: 'elimination', categoryId, subcategoryId, difficulty: 'all', targetScore: 1 },"
);

appContent = appContent.replace(
  "onNewGame={() => navigate('setup', gameState.settings.mode)}",
  "onNewGame={() => gameState.settings.mode === 'elimination' ? navigate('setup_elimination') : navigate('setup', gameState.settings.mode)}"
);

fs.writeFileSync('src/App.tsx', appContent, 'utf-8');
console.log("Patched App.tsx routing");
