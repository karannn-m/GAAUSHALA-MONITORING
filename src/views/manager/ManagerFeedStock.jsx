import React, { useState } from 'react';
import { Wheat, Truck, PlusCircle, MinusCircle, CheckCircle2, Scale } from 'lucide-react';
import { playSuccessSound } from '../../sound';
import { WEIGHBRIDGE_LOGS } from '../../data/portalData';

export default function ManagerFeedStock({
  stock,
  onDeductStock,
  onAddStock,
  onShowToast
}) {
  const [cowCount, setCowCount] = useState(204);

  const greenPerCow = 15;
  const dryPerCow = 5;
  const feedPerCow = 1.5;

  const totalGreen = cowCount * greenPerCow;
  const totalDry = cowCount * dryPerCow;
  const totalFeed = (cowCount * feedPerCow).toFixed(1);

  const meta = [
    { key: 'hara', label: 'हरा चारा (नेपियर)', max: 8000, val: stock.hara },
    { key: 'sukha', label: 'सूखा चारा (पैरा)', max: 3000, val: stock.sukha },
    { key: 'dana', label: 'संतुलित दाना', max: 600, val: stock.dana },
  ];

  const handleDeduct = () => {
    onDeductStock(cowCount);
  };

  const handleAddTruckStock = () => {
    onAddStock('hara', 3240);
    playSuccessSound();
    onShowToast('✓ धर्मकाँटा तौल पर्ची अनुसार 3,240 kg हरा चारा डिजिटल स्टॉक में जोड़ा गया');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">चारा एवं डिजिटल स्टॉक प्रबंधन (Ration & Weighbridge)</h2>
          <p className="page-desc">
            AI सत्यापित गोवंश संख्या से जुड़ी पारदर्शी राशन व्यवस्था + धर्मकाँटा एवं ANPR वाहन मिलान
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Dynamic Ration Calculator */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Scale size={18} color="var(--emerald)" />
              AI राशन कैलकुलेटर (Ration Engine)
            </h3>
            <span className="status-badge ok">मानक: 15 + 5 + 1.5 kg</span>
          </div>

          <div className="form-group">
            <label className="form-label">आज की सत्यापित गायों की संख्या</label>
            <input
              type="number"
              className="form-input"
              value={cowCount}
              onChange={(e) => setCowCount(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          {/* Breakdown cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '14px 0' }}>
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>हरा चारा</div>
              <b style={{ fontSize: '1.15rem', color: 'var(--emerald)' }}>{totalGreen} kg</b>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>सूखा चारा</div>
              <b style={{ fontSize: '1.15rem', color: 'var(--amber-warn)' }}>{totalDry} kg</b>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>दाना</div>
              <b style={{ fontSize: '1.15rem', color: 'var(--saffron)' }}>{totalFeed} kg</b>
            </div>
          </div>

          <button className="btn-gov emerald" onClick={handleDeduct} style={{ width: '100%', justifyContent: 'center' }}>
            <MinusCircle size={16} />
            {cowCount} गायों के राशन की गोदाम स्टॉक से स्वतः कटौती करें
          </button>
        </div>

        {/* Digital Godown Stock Status */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Wheat size={18} color="var(--saffron)" />
              गोदाम का डिजिटल स्टॉक (Current Inventory)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {meta.map((item) => {
              const pct = Math.round((item.val / item.max) * 100);
              const isLow = pct < 30;

              return (
                <div key={item.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <b>{item.label}</b>
                    <span style={{ color: isLow ? 'var(--red-alert)' : 'var(--emerald)', fontWeight: 700 }}>
                      {Math.round(item.val)} kg / {item.max} kg ({pct}%)
                    </span>
                  </div>
                  <div className="stock-bar-track">
                    <div
                      className="stock-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: isLow ? 'var(--red-alert)' : 'var(--emerald)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, marginTop: 20, fontSize: '0.78rem' }}>
            💡 <b>स्टॉक चेतावनी नियम:</b> 30% से कम होने पर नोडल अधिकारी एवं चारा आपूर्तिकर्ता को स्वचालित इंडेंट जारी हो जाता है।
          </div>
        </div>
      </div>

      {/* Smart Weighbridge & ANPR Inward Feed Truck Entry */}
      <div className="dash-card">
        <div className="card-title-row">
          <div>
            <h3>
              <Truck size={18} color="var(--saffron)" />
              धर्मकाँटा (Smart Weighbridge) + ANPR चारा गाड़ी प्रवेश
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              स्वचालित धर्मकाँटा वजन एवं ANPR नंबर प्लेट मिलान सत्यापन
            </p>
          </div>
          <button className="btn-gov saffron btn-sm" onClick={handleAddTruckStock}>
            <PlusCircle size={14} />
            गाड़ी तौल स्वीकारें एवं स्टॉक में जोड़ें (+3,240 kg)
          </button>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>आईडी</th>
                <th>वाहन नंबर (ANPR)</th>
                <th>चालक / विक्रेता</th>
                <th>सामग्री प्रकार</th>
                <th>सकल वजन (Gross)</th>
                <th>खाली वजन (Tare)</th>
                <th>शुद्ध चारा वजन (Net)</th>
                <th>चालान वजन</th>
                <th>अंतर</th>
                <th>सत्यापन स्थिति</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHBRIDGE_LOGS.map((wb) => (
                <tr key={wb.id}>
                  <td><b style={{ fontFamily: 'var(--font-mono)' }}>{wb.id}</b></td>
                  <td><b style={{ color: 'var(--saffron)' }}>{wb.vehicleNo}</b></td>
                  <td>
                    {wb.driver}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{wb.vendor}</div>
                  </td>
                  <td>{wb.item}</td>
                  <td>{wb.grossWt} kg</td>
                  <td>{wb.tareWt} kg</td>
                  <td><b>{wb.netWt} kg</b></td>
                  <td>{wb.billWt} kg</td>
                  <td style={{ color: wb.diff === 0 ? 'var(--emerald)' : 'var(--red-alert)', fontWeight: 700 }}>
                    {wb.diff === 0 ? 'शून्य अंतर ✓' : `${wb.diff} kg अंतर`}
                  </td>
                  <td>
                    <span className={`status-badge ${wb.status === 'matched' ? 'ok' : 'warn'}`}>
                      {wb.status === 'matched' ? 'पूर्ण मिलान ✓' : 'समीक्षा आवश्यक'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
