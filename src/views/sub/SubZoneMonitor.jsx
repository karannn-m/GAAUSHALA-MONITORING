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

      {/* Feed Stock / Requests & Geofence (Cow Outside Zone) Map */}
      <div className="grid-2col">
        <div className="dash-card">
          <div className="card-title-row">
            <h3>🚧 जियोफेंस अलर्ट (Cow Outside Zone)</h3>
            <span className="live-pulse-badge">लाइव ट्रैकिंग</span>
          </div>
          <div style={{ background: 'var(--navy-surface)', height: 200, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column' }}>
            <span style={{ fontSize: '2rem' }}>🗺️</span>
            <span style={{ marginTop: 8, fontSize: '0.85rem' }}>GPS + LoRaWAN सक्रिय नक्शा</span>
            <div style={{ marginTop: 12, fontSize: '0.75rem', background: 'rgba(255,0,0,0.2)', padding: '4px 10px', borderRadius: 4, border: '1px solid #ef4444' }}>
              🚨 गाय #2290 सीमा से 5km बाहर (तिल्दा)
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="card-title-row">
            <h3>🌾 चारा स्टॉक एवं अनुरोध कतार (Request Queue)</h3>
            <span className="status-badge warn">2 लंबित</span>
          </div>
          <div className="alert-feed-list">
            <div className="alert-feed-item warning">
              <div className="alert-feed-title">तिल्दा गौशाला - हरा चारा कमी (30% से नीचे)</div>
              <div className="alert-feed-meta">200 kg तत्काल आवश्यकता • अनुरोधकर्ता: राम कुमार (मैनेजर)</div>
              <button className="btn-gov emerald btn-sm" style={{ marginTop: 8 }} onClick={() => onShowToast('आपूर्ति स्वीकृत')}>स्वीकृत करें</button>
            </div>
            <div className="alert-feed-item info">
              <div className="alert-feed-title">अभनपुर गौशाला - सूखा चारा अनुरोध</div>
              <div className="alert-feed-meta">नियमित साप्ताहिक मांग • समीक्षाधीन</div>
              <button className="btn-gov outline btn-sm" style={{ marginTop: 8 }}>विवरण देखें</button>
            </div>
          </div>
        </div>
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn-gov saffron btn-sm" onClick={() => onShowToast(`📞 कॉलिंग ${g.name} कंट्रोल रूम...`)}>
                  📞 कॉल गौशाला
                </button>
                <span className={`status-badge ${g.status}`}>
                  {g.status === 'ok' ? 'सामान्य ✓' : g.status === 'warn' ? 'चेतावनी' : 'गंभीर अंतर'}
                </span>
              </div>
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
