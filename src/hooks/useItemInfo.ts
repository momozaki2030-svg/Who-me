import { useState, useEffect } from 'react';
import { getItemCheatSheet } from '../data/itemInfo';

export interface ItemFact {
  label: string;
  value: string;
}

export const useItemInfo = (itemName: string | null) => {
  const [info, setInfo] = useState<ItemFact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemName) {
      setInfo([]);
      return;
    }
    
    setLoading(true);
    
    // We simulate a very tiny delay (300ms) just so the UI feels "active" 
    // and they can read "يتم ترتيب المعلومات المخصصة...", but it's local and NEVER fails!
    const timer = setTimeout(() => {
      const data = getItemCheatSheet(itemName);
      setInfo(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [itemName]);

  return { info, loading };
};