const mongoose = require('mongoose');

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
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  nextHarvest: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
