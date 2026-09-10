import fs from 'fs';
let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');
content = content.replace("from 'lucide-react';", ", Info, Loader2 } from 'lucide-react';");
fs.writeFileSync('src/screens/GameScreen.tsx', content);
