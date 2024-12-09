const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
require('dotenv').config(); // Memuat variabel lingkungan dari file .env
const sequelize = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);  // Rute autentikasi
app.use('/api/transactions', transactionRoutes);  // Pastikan prefiks /api/transactions sudah ada
app.use('/api/users', userRoutes);  // Rute pengguna

// Verifikasi koneksi database
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
