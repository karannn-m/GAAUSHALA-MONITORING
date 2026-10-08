import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Volume2, VolumeX, Shield, Clock, ExternalLink, Globe } from 'lucide-react';
import { playNotificationSound } from '../sound';
import { useLanguage } from '../context/LanguageContext';

export default function Header({
  role,
  onRoleChange,
  theme,
  onThemeToggle,
  soundEnabled,
  onSoundToggle,
  alerts,
  onAlertClick
}) {
  const [time, setTime] = useState(new Date());
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(alerts.length);

  const { language, setLanguage, toggleLanguage, isHi, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNotifClick = () => {
    setShowNotifDrawer(!showNotifDrawer);
    if (!showNotifDrawer) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      <div className="gov-tricolor" />
      <header className="portal-header">
        {/* Brand identity */}
        <div className="brand-section">
          <div className="ashoka-emblem" title="छत्तीसगढ़ शासन / Government of India">
            🏛️
          </div>
          <div className="brand-titles">
            <h1>
              <span>AI Gaushala Portal</span>
              <span className="highlight">(SGMS)</span>
            </h1>
            <div className="brand-subtitle">
              <span>{isHi ? 'गौशाला शासन एवं अनुदान पारदर्शिता पोर्टल' : 'Gaushala Governance & Grant Transparency Portal'}</span>
              <span>•</span>
              <span>{isHi ? 'पशुपालन एवं गो-सेवा आयोग' : 'Animal Husbandry & Gau-Seva Commission'}</span>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="role-pills">
          <button
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => onRoleChange('admin')}
            title={isHi ? "राज्य नियंत्रक (Super Admin)" : "State Super Administrator"}
          >
            <span>👑</span>
            <span>{t('admin')}</span>
          </button>
          <button
            className={`role-btn ${role === 'sub' ? 'active' : ''}`}
            onClick={() => onRoleChange('sub')}
            title={isHi ? "ज़िला / ज़ोन नोडल अधिकारी" : "District / Zonal Officer"}
          >
            <span>🧑‍💼</span>
            <span>{t('sub')}</span>
          </button>
          <button
            className={`role-btn ${role === 'mgr' ? 'active' : ''}`}
            onClick={() => onRoleChange('mgr')}
            title={isHi ? "गौशाला प्रबंधक" : "Gaushala Ground Manager"}
          >
            <span>🐄</span>
            <span>{t('mgr')}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Live IST Clock */}
          <div className="live-ist-clock" title={isHi ? "भारतीय मानक समय (IST)" : "Indian Standard Time (IST)"}>
            <span>{time.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
            <b>{time.toLocaleTimeString('en-IN')} IST</b>
          </div>

          {/* Sound Toggle */}
          <button
            className="icon-action-btn"
            onClick={onSoundToggle}
            title={soundEnabled ? (isHi ? "ध्वनि चालू (Audio On)" : "Audio On") : (isHi ? "ध्वनि म्यूट (Audio Muted)" : "Audio Muted")}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} style={{ opacity: 0.6 }} />}
          </button>

          {/* Notification Bell */}
          <button
            className="icon-action-btn"
            onClick={handleNotifClick}
            title={isHi ? "अलर्ट एवं सूचनाएँ" : "Alerts & Notifications"}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge-counter">{unreadCount}</span>}
          </button>

          {/* Dual Language Option: Hindi & English */}
          <div className="language-selector" role="group" aria-label="Language selection / भाषा चयन">
            <Globe size={15} className="lang-icon" />
            <button
              type="button"
              className={`lang-option-btn ${isHi ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
              title="हिंदी में देखें"
            >
              हिंदी
            </button>
            <span className="lang-divider">|</span>
            <button
              type="button"
              className={`lang-option-btn ${!isHi ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              title="View in English"
            >
              English
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            className="icon-action-btn"
            onClick={onThemeToggle}
            title={theme === 'dark' ? (isHi ? "लाइट थीम (Light Mode)" : "Light Mode") : (isHi ? "डार्क थीम (Dark Mode)" : "Dark Mode")}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
          </button>
        </div>

        {/* Dropdown Notification Drawer */}
        {showNotifDrawer && (
          <div className="notif-dropdown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <b style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bell size={16} color="var(--saffron)" />
                {isHi ? `लाइव अलर्ट केंद्र (${alerts.length})` : `Live Alert Center (${alerts.length})`}
              </b>
              <button
                className="btn-gov outline btn-sm"
                onClick={() => setShowNotifDrawer(false)}
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
            <div className="alert-feed-list" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`alert-feed-item ${al.type || 'info'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onAlertClick(al);
                    setShowNotifDrawer(false);
                  }}
                >
                  <div className="alert-feed-title">
                    {isHi ? (al.titleHi || al.title) : (al.titleEn || al.title)}
                  </div>
                  <div className="alert-feed-meta">
                    {isHi ? (al.descHi || al.desc) : (al.descEn || al.desc)} • <b>{al.time}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
