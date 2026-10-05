import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Admin Views
import AdminDashboard from './views/admin/AdminDashboard';
import AdminGrants from './views/admin/AdminGrants';
import AdminAudit from './views/admin/AdminAudit';
import AdminSubAdmins from './views/admin/AdminSubAdmins';
import AdminPolicy from './views/admin/AdminPolicy';
import AdminPublic from './views/admin/AdminPublic';
import AdvancedFeatures from './views/admin/AdvancedFeatures';

// Sub-Admin Views
import SubZoneMonitor from './views/sub/SubZoneMonitor';
import SubAlerts from './views/sub/SubAlerts';
import SubVerification from './views/sub/SubVerification';
import SubZoneReports from './views/sub/SubZoneReports';

// Manager Views
import ManagerDashboard from './views/manager/ManagerDashboard';
import ManagerCCTV from './views/manager/ManagerCCTV';
import ManagerGateRFID from './views/manager/ManagerGateRFID';
import ManagerFeedStock from './views/manager/ManagerFeedStock';
import ManagerHealth from './views/manager/ManagerHealth';
import ManagerPerimeter from './views/manager/ManagerPerimeter';

// Modals
import GrantApprovalModal from './components/Modals/GrantApprovalModal';
import PhotoProofModal from './components/Modals/PhotoProofModal';
import AuditReportModal from './components/Modals/AuditReportModal';
import AddHealthModal from './components/Modals/AddHealthModal';
import AddSubAdminModal from './components/Modals/AddSubAdminModal';
import AddCowModal from './components/Modals/AddCowModal';

// Data & Sound
import {
  INITIAL_GAUSHALAS,
  INITIAL_ALERTS,
  SUB_ADMINS_LIST,
  VET_HEALTH_RECORDS
} from './data/portalData';
import { playNotificationSound, playAlertWarningSound } from './sound';

const NEW_TICKER_ALERTS = [
  { type: 'warning', title: 'अनधिकृत वाहन प्रवेश – ANPR मिलान विफल', desc: 'गोपाल गौशाला, दुर्ग गेट नं. 2' },
  { type: 'info', title: 'चारा स्टॉक 30% से नीचे – बस्तर', desc: 'AI Ration Engine द्वारा स्वतः इंडेंट' },
  { type: 'info', title: 'नई हेडकाउंट गणना सत्यापित – 233/240', desc: 'दुर्ग गौशाला · Auto Edge-Headcount' },
  { type: 'critical', title: 'बीमार गाय पहचानी गई – Tag IN9820-5512', desc: 'आरंग · Shed-C (लंगड़ापन पहचान)' },
];

export default function App() {
  const [role, setRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('dash');
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core Data States
  const [gaushalas, setGaushalas] = useState(INITIAL_GAUSHALAS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [subAdmins, setSubAdmins] = useState(SUB_ADMINS_LIST);
  const [healthRecords, setHealthRecords] = useState(VET_HEALTH_RECORDS);
  const [stock, setStock] = useState({ hara: 4200, sukha: 1500, dana: 380 });

  const [grants, setGrants] = useState(() => [
    { g: INITIAL_GAUSHALAS[0], amt: '₹ 6.12 L', st: 'लंबित' },
    { g: INITIAL_GAUSHALAS[1], amt: '₹ 5.40 L', st: 'लंबित' },
    { g: INITIAL_GAUSHALAS[4], amt: '₹ 4.50 L', st: 'लंबित' },
    { g: INITIAL_GAUSHALAS[3], amt: '₹ 7.00 L', st: 'स्वीकृत' },
  ]);

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastMsg('');
    }, 3200);
  };

  // Modals state
  const [grantModalItem, setGrantModalItem] = useState(null);
  const [photoProofData, setPhotoProofData] = useState(null);
  const [auditModalData, setAuditModalData] = useState(null);
  const [adoptionCow, setAdoptionCow] = useState(null);
  const [addHealthModalOpen, setAddHealthModalOpen] = useState(false);
  const [addSubAdminModalOpen, setAddSubAdminModalOpen] = useState(false);
  const [addCowModalOpen, setAddCowModalOpen] = useState(false);

  // Default tab switcher per role
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') setActiveTab('dash');
    else if (newRole === 'sub') setActiveTab('zone');
    else if (newRole === 'mgr') setActiveTab('mdash');
  };

  // Background Live Alert simulation
  const tickerIdx = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const template = NEW_TICKER_ALERTS[tickerIdx.current % NEW_TICKER_ALERTS.length];
      tickerIdx.current++;

      const newAlert = {
        id: 'ALT-' + Math.floor(200 + Math.random() * 800),
        type: template.type,
        title: template.title,
        desc: template.desc,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      };

      setAlerts((prev) => [newAlert, ...prev].slice(0, 15));
      showToast(`🔔 नया AI अलर्ट: ${template.title}`);
      if (soundEnabled) {
        if (template.type === 'critical') playAlertWarningSound();
        else playNotificationSound();
      }
    }, 16000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Stock deduction / addition
  const handleDeductStock = (cows) => {
    setStock((prev) => ({
      hara: Math.max(0, prev.hara - cows * 15),
      sukha: Math.max(0, prev.sukha - cows * 5),
      dana: Math.max(0, prev.dana - cows * 1.5),
    }));
    showToast(`✓ ${cows} गायों के राशन अनुसार गोदाम स्टॉक से स्वतः कटौती की गई`);
  };

  const handleAddStock = (itemKey, amount) => {
    setStock((prev) => ({
      ...prev,
      [itemKey]: prev[itemKey] + amount
    }));
  };

  // Grant Approval Action
  const handleConfirmGrant = (index, status, txnId) => {
    setGrants((prev) =>
      prev.map((g, idx) =>
        idx === index ? { ...g, st: status, txnId } : g
      )
    );
    showToast(status === 'स्वीकृत' ? `✓ DBT अनुदान स्वीकृत! सं. ${txnId || ''}` : 'अनुदान रोका गया');
  };

  const handleRejectGrant = (index) => {
    setGrants((prev) =>
      prev.map((g, idx) =>
        idx === index ? { ...g, st: 'रोका गया' } : g
      )
    );
    showToast('अनुदान रोका गया – भौतिक निरीक्षण अनुशंसित');
  };

  return (
    <div className="portal-container" data-theme={theme}>
      {/* Header */}
      <Header
        role={role}
        onRoleChange={handleRoleChange}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        soundEnabled={soundEnabled}
        onSoundToggle={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          showToast(next ? '🔊 ध्वनि चालू (Audio On)' : '🔇 ध्वनि म्यूट (Audio Muted)');
        }}
        alerts={alerts}
        onAlertClick={(alertItem) => {
          showToast(`अलर्ट: ${alertItem.title}`);
        }}
      />

      {/* Main Body */}
      <div className="portal-body">
        {/* Dynamic Sidebar */}
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabSelect={(tabId) => setActiveTab(tabId)}
        />

        {/* Dynamic Views based on Role and active Tab */}
        <main className="portal-main">
          {/* Admin Views */}
          {role === 'admin' && activeTab === 'dash' && (
            <AdminDashboard
              gaushalas={gaushalas}
              alerts={alerts}
              onOpenAuditModal={(item) => setAuditModalData(item)}
              onOpenGrantModal={(item) => setGrantModalItem(item)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
          {role === 'admin' && activeTab === 'grants' && (
            <AdminGrants
              grants={grants}
              onOpenGrantModal={(item) => setGrantModalItem(item)}
              onRejectGrant={handleRejectGrant}
            />
          )}
          {role === 'admin' && activeTab === 'audit' && (
            <AdminAudit
              gaushalas={gaushalas}
              onOpenAuditModal={(item) => setAuditModalData(item)}
            />
          )}
          {role === 'admin' && activeTab === 'sub' && (
            <AdminSubAdmins
              subAdmins={subAdmins}
              onOpenAddModal={() => setAddSubAdminModalOpen(true)}
            />
          )}
          {role === 'admin' && activeTab === 'policy' && (
            <AdminPolicy onShowToast={showToast} />
          )}
          {role === 'admin' && activeTab === 'pub' && (
            <AdminPublic
              onOpenPhotoModal={(data) => setPhotoProofData(data)}
              onShowToast={showToast}
            />
          )}
          {role === 'admin' && activeTab === 'ai' && (
            <AdvancedFeatures onShowToast={showToast} />
          )}

          {/* Sub-Admin Views */}
          {role === 'sub' && activeTab === 'zone' && (
            <SubZoneMonitor
              gaushalas={gaushalas}
              onOpenPhotoModal={(data) => setPhotoProofData(data)}
              onShowToast={showToast}
            />
          )}
          {role === 'sub' && activeTab === 'alerts' && (
            <SubAlerts
              alerts={alerts}
              onShowToast={showToast}
              onUpdateAlertStatus={(id, status, action) => {
                setAlerts((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, status, actionTaken: action } : a
                  )
                );
              }}
            />
          )}
          {role === 'sub' && activeTab === 'verify' && (
            <SubVerification
              gaushalas={gaushalas}
              onOpenPhotoModal={(data) => setPhotoProofData(data)}
              onShowToast={showToast}
            />
          )}
          {role === 'sub' && activeTab === 'zrep' && (
            <SubZoneReports onShowToast={showToast} />
          )}

          {/* Gaushala Manager Views */}
          {role === 'mgr' && activeTab === 'mdash' && (
            <ManagerDashboard
              alerts={alerts}
              stock={stock}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddCowModal={() => setAddCowModalOpen(true)}
            />
          )}
          {role === 'mgr' && activeTab === 'cctv' && (
            <ManagerCCTV
              onOpenPhotoModal={(data) => setPhotoProofData(data)}
              onShowToast={showToast}
            />
          )}
          {role === 'mgr' && activeTab === 'gate' && (
            <ManagerGateRFID
              onOpenPhotoModal={(data) => setPhotoProofData(data)}
              onShowToast={showToast}
            />
          )}
          {role === 'mgr' && activeTab === 'feed' && (
            <ManagerFeedStock
              stock={stock}
              onDeductStock={handleDeductStock}
              onAddStock={handleAddStock}
              onShowToast={showToast}
            />
          )}
          {role === 'mgr' && activeTab === 'health' && (
            <ManagerHealth
              healthRecords={healthRecords}
              onOpenAddHealthModal={() => setAddHealthModalOpen(true)}
            />
          )}
          {role === 'mgr' && activeTab === 'perim' && (
            <ManagerPerimeter onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMsg && <div className="portal-toast">{toastMsg}</div>}

      {/* Modals Container */}
      {grantModalItem && (
        <GrantApprovalModal
          grantItem={grantModalItem}
          onClose={() => setGrantModalItem(null)}
          onConfirm={handleConfirmGrant}
        />
      )}

      {photoProofData && (
        <PhotoProofModal
          proofData={photoProofData}
          onClose={() => setPhotoProofData(null)}
        />
      )}

      {auditModalData && (
        <AuditReportModal
          auditData={auditModalData}
          onClose={() => setAuditModalData(null)}
        />
      )}

      {addHealthModalOpen && (
        <AddHealthModal
          onClose={() => setAddHealthModalOpen(false)}
          onAddRecord={(rec) => {
            setHealthRecords((prev) => [rec, ...prev]);
            showToast(`✓ नया स्वास्थ्य रिकॉर्ड दर्ज: ${rec.cowName} (${rec.tag})`);
          }}
        />
      )}

      {addSubAdminModalOpen && (
        <AddSubAdminModal
          onClose={() => setAddSubAdminModalOpen(false)}
          onAddOfficer={(officer) => {
            setSubAdmins((prev) => [...prev, officer]);
            showToast(`✓ नया उप-प्रशासक असाइन किया गया: ${officer.name} (${officer.zone})`);
          }}
        />
      )}

      {addCowModalOpen && (
        <AddCowModal
          onClose={() => setAddCowModalOpen(false)}
          onAddCow={(cow) => {
            // Updating the first gaushala's count to simulate system update
            setGaushalas(prev => prev.map((g, i) => i === 0 ? { ...g, reg: g.reg + 1, ver: g.ver + 1 } : g));
            showToast(`✓ नया गोवंश (${cow.tag}) गौशाला में सफलतापूर्वक पंजीकृत किया गया। सिस्टम अपडेटेड!`);
          }}
        />
      )}
    </div>
  );
}
