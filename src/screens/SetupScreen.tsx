import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameSettings, GameMode, Difficulty } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowRight, User, Settings2, Trophy, Target, Sparkles, Filter, Grid, CheckCircle2 } from 'lucide-react';
import { categories } from '../data/categories';

interface Props {
  key?: string | number;
  mode: GameMode;
  onStart: (players: Player[], settings: GameSettings) => void;
  onBack: () => void;
}

export function SetupScreen({ mode, onStart, onBack }: Props) {
  const [player1Name, setPlayer1Name] = useState('اللاعب الأول');
  const [player2Name, setPlayer2Name] = useState('اللاعب الثاني');
  
  // Normal mode defaults
  const [normalRounds, setNormalRounds] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  
  // Category selections
  const [categoryId, setCategoryId] = useState<string>('random');
  const [subcategoryId, setSubcategoryId] = useState<string>('all');
  
  // Tournament defaults
  const [tournamentWins, setTournamentWins] = useState(3); // Best of 3 means 2 wins needed, but let's just use 2, 3, 4 target score directly. Wait, "أفضل من 3" means 2 wins. "أفضل من 5" means 3 wins. Let's make the selection visual but store the target score.
  const [tourneyCatMode, setTourneyCatMode] = useState<'single' | 'multiple'>('single');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleStart = () => {
    const players: Player[] = [
      { id: 0, name: player1Name.trim() || 'اللاعب الأول', score: 0 },
      { id: 1, name: player2Name.trim() || 'اللاعب الثاني', score: 0 }
    ];

    const settings: GameSettings = {
      mode,
      targetScore: mode === 'normal' ? normalRounds : tournamentWins,
      difficulty,
      categoryId: mode === 'normal' || tourneyCatMode === 'single' ? categoryId : undefined,
      subcategoryId: mode === 'normal' || tourneyCatMode === 'single' ? subcategoryId : undefined,
      tournamentCategoryMode: mode === 'tournament' ? tourneyCatMode : undefined,
      selectedCategories: mode === 'tournament' && tourneyCatMode === 'multiple' ? selectedCategories : undefined
    };

    // fallback for random
    if (settings.categoryId === 'random' && mode === 'tournament' && tourneyCatMode === 'multiple' && selectedCategories.length === 0) {
      settings.selectedCategories = categories.map(c => c.id);
    }

    onStart(players, settings);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectedCategoryObj = categories.find(c => c.id === categoryId);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="min-h-screen bg-base flex flex-col p-6 max-w-lg mx-auto"
    >
      <div className="flex items-center mb-8 pt-4">
        <button onClick={onBack} className="p-2 -mr-2 bg-surface-active hover:bg-slate-300 rounded-full transition-colors">
          <ArrowRight className="w-6 h-6 text-content" />
        </button>
        <h1 className="text-2xl font-black text-content mr-4">
          {mode === 'normal' ? 'لعبة سريعة' : 'نظام البطولة'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-32">
        {/* Players */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            اللاعبين
          </h2>
          <div className="space-y-3">
            <input 
              type="text" 
              value={player1Name} 
              onChange={e => setPlayer1Name(e.target.value)}
              placeholder="اسم اللاعب الأول"
              className="w-full bg-surface border-2 border-divider rounded-2xl p-4 font-bold focus:border-indigo-500 outline-none transition-colors"
            />
            <input 
              type="text" 
              value={player2Name} 
              onChange={e => setPlayer2Name(e.target.value)}
              placeholder="اسم اللاعب الثاني"
              className="w-full bg-surface border-2 border-divider rounded-2xl p-4 font-bold focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Game Rules */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-500" />
            نظام اللعب
          </h2>
          
          {mode === 'normal' ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map(r => (
                <button
                  key={r}
                  onClick={() => setNormalRounds(r)}
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${normalRounds === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-surface text-content-muted border-divider'}`}
                >
                  {r} {r === 1 ? 'جولة' : 'جولات'}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {[{label: 'أفضل من 3', wins: 2}, {label: 'أفضل من 5', wins: 3}, {label: 'أفضل من 7', wins: 4}].map(t => (
                <button
                  key={t.wins}
                  onClick={() => setTournamentWins(t.wins)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${tournamentWins === t.wins ? 'bg-amber-500 text-white border-amber-500' : 'bg-surface text-content-muted border-divider'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-500" />
            الفئة
          </h2>
          
          {mode === 'tournament' && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTourneyCatMode('single')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${tourneyCatMode === 'single' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-surface text-content-muted border-divider'}`}
              >
                فئة واحدة
              </button>
              <button
                onClick={() => setTourneyCatMode('multiple')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${tourneyCatMode === 'multiple' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-surface text-content-muted border-divider'}`}
              >
                فئات متنوعة
              </button>
            </div>
          )}

          {mode === 'normal' || tourneyCatMode === 'single' ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setCategoryId('random'); setSubcategoryId('all'); }}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${categoryId === 'random' ? 'border-indigo-500 bg-indigo-50' : 'border-divider bg-surface hover:border-divider'}`}
                >
                  <span className="text-3xl">🎲</span>
                  <span className={`font-bold ${categoryId === 'random' ? 'text-indigo-700' : 'text-content-muted'}`}>عشوائي</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategoryId(cat.id); setSubcategoryId('all'); }}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${categoryId === cat.id ? 'border-indigo-500 bg-indigo-50' : 'border-divider bg-surface hover:border-divider'}`}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className={`font-bold ${categoryId === cat.id ? 'text-indigo-700' : 'text-content-muted'}`}>{cat.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Subcategories */}
              <AnimatePresence>
                {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-4"
                  >
                    <h3 className="text-sm font-bold text-content-muted mb-3 px-1">التصنيف الفرعي:</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSubcategoryId('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${subcategoryId === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-surface text-content-muted border-divider'}`}
                      >
                        الكل
                      </button>
                      {selectedCategoryObj.subcategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSubcategoryId(sub.id)}
                          className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${subcategoryId === sub.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-surface text-content-muted border-divider'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${selectedCategories.includes(cat.id) ? 'border-indigo-500 bg-indigo-50' : 'border-divider bg-surface hover:border-divider'}`}
                >
                  <div className="relative">
                    <span className="text-3xl">{cat.icon}</span>
                    {selectedCategories.includes(cat.id) && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 absolute -bottom-1 -right-2 bg-indigo-50 rounded-full" />
                    )}
                  </div>
                  <span className={`font-bold ${selectedCategories.includes(cat.id) ? 'text-indigo-700' : 'text-content-muted'}`}>{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            الصعوبة
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDifficulty('all')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${difficulty === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-surface text-content-muted border-divider'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setDifficulty('easy')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${difficulty === 'easy' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface text-emerald-600 border-emerald-100'}`}
            >
              سهل
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${difficulty === 'medium' ? 'bg-amber-500 text-white border-amber-500' : 'bg-surface text-amber-600 border-amber-100'}`}
            >
              متوسط
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${difficulty === 'hard' ? 'bg-rose-500 text-white border-rose-500' : 'bg-surface text-rose-600 border-rose-100'}`}
            >
              صعب
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <Button size="xl" fullWidth onClick={handleStart} className="max-w-lg mx-auto shadow-2xl shadow-indigo-200">
          <Sparkles className="w-6 h-6 ml-2" />
          ابدأ اللعبة
        </Button>
      </div>
    </motion.div>
  );
}
