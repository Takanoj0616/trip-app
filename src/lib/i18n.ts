import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import jaCommon from '../../public/locales/ja/common.json';
import enCommon from '../../public/locales/en/common.json';
import koCommon from '../../public/locales/ko/common.json';

const resources = {
  ja: {
    common: jaCommon,
  },
  en: {
    common: enCommon,
  },
  ko: {
    common: koCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja', // default language
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;