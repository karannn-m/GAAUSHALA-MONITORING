import React, { useState } from 'react';
import { X, Stethoscope, PlusCircle } from 'lucide-react';
import { playSuccessSound } from '../../sound';

export default function AddHealthModal({ onClose, onAddRecord }) {
  const [tag, setTag] = useState('');
  const [cowName, setCowName] = useState('');
  const [breed, setBreed] = useState('देसी');
  const [condition, setCondition] = useState('');
  const [type, setType] = useState('उपचार');
  const [vet, setVet] = useState('डॉ. ए. के. मिश्रा (B.V.Sc)');
  const [dosage, setDosage] = useState('');
  const [severity, setSeverity] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tag.trim() || !condition.trim()) {
      alert('कृपया टैग ID और स्थिति विवरण भरें');
      return;
    }

    const newRecord = {
      id: 'VET-' + Math.floor(100 + Math.random() * 900),
      tag: tag.startsWith('IN') ? tag : `IN9820-${tag}`,
      cowName: cowName || 'गौमाता',
      breed,
      condition: `${type}: ${condition}`,
      vet,
      status: type === 'टीकाकरण' ? 'टीकाकृत' : 'उपचाराधीन',
      date: new Date().toISOString().split('T')[0],
      shed: 'Shed-A (Clinic)',
      dosage: dosage || 'सामान्य निगरानी',
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
              नया पशु चिकित्सा / टीकाकरण रिकॉर्ड दर्ज करें
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
                <label className="form-label">RFID टैग ID *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="उदा. 4471 या IN9820-4471"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">गाय का नाम / पहचान</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="उदा. सुरभि / गौरी"
                  value={cowName}
                  onChange={(e) => setCowName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">नस्ल</label>
                <select className="form-select" value={breed} onChange={(e) => setBreed(e.target.value)}>
                  <option value="देसी">देसी (Indigenous)</option>
                  <option value="गीर">गीर (Gir)</option>
                  <option value="साहीवाल">साहीवाल (Sahiwal)</option>
                  <option value="थारपारकर">थारपारकर</option>
                  <option value="राठी">राठी</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">रिकॉर्ड का प्रकार</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="उपचार">बीमारी / उपचार (Treatment)</option>
                  <option value="टीकाकरण (FMD)">FMD खुरपका-मुँहपका टीका</option>
                  <option value="टीकाकरण (HS-BQ)">गलघोंटू (HS-BQ) टीका</option>
                  <option value="नियमित स्वास्थ्य जाँच">नियमित स्वास्थ्य परीक्षण</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">लक्षण / रोग विवरण *</label>
              <input
                type="text"
                className="form-input"
                placeholder="उदा. पिछले 2 दिन से लंगड़ापन, सूजन"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">दवा / खुराक (Dosage)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="उदा. Meloxicam 15ml"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">प्राथमिकता / गंभीरता</label>
                <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="low">🟢 सामान्य (Routine)</option>
                  <option value="medium">🟠 मध्यम (Monitor)</option>
                  <option value="high">🔴 गंभीर (Urgent Care)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">जाँचकर्ता पशु चिकित्सक (Veterinarian)</label>
              <select className="form-select" value={vet} onChange={(e) => setVet(e.target.value)}>
                <option value="डॉ. ए. के. मिश्रा (B.V.Sc)">डॉ. ए. के. मिश्रा (B.V.Sc)</option>
                <option value="डॉ. वी. के. पटेल (M.V.Sc)">डॉ. वी. के. पटेल (M.V.Sc)</option>
                <option value="डॉ. सीमा चंद्राकर">डॉ. सीमा चंद्राकर</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-gov outline" onClick={onClose}>
              रद्द करें
            </button>
            <button type="submit" className="btn-gov emerald">
              <PlusCircle size={16} />
              स्वास्थ्य रिकॉर्ड सहेजें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
