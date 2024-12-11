const { Storage } = require('@google-cloud/storage');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const storage = new Storage();

// Fungsi untuk mengunggah gambar ke Google Cloud Storage
const uploadImageToStorage = async (imageBuffer, fileName) => {
  try {
    const bucket = storage.bucket('dwitin-bucket'); // Ganti dengan nama bucket Anda
    const file = bucket.file(fileName);
    await file.save(imageBuffer);
    return file.publicUrl();
  } catch (error) {
    console.error('Error uploading image:', error); // Debugging
    throw new Error('Error uploading image');
  }
};

// Fungsi untuk menambahkan transaksi
const addTransactionWithImage = async (req, res) => {
  const { title, amount, type, description } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    let imageUrl = null;

    if (req.file) {
      const imageBuffer = req.file.buffer;
      const fileName = `transaction_${Date.now()}.jpg`;
      imageUrl = await uploadImageToStorage(imageBuffer, fileName);
    }

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      description,
      imageUrl,
      userId,
    });

    if (type === 'income') {
      user.balance += parseFloat(amount);
    } else if (type === 'expense') {
      user.balance -= parseFloat(amount);
    }
    await user.save();

    res.status(201).json({
      error: false,
      message: 'Transaction added successfully',
      transactionData: transaction,
    });
  } catch (error) {
    console.error('Error in addTransactionWithImage:', error);
    res.status(500).json({ error: true, message: 'Something went wrong' });
  }
};

const getUserTransactions = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Invalid user ID in request' });
  }

  try {
    const transactions = await Transaction.findAll({ where: { userId } });

    if (transactions.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'No transactions found for this user',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Transactions fetched successfully',
      listTransaction: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
};

// Fungsi untuk mendapatkan transaksi berdasarkan ID
const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Invalid user ID in request' });
  }

  try {
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return res.status(404).json({
        error: true,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Transaction fetched successfully',
      transaction: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
};

const deleteTransactionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Invalid user ID in request' });
  }

  try {
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return res.status(404).json({
        error: true,
        message: 'Transaction not found',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found',
      });
    }

    if (transaction.type === 'income') {
      user.balance -= transaction.amount;
    } else if (transaction.type === 'expense') {
      user.balance += transaction.amount;
    }
    await user.save();

    await transaction.destroy();

    res.status(200).json({
      error: false,
      message: 'Transaction deleted successfully',
      balance: user.balance,
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  uploadImageToStorage,
  addTransactionWithImage,
  getUserTransactions,
  getTransactionById,
  deleteTransactionById
};
