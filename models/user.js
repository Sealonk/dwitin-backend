const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Pastikan koneksi sequelize diimpor dengan benar
const Transaction = require('./transaction'); // Impor model Transaction

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
    type: DataTypes.STRING, // URL gambar
    defaultValue: null, // Default null jika tidak ada gambar
  },
  darkMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

// Definisi relasi
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

module.exports = User;
