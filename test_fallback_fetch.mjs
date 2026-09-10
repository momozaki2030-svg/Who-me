const getFallbackImage = async (title) => {
  try {
    const res = await fetch('https://en.wikipedia.org/wiki/'+encodeURIComponent(title.replace(/ /g, '_')), {
      headers: {'User-Agent':'MinAnaGame/2.0'}
    });
    const d = await res.text();
    
    const infoboxMatch = d.match(/<table class=\"[^\"]*infobox.*?<img[^>]*src=\"([^\"]+)\"/s);
    if (infoboxMatch && !infoboxMatch[1].includes('Ambox') && !infoboxMatch[1].includes('Question_book')) {
      return infoboxMatch[1].replace(/&amp;/g, '&');
    }
    
    const thumbMatch = d.match(/<div class=\"thumbinner\".*?<img[^>]*src=\"([^\"]+)\"/s);
    if (thumbMatch) {
      return thumbMatch[1].replace(/&amp;/g, '&');
    }

    const imgMatches = [...d.matchAll(/<a class=\"mw-file-description\"[^>]*>.*?<img[^>]*src=\"([^\"]+)\"/gs)];
    for (const match of imgMatches) {
      const src = match[1];
      const bad = ['Ambox', 'Question_book', 'Commons-logo', 'Edit-clear', 'WPVG', 'Folder_Icon', 'Portal-puzzle', 'Searchtool', 'Sound-icon', 'Speaker', 'Text-x-generic', 'Video-x-generic'];
      if (!bad.some(b => src.includes(b))) {
        return src.replace(/&amp;/g, '&');
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function test() {
  console.log('Xavi:', await getFallbackImage('Xavi'));
  console.log('PlayStation:', await getFallbackImage('PlayStation'));
  console.log('Key:', await getFallbackImage('Key'));
}
test();
