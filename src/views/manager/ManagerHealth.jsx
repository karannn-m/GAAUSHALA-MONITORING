import React from 'react';
import { Stethoscope, PlusCircle, AlertCircle, CheckCircle2, Pill } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagerHealth({ healthRecords, onOpenAddHealthModal }) {
  const { isHi } = useLanguage();

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'स्वास्थ्य एवं पशु चिकित्सा प्रबंधन (Veterinary Health Clinic)' : 'Veterinary Health & Medical Clinic'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'गोवंश स्वास्थ्य निगरानी, रोग निदान, औषधि खुराक, FMD/HS-BQ टीकाकरण एवं आपातकालीन उपचार'
              : 'Cattle health surveillance, diagnosis, medications, FMD/HS-BQ vaccinations and emergency care'}
          </p>
        </div>
        <button className="btn-gov emerald" onClick={onOpenAddHealthModal}>
          <PlusCircle size={16} />
          {isHi ? 'नया स्वास्थ्य / टीकाकरण दर्ज करें' : 'Record New Health / Vaccination'}
        </button>
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <Stethoscope size={18} color="var(--emerald)" />
            {isHi ? `सक्रिय पशु चिकित्सा एवं टीकाकरण रिकॉर्ड (${healthRecords.length})` : `Active Veterinary & Vaccination Records (${healthRecords.length})`}
          </h3>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{isHi ? 'आईडी' : 'ID'}</th>
                <th>{isHi ? 'RFID इयर-टैग' : 'RFID Ear-Tag'}</th>
                <th>{isHi ? 'गाय का नाम / नस्ल' : 'Name / Breed'}</th>
                <th>{isHi ? 'लक्षण / रोग विवरण' : 'Condition / Symptoms'}</th>
                <th>{isHi ? 'जाँचकर्ता पशु चिकित्सक' : 'Examining Vet'}</th>
                <th>{isHi ? 'दवा एवं खुराक (Dosage)' : 'Medicine & Dosage'}</th>
                <th>{isHi ? 'आवास / शेड' : 'Shed / Barn'}</th>
                <th>{isHi ? 'गंभीरता' : 'Severity'}</th>
                <th>{isHi ? 'वर्तमान स्थिति' : 'Current Status'}</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((rec) => (
                <tr key={rec.id}>
                  <td><b style={{ fontFamily: 'var(--font-mono)' }}>{rec.id}</b></td>
                  <td><b style={{ color: 'var(--saffron)' }}>{rec.tag}</b></td>
                  <td>
                    <b>{isHi ? (rec.cowNameHi || rec.cowName) : (rec.cowNameEn || rec.cowName)}</b>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {isHi ? (rec.breedHi || rec.breed) : (rec.breedEn || rec.breed)}
                    </div>
                  </td>
                  <td>{isHi ? (rec.conditionHi || rec.condition) : (rec.conditionEn || rec.condition)}</td>
                  <td>{isHi ? (rec.vetHi || rec.vet) : (rec.vetEn || rec.vet)}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Pill size={13} color="var(--emerald)" />
                      {isHi ? (rec.dosageHi || rec.dosage) : (rec.dosageEn || rec.dosage)}
                    </span>
                  </td>
                  <td>{rec.shed}</td>
                  <td>
                    <span className={`status-badge ${rec.severity === 'high' ? 'bad' : rec.severity === 'medium' ? 'warn' : 'ok'}`}>
                      {rec.severity === 'high'
                        ? (isHi ? '🔴 गंभीर' : '🔴 Critical')
                        : rec.severity === 'medium'
                        ? (isHi ? '🟠 मध्यम' : '🟠 Moderate')
                        : (isHi ? '🟢 सामान्य' : '🟢 Normal')}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${rec.status === 'स्वस्थ' || rec.status === 'Healthy' || rec.status === 'टीकाकृत' || rec.status === 'Vaccinated' ? 'ok' : 'warn'}`}>
                      {rec.status === 'स्वस्थ' || rec.status === 'Healthy'
                        ? (isHi ? 'स्वस्थ' : 'Healthy')
                        : rec.status === 'टीकाकृत' || rec.status === 'Vaccinated'
                        ? (isHi ? 'टीकाकृत' : 'Vaccinated')
                        : (isHi ? 'उपचाराधीन' : 'Under Treatment')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
