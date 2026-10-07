import React, { useState } from 'react';
import KpiCard from '../../components/KpiCard';
import LiveCameraFeed from '../../components/LiveCameraFeed';
import { Radio, AlertCircle, Camera, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SubZoneMonitor({ gaushalas, onOpenPhotoModal, onShowToast }) {
  const { isHi } = useLanguage();
  const zoneGaushalas = gaushalas.filter((g) => g.zone === (isHi ? 'रायपुर ज़ोन' : 'Raipur Zone') || g.zone.includes('रायपुर') || g.zone.includes('Raipur'));
  const [isIrMode, setIsIrMode] = useState(false);

  const getBoxesForGaushala = (g) => {
    if (g.status === 'bad') {
      return [
        { x: 12, y: 45, w: 20, h: 32, label: isHi ? 'गाय #1187 (96%)' : 'Cow #1187 (96%)' },
        { x: 42, y: 50, w: 22, h: 30, label: isHi ? 'गाय #2290 (94%)' : 'Cow #2290 (94%)' },
        { x: 70, y: 38, w: 24, h: 36, tone: 'r', label: isHi ? '⚠️ गिरी हुई गाय #4471 (88%)' : '⚠️ Downed Cow #4471 (88%)' },
      ];
    }
    return [
      { x: 10, y: 45, w: 22, h: 35, label: isHi ? 'देसी गाय #1029 (98%)' : 'Desi Cow #1029 (98%)' },
      { x: 40, y: 48, w: 20, h: 32, label: isHi ? 'गीर गाय #8821 (95%)' : 'Gir Cow #8821 (95%)' },
      { x: 68, y: 42, w: 22, h: 34, label: isHi ? 'साहीवाल #4471 (97%)' : 'Sahiwal #4471 (97%)' },
    ];
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'ज़ोन लाइव मॉनिटर – रायपुर संभाग (Zone Command)' : 'Zone Live Monitor – Raipur Division (Command)'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'रायपुर ज़ोन की सभी गौशालाओं के सीसीटीवी, एआई डिटेक्शन एवं स्वचालित हेडकाउंट'
              : 'Real-time CCTV feeds, AI detection & automated headcount across Raipur Zone'}
          </p>
        </div>
        <button
          className={`btn-gov ${isIrMode ? 'emerald' : 'outline'}`}
          onClick={() => setIsIrMode(!isIrMode)}
        >
          🌙 {isIrMode ? (isHi ? 'नाइट-विज़न (IR) चालू' : 'Night Vision (IR) Active') : (isHi ? 'नाइट-विज़न (IR) चालू करें' : 'Enable Night Vision (IR)')}
        </button>
      </div>

      {/* Zone KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title={isHi ? "संबद्ध गौशालाएँ" : "Affiliated Gaushalas"}
          value="3"
          tone="blue"
          icon="🏛️"
          subtitle={isHi ? "आरंग, तिल्दा, अभनपुर" : "Arang, Tilda, Abhanpur"}
        />
        <KpiCard
          title={isHi ? "आज सत्यापित गोवंश" : "Verified Cattle Today"}
          value="419 / 486"
          change={isHi ? "86.2% हेडकाउंट पूर्ण" : "86.2% Headcount Complete"}
          tone="emerald"
          icon="🐄"
        />
        <KpiCard
          title={isHi ? "चारा आपूर्ति अलर्ट" : "Feed Supply Alert"}
          value={isHi ? "1 अलर्ट" : "1 Alert"}
          change={isHi ? "तिल्दा गौशाला नांद खाली" : "Tilda Gaushala Trough Empty"}
          tone="red"
          icon="⚠️"
        />
        <KpiCard
          title={isHi ? "लंबित औचक निरीक्षण" : "Pending Inspections"}
          value={isHi ? "2 स्थल" : "2 Sites"}
          tone="saffron"
          icon="🔍"
          subtitle={isHi ? "नोडल टीम तैनात" : "Nodal Team Deployed"}
        />
      </div>

      {/* Feed Stock / Requests & Geofence (Cow Outside Zone) Map */}
      <div className="grid-2col">
        <div className="dash-card">
          <div className="card-title-row">
            <h3>{isHi ? '🚧 जियोफेंस अलर्ट (Cow Outside Zone)' : '🚧 Geofence Alert (Cow Outside Zone)'}</h3>
            <span className="live-pulse-badge">{isHi ? 'लाइव ट्रैकिंग' : 'Live Tracking'}</span>
          </div>
          <div style={{ background: 'var(--navy-surface)', height: 200, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column' }}>
            <span style={{ fontSize: '2rem' }}>🗺️</span>
            <span style={{ marginTop: 8, fontSize: '0.85rem' }}>
              {isHi ? 'GPS + LoRaWAN सक्रिय नक्शा' : 'GPS + LoRaWAN Active Map'}
            </span>
            <div style={{ marginTop: 12, fontSize: '0.75rem', background: 'rgba(255,0,0,0.2)', padding: '4px 10px', borderRadius: 4, border: '1px solid #ef4444' }}>
              {isHi ? '🚨 गाय #2290 सीमा से 5km बाहर (तिल्दा)' : '🚨 Cow #2290 is 5km outside perimeter (Tilda)'}
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="card-title-row">
            <h3>{isHi ? '🌾 चारा स्टॉक एवं अनुरोध कतार (Request Queue)' : '🌾 Fodder Stock & Request Queue'}</h3>
            <span className="status-badge warn">{isHi ? '2 लंबित' : '2 Pending'}</span>
          </div>
          <div className="alert-feed-list">
            <div className="alert-feed-item warning">
              <div className="alert-feed-title">
                {isHi ? 'तिल्दा गौशाला - हरा चारा कमी (30% से नीचे)' : 'Tilda Gaushala - Green Fodder Low (<30%)'}
              </div>
              <div className="alert-feed-meta">
                {isHi
                  ? '200 kg तत्काल आवश्यकता • अनुरोधकर्ता: राम कुमार (मैनेजर)'
                  : '200 kg urgent requisition • Requested by: Ram Kumar (Manager)'}
              </div>
              <button
                className="btn-gov emerald btn-sm"
                style={{ marginTop: 8 }}
                onClick={() => onShowToast(isHi ? 'आपूर्ति स्वीकृत' : 'Supply Approved')}
              >
                {isHi ? 'स्वीकृत करें' : 'Approve'}
              </button>
            </div>
            <div className="alert-feed-item info">
              <div className="alert-feed-title">
                {isHi ? 'अभनपुर गौशाला - सूखा चारा अनुरोध' : 'Abhanpur Gaushala - Dry Fodder Requisition'}
              </div>
              <div className="alert-feed-meta">
                {isHi ? 'नियमित साप्ताहिक मांग • समीक्षाधीन' : 'Regular weekly demand • Under Review'}
              </div>
              <button className="btn-gov outline btn-sm" style={{ marginTop: 8 }}>
                {isHi ? 'विवरण देखें' : 'View Details'}
              </button>
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
                  {isHi ? 'कोड:' : 'Code:'} {g.id} • {isHi ? 'AI गणना:' : 'AI Count:'}{' '}
                  <b style={{ color: 'var(--emerald)' }}>{g.ver}</b> / {g.reg}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  className="btn-gov saffron btn-sm"
                  onClick={() =>
                    onShowToast(
                      isHi ? `📞 कॉलिंग ${g.name} कंट्रोल रूम...` : `📞 Calling ${g.name} Control Room...`
                    )
                  }
                >
                  {isHi ? '📞 कॉल गौशाला' : '📞 Call Shelter'}
                </button>
                <span className={`status-badge ${g.status}`}>
                  {g.status === 'ok'
                    ? (isHi ? 'सामान्य ✓' : 'Normal ✓')
                    : g.status === 'warn'
                    ? (isHi ? 'चेतावनी' : 'Warning')
                    : (isHi ? 'गंभीर अंतर' : 'Critical Mismatch')}
                </span>
              </div>
            </div>

            <LiveCameraFeed
              title={`CCTV Feed: ${g.name} (Shed-A & Gate)`}
              cameraCode={`${g.id}-CAM-01`}
              boxes={getBoxesForGaushala(g)}
              caption={
                isHi
                  ? `AI लाइव गणना: ${g.ver} गायें सत्यापित`
                  : `AI Live Count: ${g.ver} cows verified`
              }
              isIrMode={isIrMode}
              bgType={g.status === 'bad' ? 'trough' : 'shed'}
              onSnapshot={(data) => {
                onShowToast(
                  isHi
                    ? `📸 ${g.name} से फोटो प्रमाण कैप्चर किया गया`
                    : `📸 Captured photo proof from ${g.name}`
                );
                onOpenPhotoModal({ ...data, name: g.name });
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: '0.82rem' }}>
              <div>
                {isHi ? 'चारा नांद:' : 'Feed Trough:'}{' '}
                <b style={{ color: g.feedStatus === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>
                  {g.feedStatus === 'ok'
                    ? (isHi ? 'भरी हुई (8:20 AM)' : 'Full (8:20 AM)')
                    : (isHi ? 'खाली (9:00 AM अलर्ट)' : 'Empty (9:00 AM Alert)')}
                </b>
              </div>
              <button
                className="btn-gov outline btn-sm"
                onClick={() => onOpenPhotoModal({ name: g.name, id: g.id })}
              >
                {isHi ? '📷 फोटो-प्रमाण' : '📷 Photo Proof'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
