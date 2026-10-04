import React, { useState } from 'react';
import { X, UserPlus, Users } from 'lucide-react';
import { playSuccessSound } from '../../sound';

export default function AddSubAdminModal({ onClose, onAddOfficer }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('जिला नोडल अधिकारी');
  const [zone, setZone] = useState('रायपुर ज़ोन');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('कृपया अधिकारी का नाम दर्ज करें');
      return;
    }

    const newOfficer = {
      id: 'SUB-0' + Math.floor(5 + Math.random() * 90),
      name,
      title,
      zone,
      phone: phone || '+91 94252 ' + Math.floor(10000 + Math.random() * 90000),
      gaushalaCount: zone === 'रायपुर ज़ोन' ? 3 : 1,
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
              नया उप-प्रशासक / नोडल अधिकारी असाइन करें
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">अधिकारी का नाम *</label>
              <input
                type="text"
                className="form-input"
                placeholder="उदा. श्री आर. के. वर्मा"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">पदनाम (Designation)</label>
              <select className="form-select" value={title} onChange={(e) => setTitle(e.target.value)}>
                <option value="जिला नोडल अधिकारी">जिला नोडल अधिकारी</option>
                <option value="उप-निदेशक (पशुपालन)">उप-निदेशक (पशुपालन)</option>
                <option value="सहायक संचालक (गो-सेवा)">सहायक संचालक (गो-सेवा)</option>
                <option value="ज़ोनल फील्ड इंस्पेक्टर">ज़ोनल फील्ड इंस्पेक्टर</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">अधिकार क्षेत्र / ज़ोन *</label>
              <select className="form-select" value={zone} onChange={(e) => setZone(e.target.value)}>
                <option value="रायपुर ज़ोन">रायपुर ज़ोन</option>
                <option value="दुर्ग ज़ोन">दुर्ग ज़ोन</option>
                <option value="बिलासपुर ज़ोन">बिलासपुर ज़ोन</option>
                <option value="बस्तर ज़ोन">बस्तर ज़ोन</option>
                <option value="सरगुजा ज़ोन">सरगुजा ज़ोन</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">मोबाइल संपर्क नंबर</label>
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
              रद्द करें
            </button>
            <button type="submit" className="btn-gov saffron">
              <UserPlus size={16} />
              उप-प्रशासक असाइन करें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
