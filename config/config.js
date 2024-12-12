const { Sequelize } = require('sequelize');

// Initialize the connection to the database using Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Name of the database
  process.env.DB_USER,  // Database username
  process.env.DB_PASS,  // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: 'mysql', // Type of database (MySQL in this case)
  }
);

module.exports = sequelize; // Export the database connection