const translations = {
  en: {
    app: { name: "Dhara Organic" },
    nav: { home: "Home", about: "About", features: "Features", contact: "Contact", signIn: "Sign In" },
    hero: { subtitle: "Kerala's Premium Organic Marketplace", title: "DHARA", tagline: "Farm • Table • Trust", desc: "From Kerala's oldest organic families to your table — harvest to home in under 24 hours.", shop: "Shop now", farmerSignIn: "Sign in farmer" },
    dashboard: { title: "Farmer Dashboard", earnings: "Total Earnings", orders: "Orders Received", harvest: "Harvest Entries", subscriptions: "Subscribed Routines", warnings: "Warnings", addProduct: "Add Product", ordersLink: "Orders", profile: "Profile", logout: "Logout", home: "Home", contact: "Contact" },
    product: { name: "Product Name", price: "Price", quantity: "Quantity", harvestTime: "Harvest Time", availability: "Availability", delivery: "Delivery Option", add: "Add Product", save: "Save", edit: "Edit Profile", available: "Available", notAvailable: "Not Available" },
    profile: { title: "Farmer Profile", name: "Farmer Name", address: "Farm Address", phone: "Phone Number", village: "Village", district: "District", description: "Farm Description", edit: "Edit Profile", save: "Save Profile" },
    warning: { title: "Warnings", count: "Warning Count", blocked: "Account Blocked", active: "Active" },
    subscription: { title: "Active Subscriptions", daily: "Daily Delivery", weekly: "Weekly Delivery", customers: "Customers", schedule: "Schedule" },
    language: "Language",
    voice: "Listen",
    stop: "Stop"
  },
  ml: {
    app: { name: "ധാര ഓർഗാനിക്" },
    nav: { home: "ഹോം", about: "കുറിച്ച്", features: "സവിശേഷതകൾ", contact: "ബന്ധപ്പെടുക", signIn: "സൈൻ ഇൻ" },
    hero: { subtitle: "കേരളത്തിന്റെ പ്രീമിയം ഓർഗാനിക് മാർക്കറ്റ്‌പ്ലേസ്", title: "ധാര", tagline: "ഫാം • ടേബിൾ • ട്രസ്റ്റ്", desc: "കേരളത്തിലെ ഏറ്റവും പഴക്കമുള്ള ഓർഗാനിക് കുടുംബങ്ങളിൽ നിന്ന് നിങ്ങളുടെ മേശയിലേക്ക് - 24 മണിക്കൂറിനുള്ളിൽ വിളവെടുപ്പ് മുതൽ വീട്ടിലേക്ക്.", shop: "ഷോപ്പ് ചെയ്യുക", farmerSignIn: "കർഷക സൈൻ ഇൻ" },
    dashboard: { title: "കർഷക ഡാഷ്‌ബോർഡ്", earnings: "ആകെ വരുമാനം", orders: "ലഭിച്ച ഓർഡറുകൾ", harvest: "വിളവെടുപ്പ് എൻട്രികൾ", subscriptions: "സബ്‌സ്ക്രൈബ് ചെയ്ത റൂട്ടിനുകൾ", warnings: "മുന്നറിയിപ്പുകൾ", addProduct: "ഉൽപ്പന്നം ചേർക്കുക", ordersLink: "ഓർഡറുകൾ", profile: "പ്രൊഫൈൽ", logout: "ലോഗൗട്ട്", home: "ഹോം", contact: "ബന്ധപ്പെടുക" },
    product: { name: "ഉൽപ്പന്നത്തിന്റെ പേര്", price: "വില", quantity: "അളവ്", harvestTime: "വിളവെടുപ്പ് സമയം", availability: "ലഭ്യത", delivery: "ഡെലിവറി ഓപ്ഷൻ", add: "ഉൽപ്പന്നം ചേർക്കുക", save: "സംരക്ഷിക്കുക", edit: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", available: "ലഭ്യമാണ്", notAvailable: "ലഭ്യമല്ല" },
    profile: { title: "കർഷക പ്രൊഫൈൽ", name: "കർഷകന്റെ പേര്", address: "ഫാം വിലാസം", phone: "ഫോൺ നമ്പർ", village: "ഗ്രാമം", district: "ജില്ല", description: "ഫാം വിവരണം", edit: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", save: "പ്രൊഫൈൽ സംരക്ഷിക്കുക" },
    warning: { title: "മുന്നറിയിപ്പുകൾ", count: "മുന്നറിയിപ്പ് എണ്ണം", blocked: "അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്‌തു", active: "സജീവമാണ്" },
    subscription: { title: "സജീവ സബ്‌സ്ക്രിപ്ഷനുകൾ", daily: "ദൈനംദിന ഡെലിവറി", weekly: "വാരിക ഡെലിവറി", customers: "ഉപഭോക്താക്കൾ", schedule: "ഷെഡ്യൂൾ" },
    language: "ഭാഷ",
    voice: "കേൾക്കുക",
    stop: "നിർത്തുക"
  },
  hi: {
    app: { name: "धारा ऑर्गेनिक" },
    nav: { home: "होम", about: "बारे में", features: "विशेषताएं", contact: "संपर्क", signIn: "साइन इन" },
    hero: { subtitle: "केरल का प्रीमियम ऑर्गेनिक मार्केटप्लेस", title: "धारा", tagline: "फार्म • टेबल • ट्रस्ट", desc: "केरल के सबसे पुराने ऑर्गेनिक परिवारों से आपकी टेबल तक - 24 घंटे के भीतर फार्म से घर तक।", shop: "अभी खरीदें", farmerSignIn: "किसान साइन इन" },
    dashboard: { title: "किसान डैशबोर्ड", earnings: "कुल कमाई", orders: "प्राप्त ऑर्डर", harvest: "फसल प्रविष्टियां", subscriptions: "सब्सक्राइब्ड रूटीन", warnings: "चेतावनियां", addProduct: "उत्पाद जोड़ें", ordersLink: "ऑर्डर", profile: "प्रोफाइल", logout: "लॉगआउट", home: "होम", contact: "संपर्क" },
    product: { name: "उत्पाद का नाम", price: "मूल्य", quantity: "मात्रा", harvestTime: "कटाई का समय", availability: "उपलब्धता", delivery: "डिलीवरी विकल्प", add: "उत्पाद जोड़ें", save: "सहेजें", edit: "प्रोफाइल संपादित करें", available: "उपलब्ध", notAvailable: "उपलब्ध नहीं" },
    profile: { title: "किसान प्रोफाइल", name: "किसान का नाम", address: "फार्म का पता", phone: "फोन नंबर", village: "गांव", district: "जिला", description: "फार्म विवरण", edit: "प्रोफाइल संपादित करें", save: "प्रोफाइल सहेजें" },
    warning: { title: "चेतावनियां", count: "चेतावनी गणना", blocked: "खाता ब्लॉक कर दिया गया", active: "सक्रिय" },
    subscription: { title: "सक्रिय सब्सक्रिप्शन", daily: "दैनिक डिलीवरी", weekly: "साप्ताहिक डिलीवरी", customers: "ग्राहक", schedule: "अनुसूची" },
    language: "भाषा",
    voice: "सुनें",
    stop: "रोकें"
  }
};

let currentLang = "ml";
let listeners = [];

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    listeners.forEach(fn => fn(lang));
    return true;
  }
  return false;
}

export function getLanguage() {
  return currentLang;
}

export function onLanguageChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function t(path, lang) {
  const l = lang || currentLang;
  const keys = path.split(".");
  let result = translations[l];
  for (const key of keys) {
    if (result && result[key] !== undefined) {
      result = result[key];
    } else {
      const fallbackKeys = path.split(".");
      let fallback = translations.en;
      for (const k of fallbackKeys) {
        if (fallback && fallback[k] !== undefined) {
          fallback = fallback[k];
        } else {
          return path;
        }
      }
      return fallback;
    }
  }
  return result;
}

export default translations;
