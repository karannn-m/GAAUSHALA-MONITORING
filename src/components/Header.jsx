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

  const { language, toggleLanguage, t } = useLanguage();

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
              <span>गौशाला शासन एवं अनुदान पारदर्शिता पोर्टल</span>
              <span>•</span>
              <span>पशुपालन एवं गो-सेवा आयोग</span>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="role-pills">
          <button
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => onRoleChange('admin')}
            title="State Super Administrator"
          >
            <span>👑</span>
            <span>{t('admin')}</span>
          </button>
          <button
            className={`role-btn ${role === 'sub' ? 'active' : ''}`}
            onClick={() => onRoleChange('sub')}
            title="District / Zonal Officer"
          >
            <span>🧑‍💼</span>
            <span>{t('sub')}</span>
          </button>
          <button
            className={`role-btn ${role === 'mgr' ? 'active' : ''}`}
            onClick={() => onRoleChange('mgr')}
            title="Gaushala Ground Manager"
          >
            <span>🐄</span>
            <span>{t('mgr')}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Live IST Clock */}
          <div className="live-ist-clock" title="भारतीय मानक समय (IST)">
            <span>{time.toLocaleDateString('hi-IN', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
            <b>{time.toLocaleTimeString('en-IN')} IST</b>
          </div>

          {/* Sound Toggle */}
          <button
            className="icon-action-btn"
            onClick={onSoundToggle}
            title={soundEnabled ? "ध्वनि चालू (Audio On)" : "ध्वनि म्यूट (Audio Muted)"}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} style={{ opacity: 0.6 }} />}
          </button>

          {/* Notification Bell */}
          <button
            className="icon-action-btn"
            onClick={handleNotifClick}
            title="अलर्ट एवं सूचनाएँ"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge-counter">{unreadCount}</span>}
          </button>

          {/* Language Switcher */}
          <button
            className="icon-action-btn"
            onClick={toggleLanguage}
            title={language === 'hi' ? "Switch to English" : "हिंदी में बदलें"}
            style={{ fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            {language === 'hi' ? 'EN' : 'HI'}
          </button>

          {/* Theme Switcher */}
          <button
            className="icon-action-btn"
            onClick={onThemeToggle}
            title={theme === 'dark' ? "लाइट थीम (Light Mode)" : "डार्क थीम (Dark Mode)"}
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
                लाइव अलर्ट केंद्र ({alerts.length})
              </b>
              <button
                className="btn-gov outline btn-sm"
                onClick={() => setShowNotifDrawer(false)}
              >
                बंद करें
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
                  <div className="alert-feed-title">{al.title}</div>
                  <div className="alert-feed-meta">
                    {al.desc} • <b>{al.time}</b>
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
