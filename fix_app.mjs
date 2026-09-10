import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace everything in initializeDatabase with just setting validItems to rawItems
const oldInit = `    const initializeDatabase = async () => {
      try {
        console.log('Validating Database...', validateDatabase());
        const loadedItems = getValidItems(rawItems);
        if (loadedItems.length === 0 && rawItems.length > 0) {
          setInitError('تنبيه: لم يتم العثور على صور حقيقية لبعض العناصر.');
          setValidItems(rawItems);
        } else {
          setValidItems(loadedItems.length > 0 ? loadedItems : rawItems);
        }
      } catch (e) {
        setInitError('حدث خطأ أثناء تحميل قاعدة البيانات.');
      } finally {
        setIsInitializing(false);
      }
    };
    initializeDatabase();`;

const newInit = `    setValidItems(rawItems);
    setIsInitializing(false);`;

content = content.replace(oldInit, newInit);
fs.writeFileSync('src/App.tsx', content);
