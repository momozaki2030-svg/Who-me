const fs = require('fs');

let content = fs.readFileSync('src/components/ImageWithFallback.tsx', 'utf-8');

// Add ref to img to check if it's already complete
const newCode = `
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

interface Props {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export const ImageWithFallback: React.FC<Props> = ({ src, fallbackSrc, alt, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, [imgSrc]);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className={\`relative flex items-center justify-center bg-surface-hover overflow-hidden \${className}\`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-hover z-10">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-active text-content-muted z-10 p-2">
          <ImageOff className="w-10 h-10 mb-2 opacity-50" />
          <span className="text-xs font-medium text-center">تعذر تحميل الصورة</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          className={\`w-full h-full object-contain transition-opacity duration-300 \${isLoading ? 'opacity-0' : 'opacity-100'}\`}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      )}
    </div>
  );
};
`;

fs.writeFileSync('src/components/ImageWithFallback.tsx', newCode, 'utf-8');
console.log("Updated ImageWithFallback");
