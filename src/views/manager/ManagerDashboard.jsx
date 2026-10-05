import React from 'react';
import KpiCard from '../../components/KpiCard';
import { Home, Wheat, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagerDashboard({ alerts, stock, onNavigateTab, onOpenAddCowModal }) {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const meta = [
    { key: 'hara', label: isHi ? 'हरा चारा (नेपियर)' : 'Green Fodder', max: 8000, val: stock.hara },
    { key: 'sukha', label: isHi ? 'सूखा चारा (पैरा)' : 'Dry Fodder', max: 3000, val: stock.sukha },
    { key: 'dana', label: isHi ? 'संतुलित दाना' : 'Concentrate Feed', max: 600, val: stock.dana },
  ];

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">{isHi ? 'श्री कृष्ण गौशाला, आरंग · दैनिक स्थिति (Manager Command)' : 'Shri Krishna Gaushala, Arang · Daily Status'}</h2>
          <p className="page-desc">
            {isHi ? 'आज की स्थिति' : 'Today\'s Status'} · {new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-gov emerald" onClick={onOpenAddCowModal}>
            + {isHi ? 'नया गोवंश पंजीकरण' : 'New Cow Registration'}
          </button>
          <button className="btn-gov saffron" onClick={() => onNavigateTab('cctv')}>
            📹 {isHi ? 'लाइव CCTV AI' : 'Live CCTV AI'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <KpiCard
          title={isHi ? 'कुल गोवंश / सत्यापित' : 'Total / Verified Cattle'}
          value="210 / 204"
          change={isHi ? '6 अनुपस्थित (समीक्षाधीन)' : '6 absent (under review)'}
          tone="emerald"
          icon="🐄"
        />
        <KpiCard
          title={isHi ? 'ट्रैकर: सक्रिय / ऑफलाइन' : 'Tracker: Active / Offline'}
          value="201 / 9"
          change={isHi ? '9 उपकरण बैटरी/लिंक डाउन' : '9 devices offline'}
          tone="saffron"
          icon="📡"
        />
        <KpiCard
          title={isHi ? 'जियोफेंस (5-7 km) स्थिति' : 'Geofence Status'}
          value={isHi ? '1 अलर्ट' : '1 Alert'}
          change={isHi ? 'गाय #2290 बाहर' : 'Cow #2290 Out'}
          tone="red"
          icon="🚧"
        />
        <KpiCard
          title={isHi ? 'ट्रैकर बैटरी चेतावनी' : 'Tracker Battery Warn'}
          value={isHi ? '4 उपकरण' : '4 Devices'}
          change={isHi ? '< 20% चार्ज शेष' : '< 20% Charge Left'}
          tone="saffron"
          icon="🔋"
        />
        <KpiCard
          title={isHi ? 'चारा वितरण' : 'Fodder Distribution'}
          value={isHi ? 'समय पर ✓' : 'On Time ✓'}
          change={isHi ? 'प्रातः 08:20 AM पूर्ण' : '08:20 AM Complete'}
          tone="emerald"
          icon="🌾"
        />
        <KpiCard
          title={isHi ? 'बीमार गोवंश' : 'Sick Cattle'}
          value={isHi ? '9 गायें' : '9 Cows'}
          change={isHi ? '2 विशेष निगरानी में' : '2 under strict watch'}
          tone="red"
          icon="🩺"
        />
      </div>

      <div className="grid-2col">
        {/* Alerts for Manager & Daily Ration Estimate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="dash-card">
            <div className="card-title-row">
              <h3>
                <AlertTriangle size={18} color="var(--red-alert)" />
                {isHi ? 'गौशाला अलर्ट एवं सूचनाएँ' : 'Gaushala Alerts & Notices'}
              </h3>
              <span className="live-pulse-badge">{isHi ? 'लाइव' : 'LIVE'}</span>
            </div>

            <div className="alert-feed-list">
              <div className="alert-feed-item warning">
                <div className="alert-feed-title">
                  {isHi ? '⚠️ शाम की चराई से गाय वापस नहीं लौटी (Tag #2290)' : '⚠️ Cow hasn\'t returned from grazing (Tag #2290)'}
                </div>
                <div className="alert-feed-meta">
                  {isHi ? 'शाम 6:00 बजे की समय सीमा के बाद भी RFID गेट एंट्री दर्ज नहीं हुई • चरवाहा टीम को अलर्ट प्रेषित' : 'No RFID gate entry after 6:00 PM deadline • Alert sent to herder team'}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn-gov outline btn-sm" onClick={() => alert(isHi ? 'अंतिम लोकेशन: अक्षांश 21.2, देशांतर 81.6 (5km दूर)' : 'Last Location: Lat 21.2, Lng 81.6 (5km away)')}>
                    {isHi ? 'अंतिम लोकेशन देखें' : 'View Last Location'}
                  </button>
                  <button className="btn-gov saffron btn-sm" onClick={() => onShowToast(isHi ? 'कर्मचारी द्वारा कार्यवाही (Acknowledgement) दर्ज' : 'Action acknowledged by staff')}>
                    {isHi ? 'कार्यवाही (Acknowledge)' : 'Acknowledge'}
                  </button>
                </div>
              </div>

              <div className="alert-feed-item info">
                <div className="alert-feed-title">
                  {isHi ? '🩺 Shed-C में गाय #4471 को दवा दी जानी शेष है' : '🩺 Cow #4471 in Shed-C requires medication'}
                </div>
                <div className="alert-feed-meta">
                  {isHi ? 'डॉ. मिश्रा द्वारा अनुशंसित Meloxicam 15ml सायं 06:30 बजे खुराक' : 'Recommended Meloxicam 15ml by Dr. Mishra at 06:30 PM'}
                </div>
                <button className="btn-gov emerald btn-sm" style={{ marginTop: 10 }} onClick={() => onShowToast(isHi ? 'मेडिकल लॉग में दर्ज' : 'Logged into medical records')}>
                  {isHi ? 'दवा दी गई (Acknowledge)' : 'Medicine Given (Ack)'}
                </button>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="card-title-row">
              <h3>
                <Wheat size={18} color="var(--emerald)" />
                {isHi ? 'दैनिक अनुशंसित राशन अनुमान (Ration Estimate)' : 'Daily Recommended Ration Estimate'}
              </h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--emerald-light)', padding: 12, borderRadius: 8, border: '1px solid var(--emerald-border)' }}>
              <div>
                <b style={{ display: 'block', fontSize: '0.85rem' }}>{isHi ? 'कुल अनुमान (210 गोवंश)' : 'Total Estimate (210 Cattle)'}</b>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {isHi ? 'नीति अनुसार: 15kg हरा, 5kg सूखा, 1.5kg दाना' : 'By Policy: 15kg Green, 5kg Dry, 1.5kg Concentrate'}
                </span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: 'var(--emerald)' }}>
                {isHi ? 'हरा चारा:' : 'Green Fodder:'} 3150 kg <br />
                {isHi ? 'सूखा चारा:' : 'Dry Fodder:'} 1050 kg <br />
                {isHi ? 'दाना:' : 'Concentrate:'} 315 kg
              </div>
            </div>
          </div>
        </div>

        {/* Digital Stock Storage status */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Wheat size={18} color="var(--saffron)" />
              {isHi ? 'गोदाम डिजिटल स्टॉक स्थिति' : 'Warehouse Digital Stock'}
            </h3>
            <button className="btn-gov outline btn-sm" onClick={() => onNavigateTab('feed')}>
              {isHi ? 'राशन विवरण' : 'Ration Details'}
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
                      {isHi ? '⚠️ स्टॉक 30% से कम! नया स्टॉक तुरंत मँगवाएँ।' : '⚠️ Stock below 30%! Order new stock immediately.'}
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
