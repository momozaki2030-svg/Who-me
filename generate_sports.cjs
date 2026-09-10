const https = require('https');
const fs = require('fs');

const data = {
  football_players: [
    { ar: "كريستيانو رونالدو", en: "Cristiano Ronaldo" },
    { ar: "ليونيل ميسي", en: "Lionel Messi" },
    { ar: "نيمار", en: "Neymar" },
    { ar: "كيليان مبابي", en: "Kylian Mbappe" },
    { ar: "إيرلينغ هالاند", en: "Erling Haaland" },
    { ar: "محمد صلاح", en: "Mohamed Salah" },
    { ar: "كيفين دي بروين", en: "Kevin De Bruyne" },
    { ar: "روبرت ليفاندوفسكي", en: "Robert Lewandowski" },
    { ar: "لوكا مودريتش", en: "Luka Modric" },
    { ar: "كريم بنزيما", en: "Karim Benzema" },
    { ar: "ساديو ماني", en: "Sadio Mane" },
    { ar: "هاري كين", en: "Harry Kane" },
    { ar: "سون هيونغ مين", en: "Son Heung-min" },
    { ar: "فينيسيوس جونيور", en: "Vinicius Junior" },
    { ar: "فيرجيل فان دايك", en: "Virgil van Dijk" },
    { ar: "تيبو كورتوا", en: "Thibaut Courtois" },
    { ar: "أليسون بيكر", en: "Alisson Becker" },
    { ar: "برناردو سيلفا", en: "Bernardo Silva" },
    { ar: "روبن دياز", en: "Ruben Dias" },
    { ar: "رياض محرز", en: "Riyad Mahrez" },
    { ar: "أشرف حكيمي", en: "Achraf Hakimi" },
    { ar: "ياسين بونو", en: "Yassine Bounou" },
    { ar: "جود بيلينغهام", en: "Jude Bellingham" },
    { ar: "بيدري", en: "Pedri" },
    { ar: "جافي", en: "Gavi (footballer)" },
    { ar: "ماركوس راشفورد", en: "Marcus Rashford" },
    { ar: "برونو فيرنانديز", en: "Bruno Fernandes" },
    { ar: "رافاييل لياو", en: "Rafael Leao" },
    { ar: "إدواردو كامافينغا", en: "Eduardo Camavinga" },
    { ar: "أنطوان غريزمان", en: "Antoine Griezmann" },
    { ar: "ديوغو جوتا", en: "Diogo Jota" },
    { ar: "فيل فودين", en: "Phil Foden" },
    { ar: "لويس دياز", en: "Luis Diaz" },
    { ar: "بوكايو ساكا", en: "Bukayo Saka" },
    { ar: "مارتين أوديغارد", en: "Martin Odegaard" },
    { ar: "لاوتارو مارتينيز", en: "Lautaro Martinez" },
    { ar: "مارك أندريه تير شتيغن", en: "Marc-Andre ter Stegen" },
    { ar: "جواو كانسيلو", en: "Joao Cancelo" },
    { ar: "رونالد أراوخو", en: "Ronald Araujo" },
    { ar: "فيديريكو فالفيردي", en: "Federico Valverde" },
    { ar: "توني كروس", en: "Toni Kroos" },
    { ar: "رودريغو غوس", en: "Rodrygo" },
    { ar: "جمال موسيالا", en: "Jamal Musiala" },
    { ar: "فيكتور أوسيمين", en: "Victor Osimhen" },
    { ar: "كفيتشا كفاراتسخيليا", en: "Khvicha Kvaratskhelia" }
  ],
  national_teams: [
    { ar: "الأرجنتين", en: "Argentina national football team" },
    { ar: "فرنسا", en: "France national football team" },
    { ar: "البرازيل", en: "Brazil national football team" },
    { ar: "إنجلترا", en: "England national football team" },
    { ar: "البرتغال", en: "Portugal national football team" },
    { ar: "إسبانيا", en: "Spain national football team" },
    { ar: "إيطاليا", en: "Italy national football team" },
    { ar: "ألمانيا", en: "Germany national football team" },
    { ar: "هولندا", en: "Netherlands national football team" },
    { ar: "بلجيكا", en: "Belgium national football team" },
    { ar: "كرواتيا", en: "Croatia national football team" },
    { ar: "المغرب", en: "Morocco national football team" },
    { ar: "السنغال", en: "Senegal national football team" },
    { ar: "السعودية", en: "Saudi Arabia national football team" },
    { ar: "اليابان", en: "Japan national football team" },
    { ar: "كوريا الجنوبية", en: "South Korea national football team" },
    { ar: "الأوروغواي", en: "Uruguay national football team" },
    { ar: "كولومبيا", en: "Colombia national football team" },
    { ar: "تشيلي", en: "Chile national football team" },
    { ar: "الجزائر", en: "Algeria national football team" },
    { ar: "مصر", en: "Egypt national football team" },
    { ar: "تونس", en: "Tunisia national football team" },
    { ar: "ساحل العاج", en: "Ivory Coast national football team" },
    { ar: "الكاميرون", en: "Cameroon national football team" },
    { ar: "غانا", en: "Ghana national football team" },
    { ar: "نيجيريا", en: "Nigeria national football team" },
    { ar: "سويسرا", en: "Switzerland national football team" },
    { ar: "الدنمارك", en: "Denmark national football team" },
    { ar: "السويد", en: "Sweden national football team" },
    { ar: "المكسيك", en: "Mexico national football team" },
    { ar: "الولايات المتحدة", en: "United States men's national soccer team" },
    { ar: "كندا", en: "Canada men's national soccer team" },
    { ar: "قطر", en: "Qatar national football team" },
    { ar: "الإمارات", en: "United Arab Emirates national football team" },
    { ar: "العراق", en: "Iraq national football team" },
    { ar: "سوريا", en: "Syria national football team" },
    { ar: "أستراليا", en: "Australia men's national soccer team" },
    { ar: "إيران", en: "Iran national football team" },
    { ar: "تركيا", en: "Turkey national football team" },
    { ar: "صربيا", en: "Serbia national football team" },
    { ar: "ويلز", en: "Wales national football team" },
    { ar: "اسكتلندا", en: "Scotland national football team" },
    { ar: "النرويج", en: "Norway national football team" }
  ],
  clubs: [
    { ar: "ريال مدريد", en: "Real Madrid CF" },
    { ar: "برشلونة", en: "FC Barcelona" },
    { ar: "أتلتيكو مدريد", en: "Atletico Madrid" },
    { ar: "مانشستر سيتي", en: "Manchester City F.C." },
    { ar: "مانشستر يونايتد", en: "Manchester United F.C." },
    { ar: "ليفربول", en: "Liverpool F.C." },
    { ar: "أرسنال", en: "Arsenal F.C." },
    { ar: "تشيلسي", en: "Chelsea F.C." },
    { ar: "توتنهام هوتسبير", en: "Tottenham Hotspur F.C." },
    { ar: "بايرن ميونخ", en: "FC Bayern Munich" },
    { ar: "بوروسيا دورتموند", en: "Borussia Dortmund" },
    { ar: "باير ليفركوزن", en: "Bayer 04 Leverkusen" },
    { ar: "يوفنتوس", en: "Juventus F.C." },
    { ar: "ميلان", en: "AC Milan" },
    { ar: "إنتر ميلان", en: "Inter Milan" },
    { ar: "نابولي", en: "SSC Napoli" },
    { ar: "روما", en: "AS Roma" },
    { ar: "باريس سان جيرمان", en: "Paris Saint-Germain F.C." },
    { ar: "مارسيليا", en: "Olympique de Marseille" },
    { ar: "ليون", en: "Olympique Lyonnais" },
    { ar: "أياكس", en: "AFC Ajax" },
    { ar: "آيندهوفن", en: "PSV Eindhoven" },
    { ar: "فاينورد", en: "Feyenoord" },
    { ar: "بورتو", en: "FC Porto" },
    { ar: "بنفيكا", en: "S.L. Benfica" },
    { ar: "سبورتينغ لشبونة", en: "Sporting CP" },
    { ar: "الهلال", en: "Al Hilal SFC" },
    { ar: "النصر", en: "Al Nassr FC" },
    { ar: "الاتحاد", en: "Al-Ittihad Club (Jeddah)" },
    { ar: "الأهلي", en: "Al-Ahli Saudi FC" },
    { ar: "الشباب", en: "Al-Shabab FC (Riyadh)" },
    { ar: "الأهلي المصري", en: "Al Ahly SC" },
    { ar: "الزمالك", en: "Zamalek SC" },
    { ar: "الوداد البيضاوي", en: "Wydad AC" },
    { ar: "الرجاء البيضاوي", en: "Raja CA" },
    { ar: "الترجي", en: "Esperance de Tunis" },
    { ar: "غلطة سراي", en: "Galatasaray S.K. (football)" },
    { ar: "فنربخشة", en: "Fenerbahce S.K. (football)" },
    { ar: "بشيكتاش", en: "Besiktas J.K." },
    { ar: "بوكا جونيورز", en: "Boca Juniors" },
    { ar: "ريفر بليت", en: "Club Atletico River Plate" },
    { ar: "فلامنغو", en: "Clube de Regatas do Flamengo" },
    { ar: "بالميراس", en: "Sociedade Esportiva Palmeiras" }
  ]
};

async function searchCommons(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=400&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.query && parsed.query.pages) {
            const pageId = Object.keys(parsed.query.pages)[0];
            if (parsed.query.pages[pageId].thumbnail) {
              resolve(parsed.query.pages[pageId].thumbnail.source);
              return;
            }
          }
          resolve(null);
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  let output = 'import { Item } from "../types";\n\nexport const extraItems: Item[] = [\n';
  
  for (const [subcat, list] of Object.entries(data)) {
    console.log(`Processing ${subcat}...`);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let img = await searchCommons(item.en);
      if (!img) {
        // Retry with just the name
        img = await searchCommons(item.en.replace(/national football team|F\.C\.|CF|FC/g, '').trim());
      }
      
      output += `  {
    id: 'extra_${subcat}_${i}',
    name: '${item.ar}',
    categoryId: 'sports',
    subcategoryId: '${subcat}',
    difficulty: 'easy',
    image: '${img || ''}',
    keywords: ['${item.ar}']
  },\n`;
      console.log(` - ${item.ar}: ${img ? 'OK' : 'MISSING'}`);
      
      // sleep a bit to avoid rate limits
      await new Promise(r => setTimeout(r, 100));
    }
  }
  output += '];\n';
  fs.writeFileSync('src/data/extra_items.ts', output);
  console.log("Done fetching extra sports items.");
}
run();
