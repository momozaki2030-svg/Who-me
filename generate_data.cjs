const fs = require('fs');
const https = require('https');

async function getWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://ar.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=400`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const players = [
    "كريستيانو رونالدو", "ليونيل ميسي", "نيمار", "كيليان مبابي", "إيرلينغ هالاند",
    "محمد صلاح", "كيفين دي بروين", "روبرت ليفاندوفسكي", "لوكا مودريتش", "كريم بنزيما",
    "ساديو ماني", "هاري كين", "سون هيونغ مين", "فينيسيوس جونيور", "فيرجيل فان دايك",
    "تيبو كورتوا", "سون هيونغ مين", "أليسون بيكر", "برناردو سيلفا", "روبن دياز",
    "رياض محرز", "أشرف حكيمي", "ياسين بونو", "جود بيلينغهام", "بيدري", "جافي",
    "ماركوس راشفورد", "برونو فيرنانديز", "رافاييل لياو", "إدواردو كامافينغا",
    "أنطوان غريزمان", "ديوغو جوتا", "فيل فودين", "إيمرسون", "لويس دياز",
    "غابرييل خيسوس", "بوكايو ساكا", "ديكلان رايس", "مارتين أوديغارد", "لاوتارو مارتينيز",
    "إنزو فرنانديز", "أندري أونانا", "مارك أندريه تير شتيغن", "جواو كانسيلو",
    "رونالد أراوخو", "فيديريكو فالفيردي", "توني كروس", "ديفيد ألابا", "رودريغو غوس"
  ];

  let itemsCode = '';
  for (let i=0; i<players.length; i++) {
    const p = players[i];
    let img = await getWikiImage(p);
    // If no arabic wiki, try english
    if (!img) {
      const pEng = p; // Would need translation, let's just stick to what we have
    }
    
    itemsCode += `
  {
    id: 'fp_${i}',
    name: '${p}',
    categoryId: 'sports',
    subcategoryId: 'football_players',
    difficulty: 'easy',
    image: '${img || ''}',
    keywords: ['كرة قدم', 'لاعب', '${p}']
  },`;
    console.log(`Done ${p} - ${img ? 'Found' : 'Not Found'}`);
  }
  
  fs.writeFileSync('new_players.txt', itemsCode);
}
run();
