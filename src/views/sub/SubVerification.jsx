import React from 'react';
import { FileCheck, Camera, CheckCircle, Coins } from 'lucide-react';
import KpiCard from '../../components/KpiCard';
import { playSuccessSound } from '../../sound';

export default function SubVerification({ gaushalas, onOpenPhotoModal, onShowToast }) {
  const zoneGaushalas = gaushalas.filter((g) => g.zone === 'रायपुर ज़ोन');

  const totalClaimed = zoneGaushalas.reduce((acc, g) => acc + (g.reg * 40 * 75), 0);
  const totalVerified = zoneGaushalas.reduce((acc, g) => acc + (g.ver * 40 * 75), 0);
  const totalHeld = totalClaimed - totalVerified;

  const handleVerifyReport = (gaushala) => {
    playSuccessSound();
    onShowToast(`✓ ${gaushala.name} का ₹${((gaushala.ver * 40 * 75) / 100000).toFixed(2)} L अनुदान सत्यापित कर राज्य को अग्रसारित किया गया`);
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">दैनिक रिपोर्ट एवं अनुदान संस्तुति सत्यापन (Zonal Verification Queue)</h2>
          <p className="page-desc">
            गौशालाओं की दैनिक हेडकाउंट रिपोर्ट का फोटो-प्रमाण सहित सत्यापन एवं राज्य स्तरीय DBT अनुदान संस्तुति
          </p>
        </div>
      </div>

      {/* Zonal Grant KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title="ज़ोन दावाकृत अनुदान"
          value={`₹ ${(totalClaimed / 100000).toFixed(2)} L`}
          tone="blue"
          icon="📋"
          subtitle="486 पंजीकृत गोवंश आधार"
        />
        <KpiCard
          title="सत्यापित अनुशंसित अनुदान"
          value={`₹ ${(totalVerified / 100000).toFixed(2)} L`}
          tone="emerald"
          icon="💰"
          subtitle="419 AI सत्यापित गोवंश (@ ₹40/दिन)"
        />
        <KpiCard
          title="रोकी गई संस्तुति (विचलन)"
          value={`₹ ${(totalHeld / 100000).toFixed(2)} L`}
          tone="saffron"
          icon="🛡️"
          subtitle="67 असत्यापित गोवंश अंतर"
        />
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <FileCheck size={18} color="var(--emerald)" />
            दैनिक AI उपस्थिति एवं अनुदान सत्यापन (रायपुर संभाग)
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            मानक दर: ₹40 प्रति गाय / प्रतिदिन × 75 दिन
          </span>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>गौशाला कोड</th>
                <th>गौशाला का नाम</th>
                <th>पंजीकृत गोवंश</th>
                <th>AI सत्यापित</th>
                <th>उपस्थिति दर</th>
                <th>अनुशंसित DBT अनुदान</th>
                <th>चारा स्थिति</th>
                <th>CCTV फोटो-प्रमाण</th>
                <th>नोडल सत्यापन</th>
              </tr>
            </thead>
            <tbody>
              {zoneGaushalas.map((g) => {
                const pct = Math.round((g.ver / g.reg) * 100);
                const grantAmt = ((g.ver * 40 * 75) / 100000).toFixed(2);
                return (
                  <tr key={g.id}>
                    <td><b style={{ fontFamily: 'var(--font-mono)' }}>{g.id}</b></td>
                    <td><b>{g.name}</b></td>
                    <td>{g.reg}</td>
                    <td><b style={{ color: 'var(--emerald)' }}>{g.ver}</b></td>
                    <td>
                      <span className={`status-badge ${pct >= 90 ? 'ok' : 'bad'}`}>
                        {pct}% ({g.ver}/{g.reg})
                      </span>
                    </td>
                    <td>
                      <b style={{ color: 'var(--saffron)', fontSize: '0.92rem' }}>₹ {grantAmt} Lakh</b>
                    </td>
                    <td>
                      <span className={`status-badge ${g.feedStatus === 'ok' ? 'ok' : 'bad'}`}>
                        {g.feedStatus === 'ok' ? 'नांद भरी ✓' : 'खाली / विलंब ⚠️'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-gov outline btn-sm"
                        onClick={() => onOpenPhotoModal({ name: g.name, id: g.id })}
                      >
                        <Camera size={14} />
                        📷 फोटो-प्रमाण
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-gov emerald btn-sm"
                        onClick={() => handleVerifyReport(g)}
                      >
                        <CheckCircle size={14} />
                        अनुदान संस्तुत करें
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
