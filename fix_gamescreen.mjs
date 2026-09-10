import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

// Add getSubcategoryName function
const subcatFunc = `const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';
  const getSubcategoryName = (catId: string, subId: string) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return '';
    const sub = cat.subcategories.find(s => s.id === subId);
    return sub ? sub.name : '';
  };
`;

content = content.replace("const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';", subcatFunc);

// Group searchResults by subcategoryId if search query is empty
const groupingLogic = `
            <div className="flex-1 overflow-y-auto space-y-4 pb-8 pr-2">
              {(() => {
                if (searchResults.length === 0) {
                  return (
                    <div className="text-center text-slate-500 mt-10 font-bold">
                      لا توجد نتائج مطابقة
                    </div>
                  );
                }

                // If searching, show flat list
                if (searchQuery.trim()) {
                  return searchResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleGuess(item)}
                      className="w-full bg-white border-2 border-slate-100 hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right mb-3 shadow-sm hover:shadow"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 relative p-1">
                        {item.image ? (
                          <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-lg" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">؟</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-500">{getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}</p>
                      </div>
                    </button>
                  ));
                }

                // Group by subcategoryId
                const grouped = searchResults.reduce((acc, item) => {
                  const key = item.categoryId + '_' + item.subcategoryId;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(item);
                  return acc;
                }, {} as Record<string, typeof searchResults>);

                return Object.entries(grouped).map(([key, items]) => {
                  const firstItem = items[0];
                  return (
                    <div key={key} className="mb-6">
                      <h4 className="text-sm font-bold text-indigo-500 mb-3 px-2 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 ml-2"></div>
                        {getCategoryName(firstItem.categoryId)} - {getSubcategoryName(firstItem.categoryId, firstItem.subcategoryId)}
                      </h4>
                      <div className="space-y-3">
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleGuess(item)}
                            className="w-full bg-white border-2 border-slate-100 hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-4 transition-all active:scale-95 text-right shadow-sm hover:shadow"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 relative border border-slate-100 p-1">
                              {item.image ? (
                                <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-lg" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200">؟</div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
`;

content = content.replace(/<div className="flex-1 overflow-y-auto space-y-3 pb-8">[\s\S]*?<\/div>\s*<\/motion\.div>/, groupingLogic + '\n          </motion.div>');

fs.writeFileSync('src/screens/GameScreen.tsx', content);
