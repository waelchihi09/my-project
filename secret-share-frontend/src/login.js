import React, { useState } from "react";
import "./AuthForms.css";
import { useTranslation } from "react-i18next";

function Login({ onLogin, goToRegister, goToForgot }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setMsg(data.message || t("login_error"));
      }
    } catch {
      setMsg(t("server_error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">{t("login_title")}</div>
        <form className="auth-form" onSubmit={handleLogin} autoComplete="off">
          <input
            className="auth-input"
            type="email"
            placeholder={t("email")}
            value={email}
            autoFocus
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="auth-btn" type="submit">{t("login_btn")}</button>
        </form>
        {msg && <div className="auth-error">{msg}</div>}
        <button
          className="auth-link-btn"
          onClick={goToRegister}
        >
          {t("go_to_register")}
        </button>
        <button
          className="auth-link-btn"
          style={{marginTop: 5}}
          onClick={goToForgot}
        >
          {t("forgot_password")}
        </button>
      </div>
    </div>
  );
}

export default Login;