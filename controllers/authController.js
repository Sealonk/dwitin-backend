const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!email || !password || !name) {
    return res.status(400).json({ error: true, message: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: true, message: 'Password must be at least 8 characters' });
  }

  try {
    // Mengecek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: true, message: 'Email is already taken' });
    }

    // Mengenkripsi password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat pengguna baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Mengirimkan respons sukses
    return res.status(201).json({
      error: false,
      message: 'User Created',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: true, message: 'Error registering user' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: true, message: 'Email and password are required' });
  }

  try {
    // Mengecek apakah email terdaftar
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' });
    }

    // Memeriksa kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: true, message: 'Invalid password' });
    }

    // Membuat token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Menyusun respons login
    const loginResult = {
      userId: user.id,
      name: user.name,
      token: token,
    };

    return res.status(200).json({
      error: false,
      message: 'success',
      loginResult: loginResult,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: true, message: 'Error logging in' });
  }
};

// Pastikan Anda mengekspor fungsi dengan benar
module.exports = {
  registerUser,
  loginUser,
};
