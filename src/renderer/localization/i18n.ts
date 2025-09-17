/* eslint-disable no-console */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextOptions from '_localization/i18.config';

i18n.use(initReactI18next).init(i18nextOptions).catch(console.error);

export { i18n };
