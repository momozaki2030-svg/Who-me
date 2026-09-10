import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Item } from '../types';
import { Button } from '../components/ui/Button';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { CheckCircle2, User, EyeOff, Eye, RotateCcw, PartyPopper, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  players: Player[];
  items: Item[];
  onFinish: (winnerId: number) => void;
  onQuit: () => void;
}

export function EliminationGameScreen({ players, items, onFinish, onQuit }: Props) {
  const [phase, setPhase] = useState<'p1_select' | 'pass_to_p2' | 'p2_select' | 'pass_to_p1_turn' | 'p1_turn' | 'pass_to_p2_turn' | 'p2_turn' | 'reveal'>('p1_select');
  
  const [p1Secret, setP1Secret] = useState<Item | null>(null);
  const [p2Secret, setP2Secret] = useState<Item | null>(null);
  
  const [p1Eliminated, setP1Eliminated] = useState<string[]>([]);
  const [p2Eliminated, setP2Eliminated] = useState<string[]>([]);
  const [revealWinnerId, setRevealWinnerId] = useState<number | null>(null);
  const [guessWasCorrect, setGuessWasCorrect] = useState<boolean>(true);
  const [isSecretVisible, setIsSecretVisible] = useState<boolean>(false);

  // When clicking an item during turn
  const handleItemClick = (itemId: string) => {
    if (phase === 'p1_turn') {
      setP1Eliminated(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    } else if (phase === 'p2_turn') {
      setP2Eliminated(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    }
  };

  const handleSecretSelection = (item: Item) => {
    if (phase === 'p1_select') {
      setP1Secret(item);
    } else if (phase === 'p2_select') {
      setP2Secret(item);
    }
  };

  const confirmSecretSelection = () => {
    if (phase === 'p1_select' && p1Secret) {
      setPhase('pass_to_p2');
    } else if (phase === 'p2_select' && p2Secret) {
      setPhase('pass_to_p1_turn');
    }
  };

  const endTurn = () => {
    if (phase === 'p1_turn') setPhase('pass_to_p2_turn');
    if (phase === 'p2_turn') setPhase('pass_to_p1_turn');
  };

  const passDevice = () => {
    if (phase === 'pass_to_p2') setPhase('p2_select');
    if (phase === 'pass_to_p1_turn') setPhase('p1_turn');
    if (phase === 'pass_to_p2_turn') setPhase('p2_turn');
  };

  
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


  const renderGrid = (mode: 'select' | 'play', activeSecret: Item | null, eliminated: string[]) => {
    
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
              ? `مبروك يا ${players[revealWinnerId!].name}!` 
              : `أخطأ ${players[revealWinnerId === 0 ? 1 : 0].name} في الاستنتاج!`}
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

  return (
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2 w-full p-1 sm:p-2">
        {items.map(item => {
          const isSelected = activeSecret?.id === item.id;
          const isEliminated = eliminated.includes(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => mode === 'select' ? handleSecretSelection(item) : handleItemClick(item.id)}
              className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-200
                ${mode === 'select' && isSelected ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-divider'}
                ${mode === 'play' && isEliminated ? 'opacity-30 grayscale scale-95 border-transparent' : 'bg-surface'}
              `}
            >
              <div className="absolute inset-0 bg-surface">
                {item.image ? (
                  <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-surface-active p-1 text-center">
                    <span className="text-2xl mb-1">؟</span>
                  </div>
                )}
              </div>
              
              {/* Gradient overlay for text */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-0.5 pt-3 sm:p-1 sm:pt-4 flex flex-col justify-end">
                <span className="text-white text-[9px] sm:text-xs font-bold leading-tight text-center drop-shadow-md">
                  {item.name}
                </span>
              </div>

              {mode === 'select' && isSelected && (
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-emerald-500 rounded-full p-0.5 shadow">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderPassScreen = (nextPlayerName: string) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <EyeOff className="w-24 h-24 text-indigo-500 mb-6" />
      <h2 className="text-3xl font-black text-content mb-2">مرر الجهاز</h2>
      <p className="text-xl text-content-muted font-bold mb-8">إلى {nextPlayerName}</p>
      <Button size="xl" onClick={passDevice} className="w-full max-w-xs shadow-xl shadow-indigo-200">
        أنا {nextPlayerName}، جاهز!
      </Button>
    </motion.div>
  );

  const renderSelectScreen = (player: Player) => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col h-screen"
    >
      <div className="p-4 bg-surface border-b border-divider flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-content flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-500" />
          دور {player.name}
        </h2>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">اختر شخصيتك</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderGrid('select', player.id === 0 ? p1Secret : p2Secret, [])}
      </div>

      <div className="p-4 bg-surface border-t border-divider shrink-0">
        <Button 
          fullWidth 
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={!(player.id === 0 ? p1Secret : p2Secret)}
          onClick={confirmSecretSelection}
        >
          تأكيد الاختيار
        </Button>
      </div>
    </motion.div>
  );

  const renderPlayScreen = (player: Player, opponent: Player, eliminated: string[], mySecret: Item | null) => {
    const leftCount = items.length - eliminated.length;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col h-screen"
      >
        <div className="p-4 bg-surface border-b border-divider flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-content">دور {player.name}</h2>
            <p className="text-xs font-bold text-content-muted">اسأل {opponent.name} سؤال (نعم/لا)</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setIsSecretVisible(true)} className="gap-2">
              <Eye className="w-4 h-4" /> عنصري السري
            </Button>
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-600">{leftCount}</div>
              <div className="text-[9px] font-bold text-content-muted">متبقي</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderGrid('play', null, eliminated)}
        </div>

        <div className="p-4 bg-surface border-t border-divider shrink-0 flex gap-3">
          {leftCount === 1 ? (
            <Button fullWidth size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" onClick={handleFinalGuess}>
              لقد عرفته! (فوز)
            </Button>
          ) : (
            <>
              <Button variant="outline" className="flex-1 text-rose-500 border-rose-200 hover:bg-rose-50" onClick={onQuit}>
                انسحاب
              </Button>
              <Button className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" onClick={endTurn}>
                إنهاء دوري
              </Button>
            </>
          )}
        </div>

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
      )}
      </motion.div>
    );
  };

  return (
    <div className="w-full h-screen bg-base overflow-hidden" dir="rtl">
      <AnimatePresence mode="wait">
        {phase === 'p1_select' && <div key="p1_select">{renderSelectScreen(players[0])}</div>}
        {phase === 'pass_to_p2' && <div key="pass_to_p2">{renderPassScreen(players[1].name)}</div>}
        {phase === 'p2_select' && <div key="p2_select">{renderSelectScreen(players[1])}</div>}
        {phase === 'pass_to_p1_turn' && <div key="pass_to_p1_turn">{renderPassScreen(players[0].name)}</div>}
        {phase === 'p1_turn' && <div key="p1_turn">{renderPlayScreen(players[0], players[1], p1Eliminated, p1Secret)}</div>}
        {phase === 'pass_to_p2_turn' && <div key="pass_to_p2_turn">{renderPassScreen(players[1].name)}</div>}
        {phase === 'p2_turn' && <div key="p2_turn">{renderPlayScreen(players[1], players[0], p2Eliminated, p2Secret)}</div>}
        {phase === 'reveal' && renderRevealScreen()}
      </AnimatePresence>
    </div>
  );
}
