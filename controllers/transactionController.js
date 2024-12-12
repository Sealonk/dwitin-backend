const { Storage } = require('@google-cloud/storage'); // Library for Google Cloud Storage
const Transaction = require('../models/transaction'); // Import Transaction model
const User = require('../models/user'); // Import User model

const storage = new Storage(); // Initialize Google Cloud Storage

// Function to upload an image to Google Cloud Storage
const uploadImageToStorage = async (imageBuffer, fileName) => {
  try {
    const bucket = storage.bucket('dwitin-bucket'); // Replace with your Google Cloud bucket name
    const file = bucket.file(fileName);
    await file.save(imageBuffer); // Save the image to the bucket
    return file.publicUrl(); // Return the public URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error); // Log the error for debugging
    throw new Error('Error uploading image');
  }
};

// Controller to add a transaction with an optional image
const addTransactionWithImage = async (req, res) => {
  const { title, amount, type, description } = req.body; // Extract transaction details from the request body
  const userId = req.user.id; // Extract user ID from the authenticated token

  try {
    // Check if the user exists in the database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    let imageUrl = null;

    // Upload the image if provided
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const fileName = `transaction_${Date.now()}.jpg`;
      imageUrl = await uploadImageToStorage(imageBuffer, fileName);
    }

    // Create a new transaction in the database
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      description,
      imageUrl,
      userId,
    });

    // Update the user's balance based on the transaction type
    if (type === 'income') {
      user.balance += parseFloat(amount);
    } else if (type === 'expense') {
      user.balance -= parseFloat(amount);
    }
    await user.save(); // Save the updated user balance

    res.status(201).json({
      error: false,
      message: 'Transaction added successfully',
      transactionData: transaction,
    });
  } catch (error) {
    console.error('Error in addTransactionWithImage:', error); // Log the error for debugging
    res.status(500).json({ error: true, message: 'Something went wrong' });
  }
};

// Controller to get all transactions for a specific user
const getUserTransactions = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the authenticated token

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Invalid user ID in request' });
  }

  try {
    // Fetch all transactions for the user from the database
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
    console.error('Error fetching transactions:', error); // Log the error for debugging
    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
};

// Controller to get a single transaction by ID
const getTransactionById = async (req, res) => {
  const { id } = req.params; // Extract transaction ID from the request parameters
  const userId = req.user.id; // Extract user ID from the authenticated token

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Invalid user ID in request' });
  }

  try {
    // Fetch the transaction by ID and ensure it belongs to the user
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
    console.error('Error fetching transaction by ID:', error); // Log the error for debugging
    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
};

// Controller to delete a transaction by ID
const deleteTransactionById = async (req, res) => {
  const { id } = req.params; // Extract transaction ID from the request parameters
  const userId = req.user.id; // Extract user ID from the authenticated token

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Invalid user ID in request' });
  }

  try {
    // Fetch the transaction by ID and ensure it belongs to the user
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
      return res.status(404).json({
        error: true,
        message: 'Transaction not found',
      });
    }

    // Fetch the user to update their balance
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found',
      });
    }

    // Adjust the user's balance based on the transaction type
    if (transaction.type === 'income') {
      user.balance -= transaction.amount;
    } else if (transaction.type === 'expense') {
      user.balance += transaction.amount;
    }
    await user.save(); // Save the updated user balance

    await transaction.destroy(); // Delete the transaction

    res.status(200).json({
      error: false,
      message: 'Transaction deleted successfully',
      balance: user.balance,
    });
  } catch (error) {
    console.error('Error deleting transaction:', error); // Log the error for debugging
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