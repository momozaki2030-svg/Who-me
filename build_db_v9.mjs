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
    { ar: 'زين الدين زيدان', en: 'Zinedine Zidane', sub: 'football_players' },
    { ar: 'دييغو مارادونا', en: 'Diego Maradona', sub: 'football_players' },
    { ar: 'بيليه', en: 'Pelé', sub: 'football_players' },
    { ar: 'رونالدينيو', en: 'Ronaldinho', sub: 'football_players' },
    { ar: 'تييري هنري', en: 'Thierry Henry', sub: 'football_players' },
    { ar: 'أندريس إنييستا', en: 'Andrés Iniesta', sub: 'football_players' },
    { ar: 'تشافي هيرنانديز', en: 'Xavi', sub: 'football_players' },
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
    { ar: 'حبيب نورمحمدوف', en: 'Khabib Nurmagomedov', sub: 'athletes' },
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
    { ar: 'بروسيا دورتموند', en: 'Borussia Dortmund', sub: 'clubs' },
    { ar: 'أتلتيكو مدريد', en: 'Atlético Madrid', sub: 'clubs' },
    { ar: 'الهلال السعودي', en: 'Al Hilal SFC', sub: 'clubs' },
    { ar: 'النصر السعودي', en: 'Al Nassr FC', sub: 'clubs' },
    { ar: 'الاتحاد السعودي', en: 'Al-Ittihad Club (Jeddah)', sub: 'clubs' },
    { ar: 'الأهلي السعودي', en: 'Al-Ahli Saudi FC', sub: 'clubs' },
    { ar: 'الشباب السعودي', en: 'Al Shabab FC (Riyadh)', sub: 'clubs' },
    { ar: 'الأهلي المصري', en: 'Al Ahly SC', sub: 'clubs' },
    { ar: 'الزمالك', en: 'Zamalek SC', sub: 'clubs' },
    { ar: 'الرجاء المغربي', en: 'Raja CA', sub: 'clubs' },
    { ar: 'الوداد المغربي', en: 'Wydad AC', sub: 'clubs' },
    { ar: 'الترجي التونسي', en: 'Espérance Sportive de Tunis', sub: 'clubs' },
    { ar: 'العين الإماراتي', en: 'Al Ain FC', sub: 'clubs' },
    { ar: 'السد القطري', en: 'Al Sadd SC', sub: 'clubs' },
    { ar: 'منتخب البرازيل', en: 'Brazil national football team', sub: 'national_teams' },
    { ar: 'منتخب الأرجنتين', en: 'Argentina national football team', sub: 'national_teams' },
    { ar: 'منتخب فرنسا', en: 'France national football team', sub: 'national_teams' },
    { ar: 'منتخب ألمانيا', en: 'Germany national football team', sub: 'national_teams' },
    { ar: 'منتخب إسبانيا', en: 'Spain national football team', sub: 'national_teams' },
    { ar: 'منتخب إيطاليا', en: 'Italy national football team', sub: 'national_teams' },
    { ar: 'منتخب إنجلترا', en: 'England national football team', sub: 'national_teams' },
    { ar: 'منتخب البرتغال', en: 'Portugal national football team', sub: 'national_teams' },
    { ar: 'منتخب هولندا', en: 'Netherlands national football team', sub: 'national_teams' },
    { ar: 'منتخب بلجيكا', en: 'Belgium national football team', sub: 'national_teams' },
    { ar: 'منتخب كرواتيا', en: 'Croatia national football team', sub: 'national_teams' },
    { ar: 'منتخب الأوروغواي', en: 'Uruguay national football team', sub: 'national_teams' },
    { ar: 'منتخب المغرب', en: 'Morocco national football team', sub: 'national_teams' },
    { ar: 'منتخب السعودية', en: 'Saudi Arabia national football team', sub: 'national_teams' },
    { ar: 'منتخب مصر', en: 'Egypt national football team', sub: 'national_teams' },
    { ar: 'منتخب الجزائر', en: 'Algeria national football team', sub: 'national_teams' },
    { ar: 'منتخب تونس', en: 'Tunisia national football team', sub: 'national_teams' },
    { ar: 'منتخب قطر', en: 'Qatar national football team', sub: 'national_teams' },
    { ar: 'منتخب الإمارات', en: 'United Arab Emirates national football team', sub: 'national_teams' },
    { ar: 'منتخب العراق', en: 'Iraq national football team', sub: 'national_teams' },
    { ar: 'منتخب اليابان', en: 'Japan national football team', sub: 'national_teams' },
    { ar: 'منتخب كوريا الجنوبية', en: 'South Korea national football team', sub: 'national_teams' },
    { ar: 'منتخب السنغال', en: 'Senegal national football team', sub: 'national_teams' },
    { ar: 'منتخب المكسيك', en: 'Mexico national football team', sub: 'national_teams' },
    { ar: 'منتخب أمريكا', en: 'United States men\'s national soccer team', sub: 'national_teams' }
  ],
  places: [
    { ar: 'السعودية', flag: 'sa', sub: 'countries' }, { ar: 'مصر', flag: 'eg', sub: 'countries' }, { ar: 'الإمارات', flag: 'ae', sub: 'countries' }, { ar: 'المغرب', flag: 'ma', sub: 'countries' }, { ar: 'الجزائر', flag: 'dz', sub: 'countries' }, { ar: 'تونس', flag: 'tn', sub: 'countries' }, { ar: 'قطر', flag: 'qa', sub: 'countries' }, { ar: 'الكويت', flag: 'kw', sub: 'countries' }, { ar: 'عمان', flag: 'om', sub: 'countries' }, { ar: 'الأردن', flag: 'jo', sub: 'countries' }, { ar: 'لبنان', flag: 'lb', sub: 'countries' }, { ar: 'العراق', flag: 'iq', sub: 'countries' }, { ar: 'فلسطين', flag: 'ps', sub: 'countries' }, { ar: 'اليابان', flag: 'jp', sub: 'countries' }, { ar: 'الصين', flag: 'cn', sub: 'countries' }, { ar: 'الولايات المتحدة', flag: 'us', sub: 'countries' }, { ar: 'البرازيل', flag: 'br', sub: 'countries' }, { ar: 'الأرجنتين', flag: 'ar', sub: 'countries' }, { ar: 'فرنسا', flag: 'fr', sub: 'countries' }, { ar: 'إيطاليا', flag: 'it', sub: 'countries' }, { ar: 'إسبانيا', flag: 'es', sub: 'countries' }, { ar: 'ألمانيا', flag: 'de', sub: 'countries' }, { ar: 'بريطانيا', flag: 'gb', sub: 'countries' }, { ar: 'روسيا', flag: 'ru', sub: 'countries' }, { ar: 'كندا', flag: 'ca', sub: 'countries' }, { ar: 'الهند', flag: 'in', sub: 'countries' }, { ar: 'أستراليا', flag: 'au', sub: 'countries' }, { ar: 'المكسيك', flag: 'mx', sub: 'countries' }, { ar: 'كوريا الجنوبية', flag: 'kr', sub: 'countries' }, { ar: 'تركيا', flag: 'tr', sub: 'countries' },
    { ar: 'برج إيفل', en: 'Eiffel Tower', sub: 'landmarks' }, { ar: 'أهرام الجيزة', en: 'Giza pyramid complex', sub: 'landmarks' }, { ar: 'تاج محل', en: 'Taj Mahal', sub: 'landmarks' }, { ar: 'تمثال الحرية', en: 'Statue of Liberty', sub: 'landmarks' }, { ar: 'الكولوسيوم', en: 'Colosseum', sub: 'landmarks' }, { ar: 'سور الصين العظيم', en: 'Great Wall of China', sub: 'landmarks' }, { ar: 'برج خليفة', en: 'Burj Khalifa', sub: 'landmarks' }, { ar: 'ماتشو بيتشو', en: 'Machu Picchu', sub: 'landmarks' }, { ar: 'ستونهنج', en: 'Stonehenge', sub: 'landmarks' }, { ar: 'الكعبة', en: 'Kaaba', sub: 'landmarks' }, { ar: 'المسجد الأقصى', en: 'Al-Aqsa', sub: 'landmarks' }, { ar: 'ساعة بيغ بن', en: 'Big Ben', sub: 'landmarks' }, { ar: 'قبة الصخرة', en: 'Dome of the Rock', sub: 'landmarks' }, { ar: 'برج بيزا المائل', en: 'Leaning Tower of Pisa', sub: 'landmarks' }, { ar: 'دار أوبرا سيدني', en: 'Sydney Opera House', sub: 'landmarks' }, { ar: 'جبل رشمور', en: 'Mount Rushmore', sub: 'landmarks' }, { ar: 'أكروبوليس أثينا', en: 'Acropolis of Athens', sub: 'landmarks' }, { ar: 'البتراء', en: 'Petra', sub: 'landmarks' }, { ar: 'قصر الفرسان', en: 'Krak des Chevaliers', sub: 'landmarks' },
    { ar: 'نيويورك', en: 'New York City', sub: 'cities' }, { ar: 'لندن', en: 'London', sub: 'cities' }, { ar: 'باريس', en: 'Paris', sub: 'cities' }, { ar: 'طوكيو', en: 'Tokyo', sub: 'cities' }, { ar: 'دبي', en: 'Dubai', sub: 'cities' }, { ar: 'الرياض', en: 'Riyadh', sub: 'cities' }, { ar: 'مكة', en: 'Mecca', sub: 'cities' }, { ar: 'إسطنبول', en: 'Istanbul', sub: 'cities' }, { ar: 'جدة', en: 'Jeddah', sub: 'cities' }, { ar: 'القاهرة', en: 'Cairo', sub: 'cities' }, { ar: 'بغداد', en: 'Baghdad', sub: 'cities' }, { ar: 'الدار البيضاء', en: 'Casablanca', sub: 'cities' }, { ar: 'روما', en: 'Rome', sub: 'cities' }, { ar: 'مدريد', en: 'Madrid', sub: 'cities' }, { ar: 'برلين', en: 'Berlin', sub: 'cities' }, { ar: 'موسكو', en: 'Moscow', sub: 'cities' }, { ar: 'بكين', en: 'Beijing', sub: 'cities' }, { ar: 'سيدني', en: 'Sydney', sub: 'cities' }, { ar: 'ريو دي جانيرو', en: 'Rio de Janeiro', sub: 'cities' }, { ar: 'لوس أنجلوس', en: 'Los Angeles', sub: 'cities' }
  ],
  food: [
    { ar: 'بيتزا', en: 'Pizza', sub: 'fast_food' }, { ar: 'هامبرغر', en: 'Hamburger', sub: 'fast_food' }, { ar: 'شاورما', en: 'Shawarma', sub: 'fast_food' }, { ar: 'بطاطا مقلية', en: 'French fries', sub: 'fast_food' }, { ar: 'تاكو', en: 'Taco', sub: 'fast_food' }, { ar: 'هوت دوغ', en: 'Hot dog', sub: 'fast_food' }, { ar: 'فلافل', en: 'Falafel', sub: 'fast_food' }, { ar: 'دجاج مقلي', en: 'Fried chicken', sub: 'fast_food' }, { ar: 'كرواسون', en: 'Croissant', sub: 'fast_food' }, { ar: 'بوريتو', en: 'Burrito', sub: 'fast_food' }, { ar: 'ناغتس دجاج', en: 'Chicken nugget', sub: 'fast_food' }, { ar: 'حلقات بصل', en: 'Onion ring', sub: 'fast_food' },
    { ar: 'سوشي', en: 'Sushi', sub: 'dishes' }, { ar: 'معكرونة', en: 'Pasta', sub: 'dishes' }, { ar: 'شريحة لحم', en: 'Steak', sub: 'dishes' }, { ar: 'رامن', en: 'Ramen', sub: 'dishes' }, { ar: 'كباب', en: 'Kebab', sub: 'dishes' }, { ar: 'كسكس', en: 'Couscous', sub: 'dishes' }, { ar: 'كبسة', en: 'Kabsa', sub: 'dishes' }, { ar: 'برياني', en: 'Biryani', sub: 'dishes' }, { ar: 'منسف', en: 'Mansaf', sub: 'dishes' }, { ar: 'محشي', en: 'Dolma', sub: 'dishes' }, { ar: 'طاجين', en: 'Tajine', sub: 'dishes' }, { ar: 'حمص', en: 'Hummus', sub: 'dishes' }, { ar: 'مندي', en: 'Mandi (food)', sub: 'dishes' }, { ar: 'مقلوبة', en: 'Maqluba', sub: 'dishes' }, { ar: 'ملوخية', en: 'Mulukhiyah', sub: 'dishes' }, { ar: 'لازانيا', en: 'Lasagne', sub: 'dishes' }, { ar: 'حساء', en: 'Soup', sub: 'dishes' }, { ar: 'سلطة', en: 'Salad', sub: 'dishes' },
    { ar: 'تفاح', en: 'Apple', sub: 'fruits' }, { ar: 'موز', en: 'Banana', sub: 'fruits' }, { ar: 'برتقال', en: 'Orange (fruit)', sub: 'fruits' }, { ar: 'فراولة', en: 'Strawberry', sub: 'fruits' }, { ar: 'بطيخ', en: 'Watermelon', sub: 'fruits' }, { ar: 'أناناس', en: 'Pineapple', sub: 'fruits' }, { ar: 'مانجو', en: 'Mango', sub: 'fruits' }, { ar: 'عنب', en: 'Grape', sub: 'fruits' }, { ar: 'خوخ', en: 'Peach', sub: 'fruits' }, { ar: 'كرز', en: 'Cherry', sub: 'fruits' }, { ar: 'رمان', en: 'Pomegranate', sub: 'fruits' }, { ar: 'أفوكادو', en: 'Avocado', sub: 'fruits' }, { ar: 'توت أزرق', en: 'Blueberry', sub: 'fruits' }, { ar: 'ليمون', en: 'Lemon', sub: 'fruits' }, { ar: 'كيوي', en: 'Kiwifruit', sub: 'fruits' }, { ar: 'بطيخ أصفر', en: 'Cantaloupe', sub: 'fruits' }, { ar: 'طماطم', en: 'Tomato', sub: 'fruits' }, { ar: 'بصل', en: 'Onion', sub: 'fruits' }, { ar: 'ثوم', en: 'Garlic', sub: 'fruits' }, { ar: 'بطاطس', en: 'Potato', sub: 'fruits' }, { ar: 'جزر', en: 'Carrot', sub: 'fruits' }, { ar: 'خيار', en: 'Cucumber', sub: 'fruits' }, { ar: 'خس', en: 'Lettuce', sub: 'fruits' }, { ar: 'فلفل رومي', en: 'Bell pepper', sub: 'fruits' }, { ar: 'باذنجان', en: 'Eggplant', sub: 'fruits' }, { ar: 'بروكلي', en: 'Broccoli', sub: 'fruits' }, { ar: 'ذرة', en: 'Maize', sub: 'fruits' },
    { ar: 'مثلجات', en: 'Ice cream', sub: 'sweets' }, { ar: 'دونات', en: 'Doughnut', sub: 'sweets' }, { ar: 'شوكولاتة', en: 'Chocolate', sub: 'sweets' }, { ar: 'كعك', en: 'Cake', sub: 'sweets' }, { ar: 'كنافة', en: 'Knafeh', sub: 'sweets' }, { ar: 'بقلاوة', en: 'Baklava', sub: 'sweets' }, { ar: 'تشيزكيك', en: 'Cheesecake', sub: 'sweets' }, { ar: 'بان كيك', en: 'Pancake', sub: 'sweets' }, { ar: 'تيراميسو', en: 'Tiramisu', sub: 'sweets' }, { ar: 'بسكويت', en: 'Biscuit', sub: 'sweets' }, { ar: 'ماكرون', en: 'Macaron', sub: 'sweets' }, { ar: 'براوني', en: 'Chocolate brownie', sub: 'sweets' }, { ar: 'كراميل', en: 'Caramel', sub: 'sweets' }, { ar: 'كريب', en: 'Crêpe', sub: 'sweets' }, { ar: 'مهلبية', en: 'Muhallebi', sub: 'sweets' }, { ar: 'قطايف', en: 'Qatayef', sub: 'sweets' }, { ar: 'بسبوسة', en: 'Basbousa', sub: 'sweets' }
  ],
  animals: [
    { ar: 'أسد', en: 'Lion', sub: 'wild' }, { ar: 'نمر', en: 'Tiger', sub: 'wild' }, { ar: 'فيل', en: 'Elephant', sub: 'wild' }, { ar: 'زرافة', en: 'Giraffe', sub: 'wild' }, { ar: 'قرد', en: 'Monkey', sub: 'wild' }, { ar: 'ذئب', en: 'Wolf', sub: 'wild' }, { ar: 'دب', en: 'Bear', sub: 'wild' }, { ar: 'ثعلب', en: 'Fox', sub: 'wild' }, { ar: 'غزال', en: 'Deer', sub: 'wild' }, { ar: 'تمساح', en: 'Crocodile', sub: 'wild' }, { ar: 'وحيد القرن', en: 'Rhinoceros', sub: 'wild' }, { ar: 'فرس النهر', en: 'Hippopotamus', sub: 'wild' }, { ar: 'غوريلا', en: 'Gorilla', sub: 'wild' }, { ar: 'كنغر', en: 'Kangaroo', sub: 'wild' }, { ar: 'حمار وحشي', en: 'Zebra', sub: 'wild' }, { ar: 'فهد', en: 'Cheetah', sub: 'wild' }, { ar: 'باندا', en: 'Giant panda', sub: 'wild' }, { ar: 'كوالا', en: 'Koala', sub: 'wild' }, { ar: 'ضبع', en: 'Hyena', sub: 'wild' }, { ar: 'قنفذ', en: 'Hedgehog', sub: 'wild' }, { ar: 'خفاش', en: 'Bat', sub: 'wild' }, { ar: 'سنجاب', en: 'Squirrel', sub: 'wild' }, { ar: 'راكون', en: 'Raccoon', sub: 'wild' },
    { ar: 'قط', en: 'Cat', sub: 'pets' }, { ar: 'كلب', en: 'Dog', sub: 'pets' }, { ar: 'أرنب', en: 'Rabbit', sub: 'pets' }, { ar: 'حصان', en: 'Horse', sub: 'pets' }, { ar: 'بقرة', en: 'Cattle', sub: 'pets' }, { ar: 'خروف', en: 'Sheep', sub: 'pets' }, { ar: 'ماعز', en: 'Goat', sub: 'pets' }, { ar: 'دجاجة', en: 'Chicken', sub: 'pets' }, { ar: 'بطة', en: 'Duck', sub: 'pets' }, { ar: 'خنزير', en: 'Pig', sub: 'pets' }, { ar: 'جمل', en: 'Camel', sub: 'pets' }, { ar: 'حمار', en: 'Donkey', sub: 'pets' }, { ar: 'إوزة', en: 'Goose', sub: 'pets' }, { ar: 'ديك رومي', en: 'Turkey (bird)', sub: 'pets' },
    { ar: 'نسر', en: 'Eagle', sub: 'birds' }, { ar: 'بطريق', en: 'Penguin', sub: 'birds' }, { ar: 'بومة', en: 'Owl', sub: 'birds' }, { ar: 'نعامة', en: 'Ostrich', sub: 'birds' }, { ar: 'ببغاء', en: 'Parrot', sub: 'birds' }, { ar: 'طاووس', en: 'Peafowl', sub: 'birds' }, { ar: 'حمامة', en: 'Columbidae', sub: 'birds' }, { ar: 'صقر', en: 'Falcon', sub: 'birds' }, { ar: 'بجعة', en: 'Swan', sub: 'birds' }, { ar: 'نورس', en: 'Gull', sub: 'birds' }, { ar: 'غراب', en: 'Crow', sub: 'birds' }, { ar: 'طائر الطنان', en: 'Hummingbird', sub: 'birds' }, { ar: 'فلامنغو', en: 'Flamingo', sub: 'birds' },
    { ar: 'دلفين', en: 'Dolphin', sub: 'marine' }, { ar: 'قرش', en: 'Shark', sub: 'marine' }, { ar: 'حوت', en: 'Whale', sub: 'marine' }, { ar: 'أخطبوط', en: 'Octopus', sub: 'marine' }, { ar: 'نجم البحر', en: 'Starfish', sub: 'marine' }, { ar: 'سرطان البحر', en: 'Crab', sub: 'marine' }, { ar: 'سلحفاة بحرية', en: 'Sea turtle', sub: 'marine' }, { ar: 'قنديل البحر', en: 'Jellyfish', sub: 'marine' }, { ar: 'حبار', en: 'Squid', sub: 'marine' }, { ar: 'فقمة', en: 'Pinniped', sub: 'marine' }, { ar: 'حصان البحر', en: 'Seahorse', sub: 'marine' }, { ar: 'قرش أبيض كبير', en: 'Great white shark', sub: 'marine' }, { ar: 'حوت أزرق', en: 'Blue whale', sub: 'marine' }, { ar: 'حوت قاتل', en: 'Orca', sub: 'marine' }
  ],
  cars: [
    { ar: 'تويوتا', en: 'Toyota', sub: 'brands' }, { ar: 'هوندا', en: 'Honda', sub: 'brands' }, { ar: 'نيسان', en: 'Nissan', sub: 'brands' }, { ar: 'فورد', en: 'Ford Motor Company', sub: 'brands' }, { ar: 'شيفروليه', en: 'Chevrolet', sub: 'brands' }, { ar: 'جيب', en: 'Jeep', sub: 'brands' }, { ar: 'بي إم دبليو', en: 'BMW', sub: 'brands' }, { ar: 'مرسيدس-بنز', en: 'Mercedes-Benz', sub: 'brands' }, { ar: 'أودي', en: 'Audi', sub: 'brands' }, { ar: 'فولكس فاجن', en: 'Volkswagen', sub: 'brands' }, { ar: 'بورشه', en: 'Porsche', sub: 'brands' }, { ar: 'فيراري', en: 'Ferrari', sub: 'brands' }, { ar: 'لامبورغيني', en: 'Lamborghini', sub: 'brands' }, { ar: 'مازيراتي', en: 'Maserati', sub: 'brands' }, { ar: 'بوغاتي', en: 'Bugatti', sub: 'brands' }, { ar: 'ماكلارين', en: 'McLaren', sub: 'brands' }, { ar: 'رولز رويس', en: 'Rolls-Royce Motor Cars', sub: 'brands' }, { ar: 'بنتلي', en: 'Bentley Motors', sub: 'brands' }, { ar: 'أستون مارتن', en: 'Aston Martin', sub: 'brands' }, { ar: 'تسلا', en: 'Tesla, Inc.', sub: 'brands' }, { ar: 'لاند روفر', en: 'Land Rover', sub: 'brands' }, { ar: 'جاغوار', en: 'Jaguar Cars', sub: 'brands' }, { ar: 'لكزس', en: 'Lexus', sub: 'brands' }, { ar: 'هيونداي', en: 'Hyundai', sub: 'brands' }, { ar: 'كيا', en: 'Kia', sub: 'brands' }, { ar: 'مازدا', en: 'Mazda', sub: 'brands' }, { ar: 'ميتسوبيشي', en: 'Mitsubishi Motors', sub: 'brands' }, { ar: 'سوبارو', en: 'Subaru', sub: 'brands' }, { ar: 'سوزوكي', en: 'Suzuki', sub: 'brands' }, { ar: 'فولفو', en: 'Volvo Cars', sub: 'brands' }, { ar: 'دودج', en: 'Dodge', sub: 'brands' }, { ar: 'كرايسلر', en: 'Chrysler', sub: 'brands' }, { ar: 'كاديلاك', en: 'Cadillac', sub: 'brands' }, { ar: 'جي إم سي', en: 'GMC', sub: 'brands' }, { ar: 'لينكولن', en: 'Lincoln Motor Company', sub: 'brands' }, { ar: 'رينو', en: 'Groupe Renault', sub: 'brands' }, { ar: 'بيجو', en: 'Peugeot', sub: 'brands' }, { ar: 'سيتروين', en: 'Citroën', sub: 'brands' }, { ar: 'فيات', en: 'Fiat', sub: 'brands' }, { ar: 'ألفا روميو', en: 'Alfa Romeo', sub: 'brands' }, { ar: 'ميني', en: 'Mini (marque)', sub: 'brands' }
  ],
  tech: [
    { ar: 'آيفون', en: 'IPhone', sub: 'devices' }, { ar: 'آيباد', en: 'IPad', sub: 'devices' }, { ar: 'حاسوب محمول', en: 'Laptop', sub: 'devices' }, { ar: 'ساعة ذكية', en: 'Smartwatch', sub: 'devices' }, { ar: 'سماعات رأس', en: 'Headphones', sub: 'devices' }, { ar: 'تلفاز', en: 'Television', sub: 'devices' }, { ar: 'كاميرا', en: 'Camera', sub: 'devices' }, { ar: 'فأرة حاسوب', en: 'Computer mouse', sub: 'devices' }, { ar: 'لوحة مفاتيح', en: 'Computer keyboard', sub: 'devices' }, { ar: 'شاحن بطارية', en: 'Battery charger', sub: 'devices' }, { ar: 'راوتر', en: 'Router (computing)', sub: 'devices' }, { ar: 'ميكروفون', en: 'Microphone', sub: 'devices' }, { ar: 'طابعة', en: 'Printer (computing)', sub: 'devices' }, { ar: 'شاشة حاسوب', en: 'Computer monitor', sub: 'devices' }, { ar: 'بلايستيشن', en: 'PlayStation', sub: 'devices' }, { ar: 'إكس بوكس', en: 'Xbox', sub: 'devices' }, { ar: 'طائرة بدون طيار', en: 'Unmanned aerial vehicle', sub: 'devices' }, { ar: 'نظارة واقع افتراضي', en: 'Virtual reality headset', sub: 'devices' }, { ar: 'قرص صلب', en: 'Hard disk drive', sub: 'devices' }, { ar: 'مكبر صوت', en: 'Loudspeaker', sub: 'devices' }, { ar: 'تكييف', en: 'Air conditioning', sub: 'devices' }, { ar: 'مروحة', en: 'Fan (machine)', sub: 'devices' },
    { ar: 'يوتيوب', en: 'YouTube', sub: 'apps' }, { ar: 'إنستغرام', en: 'Instagram', sub: 'apps' }, { ar: 'واتساب', en: 'WhatsApp', sub: 'apps' }, { ar: 'تيك توك', en: 'TikTok', sub: 'apps' }, { ar: 'فيسبوك', en: 'Facebook', sub: 'apps' }, { ar: 'تويتر', en: 'Twitter', sub: 'apps' }, { ar: 'سناب شات', en: 'Snapchat', sub: 'apps' }, { ar: 'تيليجرام', en: 'Telegram (software)', sub: 'apps' }, { ar: 'سبوتيفاي', en: 'Spotify', sub: 'apps' }, { ar: 'نتفليكس', en: 'Netflix', sub: 'apps' }, { ar: 'جوجل ماب', en: 'Google Maps', sub: 'apps' }, { ar: 'أوبر', en: 'Uber (company)', sub: 'apps' }, { ar: 'زوم', en: 'Zoom Video Communications', sub: 'apps' }, { ar: 'لينكد إن', en: 'LinkedIn', sub: 'apps' }, { ar: 'سكايب', en: 'Skype', sub: 'apps' }, { ar: 'بينتريست', en: 'Pinterest', sub: 'apps' }, { ar: 'أمازون', en: 'Amazon (company)', sub: 'apps' }, { ar: 'ويكيبيديا', en: 'Wikipedia', sub: 'apps' },
    { ar: 'أبل', en: 'Apple Inc.', sub: 'brands' }, { ar: 'جوجل', en: 'Google', sub: 'brands' }, { ar: 'سامسونج', en: 'Samsung Electronics', sub: 'brands' }, { ar: 'مايكروسوفت', en: 'Microsoft', sub: 'brands' }, { ar: 'سوني', en: 'Sony', sub: 'brands' }, { ar: 'إل جي', en: 'LG Electronics', sub: 'brands' }, { ar: 'هواوي', en: 'Huawei', sub: 'brands' }, { ar: 'شاومي', en: 'Xiaomi', sub: 'brands' }, { ar: 'إنتل', en: 'Intel', sub: 'brands' }, { ar: 'ديل', en: 'Dell', sub: 'brands' }, { ar: 'إتش بي', en: 'Hewlett-Packard', sub: 'brands' }, { ar: 'آي بي إم', en: 'IBM', sub: 'brands' }, { ar: 'لينوفو', en: 'Lenovo', sub: 'brands' }, { ar: 'إيسوس', en: 'Asus', sub: 'brands' }, { ar: 'آيسر', en: 'Acer Inc.', sub: 'brands' }, { ar: 'باناسونيك', en: 'Panasonic', sub: 'brands' }, { ar: 'توشيبا', en: 'Toshiba', sub: 'brands' }
  ],
  games: [
    { ar: 'ماينكرافت', en: 'Minecraft', sub: 'video_games' }, { ar: 'جراند ثفت أوتو V', en: 'Grand Theft Auto V', sub: 'video_games' }, { ar: 'فيفا', en: 'FIFA (video game series)', sub: 'video_games' }, { ar: 'فورتنايت', en: 'Fortnite', sub: 'video_games' }, { ar: 'روبلوكس', en: 'Roblox', sub: 'video_games' }, { ar: 'كول أوف ديوتي', en: 'Call of Duty', sub: 'video_games' }, { ar: 'ببجي', en: 'PUBG: Battlegrounds', sub: 'video_games' }, { ar: 'ليغ أوف ليجيندز', en: 'League of Legends', sub: 'video_games' }, { ar: 'أوفرواتش', en: 'Overwatch (video game)', sub: 'video_games' }, { ar: 'فالورانت', en: 'Valorant', sub: 'video_games' }, { ar: 'سوبر ماريو أوديسي', en: 'Super Mario Odyssey', sub: 'video_games' }, { ar: 'ذا ليجند أوف زيلدا', en: 'The Legend of Zelda: Breath of the Wild', sub: 'video_games' }, { ar: 'بوكيمون', en: 'Pokémon', sub: 'video_games' }, { ar: 'سونيك', en: 'Sonic the Hedgehog', sub: 'video_games' }, { ar: 'أمونغ آس', en: 'Among Us', sub: 'video_games' }, { ar: 'غود أوف وور', en: 'God of War (2018 video game)', sub: 'video_games' }, { ar: 'ريد ديد ريدمبشن 2', en: 'Red Dead Redemption 2', sub: 'video_games' }, { ar: 'ذا ويتشر 3', en: 'The Witcher 3: Wild Hunt', sub: 'video_games' }, { ar: 'مورتال كومبات', en: 'Mortal Kombat', sub: 'video_games' }, { ar: 'تيكن', en: 'Tekken', sub: 'video_games' }, { ar: 'ستريت فايتر', en: 'Street Fighter', sub: 'video_games' }, { ar: 'أبيكس ليجندز', en: 'Apex Legends', sub: 'video_games' }, { ar: 'دوتا 2', en: 'Dota 2', sub: 'video_games' }, { ar: 'كاونتر سترايك', en: 'Counter-Strike: Global Offensive', sub: 'video_games' }, { ar: 'ذا سيمز', en: 'The Sims', sub: 'video_games' }, { ar: 'أنيمال كروسينغ', en: 'Animal Crossing', sub: 'video_games' }, { ar: 'تيراريا', en: 'Terraria', sub: 'video_games' }, { ar: 'ستارديو فالي', en: 'Stardew Valley', sub: 'video_games' }, { ar: 'هيلو', en: 'Halo (franchise)', sub: 'video_games' }, { ar: 'ديابلو', en: 'Diablo (franchise)', sub: 'video_games' }, { ar: 'وورلد أوف ووركرافت', en: 'World of Warcraft', sub: 'video_games' }, { ar: 'فاينل فانتسي', en: 'Final Fantasy', sub: 'video_games' }, { ar: 'ريزدنت إيفل', en: 'Resident Evil', sub: 'video_games' }, { ar: 'سايلنت هيل', en: 'Silent Hill', sub: 'video_games' }, { ar: 'كراش بانديكوت', en: 'Crash Bandicoot', sub: 'video_games' }, { ar: 'تومب رايدر', en: 'Tomb Raider', sub: 'video_games' }, { ar: 'سوبر سماش برذرز', en: 'Super Smash Bros.', sub: 'video_games' }, { ar: 'ماريو كارت 8', en: 'Mario Kart 8', sub: 'video_games' }, { ar: 'بلودبورن', en: 'Bloodborne', sub: 'video_games' }, { ar: 'دارك سولز', en: 'Dark Souls', sub: 'video_games' }, { ar: 'إلدن رينغ', en: 'Elden Ring', sub: 'video_games' }, { ar: 'ميتال غير', en: 'Metal Gear', sub: 'video_games' }, { ar: 'فول أوت', en: 'Fallout (series)', sub: 'video_games' }, { ar: 'سكايريم', en: 'The Elder Scrolls V: Skyrim', sub: 'video_games' }, { ar: 'سايبر بانك 2077', en: 'Cyberpunk 2077', sub: 'video_games' }, { ar: 'أساسنز كريد', en: 'Assassin\'s Creed', sub: 'video_games' }, { ar: 'ماس إفكت', en: 'Mass Effect', sub: 'video_games' }, { ar: 'بايوشوك', en: 'BioShock', sub: 'video_games' }, { ar: 'أنشارتد', en: 'Uncharted', sub: 'video_games' }, { ar: 'ذا لاست أوف أس', en: 'The Last of Us', sub: 'video_games' }, { ar: 'هالو راش', en: 'Hollow Knight', sub: 'video_games' }
  ],
  entertainment: [
    { ar: 'هاري بوتر', en: 'Harry Potter', sub: 'characters' }, { ar: 'الرجل الحديدي', en: 'Iron Man', sub: 'characters' }, { ar: 'الجوكر', en: 'Joker (character)', sub: 'characters' }, { ar: 'باتمان', en: 'Batman', sub: 'characters' }, { ar: 'الرجل العنكبوت', en: 'Spider-Man', sub: 'characters' }, { ar: 'سوبرمان', en: 'Superman', sub: 'characters' }, { ar: 'كابتن أمريكا', en: 'Captain America', sub: 'characters' }, { ar: 'ثور', en: 'Thor (Marvel Comics)', sub: 'characters' }, { ar: 'هالك', en: 'Hulk', sub: 'characters' }, { ar: 'ديدبول', en: 'Deadpool', sub: 'characters' }, { ar: 'وندر وومان', en: 'Wonder Woman', sub: 'characters' }, { ar: 'أكوامان', en: 'Aquaman', sub: 'characters' }, { ar: 'فلاش', en: 'Flash (DC Comics character)', sub: 'characters' }, { ar: 'جيمس بوند', en: 'James Bond', sub: 'characters' }, { ar: 'إنديانا جونز', en: 'Indiana Jones', sub: 'characters' }, { ar: 'لوك سكاي ووكر', en: 'Luke Skywalker', sub: 'characters' }, { ar: 'دارث فيدر', en: 'Darth Vader', sub: 'characters' }, { ar: 'يودا', en: 'Yoda', sub: 'characters' }, { ar: 'شيرلوك هولمز', en: 'Sherlock Holmes', sub: 'characters' }, { ar: 'دراكولا', en: 'Dracula', sub: 'characters' }, { ar: 'فرانكنشتاين', en: 'Frankenstein\'s monster', sub: 'characters' }, { ar: 'غودزيلا', en: 'Godzilla', sub: 'characters' }, { ar: 'كينغ كونغ', en: 'King Kong', sub: 'characters' }, { ar: 'سبونج بوب', en: 'SpongeBob SquarePants (character)', sub: 'characters' }, { ar: 'ميكي ماوس', en: 'Mickey Mouse', sub: 'characters' }, { ar: 'دونالد داك', en: 'Donald Duck', sub: 'characters' }, { ar: 'هومر سيمبسون', en: 'Homer Simpson', sub: 'characters' }, { ar: 'بيتر غريفين', en: 'Peter Griffin', sub: 'characters' }, { ar: 'ناروتو', en: 'Naruto Uzumaki', sub: 'characters' }, { ar: 'غوكو', en: 'Goku', sub: 'characters' }, { ar: 'لوفي', en: 'Monkey D. Luffy', sub: 'characters' }, { ar: 'إرين ييغر', en: 'Eren Yeager', sub: 'characters' }, { ar: 'سايتاما', en: 'Saitama (One Punch Man)', sub: 'characters' }, { ar: 'سونغ جين وو', en: 'Sung Jin-woo', sub: 'characters' }, { ar: 'تانجيرو', en: 'Tanjiro Kamado', sub: 'characters' }, { ar: 'غوجو ساتورو', en: 'Satoru Gojo', sub: 'characters' }, { ar: 'ليفاي أكرمان', en: 'Levi Ackerman', sub: 'characters' }, { ar: 'إدوارد إلريك', en: 'Edward Elric', sub: 'characters' }, { ar: 'لايت ياغامي', en: 'Light Yagami', sub: 'characters' }, { ar: 'وولفرين', en: 'Wolverine (character)', sub: 'characters' }, { ar: 'فينوم', en: 'Venom (Marvel Comics character)', sub: 'characters' }, { ar: 'بلاك بانثر', en: 'Black Panther (character)', sub: 'characters' }, { ar: 'دكتور سترينج', en: 'Doctor Strange', sub: 'characters' }, { ar: 'أنت مان', en: 'Ant-Man', sub: 'characters' }, { ar: 'هارلي كوين', en: 'Harley Quinn', sub: 'characters' }, { ar: 'شريك', en: 'Shrek (character)', sub: 'characters' }, { ar: 'ودي', en: 'Sheriff Woody', sub: 'characters' }, { ar: 'باز يطير', en: 'Buzz Lightyear', sub: 'characters' }, { ar: 'توم وجيري', en: 'Tom and Jerry', sub: 'characters' }, { ar: 'باغز باني', en: 'Bugs Bunny', sub: 'characters' }, { ar: 'سكوبي دو', en: 'Scooby-Doo (character)', sub: 'characters' }, { ar: 'غارفيلد', en: 'Garfield', sub: 'characters' }
  ],
  everyday: [
    { ar: 'كرسي', en: 'Chair', sub: 'objects' }, { ar: 'طاولة', en: 'Table (furniture)', sub: 'objects' }, { ar: 'سرير', en: 'Bed', sub: 'objects' }, { ar: 'مفتاح', en: 'Key (lock)', sub: 'objects' }, { ar: 'حذاء', en: 'Shoe', sub: 'objects' }, { ar: 'ساعة حائط', en: 'Clock', sub: 'objects' }, { ar: 'كتاب', en: 'Book', sub: 'objects' }, { ar: 'قلم', en: 'Pen', sub: 'objects' }, { ar: 'نظارة', en: 'Glasses', sub: 'objects' }, { ar: 'فرشاة أسنان', en: 'Toothbrush', sub: 'objects' }, { ar: 'باب', en: 'Door', sub: 'objects' }, { ar: 'نافذة', en: 'Window', sub: 'objects' }, { ar: 'صحن', en: 'Plate (dishware)', sub: 'objects' }, { ar: 'كوب', en: 'Cup', sub: 'objects' }, { ar: 'ملعقة', en: 'Spoon', sub: 'objects' }, { ar: 'شوكة', en: 'Fork', sub: 'objects' }, { ar: 'سكين', en: 'Knife', sub: 'objects' }, { ar: 'وسادة', en: 'Pillow', sub: 'objects' }, { ar: 'مرآة', en: 'Mirror', sub: 'objects' }, { ar: 'مقص', en: 'Scissors', sub: 'objects' }, { ar: 'مشط', en: 'Comb', sub: 'objects' }, { ar: 'صابون', en: 'Soap', sub: 'objects' }, { ar: 'شامبو', en: 'Shampoo', sub: 'objects' }, { ar: 'منشفة', en: 'Towel', sub: 'objects' }, { ar: 'ورق تواليت', en: 'Toilet paper', sub: 'objects' }, { ar: 'مكنسة', en: 'Broom', sub: 'objects' }, { ar: 'ممسحة', en: 'Mop', sub: 'objects' }, { ar: 'مكواة', en: 'Clothes iron', sub: 'objects' }, { ar: 'غسالة', en: 'Washing machine', sub: 'objects' }, { ar: 'ثلاجة', en: 'Refrigerator', sub: 'objects' }, { ar: 'فرن', en: 'Oven', sub: 'objects' }, { ar: 'ميكروويف', en: 'Microwave oven', sub: 'objects' }, { ar: 'خلاط', en: 'Blender', sub: 'objects' }, { ar: 'مظلة', en: 'Umbrella', sub: 'objects' }, { ar: 'حقيبة', en: 'Bag', sub: 'objects' }, { ar: 'محفظة', en: 'Wallet', sub: 'objects' }, { ar: 'حزام', en: 'Belt (clothing)', sub: 'objects' }, { ar: 'قبعة', en: 'Hat', sub: 'objects' }, { ar: 'قفاز', en: 'Glove', sub: 'objects' }, { ar: 'جوارب', en: 'Sock', sub: 'objects' }, { ar: 'مصباح', en: 'Lamp', sub: 'objects' }, { ar: 'سجادة', en: 'Rug', sub: 'objects' }, { ar: 'ستارة', en: 'Curtain', sub: 'objects' }, { ar: 'دولاب', en: 'Closet', sub: 'objects' }, { ar: 'مجلة', en: 'Magazine', sub: 'objects' }, { ar: 'صحيفة', en: 'Newspaper', sub: 'objects' }, { ar: 'ولاعة', en: 'Lighter', sub: 'objects' }, { ar: 'شمعة', en: 'Candle', sub: 'objects' }, { ar: 'دلو', en: 'Bucket', sub: 'objects' }, { ar: 'إسفنجة', en: 'Sponge', sub: 'objects' }, { ar: 'فرشاة شعر', en: 'Hairbrush', sub: 'objects' }, { ar: 'معجون أسنان', en: 'Toothpaste', sub: 'objects' }
  ]
};

const reqOptions = {
  headers: {
    'User-Agent': 'MinAnaGame/3.0 (aymanemadride09@gmail.com) Node.js'
  }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function getWikiImagesBatched(titles) {
  const result = {};
  const chunks = [];
  for (let i = 0; i < titles.length; i += 40) {
    chunks.push(titles.slice(i, i + 40));
  }

  for (const chunk of chunks) {
    const titlesStr = chunk.map(t => encodeURIComponent(t)).join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titlesStr}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
    
    try {
      const response = await fetch(url, reqOptions);
      if (response.ok) {
        const json = await response.json();
        const redirects = {};
        if (json.query.redirects) {
          json.query.redirects.forEach(r => { redirects[r.to] = r.from; });
        }
        if (json.query.pages) {
          for (const pageId in json.query.pages) {
            const page = json.query.pages[pageId];
            if (page.thumbnail && page.thumbnail.source) {
              const finalTitle = page.title;
              const originalTitle = redirects[finalTitle] || finalTitle;
              result[originalTitle] = page.thumbnail.source;
              result[finalTitle] = page.thumbnail.source;
            }
          }
        }
      }
    } catch(e) {}
    await delay(300);
  }
  return result;
}

const getFallbackImage = async (title) => {
  try {
    const res = await fetch('https://en.wikipedia.org/wiki/'+encodeURIComponent(title.replace(/ /g, '_')), reqOptions);
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

async function run() {
  const finalItems = [];
  let counter = 1;

  for (const [catId, arr] of Object.entries(dbMap)) {
    console.log(`Processing category: ${catId}...`);
    
    const flagItems = arr.filter(i => i.flag);
    const wikiItems = arr.filter(i => i.en);
    const wikiTitles = wikiItems.map(i => i.en);
    
    let imageMap = {};
    if (wikiTitles.length > 0) {
      console.log(`Fetching ${wikiTitles.length} images for ${catId}...`);
      imageMap = await getWikiImagesBatched(wikiTitles);
    }
    
    for (const item of flagItems) {
       finalItems.push({
        id: `item_${counter++}`,
        name: item.ar,
        categoryId: catId,
        subcategoryId: item.sub,
        difficulty: 'medium',
        image: `https://flagcdn.com/w1280/${item.flag}.png`,
        keywords: [item.ar]
      });
    }
    
    let missing = 0;
    for (const item of wikiItems) {
      let imageUrl = imageMap[item.en];
      
      if (!imageUrl) {
        // use fallback scraper!
        const fallback = await getFallbackImage(item.en);
        if (fallback) {
          imageUrl = fallback.startsWith('//') ? 'https:' + fallback : fallback;
        }
      }
      
      if (!imageUrl) {
        missing++;
        console.log(`FAILED completely for ${item.ar} (${item.en}) -> Skipping item!`);
      } else {
        finalItems.push({
          id: `item_${counter++}`,
          name: item.ar,
          categoryId: catId,
          subcategoryId: item.sub,
          difficulty: 'medium',
          image: imageUrl,
          keywords: [item.ar]
        });
      }
    }
    console.log(`Category ${catId} done. Skipped items: ${missing}/${wikiItems.length}`);
  }

  const fileContent = `import { Item } from '../types';\n\nexport const items: Item[] = ${JSON.stringify(finalItems, null, 2)};\n`;
  fs.writeFileSync('src/data/items.ts', fileContent);
  console.log(`Successfully generated ${finalItems.length} verified items!`);
}

run();
