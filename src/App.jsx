import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Auth View
import Login from './views/auth/Login';

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

import axios from 'axios';
import { playNotificationSound, playAlertWarningSound } from './sound';
import { useLanguage } from './context/LanguageContext';

import { io } from 'socket.io-client';

export default function App() {
  const { isHi } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [role, setRole] = useState(user?.role ? (user.role === 'ADMIN' ? 'admin' : (user.role === 'SUB_ADMIN' ? 'sub' : 'mgr')) : 'admin');
  
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core Data States
  const [gaushalas, setGaushalas] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [stock, setStock] = useState({ hara: 0, sukha: 0, dana: 0 });

  const [grants, setGrants] = useState([]);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gRes, aRes, sRes, hRes, stockRes] = await Promise.all([
          axios.get(import.meta.env.VITE_BACKEND_URL + '/api/gaushalas' || 'http://localhost:3000/api/gaushalas').catch(() => ({ data: { data: [] } })),
          axios.get(import.meta.env.VITE_BACKEND_URL + '/api/alerts' || 'http://localhost:3000/api/alerts').catch(() => ({ data: { data: [] } })),
          axios.get(import.meta.env.VITE_BACKEND_URL + '/api/sub-admins' || 'http://localhost:3000/api/sub-admins').catch(() => ({ data: { data: [] } })),
          axios.get(import.meta.env.VITE_BACKEND_URL + '/api/health-records' || 'http://localhost:3000/api/health-records').catch(() => ({ data: { data: [] } })),
          axios.get(import.meta.env.VITE_BACKEND_URL + '/api/stock' || 'http://localhost:3000/api/stock').catch(() => ({ data: { data: { hara: 0, sukha: 0, dana: 0 } } }))
        ]);

        if (gRes.data.data.length > 0) setGaushalas(gRes.data.data);
        if (aRes.data.data.length > 0) setAlerts(aRes.data.data);
        if (sRes.data.data.length > 0) setSubAdmins(sRes.data.data);
        if (hRes.data.data.length > 0) setHealthRecords(hRes.data.data);
        if (stockRes.data.data) setStock(stockRes.data.data);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

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

  // Sync auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIsAuthenticated(!!token);
    if (storedUser) {
      setUser(storedUser);
      setRole(storedUser.role === 'ADMIN' ? 'admin' : (storedUser.role === 'SUB_ADMIN' ? 'sub' : 'mgr'));
    }
  }, [location.pathname]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') navigate('/admin/dashboard');
    else if (newRole === 'sub') navigate('/sub/zone');
    else if (newRole === 'mgr') navigate('/manager/dashboard');
  };

  // Background Live Alert simulation
  // Real-time WebSocket connection for alerts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to backend WebSocket
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
      auth: { token }
    });

    socket.on('new_alert', (alertMsg) => {
      const newAlert = {
        id: alertMsg.id || 'ALT-' + Math.floor(200 + Math.random() * 800),
        type: alertMsg.type || 'info',
        titleHi: alertMsg.titleHi || alertMsg.title || alertMsg.message,
        titleEn: alertMsg.titleEn || alertMsg.title || alertMsg.message,
        title: alertMsg.title || alertMsg.message,
        descHi: alertMsg.descHi || alertMsg.message || '',
        descEn: alertMsg.descEn || alertMsg.message || '',
        desc: alertMsg.message || '',
        time: new Date().toLocaleTimeString(isHi ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      };

      setAlerts((prev) => [newAlert, ...prev].slice(0, 15));
      showToast(isHi ? `🔔 नया अलर्ट: ${newAlert.titleHi}` : `🔔 New Alert: ${newAlert.titleEn}`);
      
      if (soundEnabled) {
        if (newAlert.type === 'critical' || newAlert.type === 'warning') playAlertWarningSound();
        else playNotificationSound();
      }
    });

    return () => socket.disconnect();
  }, [soundEnabled, isHi, isAuthenticated]);


  // Stock deduction / addition
  const handleDeductStock = (cows) => {
    setStock((prev) => ({
      hara: Math.max(0, prev.hara - cows * 15),
      sukha: Math.max(0, prev.sukha - cows * 5),
      dana: Math.max(0, prev.dana - cows * 1.5),
    }));
    showToast(isHi ? `✓ ${cows} गायों के राशन अनुसार गोदाम स्टॉक से स्वतः कटौती की गई` : `✓ Auto-deducted warehouse stock for ${cows} cows ration`);
  };

  const handleAddStock = (itemKey, amount) => {
    setStock((prev) => ({
      ...prev,
      [itemKey]: prev[itemKey] + amount
    }));
  };

  const handleConfirmGrant = (index, status, txnId) => {
    setGrants((prev) => prev.map((g, idx) => idx === index ? { ...g, st: status, txnId } : g));
    showToast(status === 'स्वीकृत' || status === 'Approved' ? (isHi ? `✓ DBT अनुदान स्वीकृत! सं. ${txnId || ''}` : `✓ DBT Grant Approved! Ref: ${txnId || ''}`) : (isHi ? 'अनुदान रोका गया' : 'Grant Withheld'));
  };

  const handleRejectGrant = (index) => {
    setGrants((prev) => prev.map((g, idx) => idx === index ? { ...g, st: isHi ? 'रोका गया' : 'Held' } : g));
    showToast(isHi ? 'अनुदान रोका गया – भौतिक निरीक्षण अनुशंसित' : 'Grant Withheld – On-site inspection recommended');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={
        !isAuthenticated ? (
          <Navigate to="/login" replace />
        ) : (
          <div className="portal-container" data-theme={theme}>
            <Header
              role={role}
              onRoleChange={handleRoleChange}
              theme={theme}
              onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              soundEnabled={soundEnabled}
              onSoundToggle={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                showToast(next ? (isHi ? '🔊 ध्वनि चालू (Audio On)' : '🔊 Audio Enabled') : (isHi ? '🔇 ध्वनि म्यूट (Audio Muted)' : '🔇 Audio Muted'));
              }}
              alerts={alerts}
              onAlertClick={(alertItem) => showToast(isHi ? `अलर्ट: ${alertItem.titleHi || alertItem.title}` : `Alert: ${alertItem.titleEn || alertItem.title}`)}
            />

            <div className="portal-body">
              <Sidebar role={role} />

              <main className="portal-main">
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard gaushalas={gaushalas} alerts={alerts} onOpenAuditModal={setAuditModalData} onOpenGrantModal={setGrantModalItem} onNavigateTab={(p) => navigate('/admin/' + p)} />} />
                  <Route path="/admin/grants" element={<AdminGrants grants={grants} onOpenGrantModal={setGrantModalItem} onRejectGrant={handleRejectGrant} />} />
                  <Route path="/admin/audit" element={<AdminAudit gaushalas={gaushalas} onOpenAuditModal={setAuditModalData} />} />
                  <Route path="/admin/sub-admins" element={<AdminSubAdmins subAdmins={subAdmins} onOpenAddModal={() => setAddSubAdminModalOpen(true)} />} />
                  <Route path="/admin/policy" element={<AdminPolicy onShowToast={showToast} />} />
                  <Route path="/admin/public" element={<AdminPublic onOpenPhotoModal={setPhotoProofData} onShowToast={showToast} />} />
                  <Route path="/admin/ai-features" element={<AdvancedFeatures onShowToast={showToast} />} />

                  {/* Sub-Admin Routes */}
                  <Route path="/sub/zone" element={<SubZoneMonitor gaushalas={gaushalas} onOpenPhotoModal={setPhotoProofData} onShowToast={showToast} />} />
                  <Route path="/sub/alerts" element={<SubAlerts alerts={alerts} onShowToast={showToast} onUpdateAlertStatus={(id, status, action) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status, actionTaken: action } : a))} />} />
                  <Route path="/sub/verify" element={<SubVerification gaushalas={gaushalas} onOpenPhotoModal={setPhotoProofData} onShowToast={showToast} />} />
                  <Route path="/sub/reports" element={<SubZoneReports onShowToast={showToast} />} />

                  {/* Manager Routes */}
                  <Route path="/manager/dashboard" element={<ManagerDashboard alerts={alerts} stock={stock} onNavigateTab={(p) => navigate('/manager/' + p)} onOpenAddCowModal={() => setAddCowModalOpen(true)} />} />
                  <Route path="/manager/cctv" element={<ManagerCCTV onOpenPhotoModal={setPhotoProofData} onShowToast={showToast} />} />
                  <Route path="/manager/gate" element={<ManagerGateRFID onOpenPhotoModal={setPhotoProofData} onShowToast={showToast} />} />
                  <Route path="/manager/feed" element={<ManagerFeedStock stock={stock} onDeductStock={handleDeductStock} onAddStock={handleAddStock} onShowToast={showToast} />} />
                  <Route path="/manager/health" element={<ManagerHealth healthRecords={healthRecords} onOpenAddHealthModal={() => setAddHealthModalOpen(true)} />} />
                  <Route path="/manager/perimeter" element={<ManagerPerimeter onShowToast={showToast} />} />

                  <Route path="*" element={<Navigate to={role === 'admin' ? '/admin/dashboard' : (role === 'sub' ? '/sub/zone' : '/manager/dashboard')} replace />} />
                </Routes>
              </main>
            </div>

            {/* Global Toast Notification */}
            {toastMsg && <div className="portal-toast">{toastMsg}</div>}

            {/* Modals Container */}
            {grantModalItem && <GrantApprovalModal grantItem={grantModalItem} onClose={() => setGrantModalItem(null)} onConfirm={handleConfirmGrant} />}
            {photoProofData && <PhotoProofModal proofData={photoProofData} onClose={() => setPhotoProofData(null)} />}
            {auditModalData && <AuditReportModal auditData={auditModalData} onClose={() => setAuditModalData(null)} />}
            {addHealthModalOpen && <AddHealthModal onClose={() => setAddHealthModalOpen(false)} onAddRecord={(rec) => { setHealthRecords(prev => [rec, ...prev]); showToast(isHi ? `✓ नया स्वास्थ्य रिकॉर्ड दर्ज: ${rec.cowName} (${rec.tag})` : `✓ New veterinary record logged: ${rec.cowName} (${rec.tag})`); }} />}
            {addSubAdminModalOpen && <AddSubAdminModal onClose={() => setAddSubAdminModalOpen(false)} onAddOfficer={(officer) => { setSubAdmins(prev => [...prev, officer]); showToast(isHi ? `✓ नया उप-प्रशासक असाइन किया गया: ${officer.name} (${officer.zone})` : `✓ New Sub-Admin assigned: ${officer.name} (${officer.zone})`); }} />}
            {addCowModalOpen && <AddCowModal onClose={() => setAddCowModalOpen(false)} onAddCow={(cow) => { setGaushalas(prev => prev.map((g, i) => i === 0 ? { ...g, reg: g.reg + 1, ver: g.ver + 1 } : g)); showToast(isHi ? `✓ नया गोवंश (${cow.tag}) गौशाला में सफलतापूर्वक पंजीकृत किया गया।` : `✓ New cattle (${cow.tag}) registered successfully in shelter.`); }} />}
          </div>
        )
      } />
    </Routes>
  );
}
