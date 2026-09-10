import fs from 'fs';

let content = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

// 1. Add imports
const importHook = "import { useItemInfo } from '../hooks/useItemInfo';\n";
const importIcons = "import { User, Shield, Info, Loader2 } from 'lucide-react';\n"; // Adding Info and Loader2
content = content.replace("import { User, Shield } from 'lucide-react';", importIcons);
if (!content.includes('useItemInfo')) {
  content = importHook + content;
}

// 2. Add InfoButton component right before GameScreen
const infoButtonComponent = `
const ItemInfoDisplay = ({ item, onClose }: { item: Item, onClose: () => void }) => {
  const { info, loading } = useItemInfo(item.name);
  
  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors z-10">
          ✕
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border-4 border-white shadow-lg mb-4">
            {item.image ? (
              <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-2xl font-bold">؟</div>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
          <p className="text-sm text-slate-500 mb-6">{getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}</p>
          
          <div className="w-full space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2 text-indigo-500" />
                <span className="text-sm">جاري جلب المعلومات...</span>
              </div>
            ) : (
              info.map((fact, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-start text-right">
                  <span className="text-xs font-bold text-indigo-500 mb-1">{fact.label}</span>
                  <span className="text-sm text-slate-700 font-medium">{fact.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
`;

if (!content.includes('ItemInfoDisplay')) {
  const insertIndex = content.indexOf('export function GameScreen');
  content = content.slice(0, insertIndex) + infoButtonComponent + content.slice(insertIndex);
}

// 3. Add state for info modal in GameScreen
const stateInsert = `
  const [showSecret, setShowSecret] = useState(false);
  const [infoItem, setInfoItem] = useState<Item | null>(null);
`;
content = content.replace("const [showSecret, setShowSecret] = useState(false);", stateInsert);

// 4. Update the "Show Secret Item" overlay to include the facts
const oldSecretOverlay = `{showSecret && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
            >
              <h3 className="text-sm font-bold text-slate-500 mb-4">العنصر السري هو:</h3>
              <div className="w-48 h-48 mx-auto bg-slate-50 rounded-2xl overflow-hidden mb-6 shadow-inner border-2 border-slate-100 relative p-2">
                {currentSecretItem.image ? (
                   <ImageWithFallback src={currentSecretItem.image} fallbackSrc={currentSecretItem.fallbackImage} alt={currentSecretItem.name} className="w-full h-full rounded-xl" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 text-6xl">؟</div>
                )}
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{currentSecretItem.name}</h2>
              <p className="text-indigo-600 font-medium mb-6">
                {getCategoryName(currentSecretItem.categoryId)} - {getSubcategoryName(currentSecretItem.categoryId, currentSecretItem.subcategoryId)}
              </p>
              
              <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                أفلت الزر لإخفاء العنصر
              </div>
            </motion.div>
          </div>
        )}`;

// I'll make a custom hook call inside a new inner component for the secret overlay, or I can just use the ItemInfoDisplay!
// Wait, the user has to hold the button to show the secret item. If we show the facts while they hold it, we need to fetch it.
// Let's create a wrapper component for the secret item display.

const newSecretOverlay = `{showSecret && (
          <SecretItemOverlay item={currentSecretItem} />
        )}`;

const secretOverlayComponent = `
const SecretItemOverlay = ({ item }: { item: Item }) => {
  const { info, loading } = useItemInfo(item.name);
  
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl max-h-[80vh] flex flex-col"
      >
        <h3 className="text-sm font-bold text-slate-500 mb-4 shrink-0">العنصر السري هو:</h3>
        <div className="w-32 h-32 mx-auto bg-slate-50 rounded-2xl overflow-hidden mb-4 shadow-inner border-2 border-slate-100 shrink-0 relative p-2">
          {item.image ? (
              <ImageWithFallback src={item.image} fallbackSrc={item.fallbackImage} alt={item.name} className="w-full h-full rounded-xl" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 text-5xl">؟</div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1 shrink-0">{item.name}</h2>
        <p className="text-indigo-600 font-medium text-sm mb-4 shrink-0">
          {getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}
        </p>
        
        <div className="flex-1 overflow-y-auto mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100 text-right space-y-2">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-4 text-slate-400">
               <Loader2 className="w-5 h-5 animate-spin mb-2 text-indigo-400" />
               <span className="text-xs">جاري تحميل المعلومات...</span>
             </div>
          ) : (
            info.map((fact, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <span className="text-xs font-bold text-indigo-500 block mb-0.5">{fact.label}</span>
                <span className="text-sm text-slate-700 block">{fact.value}</span>
              </div>
            ))
          )}
        </div>

        <div className="text-xs font-bold text-slate-400 bg-slate-100 p-3 rounded-xl shrink-0">
          أفلت الزر لإخفاء العنصر
        </div>
      </motion.div>
    </div>
  );
};
`;

if (!content.includes('SecretItemOverlay')) {
  const insertIndex2 = content.indexOf('export function GameScreen');
  content = content.slice(0, insertIndex2) + secretOverlayComponent + content.slice(insertIndex2);
  content = content.replace(oldSecretOverlay, newSecretOverlay);
}


// 5. Add info buttons to the search results (in guess phase)
// Search for the button rendering the search results
const oldSearchRender = `                            <div>
                              <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            </div>
                          </button>`;

const newSearchRender = `                            <div className="flex-1 text-right">
                              <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInfoItem(item);
                              }}
                              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 border border-slate-200"
                            >
                              <Info className="w-5 h-5" />
                            </button>
                          </button>`;

content = content.replace(oldSearchRender, newSearchRender); // Only replaces the first one?
content = content.replace(oldSearchRender, newSearchRender); // Replaces the second one if any? Actually there are two places (search query active and inactive). Let's use regex or just replace all.

content = content.split(oldSearchRender).join(newSearchRender);


// Fix the search query active one too:
const oldSearchQueryRender = `                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-500">{getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}</p>
                      </div>
                    </button>`;

const newSearchQueryRender = `                      <div className="flex-1 text-right">
                        <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-500">{getCategoryName(item.categoryId)} - {getSubcategoryName(item.categoryId, item.subcategoryId)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfoItem(item);
                        }}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 border border-slate-200"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </button>`;
content = content.split(oldSearchQueryRender).join(newSearchQueryRender);


// 6. Add AnimatePresence for the Info Modal at the end of GameScreen
const modalInsert = `
      <AnimatePresence>
        {infoItem && <ItemInfoDisplay item={infoItem} onClose={() => setInfoItem(null)} />}
      </AnimatePresence>
    </div>
  );
`;
content = content.replace("    </div>\n  );\n}", modalInsert + "\n}");

fs.writeFileSync('src/screens/GameScreen.tsx', content);
