import React from 'react';
import { X, CheckCircle, Camera, Calendar, MapPin, Tag } from 'lucide-react';

export default function PhotoProofModal({ proofData, onClose }) {
  if (!proofData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={18} color="var(--saffron)" />
            <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              AI फोटो-प्रमाण · {proofData.title || proofData.name}
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Proof Video Frame with AI Overlays */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#0f172a',
              border: '1px solid #334155',
              marginBottom: 16
            }}
          >
            {/* Background scene simulation */}
            <svg viewBox="0 0 400 225" style={{ width: '100%', height: '100%' }}>
              <rect width="400" height="225" fill="#1e293b" />
              <polygon points="0,150 400,150 400,225 0,225" fill="#0f172a" />
              <line x1="50" y1="20" x2="50" y2="210" stroke="#475569" strokeWidth="3" />
              <line x1="200" y1="20" x2="200" y2="210" stroke="#475569" strokeWidth="3" />
              <line x1="350" y1="20" x2="350" y2="210" stroke="#475569" strokeWidth="3" />
            </svg>

            {/* Simulated Cow Detections */}
            <div
              className="ai-bbox"
              style={{ left: '15%', top: '40%', width: '22%', height: '42%' }}
            >
              <div className="ai-bbox-label">गाय #1187 (गीर) 98.4%</div>
            </div>

            <div
              className="ai-bbox"
              style={{ left: '42%', top: '35%', width: '24%', height: '46%' }}
            >
              <div className="ai-bbox-label">गाय #4471 (साहीवाल) 97.2%</div>
            </div>

            <div
              className="ai-bbox"
              style={{ left: '70%', top: '42%', width: '20%', height: '38%' }}
            >
              <div className="ai-bbox-label">गाय #3320 (देसी) 99.1%</div>
            </div>

            {/* Proof Metadata Watermark */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              📸 AI EVIDENCE FRAME #84920
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: 'rgba(0,0,0,0.7)',
                color: '#4ade80',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              ● CRYPTOGRAPHIC HASH: e4a7...98f1
            </div>
          </div>

          {/* Verification Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>कैमरा नोड</div>
              <b>Gate-1 South (Edge Cam 02)</b>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>सत्यापन समय</div>
              <b>आज सुबह 08:32 AM</b>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>RFID क्रॉस-चेक</div>
              <b style={{ color: 'var(--emerald)' }}>100% मिलान (3/3)</b>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-gov outline" onClick={onClose}>
            बंद करें
          </button>
          <button
            className="btn-gov emerald"
            onClick={() => {
              alert('डिजिटल हस्ताक्षरित प्रमाण पत्र डाउनलोड किया जा रहा है');
              onClose();
            }}
          >
            डिजिटल प्रमाण पत्र डाउनलोड करें
          </button>
        </div>
      </div>
    </div>
  );
}
