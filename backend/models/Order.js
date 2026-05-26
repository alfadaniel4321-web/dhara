const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, default: 0 },
    count: { type: Number, default: 1 },
    farmerId: { type: String }
  }],
  totalPrice: { type: Number, default: 0 },
  deliveryTime: { type: String, enum: ['Morning', 'Evening'], default: 'Morning' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'], default: 'Pending' },
  subscriptionType: { type: String, enum: ['One-time', 'Daily', 'Weekly', 'Mon-Wed-Fri', 'Paused'], default: 'One-time' },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' }
}, { timestamps: true });

const RealOrderModel = mongoose.model('Order', OrderSchema);

const MockOrder = {
  create: async (orderData) => {
    if (isDbConnected()) return RealOrderModel.create(orderData);
    const db = readLocalDb();
    const newOrder = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      ...orderData,
      status: orderData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    writeLocalDb(db);
    return newOrder;
  },

  find: async (query = {}) => {
    if (isDbConnected()) {
      return RealOrderModel.find(query).populate('customerId', 'name email phone');
    }
    const db = readLocalDb();
    let filtered = [...db.orders];
    Object.keys(query).forEach(key => {
      filtered = filtered.filter(o => o[key] == query[key]);
    });

    // Populate customer details
    return filtered.map(o => {
      const customer = db.users.find(u => u.id === o.customerId || u._id === o.customerId);
      return {
        ...o,
        customerId: customer ? { _id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } : null
      };
    });
  },

  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (isDbConnected()) return RealOrderModel.findByIdAndUpdate(id, updateData, options);
    const db = readLocalDb();
    const index = db.orders.findIndex(o => o.id === id || o._id === id);
    if (index === -1) return null;

    const cleanUpdate = { ...updateData };
    const setUpdates = updateData.$set || cleanUpdate;

    db.orders[index] = {
      ...db.orders[index],
      ...setUpdates,
      updatedAt: new Date().toISOString()
    };
    writeLocalDb(db);
    return db.orders[index];
  }
};

module.exports = MockOrder;
