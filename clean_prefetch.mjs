import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

// The prefetch was already removed, but just to be sure we remove the backend API dependency from the game logic
const prefetchRegex = /const prefetch = async[\s\S]*?prefetch\(item2\);/g;
content = content.replace(prefetchRegex, '');

fs.writeFileSync('src/screens/GameScreen.tsx', content);
