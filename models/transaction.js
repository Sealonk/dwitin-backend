const { DataTypes } = require('sequelize'); // DataTypes for defining Sequelize models
const sequelize = require('../config/config'); // Import the Sequelize connection

// Define the Transaction model
const Transaction = sequelize.define('Transaction', {
  title: {
    type: DataTypes.STRING, // Title of the transaction
    allowNull: false, // Cannot be null
  },
  amount: {
    type: DataTypes.FLOAT, // Amount of the transaction
    allowNull: false, // Cannot be null
  },
  type: {
    type: DataTypes.ENUM('pemasukan', 'pengeluaran'), // Type: 'pemasukan' (income) or 'pengeluaran' (expense)
    allowNull: false, // Cannot be null
  },
  description: {
    type: DataTypes.STRING, // Additional details about the transaction
    allowNull: false, // Cannot be null
  },
  imageUrl: {
    type: DataTypes.STRING, // URL of an optional image associated with the transaction
    defaultValue: null, // Default is null if no image is uploaded
  },
  userId: {
    type: DataTypes.INTEGER, // ID of the user who owns the transaction
    allowNull: false, // Cannot be null
  },
});

module.exports = Transaction; // Export the Transaction model