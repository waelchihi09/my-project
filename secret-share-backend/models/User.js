const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // الحقول الخاصة باسترجاع كلمة المرور
  resetCode: { type: Number },
  resetCodeExpire: { type: Date },
});

module.exports = mongoose.model('User', UserSchema);