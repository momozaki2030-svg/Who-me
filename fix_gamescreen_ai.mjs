import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

if (!content.includes('Bot')) {
  content = content.replace("from 'lucide-react';", ", Bot } from 'lucide-react';");
}

// 1. Add AI modal state
if (!content.includes('const [showAIModal, setShowAIModal] = useState(false);')) {
  const insertIndex = content.indexOf('const [searchQuery, setSearchQuery] = useState(\'\');');
  const aiState = `
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAI, setIsAskingAI] = useState(false);

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setIsAskingAI(true);
    setAiAnswer(null);
    
    const targetSecret = activePlayerId === 0 ? item2 : item1;
    
    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          secretItem: targetSecret
        })
      });
      
      const data = await res.json();
      if (data.error) {
        setAiAnswer('عذراً، ' + data.error);
      } else {
        setAiAnswer(data.answer);
      }
    } catch (e) {
      setAiAnswer('فشل الاتصال بالذكاء الاصطناعي.');
    } finally {
      setIsAskingAI(false);
    }
  };
`;
  content = content.slice(0, insertIndex) + aiState + content.slice(insertIndex);
}

// 2. Add "Ask AI" button in the question_turn phase
const askAIButton = `
              <Button 
                size="lg" 
                variant="outline" 
                fullWidth 
                onClick={() => setShowAIModal(true)}
                className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 mb-2"
              >
                <Bot className="w-6 h-6 ml-2" />
                الحكم الذكي (اسأل الذكاء الاصطناعي)
              </Button>
`;

const replaceTarget = `<Button size="lg" variant="outline" fullWidth onClick={() => setQuestionCount(prev => prev + 1)}>`;

if (!content.includes('الحكم الذكي (اسأل الذكاء الاصطناعي)')) {
  content = content.replace(replaceTarget, askAIButton + replaceTarget);
}

// 3. Add AI Modal JSX at the end of GameScreen, inside AnimatePresence
const aiModalJSX = `
        {showAIModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col"
            >
              <button onClick={() => setShowAIModal(false)} className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors z-10">
                ✕
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">الحكم الذكي</h3>
                  <p className="text-xs text-slate-500">سيجيبك بناءً على معلومات العنصر السري</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">ما هو السؤال الذي طرحه خصمك؟</label>
                <textarea
                  autoFocus
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="مثال: هل فاز بكأس العالم؟ هل لونها أحمر؟"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-3 text-right outline-none min-h-[100px] resize-none"
                />
              </div>

              {aiAnswer && (
                <div className="mb-4 p-4 rounded-xl bg-slate-800 text-white text-center font-bold text-lg border-2 border-emerald-500 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-1 bg-emerald-500"></div>
                  {aiAnswer}
                </div>
              )}

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleAskAI} 
                disabled={isAskingAI || !aiQuestion.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
              >
                {isAskingAI ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "اسأل الحكم"
                )}
              </Button>
            </motion.div>
          </div>
        )}
`;

if (!content.includes('الحكم الذكي</h3')) {
  // Let's replace the ending part
  content = content.replace("{showSecret && (", aiModalJSX + "\n        {showSecret && (");
}

fs.writeFileSync('src/screens/GameScreen.tsx', content);
