import React from 'react';
import { Tag, MapPin, Radio, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { RFID_GATE_LOGS } from '../../data/portalData';

export default function ManagerGateRFID({ onOpenPhotoModal, onShowToast }) {
  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">RFID गेट एवं झुंड ट्रैकिंग (Gate & Herd Tracking)</h2>
          <p className="page-desc">
            Passive UHF RFID इयर-टैग + लॉन्ग-रेंज गेट रीडर + LoRaWAN झुंड ट्रैकिंग नेटवर्क
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Gate Entry / Exit Logs */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Tag size={18} color="var(--saffron)" />
              RFID गेट लॉग्स (लाइव प्रविष्टियाँ)
            </h3>
            <span className="live-pulse-badge">रीडर सक्रिय</span>
          </div>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>समय</th>
                  <th>इयर-टैग ID</th>
                  <th>गाय का नाम / नस्ल</th>
                  <th>दिशा (Direction)</th>
                  <th>सटीकता</th>
                  <th>फोटो</th>
                </tr>
              </thead>
              <tbody>
                {RFID_GATE_LOGS.map((log) => (
                  <tr key={log.id}>
                    <td><b style={{ fontFamily: 'var(--font-mono)' }}>{log.time}</b></td>
                    <td><b style={{ color: 'var(--saffron)' }}>{log.tag}</b></td>
                    <td>{log.cowName}</td>
                    <td>
                      <span className={`status-badge ${log.direction === 'IN' ? 'ok' : 'warn'}`}>
                        {log.direction === 'IN' ? '⬇️ अंदर (IN)' : '⬆️ बाहर (चराई)'}
                      </span>
                    </td>
                    <td>{log.confidence}%</td>
                    <td>
                      <button
                        className="btn-gov outline btn-sm"
                        style={{ padding: '2px 6px' }}
                        onClick={() => onOpenPhotoModal({ title: `${log.cowName} (${log.tag}) गेट एंट्री`, name: log.cowName })}
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
              मिसिंग गाय अलर्ट एवं GPS चराई ट्रैकर
            </h3>
          </div>

          {/* Missing Cow Alert Box */}
          <div className="alert-feed-item critical" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} color="var(--red-alert)" />
              <b>गाय वापस नहीं लौटी – Missing Cow Alert (Tag IN9820-2290)</b>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
              शाम 6:00 बजे की वापसी समय-सीमा के बाद भी गेट रीडर पर स्कैन दर्ज नहीं हुआ।
            </p>
          </div>

          {/* Telemetry info */}
          <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, fontSize: '0.82rem', marginBottom: 12 }}>
            <div className="stock-bar-row" style={{ padding: '4px 0' }}>
              <span>अभी बाहर चराई क्षेत्र में:</span>
              <b style={{ color: 'var(--amber-warn)' }}>14 गायें</b>
            </div>
            <div className="stock-bar-row" style={{ padding: '4px 0' }}>
              <span>LoRaWAN झुंड-ट्रैकर (Alpha Cow Collar):</span>
              <b style={{ color: 'var(--emerald)' }}>सक्रिय • बैटरी 82%</b>
            </div>
            <div className="stock-bar-row" style={{ padding: '4px 0' }}>
              <span>अंतिम ज्ञात GPS लोकेशन:</span>
              <b>आरंग पूर्वी चरागाह (21.196° N, 81.974° E)</b>
            </div>
          </div>

          {/* Simulated GPS Pasture Map */}
          <div style={{ position: 'relative', background: '#0f172a', borderRadius: 8, padding: 12, border: '1px solid #334155' }}>
            <svg viewBox="0 0 320 130" style={{ width: '100%', height: 'auto' }}>
              {/* Field boundary path */}
              <polygon points="10,20 180,10 300,50 280,115 40,120" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Herd Trail */}
              <path
                d="M 30 100 Q 100 40 180 75 T 280 40"
                fill="none"
                stroke="var(--saffron)"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />
              {/* Pasture grass icons */}
              <text x="70" y="80" fill="#22c55e" fontSize="12">🌾</text>
              <text x="140" y="45" fill="#22c55e" fontSize="12">🌾</text>
              <text x="210" y="90" fill="#22c55e" fontSize="12">🌾</text>

              {/* Gaushala Gate (Origin) */}
              <circle cx="30" cy="100" r="6" fill="#3b82f6" />
              <text x="30" y="118" fill="#94a3b8" fontSize="9" textAnchor="middle">गौशाला गेट</text>

              {/* Missing Cow Ping */}
              <circle cx="280" cy="40" r="7" fill="#ef4444">
                <animate attributeName="r" values="5;14;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="280" cy="40" r="5" fill="#dc2626" />
              <text x="270" y="28" fill="#fca5a5" fontSize="9" fontWeight="700" textAnchor="middle">
                Tag #2290 यहाँ स्थित
              </text>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                📍 GPS लाइव लोकेशन – चरवाहा एवं लीडर गाय कॉलर
              </span>
              <button
                className="btn-gov saffron btn-sm"
                onClick={() => onShowToast('📢 चरवाहा टीम को सायरन एवं एसएमएस लोकेशन प्रेषित की गई')}
              >
                चरवाहा टीम को सूचित करें
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
