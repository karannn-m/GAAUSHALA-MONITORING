import React, { useState } from 'react';
import { Users, UserPlus, Phone, Shield, MapPin } from 'lucide-react';

export default function AdminSubAdmins({ subAdmins, onOpenAddModal }) {
  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">उप-प्रशासक एवं नोडल अधिकारी प्रबंधन (Zonal Officers)</h2>
          <p className="page-desc">
            ज़ोन/जिला स्तर पर अधिकार नियंत्रित करें, औचक निरीक्षण टीमें गठित करें
          </p>
        </div>
        <button className="btn-gov saffron" onClick={onOpenAddModal}>
          <UserPlus size={16} />
          नया उप-प्रशासक जोड़ें
        </button>
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <Users size={18} color="var(--saffron)" />
            सक्रिय ज़ोनल नोडल अधिकारी ({subAdmins.length})
          </h3>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>आईडी</th>
                <th>अधिकारी का नाम</th>
                <th>पदनाम</th>
                <th>संबंधित ज़ोन</th>
                <th>संपर्क नंबर</th>
                <th>संबद्ध गौशालाएँ</th>
                <th>लंबित निरीक्षण</th>
                <th>सक्रिय मामले</th>
                <th>कार्यवाही</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map((sub) => (
                <tr key={sub.id}>
                  <td><b style={{ fontFamily: 'var(--font-mono)' }}>{sub.id}</b></td>
                  <td><b>{sub.name}</b></td>
                  <td>{sub.title}</td>
                  <td>
                    <span className="status-badge info">{sub.zone}</span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                      <Phone size={13} color="var(--text-muted)" />
                      {sub.phone}
                    </span>
                  </td>
                  <td><b>{sub.gaushalaCount} गौशालाएँ</b></td>
                  <td>
                    <span className={`status-badge ${sub.pendingAudits > 0 ? 'warn' : 'ok'}`}>
                      {sub.pendingAudits} लंबित
                    </span>
                  </td>
                  <td><b>{sub.activeCases}</b></td>
                  <td>
                    <button
                      className="btn-gov outline btn-sm"
                      onClick={() => alert(`${sub.name} (${sub.zone}) को सतर्कता निर्देश प्रेषित किए गए`)}
                    >
                      निर्देश भेजें
                    </button>
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
