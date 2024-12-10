const express = require('express');
const multer = require('multer');
const { addTransactionWithImage,
    getUserTransactions,
    getTransactionById,
    deleteTransactionById } = require('../controllers/transactionController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Konfigurasi multer untuk menerima file dengan nama field 'image'
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint untuk menambahkan transaksi dengan gambar
router.post('/', authenticateToken, upload.single('image'), addTransactionWithImage);

// Rute untuk mendapatkan semua transaksi pengguna
router.get('/', authenticateToken, getUserTransactions);

// Rute untuk mendapatkan transaksi berdasarkan ID
router.get('/:id', authenticateToken, getTransactionById);

// Rute untuk menghapus transaksi
router.delete('/:id', authenticateToken, deleteTransactionById); 

module.exports = router;
