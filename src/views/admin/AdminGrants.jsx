import React, { useState } from 'react';
import { Coins, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Building } from 'lucide-react';
import KpiCard from '../../components/KpiCard';

export default function AdminGrants({ grants, onOpenGrantModal, onRejectGrant }) {
  const [filter, setFilter] = useState('all');

  const filteredGrants = grants.filter((item) => {
    if (filter === 'all') return true;
    return item.st === filter;
  });

  const totalClaimed = grants.reduce((sum, item) => sum + (item.g.reg * 40 * 75), 0);
  const totalVerified = grants.reduce((sum, item) => sum + (item.g.ver * 40 * 75), 0);
  const totalSaved = totalClaimed - totalVerified;

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">अनुदान स्वीकृति एवं DBT अंतरण (Grant Approval)</h2>
          <p className="page-desc">
            केवल AI + RFID से सत्यापित गोवंश का ही अनुदान सीधे बैंक खाते में जारी होगा (DBT Direct Benefit Transfer)
          </p>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="kpi-grid">
        <KpiCard
          title="दावाकृत अनुदान (Gross Claims)"
          value={`₹ ${(totalClaimed / 100000).toFixed(2)} L`}
          tone="blue"
          icon="📋"
          subtitle="पंजीकृत संख्या के आधार पर"
        />
        <KpiCard
          title="सत्यापित देय अनुदान (Payable)"
          value={`₹ ${(totalVerified / 100000).toFixed(2)} L`}
          tone="emerald"
          icon="✅"
          subtitle="AI + RFID प्रत्यक्ष सत्यापित"
        />
        <KpiCard
          title="असमायोजित / रोकी गई राशि"
          value={`₹ ${(totalSaved / 100000).toFixed(2)} L`}
          tone="saffron"
          icon="🛡️"
          subtitle="असत्यापित गोवंश अंतर पर रोक"
        />
      </div>

      {/* Grant Ledger Card */}
      <div className="dash-card">
        <div className="card-title-row">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <h3>
              <Coins size={18} color="var(--saffron)" />
              अनुदान दावों की सूची (Grant Sanction Ledger)
            </h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'all', label: 'सभी' },
                { id: 'लंबित', label: 'लंबित (Pending)' },
                { id: 'स्वीकृत', label: 'स्वीकृत (Approved)' },
                { id: 'रोका गया', label: 'रोका गया (Held)' },
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
            मानक दर: ₹40 प्रति गाय / प्रतिदिन × 75 दिन
          </span>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>गौशाला का नाम</th>
                <th>जिला</th>
                <th>पंजीकृत दावा</th>
                <th>AI सत्यापित गायें</th>
                <th>असत्यापित अंतर</th>
                <th>देय अनुदान राशि</th>
                <th>बैंक खाता विवरण</th>
                <th>अनुदान स्थिति</th>
                <th>कार्यवाही (Action)</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrants.map((r, i) => {
                const diff = r.g.reg - r.g.ver;
                return (
                  <tr key={i}>
                    <td>
                      <b>{r.g.name}</b>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.g.id}</div>
                    </td>
                    <td>{r.g.district}</td>
                    <td>{r.g.reg} गायें</td>
                    <td>
                      <b style={{ color: 'var(--emerald)' }}>{r.g.ver} गायें</b>
                    </td>
                    <td style={{ color: diff > 20 ? 'var(--red-alert)' : 'var(--text-secondary)', fontWeight: 700 }}>
                      {diff > 0 ? `${diff} गायें (${Math.round((diff / r.g.reg) * 100)}%)` : 'शून्य अंतर ✓'}
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
                      <span className={`status-badge ${r.st === 'स्वीकृत' ? 'ok' : r.st === 'रोका गया' ? 'bad' : 'warn'}`}>
                        {r.st}
                      </span>
                    </td>
                    <td>
                      {r.st === 'लंबित' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn-gov emerald btn-sm"
                            onClick={() => onOpenGrantModal({ ...r, index: i })}
                          >
                            स्वीकृत करें
                          </button>
                          <button
                            className="btn-gov crimson btn-sm"
                            onClick={() => onRejectGrant(i)}
                          >
                            रोकें
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {r.st === 'स्वीकृत' ? '✓ DBT अंतरित' : '⚠️ भौतिक ऑडिट आवश्यक'}
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
