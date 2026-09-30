import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations } from './translations.js';
import i18n from './i18n.js';

export const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = ['es', 'en', 'pt', 'zh', 'ja'];

// Helper to clean technical keys as safety net
export const cleanTechnicalKey = (key) => {
  if (!key || typeof key !== 'string') return '';

  const locMap = {
    st_loc_bosa: 'Sector Bosa / Kennedy',
    st_loc_kennedy: 'Sector Kennedy',
    st_loc_puente: 'Sector Puente Aranda',
    st_loc_martires: 'Sector Los Mártires',
    st_loc_santafe: 'Sector Santa Fe',
    st_loc_teusaquillo: 'Sector Teusaquillo',
    st_loc_chapinero: 'Sector Chapinero',
    st_loc_barrios: 'Sector Barrios Unidos'
  };
  if (locMap[key]) return locMap[key];

  if (key.startsWith('st_loc_') || key.startsWith('st_desc_') || key.startsWith('st_') || key.startsWith('map_')) {
    const raw = key.replace(/^(st_loc_|st_desc_|st_|map_)/, '').replace(/_/g, ' ');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return key.replace(/_/g, ' ');
};

// Helper for navigating nested objects by path like 'nav.cardBalance' or 'jobsModule.title'
export const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  if (typeof obj !== 'object') return undefined;

  // Direct key check
  if (obj[path] !== undefined) {
    return obj[path];
  }

  // Nested dot path navigation
  if (path.includes('.')) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }

  return undefined;
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem('user_language');
      if (stored) {
        const lower = stored.toLowerCase();
        if (SUPPORTED_LANGUAGES.includes(lower)) return lower;
      }
    } catch {
      // ignore
    }
    return 'es';
  });

  const setLanguage = useCallback((newLang) => {
    if (!newLang) return;
    const lower = String(newLang).toLowerCase();
    const target = SUPPORTED_LANGUAGES.includes(lower) ? lower : 'es';

    setLanguageState(target);

    try {
      localStorage.setItem('user_language', target);
      document.documentElement.lang = target;
    } catch {
      // ignore
    }

    if (i18n && typeof i18n.changeLanguage === 'function') {
      try {
        i18n.changeLanguage(target);
      } catch {
        // ignore
      }
    }
  }, []);

  // Sync with i18n instance if it changes from external sources
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'user_language' && e.newValue) {
        const lower = e.newValue.toLowerCase();
        if (SUPPORTED_LANGUAGES.includes(lower) && lower !== language) {
          setLanguageState(lower);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [language]);

  // Synchronize document language
  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  // Translation function t(path, fallbackOrParams)
  const t = useCallback((path, fallbackOrParams = '') => {
    if (!path || typeof path !== 'string') return '';

    let fallback = '';
    let params = null;

    if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
    } else if (fallbackOrParams && typeof fallbackOrParams === 'object') {
      params = fallbackOrParams;
      if (typeof params.defaultValue === 'string') {
        fallback = params.defaultValue;
      }
    }

    const currentDict = translations[language] || translations['es'] || {};
    const fallbackDict = translations['es'] || {};

    let value = getNestedValue(currentDict, path);

    // If not found in current language, check in Spanish fallback
    if (value === undefined || value === null || value === '') {
      value = getNestedValue(fallbackDict, path);
    }

    // If still not found and fallback exists, use fallback
    if (value === undefined || value === null || value === '') {
      if (fallback && fallback !== path) {
        value = fallback;
      } else {
        value = cleanTechnicalKey(path);
      }
    }

    // Param interpolation: e.g. "¡Hola, {name}!" or "{{name}}"
    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
      });
    }

    return value;
  }, [language]);

  const contextValue = useMemo(() => ({
    language,
    lang: language,
    setLanguage,
    setLang: setLanguage,
    t
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if invoked outside Provider
    return {
      language: 'es',
      lang: 'es',
      setLanguage: () => {},
      setLang: () => {},
      t: (path, fallback = '') => (typeof fallback === 'string' && fallback ? fallback : cleanTechnicalKey(path))
    };
  }
  return context;
}

// Full compatibility alias for useI18n
export function useI18n() {
  return useLanguage();
}

export default LanguageContext;
