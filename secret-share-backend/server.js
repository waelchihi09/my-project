require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const User = require('./models/User');
const Secret = require('./models/secret');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5002;

// ربط قاعدة البيانات
connectDB();

app.use(cors());
app.use(bodyParser.json());

// إعداد nodemailer باستخدام متغيرات البيئة
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// راوت اختباري
app.get('/', (req, res) => {
  res.send('API is running');
});

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'كل الحقول مطلوبة' });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: 'البريد مستخدم من قبل' });

  const hashedPass = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPass });
  await user.save();
  res.json({ message: 'تم إنشاء الحساب بنجاح' });
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: 'المستخدم غير موجود' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

  const token = jwt.sign({ userId: user._id, name: user.name }, 'secret_key', { expiresIn: '1d' });
  res.json({ message: 'تم تسجيل الدخول', token, name: user.name, userId: user._id });
});

// إضافة سر جديد (مرتبط بمستخدم)
app.post('/secrets/add', async (req, res) => {
  const { text, userId } = req.body;
  if (!text || !userId)
    return res.status(400).json({ message: "معلومات ناقصة" });

  try {
    const secret = await Secret.create({ text, user: userId });
    res.json(secret);
  } catch (err) {
    res.status(500).json({ message: "خطأ في حفظ السر" });
  }
});

// جلب كل الأسرار مع بيانات المستخدم
app.get('/secrets/all', async (req, res) => {
  try {
    const secrets = await Secret.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json(secrets);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الأسرار" });
  }
});

// =========== نسيت كلمة المرور ===========

// 1- إرسال الكود للبريد الإلكتروني
app.post('/forgot-password', async (req, res) => {
  console.log("تم استقبال طلب forgot-password", req.body);

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("المستخدم غير موجود في قاعدة البيانات");
    return res.status(400).json({ message: "المستخدم غير موجود" });
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  user.resetCode = code;
  user.resetCodeExpire = Date.now() + 15 * 60 * 1000; // الكود ينتهي بعد 15 دقيقة
  await user.save();

  try {
    console.log("سيتم إرسال الإيميل الآن...");
    await transporter.sendMail({
      from: `"Secret App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "كود استرجاع كلمة المرور",
      text: `كود استرجاع كلمة المرور هو: ${code}`,
      html: `<h2>كود استرجاع كلمة المرور</h2><p>الكود الخاص بك: <b>${code}</b></p>`
    });
    console.log("تم إرسال الإيميل بنجاح!");
    res.json({ message: "تم إرسال كود إلى بريدك الإلكتروني" });
  } catch (err) {
    console.error('EMAIL ERROR:', err);
    res.status(500).json({ message: "تعذر إرسال البريد الإلكتروني. حاول لاحقًا." });
  }
});

// 2- إعادة تعيين كلمة المرور
app.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.resetCode || !user.resetCodeExpire) {
    return res.status(400).json({ message: "طلب غير صحيح" });
  }
  if (user.resetCode != code) {
    return res.status(400).json({ message: "الكود غير صحيح" });
  }
  if (user.resetCodeExpire < Date.now()) {
    return res.status(400).json({ message: "انتهت صلاحية الكود" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  user.resetCodeExpire = undefined;
  await user.save();
  res.json({ message: "تم تغيير كلمة المرور بنجاح" });
});

// =========== نهاية نسيت كلمة المرور ===========

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});