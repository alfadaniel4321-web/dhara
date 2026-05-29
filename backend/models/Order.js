const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, default: 0 },
    count: { type: Number, default: 1 },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  totalPrice: { type: Number, default: 0 },
  address: { type: String, default: '' },
  deliveryDate: { type: Date },
  deliveryTime: { type: String, enum: ['Morning', 'Evening'], default: 'Morning' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'], default: 'Pending' },
  subscriptionType: { type: String, enum: ['One-time', 'Daily', 'Weekly', 'Mon-Wed-Fri', 'Paused'], default: 'One-time' },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
