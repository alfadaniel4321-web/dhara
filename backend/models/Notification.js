const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const NotificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['preorder', 'order', 'general'], default: 'preorder' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    customerName: String,
    productName: String,
    quantity: Number,
    preOrderTime: Date,
    preOrderId: String
  },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const RealNotificationModel = mongoose.model('Notification', NotificationSchema);

const MockNotification = {
  find: async (query = {}) => {
    if (isDbConnected()) {
      return RealNotificationModel.find(query).sort({ createdAt: -1 });
    }
    const db = readLocalDb();
    let filtered = [...(db.notifications || [])];
    Object.keys(query).forEach(key => {
      filtered = filtered.filter(n => n[key] == query[key]);
    });
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create: async (notifData) => {
    if (isDbConnected()) return RealNotificationModel.create(notifData);
    const db = readLocalDb();
    if (!db.notifications) db.notifications = [];
    const newNotif = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      ...notifData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.notifications.push(newNotif);
    writeLocalDb(db);
    return newNotif;
  },

  updateMany: async (query, updateData) => {
    if (isDbConnected()) return RealNotificationModel.updateMany(query, updateData);
    const db = readLocalDb();
    const notifications = db.notifications || [];
    let count = 0;
    notifications.forEach(n => {
      if (Object.keys(query).every(key => n[key] == query[key])) {
        Object.assign(n, updateData);
        count++;
      }
    });
    writeLocalDb(db);
    return { modifiedCount: count };
  },

  countDocuments: async (query = {}) => {
    if (isDbConnected()) return RealNotificationModel.countDocuments(query);
    const db = readLocalDb();
    const notifications = db.notifications || [];
    return notifications.filter(n => {
      return Object.keys(query).every(key => n[key] == query[key]);
    }).length;
  }
};

module.exports = MockNotification;
