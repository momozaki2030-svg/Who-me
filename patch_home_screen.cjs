const fs = require('fs');
let content = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf-8');

// Add Book icon
content = content.replace("Settings, Users", "Settings, Users, Book");

// Add button for encyclopedia
const btnHtml = `
          <Button variant="outline" fullWidth onClick={() => onNavigate('encyclopedia')}>
            <Book className="w-5 h-5 ml-2" />
            الموسوعة
          </Button>`;

content = content.replace(
  "          <Button variant=\"outline\" fullWidth onClick={() => onNavigate('settings')}>",
  btnHtml + "\n          <Button variant=\"outline\" fullWidth onClick={() => onNavigate('settings')}>"
);

fs.writeFileSync('src/screens/HomeScreen.tsx', content, 'utf-8');
console.log("Patched Home Screen");
