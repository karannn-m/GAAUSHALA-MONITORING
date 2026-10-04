import React from 'react';
import { Stethoscope, PlusCircle, AlertCircle, CheckCircle2, Pill } from 'lucide-react';

export default function ManagerHealth({ healthRecords, onOpenAddHealthModal }) {
  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">स्वास्थ्य एवं पशु चिकित्सा प्रबंधन (Veterinary Health Clinic)</h2>
          <p className="page-desc">
            गोवंश स्वास्थ्य निगरानी, रोग निदान, औषधि खुराक, FMD/HS-BQ टीकाकरण एवं आपातकालीन उपचार
          </p>
        </div>
        <button className="btn-gov emerald" onClick={onOpenAddHealthModal}>
          <PlusCircle size={16} />
          नया स्वास्थ्य / टीकाकरण दर्ज करें
        </button>
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <Stethoscope size={18} color="var(--emerald)" />
            सक्रिय पशु चिकित्सा एवं टीकाकरण रिकॉर्ड ({healthRecords.length})
          </h3>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>आईडी</th>
                <th>RFID इयर-टैग</th>
                <th>गाय का नाम / नस्ल</th>
                <th>लक्षण / रोग विवरण</th>
                <th>जाँचकर्ता पशु चिकित्सक</th>
                <th>दवा एवं खुराक (Dosage)</th>
                <th>आवास / शेड</th>
                <th>गंभीरता</th>
                <th>वर्तमान स्थिति</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((rec) => (
                <tr key={rec.id}>
                  <td><b style={{ fontFamily: 'var(--font-mono)' }}>{rec.id}</b></td>
                  <td><b style={{ color: 'var(--saffron)' }}>{rec.tag}</b></td>
                  <td>
                    <b>{rec.cowName}</b>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rec.breed}</div>
                  </td>
                  <td>{rec.condition}</td>
                  <td>{rec.vet}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Pill size={13} color="var(--emerald)" />
                      {rec.dosage}
                    </span>
                  </td>
                  <td>{rec.shed}</td>
                  <td>
                    <span className={`status-badge ${rec.severity === 'high' ? 'bad' : rec.severity === 'medium' ? 'warn' : 'ok'}`}>
                      {rec.severity === 'high' ? '🔴 गंभीर' : rec.severity === 'medium' ? '🟠 मध्यम' : '🟢 सामान्य'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${rec.status === 'स्वस्थ' || rec.status === 'टीकाकृत' ? 'ok' : 'warn'}`}>
                      {rec.status}
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
