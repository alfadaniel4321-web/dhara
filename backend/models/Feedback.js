const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  negative: { type: Boolean, default: false },
  reply: { type: String, default: '' },
  replyAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
