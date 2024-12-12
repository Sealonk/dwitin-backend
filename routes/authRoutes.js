const express = require('express'); // Import Express for creating routes
const { registerUser, loginUser } = require('../controllers/authController'); // Import controllers for user registration and login
const router = express.Router(); // Create a new router instance

// Route for user registration
// Endpoint: POST /api/auth/register
router.post('/register', registerUser);

// Route for user login
// Endpoint: POST /api/auth/login
router.post('/login', loginUser);

module.exports = router; // Export the router for use in the main application