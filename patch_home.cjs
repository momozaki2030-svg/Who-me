const fs = require('fs');

let content = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf-8');

if (!content.includes('Users')) {
  content = content.replace("import { Trophy, Gamepad2, Info, Settings } from 'lucide-react';", "import { Trophy, Gamepad2, Info, Settings, Users } from 'lucide-react';");
}

const newButton = `
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg" fullWidth onClick={() => onNavigate('setup_elimination')}>
          <Users className="w-6 h-6 ml-3" />
          طور التصفية (خمن من؟)
        </Button>
`;

content = content.replace(
  /<Button size="lg" variant="secondary" fullWidth onClick=\{\(\) => onNavigate\('tournament'\)\}>\s*<Trophy className="w-6 h-6 ml-3" \/>\s*بطولة\s*<\/Button>/,
  `$&
${newButton}`
);

fs.writeFileSync('src/screens/HomeScreen.tsx', content, 'utf-8');
console.log("Updated HomeScreen.tsx");
