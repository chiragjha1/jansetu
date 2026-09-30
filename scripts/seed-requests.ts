import fs from "fs";
import path from "path";
import { CitizenRequest } from "../src/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PRECOMPUTED_DIR = path.join(DATA_DIR, "precomputed");
const OUTPUT_FILE = path.join(PRECOMPUTED_DIR, "requests.json");

if (!fs.existsSync(PRECOMPUTED_DIR)) {
  fs.mkdirSync(PRECOMPUTED_DIR, { recursive: true });
}

// Spammer phone hash to test deduplication rule (counts as 1 unique citizen)
const SPAMMER_PHONE = "hash_spammer_998877";

const SEED_REQUESTS: CitizenRequest[] = [
  // GUARANTEED DEMO TICKETS (Section 7)
  {
    id: "TICKET-DEMO-01",
    channel: "voice",
    original_text: "हमारे रामसर गांव में 6 महीने से खारे पानी की समस्या है, पीने के पानी की पाइपलाइन टूटी हुई है।",
    state: "rajasthan",
    district: "barmer",
    village_text: "Ramsar",
    phone_hash: "hash_cit_010101",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    synthetic: true,
  },
  {
    id: "TICKET-DEMO-02",
    channel: "chat",
    original_text: "ଆମ ଗାଁ ଲମତାପୁଟରୁ ମୁଖ୍ୟ ରାସ୍ତା ସଂଯୋଗ ବର୍ଷା ଦିନେ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ହୋଇଯାଉଛି। ରୋଗୀଙ୍କୁ ନେବା ଅସମ୍ଭବ।",
    state: "odisha",
    district: "koraput",
    village_text: "Lamtaput",
    phone_hash: "hash_cit_020202",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    synthetic: true,
  },
  {
    id: "TICKET-DEMO-03",
    channel: "text",
    original_text: "எங்கள் திருவாடானை கிராமத்தில் உள்ள அரசு ஆரம்ப சுகாதார நிலையத்தில் மின்சாரம் இல்லாததால் தடுப்பூசி கெட்டுப்போகிறது.",
    state: "tamil_nadu",
    district: "ramanathapuram",
    village_text: "Tiruvadanai",
    phone_hash: "hash_cit_030303",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    synthetic: true,
  },

  // SPAMMER TEST REQUESTS (same phone hash submitting 5 times to verify rate limit & 1 unique citizen)
  {
    id: "REQ-SPAM-01",
    channel: "text",
    original_text: "बाड़मेर बायतु में पानी की टंकी बनवाओ तुरंत!",
    state: "rajasthan",
    district: "barmer",
    village_text: "Baytu",
    phone_hash: SPAMMER_PHONE,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    synthetic: true,
  },
  {
    id: "REQ-SPAM-02",
    channel: "text",
    original_text: "बायतु में पानी की टंकी बनवाओ बार-बार बोल रहा हूँ!",
    state: "rajasthan",
    district: "barmer",
    village_text: "Baytu",
    phone_hash: SPAMMER_PHONE,
    created_at: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    synthetic: true,
  },
  {
    id: "REQ-SPAM-03",
    channel: "text",
    original_text: "बायतु जल संकट! टंकी तुरंत चाहिए!",
    state: "rajasthan",
    district: "barmer",
    village_text: "Baytu",
    phone_hash: SPAMMER_PHONE,
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    synthetic: true,
  },
  {
    id: "REQ-SPAM-04",
    channel: "text",
    original_text: "बायतु पानी टंकी मांग 4",
    state: "rajasthan",
    district: "barmer",
    village_text: "Baytu",
    phone_hash: SPAMMER_PHONE,
    created_at: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    synthetic: true,
  },
  {
    id: "REQ-SPAM-05",
    channel: "text",
    original_text: "बायतु पानी टंकी मांग 5",
    state: "rajasthan",
    district: "barmer",
    village_text: "Baytu",
    phone_hash: SPAMMER_PHONE,
    created_at: new Date().toISOString(),
    synthetic: true,
  },
];

const RAJASTHAN_SEEDS = [
  // Barmer (12 requests)
  { district: "barmer", v: "Baytu", cat: "water", t: "हमारे बायतु ढाणी में मीठे पानी का कोई साधन नहीं है, 4 किमी दूर से पानी लाना पड़ता है।", c: "voice" },
  { district: "barmer", v: "Sheo", cat: "road", t: "शिव तहसील के ढाणियों को जोड़ने वाली सड़क कच्ची है, एम्बुलेंस नहीं आ सकती।", c: "text" },
  { district: "barmer", v: "Chohtan", cat: "water", t: "चोहटन में सरकारी ट्यूबवेल खराब पड़ा है पिछले 3 महीने से।", c: "chat" },
  { district: "barmer", v: "Balotra", cat: "sanitation", t: "बालोतरा के बाहरी बस्ती में नाली का निकास नहीं है, गंदा पानी रास्ते में भरता है।", c: "text" },
  { district: "barmer", v: "Gudamalani", cat: "health", t: "गुड़ामालानी सब-सेंटर पर कोई डॉक्टर या नर्स उपलब्ध नहीं रहती, प्रसव के लिए शहर जाना पड़ता है।", c: "voice" },
  { district: "barmer", v: "Dhorimanna", cat: "road", t: "धोरीमन्ना से मुख्य हाइवे तक पक्की डामर सड़क बनाई जाए।", c: "text" },
  { district: "barmer", v: "Ramsar", cat: "water", t: "Water pipeline broken in Ramsar sector 2, dirty saline water coming.", c: "chat" },
  { district: "barmer", v: "Sindhari", cat: "electricity", t: "सिणधरी में रात को 8-10 घंटे बिजली गुल रहती है, किसानों की मोटर नहीं चल रही।", c: "voice" },
  { district: "barmer", v: "Sedwa", cat: "education", t: "सेड़वा राजकीय उच्च प्राथमिक विद्यालय में 2 कमरों की छत टपकती है, नया भवन चाहिए।", c: "text" },
  { district: "barmer", v: "Chohtan", cat: "road", t: "Border area road from Chohtan to outpost broken completely.", c: "text" },
  { district: "barmer", v: "Baytu", cat: "housing", t: "बायतु में प्रधानमंत्री ग्रामीण आवास योजना की पात्रता सूची में वंचित परिवारों को शामिल करें।", c: "text" },
  { district: "barmer", v: "Gudamalani", cat: "water", t: "गुड़ामालानी में मीठे पानी की आपूर्ति हेतु नई पाइपलाइन बिछाई जाए।", c: "voice" },

  // Udaipur (12 requests)
  { district: "udaipur", v: "Kotra", cat: "road", t: "कोटड़ा के आदिवासी फलियों तक जाने के लिए कोई पक्की सड़क या पुलिया नहीं है।", c: "voice" },
  { district: "udaipur", v: "Kotra", cat: "health", t: "कोटड़ा प्राथमिक स्वास्थ्य केंद्र में 24 घंटे आपातकालीन सेवा और दवाइयां नहीं हैं।", c: "chat" },
  { district: "udaipur", v: "Jhadol", cat: "road", t: "झाड़ोल में पहाड़ी नाले पर रपटा नहीं होने से बारिश में 5 गांव कट जाते हैं।", c: "voice" },
  { district: "udaipur", v: "Salumbar", cat: "water", t: "सलूंबर के सरकारी कुएं का पानी सूख गया है, नया बोरवेल खुदवाया जाए।", c: "text" },
  { district: "udaipur", v: "Kherwara", cat: "education", t: "खैरवाड़ा मॉडल स्कूल में बालिकाओं के लिए अलग शौचालय नहीं है।", c: "text" },
  { district: "udaipur", v: "Gogunda", cat: "health", t: "गोगुंदा उप-जिला अस्पताल में सोनोग्राफी मशीन 6 माह से बंद पड़ी है।", c: "chat" },
  { district: "udaipur", v: "Mavli", cat: "irrigation", t: "मावली में पुराने एनीकट की मरम्मत की जाए ताकि बारिश का पानी रुके।", c: "text" },
  { district: "udaipur", v: "Vallabhnagar", cat: "electricity", t: "वल्लभनगर में ट्रांसफार्मर जल गया है, 4 दिन से अंधेरा है।", c: "voice" },
  { district: "udaipur", v: "Kotra", cat: "road", t: "Kotra to Mandwa gravel road needs PMGSY all weather asphalt.", c: "text" },
  { district: "udaipur", v: "Jhadol", cat: "sanitation", t: "झाड़ोल बाजार में सामुदायिक शौचालय की भारी कमी है।", c: "text" },
  { district: "udaipur", v: "Salumbar", cat: "road", t: "सलूंबर से झाड़ोल संपर्क मार्ग पूरी तरह जर्जर है, मरम्मत हो।", c: "text" },
  { district: "udaipur", v: "Gogunda", cat: "water", t: "गोगुंदा पहाड़ी क्षेत्र के हैंडपंप सूख गए हैं, पानी का टैंकर भेजा जाए।", c: "voice" },

  // Jodhpur (12 requests)
  { district: "jodhpur", v: "Osian", cat: "water", t: "ओसियां के गांवों में नर्मदा पेयजल लाइन का पानी 10 दिन में एक बार आता है।", c: "text" },
  { district: "jodhpur", v: "Phalodi", cat: "water", t: "फलोदी ग्रामीण क्षेत्र में खारा पानी पीने से लोग बीमार पड़ रहे हैं, RO प्लांट लगाएं।", c: "voice" },
  { district: "jodhpur", v: "Bhopalgarh", cat: "road", t: "भोपालगढ़ से आसोप जाने वाली सड़क पर बड़े-बड़े गड्ढे हैं।", c: "chat" },
  { district: "jodhpur", v: "Bilara", cat: "education", t: "बिलाड़ा कन्या विद्यालय में विज्ञान प्रयोगशाला और शिक्षक नहीं हैं।", c: "text" },
  { district: "jodhpur", v: "Luni", cat: "health", t: "लूणी सीएचसी में एंबुलेंस सुविधा उपलब्ध करवाई जाए।", c: "text" },
  { district: "jodhpur", v: "Shergarh", cat: "electricity", t: "शेरगढ़ में लो वोल्टेज की समस्या से ट्यूबवेल नहीं चल पा रहे।", c: "voice" },
  { district: "jodhpur", v: "Balesar", cat: "water", t: "बालेसर में पानी की पाइपलाइन लीकेज ठीक करवाएं।", c: "chat" },
  { district: "jodhpur", v: "Tiwari", cat: "housing", t: "तिंवरी में कच्ची झोपड़ियों में रहने वाले गरीब परिवारों को आवास मिले।", c: "text" },
  { district: "jodhpur", v: "Osian", cat: "road", t: "ओसियां मुख्य धार्मिक स्थल और ग्रामीण मार्ग पर डामरीकरण आवश्यक है।", c: "text" },
  { district: "jodhpur", v: "Phalodi", cat: "health", t: "फलोदी ग्रामीण डिस्पेंसरी में आवश्यक दवाइयों का स्टॉक समाप्त हो गया है।", c: "chat" },
  { district: "jodhpur", v: "Bhopalgarh", cat: "sanitation", t: "भोपालगढ़ ग्राम पंचायत में ठोस कचरा प्रबंधन केंद्र स्थापित करें।", c: "text" },
  { district: "jodhpur", v: "Bilara", cat: "irrigation", t: "बिलाड़ा में बाणगंगा नदी क्षेत्र में चेकडैम बनाकर भूजल स्तर बढ़ाया जाए।", c: "voice" },

  // Jaipur (12 requests)
  { district: "jaipur", v: "Chaksu", cat: "education", t: "चाकसू राजकीय विद्यालय में कक्षा 11 और 12 के लिए अतिरिक्त कमरों की सख्त आवश्यकता है।", c: "text" },
  { district: "jaipur", v: "Kotputli", cat: "health", t: "कोटपूतली बीडीएम अस्पताल में ट्रॉमा सेंटर का विस्तार किया जाए।", c: "chat" },
  { district: "jaipur", v: "Jamwa Ramgarh", cat: "water", t: "जमवारामगढ़ बांध क्षेत्र के गांवों में फ्लोराइड मुक्त पेयजल लाइन बिछाएं।", c: "voice" },
  { district: "jaipur", v: "Phulera", cat: "sanitation", t: "फुलेरा जंक्शन के पास ड्रेनेज लाइन जाम होने से कॉलोनियों में बदबू फैल रही है।", c: "text" },
  { district: "jaipur", v: "Sanganer Rural", cat: "road", t: "सांगानेर ग्रामीण लिंक रोड पर डामरीकरण और स्ट्रीट लाइट लगवाई जाए।", c: "text" },
  { district: "jaipur", v: "Bassie", cat: "education", t: "बस्सी सरकारी स्कूल में कंप्यूटर लैब और इंटरनेट कनेक्शन चाहिए।", c: "voice" },
  { district: "jaipur", v: "Shahpura", cat: "electricity", t: "शाहपुरा औद्योगिक और ग्रामीण क्षेत्र में बिजली कटौती बंद हो।", c: "chat" },
  { district: "jaipur", v: "Amer Rural", cat: "water", t: "आमेर ग्रामीण में बोरवेल मोटर खराब है, जलापूर्ति बाधित है।", c: "text" },
  { district: "jaipur", v: "Kotputli", cat: "road", t: "कोटपूतली औद्योगिक और ग्रामीण लिंक सड़क पर भारी ट्रकों से गड्ढे हो गए हैं।", c: "text" },
  { district: "jaipur", v: "Phulera", cat: "water", t: "फुलेरा में सांभर झील के पास खारे पानी की रोकथाम हेतु बीसलपुर जल आपूर्ति बढ़ाई जाए।", c: "voice" },
  { district: "jaipur", v: "Bassie", cat: "health", t: "बस्सी सीएचसी में डिजिटल एक्स-रे मशीन लगाई जाए।", c: "chat" },
  { district: "jaipur", v: "Shahpura", cat: "housing", t: "शाहपुरा में गरीब परिवारों को पक्के आवास की वित्तीय सहायता दी जाए।", c: "text" },
];

const ODISHA_SEEDS = [
  // Koraput (12 requests)
  { district: "koraput", v: "Lamtaput", cat: "road", t: "ଲମତାପୁଟରୁ ପାଦୁଆ ରାସ୍ତା ଖାଲଖମାରେ ଭର୍ତ୍ତି, ଗାଡ଼ି ଚଳାଚଳ ବନ୍ଦ ହୋଇପଡ଼ିଛି।", c: "voice" },
  { district: "koraput", v: "Pottangi", cat: "health", t: "ପଟାଙ୍ଗୀ ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରରେ ଡାକ୍ତର ନାହାନ୍ତି, ରୋଗୀ ମାନେ ହଇରାଣ ହେଉଛନ୍ତି।", c: "chat" },
  { district: "koraput", v: "Semiliguda", cat: "water", t: "ସେମିଳିଗୁଡ଼ା ଗ୍ରାମରେ ପାଇପ ପାଣି ଯୋଗାଣ ଅଚଳ, ନଳକୂପରୁ ଲାଲ ପାଣି ବାହାରୁଛି।", c: "text" },
  { district: "koraput", v: "Boipariguda", cat: "road", t: "ବୋଇପାରିଗୁଡ଼ା ଜଙ୍ଗଲ ରାସ୍ତାରେ କଲଭର୍ଟ ଭାଙ୍ଗିଯାଇଛି, ନୂତନ ପୋଲ ନିର୍ମାଣ ଦରକାର।", c: "voice" },
  { district: "koraput", v: "Jeypore Rural", cat: "education", t: "ଜୟପୁର ଗ୍ରାମାଞ୍ଚଳ ବିଦ୍ୟାଳୟରେ ଛାତ୍ରୀ ମାନଙ୍କ ପାଇଁ ଶୌଚାଳୟ ନାହିଁ।", c: "text" },
  { district: "koraput", v: "Dasamantapur", cat: "electricity", t: "ଦଶମନ୍ତପୁରରେ ସପ୍ତାହେ ହେଲା ବିଜୁଳି ନାହିଁ, ଟ୍ରାନ୍ସଫର୍ମର ପୋଡ଼ି ଯାଇଛି।", c: "chat" },
  { district: "koraput", v: "Kundura", cat: "water", t: "କୁନ୍ଦୁରା ପଞ୍ଚାୟତରେ ଗଭୀର ନଳକୂପ ସ୍ଥାପନ କରାଯାଉ।", c: "voice" },
  { district: "koraput", v: "Borigumma", cat: "health", t: "ବୋରିଗୁମ୍ମା ହସପିଟାଲରେ ଆମ୍ବୁଲାନ୍ସ ସୁବିଧା ନାହିଁ।", c: "text" },
  { district: "koraput", v: "Pottangi", cat: "road", t: "ପଟାଙ୍ଗୀ ପାହାଡ଼ିଆ ଅଞ୍ଚଳରେ ରାସ୍ତା ଧୋଇଯାଇଛି, ପ୍ରଧାନମନ୍ତ୍ରୀ ଗ୍ରାମ ସଡ଼କ ଯୋଜନାରେ ନିର୍ମାଣ ହେଉ।", c: "text" },
  { district: "koraput", v: "Semiliguda", cat: "education", t: "ସେମିଳିଗୁଡ଼ା ଆଦର୍ଶ ବିଦ୍ୟାଳୟରେ ବିଜ୍ଞାନ ଶିକ୍ଷକ ଏବଂ ଲାଇବ୍ରେରୀ ଦରକାର।", c: "voice" },
  { district: "koraput", v: "Boipariguda", cat: "sanitation", t: "ବୋଇପାରିଗୁଡ଼ା ସାପ୍ତାହିକ ହାଟରେ ପରିମଳ ବ୍ୟବସ୍ଥା ନାହିଁ, ବ୍ୟାପକ ଅସ୍ୱାସ୍ଥ୍ୟକର ପରିବେଶ।", c: "chat" },
  { district: "koraput", v: "Dasamantapur", cat: "housing", t: "ଦଶମନ୍ତପୁରରେ ଆବାସ ଯୋଜନାରେ ଗୃହହୀନ ପରିବାରଙ୍କୁ ଘର ମିଳୁ।", c: "text" },

  // Mayurbhanj (12 requests)
  { district: "mayurbhanj", v: "Baripada Rural", cat: "road", t: "ବାରିପଦା ଗ୍ରାମୀଣ ଅଞ୍ଚଳରେ ପିଚୁ ରାସ୍ତା ନିର୍ମାଣ ପାଇଁ ଦାବି।", c: "text" },
  { district: "mayurbhanj", v: "Rairangpur", cat: "health", t: "ରାଇରଙ୍ଗପୁର ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନାରେ ମାତୃ ଓ ଶିଶୁ ଚିକିତ୍ସା କକ୍ଷ ଉନ୍ନତିକରଣ ଆବଶ୍ୟକ।", c: "chat" },
  { district: "mayurbhanj", v: "Karanjia", cat: "water", t: "କରଞ୍ଜିଆରେ ଗ୍ରୀଷ୍ମ ଋତୁରେ ପାନୀୟ ଜଳ ସଙ୍କଟ, ଜଳ ଜୀବନ ମିଶନ କାର୍ଯ୍ୟ ଶେଷ କରନ୍ତୁ।", c: "voice" },
  { district: "mayurbhanj", v: "Udala", cat: "education", t: "ଉଦଳା ଆଦିବାସୀ ହଷ୍ଟେଲରେ ବିଦ୍ୟୁତ ଏବଂ ପାନୀୟ ଜଳର ଅଭାବ ଅଛି।", c: "text" },
  { district: "mayurbhanj", v: "Jashipur", cat: "road", t: "ଯଶୀପୁର ଶିମିଳିପାଳ ସଂଲଗ୍ନ ରାସ୍ତା ମରାମତି ହେଉ।", c: "voice" },
  { district: "mayurbhanj", v: "Betnoti", cat: "sanitation", t: "ବେତନଟୀ ବଜାରରେ ଡ୍ରେନେଜ ବ୍ୟବସ୍ଥା ନଥିବାରୁ ଦୁର୍ଗନ୍ଧ ହେଉଛି।", c: "chat" },
  { district: "mayurbhanj", v: "Badasahi", cat: "irrigation", t: "ବଡ଼ସାହିରେ ଚାଷ ଜମି ପାଇଁ କେନାଲ ମରାମତି କରାଯାଉ।", c: "text" },
  { district: "mayurbhanj", v: "Morada", cat: "housing", t: "ମୋରଡ଼ାରେ ପ୍ରଧାନମନ୍ତ୍ରୀ ଆବାସ ଯୋଜନା ତାଲିକାରେ ଯୋଗ୍ୟ ହିତାଧିକାରୀଙ୍କୁ ସାମିଲ କରନ୍ତୁ।", c: "text" },
  { district: "mayurbhanj", v: "Rairangpur", cat: "water", t: "ରାଇରଙ୍ଗପୁରରେ ପାଇପ ଯୋଗେ ବିଶୁଦ୍ଧ ପାନୀୟ ଜଳ ଯୋଗାଣ ବନ୍ଦ ଅଛି।", c: "voice" },
  { district: "mayurbhanj", v: "Karanjia", cat: "road", t: "କରଞ୍ଜିଆରୁ ଯଶୀପୁର ରାସ୍ତାରେ ବଡ଼ ବଡ଼ ଖାଲ, ଯାତାୟାତ ବିପଦଜନକ।", c: "text" },
  { district: "mayurbhanj", v: "Udala", cat: "health", t: "ଉଦଳା ଉପଖଣ୍ଡ ଚିକିତ୍ସାଳୟରେ ରକ୍ତ ଭଣ୍ଡାର (Blood Bank) ସ୍ଥାପନ କରାଯାଉ।", c: "chat" },
  { district: "mayurbhanj", v: "Betnoti", cat: "education", t: "ବେତନଟୀ ବାଳିକା ହାଇସ୍କୁଲ ପାଚେରୀ ନିର୍ମାଣ କରାଯାଉ।", c: "text" },

  // Sambalpur (12 requests)
  { district: "sambalpur", v: "Rengali", cat: "electricity", t: "ରେଙ୍ଗାଲି ଶିଳ୍ପାଞ୍ଚଳ ନିକଟ ଗ୍ରାମରେ ଲୋ ଭୋଲଟେଜ ଯୋଗୁଁ ଫ୍ୟାନ ମଧ୍ୟ ଚାଲୁନାହିଁ।", c: "voice" },
  { district: "sambalpur", v: "Kuchinda", cat: "road", t: "କୁଚିଣ୍ଡା ବ୍ଲକରୁ ମୁଖ୍ୟ ରାସ୍ତା ସଂଯୋଗ ପକ୍କା କରାଯାଉ।", c: "text" },
  { district: "sambalpur", v: "Rairakhol", cat: "health", t: "ରେଢ଼ାଖୋଲ ହସ୍ପିଟାଲରେ ଅଲଟ୍ରାସାଉଣ୍ଡ ଯନ୍ତ୍ର ଅଚଳ ଅଛି।", c: "chat" },
  { district: "sambalpur", v: "Jujumura", cat: "water", t: "ଜୁଜୁମୁରା ଗ୍ରାମରେ ପାଇପ ଫାଟି ପାଣି ନଷ୍ଟ ହେଉଛି ଏବଂ ଲୋକେ ପାଣି ପାଉନାହାନ୍ତି।", c: "text" },
  { district: "sambalpur", v: "Dhankauda", cat: "education", t: "ଧନକଉଡ଼ା ସ୍କୁଲରେ କମ୍ପ୍ୟୁଟର ଶିକ୍ଷକ ଏବଂ ଲ୍ୟାବ ପ୍ରଦାନ କରନ୍ତୁ।", c: "voice" },
  { district: "sambalpur", v: "Bamra", cat: "sanitation", t: "ବାମରା ରେଳ ଷ୍ଟେସନ ନିକଟରେ ସାର୍ବଜନୀନ ଶୌଚାଳୟ ନିର୍ମାଣ ହେଉ।", c: "text" },
  { district: "sambalpur", v: "Kuchinda", cat: "water", t: "କୁଚିଣ୍ଡା ବ୍ଲକରେ ଗ୍ରୀଷ୍ମ ଋତୁ ପାଇଁ ବୋରୱେଲ ଓ ସୋଲାର ପମ୍ପ ଲଗାଯାଉ।", c: "voice" },
  { district: "sambalpur", v: "Rairakhol", cat: "road", t: "ରେଢ଼ାଖୋଲ ଗ୍ରାମ୍ୟ ରାସ୍ତା ନିର୍ମାଣ କାର୍ଯ୍ୟ ଶୀଘ୍ର ଆରମ୍ଭ କରାଯାଉ।", c: "text" },
  { district: "sambalpur", v: "Jujumura", cat: "education", t: "ଜୁଜୁମୁରା ସ୍କୁଲରେ ପାନୀୟ ଜଳ ଓ ବିଦ୍ୟୁତ ସଂଯୋଗ ଦିଆଯାଉ।", c: "chat" },
  { district: "sambalpur", v: "Dhankauda", cat: "health", t: "ଧନକଉଡ଼ା ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରରେ ନିୟମିତ ଔଷଧ ବଣ୍ଟନ ହେଉ।", c: "text" },
  { district: "sambalpur", v: "Bamra", cat: "housing", t: "ବାମରା ଅଞ୍ଚଳରେ ପ୍ରଧାନମନ୍ତ୍ରୀ ଗ୍ରାମୀଣ ଆବାସ ଯୋଜନା ଅଧୀନରେ ଘର ମିଳୁ।", c: "voice" },
  { district: "sambalpur", v: "Rengali", cat: "irrigation", t: "ରେଙ୍ଗାଲି ଚାଷୀଙ୍କ ପାଇଁ ଲିଫ୍ଟ ଇରିଗେସନ ପଏଣ୍ଟ ମରାମତି ହେଉ।", c: "text" },

  // Khordha (12 requests)
  { district: "khordha", v: "Jatani", cat: "sanitation", t: "ଜଟଣୀ ପୌରାଞ୍ଚଳ କଲୋନୀରେ ଡ୍ରେନ ପାଣି ରାସ୍ତା ଉପରେ ଜମି ରହୁଛି, ପକ୍କା ଡ୍ରେନ ଦରକାର।", c: "text" },
  { district: "khordha", v: "Banapur", cat: "water", t: "ବାଣପୁର ଚିଲିକା ଉପକୂଳ ଗ୍ରାମରେ ଲୁଣି ପାଣି, ସୁରକ୍ଷିତ ପାନୀୟ ଜଳ ପ୍ରକଳ୍ପ ଦରକାର।", c: "voice" },
  { district: "khordha", v: "Begunia", cat: "road", t: "ବେଗୁନିଆ ଗ୍ରାମ୍ୟ ଉନ୍ନୟନ ରାସ୍ତା ଖରାପ, ତୁରନ୍ତ ମରାମତି କରାଯାଉ।", c: "chat" },
  { district: "khordha", v: "Tangi", cat: "health", t: "ଟାଙ୍ଗୀ ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରକୁ ୨୪ ଘଣ୍ଟିଆ ପ୍ରସୂତି କେନ୍ଦ୍ର ଭାବେ ଉନ୍ନୀତ କରାଯାଉ।", c: "text" },
  { district: "khordha", v: "Balianta", cat: "education", t: "ବାଲିଅନ୍ତା ସରକାରୀ ହାଇସ୍କୁଲରେ ଅତିରିକ୍ତ ଶ୍ରେଣୀ ଗୃହ ଆବଶ୍ୟକ।", c: "voice" },
  { district: "khordha", v: "Balipatna", cat: "irrigation", t: "ବାଳିପାଟଣା କୁଶଭଦ୍ରା ଶାଖା କେନାଲ ସଫା ଏବଂ ଗଭୀର କରାଯାଉ।", c: "text" },
  { district: "khordha", v: "Jatani", cat: "water", t: "ଜଟଣୀ ରେଳ କଲୋନୀ ପାଖରେ ପାଇପ ଫାଟି ପାନୀୟ ଜଳ ଅପଚୟ ହେଉଛି।", c: "chat" },
  { district: "khordha", v: "Banapur", cat: "road", t: "ବାଣପୁରରୁ ଚିଲିକା କୂଳ ରାସ୍ତା ମରାମତି କରି କଂକ୍ରିଟ କରାଯାଉ।", c: "text" },
  { district: "khordha", v: "Begunia", cat: "health", t: "ବେଗୁନିଆ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରରେ ରାତ୍ରୀକାଳୀନ ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା ଆରମ୍ଭ କରାଯାଉ।", c: "voice" },
  { district: "khordha", v: "Tangi", cat: "education", t: "ଟାଙ୍ଗୀ ହାଇସ୍କୁଲରେ କମ୍ପ୍ୟୁଟର ରୁମ ଓ ପାଠାଗାର ନିର୍ମାଣ କରାଯାଉ।", c: "text" },
  { district: "khordha", v: "Balianta", cat: "sanitation", t: "ବାଲିଅନ୍ତା ବଜାରରେ କଠିନ ବର୍ଜ୍ୟବସ୍ତୁ ପରିଚାଳନା କେନ୍ଦ୍ର ସ୍ଥାପନ ହେଉ।", c: "chat" },
  { district: "khordha", v: "Balipatna", cat: "housing", t: "ବାଳିପାଟଣାରେ ବନ୍ୟା ପ୍ରପୀଡ଼ିତ ପରିବାରଙ୍କୁ ପକ୍କା ଆବାସ ଯୋଗାଇ ଦିଆଯାଉ।", c: "text" },
];

const TAMIL_NADU_SEEDS = [
  // Ramanathapuram (12 requests)
  { district: "ramanathapuram", v: "Kadaladi", cat: "water", t: "கடலாடி ஒன்றியத்தில் உப்பு நீர் மட்டுமே கிடைக்கிறது, கொள்ளிடம் கூட்டுக் குடிநீர் திட்டம் விரைந்து முடிக்கப்பட வேண்டும்.", c: "voice" },
  { district: "ramanathapuram", v: "Mudukulathur", cat: "water", t: "முதுகுளத்தூர் கிராமங்களுக்கு வாரம் ஒருமுறை மட்டுமே தண்ணீர் விநியோகம் செய்யப்படுகிறது.", c: "chat" },
  { district: "ramanathapuram", v: "Paramakudi Rural", cat: "road", t: "பரமக்குடி கிராம இணைப்பு சாலை முழுவதும் குண்டும் குழியுமாக உள்ளது, தார் சாலை அமைக்க வேண்டும்.", c: "text" },
  { district: "ramanathapuram", v: "Rameswaram Island", cat: "sanitation", t: "ராமேஸ்வரம் மீனவர் குடியிருப்புகளில் கழிவுநீர் வடிகால் வசதி செய்து தரவும்.", c: "text" },
  { district: "ramanathapuram", v: "Kamuthi", cat: "health", t: "கமுதி அரசு மருத்துவமனையில் இரவு நேர மருத்துவர்கள் மற்றும் மருந்து தட்டுப்பாடு தீர்க்கப்பட வேண்டும்.", c: "voice" },
  { district: "ramanathapuram", v: "Mandapam", cat: "housing", t: "மண்டபம் கடற்கரை கிராம குடிசை வீடுகளுக்கு கான்கிரீட் தொகுப்பு வீடுகள் வழங்க வேண்டும்.", c: "chat" },
  { district: "ramanathapuram", v: "Tiruvadanai", cat: "electricity", t: "திருவாடானை பகுதியில் விவசாய மின்சார மோட்டார்களுக்கு மும்முனை மின்சாரம் தடையின்றி வழங்கவும்.", c: "text" },
  { district: "ramanathapuram", v: "Sayalkudi", cat: "water", t: "Drinking water pipeline leak in Sayalkudi main junction, water overflowing.", c: "text" },
  { district: "ramanathapuram", v: "Mudukulathur", cat: "road", t: "முதுகுளத்தூர் கிராம சாலைகளில் பள்ளி பேருந்துகள் செல்ல முடியாத அளவுக்கு குண்டும் குழியுமாக உள்ளது.", c: "text" },
  { district: "ramanathapuram", v: "Paramakudi Rural", cat: "water", t: "பரமக்குடி வைகை ஆற்றுப்படுகை குடிநீர் திட்டத்தை துரிதப்படுத்த வேண்டும்.", c: "voice" },
  { district: "ramanathapuram", v: "Kamuthi", cat: "education", t: "கமுதி அரசு மேல்நிலைப் பள்ளியில் அறிவியல் ஆசிரியர் மற்றும் ஆய்வக உபகரணங்கள் தேவை.", c: "chat" },
  { district: "ramanathapuram", v: "Rameswaram Island", cat: "road", t: "தனுஷ்கோடி மீனவர் கிராம இணைப்பு சாலை கடல் அரிப்பால் சேதமடைந்துள்ளது, சீரமைக்க வேண்டும்.", c: "text" },

  // Dharmapuri (12 requests)
  { district: "dharmapuri", v: "Pennagaram", cat: "water", t: "பென்னாகரம் மலைக் கிராமங்களில் குடிநீர் வசதி இல்லை, ஒகேனக்கல் கூட்டு குடிநீர் விநியோகம் விரிவுபடுத்தப்பட வேண்டும்.", c: "voice" },
  { district: "dharmapuri", v: "Harur", cat: "road", t: "அரூர் மலைப்பாதை மண் சாலை மழைக்காலத்தில் அடித்துச் செல்லப்படுகிறது, தார் சாலை வேண்டும்.", c: "text" },
  { district: "dharmapuri", v: "Palacode", cat: "education", t: "பாலக்கோடு அரசு மேல்நிலைப் பள்ளியில் அறிவியல் ஆய்வகம் மற்றும் கழிப்பறை வசதி தேவை.", c: "chat" },
  { district: "dharmapuri", v: "Karimangalam", cat: "health", t: "கரிமங்கலம் ஆரம்ப சுகாதார நிலையத்தில் 24 மணி நேர பிரசவ வசதி ஏற்படுத்தப்பட வேண்டும்.", c: "voice" },
  { district: "dharmapuri", v: "Nallampalli", cat: "sanitation", t: "நல்லம்பள்ளி ஊராட்சி பகுதியில் குப்பை மேலாண்மை மற்றும் கழிவுநீர் கால்வாய் அமைக்கவும்.", c: "text" },
  { district: "dharmapuri", v: "Pappireddipatti", cat: "irrigation", t: "பாப்பிரெட்டிப்பட்டி ஏரி தூர்வாரப்பட்டு பாசன வாய்க்கால்கள் சீரமைக்கப்பட வேண்டும்.", c: "text" },
  { district: "dharmapuri", v: "Pennagaram", cat: "road", t: "Pennagaram hill tribal settlement road needs immediate blacktopping under PMGSY.", c: "chat" },
  { district: "dharmapuri", v: "Morappur", cat: "electricity", t: "மொரப்பூர் பகுதியில் அடிக்கடி குறைந்த மின்னழுத்தம் ஏற்படுகிறது, கூடுதல் மின்மாற்றி அமைக்க வேண்டும்.", c: "text" },
  { district: "dharmapuri", v: "Harur", cat: "health", t: "அரூர் அரசு மருத்துவமனையில் அவசர சிகிச்சை பிரிவு மற்றும் டயாலிசிஸ் பிரிவு அமைக்க வேண்டும்.", c: "voice" },
  { district: "dharmapuri", v: "Palacode", cat: "water", t: "பாலக்கோடு கிராமப்புற பகுதிகளில் ஆழ்துளை கிணறு அமைத்து குடிநீர் வழங்க வேண்டும்.", c: "text" },
  { district: "dharmapuri", v: "Karimangalam", cat: "road", t: "கரிமங்கலம் ஊராட்சி கிராம இணைப்பு தார் சாலை அமைக்க கோரிக்கை.", c: "chat" },
  { district: "dharmapuri", v: "Nallampalli", cat: "housing", t: "நல்லம்பள்ளி மலைவாழ் மக்களுக்கு பிரதம மந்திரி ஆவாஸ் திட்டத்தில் கான்கிரீட் வீடுகள் கட்ட நிதி வழங்கவும்.", c: "text" },

  // Madurai (12 requests)
  { district: "madurai", v: "Melur", cat: "irrigation", t: "மேலூர் பகுதி பெரியாறு பிரதான பாசன கால்வாயில் தூர்வாரி கடைமடை பகுதிக்கு தண்ணீர் வழங்கவும்.", c: "text" },
  { district: "madurai", v: "Usilampatti", cat: "water", t: "உசிலம்பட்டி கிராமங்களில் 58 கிராம கால்வாய் நீர் சேமிப்பு தொட்டிகள் பழுது நீக்கப்பட வேண்டும்.", c: "voice" },
  { district: "madurai", v: "Thirumangalam", cat: "road", t: "திருமங்கலம் கிராம இணைப்பு பாலம் சேதமடைந்துள்ளது, புதிய பாலம் கட்ட வேண்டும்.", c: "chat" },
  { district: "madurai", v: "Vadipatti", cat: "health", t: "வாடிப்பட்டி அரசு பொது மருத்துவமனையில் ஸ்கேன் மற்றும் எக்ஸ்ரே வசதி வேண்டும்.", c: "text" },
  { district: "madurai", v: "Sholavandan", cat: "education", t: "சோழவந்தான் அரசு மகளிர் உயர்நிலைப் பள்ளியில் கூடுதல் வகுப்பறைகள் கட்ட வேண்டும்.", c: "voice" },
  { district: "madurai", v: "Sedapatti", cat: "electricity", t: "சேடபட்டி பகுதியில் மின்கம்பங்கள் சாய்ந்து ஆபத்தான நிலையில் உள்ளன.", c: "text" },
  { district: "madurai", v: "Usilampatti", cat: "health", t: "உசிலம்பட்டி அரசு மருத்துவமனையில் குழந்தைகள் தீவிர சிகிச்சை பிரிவு துவங்கப்பட வேண்டும்.", c: "text" },
  { district: "madurai", v: "Thirumangalam", cat: "water", t: "திருமங்கலம் நகராட்சி மற்றும் சுற்றியுள்ள கிராமங்களில் குடிநீர் விநியோகம் சீராக இல்லை.", c: "voice" },
  { district: "madurai", v: "Vadipatti", cat: "sanitation", t: "வாடிப்பட்டி பேரூராட்சி பகுதியில் பொது கழிப்பிடங்களை சீரமைக்க வேண்டும்.", c: "chat" },
  { district: "madurai", v: "Sholavandan", cat: "irrigation", t: "சோழவந்தான் பகுதியில் நெல் விவசாயத்திற்கு கால்வாய் பாசன நீர் கடைமடை வரை செல்ல தூர்வாரவும்.", c: "text" },
  { district: "madurai", v: "Sedapatti", cat: "road", t: "சேடபட்டி கிராமப்புற சாலைகளை பிரதம மந்திரி கிராம சாலை திட்டத்தில் தார் சாலையாக மாற்றவும்.", c: "voice" },
  { district: "madurai", v: "Melur", cat: "housing", t: "மேலூர் வட்டாரத்தில் குடிசை மாற்று வாரிய வீடுகள் ஒதுக்கீடு செய்ய வேண்டும்.", c: "text" },

  // Chennai (12 requests)
  { district: "chennai", v: "Ambattur Fringe", cat: "sanitation", t: "அம்பத்தூர் எல்லைப் பகுதியில் மழைநீர் வடிகால் கால்வாய் தூர்வாரப்படாமல் தண்ணீர் தேங்குகிறது.", c: "text" },
  { district: "chennai", v: "Madhavaram", cat: "water", t: "மாதவரம் பகுதியில் குடிநீர் குழாய்களில் கழிவுநீர் கலப்பதாக புகார், உடனடியாக சரிசெய்யவும்.", c: "voice" },
  { district: "chennai", v: "Sholinganallur Outer", cat: "road", t: "சோழிங்கநல்லூர் இணைப்பு சாலையில் பாதாள சாக்கடை பணிகளுக்குப் பின் சாலை சீரமைக்கப்படவில்லை.", c: "chat" },
  { district: "chennai", v: "Tondiarpet", cat: "health", t: "தண்டையார்பேட்டை நகர்ப்புற ஆரம்ப சுகாதார நிலைய கட்டடத்தை நவீனப்படுத்த வேண்டும்.", c: "text" },
  { district: "chennai", v: "Manali", cat: "education", t: "மணலி அரசு மேல்நிலைப் பள்ளிக்கு புதிய கணினி ஆய்வகம் மற்றும் குடிநீர் வசதி தேவை.", c: "text" },
  { district: "chennai", v: "Thiruvanmiyur Kuil Thoppu", cat: "housing", t: "குயில் தோப்பு பகுதியில் வசிப்போருக்கு நிரந்தர அடுக்குமாடி குடியிருப்பு வழங்க வேண்டும்.", c: "voice" },
  { district: "chennai", v: "Ambattur Fringe", cat: "road", t: "அம்பத்தூர் தொழிற்பேட்டை இணைப்பு சாலைகளை மழைக்காலத்திற்கு முன் சீரமைக்க வேண்டும்.", c: "text" },
  { district: "chennai", v: "Madhavaram", cat: "sanitation", t: "மாதவரம் ஏரி பகுதியில் கழிவுநீர் கலப்பதை தடுத்து கழிவுநீர் சுத்திகரிப்பு நிலையம் அமைக்க வேண்டும்.", c: "chat" },
  { district: "chennai", v: "Sholinganallur Outer", cat: "water", t: "சோழிங்கநல்லூர் கிராம பகுதிகளில் குடிநீர் வாரிய லாரி நீர் கட்டணமில்லாமல் விநியோகிக்க வேண்டும்.", c: "voice" },
  { district: "chennai", v: "Tondiarpet", cat: "education", t: "தண்டையார்பேட்டை மாநகராட்சி பள்ளியில் ஸ்மார்ட் வகுப்பறைகள் மற்றும் கழிப்பறை பராமரிப்பு தேவை.", c: "text" },
  { district: "chennai", v: "Manali", cat: "health", t: "மணலி ரசாயன தொழிற்சாலைகள் நிறைந்த பகுதியில் சுவாச நோய் சிகிச்சைக்கான சிறப்பு பிரிவு அமைக்கவும்.", c: "voice" },
  { district: "chennai", v: "Thiruvanmiyur Kuil Thoppu", cat: "sanitation", t: "கடற்கரை ஓர बस्तीயில் திடக் கழிவு மேலாண்மை மற்றும் குப்பை தொட்டிகள் வைக்க வேண்டும்.", c: "text" },
];

let globalCounter = 100;

function expandSeeds(seeds: any[], state: string) {
  for (const s of seeds) {
    globalCounter++;
    const id = `REQ-${state.toUpperCase().slice(0, 3)}-${globalCounter}`;
    const hash = `hash_${state}_${Math.floor(100000 + Math.random() * 900000)}`;
    const daysAgo = Math.floor(Math.random() * 25) + 1;
    SEED_REQUESTS.push({
      id,
      channel: s.c as any,
      original_text: s.t,
      state,
      district: s.district,
      village_text: s.v,
      phone_hash: hash,
      created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      synthetic: true,
    });
  }
}

// Expand base seeds
expandSeeds(RAJASTHAN_SEEDS, "rajasthan");
expandSeeds(ODISHA_SEEDS, "odisha");
expandSeeds(TAMIL_NADU_SEEDS, "tamil_nadu");

// Add code-mixed & English variations
const CODE_MIXED = [
  { state: "rajasthan", district: "barmer", v: "Sheo", t: "Hamare Sheo village me road connectivity bilkul zero hai, monsoon me gaon block ho jata hai.", c: "chat" },
  { state: "rajasthan", district: "udaipur", v: "Kotra", t: "Kotra PHC me emergency doctor nahi hai. Bahut urgent help chahiye.", c: "voice" },
  { state: "rajasthan", district: "jaipur", v: "Chaksu", t: "Govt School building requires immediate 3 classrooms repair. Chaksu village.", c: "text" },
  { state: "odisha", district: "koraput", v: "Lamtaput", t: "Lamtaput main junction re pipeline leak heiki water supply bondh achi.", c: "chat" },
  { state: "odisha", district: "mayurbhanj", v: "Baripada Rural", t: "Severe road damage from Betnoti to Baripada rural pocket, please rebuild under PMGSY.", c: "text" },
  { state: "tamil_nadu", district: "ramanathapuram", v: "Kadaladi", t: "Drinking water issue in Kadaladi block, tap water saline and not drinkable.", c: "voice" },
  { state: "tamil_nadu", district: "dharmapuri", v: "Pennagaram", t: "Pennagaram tribal village asphalt road broken, ambulance cannot enter.", c: "chat" },
  { state: "tamil_nadu", district: "madurai", v: "Melur", t: "Melur canal desilting work needed immediately before monsoon.", c: "text" },
];

for (const cm of CODE_MIXED) {
  globalCounter++;
  SEED_REQUESTS.push({
    id: `REQ-${cm.state.toUpperCase().slice(0, 3)}-${globalCounter}`,
    channel: cm.c as any,
    original_text: cm.t,
    state: cm.state,
    district: cm.district,
    village_text: cm.v,
    phone_hash: `hash_${cm.state}_${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000).toISOString(),
    synthetic: true,
  });
}

console.log(`Generated ${SEED_REQUESTS.length} synthetic citizen requests across 3 states.`);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(SEED_REQUESTS, null, 2), "utf-8");
console.log(`Saved to ${OUTPUT_FILE}`);
