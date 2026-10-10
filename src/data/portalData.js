export const INITIAL_GAUSHALAS = [];

export const INITIAL_ALERTS = [];

export const RFID_GATE_LOGS = [
  { id: "LOG-01", time: "17:51:24", tag: "IN9820-1187", direction: "IN", cowName: "गौरी (गीर)", cowNameHi: "गौरी (गीर)", cowNameEn: "Gauri (Gir)", gate: "Gate-01 (South)", status: "verified", confidence: 99.1 },
  { id: "LOG-02", time: "17:48:02", tag: "IN9820-4471", direction: "IN", cowName: "सुरभि (साहीवाल)", cowNameHi: "सुरभि (साहीवाल)", cowNameEn: "Surbhi (Sahiwal)", gate: "Gate-01 (South)", status: "verified", confidence: 98.4 },
  { id: "LOG-03", time: "17:35:10", tag: "IN9820-3320", direction: "IN", cowName: "नन्दिनी (देसी)", cowNameHi: "नन्दिनी (देसी)", cowNameEn: "Nandini (Desi)", gate: "Gate-01 (South)", status: "verified", confidence: 97.8 },
  { id: "LOG-04", time: "06:43:18", tag: "IN9820-1187", direction: "OUT", cowName: "गौरी (गीर)", cowNameHi: "गौरी (गीर)", cowNameEn: "Gauri (Gir)", gate: "Gate-02 (Pasture)", status: "verified", confidence: 99.4 },
  { id: "LOG-05", time: "06:43:02", tag: "IN9820-2290", direction: "OUT", cowName: "लक्ष्मी (देसी)", cowNameHi: "लक्ष्मी (देसी)", cowNameEn: "Lakshmi (Desi)", gate: "Gate-02 (Pasture)", status: "missing", confidence: 98.2 },
  { id: "LOG-06", time: "06:42:15", tag: "IN9820-4471", direction: "OUT", cowName: "सुरभि (साहीवाल)", cowNameHi: "सुरभि (साहीवाल)", cowNameEn: "Surbhi (Sahiwal)", gate: "Gate-02 (Pasture)", status: "verified", confidence: 99.0 },
];

export const VET_HEALTH_RECORDS = [];

export const WEIGHBRIDGE_LOGS = [
  { id: "WB-901", vehicleNo: "CG 04 AB 2381", driver: "मुकेश यादव", driverHi: "मुकेश यादव", driverEn: "Mukesh Yadav", item: "हरा चारा (नेपियर घास)", itemHi: "हरा चारा (नेपियर घास)", itemEn: "Green Fodder (Napier)", grossWt: 8420, tareWt: 5180, netWt: 3240, billWt: 3240, diff: 0, status: "matched", time: "10:15 AM", vendor: "छत्तीसगढ़ चारा सहकारी समिति", vendorHi: "छत्तीसगढ़ चारा सहकारी समिति", vendorEn: "CG Fodder Cooperative Society" },
  { id: "WB-900", vehicleNo: "CG 07 C 1145", driver: "संतोष साहू", driverHi: "संतोष साहू", driverEn: "Santosh Sahu", item: "सूखा चारा (पैरा)", itemHi: "सूखा चारा (पैरा)", itemEn: "Dry Fodder (Straw)", grossWt: 7100, tareWt: 4950, netWt: 2150, billWt: 2200, diff: -50, status: "warn", time: "08:30 AM", vendor: "कृषि उपज मंडी, आरंग", vendorHi: "कृषि उपज मंडी, आरंग", vendorEn: "Krishi Upaj Mandi, Arang" },
  { id: "WB-899", vehicleNo: "CG 04 M 8892", driver: "राजेश वर्मा", driverHi: "राजेश वर्मा", driverEn: "Rajesh Verma", item: "दाना (संतुलित पशु आहार)", itemHi: "दाना (संतुलित पशु आहार)", itemEn: "Cattle Feed Concentrate", grossWt: 6500, tareWt: 5100, netWt: 1400, billWt: 1400, diff: 0, status: "matched", time: "कल शाम", vendor: "कामधेनु फीड्स प्रा. लि.", vendorHi: "कामधेनु फीड्स प्रा. लि.", vendorEn: "Kamdhenu Feeds Pvt Ltd" }
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

export const SUB_ADMINS_LIST = [];
