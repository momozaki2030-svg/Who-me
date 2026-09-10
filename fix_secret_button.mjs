import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

// 1. Ensure state variables exist in GameScreen
if (!content.includes('const [showSecret, setShowSecret] = useState(false);')) {
  const insertIndex = content.indexOf('const [searchQuery, setSearchQuery] = useState(\'\');');
  content = content.slice(0, insertIndex) + "const [showSecret, setShowSecret] = useState(false);\n  " + content.slice(insertIndex);
}

// 2. In question_turn, add the button to show the secret item
const originalQuestionTurnButtons = `<Button size="lg" variant="outline" fullWidth onClick={() => setQuestionCount(prev => prev + 1)}>
                <Plus className="w-6 h-6 ml-2" />
                سألت سؤالاً
              </Button>`;

const newQuestionTurnButtons = `<Button 
                size="lg" 
                variant="outline" 
                fullWidth 
                onPointerDown={() => setShowSecret(true)}
                onPointerUp={() => setShowSecret(false)}
                onPointerLeave={() => setShowSecret(false)}
                className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 mb-2"
              >
                <Info className="w-6 h-6 ml-2" />
                رؤية عنصري السري (اضغط مطولاً)
              </Button>
              <Button size="lg" variant="outline" fullWidth onClick={() => setQuestionCount(prev => prev + 1)}>
                <Plus className="w-6 h-6 ml-2" />
                سألت سؤالاً
              </Button>`;

if (!content.includes('رؤية عنصري السري')) {
  content = content.replace(originalQuestionTurnButtons, newQuestionTurnButtons);
}

// 3. Add the SecretItemOverlay at the bottom of question_turn phase
const currentSecretItemVar = `const currentSecretItem = activePlayerId === 0 ? item1 : item2;`;

const overlayCode = `
        {showSecret && (
          <SecretItemOverlay item={activePlayerId === 0 ? item1 : item2} />
        )}
`;

if (!content.includes('<SecretItemOverlay item={')) {
  // Let's add it right before AnimatePresence closing in GameScreen, or maybe just anywhere outside motion.div
  // Adding it near the end of the GameScreen component
  content = content.replace("</AnimatePresence>", overlayCode + "\n      </AnimatePresence>");
}

fs.writeFileSync('src/screens/GameScreen.tsx', content);
