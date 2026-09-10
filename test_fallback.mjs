import https from 'https';

const getFallbackImage = (title) => {
  return new Promise((resolve) => {
    https.get('https://en.wikipedia.org/wiki/'+encodeURIComponent(title.replace(/ /g, '_')), {headers:{'User-Agent':'MinAnaGame/2.0'}}, res => {
      let d='';
      res.on('data', c=>d+=c);
      res.on('end', ()=> {
        // Try infobox first
        const infoboxMatch = d.match(/<table class=\"[^\"]*infobox.*?<img[^>]*src=\"([^\"]+)\"/s);
        if (infoboxMatch && !infoboxMatch[1].includes('Ambox') && !infoboxMatch[1].includes('Question_book')) {
          return resolve(infoboxMatch[1].replace(/&amp;/g, '&'));
        }
        
        // Try thumb
        const thumbMatch = d.match(/<div class=\"thumbinner\".*?<img[^>]*src=\"([^\"]+)\"/s);
        if (thumbMatch) {
          return resolve(thumbMatch[1].replace(/&amp;/g, '&'));
        }

        // Try any image inside a mw-file-description link
        const imgMatches = [...d.matchAll(/<a class=\"mw-file-description\"[^>]*>.*?<img[^>]*src=\"([^\"]+)\"/gs)];
        for (const match of imgMatches) {
          const src = match[1];
          const bad = ['Ambox', 'Question_book', 'Commons-logo', 'Edit-clear', 'WPVG', 'Folder_Icon', 'Portal-puzzle', 'Searchtool', 'Sound-icon', 'Speaker', 'Text-x-generic', 'Video-x-generic'];
          if (!bad.some(b => src.includes(b))) {
            return resolve(src.replace(/&amp;/g, '&'));
          }
        }

        resolve(null);
      })
    }).on('error', () => resolve(null));
  });
}

async function test() {
  console.log('Xavi:', await getFallbackImage('Xavi'));
  console.log('PlayStation:', await getFallbackImage('PlayStation'));
  console.log('Key:', await getFallbackImage('Key'));
}
test();
