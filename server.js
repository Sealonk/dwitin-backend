const express = require('express'); // Import Express for building the server
const bodyParser = require('body-parser'); // Middleware for parsing incoming JSON requests
const dotenv = require('dotenv'); // Import dotenv to load environment variables
require('dotenv').config(); // Load environment variables from the .env file
const sequelize = require('./config/config'); // Load environment variables from the .env file
const authRoutes = require('./routes/authRoutes'); // Load environment variables from the .env file
const transactionRoutes = require('./routes/transactionRoutes'); // Import transaction routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

dotenv.config(); // Initialize dotenv

const app = express(); // Create an instance of an Express application

app.use(bodyParser.json()); // Use bodyParser middleware to parse JSON request bodies

// Define routes
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/transactions', transactionRoutes); // Mount transaction routes
app.use('/api/users', userRoutes); // Mount user routes

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully'); // Log successful connection
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err); // Log connection errors
  });

// Sync database models
sequelize.sync()
  .then(() => {
    console.log('Database synced'); // Log successful sync
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err); // Log sync errors
  });

// Start the server and listen on the port specified in the .env file
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`); // Log the server's running status
});