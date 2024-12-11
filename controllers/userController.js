const User = require('../models/user');
const { uploadImageToStorage } = require('./transactionController');

// Get User Profile
const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found',
      });
    }

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
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching user profile',
    });
  }
};

const uploadProfileImage = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No file uploaded' });
    }

    const imageBuffer = req.file.buffer;
    const fileName = `profile_${userId}_${Date.now()}.jpg`;

    // Fungsi upload ke Google Cloud Storage
    const imageUrl = await uploadImageToStorage(imageBuffer, fileName);

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      error: false,
      message: 'Profile image uploaded successfully',
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
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
