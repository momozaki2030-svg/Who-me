import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Grid } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { categories } from '../data/categories';
import { Player } from '../types';

interface Props {
  onStart: (players: Player[], categoryId: string, subcategoryId: string) => void;
  onBack: () => void;
}

export function EliminationSetupScreen({ onStart, onBack }: Props) {
  const [player1Name, setPlayer1Name] = useState('اللاعب الأول');
  const [player2Name, setPlayer2Name] = useState('اللاعب الثاني');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'countries');
  const [subcategoryId, setSubcategoryId] = useState<string>('all');

  const selectedCategoryObj = categories.find(c => c.id === categoryId);

  const handleStart = () => {
    onStart(
      [
        { id: 0, name: player1Name, score: 0 },
        { id: 1, name: player2Name, score: 0 }
      ],
      categoryId,
      subcategoryId
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-6 max-w-lg mx-auto pb-32"
    >
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -mr-2 bg-surface-active rounded-full hover:bg-slate-300 transition-colors">
          <ArrowRight className="w-6 h-6 text-content" />
        </button>
        <h1 className="text-2xl font-black text-content mr-4">إعداد طور التصفية</h1>
      </div>

      <div className="space-y-8">
        {/* Players */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content">اللاعبين</h2>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-content-muted">اللاعب 1</label>
              <input
                type="text"
                value={player1Name}
                onChange={e => setPlayer1Name(e.target.value)}
                className="w-full bg-surface border-2 border-divider focus:border-indigo-500 rounded-xl p-3 font-bold text-center outline-none text-content transition-colors"
                maxLength={12}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-content-muted">اللاعب 2</label>
              <input
                type="text"
                value={player2Name}
                onChange={e => setPlayer2Name(e.target.value)}
                className="w-full bg-surface border-2 border-divider focus:border-indigo-500 rounded-xl p-3 font-bold text-center outline-none text-content transition-colors"
                maxLength={12}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-500" />
            اختر الفئة
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategoryId(cat.id); setSubcategoryId('all'); }}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${categoryId === cat.id ? 'border-emerald-500 bg-emerald-50' : 'border-divider bg-surface hover:border-divider'}`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className={`font-bold ${categoryId === cat.id ? 'text-emerald-700' : 'text-content-muted'}`}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
          {/* Subcategories */}
          <div className="pt-4">
            {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="overflow-hidden"
              >
                <h3 className="text-sm font-bold text-content-muted mb-3 px-1">التصنيف الفرعي:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSubcategoryId('all')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${subcategoryId === 'all' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface text-content-muted border-divider'}`}
                  >
                    الكل
                  </button>
                  {selectedCategoryObj.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSubcategoryId(sub.id)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${subcategoryId === sub.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface text-content-muted border-divider'}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-base via-bg-base to-transparent">
        <Button size="xl" fullWidth onClick={handleStart} className="max-w-lg mx-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200">
          <Sparkles className="w-6 h-6 ml-2" />
          بدء اللعب
        </Button>
      </div>
    </motion.div>
  );
}
