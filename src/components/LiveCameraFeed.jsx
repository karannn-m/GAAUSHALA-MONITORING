import React, { useState, useEffect } from 'react';
import { Camera, Eye, AlertCircle, Maximize2, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { playAlertWarningSound, toggleSirenSound } from '../sound';
import { useLanguage } from '../context/LanguageContext';

export default function LiveCameraFeed({
  title,
  cameraCode,
  boxes = [],
  caption,
  isIrMode = false,
  onSnapshot,
  onAlertAction,
  alertButtonText,
  alertButtonType = 'crimson',
  bgType = 'shed', // 'shed', 'trough', 'pasture', 'gate', 'night'
}) {
  const { isHi } = useLanguage();
  const [timestamp, setTimestamp] = useState(new Date());
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    if (onSnapshot) {
      onSnapshot({
        title,
        cameraCode,
        timestamp: timestamp.toLocaleString(isHi ? 'hi-IN' : 'en-US'),
        boxes
      });
    }
  };

  // Get background gradient styling based on feed type
  const getFeedBackground = () => {
    if (isIrMode) {
      return 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)';
    }
    switch (bgType) {
      case 'trough':
        return `url('/cctv_ai_feed.jpg') center/cover no-repeat, linear-gradient(180deg, #475569 0%, #334155 40%, #1e293b 100%)`;
      case 'pasture':
        return `url('/cctv_ai_feed.jpg') center/cover no-repeat, linear-gradient(180deg, #334155 0%, #1e3a1f 35%, #14532d 100%)`;
      case 'night':
        return `url('/cctv_ai_feed.jpg') center/cover no-repeat, linear-gradient(180deg, #090d16 0%, #0f172a 100%)`;
      default:
        return `url('/cctv_ai_feed.jpg') center/cover no-repeat, linear-gradient(180deg, #334155 0%, #475569 45%, #1e293b 100%)`;
    }
  };

  return (
    <div className="dash-card" style={{ padding: 14 }}>
      <div className="card-title-row" style={{ marginBottom: 10, paddingBottom: 8 }}>
        <h3 style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Camera size={16} color="var(--saffron)" />
          {title}
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full border border-yellow-300">
            {isHi ? 'सिमुलेशन / मॉक' : 'Mock Mode'}
          </span>
        </h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {cameraCode}
          </span>
          <button
            className="btn-gov outline btn-sm"
            onClick={handleCapture}
            title={isHi ? "फ़ोटो कैप्चर (Snapshot)" : "Capture Snapshot"}
            style={{ padding: '3px 8px' }}
          >
            📸 {isHi ? 'कैप्चर' : 'Capture'}
          </button>
        </div>
      </div>

      {/* Video Feed Screen */}
      <div
        className={`cam-feed-box ${isIrMode ? 'ir-mode' : ''}`}
        style={{
          background: getFeedBackground(),
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Flash animation on snapshot capture */}
        {flash && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#ffffff',
              zIndex: 30,
              opacity: 0.9,
              transition: 'opacity 0.2s ease'
            }}
          />
        )}

        {/* Scanlines overlay effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
            pointerEvents: 'none',
            zIndex: 4
          }}
        />

        {/* Top HUD */}
        <div className="cam-hud-header">
          <div className="cam-title-tag">
            <span>● 1080p 24FPS</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span>Edge-YOLO AI</span>
          </div>
          <div className="cam-rec-indicator">
            <span className="pulsing-dot" style={{ background: '#ef4444' }} />
            <span>REC</span>
          </div>
        </div>

        {/* Animated Visual Elements */}
        {/* Removed vector shapes because we are using a real CCTV image now */}
        <div style={{ position: 'absolute', inset: 0, opacity: isIrMode ? 0.45 : 0.65 }}>
          {/* Overlay to dim the image slightly if needed */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        </div>

        {/* Dynamic AI Detection Bounding Boxes */}
        {boxes.map((b, i) => (
          <div
            key={i}
            className={`ai-bbox ${b.tone === 'r' ? 'alert' : b.tone === 'y' ? 'warning' : ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              zIndex: 5
            }}
          >
            <div className="ai-bbox-label">
              {b.label}
            </div>
          </div>
        ))}

        {/* Bottom HUD */}
        <div className="cam-hud-footer">
          <div>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{caption}</span>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              Lat: 21.192 N, Long: 81.968 E • Cam ID: {cameraCode}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#cbd5e1' }}>
            {timestamp.toLocaleTimeString('en-IN')}
          </div>
        </div>
      </div>

      {/* Action Footer if provided */}
      {alertButtonText && (
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className={`btn-gov ${alertButtonType} btn-sm`}
            onClick={() => {
              if (onAlertAction) onAlertAction();
            }}
          >
            <ShieldAlert size={14} />
            {alertButtonText}
          </button>
        </div>
      )}
    </div>
  );
}
