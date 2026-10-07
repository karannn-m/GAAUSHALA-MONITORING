import React, { useState } from 'react';
import { X, Stethoscope, PlusCircle } from 'lucide-react';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function AddHealthModal({ onClose, onAddRecord }) {
  const { isHi } = useLanguage();
  const [tag, setTag] = useState('');
  const [cowName, setCowName] = useState('');
  const [breed, setBreed] = useState(isHi ? 'देसी' : 'Indigenous');
  const [condition, setCondition] = useState('');
  const [type, setType] = useState(isHi ? 'उपचार' : 'Treatment');
  const [vet, setVet] = useState('Dr. A. K. Mishra (B.V.Sc)');
  const [dosage, setDosage] = useState('');
  const [severity, setSeverity] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tag.trim() || !condition.trim()) {
      alert(isHi ? 'कृपया टैग ID और स्थिति विवरण भरें' : 'Please provide Tag ID and condition details');
      return;
    }

    const newRecord = {
      id: 'VET-' + Math.floor(100 + Math.random() * 900),
      tag: tag.startsWith('IN') ? tag : `IN9820-${tag}`,
      cowName: cowName || (isHi ? 'गौमाता' : 'Gaumata'),
      breed,
      condition: `${type}: ${condition}`,
      vet,
      status: type.includes('टीकाकरण') || type.includes('Vaccination')
        ? (isHi ? 'टीकाकृत' : 'Vaccinated')
        : (isHi ? 'उपचाराधीन' : 'Under Treatment'),
      date: new Date().toISOString().split('T')[0],
      shed: 'Shed-A (Clinic)',
      dosage: dosage || (isHi ? 'सामान्य निगरानी' : 'Routine Monitoring'),
      severity
    };

    onAddRecord(newRecord);
    playSuccessSound();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 550 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stethoscope size={18} color="var(--emerald)" />
            <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              {isHi
                ? 'नया पशु चिकित्सा / टीकाकरण रिकॉर्ड दर्ज करें'
                : 'Log New Veterinary / Vaccination Entry'}
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">{isHi ? 'RFID टैग ID *' : 'RFID Tag ID *'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={isHi ? 'उदा. 4471 या IN9820-4471' : 'e.g. 4471 or IN9820-4471'}
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isHi ? 'गाय का नाम / पहचान' : 'Cow Name / Ident'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={isHi ? 'उदा. सुरभि / गौरी' : 'e.g. Surabhi / Gauri'}
                  value={cowName}
                  onChange={(e) => setCowName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">{isHi ? 'नस्ल' : 'Breed'}</label>
                <select className="form-select" value={breed} onChange={(e) => setBreed(e.target.value)}>
                  <option value={isHi ? 'देसी' : 'Indigenous'}>{isHi ? 'देसी (Indigenous)' : 'Indigenous (Desi)'}</option>
                  <option value={isHi ? 'गीर' : 'Gir'}>{isHi ? 'गीर (Gir)' : 'Gir'}</option>
                  <option value={isHi ? 'साहीवाल' : 'Sahiwal'}>{isHi ? 'साहीवाल (Sahiwal)' : 'Sahiwal'}</option>
                  <option value={isHi ? 'थारपारकर' : 'Tharparkar'}>{isHi ? 'थारपारकर' : 'Tharparkar'}</option>
                  <option value={isHi ? 'राठी' : 'Rathi'}>{isHi ? 'राठी' : 'Rathi'}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{isHi ? 'रिकॉर्ड का प्रकार' : 'Record Type'}</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value={isHi ? 'उपचार' : 'Treatment'}>{isHi ? 'बीमारी / उपचार (Treatment)' : 'Illness / Treatment'}</option>
                  <option value={isHi ? 'टीकाकरण (FMD)' : 'Vaccination (FMD)'}>{isHi ? 'FMD खुरपका-मुँहपका टीका' : 'FMD Foot & Mouth Vaccine'}</option>
                  <option value={isHi ? 'टीकाकरण (HS-BQ)' : 'Vaccination (HS-BQ)'}>{isHi ? 'गलघोंटू (HS-BQ) टीका' : 'HS-BQ Vaccine'}</option>
                  <option value={isHi ? 'नियमित स्वास्थ्य जाँच' : 'Routine Checkup'}>{isHi ? 'नियमित स्वास्थ्य परीक्षण' : 'Routine Health Checkup'}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{isHi ? 'लक्षण / रोग विवरण *' : 'Symptoms / Clinical Notes *'}</label>
              <input
                type="text"
                className="form-input"
                placeholder={isHi ? 'उदा. पिछले 2 दिन से लंगड़ापन, सूजन' : 'e.g. Mild lameness, fever for 2 days'}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">{isHi ? 'दवा / खुराक (Dosage)' : 'Medication / Dosage'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={isHi ? 'उदा. Meloxicam 15ml' : 'e.g. Meloxicam 15ml'}
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isHi ? 'प्राथमिकता / गंभीरता' : 'Priority / Severity'}</label>
                <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="low">{isHi ? '🟢 सामान्य (Routine)' : '🟢 Routine'}</option>
                  <option value="medium">{isHi ? '🟠 मध्यम (Monitor)' : '🟠 Monitor'}</option>
                  <option value="high">{isHi ? '🔴 गंभीर (Urgent Care)' : '🔴 Urgent Care'}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{isHi ? 'जाँचकर्ता पशु चिकित्सक (Veterinarian)' : 'Attending Veterinarian'}</label>
              <select className="form-select" value={vet} onChange={(e) => setVet(e.target.value)}>
                <option value="Dr. A. K. Mishra (B.V.Sc)">{isHi ? 'डॉ. ए. के. मिश्रा (B.V.Sc)' : 'Dr. A. K. Mishra (B.V.Sc)'}</option>
                <option value="Dr. V. K. Patel (M.V.Sc)">{isHi ? 'डॉ. वी. के. पटेल (M.V.Sc)' : 'Dr. V. K. Patel (M.V.Sc)'}</option>
                <option value="Dr. Seema Chandrakar">{isHi ? 'डॉ. सीमा चंद्राकर' : 'Dr. Seema Chandrakar'}</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-gov outline" onClick={onClose}>
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button type="submit" className="btn-gov emerald">
              <PlusCircle size={16} />
              {isHi ? 'स्वास्थ्य रिकॉर्ड सहेजें' : 'Save Health Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
