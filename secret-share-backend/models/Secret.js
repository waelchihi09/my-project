const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  text: { type: String, required: true }, // نص السر
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ربط السر بمستخدم
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Secret', secretSchema);