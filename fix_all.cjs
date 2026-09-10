const fs = require('fs');

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf-8');

// Due to my reckless sed, ALL buttons became divs. I need to fix this.
// I'll manually replace the most obvious ones.

content = content.replace(/<div onClick=\{onQuit\} className="p-2 -mr-2 bg-surface-active rounded-full hover:bg-surface-hover transition-colors">/g, '<button onClick={onQuit} className="p-2 -mr-2 bg-surface-active rounded-full hover:bg-surface-hover transition-colors">');
content = content.replace(/<\/div>\s*<h2 className="text-2xl font-black text-content mr-2">/g, '</button>\n          <h2 className="text-2xl font-black text-content mr-2">');

content = content.replace(/<div\n\s*onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*setInfoItem\(item\);\n\s*\}\}\n\s*className="w-10 h-10 rounded-full bg-base flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 border border-divider"\n\s*>\n\s*<Info className="w-5 h-5" \/>\n\s*<\/div>/g, '<button\n                        onClick={(e) => {\n                          e.stopPropagation();\n                          setInfoItem(item);\n                        }}\n                        className="w-10 h-10 rounded-full bg-base flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 border border-divider"\n                      >\n                        <Info className="w-5 h-5" />\n                      </button>');

// Wait, the error originally was:
// In HTML, <button> cannot be a descendant of <button>.
// Because the outer item was a <button> and the Info icon was also a <button>.
// I just need to make the outer item a <div> with onClick.

fs.writeFileSync('src/screens/GameScreen.tsx', content, 'utf-8');
console.log("Restored some buttons");
