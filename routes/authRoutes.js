const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Rute untuk register
router.post('/register', registerUser);  // Memastikan fungsi registerUser ada
// Rute untuk login
router.post('/login', loginUser);  // Memastikan fungsi loginUser ada

module.exports = router;
