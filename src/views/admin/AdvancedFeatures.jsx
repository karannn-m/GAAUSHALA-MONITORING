import React, { useState } from 'react';
import { Bot, TrendingUp, CloudOff, Satellite, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdvancedFeatures({ onShowToast }) {
  const { t, language } = useLanguage();
  const [chatInput, setChatInput] = useState('');

  const isHi = language === 'hi';

  const tTitles = {
    ai: isHi ? 'AI वॉयस चैटबॉट' : 'AI Voice Chatbot',
    forecast: isHi ? 'चारा पूर्वानुमान (Machine Learning)' : 'Fodder Forecasting (ML)',
    pwa: isHi ? 'ऑफ़लाइन PWA मोड' : 'Offline PWA Mode',
    drone: isHi ? 'सैटेलाइट / ड्रोन चारागाह मैपिंग' : 'Satellite / Drone Pasture Mapping',
    whatsapp: isHi ? 'WhatsApp ऑटोमेशन' : 'WhatsApp Automation',
  };

  return (
    <div className="space-y-6">
      <div className="page-header-banner">
        <div>
          <h2 className="page-title">{isHi ? 'भविष्य की तकनीकें (Advanced AI Features)' : 'Advanced Technologies (AI Features)'}</h2>
          <p className="page-desc">
            {isHi ? 'सिस्टम में शामिल किए गए नए स्मार्ट फीचर्स' : 'Newly integrated smart features in the system'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. AI Chatbot */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <Bot className="text-blue-500" /> {tTitles.ai}
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg h-32 flex flex-col justify-end">
            <div className="text-sm text-gray-500 mb-2">
              {isHi ? '🤖 AI: "नमस्ते, मैं आपकी क्या मदद कर सकता हूँ?"' : '🤖 AI: "Hello, how can I help you today?"'}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                className="flex-1 border rounded px-2" 
                placeholder={isHi ? 'पूछें...' : 'Ask something...'} 
              />
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded" 
                onClick={() => { onShowToast(isHi ? 'AI प्रोसेस कर रहा है...' : 'AI processing...'); setChatInput(''); }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* 2. Predictive Fodder */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <TrendingUp className="text-orange-500" /> {tTitles.forecast}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isHi 
              ? 'अगले 3 महीनों के लिए चारे की अनुमानित आवश्यकता (मौसम डेटा आधारित):' 
              : 'Estimated fodder requirement for next 3 months (Based on weather data):'}
          </p>
          <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div>
              <div className="font-bold text-orange-600">4,500 Tonnes</div>
              <div className="text-xs text-orange-500">{isHi ? 'मई - जुलाई पूर्वानुमान' : 'May - July Forecast'}</div>
            </div>
            <button className="text-sm bg-white border border-orange-200 px-3 py-1 rounded shadow-sm hover:bg-orange-50">
              {isHi ? 'रिपोर्ट देखें' : 'View Report'}
            </button>
          </div>
        </div>

        {/* 3. PWA Offline */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <CloudOff className="text-gray-500" /> {tTitles.pwa}
          </h3>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm font-medium mb-2">
              {isHi ? 'ऐप अब बिना इंटरनेट के भी काम करेगा।' : 'App now works without internet.'}
            </p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
              Service Worker Active
            </span>
          </div>
        </div>

        {/* 4. Satellite / Drone */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <Satellite className="text-emerald-500" /> {tTitles.drone}
          </h3>
          <div className="h-24 bg-green-50 border-2 border-dashed border-green-200 rounded-lg flex items-center justify-center text-sm text-green-600">
            {isHi ? '[सैटेलाइट मैप लोड हो रहा है...]' : '[Loading Satellite Map...]'}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {isHi ? 'चारागाह की हरियाली (NDVI) इंडेक्स: 0.65' : 'Pasture Greenness (NDVI) Index: 0.65'}
          </p>
        </div>

        {/* 5. WhatsApp Automation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <MessageCircle className="text-green-500" /> {tTitles.whatsapp}
          </h3>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {isHi 
                ? 'जियोफेंस टूटने या चारा खत्म होने पर ऑटोमैटिक WhatsApp अलर्ट:' 
                : 'Automatic WhatsApp alerts on geofence breach or low feed:'}
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold w-full" onClick={() => onShowToast(isHi ? 'टेस्ट मैसेज भेजा गया' : 'Test message sent')}>
              {isHi ? 'टेस्ट मैसेज भेजें' : 'Send Test Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
