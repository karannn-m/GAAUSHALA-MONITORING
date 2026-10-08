import React, { useState } from 'react';
import { MapPin, Navigation, Eye, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GISMap({ gaushalas, selectedId, onSelectGaushala }) {
  const { isHi } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredList = gaushalas.filter((g) => {
    if (filter === 'all') return true;
    return g.status === filter;
  });

  const getPinColor = (status) => {
    switch (status) {
      case 'ok': return '#16a34a';
      case 'warn': return '#d97706';
      case 'bad': return '#dc2626';
      default: return '#2563eb';
    }
  };

  return (
    <div>
      {/* Map Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: isHi ? 'सभी (6)' : 'All (6)' },
            { id: 'ok', label: isHi ? '🟢 सामान्य (4)' : '🟢 Normal (4)' },
            { id: 'warn', label: isHi ? '🟠 चेतावनी (1)' : '🟠 Warning (1)' },
            { id: 'bad', label: isHi ? '🔴 गंभीर (1)' : '🔴 Critical (1)' }
          ].map((btn) => (
            <button
              key={btn.id}
              className={`btn-gov ${filter === btn.id ? 'saffron' : 'outline'} btn-sm`}
              onClick={() => setFilter(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          {isHi ? '* बिंदु पर क्लिक करके लाइव डेटा देखें' : '* Click pin to inspect live telemetry'}
        </span>
      </div>

      {/* SVG GIS Canvas */}
      <div className="map-canvas-container">
        <svg
          viewBox="0 0 440 390"
          style={{ width: '100%', height: 'auto', maxHeight: '360px' }}
          role="img"
          aria-label={isHi ? "छत्तीसगढ़ राज्य गो-सेवा GIS मानचित्र" : "Chhattisgarh State Cattle Care GIS Map"}
        >
          {/* State Boundary Outline (Chhattisgarh Geo-shape) */}
          <path
            d="M 170 30 
               L 250 20 
               L 310 60 
               L 350 120 
               L 310 190 
               L 340 260 
               L 290 320 
               L 240 370 
               L 190 360 
               L 160 300 
               L 140 240 
               L 110 190 
               L 90 140 
               L 130 80 Z"
            fill="var(--badge-bg)"
            stroke="var(--saffron)"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            opacity="0.9"
          />

          {/* District Division Borders */}
          <path d="M 130 80 Q 210 130 310 120" stroke="var(--border-color)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
          <path d="M 110 190 Q 230 190 310 190" stroke="var(--border-color)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
          <path d="M 140 240 Q 220 270 290 320" stroke="var(--border-color)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />

          {/* District Labels */}
          <text x="210" y="70" fill="var(--text-muted)" fontSize="11" fontWeight="600" textAnchor="middle">
            {isHi ? 'बिलासपुर ज़ोन' : 'Bilaspur Zone'}
          </text>
          <text x="200" y="165" fill="var(--text-muted)" fontSize="11" fontWeight="600" textAnchor="middle">
            {isHi ? 'रायपुर संभाग' : 'Raipur Division'}
          </text>
          <text x="125" y="200" fill="var(--text-muted)" fontSize="10" fontWeight="600" textAnchor="middle">
            {isHi ? 'दुर्ग ज़ोन' : 'Durg Zone'}
          </text>
          <text x="200" y="325" fill="var(--text-muted)" fontSize="11" fontWeight="600" textAnchor="middle">
            {isHi ? 'बस्तर ज़ोन' : 'Bastar Zone'}
          </text>

          {/* Gaushala Pins */}
          {filteredList.map((item, idx) => {
            const isSelected = selectedId === item.id;
            const pinColor = getPinColor(item.status);

            return (
              <g
                key={item.id}
                className="map-pin"
                onClick={() => onSelectGaushala(item.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulsing Radar Ring for Alerts / Selected */}
                {(item.status === 'bad' || item.status === 'warn' || isSelected) && (
                  <circle
                    cx={item.x}
                    cy={item.y}
                    r={isSelected ? 18 : 14}
                    fill="none"
                    stroke={pinColor}
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values="10;24;10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0;0.8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Core Pin Circle */}
                <circle
                  cx={item.x}
                  cy={item.y}
                  r={isSelected ? 14 : 11}
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                />

                {/* Pin Text Label */}
                <text
                  x={item.x}
                  y={item.y + 4}
                  fontSize="10"
                  fontWeight="700"
                  fill="#ffffff"
                  textAnchor="middle"
                >
                  {idx + 1}
                </text>

                {/* Hover / Active Badge */}
                {isSelected && (
                  <g>
                    <rect
                      x={item.x - 45}
                      y={item.y - 34}
                      width="90"
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      stroke="var(--saffron)"
                      strokeWidth="1"
                    />
                    <text
                      x={item.x}
                      y={item.y - 20}
                      fontSize="9"
                      fill="#ffffff"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {item.ver}/{item.reg} {isHi ? 'AI सत्यापित' : 'AI Verified'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }} />
            {isHi ? 'सत्यापित (OK)' : 'Verified (OK)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }} />
            {isHi ? 'चेतावनी (Stock/Feed)' : 'Warning (Stock/Feed)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }} />
            {isHi ? 'गंभीर (Audit Mismatch)' : 'Critical (Audit Mismatch)'}
          </span>
        </div>
      </div>
    </div>
  );
}
