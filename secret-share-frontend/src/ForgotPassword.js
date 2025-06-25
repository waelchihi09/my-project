import React, { useState, useRef } from "react";
import "./LoginCreative.css";
import { useTranslation } from "react-i18next";

function ForgotPassword({ goToLogin, goToReset }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [btnPos, setBtnPos] = useState("center");
  const [shake, setShake] = useState(false);
  const btnRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSuccess(false);

    if (!email.includes("@") || email.length < 5) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMsg(t("forgot_invalid_email") || "Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5002/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMsg(t("forgot_success"));
      } else {
        setMsg(data.message || t("forgot_error"));
      }
    } catch {
      setMsg(t("server_error"));
    }
  };

  // Animate the button if email is invalid
  const handleButtonEnter = () => {
    if (!email.includes("@") || email.length < 5) {
      setBtnPos(btnPos === "left" ? "right" : "left");
    }
  };

  const handleInput = (e) => {
    setEmail(e.target.value);
    setBtnPos("center");
    setMsg("");
  };

  return (
    <div className="auth-bg">
      <div className="auth-glass-card">
        <div className="auth-title creative">{t("forgot_title")}</div>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            className="auth-input"
            type="email"
            placeholder={t("email")}
            value={email}
            autoFocus
            onChange={handleInput}
            required
          />
          <div className="btn-area">
            <button
              ref={btnRef}
              className={`auth-btn creative-btn ${btnPos} ${shake ? "shake" : ""} ${(!email.includes("@") || email.length < 5) ? "disabled" : ""}`}
              type="submit"
              onMouseEnter={handleButtonEnter}
              disabled={false}
              tabIndex={(!email.includes("@") || email.length < 5) ? -1 : 0}
            >
              {t("forgot_btn")}
            </button>
          </div>
        </form>
        <div className="auth-links">
          <button
            className="auth-link-btn"
            onClick={goToLogin}
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
          {t("forgot_hint") || "Enter your email then check your inbox."}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;