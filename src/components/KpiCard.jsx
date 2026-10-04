import React, { useState, useEffect } from 'react';

export default function KpiCard({ title, value, change, tone = 'saffron', icon, subtitle }) {
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    // Smooth number animation if value has digits
    const m = String(value).match(/^(₹\s*)?([\d,.]+)(.*)$/);
    if (!m) {
      setDisplayVal(value);
      return;
    }
    const prefix = m[1] || '';
    const suffix = m[3] || '';
    const numStr = m[2];
    const isBig = numStr.includes(',');
    const dec = (numStr.split('.')[1] || '').length;
    const target = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(target)) {
      setDisplayVal(value);
      return;
    }

    const start = performance.now();
    let frameId;
    const duration = 800;

    function step(timestamp) {
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = target * (1 - Math.pow(1 - progress, 3));
      const formatted = isBig ? Math.round(eased).toLocaleString('en-IN') : eased.toFixed(dec);
      setDisplayVal(prefix + formatted + suffix);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <div className={`kpi-card tone-${tone}`}>
      <div className="kpi-head">
        <span className="kpi-label">{title}</span>
        {icon && <div className="kpi-icon-pill">{icon}</div>}
      </div>
      <div>
        <div className="kpi-value">{displayVal}</div>
        {change && (
          <div className={`kpi-delta ${change.startsWith('▲') ? 'up' : change.startsWith('▼') ? 'down' : 'neutral'}`}>
            {change}
          </div>
        )}
        {subtitle && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
