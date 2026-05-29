const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const FeedbackSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  farmerId: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  negative: { type: Boolean, default: false }
}, { timestamps: true });

const RealFeedbackModel = mongoose.model('Feedback', FeedbackSchema);

const MockFeedback = {
  create: async (feedbackData) => {
    if (isDbConnected()) return RealFeedbackModel.create(feedbackData);
    const db = readLocalDb();
    const newFeedback = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      ...feedbackData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.feedbacks.push(newFeedback);
    writeLocalDb(db);
    return newFeedback;
  },

  find: async (query = {}) => {
    if (isDbConnected()) {
      return RealFeedbackModel.find(query);
    }
    const db = readLocalDb();
    let filtered = [...db.feedbacks];
    Object.keys(query).forEach(key => {
      filtered = filtered.filter(f => f[key] == query[key]);
    });

    // Populate customer and farmer details
    return filtered.map(f => {
      const customer = db.users.find(u => u.id === f.customerId || u._id === f.customerId);
      const farmer = db.users.find(u => u.id === f.farmerId || u._id === f.farmerId);
      return {
        ...f,
        customerId: customer ? { _id: customer.id, name: customer.name } : null,
        farmerId: farmer ? { _id: farmer.id, name: farmer.name } : null
      };
    });
  }
};

module.exports = MockFeedback;
