import fs from 'fs';
let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');
content = content.replace("} , Info, Loader2 } from 'lucide-react';", ", Info, Loader2 } from 'lucide-react';");
// Let's also check if it's there
if (!content.includes('Info, Loader2 }')) {
  // It might be } from 'lucide-react';
  content = content.replace("} from 'lucide-react';", ", Info, Loader2 } from 'lucide-react';");
}
fs.writeFileSync('src/screens/GameScreen.tsx', content);
