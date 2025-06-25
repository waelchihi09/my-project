const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Secret = require('./models/secret');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Secret Share Backend is Working!');
});

// API لإضافة سر جديد
app.post('/api/secrets', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Secret text is required.' });
    const secret = new Secret({ text });
    await secret.save();
    res.status(201).json(secret);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// API لجلب كل الأسرار
app.get('/api/secrets', async (req, res) => {
  try {
    const secrets = await Secret.find().sort({ createdAt: -1 });
    res.json(secrets);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});