import React, { useState } from 'react';
import { X, Heart, Award, ShieldCheck, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function AdoptionModal({ cow, onClose }) {
  const { isHi } = useLanguage();
  const [donorName, setDonorName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [amount, setAmount] = useState(cow?.monthlyCareCost || 1500);
  const [adopted, setAdopted] = useState(false);
  const [certId, setCertId] = useState('');

  if (!cow) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!donorName.trim()) {
      alert(isHi ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
      return;
    }
    const generatedId = 'GOPALAK-2026-' + Math.floor(1000 + Math.random() * 9000);
    setCertId(generatedId);
    setAdopted(true);
    playSuccessSound();

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (_) {}
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={18} color="#ef4444" fill="#ef4444" />
            <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              {isHi
                ? 'गो-सेवा एवं गौ-दान संकल्प पत्र (Adopt a Cow)'
                : 'Cattle Care Adoption & Sponsorship'}
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {adopted ? (
            /* Digital Certificate of Adoption */
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  border: '3px double var(--saffron)',
                  borderRadius: 12,
                  padding: 24,
                  background: 'linear-gradient(180deg, #fffbf5 0%, #ffffff 100%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>🙏 🐄 🪷</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--saffron)', fontSize: '1.3rem', margin: 0 }}>
                  {isHi ? 'गो-पालक सम्मान प्रमाण-पत्र' : 'Gau-Palak Honor Certificate'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 16px' }}>
                  {isHi
                    ? 'छत्तीसगढ़ राज्य गो-सेवा आयोग द्वारा सादर समर्पित'
                    : 'Presented with gratitude by State Cow Care Commission'}
                </p>

                <p style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.6 }}>
                  {isHi ? (
                    <>
                      सादर प्रमाणित किया जाता है कि परम आदरणीय <b>{donorName}</b> ने{' '}
                      <b>{cow.gaushala}</b> की पूज्य गौमाता <b>"{cow.name}" ({cow.breed})</b> को एक माह
                      हेतु <b>₹{amount}</b> की सेवा राशि से गोद लिया है।
                    </>
                  ) : (
                    <>
                      This certifies with honour that <b>{donorName}</b> has sponsored and adopted{' '}
                      <b>"{cow.name}" ({cow.breed})</b> at <b>{cow.gaushala}</b> for monthly care with an
                      amount of <b>₹{amount}</b>.
                    </>
                  )}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 24,
                    paddingTop: 12,
                    borderTop: '1px dashed var(--saffron)',
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div>
                    {isHi ? 'प्रमाण-पत्र क्र.:' : 'Cert No.:'} <b>{certId}</b>
                    <br />
                    {isHi ? 'आयकर छूट धारा 80G अनुमन्य' : 'Eligible for 80G Tax Exemption'}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {isHi ? 'दिनांक:' : 'Date:'} {new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-US')}
                    <br />
                    <b>{isHi ? 'सचिव, गो-सेवा आयोग' : 'Secretary, Gau-Seva Commission'}</b>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Adoption Form */
            <form onSubmit={handleSubmit}>
              {/* Selected Cow Snapshot Card */}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  background: 'var(--badge-bg)',
                  padding: 14,
                  borderRadius: 8,
                  marginBottom: 16
                }}
              >
                <img
                  src={cow.photo}
                  alt={cow.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--border-color)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{cow.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {isHi ? 'नस्ल:' : 'Breed:'} <b>{cow.breed}</b> • {isHi ? 'टैग ID:' : 'Tag ID:'} <b>{cow.tag}</b>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {isHi ? 'गौशाला:' : 'Shelter:'} <b>{cow.gaushala}</b>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="form-group">
                <label className="form-label">
                  {isHi ? 'दानदाता / गो-पालक का पूरा नाम *' : 'Donor / Caretaker Full Name *'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={isHi ? 'उदा. श्री राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">
                    {isHi ? 'पैन नंबर (80G कर छूट हेतु)' : 'PAN Number (for 80G Tax Exemption)'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isHi ? 'मासिक देखभाल सेवा राशि (₹)' : 'Monthly Care Contribution (₹)'}
                  </label>
                  <select
                    className="form-select"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  >
                    <option value={900}>
                      {isHi ? '₹ 900 (दाना एवं चारा)' : '₹ 900 (Feed & Fodder)'}
                    </option>
                    <option value={1500}>
                      {isHi ? '₹ 1,500 (संपूर्ण आहार एवं चिकित्सा)' : '₹ 1,500 (Complete Diet & Health)'}
                    </option>
                    <option value={3000}>
                      {isHi ? '₹ 3,000 (विशेष पोषण एवं गौ-संरक्षण)' : '₹ 3,000 (Special Nutrition & Care)'}
                    </option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                {isHi
                  ? '🛡️ दान राशि सीधे राज्य गो-सेवा ट्रस्ट के बैंक खाते में जाएगी और 100% गौ-आहार में प्रयुक्त होगी।'
                  : '🛡️ Contribution is deposited directly into the State Gau-Seva Trust account and utilized 100% for cattle feed.'}
              </div>

              <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                <button type="button" className="btn-gov outline" onClick={onClose}>
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button type="submit" className="btn-gov saffron">
                  <Heart size={16} fill="#fff" />
                  {isHi ? 'गोद लें एवं संकल्प करें' : 'Adopt & Pledge Support'}
                </button>
              </div>
            </form>
          )}
        </div>

        {adopted && (
          <div className="modal-footer">
            <button className="btn-gov outline" onClick={onClose}>
              {isHi ? 'पूर्ण' : 'Close'}
            </button>
            <button
              className="btn-gov saffron"
              onClick={() => {
                alert(isHi ? 'प्रमाण-पत्र PDF डाउनलोड किया गया' : 'Certificate PDF downloaded successfully');
                onClose();
              }}
            >
              <Download size={16} />
              {isHi ? 'प्रमाण-पत्र डाउनलोड करें' : 'Download Certificate'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
