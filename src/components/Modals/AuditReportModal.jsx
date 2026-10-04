import React from 'react';
import { X, Printer, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function AuditReportModal({ auditData, onClose }) {
  if (!auditData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 750 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color="var(--saffron)" />
            <b style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              सरकारी AI ऑडिट एवं सतर्कता रिपोर्ट (Inspection Report)
            </b>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {/* Printable Audit Body */}
        <div className="modal-body" id="printable-audit">
          {/* Official Letterhead */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid var(--saffron)', paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🏛️</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: 0 }}>
              राज्य गो-सेवा आयोग · पशुधन विकास विभाग
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0' }}>
              स्वचालित AI + IoT ऑडिट निगरानी रिपोर्ट (SGMS Rule 14-B)
            </p>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              रिपोर्ट सं.: CG/GAU-AUDIT/2026/Q3-094 • दिनांक: {new Date().toLocaleDateString('hi-IN')}
            </div>
          </div>

          {/* Gaushala Particulars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: '0.82rem' }}>
            <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6 }}>
              <div>गौशाला का नाम: <b>{auditData.name}</b></div>
              <div>पंजीकरण क्रमांक: <b>{auditData.id}</b></div>
              <div>जिला / संभाग: <b>{auditData.district} ({auditData.zone})</b></div>
            </div>
            <div style={{ background: 'var(--badge-bg)', padding: 10, borderRadius: 6 }}>
              <div>प्रबंधक: <b>{auditData.manager || 'श्री रामनारायण वर्मा'}</b></div>
              <div>संपर्क: <b>{auditData.contact || '+91 98261 44521'}</b></div>
              <div>AI ऑडिट स्कोर: <b style={{ color: auditData.status === 'ok' ? 'var(--emerald)' : 'var(--red-alert)' }}>{auditData.lastAuditScore || 92}/100</b></div>
            </div>
          </div>

          {/* Audit Verification Table */}
          <h4 style={{ fontSize: '0.88rem', marginBottom: 8, color: 'var(--text-primary)' }}>
            1. भौतिक सत्यापन बनाम AI डेटा मिलान (Discrepancy Matrix)
          </h4>
          <div className="table-responsive" style={{ marginBottom: 16 }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>मापदंड (Metric)</th>
                  <th>दावाकृत संख्या</th>
                  <th>AI सत्यापित</th>
                  <th>अंतर (Discrepancy)</th>
                  <th>स्थिति</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>कुल गोवंश Headcount</td>
                  <td>{auditData.reg}</td>
                  <td>{auditData.ver}</td>
                  <td style={{ color: auditData.reg - auditData.ver > 20 ? 'var(--red-alert)' : 'inherit', fontWeight: 700 }}>
                    {auditData.reg - auditData.ver} गायें ({Math.round(((auditData.reg - auditData.ver) / auditData.reg) * 100)}%)
                  </td>
                  <td>
                    <span className={`status-badge ${auditData.status === 'bad' ? 'bad' : 'ok'}`}>
                      {auditData.status === 'bad' ? 'समीक्षा आवश्यक' : 'सत्यापित ✓'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>RFID इयर-टैग कवरेज</td>
                  <td>100%</td>
                  <td>{auditData.rfidCoverage || '98%'}</td>
                  <td>-2% टैग क्षतिग्रस्त/अनुपलब्ध</td>
                  <td><span className="status-badge ok">मानक अनुसार</span></td>
                </tr>
                <tr>
                  <td>चारा तौल-पर्ची बनाम बिल</td>
                  <td>3,240 kg</td>
                  <td>3,240 kg</td>
                  <td>0 kg (पूर्ण मिलान)</td>
                  <td><span className="status-badge ok">प्रमाणित ✓</span></td>
                </tr>
                <tr>
                  <td>ANPR वाहन नंबर मिलान</td>
                  <td>CG 04 AB 2381</td>
                  <td>CG 04 AB 2381</td>
                  <td>GPS एवं CCTV पुष्टीकृत</td>
                  <td><span className="status-badge ok">सत्यापित ✓</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Auditor Remark & Recommendations */}
          <div style={{ background: 'var(--bg-app)', borderLeft: '4px solid var(--saffron)', padding: 12, borderRadius: 6, fontSize: '0.8rem' }}>
            <b style={{ color: 'var(--text-primary)' }}>AI ऑडिट निष्कर्ष एवं सिफारिश:</b>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
              {auditData.status === 'bad'
                ? 'गौशाला में पंजीकृत संख्या और वास्तविक गणना में 30% से अधिक अंतर पाया गया है। तिल्दा गौशाला को आगामी तिमाही का अनुदान रोके जाने एवं उप-प्रशासक द्वारा स्थलीय निरीक्षण की अनुशंसा की जाती है।'
                : 'गौशाला में सभी मापदंड, सीसीटीवी एवं आरएफआईडी डेटा गो-सेवा आयोग के मानकों के अनुकूल पाए गए हैं। निर्धारित दर ₹40/प्रति गाय के मान से डीबीटी अनुदान निर्गमन हेतु संस्तुत है।'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-gov outline" onClick={onClose}>
            बंद करें
          </button>
          <button className="btn-gov saffron" onClick={handlePrint}>
            <Printer size={16} />
            रिपोर्ट प्रिंट / PDF सहेजें
          </button>
        </div>
      </div>
    </div>
  );
}
