import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Trophy, Gamepad2, Info, Settings, Users, Book } from 'lucide-react';
import { GameState } from '../types';

interface Props {
  key?: string | number;
  onNavigate: (state: GameState['status'], mode?: 'normal' | 'tournament') => void;
}

export function HomeScreen({ onNavigate }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-12"
    >
      <div className="space-y-4">
        <motion.div 
          initial={{ scale: 0.8, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-32 h-32 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-7xl shadow-xl shadow-indigo-200"
        >
          ؟
        </motion.div>
        <h1 className="text-5xl font-extrabold text-content tracking-tight">مين أنا؟</h1>
        <p className="text-xl text-content-muted font-semibold">لعبة التخمين لشخصين</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Button size="lg" fullWidth onClick={() => onNavigate('setup', 'normal')}>
          <Gamepad2 className="w-6 h-6 ml-3" />
          لعبة عادية
        </Button>
        
        <Button size="lg" variant="secondary" fullWidth onClick={() => onNavigate('setup', 'tournament')}>
          <Trophy className="w-6 h-6 ml-3" />
          بطولة
        </Button>

        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg" 
          fullWidth 
          onClick={() => onNavigate('setup_elimination')}
        >
          <Users className="w-6 h-6 ml-3" />
          طور التصفية (خمن من؟)
        </Button>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" fullWidth onClick={() => onNavigate('how_to_play')}>
            <Info className="w-5 h-5 ml-2" />
            كيف تلعب؟
          </Button>

          <Button variant="outline" fullWidth onClick={() => onNavigate('encyclopedia')}>
            <Book className="w-5 h-5 ml-2" />
            الموسوعة
          </Button>
          <Button variant="outline" fullWidth onClick={() => onNavigate('settings')}>
            <Settings className="w-5 h-5 ml-2" />
            الإعدادات
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
