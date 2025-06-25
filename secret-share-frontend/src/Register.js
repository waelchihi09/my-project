import React, { useState, useRef } from "react";
import "./LoginCreative.css";
import { useTranslation } from "react-i18next";

function Register({ onGoToLogin }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [btnPos, setBtnPos] = useState("center"); // "center", "left", "right"
  const [shake, setShake] = useState(false);
  const btnRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    setSuccess(false);

    if (password.length < 6) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const res = await fetch("http://localhost:5002/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMsg(t("register_success"));
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMsg(data.message || t("register_error"));
      }
    } catch {
      setMsg(t("server_error"));
    }
  };

  // Animate the button if password < 6
  const handleButtonEnter = () => {
    if (password.length < 6) {
      setBtnPos(btnPos === "left" ? "right" : "left");
    }
  };

  // Reset button position on input change
  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    setBtnPos("center");
  };

  return (
    <div className="auth-bg">
      <div className="auth-glass-card">
        <div className="auth-title creative">{t("register_title")}</div>
        <form className="auth-form" onSubmit={handleRegister} autoComplete="off">
          <input
            className="auth-input"
            type="text"
            placeholder={t("name")}
            value={name}
            autoFocus
            onChange={handleInput(setName)}
            required
          />
          <input
            className="auth-input"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={handleInput(setEmail)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={handleInput(setPassword)}
            required
            minLength={6}
          />
          <div className="btn-area">
            <button
              ref={btnRef}
              className={`auth-btn creative-btn ${btnPos} ${shake ? "shake" : ""} ${password.length < 6 ? "disabled" : ""}`}
              type="submit"
              onMouseEnter={handleButtonEnter}
              disabled={false}
              tabIndex={password.length < 6 ? -1 : 0}
            >
              {t("register_btn")}
            </button>
          </div>
        </form>
        <div className="auth-links">
          <button
            className="auth-link-btn"
            onClick={onGoToLogin}
            type="button"
          >
            {t("go_to_login")}
          </button>
        </div>
        {msg && (
          <div className={`auth-error animated`} style={success ? { color: "#1ca672" } : {}}>
            {msg}
          </div>
        )}
        <div className="hint-text">
          <span role="img" aria-label="info">💡</span>{" "}
          {t("register_hint") || "Password must be at least 6 characters."}
        </div>
      </div>
    </div>
  );
}

export default Register;