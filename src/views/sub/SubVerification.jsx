import React, { useState, useEffect } from 'react';
import { FileCheck, Camera, CheckCircle, MapPin, WifiOff, UploadCloud, Loader2 } from 'lucide-react';
import KpiCard from '../../components/KpiCard';
import { playSuccessSound, playAlertWarningSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function SubVerification({ gaushalas, onShowToast }) {
  const { isHi, t } = useLanguage();
  
  // States for the Verification Form
  const [verifyingGaushala, setVerifyingGaushala] = useState(null);
  const [actualHeadcount, setActualHeadcount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photoBase64, setPhotoBase64] = useState(null);
  const [gps, setGps] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => { setIsOffline(false); syncOfflineReports(); };
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const zoneGaushalas = gaushalas.filter(
    (g) => g.zone === (isHi ? 'रायपुर ज़ोन' : 'Raipur Zone') || g.zone.includes('रायपुर') || g.zone.includes('Raipur')
  );

  const totalClaimed = zoneGaushalas.reduce((acc, g) => acc + (g.reg * 40 * 75), 0);
  const totalVerified = zoneGaushalas.reduce((acc, g) => acc + (g.ver * 40 * 75), 0);
  const totalHeld = totalClaimed - totalVerified;

  const getLocation = () => {
    if (!navigator.geolocation) {
      onShowToast(isHi ? 'GPS समर्थित नहीं है' : 'GPS not supported by browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => onShowToast(isHi ? 'GPS लोकेशन प्राप्त करने में विफल' : 'Failed to get GPS location')
    );
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitVerification = async () => {
    if (!actualHeadcount || !gps || !photoBase64) {
      onShowToast(isHi ? 'कृपया हेडकाउंट, फोटो और GPS अनिवार्य रूप से दें!' : 'Headcount, Photo, and GPS are mandatory!');
      return;
    }

    const payload = {
      gaushala_id: verifyingGaushala.id,
      reported_rfid_count: verifyingGaushala.ver,
      actual_headcount: parseInt(actualHeadcount),
      lat: gps.lat,
      lng: gps.lng,
      photo_base64: photoBase64,
      remarks: remarks
    };

    if (isOffline) {
      // Save offline
      const offlineReports = JSON.parse(localStorage.getItem('offline_verifications') || '[]');
      offlineReports.push(payload);
      localStorage.setItem('offline_verifications', JSON.stringify(offlineReports));
      onShowToast(isHi ? 'इंटरनेट नहीं है। रिपोर्ट ऑफलाइन सेव की गई।' : 'Offline mode. Report saved locally.');
      playSuccessSound();
      resetForm();
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/sub/verify', payload);
      playSuccessSound();
      onShowToast(isHi ? 'भौतिक सत्यापन रिपोर्ट सर्वर पर सफलतापूर्वक जमा की गई!' : 'Physical Verification Report submitted successfully!');
      resetForm();
    } catch (err) {
      playAlertWarningSound();
      onShowToast(isHi ? 'रिपोर्ट जमा करने में त्रुटि' : 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncOfflineReports = async () => {
    const offlineReports = JSON.parse(localStorage.getItem('offline_verifications') || '[]');
    if (offlineReports.length === 0) return;

    onShowToast(isHi ? 'ऑफ़लाइन रिपोर्ट सिंक हो रही हैं...' : 'Syncing offline reports...');
    for (let report of offlineReports) {
      try {
        await api.post('/api/sub/verify', report);
      } catch (e) {
        console.error('Failed to sync report', e);
      }
    }
    localStorage.removeItem('offline_verifications');
    onShowToast(isHi ? 'सभी ऑफ़लाइन रिपोर्ट सिंक हो गईं!' : 'All offline reports synced!');
  };

  const resetForm = () => {
    setVerifyingGaushala(null);
    setActualHeadcount('');
    setRemarks('');
    setPhotoBase64(null);
    setGps(null);
  };

  return (
    <div>
      <div className="page-header-banner flex justify-between items-center">
        <div>
          <h2 className="page-title">{t('verifyTitle')}</h2>
          <p className="page-desc">{t('verifyDesc')}</p>
        </div>
        {isOffline && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
            <WifiOff size={18} />
            {isHi ? 'आप ऑफलाइन हैं' : 'You are Offline'}
          </div>
        )}
      </div>

      <div className="kpi-grid">
        <KpiCard title={t('zoneClaimed')} value={`₹ ${(totalClaimed / 100000).toFixed(2)} L`} tone="blue" icon="📋" />
        <KpiCard title={t('zoneVerified')} value={`₹ ${(totalVerified / 100000).toFixed(2)} L`} tone="emerald" icon="💰" />
        <KpiCard title={t('zoneHeld')} value={`₹ ${(totalHeld / 100000).toFixed(2)} L`} tone="saffron" icon="🛡️" />
      </div>

      {verifyingGaushala ? (
        <div className="dash-card max-w-2xl mx-auto border-t-4 border-emerald-500">
          <div className="card-title-row">
            <h3>
              <FileCheck size={18} color="var(--emerald)" />
              {isHi ? `भौतिक सत्यापन: ${verifyingGaushala.name}` : `Physical Verification: ${verifyingGaushala.name}`}
            </h3>
          </div>
          
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">{isHi ? 'सिस्टम (RFID) काउंट' : 'System (RFID) Count'}</p>
                <p className="text-xl font-bold text-gray-800">{verifyingGaushala.ver}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{isHi ? 'कुल पंजीकृत' : 'Total Registered'}</p>
                <p className="text-xl font-bold text-gray-800">{verifyingGaushala.reg}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {isHi ? 'वास्तविक हेडकाउंट (गौशाला में)' : 'Actual Headcount (On Ground)'} *
              </label>
              <input 
                type="number" 
                value={actualHeadcount}
                onChange={(e) => setActualHeadcount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder={isHi ? 'मैनुअल गणना दर्ज करें' : 'Enter manual count'}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={getLocation} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${gps ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <MapPin size={20} />
                {gps ? (isHi ? 'GPS टैग हो गया ✓' : 'GPS Tagged ✓') : (isHi ? 'GPS लोकेशन लें *' : 'Capture GPS *')}
              </button>

              <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${photoBase64 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <Camera size={20} />
                {photoBase64 ? (isHi ? 'फोटो अपलोड हो गई ✓' : 'Photo Uploaded ✓') : (isHi ? 'कैमरे से फोटो लें *' : 'Capture Photo *')}
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
              </label>
            </div>

            {photoBase64 && (
              <img src={photoBase64} alt="Proof" className="w-full h-48 object-cover rounded-lg border" />
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{isHi ? 'रिमार्क्स / टिप्पणियाँ' : 'Remarks / Comments'}</label>
              <textarea 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                rows="3"
                placeholder={isHi ? 'कोई अतिरिक्त जानकारी...' : 'Any additional details...'}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button onClick={resetForm} className="flex-1 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold">
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button 
                onClick={submitVerification} 
                disabled={isSubmitting}
                className="flex-2 flex-grow py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                {isOffline ? (isHi ? 'ऑफ़लाइन सेव करें' : 'Save Offline') : (isHi ? 'वेरिफाई और सबमिट' : 'Verify & Submit')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="dash-card">
          <div className="card-title-row">
            <h3><FileCheck size={18} color="var(--emerald)" /> {t('verifyTitle')}</h3>
          </div>
          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{t('tableGaushalaCode')}</th>
                  <th>{t('tableName')}</th>
                  <th>{t('tableVer')}</th>
                  <th>{t('tableAction')}</th>
                </tr>
              </thead>
              <tbody>
                {zoneGaushalas.map((g) => (
                  <tr key={g.id}>
                    <td><b style={{ fontFamily: 'var(--font-mono)' }}>{g.id}</b></td>
                    <td><b>{g.name}</b></td>
                    <td><b style={{ color: 'var(--emerald)' }}>{g.ver}</b> / {g.reg}</td>
                    <td>
                      <button className="btn-gov emerald btn-sm" onClick={() => setVerifyingGaushala(g)}>
                        <FileCheck size={14} />
                        {isHi ? 'भौतिक सत्यापन करें' : 'Perform Verification'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
