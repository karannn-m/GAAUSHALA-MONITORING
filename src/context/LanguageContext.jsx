import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('portal_language') || 'hi';
    } catch {
      return 'hi';
    }
  });

  const isHi = language === 'hi';

  useEffect(() => {
    try {
      localStorage.setItem('portal_language', language);
    } catch {}

    document.documentElement.lang = language;
    document.title = isHi
      ? 'AI Gaushala Portal | राज्य गो-सेवा प्रबंधन एवं अनुदान पारदर्शिता प्रणाली'
      : 'AI Gaushala Portal | State Gau-Sewa Management & Grant Transparency System';
  }, [language, isHi]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isHi, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

