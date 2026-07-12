/*
 * AstroBioRhythm - Main Application Script
 * 
 * DEPLOYMENT: This file should be uploaded to web server as-is
 * Dependencies: languages.js, Chart.js (CDN), SweetAlert2 (CDN)
 * 
 * WEB SERVER REQUIREMENTS:
 * - Supports ES6 modules (all modern browsers)
 * - HTTPS recommended for geolocation features
 * - No server-side processing required (pure client-side)
 */

import { translations, zodiacStoriesMultilingual, zodiacSigns } from "./languages.js";

let currentLanguage = "en";

// Location suggestions data
const locationData = {
  states: [
    // European States (Sovereign Countries)
    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", 
    "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", 
    "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", 
    "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", 
    "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", 
    "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia", 
    "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City",
    
    // USA States (for compatibility)
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
    
    // Canadian Provinces (for compatibility)
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", 
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", 
    "Quebec", "Saskatchewan", "Yukon"
  ],
  cities: {
    // European Countries and Major Cities
    "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg"],
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón"],
    "Poland": ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice", "Białystok", "Gdynia", "Częstochowa", "Radom", "Sosnowiec"],
    "Croatia": ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Slavonski Brod", "Pula", "Karlovac", "Sisak", "Šibenik", "Varaždin", "Velika Gorica", "Dubrovnik", "Bjelovar", "Vinkovci", "Koprivnica", "Đakovo", "Čakovec", "Vukovar", "Gospić", "Požega", "Imotski", "Makarska", "Trogir", "Biograd na Moru", "Cres", "Mali Lošinj", "Rovinj", "Motovun", "Hvar", "Korčula", "Rab", "Krk", "Pazin", "Labin", "Umag", "Poreč", "Novigrad", "Vrsar"],
    "Slovakia": ["Bratislava", "Košice", "Prešov", "Žilina", "Banská Bystrica", "Nitra", "Trnava", "Trenčín", "Martin", "Poprad", "Prievidza", "Zvolen", "Považská Bystrica", "Michalovce", "Spišská Nová Ves"],
    "Serbia": ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Novi Pazar", "Kraljevo", "Smederevo", "Leskovac", "Užice", "Valjevo", "Kruševac", "Sombor", "Kikinda", "Sremska Mitrovica", "Šabac", "Jagodina", "Paraćin", "Zaječar", "Prokuplje", "Pirot", "Vranje", "Bor", "Negotin", "Kladovo", "Majdanpek", "Knjaževac", "Svrljig", "Aleksinac", "Trstenik", "Arilje", "Požega", "Ivanjica", "Prijepolje", "Nova Varoš", "Sjenica", "Tutin", "Raska", "Novi Pazar", "Kosjerić", "Loznica", "Krupanj", "Mali Zvornik", "Ljubovija", "Bajina Bašta"],
    "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon"],
    "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", "Trieste"],
    "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield", "Edinburgh", "Bristol", "Cardiff", "Belfast", "Leicester", "Coventry", "Bradford", "Nottingham"],
    "Czech Republic": ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec", "Olomouc", "Ústí nad Labem", "České Budějovice", "Hradec Králové", "Pardubice", "Havířov", "Zlín", "Kladno", "Most", "Karviná"],
    "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "St. Pölten", "Dornbirn", "Wiener Neustadt", "Steyr", "Feldkirch", "Bregenz", "Leonding"],
    "Hungary": ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely", "Sopron", "Tatabánya", "Kaposvár", "Érd", "Veszprém"],
    "Romania": ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", "Galați", "Ploiești", "Oradea", "Brăila", "Arad", "Pitești", "Sibiu", "Bacău", "Târgu Mureș", "Baia Mare", "Buzău", "Botoșani", "Satu Mare", "Râmnicu Vâlcea", "Drobeta-Turnu Severin", "Piatra Neamț", "Focșani", "Târgoviște", "Tulcea", "Reșița", "Alba Iulia", "Bistrița", "Sighetu Marmației", "Făgăraș", "Deva", "Hunedoara", "Călan", "Petroșani", "Lupeni", "Vulcan", "Petrila", "Anina", "Caransebeș", "Lugoj", "Săcele", "Codlea", "Râșnov", "Zărnești", "Predeal", "Sinaia", "Bușteni", "Azuga"],
    "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", "Arnhem", "Zaanstad", "Amersfoort"],
    "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Aalst", "Mechelen", "La Louvière", "Kortrijk", "Hasselt", "Sint-Niklaas"],
    "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Rhodes", "Ioannina", "Chania", "Chalcis", "Piraeus", "Serres", "Alexandroupolis", "Xanthi", "Katerini"],
    "Portugal": ["Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal", "Coimbra", "Setúbal", "Almada", "Agualva-Cacém", "Queluz", "Rio Tinto", "Barreiro", "Aveiro", "Viseu"],
    "Switzerland": ["Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne", "St. Gallen", "Lugano", "Biel/Bienne", "Thun", "Köniz", "La Chaux-de-Fonds", "Schaffhausen", "Fribourg"],
    "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås", "Södertälje"],
    "Norway": ["Oslo", "Bergen", "Stavanger", "Trondheim", "Fredrikstad", "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg", "Skien", "Ålesund", "Sandefjord", "Haugesund", "Tønsberg", "Moss"],
    "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde", "Herning", "Hørsholm", "Helsingør", "Silkeborg", "Næstved"],
    "Finland": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti", "Kuopio", "Kouvola", "Pori", "Joensuu", "Lappeenranta", "Hämeenlinna", "Vaasa"],
    "Bulgaria": ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen", "Pernik", "Haskovo", "Yambol", "Pazardzhik", "Blagoevgrad", "Kyustendil", "Montana", "Vratsa", "Gabrovo", "Kazanlak", "Asenovgrad", "Vidin", "Smolyan", "Kardzhali", "Dimitrovgrad", "Gorna Oryahovitsa", "Dupnitsa", "Svishtov", "Velingrad", "Nova Zagora", "Berkovitsa", "Razgrad", "Targovishte", "Lovech", "Troyan", "Teteven", "Samokov", "Bankya", "Sandanski", "Petrich", "Gotse Delchev", "Bansko", "Razlog", "Melnik", "Harmanli", "Svilengrad"],
    "North Macedonia": ["Skopje", "Bitola", "Kumanovo", "Prilep", "Tetovo", "Veles", "Štip", "Ohrid", "Gostivar", "Strumica", "Kavadarci", "Kočani", "Kičevo", "Struga", "Radoviš", "Gevgelija", "Debar", "Kratovo", "Sveti Nikole", "Negotino", "Delčevo", "Berovo", "Valandovo", "Bogdanci", "Vinica", "Makedonska Kamenica", "Pehčevo", "Makedonski Brod", "Kruševo", "Demir Hisar", "Resen", "Kriva Palanka", "Probištip", "Štip", "Bogdanci"],
    "Bosnia and Herzegovina": ["Sarajevo", "Banja Luka", "Tuzla", "Zenica", "Mostar", "Prijedor", "Brčko", "Bijeljina", "Trebinje", "Bugojno", "Cazin", "Velika Kladuša", "Visoko", "Goražde", "Konjic", "Travnik", "Livno", "Lukavac", "Gradačac", "Gradiška", "Doboj", "Jajce", "Foča", "Gacko", "Nevesinje", "Čapljina", "Stolac", "Neum", "Široki Brijeg", "Grude", "Posušje", "Tomislavgrad", "Kupres", "Drvar", "Bosansko Grahovo", "Glamoč", "Bosanski Petrovac", "Bihać", "Bosanska Krupa", "Sanski Most", "Ključ", "Bosanska Dubica"],
    "Slovenia": ["Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto", "Ptuj", "Trbovlje", "Kamnik", "Jesenice", "Nova Gorica", "Domžale", "Škofja Loka", "Slovenj Gradec", "Murska Sobota", "Kočevje", "Krško", "Brežice", "Sevnica", "Postojna", "Idrija", "Tolmin", "Bovec", "Kobarid", "Ajdovščina", "Vipava", "Sežana", "Divača", "Ilirska Bistrica", "Pivka", "Črnomelj", "Metlika", "Trebnje", "Grosuplje", "Litija", "Zagorje ob Savi", "Hrastnik", "Laško", "Žalec", "Mozirje", "Nazarje", "Radeče"],
    "Lithuania": ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys", "Alytus", "Marijampolė", "Mažeikiai", "Jonava", "Utena", "Kėdainiai", "Telšiai", "Visaginas", "Tauragė", "Ukmergė"],
    "Latvia": ["Riga", "Daugavpils", "Liepāja", "Jelgava", "Jūrmala", "Ventspils", "Rēzekne", "Valmiera", "Jēkabpils", "Ogre", "Tukums", "Salaspils", "Cēsis", "Kuldīga", "Saldus"],
    "Estonia": ["Tallinn", "Tartu", "Narva", "Pärnu", "Kohtla-Järve", "Viljandi", "Rakvere", "Maardu", "Sillamäe", "Kuressaare", "Võru", "Valga", "Haapsalu", "Jõhvi", "Paide"],
    "Albania": ["Tirana", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Fier", "Korçë", "Berat", "Lushnjë", "Kavajë", "Gjirokastër", "Sarandë", "Laç", "Kukës", "Lezhë", "Patos", "Krujë", "Peshkopi", "Burrel", "Cërrik", "Ballsh", "Mamurras", "Klos", "Rrogozhinë", "Peqin", "Gramsh", "Librazhd", "Pogradec", "Bilisht", "Devoll", "Përmet", "Tepelenë", "Memaliaj", "Selenicë", "Himarë", "Delvinë", "Konispol", "Bajram Curri", "Tropojë", "Has", "Malësi e Madhe", "Vau i Dejës", "Pukë", "Mirditë"],
    "Moldova": ["Chișinău", "Tiraspol", "Bălți", "Bender", "Rîbnița", "Cahul", "Ungheni", "Soroca", "Orhei", "Dubăsari", "Comrat", "Ceadîr-Lunga", "Strășeni", "Căușeni", "Edineț"],
    "Montenegro": ["Podgorica", "Nikšić", "Pljevlja", "Bijelo Polje", "Cetinje", "Bar", "Herceg Novi", "Berane", "Budva", "Ulcinj", "Tivat", "Rožaje", "Kotor", "Danilovgrad", "Mojkovac", "Žabljak", "Kolašin", "Andrijevica", "Šavnik", "Plužine", "Gusinje", "Petnjica", "Tuzi", "Golubovci", "Spuž", "Mateševo", "Morača", "Virpazar", "Ostrog", "Durmitor", "Skadar", "Lovćen"],
    "Belarus": ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Grodno", "Brest", "Babruysk", "Baranovichi", "Borisov", "Pinsk", "Orsha", "Mozyr", "Novopolotsk", "Lida", "Soligorsk"],
    "Ukraine": ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Mariupol", "Luhansk", "Vinnytsya", "Makiivka", "Sevastopol", "Simferopol"],
    "Ireland": ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan", "Kilkenny", "Ennis", "Tralee", "Carlow", "Newbridge"],
    "Iceland": ["Reykjavík", "Kópavogur", "Hafnarfjörður", "Akureyri", "Reykjanesbær", "Garðabær", "Mosfellsbær", "Árborg", "Akranes", "Fjarðabyggð", "Mulathing", "Selfoss", "Seltjarnarnes", "Vestmannaeyjar", "Grindavík"],
    
    // USA Cities by State (for compatibility)
    "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
    "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Lubbock"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Tallahassee", "St. Petersburg", "Hialeah", "Port St. Lucie", "Cape Coral"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
    
    // Canadian Cities by Province (for compatibility)  
    "Ontario": ["Toronto", "Ottawa", "Hamilton", "London", "Kitchener", "Windsor", "Sudbury", "Kingston", "Thunder Bay", "St. Catharines"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Trois-Rivières", "Terrebonne", "Saint-Jean-sur-Richelieu"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Saanich", "Delta"]
  }
};

// Zodiac images
const zodiacImages = {
  Aries: "https://www.astrology-zodiac-signs.com/images/aries.jpg",
  Taurus: "https://www.astrology-zodiac-signs.com/images/taurus.jpg",
  Gemini: "https://www.astrology-zodiac-signs.com/images/gemini.jpg",
  Cancer: "https://www.astrology-zodiac-signs.com/images/cancer.jpg",
  Leo: "https://www.astrology-zodiac-signs.com/images/leo.jpg",
  Virgo: "https://www.astrology-zodiac-signs.com/images/virgo.jpg",
  Libra: "https://www.astrology-zodiac-signs.com/images/libra.jpg",
  Scorpio: "https://www.astrology-zodiac-signs.com/images/scorpio.jpg",
  Sagittarius: "https://www.astrology-zodiac-signs.com/images/sagittarius.jpg",
  Capricorn: "https://www.astrology-zodiac-signs.com/images/capricorn.jpg",
  Aquarius: "https://www.astrology-zodiac-signs.com/images/aquarius.jpg",
  Pisces: "https://www.astrology-zodiac-signs.com/images/pisces.jpg",
};

// Zodiac symbols mapping
const zodiacSymbols = {
  Aries: "♈",
  Taurus: "♉", 
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓"
};

// Biorhythm constants
const BIORHYTHM_CYCLES = {
  PHYSICAL: 23,
  EMOTIONAL: 28,
  INTELLECTUAL: 33
};

const CHART_CONFIG = {
  DAYS_TO_SHOW: 30,
  POINT_RADIUS: 5
};

// State management matching devica book settings
const state = {
  settings: {
    theme: 'platinum',
    fontSize: 100
  },
  lastCalculation: null
};

// SVG paths for all 12 zodiac symbols (drawn in a 20x20 space, to fit the arch ornament)
const zodiacSvgPaths = {
  Aries: `<path d="M 3 5 C 3 3 5 2 7 2 C 9 2 10 3.5 10 5.5 C 10 3.5 11 2 13 2 C 15 2 17 3 17 5 C 17 9.5 10 15 10 18 M 10 5.5 L 10 18" />`,
  Taurus: `<path d="M 4 3 C 4 7 7 10 10 10 C 13 10 16 7 16 3 M 10 10 C 6 10 6 18 10 18 C 14 18 14 10 10 10" />`,
  Gemini: `<path d="M 4 3 L 16 3 M 4 17 L 16 17 M 7 3 L 7 17 M 13 3 L 13 17 M 7 6 L 13 6 M 7 14 L 13 14" />`,
  Cancer: `<path d="M 15 6 C 15 9 13 10 10 10 C 7 10 5 9 5 6 C 5 3 7 2 10 2 C 12 2 14 3.5 15 5.5 M 15 6 L 12 6 M 5 14 C 5 11 7 10 10 10 C 13 10 15 11 15 14 C 15 17 13 18 10 18 C 8 18 6 16.5 5 14.5 M 5 14 L 8 14" />`,
  Leo: `<path d="M 4 14 C 4 12.5 5.5 11 7 11 C 8.5 11 10 12.5 10 14 C 10 15.5 8.5 17 7 17 C 5.5 17 4 15.5 4 14 Z M 10 14 C 11 10 14 6 17 6 C 19 6 20 7.5 20 9 C 20 12 17 15 16 18" />`,
  Virgo: `<path d="M 4 4 L 4 14 C 4 17 6 18 8 18 C 10 18 11 16 11 13 L 11 4 M 11 8 C 11 5.5 13 4 15 4 C 17 4 18 5.5 18 8 L 18 14 C 18 17 16 18 14 18 M 18 10 C 18 8.5 19 7 21 7 C 23 7 24 8.5 24 10 L 24 15 C 24 17.5 21 19 19 19" />`,
  Libra: `<path d="M 3 17 L 17 17 M 6 13 C 6 10 8 8 10 8 C 12 8 14 10 14 13 M 3 13 L 6 13 M 14 13 L 17 13" />`,
  Scorpio: `<path d="M 4 4 L 4 14 C 4 17 6 18 8 18 M 8 4 L 8 14 C 8 17 10 18 12 18 M 12 4 L 12 13 C 12 10.5 14 9.5 16 9.5 C 18 9.5 19.5 11.5 19.5 14 L 19.5 17.5 M 17.5 16 L 19.5 18 L 21.5 16" />`,
  Sagittarius: `<path d="M 3 17 L 17 3 M 10 3 L 17 3 L 17 10 M 6 8 L 12 14" />`,
  Capricorn: `<path d="M 4 6 L 4 14 C 4 17 6 18 8 18 C 10 18 12 16 12 13 L 12 6 M 12 11 C 12 8.5 14 7 16 7 C 18 7 19 8.5 19 11 L 19 13 C 19 14.5 17.5 16 16 16 C 14.5 16 13.5 14.5 13.5 13 C 13.5 11 15 9 17.5 7.5" />`,
  Aquarius: `<path d="M 2 8 L 5 5 L 8 8 L 11 5 L 14 8 L 17 5 L 20 8 M 2 14 L 5 11 L 8 14 L 11 11 L 14 14 L 17 11 L 20 14" />`,
  Pisces: `<path d="M 4 3 L 4 17 M 16 3 L 16 17 M 3 10 L 17 10 M 4 5 C 9 8 11 8 16 5 M 4 15 C 9 12 11 12 16 15" />`
};

const settingsTranslations = {
  en: {
    settingsTitle: "Display Settings",
    settingsTheme: "Royal Display Theme",
    settingsSize: "Text Size",
    settingsBtn: "Settings",
    tabCalc: "Calculator",
    tabBooks: "Zodiac Books",
    menuCalc: "Biorhythm Calculator",
    menuResults: "My Astrological Profile",
    btnSizeDecrease: "Decrease text size",
    btnSizeIncrease: "Increase text size",
    coverAuthor: "Astrology Portal & Biorhythm",
    coverSubtitle: "Cosmic Cycles & Natal Chart",
    coverMeta: "Discover the influences of the stars and your natural biological cycles. Calculate your natal chart, analyze your physical, emotional, and intellectual biorhythms, and find your cosmic path.",
    startAnalysis: "Begin Analysis",
    libraryTitle: "Zodiac Library",
    libraryDesc: "Select a zodiac sign to enter its dedicated interactive web book and explore its history, planetary alignment, somatics, and alchemy.",
    audioBannerText: "Would you like to activate subtle cosmic waves of 136.1 Hz (the Ohm frequency of Earth's orbital octave) for focus, deep alignment, and biological harmony during your reading?",
    audioAccept: "Activate",
    audioDecline: "Ignore",
    ambientSoundTitle: "Play ambient cosmic frequencies (136.1 Hz)",
    themes: {
      platinum: "Analytical Platinum",
      earth: "Mycelium and Jade",
      clay: "Clay Vessel",
      celestial: "Celestial Order",
      sun: "Solar Gold",
      heart: "Heart Alchemy",
      crown: "Crown Purple",
      parchment: "Old Manuscript"
    },
    themeTitles: {
      platinum: "Analytical Platinum (Silver-gray)",
      earth: "Mycelium and Jade (Earthy olive and copper)",
      clay: "Clay Vessel (Copper, terracotta and bronze)",
      celestial: "Celestial Order (Deep sapphire and gold)",
      sun: "Solar Gold (Royal gold and obsidian)",
      heart: "Heart Alchemy (Ruby red and copper)",
      crown: "Crown Purple (Amethyst and gold)",
      parchment: "Old Manuscript (Light parchment)"
    }
  },
  sk: {
    settingsTitle: "Nastavenia zobrazenia",
    settingsTheme: "Kráľovská téma zobrazenia",
    settingsSize: "Veľkosť textu",
    settingsBtn: "Nastavenia",
    tabCalc: "Kalkulačka",
    tabBooks: "Knihy znamení",
    menuCalc: "Biorytmový kalkulátor",
    menuResults: "Môj astrologický profil",
    btnSizeDecrease: "Zmenšiť písmo",
    btnSizeIncrease: "Zväčšiť písmo",
    coverAuthor: "Astrologický portál a biorytmus",
    coverSubtitle: "Vesmírne cykly a natálna karta",
    coverMeta: "Objavte vplyvy hviezd a svojich prirodzených biologických cyklov. Vypočítajte si natálnu kartu, analyzujte svoj fyzický, emocionálny a intelektuálny biorytmus a nájdite svoju vesmírnu cestu.",
    startAnalysis: "Začať analýzu",
    libraryTitle: "Knižnica zverokruhu",
    libraryDesc: "Vyberte si znamenie zverokruhu, vstúpte do jeho špecializovanej interaktívnej webovej knihy a preskúmajte jeho históriu, postavenie planét, somatiku a alchýmiu.",
    audioBannerText: "Chcete aktivovať jemné kozmické vlny o frekvencii 136.1 Hz (frekvencia obežnej dráhy Zeme) pre sústredenie, hlboké naladenie a biologickú harmóniu počas čítania?",
    audioAccept: "Aktivovať",
    audioDecline: "Ignorovať",
    ambientSoundTitle: "Prehrať ambientné kozmické frekvencie (136.1 Hz)",
    themes: {
      platinum: "Analytická platina",
      earth: "Mycélium a nefrit",
      clay: "Hlinená nádoba",
      celestial: "Vesmírny poriadok",
      sun: "Solárne zlato",
      heart: "Alchýmia srdca",
      crown: "Kráľovský purpur",
      parchment: "Starý rukopis"
    },
    themeTitles: {
      platinum: "Analytická platina (Strieborno-sivá)",
      earth: "Mycélium a nefrit (Zemito olivová a meď)",
      clay: "Hlinená nádoba (Meď, terakota a bronz)",
      celestial: "Vesmírny poriadok (Hlboký zafír a zlato)",
      sun: "Solárne zlato (Kráľovské zlato a obsidián)",
      heart: "Alchýmia srdca (Rubínovo červená a meď)",
      crown: "Kráľovský purpur (Ametyst a zlato)",
      parchment: "Starý rukopis (Svetlý pergamen)"
    }
  },
  de: {
    settingsTitle: "Anzeigeeinstellungen",
    settingsTheme: "Königliches Anzeigethema",
    settingsSize: "Textgröße",
    settingsBtn: "Einstellungen",
    tabCalc: "Rechner",
    tabBooks: "Tierkreisbücher",
    menuCalc: "Biorhythmus-Rechner",
    menuResults: "Mein astrologisches Profil",
    btnSizeDecrease: "Schriftgröße verringern",
    btnSizeIncrease: "Schriftgröße erhöhen",
    coverAuthor: "Astrologie-Portal & Biorhythmus",
    coverSubtitle: "Kosmische Zyklen & Geburtshoroskop",
    coverMeta: "Entdecken Sie die Einflüsse der Sterne und Ihre natürlichen biologischen Zyklen. Berechnen Sie Ihr Geburtshoroskop, analysieren Sie Ihre körperlichen, emotionalen und intellektuellen Biorhythmen und finden Sie Ihren kosmischen Pfad.",
    startAnalysis: "Analyse starten",
    libraryTitle: "Tierkreis-Bibliothek",
    libraryDesc: "Wählen Sie ein Tierkreiszeichen, um sein interaktives Web-Buch zu öffnen und seine Geschichte, planetare Ausrichtung, Somatik und Alchemie zu erforschen.",
    audioBannerText: "Möchten Sie feine kosmische Wellen von 136.1 Hz (die Ohm-Frequenz der Erdumlaufbahn) für Fokus, tiefe Ausrichtung und biologische Harmonie während des Lesens aktivieren?",
    audioAccept: "Aktivieren",
    audioDecline: "Ignorieren",
    ambientSoundTitle: "Kosmische Hintergrundfrequenzen abspielen (136.1 Hz)",
    themes: {
      platinum: "Analytisches Platin",
      earth: "Myzel und Jade",
      clay: "Tongefäß",
      celestial: "Kosmische Ordnung",
      sun: "Solargold",
      heart: "Herzalchemie",
      crown: "Königspurpur",
      parchment: "Altes Manuskript"
    },
    themeTitles: {
      platinum: "Analytisches Platin (Silbergrau)",
      earth: "Myzel und Jade (Erdig oliv und Kupfer)",
      clay: "Tongefäß (Kupfer, Terrakotta und Bronze)",
      celestial: "Kosmische Ordnung (Tiefes Saphirblau und Gold)",
      sun: "Solargold (Königliches Gold und Obsidian)",
      heart: "Herzalchemie (Rubinrot und Kupfer)",
      crown: "Königspurpur (Amethyst und Gold)",
      parchment: "Altes Manuskript (Helles Feldland/Staat/Region)"
    }
  },
  sr: {
    settingsTitle: "Podešavanja prikaza",
    settingsTheme: "Kraljevska Tema prikaza",
    settingsSize: "Veličina teksta",
    settingsBtn: "Podešavanja",
    tabCalc: "Kalkulator",
    tabBooks: "Knjige Znakova",
    menuCalc: "Kalkulator Bioritma",
    menuResults: "Moj Astrološki Profil",
    btnSizeDecrease: "Smanji slova",
    btnSizeIncrease: "Povećaj slova",
    coverAuthor: "Astrološki portal i bioritam",
    coverSubtitle: "Kosmički ciklusi i natalna karta",
    coverMeta: "Otkrijte uticaje zvezda i vaših prirodnih bioloških ciklusa. Izračunajte svoju natalnu kartu, analizirajte fizički, emocionalni i intelektualni bioritam i pronađite svoj kosmički put.",
    startAnalysis: "Započni analizu",
    libraryTitle: "Biblioteka Znakova",
    libraryDesc: "Izaberite horoskopski znak da biste ušli u njegovu posvećenu interaktivnu web knjigu i istražili njegovu istoriju, planetarno poravnanje, somatiku i alhemiju.",
    audioBannerText: "Da li želite da aktivirate suptilne kosmičke talase od 136.1 Hz (frekvencija orbitalne oktave Zemlje) za fokus, duboko usklađivanje i biološku harmoniju tokom korišćenja?",
    audioAccept: "Aktiviraj",
    audioDecline: "Zanemari",
    ambientSoundTitle: "Pusti ambijentalne kozmičke frekvencije (136.1 Hz)",
    themes: {
      platinum: "Analitička platina",
      earth: "Micelijum i žad",
      clay: "Glinena posuda",
      celestial: "Kozmički red",
      sun: "Solarno zlato",
      heart: "Alhemija srca",
      crown: "Kraljevski purpur",
      parchment: "Stari rukopis"
    },
    themeTitles: {
      platinum: "Analitička platina (Srebrno-siva)",
      earth: "Micelijum i žad (Zemljano maslinasta i bakar)",
      clay: "Glinena posuda (Bakar, terakota i bronza)",
      celestial: "Kozmički red (Duboki safir i zlato)",
      sun: "Solarno zlato (Kraljevsko zlato i obsidian)",
      heart: "Alhemija srca (Rubin crveno i bakar)",
      crown: "Kraljevski purpur (Ametist i zlato)",
      parchment: "Stari rukopis (Svetli pergament)"
    }
  },
  hr: {
    settingsTitle: "Postavke prikaza",
    settingsTheme: "Kraljevska tema prikaza",
    settingsSize: "Veličina teksta",
    settingsBtn: "Postavke",
    tabCalc: "Kalkulator",
    tabBooks: "Knjige Znakova",
    menuCalc: "Kalkulator Bioritma",
    menuResults: "Moj Astrološki Profil",
    btnSizeDecrease: "Smanji slova",
    btnSizeIncrease: "Povećaj slova",
    coverAuthor: "Astrološki portal i bioritam",
    coverSubtitle: "Kosmički ciklusi i natalna karta",
    coverMeta: "Otkrijte utjecaje zvijezda i vaših prirodnih bioloških ciklusa. Izračunajte svoju natalnu kartu, analizirajte fizički, emocionalni i intelektualni bioritam i pronađite svoj kozmički put.",
    startAnalysis: "Započni analizu",
    libraryTitle: "Biblioteka Znakova",
    libraryDesc: "Izaberite horoskopski znak da biste ušli u njegovu posvećenu interaktivnu web knjigu i istražili njegovu povijest, planetarno poravnanje, somatiku i alhemiju.",
    audioBannerText: "Želite li aktivirati suptilne kozmičke valove od 136.1 Hz (frekvencija orbitalne oktave Zemlje) za fokus, duboko usklađivanje i biološku harmoniju tijekom čitanja?",
    audioAccept: "Aktiviraj",
    audioDecline: "Zanemari",
    ambientSoundTitle: "Pusti ambijentalne kozmičke frekvencije (136.1 Hz)",
    themes: {
      platinum: "Analitička platina",
      earth: "Micelijum i žad",
      clay: "Glinena posuda",
      celestial: "Kozmički red",
      sun: "Solarno zlato",
      heart: "Alkemija srca",
      crown: "Kraljevski purpur",
      parchment: "Stari rukopis"
    },
    themeTitles: {
      platinum: "Analitička platina (Srebrno-siva)",
      earth: "Micelijum i žad (Zemljano maslinasta i bakar)",
      clay: "Glinena posuda (Bakar, terakota i bronza)",
      celestial: "Kozmički red (Duboki safir i zlato)",
      sun: "Solarno zlato (Kraljevsko zlato i obsidian)",
      heart: "Alkemija srca (Rubin crveno i bakar)",
      crown: "Kraljevski purpur (Ametist i zlato)",
      parchment: "Stari rukopis (Svetli pergament)"
    }
  },
  fr: {
    settingsTitle: "Paramètres d'affichage",
    settingsTheme: "Thème d'affichage royal",
    settingsSize: "Taille du texte",
    settingsBtn: "Paramètres",
    tabCalc: "Calculatrice",
    tabBooks: "Livres du zodiaque",
    menuCalc: "Calculateur de biorythme",
    menuResults: "Mon profil astrologique",
    btnSizeDecrease: "Diminuer la taille des lettres",
    btnSizeIncrease: "Augmenter la taille des lettres",
    coverAuthor: "Portail d'astrologie & biorythme",
    coverSubtitle: "Cycles cosmiques & thème natal",
    coverMeta: "Découvrez les influences des étoiles et de vos cycles biologiques naturels. Calculez votre thème natal, analysez vos biorythmes physiques, émotionnels et intellectuels, et trouvez votre chemin cosmique.",
    startAnalysis: "Commencer l'analyse",
    libraryTitle: "Bibliothèque du Zodiaque",
    libraryDesc: "Sélectionnez un signe du zodiaque pour entrer dans son livre web interactif dédié et explorer son histoire, son alignement planétaire, sa somatique et son alchimie.",
    audioBannerText: "Souhaitez-vous activer de subtiles ondes cosmiques de 136.1 Hz (la fréquence Ohm de l'octave orbitale de la Terre) pour la concentration, l'alignement profond et l'harmonie biologique pendant votre lecture ?",
    audioAccept: "Activer",
    audioDecline: "Ignorer",
    ambientSoundTitle: "Jouer des fréquences cosmiques ambiantes (136.1 Hz)",
    themes: {
      platinum: "Platine analytique",
      earth: "Mycélium et jade",
      clay: "Vase d'argile",
      celestial: "Ordre céleste",
      sun: "Or Solaire",
      heart: "Alchimie du Cœur",
      crown: "Pourpre Royal",
      parchment: "Vieux manuscrit"
    },
    themeTitles: {
      platinum: "Platine analytique (Gris argent)",
      earth: "Mycélium et jade (Olive terreux et cuivre)",
      clay: "Vase d'argile (Cuivre, terre cuite et bronze)",
      celestial: "Ordre céleste (Saphir profond et or)",
      sun: "Or Solaire (Or royal et obsidienne)",
      heart: "Alchimie du Cœur (Rouge rubis et cuivre)",
      crown: "Pourpre Royal (Améthyste et or)",
      parchment: "Vieux manuscrit (Parchemin clair)"
    }
  },
  hu: {
    settingsTitle: "Megjelenítési beállítások",
    settingsTheme: "Királyi megjelenítési téma",
    settingsSize: "Szövegméret",
    settingsBtn: "Beállítások",
    tabCalc: "Kalkulátor",
    tabBooks: "Csillagjegy könyvek",
    menuCalc: "Bioritmus kalkulátor",
    menuResults: "Asztrológiai profilom",
    btnSizeDecrease: "Szövegméret csökkentése",
    btnSizeIncrease: "Szövegméret növelése",
    coverAuthor: "Asztrológiai portál és bioritmus",
    coverSubtitle: "Kozmikus ciklusok és születési térkép",
    coverMeta: "Fedezze fel a csillagok és a természetes biológiai ciklusok hatásait. Számítsa ki születési térképét, elemezze fizikai, érzelmi és intellektuális bioritmusát, és találja meg kozmikus útját.",
    startAnalysis: "Elemzés indítása",
    libraryTitle: "Zodiákus Könyvtár",
    libraryDesc: "Válasszon ki egy csillagjegyet, hogy belépjen a dedikált interaktív webes könyvébe, és felfedezze annak történetét, bolygóállását, szomatikáját és alkímiáját.",
    audioBannerText: "Szeretné aktiválni a 136.1 Hz-es finom kozmikus hullámokat (a Föld pályájának Ohm frekvenciáját) a fókusz, a mély igazodás és a biológiai harmónia érdekében a használat során?",
    audioAccept: "Aktiválás",
    audioDecline: "Mellőzés",
    ambientSoundTitle: "Kozmikus háttérfrekvenciák lejátszása (136.1 Hz)",
    themes: {
      platinum: "Analitikus platina",
      earth: "Micélium és jáde",
      clay: "Agyag edény",
      celestial: "Mennyei rend",
      sun: "Napfény arany",
      heart: "Szív alkímia",
      crown: "Királyi bíbor",
      parchment: "Régi kézirat"
    },
    themeTitles: {
      platinum: "Analitikus platina (Ezüst-szürke)",
      earth: "Micélium és jáde (Földi olívazöld és réz)",
      clay: "Agyag edény (Réz, terrakotta és bronz)",
      celestial: "Mennyei rend (Mély zafír és arany)",
      sun: "Napfény arany (Királyi arany és obszidián)",
      heart: "Szív alkímia (Rubinvörös és réz)",
      crown: "Királyi bíbor (Ametiszt és arany)",
      parchment: "Régi kézirat (Világos pergamen)"
    }
  },
  it: {
    settingsTitle: "Impostazioni di visualizzazione",
    settingsTheme: "Tema di visualizzazione reale",
    settingsSize: "Dimensione del testo",
    settingsBtn: "Impostazioni",
    tabCalc: "Calcolatore",
    tabBooks: "Libri dello zodiaco",
    menuCalc: "Calcolatore del bioritmo",
    menuResults: "Il mio profil astrologico",
    btnSizeDecrease: "Riduci dimensione testo",
    btnSizeIncrease: "Aumenta dimensione testo",
    coverAuthor: "Portale di astrologia e bioritmo",
    coverSubtitle: "Cicli cosmici e tema natale",
    coverMeta: "Scopri l'influenza delle stelle e dei tuoi cicli biologici naturali. Calcola il tuo tema natale, analizza i tuoi bioritmi fisici, emotivi e intellettuali e trova il tuo cammino cosmico.",
    startAnalysis: "Inizia l'analisi",
    libraryTitle: "Biblioteca dello Zodiaco",
    libraryDesc: "Seleziona un segno zodiacale per entrare nel suo libro web interattivo dedicato ed esplorarne la storia, l'allineamento planetario, la somatica e l'alchimia.",
    audioBannerText: "Desideri attivare sottili onde cosmiche di 136.1 Hz (la frequenza Ohm dell'ottava orbitale terrestre) per la concentrazione, l'allineamento profondo e l'armonia biologica durante la lettura?",
    audioAccept: "Attiva",
    audioDecline: "Ignora",
    ambientSoundTitle: "Riproduci frequenze cosmiche ambientali (136.1 Hz)",
    themes: {
      platinum: "Platino analitico",
      earth: "Micelio e giada",
      clay: "Vaso d'argilla",
      celestial: "Ordine celeste",
      sun: "Oro Solare",
      heart: "Alchimia del Cuore",
      crown: "Porpora Reale",
      parchment: "Antico manoscritto"
    },
    themeTitles: {
      platinum: "Platino analitico (Grigio argento)",
      earth: "Micelio e giada (Oliva terrosa e rame)",
      clay: "Vaso d'argilla (Rame, terracotta e bronzo)",
      celestial: "Ordine celeste (Zaffiro profondo e oro)",
      sun: "Oro Solare (Oro reale e ossidiana)",
      heart: "Alchimia del Cuore (Rosso rubino e rame)",
      crown: "Porpora Reale (Ametista e oro)",
      parchment: "Antico manoscritto (Pergamena chiara)"
    }
  }
};

function loadSettings() {
  const settingsStr = localStorage.getItem('devica_settings');
  if (settingsStr) {
    try {
      state.settings = { ...state.settings, ...JSON.parse(settingsStr) };
    } catch (e) {
      console.error("Error parsing settings:", e);
    }
  }
}

function saveSettings() {
  localStorage.setItem('devica_settings', JSON.stringify(state.settings));
}

function switchTheme(theme) {
  state.settings.theme = theme;
  applySettings();
  saveSettings();
}

function adjustFontSize(delta) {
  state.settings.fontSize = Math.min(Math.max(state.settings.fontSize + delta, 80), 160);
  applySettings();
  saveSettings();
}

function applySettings() {
  const themes = ['theme-platinum', 'theme-earth', 'theme-clay', 'theme-celestial', 'theme-sun', 'theme-heart', 'theme-crown', 'theme-parchment'];
  themes.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(`theme-${state.settings.theme}`);
  
  document.querySelectorAll('.theme-option').forEach(el => {
    if (el.getAttribute('data-theme') === state.settings.theme) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  const viewport = document.getElementById('viewport-content-container');
  if (viewport) {
    viewport.style.fontSize = `${state.settings.fontSize}%`;
  }
  const display = document.getElementById('font-size-display');
  if (display) {
    display.textContent = `${state.settings.fontSize}%`;
  }
  
  updateChartColors();
}

function getThemeChartColors() {
  const theme = state.settings.theme;
  const isParchment = theme === 'parchment';
  
  const style = getComputedStyle(document.body);
  const goldPrimary = style.getPropertyValue('--gold-primary').trim() || '#bf953f';
  const textMain = style.getPropertyValue('--color-text-main').trim() || (isParchment ? '#2a2016' : '#f0f3f8');
  const textMuted = style.getPropertyValue('--color-text-muted').trim() || (isParchment ? '#786b5c' : '#8fa0b5');
  const gridColor = isParchment ? 'rgba(42, 32, 22, 0.15)' : 'rgba(255, 255, 255, 0.08)';
  const zeroGridColor = isParchment ? 'rgba(170, 119, 28, 0.4)' : 'rgba(191, 149, 63, 0.4)';
  
  let physical, emotional, intellectual;
  
  switch (theme) {
    case 'earth':
      physical = '#cd7f32';
      emotional = '#789072';
      intellectual = '#4e6349';
      break;
    case 'clay':
      physical = '#cd7f32';
      emotional = '#e08244';
      intellectual = '#a05a1e';
      break;
    case 'celestial':
      physical = '#bf953f';
      emotional = '#7986cb';
      intellectual = '#4fc3f7';
      break;
    case 'sun':
      physical = '#d4af37';
      emotional = '#fff3b3';
      intellectual = '#aa771c';
      break;
    case 'heart':
      physical = '#e07b53';
      emotional = '#ffd5c6';
      intellectual = '#b5512b';
      break;
    case 'crown':
      physical = '#bf953f';
      emotional = '#a855f7';
      intellectual = '#e9d5ff';
      break;
    case 'parchment':
      physical = '#aa771c';
      emotional = '#8c6239';
      intellectual = '#2a2016';
      break;
    case 'platinum':
    default:
      physical = '#bf953f';
      emotional = '#70a1ff';
      intellectual = '#a4b0be';
      break;
  }
  
  return {
    physical,
    emotional,
    intellectual,
    textMain,
    textMuted,
    gridColor,
    zeroGridColor,
    goldPrimary
  };
}

function updateChartColors() {
  if (state.lastCalculation) {
    createNatalChart(state.lastCalculation.astroData.planets);
    createBiorhythmChart(state.lastCalculation.birthDate, state.lastCalculation.currentDate);
  }
}

// ----------------------------------------------------
// AUDIO SYNTHESIZER (Web Audio API - Earth Orbit octave transposition 136.1 Hz)
// ----------------------------------------------------
let audioCtx = null;
let osc1 = null;
let osc2 = null;
let gainNode = null;
let filterNode = null;
let audioActive = false;

function initAudio() {
  if (audioCtx) return;
  
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  
  osc1 = audioCtx.createOscillator();
  osc2 = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  filterNode = audioCtx.createBiquadFilter();
  
  // 136.1 Hz Ohm frequency and 136.45 Hz for subtle binural beat beat
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(136.1, audioCtx.currentTime);
  
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(136.45, audioCtx.currentTime);
  
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(180, audioCtx.currentTime);
  filterNode.Q.setValueAtTime(1, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Fade-in start
  
  osc1.connect(filterNode);
  osc2.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc1.start(0);
  osc2.start(0);
}

function startAmbientSound() {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  // Smooth volume fade-in
  gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2.0);
  audioActive = true;
  updateAudioUI();
}

function stopAmbientSound() {
  if (!gainNode) return;
  // Smooth volume fade-out
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
  audioActive = false;
  updateAudioUI();
}

function updateAudioUI() {
  const btn = document.getElementById('btn-ambient-sound');
  if (!btn) return;
  const iconOn = btn.querySelector('.audio-icon-on');
  const iconOff = btn.querySelector('.audio-icon-off');
  
  if (audioActive) {
    btn.classList.add('active');
    if (iconOn) iconOn.classList.remove('hidden');
    if (iconOff) iconOff.classList.add('hidden');
  } else {
    btn.classList.remove('active');
    if (iconOn) iconOn.classList.add('hidden');
    if (iconOff) iconOff.classList.remove('hidden');
  }
}

function triggerAudioBannerPrompt() {
  const prompted = localStorage.getItem('astrobiorhythm_audio_prompted');
  if (!prompted && !audioActive) {
    const banner = document.getElementById('audio-banner');
    if (banner) banner.classList.remove('hidden');
  }
}

function registerUiEventListeners() {
  const sidebar = document.getElementById("app-sidebar");
  const openSidebarBtn = document.getElementById("sidebar-toggle-btn");
  const closeSidebarBtn = document.getElementById("sidebar-close-btn");
  
  if (openSidebarBtn && sidebar) {
    openSidebarBtn.addEventListener("click", () => sidebar.classList.add("open"));
  }
  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener("click", () => sidebar.classList.remove("open"));
  }
  
  document.addEventListener("click", (e) => {
    if (sidebar && sidebar.classList.contains("open")) {
      if (!sidebar.contains(e.target) && openSidebarBtn && !openSidebarBtn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    }
  });

  const tabCalc = document.getElementById("tab-calculator-nav");
  const tabBooks = document.getElementById("tab-books-nav");
  const menuCalcList = document.getElementById("sidebar-main-menu");
  const menuBooksList = document.getElementById("sidebar-zodiac-books-menu");
  
  const formCard = document.getElementById("form-card-container");
  const resultsCard = document.getElementById("results");
  const libraryCard = document.getElementById("zodiac-library-card");
  const coverPage = document.getElementById("main-cover-page");
  
  if (tabCalc && tabBooks && menuCalcList && menuBooksList) {
    tabCalc.addEventListener("click", () => {
      tabCalc.classList.add("active");
      tabBooks.classList.remove("active");
      menuCalcList.classList.remove("hidden");
      menuBooksList.classList.add("hidden");
      
      // Navigate to calculator view
      if (libraryCard) libraryCard.classList.add("hidden");
      if (state.lastCalculation) {
        if (resultsCard) {
          resultsCard.style.display = "block";
          resultsCard.classList.remove("hidden");
        }
        if (formCard) formCard.classList.add("hidden");
      } else {
        if (formCard) formCard.classList.remove("hidden");
        if (resultsCard) resultsCard.style.display = "none";
      }
      if (coverPage) coverPage.classList.add("hidden");
    });
    
    tabBooks.addEventListener("click", () => {
      tabBooks.classList.add("active");
      tabCalc.classList.remove("active");
      menuBooksList.classList.remove("hidden");
      menuCalcList.classList.add("hidden");
      
      // Navigate to library view
      if (formCard) formCard.classList.add("hidden");
      if (resultsCard) resultsCard.style.display = "none";
      if (coverPage) coverPage.classList.add("hidden");
      if (libraryCard) libraryCard.classList.remove("hidden");
    });
  }

  const menuCalcBtn = document.getElementById("menu-calc-btn");
  const menuResultsBtn = document.getElementById("menu-results-btn");
  
  if (menuCalcBtn && formCard) {
    menuCalcBtn.addEventListener("click", () => {
      if (coverPage) coverPage.classList.add("hidden");
      if (libraryCard) libraryCard.classList.add("hidden");
      if (resultsCard) resultsCard.style.display = "none";
      formCard.classList.remove("hidden");
      formCard.scrollIntoView({ behavior: "smooth" });
      menuCalcBtn.classList.add("active");
      if (menuResultsBtn) menuResultsBtn.classList.remove("active");
      if (sidebar && window.innerWidth < 768) sidebar.classList.remove("open");
    });
  }
  if (menuResultsBtn && resultsCard) {
    menuResultsBtn.addEventListener("click", () => {
      if (coverPage) coverPage.classList.add("hidden");
      if (libraryCard) libraryCard.classList.add("hidden");
      if (formCard) formCard.classList.add("hidden");
      resultsCard.style.display = "block";
      resultsCard.classList.remove("hidden");
      resultsCard.scrollIntoView({ behavior: "smooth" });
      menuResultsBtn.classList.add("active");
      if (menuCalcBtn) menuCalcBtn.classList.remove("active");
      if (sidebar && window.innerWidth < 768) sidebar.classList.remove("open");
    });
  }

  // Cover page start button click
  const startBtn = document.getElementById("btn-start-analysis");
  if (startBtn && coverPage && formCard) {
    startBtn.addEventListener("click", () => {
      coverPage.classList.add("exit-active");
      setTimeout(() => {
        coverPage.classList.add("hidden");
        formCard.classList.remove("hidden");
        formCard.scrollIntoView({ behavior: "smooth" });
        // Enable audio banner if requested
        triggerAudioBannerPrompt();
      }, 800);
    });
  }

  // Return to cover page (landing) when clicking brand names on top left
  const resetToCover = (e) => {
    if (e) e.preventDefault();
    if (coverPage) {
      coverPage.classList.remove("hidden");
      coverPage.classList.remove("exit-active");
      coverPage.scrollIntoView({ behavior: "smooth" });
    }
    if (formCard) formCard.classList.add("hidden");
    if (resultsCard) {
      resultsCard.style.display = "none";
      resultsCard.classList.add("hidden");
    }
    if (libraryCard) libraryCard.classList.add("hidden");
    
    // Reset active states in sidebar menu
    if (menuCalcBtn) menuCalcBtn.classList.remove("active");
    if (menuResultsBtn) menuResultsBtn.classList.remove("active");
    
    // Close sidebar on mobile
    if (sidebar && window.innerWidth < 768) sidebar.classList.remove("open");
  };

  const logoLink = document.getElementById("logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", resetToCover);
  }

  const topChapterName = document.getElementById("current-chapter-name");
  if (topChapterName) {
    topChapterName.style.cursor = "pointer";
    topChapterName.style.transition = "color 0.3s ease";
    topChapterName.addEventListener("mouseover", () => {
      topChapterName.style.color = "#bf953f"; // var(--gold-primary) hex code
    });
    topChapterName.addEventListener("mouseout", () => {
      topChapterName.style.color = "";
    });
    topChapterName.addEventListener("click", resetToCover);
  }

  // Audio start banner accept/decline
  const audioBanner = document.getElementById("audio-banner");
  const audioAcceptBtn = document.getElementById("btn-audio-accept");
  const audioDeclineBtn = document.getElementById("btn-audio-decline");
  
  if (audioAcceptBtn && audioBanner) {
    audioAcceptBtn.addEventListener("click", () => {
      localStorage.setItem('astrobiorhythm_audio_prompted', 'true');
      audioBanner.classList.add("hidden");
      startAmbientSound();
    });
  }
  if (audioDeclineBtn && audioBanner) {
    audioDeclineBtn.addEventListener("click", () => {
      localStorage.setItem('astrobiorhythm_audio_prompted', 'true');
      audioBanner.classList.add("hidden");
    });
  }

  // Top bar audio control button toggle
  const soundBtn = document.getElementById("btn-ambient-sound");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      if (audioActive) {
        stopAmbientSound();
      } else {
        startAmbientSound();
      }
    });
  }

  const settingsDrawer = document.getElementById("settings-drawer");
  const openSettingsBtn = document.getElementById("btn-settings-drawer");
  const closeSettingsBtn = document.getElementById("btn-close-settings");
  
  if (openSettingsBtn && settingsDrawer) {
    openSettingsBtn.addEventListener("click", () => settingsDrawer.classList.toggle("hidden"));
  }
  if (closeSettingsBtn && settingsDrawer) {
    closeSettingsBtn.addEventListener("click", () => settingsDrawer.classList.add("hidden"));
  }
  if (settingsDrawer) {
    settingsDrawer.addEventListener("click", (e) => {
      if (e.target.id === "settings-drawer") {
        settingsDrawer.classList.add("hidden");
      }
    });
  }

  const themeGrid = document.querySelector(".theme-selector-grid");
  if (themeGrid) {
    themeGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-option");
      if (btn) {
        const theme = btn.getAttribute("data-theme");
        if (theme) switchTheme(theme);
      }
    });
  }

  const decBtn = document.getElementById("btn-size-decrease");
  const incBtn = document.getElementById("btn-size-increase");
  if (decBtn) decBtn.addEventListener("click", () => adjustFontSize(-10));
  if (incBtn) incBtn.addEventListener("click", () => adjustFontSize(10));
}

document.addEventListener("DOMContentLoaded", function () {
  // Load settings and theme
  loadSettings();
  applySettings();

  // On initial load, if no calculations are loaded, hide the calculator form and show the cover page
  const formCard = document.getElementById("form-card-container");
  const resultsCard = document.getElementById("results");
  const libraryCard = document.getElementById("zodiac-library-card");
  const coverPage = document.getElementById("main-cover-page");

  // Load saved user profile and pre-fill form
  const savedProfileStr = localStorage.getItem("astrobiorhythm_user_data");
  let hasSavedProfile = false;
  if (savedProfileStr) {
    try {
      const savedProfile = JSON.parse(savedProfileStr);
      if (savedProfile) {
        document.getElementById("name").value = savedProfile.name || "";
        document.getElementById("email").value = savedProfile.email || "";
        
        if (savedProfile.birthDate) {
          const parts = savedProfile.birthDate.split('T');
          document.getElementById("birthDate").value = parts[0] || "";
          document.getElementById("birthTime").value = savedProfile.birthTimeStr || parts[1] || "";
        }
        
        document.getElementById("birthState").value = savedProfile.birthState || "";
        document.getElementById("birthCity").value = savedProfile.birthCity || "";
        hasSavedProfile = true;
      }
    } catch (e) {
      console.error("Error loading saved profile on startup:", e);
    }
  }

  if (!state.lastCalculation) {
    if (hasSavedProfile) {
      if (coverPage) coverPage.classList.add("hidden");
      if (formCard) formCard.classList.add("hidden");
      if (resultsCard) {
        resultsCard.style.display = "block";
        resultsCard.classList.remove("hidden");
      }
      setTimeout(async () => {
        await calculateAstroData();
      }, 100);
    } else {
      if (coverPage) {
        coverPage.classList.remove("hidden");
        coverPage.classList.remove("exit-active");
      }
      if (formCard) formCard.classList.add("hidden");
      if (libraryCard) libraryCard.classList.add("hidden");
      if (resultsCard) {
        resultsCard.style.display = "none";
        resultsCard.classList.add("hidden");
      }
    }
  }

  // Set current year in footer
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Initialize language selector
  const languageSelect = document.getElementById("languageSelect");
  if (!languageSelect) {
    console.error("Language selector not found");
    return;
  }
  
  languageSelect.value = currentLanguage;

  // Form submission handler
  const birthDataForm = document.getElementById("birthDataForm");
  if (birthDataForm) {
    birthDataForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      await calculateAstroData();
    });
  } else {
    console.error("Birth data form not found");
  }

  // Language change handlers - comprehensive mobile compatibility
  function handleLanguageChange(e) {
    const newLanguage = e.target.value;
    if (newLanguage && newLanguage !== currentLanguage) {
      currentLanguage = newLanguage;
      updateLanguage();
      console.log("Language changed to:", currentLanguage);
    }
  }
  
  // Primary event listeners
  languageSelect.addEventListener("change", handleLanguageChange);
  languageSelect.addEventListener("input", handleLanguageChange);
  
  // Mobile-specific event listeners
  languageSelect.addEventListener("touchstart", function(e) {
    e.target.focus();
  });
  
  languageSelect.addEventListener("touchend", function(e) {
    setTimeout(() => {
      handleLanguageChange(e);
    }, 150);
  });
  
  // iOS Safari specific fix
  languageSelect.addEventListener("blur", function(e) {
    setTimeout(() => {
      handleLanguageChange(e);
    }, 100);
  });

  // Initialize date input validation
  const birthDateInput = document.getElementById("birthDate");
  if (birthDateInput) {
    birthDateInput.addEventListener("input", function(e) {
      const value = e.target.value;
      if (value) {
        const date = new Date(value);
        const year = date.getFullYear();
        if (year < 1900 || year > 2030) {
          e.target.setCustomValidity("Please enter a year between 1900 and 2030");
        } else {
          e.target.setCustomValidity("");
        }
      }
    });
  }

  // Initialize UI sidebar/settings event listeners
  registerUiEventListeners();

  // Initialize location prediction
  initializeLocationPrediction();

  // Initial language update
  updateLanguage();
});

function initializeLocationPrediction() {
  const stateInput = document.getElementById("birthState");
  const cityInput = document.getElementById("birthCity");
  const stateSuggestions = document.getElementById("stateSuggestions");
  const citySuggestions = document.getElementById("citySuggestions");

  if (!stateInput || !cityInput || !stateSuggestions || !citySuggestions) {
    console.warn("Location prediction elements not found");
    return;
  }

  // State input handler
  stateInput.addEventListener("input", function(e) {
    const value = e.target.value.toLowerCase();
    if (value.length < 1) {
      stateSuggestions.style.display = "none";
      return;
    }

    // Prioritize states that start with the typed letters, then others that contain them
    const startsWithMatches = locationData.states.filter(state => 
      state.toLowerCase().startsWith(value)
    );
    const containsMatches = locationData.states.filter(state => 
      state.toLowerCase().includes(value) && !state.toLowerCase().startsWith(value)
    );
    
    const matches = [...startsWithMatches, ...containsMatches].slice(0, 8);

    showSuggestions(stateSuggestions, matches, (selectedState) => {
      stateInput.value = selectedState;
      stateSuggestions.style.display = "none";
      cityInput.focus();
      // Clear city input when state changes
      cityInput.value = "";
    });
  });

  // Add keyboard navigation for state input
  stateInput.addEventListener("keydown", function(e) {
    handleKeyboardNavigation(e, stateSuggestions, (selectedValue) => {
      stateInput.value = selectedValue;
      stateSuggestions.style.display = "none";
      cityInput.focus();
      cityInput.value = "";
    });
  });

  // City input handler
  cityInput.addEventListener("input", function(e) {
    const value = e.target.value.toLowerCase();
    const selectedState = stateInput.value;
    
    if (value.length < 1) {
      citySuggestions.style.display = "none";
      return;
    }

    let matches = [];
    if (selectedState && locationData.cities[selectedState]) {
      // Prioritize cities that start with the typed letters within the selected state
      const stateCities = locationData.cities[selectedState];
      const startsWithMatches = stateCities.filter(city => 
        city.toLowerCase().startsWith(value)
      );
      const containsMatches = stateCities.filter(city => 
        city.toLowerCase().includes(value) && !city.toLowerCase().startsWith(value)
      );
      matches = [...startsWithMatches, ...containsMatches];
    }
    
    // If no state selected or no matches, search all cities
    if (matches.length === 0) {
      const allStartsWithMatches = [];
      const allContainsMatches = [];
      
      Object.values(locationData.cities).forEach(cities => {
        cities.forEach(city => {
          if (city.toLowerCase().startsWith(value)) {
            allStartsWithMatches.push(city);
          } else if (city.toLowerCase().includes(value)) {
            allContainsMatches.push(city);
          }
        });
      });
      
      // Remove duplicates and combine
      const uniqueStartsWithMatches = [...new Set(allStartsWithMatches)];
      const uniqueContainsMatches = [...new Set(allContainsMatches)];
      matches = [...uniqueStartsWithMatches, ...uniqueContainsMatches];
    }

    matches = matches.slice(0, 8);
    showSuggestions(citySuggestions, matches, (selectedCity) => {
      cityInput.value = selectedCity;
      citySuggestions.style.display = "none";
    });
  });

  // Add keyboard navigation for city input
  cityInput.addEventListener("keydown", function(e) {
    handleKeyboardNavigation(e, citySuggestions, (selectedValue) => {
      cityInput.value = selectedValue;
      citySuggestions.style.display = "none";
    });
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", function(e) {
    if (!stateInput.contains(e.target) && !stateSuggestions.contains(e.target)) {
      stateSuggestions.style.display = "none";
    }
    if (!cityInput.contains(e.target) && !citySuggestions.contains(e.target)) {
      citySuggestions.style.display = "none";
    }
  });

  // Improved blur handling to prevent race conditions
  stateInput.addEventListener("blur", function(e) {
    // Check if the blur is caused by clicking on a suggestion
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!stateSuggestions.contains(activeElement) && 
          !stateSuggestions.querySelector(':hover')) {
        stateSuggestions.style.display = "none";
      }
    }, 200);
  });
  
  cityInput.addEventListener("blur", function(e) {
    // Check if the blur is caused by clicking on a suggestion
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!citySuggestions.contains(activeElement) && 
          !citySuggestions.querySelector(':hover')) {
        citySuggestions.style.display = "none";
      }
    }, 200);
  });

  // Add focus events to show suggestions if input has value
  stateInput.addEventListener("focus", function() {
    if (this.value.length > 0) {
      // Trigger input event to show suggestions
      const event = new Event('input', { bubbles: true });
      this.dispatchEvent(event);
    }
  });

  cityInput.addEventListener("focus", function() {
    if (this.value.length > 0) {
      // Trigger input event to show suggestions
      const event = new Event('input', { bubbles: true });
      this.dispatchEvent(event);
    }
  });
}

function showSuggestions(container, suggestions, onSelect) {
  if (suggestions.length === 0) {
    container.style.display = "none";
    return;
  }

  container.innerHTML = "";
  suggestions.forEach(suggestion => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.textContent = suggestion;
    
    // Use mousedown instead of click to fire before blur event
    item.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Prevent blur from firing
      onSelect(suggestion);
    });
    
    // Also keep click event as fallback
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(suggestion);
    });
    
    container.appendChild(item);
  });

  container.style.display = "block";
}

function handleKeyboardNavigation(e, container, onSelect) {
  const items = container.querySelectorAll('.suggestion-item');
  if (items.length === 0) return;

  let currentIndex = Array.from(items).findIndex(item => item.classList.contains('highlighted'));

  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'ArrowUp':
      e.preventDefault();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case 'Enter':
      e.preventDefault();
      if (currentIndex >= 0 && items[currentIndex]) {
        onSelect(items[currentIndex].textContent);
        return;
      }
      break;
    case 'Escape':
      e.preventDefault();
      container.style.display = "none";
      return;
    default:
      return;
  }

  // Update highlighting
  items.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add('highlighted');
    } else {
      item.classList.remove('highlighted');
    }
  });
}

function updateLanguage() {
  const lang = translations[currentLanguage];
  if (!lang) return;

  // Update header - KEEP TITLE STATIC (AstroBioRhythm)
  const headerTitle = document.querySelector("header h1");
  const headerSubtitle = document.querySelector("header p");
  // DO NOT UPDATE: if (headerTitle) headerTitle.textContent = lang.appTitle;
  if (headerSubtitle) headerSubtitle.textContent = lang.appSubtitle;

  // Translate settings and sidebar elements
  const sLang = settingsTranslations[currentLanguage] || settingsTranslations.en;
  const settingsTitleEl = document.getElementById("settings-drawer-title");
  const settingsThemeEl = document.getElementById("settings-theme-title");
  const settingsSizeEl = document.getElementById("settings-size-title");
  const settingsBtnEl = document.getElementById("settings-btn-text");
  const tabCalcEl = document.getElementById("tab-calculator-nav");
  const tabBooksEl = document.getElementById("tab-books-nav");
  const menuCalcEl = document.getElementById("menu-calc-btn");
  const menuResultsEl = document.getElementById("menu-results-btn");
  const chapterNameEl = document.getElementById("current-chapter-name");
  
  if (settingsTitleEl) settingsTitleEl.textContent = sLang.settingsTitle;
  if (settingsThemeEl) settingsThemeEl.textContent = sLang.settingsTheme;
  if (settingsSizeEl) settingsSizeEl.textContent = sLang.settingsSize;
  if (settingsBtnEl) settingsBtnEl.textContent = sLang.settingsBtn;
  if (tabCalcEl) tabCalcEl.textContent = sLang.tabCalc;
  if (tabBooksEl) tabBooksEl.textContent = sLang.tabBooks;
  if (menuCalcEl) menuCalcEl.textContent = sLang.menuCalc;
  if (menuResultsEl) menuResultsEl.textContent = sLang.menuResults;
  if (chapterNameEl) {
    const isResultsActive = document.getElementById("results") && document.getElementById("results").style.display !== "none" && menuResultsEl && menuResultsEl.classList.contains("active");
    chapterNameEl.textContent = isResultsActive ? sLang.menuResults : `AstroBioRhythm ${sLang.tabCalc}`;
  }

  // Highlight theme selector buttons translated names and tooltips
  document.querySelectorAll('.theme-option').forEach(el => {
    const tKey = el.getAttribute('data-theme');
    const nameEl = el.querySelector('.theme-name');
    if (nameEl && sLang.themes[tKey]) {
      nameEl.textContent = sLang.themes[tKey];
    }
    if (sLang.themeTitles && sLang.themeTitles[tKey]) {
      el.setAttribute('title', sLang.themeTitles[tKey]);
    }
  });

  // Update size buttons tooltips
  const decBtn = document.getElementById("btn-size-decrease");
  const incBtn = document.getElementById("btn-size-increase");
  if (decBtn && sLang.btnSizeDecrease) {
    decBtn.setAttribute('title', sLang.btnSizeDecrease);
  }
  if (incBtn && sLang.btnSizeIncrease) {
    incBtn.setAttribute('title', sLang.btnSizeIncrease);
  }

  // Update cover page translations
  const coverAuthorEl = document.getElementById("cover-author-text");
  const coverSubtitleEl = document.getElementById("cover-subtitle-text");
  const coverMetaEl = document.getElementById("cover-meta-text");
  const btnStartEl = document.getElementById("btn-start-analysis");
  
  if (coverAuthorEl && sLang.coverAuthor) coverAuthorEl.textContent = sLang.coverAuthor;
  if (coverSubtitleEl && sLang.coverSubtitle) coverSubtitleEl.textContent = sLang.coverSubtitle;
  if (coverMetaEl && sLang.coverMeta) coverMetaEl.textContent = sLang.coverMeta;
  if (btnStartEl && sLang.startAnalysis) btnStartEl.textContent = sLang.startAnalysis;

  // Update library translations
  const libraryTitleEl = document.getElementById("library-title");
  const libraryDescEl = document.getElementById("library-desc-text");
  
  if (libraryTitleEl && sLang.libraryTitle) libraryTitleEl.textContent = sLang.libraryTitle;
  if (libraryDescEl && sLang.libraryDesc) libraryDescEl.textContent = sLang.libraryDesc;

  // Translate library grid sign names
  document.querySelectorAll('.zodiac-book-item').forEach(el => {
    const sign = el.getAttribute('data-sign');
    if (sign) {
      const titleMini = el.querySelector('.book-title-mini');
      const subtitleMini = el.querySelector('.book-subtitle-mini');
      if (titleMini) {
        titleMini.textContent = getTranslatedZodiacSign(sign);
      }
      if (subtitleMini) {
        subtitleMini.textContent = sign;
      }
    }
  });

  // Update audio banner & controls translations
  const audioBannerTextEl = document.getElementById("audio-banner-text");
  const btnAudioAcceptEl = document.getElementById("btn-audio-accept");
  const btnAudioDeclineEl = document.getElementById("btn-audio-decline");
  const btnAmbientSoundEl = document.getElementById("btn-ambient-sound");
  
  if (audioBannerTextEl && sLang.audioBannerText) audioBannerTextEl.textContent = sLang.audioBannerText;
  if (btnAudioAcceptEl && sLang.audioAccept) btnAudioAcceptEl.textContent = sLang.audioAccept;
  if (btnAudioDeclineEl && sLang.audioDecline) btnAudioDeclineEl.textContent = sLang.audioDecline;
  if (btnAmbientSoundEl && sLang.ambientSoundTitle) {
    btnAmbientSoundEl.setAttribute('title', sLang.ambientSoundTitle);
  }

  // Update form section
  const formTitle = document.querySelector(".form-section h2");
  const nameLabel = document.querySelector('label[for="name"]');
  const emailLabel = document.querySelector('label[for="email"]');
  const birthDateLabel = document.querySelector('label[for="birthDate"]');
  const birthTimeLabel = document.querySelector('label[for="birthTime"]');
  const birthStateLabel = document.querySelector('label[for="birthState"]');
  const birthCityLabel = document.querySelector('label[for="birthCity"]');
  const currentDateLabel = document.querySelector('label[for="currentDate"]');
  const submitBtn = document.querySelector(".submit-btn .btn-text");

  if (formTitle) formTitle.textContent = lang.formTitle;
  if (nameLabel) nameLabel.textContent = lang.nameLabel;
  if (emailLabel) emailLabel.textContent = lang.emailLabel;
  if (birthDateLabel) birthDateLabel.textContent = lang.birthDateLabel;
  if (birthTimeLabel) birthTimeLabel.textContent = lang.birthTimeLabel || "Time of Birth";
  if (birthStateLabel) birthStateLabel.textContent = lang.birthStateLabel || "State/Province/Region";
  if (birthCityLabel) birthCityLabel.textContent = lang.birthCityLabel || "City";
  if (currentDateLabel) currentDateLabel.textContent = lang.analysisDateLabel;
  if (submitBtn) submitBtn.textContent = lang.submitButton;

  // Update biorhythm story content (always available)
  const biorhythmStoryTitleElement = document.getElementById("biorhythmStoryTitle");
  const biorhythmIntroElement = document.getElementById("biorhythmIntro");
  const physicalCycleDescElement = document.getElementById("physicalCycleDesc");
  const emotionalCycleDescElement = document.getElementById("emotionalCycleDesc");
  const intellectualCycleDescElement = document.getElementById("intellectualCycleDesc");
  const biorhythmConclusionElement = document.getElementById("biorhythmConclusion");
  
  if (biorhythmStoryTitleElement) biorhythmStoryTitleElement.textContent = lang.biorhythmStoryTitle;
  if (biorhythmIntroElement) biorhythmIntroElement.textContent = lang.biorhythmIntro;
  if (physicalCycleDescElement) {
    const physicalCycleName = lang.physicalCycleDesc.split(':')[0] + ':';
    const physicalCycleText = lang.physicalCycleDesc.split(':').slice(1).join(':');
    physicalCycleDescElement.innerHTML = `<strong>${physicalCycleName}</strong>${physicalCycleText}`;
  }
  if (emotionalCycleDescElement) {
    const emotionalCycleName = lang.emotionalCycleDesc.split(':')[0] + ':';
    const emotionalCycleText = lang.emotionalCycleDesc.split(':').slice(1).join(':');
    emotionalCycleDescElement.innerHTML = `<strong>${emotionalCycleName}</strong>${emotionalCycleText}`;
  }
  if (intellectualCycleDescElement) {
    const intellectualCycleName = lang.intellectualCycleDesc.split(':')[0] + ':';
    const intellectualCycleText = lang.intellectualCycleDesc.split(':').slice(1).join(':');
    intellectualCycleDescElement.innerHTML = `<strong>${intellectualCycleName}</strong>${intellectualCycleText}`;
  }
  if (biorhythmConclusionElement) biorhythmConclusionElement.textContent = lang.biorhythmConclusion;

  // Update results section if visible
  const resultsElement = document.getElementById("results");
  if (resultsElement && resultsElement.style.display !== "none") {
    updateResultsLanguage();
  }

  // Update footer
  const footerText = document.querySelector("footer p");
  if (footerText) {
    footerText.innerHTML = lang.footerText.replace(
      "{year}",
      new Date().getFullYear()
    );
  }

  // Update SEO meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && lang.metaDescription) {
    metaDescription.setAttribute('content', lang.metaDescription);
  }

  // Update form description
  const formDescription = document.querySelector('.form-description');
  if (formDescription && lang.formDescription) {
    formDescription.textContent = lang.formDescription;
  }

  // Update footer features
  if (lang.footerFeatures) {
    const astrologyFeature = document.querySelector('#astrology-feature');
    const biorhythmFeature = document.querySelector('#biorhythm-feature');
    const multilingualFeature = document.querySelector('#multilingual-feature');
    const locationFeature = document.querySelector('#location-feature');
    const privacyFeature = document.querySelector('#privacy-feature');

    if (astrologyFeature) astrologyFeature.textContent = lang.footerFeatures.astrology;
    if (biorhythmFeature) biorhythmFeature.textContent = lang.footerFeatures.biorhythm;
    if (multilingualFeature) multilingualFeature.textContent = lang.footerFeatures.multilingual;
    if (locationFeature) locationFeature.textContent = lang.footerFeatures.location;
    if (privacyFeature) privacyFeature.textContent = lang.footerFeatures.privacy;
  }

  // Update footer section headings
  const footerFeaturesHeading = document.querySelector('#footer-features-heading');
  const footerLanguagesHeading = document.querySelector('#footer-languages-heading');
  
  if (footerFeaturesHeading && lang.footerSectionFeatures) {
    footerFeaturesHeading.textContent = lang.footerSectionFeatures;
  }
  if (footerLanguagesHeading && lang.footerSectionLanguages) {
    footerLanguagesHeading.textContent = lang.footerSectionLanguages;
  }

  // Update footer feature list items
  if (lang.footerFeatureItems) {
    const dailyHoroscopeItem = document.querySelector('#footer-daily-horoscope');
    const biorhythmCalculatorItem = document.querySelector('#footer-biorhythm-calculator');
    const natalChartAnalysisItem = document.querySelector('#footer-natal-chart-analysis');
    const zodiacCompatibilityItem = document.querySelector('#footer-zodiac-compatibility');
    const multilingualSupportItem = document.querySelector('#footer-multilingual-support');

    if (dailyHoroscopeItem) dailyHoroscopeItem.textContent = lang.footerFeatureItems.dailyHoroscope;
    if (biorhythmCalculatorItem) biorhythmCalculatorItem.textContent = lang.footerFeatureItems.biorhythmCalculator;
    if (natalChartAnalysisItem) natalChartAnalysisItem.textContent = lang.footerFeatureItems.natalChartAnalysis;
    if (zodiacCompatibilityItem) zodiacCompatibilityItem.textContent = lang.footerFeatureItems.zodiacCompatibility;
    if (multilingualSupportItem) multilingualSupportItem.textContent = lang.footerFeatureItems.multilingualSupport;
  }
}

function updateResultsLanguage() {
  const lang = translations[currentLanguage];
  if (!lang) return;

  // Update main results section
  const resultsTitle = document.querySelector(".results-section h2");
  const bornOnElement = document.querySelector(".user-info .born-on");
  const inElement = document.querySelector(".user-info .in");
  
  if (resultsTitle) resultsTitle.textContent = lang.resultsTitle;
  if (bornOnElement) bornOnElement.textContent = lang.bornOn;
  if (inElement) inElement.textContent = lang.in;

  // Update zodiac signs labels
  const sunSignElement = document.querySelector(".sun-sign h4");
  const moonSignElement = document.querySelector(".moon-sign h4");
  const risingSignElement = document.querySelector(".rising-sign h4");
  
  if (sunSignElement) sunSignElement.textContent = lang.sunSign;
  if (moonSignElement) moonSignElement.textContent = lang.moonSign;
  if (risingSignElement) risingSignElement.textContent = lang.risingSign;

  // Update daily horoscope section
  const dailyHoroscopeElement = document.querySelector(".daily-horoscope h3");
  const loveElement = document.querySelector(".love h4");
  const careerElement = document.querySelector(".career h4");
  const healthElement = document.querySelector(".health h4");
  
  if (dailyHoroscopeElement) dailyHoroscopeElement.textContent = lang.dailyHoroscope;
  if (loveElement) loveElement.textContent = lang.love;
  if (careerElement) careerElement.textContent = lang.career;
  if (healthElement) healthElement.textContent = lang.health;

  // Update biorhythm section
  const biorhythmTitleElement = document.querySelector(".biorhythm-section h3");
  const biorhythmCyclesElement = document.querySelector(".biorhythm-graph h3");
  const physicalElement = document.querySelector(".physical h4");
  const emotionalElement = document.querySelector(".emotional h4");
  const intellectualElement = document.querySelector(".intellectual h4");
  const biorhythmStoryElement = document.querySelector(".biorhythm-story h3");
  
  if (biorhythmTitleElement) biorhythmTitleElement.textContent = lang.biorhythmTitle;
  if (biorhythmCyclesElement) biorhythmCyclesElement.textContent = lang.biorhythmCycles;
  if (physicalElement) physicalElement.textContent = lang.physical;
  if (emotionalElement) emotionalElement.textContent = lang.emotional;
  if (intellectualElement) intellectualElement.textContent = lang.intellectual;
  if (biorhythmStoryElement) biorhythmStoryElement.textContent = lang.biorhythmScience;

  // Update biorhythm story content
  const biorhythmStoryTitleElement = document.getElementById("biorhythmStoryTitle");
  const biorhythmIntroElement = document.getElementById("biorhythmIntro");
  const physicalCycleDescElement = document.getElementById("physicalCycleDesc");
  const emotionalCycleDescElement = document.getElementById("emotionalCycleDesc");
  const intellectualCycleDescElement = document.getElementById("intellectualCycleDesc");
  const biorhythmConclusionElement = document.getElementById("biorhythmConclusion");
  
  if (biorhythmStoryTitleElement) biorhythmStoryTitleElement.textContent = lang.biorhythmStoryTitle;
  if (biorhythmIntroElement) biorhythmIntroElement.textContent = lang.biorhythmIntro;
  if (physicalCycleDescElement) {
    const physicalCycleName = lang.physicalCycleDesc.split(':')[0] + ':';
    const physicalCycleText = lang.physicalCycleDesc.split(':').slice(1).join(':');
    physicalCycleDescElement.innerHTML = `<strong>${physicalCycleName}</strong>${physicalCycleText}`;
  }
  if (emotionalCycleDescElement) {
    const emotionalCycleName = lang.emotionalCycleDesc.split(':')[0] + ':';
    const emotionalCycleText = lang.emotionalCycleDesc.split(':').slice(1).join(':');
    emotionalCycleDescElement.innerHTML = `<strong>${emotionalCycleName}</strong>${emotionalCycleText}`;
  }
  if (intellectualCycleDescElement) {
    const intellectualCycleName = lang.intellectualCycleDesc.split(':')[0] + ':';
    const intellectualCycleText = lang.intellectualCycleDesc.split(':').slice(1).join(':');
    intellectualCycleDescElement.innerHTML = `<strong>${intellectualCycleName}</strong>${intellectualCycleText}`;
  }
  if (biorhythmConclusionElement) biorhythmConclusionElement.textContent = lang.biorhythmConclusion;

  // Update natal chart section
  const natalChartElement = document.querySelector(".natal-chart h3");
  if (natalChartElement) natalChartElement.textContent = lang.natalChart;

  // Update zodiac characteristics
  const zodiacCharElement = document.querySelector(".zodiac-characteristics h3");
  const characteristicCards = document.querySelectorAll(".characteristic-card h4");
  
  if (zodiacCharElement) zodiacCharElement.textContent = lang.zodiacProfile;
  if (characteristicCards.length >= 3) {
    characteristicCards[0].textContent = lang.personalityTraits;
    characteristicCards[1].textContent = lang.strengths;
    characteristicCards[2].textContent = lang.challenges;
  }
}

function getZodiacStory(sign, type) {
  // Handle undefined or null sign
  if (!sign) {
    console.warn("getZodiacStory received undefined/null sign for type:", type);
    return `No zodiac sign information available.`;
  }

  return zodiacStoriesMultilingual[sign] &&
    zodiacStoriesMultilingual[sign][currentLanguage]
    ? zodiacStoriesMultilingual[sign][currentLanguage][type] ||
        `${type} information not available for ${sign}.`
    : `No information available for ${sign}.`;
}

// Helper function to get translated zodiac sign name
function getTranslatedZodiacSign(sign) {
  // Handle undefined or null sign
  if (!sign) {
    console.warn("getTranslatedZodiacSign received undefined/null sign");
    return "Unknown Sign";
  }
  
  const currentZodiacSigns = zodiacSigns[currentLanguage];
  if (currentZodiacSigns && currentZodiacSigns[sign]) {
    return currentZodiacSigns[sign];
  }
  
  // Fallback to original sign name if translation not found
  return sign;
}

// Seeded random number generator for consistent natal chart calculations
function createSeededRandom(seed) {
  let m = 0x80000000; // 2**31
  let a = 1103515245;
  let c = 12345;
  let state = seed ? seed : Math.floor(Math.random() * (m - 1));
  
  return function() {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// Generate seed from birth date and time for consistent calculations
function generateSeedFromDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  // Create a unique seed from date/time components
  return year * 10000 + month * 100 + day + hour * 60 + minute;
}

// Astronomical calculation functions for realistic natal chart
function julianDayNumber(date) {
  // Validate date input
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date object:", date);
    return 2451545.0; // Default to J2000.0 epoch
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  let timeOfDay = (hour - 12) / 24 + minute / 1440 + second / 86400;
  const result = jdn + timeOfDay;
  
  return result;
}

function calculateSunPosition(jd) {
  // Validate Julian Day input
  if (typeof jd !== 'number' || !Number.isFinite(jd)) {
    console.error("Invalid Julian Day:", jd);
    return {
      longitude: 0,
      sign: "Aries"
    };
  }
  
  // Simplified sun position calculation
  const n = jd - 2451545.0; // Days since J2000.0
  const L = (280.460 + 0.9856474 * n) % 360; // Mean longitude
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180; // Mean anomaly in radians
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360; // Ecliptic longitude
  
  // Normalize lambda
  let normalizedLambda = lambda;
  if (normalizedLambda < 0) normalizedLambda += 360;
  
  const result = {
    longitude: normalizedLambda,
    sign: getSignFromLongitude(normalizedLambda)
  };
  
  return result;
}

function calculateMoonPosition(jd) {
  // Simplified moon position calculation
  const n = jd - 2451545.0;
  const L = (218.316 + 13.176396 * n) % 360; // Mean longitude
  const M = ((134.963 + 13.064993 * n) % 360) * Math.PI / 180; // Mean anomaly
  const F = ((93.272 + 13.229350 * n) % 360) * Math.PI / 180; // Mean distance
  
  let lambda = L + 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * (L * Math.PI / 180) - M) + 0.658 * Math.sin(2 * (L * Math.PI / 180));
  lambda = lambda % 360;
  if (lambda < 0) lambda += 360;
  
  return {
    longitude: lambda,
    sign: getSignFromLongitude(lambda)
  };
}

function calculatePlanetPosition(jd, planet) {
  // Simplified planetary position calculations
  const n = jd - 2451545.0;
  let L, M, lambda;
  
  switch (planet) {
    case 'mercury':
      L = (252.251 + 4.092317 * n) % 360;
      M = ((149.563 + 4.092317 * n) % 360) * Math.PI / 180;
      lambda = (L + 23.44 * Math.sin(M)) % 360;
      break;
    case 'venus':
      L = (181.980 + 1.602130 * n) % 360;
      M = ((212.603 + 1.602130 * n) % 360) * Math.PI / 180;
      lambda = (L + 0.72 * Math.sin(M)) % 360;
      break;
    case 'mars':
      L = (355.433 + 0.524033 * n) % 360;
      M = ((319.530 + 0.524033 * n) % 360) * Math.PI / 180;
      lambda = (L + 10.69 * Math.sin(M)) % 360;
      break;
    case 'jupiter':
      L = (34.351 + 0.083056 * n) % 360;
      M = ((225.328 + 0.083056 * n) % 360) * Math.PI / 180;
      lambda = (L + 5.36 * Math.sin(M)) % 360;
      break;
    case 'saturn':
      L = (50.077 + 0.033371 * n) % 360;
      M = ((175.466 + 0.033371 * n) % 360) * Math.PI / 180;
      lambda = (L + 5.62 * Math.sin(M)) % 360;
      break;
    default:
      // For outer planets, use simplified approximations
      const period = planet === 'uranus' ? 84 : planet === 'neptune' ? 165 : 248;
      L = (Math.random() * 360 + 0.5 * n / period) % 360;
      lambda = L;
  }
  
  if (lambda < 0) lambda += 360;
  
  return {
    longitude: lambda,
    sign: getSignFromLongitude(lambda),
    latitude: (Math.random() - 0.5) * 5, // Simplified ecliptic latitude
    distance: 1.0 + (Math.random() - 0.5) * 0.1,
    speed: 1.0
  };
}

function getSignFromLongitude(longitude) {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  // Validate longitude input
  if (typeof longitude !== 'number' || !Number.isFinite(longitude)) {
    console.error("Invalid longitude:", longitude);
    return "Aries"; // Default fallback
  }
  
  // Normalize longitude to 0-360 range
  let normalizedLong = longitude % 360;
  if (normalizedLong < 0) normalizedLong += 360;
  
  const signIndex = Math.floor(normalizedLong / 30);
  
  // Validate sign index
  if (signIndex < 0 || signIndex >= 12) {
    console.error("Invalid sign index:", signIndex, "for longitude:", longitude);
    return "Aries"; // Default fallback
  }
  
  return signs[signIndex];
}

function calculateAscendant(jd, latitude, longitude) {
  // Simplified ascendant calculation
  const siderealTime = calculateSiderealTime(jd, longitude);
  const obliquity = 23.4367; // Earth's obliquity
  
  // Simplified calculation - in reality this is much more complex
  const localSiderealTime = (siderealTime + longitude / 15) % 24;
  const ascendantAngle = (localSiderealTime * 15 + latitude * 0.25) % 360;
  
  return {
    longitude: ascendantAngle,
    sign: getSignFromLongitude(ascendantAngle)
  };
}

function calculateSiderealTime(jd, longitude) {
  // Simplified sidereal time calculation
  const t = (jd - 2451545.0) / 36525.0;
  const gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000.0;
  return ((gst % 360) / 15) % 24;
}

function calculateHouses(ascendant, latitude) {
  // Simplified house calculation using Placidus system approximation
  const houses = [];
  const ascendantLong = ascendant.longitude;
  
  for (let i = 1; i <= 12; i++) {
    let houseLongitude;
    if (i === 1) {
      houseLongitude = ascendantLong;
    } else if (i === 7) {
      houseLongitude = (ascendantLong + 180) % 360;
    } else if (i === 10) {
      houseLongitude = (ascendantLong + 90) % 360;
    } else if (i === 4) {
      houseLongitude = (ascendantLong + 270) % 360;
    } else {
      // Simplified intermediate house calculation
      const houseOffset = ((i - 1) * 30 + latitude * 0.1) % 360;
      houseLongitude = (ascendantLong + houseOffset) % 360;
    }
    
    houses.push({
      number: i,
      longitude: houseLongitude,
      sign: getSignFromLongitude(houseLongitude)
    });
  }
  
  return houses;
}

function calculateRealisticAspects(planets) {
  const aspects = [];
  const planetNames = Object.keys(planets);
  const aspectTypes = [
    { name: 'conjunction', angle: 0, orb: 8 },
    { name: 'opposition', angle: 180, orb: 8 },
    { name: 'trine', angle: 120, orb: 6 },
    { name: 'square', angle: 90, orb: 6 },
    { name: 'sextile', angle: 60, orb: 4 }
  ];
  
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planetNames[i];
      const planet2 = planetNames[j];
      const long1 = planets[planet1].longitude;
      const long2 = planets[planet2].longitude;
      
      let diff = Math.abs(long1 - long2);
      if (diff > 180) diff = 360 - diff;
      
      for (let aspect of aspectTypes) {
        const deviation = Math.abs(diff - aspect.angle);
        if (deviation <= aspect.orb) {
          const nature = (aspect.name === 'trine' || aspect.name === 'sextile') 
            ? translations[currentLanguage].harmonious || "Harmonious"
            : aspect.name === 'conjunction' 
            ? "Neutral"
            : translations[currentLanguage].challenging || "Challenging";
          
          aspects.push({
            planet1,
            planet2,
            type: aspect.name,
            exactAngle: aspect.angle,
            actualAngle: Math.round(diff * 10) / 10,
            difference: Math.round(deviation * 10) / 10,
            nature
          });
          break;
        }
      }
    }
  }
  
  return aspects;
}

function parseDateInput(dateStr, fallbackToNow = false) {
  if (!dateStr && fallbackToNow) return new Date();

  // Try standard parsing
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  // Try alternative formats (for Safari/FF compatibility)
  const altDate = new Date(dateStr.replace(/-/g, "/"));
  if (!isNaN(altDate.getTime())) return altDate;

  return fallbackToNow ? new Date() : null;
}

// Helper function to manage button loading state
function setButtonLoadingState(isLoading) {
  const submitBtn = document.querySelector(".submit-btn");
  const btnText = submitBtn?.querySelector(".btn-text");
  const spinner = submitBtn?.querySelector(".cosmic-spinner");
  
  if (btnText && spinner) {
    if (isLoading) {
      btnText.style.display = "none";
      spinner.style.display = "block";
      submitBtn.disabled = true;
    } else {
      btnText.style.display = "block";
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  }
}

async function calculateAstroData() {
  try {
    // Show loading state
    setButtonLoadingState(true);

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthDateStr = document.getElementById("birthDate").value;
    const birthTimeStr = document.getElementById("birthTime").value;
    const birthState = document.getElementById("birthState").value.trim();
    const birthCity = document.getElementById("birthCity").value.trim();
    const currentDateStr = document.getElementById("currentDate").value;

    // Validate required fields
    if (!name || !email || !birthDateStr || !birthTimeStr || !birthState || !birthCity) {
      throw new Error("Please fill in all required fields");
    }

    // Combine date and time
    const birthDateTimeStr = `${birthDateStr}T${birthTimeStr}`;
    const birthPlace = `${birthCity}, ${birthState}`;

    // Parse dates with improved validation
    const birthDate = new Date(birthDateTimeStr);
    const currentDate = currentDateStr ? new Date(currentDateStr) : new Date();

    if (isNaN(birthDate.getTime())) throw new Error("Invalid birth date or time format");
    if (isNaN(currentDate.getTime())) throw new Error("Invalid analysis date format");

    // Show loading indicator
    const swal = Swal.fire({
      title: "Calculating...",
      html: "Generating your astrological profile",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // Process data
    const astroData = await calculateNatalChart(birthDate, birthPlace);
    // For biorhythm bars, always use today's date for current biorhythm status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bioData = calculateBiorhythm(birthDate, today);

    // Save calculation state for theme redraws
    state.lastCalculation = {
      name,
      birthDate,
      birthPlace,
      astroData,
      bioData,
      currentDate
    };

    // Sync with localStorage so the monthly biorhythm app can read it
    const userData = {
      name,
      email,
      birthDate: birthDateTimeStr, // The full datetime string YYYY-MM-DDTHH:MM
      birthPlace,
      birthTimeStr,
      birthState,
      birthCity
    };
    localStorage.setItem("astrobiorhythm_user_data", JSON.stringify(userData));

    // Display results
    await displayResults(
      name,
      birthDate,
      birthPlace,
      astroData,
      bioData,
      currentDate
    );

    // Close loading
    swal.close();
    
    // Restore button state
    setButtonLoadingState(false);
  } catch (error) {
    // Restore button state on error
    setButtonLoadingState(false);
    
    Swal.fire(
      "Error",
      error.message || "Failed to calculate chart. Please try again.",
      "error"
    );
    console.error("Calculation error:", error);
  }
}

async function displayResults(
  name,
  birthDate,
  birthPlace,
  astroData,
  bioData,
  currentDate
) {
  try {
    // Validate dates again
    birthDate = parseDateInput(birthDate);
    currentDate = parseDateInput(currentDate, true);
    if (!birthDate || !currentDate) throw new Error("Invalid date parameters");

    // Update UI elements
    document.getElementById("results").style.display = "block";
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });

    // Show results menu button in sidebar
    const menuResultsBtn = document.getElementById("menu-results-btn");
    const menuCalcBtn = document.getElementById("menu-calc-btn");
    const chapterNameEl = document.getElementById("current-chapter-name");
    const sLang = settingsTranslations[currentLanguage] || settingsTranslations.en;
    
    if (menuResultsBtn) {
      menuResultsBtn.style.display = "block";
      menuResultsBtn.classList.add("active");
    }
    if (menuCalcBtn) {
      menuCalcBtn.classList.remove("active");
    }
    if (chapterNameEl && sLang.menuResults) {
      chapterNameEl.textContent = sLang.menuResults;
    }

    // Update SVG ornaments with computed sign glyph
    const sunSign = astroData.sunSign || "Virgo";
    const glyphPath = zodiacSvgPaths[sunSign] || zodiacSvgPaths.Star;
    const placeholder = document.getElementById("top-arch-glyph-placeholder");
    if (placeholder) {
      placeholder.innerHTML = glyphPath;
    }
    const sidebarPlaceholder = document.getElementById("sidebar-zodiac-glyph");
    if (sidebarPlaceholder) {
      sidebarPlaceholder.innerHTML = glyphPath;
    }

    // Set user info
    const userNameElement = document.getElementById("userName");
    const userBirthDateElement = document.getElementById("userBirthDate");
    const userBirthPlaceElement = document.getElementById("userBirthPlace");
    
    if (userNameElement) userNameElement.textContent = name;
    if (userBirthDateElement) {
      userBirthDateElement.textContent = birthDate.toLocaleDateString(currentLanguage, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (userBirthPlaceElement) userBirthPlaceElement.textContent = birthPlace;

    // Validate astroData
    if (!astroData) {
      throw new Error("Failed to calculate astrological data");
    }

    // Set astro data with zodiac symbols
    const sunSignElement = document.getElementById("sunSign");
    const moonSignElement = document.getElementById("moonSign");
    const risingSignElement = document.getElementById("risingSign");
    
    if (sunSignElement) {
      const sunSign = astroData.sunSign || "Aries"; // Fallback if undefined
      const sunSymbol = zodiacSymbols[sunSign] || "";
      const translatedSunSign = getTranslatedZodiacSign(sunSign);
      sunSignElement.innerHTML = `<span class="zodiac-symbol">${sunSymbol}</span> ${translatedSunSign}`;
    }
    if (moonSignElement) {
      const moonSign = astroData.moonSign || "Cancer"; // Fallback if undefined
      const moonSymbol = zodiacSymbols[moonSign] || "";
      const translatedMoonSign = getTranslatedZodiacSign(moonSign);
      moonSignElement.innerHTML = `<span class="zodiac-symbol">${moonSymbol}</span> ${translatedMoonSign}`;
    }
    if (risingSignElement) {
      const risingSign = astroData.risingSign || "Leo"; // Fallback if undefined
      const risingSymbol = zodiacSymbols[risingSign] || "";
      const translatedRisingSign = getTranslatedZodiacSign(risingSign);
      risingSignElement.innerHTML = `<span class="zodiac-symbol">${risingSymbol}</span> ${translatedRisingSign}`;
    }

    // Set zodiac stories
    const sunSignStoryElement = document.getElementById("sunSignStory");
    const moonSignStoryElement = document.getElementById("moonSignStory");
    const risingSignStoryElement = document.getElementById("risingSignStory");
    
    if (sunSignStoryElement) {
      sunSignStoryElement.textContent = getZodiacStory(astroData.sunSign, "sun");
    }
    if (moonSignStoryElement) {
      moonSignStoryElement.textContent = getZodiacStory(astroData.moonSign, "moon");
    }
    if (risingSignStoryElement) {
      risingSignStoryElement.textContent = getZodiacStory(astroData.risingSign, "rising");
    }

    // Set daily horoscope
    const loveHoroscopeElement = document.getElementById("loveHoroscope");
    const careerHoroscopeElement = document.getElementById("careerHoroscope");
    const healthHoroscopeElement = document.getElementById("healthHoroscope");
    
    if (loveHoroscopeElement) {
      loveHoroscopeElement.textContent = getZodiacStory(astroData.sunSign, "love");
    }
    if (careerHoroscopeElement) {
      careerHoroscopeElement.textContent = getZodiacStory(astroData.sunSign, "career");
    }
    if (healthHoroscopeElement) {
      healthHoroscopeElement.textContent = getZodiacStory(astroData.sunSign, "health");
    }

    // Set zodiac characteristics
    const personalityTraitsElement = document.getElementById("personalityTraits");
    const strengthsElement = document.getElementById("strengths");
    const challengesElement = document.getElementById("challenges");
    
    if (personalityTraitsElement) {
      personalityTraitsElement.textContent = getZodiacStory(astroData.sunSign, "traits");
    }
    if (strengthsElement) {
      strengthsElement.textContent = getZodiacStory(astroData.sunSign, "strengths");
    }
    if (challengesElement) {
      challengesElement.textContent = getZodiacStory(astroData.sunSign, "challenges");
    }

    // Set biorhythm data
    const physicalBar = document.getElementById("physicalBar");
    const physicalValue = document.getElementById("physicalValue");
    const physicalDesc = document.getElementById("physicalDesc");
    
    if (physicalBar) physicalBar.style.width = `${bioData.physical.percent}%`;
    if (physicalValue) physicalValue.textContent = `${bioData.physical.percent}%`;
    if (physicalDesc) physicalDesc.textContent = bioData.physical.description;

    const emotionalBar = document.getElementById("emotionalBar");
    const emotionalValue = document.getElementById("emotionalValue");
    const emotionalDesc = document.getElementById("emotionalDesc");
    
    if (emotionalBar) emotionalBar.style.width = `${bioData.emotional.percent}%`;
    if (emotionalValue) emotionalValue.textContent = `${bioData.emotional.percent}%`;
    if (emotionalDesc) emotionalDesc.textContent = bioData.emotional.description;

    const intellectualBar = document.getElementById("intellectualBar");
    const intellectualValue = document.getElementById("intellectualValue");
    const intellectualDesc = document.getElementById("intellectualDesc");
    
    if (intellectualBar) intellectualBar.style.width = `${bioData.intellectual.percent}%`;
    if (intellectualValue) intellectualValue.textContent = `${bioData.intellectual.percent}%`;
    if (intellectualDesc) intellectualDesc.textContent = bioData.intellectual.description;

    // Initialize charts
    await createNatalChart(astroData.planets);
    await createBiorhythmChart(birthDate, currentDate);

    // Display aspects
    const aspectsList = document.getElementById("aspectsList");
    if (aspectsList) {
      aspectsList.innerHTML = "";
      astroData.aspects.forEach((aspect) => {
        const aspectItem = document.createElement("div");
        aspectItem.className = "aspect-item";
        aspectItem.innerHTML = `
          <strong>${aspect.planet1.toUpperCase()} ${
          aspect.type
        } ${aspect.planet2.toUpperCase()}</strong>
          <span> (${aspect.exactAngle}°, ${aspect.nature})</span>
        `;
        aspectsList.appendChild(aspectItem);
      });
    }

    // Set zodiac image
    const zodiacImg = document.getElementById("zodiacImage");
    if (zodiacImg) {
      if (astroData.sunSign && zodiacImages[astroData.sunSign]) {
        zodiacImg.src = zodiacImages[astroData.sunSign];
        zodiacImg.alt = `${astroData.sunSign} Zodiac Sign`;
        zodiacImg.style.display = "block";
      } else {
        zodiacImg.style.display = "none";
      }
    }

    // Update language again in case it changed during calculation
    updateResultsLanguage();
  } catch (error) {
    throw new Error(`Failed to display results: ${error.message}`);
  }
}

function createBiorhythmChart(birthDate, currentDate) {
  try {
    // Validate and normalize dates
    if (!(birthDate instanceof Date) || !(currentDate instanceof Date)) {
      throw new Error("Invalid date parameters");
    }

    const canvas = document.getElementById("biorhythmChart");
    if (!canvas) throw new Error("Chart canvas not found");

    // Properly destroy previous chart if it exists
    if (window.biorhythmChart instanceof Chart) {
      window.biorhythmChart.destroy();
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Always use today's date as the reference point for the chart
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize birth date to ensure consistent calculations
    const normalizedBirthDate = new Date(birthDate);
    normalizedBirthDate.setHours(0, 0, 0, 0);

    // Generate chart data - centered on today (always from actual current date)
    const daysToShow = 30; // 15 days before and after today
    const dates = [];
    const physicalData = [];
    const emotionalData = [];
    const intellectualData = [];

    for (let i = -daysToShow / 2; i <= daysToShow / 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0); // Normalize time to avoid calculation inconsistencies

      dates.push(
        date.toLocaleDateString(currentLanguage, {
          month: "short",
          day: "numeric",
        })
      );

      // Use normalized birth date for consistent biorhythm calculations
      const bioData = calculateBiorhythm(normalizedBirthDate, date);
      physicalData.push(bioData.physical.value);
      emotionalData.push(bioData.emotional.value);
      intellectualData.push(bioData.intellectual.value);
    }

    const colors = getThemeChartColors();

    // Create new chart
    window.biorhythmChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: translations[currentLanguage].physical,
            data: physicalData,
            borderColor: colors.physical,
            backgroundColor: colors.physical + "1a",
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: (ctx) =>
              ctx.dataIndex === Math.floor(daysToShow / 2)
                ? colors.textMain
                : "transparent",
            pointBorderColor: colors.physical,
            pointBorderWidth: 2,
          },
          {
            label: translations[currentLanguage].emotional,
            data: emotionalData,
            borderColor: colors.emotional,
            backgroundColor: colors.emotional + "1a",
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: (ctx) =>
              ctx.dataIndex === Math.floor(daysToShow / 2)
                ? colors.textMain
                : "transparent",
            pointBorderColor: colors.emotional,
            pointBorderWidth: 2,
          },
          {
            label: translations[currentLanguage].intellectual,
            data: intellectualData,
            borderColor: colors.intellectual,
            backgroundColor: colors.intellectual + "1a",
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: (ctx) =>
              ctx.dataIndex === Math.floor(daysToShow / 2)
                ? colors.textMain
                : "transparent",
            pointBorderColor: colors.intellectual,
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: -1,
            max: 1,
            ticks: {
              color: colors.textMuted,
              font: {
                family: "'Lora', serif"
              },
              callback: function (value) {
                return value.toFixed(1);
              },
            },
            grid: {
              color: function (context) {
                return context.tick.value === 0
                  ? colors.zeroGridColor
                  : colors.gridColor;
              },
            },
          },
          x: {
            ticks: {
              color: colors.textMuted,
              font: {
                family: "'Lora', serif"
              }
            },
            grid: { display: false },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
              },
              title: function (context) {
                const todayIndex = Math.floor(daysToShow / 2);
                const date = context[0].label;
                return context[0].dataIndex === todayIndex
                  ? `${translations[currentLanguage].today || "Today"} (${date})`
                  : date;
              },
            },
          },
          legend: {
            position: "top",
            labels: {
              color: colors.textMain,
              font: {
                family: "'Lora', serif",
                size: 12
              }
            }
          },
        },
        elements: {
          point: {
            radius: function (context) {
              return context.dataIndex === Math.floor(daysToShow / 2) ? 6 : 3;
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Biorhythm chart error:", error);
    throw new Error("Could not create biorhythm chart");
  }
}

async function calculateNatalChart(birthDate, birthPlace) {
  try {
    // Step 1: Get coordinates for birth place using free geocoding
    const coords = await geocodeLocationFree(birthPlace);
    if (!coords) throw new Error("Could not geocode birth place");

    // Step 2: Calculate Julian Day Number for astronomical calculations
    const jd = julianDayNumber(birthDate);

    // Step 3: Calculate actual sun position
    const sunPosition = calculateSunPosition(jd);
    const sunSign = sunPosition.sign;

    // Step 4: Calculate realistic moon position
    const moonPosition = calculateMoonPosition(jd);
    const moonSign = moonPosition.sign;

    // Step 5: Calculate ascendant (rising sign) based on time and location
    const ascendant = calculateAscendant(jd, coords.lat, coords.lng);
    const risingSign = ascendant.sign;

    // Step 6: Calculate realistic planetary positions
    const planets = {
      sun: sunPosition,
      moon: moonPosition,
      mercury: calculatePlanetPosition(jd, 'mercury'),
      venus: calculatePlanetPosition(jd, 'venus'),
      mars: calculatePlanetPosition(jd, 'mars'),
      jupiter: calculatePlanetPosition(jd, 'jupiter'),
      saturn: calculatePlanetPosition(jd, 'saturn'),
      uranus: calculatePlanetPosition(jd, 'uranus'),
      neptune: calculatePlanetPosition(jd, 'neptune'),
      pluto: calculatePlanetPosition(jd, 'pluto')
    };

    // Step 7: Calculate houses based on ascendant and location
    const houses = calculateHouses(ascendant, coords.lat);

    // Step 8: Calculate realistic aspects between planets
    const aspects = calculateRealisticAspects(planets);

    // Step 9: Get timezone (optional, fallback to UTC)
    let timezone;
    try {
      timezone = await getTimezone(coords.lat, coords.lng, birthDate);
    } catch (error) {
      console.warn("Timezone calculation failed, using UTC");
      timezone = { id: "UTC", offset: 0, dst: false };
    }

    return {
      sunSign,
      moonSign,
      risingSign,
      planets,
      houses: {
        ascendant,
        midheaven: {
          longitude: (ascendant.longitude + 90) % 360,
          sign: getSignFromLongitude((ascendant.longitude + 90) % 360)
        },
        houses
      },
      aspects,
      coordinates: coords,
      timezone,
      julianDay: jd
    };
  } catch (error) {
    console.error("Natal chart calculation error:", error);
    throw new Error(`Failed to calculate natal chart: ${error.message}`);
  }
}

// Helper Functions

// Free geocoding using OpenStreetMap Nominatim service
async function geocodeLocationFree(location) {
  try {
    // Clean and encode the location string
    const cleanLocation = location.trim().replace(/\s+/g, ' ');
    const encodedLocation = encodeURIComponent(cleanLocation);
    
    // Use Nominatim (free OpenStreetMap geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AstroBioRhythm/1.0 (Horoscope Calculator)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding service error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formatted: result.display_name,
        country: result.address?.country || '',
        city: result.address?.city || result.address?.town || result.address?.village || ''
      };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Free geocoding error:", error);
    
    // Fallback to original geocoding method
    try {
      return await geocodeLocation(location);
    } catch (fallbackError) {
      console.error("Fallback geocoding also failed:", fallbackError);
      throw new Error("Could not determine location coordinates. Please check the place name and try again.");
    }
  }
}

// Keep original geocoding as fallback
async function geocodeLocation(location) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        formatted: data[0].display_name,
      };
    }
    throw new Error("Location not found");
  } catch (error) {
    throw error;
  }
}

async function getTimezone(lat, lng, date) {
  try {
    // Try multiple free timezone services
    
    // Option 1: Try WorldTimeAPI (free)
    try {
      const response = await fetch(
        `https://worldtimeapi.org/api/timezone/Etc/GMT`
      );
      if (response.ok) {
        const data = await response.json();
        return {
          id: data.timezone || "UTC",
          offset: data.raw_offset || 0,
          dst: data.dst || false
        };
      }
    } catch (error) {
      console.warn("WorldTimeAPI failed, trying alternative...");
    }

    // Option 2: Try TimeZoneDB with free tier (if available)
    // Note: This would require an API key for production use
    
    // Option 3: Simple timezone estimation based on longitude
    const estimatedOffset = Math.round(lng / 15); // Rough timezone estimation
    const timezoneId = `GMT${estimatedOffset >= 0 ? '+' : ''}${estimatedOffset}`;
    
    console.warn("Using estimated timezone based on longitude");
    return {
      id: timezoneId,
      offset: estimatedOffset * 3600, // Convert to seconds
      dst: false // Simplified - no DST calculation
    };
    
  } catch (error) {
    console.error("All timezone services failed, using UTC:", error);
    return { 
      id: "UTC", 
      offset: 0, 
      dst: false 
    };
  }
}

function getSunSign(date) {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Correct zodiac date ranges
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
  
  return "Aries"; // Default fallback
}

function getDeterministicSign(seededRandom) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[Math.floor(seededRandom() * signs.length)];
}

function getRandomSign() {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[Math.floor(Math.random() * signs.length)];
}

function generateDeterministicPlanetaryPositions(seededRandom) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const planets = {};
  const planetNames = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ];

  planetNames.forEach((planet) => {
    const signIndex = Math.floor(seededRandom() * 12);
    planets[planet] = {
      longitude: signIndex * 30 + seededRandom() * 30,
      latitude: seededRandom() * 10 - 5,
      distance: 1 + seededRandom(),
      speed: 0.5 + seededRandom(),
      sign: signs[signIndex],
    };
  });

  return planets;
}

function generateRandomPlanetaryPositions() {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const planets = {};
  const planetNames = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ];

  planetNames.forEach((planet) => {
    const signIndex = Math.floor(Math.random() * 12);
    planets[planet] = {
      longitude: signIndex * 30 + Math.random() * 30,
      latitude: Math.random() * 10 - 5,
      distance: 1 + Math.random(),
      speed: 0.5 + Math.random(),
      sign: signs[signIndex],
    };
  });

  return planets;
}

function generateDeterministicHouses(seededRandom) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const ascendantSign = signs[Math.floor(seededRandom() * signs.length)];

  return {
    ascendant: {
      longitude: seededRandom() * 360,
      sign: ascendantSign,
    },
    midheaven: {
      longitude: seededRandom() * 360,
      sign: signs[Math.floor(seededRandom() * signs.length)],
    },
    houses: Array(12)
      .fill()
      .map((_, i) => ({
        number: i + 1,
        longitude: seededRandom() * 360,
        sign: signs[Math.floor(seededRandom() * signs.length)],
      })),
  };
}

function generateRandomHouses() {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const ascendantSign = getRandomSign();

  return {
    ascendant: {
      longitude: Math.random() * 360,
      sign: ascendantSign,
    },
    midheaven: {
      longitude: Math.random() * 360,
      sign: getRandomSign(),
    },
    houses: Array(12)
      .fill()
      .map((_, i) => ({
        number: i + 1,
        longitude: Math.random() * 360,
        sign: getRandomSign(),
      })),
  };
}

function generateDeterministicAspects(planets, seededRandom) {
  // Generate consistent aspects based on planetary positions
  const aspectTypes = ["conjunction", "opposition", "trine", "square", "sextile"];
  const planetNames = Object.keys(planets);
  const aspects = [];
  
  // Generate a few deterministic aspects
  for (let i = 0; i < 3; i++) {
    const planet1Index = Math.floor(seededRandom() * planetNames.length);
    let planet2Index = Math.floor(seededRandom() * planetNames.length);
    // Ensure different planets
    while (planet2Index === planet1Index) {
      planet2Index = Math.floor(seededRandom() * planetNames.length);
    }
    
    const planet1 = planetNames[planet1Index];
    const planet2 = planetNames[planet2Index];
    const aspectType = aspectTypes[Math.floor(seededRandom() * aspectTypes.length)];
    
    // Calculate aspect angle based on type
    let exactAngle = 0;
    switch (aspectType) {
      case "conjunction": exactAngle = 0; break;
      case "opposition": exactAngle = 180; break;
      case "trine": exactAngle = 120; break;
      case "square": exactAngle = 90; break;
      case "sextile": exactAngle = 60; break;
    }
    
    const actualAngle = exactAngle + (seededRandom() * 10 - 5); // ±5 degree orb
    const difference = Math.abs(actualAngle - exactAngle);
    const nature = (aspectType === "trine" || aspectType === "sextile" || aspectType === "conjunction") 
      ? translations[currentLanguage].harmonious || "Harmonious"
      : translations[currentLanguage].challenging || "Challenging";
    
    aspects.push({
      planet1,
      planet2,
      type: aspectType,
      exactAngle,
      actualAngle: Math.round(actualAngle * 10) / 10,
      difference: Math.round(difference * 10) / 10,
      nature,
    });
  }
  
  return aspects;
}

function generateRandomAspects(planets) {
  // Return some sample aspects for testing
  return [
    {
      planet1: "sun",
      planet2: "moon",
      type: "conjunction",
      exactAngle: 0,
      actualAngle: 5,
      difference: 5,
      nature: translations[currentLanguage].harmonious || "Harmonious",
    },
    {
      planet1: "mercury",
      planet2: "venus",
      type: "trine",
      exactAngle: 120,
      actualAngle: 122,
      difference: 2,
      nature: translations[currentLanguage].harmonious || "Harmonious",
    },
  ];
}

function calculateBiorhythm(birthDate, currentDate) {
  // Normalize both dates to midnight to ensure consistent day calculations
  const normalizedBirthDate = new Date(birthDate);
  normalizedBirthDate.setHours(0, 0, 0, 0);
  
  const normalizedCurrentDate = new Date(currentDate);
  normalizedCurrentDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in days using UTC to avoid timezone issues
  const diffTime = normalizedCurrentDate.getTime() - normalizedBirthDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const PHYSICAL_CYCLE = 23;
  const EMOTIONAL_CYCLE = 28;
  const INTELLECTUAL_CYCLE = 33;

  const physicalPos = (2 * Math.PI * diffDays) / PHYSICAL_CYCLE;
  const emotionalPos = (2 * Math.PI * diffDays) / EMOTIONAL_CYCLE;
  const intellectualPos = (2 * Math.PI * diffDays) / INTELLECTUAL_CYCLE;

  const physicalValue = Math.sin(physicalPos);
  const emotionalValue = Math.sin(emotionalPos);
  const intellectualValue = Math.sin(intellectualPos);

  const physicalPercent = Math.round((physicalValue + 1) * 50);
  const emotionalPercent = Math.round((emotionalValue + 1) * 50);
  const intellectualPercent = Math.round((intellectualValue + 1) * 50);

  const physicalDesc = getBiorhythmDescription(physicalValue, "physical");
  const emotionalDesc = getBiorhythmDescription(emotionalValue, "emotional");
  const intellectualDesc = getBiorhythmDescription(
    intellectualValue,
    "intellectual"
  );

  return {
    physical: {
      value: physicalValue,
      percent: physicalPercent,
      description: physicalDesc,
    },
    emotional: {
      value: emotionalValue,
      percent: emotionalPercent,
      description: emotionalDesc,
    },
    intellectual: {
      value: intellectualValue,
      percent: intellectualPercent,
      description: intellectualDesc,
    },
  };
}

function getBiorhythmDescription(value, type) {
  const lang = translations[currentLanguage];
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);

  if (value > 0.8)
    return lang[`${type}Peak`] || `${typeName} peak! You're at your very best today.`;
  if (value > 0.5)
    return lang[`${type}High`] || `High ${type} energy. A very good day.`;
  if (value > 0.2)
    return lang[`${type}Moderate`] || `Moderate ${type} energy. Things are going well.`;
  if (value > -0.2)
    return lang[`${type}Neutral`] || `Neutral ${type} energy. An average day.`;
  if (value > -0.5)
    return lang[`${type}Low`] || `Low ${type} energy. Take it easy.`;
  if (value > -0.8)
    return lang[`${type}VeryLow`] || `Very low ${type} energy. Be cautious.`;
  return lang[`${type}Critical`] || `${typeName} critical day! Extra care needed.`;
}

function createNatalChart(planets) {
  const ctx = document.getElementById("natalChart");
  if (!ctx) {
    console.error("Canvas element not found");
    return;
  }

  const chartCtx = ctx.getContext("2d");
  if (!chartCtx) {
    console.error("Could not get 2d context");
    return;
  }

  const labels = Object.keys(planets);
  const degrees = labels.map((planet) => planets[planet].longitude % 30);
  const colors = getThemeChartColors();

  // Fixed: Add type check before destroying chart
  if (window.natalChart && typeof window.natalChart.destroy === "function") {
    window.natalChart.destroy();
  }

  window.natalChart = new Chart(chartCtx, {
    type: "radar",
    data: {
      labels: labels.map((label) => label.toUpperCase()),
      datasets: [
        {
          label: "Planetary Positions",
          data: degrees,
          backgroundColor: colors.goldPrimary + "25",
          borderColor: colors.goldPrimary,
          borderWidth: 2.5,
          pointBackgroundColor: colors.goldPrimary,
          pointBorderColor: colors.textMain,
          pointBorderWidth: 1.5,
          pointRadius: 5,
          pointHoverRadius: 7
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { 
            color: colors.gridColor 
          },
          grid: { 
            color: colors.gridColor 
          },
          pointLabels: {
            color: colors.textMain,
            font: {
              family: "'Cinzel', serif",
              size: 11
            }
          },
          suggestedMin: 0,
          suggestedMax: 30,
          ticks: { 
            stepSize: 5,
            backdropColor: "transparent",
            color: colors.textMuted,
            font: {
              family: "'Lora', serif"
            }
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const planet = context.label.toLowerCase();
              return `${planets[planet].sign} ${context.raw.toFixed(1)}°`;
            },
          },
        },
      },
    },
  });
}

// Custom Date Picker Functionality
class CustomDatePicker {
  static activePicker = null; // Static property to track active picker
  static overlay = null; // Static overlay reference
  
  constructor(inputId, pickerId) {
    this.input = document.getElementById(inputId);
    this.picker = document.getElementById(pickerId);
    this.currentDate = new Date();
    this.selectedDate = null;
    this.isOpen = false;
    
    // Get overlay reference
    if (!CustomDatePicker.overlay) {
      CustomDatePicker.overlay = document.getElementById('datePickerOverlay');
    }
    
    // Get DOM elements
    this.monthYearDisplay = this.picker.querySelector('.month-year-display');
    this.calendarDays = this.picker.querySelector('.calendar-days');
    this.prevBtn = this.picker.querySelector('.date-nav-btn:first-child');
    this.nextBtn = this.picker.querySelector('.date-nav-btn:last-child');
    this.clearBtn = this.picker.querySelector('.date-picker-btn:nth-child(1)');
    this.todayBtn = this.picker.querySelector('.date-picker-btn:nth-child(2)');
    this.selectBtn = this.picker.querySelector('.date-picker-btn:nth-child(3)');
    this.yearSlider = this.picker.querySelector('.year-slider');
    
    this.init();
  }
  
  init() {
    // Set initial date if input has value
    if (this.input.value) {
      this.selectedDate = new Date(this.input.value);
      this.currentDate = new Date(this.selectedDate);
    }
    
    // Set initial year slider value
    this.yearSlider.value = this.currentDate.getFullYear();
    
    // Event listeners
    this.input.addEventListener('click', (e) => {
      e.preventDefault();
      this.show();
    });
    this.input.addEventListener('focus', (e) => {
      e.preventDefault();
      this.show();
    });
    
    this.prevBtn.addEventListener('click', () => this.previousMonth());
    this.nextBtn.addEventListener('click', () => this.nextMonth());
    
    this.clearBtn.addEventListener('click', () => this.clearDate());
    this.todayBtn.addEventListener('click', () => this.selectToday());
    this.selectBtn.addEventListener('click', () => this.selectCurrentDate());
    
    // Year slider event listener
    this.yearSlider.addEventListener('input', (e) => {
      const newYear = parseInt(e.target.value);
      this.currentDate.setFullYear(newYear);
      this.render();
    });
    
    // Close picker when clicking overlay
    CustomDatePicker.overlay.addEventListener('click', () => {
      this.hide();
    });
    
    // Close picker on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
    
    // Initial render
    this.render();
  }
  
  show() {
    // Close any other open picker
    if (CustomDatePicker.activePicker && CustomDatePicker.activePicker !== this) {
      CustomDatePicker.activePicker.hide();
    }
    
    this.isOpen = true;
    CustomDatePicker.activePicker = this;
    
    // Show overlay and picker
    CustomDatePicker.overlay.classList.add('show');
    this.picker.classList.add('show');
    
    // Move picker to body to ensure proper centering
    document.body.appendChild(this.picker);
    
    // Set year slider to current displayed year
    this.yearSlider.value = this.currentDate.getFullYear();
    
    this.render();
  }
  
  hide() {
    this.isOpen = false;
    if (CustomDatePicker.activePicker === this) {
      CustomDatePicker.activePicker = null;
    }
    
    // Hide overlay and picker
    CustomDatePicker.overlay.classList.remove('show');
    this.picker.classList.remove('show');
  }
  
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }
  
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }
  
  selectToday() {
    this.selectedDate = new Date();
    this.currentDate = new Date();
    this.render();
  }
  
  selectCurrentDate() {
    if (this.selectedDate) {
      this.input.value = this.formatDateForInput(this.selectedDate);
      this.hide();
    }
  }
  
  clearDate() {
    this.selectedDate = null;
    this.input.value = '';
    this.render();
  }
  
  formatDateForInput(date) {
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  render() {
    // Update month/year display
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    this.monthYearDisplay.textContent = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    
    // Update year slider to match current displayed year
    this.yearSlider.value = this.currentDate.getFullYear();
    
    // Clear calendar days
    this.calendarDays.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Create calendar grid (6 weeks)
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + (week * 7) + day);
        
        const dayElement = document.createElement('button');
        dayElement.type = 'button';
        dayElement.className = 'calendar-day';
        dayElement.textContent = cellDate.getDate();
        
        // Add classes for styling
        if (cellDate.getMonth() !== this.currentDate.getMonth()) {
          dayElement.classList.add('other-month');
        }
        
        if (this.isToday(cellDate)) {
          dayElement.classList.add('today');
        }
        
        if (this.selectedDate && this.isSameDate(cellDate, this.selectedDate)) {
          dayElement.classList.add('selected');
        }
        
        // Add click handler for current month days
        if (cellDate.getMonth() === this.currentDate.getMonth()) {
          dayElement.addEventListener('click', () => {
            this.selectedDate = new Date(cellDate);
            this.render();
          });
        }
        
        this.calendarDays.appendChild(dayElement);
      }
    }
  }
  
  isToday(date) {
    const today = new Date();
    return this.isSameDate(date, today);
  }
  
  isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}

// Custom Time Picker Class
class CustomTimePicker {
  constructor(inputId, pickerId) {
    this.input = document.getElementById(inputId);
    this.picker = document.getElementById(pickerId);
    this.isOpen = false;
    
    // Get picker elements
    this.hourHand = this.picker.querySelector('#hourHand');
    this.minuteHand = this.picker.querySelector('#minuteHand');
    this.hourInput = this.picker.querySelector('#hourInput');
    this.minuteInput = this.picker.querySelector('#minuteInput');
    this.ampmSelect = this.picker.querySelector('#ampmSelect');
    this.clearBtn = this.picker.querySelector('#clearTime');
    this.currentBtn = this.picker.querySelector('#currentTime');
    this.selectBtn = this.picker.querySelector('#selectTime');
    this.hourMarkers = this.picker.querySelectorAll('.hour-marker');
    
    // Current time values (12-hour format)
    this.currentHour = 12;
    this.currentMinute = 0;
    this.currentAmPm = 'PM';
    
    this.init();
  }
  
  static activePicker = null;
  
  init() {
    // Set initial time if input has value
    if (this.input.value) {
      const [hour, minute] = this.input.value.split(':');
      const hour24 = parseInt(hour);
      this.currentMinute = parseInt(minute);
      
      // Convert 24-hour to 12-hour format
      if (hour24 === 0) {
        this.currentHour = 12;
        this.currentAmPm = 'AM';
      } else if (hour24 === 12) {
        this.currentHour = 12;
        this.currentAmPm = 'PM';
      } else if (hour24 > 12) {
        this.currentHour = hour24 - 12;
        this.currentAmPm = 'PM';
      } else {
        this.currentHour = hour24;
        this.currentAmPm = 'AM';
      }
    }
    
    // Event listeners
    this.input.addEventListener('click', (e) => {
      e.preventDefault();
      this.show();
    });
    this.input.addEventListener('focus', (e) => {
      e.preventDefault();
      this.show();
    });
    
    // Hour markers click
    this.hourMarkers.forEach(marker => {
      marker.addEventListener('click', () => {
        this.currentHour = parseInt(marker.dataset.hour);
        this.updateDisplay();
      });
    });
    
    // Number input changes
    this.hourInput.addEventListener('input', (e) => {
      this.currentHour = Math.max(1, Math.min(12, parseInt(e.target.value) || 1));
      this.updateDisplay();
    });
    
    this.minuteInput.addEventListener('input', (e) => {
      this.currentMinute = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
      this.updateDisplay();
    });
    
    this.ampmSelect.addEventListener('change', (e) => {
      this.currentAmPm = e.target.value;
      this.updateDisplay();
    });
    
    // Button actions
    this.clearBtn.addEventListener('click', () => this.clearTime());
    this.currentBtn.addEventListener('click', () => this.setCurrentTime());
    this.selectBtn.addEventListener('click', () => this.selectTime());
    
    // Clock face interactions
    this.setupClockInteractions();
    
    // Close picker when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.picker.contains(e.target) && !this.input.contains(e.target)) {
        this.hide();
      }
    });
    
    // Close picker on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
    
    // Initial display update
    this.updateDisplay();
  }
  
  setupClockInteractions() {
    const clockFace = this.picker.querySelector('.clock-face');
    let isDragging = false;
    let dragTarget = null;
    
    const getAngleFromCenter = (e, rect) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      return (angle * 180 / Math.PI + 90 + 360) % 360;
    };
    
    clockFace.addEventListener('mousedown', (e) => {
      const rect = clockFace.getBoundingClientRect();
      const angle = getAngleFromCenter(e, rect);
      
      // Determine if clicking closer to hour or minute hand
      const hourAngle = (this.currentHour % 12) * 30;
      const minuteAngle = this.currentMinute * 6;
      
      const hourDiff = Math.abs(angle - hourAngle);
      const minuteDiff = Math.abs(angle - minuteAngle);
      
      if (hourDiff < minuteDiff) {
        dragTarget = 'hour';
        let newHour = Math.round(angle / 30) % 12;
        this.currentHour = newHour === 0 ? 12 : newHour;
      } else {
        dragTarget = 'minute';
        this.currentMinute = Math.round(angle / 6) % 60;
      }
      
      isDragging = true;
      this.updateDisplay();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const rect = clockFace.getBoundingClientRect();
      const angle = getAngleFromCenter(e, rect);
      
      if (dragTarget === 'hour') {
        let newHour = Math.round(angle / 30) % 12;
        this.currentHour = newHour === 0 ? 12 : newHour;
      } else if (dragTarget === 'minute') {
        this.currentMinute = Math.round(angle / 6) % 60;
      }
      
      this.updateDisplay();
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      dragTarget = null;
    });
  }
  
  show() {
    // Close any other open picker
    if (CustomTimePicker.activePicker && CustomTimePicker.activePicker !== this) {
      CustomTimePicker.activePicker.hide();
    }
    
    this.isOpen = true;
    CustomTimePicker.activePicker = this;
    this.picker.classList.add('show');
    this.updateDisplay();
  }
  
  hide() {
    this.isOpen = false;
    CustomTimePicker.activePicker = null;
    this.picker.classList.remove('show');
  }
  
  updateDisplay() {
    // Update clock hands
    const hourAngle = (this.currentHour % 12) * 30 + (this.currentMinute * 0.5);
    const minuteAngle = this.currentMinute * 6;
    
    this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
    this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    
    // Update inputs
    this.hourInput.value = this.currentHour.toString();
    this.minuteInput.value = this.currentMinute.toString().padStart(2, '0');
    this.ampmSelect.value = this.currentAmPm;
  }
  
  clearTime() {
    this.input.value = '';
    this.hide();
  }
  
  setCurrentTime() {
    const now = new Date();
    const hour24 = now.getHours();
    this.currentMinute = now.getMinutes();
    
    // Convert to 12-hour format
    if (hour24 === 0) {
      this.currentHour = 12;
      this.currentAmPm = 'AM';
    } else if (hour24 === 12) {
      this.currentHour = 12;
      this.currentAmPm = 'PM';
    } else if (hour24 > 12) {
      this.currentHour = hour24 - 12;
      this.currentAmPm = 'PM';
    } else {
      this.currentHour = hour24;
      this.currentAmPm = 'AM';
    }
    
    this.updateDisplay();
  }
  
  selectTime() {
    // Convert to 24-hour format for the input
    let hour24 = this.currentHour;
    
    if (this.currentAmPm === 'AM' && this.currentHour === 12) {
      hour24 = 0;
    } else if (this.currentAmPm === 'PM' && this.currentHour !== 12) {
      hour24 = this.currentHour + 12;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${this.currentMinute.toString().padStart(2, '0')}`;
    this.input.value = timeString;
    this.hide();
    
    // Trigger change event
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

// Initialize custom date pickers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize birth date picker
  const birthDatePicker = new CustomDatePicker('birthDate', 'birthDatePicker');
  
  // Initialize current date picker
  const currentDatePicker = new CustomDatePicker('currentDate', 'currentDatePicker');
  
  // Initialize birth time picker
  const birthTimePicker = new CustomTimePicker('birthTime', 'birthTimePicker');
});