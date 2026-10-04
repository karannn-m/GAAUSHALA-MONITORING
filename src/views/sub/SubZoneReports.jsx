import React from 'react';
import { BarChart3, Send, CheckCircle2, TrendingUp } from 'lucide-react';
import { playSuccessSound } from '../../sound';

export default function SubZoneReports({ onShowToast }) {
  const days = [
    { day: 'सोमवार', rate: 84, verified: 412, total: 486 },
    { day: 'मंगलवार', rate: 86, verified: 418, total: 486 },
    { day: 'बुधवार', rate: 85, verified: 414, total: 486 },
    { day: 'गुरुवार', rate: 89, verified: 432, total: 486 },
    { day: 'शुक्रवार', rate: 87, verified: 423, total: 486 },
    { day: 'शनिवार', rate: 91, verified: 442, total: 486 },
    { day: 'रविवार (आज)', rate: 88, verified: 428, total: 486 },
  ];

  const handleSendReport = () => {
    playSuccessSound();
    onShowToast('✓ रायपुर ज़ोन की 7-दिवसीय साप्ताहिक रिपोर्ट राज्य गो-सेवा आयोग को प्रेषित की गई');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">ज़ोन साप्ताहिक प्रदर्शन रिपोर्ट (Weekly Performance)</h2>
          <p className="page-desc">
            रायपुर ज़ोन की सभी 3 गौशालाओं का 7-दिवसीय AI सत्यापन औसत एवं चारा वितरण विश्लेषण
          </p>
        </div>
        <button className="btn-gov saffron" onClick={handleSendReport}>
          <Send size={16} />
          राज्य कार्यालय को रिपोर्ट भेजें
        </button>
      </div>

      <div className="grid-2col">
        {/* Weekly Trend Bars */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <BarChart3 size={18} color="var(--saffron)" />
              दैनिक सत्यापन दर (पिछले 7 दिन)
            </h3>
            <span className="status-badge ok">साप्ताहिक औसत: 87.1%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {days.map((d) => (
              <div key={d.day}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span>{d.day}</span>
                  <b>
                    {d.verified}/{d.total} ({d.rate}%)
                  </b>
                </div>
                <div className="stock-bar-track">
                  <div
                    className="stock-bar-fill"
                    style={{
                      width: `${d.rate}%`,
                      background: d.rate >= 90 ? 'var(--emerald)' : d.rate >= 85 ? 'var(--saffron)' : 'var(--amber-warn)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Audit Summary */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <TrendingUp size={18} color="var(--emerald)" />
              ज़ोन स्तरीय मुख्य उपलब्धियाँ
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.84rem' }}>
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8 }}>
              <b style={{ color: 'var(--emerald)' }}>✓ शत-प्रतिशत RFID टैग स्कैनिंग</b>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                आरंग एवं अभनपुर गौशाला में 98%+ झुंड-टैग सक्रिय पाए गए।
              </p>
            </div>

            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8 }}>
              <b style={{ color: 'var(--amber-warn)' }}>⚠️ तिल्दा गौशाला पर सतर्कता</b>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                तिल्दा गौशाला में 33% गणना अंतर के कारण अनुदान पर रोक जारी रखी गई है।
              </p>
            </div>

            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8 }}>
              <b style={{ color: 'var(--saffron)' }}>🌾 चारा गुणवत्ता एवं तौल</b>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                धर्मकाँटा एवं ANPR कैमरों द्वारा कुल 18 चारा वाहनों की एंट्री बिना किसी विसंगति के दर्ज की गई।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
