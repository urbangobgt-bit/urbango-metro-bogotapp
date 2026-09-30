import {
  LanguageContext,
  LanguageProvider,
  useLanguage,
  useI18n,
  cleanTechnicalKey,
  getNestedValue
} from './LanguageContext';

export const I18nContext = LanguageContext;
export const I18nProvider = LanguageProvider;
export { useLanguage, useI18n, cleanTechnicalKey, getNestedValue };
export default I18nContext;
