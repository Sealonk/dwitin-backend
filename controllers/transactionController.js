const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const storage = new Storage();
const visionClient = new vision.ImageAnnotatorClient();

// Fungsi untuk mengunggah gambar ke Google Cloud Storage
const uploadImageToStorage = async (imageBuffer, fileName) => {
  try {
    const bucket = storage.bucket('dwitin-bucket');  // Ganti dengan nama bucket Anda
    const file = bucket.file(fileName);
    await file.save(imageBuffer);
    return file.publicUrl();
  } catch (error) {
    console.error("Error uploading image:", error);  // Menambahkan log error
    throw new Error('Error uploading image');
  }
};

// Fungsi untuk menganalisis gambar menggunakan Google Cloud Vision API (OCR)
const analyzeImage = async (imageBuffer) => {
  try {
    const [result] = await visionClient.textDetection(imageBuffer);
    const detectedText = result.textAnnotations[0]?.description || '';
    const totalAmount = parseFloat(detectedText.match(/\d+/g)?.pop()); // Mengambil jumlah uang dari teks yang terdeteksi
    return totalAmount;
  } catch (error) {
    console.error("Error analyzing image:", error);  // Menambahkan log error
    throw new Error('Error analyzing image');
  }
};

// Fungsi untuk menambahkan transaksi
const addTransactionWithImage = async (req, res) => {
  const { title, amount, type, description } = req.body;
  const userId = req.user.id;

  try {
      // Validasi pengguna
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      let imageUrl = null;

      // Proses upload gambar jika ada
      if (req.file) {
          const imageBuffer = req.file.buffer; // File gambar
          const fileName = `transaction_${Date.now()}.jpg`;
          imageUrl = await uploadImageToStorage(imageBuffer, fileName); // Fungsi untuk mengunggah gambar
      }

      // Tambahkan transaksi
      const transaction = await Transaction.create({
          title,
          amount,
          type,
          description,
          imageUrl,
          userId,
      });

      // Update saldo pengguna
      if (type === 'income') {
          user.balance += parseFloat(amount);
      } else if (type === 'expense') {
          user.balance -= parseFloat(amount);
      }
      await user.save();

      res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
      console.error('Error in addTransactionWithImage:', error);
      res.status(500).json({ message: 'Something went wrong' });
  }
};

const getUserTransactions = async (req, res) => {
  const userId = req.user.id; // Ambil userId dari middleware

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user ID in request' });
  }

  try {
    // Ambil semua transaksi milik pengguna
    const transactions = await Transaction.findAll({ where: { userId } });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Fungsi untuk mendapatkan transaksi berdasarkan ID
const getTransactionById = async (req, res) => {
  const { id } = req.params; // Ambil ID dari parameter URL
  const userId = req.user.id; // Ambil ID pengguna dari token JWT

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user ID in request' });
  }

  try {
    // Cari transaksi berdasarkan ID dan pastikan milik pengguna yang sedang login
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteTransactionById = async (req, res) => {
  const { id } = req.params; // ID transaksi dari parameter URL
  const userId = req.user.id; // ID pengguna dari token JWT

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user ID in request' });
  }

  try {
    // Cari transaksi berdasarkan ID dan pastikan transaksi milik pengguna yang login
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Cari pengguna terkait
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Perbarui saldo pengguna berdasarkan jenis transaksi
    if (transaction.type === 'income') {
      user.balance -= transaction.amount; // Kurangi saldo jika transaksi adalah pemasukan
    } else if (transaction.type === 'expense') {
      user.balance += transaction.amount; // Tambahkan saldo jika transaksi adalah pengeluaran
    }

    // Simpan perubahan pada saldo pengguna
    await user.save();

    // Hapus transaksi
    await transaction.destroy();

    res.status(200).json({ message: 'Transaction deleted successfully', balance: user.balance });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  addTransactionWithImage,
  getUserTransactions,
  getTransactionById,
  deleteTransactionById
};
