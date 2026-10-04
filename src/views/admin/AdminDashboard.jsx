import React, { useState } from 'react';
import KpiCard from '../../components/KpiCard';
import GISMap from '../../components/GISMap';
import { INITIAL_GAUSHALAS } from '../../data/portalData';
import { MapPin, TrendingDown, ShieldAlert, Award, FileSearch, CheckCircle, Search, ExternalLink } from 'lucide-react';

export default function AdminDashboard({
  gaushalas,
  alerts,
  onOpenAuditModal,
  onOpenGrantModal,
  onNavigateTab
}) {
  const [selectedId, setSelectedId] = useState('RPR-01');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedGaushala = gaushalas.find((g) => g.id === selectedId) || gaushalas[0];

  const filteredGaushalas = gaushalas.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Banner */}
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">राज्य स्तरीय निगरानी डैशबोर्ड (State Command Center)</h2>
          <p className="page-desc">पूरे राज्य की गौशालाओं की वास्तविक समय (GIS Map) AI + RFID निगरानी</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-gov saffron" onClick={() => onNavigateTab('grants')}>
            💰 अनुदान सत्यापन (DBT)
          </button>
          <button className="btn-gov outline" onClick={() => onNavigateTab('audit')}>
            🔍 AI ऑडिट
          </button>
        </div>
      </div>

      {/* Hero Live Status Banner */}
      <div className="hero-banner">
        <div>
          <div className="live-pulse-badge">
            <span className="pulsing-dot" />
            <span>लाइव मॉनिटरिंग · 1,248 गौशालाएँ ऑनलाइन</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, margin: '6px 0 2px' }}>
            आज का राज्य स्तरीय गो-संरक्षण अनुपालन: <span style={{ color: '#4ade80' }}>94.1%</span>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.85, margin: 0 }}>
            Edge-AI CCTV + UHF RFID स्वचालित हेडकाउंट द्वारा दैनिक सत्यापन सक्रिय
          </p>
        </div>
        <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.25)', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>सत्यापित देय अनुदान (दैनिक हेडकाउंट आधार)</div>
          <b style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fb923c' }}>₹ 74.56 Lakh</b>
          <div style={{ fontSize: '0.68rem', color: '#4ade80' }}>✓ पारदर्शी DBT अनुदान व्यवस्था</div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <KpiCard
          title="पंजीकृत गौशालाएँ (Total Units)"
          value="1,248"
          change="▲ 12 इस माह जोड़ी गईं"
          tone="blue"
          icon="🏛️"
        />
        <KpiCard
          title="AI सत्यापित गोवंश (Verified Cattle)"
          value="1,86,420"
          change="▲ 97.4% प्रत्यक्ष सत्यापन"
          tone="emerald"
          icon="🐄"
        />
        <KpiCard
          title="स्वीकृत DBT अनुदान (तिमाही)"
          value="₹ 1.86 Cr"
          change="सत्यापित गोवंश अनुपात"
          tone="saffron"
          icon="💰"
        />
        <KpiCard
          title="राज्य औसत मृत्यु दर (Mortality)"
          value="2.1%"
          change="▼ 1.4% AI अर्ली-अलर्ट से घटी"
          tone="emerald"
          icon="📉"
        />
      </div>

      {/* GIS Map & Selected Gaushala Telemetry */}
      <div className="grid-2col">
        {/* Interactive GIS Map */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <MapPin size={18} color="var(--saffron)" />
              छत्तीसगढ़ गो-सेवा संभाग मानचित्र (GIS Telemetry)
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>6 प्रमुख गौशाला केंद्र</span>
          </div>

          <GISMap
            gaushalas={gaushalas}
            selectedId={selectedId}
            onSelectGaushala={(id) => setSelectedId(id)}
          />

          {/* Selected Gaushala Detail Card */}
          {selectedGaushala && (
            <div
              style={{
                marginTop: 14,
                padding: 14,
                borderRadius: 8,
                background: 'var(--badge-bg)',
                borderLeft: `4px solid ${selectedGaushala.status === 'ok' ? 'var(--emerald)' : selectedGaushala.status === 'warn' ? 'var(--amber-warn)' : 'var(--red-alert)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedGaushala.name}</b>
                <span className={`status-badge ${selectedGaushala.status}`}>
                  {selectedGaushala.status === 'ok' ? 'पूर्ण सत्यापित' : selectedGaushala.status === 'warn' ? 'चेतावनी' : 'गंभीर अंतर'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>AI सत्यापित / पंजीकृत:</span>
                  <br />
                  <b style={{ fontSize: '0.95rem', color: selectedGaushala.reg - selectedGaushala.ver > 20 ? 'var(--red-alert)' : 'var(--emerald)' }}>
                    {selectedGaushala.ver} / {selectedGaushala.reg} गायें
                  </b>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>चारा नांद स्थिति:</span>
                  <br />
                  <b style={{ color: selectedGaushala.feedStatus === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>
                    {selectedGaushala.feedStatus === 'ok' ? 'समय पर (8:20 AM)' : 'नांद खाली (अलर्ट)'}
                  </b>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>जोखिम स्कोर (AI Risk):</span>
                  <br />
                  <b style={{ color: selectedGaushala.status === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>
                    {selectedGaushala.status === 'ok' ? '12 / 100 (न्यूनतम)' : '87 / 100 (उच्च जोखिम)'}
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                <button
                  className="btn-gov outline btn-sm"
                  onClick={() => onOpenAuditModal(selectedGaushala)}
                >
                  <FileSearch size={14} />
                  AI ऑडिट रिपोर्ट
                </button>
                <button
                  className="btn-gov saffron btn-sm"
                  onClick={() => onOpenGrantModal({ g: selectedGaushala, amt: `₹ ${(selectedGaushala.ver * 40 * 75 / 100000).toFixed(2)} L`, index: 0 })}
                >
                  अनुदान देखें
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Alerts Stream */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <ShieldAlert size={18} color="var(--red-alert)" />
              वास्तविक समय राज्य अलर्ट (Active AI Triggers)
            </h3>
            <span className="live-pulse-badge" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <span className="pulsing-dot" style={{ background: '#ef4444' }} />
              लाइव
            </span>
          </div>

          <div className="alert-feed-list">
            {alerts.slice(0, 5).map((al) => (
              <div key={al.id} className={`alert-feed-item ${al.type || 'info'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="alert-feed-title">{al.title}</div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {al.time}
                  </span>
                </div>
                <div className="alert-feed-meta">{al.desc}</div>
                {al.gaushalaName && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--saffron)', marginTop: 4, fontWeight: 600 }}>
                    📍 {al.gaushalaName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts (Mortality SVG + Grant Distribution) */}
      <div className="grid-2col">
        {/* Mortality Trend Chart */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <TrendingDown size={18} color="var(--emerald)" />
              गोवंश मृत्यु दर में कमी ट्रेंड (6 माह AI प्रभाव)
            </h3>
            <span className="status-badge ok">46% गिरावट</span>
          </div>

          {/* SVG Line Chart */}
          <div style={{ padding: '8px 0' }}>
            <svg viewBox="0 0 340 120" style={{ width: '100%', height: 'auto' }}>
              <defs>
                <linearGradient id="mortalityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15803d" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="20" y1="20" x2="330" y2="20" stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2="330" y2="60" stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="330" y2="100" stroke="var(--border-color)" strokeDasharray="3 3" />

              {/* Area & Line */}
              <path
                d="M 30 25 L 80 35 L 130 50 L 180 65 L 230 80 L 280 92 L 320 102 L 320 115 L 30 115 Z"
                fill="url(#mortalityGrad)"
              />
              <path
                d="M 30 25 L 80 35 L 130 50 L 180 65 L 230 80 L 280 92 L 320 102"
                fill="none"
                stroke="#15803d"
                strokeWidth="3"
              />

              {/* Data points */}
              {[
                [30, 25, '3.9%'],
                [80, 35, '3.6%'],
                [130, 50, '3.4%'],
                [180, 65, '3.0%'],
                [230, 80, '2.7%'],
                [280, 92, '2.4%'],
                [320, 102, '2.1%']
              ].map(([cx, cy, label], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="4" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
                  <text x={cx} y={cy - 8} fontSize="9" fontWeight="700" fill="var(--text-secondary)" textAnchor="middle">
                    {label}
                  </text>
                </g>
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0 10px' }}>
              <span>अप्रैल</span>
              <span>मई</span>
              <span>जून</span>
              <span>जुलाई</span>
              <span>अगस्त</span>
              <span>सितंबर</span>
              <span>अक्टूबर (आज)</span>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            💡 AI द्वारा समय पर गिरी हुई गाय एवं सुस्त पशुओं की पहचान से मृत्यु दर 3.9% से घटकर मात्र 2.1% रह गई।
          </p>
        </div>

        {/* Grant Distribution Donut */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Award size={18} color="var(--saffron)" />
              अनुदान सत्यापन वितरण (DBT Compliance)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>तिमाही Q3</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* SVG Donut */}
            <svg viewBox="0 0 120 120" style={{ width: 130, height: 130, flexShrink: 0 }}>
              {/* Segments: 82% OK, 11% Warn, 7% Bad */}
              {/* Circumference = 2 * pi * 42 = 263.89 */}
              <circle cx="60" cy="60" r="42" fill="none" stroke="var(--border-color)" strokeWidth="16" />
              {/* Green: 82% = 216.39 */}
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#15803d"
                strokeWidth="16"
                strokeDasharray="216.4 263.9"
                transform="rotate(-90 60 60)"
              />
              {/* Amber: 11% = 29.0 */}
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#d97706"
                strokeWidth="16"
                strokeDasharray="29.0 263.9"
                strokeDashoffset="-216.4"
                transform="rotate(-90 60 60)"
              />
              {/* Red: 7% = 18.5 */}
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#dc2626"
                strokeWidth="16"
                strokeDasharray="18.5 263.9"
                strokeDashoffset="-245.4"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="65" textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--text-primary)">
                82%
              </text>
            </svg>

            {/* Legend & Breakdown */}
            <div style={{ flex: 1, minWidth: 150 }}>
              <div className="stock-bar-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#15803d' }} />
                  पूर्ण सत्यापित (DBT जारी)
                </span>
                <b>82%</b>
              </div>
              <div className="stock-bar-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }} />
                  समीक्षाधीन (Verification)
                </span>
                <b>11%</b>
              </div>
              <div className="stock-bar-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }} />
                  रोका गया (Ghost Cattle)
                </span>
                <b style={{ color: 'var(--red-alert)' }}>7%</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gaushala Master Table */}
      <div className="dash-card">
        <div className="card-title-row">
          <div>
            <h3>गौशाला मास्टर सूची · पंजीकृत बनाम AI सत्यापित गणना</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              प्रत्येक गौशाला की लाइव स्थिति, गणना अंतर एवं त्वरित कार्य
            </p>
          </div>
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32, fontSize: '0.78rem' }}
              placeholder="गौशाला या जिला खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>कोड</th>
                <th>गौशाला का नाम</th>
                <th>जिला / संभाग</th>
                <th>पंजीकृत</th>
                <th>AI सत्यापित</th>
                <th>गणना अंतर (%)</th>
                <th>चारा स्थिति</th>
                <th>ऑडिट स्कोर</th>
                <th>स्थिति</th>
                <th>कार्यवाही</th>
              </tr>
            </thead>
            <tbody>
              {filteredGaushalas.map((g) => {
                const diff = g.reg - g.ver;
                const diffPct = Math.round((diff / g.reg) * 100);

                return (
                  <tr key={g.id}>
                    <td><b style={{ fontFamily: 'var(--font-mono)' }}>{g.id}</b></td>
                    <td><b>{g.name}</b></td>
                    <td>{g.district}</td>
                    <td>{g.reg}</td>
                    <td><b style={{ color: 'var(--emerald)' }}>{g.ver}</b></td>
                    <td style={{ color: diff > 20 ? 'var(--red-alert)' : 'var(--emerald)', fontWeight: 700 }}>
                      {diffPct}% {diff > 0 ? `(${diff} गायें)` : '✓'}
                    </td>
                    <td>
                      <span className={`status-badge ${g.feedStatus === 'ok' ? 'ok' : 'bad'}`}>
                        {g.feedStatus === 'ok' ? 'समय पर ✓' : 'देरी / खाली ⚠️'}
                      </span>
                    </td>
                    <td><b>{g.lastAuditScore}/100</b></td>
                    <td>
                      <span className={`status-badge ${g.status}`}>
                        {g.status === 'ok' ? 'सत्यापित' : g.status === 'warn' ? 'चेतावनी' : 'गंभीर अंतर'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn-gov outline btn-sm"
                          onClick={() => onOpenAuditModal(g)}
                          title="ऑडिट रिपोर्ट"
                        >
                          ऑडिट
                        </button>
                        <button
                          className="btn-gov saffron btn-sm"
                          onClick={() => setSelectedId(g.id)}
                          title="मानचित्र पर देखें"
                        >
                          देखें
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
