import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

// 1. Fix Lucide imports
if (!content.includes('Loader2')) {
  content = content.replace("from 'lucide-react';", ", Loader2, Info } from 'lucide-react';");
}

// 2. Remove the erroneously placed AnimatePresence blocks inside ItemInfoDisplay and SecretItemOverlay
content = content.replace(/<AnimatePresence>[\s]*\{infoItem && <ItemInfoDisplay item=\{infoItem\} onClose=\{\(\) => setInfoItem\(null\)\} \/>\}[\s]*<\/AnimatePresence>/g, '');

// 3. The infoItem was used inside ItemInfoDisplay without being defined. It's actually meant to be at the bottom of GameScreen.
// And setInfoItem wasn't defined in the global scope of GameScreen either.
// Let's check if infoItem exists inside GameScreen
if (!content.includes('const [infoItem, setInfoItem]')) {
  const insertIndex = content.indexOf('const [searchQuery, setSearchQuery] = useState(\'\');');
  content = content.slice(0, insertIndex) + "const [infoItem, setInfoItem] = useState<Item | null>(null);\n  " + content.slice(insertIndex);
}

// 4. Ensure the AnimatePresence for Info modal is at the end of GameScreen.
// Wait, the previous replacement might have added it at the end of GameScreen, but also to ItemInfoDisplay.
// Let's add it carefully at the very end of GameScreen before the final </div>
if (!content.includes('{infoItem && <ItemInfoDisplay item={infoItem} onClose={() => setInfoItem(null)} />}')) {
   content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\)\;\s*\}\s*$/g, function(match) {
       return `
      <AnimatePresence>
        {infoItem && <ItemInfoDisplay item={infoItem} onClose={() => setInfoItem(null)} />}
      </AnimatePresence>
` + match;
   });
} else {
   // Let's just make sure it's at the end of GameScreen!
   const endDiv = '</div>\n  );\n}';
   if (!content.endsWith(endDiv)) {
     // I'll manually replace the end of the file.
     const lastReturn = content.lastIndexOf('return (');
     if (lastReturn !== -1) {
       const sliced = content.slice(lastReturn);
       if (!sliced.includes('ItemInfoDisplay')) {
         content = content.replace(/\s*<\/div>\s*\)\;\s*\}/, "\n      <AnimatePresence>\n        {infoItem && <ItemInfoDisplay item={infoItem} onClose={() => setInfoItem(null)} />}\n      </AnimatePresence>\n    </div>\n  );\n}");
       }
     }
   }
}

fs.writeFileSync('src/screens/GameScreen.tsx', content);
