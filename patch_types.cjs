const fs = require('fs');

let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  "status: 'home' | 'setup' | 'playing' | 'game_over' | 'how_to_play' | 'settings';",
  "status: 'home' | 'setup' | 'playing' | 'game_over' | 'how_to_play' | 'settings' | 'setup_elimination' | 'elimination_game';"
);

fs.writeFileSync('src/types.ts', content, 'utf-8');
console.log("Updated types.ts");
