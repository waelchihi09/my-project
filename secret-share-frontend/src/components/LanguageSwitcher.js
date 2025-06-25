import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (lng === "ar") {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  };

  // اللغة الحالية
  const current = i18n.language;

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${current === "ar" ? "active" : ""}`}
        onClick={() => handleChangeLanguage("ar")}
        title="العربية"
      >
        🇸🇦 AR
      </button>
      <button
        className={`lang-btn ${current === "en" ? "active" : ""}`}
        onClick={() => handleChangeLanguage("en")}
        title="English"
      >
        🇺🇸 EN
      </button>
      <button
        className={`lang-btn ${current === "fr" ? "active" : ""}`}
        onClick={() => handleChangeLanguage("fr")}
        title="Français"
      >
        🇫🇷 FR
      </button>
    </div>
  );
}

export default LanguageSwitcher;