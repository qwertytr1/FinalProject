import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsEn from './translationsEn';
import translationsPL from './translationsPL';
import translationsRu from './translationsRu';

i18n.use(initReactI18next).init({
  resources: {
    pl: {
      translation: translationsPL,
    },
    en: {
      translation: translationsEn,
    },
    ru: {
      translation: translationsRu,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
