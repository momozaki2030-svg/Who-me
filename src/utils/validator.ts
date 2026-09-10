import { items } from '../data/items';
import { categories } from '../data/categories';
import { Item } from '../types';

export interface ValidationReport {
  totalItems: number;
  validItems: number;
  invalidItems: number;
  duplicateIds: string[];
  missingImages: string[];
  categoryStats: Record<string, number>;
}

export const validateDatabase = (): ValidationReport => {
  const report: ValidationReport = {
    totalItems: items.length,
    validItems: 0,
    invalidItems: 0,
    duplicateIds: [],
    missingImages: [],
    categoryStats: {}
  };

  const idSet = new Set<string>();

  categories.forEach(c => {
    report.categoryStats[c.id] = 0;
  });

  items.forEach(item => {
    if (idSet.has(item.id)) {
      report.duplicateIds.push(item.id);
    }
    idSet.add(item.id);

    if (!item.image) {
      report.missingImages.push(item.id);
      report.invalidItems++;
    } else {
      report.validItems++;
    }

    if (report.categoryStats[item.categoryId] !== undefined) {
      report.categoryStats[item.categoryId]++;
    }
  });

  return report;
};

// Async utility to pre-verify images are loadable
export const verifyImageLoad = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const getValidItems = (itemList: Item[]): Item[] => {
  const validItems: Item[] = [];
  
  // We filter out items that don't have a valid image or use the generic fallback placeholder.
  // The generic fallback is 'images.unsplash.com/photo-1505691938895'
  
  itemList.forEach(item => {
    if (!item.image) return;
    
    // Check if it's a valid URL string
    if (typeof item.image !== 'string' || !item.image.startsWith('http')) return;
    
    // Exclude generic placeholders so we don't randomly select items without real images
    if (item.image.includes('unsplash.com/photo-1505691938895')) return;
    
    validItems.push(item);
  });
  
  return validItems;
};
