import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar }
    },
    lng: "ar", // يمكنك التغيير للغة الافتراضية التي تريدها
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;