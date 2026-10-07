import React, { useState } from 'react';
import { X, Save, Tag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AddCowModal({ onClose, onAddCow }) {
  const { isHi } = useLanguage();
  const [tag, setTag] = useState('');
  const [breed, setBreed] = useState(isHi ? 'देशी' : 'Desi');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(isHi ? 'गाय' : 'Cow');
  const [health, setHealth] = useState(isHi ? 'स्वस्थ' : 'Healthy');

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
      date: new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-IN')
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 450 }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={20} color="var(--emerald)" />
            {isHi ? 'नया गोवंश पंजीकरण (New Cow Entry)' : 'New Cattle Registration'}
          </h3>
          <button className="icon-action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                {isHi ? 'UHF RFID / टैग नंबर *' : 'UHF RFID / Tag Number *'}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={isHi ? 'उदा. IN9820-5512' : 'e.g. IN9820-5512'}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                required
              />
            </div>

            <div className="grid-2col" style={{ gap: 12, marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">{isHi ? 'नस्ल (Breed)' : 'Breed'}</label>
                <select className="form-input" value={breed} onChange={(e) => setBreed(e.target.value)}>
                  <option value={isHi ? 'देशी' : 'Desi'}>{isHi ? 'देशी' : 'Desi'}</option>
                  <option value={isHi ? 'गीर' : 'Gir'}>{isHi ? 'गीर' : 'Gir'}</option>
                  <option value={isHi ? 'साहीवाल' : 'Sahiwal'}>{isHi ? 'साहीवाल' : 'Sahiwal'}</option>
                  <option value={isHi ? 'थारपारकर' : 'Tharparkar'}>{isHi ? 'थारपारकर' : 'Tharparkar'}</option>
                  <option value={isHi ? 'अन्य' : 'Other'}>{isHi ? 'अन्य' : 'Other'}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{isHi ? 'आयु (वर्षों में)' : 'Age (Years)'}</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder={isHi ? 'उदा. 4' : 'e.g. 4'}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col" style={{ gap: 12, marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">{isHi ? 'लिंग (Gender)' : 'Gender'}</label>
                <select className="form-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value={isHi ? 'गाय' : 'Cow'}>{isHi ? 'गाय' : 'Cow'}</option>
                  <option value={isHi ? 'बैल / नंदी' : 'Bull'}>{isHi ? 'बैल / नंदी' : 'Bull'}</option>
                  <option value={isHi ? 'बछड़ा / बछड़ी' : 'Calf'}>{isHi ? 'बछड़ा / बछड़ी' : 'Calf'}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{isHi ? 'स्वास्थ्य स्थिति' : 'Health Status'}</label>
                <select className="form-input" value={health} onChange={(e) => setHealth(e.target.value)}>
                  <option value={isHi ? 'स्वस्थ' : 'Healthy'}>{isHi ? 'स्वस्थ' : 'Healthy'}</option>
                  <option value={isHi ? 'कमजोर' : 'Weak'}>{isHi ? 'कमजोर' : 'Weak'}</option>
                  <option value={isHi ? 'बीमार (उपचार आवश्यक)' : 'Sick (Care Needed)'}>
                    {isHi ? 'बीमार (उपचार आवश्यक)' : 'Sick (Care Needed)'}
                  </option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <button type="submit" className="btn-gov emerald" style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={16} />
                {isHi ? 'गोवंश पंजीकृत करें (Submit)' : 'Register Cattle (Submit)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
