import React, { useState } from 'react';
import { X, UserPlus, Users } from 'lucide-react';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function AddSubAdminModal({ onClose, onAddOfficer }) {
  const { isHi } = useLanguage();
  const [name, setName] = useState('');
  const [title, setTitle] = useState(isHi ? 'जिला नोडल अधिकारी' : 'District Nodal Officer');
  const [zone, setZone] = useState(isHi ? 'रायपुर ज़ोन' : 'Raipur Zone');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(isHi ? 'कृपया अधिकारी का नाम दर्ज करें' : 'Please enter officer name');
      return;
    }

    const newOfficer = {
      id: 'SUB-0' + Math.floor(5 + Math.random() * 90),
      name,
      title,
      zone,
      phone: phone || '+91 94252 ' + Math.floor(10000 + Math.random() * 90000),
      gaushalaCount: zone.includes('रायपुर') || zone.includes('Raipur') ? 3 : 1,
      pendingAudits: 0,
      activeCases: 0
    };

    onAddOfficer(newOfficer);
    playSuccessSound();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={18} color="var(--saffron)" />
            <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              {isHi
                ? 'नया उप-प्रशासक / नोडल अधिकारी असाइन करें'
                : 'Assign New Sub-Admin / Nodal Officer'}
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                {isHi ? 'अधिकारी का नाम *' : 'Officer Name *'}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={isHi ? 'उदा. श्री आर. के. वर्मा' : 'e.g. Shri R. K. Verma'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'पदनाम (Designation)' : 'Designation'}
              </label>
              <select className="form-select" value={title} onChange={(e) => setTitle(e.target.value)}>
                <option value={isHi ? 'जिला नोडल अधिकारी' : 'District Nodal Officer'}>
                  {isHi ? 'जिला नोडल अधिकारी' : 'District Nodal Officer'}
                </option>
                <option value={isHi ? 'उप-निदेशक (पशुपालन)' : 'Deputy Director (Animal Husbandry)'}>
                  {isHi ? 'उप-निदेशक (पशुपालन)' : 'Deputy Director (Animal Husbandry)'}
                </option>
                <option value={isHi ? 'सहायक संचालक (गो-सेवा)' : 'Assistant Director (Cow Care)'}>
                  {isHi ? 'सहायक संचालक (गो-सेवा)' : 'Assistant Director (Cow Care)'}
                </option>
                <option value={isHi ? 'ज़ोनल फील्ड इंस्पेक्टर' : 'Zonal Field Inspector'}>
                  {isHi ? 'ज़ोनल फील्ड इंस्पेक्टर' : 'Zonal Field Inspector'}
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'अधिकार क्षेत्र / ज़ोन *' : 'Jurisdiction / Zone *'}
              </label>
              <select className="form-select" value={zone} onChange={(e) => setZone(e.target.value)}>
                <option value={isHi ? 'रायपुर ज़ोन' : 'Raipur Zone'}>
                  {isHi ? 'रायपुर ज़ोन' : 'Raipur Zone'}
                </option>
                <option value={isHi ? 'दुर्ग ज़ोन' : 'Durg Zone'}>
                  {isHi ? 'दुर्ग ज़ोन' : 'Durg Zone'}
                </option>
                <option value={isHi ? 'बिलासपुर ज़ोन' : 'Bilaspur Zone'}>
                  {isHi ? 'बिलासपुर ज़ोन' : 'Bilaspur Zone'}
                </option>
                <option value={isHi ? 'बस्तर ज़ोन' : 'Bastar Zone'}>
                  {isHi ? 'बस्तर ज़ोन' : 'Bastar Zone'}
                </option>
                <option value={isHi ? 'सरगुजा ज़ोन' : 'Surguja Zone'}>
                  {isHi ? 'सरगुजा ज़ोन' : 'Surguja Zone'}
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'मोबाइल संपर्क नंबर' : 'Mobile Phone Number'}
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 94252 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-gov outline" onClick={onClose}>
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button type="submit" className="btn-gov saffron">
              <UserPlus size={16} />
              {isHi ? 'उप-प्रशासक असाइन करें' : 'Assign Sub-Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
