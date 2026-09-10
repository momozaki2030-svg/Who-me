const fs = require('fs');
let content = fs.readFileSync('src/components/ImageWithFallback.tsx', 'utf-8');
if (!content.includes('referrerPolicy')) {
  content = content.replace(
    'className={`w-full h-full object-contain',
    'referrerPolicy="no-referrer"\n          className={`w-full h-full object-contain'
  );
  fs.writeFileSync('src/components/ImageWithFallback.tsx', content, 'utf-8');
  console.log("Fixed referrerPolicy");
}
