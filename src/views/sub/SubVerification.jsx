import React from 'react';
import { FileCheck, Camera, CheckCircle, Coins } from 'lucide-react';
import KpiCard from '../../components/KpiCard';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function SubVerification({ gaushalas, onOpenPhotoModal, onShowToast }) {
  const { isHi, t } = useLanguage();
  const zoneGaushalas = gaushalas.filter(
    (g) => g.zone === (isHi ? 'रायपुर ज़ोन' : 'Raipur Zone') || g.zone.includes('रायपुर') || g.zone.includes('Raipur')
  );

  const totalClaimed = zoneGaushalas.reduce((acc, g) => acc + (g.reg * 40 * 75), 0);
  const totalVerified = zoneGaushalas.reduce((acc, g) => acc + (g.ver * 40 * 75), 0);
  const totalHeld = totalClaimed - totalVerified;

  const handleVerifyReport = (gaushala) => {
    playSuccessSound();
    onShowToast(
      isHi
        ? `✓ ${gaushala.name} का ₹${((gaushala.ver * 40 * 75) / 100000).toFixed(2)} L अनुदान सत्यापित कर राज्य को अग्रसारित किया गया`
        : `✓ ${gaushala.name} grant of ₹${((gaushala.ver * 40 * 75) / 100000).toFixed(2)} L verified & forwarded to State`
    );
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">{t('verifyTitle')}</h2>
          <p className="page-desc">{t('verifyDesc')}</p>
        </div>
      </div>

      {/* Zonal Grant KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title={t('zoneClaimed')}
          value={`₹ ${(totalClaimed / 100000).toFixed(2)} L`}
          tone="blue"
          icon="📋"
        />
        <KpiCard
          title={t('zoneVerified')}
          value={`₹ ${(totalVerified / 100000).toFixed(2)} L`}
          tone="emerald"
          icon="💰"
        />
        <KpiCard
          title={t('zoneHeld')}
          value={`₹ ${(totalHeld / 100000).toFixed(2)} L`}
          tone="saffron"
          icon="🛡️"
        />
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <FileCheck size={18} color="var(--emerald)" />
            {t('verifyTitle')}
          </h3>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{t('tableGaushalaCode')}</th>
                <th>{t('tableName')}</th>
                <th>{t('tableReg')}</th>
                <th>{t('tableVer')}</th>
                <th>{t('tableRate')}</th>
                <th>{t('tableGrant')}</th>
                <th>{t('tableFeed')}</th>
                <th>{t('tablePhoto')}</th>
                <th>{t('tableAction')}</th>
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
                        {g.feedStatus === 'ok'
                          ? (isHi ? 'नांद भरी ✓' : 'Trough Full ✓')
                          : (isHi ? 'खाली / विलंब ⚠️' : 'Empty / Delayed ⚠️')}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-gov outline btn-sm"
                        onClick={() => onOpenPhotoModal({ name: g.name, id: g.id })}
                      >
                        <Camera size={14} />
                        📷 {t('btnPhoto')}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-gov emerald btn-sm"
                        onClick={() => handleVerifyReport(g)}
                      >
                        <CheckCircle size={14} />
                        {t('btnVerify')}
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
