const { DataTypes } = require('sequelize'); // DataTypes for defining Sequelize models
const sequelize = require('../config/config'); // Import the Sequelize connection
const Transaction = require('./transaction'); // Import the Transaction model

// Define the User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING, // User's name
    allowNull: false, // Cannot be null
  },
  email: {
    type: DataTypes.STRING, // User's email
    unique: true, // Must be unique
    allowNull: false, // Cannot be null
  },
  password: {
    type: DataTypes.STRING, // User's hashed password
    allowNull: false, // Cannot be null
  },
  profileImage: {
    type: DataTypes.STRING, // URL of the user's profile image
    defaultValue: null, // Default is null if no image is uploaded
  },
  darkMode: {
    type: DataTypes.BOOLEAN, // Whether dark mode is enabled
    defaultValue: false, // Default is false
  },
  language: {
    type: DataTypes.STRING, // User's preferred language
    defaultValue: 'en', // Default is 'en'
  },
  balance: {
    type: DataTypes.FLOAT, // User's account balance
    defaultValue: 0, // Default balance is 0
  },
});

// Define relationships between models
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // A transaction belongs to a user
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' }); // A user has many transactions

module.exports = User; // Export the User model