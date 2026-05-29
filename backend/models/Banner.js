const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  type: { type: String, enum: ['fest', 'mega_sale', 'seasonal', 'offer', 'general'], default: 'general' },
  active: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  validFrom: { type: Date },
  validUntil: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
