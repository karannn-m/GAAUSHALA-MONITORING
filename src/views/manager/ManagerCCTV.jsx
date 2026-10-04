import React, { useState } from 'react';
import LiveCameraFeed from '../../components/LiveCameraFeed';
import KpiCard from '../../components/KpiCard';
import { Camera, Moon, ShieldAlert, Stethoscope, BellRing, Sparkles } from 'lucide-react';
import { toggleSirenSound, playAlertWarningSound, playSuccessSound } from '../../sound';

export default function ManagerCCTV({ onOpenPhotoModal, onShowToast }) {
  const [isIrMode, setIsIrMode] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  const handleSiren = () => {
    const nextState = !sirenActive;
    setSirenActive(nextState);
    toggleSirenSound(nextState);
    if (nextState) {
      onShowToast('🚨 सायरन सक्रिय! सुरक्षा गार्ड एवं कंट्रोल रूम को अलर्ट भेजा गया');
    } else {
      onShowToast('सायरन बंद किया गया');
    }
  };

  const handleDoctorAlert = () => {
    playAlertWarningSound();
    onShowToast('🩺 आपातकालीन अलर्ट डॉ. ए. के. मिश्रा (B.V.Sc) को भेजा गया');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">CCTV · Edge-AI डिटेक्शन नेटवर्क (Real-Time Vision)</h2>
          <p className="page-desc">
            कम लागत Edge-AI (YOLOv8 + OpenCV) — मौजूदा गौशाला कैमरों पर स्वतः गणना एवं व्यवहार पहचान
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn-gov ${isIrMode ? 'emerald' : 'outline'}`}
            onClick={() => setIsIrMode(!isIrMode)}
          >
            <Moon size={16} />
            {isIrMode ? 'नाइट-विज़न (IR) सक्रिय' : 'नाइट-विज़न (IR) टॉगल करें'}
          </button>
          <button
            className={`btn-gov ${sirenActive ? 'crimson' : 'outline'}`}
            onClick={handleSiren}
          >
            <BellRing size={16} />
            {sirenActive ? 'सायरन बंद करें (Mute)' : '🚨 सायरन बजाएँ (Test Siren)'}
          </button>
        </div>
      </div>

      {/* Edge-AI Performance KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title="Edge-AI इन्फरेंस स्पीड"
          value="24 FPS"
          change="Real-time GPU/NPU"
          tone="emerald"
          icon="⚡"
        />
        <KpiCard
          title="डिटेक्शन लेटेंसी"
          value="38 ms"
          change="Edge Box Processing"
          tone="blue"
          icon="⏱️"
        />
        <KpiCard
          title="हेडकाउंट सटीकता दर"
          value="97.3%"
          change="AI + RFID क्रॉस-मैच"
          tone="emerald"
          icon="🎯"
        />
        <KpiCard
          title="सक्रिय CCTV कैमरे"
          value="6 / 6"
          change="सभी कैमरा नोड्स ऑनलाइन"
          tone="saffron"
          icon="📹"
        />
      </div>

      {/* 4 Interactive Live AI Feeds */}
      <div className="grid-2col">
        {/* 1. Automated Headcount */}
        <LiveCameraFeed
          title="1. स्वचालित हेडकाउंट (Automated Headcount)"
          cameraCode="CAM-01-GATE-SOUTH"
          boxes={[
            { x: 10, y: 50, w: 15, h: 32, label: 'गाय #1187 (गीर) 97%' },
            { x: 32, y: 54, w: 15, h: 28, label: 'गाय #3320 (देसी) 95%' },
            { x: 55, y: 48, w: 16, h: 34, label: 'गाय #8809 (थार.) 93%' },
            { x: 76, y: 52, w: 15, h: 30, label: 'गाय #4471 (साही.) 96%' },
          ]}
          caption="दिन में 2 बार स्वचालित गणना + फोटो-प्रमाण सुरक्षित"
          isIrMode={isIrMode}
          bgType="pasture"
          onSnapshot={(data) => {
            onShowToast('📸 Gate-1 हेडकाउंट फोटो कैप्चर');
            onOpenPhotoModal(data);
          }}
        />

        {/* 2. Feed Trough Vision */}
        <LiveCameraFeed
          title="2. चारा नांद निगरानी (Feed Trough Vision)"
          cameraCode="CAM-02-FEED-TROUGH-B"
          boxes={[
            { x: 8, y: 60, w: 84, h: 22, tone: 'y', label: 'चारा नांद: भरी 80% (हरा चारा)' }
          ]}
          caption="प्रातः 9:00 AM तक नांद खाली होने पर स्वचालित अलर्ट"
          isIrMode={isIrMode}
          bgType="trough"
          onSnapshot={(data) => {
            onShowToast('📸 चारा नांद फोटो प्रमाण कैप्चर');
            onOpenPhotoModal(data);
          }}
        />

        {/* 3. Sick / Fallen Cow Detector */}
        <LiveCameraFeed
          title="3. बीमार / गिरी हुई गाय (Fallen Cow Detector)"
          cameraCode="CAM-03-SHED-C-CLINIC"
          boxes={[
            { x: 38, y: 48, w: 26, h: 34, tone: 'r', label: '⚠️ गिरी हुई गाय #4471 (4h 20m स्थिर)' },
            { x: 10, y: 42, w: 16, h: 32, label: 'स्वस्थ गाय #1024 94%' },
          ]}
          caption="AI Posture + Immobility Detection (अस्थिरता पहचान)"
          isIrMode={isIrMode}
          bgType="shed"
          alertButtonText="डॉक्टर को आपातकालीन अलर्ट भेजें"
          alertButtonType="crimson"
          onAlertAction={handleDoctorAlert}
          onSnapshot={(data) => {
            onShowToast('📸 गिरी हुई गाय की स्थिति का फोटो प्रमाण');
            onOpenPhotoModal(data);
          }}
        />

        {/* 4. Perimeter Intrusion Detector */}
        <LiveCameraFeed
          title="4. परिधि सुरक्षा / घुसपैठ (Perimeter Security)"
          cameraCode="CAM-04-NORTH-BOUNDARY-NIGHT"
          boxes={[
            { x: 55, y: 35, w: 14, h: 46, tone: 'r', label: '🚨 अज्ञात व्यक्ति डिटेक्शन 91%' }
          ]}
          caption="रात्रि सुरक्षा: AI बाउंड्री उल्लंघन पर स्वतः सायरन + कंट्रोल रूम अलर्ट"
          isIrMode={isIrMode}
          bgType="night"
          alertButtonText={sirenActive ? 'सायरन बंद करें' : 'सायरन सक्रिय करें'}
          alertButtonType="saffron"
          onAlertAction={handleSiren}
          onSnapshot={(data) => {
            onShowToast('📸 रात्रि घुसपैठ CCTV फोटो प्रमाण');
            onOpenPhotoModal(data);
          }}
        />
      </div>
    </div>
  );
}
