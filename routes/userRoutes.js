const express = require('express'); // Import Express for creating routes
const multer = require('multer'); // Import Multer for handling file uploads
const router = express.Router(); // Create a new router instance
const authenticateToken = require('../middleware/auth'); // Middleware for token-based authentication
const {
    getUserProfile,
    uploadProfileImage
} = require('../controllers/userController'); // Import user controllers

// Configure Multer to store uploaded profile images in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to get the profile of the authenticated user
// Endpoint: GET /api/users/user
router.get('/user', authenticateToken, getUserProfile);

// Route to upload a profile image for the authenticated user
// Endpoint: POST /api/users/user/profile-image
router.post('/user/profile-image', authenticateToken, upload.single('profileImage'), uploadProfileImage);

module.exports = router; // Export the router for use in the main application