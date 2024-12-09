const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const storage = new Storage();
const visionClient = new vision.ImageAnnotatorClient();

// Fungsi untuk mengunggah gambar ke Google Cloud Storage
const uploadImageToStorage = async (imageBuffer, fileName) => {
  try {
    const bucket = storage.bucket('your-bucket-name');  // Ganti dengan nama bucket Anda
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
  const { title, amount, type, description, image } = req.body;

  try {
    const userId = req.user.id;

    // Memastikan pengguna ada
    const user = await User.findByPk(userId);
    if (!user) {
      console.error("User not found");  // Log jika pengguna tidak ditemukan
      return res.status(404).json({ message: 'User not found' });
    }

    // Mengunggah gambar ke Google Cloud Storage jika ada gambar
    let imageUrl = null;
    let totalAmount = amount;

    if (image) {
      imageUrl = await uploadImageToStorage(image, `transaction_${Date.now()}.jpg`);
      totalAmount = await analyzeImage(image);  // Analisis gambar menggunakan OCR
    }

    // Membuat transaksi baru yang terhubung dengan pengguna
    const transaction = await Transaction.create({
      title,
      amount: totalAmount || amount,  // Menggunakan hasil OCR jika ada, atau menggunakan amount manual
      type,
      description,
      imageUrl,
      userId,
    });

    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error("Error in addTransactionWithImage:", error);  // Log error di sini
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  addTransactionWithImage,
};
