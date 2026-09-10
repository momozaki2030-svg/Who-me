const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /\bbg-slate-50\b/g, replace: 'bg-base' },
  { regex: /\bbg-white\b/g, replace: 'bg-surface' },
  { regex: /\bbg-slate-100\b/g, replace: 'bg-surface-hover' },
  { regex: /\bbg-slate-200\b/g, replace: 'bg-surface-active' },
  { regex: /\btext-slate-900\b/g, replace: 'text-content' },
  { regex: /\btext-slate-800\b/g, replace: 'text-content' },
  { regex: /\btext-slate-700\b/g, replace: 'text-content' },
  { regex: /\btext-slate-600\b/g, replace: 'text-content-muted' },
  { regex: /\btext-slate-500\b/g, replace: 'text-content-muted' },
  { regex: /\bborder-slate-200\b/g, replace: 'border-divider' },
  { regex: /\bborder-slate-100\b/g, replace: 'border-divider' },
  { regex: /\bborder-slate-300\b/g, replace: 'border-divider' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const r of replacements) {
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk('./src');
