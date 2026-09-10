import fs from 'fs';
let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');
content = content.replace("Loader2 } from 'lucide-react';", "Loader2, Bot } from 'lucide-react';");
fs.writeFileSync('src/screens/GameScreen.tsx', content);
