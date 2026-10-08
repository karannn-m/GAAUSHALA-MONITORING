import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle, Truck, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminAudit({ gaushalas, onOpenAuditModal }) {
  const { isHi } = useLanguage();

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'AI स्वचालित ऑडिट एवं सतर्कता (Automated AI Audit)' : 'Automated AI Audit & Compliance'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'Ghost Cattle, चारा खपत, धर्मकाँटा तौल-पर्ची एवं ANPR वाहन कैमरों का 100% स्वचालित मिलान'
              : 'Automated 100% cross-validation for ghost cattle, fodder usage, weighbridge slips & ANPR vehicle cameras'}
          </p>
        </div>
      </div>

      {/* Grid of Audit Cards */}
      <div className="grid-2col">
        {gaushalas.map((item) => {
          const diff = item.reg - item.ver;
          const diffPct = Math.round((diff / item.reg) * 100);
          const hasGhostCattleRisk = diff > 20;

          return (
            <div key={item.id} className="dash-card">
              <div className="card-title-row">
                <div>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {isHi ? 'कोड' : 'Code'}: {item.id} • {item.district}
                  </span>
                </div>
                <span className={`status-badge ${item.status}`}>
                  {item.status === 'ok'
                    ? (isHi ? 'ऑडिट पास (94%)' : 'Audit Passed (94%)')
                    : item.status === 'warn'
                    ? (isHi ? 'समीक्षाधीन' : 'Under Review')
                    : (isHi ? 'गंभीर विचलन' : 'Severe Discrepancy')}
                </span>
              </div>

              {/* Headcount match meter */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                  <span>{isHi ? 'AI Headcount मिलान:' : 'AI Headcount Match:'}</span>
                  <b style={{ color: hasGhostCattleRisk ? 'var(--red-alert)' : 'var(--emerald)' }}>
                    {item.ver} / {item.reg} {isHi ? 'गायें' : 'cattle'} ({100 - diffPct}%)
                  </b>
                </div>
                <div className="stock-bar-track">
                  <div
                    className="stock-bar-fill"
                    style={{
                      width: `${100 - diffPct}%`,
                      background: hasGhostCattleRisk ? 'var(--red-alert)' : 'var(--emerald)'
                    }}
                  />
                </div>
              </div>

              {/* Multi-tier checks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem' }}>
                <div className="stock-bar-row" style={{ padding: '6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Truck size={14} color="var(--saffron)" />
                    {isHi ? 'चारा बिल बनाम तौल पर्ची (धर्मकाँटा):' : 'Fodder Bill vs Weighbridge Slip:'}
                  </span>
                  <b style={{ color: item.status === 'bad' ? 'var(--red-alert)' : 'var(--emerald)' }}>
                    {item.status === 'bad'
                      ? (isHi ? '18% वजन अंतर (संदेहास्पद)' : '18% weight variance (suspicious)')
                      : (isHi ? '100% पर्ची मिलान ✓' : '100% Slip Match ✓')}
                  </b>
                </div>

                <div className="stock-bar-row" style={{ padding: '6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Camera size={14} color="var(--emerald)" />
                    {isHi ? 'ANPR वाहन नंबर प्लेट CCTV मिलान:' : 'ANPR Vehicle Plate CCTV Match:'}
                  </span>
                  <b style={{ color: 'var(--emerald)' }}>
                    CG 04 AB 2381 ✓ {isHi ? 'सत्यापित' : 'Verified'}
                  </b>
                </div>

                <div className="stock-bar-row" style={{ padding: '6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} color="#0284c7" />
                    {isHi ? 'RFID इयर-टैग सक्रियता:' : 'RFID Ear-Tag Active Rate:'}
                  </span>
                  <b>{item.rfidCoverage || '98.5%'}</b>
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  className="btn-gov saffron btn-sm"
                  onClick={() => onOpenAuditModal(item)}
                >
                  <FileText size={14} />
                  {isHi ? 'पूर्ण AI ऑडिट रिपोर्ट देखें / PDF प्रिंट' : 'View Full AI Audit Report / PDF Print'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
