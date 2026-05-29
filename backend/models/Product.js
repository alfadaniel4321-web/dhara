const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  harvestDate: { type: Date, default: Date.now },
  availableTime: { type: String, default: '' },
  nutrition: { type: String, default: '' },
  protein: { type: String, default: '' },
  freshnessScore: { type: Number, default: 0 },
  description: { type: String, default: '' },
  offerDetails: { type: String, default: '' },
  farmerId: { type: String, required: true }
}, { timestamps: true });

const RealProductModel = mongoose.model('Product', ProductSchema);

const MockProduct = {
  find: async (query = {}) => {
    if (isDbConnected()) {
      return RealProductModel.find(query);
    }
    const db = readLocalDb();
    let filtered = [...db.products];
    Object.keys(query).forEach(key => {
      // Allow flexible matches (like simple equivalence)
      if (key === 'category' && query[key]) {
        filtered = filtered.filter(p => p.category.toLowerCase() === query[key].toLowerCase());
      } else {
        filtered = filtered.filter(p => p[key] == query[key]);
      }
    });

    // Populate farmer info manually from users array in mock
    return filtered.map(p => {
      const farmer = db.users.find(u => u.id === p.farmerId || u._id === p.farmerId);
      return {
        ...p,
        farmerId: farmer ? { _id: farmer.id, name: farmer.name, rating: farmer.rating, blocked: farmer.blocked } : null
      };
    });
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return RealProductModel.findById(id);
    }
    const db = readLocalDb();
    const product = db.products.find(p => p.id === id || p._id === id);
    if (!product) return null;
    const farmer = db.users.find(u => u.id === product.farmerId || u._id === product.farmerId);
    return {
      ...product,
      farmerId: farmer ? { _id: farmer.id, name: farmer.name, rating: farmer.rating, blocked: farmer.blocked } : null
    };
  },

  create: async (productData) => {
    if (isDbConnected()) return RealProductModel.create(productData);
    const db = readLocalDb();
    const newProduct = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    writeLocalDb(db);
    return newProduct;
  },

  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (isDbConnected()) return RealProductModel.findByIdAndUpdate(id, updateData, options);
    const db = readLocalDb();
    const index = db.products.findIndex(p => p.id === id || p._id === id);
    if (index === -1) return null;
    const setUpdates = updateData.$set || updateData;
    db.products[index] = { ...db.products[index], ...setUpdates, updatedAt: new Date().toISOString() };
    writeLocalDb(db);
    return db.products[index];
  },

  deleteOne: async (query) => {
    if (isDbConnected()) return RealProductModel.deleteOne(query);
    const db = readLocalDb();
    const key = Object.keys(query)[0];
    const val = query[key];
    const index = db.products.findIndex(p => p[key] === val);
    if (index !== -1) {
      db.products.splice(index, 1);
      writeLocalDb(db);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
};

module.exports = MockProduct;
