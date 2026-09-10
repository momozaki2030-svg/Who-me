import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ChevronRight, Search, Sparkles, X, Info } from 'lucide-react';
import { items } from '../data/items';
import { categories } from '../data/categories';
import { Item } from '../types';

interface Props {
  onBack: () => void;
}

export function EncyclopediaScreen({ onBack }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Gemini AI state
  const [aiInfo, setAiInfo] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCat === 'all' || item.categoryId === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  const handleGenerateInfo = async (item: Item) => {
    setIsAiLoading(true);
    setAiInfo('');
    setAiError('');
    try {
      const response = await fetch('/api/item-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      const data = await response.json();
      if (response.ok) {
        setAiInfo(data.info);
      } else {
        setAiError('عذراً، حدث خطأ أثناء جلب المعلومات.');
      }
    } catch (e) {
      setAiError('تأكد من اتصالك بالإنترنت.');
    }
    setIsAiLoading(false);
  };

  return (
    <div className="w-full h-screen bg-base flex flex-col" dir="rtl">
      {/* Header */}
      <div className="p-4 bg-surface border-b border-divider flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronRight className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            موسوعة العناصر
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4 shrink-0 bg-surface">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
          <input 
            type="text" 
            placeholder="ابحث عن شخصية، نادي، حيوان..." 
            className="w-full bg-base border border-divider rounded-xl py-3 pr-10 pl-4 text-content focus:outline-none focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <button 
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${selectedCat === 'all' ? 'bg-indigo-600 text-white' : 'bg-base text-content-muted border border-divider'}`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${selectedCat === cat.id ? 'bg-indigo-600 text-white' : 'bg-base text-content-muted border border-divider'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filteredItems.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="bg-surface rounded-xl overflow-hidden cursor-pointer border border-divider hover:border-indigo-500 transition-colors shadow-sm"
              onClick={() => { setSelectedItem(item); setAiInfo(''); setAiError(''); }}
            >
              <div className="aspect-square bg-surface-hover p-2 relative">
                <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} />
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-bold text-content truncate">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-content-muted">
            لا توجد عناصر مطابقة للبحث.
          </div>
        )}
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedItem(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64 bg-surface-hover p-6 flex justify-center shrink-0">
                <ImageWithFallback src={selectedItem.image} fallbackSrc={selectedItem.fallbackImage} alt={selectedItem.name} className="h-full w-auto object-contain rounded-xl shadow-lg" />
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="text-3xl font-black text-content mb-2">{selectedItem.name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.find(c => c.id === selectedItem.categoryId)?.icon}
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
                    {categories.find(c => c.id === selectedItem.categoryId)?.name}
                  </span>
                  <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                    {categories.find(c => c.id === selectedItem.categoryId)?.subcategories.find(s => s.id === selectedItem.subcategoryId)?.name}
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-content border-b border-divider pb-2">معلومات وأجوبة (الذكاء الاصطناعي)</h4>
                  
                  {!aiInfo && !isAiLoading && !aiError && (
                    <div className="text-center py-6 bg-surface-hover rounded-xl border border-divider">
                      <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <p className="text-sm text-content-muted mb-4 px-4">انقر لتوليد معلومات ممتعة، حقائق، وأبرز الأسئلة المتوقعة حول هذا العنصر في اللعبة.</p>
                      <Button onClick={() => handleGenerateInfo(selectedItem)} className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-200 dark:shadow-none">
                        توليد المعلومات
                      </Button>
                    </div>
                  )}

                  {isAiLoading && (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm font-bold text-indigo-600 animate-pulse">يتم استخراج المعلومات...</p>
                    </div>
                  )}

                  {aiError && (
                    <div className="text-center py-4 text-rose-500 text-sm font-bold bg-rose-50 rounded-lg">
                      {aiError}
                      <Button variant="outline" size="sm" onClick={() => handleGenerateInfo(selectedItem)} className="mt-2 mx-auto block">
                        إعادة المحاولة
                      </Button>
                    </div>
                  )}

                  {aiInfo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-sm dark:prose-invert prose-indigo">
                      <div className="text-content whitespace-pre-wrap leading-relaxed text-sm bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900">
                        {aiInfo}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
