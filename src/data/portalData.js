export const INITIAL_GAUSHALAS = [
  {
    id: "RPR-01",
    name: "श्री कृष्ण गौशाला, आरंग",
    district: "रायपुर",
    zone: "रायपुर ज़ोन",
    reg: 210,
    ver: 204,
    x: 210,
    y: 150,
    status: "ok",
    feedStatus: "ok",
    manager: "श्री रामनारायण वर्मा",
    contact: "+91 98261 44521",
    cctvCount: 6,
    rfidCoverage: "98.5%",
    lastAuditScore: 94,
    address: "वार्ड क्र. 04, आरंग महासमुंद रोड, रायपुर (छ.ग.)",
    bankDetails: {
      account: "50200034821903",
      ifsc: "HDFC0001928",
      bank: "HDFC Bank, Arang Branch"
    },
    grantClaimed: 612000,
    grantApproved: 612000,
    cattleDistribution: { desi: 142, gir: 38, sahiwal: 24, calf: 6 }
  },
  {
    id: "RPR-02",
    name: "कामधेनु गौशाला, तिल्दा",
    district: "रायपुर",
    zone: "रायपुर ज़ोन",
    reg: 180,
    ver: 121,
    x: 230,
    y: 170,
    status: "bad",
    feedStatus: "bad",
    manager: "श्री सुरेश साहू",
    contact: "+91 94252 88210",
    cctvCount: 4,
    rfidCoverage: "67.2%",
    lastAuditScore: 58,
    address: "नेवरा मार्ग, तिल्दा, रायपुर (छ.ग.)",
    bankDetails: {
      account: "308492019401",
      ifsc: "SBIN0003891",
      bank: "State Bank of India, Tilda"
    },
    grantClaimed: 540000,
    grantApproved: 0,
    cattleDistribution: { desi: 90, gir: 18, sahiwal: 13, calf: 0 }
  },
  {
    id: "RPR-03",
    name: "नंदी सेवा सदन, अभनपुर",
    district: "रायपुर",
    zone: "रायपुर ज़ोन",
    reg: 96,
    ver: 94,
    x: 190,
    y: 185,
    status: "ok",
    feedStatus: "ok",
    manager: "श्रीमती सुनीता देवांगन",
    contact: "+91 97554 11209",
    cctvCount: 4,
    rfidCoverage: "97.9%",
    lastAuditScore: 96,
    address: "गोबरा नवापारा बाईपास, अभनपुर, रायपुर (छ.ग.)",
    bankDetails: {
      account: "18930100004921",
      ifsc: "PUNB0189300",
      bank: "Punjab National Bank, Abhanpur"
    },
    grantClaimed: 288000,
    grantApproved: 282000,
    cattleDistribution: { desi: 68, gir: 16, sahiwal: 10, calf: 2 }
  },
  {
    id: "DRG-01",
    name: "गोपाल गौशाला, दुर्ग",
    district: "दुर्ग",
    zone: "दुर्ग ज़ोन",
    reg: 240,
    ver: 233,
    x: 130,
    y: 190,
    status: "ok",
    feedStatus: "ok",
    manager: "श्री महेन्द्र चन्द्राकर",
    contact: "+91 98930 77312",
    cctvCount: 8,
    rfidCoverage: "97.1%",
    lastAuditScore: 92,
    address: "पाटन रोड, उतई तिराहा, दुर्ग (छ.ग.)",
    bankDetails: {
      account: "02910100015829",
      ifsc: "BARB0UTAIXX",
      bank: "Bank of Baroda, Durg"
    },
    grantClaimed: 700000,
    grantApproved: 699000,
    cattleDistribution: { desi: 160, gir: 45, sahiwal: 28, calf: 7 }
  },
  {
    id: "BLP-01",
    name: "सुरभि गौशाला, बिलासपुर",
    district: "बिलासपुर",
    zone: "बिलासपुर ज़ोन",
    reg: 150,
    ver: 118,
    x: 230,
    y: 80,
    status: "warn",
    feedStatus: "ok",
    manager: "श्री दीनदयाल कश्यप",
    contact: "+91 99268 33190",
    cctvCount: 5,
    rfidCoverage: "78.6%",
    lastAuditScore: 71,
    address: "सेंदरी बाईपास, रतनपुर रोड, बिलासपुर (छ.ग.)",
    bankDetails: {
      account: "9120100481920",
      ifsc: "UTIB0000318",
      bank: "Axis Bank, Bilaspur Main"
    },
    grantClaimed: 450000,
    grantApproved: 0,
    cattleDistribution: { desi: 88, gir: 20, sahiwal: 10, calf: 0 }
  },
  {
    id: "BST-01",
    name: "गौ-धाम, जगदलपुर",
    district: "बस्तर",
    zone: "बस्तर ज़ोन",
    reg: 120,
    ver: 117,
    x: 200,
    y: 300,
    status: "ok",
    feedStatus: "warn",
    manager: "श्री बलीराम कश्यप",
    contact: "+91 94060 22910",
    cctvCount: 4,
    rfidCoverage: "97.5%",
    lastAuditScore: 89,
    address: "धरमपुरा, जगदलपुर, बस्तर (छ.ग.)",
    bankDetails: {
      account: "201840192801",
      ifsc: "SBIN0000412",
      bank: "State Bank of India, Jagdalpur"
    },
    grantClaimed: 360000,
    grantApproved: 351000,
    cattleDistribution: { desi: 95, gir: 12, sahiwal: 10, calf: 3 }
  }
];

export const INITIAL_ALERTS = [
  {
    id: "ALT-101",
    type: "critical",
    category: "feed",
    title: "चारा नहीं मिला – कामधेनु गौशाला, तिल्दा",
    desc: "सुबह 9:00 तक मुख्य नांद खाली दर्ज की गई · AI Feed Vision Analysis",
    time: "09:12 AM",
    gaushalaId: "RPR-02",
    gaushalaName: "कामधेनु गौशाला, तिल्दा",
    status: "pending",
    actionTaken: null
  },
  {
    id: "ALT-102",
    type: "critical",
    category: "health",
    title: "गिरी हुई गाय (Tag #4471) – बिलासपुर",
    desc: "Shed-B में पिछले 5 घंटे से गाय स्थिर/लेटी अवस्था में पाई गई",
    time: "11:40 AM",
    gaushalaId: "BLP-01",
    gaushalaName: "सुरभि गौशाला, बिलासपुर",
    status: "pending",
    actionTaken: null
  },
  {
    id: "ALT-103",
    type: "warning",
    category: "gate",
    title: "गाय वापस नहीं लौटी – Missing Cow Alert (#2290)",
    desc: "शाम 6:00 बजे की समय-सीमा के बाद भी RFID गेट एंट्री दर्ज नहीं हुई",
    time: "06:05 PM",
    gaushalaId: "RPR-01",
    gaushalaName: "श्री कृष्ण गौशाला, आरंग",
    status: "acknowledged",
    actionTaken: "चरवाहा टीम को सूचित किया गया"
  },
  {
    id: "ALT-104",
    type: "warning",
    category: "security",
    title: "रात्रि घुसपैठ – आरंग गौशाला उत्तरी गेट",
    desc: "मध्यरात्रि बाउंड्री वॉल के पास अज्ञात मानव गति का AI डिटेक्शन",
    time: "02:14 AM",
    gaushalaId: "RPR-01",
    gaushalaName: "श्री कृष्ण गौशाला, आरंग",
    status: "resolved",
    actionTaken: "सुरक्षा गार्ड द्वारा जांच पूर्ण"
  },
  {
    id: "ALT-105",
    type: "info",
    category: "audit",
    title: "औचक निरीक्षण अनुशंसित – तिल्दा",
    desc: "पंजीकृत 180 बनाम AI सत्यापित 121 (33% गणना अंतर) · Ghost Cattle संदेह",
    time: "Yesterday",
    gaushalaId: "RPR-02",
    gaushalaName: "कामधेनु गौशाला, तिल्दा",
    status: "assigned",
    actionTaken: "जिला नोडल टीम असाइन"
  }
];

export const RFID_GATE_LOGS = [
  { id: "LOG-01", time: "17:51:24", tag: "IN9820-1187", direction: "IN", cowName: "गौरी (गीर)", gate: "Gate-01 (South)", status: "verified", confidence: 99.1 },
  { id: "LOG-02", time: "17:48:02", tag: "IN9820-4471", direction: "IN", cowName: "सुरभि (साहीवाल)", gate: "Gate-01 (South)", status: "verified", confidence: 98.4 },
  { id: "LOG-03", time: "17:35:10", tag: "IN9820-3320", direction: "IN", cowName: "नन्दिनी (देसी)", gate: "Gate-01 (South)", status: "verified", confidence: 97.8 },
  { id: "LOG-04", time: "06:43:18", tag: "IN9820-1187", direction: "OUT", cowName: "गौरी (गीर)", gate: "Gate-02 (Pasture)", status: "verified", confidence: 99.4 },
  { id: "LOG-05", time: "06:43:02", tag: "IN9820-2290", direction: "OUT", cowName: "लक्ष्मी (देसी)", gate: "Gate-02 (Pasture)", status: "missing", confidence: 98.2 },
  { id: "LOG-06", time: "06:42:15", tag: "IN9820-4471", direction: "OUT", cowName: "सुरभि (साहीवाल)", gate: "Gate-02 (Pasture)", status: "verified", confidence: 99.0 },
];

export const VET_HEALTH_RECORDS = [
  { id: "VET-01", tag: "IN9820-4471", breed: "साहीवाल", cowName: "सुरभि", condition: "लंगड़ापन (Lameness)", vet: "डॉ. ए. के. मिश्रा (B.V.Sc)", status: "उपचाराधीन", date: "2026-10-02", shed: "Shed-C", dosage: "Meloxicam + B-Complex", severity: "high" },
  { id: "VET-02", tag: "IN9820-3320", breed: "देसी", cowName: "नन्दिनी", condition: "हल्का बुखार एवं भूख की कमी", vet: "डॉ. ए. के. मिश्रा (B.V.Sc)", status: "निगरानी", date: "2026-10-03", shed: "Shed-A", dosage: "Paracetamol bolus", severity: "medium" },
  { id: "VET-03", tag: "IN9820-5512", breed: "गीर", cowName: "राधा", condition: "FMD नियमित टीकाकरण पूर्ण", vet: "डॉ. वी. के. पटेल", status: "स्वस्थ", date: "2026-09-28", shed: "Shed-B", dosage: "Raksha Ovac 2ml", severity: "low" },
  { id: "VET-04", tag: "IN9820-8809", breed: "थारपारकर", cowName: "गंगा", condition: "गर्भावस्था 7वाँ माह सामान्य", vet: "डॉ. वी. के. पटेल", status: "विशेष आहार", date: "2026-10-01", shed: "Shed-Maternity", dosage: "Mineral Mixture + Calup", severity: "low" }
];

export const WEIGHBRIDGE_LOGS = [
  { id: "WB-901", vehicleNo: "CG 04 AB 2381", driver: "मुकेश यादव", item: "हरा चारा (नेपियर घास)", grossWt: 8420, tareWt: 5180, netWt: 3240, billWt: 3240, diff: 0, status: "matched", time: "10:15 AM", vendor: "छत्तीसगढ़ चारा सहकारी समिति" },
  { id: "WB-900", vehicleNo: "CG 07 C 1145", driver: "संतोष साहू", item: "सूखा चारा (पैरा)", grossWt: 7100, tareWt: 4950, netWt: 2150, billWt: 2200, diff: -50, status: "warn", time: "08:30 AM", vendor: "कृषि उपज मंडी, आरंग" },
  { id: "WB-899", vehicleNo: "CG 04 M 8892", driver: "राजेश वर्मा", item: "दाना (संतुलित पशु आहार)", grossWt: 6500, tareWt: 5100, netWt: 1400, billWt: 1400, diff: 0, status: "matched", time: "कल शाम", vendor: "कामधेनु फीड्स प्रा. लि." }
];

export const ADOPTION_CANDIDATES = [
  {
    id: "COW-101",
    name: "गौरी (Gauri)",
    tag: "IN9820-1187",
    breed: "शुद्ध गीर (Gir)",
    age: "4.5 वर्ष",
    gaushala: "श्री कृष्ण गौशाला, आरंग",
    photo: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&auto=format&fit=crop&q=80",
    health: "100% स्वस्थ",
    milkPerDay: "12 ली. / दिन",
    temperament: "शांत एवं स्नेही",
    shed: "Shed-A (गीर अनुभाग)"
  },
  {
    id: "COW-102",
    name: "सुरभि (Surbhi)",
    tag: "IN9820-4471",
    breed: "साहीवाल (Sahiwal)",
    age: "6 वर्ष",
    gaushala: "श्री कृष्ण गौशाला, आरंग",
    photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=80",
    health: "उपचाराधीन (शीघ्र स्वस्थ)",
    milkPerDay: "रिटायर्ड / पूज्य नंदी-माता",
    temperament: "भोली एवं दुलारी",
    shed: "Shed-C (क्लीनिक)"
  },
  {
    id: "COW-103",
    name: "नन्दिनी (Nandini)",
    tag: "IN9820-3320",
    breed: "देसी बद्री (Indigenous)",
    age: "3 वर्ष",
    gaushala: "नंदी सेवा सदन, अभनपुर",
    photo: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500&auto=format&fit=crop&q=80",
    health: "100% स्वस्थ",
    milkPerDay: "6 ली. / दिन",
    temperament: "चंचल एवं सक्रिय",
    shed: "Shed-B (देसी संवर्धन)"
  },
  {
    id: "COW-104",
    name: "गोपाल (बछड़ा - Gopal)",
    tag: "IN9820-9014",
    breed: "थारपारकर (Tharparkar)",
    age: "9 माह",
    gaushala: "गोपाल गौशाला, दुर्ग",
    photo: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=500&auto=format&fit=crop&q=80",
    health: "100% स्वस्थ",
    milkPerDay: "शिशु बछड़ा",
    temperament: "अति चंचल",
    shed: "Shed-Calf (शिशु बाड़ा)"
  }
];

export const SUB_ADMINS_LIST = [
  { id: "SUB-01", name: "श्री आर. के. वर्मा", title: "उप-निदेशक (पशुपालन)", zone: "रायपुर ज़ोन", phone: "+91 94252 00192", gaushalaCount: 3, pendingAudits: 1, activeCases: 2 },
  { id: "SUB-02", name: "डॉ. प्रमोद कुमार साहू", title: "ज़िला नोडल अधिकारी", zone: "दुर्ग ज़ोन", phone: "+91 98261 55901", gaushalaCount: 1, pendingAudits: 0, activeCases: 0 },
  { id: "SUB-03", name: "श्रीमती मीनाक्षी देवांगन", title: "सहायक संचालक", zone: "बिलासपुर ज़ोन", phone: "+91 97554 99120", gaushalaCount: 1, pendingAudits: 1, activeCases: 1 },
  { id: "SUB-04", name: "श्री बलीराम कश्यप", title: "ज़ोनल को-ऑर्डिनेटर", zone: "बस्तर ज़ोन", phone: "+91 94060 11840", gaushalaCount: 1, pendingAudits: 0, activeCases: 1 }
];
