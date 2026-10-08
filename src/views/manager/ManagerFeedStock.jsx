import React, { useState } from 'react';
import { Wheat, Truck, PlusCircle, MinusCircle, CheckCircle2, Scale, Loader2 } from 'lucide-react';
import { playSuccessSound, playAlertWarningSound } from '../../sound';
import { WEIGHBRIDGE_LOGS } from '../../data/portalData';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function ManagerFeedStock({
  stock,
  onDeductStock,
  onAddStock,
  onShowToast
}) {
  const { isHi } = useLanguage();
  const [cowCount, setCowCount] = useState(204);
  const [isDeducting, setIsDeducting] = useState(false);

  const greenPerCow = 15;
  const dryPerCow = 5;
  const feedPerCow = 1.5;

  const totalGreen = cowCount * greenPerCow;
  const totalDry = cowCount * dryPerCow;
  const totalFeed = (cowCount * feedPerCow).toFixed(1);

  const meta = [
    { key: 'hara', label: isHi ? 'हरा चारा (नेपियर)' : 'Green Fodder (Napier)', max: 8000, val: stock.hara },
    { key: 'sukha', label: isHi ? 'सूखा चारा (पैरा)' : 'Dry Fodder (Straw)', max: 3000, val: stock.sukha },
    { key: 'dana', label: isHi ? 'संतुलित दाना' : 'Concentrate Feed', max: 600, val: stock.dana },
  ];

  const handleDeduct = async () => {
    setIsDeducting(true);
    try {
      const response = await api.post('/api/manager/feed/consume', { cows_count: cowCount });
      // If we had the new state from backend, we could sync it. For now, trigger UI update.
      onDeductStock(cowCount);
      playSuccessSound();
      onShowToast(isHi ? `✓ ${cowCount} गायों के राशन की डेटाबेस में प्रविष्टि सफल रही` : `✓ Ration deduction logged for ${cowCount} cattle in database`);
    } catch (e) {
      playAlertWarningSound();
      onShowToast(isHi ? 'राशन डेटाबेस में सहेजने में विफल' : 'Failed to save ration to database');
    } finally {
      setIsDeducting(false);
    }
  };

  const handleAddTruckStock = () => {
    onAddStock('hara', 3240);
    playSuccessSound();
    onShowToast(
      isHi
        ? '✓ धर्मकाँटा तौल पर्ची अनुसार 3,240 kg हरा चारा डिजिटल स्टॉक में जोड़ा गया'
        : '✓ 3,240 kg green fodder added to digital inventory per weighbridge receipt'
    );
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'चारा एवं डिजिटल स्टॉक प्रबंधन (Ration & Weighbridge)' : 'Fodder & Digital Stock Management'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'AI सत्यापित गोवंश संख्या से जुड़ी पारदर्शी राशन व्यवस्था + धर्मकाँटा एवं ANPR वाहन मिलान'
              : 'Transparent ration system linked to AI verified cattle count + Smart Weighbridge & ANPR verification'}
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Dynamic Ration Calculator */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Scale size={18} color="var(--emerald)" />
              {isHi ? 'AI राशन कैलकुलेटर (Ration Engine)' : 'AI Ration Calculator (Ration Engine)'}
            </h3>
            <span className="status-badge ok">
              {isHi ? 'मानक: 15 + 5 + 1.5 kg' : 'Norm: 15 + 5 + 1.5 kg'}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">
              {isHi ? 'आज की सत्यापित गायों की संख्या' : 'Today\'s Verified Cattle Count'}
            </label>
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
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isHi ? 'हरा चारा' : 'Green Fodder'}
              </div>
              <b style={{ fontSize: '1.15rem', color: 'var(--emerald)' }}>{totalGreen} kg</b>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isHi ? 'सूखा चारा' : 'Dry Fodder'}
              </div>
              <b style={{ fontSize: '1.15rem', color: 'var(--amber-warn)' }}>{totalDry} kg</b>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isHi ? 'दाना' : 'Concentrate'}
              </div>
              <b style={{ fontSize: '1.15rem', color: 'var(--saffron)' }}>{totalFeed} kg</b>
            </div>
          </div>

          <button className="btn-gov emerald" onClick={handleDeduct} disabled={isDeducting} style={{ width: '100%', justifyContent: 'center' }}>
            {isDeducting ? <Loader2 className="animate-spin" size={16} /> : <MinusCircle size={16} />}
            {isHi
              ? `${cowCount} गायों के राशन की गोदाम स्टॉक से स्वतः कटौती करें`
              : `Auto-deduct ration for ${cowCount} cattle from godown stock`}
          </button>
        </div>

        {/* Digital Godown Stock Status */}
        <div className="dash-card">
          <div className="card-title-row">
            <h3>
              <Wheat size={18} color="var(--saffron)" />
              {isHi ? 'गोदाम का डिजिटल स्टॉक (Current Inventory)' : 'Godown Digital Stock (Current Inventory)'}
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
            💡 <b>{isHi ? 'स्टॉक चेतावनी नियम:' : 'Stock Alert Policy:'}</b>{' '}
            {isHi
              ? '30% से कम होने पर नोडल अधिकारी एवं चारा आपूर्तिकर्ता को स्वचालित इंडेंट जारी हो जाता है।'
              : 'Automated indent is dispatched to nodal officer & supplier if stock dips below 30%.'}
          </div>
        </div>
      </div>

      {/* Smart Weighbridge & ANPR Inward Feed Truck Entry */}
      <div className="dash-card">
        <div className="card-title-row">
          <div>
            <h3>
              <Truck size={18} color="var(--saffron)" />
              {isHi ? 'धर्मकाँटा (Smart Weighbridge) + ANPR चारा गाड़ी प्रवेश' : 'Smart Weighbridge + ANPR Feed Truck Inward'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isHi
                ? 'स्वचालित धर्मकाँटा वजन एवं ANPR नंबर प्लेट मिलान सत्यापन'
                : 'Automated weighbridge gross/tare matching & ANPR license plate verification'}
            </p>
          </div>
          <button className="btn-gov saffron btn-sm" onClick={handleAddTruckStock}>
            <PlusCircle size={14} />
            {isHi ? 'गाड़ी तौल स्वीकारें एवं स्टॉक में जोड़ें (+3,240 kg)' : 'Accept Weighment & Add to Stock (+3,240 kg)'}
          </button>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>{isHi ? 'आईडी' : 'ID'}</th>
                <th>{isHi ? 'वाहन नंबर (ANPR)' : 'Vehicle No (ANPR)'}</th>
                <th>{isHi ? 'चालक / विक्रेता' : 'Driver / Vendor'}</th>
                <th>{isHi ? 'सामग्री प्रकार' : 'Material Type'}</th>
                <th>{isHi ? 'सकल वजन (Gross)' : 'Gross Wt'}</th>
                <th>{isHi ? 'खाली वजन (Tare)' : 'Tare Wt'}</th>
                <th>{isHi ? 'शुद्ध चारा वजन (Net)' : 'Net Wt'}</th>
                <th>{isHi ? 'चालान वजन' : 'Invoice Wt'}</th>
                <th>{isHi ? 'अंतर' : 'Variance'}</th>
                <th>{isHi ? 'सत्यापन स्थिति' : 'Verification Status'}</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHBRIDGE_LOGS.map((wb) => (
                <tr key={wb.id}>
                  <td><b style={{ fontFamily: 'var(--font-mono)' }}>{wb.id}</b></td>
                  <td><b style={{ color: 'var(--saffron)' }}>{wb.vehicleNo}</b></td>
                  <td>
                    {isHi ? (wb.driverHi || wb.driver) : (wb.driverEn || wb.driver)}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {isHi ? (wb.vendorHi || wb.vendor) : (wb.vendorEn || wb.vendor)}
                    </div>
                  </td>
                  <td>{isHi ? (wb.itemHi || wb.item) : (wb.itemEn || wb.item)}</td>
                  <td>{wb.grossWt} kg</td>
                  <td>{wb.tareWt} kg</td>
                  <td><b>{wb.netWt} kg</b></td>
                  <td>{wb.billWt} kg</td>
                  <td style={{ color: wb.diff === 0 ? 'var(--emerald)' : 'var(--red-alert)', fontWeight: 700 }}>
                    {wb.diff === 0 ? (isHi ? 'शून्य अंतर ✓' : 'Zero Variance ✓') : `${wb.diff} kg ${isHi ? 'अंतर' : 'variance'}`}
                  </td>
                  <td>
                    <span className={`status-badge ${wb.status === 'matched' ? 'ok' : 'warn'}`}>
                      {wb.status === 'matched'
                        ? (isHi ? 'पूर्ण मिलान ✓' : 'Full Match ✓')
                        : (isHi ? 'समीक्षा आवश्यक' : 'Review Needed')}
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
