import React, { useState } from 'react';
import { Coins, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Building } from 'lucide-react';
import KpiCard from '../../components/KpiCard';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminGrants({ grants, onOpenGrantModal, onRejectGrant }) {
  const { isHi } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredGrants = grants.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.st === 'लंबित' || item.st === 'pending' || item.st === 'Pending';
    if (filter === 'approved') return item.st === 'स्वीकृत' || item.st === 'approved' || item.st === 'Approved';
    if (filter === 'held') return item.st === 'रोका गया' || item.st === 'held' || item.st === 'Held';
    return item.st === filter;
  });

  const totalClaimed = grants.reduce((sum, item) => sum + (item.g.reg * 40 * 75), 0);
  const totalVerified = grants.reduce((sum, item) => sum + (item.g.ver * 40 * 75), 0);
  const totalSaved = totalClaimed - totalVerified;

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'अनुदान स्वीकृति एवं DBT अंतरण (Grant Approval)' : 'Grant Approval & Direct Benefit Transfer (DBT)'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'केवल AI + RFID से सत्यापित गोवंश का ही अनुदान सीधे बैंक खाते में जारी होगा (DBT Direct Benefit Transfer)'
              : 'Direct Benefit Transfer (DBT) is credited strictly for AI + RFID verified cattle count'}
          </p>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="kpi-grid">
        <KpiCard
          title={isHi ? 'दावाकृत अनुदान (Gross Claims)' : 'Gross Claimed Grant'}
          value={`₹ ${(totalClaimed / 100000).toFixed(2)} L`}
          tone="blue"
          icon="📋"
          subtitle={isHi ? 'पंजीकृत संख्या के आधार पर' : 'Based on registered cattle'}
        />
        <KpiCard
          title={isHi ? 'सत्यापित देय अनुदान (Payable)' : 'Verified Payable Grant'}
          value={`₹ ${(totalVerified / 100000).toFixed(2)} L`}
          tone="emerald"
          icon="✅"
          subtitle={isHi ? 'AI + RFID प्रत्यक्ष सत्यापित' : 'AI + RFID directly verified'}
        />
        <KpiCard
          title={isHi ? 'असमायोजित / रोकी गई राशि' : 'Withheld / Variance Amount'}
          value={`₹ ${(totalSaved / 100000).toFixed(2)} L`}
          tone="saffron"
          icon="🛡️"
          subtitle={isHi ? 'असत्यापित गोवंश अंतर पर रोक' : 'Withheld for unverified cattle'}
        />
      </div>

      {/* Grant Ledger Card */}
      <div className="dash-card">
        <div className="card-title-row">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <h3>
              <Coins size={18} color="var(--saffron)" />
              {isHi ? 'अनुदान दावों की सूची (Grant Sanction Ledger)' : 'Grant Sanction Ledger'}
            </h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'all', label: isHi ? 'सभी' : 'All' },
                { id: 'pending', label: isHi ? 'लंबित (Pending)' : 'Pending' },
                { id: 'approved', label: isHi ? 'स्वीकृत (Approved)' : 'Approved' },
                { id: 'held', label: isHi ? 'रोका गया (Held)' : 'Held' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  className={`btn-gov ${filter === btn.id ? 'saffron' : 'outline'} btn-sm`}
                  onClick={() => setFilter(btn.id)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {isHi ? 'मानक दर: ₹40 प्रति गाय / प्रतिदिन × 75 दिन' : 'Standard Rate: ₹40 per cattle / day × 75 days'}
          </span>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{isHi ? 'गौशाला का नाम' : 'Gaushala Name'}</th>
                <th>{isHi ? 'जिला' : 'District'}</th>
                <th>{isHi ? 'पंजीकृत दावा' : 'Registered Claim'}</th>
                <th>{isHi ? 'AI सत्यापित गायें' : 'AI Verified'}</th>
                <th>{isHi ? 'असत्यापित अंतर' : 'Variance'}</th>
                <th>{isHi ? 'देय अनुदान राशि' : 'Payable Grant'}</th>
                <th>{isHi ? 'बैंक खाता विवरण' : 'Bank Account Details'}</th>
                <th>{isHi ? 'अनुदान स्थिति' : 'Grant Status'}</th>
                <th>{isHi ? 'कार्यवाही (Action)' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrants.map((r, i) => {
                const diff = r.g.reg - r.g.ver;
                const isApproved = r.st === 'स्वीकृत' || r.st === 'approved' || r.st === 'Approved';
                const isHeld = r.st === 'रोका गया' || r.st === 'held' || r.st === 'Held';
                const isPending = !isApproved && !isHeld;

                return (
                  <tr key={i}>
                    <td>
                      <b>{r.g.name}</b>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.g.id}</div>
                    </td>
                    <td>{r.g.district}</td>
                    <td>{r.g.reg} {isHi ? 'गायें' : 'cattle'}</td>
                    <td>
                      <b style={{ color: 'var(--emerald)' }}>{r.g.ver} {isHi ? 'गायें' : 'cattle'}</b>
                    </td>
                    <td style={{ color: diff > 20 ? 'var(--red-alert)' : 'var(--text-secondary)', fontWeight: 700 }}>
                      {diff > 0
                        ? `${diff} ${isHi ? 'गायें' : 'cattle'} (${Math.round((diff / r.g.reg) * 100)}%)`
                        : (isHi ? 'शून्य अंतर ✓' : 'Zero Variance ✓')}
                    </td>
                    <td>
                      <b style={{ fontSize: '0.95rem', color: 'var(--saffron)' }}>{r.amt}</b>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      <div>{r.g.bankDetails?.bank || 'HDFC Bank'}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        A/C: {r.g.bankDetails?.account || '...8219'}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${isApproved ? 'ok' : isHeld ? 'bad' : 'warn'}`}>
                        {isApproved ? (isHi ? 'स्वीकृत' : 'Approved') : isHeld ? (isHi ? 'रोका गया' : 'Held') : (isHi ? 'लंबित' : 'Pending')}
                      </span>
                    </td>
                    <td>
                      {isPending ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn-gov emerald btn-sm"
                            onClick={() => onOpenGrantModal({ ...r, index: i })}
                          >
                            {isHi ? 'स्वीकृत करें' : 'Approve'}
                          </button>
                          <button
                            className="btn-gov crimson btn-sm"
                            onClick={() => onRejectGrant(i)}
                          >
                            {isHi ? 'रोकें' : 'Hold'}
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {isApproved
                            ? (isHi ? '✓ DBT अंतरित' : '✓ DBT Disbursed')
                            : (isHi ? '⚠️ भौतिक ऑडिट आवश्यक' : '⚠️ Physical Audit Required')}
                        </span>
                      )}
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
