const mongoose = require('mongoose');

const PreOrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

module.exports = mongoose.model('PreOrder', PreOrderSchema);
