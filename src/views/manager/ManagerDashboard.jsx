import React from 'react';
import KpiCard from '../../components/KpiCard';
import { Home, Wheat, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';

export default function ManagerDashboard({ alerts, stock, onNavigateTab }) {
  const meta = [
    { key: 'hara', label: 'हरा चारा (नेपियर)', max: 8000, val: stock.hara },
    { key: 'sukha', label: 'सूखा चारा (पैरा)', max: 3000, val: stock.sukha },
    { key: 'dana', label: 'संतुलित दाना', max: 600, val: stock.dana },
  ];

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">श्री कृष्ण गौशाला, आरंग · दैनिक स्थिति (Manager Command)</h2>
          <p className="page-desc">
            आज की स्थिति · {new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-gov saffron" onClick={() => onNavigateTab('cctv')}>
            📹 लाइव CCTV AI
          </button>
          <button className="btn-gov emerald" onClick={() => onNavigateTab('feed')}>
            🌾 राशन व स्टॉक
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          title="आज की सत्यापित गणना"
          value="204 / 210"
          change="सुबह ✓ 08:30 • शाम ✓ 17:45"
          tone="emerald"
          icon="🐄"
        />
        <KpiCard
          title="बीमार / उपचाराधीन गोवंश"
          value="9 गायें"
          change="2 विशेष निगरानी में"
          tone="red"
          icon="🩺"
        />
        <KpiCard
          title="चारा वितरण स्थिति"
          value="समय पर ✓"
          change="प्रातः 08:20 AM पूर्ण"
          tone="emerald"
          icon="🌾"
        />
        <KpiCard
          title="सक्रिय अलर्ट"
          value="2 अलर्ट"
          change="1 मिसिंग गाय + 1 रात्रि गति"
          tone="saffron"
          icon="🚨"
        />
      </div>

      <div className="grid-2col">
        {/* Alerts for Manager */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <AlertTriangle size={18} color="var(--red-alert)" />
              गौशाला अलर्ट एवं सूचनाएँ
            </h3>
            <span className="live-pulse-badge">लाइव</span>
          </div>

          <div className="alert-feed-list">
            <div className="alert-feed-item warning">
              <div className="alert-feed-title">
                ⚠️ शाम की चराई से गाय वापस नहीं लौटी (Tag #2290)
              </div>
              <div className="alert-feed-meta">
                शाम 6:00 बजे की समय सीमा के बाद भी RFID गेट एंट्री दर्ज नहीं हुई • चरवाहा टीम को अलर्ट प्रेषित
              </div>
            </div>

            <div className="alert-feed-item info">
              <div className="alert-feed-title">
                🩺 Shed-C में गाय #4471 को दवा दी जानी शेष है
              </div>
              <div className="alert-feed-meta">
                डॉ. मिश्रा द्वारा अनुशंसित Meloxicam 15ml सायं 06:30 बजे खुराक
              </div>
            </div>
          </div>
        </div>

        {/* Digital Stock Storage status */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Wheat size={18} color="var(--saffron)" />
              गोदाम डिजिटल स्टॉक स्थिति
            </h3>
            <button className="btn-gov outline btn-sm" onClick={() => onNavigateTab('feed')}>
              राशन विवरण
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
            {meta.map((item) => {
              const pct = Math.round((item.val / item.max) * 100);
              const isLow = pct < 30;

              return (
                <div key={item.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                    <span>{item.label}</span>
                    <b style={{ color: isLow ? 'var(--red-alert)' : 'var(--emerald)' }}>
                      {Math.round(item.val)} kg / {item.max} kg ({pct}%)
                    </b>
                  </div>
                  <div className="stock-bar-track">
                    <div
                      className="stock-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: isLow ? 'var(--red-alert)' : 'var(--emerald)'
                      }}
                    />
                  </div>
                  {isLow && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--red-alert)', marginTop: 2 }}>
                      ⚠️ स्टॉक 30% से कम! नया स्टॉक तुरंत मँगवाएँ।
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
