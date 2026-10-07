import React from 'react';
import { BarChart3, Send, CheckCircle2, TrendingUp, Download } from 'lucide-react';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function SubZoneReports({ onShowToast }) {
  const { isHi, t } = useLanguage();
  const days = [
    { day: isHi ? 'सोमवार' : 'Monday', rate: 84, verified: 412, total: 486 },
    { day: isHi ? 'मंगलवार' : 'Tuesday', rate: 86, verified: 418, total: 486 },
    { day: isHi ? 'बुधवार' : 'Wednesday', rate: 85, verified: 414, total: 486 },
    { day: isHi ? 'गुरुवार' : 'Thursday', rate: 89, verified: 432, total: 486 },
    { day: isHi ? 'शुक्रवार' : 'Friday', rate: 87, verified: 423, total: 486 },
    { day: isHi ? 'शनिवार' : 'Saturday', rate: 91, verified: 442, total: 486 },
    { day: isHi ? 'रविवार (आज)' : 'Sunday (Today)', rate: 88, verified: 428, total: 486 },
  ];

  const handleSendReport = () => {
    playSuccessSound();
    onShowToast(
      isHi
        ? '✓ रायपुर ज़ोन की 7-दिवसीय साप्ताहिक रिपोर्ट राज्य गो-सेवा आयोग को प्रेषित की गई'
        : '✓ Raipur Zone 7-day weekly audit report transmitted to State Commission'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('reportTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('reportDesc')}
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium shadow-sm" onClick={handleSendReport}>
            <Send size={16} />
            {t('exportReport')}
          </button>
        </div>
      </div>

      <div className="grid-2col">
        {/* Weekly Trend Bars */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <BarChart3 size={18} color="var(--saffron)" />
              {isHi ? 'दैनिक सत्यापन दर (पिछले 7 दिन)' : 'Daily Verification Rate (Last 7 Days)'}
            </h3>
            <span className="status-badge ok">
              {isHi ? 'साप्ताहिक औसत: 87.1%' : 'Weekly Average: 87.1%'}
            </span>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
            <TrendingUp size={18} className="text-emerald-500" />
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {isHi ? 'ज़ोन स्तरीय मुख्य उपलब्धियाँ (Zone Highlights)' : 'Zonal Key Highlights & Findings'}
            </h3>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8 }}>
              <b style={{ color: 'var(--emerald)' }}>
                {isHi ? '✓ शत-प्रतिशत RFID टैग स्कैनिंग' : '✓ 100% RFID Ear-Tag Compliance'}
              </b>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {isHi
                  ? 'आरंग एवं अभनपुर गौशाला में 98%+ झुंड-टैग सक्रिय पाए गए।'
                  : '98%+ active herd collar and ear-tags verified in Arang and Abhanpur shelters.'}
              </p>
            </div>

            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8 }}>
              <b style={{ color: 'var(--amber-warn)' }}>
                {isHi ? '⚠️ तिल्दा गौशाला पर सतर्कता' : '⚠️ Vigilance Hold on Tilda Shelter'}
              </b>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {isHi
                  ? 'तिल्दा गौशाला में 33% गणना अंतर के कारण अनुदान पर रोक जारी रखी गई है।'
                  : 'DBT grant disbursed withheld due to 33% discrepancy detected between registered vs AI count.'}
              </p>
            </div>

            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8 }}>
              <b style={{ color: 'var(--saffron)' }}>
                {isHi ? '🌾 चारा गुणवत्ता एवं तौल' : '🌾 Fodder Weighbridge & Quality'}
              </b>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {isHi
                  ? 'धर्मकाँटा एवं ANPR कैमरों द्वारा कुल 18 चारा वाहनों की एंट्री बिना किसी विसंगति के दर्ज की गई।'
                  : '18 fodder transport entries confirmed via automatic weighbridge & ANPR cameras with 0 mismatches.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
