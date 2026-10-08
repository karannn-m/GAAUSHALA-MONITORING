import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Building, CreditCard, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function GrantApprovalModal({ grantItem, onClose, onConfirm }) {
  const { isHi } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!grantItem) return null;
  const g = grantItem.g;

  const handleApprove = () => {
    setProcessing(true);
    setTimeout(() => {
      const generatedTxn = 'DBT-CG-GOV-' + Math.floor(10000000 + Math.random() * 90000000);
      setTxnId(generatedTxn);
      setProcessing(false);
      setTransferred(true);
      playSuccessSound();

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}

      setTimeout(() => {
        onConfirm(grantItem.index, isHi ? 'स्वीकृत' : 'Approved', generatedTxn);
        onClose();
      }, 2200);
    }, 1200);
  };

  const handleReject = () => {
    onConfirm(grantItem.index, isHi ? 'रोका गया' : 'Held', null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.25rem' }}>💰</span>
            <b style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {isHi
                ? 'अनुदान स्वीकृति एवं DBT अंतरण (Direct Benefit Transfer)'
                : 'Grant Sanction & Direct Benefit Transfer (DBT)'}
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {transferred ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: 'var(--emerald)', marginBottom: 8 }}>
                {isHi ? 'DBT अनुदान सफलतापूर्वक जारी!' : 'DBT Grant Disbursed Successfully!'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {isHi ? 'PFMS संदर्भ संख्या:' : 'PFMS Reference No.:'}{' '}
                <b style={{ fontFamily: 'var(--font-mono)' }}>{txnId}</b>
              </p>
              <div style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'राशि सीधे गौशाला के बैंक खाते में RTGS/DBT द्वारा स्थानांतरित कर दी गई है।'
                  : 'Funds successfully credited into Gaushala bank account via RTGS/DBT.'}
              </div>
            </div>
          ) : (
            <>
              {/* Gaushala & Verification Summary */}
              <div style={{ background: 'var(--badge-bg)', padding: 14, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <b style={{ fontSize: '0.95rem' }}>{g.name}</b>
                  <span className="status-badge ok">{isHi ? 'AI सत्यापित' : 'AI Verified'}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {isHi ? 'गौशाला कोड:' : 'Shelter Code:'} <b>{g.id}</b> • {isHi ? 'जिला:' : 'District:'} <b>{g.district}</b>
                </div>
              </div>

              {/* Cattle & Amount Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ border: '1px solid var(--border-color)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {isHi ? 'दावाकृत (पंजीकृत) गायें' : 'Claimed (Registered) Cattle'}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 2 }}>
                    {g.reg} {isHi ? 'गायें' : 'cows'}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--border-color)', padding: 12, borderRadius: 8, background: 'rgba(21, 128, 61, 0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--emerald)' }}>
                    {isHi ? 'AI + RFID सत्यापित गायें' : 'AI + RFID Verified Cattle'}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--emerald)', marginTop: 2 }}>
                    {g.ver} {isHi ? 'गायें' : 'cows'}
                  </div>
                </div>
              </div>

              {/* Sanction Details */}
              <div style={{ border: '1px dashed var(--border-color)', padding: 14, borderRadius: 8, marginBottom: 16 }}>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>{isHi ? 'अनुदान गणना दर:' : 'Grant Rate Calculation:'}</span>
                  <b>{isHi ? '₹40 प्रति गाय / प्रतिदिन × 75 दिन' : '₹40 per cow / day × 75 days'}</b>
                </div>
                <div className="stock-bar-row" style={{ padding: '4px 0' }}>
                  <span>{isHi ? 'सत्यापित राशि (Payable):' : 'Payable Amount (Verified):'}</span>
                  <b style={{ fontSize: '1.15rem', color: 'var(--saffron)' }}>{grantItem.amt}</b>
                </div>
                {g.reg - g.ver > 0 && (
                  <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--red-alert)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <AlertTriangle size={14} />
                    <span>
                      {isHi
                        ? `${g.reg - g.ver} असत्यापित गायों का ₹${((g.reg - g.ver) * 40 * 75).toLocaleString('en-IN')} रोक दिया गया है।`
                        : `₹${((g.reg - g.ver) * 40 * 75).toLocaleString('en-IN')} withheld for ${g.reg - g.ver} unverified cattle.`}
                    </span>
                  </div>
                )}
              </div>

              {/* Bank Account Details */}
              <div style={{ background: 'var(--bg-app)', padding: 12, borderRadius: 8, fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building size={14} />
                  <span>{isHi ? 'लाभार्थी बैंक विवरण:' : 'Beneficiary Bank Details:'}</span>
                </div>
                <div>{isHi ? 'खाता सं.:' : 'Account No:'} <b>{g.bankDetails?.account || '50200034821903'}</b></div>
                <div>{isHi ? 'IFSC कोड:' : 'IFSC Code:'} <b>{g.bankDetails?.ifsc || 'HDFC0001928'}</b></div>
                <div>{isHi ? 'बैंक:' : 'Bank:'} <b>{g.bankDetails?.bank || 'HDFC Bank'}</b></div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!transferred && (
          <div className="modal-footer">
            <button
              className="btn-gov outline"
              onClick={handleReject}
              disabled={processing}
            >
              {isHi ? 'अनुदान रोकें (Hold)' : 'Hold Grant'}
            </button>
            <button
              className="btn-gov emerald"
              onClick={handleApprove}
              disabled={processing}
            >
              <ShieldCheck size={16} />
              {processing
                ? (isHi ? 'प्रक्रियाधीन...' : 'Processing...')
                : (isHi ? 'DBT द्वारा स्वीकृत एवं अंतरित करें' : 'Sanction & Transfer via DBT')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
