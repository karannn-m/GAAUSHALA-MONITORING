import React, { useState } from 'react';
import KpiCard from '../../components/KpiCard';
import LiveCameraFeed from '../../components/LiveCameraFeed';
import { Radio, AlertCircle, Camera, CheckCircle2 } from 'lucide-react';

export default function SubZoneMonitor({ gaushalas, onOpenPhotoModal, onShowToast }) {
  const zoneGaushalas = gaushalas.filter((g) => g.zone === 'रायपुर ज़ोन');
  const [isIrMode, setIsIrMode] = useState(false);

  const getBoxesForGaushala = (g) => {
    if (g.status === 'bad') {
      return [
        { x: 12, y: 45, w: 20, h: 32, label: 'गाय #1187 (96%)' },
        { x: 42, y: 50, w: 22, h: 30, label: 'गाय #2290 (94%)' },
        { x: 70, y: 38, w: 24, h: 36, tone: 'r', label: '⚠️ गिरी हुई गाय #4471 (88%)' },
      ];
    }
    return [
      { x: 10, y: 45, w: 22, h: 35, label: 'देसी गाय #1029 (98%)' },
      { x: 40, y: 48, w: 20, h: 32, label: 'गीर गाय #8821 (95%)' },
      { x: 68, y: 42, w: 22, h: 34, label: 'साहीवाल #4471 (97%)' },
    ];
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">ज़ोन लाइव मॉनिटर – रायपुर संभाग (Zone Command)</h2>
          <p className="page-desc">
            रायपुर ज़ोन की सभी गौशालाओं के सीसीटीवी, एआई डिटेक्शन एवं स्वचालित हेडकाउंट
          </p>
        </div>
        <button
          className={`btn-gov ${isIrMode ? 'emerald' : 'outline'}`}
          onClick={() => setIsIrMode(!isIrMode)}
        >
          🌙 {isIrMode ? 'नाइट-विज़न (IR) चालू' : 'नाइट-विज़न (IR) चालू करें'}
        </button>
      </div>

      {/* Zone KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title="संबद्ध गौशालाएँ"
          value="3"
          tone="blue"
          icon="🏛️"
          subtitle="आरंग, तिल्दा, अभनपुर"
        />
        <KpiCard
          title="आज सत्यापित गोवंश"
          value="419 / 486"
          change="86.2% हेडकाउंट पूर्ण"
          tone="emerald"
          icon="🐄"
        />
        <KpiCard
          title="चारा आपूर्ति अलर्ट"
          value="1 अलर्ट"
          change="तिल्दा गौशाला नांद खाली"
          tone="red"
          icon="⚠️"
        />
        <KpiCard
          title="लंबित औचक निरीक्षण"
          value="2 स्थल"
          tone="saffron"
          icon="🔍"
          subtitle="नोडल टीम तैनात"
        />
      </div>

      {/* Live Camera Feeds per Gaushala */}
      <div className="grid-2col">
        {zoneGaushalas.map((g) => (
          <div key={g.id} className="dash-card">
            <div className="card-title-row">
              <div>
                <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{g.name}</b>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  कोड: {g.id} • AI गणना: <b style={{ color: 'var(--emerald)' }}>{g.ver}</b> / {g.reg}
                </div>
              </div>
              <span className={`status-badge ${g.status}`}>
                {g.status === 'ok' ? 'सामान्य ✓' : g.status === 'warn' ? 'चेतावनी' : 'गंभीर अंतर'}
              </span>
            </div>

            <LiveCameraFeed
              title={`CCTV Feed: ${g.name} (Shed-A & Gate)`}
              cameraCode={`${g.id}-CAM-01`}
              boxes={getBoxesForGaushala(g)}
              caption={`AI लाइव गणना: ${g.ver} गायें सत्यापित`}
              isIrMode={isIrMode}
              bgType={g.status === 'bad' ? 'trough' : 'shed'}
              onSnapshot={(data) => {
                onShowToast(`📸 ${g.name} से फोटो प्रमाण कैप्चर किया गया`);
                onOpenPhotoModal({ ...data, name: g.name });
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: '0.82rem' }}>
              <div>
                चारा नांद: <b style={{ color: g.feedStatus === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>
                  {g.feedStatus === 'ok' ? 'भरी हुई (8:20 AM)' : 'खाली (9:00 AM अलर्ट)'}
                </b>
              </div>
              <button
                className="btn-gov outline btn-sm"
                onClick={() => onOpenPhotoModal({ name: g.name, id: g.id })}
              >
                📷 फोटो-प्रमाण
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
