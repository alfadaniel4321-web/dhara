const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'customer', 'admin'], default: 'farmer' },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  village: { type: String, default: '' },
  district: { type: String, default: '' },
  description: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  blocked: { type: Boolean, default: false },
  negativeFeedbacksCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Farmer', FarmerSchema);
