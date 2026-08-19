'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (localizedObj: { en: string; ar: string } | undefined, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always default to 'en' on initial render so Server & Client match
  const [language, setLanguageState] = useState<Language>('en');

  // Defer reading localStorage until after the initial mount
  useEffect(() => {
    const savedLang = localStorage.getItem('nola_lang') as Language | null;
    if (savedLang === 'en' || savedLang === 'ar') {
      setLanguageState(savedLang);
    }
  }, []);

  // Keep <html> lang and dir attributes in sync whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const applyLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nola_lang', lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    applyLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, applyLanguage]);

  const t = useCallback(
    (localizedObj: { en: string; ar: string } | undefined, fallback = ''): string => {
      if (!localizedObj) return fallback;
      return localizedObj[language] || localizedObj.en || fallback;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: applyLanguage,
        toggleLanguage,
        isRTL: language === 'ar',
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}