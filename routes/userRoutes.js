const express = require('express');
const multer = require('multer');
const router = express.Router();
const authenticateToken = require('../middleware/auth');  // Pastikan middleware diimpor dengan benar
const {
    getUserProfile,
    uploadProfileImage
} = require('../controllers/userController');  // Pastikan ini diimpor dengan benar

const upload = multer({ storage: multer.memoryStorage() });

// Endpoint untuk mendapatkan profil pengguna
router.get('/user', authenticateToken, getUserProfile);  // Pastikan getUserProfile diimpor dan dipanggil dengan benar

// Endpoint untuk upload foto profil
router.post('/user/profile-image', authenticateToken, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
