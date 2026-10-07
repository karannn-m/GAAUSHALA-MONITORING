import React, { useState } from 'react';
import { ScrollText, Save, CheckCircle2, Shield } from 'lucide-react';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminPolicy({ onShowToast }) {
  const { isHi } = useLanguage();
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
    onShowToast(
      isHi
        ? '✓ राशन मानक नीति सफलतापूर्वक राज्य-व्यापी अद्यतन की गई'
        : '✓ Ration standard policy updated state-wide successfully'
    );
  };

  const handleSaveGrantRules = (e) => {
    e.preventDefault();
    playSuccessSound();
    onShowToast(
      isHi
        ? '✓ अनुदान एवं AI अलर्ट थ्रेशोल्ड नियम लागू किए गए'
        : '✓ Grant & AI alert threshold rules enforced'
    );
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'नीति एवं मानक नियमन (Policy & Norms Engine)' : 'Policy & Norms Engine'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'राज्य-व्यापी गो-आहार राशन मानक, प्रति गाय अनुदान दर और AI अलर्ट थ्रेशोल्ड नियमन'
              : 'State-wide cattle ration norms, per-cow grant rates, and AI vision threshold settings'}
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Daily Ration Norms */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <ScrollText size={18} color="var(--emerald)" />
              {isHi
                ? 'प्रति गाय दैनिक राशन मानक (Daily Ration Standards)'
                : 'Daily Cattle Ration Standards'}
            </h3>
          </div>
          <form onSubmit={handleSaveRation}>
            <div className="form-group">
              <label className="form-label">
                {isHi ? 'हरा चारा (Green Fodder) - kg / गाय / दिन' : 'Green Fodder - kg / cow / day'}
              </label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={hara}
                onChange={(e) => setHara(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi
                  ? 'अनुशंसित: 15-20 kg (नेपियर, बरसीम, ज्वार)'
                  : 'Recommended: 15-20 kg (Napier, Berseem, Jowar)'}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'सूखा चारा (Dry Fodder / Para) - kg / गाय / दिन' : 'Dry Fodder / Straw - kg / cow / day'}
              </label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={sukha}
                onChange={(e) => setSukha(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi ? 'अनुशंसित: 4-6 kg (धान का पैरा/भूसा)' : 'Recommended: 4-6 kg (Paddy Straw / Husk)'}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'संतुलित दाना (Cattle Feed Concentrate) - kg / गाय / दिन' : 'Concentrate Feed - kg / cow / day'}
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={dana}
                onChange={(e) => setDana(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi ? 'अनुशंसित: 1.5-2.0 kg खनिज लवण युक्त' : 'Recommended: 1.5-2.0 kg mineral fortified'}
              </small>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn-gov emerald">
                <Save size={16} />
                {isHi ? 'राशन मानक सहेजें एवं लागू करें' : 'Save & Enforce Ration Norms'}
              </button>
            </div>
          </form>
        </div>

        {/* Grant and Alert Rules */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Shield size={18} color="var(--saffron)" />
              {isHi
                ? 'अनुदान एवं AI अलर्ट नियमन (Grant & Vision Rules)'
                : 'Grant & AI Vision Alert Rules'}
            </h3>
          </div>
          <form onSubmit={handleSaveGrantRules}>
            <div className="form-group">
              <label className="form-label">
                {isHi ? 'प्रति गाय प्रति दिन DBT अनुदान दर (₹)' : 'Daily DBT Grant Rate per Cow (₹)'}
              </label>
              <input
                type="number"
                className="form-input"
                value={grantRate}
                onChange={(e) => setGrantRate(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi ? 'वर्तमान शासकीय मानक: ₹ 40 / दिन' : 'Current Govt Norm: ₹ 40 / day'}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'चारा डालने की अंतिम समय-सीमा (Feed Trough Cutoff)' : 'Feed Trough Cutoff Time'}
              </label>
              <input
                type="time"
                className="form-input"
                value={feedCutoff}
                onChange={(e) => setFeedCutoff(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi
                  ? 'यदि 09:00 तक नांद खाली मिले, तो नोडल अधिकारी को अलर्ट'
                  : 'Alert nodal officer if trough empty by 09:00 AM'}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'अस्थिर/गिरी गाय अलर्ट समय (Immobility Hours)' : 'Immobility Detection Cutoff (Hours)'}
              </label>
              <input
                type="number"
                className="form-input"
                value={immobilityHours}
                onChange={(e) => setImmobilityHours(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi
                  ? 'लगातार 4 घंटे लेटे रहने पर वेटरनरी डॉक्टर को स्वतः SOS कॉल'
                  : 'Auto SOS call to vet doctor if continuous recumbency exceeds 4h'}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHi ? 'Missing Cow अलर्ट समय (Pasture Return Deadline)' : 'Missing Cow Pasture Return Deadline'}
              </label>
              <input
                type="time"
                className="form-input"
                value={missingTime}
                onChange={(e) => setMissingTime(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>
                {isHi
                  ? 'चराई से 18:00 तक वापस न आने पर GPS ट्रैकर सक्रिय'
                  : 'Activate LoRaWAN/GPS tracker if unreturned by 18:00'}
              </small>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn-gov saffron">
                <Save size={16} />
                {isHi ? 'अनुदान एवं अलर्ट नियम लागू करें' : 'Enforce Grant & Alert Rules'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
