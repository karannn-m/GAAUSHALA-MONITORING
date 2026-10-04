import React from 'react';
import { ShieldCheck, CheckCircle2, Eye, Camera, Tag } from 'lucide-react';
import { ADOPTION_CANDIDATES } from '../../data/portalData';

export default function AdminPublic({ onOpenPhotoModal, onShowToast }) {
  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">सार्वजनिक गोवंश सत्यापन एवं पारदर्शी निरीक्षण (Public Cattle Registry)</h2>
          <p className="page-desc">
            नागरिक एवं सतर्कता पारदर्शिता — प्रत्येक गोवंश का डिजिटल इयर-टैग, स्वास्थ्य स्थिति एवं सीसीटीवी सत्यापन
          </p>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="dash-card" style={{ background: 'var(--badge-bg)', borderLeft: '4px solid var(--emerald)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '1.8rem' }}>🔍</div>
          <div>
            <b style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              सार्वजनिक गो-सेवा सत्यापन प्रणाली (100% Transparency)
            </b>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              गौशालाओं में पंजीकृत प्रत्येक गोवंश की जानकारी, नस्ल, दैनिक चारा एवं स्वास्थ्य रिपोर्ट जन-सामान्य के निरीक्षण हेतु उपलब्ध है।
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
                  ✓ {cow.health}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{cow.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    नस्ल: <b>{cow.breed}</b> • आयु: <b>{cow.age}</b>
                  </div>
                </div>
                <span className="status-badge ok">सत्यापित गोवंश</span>
              </div>

              <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6, fontSize: '0.8rem', marginTop: 10 }}>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>आवास / गौशाला:</span>
                  <b>{cow.gaushala}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>दूध / सेवा प्रकार:</span>
                  <b>{cow.milkPerDay}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>स्वभाव:</span>
                  <b>{cow.temperament}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>दैनिक चारा स्थिति:</span>
                  <b style={{ color: 'var(--emerald)' }}>प्रातः 08:20 AM दिया गया ✓</b>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                स्थिति: <b>नियमित रूप से सत्यापित</b>
              </div>
              <button
                className="btn-gov outline"
                onClick={() => {
                  onShowToast(`📸 ${cow.name} (${cow.tag}) का लाइव CCTV प्रमाण खोला जा रहा है`);
                  onOpenPhotoModal({ title: `${cow.name} (${cow.tag}) लाइव CCTV प्रमाण`, name: cow.name });
                }}
              >
                <Camera size={15} />
                CCTV प्रमाण देखें
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
