import React, { useState } from 'react';
import { ScrollText, Save, CheckCircle2, Shield } from 'lucide-react';
import { playSuccessSound } from '../../sound';

export default function AdminPolicy({ onShowToast }) {
  const [hara, setHara] = useState('15');
  const [sukha, setSukha] = useState('5');
  const [dana, setDana] = useState('1.5');
  const [grantRate, setGrantRate] = useState('40');
  const [feedCutoff, setFeedCutoff] = useState('09:00');
  const [immobilityHours, setImmobilityHours] = useState('4');
  const [missingTime, setMissingTime] = useState('18:00');

  const handleSaveRation = (e) => {
    e.preventDefault();
    playSuccessSound();
    onShowToast('✓ राशन मानक नीति सफलतापूर्वक राज्य-व्यापी अद्यतन की गई');
  };

  const handleSaveGrantRules = (e) => {
    e.preventDefault();
    playSuccessSound();
    onShowToast('✓ अनुदान एवं AI अलर्ट थ्रेशोल्ड नियम लागू किए गए');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">नीति एवं मानक नियमन (Policy & Norms Engine)</h2>
          <p className="page-desc">
            राज्य-व्यापी गो-आहार राशन मानक, प्रति गाय अनुदान दर और AI अलर्ट थ्रेशोल्ड नियमन
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Daily Ration Norms */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <ScrollText size={18} color="var(--emerald)" />
              प्रति गाय दैनिक राशन मानक (Daily Ration Standards)
            </h3>
          </div>
          <form onSubmit={handleSaveRation}>
            <div className="form-group">
              <label className="form-label">हरा चारा (Green Fodder) - kg / गाय / दिन</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={hara}
                onChange={(e) => setHara(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>अनुशंसित: 15-20 kg (नेपियर, बरसीम, ज्वार)</small>
            </div>

            <div className="form-group">
              <label className="form-label">सूखा चारा (Dry Fodder / Para) - kg / गाय / दिन</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={sukha}
                onChange={(e) => setSukha(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>अनुशंसित: 4-6 kg (धान का पैरा/भूसा)</small>
            </div>

            <div className="form-group">
              <label className="form-label">संतुलित दाना (Cattle Feed Concentrate) - kg / गाय / दिन</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={dana}
                onChange={(e) => setDana(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>अनुशंसित: 1.5-2.0 kg खनिज लवण युक्त</small>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn-gov emerald">
                <Save size={16} />
                राशन मानक सहेजें एवं लागू करें
              </button>
            </div>
          </form>
        </div>

        {/* Grant and Alert Rules */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Shield size={18} color="var(--saffron)" />
              अनुदान एवं AI अलर्ट नियमन (Grant & Vision Rules)
            </h3>
          </div>
          <form onSubmit={handleSaveGrantRules}>
            <div className="form-group">
              <label className="form-label">प्रति गाय प्रति दिन DBT अनुदान दर (₹)</label>
              <input
                type="number"
                className="form-input"
                value={grantRate}
                onChange={(e) => setGrantRate(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>वर्तमान शासकीय मानक: ₹ 40 / दिन</small>
            </div>

            <div className="form-group">
              <label className="form-label">चारा डालने की अंतिम समय-सीमा (Feed Trough Cutoff)</label>
              <input
                type="time"
                className="form-input"
                value={feedCutoff}
                onChange={(e) => setFeedCutoff(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>यदि 09:00 तक नांद खाली मिले, तो नोडल अधिकारी को अलर्ट</small>
            </div>

            <div className="form-group">
              <label className="form-label">अस्थिर/गिरी गाय अलर्ट समय (Immobility Hours)</label>
              <input
                type="number"
                className="form-input"
                value={immobilityHours}
                onChange={(e) => setImmobilityHours(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>लगातार 4 घंटे लेटे रहने पर वेटरनरी डॉक्टर को स्वतः SOS कॉल</small>
            </div>

            <div className="form-group">
              <label className="form-label">Missing Cow अलर्ट समय (Pasture Return Deadline)</label>
              <input
                type="time"
                className="form-input"
                value={missingTime}
                onChange={(e) => setMissingTime(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>चराई से 18:00 तक वापस न आने पर GPS ट्रैकर सक्रिय</small>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn-gov saffron">
                <Save size={16} />
                अनुदान एवं अलर्ट नियम लागू करें
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
