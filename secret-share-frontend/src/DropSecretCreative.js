import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./DropSecretCreative.css";
import treeSVG from "./assets/tree.svg";
import wellSVG from "./assets/well.svg";
import manSVG from "./assets/man.svg";
import msgSVG from "./assets/message.svg";

// خلفيات احترافية (صور فوتوغرافية وتدرجات ألوان)
const proBackgrounds = [
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    name: "Forest"
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
    name: "Mountain Lake"
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    name: "Sunset Beach"
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
    name: "Night Sky"
  },
  {
    type: "gradient",
    url: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    name: "Cool Blue"
  },
  {
    type: "gradient",
    url: "linear-gradient(120deg, #fdf6e3 0%, #d3cbb8 100%)",
    name: "Soft Sand"
  },
  {
    type: "gradient",
    url: "linear-gradient(120deg, #232526 0%, #414345 100%)",
    name: "Dark Grey"
  },
  {
    type: "gradient",
    url: "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)",
    name: "Sunshine"
  }
];

function DropSecretCreative({ user, secrets, setSecrets }) {
  const { t, i18n } = useTranslation();
  const [secret, setSecret] = useState("");
  const [phase, setPhase] = useState("idle"); // idle, dropping, onGround, walkingToMsg, pickedMsg, walkingToWell, atWell, inWell
  const [msgPos, setMsgPos] = useState({ left: "32vw", top: "70vh" });
  const [manPos, setManPos] = useState({ left: "80vw", top: "65vh", withMsg: false });
  const [currentMsg, setCurrentMsg] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // إسقاط السر (رسالة)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (phase !== "idle") return;
    if (!secret.trim()) return;
    setCurrentMsg(secret);
    setSecret(""); // يمسح الحقل مباشرة بعد الضغط
    setPhase("dropping");
    setTimeout(() => setPhase("onGround"), 800);
  };

  // التحكم في الأنيميشن المنطقي
  useEffect(() => {
    if (phase === "onGround") {
      setTimeout(() => setPhase("walkingToMsg"), 400);
    } else if (phase === "walkingToMsg") {
      setManPos(prev => ({ ...prev, left: "36vw" }));
      setTimeout(() => setPhase("pickedMsg"), 1500);
    } else if (phase === "pickedMsg") {
      setManPos(prev => ({ ...prev, withMsg: true }));
      setTimeout(() => setPhase("walkingToWell"), 800);
    } else if (phase === "walkingToWell") {
      setManPos(prev => ({ ...prev, left: "80vw" }));
      setTimeout(() => setPhase("atWell"), 1500);
    } else if (phase === "atWell") {
      setTimeout(() => setPhase("inWell"), 900);
    } else if (phase === "inWell") {
      setManPos(prev => ({ ...prev, withMsg: false }));
      setTimeout(() => {
        setSecrets([{ _id: Date.now(), text: currentMsg, user: user?.name || t("user") }, ...secrets]);
        setCurrentMsg("");
        setPhase("idle");
      }, 700);
    }
  }, [phase]); // eslint-disable-line

  // تغيير الخلفية بالزر
  const nextBg = () => setBgIndex((prev) => (prev + 1) % proBackgrounds.length);
  const prevBg = () => setBgIndex((prev) => (prev - 1 + proBackgrounds.length) % proBackgrounds.length);

  // إعداد ستايل الخلفية
  let bgStyle = {};
  if (proBackgrounds[bgIndex].type === "image") {
    bgStyle = {
      backgroundImage: `url('${proBackgrounds[bgIndex].url}')`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    };
  } else {
    bgStyle = {
      background: proBackgrounds[bgIndex].url
    };
  }

  return (
    <div className="creative-bg" style={bgStyle}>
      <div className="bg-switcher-pro">
        <button onClick={prevBg} className="bg-pro-btn" title="السابق">◀</button>
        <span className="bg-pro-title">{proBackgrounds[bgIndex].name}</span>
        <button onClick={nextBg} className="bg-pro-btn" title="التالي">▶</button>
      </div>
      <div className="tree-area">
        <img src={treeSVG} alt="tree" className="tree-svg" />
      </div>
      <form className="secret-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          className="secret-input"
          placeholder={t("input_placeholder")}
          value={secret}
          onChange={e => setSecret(e.target.value)}
          maxLength={140}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          disabled={phase !== "idle"}
        />
        <button type="submit" className="drop-btn" disabled={phase !== "idle"}>{t("drop_secret")}</button>
      </form>
      <div className="well-area">
        <img src={wellSVG} alt="well" className="well-svg" onClick={() => setShowSecrets(!showSecrets)} />
      </div>
      {/* الرسالة تسقط بتموج */}
      {phase === "dropping" && (
        <img
          src={msgSVG}
          alt="message"
          className="msg-svg msg-drop-wave"
          style={{
            left: msgPos.left,
            top: "50vh",
            position: "absolute",
            width: 56,
            zIndex: 6
          }}
        />
      )}
      {/* الرسالة على الأرض */}
      {["onGround", "walkingToMsg"].includes(phase) && (
        <img
          src={msgSVG}
          alt="message"
          className="msg-svg"
          style={{
            left: msgPos.left,
            top: msgPos.top,
            position: "absolute",
            width: 56,
            zIndex: 6
          }}
        />
      )}
      {/* الرجل */}
      <img
        src={manSVG}
        alt="man"
        className="man-svg"
        style={{
          left: manPos.left,
          top: manPos.top,
          position: "absolute",
          width: 90,
          zIndex: 8,
          transition: "left 1.3s cubic-bezier(.65,.09,.73,1.02)"
        }}
      />
      {/* man's speech when picking the message */}
      {phase === "pickedMsg" && (
        <div
          className="man-speech"
          style={{
            left: `calc(${manPos.left} - 100px)`,
            top: `calc(${manPos.top} - 40px)`
          }}
        >
          {t("gargamel_msg") || "لا تقلق لن أخبر أحدًا"}
        </div>
      )}
      {/* الرسالة في يد الرجل */}
      {manPos.withMsg && ["pickedMsg", "walkingToWell", "atWell"].includes(phase) && (
        <img
          src={msgSVG}
          alt="msg-in-hand"
          className="msg-in-hand"
          style={{
            left: `calc(${manPos.left} + 35px)`,
            top: `calc(${manPos.top} + 40px)`,
            position: "absolute",
            width: 32,
            zIndex: 10,
            transition: "left 1.3s cubic-bezier(.65,.09,.73,1.02)"
          }}
        />
      )}
      {/* نافذة الأسرار */}
      {showSecrets && (
        <div className="well-secrets-popup">
          <button className="close-secrets-btn" onClick={() => setShowSecrets(false)}>✖</button>
          <h3 style={{textAlign:"center"}}>{t("all_secrets_hint")}</h3>
          <div className="well-secrets-list">
            {secrets.map((s, i) => (
              <div key={s._id || i} className="well-secret-leaf">
                {s.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default DropSecretCreative;