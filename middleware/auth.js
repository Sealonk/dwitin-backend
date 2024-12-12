const jwt = require('jsonwebtoken'); // Library for working with JSON Web Tokens (JWT)

// Middleware to authenticate a JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Get the authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

  if (!token) {
    return res.status(403).json({ message: 'Token required' }); // Respond if no token is provided
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' }); // Respond if token verification fails
    }

    req.user = { id: user.userId }; // Attach the user's ID to the request object
    console.log('Decoded User:', req.user); // Log the decoded user for debugging
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken; // Export the middleware