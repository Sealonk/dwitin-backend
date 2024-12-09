const User = require('../models/user');

// Get User Profile
const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      darkMode: user.darkMode,
      language: user.language,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

module.exports = {
  getUserProfile,
};
