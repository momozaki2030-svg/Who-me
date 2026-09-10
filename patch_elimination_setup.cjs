const fs = require('fs');

let content = fs.readFileSync('src/screens/EliminationSetupScreen.tsx', 'utf-8');

// Add subcategoryId state
content = content.replace(
  "const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'countries');",
  "const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'countries');\n  const [subcategoryId, setSubcategoryId] = useState<string>('all');"
);

// Get selectedCategoryObj
content = content.replace(
  "const handleStart = () => {",
  "const selectedCategoryObj = categories.find(c => c.id === categoryId);\n\n  const handleStart = () => {"
);

// Pass subcategoryId to onStart
content = content.replace(
  "onStart: (players: Player[], categoryId: string) => void;",
  "onStart: (players: Player[], categoryId: string, subcategoryId: string) => void;"
);

content = content.replace(
  /onStart\([\s\S]*?\[[\s\S]*?\{ id: 0, name: player1Name, score: 0 \},[\s\S]*?\{ id: 1, name: player2Name, score: 0 \}[\s\S]*?\],[\s\S]*?categoryId[\s\S]*?\);/,
  `onStart(
      [
        { id: 0, name: player1Name, score: 0 },
        { id: 1, name: player2Name, score: 0 }
      ],
      categoryId,
      subcategoryId
    );`
);

// Add subcategory UI after the categories grid
const subcatUI = `
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
                    className={\`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors \${subcategoryId === 'all' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface text-content-muted border-divider'}\`}
                  >
                    الكل
                  </button>
                  {selectedCategoryObj.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSubcategoryId(sub.id)}
                      className={\`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors \${subcategoryId === sub.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface text-content-muted border-divider'}\`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<div className="fixed bottom-0/,
  `</div>
        </div>${subcatUI}
      </div>

      <div className="fixed bottom-0`
);

// Also reset subcategoryId when changing categoryId
content = content.replace(
  /onClick=\{\(\) => setCategoryId\(cat\.id\)\}/g,
  "onClick={() => { setCategoryId(cat.id); setSubcategoryId('all'); }}"
);

fs.writeFileSync('src/screens/EliminationSetupScreen.tsx', content, 'utf-8');
console.log("Updated EliminationSetupScreen");
