const fs = require('fs');

let content = fs.readFileSync('src/screens/EliminationGameScreen.tsx', 'utf-8');

// Modify the check overlay so it doesn't take up the whole button on mobile
content = content.replace(
  /<div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5">/g,
  '<div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-emerald-500 rounded-full p-0.5 shadow">'
);
content = content.replace(
  /<CheckCircle2 className="w-4 h-4 text-white" \/>/g,
  '<CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />'
);

// We need to check if we can make it even better. Grid cols 5 is good for mobile, but 6 for tablet.
// Right now we have `grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2`. This means 30 items will take 6 rows on mobile, and 5 rows on tablet/desktop. This is perfect and eliminates scrolling in most modern phones.

fs.writeFileSync('src/screens/EliminationGameScreen.tsx', content, 'utf-8');
console.log("Updated EliminationGameScreen UI");
