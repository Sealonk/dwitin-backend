const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');  // Pastikan ini mengarah ke koneksi yang benar

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  darkMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
});

module.exports = User;
