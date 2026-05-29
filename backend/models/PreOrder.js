const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const PreOrderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  productId: { type: String, required: true },
  farmerId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  productTitle: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  customerName: { type: String, required: true },
  farmerName: { type: String, required: true },
  expectedHarvestDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Delivered'], default: 'Pending' },
  preOrderedAt: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false }
}, { timestamps: true });

const RealPreOrderModel = mongoose.model('PreOrder', PreOrderSchema);

const MockPreOrder = {
  find: async (query = {}) => {
    if (isDbConnected()) {
      return RealPreOrderModel.find(query).sort({ createdAt: -1 });
    }
    const db = readLocalDb();
    let filtered = [...(db.preOrders || [])];
    Object.keys(query).forEach(key => {
      filtered = filtered.filter(p => p[key] == query[key]);
    });
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById: async (id) => {
    if (isDbConnected()) return RealPreOrderModel.findById(id);
    const db = readLocalDb();
    return (db.preOrders || []).find(p => p.id === id || p._id === id) || null;
  },

  create: async (preOrderData) => {
    if (isDbConnected()) return RealPreOrderModel.create(preOrderData);
    const db = readLocalDb();
    if (!db.preOrders) db.preOrders = [];
    const newPreOrder = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      ...preOrderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.preOrders.push(newPreOrder);
    writeLocalDb(db);
    return newPreOrder;
  },

  findOneAndUpdate: async (query, updateData, options = {}) => {
    if (isDbConnected()) return RealPreOrderModel.findOneAndUpdate(query, updateData, options);
    const db = readLocalDb();
    const preOrders = db.preOrders || [];
    const index = preOrders.findIndex(p => {
      return Object.keys(query).every(key => p[key] == query[key]);
    });
    if (index === -1) return null;
    preOrders[index] = { ...preOrders[index], ...updateData, updatedAt: new Date().toISOString() };
    writeLocalDb(db);
    return preOrders[index];
  }
};

module.exports = MockPreOrder;
