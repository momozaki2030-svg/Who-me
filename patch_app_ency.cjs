const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('import { EncyclopediaScreen }')) {
  content = content.replace(
    "import { SettingsScreen } from './screens/SettingsScreen';",
    "import { SettingsScreen } from './screens/SettingsScreen';\nimport { EncyclopediaScreen } from './screens/EncyclopediaScreen';"
  );
}

const encyHtml = `
          {gameState.status === 'encyclopedia' && (
            <EncyclopediaScreen key="encyclopedia" onBack={() => navigate('home')} />
          )}
`;

if (!content.includes("status === 'encyclopedia'")) {
  content = content.replace(
    "          {gameState.status === 'settings' && (",
    encyHtml + "\n          {gameState.status === 'settings' && ("
  );
}

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Patched App.tsx for encyclopedia");
