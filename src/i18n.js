import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations.js';

const resources = {};
Object.keys(translations).forEach(lang => {
  const lower = lang.toLowerCase();
  const upper = lang.toUpperCase();
  
  if (!resources[lower]) resources[lower] = { translation: {} };
  if (!resources[upper]) resources[upper] = { translation: {} };
  
  Object.assign(resources[lower].translation, translations[lang]);
  Object.assign(resources[upper].translation, translations[lang]);
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (localStorage.getItem('user_language') || 'es').toLowerCase(),
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt', 'zh', 'ES', 'EN', 'PT', 'ZH'],
    returnEmptyString: false,
    parseMissingKeyHandler: (key) => {
      return resources['es']?.translation?.[key] || key;
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('user_language', lng.toLowerCase());
});

export default i18n;
