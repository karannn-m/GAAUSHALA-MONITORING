import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, UserCheck, PhoneCall } from 'lucide-react';
import { playSuccessSound } from '../../sound';

export default function SubAlerts({ alerts, onShowToast, onUpdateAlertStatus }) {
  const handleAssignInspection = (alertItem) => {
    playSuccessSound();
    onShowToast(`✓ ${alertItem.title} हेतु नोडल निरीक्षण टीम (2 सदस्य) रवाना की गई`);
    if (onUpdateAlertStatus) {
      onUpdateAlertStatus(alertItem.id, 'assigned', 'निरीक्षण टीम को असाइन किया गया');
    }
  };

  const handleAcknowledge = (alertItem) => {
    playSuccessSound();
    onShowToast(`✓ अलर्ट संज्ञान में लिया गया: ${alertItem.title}`);
    if (onUpdateAlertStatus) {
      onUpdateAlertStatus(alertItem.id, 'acknowledged', 'स्वीकृत एवं निगरानी में');
    }
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">ज़ोन अलर्ट एवं औचक निरीक्षण (Alerts & Inspections)</h2>
          <p className="page-desc">
            AI अलर्ट की समीक्षा करें, औचक निरीक्षण टीम भेजें और रिपोर्ट दर्ज करें
          </p>
        </div>
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <ShieldAlert size={18} color="var(--red-alert)" />
            सक्रिय ज़ोन अलर्ट ({alerts.length})
          </h3>
        </div>

        <div className="alert-feed-list">
          {alerts.map((a) => (
            <div key={a.id} className={`alert-feed-item ${a.type || 'info'}`} style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <b style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>{a.title}</b>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {a.desc}
                  </div>
                  {a.actionTaken && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: 4, fontWeight: 600 }}>
                      ✓ स्थिति: {a.actionTaken}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {a.time}
                  </span>
                  <div style={{ marginTop: 4 }}>
                    <span className={`status-badge ${a.status === 'resolved' ? 'ok' : a.status === 'assigned' ? 'info' : 'bad'}`}>
                      {a.status === 'resolved' ? 'निस्तारित' : a.status === 'assigned' ? 'टीम तैनात' : 'कार्रवाई लंबित'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                <button
                  className="btn-gov outline btn-sm"
                  onClick={() => alert(`गौशाला प्रबंधक को कॉल की जा रही है: +91 98261 44521`)}
                >
                  <PhoneCall size={14} />
                  प्रबंधक को कॉल करें
                </button>
                <button
                  className="btn-gov outline btn-sm"
                  onClick={() => handleAcknowledge(a)}
                >
                  स्वीकार करें
                </button>
                <button
                  className="btn-gov saffron btn-sm"
                  onClick={() => handleAssignInspection(a)}
                >
                  <UserCheck size={14} />
                  औचक निरीक्षण टीम असाइन करें
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
