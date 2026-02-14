import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || "en";
const supportedLocales = (import.meta.env.VITE_SUPPORTED_LOCALES || "ar,en")
  .split(",")
  .map((locale: string) => locale.trim());

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en }
  },
  lng: supportedLocales.includes(defaultLocale) ? defaultLocale : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export const availableLocales = supportedLocales;
export default i18n;
