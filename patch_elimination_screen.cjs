const fs = require('fs');

let content = fs.readFileSync('src/screens/EliminationGameScreen.tsx', 'utf-8');

// Ensure Eye icon is imported
if (!content.includes('Eye,')) {
    content = content.replace("EyeOff", "EyeOff, Eye");
}

// Add state for modal
if (!content.includes('isSecretVisible')) {
    content = content.replace(
        "const [guessWasCorrect, setGuessWasCorrect] = useState<boolean>(true);",
        "const [guessWasCorrect, setGuessWasCorrect] = useState<boolean>(true);\n  const [isSecretVisible, setIsSecretVisible] = useState<boolean>(false);"
    );
}

// Pass mySecret to renderPlayScreen
content = content.replace(
    "const renderPlayScreen = (player: Player, opponent: Player, eliminated: string[]) => {",
    "const renderPlayScreen = (player: Player, opponent: Player, eliminated: string[], mySecret: Item | null) => {"
);

// Add button to header
const oldHeader = `<div className="text-center">
            <div className="text-2xl font-black text-indigo-600">{leftCount}</div>
            <div className="text-[9px] font-bold text-content-muted">متبقي</div>
          </div>`;
          
const newHeader = `<div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setIsSecretVisible(true)} className="gap-2">
              <Eye className="w-4 h-4" /> عنصري السري
            </Button>
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-600">{leftCount}</div>
              <div className="text-[9px] font-bold text-content-muted">متبقي</div>
            </div>
          </div>`;

content = content.replace(oldHeader, newHeader);

// Update calls to renderPlayScreen
content = content.replace(
    "{phase === 'p1_turn' && <div key=\"p1_turn\">{renderPlayScreen(players[0], players[1], p1Eliminated)}</div>}",
    "{phase === 'p1_turn' && <div key=\"p1_turn\">{renderPlayScreen(players[0], players[1], p1Eliminated, p1Secret)}</div>}"
);
content = content.replace(
    "{phase === 'p2_turn' && <div key=\"p2_turn\">{renderPlayScreen(players[1], players[0], p2Eliminated)}</div>}",
    "{phase === 'p2_turn' && <div key=\"p2_turn\">{renderPlayScreen(players[1], players[0], p2Eliminated, p2Secret)}</div>}"
);

// Add modal HTML at the end of the return statement
const modalHtml = `
      {isSecretVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setIsSecretVisible(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface p-6 rounded-2xl w-full max-w-sm flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-content">العنصر الذي اخترته</h3>
            <div className="w-48 aspect-[4/5] rounded-xl overflow-hidden border-2 border-indigo-500 mb-4 bg-surface-hover">
              <ImageWithFallback src={mySecret?.image || ''} fallbackSrc={mySecret?.fallbackImage} alt={mySecret?.name || ''} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xl font-bold mb-6 text-content">{mySecret?.name}</h4>
            <Button onClick={() => setIsSecretVisible(false)} fullWidth>إغلاق</Button>
          </motion.div>
        </div>
      )}`;

content = content.replace(
    "    </motion.div>\n  );\n\n  const renderRevealScreen",
    modalHtml + "\n    </motion.div>\n  );\n\n  const renderRevealScreen"
);

fs.writeFileSync('src/screens/EliminationGameScreen.tsx', content, 'utf-8');
console.log("Patched peek button");
