import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, UserCheck, PhoneCall } from 'lucide-react';
import { playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function SubAlerts({ alerts, onShowToast, onUpdateAlertStatus }) {
  const { isHi } = useLanguage();

  const handleAssignInspection = (alertItem) => {
    playSuccessSound();
    onShowToast(
      isHi
        ? `✓ ${alertItem.title} हेतु नोडल निरीक्षण टीम (2 सदस्य) रवाना की गई`
        : `✓ Nodal inspection team (2 officers) dispatched for ${alertItem.title}`
    );
    if (onUpdateAlertStatus) {
      onUpdateAlertStatus(alertItem.id, 'assigned', isHi ? 'निरीक्षण टीम को असाइन किया गया' : 'Assigned to Inspection Team');
    }
  };

  const handleAcknowledge = (alertItem) => {
    playSuccessSound();
    onShowToast(isHi ? `✓ अलर्ट संज्ञान में लिया गया: ${alertItem.title}` : `✓ Alert acknowledged: ${alertItem.title}`);
    if (onUpdateAlertStatus) {
      onUpdateAlertStatus(alertItem.id, 'acknowledged', isHi ? 'स्वीकृत एवं निगरानी में' : 'Acknowledged & Under Monitoring');
    }
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'ज़ोन अलर्ट एवं औचक निरीक्षण (Alerts & Inspections)' : 'Zone Alerts & Surprise Inspections'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'AI अलर्ट की समीक्षा करें, औचक निरीक्षण टीम भेजें और रिपोर्ट दर्ज करें'
              : 'Review AI alerts, dispatch inspection teams and record verification logs'}
          </p>
        </div>
      </div>

      <div className="dash-card">
        <div className="card-title-row">
          <h3>
            <ShieldAlert size={18} color="var(--red-alert)" />
            {isHi ? `सक्रिय ज़ोन अलर्ट (${alerts.length})` : `Active Zone Alerts (${alerts.length})`}
          </h3>
        </div>

        <div className="alert-feed-list">
          {alerts.map((a) => (
            <div key={a.id} className={`alert-feed-item ${a.type || 'info'}`} style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <b style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                    {isHi ? (a.titleHi || a.title) : (a.titleEn || a.title)}
                  </b>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {isHi ? (a.descHi || a.desc) : (a.descEn || a.desc)}
                  </div>
                  {a.actionTaken && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: 4, fontWeight: 600 }}>
                      ✓ {isHi ? 'स्थिति:' : 'Status:'}{' '}
                      {isHi ? (a.actionTakenHi || a.actionTaken) : (a.actionTakenEn || a.actionTaken)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {a.time}
                  </span>
                  <div style={{ marginTop: 4 }}>
                    <span className={`status-badge ${a.status === 'resolved' ? 'ok' : a.status === 'assigned' ? 'info' : 'bad'}`}>
                      {a.status === 'resolved'
                        ? (isHi ? 'निस्तारित' : 'Resolved')
                        : a.status === 'assigned'
                        ? (isHi ? 'टीम तैनात' : 'Team Deployed')
                        : (isHi ? 'कार्रवाई लंबित' : 'Action Pending')}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                <button
                  className="btn-gov outline btn-sm"
                  onClick={() => alert(isHi ? `गौशाला प्रबंधक को कॉल की जा रही है: +91 98261 44521` : `Calling Gaushala Manager: +91 98261 44521`)}
                >
                  <PhoneCall size={14} />
                  {isHi ? 'प्रबंधक को कॉल करें' : 'Call Manager'}
                </button>
                <button
                  className="btn-gov outline btn-sm"
                  onClick={() => handleAcknowledge(a)}
                >
                  {isHi ? 'स्वीकार करें' : 'Acknowledge'}
                </button>
                <button
                  className="btn-gov saffron btn-sm"
                  onClick={() => handleAssignInspection(a)}
                >
                  <UserCheck size={14} />
                  {isHi ? 'औचक निरीक्षण टीम असाइन करें' : 'Assign Inspection Team'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
