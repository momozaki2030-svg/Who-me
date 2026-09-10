const fs = require('fs');
let content = fs.readFileSync('src/screens/EliminationGameScreen.tsx', 'utf-8');

const modalHtml = `
      {isSecretVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setIsSecretVisible(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface p-6 rounded-2xl w-full max-w-sm flex flex-col items-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-content">العنصر الذي اخترته</h3>
            <div className="w-48 aspect-[4/5] rounded-xl overflow-hidden border-2 border-indigo-500 mb-4 bg-surface-hover shadow-inner">
              <ImageWithFallback src={mySecret?.image || ''} fallbackSrc={mySecret?.fallbackImage} alt={mySecret?.name || ''} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xl font-bold mb-6 text-content">{mySecret?.name}</h4>
            <Button onClick={() => setIsSecretVisible(false)} fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white">إغلاق</Button>
          </motion.div>
        </div>
      )}`;

content = content.replace(
  "        </div>\n      </motion.div>\n    );\n  };\n\n  return (",
  "        </div>\n" + modalHtml + "\n      </motion.div>\n    );\n  };\n\n  return ("
);

fs.writeFileSync('src/screens/EliminationGameScreen.tsx', content, 'utf-8');
