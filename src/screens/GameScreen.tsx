import { useItemInfo } from '../hooks/useItemInfo';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Item, GameSettings } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Search, Plus, ShieldAlert, CheckCircle2, XCircle, User, Mic, ArrowRight , Info, Loader2, Bot } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { items as allItems } from '../data/items';
import { categories } from '../data/categories';

type TurnPhase = 
  | 'p1_intro' 
  | 'p1_reveal' 
  | 'p2_intro' 
  | 'p2_reveal' 
  | 'question_intro' 
  | 'question_turn' 
  | 'guess' 
  | 'round_end';

interface Props {
  key?: string | number;
  player1: Player;
  player2: Player;
  item1: Item; // Player 1's secret (Player 2 tries to guess this)
  item2: Item; // Player 2's secret (Player 1 tries to guess this)
  settings: GameSettings;
  onRoundComplete: (winnerId: number | null) => void;
  onQuit?: () => void;
}

const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';
const getSubcategoryName = (catId: string, subId: string) => {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return '';
  const sub = cat.subcategories?.find(s => s.id === subId);
  return sub ? sub.name : '';
};


const ItemInfoDisplay = ({ item, onClose }: { item: Item, onClose: () => void }) => {
  const { info, loading } = useItemInfo(item.name);
  
  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
      >
        <div onClick={onClose} className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-surface-hover text-content-muted hover:bg-surface-active rounded-full transition-colors z-10">
          ✕
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-base border-4 border-white shadow-lg mb-4">
            {item.image ? (
              <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-2xl font-bold">؟</div>
            )}
          </div>
          <h3 className="text-xl font-bold text-content mb-1">{item.name}</h3>
          <p className="text-sm text-content-muted mb-6">{getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}</p>
          
          <div className="w-full space-y-2 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2 text-indigo-500" />
                <span className="text-sm text-indigo-600 font-bold animate-pulse">يتم ترتيب المعلومات المخصصة...</span>
              </div>
            ) : (
              info.map((fact, i) => (
                <div key={i} className="bg-indigo-50/50 rounded-lg p-2.5 border border-indigo-100/50 flex flex-row items-center justify-between text-right w-full hover:bg-indigo-50 transition-colors">
                  <span className="text-xs font-bold text-indigo-600 ml-2 w-1/3 shrink-0">{fact.label}:</span>
                  <span className="text-sm text-content font-semibold flex-1 leading-tight">{fact.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      
    </div>
  );

};


export function GameScreen({ player1, player2, item1, item2, settings, onRoundComplete, onQuit }: Props) {
  const [phase, setPhase] = useState<TurnPhase>('p1_intro');
  const [activePlayerId, setActivePlayerId] = useState<0 | 1>(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [infoItem, setInfoItem] = useState<Item | null>(null);
  
  const [showCheatSheet, setShowCheatSheet] = useState(false);

const [searchQuery, setSearchQuery] = useState('');

  

  
  // 2 guesses per player
  const [guessesLeft, setGuessesLeft] = useState({ 0: 2, 1: 2 });
  
  // For round end
  const [roundWinnerId, setRoundWinnerId] = useState<number | null>(null);

  // Filter items for the search/guess view
  const validItems = useMemo(() => {
    let filtered = allItems;
    // We only filter by category if we are in normal mode or single category tournament
    if (settings.categoryId && settings.categoryId !== 'random') {
      filtered = filtered.filter(i => i.categoryId === settings.categoryId);
      if (settings.subcategoryId && settings.subcategoryId !== 'all') {
        filtered = filtered.filter(i => i.subcategoryId === settings.subcategoryId);
      }
    } else if (settings.selectedCategories && settings.selectedCategories.length > 0) {
      filtered = filtered.filter(i => settings.selectedCategories!.includes(i.categoryId));
    }
    return filtered;
  }, [settings]);
  
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return validItems;
    return validItems.filter(i => 
      i.name.includes(searchQuery) || i.keywords.some(k => k.includes(searchQuery))
    );
  }, [searchQuery, validItems]);

  const activePlayer = activePlayerId === 0 ? player1 : player2;
  const targetItem = activePlayerId === 0 ? item2 : item1;

  const handleGuess = (item: Item) => {
    if (item.id === targetItem.id) {
      // Correct! Player wins instantly.
      setRoundWinnerId(activePlayerId);
      setPhase('round_end');
    } else {
      // Wrong
      setGuessesLeft(prev => ({
        ...prev,
        [activePlayerId]: prev[activePlayerId] - 1
      }));
      setSearchQuery('');
      
      if (guessesLeft[activePlayerId] - 1 <= 0) {
        // Run out of guesses for this player
        const otherPlayerId = activePlayerId === 0 ? 1 : 0;
        if (guessesLeft[otherPlayerId] <= 0) {
          // Both out of guesses -> draw
          setRoundWinnerId(null);
          setPhase('round_end');
        } else {
          // Switch turn
          setActivePlayerId(otherPlayerId);
          setPhase('question_turn');
        }
      } else {
        // Still has guesses, just return to turn
        setPhase('question_turn');
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 max-w-lg mx-auto text-center overflow-x-hidden relative">
      
      {/* Quit/Back Button */}
      {onQuit && (
        <div
          onClick={onQuit}
          className="absolute top-4 right-4 p-3 bg-surface/50 backdrop-blur-md hover:bg-surface/80 rounded-full shadow-sm z-50 transition-all active:scale-95"
          title="العودة للقائمة الرئيسية"
        >
          <ArrowRight className="w-6 h-6 text-content" />
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* PLAYER 1 INTRO */}
        {phase === 'p1_intro' && (
          <motion.div 
            key="p1_intro"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full"
          >
            <div className="bg-indigo-100 text-indigo-700 px-6 py-2 rounded-full font-bold mb-8 text-lg">
              دور اللاعب الأول
            </div>
            <User className="w-32 h-32 text-indigo-300 mb-8" />
            <h2 className="text-3xl font-extrabold text-content mb-4">أعطِ الهاتف إلى</h2>
            <p className="text-2xl font-black text-indigo-600 mb-12">{player1.name}</p>
            
            <Button size="lg" fullWidth onClick={() => setPhase('p1_reveal')}>
              أنا {player1.name}، اعرض سري
            </Button>
          </motion.div>
        )}

        {/* PLAYER 1 REVEAL */}
        {phase === 'p1_reveal' && (
          <motion.div 
            key="p1_reveal"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full"
          >
            <h2 className="text-xl font-bold text-content-muted mb-6 leading-relaxed">
              هذا هو سرك. لا تدع <span className="text-rose-600 font-black">{player2.name}</span> يراه.
            </h2>
            
            <Card className="w-full max-w-xs mb-8 p-4 shadow-xl shadow-indigo-100">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-hover mb-4 shadow-inner relative">
                {item1.image ? (
                  <ImageWithFallback src={item1.image} fallbackSrc={item1.fallbackImage} alt={item1.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-active text-slate-400">بدون صورة</div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                  {getCategoryName(item1.categoryId)}
                </div>
              </div>
              <h3 className="text-4xl font-black text-content">{item1.name}</h3>
            </Card>

            <Button size="lg" variant="danger" fullWidth onClick={() => setPhase('p2_intro')}>
              حفظت سري
            </Button>
          </motion.div>
        )}

        {/* PLAYER 2 INTRO */}
        {phase === 'p2_intro' && (
          <motion.div 
            key="p2_intro"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full"
          >
            <div className="bg-rose-100 text-rose-700 px-6 py-2 rounded-full font-bold mb-8 text-lg">
              دور اللاعب الثاني
            </div>
            <User className="w-32 h-32 text-rose-300 mb-8" />
            <h2 className="text-3xl font-extrabold text-content mb-4">أعطِ الهاتف إلى</h2>
            <p className="text-2xl font-black text-rose-600 mb-12">{player2.name}</p>
            
            <Button size="lg" fullWidth onClick={() => setPhase('p2_reveal')}>
              أنا {player2.name}، اعرض سري
            </Button>
          </motion.div>
        )}

        {/* PLAYER 2 REVEAL */}
        {phase === 'p2_reveal' && (
          <motion.div 
            key="p2_reveal"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full"
          >
            <h2 className="text-xl font-bold text-content-muted mb-6 leading-relaxed">
              هذا هو سرك. لا تدع <span className="text-indigo-600 font-black">{player1.name}</span> يراه.
            </h2>
            
            <Card className="w-full max-w-xs mb-8 p-4 shadow-xl shadow-rose-100">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-hover mb-4 shadow-inner relative">
                {item2.image ? (
                  <ImageWithFallback src={item2.image} fallbackSrc={item2.fallbackImage} alt={item2.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-active text-slate-400">بدون صورة</div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                  {getCategoryName(item2.categoryId)}
                </div>
              </div>
              <h3 className="text-4xl font-black text-content">{item2.name}</h3>
            </Card>

            <Button size="lg" variant="danger" fullWidth onClick={() => setPhase('question_intro')}>
              حفظت سري
            </Button>
          </motion.div>
        )}

        {/* QUESTION INTRO */}
        {phase === 'question_intro' && (
          <motion.div 
            key="question_intro"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full"
          >
            <Mic className="w-32 h-32 text-indigo-400 mb-8" />
            <h2 className="text-4xl font-black text-content mb-4">وقت الأسئلة!</h2>
            <p className="text-xl text-content-muted mb-2 leading-relaxed">
              الآن يعرف كل لاعب سره.
            </p>
            <p className="text-xl text-content-muted mb-12 leading-relaxed">
              اسأل خصمك وحاول معرفة سره الذي يخفيه عنك.
            </p>
            
            <Button size="lg" fullWidth onClick={() => { setActivePlayerId(0); setPhase('question_turn'); }}>
              ابدأ الأسئلة
            </Button>
          </motion.div>
        )}

        {/* QUESTION TURN */}
        {phase === 'question_turn' && (
          <motion.div 
            key="question_turn"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full min-h-[60vh]"
          >
            <div className="w-full flex justify-between items-center mb-12">
              <div className="bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold">
                المحاولات: {guessesLeft[activePlayerId]}
              </div>
              <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold">
                الأسئلة: {questionCount}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center mb-12">
              <h2 className="text-2xl font-bold text-content-muted mb-2">دور اللاعب:</h2>
              <h2 className={`text-4xl font-black mb-6 ${activePlayerId === 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                {activePlayer.name}
              </h2>
              <p className="text-xl text-content-muted text-center leading-relaxed max-w-sm">
                اسأل سؤالاً لخصمك (إجابته نعم أو لا)
              </p>
            </div>

            <div className="w-full space-y-4">
              
              
              <Button 
                size="lg" 
                variant="outline" 
                fullWidth 
                onClick={() => setShowCheatSheet(true)}
                className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 mb-2"
              >
                <Info className="w-6 h-6 ml-2" />
                ورقة الغش (معلومات للمُجيب)
              </Button>
<Button size="lg" variant="outline" fullWidth onClick={() => setQuestionCount(prev => prev + 1)}>
                <Plus className="w-6 h-6 ml-2" />
                سألت سؤالاً
              </Button>
              {guessesLeft[activePlayerId] > 0 && (
                <Button size="lg" fullWidth onClick={() => setPhase('guess')}>
                  أريد التخمين
                </Button>
              )}
              <Button size="lg" variant="secondary" fullWidth onClick={() => setActivePlayerId(prev => prev === 0 ? 1 : 0)}>
                إنهاء دوري
              </Button>
            </div>
          </motion.div>
        )}

        {/* GUESS PHASE */}
        {phase === 'guess' && (
          <motion.div 
            key="guess"
            initial={{ opacity: 0, y: '100%' }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-surface z-50 flex flex-col p-6"
          >
            <div className="flex items-center mb-6">
              <div onClick={() => setPhase('question_turn')} className="p-2 -mr-2 bg-surface-hover rounded-full">
                <XCircle className="w-8 h-8 text-content-muted" />
              </div>
              <h2 className="text-2xl font-bold mr-4 text-content">ما تخمينك يا {activePlayer.name}؟</h2>
            </div>

            <div className="relative mb-6 shrink-0">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                type="text" 
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الإجابة..."
                className="w-full bg-surface-hover border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pr-12 pl-4 font-bold text-lg outline-none transition-colors"
              />
            </div>

            
            <div className="flex-1 overflow-y-auto space-y-4 pb-8 pr-2">
              {(() => {
                if (searchResults.length === 0) {
                  return (
                    <div className="text-center text-content-muted mt-10 font-bold">
                      لا توجد نتائج مطابقة
                    </div>
                  );
                }

                // If searching, show flat list
                if (searchQuery.trim()) {
                  return searchResults.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleGuess(item)}
                      className="w-full bg-surface border-2 border-divider hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right mb-3 shadow-sm hover:shadow" role="button" tabIndex={0}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-base shrink-0 relative p-1">
                        {item.image ? (
                          <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-lg" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-active">؟</div>
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-bold text-lg text-content">{item.name}</h3>
                        <p className="text-sm text-content-muted">{getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfoItem(item);
                        }}
                        className="w-10 h-10 rounded-full bg-base flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 border border-divider"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                          </div>
                  ));
                }

                // Group by subcategoryId
                const grouped = searchResults.reduce((acc, item) => {
                  const key = item.categoryId + '_' + item.subcategoryId;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(item);
                  return acc;
                }, {} as Record<string, typeof searchResults>);

                return (Object.entries(grouped) as [string, typeof searchResults][]).map(([key, items]) => {
                  const firstItem = items[0];
                  return (
                    <div key={key} className="mb-6">
                      <h4 className="text-sm font-bold text-indigo-500 mb-3 px-2 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 ml-2"></div>
                        {getCategoryName(firstItem.categoryId)} - {getSubcategoryName(firstItem.categoryId, firstItem.subcategoryId)}
                      </h4>
                      <div className="space-y-3">
                        {items.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleGuess(item)}
                            className="w-full bg-surface border-2 border-divider hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right shadow-sm hover:shadow" role="button" tabIndex={0}
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0 relative border border-divider p-1">
                              {item.image ? (
                                <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-lg" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-surface-active">؟</div>
                              )}
                            </div>
                            <div className="flex-1 text-right">
                              <h3 className="font-bold text-lg text-content">{item.name}</h3>
                            </div>
                            <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfoItem(item);
                        }}
                        className="w-10 h-10 rounded-full bg-base flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 border border-divider"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </motion.div>
        )}

        {/* ROUND END */}
        {phase === 'round_end' && (
          <motion.div 
            key="round_end"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full pb-8"
          >
            {roundWinnerId !== null ? (
              <>
                <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-4" />
                <h2 className="text-4xl font-black text-content mb-2">إجابة صحيحة!</h2>
                <p className="text-xl text-emerald-600 mb-8 font-bold">يفوز {roundWinnerId === 0 ? player1.name : player2.name} بالجولة</p>
              </>
            ) : (
              <>
                <XCircle className="w-24 h-24 text-slate-400 mb-4" />
                <h2 className="text-3xl font-black text-content mb-2">تعادل!</h2>
                <p className="text-xl text-content-muted mb-8 font-bold">نفدت المحاولات من كلا اللاعبين</p>
              </>
            )}

            <div className="w-full flex gap-4 mb-8">
              <div className="flex-1 flex flex-col items-center text-center">
                <p className="text-sm font-bold text-content-muted mb-2">{player1.name} كان لديه:</p>
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-hover mb-2 border-2 border-divider">
                  <ImageWithFallback src={item1.image} fallbackSrc={item1.fallbackImage} alt={item1.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-content">{item1.name}</h3>
              </div>
              <div className="flex-1 flex flex-col items-center text-center">
                <p className="text-sm font-bold text-content-muted mb-2">{player2.name} كان لديه:</p>
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-hover mb-2 border-2 border-divider">
                  <ImageWithFallback src={item2.image} fallbackSrc={item2.fallbackImage} alt={item2.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-content">{item2.name}</h3>
              </div>
            </div>

            <Button size="lg" fullWidth onClick={() => onRoundComplete(roundWinnerId)}>
              الجولة التالية
            </Button>
          </motion.div>
        )}

      
        
        {showCheatSheet && (
          <ItemInfoDisplay 
            item={activePlayerId === 0 ? item1 : item2} 
            onClose={() => setShowCheatSheet(false)} 
          />
        )}

        

      </AnimatePresence>
    </div>
  );
}
