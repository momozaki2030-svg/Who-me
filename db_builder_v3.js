import fs from 'fs';
import https from 'https';

const dbMap = {
  sports: [
    { ar: 'ليونيل ميسي', en: 'Lionel Messi', sub: 'football_players' },
    { ar: 'كريستيانو رونالدو', en: 'Cristiano Ronaldo', sub: 'football_players' },
    { ar: 'كيليان مبابي', en: 'Kylian Mbappé', sub: 'football_players' },
    { ar: 'محمد صلاح', en: 'Mohamed Salah', sub: 'football_players' },
    { ar: 'نيمار', en: 'Neymar', sub: 'football_players' },
    { ar: 'فينيسيوس جونيور', en: 'Vinícius Júnior', sub: 'football_players' },
    { ar: 'جود بيلينغهام', en: 'Jude Bellingham', sub: 'football_players' },
    { ar: 'إيرلينغ هالاند', en: 'Erling Haaland', sub: 'football_players' },
    { ar: 'كيفين دي بروين', en: 'Kevin De Bruyne', sub: 'football_players' },
    { ar: 'لوكا مودريتش', en: 'Luka Modrić', sub: 'football_players' },
    { ar: 'توني كروس', en: 'Toni Kroos', sub: 'football_players' },
    { ar: 'كريم بنزيما', en: 'Karim Benzema', sub: 'football_players' },
    { ar: 'رياض محرز', en: 'Riyad Mahrez', sub: 'football_players' },
    { ar: 'حكيم زياش', en: 'Hakim Ziyech', sub: 'football_players' },
    { ar: 'أشرف حكيمي', en: 'Achraf Hakimi', sub: 'football_players' },
    { ar: 'ياسين بونو', en: 'Yassine Bounou', sub: 'football_players' },
    { ar: 'ليبرون جيمس', en: 'LeBron James', sub: 'basketball' },
    { ar: 'ستيفن كاري', en: 'Stephen Curry', sub: 'basketball' },
    { ar: 'مايكل جوردان', en: 'Michael Jordan', sub: 'basketball' },
    { ar: 'كوبي براينت', en: 'Kobe Bryant', sub: 'basketball' },
    { ar: 'كيفن ديورانت', en: 'Kevin Durant', sub: 'basketball' },
    { ar: 'يوسين بولت', en: 'Usain Bolt', sub: 'athletes' },
    { ar: 'مايكل فيلبس', en: 'Michael Phelps', sub: 'athletes' },
    { ar: 'سيرينا ويليامز', en: 'Serena Williams', sub: 'athletes' },
    { ar: 'رفاييل نادال', en: 'Rafael Nadal', sub: 'athletes' },
    { ar: 'روجر فيدرير', en: 'Roger Federer', sub: 'athletes' },
    { ar: 'نوفاك دجوكوفيتش', en: 'Novak Djokovic', sub: 'athletes' },
    { ar: 'محمد علي كلاي', en: 'Muhammad Ali', sub: 'athletes' },
    { ar: 'مايك تايسون', en: 'Mike Tyson', sub: 'athletes' },
    { ar: 'ريال مدريد', en: 'Real Madrid CF', sub: 'clubs' },
    { ar: 'برشلونة', en: 'FC Barcelona', sub: 'clubs' },
    { ar: 'مانشستر يونايتد', en: 'Manchester United F.C.', sub: 'clubs' },
    { ar: 'ليفربول', en: 'Liverpool F.C.', sub: 'clubs' },
    { ar: 'بايرن ميونخ', en: 'FC Bayern Munich', sub: 'clubs' },
    { ar: 'يوفنتوس', en: 'Juventus F.C.', sub: 'clubs' },
    { ar: 'ميلان', en: 'AC Milan', sub: 'clubs' },
    { ar: 'إنتر ميلان', en: 'Inter Milan', sub: 'clubs' },
    { ar: 'أرسنال', en: 'Arsenal F.C.', sub: 'clubs' },
    { ar: 'تشيلسي', en: 'Chelsea F.C.', sub: 'clubs' },
    { ar: 'مانشستر سيتي', en: 'Manchester City F.C.', sub: 'clubs' },
    { ar: 'باريس سان جيرمان', en: 'Paris Saint-Germain F.C.', sub: 'clubs' },
    { ar: 'الهلال السعودي', en: 'Al Hilal SFC', sub: 'clubs' },
    { ar: 'النصر السعودي', en: 'Al Nassr FC', sub: 'clubs' },
    { ar: 'الاتحاد السعودي', en: 'Al-Ittihad Club (Jeddah)', sub: 'clubs' },
    { ar: 'الأهلي المصري', en: 'Al Ahly SC', sub: 'clubs' },
    { ar: 'منتخب البرازيل', en: 'Brazil national football team', sub: 'national_teams' },
    { ar: 'منتخب الأرجنتين', en: 'Argentina national football team', sub: 'national_teams' },
    { ar: 'منتخب فرنسا', en: 'France national football team', sub: 'national_teams' },
    { ar: 'منتخب ألمانيا', en: 'Germany national football team', sub: 'national_teams' },
    { ar: 'منتخب إسبانيا', en: 'Spain national football team', sub: 'national_teams' },
    { ar: 'منتخب إيطاليا', en: 'Italy national football team', sub: 'national_teams' },
    { ar: 'منتخب إنجلترا', en: 'England national football team', sub: 'national_teams' },
    { ar: 'منتخب البرتغال', en: 'Portugal national football team', sub: 'national_teams' },
    { ar: 'منتخب المغرب', en: 'Morocco national football team', sub: 'national_teams' },
    { ar: 'منتخب السعودية', en: 'Saudi Arabia national football team', sub: 'national_teams' },
    { ar: 'منتخب مصر', en: 'Egypt national football team', sub: 'national_teams' },
    { ar: 'منتخب الجزائر', en: 'Algeria national football team', sub: 'national_teams' }
  ],
  places: [
    { ar: 'السعودية', flag: 'sa', sub: 'countries' }, { ar: 'مصر', flag: 'eg', sub: 'countries' }, { ar: 'الإمارات', flag: 'ae', sub: 'countries' }, { ar: 'المغرب', flag: 'ma', sub: 'countries' }, { ar: 'الجزائر', flag: 'dz', sub: 'countries' }, { ar: 'تونس', flag: 'tn', sub: 'countries' }, { ar: 'قطر', flag: 'qa', sub: 'countries' }, { ar: 'الكويت', flag: 'kw', sub: 'countries' }, { ar: 'عمان', flag: 'om', sub: 'countries' }, { ar: 'الأردن', flag: 'jo', sub: 'countries' }, { ar: 'لبنان', flag: 'lb', sub: 'countries' }, { ar: 'العراق', flag: 'iq', sub: 'countries' }, { ar: 'فلسطين', flag: 'ps', sub: 'countries' }, { ar: 'اليابان', flag: 'jp', sub: 'countries' }, { ar: 'الصين', flag: 'cn', sub: 'countries' }, { ar: 'الولايات المتحدة', flag: 'us', sub: 'countries' }, { ar: 'البرازيل', flag: 'br', sub: 'countries' }, { ar: 'الأرجنتين', flag: 'ar', sub: 'countries' }, { ar: 'فرنسا', flag: 'fr', sub: 'countries' }, { ar: 'إيطاليا', flag: 'it', sub: 'countries' }, { ar: 'إسبانيا', flag: 'es', sub: 'countries' }, { ar: 'ألمانيا', flag: 'de', sub: 'countries' }, { ar: 'بريطانيا', flag: 'gb', sub: 'countries' }, { ar: 'روسيا', flag: 'ru', sub: 'countries' }, { ar: 'كندا', flag: 'ca', sub: 'countries' },
    { ar: 'برج إيفل', en: 'Eiffel Tower', sub: 'landmarks' }, { ar: 'أهرام الجيزة', en: 'Giza pyramid complex', sub: 'landmarks' }, { ar: 'تاج محل', en: 'Taj Mahal', sub: 'landmarks' }, { ar: 'تمثال الحرية', en: 'Statue of Liberty', sub: 'landmarks' }, { ar: 'الكولوسيوم', en: 'Colosseum', sub: 'landmarks' }, { ar: 'سور الصين العظيم', en: 'Great Wall of China', sub: 'landmarks' }, { ar: 'برج خليفة', en: 'Burj Khalifa', sub: 'landmarks' }, { ar: 'ماتشو بيتشو', en: 'Machu Picchu', sub: 'landmarks' }, { ar: 'ستونهنج', en: 'Stonehenge', sub: 'landmarks' }, { ar: 'الكعبة', en: 'Kaaba', sub: 'landmarks' }, { ar: 'المسجد الأقصى', en: 'Al-Aqsa', sub: 'landmarks' }, { ar: 'ساعة بيغ بن', en: 'Big Ben', sub: 'landmarks' },
    { ar: 'نيويورك', en: 'New York City', sub: 'cities' }, { ar: 'لندن', en: 'London', sub: 'cities' }, { ar: 'باريس', en: 'Paris', sub: 'cities' }, { ar: 'طوكيو', en: 'Tokyo', sub: 'cities' }, { ar: 'دبي', en: 'Dubai', sub: 'cities' }, { ar: 'الرياض', en: 'Riyadh', sub: 'cities' }, { ar: 'مكة', en: 'Mecca', sub: 'cities' }, { ar: 'إسطنبول', en: 'Istanbul', sub: 'cities' }
  ],
  food: [
    { ar: 'بيتزا', en: 'Pizza', sub: 'fast_food' }, { ar: 'هامبرغر', en: 'Hamburger', sub: 'fast_food' }, { ar: 'شاورما', en: 'Shawarma', sub: 'fast_food' }, { ar: 'بطاطا مقلية', en: 'French fries', sub: 'fast_food' }, { ar: 'تاكو', en: 'Taco', sub: 'fast_food' }, { ar: 'هوت دوغ', en: 'Hot dog', sub: 'fast_food' }, { ar: 'فلافل', en: 'Falafel', sub: 'fast_food' }, { ar: 'دجاج مقلي', en: 'Fried chicken', sub: 'fast_food' }, { ar: 'كرواسون', en: 'Croissant', sub: 'fast_food' }, 
    { ar: 'سوشي', en: 'Sushi', sub: 'dishes' }, { ar: 'معكرونة', en: 'Pasta', sub: 'dishes' }, { ar: 'شريحة لحم', en: 'Steak', sub: 'dishes' }, { ar: 'رامن', en: 'Ramen', sub: 'dishes' }, { ar: 'كباب', en: 'Kebab', sub: 'dishes' }, { ar: 'كسكس', en: 'Couscous', sub: 'dishes' }, { ar: 'كبسة', en: 'Kabsa', sub: 'dishes' }, { ar: 'برياني', en: 'Biryani', sub: 'dishes' }, { ar: 'منسف', en: 'Mansaf', sub: 'dishes' }, { ar: 'محشي', en: 'Dolma', sub: 'dishes' }, { ar: 'طاجين', en: 'Tajine', sub: 'dishes' }, { ar: 'حمص', en: 'Hummus', sub: 'dishes' },
    { ar: 'تفاح', en: 'Apple', sub: 'fruits' }, { ar: 'موز', en: 'Banana', sub: 'fruits' }, { ar: 'برتقال', en: 'Orange (fruit)', sub: 'fruits' }, { ar: 'فراولة', en: 'Strawberry', sub: 'fruits' }, { ar: 'بطيخ', en: 'Watermelon', sub: 'fruits' }, { ar: 'أناناس', en: 'Pineapple', sub: 'fruits' }, { ar: 'مانجو', en: 'Mango', sub: 'fruits' }, { ar: 'عنب', en: 'Grape', sub: 'fruits' }, { ar: 'خوخ', en: 'Peach', sub: 'fruits' }, { ar: 'كرز', en: 'Cherry', sub: 'fruits' }, { ar: 'رمان', en: 'Pomegranate', sub: 'fruits' }, { ar: 'أفوكادو', en: 'Avocado', sub: 'fruits' },
    { ar: 'مثلجات', en: 'Ice cream', sub: 'sweets' }, { ar: 'دونات', en: 'Doughnut', sub: 'sweets' }, { ar: 'شوكولاتة', en: 'Chocolate', sub: 'sweets' }, { ar: 'كعك', en: 'Cake', sub: 'sweets' }, { ar: 'كنافة', en: 'Knafeh', sub: 'sweets' }, { ar: 'بقلاوة', en: 'Baklava', sub: 'sweets' }, { ar: 'تشيزكيك', en: 'Cheesecake', sub: 'sweets' }, { ar: 'بان كيك', en: 'Pancake', sub: 'sweets' }, { ar: 'تيراميسو', en: 'Tiramisu', sub: 'sweets' }
  ],
  animals: [
    { ar: 'أسد', en: 'Lion', sub: 'wild' }, { ar: 'نمر', en: 'Tiger', sub: 'wild' }, { ar: 'فيل', en: 'Elephant', sub: 'wild' }, { ar: 'زرافة', en: 'Giraffe', sub: 'wild' }, { ar: 'قرد', en: 'Monkey', sub: 'wild' }, { ar: 'ذئب', en: 'Wolf', sub: 'wild' }, { ar: 'دب', en: 'Bear', sub: 'wild' }, { ar: 'ثعلب', en: 'Fox', sub: 'wild' }, { ar: 'غزال', en: 'Deer', sub: 'wild' }, { ar: 'تمساح', en: 'Crocodile', sub: 'wild' }, { ar: 'وحيد القرن', en: 'Rhinoceros', sub: 'wild' }, { ar: 'فرس النهر', en: 'Hippopotamus', sub: 'wild' }, { ar: 'غوريلا', en: 'Gorilla', sub: 'wild' }, { ar: 'كنغر', en: 'Kangaroo', sub: 'wild' }, { ar: 'حمار وحشي', en: 'Zebra', sub: 'wild' }, { ar: 'فهد', en: 'Cheetah', sub: 'wild' },
    { ar: 'قط', en: 'Cat', sub: 'pets' }, { ar: 'كلب', en: 'Dog', sub: 'pets' }, { ar: 'أرنب', en: 'Rabbit', sub: 'pets' }, { ar: 'حصان', en: 'Horse', sub: 'pets' }, { ar: 'بقرة', en: 'Cattle', sub: 'pets' }, { ar: 'خروف', en: 'Sheep', sub: 'pets' }, { ar: 'ماعز', en: 'Goat', sub: 'pets' }, { ar: 'دجاجة', en: 'Chicken', sub: 'pets' }, { ar: 'بطة', en: 'Duck', sub: 'pets' },
    { ar: 'نسر', en: 'Eagle', sub: 'birds' }, { ar: 'بطريق', en: 'Penguin', sub: 'birds' }, { ar: 'بومة', en: 'Owl', sub: 'birds' }, { ar: 'نعامة', en: 'Ostrich', sub: 'birds' }, { ar: 'ببغاء', en: 'Parrot', sub: 'birds' }, { ar: 'طاووس', en: 'Peafowl', sub: 'birds' }, { ar: 'حمامة', en: 'Columbidae', sub: 'birds' },
    { ar: 'دلفين', en: 'Dolphin', sub: 'marine' }, { ar: 'قرش', en: 'Shark', sub: 'marine' }, { ar: 'حوت', en: 'Whale', sub: 'marine' }, { ar: 'أخطبوط', en: 'Octopus', sub: 'marine' }, { ar: 'حصان البحر', en: 'Seahorse', sub: 'marine' }, { ar: 'نجم البحر', en: 'Starfish', sub: 'marine' }, { ar: 'سرطان البحر', en: 'Crab', sub: 'marine' }, { ar: 'سلحفاة بحرية', en: 'Sea turtle', sub: 'marine' }, { ar: 'قنديل البحر', en: 'Jellyfish', sub: 'marine' }
  ],
  cars: [
    { ar: 'تويوتا', en: 'Toyota Corolla', sub: 'brands' }, { ar: 'هوندا', en: 'Honda Civic', sub: 'brands' }, { ar: 'نيسان', en: 'Nissan GT-R', sub: 'brands' }, { ar: 'فورد', en: 'Ford Mustang', sub: 'brands' }, { ar: 'شيفروليه', en: 'Chevrolet Camaro', sub: 'brands' }, { ar: 'جيب', en: 'Jeep Wrangler', sub: 'brands' }, { ar: 'بي إم دبليو', en: 'BMW M3', sub: 'brands' }, { ar: 'مرسيدس-بنز', en: 'Mercedes-Benz S-Class', sub: 'brands' }, { ar: 'أودي', en: 'Audi R8', sub: 'brands' }, { ar: 'فولكس فاجن', en: 'Volkswagen Golf', sub: 'brands' }, { ar: 'بورشه', en: 'Porsche 911', sub: 'brands' }, { ar: 'فيراري', en: 'Ferrari 458', sub: 'brands' }, { ar: 'لامبورغيني', en: 'Lamborghini Aventador', sub: 'brands' }, { ar: 'مازيراتي', en: 'Maserati GranTurismo', sub: 'brands' }, { ar: 'بوغاتي', en: 'Bugatti Veyron', sub: 'brands' }, { ar: 'ماكلارين', en: 'McLaren P1', sub: 'brands' }, { ar: 'رولز رويس', en: 'Rolls-Royce Phantom VIII', sub: 'brands' }, { ar: 'بنتلي', en: 'Bentley Continental GT', sub: 'brands' }, { ar: 'أستون مارتن', en: 'Aston Martin DB11', sub: 'brands' }, { ar: 'تسلا', en: 'Tesla Model S', sub: 'brands' }, { ar: 'لاند روفر', en: 'Range Rover', sub: 'brands' }, { ar: 'جاغوار', en: 'Jaguar F-Type', sub: 'brands' }, { ar: 'لكزس', en: 'Lexus LFA', sub: 'brands' }, { ar: 'هيونداي', en: 'Hyundai Sonata', sub: 'brands' }, { ar: 'كيا', en: 'Kia Stinger', sub: 'brands' }, { ar: 'مازدا', en: 'Mazda MX-5', sub: 'brands' }, { ar: 'ميتسوبيشي', en: 'Mitsubishi Lancer Evolution', sub: 'brands' }, { ar: 'سوبارو', en: 'Subaru Impreza', sub: 'brands' }, { ar: 'سوزوكي', en: 'Suzuki Swift', sub: 'brands' }, { ar: 'فولفو', en: 'Volvo XC90', sub: 'brands' }, { ar: 'دودج', en: 'Dodge Challenger', sub: 'brands' }, { ar: 'كرايسلر', en: 'Chrysler 300', sub: 'brands' }, { ar: 'كاديلاك', en: 'Cadillac Escalade', sub: 'brands' }, { ar: 'جي إم سي', en: 'GMC Sierra', sub: 'brands' }, { ar: 'لينكولن', en: 'Lincoln Navigator', sub: 'brands' }, { ar: 'رينو', en: 'Renault Clio', sub: 'brands' }, { ar: 'بيجو', en: 'Peugeot 208', sub: 'brands' }, { ar: 'سيتروين', en: 'Citroën C3', sub: 'brands' }, { ar: 'فيات', en: 'Fiat 500', sub: 'brands' }, { ar: 'ألفا روميو', en: 'Alfa Romeo Giulia', sub: 'brands' }, { ar: 'ميني', en: 'Mini Hatch', sub: 'brands' }
  ],
  tech: [
    { ar: 'آيفون', en: 'IPhone', sub: 'devices' }, { ar: 'آيباد', en: 'IPad', sub: 'devices' }, { ar: 'حاسوب محمول', en: 'Laptop', sub: 'devices' }, { ar: 'ساعة ذكية', en: 'Smartwatch', sub: 'devices' }, { ar: 'سماعات رأس', en: 'Headphones', sub: 'devices' }, { ar: 'تلفاز', en: 'Television', sub: 'devices' }, { ar: 'كاميرا', en: 'Camera', sub: 'devices' }, { ar: 'فأرة حاسوب', en: 'Computer mouse', sub: 'devices' }, { ar: 'لوحة مفاتيح', en: 'Computer keyboard', sub: 'devices' }, { ar: 'شاحن بطارية', en: 'Battery charger', sub: 'devices' }, { ar: 'راوتر', en: 'Router (computing)', sub: 'devices' }, { ar: 'ميكروفون', en: 'Microphone', sub: 'devices' }, { ar: 'طابعة', en: 'Printer (computing)', sub: 'devices' }, { ar: 'شاشة حاسوب', en: 'Computer monitor', sub: 'devices' }, { ar: 'بلايستيشن', en: 'PlayStation', sub: 'devices' }, { ar: 'إكس بوكس', en: 'Xbox', sub: 'devices' }, { ar: 'طائرة بدون طيار', en: 'Unmanned aerial vehicle', sub: 'devices' }, { ar: 'نظارة واقع افتراضي', en: 'Virtual reality headset', sub: 'devices' }, { ar: 'قرص صلب', en: 'Hard disk drive', sub: 'devices' },
    { ar: 'يوتيوب', en: 'YouTube', sub: 'apps' }, { ar: 'إنستغرام', en: 'Instagram', sub: 'apps' }, { ar: 'واتساب', en: 'WhatsApp', sub: 'apps' }, { ar: 'تيك توك', en: 'TikTok', sub: 'apps' }, { ar: 'فيسبوك', en: 'Facebook', sub: 'apps' }, { ar: 'تويتر', en: 'Twitter', sub: 'apps' }, { ar: 'سناب شات', en: 'Snapchat', sub: 'apps' }, { ar: 'تيليجرام', en: 'Telegram (software)', sub: 'apps' }, { ar: 'سبوتيفاي', en: 'Spotify', sub: 'apps' }, { ar: 'نتفليكس', en: 'Netflix', sub: 'apps' }, { ar: 'جوجل ماب', en: 'Google Maps', sub: 'apps' }, { ar: 'أوبر', en: 'Uber', sub: 'apps' }, { ar: 'زوم', en: 'Zoom Video Communications', sub: 'apps' },
    { ar: 'أبل', en: 'Apple Inc.', sub: 'brands' }, { ar: 'جوجل', en: 'Google', sub: 'brands' }, { ar: 'سامسونج', en: 'Samsung', sub: 'brands' }, { ar: 'مايكروسوفت', en: 'Microsoft', sub: 'brands' }, { ar: 'سوني', en: 'Sony', sub: 'brands' }, { ar: 'إل جي', en: 'LG Electronics', sub: 'brands' }, { ar: 'هواوي', en: 'Huawei', sub: 'brands' }, { ar: 'شاومي', en: 'Xiaomi', sub: 'brands' }, { ar: 'إنتل', en: 'Intel', sub: 'brands' }, { ar: 'أمازون', en: 'Amazon (company)', sub: 'brands' }
  ],
  games: [
    { ar: 'ماينكرافت', en: 'Minecraft', sub: 'video_games' }, { ar: 'جراند ثفت أوتو V', en: 'Grand Theft Auto V', sub: 'video_games' }, { ar: 'فيفا 24', en: 'EA Sports FC 24', sub: 'video_games' }, { ar: 'فورتنايت', en: 'Fortnite', sub: 'video_games' }, { ar: 'روبلوكس', en: 'Roblox', sub: 'video_games' }, { ar: 'كول أوف ديوتي', en: 'Call of Duty', sub: 'video_games' }, { ar: 'ببجي', en: 'PUBG: Battlegrounds', sub: 'video_games' }, { ar: 'ليغ أوف ليجيندز', en: 'League of Legends', sub: 'video_games' }, { ar: 'أوفرواتش', en: 'Overwatch (video game)', sub: 'video_games' }, { ar: 'فالورانت', en: 'Valorant', sub: 'video_games' }, { ar: 'سوبر ماريو أوديسي', en: 'Super Mario Odyssey', sub: 'video_games' }, { ar: 'ذا ليجند أوف زيلدا', en: 'The Legend of Zelda: Breath of the Wild', sub: 'video_games' }, { ar: 'بوكيمون', en: 'Pokémon', sub: 'video_games' }, { ar: 'سونيك', en: 'Sonic the Hedgehog', sub: 'video_games' }, { ar: 'أمونغ آس', en: 'Among Us', sub: 'video_games' }, { ar: 'غود أوف وور', en: 'God of War (2018 video game)', sub: 'video_games' }, { ar: 'ريد ديد ريدمبشن 2', en: 'Red Dead Redemption 2', sub: 'video_games' }, { ar: 'ذا ويتشر 3', en: 'The Witcher 3: Wild Hunt', sub: 'video_games' }, { ar: 'مورتال كومبات', en: 'Mortal Kombat', sub: 'video_games' }, { ar: 'تيكن', en: 'Tekken', sub: 'video_games' }, { ar: 'ستريت فايتر', en: 'Street Fighter', sub: 'video_games' }, { ar: 'أبيكس ليجندز', en: 'Apex Legends', sub: 'video_games' }, { ar: 'دوتا 2', en: 'Dota 2', sub: 'video_games' }, { ar: 'كاونتر سترايك', en: 'Counter-Strike 2', sub: 'video_games' }, { ar: 'ذا سيمز', en: 'The Sims', sub: 'video_games' }, { ar: 'أنيمال كروسينغ', en: 'Animal Crossing', sub: 'video_games' }, { ar: 'تيراريا', en: 'Terraria', sub: 'video_games' }, { ar: 'ستارديو فالي', en: 'Stardew Valley', sub: 'video_games' }, { ar: 'هيلو', en: 'Halo (franchise)', sub: 'video_games' }, { ar: 'ديابلو', en: 'Diablo (franchise)', sub: 'video_games' }, { ar: 'وورلد أوف ووركرافت', en: 'World of Warcraft', sub: 'video_games' }, { ar: 'فاينل فانتسي', en: 'Final Fantasy', sub: 'video_games' }, { ar: 'ريزدنت إيفل', en: 'Resident Evil', sub: 'video_games' }, { ar: 'سايلنت هيل', en: 'Silent Hill', sub: 'video_games' }, { ar: 'كراش بانديكوت', en: 'Crash Bandicoot', sub: 'video_games' }, { ar: 'تومب رايدر', en: 'Tomb Raider', sub: 'video_games' }, { ar: 'سوبر سماش برذرز', en: 'Super Smash Bros.', sub: 'video_games' }, { ar: 'ماريو كارت 8', en: 'Mario Kart 8', sub: 'video_games' }, { ar: 'بلودبورن', en: 'Bloodborne', sub: 'video_games' }, { ar: 'دارك سولز', en: 'Dark Souls', sub: 'video_games' }, { ar: 'إلدن رينغ', en: 'Elden Ring', sub: 'video_games' }
  ],
  entertainment: [
    { ar: 'هاري بوتر', en: 'Harry Potter', sub: 'characters' }, { ar: 'الرجل الحديدي', en: 'Iron Man', sub: 'characters' }, { ar: 'الجوكر', en: 'Joker (character)', sub: 'characters' }, { ar: 'باتمان', en: 'Batman', sub: 'characters' }, { ar: 'الرجل العنكبوت', en: 'Spider-Man', sub: 'characters' }, { ar: 'سوبرمان', en: 'Superman', sub: 'characters' }, { ar: 'كابتن أمريكا', en: 'Captain America', sub: 'characters' }, { ar: 'ثور', en: 'Thor (Marvel Comics)', sub: 'characters' }, { ar: 'هالك', en: 'Hulk', sub: 'characters' }, { ar: 'ديدبول', en: 'Deadpool', sub: 'characters' }, { ar: 'وندر وومان', en: 'Wonder Woman', sub: 'characters' }, { ar: 'أكوامان', en: 'Aquaman', sub: 'characters' }, { ar: 'فلاش', en: 'Flash (DC Comics character)', sub: 'characters' }, { ar: 'جيمس بوند', en: 'James Bond', sub: 'characters' }, { ar: 'إنديانا جونز', en: 'Indiana Jones', sub: 'characters' }, { ar: 'لوك سكاي ووكر', en: 'Luke Skywalker', sub: 'characters' }, { ar: 'دارث فيدر', en: 'Darth Vader', sub: 'characters' }, { ar: 'يودا', en: 'Yoda', sub: 'characters' }, { ar: 'شيرلوك هولمز', en: 'Sherlock Holmes', sub: 'characters' }, { ar: 'دراكولا', en: 'Dracula', sub: 'characters' }, { ar: 'فرانكنشتاين', en: 'Frankenstein\'s monster', sub: 'characters' }, { ar: 'غودزيلا', en: 'Godzilla', sub: 'characters' }, { ar: 'كينغ كونغ', en: 'King Kong', sub: 'characters' }, { ar: 'سبونج بوب', en: 'SpongeBob SquarePants (character)', sub: 'characters' }, { ar: 'ميكي ماوس', en: 'Mickey Mouse', sub: 'characters' }, { ar: 'دونالد داك', en: 'Donald Duck', sub: 'characters' }, { ar: 'هومر سيمبسون', en: 'Homer Simpson', sub: 'characters' }, { ar: 'بيتر غريفين', en: 'Peter Griffin', sub: 'characters' }, { ar: 'ناروتو', en: 'Naruto Uzumaki', sub: 'characters' }, { ar: 'غوكو', en: 'Goku', sub: 'characters' }, { ar: 'لوفي', en: 'Monkey D. Luffy', sub: 'characters' }, { ar: 'إرين ييغر', en: 'Eren Yeager', sub: 'characters' }, { ar: 'سايتاما', en: 'Saitama (One Punch Man)', sub: 'characters' }, { ar: 'سونغ جين وو', en: 'Solo Leveling', sub: 'characters' }, { ar: 'تانجيرو', en: 'Tanjiro Kamado', sub: 'characters' }, { ar: 'غوجو ساتورو', en: 'Satoru Gojo', sub: 'characters' }, { ar: 'ليفاي أكرمان', en: 'Levi Ackerman', sub: 'characters' }, { ar: 'إدوارد إلريك', en: 'Edward Elric', sub: 'characters' }, { ar: 'لايت ياغامي', en: 'Light Yagami', sub: 'characters' }, { ar: 'وولفرين', en: 'Wolverine (character)', sub: 'characters' }, { ar: 'فينوم', en: 'Venom (Marvel Comics character)', sub: 'characters' }
  ],
  everyday: [
    { ar: 'كرسي', en: 'Chair', sub: 'objects' }, { ar: 'طاولة', en: 'Table (furniture)', sub: 'objects' }, { ar: 'سرير', en: 'Bed', sub: 'objects' }, { ar: 'مفتاح', en: 'Key', sub: 'objects' }, { ar: 'حذاء', en: 'Shoe', sub: 'objects' }, { ar: 'ساعة حائط', en: 'Clock', sub: 'objects' }, { ar: 'كتاب', en: 'Book', sub: 'objects' }, { ar: 'قلم', en: 'Pen', sub: 'objects' }, { ar: 'نظارة', en: 'Glasses', sub: 'objects' }, { ar: 'فرشاة أسنان', en: 'Toothbrush', sub: 'objects' }, { ar: 'باب', en: 'Door', sub: 'objects' }, { ar: 'نافذة', en: 'Window', sub: 'objects' }, { ar: 'صحن', en: 'Plate (dishware)', sub: 'objects' }, { ar: 'كوب', en: 'Cup', sub: 'objects' }, { ar: 'ملعقة', en: 'Spoon', sub: 'objects' }, { ar: 'شوكة', en: 'Fork', sub: 'objects' }, { ar: 'سكين', en: 'Knife', sub: 'objects' }, { ar: 'وسادة', en: 'Pillow', sub: 'objects' }, { ar: 'مرآة', en: 'Mirror', sub: 'objects' }, { ar: 'مقص', en: 'Scissors', sub: 'objects' }, { ar: 'مشط', en: 'Comb', sub: 'objects' }, { ar: 'صابون', en: 'Soap', sub: 'objects' }, { ar: 'شامبو', en: 'Shampoo', sub: 'objects' }, { ar: 'منشفة', en: 'Towel', sub: 'objects' }, { ar: 'ورق تواليت', en: 'Toilet paper', sub: 'objects' }, { ar: 'مكنسة', en: 'Broom', sub: 'objects' }, { ar: 'ممسحة', en: 'Mop', sub: 'objects' }, { ar: 'مكواة', en: 'Clothes iron', sub: 'objects' }, { ar: 'غسالة', en: 'Washing machine', sub: 'objects' }, { ar: 'ثلاجة', en: 'Refrigerator', sub: 'objects' }, { ar: 'فرن', en: 'Oven', sub: 'objects' }, { ar: 'ميكروويف', en: 'Microwave oven', sub: 'objects' }, { ar: 'خلاط', en: 'Blender', sub: 'objects' }, { ar: 'مظلة', en: 'Umbrella', sub: 'objects' }, { ar: 'حقيبة', en: 'Bag', sub: 'objects' }, { ar: 'محفظة', en: 'Wallet', sub: 'objects' }, { ar: 'حزام', en: 'Belt (clothing)', sub: 'objects' }, { ar: 'قبعة', en: 'Hat', sub: 'objects' }, { ar: 'قفاز', en: 'Glove', sub: 'objects' }, { ar: 'جوارب', en: 'Sock', sub: 'objects' }, { ar: 'مصباح', en: 'Lamp', sub: 'objects' }
  ]
};

const reqOptions = {
  headers: {
    'User-Agent': 'MinAnaGame/1.1 (aymanemadride09@gmail.com) Node.js'
  }
};

function fetchWikiEnSearch(title) {
  return new Promise((resolve) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&utf8=&format=json`;
    https.get(searchUrl, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.search && json.query.search.length > 0) {
             const bestTitle = json.query.search[0].title;
             const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestTitle)}&prop=pageimages&format=json&pithumbsize=1000`;
             https.get(imgUrl, reqOptions, (res2) => {
               let data2 = '';
               res2.on('data', chunk => data2 += chunk);
               res2.on('end', () => {
                 try {
                   const json2 = JSON.parse(data2);
                   const pages = json2.query?.pages;
                   if (pages) {
                     const pageId = Object.keys(pages)[0];
                     const img = pages[pageId]?.thumbnail?.source;
                     resolve(img ? img.split('?')[0] : null);
                   } else resolve(null);
                 } catch (e) { resolve(null); }
               });
             }).on('error', () => resolve(null));
          } else resolve(null);
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function fetchWikiEnImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
    https.get(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            const img = pages[pageId]?.thumbnail?.source;
            if (img) {
              resolve(img.split('?')[0]);
            } else {
              fetchWikiEnSearch(title).then(resolve);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const finalItems = [];
  let counter = 1;

  for (const [catId, arr] of Object.entries(dbMap)) {
    for (const item of arr) {
      let imageUrl = null;
      
      if (item.flag) {
        imageUrl = `https://flagcdn.com/w1280/${item.flag}.png`;
      } else if (item.en) {
        imageUrl = await fetchWikiEnImage(item.en);
      }
      
      if (!imageUrl) {
        console.log(`Failed for ${item.ar} (${item.en})`);
        imageUrl = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"; // fallback
      }

      finalItems.push({
        id: `item_${counter++}`,
        name: item.ar,
        categoryId: catId,
        subcategoryId: item.sub,
        difficulty: 'medium',
        image: imageUrl,
        fallbackImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
        keywords: [item.ar]
      });
      
      await delay(50);
    }
  }

  const fileContent = `import { Item } from '../types';\n\nexport const items: Item[] = ${JSON.stringify(finalItems, null, 2)};\n`;
  fs.writeFileSync('src/data/items.ts', fileContent);
  console.log(`Successfully generated ${finalItems.length} items!`);
}

run();
