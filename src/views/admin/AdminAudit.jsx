import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle, Truck, Camera } from 'lucide-react';

export default function AdminAudit({ gaushalas, onOpenAuditModal }) {
  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">AI स्वचालित ऑडिट एवं सतर्कता (Automated AI Audit)</h2>
          <p className="page-desc">
            Ghost Cattle, चारा खपत, धर्मकाँटा तौल-पर्ची एवं ANPR वाहन कैमरों का 100% स्वचालित मिलान
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
                    कोड: {item.id} • {item.district}
                  </span>
                </div>
                <span className={`status-badge ${item.status}`}>
                  {item.status === 'ok' ? 'ऑडिट पास (94%)' : item.status === 'warn' ? 'समीक्षाधीन' : 'गंभीर विचलन'}
                </span>
              </div>

              {/* Headcount match meter */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                  <span>AI Headcount मिलान:</span>
                  <b style={{ color: hasGhostCattleRisk ? 'var(--red-alert)' : 'var(--emerald)' }}>
                    {item.ver} / {item.reg} गायें ({100 - diffPct}%)
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
                    चारा बिल बनाम तौल पर्ची (धर्मकाँटा):
                  </span>
                  <b style={{ color: item.status === 'bad' ? 'var(--red-alert)' : 'var(--emerald)' }}>
                    {item.status === 'bad' ? '18% वजन अंतर (संदेहास्पद)' : '100% पर्ची मिलान ✓'}
                  </b>
                </div>

                <div className="stock-bar-row" style={{ padding: '6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Camera size={14} color="var(--emerald)" />
                    ANPR वाहन नंबर प्लेट CCTV मिलान:
                  </span>
                  <b style={{ color: 'var(--emerald)' }}>
                    CG 04 AB 2381 ✓ सत्यापित
                  </b>
                </div>

                <div className="stock-bar-row" style={{ padding: '6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} color="#0284c7" />
                    RFID इयर-टैग सक्रियता:
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
                  पूर्ण AI ऑडिट रिपोर्ट देखें / PDF प्रिंट
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
