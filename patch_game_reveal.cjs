const fs = require('fs');

let content = fs.readFileSync('src/screens/EliminationGameScreen.tsx', 'utf-8');

if (!content.includes('canvas-confetti')) {
  content = content.replace(
    "import { CheckCircle2, User, EyeOff, RotateCcw } from 'lucide-react';",
    "import { CheckCircle2, User, EyeOff, RotateCcw, PartyPopper, AlertTriangle } from 'lucide-react';\nimport confetti from 'canvas-confetti';"
  );
}

// 1. Add new phase to state
content = content.replace(
  "<'p1_select' | 'pass_to_p2' | 'p2_select' | 'pass_to_p1_turn' | 'p1_turn' | 'pass_to_p2_turn' | 'p2_turn'>",
  "<'p1_select' | 'pass_to_p2' | 'p2_select' | 'pass_to_p1_turn' | 'p1_turn' | 'pass_to_p2_turn' | 'p2_turn' | 'reveal'>"
);

// 2. Add state for reveal details
content = content.replace(
  "const [p2Eliminated, setP2Eliminated] = useState<string[]>([]);",
  "const [p2Eliminated, setP2Eliminated] = useState<string[]>([]);\n  const [revealWinnerId, setRevealWinnerId] = useState<number | null>(null);\n  const [guessWasCorrect, setGuessWasCorrect] = useState<boolean>(true);"
);

// 3. Modify handleFinalGuess
const newDeclareWin = `
  const handleFinalGuess = () => {
    if (phase === 'p1_turn') {
      const remainingItems = items.filter(i => !p1Eliminated.includes(i.id));
      if (remainingItems.length === 1) {
        if (remainingItems[0].id === p2Secret?.id) {
          setRevealWinnerId(0);
          setGuessWasCorrect(true);
        } else {
          setRevealWinnerId(1);
          setGuessWasCorrect(false);
        }
        setPhase('reveal');
      }
    } else if (phase === 'p2_turn') {
      const remainingItems = items.filter(i => !p2Eliminated.includes(i.id));
      if (remainingItems.length === 1) {
        if (remainingItems[0].id === p1Secret?.id) {
          setRevealWinnerId(1);
          setGuessWasCorrect(true);
        } else {
          setRevealWinnerId(0);
          setGuessWasCorrect(false);
        }
        setPhase('reveal');
      }
    }
  };
`;
content = content.replace(/const handleFinalGuess = \(\) => \{[\s\S]*?\}\s*\}\s*\};\s*\}\s*\};/, newDeclareWin);


// 4. Add renderRevealScreen
const revealScreen = `
  const renderRevealScreen = () => {
    // When this mounts, we trigger confetti if guess was correct
    return (
      <motion.div 
        key="reveal"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex flex-col h-screen p-6 items-center justify-center bg-slate-900"
        onAnimationComplete={() => {
          if (guessWasCorrect) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#3b82f6', '#f59e0b']
            });
          }
        }}
      >
        <motion.div 
          initial={!guessWasCorrect ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          {guessWasCorrect ? (
            <PartyPopper className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
          ) : (
            <AlertTriangle className="w-20 h-20 text-rose-500 mx-auto mb-4" />
          )}
          <h2 className="text-4xl font-black text-white mb-2">
            {guessWasCorrect ? 'تخمين ذكي وناجح!' : 'تخمين خاطئ!'}
          </h2>
          <p className="text-xl text-slate-300">
            {guessWasCorrect 
              ? \`مبروك يا \${players[revealWinnerId!].name}!\` 
              : \`أخطأ \${players[revealWinnerId === 0 ? 1 : 0].name} في الاستنتاج!\`}
          </p>
        </motion.div>

        <div className="flex gap-4 w-full max-w-lg mb-12">
          {/* Player 1 Card */}
          <motion.div 
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            className="flex-1 flex flex-col items-center"
          >
            <p className="text-slate-300 font-bold mb-3">{players[0].name}</p>
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border-4 border-indigo-500 bg-slate-800 shadow-2xl">
              <ImageWithFallback src={p1Secret?.image || ''} fallbackSrc={p1Secret?.fallbackImage} alt={p1Secret?.name || ''} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-white font-bold text-lg mt-3 text-center">{p1Secret?.name}</h3>
          </motion.div>

          {/* Player 2 Card */}
          <motion.div 
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            className="flex-1 flex flex-col items-center"
          >
            <p className="text-slate-300 font-bold mb-3">{players[1].name}</p>
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border-4 border-rose-500 bg-slate-800 shadow-2xl">
              <ImageWithFallback src={p2Secret?.image || ''} fallbackSrc={p2Secret?.fallbackImage} alt={p2Secret?.name || ''} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-white font-bold text-lg mt-3 text-center">{p2Secret?.name}</h3>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
          <Button size="xl" className="w-64 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => onFinish(revealWinnerId!)}>
            إنهاء اللعبة
          </Button>
        </motion.div>
      </motion.div>
    );
  };
`;

content = content.replace("return (", revealScreen + "\n  return (");

// 5. Add to render cases
content = content.replace(
  "{phase === 'p2_turn' && <div key=\"p2_turn\">{renderPlayScreen(players[1], players[0], p2Eliminated)}</div>}",
  "{phase === 'p2_turn' && <div key=\"p2_turn\">{renderPlayScreen(players[1], players[0], p2Eliminated)}</div>}\n        {phase === 'reveal' && renderRevealScreen()}"
);

fs.writeFileSync('src/screens/EliminationGameScreen.tsx', content, 'utf-8');
console.log("Patched Dramatic Reveal!");
