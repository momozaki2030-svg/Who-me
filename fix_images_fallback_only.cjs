const fs = require('fs');

let itemsContent = fs.readFileSync('src/data/items.ts', 'utf-8');

itemsContent = itemsContent.replace(/image:\s*''/g, (match, offset, string) => {
    // We need to extract the name for this item
    // Look backwards from offset
    const before = string.substring(0, offset);
    const nameMatch = before.match(/name:\s*'([^']+)'/g);
    if (nameMatch && nameMatch.length > 0) {
        const lastMatch = nameMatch[nameMatch.length - 1];
        const name = lastMatch.match(/name:\s*'([^']+)'/)[1];
        return `image: 'https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=400'`;
    }
    return `image: 'https://ui-avatars.com/api/?name=?&background=random&color=fff'`;
});

fs.writeFileSync('src/data/items.ts', itemsContent, 'utf-8');
console.log("Applied fallbacks instantly!");
