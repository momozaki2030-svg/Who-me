const fs = require('fs');

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf-8');

// I replaced all <button with <div and </button> with </div> which is BAD. Let's fix this properly.

content = content.replace(/<div\n(\s*key=\{item.id\}\n\s*onClick=\{\(\) => handleGuess\(item\)\}\n\s*className="w-full bg-surface border-2 border-divider hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right(?: mb-3)? shadow-sm hover:shadow")/g, '<div\n$1 role="button" tabIndex={0}');

// Let's change the outer wrapper back to a div, and make sure the info button is a button.

fs.writeFileSync('src/screens/GameScreen.tsx', content, 'utf-8');
console.log("Fixed outer wrapper");
