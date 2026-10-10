const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/gaushala_db'
});

const INITIAL_GAUSHALAS = [
  {
    id: "RPR-01", name: "श्री कृष्ण गौशाला, आरंग", district: "रायपुर", zone: "रायपुर ज़ोन", reg: 210, ver: 204, status: "ok", feedStatus: "ok", manager: "श्री रामनारायण वर्मा", contact: "+91 98261 44521", cctvCount: 6, rfidCoverage: "98.5%", lastAuditScore: 94, address: "वार्ड क्र. 04, आरंग महासमुंद रोड, रायपुर (छ.ग.)", bankDetails: { account: "50200034821903", ifsc: "HDFC0001928", bank: "HDFC Bank, Arang Branch" }, grantClaimed: 612000, grantApproved: 612000, cattleDistribution: { desi: 142, gir: 38, sahiwal: 24, calf: 6 }
  },
  {
    id: "RPR-02", name: "कामधेनु गौशाला, तिल्दा", district: "रायपुर", zone: "रायपुर ज़ोन", reg: 180, ver: 121, status: "bad", feedStatus: "bad", manager: "श्री सुरेश साहू", contact: "+91 94252 88210", cctvCount: 4, rfidCoverage: "67.2%", lastAuditScore: 58, address: "नेवरा मार्ग, तिल्दा, रायपुर (छ.ग.)", bankDetails: { account: "308492019401", ifsc: "SBIN0003891", bank: "State Bank of India, Tilda" }, grantClaimed: 540000, grantApproved: 0, cattleDistribution: { desi: 90, gir: 18, sahiwal: 13, calf: 0 }
  },
  {
    id: "RPR-03", name: "नंदी सेवा सदन, अभनपुर", district: "रायपुर", zone: "रायपुर ज़ोन", reg: 96, ver: 94, status: "ok", feedStatus: "ok", manager: "श्रीमती सुनीता देवांगन", contact: "+91 97554 11209", cctvCount: 4, rfidCoverage: "97.9%", lastAuditScore: 96, address: "गोबरा नवापारा बाईपास, अभनपुर, रायपुर (छ.ग.)", bankDetails: { account: "18930100004921", ifsc: "PUNB0189300", bank: "Punjab National Bank, Abhanpur" }, grantClaimed: 288000, grantApproved: 282000, cattleDistribution: { desi: 68, gir: 16, sahiwal: 10, calf: 2 }
  }
];

const INITIAL_ALERTS = [
  { id: "ALT-101", type: "critical", category: "feed", title: "चारा नहीं मिला – कामधेनु गौशाला, तिल्दा", titleHi: "चारा नहीं मिला – कामधेनु गौशाला, तिल्दा", titleEn: "Fodder Not Served – Kamdhenu Gaushala, Tilda", desc: "सुबह 9:00 तक मुख्य नांद खाली दर्ज की गई · AI Feed Vision Analysis", descHi: "सुबह 9:00 तक मुख्य नांद खाली दर्ज की गई · AI Feed Vision Analysis", descEn: "Main feed trough detected empty past 9:00 AM · AI Feed Vision Analysis", gaushalaId: 2, status: "pending" },
  { id: "ALT-102", type: "critical", category: "health", title: "गिरी हुई गाय (Tag #4471) – बिलासपुर", titleHi: "गिरी हुई गाय (Tag #4471) – बिलासपुर", titleEn: "Downed Cow Recumbency Alert (Tag #4471) – Bilaspur", desc: "Shed-B में पिछले 5 घंटे से गाय स्थिर/लेटी अवस्था में पाई गई", descHi: "Shed-B में पिछले 5 घंटे से गाय स्थिर/लेटी अवस्था में पाई गई", descEn: "Cow immobilized/lying down for over 5 hours in Shed-B", gaushalaId: 3, status: "pending" }
];

const VET_HEALTH_RECORDS = [
  { tag: "IN9820-4471", breed: "साहीवाल", breedHi: "साहीवाल", breedEn: "Sahiwal", cowName: "सुरभि", cowNameHi: "सुरभि", cowNameEn: "Surbhi", condition: "लंगड़ापन (Lameness)", conditionHi: "लंगड़ापन (Lameness)", conditionEn: "Lameness (Joint Swelling)", vet: "डॉ. ए. के. मिश्रा (B.V.Sc)", status: "उपचाराधीन", date: "2026-10-02", shed: "Shed-C", dosage: "Meloxicam + B-Complex", severity: "high" },
  { tag: "IN9820-3320", breed: "देसी", breedHi: "देसी", breedEn: "Indigenous (Desi)", cowName: "नन्दिनी", cowNameHi: "नन्दिनी", cowNameEn: "Nandini", condition: "हल्का बुखार एवं भूख की कमी", conditionHi: "हल्का बुखार एवं भूख की कमी", conditionEn: "Mild fever & anorexia", vet: "डॉ. ए. के. मिश्रा (B.V.Sc)", status: "निगरानी", date: "2026-10-03", shed: "Shed-A", dosage: "Paracetamol bolus", severity: "medium" }
];

const SUB_ADMINS_LIST = [
  { name: "श्री आर. के. वर्मा", title: "उप-निदेशक (पशुपालन)", zone: "रायपुर ज़ोन", phone: "+91 94252 00192" },
  { name: "डॉ. प्रमोद कुमार साहू", title: "ज़िला नोडल अधिकारी", zone: "दुर्ग ज़ोन", phone: "+91 98261 55901" }
];

async function seed() {
  try {
    await pool.query('BEGIN');
    
    // Seed Users (Sub Admins)
    for (const admin of SUB_ADMINS_LIST) {
      await pool.query(`
        INSERT INTO users (username, password_hash, role, zone, name, title, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [admin.phone, 'hashed_pass', 'SUB_ADMIN', admin.zone, admin.name, admin.title, admin.phone]);
    }

    // Seed Gaushalas
    for (const g of INITIAL_GAUSHALAS) {
      await pool.query(`
        INSERT INTO gaushalas (code, name, district, zone, reg, ver, status, feed_status, manager, contact, cctv_count, rfid_coverage, last_audit_score, address, bank_details, grant_claimed, grant_approved, cattle_distribution)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (code) DO NOTHING
      `, [g.id, g.name, g.district, g.zone, g.reg, g.ver, g.status, g.feedStatus, g.manager, g.contact, g.cctvCount, g.rfidCoverage, g.lastAuditScore, g.address, g.bankDetails, g.grantClaimed, g.grantApproved, g.cattleDistribution]);
    }

    // Seed Alerts
    for (const a of INITIAL_ALERTS) {
      await pool.query(`
        INSERT INTO alerts (alert_code, gaushala_id, type, category, title, title_hi, title_en, description, desc_hi, desc_en, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (alert_code) DO NOTHING
      `, [a.id, a.gaushalaId, a.type, a.category, a.title, a.titleHi, a.titleEn, a.desc, a.descHi, a.descEn, a.status]);
    }

    // Seed Health Records
    for (const h of VET_HEALTH_RECORDS) {
      await pool.query(`
        INSERT INTO health_records (tag, breed, breed_hi, breed_en, cow_name, cow_name_hi, cow_name_en, condition, condition_hi, condition_en, vet, status, date, shed, dosage, severity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [h.tag, h.breed, h.breedHi, h.breedEn, h.cowName, h.cowNameHi, h.cowNameEn, h.condition, h.conditionHi, h.conditionEn, h.vet, h.status, h.date, h.shed, h.dosage, h.severity]);
    }

    await pool.query('COMMIT');
    console.log("Seeding complete!");
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Seeding failed:", err);
  } finally {
    pool.end();
  }
}

seed();
