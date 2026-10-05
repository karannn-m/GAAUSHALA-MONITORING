import React, { useState } from 'react';
import { X, Save, Tag } from 'lucide-react';

export default function AddCowModal({ onClose, onAddCow }) {
  const [tag, setTag] = useState('');
  const [breed, setBreed] = useState('देशी');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('गाय');
  const [health, setHealth] = useState('स्वस्थ');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tag) return;

    onAddCow({
      id: 'COW-' + Math.floor(1000 + Math.random() * 9000),
      tag,
      breed,
      age,
      gender,
      health,
      date: new Date().toLocaleDateString('en-IN')
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 450 }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={20} color="var(--emerald)" />
            नया गोवंश पंजीकरण (New Cow Entry)
          </h3>
          <button className="icon-action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">UHF RFID / टैग नंबर *</label>
              <input
                type="text"
                className="form-input"
                placeholder="उदा. IN9820-5512"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                required
              />
            </div>

            <div className="grid-2col" style={{ gap: 12, marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">नस्ल (Breed)</label>
                <select className="form-input" value={breed} onChange={(e) => setBreed(e.target.value)}>
                  <option>देशी</option>
                  <option>गीर</option>
                  <option>साहीवाल</option>
                  <option>थारपारकर</option>
                  <option>अन्य</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">आयु (वर्षों में)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="उदा. 4"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col" style={{ gap: 12, marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">लिंग (Gender)</label>
                <select className="form-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option>गाय</option>
                  <option>बैल / नंदी</option>
                  <option>बछड़ा / बछड़ी</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">स्वास्थ्य स्थिति</label>
                <select className="form-input" value={health} onChange={(e) => setHealth(e.target.value)}>
                  <option>स्वस्थ</option>
                  <option>कमजोर</option>
                  <option>बीमार (उपचार आवश्यक)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <button type="submit" className="btn-gov emerald" style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={16} />
                गोवंश पंजीकृत करें (Submit)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
