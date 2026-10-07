import React, { useState } from 'react';
import { ShieldAlert, BellRing, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toggleSirenSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagerPerimeter({ onShowToast }) {
  const { isHi } = useLanguage();
  const [sirenActive, setSirenActive] = useState(false);

  const handleSiren = () => {
    const next = !sirenActive;
    setSirenActive(next);
    toggleSirenSound(next);
    if (next) {
      onShowToast(
        isHi
          ? '🚨 परिधि सुरक्षा सायरन सक्रिय! उत्तरी एवं पश्चिमी बाउंड्री पर हूटर बजाया गया'
          : '🚨 Perimeter alarm activated! Hooter sounded along North and West boundaries'
      );
    } else {
      onShowToast(isHi ? 'सायरन बंद किया गया' : 'Siren turned off');
    }
  };

  const handleCallPolice = () => {
    alert(
      isHi
        ? 'निकटतम थाना (आरंग) एवं डायल 112 को कॉल एवं जीपीएस लोकेशन प्रेषित की जा रही है'
        : 'Connecting to nearest Police Station (Arang) and Dial 112 with GPS location'
    );
    onShowToast(isHi ? 'डायल 112 को अलर्ट भेजा गया' : 'Alert dispatched to Dial 112');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'सुरक्षा एवं रात्रि घुसपैठ नियंत्रण (Perimeter & Intrusion)' : 'Security & Night Intrusion Control'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'रात्रि एआई थर्मल/आईआर विजन, स्वचालित सायरन हूटर, जंगली जानवर घुसपैठ एवं कंट्रोल रूम'
              : 'Night AI Thermal/IR vision, automated siren hooters, wild animal alerts and control room'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn-gov ${sirenActive ? 'crimson' : 'saffron'}`}
            onClick={handleSiren}
          >
            <BellRing size={16} />
            {sirenActive
              ? (isHi ? 'सायरन बंद करें (Mute)' : 'Mute Siren')
              : (isHi ? '🚨 आपातकालीन सायरन बजाएँ' : '🚨 Trigger Siren')}
          </button>
          <button className="btn-gov outline" onClick={handleCallPolice}>
            <PhoneCall size={16} />
            {isHi ? 'कंट्रोल रूम / डायल 112' : 'Control Room / Dial 112'}
          </button>
        </div>
      </div>

      <div className="grid-2col">
        {/* Active Security Incidents */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <ShieldAlert size={18} color="var(--red-alert)" />
              {isHi ? 'हालिया परिधि सुरक्षा घटनाक्रम (Security Events)' : 'Recent Perimeter Security Events'}
            </h3>
            <span className="status-badge bad">{isHi ? '2 घटनाएँ' : '2 Events'}</span>
          </div>

          <div className="alert-feed-list">
            <div className="alert-feed-item warning">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--text-primary)' }}>
                  {isHi ? 'रात्रि घुसपैठ – आरंग गौशाला उत्तरी गेट' : 'Night Intrusion – Arang Gaushala North Gate'}
                </b>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>02:14 AM</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isHi
                  ? 'अज्ञात मानव गति का एआई डिटेक्शन (विश्वास स्तर: 91.2%) • सुरक्षा गार्ड द्वारा टॉर्च सर्च किया गया'
                  : 'AI detection of unknown human movement (Confidence: 91.2%) • Torch sweep conducted by guard'}
              </p>
            </div>

            <div className="alert-feed-item info">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--text-primary)' }}>
                  {isHi ? 'जंगली जानवर / श्वान झुंड – पश्चिमी बाउंड्री' : 'Wild Animals / Stray Pack – West Boundary'}
                </b>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>11:30 PM</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isHi
                  ? 'बाउंड्री वॉल के बाहर श्वान झुंड की उपस्थिति • 15 सेकंड का स्वचालित निवारक सायरन बजा'
                  : 'Pack movement detected outside boundary wall • 15s deterrent siren sounded'}
              </p>
            </div>
          </div>
        </div>

        {/* Night Guard Patrol Status */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <CheckCircle2 size={18} color="var(--emerald)" />
              {isHi ? 'रात्रि गश्त एवं सुरक्षा चेकपॉइंट्स (Guard Patrol)' : 'Night Guard Patrol Checkpoints'}
            </h3>
            <span className="status-badge ok">{isHi ? 'गश्त सक्रिय' : 'Patrol Active'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                point: isHi ? 'चेकपॉइंट A (मुख्य गेट व धर्मकाँटा)' : 'Checkpoint A (Main Gate & Weighbridge)',
                guard: isHi ? 'दिनेश यादव' : 'Dinesh Yadav',
                time: '01:00 AM, 02:30 AM',
                status: 'checked'
              },
              {
                point: isHi ? 'चेकपॉइंट B (शेड-C एवं क्लीनिक वार्ड)' : 'Checkpoint B (Shed-C & Clinic Ward)',
                guard: isHi ? 'मुकेश साहू' : 'Mukesh Sahu',
                time: '01:30 AM, 03:00 AM',
                status: 'checked'
              },
              {
                point: isHi ? 'चेकपॉइंट C (उत्तरी बाउंड्री तारबंदी)' : 'Checkpoint C (North Boundary Fencing)',
                guard: isHi ? 'दिनेश यादव' : 'Dinesh Yadav',
                time: isHi ? '02:20 AM (अलर्ट उपरांत)' : '02:20 AM (Post-Alert)',
                status: 'checked'
              },
              {
                point: isHi ? 'चेकपॉइंट D (दाना एवं भूसा गोदाम)' : 'Checkpoint D (Fodder & Grain Godown)',
                guard: isHi ? 'मुकेश साहू' : 'Mukesh Sahu',
                time: '02:45 AM',
                status: 'checked'
              },
            ].map((pt, i) => (
              <div key={i} className="stock-bar-row">
                <div>
                  <b>{pt.point}</b>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {isHi ? 'गार्ड:' : 'Guard:'} {pt.guard} • {isHi ? 'समय:' : 'Time:'} {pt.time}
                  </div>
                </div>
                <span className="status-badge ok">{isHi ? 'सत्यापित ✓' : 'Verified ✓'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
