import React, { useState } from 'react';
import KpiCard from '../../components/KpiCard';
import GISMap from '../../components/GISMap';
import { INITIAL_GAUSHALAS } from '../../data/portalData';
import { MapPin, TrendingDown, ShieldAlert, Award, FileSearch, CheckCircle, Search, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboard({
  gaushalas,
  alerts,
  onOpenAuditModal,
  onOpenGrantModal,
  onNavigateTab
}) {
  const { language } = useLanguage();
  const isHi = language === 'hi';

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
          <h2 className="page-title">{isHi ? 'राज्य स्तरीय निगरानी डैशबोर्ड (State Command Center)' : 'State Level Command Center'}</h2>
          <p className="page-desc">{isHi ? 'पूरे राज्य की गौशालाओं की वास्तविक समय (GIS Map) AI + RFID निगरानी' : 'Real-time AI + RFID monitoring of Gaushalas across the state via GIS'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-gov saffron" onClick={() => onNavigateTab('grants')}>
            💰 {isHi ? 'अनुदान सत्यापन (DBT)' : 'Grant Verification (DBT)'}
          </button>
          <button className="btn-gov outline" onClick={() => onNavigateTab('audit')}>
            🔍 {isHi ? 'AI ऑडिट' : 'AI Audit'}
          </button>
        </div>
      </div>

      {/* Hero Live Status Banner */}
      <div className="hero-banner">
        <div>
          <div className="live-pulse-badge">
            <span className="pulsing-dot" />
            <span>{isHi ? 'लाइव मॉनिटरिंग · 1,248 गौशालाएँ ऑनलाइन' : 'Live Monitoring · 1,248 Gaushalas Online'}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, margin: '6px 0 2px' }}>
            {isHi ? 'आज का राज्य स्तरीय गो-संरक्षण अनुपालन:' : 'Today\'s State-level Protection Compliance:'} <span style={{ color: '#4ade80' }}>94.1%</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.25)', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{isHi ? 'सत्यापित देय अनुदान (दैनिक हेडकाउंट आधार)' : 'Verified Payable Grant (Daily Headcount Basis)'}</div>
          <b style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fb923c' }}>₹ 74.56 Lakh</b>
          <div style={{ fontSize: '0.68rem', color: '#4ade80' }}>{isHi ? '✓ पारदर्शी DBT अनुदान व्यवस्था' : '✓ Transparent DBT Grant System'}</div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
        <KpiCard
          title={isHi ? 'पंजीकृत गौशालाएँ' : 'Registered Gaushalas'}
          value="1,248"
          change={isHi ? '▲ 12 इस माह' : '▲ 12 this month'}
          tone="blue"
          icon="🏛️"
        />
        <KpiCard
          title={isHi ? 'सत्यापित गोवंश' : 'Verified Cattle'}
          value="1,86,420"
          change={isHi ? '▲ 97.4% सत्यापन' : '▲ 97.4% verified'}
          tone="emerald"
          icon="🐄"
        />
        <KpiCard
          title={isHi ? 'अनुदान (DBT)' : 'Grants (DBT)'}
          value="₹ 1.86 Cr"
          change={isHi ? 'सत्यापित आधार' : 'Verified Basis'}
          tone="saffron"
          icon="💰"
        />
        <KpiCard
          title={isHi ? 'मृत्यु दर' : 'Mortality Rate'}
          value="2.1%"
          change={isHi ? '▼ 1.4% कमी' : '▼ 1.4% decrease'}
          tone="emerald"
          icon="📉"
        />
        <KpiCard
          title={isHi ? 'जियोफेंस अलर्ट' : 'Geofence Alerts'}
          value="43"
          change={isHi ? 'गाय सीमा से बाहर' : 'Cows out of bound'}
          tone="red"
          icon="🚧"
        />
        <KpiCard
          title={isHi ? 'चारा विलंब' : 'Fodder Delay'}
          value="18"
          change={isHi ? 'नांद खाली (अलर्ट)' : 'Trough Empty'}
          tone="saffron"
          icon="🌾"
        />
      </div>

      {/* GIS Map & Selected Gaushala Telemetry */}
      <div className="grid-2col">
        {/* Interactive GIS Map */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <MapPin size={18} color="var(--saffron)" />
              {isHi ? 'छत्तीसगढ़ गो-सेवा संभाग मानचित्र (GIS Telemetry)' : 'Chhattisgarh Gau-Sewa Division Map (GIS Telemetry)'}
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {isHi ? '6 प्रमुख गौशाला केंद्र' : '6 Major Gaushala Centers'}
            </span>
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
                  {selectedGaushala.status === 'ok'
                    ? (isHi ? 'पूर्ण सत्यापित' : 'Fully Verified')
                    : selectedGaushala.status === 'warn'
                    ? (isHi ? 'चेतावनी' : 'Warning')
                    : (isHi ? 'गंभीर अंतर' : 'Severe Variance')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {isHi ? 'AI सत्यापित / पंजीकृत:' : 'AI Verified / Registered:'}
                  </span>
                  <br />
                  <b style={{ fontSize: '0.95rem', color: selectedGaushala.reg - selectedGaushala.ver > 20 ? 'var(--red-alert)' : 'var(--emerald)' }}>
                    {selectedGaushala.ver} / {selectedGaushala.reg} {isHi ? 'गायें' : 'cattle'}
                  </b>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {isHi ? 'चारा नांद स्थिति:' : 'Feed Trough Status:'}
                  </span>
                  <br />
                  <b style={{ color: selectedGaushala.feedStatus === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>
                    {selectedGaushala.feedStatus === 'ok'
                      ? (isHi ? 'समय पर (8:20 AM)' : 'On Time (8:20 AM)')
                      : (isHi ? 'नांद खाली (अलर्ट)' : 'Trough Empty (Alert)')}
                  </b>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {isHi ? 'जोखिम स्कोर (AI Risk):' : 'Risk Score (AI Risk):'}
                  </span>
                  <br />
                  <b style={{ color: selectedGaushala.status === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>
                    {selectedGaushala.status === 'ok'
                      ? (isHi ? '12 / 100 (न्यूनतम)' : '12 / 100 (Low)')
                      : (isHi ? '87 / 100 (उच्च जोखिम)' : '87 / 100 (High Risk)')}
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                <button
                  className="btn-gov outline btn-sm"
                  onClick={() => onOpenAuditModal(selectedGaushala)}
                >
                  <FileSearch size={14} />
                  {isHi ? 'AI ऑडिट रिपोर्ट' : 'AI Audit Report'}
                </button>
                <button
                  className="btn-gov saffron btn-sm"
                  onClick={() => onOpenGrantModal({ g: selectedGaushala, amt: `₹ ${(selectedGaushala.ver * 40 * 75 / 100000).toFixed(2)} L`, index: 0 })}
                >
                  {isHi ? 'अनुदान देखें' : 'View Grant'}
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
              {isHi ? 'वास्तविक समय राज्य अलर्ट (Active AI Triggers)' : 'Real-time State Alerts (Active AI Triggers)'}
            </h3>
            <span className="live-pulse-badge" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <span className="pulsing-dot" style={{ background: '#ef4444' }} />
              {isHi ? 'लाइव' : 'LIVE'}
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

      {/* Analytics Charts (Mortality SVG + Grant Distribution) & New Feed Stock/Requests */}
      <div className="grid-2col">
        {/* Feed Stock Summary */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Award size={18} color="var(--emerald)" />
              {isHi ? 'राज्यव्यापी चारा स्टॉक व अनुरोध (Feed & Requests)' : 'Statewide Feed Stock & Requests'}
            </h3>
            <span className="status-badge warn">{isHi ? '14 अनुरोध लंबित' : '14 Pending Requests'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="stock-bar-row">
              <span style={{ fontSize: '0.85rem' }}>{isHi ? 'हरा चारा स्टॉक (कुल)' : 'Green Fodder Stock (Total)'}</span>
              <b style={{ color: 'var(--emerald)' }}>14,500 {isHi ? 'टन' : 'Tonnes'}</b>
            </div>
            <div className="stock-bar-row">
              <span style={{ fontSize: '0.85rem' }}>{isHi ? 'सूखा चारा स्टॉक (कुल)' : 'Dry Fodder Stock (Total)'}</span>
              <b style={{ color: 'var(--saffron)' }}>8,200 {isHi ? 'टन' : 'Tonnes'}</b>
            </div>
            <div className="stock-bar-row" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isHi ? 'लंबित मांग (Pending Requests)' : 'Pending Demands'}</span>
              <button className="btn-gov outline btn-sm" onClick={() => onNavigateTab('grants')}>
                {isHi ? 'समीक्षा करें' : 'Review'}
              </button>
            </div>
          </div>
        </div>

        {/* Mortality Trend Chart */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <TrendingDown size={18} color="var(--emerald)" />
              {isHi ? 'गोवंश मृत्यु दर में कमी ट्रेंड (6 माह AI प्रभाव)' : 'Cattle Mortality Reduction Trend (6-Mo AI Impact)'}
            </h3>
            <span className="status-badge ok">{isHi ? '46% गिरावट' : '46% Drop'}</span>
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
              <span>{isHi ? 'अप्रैल' : 'Apr'}</span>
              <span>{isHi ? 'मई' : 'May'}</span>
              <span>{isHi ? 'जून' : 'Jun'}</span>
              <span>{isHi ? 'जुलाई' : 'Jul'}</span>
              <span>{isHi ? 'अगस्त' : 'Aug'}</span>
              <span>{isHi ? 'सितंबर' : 'Sep'}</span>
              <span>{isHi ? 'अक्टूबर (आज)' : 'Oct (Today)'}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            {isHi
              ? '💡 AI द्वारा समय पर गिरी हुई गाय एवं सुस्त पशुओं की पहचान से मृत्यु दर 3.9% से घटकर मात्र 2.1% रह गई।'
              : '💡 AI early recognition of fallen and lethargic cattle dropped mortality rate from 3.9% down to 2.1%.'}
          </p>
        </div>

        {/* Grant Distribution Donut */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Award size={18} color="var(--saffron)" />
              {isHi ? 'अनुदान सत्यापन वितरण (DBT Compliance)' : 'Grant Verification Distribution (DBT)'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isHi ? 'तिमाही Q3' : 'Quarter Q3'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* SVG Donut */}
            <svg viewBox="0 0 120 120" style={{ width: 130, height: 130, flexShrink: 0 }}>
              {/* Segments: 82% OK, 11% Warn, 7% Bad */}
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
                  {isHi ? 'पूर्ण सत्यापित (DBT जारी)' : 'Fully Verified (DBT Released)'}
                </span>
                <b>82%</b>
              </div>
              <div className="stock-bar-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }} />
                  {isHi ? 'समीक्षाधीन (Verification)' : 'Under Review (Verification)'}
                </span>
                <b>11%</b>
              </div>
              <div className="stock-bar-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }} />
                  {isHi ? 'रोका गया (Ghost Cattle)' : 'Withheld (Ghost Cattle)'}
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
            <h3>
              {isHi
                ? 'गौशाला मास्टर सूची · पंजीकृत बनाम AI सत्यापित गणना'
                : 'Gaushala Master Ledger · Registered vs AI Verified Count'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isHi
                ? 'प्रत्येक गौशाला की लाइव स्थिति, गणना अंतर एवं त्वरित कार्य'
                : 'Live status, count variance and rapid actions for each gaushala'}
            </p>
          </div>
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32, fontSize: '0.78rem' }}
              placeholder={isHi ? "गौशाला या जिला खोजें..." : "Search gaushala or district..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{isHi ? 'कोड' : 'Code'}</th>
                <th>{isHi ? 'गौशाला का नाम' : 'Gaushala Name'}</th>
                <th>{isHi ? 'जिला / संभाग' : 'District / Zone'}</th>
                <th>{isHi ? 'पंजीकृत' : 'Registered'}</th>
                <th>{isHi ? 'AI सत्यापित' : 'AI Verified'}</th>
                <th>{isHi ? 'गणना अंतर (%)' : 'Variance (%)'}</th>
                <th>{isHi ? 'चारा स्थिति' : 'Feed Status'}</th>
                <th>{isHi ? 'ऑडिट स्कोर' : 'Audit Score'}</th>
                <th>{isHi ? 'स्थिति' : 'Status'}</th>
                <th>{isHi ? 'कार्यवाही' : 'Action'}</th>
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
                      {diffPct}% {diff > 0 ? (isHi ? `(${diff} गायें)` : `(${diff} cattle)`) : '✓'}
                    </td>
                    <td>
                      <span className={`status-badge ${g.feedStatus === 'ok' ? 'ok' : 'bad'}`}>
                        {g.feedStatus === 'ok'
                          ? (isHi ? 'समय पर ✓' : 'On Time ✓')
                          : (isHi ? 'देरी / खाली ⚠️' : 'Delay / Empty ⚠️')}
                      </span>
                    </td>
                    <td><b>{g.lastAuditScore}/100</b></td>
                    <td>
                      <span className={`status-badge ${g.status}`}>
                        {g.status === 'ok'
                          ? (isHi ? 'सत्यापित' : 'Verified')
                          : g.status === 'warn'
                          ? (isHi ? 'चेतावनी' : 'Warning')
                          : (isHi ? 'गंभीर अंतर' : 'Variance')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn-gov outline btn-sm"
                          onClick={() => onOpenAuditModal(g)}
                          title={isHi ? "ऑडिट रिपोर्ट" : "Audit Report"}
                        >
                          {isHi ? 'ऑडिट' : 'Audit'}
                        </button>
                        <button
                          className="btn-gov saffron btn-sm"
                          onClick={() => setSelectedId(g.id)}
                          title={isHi ? "मानचित्र पर देखें" : "View on Map"}
                        >
                          {isHi ? 'देखें' : 'View'}
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
