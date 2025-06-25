import React from "react";
import "./Balls.css";

function timeDifferenceMinutes(createdAt) {
  return Math.floor((Date.now() - new Date(createdAt)) / 60000);
}

function getBallSize(minutes) {
  // الحجم يبدأ بـ 60px ويكبر حتى 120px كحد أقصى
  const minSize = 60, maxSize = 120;
  const extra = Math.min(minutes * 3, maxSize - minSize); // كل دقيقة يكبر 3px
  return minSize + extra;
}

export default function SecretsBalls({ secrets }) {
  // الأسرار مرسومة ككرات في الأسفل
  return (
    <div className="balls-bar">
      {secrets.map((secret, idx) => (
        <div
          key={secret._id || idx}
          className="ball"
          style={{
            width: getBallSize(timeDifferenceMinutes(secret.createdAt)),
            height: getBallSize(timeDifferenceMinutes(secret.createdAt)),
            animation: "dropBall 0.8s cubic-bezier(.4,1.8,.6,0.8)"
          }}
          title={secret.text}
        >
          <span className="ball-text">🕵️‍♂️</span>
        </div>
      ))}
    </div>
  );
}