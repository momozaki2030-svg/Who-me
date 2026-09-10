const fs = require('fs');
let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf-8');

// The outer item was initially a <button>. I made it a <div> but didn't close it properly.
content = content.replace(/<button\n(\s*key=\{item.id\}\n\s*onClick=\{\(\) => handleGuess\(item\)\}\n\s*className="w-full bg-surface border-2 border-divider hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right(?: mb-3)? shadow-sm hover:shadow")/g, '<div\n$1 role="button" tabIndex={0}');

content = content.replace(/<\/button>\n\s*<\/button>/g, '</button>\n                    </div>');
content = content.replace(/<\/button>\n\s*<\/div>/g, '</button>\n                          </div>');

fs.writeFileSync('src/screens/GameScreen.tsx', content, 'utf-8');
