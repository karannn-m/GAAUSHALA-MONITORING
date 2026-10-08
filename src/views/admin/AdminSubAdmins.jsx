import React from 'react';
import { Users, UserPlus, Phone, Shield, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSubAdmins({ subAdmins, onOpenAddModal }) {
  const { isHi } = useLanguage();

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi
              ? 'उप-प्रशासक एवं नोडल अधिकारी प्रबंधन (Zonal Officers)'
              : 'Sub-Admin & Zonal Nodal Officers'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'ज़ोन/जिला स्तर पर अधिकार नियंत्रित करें, औचक निरीक्षण टीमें गठित करें'
              : 'Manage zonal authority, audit quotas, and dispatch surprise inspection teams'}
          </p>
        </div>
        <button className="btn-gov saffron" onClick={onOpenAddModal}>
          <UserPlus size={16} />
          {isHi ? 'नया उप-प्रशासक जोड़ें' : 'Add New Sub-Admin'}
        </button>
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <Users size={18} color="var(--saffron)" />
            {isHi
              ? `सक्रिय ज़ोनल नोडल अधिकारी (${subAdmins.length})`
              : `Active Zonal Nodal Officers (${subAdmins.length})`}
          </h3>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{isHi ? 'आईडी' : 'ID'}</th>
                <th>{isHi ? 'अधिकारी का नाम' : 'Officer Name'}</th>
                <th>{isHi ? 'पदनाम' : 'Designation'}</th>
                <th>{isHi ? 'संबंधित ज़ोन' : 'Assigned Zone'}</th>
                <th>{isHi ? 'संपर्क नंबर' : 'Phone'}</th>
                <th>{isHi ? 'संबद्ध गौशालाएँ' : 'Mapped Gaushalas'}</th>
                <th>{isHi ? 'लंबित निरीक्षण' : 'Pending Audits'}</th>
                <th>{isHi ? 'सक्रिय मामले' : 'Active Cases'}</th>
                <th>{isHi ? 'कार्यवाही' : 'Action'}</th>
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
                  <td><b>{sub.gaushalaCount} {isHi ? 'गौशालाएँ' : 'Shelters'}</b></td>
                  <td>
                    <span className={`status-badge ${sub.pendingAudits > 0 ? 'warn' : 'ok'}`}>
                      {sub.pendingAudits} {isHi ? 'लंबित' : 'Pending'}
                    </span>
                  </td>
                  <td><b>{sub.activeCases}</b></td>
                  <td>
                    <button
                      className="btn-gov outline btn-sm"
                      onClick={() =>
                        alert(
                          isHi
                            ? `${sub.name} (${sub.zone}) को सतर्कता निर्देश प्रेषित किए गए`
                            : `Vigilance directives dispatched to ${sub.name} (${sub.zone})`
                        )
                      }
                    >
                      {isHi ? 'निर्देश भेजें' : 'Send Directives'}
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
