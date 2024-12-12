const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating JWT tokens
const User = require('../models/user'); // Import User model

// Controller to handle user registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate the input fields
  if (!email || !password || !name) {
    return res.status(400).json({ error: true, message: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: true, message: 'Password must be at least 8 characters' });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: true, message: 'Email is already taken' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Mengirimkan respons sukses
    return res.status(201).json({
      error: false,
      message: 'User Created',
    });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error for debugging
    return res.status(500).json({ error: true, message: 'Error registering user' });
  }
};

// Controller to handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate the input fields
  if (!email || !password) {
    return res.status(400).json({ error: true, message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: true, message: 'Invalid password' });
    }

    // Create a JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Login response
    const loginResult = {
      userId: user.id,
      name: user.name,
      token: token,
    };

    return res.status(200).json({
      error: false,
      message: 'success',
      loginResult: loginResult,
    });
  } catch (error) {
    console.error('Error logging in user:', error); // Log the error for debugging
    return res.status(500).json({ error: true, message: 'Error logging in' });
  }
};

// Export the controllers
module.exports = {
  registerUser,
  loginUser,
};