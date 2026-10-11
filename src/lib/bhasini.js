export const BHASINI_LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English', speech: 'en-US' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', speech: 'hi-IN' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', speech: 'bn-BD' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', speech: 'ta-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', speech: 'te-IN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', speech: 'mr-IN' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', speech: 'gu-IN' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', speech: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', speech: 'ml-IN' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', speech: 'or-IN' },
  { code: 'es', label: 'Spanish', native: 'Español', speech: 'es-ES' },
  { code: 'fr', label: 'French', native: 'Français', speech: 'fr-FR' },
];

export const LANGUAGE_OPTIONS = BHASINI_LANGUAGE_OPTIONS;

const DEMO_TRANSLATIONS = {
  en: {
    patientTitle: 'Patient dashboard',
    staffTitle: 'Care team dashboard',
    login: 'Log in',
    register: 'Register',
    demoNote: 'Demo authentication is enabled for prototype testing.',
    readAloud: 'Read aloud',
    noEmergency: 'No emergency service is connected yet.',
    iAmSafe: 'I AM SAFE',
    updateSuccessful: 'Update successful',
    requestAccess: 'Request access',
    chatbot: 'Medical research chat',
    medicalCard: 'Medical card',
    loginMode: 'Select access mode',
    sos: 'SOS',
  },
  hi: {
    patientTitle: 'रोगी डैशबोर्ड',
    staffTitle: 'केयर टीम डैशबोर्ड',
    login: 'लॉग इन',
    register: 'रजिस्टर',
    demoNote: 'प्रोटोटाइप परीक्षण के लिए डेमो प्रमाणीकरण सक्षम है।',
    readAloud: 'पढ़कर सुनाएँ',
    noEmergency: 'अभी कोई आपातकालीन सेवा जुड़ी नहीं है।',
    iAmSafe: 'मैं सुरक्षित हूँ',
    updateSuccessful: 'अपडेट सफल रहा',
    requestAccess: 'पहुँच का अनुरोध करें',
    chatbot: 'चिकित्सा अनुसंधान चैट',
    medicalCard: 'मेडिकल कार्ड',
    loginMode: 'एक्सेस मोड चुनें',
    sos: 'एसओएस',
  },
  bn: {
    patientTitle: 'রোগীর ড্যাশবোর্ড',
    staffTitle: 'কেয়ার টিম ড্যাশবোর্ড',
    login: 'লগইন',
    register: 'নিবন্ধন',
    demoNote: 'প্রোটোটাইপ পরীক্ষা için ডেমো অথেনটিকেশন সক্ষম।',
    readAloud: 'শোনান',
    noEmergency: 'এখনও কোনও জরুরি সেবা সংযুক্ত নেই।',
    iAmSafe: 'আমি নিরাপদ',
    updateSuccessful: 'আপডেট সফল',
    requestAccess: 'অ্যাক্সেসের জন্য অনুরোধ',
    chatbot: 'চিকিৎসা গবেষণা চ্যাট',
    medicalCard: 'মেডিকেল কার্ড',
    loginMode: 'অ্যাক্সেস মোড নির্বাচন করুন',
    sos: 'এসওএস',
  },
  ta: {
    patientTitle: 'நோயாளி டாஷ்போர்டு',
    staffTitle: 'கேர் குழு டாஷ்போர்டு',
    login: 'உள்நுழை',
    register: 'பதிவு',
    demoNote: 'மாதிரி சோதனைக்காக டெமோ அங்கீகாரம் இயக்கப்பட்டுள்ளது.',
    readAloud: 'சத்தமாக வாசி',
    noEmergency: 'இதுவரை எந்த அவசர சேவையும் இணைக்கப்படவில்லை.',
    iAmSafe: 'நான் பாதுகாப்பாக உள்ளேன்',
    updateSuccessful: 'புதுப்பிப்பு வெற்றி',
    requestAccess: 'அணுகல் கோரிக்கை',
    chatbot: 'மருத்துவ ஆராய்ச்சி அரட்டை',
    medicalCard: 'மருத்துவ அட்டை',
    loginMode: 'அணுகல் பயன்முறையைத் தேர்வு',
    sos: 'எஸ்.ஒ.ஸ்',
  },
  te: {
    patientTitle: 'రోగి డ్యాష్‌బోర్డ్',
    staffTitle: 'కేర్ టీమ్ డ్యాష్‌బోర్డ్',
    login: 'లాగిన్',
    register: 'నమోదు',
    demoNote: 'ప్రోటోటైప్ పరీక్ష కోసం డెమో ధృవీకరణ ప్రారంభించబడింది.',
    readAloud: 'చదివి వినిపించు',
    noEmergency: 'ఇంకా ఎటువంటి అత్యవసర సేవ కనెక్ట్ కాలేదు.',
    iAmSafe: 'నేను సురక్షితంగా ఉన్నాను',
    updateSuccessful: 'అప్‌డేట్ విజయవంతమైంది',
    requestAccess: 'యాక్సెస్ అభ్యర్థన',
    chatbot: 'మెడికల్ రీసెర్చ్ చాట్',
    medicalCard: 'మెడికల్ కార్డ్',
    loginMode: 'యాక్సెస్ మోడ్ ఎంచుకోండి',
    sos: 'ఎస్.ఒ.ఎస్',
  },
  mr: {
    patientTitle: 'रुग्ण डॅशबोर्ड',
    staffTitle: 'केअर टीम डॅशबोर्ड',
    login: 'लॉगिन',
    register: 'नोंदणी',
    demoNote: 'प्रोटोटाइप चाचणीसाठी डेमो ऑथेंटिकेशन فعال आहे.',
    readAloud: 'वाचून ऐका',
    noEmergency: 'अद्याप कोणतीही आपत्कालीन सेवा जोडलेली नाही.',
    iAmSafe: 'मी सुरक्षित आहे',
    updateSuccessful: 'अपडेट यशस्वी',
    requestAccess: 'प्रवेश विनंती',
    chatbot: 'मेडिकल रिसर्च चॅट',
    medicalCard: 'मेडिकल कार्ड',
    loginMode: 'प्रवेश मोड निवडा',
    sos: 'एसओएस',
  },
  gu: {
    patientTitle: 'રોગી ડેશબોર્ડ',
    staffTitle: 'કેર ટીમ ડેશબોર્ડ',
    login: 'લોગિન',
    register: 'નોંધણી',
    demoNote: 'પ્રોટોટાઇપ પરીક્ષણ માટે ડેમો ઓથેન્ટિકેશન ચાલુ છે.',
    readAloud: 'વાંચીને સાંભળો',
    noEmergency: 'હજુ સુધી કોઈ ઈમરજન્સી સેવા જોડાયેલ નથી.',
    iAmSafe: 'હું સલામત છું',
    updateSuccessful: 'અપડેટ સફળ',
    requestAccess: 'પ્રવેશ માંગણી',
    chatbot: 'મેડિકલ રિસર્ચ ચેટ',
    medicalCard: 'મેડિકલ કાર્ડ',
    loginMode: 'પ્રવેશ મોડ પસંદ કરો',
    sos: 'એસઓએસ',
  },
  kn: {
    patientTitle: 'ರೋಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    staffTitle: 'ಕೇರ್ ತಂಡ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    demoNote: 'ಪ್ರೋಟೋಟ್‌ಟೈಪ್ ಪರೀಕ್ಷೆಗಾಗಿ ಡೆಮೋ ದೃಢೀಕರಣ ಸಕ್ರಿಯವಾಗಿದೆ.',
    readAloud: 'ಓದಿ ಕೇಳಿಸು',
    noEmergency: 'ಇನ್ನೂ ಯಾವುದೇ ತುರ್ತು ಸೇವೆ ಸಂಪರ್ಕಿತವಾಗಿಲ್ಲ.',
    iAmSafe: 'ನಾನು ಸುರಕ್ಷಿತನಾಗಿದ್ದೇನೆ',
    updateSuccessful: 'ಅಪ್ಡೇಟ್ ಯಶಸ್ವಿಯಾಯಿತು',
    requestAccess: 'ಪ್ರವೇಶ ವಿನಂತಿ',
    chatbot: 'ಮೆಡಿಕಲ್ ಸಂಶೋಧನೆ ಚಾಟ್',
    medicalCard: 'ಮೆಡಿಕಲ್ ಕಾರ್ಡ್',
    loginMode: 'ಪ್ರವೇಶ ಮೋಡ್ ಆಯ್ಕೆಮಾಡಿ',
    sos: 'ಎಸ್‌ಒ‌ಎಸ್',
  },
  ml: {
    patientTitle: 'രോഗി ഡാഷ്‌ബോർഡ്',
    staffTitle: 'കെയർ ടീം ഡാഷ്‌ബോർഡ്',
    login: 'ലോഗിൻ',
    register: 'രജിസ്റ്റർ',
    demoNote: 'പ്രോട്ടോടൈപ്പ് പരീക്ഷയ്ക്കായി ഡെമോ ആധികാരികത സജ്ജമാണ്.',
    readAloud: 'വായിച്ച് കേൾപ്പിക്കുക',
    noEmergency: 'ഇതുവരെ żad emergency service is connected yet.',
    iAmSafe: 'ഞാൻ സുരക്ഷിതമാണ്',
    updateSuccessful: 'അപ്ഡേറ്റ് വിജയിച്ചു',
    requestAccess: 'അക്സസ് അഭ്യർത്ഥനം',
    chatbot: 'മെഡിക്കൽ റിസേർച്ച് ചാറ്റ്',
    medicalCard: 'മെഡിക്കൽ കാർഡ്',
    loginMode: 'അക്സസ് മോഡ് തിരഞ്ഞെടുക്കുക',
    sos: 'എസ்ஒഎസ്',
  },
  or: {
    patientTitle: 'ରୋଗୀ ଡ୍ୟାଶବୋର୍ଡ',
    staffTitle: 'କେୟାର ଟିମ୍ ଡ୍ୟାଶବୋର୍ଡ',
    login: 'ଲଗଇନ',
    register: 'ନିବନ୍ଧନ',
    demoNote: 'ପ୍ରୋଟୋଟାଇପ ପରୀକ୍ଷା ପାଇଁ ଡେମୋ ଆଥେଣ୍ଟିକେସନ ସକ୍ରିୟ।',
    readAloud: 'ପଢି ଶୁଣାନ୍ତୁ',
    noEmergency: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଆପଦ୍ରତ ସେବା ସଂଯୁକ୍ତ ହୋଇନାହିଁ।',
    iAmSafe: 'ମୁଁ ସୁରକ୍ଷିତ',
    updateSuccessful: 'ଅପଡେଟ ସଫଳ',
    requestAccess: 'ଅଭିବ୍ୟକ୍ତି ଅନୁରୋଧ',
    chatbot: 'ମେଡିକାଲ ରିସର୍ଚ୍ ଚାଟ',
    medicalCard: 'ମେଡିକାଲ କାର୍ଡ',
    loginMode: 'ଅଭିବ୍ୟକ୍ତି ମୋଡ୍ ଚୟନ',
    sos: 'ଏସଓଏସ',
  },
};

export function getLanguageMeta(code = 'en') {
  const match = BHASINI_LANGUAGE_OPTIONS.find((item) => item.code === code) || BHASINI_LANGUAGE_OPTIONS[0];
  return {
    ...match,
    direction: 'ltr',
  };
}

export function getDemoTranslation(key, languageCode = 'en') {
  const language = DEMO_TRANSLATIONS[languageCode] || DEMO_TRANSLATIONS.en;
  return language[key] || key;
}

export async function translateTextWithBhasini(text, targetLanguage = 'en') {
  const hasApiKey = Boolean(import.meta.env?.VITE_BHASINI_API_KEY);
  if (!hasApiKey) {
    return {
      text: getDemoTranslation(text, targetLanguage),
      sourceLanguage: 'en',
      targetLanguage,
      simulated: true,
      note: 'BHASINI key not configured. Using demo translation fallback for prototype testing.',
    };
  }

  return {
    text,
    sourceLanguage: 'en',
    targetLanguage,
    simulated: false,
    note: 'Live BHASINI integration placeholder. Add VITE_BHASINI_API_KEY and model endpoints to connect the real model.',
  };
}

export function readAloud(text, languageCode = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const meta = getLanguageMeta(languageCode);
  utterance.lang = meta.speech || 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

