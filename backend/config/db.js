const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let fallbackDbPath = path.join(__dirname, '..', 'data', 'local_db.json');

// Ensure data folder exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial fallback database structure
const initialDb = {
  users: [],
  products: [],
  orders: [],
  feedbacks: [],
  preOrders: [],
  notifications: []
};

// Helper to read local JSON database
const readLocalDb = () => {
  try {
    if (!fs.existsSync(fallbackDbPath)) {
      fs.writeFileSync(fallbackDbPath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(fallbackDbPath, 'utf8');
    return JSON.parse(data || JSON.stringify(initialDb));
  } catch (err) {
    console.error('Error reading fallback DB:', err);
    return initialDb;
  }
};

// Helper to write local JSON database
const writeLocalDb = (data) => {
  try {
    fs.writeFileSync(fallbackDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing fallback DB:', err);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dhara';
  try {
    // Set a short connection timeout so it falls back quickly if MongoDB is not running
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // 2 seconds timeout
    });
    isConnected = true;
    console.log('🟢 MongoDB connected successfully.');
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ MongoDB connection failed. Utilizing local JSON Database fallback instead.');
    // Initialize file db if not present
    readLocalDb();
  }
};

// Check if mongoose is connected
const isDbConnected = () => isConnected;

module.exports = {
  connectDB,
  isDbConnected,
  readLocalDb,
  writeLocalDb
};
