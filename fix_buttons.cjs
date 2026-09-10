const fs = require('fs');

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf-8');

// Revert everything back to <button> first
content = content.replace(/<div\n(\s*key=\{item.id\}\n\s*onClick=\{\(\) => handleGuess\(item\)\}\n\s*className="w-full bg-surface border-2 border-divider hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right)/g, '<button\n$1');

// For the inner buttons, they need to be <div> if the outer is <button>, OR outer is <div> and inner is <button>
// The error is: In HTML, <button> cannot be a descendant of <button>.
// Let's make the outer container a <div> with `role="button"` and `tabIndex={0}`, or just an interactive <div>.

content = content.replace(/<div\n(\s*key=\{item.id\}\n\s*onClick=\{\(\) => handleGuess\(item\)\}\n\s*className="w-full bg-surface border-2 border-divider hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right(?: mb-3)? shadow-sm hover:shadow")/g, '<div\n$1 role="button" tabIndex={0}');

// Let's just fix it by replacing the outer <button> (which is now a <div> from my previous bad sed) to a <div>, and the inner <div> (which was a <button> for info) back to <button>.

fs.writeFileSync('src/screens/GameScreen.tsx', content, 'utf-8');
console.log("Fixed!");
