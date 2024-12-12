const User = require('../models/user'); // Import User model
const { uploadImageToStorage } = require('./transactionController'); // Reuse the uploadImageToStorage function

// Controller to fetch the profile of the currently authenticated user
const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the authenticated token

  try {
    // Find the user in the database by their ID
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found',
      });
    }

    // Respond with the user's profile information
    res.status(200).json({
      error: false,
      message: 'User profile fetched successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        darkMode: user.darkMode,
        language: user.language,
        balance: user.balance, // Include the user's balance
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log the error for debugging
    res.status(500).json({
      error: true,
      message: 'Error fetching user profile',
    });
  }
};

// Controller to upload a profile image for the user
const uploadProfileImage = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the authenticated token

  try {
    // Find the user in the database by their ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No file uploaded' });
    }

    const imageBuffer = req.file.buffer; // Extract the file buffer
    const fileName = `profile_${userId}_${Date.now()}.jpg`; // Create a unique filename

    // Upload the file to Google Cloud Storage and get the public URL
    const imageUrl = await uploadImageToStorage(imageBuffer, fileName);

    // Update the user's profile image URL in the database
    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      error: false,
      message: 'Profile image uploaded successfully',
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error); // Log the error for debugging
    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  getUserProfile,
  uploadProfileImage
};