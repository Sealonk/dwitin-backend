const { Sequelize } = require('sequelize');

// Inisialisasi koneksi ke database menggunakan konfigurasi di .env
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Nama database
  process.env.DB_USER,  // Username
  process.env.DB_PASS,  // Password
  {
    host: process.env.DB_HOST, // Host database
    dialect: 'mysql', // Tipe database
  }
);

module.exports = sequelize;
