const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');  // Pastikan middleware diimpor dengan benar
const { getUserProfile } = require('../controllers/userController');  // Pastikan ini diimpor dengan benar

// Endpoint untuk mendapatkan profil pengguna
router.get('/user', authenticateToken, getUserProfile);  // Pastikan getUserProfile diimpor dan dipanggil dengan benar

module.exports = router;
