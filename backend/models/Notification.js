const mongoose = require('mongoose');

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

module.exports = mongoose.model('Notification', NotificationSchema);
