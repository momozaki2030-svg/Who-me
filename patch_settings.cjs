const fs = require('fs');

let content = fs.readFileSync('src/screens/SettingsScreen.tsx', 'utf-8');

if (!content.includes('useTheme')) {
  content = content.replace("import { GameState } from '../types';", "import { GameState } from '../types';\nimport { useTheme } from '../hooks/useTheme';");
  
  const hookDecl = "const { theme, toggleTheme } = useTheme();\n";
  content = content.replace("const [sound, setSound] = useState(true);", hookDecl + "  const [sound, setSound] = useState(true);");
  
  const themeCard = `
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="font-bold text-lg text-content">الوضع الليلي</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={\`w-14 h-8 rounded-full p-1 transition-colors \${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}\`}
          >
            <motion.div 
              className="w-6 h-6 bg-surface rounded-full shadow-sm"
              animate={{ x: theme === 'dark' ? -24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </Card>
  `;
  
  content = content.replace('<div className="space-y-4">', '<div className="space-y-4">' + themeCard);
  
  fs.writeFileSync('src/screens/SettingsScreen.tsx', content, 'utf-8');
  console.log("Patched SettingsScreen.tsx");
}
