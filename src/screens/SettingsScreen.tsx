import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowRight, Settings as SettingsIcon } from 'lucide-react';
import { GameState } from '../types';
import { useTheme } from '../hooks/useTheme';

interface Props {
  key?: string | number;
  onBack: () => void;
}

export function SettingsScreen({ onBack }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      className="min-h-screen p-6 max-w-lg mx-auto"
    >
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -mr-2 bg-surface-active rounded-full hover:bg-slate-300 transition-colors">
          <ArrowRight className="w-6 h-6 text-content" />
        </button>
        <h2 className="text-2xl font-bold mr-4 text-content">الإعدادات</h2>
      </div>

      <div className="space-y-4">
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="font-bold text-lg text-content">الوضع الليلي</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <motion.div 
              className="w-6 h-6 bg-surface rounded-full shadow-sm"
              animate={{ x: theme === 'dark' ? -24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </Card>
  
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔊</span>
            <span className="font-bold text-lg text-content">الصوت</span>
          </div>
          <button 
            onClick={() => setSound(!sound)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${sound ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <motion.div 
              className="w-6 h-6 bg-surface rounded-full shadow-sm"
              animate={{ x: sound ? -24 : 0 }} // RTL adjustment: moving left when ON
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📳</span>
            <span className="font-bold text-lg text-content">الاهتزاز</span>
          </div>
          <button 
            onClick={() => setVibration(!vibration)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${vibration ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <motion.div 
              className="w-6 h-6 bg-surface rounded-full shadow-sm"
              animate={{ x: vibration ? -24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </Card>
      </div>
    </motion.div>
  );
}
