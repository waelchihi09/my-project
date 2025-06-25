import React, { useState, useEffect } from "react";
import Login from "./login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import DropSecretCreative from "./DropSecretCreative";

function App() {
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [secrets, setSecrets] = useState([]);

  // ضبط اتجاه الصفحة حسب اللغة
  useEffect(() => {
    if (i18n.language === "ar") {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [i18n.language]);

  // أسرار افتراضية
  useEffect(() => {
    setSecrets([
      {
        _id: 1,
        text: t("sample_secret"),
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        _id: 2,
        text: t("welcome_secret"),
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ]);
    // eslint-disable-next-line
  }, [t]);

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
    setShowForgot(false);
    setShowReset(false);
  };

  const renderLanguageSwitcher = (
    <div style={{ position: "fixed", top: 15, right: 15, zIndex: 1000 }}>
      <LanguageSwitcher />
    </div>
  );

  // صفحات الدخول والتسجيل
  if (!user) {
    if (showReset) {
      return (
        <>
          {renderLanguageSwitcher}
          <ResetPassword goToLogin={() => { setShowReset(false); setShowForgot(false); setShowRegister(false); }} />
        </>
      );
    }
    if (showForgot) {
      return (
        <>
          {renderLanguageSwitcher}
          <ForgotPassword
            goToLogin={() => { setShowForgot(false); setShowRegister(false); }}
            goToReset={() => { setShowForgot(false); setShowReset(true); }}
          />
        </>
      );
    }
    return showRegister ? (
      <>
        {renderLanguageSwitcher}
        <Register onGoToLogin={() => setShowRegister(false)} />
      </>
    ) : (
      <>
        {renderLanguageSwitcher}
        <Login
          onLogin={(userData) => {
            if (typeof userData === "object") {
              setUser(userData);
            } else {
              setUser({
                name: userData === "google" ? t("google_user") : t("facebook_user"),
                provider: userData,
              });
            }
          }}
          goToRegister={() => setShowRegister(true)}
          goToForgot={() => setShowForgot(true)}
        />
      </>
    );
  }

  // الصفحة الإبداعية الجديدة
  return (
    <>
      {renderLanguageSwitcher}
      <DropSecretCreative
        user={user}
        secrets={secrets}
        setSecrets={setSecrets}
      />
      <div style={{
        position: "fixed",
        left: 20,
        bottom: 16,
        color: "#aaa",
        fontSize: "0.97em",
        opacity: 0.75
      }}>
        <button
          style={{
            background: "#f36c3c",
            color: "#fff",
            padding: "6px 16px",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: 10
          }}
          onClick={handleLogout}
        >
          {t("logout")}
        </button>
      </div>
    </>
  );
}

export default App;