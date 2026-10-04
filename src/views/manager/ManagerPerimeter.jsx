import React, { useState } from 'react';
import { ShieldAlert, BellRing, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toggleSirenSound } from '../../sound';

export default function ManagerPerimeter({ onShowToast }) {
  const [sirenActive, setSirenActive] = useState(false);

  const handleSiren = () => {
    const next = !sirenActive;
    setSirenActive(next);
    toggleSirenSound(next);
    if (next) {
      onShowToast('🚨 परिधि सुरक्षा सायरन सक्रिय! उत्तरी एवं पश्चिमी बाउंड्री पर हूटर बजाया गया');
    } else {
      onShowToast('सायरन बंद किया गया');
    }
  };

  const handleCallPolice = () => {
    alert('निकटतम थाना (आरंग) एवं डायल 112 को कॉल एवं जीपीएस लोकेशन प्रेषित की जा रही है');
    onShowToast('डायल 112 को अलर्ट भेजा गया');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">सुरक्षा एवं रात्रि घुसपैठ नियंत्रण (Perimeter & Intrusion)</h2>
          <p className="page-desc">
            रात्रि एआई थर्मल/आईआर विजन, स्वचालित सायरन हूटर, जंगली जानवर घुसपैठ एवं कंट्रोल रूम
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn-gov ${sirenActive ? 'crimson' : 'saffron'}`}
            onClick={handleSiren}
          >
            <BellRing size={16} />
            {sirenActive ? 'सायरन बंद करें (Mute)' : '🚨 आपातकालीन सायरन बजाएँ'}
          </button>
          <button className="btn-gov outline" onClick={handleCallPolice}>
            <PhoneCall size={16} />
            कंट्रोल रूम / डायल 112
          </button>
        </div>
      </div>

      <div className="grid-2col">
        {/* Active Security Incidents */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <ShieldAlert size={18} color="var(--red-alert)" />
              हालिया परिधि सुरक्षा घटनाक्रम (Security Events)
            </h3>
            <span className="status-badge bad">2 घटनाएँ</span>
          </div>

          <div className="alert-feed-list">
            <div className="alert-feed-item warning">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--text-primary)' }}>रात्रि घुसपैठ – आरंग गौशाला उत्तरी गेट</b>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>02:14 AM</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                अज्ञात मानव गति का एआई डिटेक्शन (विश्वास स्तर: 91.2%) • सुरक्षा गार्ड द्वारा टॉर्च सर्च किया गया
              </p>
            </div>

            <div className="alert-feed-item info">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--text-primary)' }}>जंगली जानवर / श्वान झुंड – पश्चिमी बाउंड्री</b>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>11:30 PM</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                बाउंड्री वॉल के बाहर श्वान झुंड की उपस्थिति • 15 सेकंड का स्वचालित निवारक सायरन बजा
              </p>
            </div>
          </div>
        </div>

        {/* Night Guard Patrol Status */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <CheckCircle2 size={18} color="var(--emerald)" />
              रात्रि गश्त एवं सुरक्षा चेकपॉइंट्स (Guard Patrol)
            </h3>
            <span className="status-badge ok">गश्त सक्रिय</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { point: 'चेकपॉइंट A (मुख्य गेट व धर्मकाँटा)', guard: 'दिनेश यादव', time: '01:00 AM, 02:30 AM', status: 'checked' },
              { point: 'चेकपॉइंट B (शेड-C एवं क्लीनिक वार्ड)', guard: 'मुकेश साहू', time: '01:30 AM, 03:00 AM', status: 'checked' },
              { point: 'चेकपॉइंट C (उत्तरी बाउंड्री तारबंदी)', guard: 'दिनेश यादव', time: '02:20 AM (अलर्ट उपरांत)', status: 'checked' },
              { point: 'चेकपॉइंट D (दाना एवं भूसा गोदाम)', guard: 'मुकेश साहू', time: '02:45 AM', status: 'checked' },
            ].map((pt, i) => (
              <div key={i} className="stock-bar-row">
                <div>
                  <b>{pt.point}</b>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    गार्ड: {pt.guard} • समय: {pt.time}
                  </div>
                </div>
                <span className="status-badge ok">सत्यापित ✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
