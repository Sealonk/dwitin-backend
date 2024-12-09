const express = require('express');
const { addTransactionWithImage } = require('../controllers/transactionController');
const authenticateToken = require('../middleware/auth'); // Pastikan middleware diimpor dengan benar
const router = express.Router();

// Rute untuk menambahkan transaksi
router.post('/', authenticateToken, addTransactionWithImage);  // Gunakan prefiks "/transactions" sesuai dengan pengaturan di server.js

module.exports = router;
