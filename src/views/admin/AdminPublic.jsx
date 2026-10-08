import React from 'react';
import { ShieldCheck, CheckCircle2, Eye, Camera, Tag } from 'lucide-react';
import { ADOPTION_CANDIDATES } from '../../data/portalData';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminPublic({ onOpenPhotoModal, onShowToast }) {
  const { isHi } = useLanguage();

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi
              ? 'सार्वजनिक गोवंश सत्यापन एवं पारदर्शी निरीक्षण (Public Cattle Registry)'
              : 'Public Cattle Registry & Verification'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'नागरिक एवं सतर्कता पारदर्शिता — प्रत्येक गोवंश का डिजिटल इयर-टैग, स्वास्थ्य स्थिति एवं सीसीटीवी सत्यापन'
              : 'Citizen & Vigilance Transparency — Digital ear-tag, health status & CCTV verification for every cow'}
          </p>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="dash-card" style={{ background: 'var(--badge-bg)', borderLeft: '4px solid var(--emerald)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '1.8rem' }}>🔍</div>
          <div>
            <b style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              {isHi ? 'सार्वजनिक गो-सेवा सत्यापन प्रणाली (100% Transparency)' : 'Public Cattle Care Verification (100% Transparency)'}
            </b>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isHi
                ? 'गौशालाओं में पंजीकृत प्रत्येक गोवंश की जानकारी, नस्ल, दैनिक चारा एवं स्वास्थ्य रिपोर्ट जन-सामान्य के निरीक्षण हेतु उपलब्ध है।'
                : 'Details, breed, daily ration, and veterinary records of all registered cattle are openly accessible for public inspection.'}
            </p>
          </div>
        </div>
      </div>

      {/* Cattle Registry Cards Grid */}
      <div className="grid-2col">
        {ADOPTION_CANDIDATES.map((cow) => (
          <div key={cow.id} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ position: 'relative', height: 180, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                <img
                  src={cow.photo}
                  alt={cow.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  RFID: {cow.tag}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    background: '#15803d',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  ✓ {isHi ? cow.health : (cow.health === 'स्वस्थ' ? 'Healthy' : cow.health)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{cow.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {isHi ? 'नस्ल' : 'Breed'}: <b>{cow.breed}</b> • {isHi ? 'आयु' : 'Age'}: <b>{cow.age}</b>
                  </div>
                </div>
                <span className="status-badge ok">
                  {isHi ? 'सत्यापित गोवंश' : 'Verified Cattle'}
                </span>
              </div>

              <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6, fontSize: '0.8rem', marginTop: 10 }}>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>{isHi ? 'आवास / गौशाला:' : 'Shelter / Gaushala:'}</span>
                  <b>{cow.gaushala}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>{isHi ? 'दूध / सेवा प्रकार:' : 'Milk / Service Type:'}</span>
                  <b>{cow.milkPerDay}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>{isHi ? 'स्वभाव:' : 'Temperament:'}</span>
                  <b>{cow.temperament}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>{isHi ? 'दैनिक चारा स्थिति:' : 'Daily Feed Status:'}</span>
                  <b style={{ color: 'var(--emerald)' }}>
                    {isHi ? 'प्रातः 08:20 AM दिया गया ✓' : 'Served at 08:20 AM ✓'}
                  </b>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isHi ? 'स्थिति:' : 'Status:'} <b>{isHi ? 'नियमित रूप से सत्यापित' : 'Regularly Verified'}</b>
              </div>
              <button
                className="btn-gov outline"
                onClick={() => {
                  onShowToast(
                    isHi
                      ? `📸 ${cow.name} (${cow.tag}) का लाइव CCTV प्रमाण खोला जा रहा है`
                      : `📸 Opening live CCTV proof for ${cow.name} (${cow.tag})`
                  );
                  onOpenPhotoModal({
                    title: isHi
                      ? `${cow.name} (${cow.tag}) लाइव CCTV प्रमाण`
                      : `${cow.name} (${cow.tag}) Live CCTV Proof`,
                    name: cow.name
                  });
                }}
              >
                <Camera size={15} />
                {isHi ? 'CCTV प्रमाण देखें' : 'View CCTV Proof'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
