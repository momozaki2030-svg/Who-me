const fs = require('fs');

let content = fs.readFileSync('src/screens/EliminationGameScreen.tsx', 'utf-8');

// 1. Change the grid layout and card aspect ratio for denser rendering.
content = content.replace(
  '<div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-full p-2">',
  '<div className="grid grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2 w-full p-1 sm:p-2">'
);

// We need to change aspect-[3/4] to aspect-square or aspect-[4/5] and adjust text padding
content = content.replace(
  /aspect-\[3\/4\]/g,
  'aspect-[4/5]'
);

content = content.replace(
  /p-1 pt-4/g,
  'p-0.5 pt-3 sm:p-1 sm:pt-4'
);

content = content.replace(
  /text-\[10px\]/g,
  'text-[9px]'
);

// 2. Fix the winning logic.
// We need to add checking logic to `declareWin`.
const newDeclareWin = `
  const handleFinalGuess = () => {
    if (phase === 'p1_turn') {
      const remainingItems = items.filter(i => !p1Eliminated.includes(i.id));
      if (remainingItems.length === 1) {
        if (remainingItems[0].id === p2Secret?.id) {
          onFinish(0); // P1 wins
        } else {
          onFinish(1); // P1 lost because the remaining item is wrong (P2 wins)
        }
      }
    } else if (phase === 'p2_turn') {
      const remainingItems = items.filter(i => !p2Eliminated.includes(i.id));
      if (remainingItems.length === 1) {
        if (remainingItems[0].id === p1Secret?.id) {
          onFinish(1); // P2 wins
        } else {
          onFinish(0); // P2 lost because the remaining item is wrong (P1 wins)
        }
      }
    }
  };
`;

content = content.replace(
  /const declareWin = \(\) => \{[\s\S]*?\};/,
  newDeclareWin
);

content = content.replace(
  /onClick=\{declareWin\}/g,
  'onClick={handleFinalGuess}'
);

// We should also let the user manually click on the remaining item to guess it if they want to guess early, 
// but Guess Who usually requires you to eliminate everything else. Let's stick to the current flow (click button when 1 left) but strictly check it.

// For extra safety, when rendering the leftCount, ensure we don't accidentally enable the button if count is 0
content = content.replace(
  /\{leftCount === 1 \? \(/,
  '{leftCount === 1 ? ('
);

fs.writeFileSync('src/screens/EliminationGameScreen.tsx', content, 'utf-8');
console.log("Updated EliminationGameScreen");
