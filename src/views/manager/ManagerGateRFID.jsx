import React from 'react';
import { Tag, MapPin, Radio, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { RFID_GATE_LOGS } from '../../data/portalData';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagerGateRFID({ onOpenPhotoModal, onShowToast }) {
  const { isHi } = useLanguage();

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'RFID गेट एवं झुंड ट्रैकिंग (Gate & Herd Tracking)' : 'RFID Gate & Herd Tracking'}
          </h2>
        </div>
      </div>

      <div className="grid-2col">
        {/* Gate Entry / Exit Logs */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Tag size={18} color="var(--saffron)" />
              {isHi ? 'RFID गेट लॉग्स (लाइव प्रविष्टियाँ)' : 'RFID Gate Logs (Live Entries)'}
            </h3>
            <span className="live-pulse-badge">{isHi ? 'रीडर सक्रिय' : 'Reader Active'}</span>
          </div>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{isHi ? 'समय' : 'Time'}</th>
                  <th>{isHi ? 'इयर-टैग ID' : 'Ear-Tag ID'}</th>
                  <th>{isHi ? 'गाय का नाम / नस्ल' : 'Cattle Name / Breed'}</th>
                  <th>{isHi ? 'दिशा (Direction)' : 'Direction'}</th>
                  <th>{isHi ? 'सटीकता' : 'Confidence'}</th>
                  <th>{isHi ? 'फोटो' : 'Photo'}</th>
                </tr>
              </thead>
              <tbody>
                {RFID_GATE_LOGS.map((log) => (
                  <tr key={log.id}>
                    <td><b style={{ fontFamily: 'var(--font-mono)' }}>{log.time}</b></td>
                    <td><b style={{ color: 'var(--saffron)' }}>{log.tag}</b></td>
                    <td>{isHi ? (log.cowNameHi || log.cowName) : (log.cowNameEn || log.cowName)}</td>
                    <td>
                      <span className={`status-badge ${log.direction === 'IN' ? 'ok' : 'warn'}`}>
                        {log.direction === 'IN' ? (isHi ? '⬇️ अंदर (IN)' : '⬇️ In (Inside)') : (isHi ? '⬆️ बाहर (चराई)' : '⬆️ Out (Grazing)')}
                      </span>
                    </td>
                    <td>{log.confidence}%</td>
                    <td>
                      <button
                        className="btn-gov outline btn-sm"
                        style={{ padding: '2px 6px' }}
                        onClick={() => onOpenPhotoModal({
                          title: `${isHi ? (log.cowNameHi || log.cowName) : (log.cowNameEn || log.cowName)} (${log.tag}) ${isHi ? 'गेट एंट्री' : 'Gate Entry'}`,
                          name: isHi ? (log.cowNameHi || log.cowName) : (log.cowNameEn || log.cowName)
                        })}
                      >
                        📷
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Missing Cow Alert & GPS Herd Tracker */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Radio size={18} color="var(--red-alert)" />
              {isHi ? 'मिसिंग गाय अलर्ट एवं GPS चराई ट्रैकर' : 'Missing Cow Alert & GPS Pasture Tracker'}
            </h3>
          </div>

          {/* Missing Cow Alert Box */}
          <div className="alert-feed-item critical" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} color="var(--red-alert)" />
              <b>{isHi ? 'गाय वापस नहीं लौटी – Missing Cow Alert (Tag IN9820-2290)' : 'Cattle not returned – Missing Cow Alert (Tag IN9820-2290)'}</b>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
              {isHi
                ? 'शाम 6:00 बजे की वापसी समय-सीमा के बाद भी गेट रीडर पर स्कैन दर्ज नहीं हुआ।'
                : 'No RFID scan recorded at gate reader past the 6:00 PM return deadline.'}
            </p>
          </div>

          {/* Telemetry info */}
          <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, fontSize: '0.82rem', marginBottom: 12 }}>
            <div className="stock-bar-row" style={{ padding: '4px 0' }}>
              <span>{isHi ? 'अभी बाहर चराई क्षेत्र में:' : 'Currently out in pasture:'}</span>
              <b style={{ color: 'var(--amber-warn)' }}>14 {isHi ? 'गायें' : 'cattle'}</b>
            </div>
            <div className="stock-bar-row" style={{ padding: '4px 0' }}>
              <span>{isHi ? 'LoRaWAN झुंड-ट्रैकर (Alpha Cow Collar):' : 'LoRaWAN Herd Tracker (Alpha Collar):'}</span>
              <b style={{ color: 'var(--emerald)' }}>{isHi ? 'सक्रिय • बैटरी 82%' : 'Active • Battery 82%'}</b>
            </div>
            <div className="stock-bar-row" style={{ padding: '4px 0' }}>
              <span>{isHi ? 'अंतिम ज्ञात GPS लोकेशन:' : 'Last Known GPS Location:'}</span>
              <b>{isHi ? 'आरंग पूर्वी चरागाह (21.196° N, 81.974° E)' : 'Arang East Pasture (21.196° N, 81.974° E)'}</b>
            </div>
          </div>

          {/* Simulated GPS Pasture Map */}
          <div style={{ position: 'relative', background: '#0f172a', borderRadius: 8, padding: 12, border: '1px solid #334155' }}>
            <svg viewBox="0 0 320 130" style={{ width: '100%', height: 'auto' }}>
              <polygon points="10,20 180,10 300,50 280,115 40,120" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <path
                d="M 30 100 Q 100 40 180 75 T 280 40"
                fill="none"
                stroke="var(--saffron)"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />
              <text x="70" y="80" fill="#22c55e" fontSize="12">🌾</text>
              <text x="140" y="45" fill="#22c55e" fontSize="12">🌾</text>
              <text x="210" y="90" fill="#22c55e" fontSize="12">🌾</text>

              <circle cx="30" cy="100" r="6" fill="#3b82f6" />
              <text x="30" y="118" fill="#94a3b8" fontSize="9" textAnchor="middle">
                {isHi ? 'गौशाला गेट' : 'Gaushala Gate'}
              </text>

              <circle cx="280" cy="40" r="7" fill="#ef4444">
                <animate attributeName="r" values="5;14;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="280" cy="40" r="5" fill="#dc2626" />
              <text x="270" y="28" fill="#fca5a5" fontSize="9" fontWeight="700" textAnchor="middle">
                {isHi ? 'Tag #2290 यहाँ स्थित' : 'Tag #2290 Located Here'}
              </text>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                📍 {isHi ? 'GPS लाइव लोकेशन – चरवाहा एवं लीडर गाय कॉलर' : 'GPS Live Location – Herder & Leader Cow Collar'}
              </span>
              <button
                className="btn-gov saffron btn-sm"
                onClick={() => onShowToast(isHi ? '📢 चरवाहा टीम को सायरन एवं एसएमएस लोकेशन प्रेषित की गई' : '📢 Herder team alerted with SMS location')}
              >
                {isHi ? 'चरवाहा टीम को सूचित करें' : 'Alert Herder Team'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
