const express = require('express'); // Import Express for creating routes
const multer = require('multer'); // Import Multer for handling file uploads
const {
    addTransactionWithImage,
    getUserTransactions,
    getTransactionById,
    deleteTransactionById
} = require('../controllers/transactionController'); // Import transaction controllers
const authenticateToken = require('../middleware/auth'); // Middleware for token-based authentication

const router = express.Router(); // Create a new router instance

// Configure Multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to add a new transaction with an optional image
// Endpoint: POST /api/transactions
router.post('/', authenticateToken, upload.single('image'), addTransactionWithImage);

// Route to get all transactions for the authenticated user
// Endpoint: GET /api/transactions
router.get('/', authenticateToken, getUserTransactions);

// Route to get a single transaction by ID
// Endpoint: GET /api/transactions/:id
router.get('/:id', authenticateToken, getTransactionById);

// Route to delete a transaction by ID
// Endpoint: DELETE /api/transactions/:id
router.delete('/:id', authenticateToken, deleteTransactionById); 

module.exports = router; // Export the router for use in the main application