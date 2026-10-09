import React, { useState } from 'react';
import LiveCameraFeed from '../../components/LiveCameraFeed';
import KpiCard from '../../components/KpiCard';
import { Camera, Moon, ShieldAlert, Stethoscope, BellRing, Sparkles } from 'lucide-react';
import { toggleSirenSound, playAlertWarningSound, playSuccessSound } from '../../sound';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagerCCTV({ onOpenPhotoModal, onShowToast }) {
  const { isHi } = useLanguage();
  const [isIrMode, setIsIrMode] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  const handleSiren = () => {
    const nextState = !sirenActive;
    setSirenActive(nextState);
    toggleSirenSound(nextState);
    if (nextState) {
      onShowToast(isHi ? '🚨 सायरन सक्रिय! सुरक्षा गार्ड एवं कंट्रोल रूम को अलर्ट भेजा गया' : '🚨 Siren active! Alert sent to security guard & control room');
    } else {
      onShowToast(isHi ? 'सायरन बंद किया गया' : 'Siren muted');
    }
  };

  const handleDoctorAlert = () => {
    playAlertWarningSound();
    onShowToast(isHi ? '🩺 आपातकालीन अलर्ट डॉ. ए. के. मिश्रा (B.V.Sc) को भेजा गया' : '🩺 Emergency alert sent to Dr. A. K. Mishra (B.V.Sc)');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">
            {isHi ? 'CCTV लाइव फ़ीड (Live Feed)' : 'CCTV Live Feed'}
          </h2>
          <p className="page-desc">
            {isHi
              ? 'गौशाला कैमरों पर स्वतः गणना एवं व्यवहार पहचान'
              : 'Automated headcount & behavioral detection on CCTV'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn-gov ${isIrMode ? 'emerald' : 'outline'}`}
            onClick={() => setIsIrMode(!isIrMode)}
          >
            <Moon size={16} />
            {isIrMode
              ? (isHi ? 'नाइट-विज़न (IR) सक्रिय' : 'Night Vision (IR) Active')
              : (isHi ? 'नाइट-विज़न (IR) टॉगल करें' : 'Toggle Night Vision (IR)')}
          </button>
          <button
            className={`btn-gov ${sirenActive ? 'crimson' : 'outline'}`}
            onClick={handleSiren}
          >
            <BellRing size={16} />
            {sirenActive
              ? (isHi ? 'सायरन बंद करें (Mute)' : 'Mute Siren')
              : (isHi ? '🚨 सायरन बजाएँ (Test Siren)' : '🚨 Sound Siren (Test)')}
          </button>
        </div>
      </div>

      {/* System Performance KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title={isHi ? "सिस्टम स्पीड" : "System Speed"}
          value="24 FPS"
          change="Real-time"
          tone="emerald"
          icon="⚡"
        />
        <KpiCard
          title={isHi ? "डिटेक्शन लेटेंसी" : "Detection Latency"}
          value="38 ms"
          change="Edge Box Processing"
          tone="blue"
          icon="⏱️"
        />
        <KpiCard
          title={isHi ? "हेडकाउंट सटीकता दर" : "Headcount Accuracy Rate"}
          value="97.3%"
          change="AI + RFID Cross-Match"
          tone="emerald"
          icon="🎯"
        />
        <KpiCard
          title={isHi ? "सक्रिय CCTV कैमरे" : "Active CCTV Cameras"}
          value="6 / 6"
          change={isHi ? "सभी कैमरा नोड्स ऑनलाइन" : "All nodes online"}
          tone="saffron"
          icon="📹"
        />
      </div>

      {/* 4 Interactive Live AI Feeds */}
      <div className="grid-2col">
        {/* 1. Automated Headcount */}
        <LiveCameraFeed
          title={isHi ? "1. स्वचालित हेडकाउंट (Automated Headcount)" : "1. Automated Headcount"}
          cameraCode="CAM-01-GATE-SOUTH"
          boxes={[
            { x: 10, y: 50, w: 15, h: 32, label: isHi ? 'गाय #1187 (गीर) 97%' : 'Cow #1187 (Gir) 97%' },
            { x: 32, y: 54, w: 15, h: 28, label: isHi ? 'गाय #3320 (देसी) 95%' : 'Cow #3320 (Desi) 95%' },
            { x: 55, y: 48, w: 16, h: 34, label: isHi ? 'गाय #8809 (थार.) 93%' : 'Cow #8809 (Thar.) 93%' },
            { x: 76, y: 52, w: 15, h: 30, label: isHi ? 'गाय #4471 (साही.) 96%' : 'Cow #4471 (Sahi.) 96%' },
          ]}
          caption={isHi ? "दिन में 2 बार स्वचालित गणना + फोटो-प्रमाण सुरक्षित" : "Automated count twice daily with saved photo evidence"}
          isIrMode={isIrMode}
          bgType="pasture"
          onSnapshot={(data) => {
            onShowToast(isHi ? '📸 Gate-1 हेडकाउंट फोटो कैप्चर' : '📸 Gate-1 headcount snapshot captured');
            onOpenPhotoModal(data);
          }}
        />

        {/* 2. Feed Trough Vision */}
        <LiveCameraFeed
          title={isHi ? "2. चारा नांद निगरानी (Feed Trough Vision)" : "2. Feed Trough Vision"}
          cameraCode="CAM-02-FEED-TROUGH-B"
          boxes={[
            { x: 8, y: 60, w: 84, h: 22, tone: 'y', label: isHi ? 'चारा नांद: भरी 80% (हरा चारा)' : 'Feed Trough: Filled 80% (Green)' }
          ]}
          caption={isHi ? "प्रातः 9:00 AM तक नांद खाली होने पर स्वचालित अलर्ट" : "Automated trigger if trough remains empty past 9:00 AM"}
          isIrMode={isIrMode}
          bgType="trough"
          onSnapshot={(data) => {
            onShowToast(isHi ? '📸 चारा नांद फोटो प्रमाण कैप्चर' : '📸 Feed trough snapshot captured');
            onOpenPhotoModal(data);
          }}
        />

        {/* 3. Sick / Fallen Cow Detector */}
        <LiveCameraFeed
          title={isHi ? "3. बीमार / गिरी हुई गाय (Fallen Cow Detector)" : "3. Sick / Fallen Cow Detector"}
          cameraCode="CAM-03-SHED-C-CLINIC"
          boxes={[
            { x: 38, y: 48, w: 26, h: 34, tone: 'r', label: isHi ? '⚠️ गिरी हुई गाय #4471 (4h 20m स्थिर)' : '⚠️ Fallen Cow #4471 (4h 20m immobile)' },
            { x: 10, y: 42, w: 16, h: 32, label: isHi ? 'स्वस्थ गाय #1024 94%' : 'Healthy Cow #1024 94%' },
          ]}
          caption={isHi ? "AI Posture + Immobility Detection (अस्थिरता पहचान)" : "AI Posture + Immobility Detection (Computer Vision)"}
          isIrMode={isIrMode}
          bgType="shed"
          alertButtonText={isHi ? "डॉक्टर को आपातकालीन अलर्ट भेजें" : "Dispatch Vet Doctor Alert"}
          alertButtonType="crimson"
          onAlertAction={handleDoctorAlert}
          onSnapshot={(data) => {
            onShowToast(isHi ? '📸 गिरी हुई गाय की स्थिति का फोटो प्रमाण' : '📸 Fallen cow condition snapshot captured');
            onOpenPhotoModal(data);
          }}
        />

        {/* 4. Perimeter Intrusion Detector */}
        <LiveCameraFeed
          title={isHi ? "4. परिधि सुरक्षा / घुसपैठ (Perimeter Security)" : "4. Perimeter Security / Intrusion"}
          cameraCode="CAM-04-NORTH-BOUNDARY-NIGHT"
          boxes={[
            { x: 55, y: 35, w: 14, h: 46, tone: 'r', label: isHi ? '🚨 अज्ञात व्यक्ति डिटेक्शन 91%' : '🚨 Unknown Intruder Detected 91%' }
          ]}
          caption={isHi ? "रात्रि सुरक्षा: AI बाउंड्री उल्लंघन पर स्वतः सायरन + कंट्रोल रूम अलर्ट" : "Night security: Boundary breach triggers automated siren + control room alert"}
          isIrMode={isIrMode}
          bgType="night"
          alertButtonText={sirenActive ? (isHi ? 'सायरन बंद करें' : 'Mute Siren') : (isHi ? 'सायरन सक्रिय करें' : 'Sound Siren')}
          alertButtonType="saffron"
          onAlertAction={handleSiren}
          onSnapshot={(data) => {
            onShowToast(isHi ? '📸 रात्रि घुसपैठ CCTV फोटो प्रमाण' : '📸 Night intrusion snapshot captured');
            onOpenPhotoModal(data);
          }}
        />
      </div>
    </div>
  );
}
