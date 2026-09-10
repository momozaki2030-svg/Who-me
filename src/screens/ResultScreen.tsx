import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import { Player, GameSettings } from '../types';

interface Props {
  key?: string | number;
  players: Player[];
  settings: GameSettings;
  onNewGame: () => void;
  onHome: () => void;
}

export function ResultScreen({ players, settings, onNewGame, onHome }: Props) {
  const isTournament = settings.mode === 'tournament';
  
  // Find winner
  const winner = players[0].score > players[1].score ? players[0] : 
                 players[1].score > players[0].score ? players[1] : null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="min-h-screen p-6 flex flex-col items-center justify-center max-w-lg mx-auto text-center overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
      >
        <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-lg" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-content-muted mb-2">
        {isTournament ? 'بطل البطولة' : 'نهاية اللعبة'}
      </h2>
      
      {winner ? (
        <h1 className="text-6xl font-black text-indigo-600 mb-12">{winner.name}</h1>
      ) : (
        <h1 className="text-6xl font-black text-content-muted mb-12">تعادل!</h1>
      )}

      <Card className="w-full p-6 mb-12 shadow-xl shadow-slate-200">
        <h3 className="text-xl font-bold text-content mb-6 border-b pb-4">النتيجة النهائية</h3>
        <div className="flex justify-between items-center px-4">
          <div className="text-center">
            <p className="text-lg font-bold text-content-muted">{players[0].name}</p>
            <p className="text-5xl font-black text-indigo-600 mt-2">{players[0].score}</p>
          </div>
          <div className="text-3xl font-black text-slate-300">-</div>
          <div className="text-center">
            <p className="text-lg font-bold text-content-muted">{players[1].name}</p>
            <p className="text-5xl font-black text-indigo-600 mt-2">{players[1].score}</p>
          </div>
        </div>
      </Card>

      <div className="w-full space-y-4">
        <Button size="lg" fullWidth onClick={onNewGame}>
          <RefreshCw className="w-6 h-6 ml-2" />
          لعبة جديدة
        </Button>
        <Button size="lg" variant="outline" fullWidth onClick={onHome}>
          <Home className="w-6 h-6 ml-2" />
          الرئيسية
        </Button>
      </div>
    </motion.div>
  );
}
