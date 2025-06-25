import { useState } from "react";
import axios from "axios";

export default function ResetPassword({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5002/reset-password", {
        email,
        code,
        newPassword,
      });
      setMessage(res.data.message);
      setSuccess(true);

      // بعد ثانيتين، أعد المستخدم لصفحة تسجيل الدخول
      setTimeout(() => {
        if (typeof goToLogin === "function") goToLogin();
      }, 2000);

      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "حدث خطأ غير متوقع");
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:"auto",display:"flex",flexDirection:"column",gap:10}}>
      <h2>إعادة تعيين كلمة المرور</h2>
      <input
        placeholder="الإيميل"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        type="email"
      />
      <input
        placeholder="الكود"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
      />
      <input
        placeholder="كلمة المرور الجديدة"
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">تغيير كلمة المرور</button>
      {message && (
        <div style={{
          marginTop:10,
          color: success ? "green" : "red"
        }}>
          {message}
          {success && <span>، سيتم إعادتك لتسجيل الدخول...</span>}
        </div>
      )}
    </form>
  );
}