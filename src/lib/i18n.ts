export type SupportedLanguage = "en" | "hi" | "or" | "ta";

export interface I18nDictionary {
  appName: string;
  reportNeed: string;
  subtitle: string;
  step1Title: string;
  selectState: string;
  selectDistrict: string;
  villageName: string;
  villagePlaceholder: string;
  step2Title: string;
  tabVoice: string;
  tabText: string;
  tabChat: string;
  micPrompt: string;
  recording: string;
  tapToStop: string;
  textPlaceholder: string;
  chatSimNotice: string;
  addPhotoOptional: string;
  submitButton: string;
  submitting: string;
  step3Title: string;
  weUnderstood: string;
  ticketIdLabel: string;
  detectedLanguage: string;
  categoryLabel: string;
  urgencyLabel: string;
  englishTranslation: string;
  notRightFix: string;
  trackRequestButton: string;
  needClarification: string;
  replyPlaceholder: string;
  sendReply: string;
  methodology: string;
}

export const I18N_STRINGS: Record<SupportedLanguage, I18nDictionary> = {
  en: {
    appName: "JanSetu",
    reportNeed: "Report a Community Need",
    subtitle: "Speak or write in your local language. Gemini translates, categorizes, and routes directly to government scheme budgets.",
    step1Title: "1. Select Location",
    selectState: "State",
    selectDistrict: "District",
    villageName: "Village / Habitation",
    villagePlaceholder: "Enter your village or panchayat name",
    step2Title: "2. Tell Us Your Community Need",
    tabVoice: "Voice (Microphone)",
    tabText: "Text Input",
    tabChat: "WhatsApp Channel (Simulated)",
    micPrompt: "Tap and speak in your language",
    recording: "Recording in progress... speak clearly",
    tapToStop: "Tap to finish recording",
    textPlaceholder: "Describe the road, water, school, health centre, or electricity issue...",
    chatSimNotice: "Simulated WhatsApp Assistant &bull; Citizen can send voice notes or text",
    addPhotoOptional: "Add Photo (Optional)",
    submitButton: "Submit to JanSetu Ledger",
    submitting: "AI is analyzing your voice and text...",
    step3Title: "3. Submission Confirmed",
    weUnderstood: "Here is what we understood",
    ticketIdLabel: "Your Tracking Ticket ID",
    detectedLanguage: "Language Detected",
    categoryLabel: "Category",
    urgencyLabel: "Urgency Level",
    englishTranslation: "English Translation for Officers",
    notRightFix: "Not right? Edit and fix",
    trackRequestButton: "Track Request Progress",
    needClarification: "AI needs one clarification to accurately route your request:",
    replyPlaceholder: "Provide a bit more detail...",
    sendReply: "Submit Clarification",
    methodology: "Methodology",
  },
  hi: {
    appName: "जनसेतु",
    reportNeed: "सामुदायिक समस्या दर्ज करें",
    subtitle: "अपनी भाषा में बोलें या लिखें। जेमिनी इसे समझकर सीधे सरकारी योजना के बजट से जोड़ेगा।",
    step1Title: "1. स्थान का चयन करें",
    selectState: "राज्य",
    selectDistrict: "ज़िला",
    villageName: "गांव / ढाणी का नाम",
    villagePlaceholder: "अपने गांव या ग्राम पंचायत का नाम लिखें",
    step2Title: "2. अपनी सामुदायिक समस्या बताएं",
    tabVoice: "आवाज़ (माइक)",
    tabText: "लिखकर बताएं",
    tabChat: "व्हाट्सएप चैनल (डेमो)",
    micPrompt: "माइक दबाएं और अपनी भाषा में बोलें",
    recording: "रिकॉर्डिंग चालू है... कृपया बोलें",
    tapToStop: "रिकॉर्डिंग समाप्त करने के लिए टैप करें",
    textPlaceholder: "सड़क, पानी, स्कूल, अस्पताल या बिजली की समस्या का विवरण दें...",
    chatSimNotice: "व्हाट्सएप असिस्टेंट (सिमुलेटेड) &bull; वॉइस नोट या मैसेज भेजें",
    addPhotoOptional: "फोटो जोड़ें (वैकल्पिक)",
    submitButton: "जनसेतु में दर्ज करें",
    submitting: "एआई आपकी आवाज़ और विवरण का विश्लेषण कर रहा है...",
    step3Title: "3. समस्या दर्ज हो गई",
    weUnderstood: "हमने यह समझा",
    ticketIdLabel: "आपकी ट्रैकिंग टिकट संख्या",
    detectedLanguage: "पहचानी गई भाषा",
    categoryLabel: "श्रेणी",
    urgencyLabel: "प्राथमिकता स्तर",
    englishTranslation: "अधिकारियों के लिए अंग्रेज़ी अनुवाद",
    notRightFix: "सही नहीं है? सुधारें",
    trackRequestButton: "अपनी समस्या की स्थिति ट्रैक करें",
    needClarification: "एआई को सही योजना चुनने के लिए एक स्पष्टीकरण चाहिए:",
    replyPlaceholder: "थोड़ा और विवरण दें...",
    sendReply: "जवाब भेजें",
    methodology: "प्रक्रिया एवं विधि",
  },
  or: {
    appName: "ଜନସେତୁ",
    reportNeed: "ଗ୍ରାମ୍ୟ ସମସ୍ୟା ଦାଖଲ କରନ୍ତୁ",
    subtitle: "ଆପଣଙ୍କ ନିଜ ଭାଷାରେ କୁହନ୍ତୁ ବା ଲେଖନ୍ତୁ। ଜେମିନି ଏହାକୁ ସରକାରୀ ଯୋଜନା ବଜେଟ ସହ ଯୋଡ଼ିବ।",
    step1Title: "୧. ସ୍ଥାନ ଚୟନ କରନ୍ତୁ",
    selectState: "ରାଜ୍ୟ",
    selectDistrict: "ଜିଲ୍ଲା",
    villageName: "ଗ୍ରାମ / ପଞ୍ଚାୟତ",
    villagePlaceholder: "ଆପଣଙ୍କ ଗ୍ରାମ ବା ପଞ୍ଚାୟତ ନାମ ଲେଖନ୍ତୁ",
    step2Title: "୨. ଆପଣଙ୍କ ସମସ୍ୟା ଜଣାନ୍ତୁ",
    tabVoice: "ଭଏସ (ମାଇକ୍)",
    tabText: "ଲେଖନ୍ତୁ",
    tabChat: "ହ୍ୱାଟ୍ସଆପ୍ ଚ୍ୟାନେଲ (ଡେମୋ)",
    micPrompt: "ମାଇକ୍ ଦବାଇ ନିଜ ଭାଷାରେ କୁହନ୍ତୁ",
    recording: "ରେକର୍ଡିଂ ଚାଲିଛି... କୁହନ୍ତୁ",
    tapToStop: "ସମାପ୍ତ କରିବାକୁ ଟ୍ୟାପ କରନ୍ତୁ",
    textPlaceholder: "ରାସ୍ତା, ପାନୀୟ ଜଳ, ସ୍କୁଲ, ଡାକ୍ତରଖାନା କିମ୍ବା ବିଜୁଳି ସମସ୍ୟା ଲେଖନ୍ତୁ...",
    chatSimNotice: "ହ୍ୱାଟ୍ସଆପ୍ ସହାୟକ (ସିମୁଲେଟେଡ୍)",
    addPhotoOptional: "ଫଟୋ ଯୋଡ଼ନ୍ତୁ (ଇଚ୍ଛାଧୀନ)",
    submitButton: "ଜନସେତୁରେ ଦାଖଲ କରନ୍ତୁ",
    submitting: "ଏଆଇ ଆପଣଙ୍କ ବାର୍ତ୍ତା ଯାଞ୍ଚ କରୁଛି...",
    step3Title: "୩. ଦାଖଲ ସଫଳ ହେଲା",
    weUnderstood: "ଆମେ ଏହା ବୁଝିଲୁ",
    ticketIdLabel: "ଆପଣଙ୍କ ଟିକେଟ ନମ୍ବର",
    detectedLanguage: "ଭାଷା",
    categoryLabel: "ବର୍ଗ",
    urgencyLabel: "ଜରୁରୀ ସ୍ତର",
    englishTranslation: "ଅଧିକାରୀଙ୍କ ପାଇଁ ଇଂରାଜୀ ଅନୁବାଦ",
    notRightFix: "ଭୁଲ ଅଛି କି? ସଂଶୋଧନ କରନ୍ତୁ",
    trackRequestButton: "ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ",
    needClarification: "ସଠିକ ଯୋଜନା ଚୟନ ପାଇଁ ଆହୁରି ସୂଚନା ଦରକାର:",
    replyPlaceholder: "ଅଧିକ ବିବରଣୀ ଲେଖନ୍ତୁ...",
    sendReply: "ଉତ୍ତର ପଠାନ୍ତୁ",
    methodology: "କାର୍ଯ୍ୟପଦ୍ଧତି",
  },
  ta: {
    appName: "ஜனசேது",
    reportNeed: "சமூக தேவையைப் பதிவு செய்க",
    subtitle: "உங்கள் தாய்மொழியில் பேசுங்கள் அல்லது எழுதுங்கள். ஜெமினி AI அரசு திட்ட நிதியோடு நேரடியாக இணைக்கிறது.",
    step1Title: "1. இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்",
    selectState: "மாநிலம்",
    selectDistrict: "மாவட்டம்",
    villageName: "கிராமம் / குடியிருப்பு",
    villagePlaceholder: "உங்கள் கிராமம் அல்லது ஊராட்சியின் பெயரை உள்ளிடவும்",
    step2Title: "2. உங்கள் சமூக தேவையைத் தெரிவிக்கவும்",
    tabVoice: "குரல் (மைக்)",
    tabText: "எழுதுங்கள்",
    tabChat: "வாட்ஸ்அப் (மாதிரி)",
    micPrompt: "மைக்கை அழுத்தி உங்கள் மொழியில் பேசுங்கள்",
    recording: "பதிவாகிறது... தெளிவாகப் பேசுங்கள்",
    tapToStop: "முடிக்க தட்டவும்",
    textPlaceholder: "சாலை, குடிநீர், பள்ளி, மருத்துவமனை அல்லது மின்சார பிரச்சனை பற்றி எழுதவும்...",
    chatSimNotice: "வாட்ஸ்அப் மாதிரி உதவி &bull; குரல் அல்லது உரை அனுப்பலாம்",
    addPhotoOptional: "புகைப்படம் சேர்க்க (விருப்பத்தேர்வு)",
    submitButton: "ஜனசேதுவில் பதிவு செய்க",
    submitting: "AI உங்கள் பதிவை பகுப்பாய்வு செய்கிறது...",
    step3Title: "3. பதிவு உறுதியானது",
    weUnderstood: "நாங்கள் புரிந்து கொண்டது",
    ticketIdLabel: "உங்கள் கண்காணிப்பு டிக்கெட் எண்",
    detectedLanguage: "கண்டறியப்பட்ட மொழி",
    categoryLabel: "வகைப்பாடு",
    urgencyLabel: "அவசர நிலை",
    englishTranslation: "அதிகாரிகளுக்கான ஆங்கில மொழிபெயர்ப்பு",
    notRightFix: "சரியாக இல்லையா? திருத்துக",
    trackRequestButton: "நிலையைக் கண்காணிக்கவும்",
    needClarification: "சரியான திட்டத்திற்கு AI கூடுதல் விளக்கம் கேட்கிறது:",
    replyPlaceholder: "கூடுதல் விவரங்களை உள்ளிடவும்...",
    sendReply: "பதிலை அனுப்புக",
    methodology: "முறையியல்",
  },
};
