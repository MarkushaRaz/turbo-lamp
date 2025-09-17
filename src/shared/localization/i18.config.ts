import { InitOptions } from 'i18next';
import translationEn from '_localization/locales/en/translation.json';
import translationRu from '_localization/locales/ru/translation.json';

const i18Config: InitOptions = {
  lng: 'ru',
  fallbackLng: 'ru',
  preload: ['en', 'ru'],
  ns: ['translation'],
  defaultNS: 'translation',
  supportedLngs: ['en', 'ru'],
  resources: {
    en: {
      translation: translationEn,
    },
    ru: {
      translation: translationRu,
    },
  },
};

export default i18Config;
