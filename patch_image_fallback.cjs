const fs = require('fs');

let content = fs.readFileSync('src/components/ImageWithFallback.tsx', 'utf-8');

content = content.replace(
  "    if (fallbackSrc && imgSrc !== fallbackSrc) {\n      setImgSrc(fallbackSrc);\n    } else {\n      setHasError(true);\n    }",
  "    const autoFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random&color=fff&size=400`;\n    if (fallbackSrc && imgSrc !== fallbackSrc) {\n      setImgSrc(fallbackSrc);\n    } else if (imgSrc !== autoFallback) {\n      setImgSrc(autoFallback);\n    } else {\n      setHasError(true);\n    }"
);

fs.writeFileSync('src/components/ImageWithFallback.tsx', content, 'utf-8');
console.log("Patched ImageWithFallback");
