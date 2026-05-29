const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'customer', 'admin'], default: 'customer' },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  village: { type: String, default: '' },
  district: { type: String, default: '' },
  description: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  blocked: { type: Boolean, default: false },
  negativeFeedbacksCount: { type: Number, default: 0 }
}, { timestamps: true });

const RealUserModel = mongoose.model('User', UserSchema);

const MockUser = {
  findOne: async (query) => {
    if (isDbConnected()) return RealUserModel.findOne(query);
    const db = readLocalDb();
    const key = Object.keys(query)[0];
    const val = query[key];
    const user = db.users.find(u => u[key] === val);
    if (!user) return null;
    return { ...user, save: async function() {
      const index = db.users.findIndex(u => u.id === this.id);
      if (index !== -1) {
        db.users[index] = { ...this };
        writeLocalDb(db);
      }
      return this;
    }};
  },

  findById: async (id) => {
    if (isDbConnected()) return RealUserModel.findById(id);
    const db = readLocalDb();
    const user = db.users.find(u => u.id === id || u._id === id);
    if (!user) return null;
    return { ...user, save: async function() {
      const index = db.users.findIndex(u => u.id === this.id);
      if (index !== -1) {
        db.users[index] = { ...this };
        writeLocalDb(db);
      }
      return this;
    }};
  },

  create: async (userData) => {
    if (isDbConnected()) return RealUserModel.create(userData);
    const db = readLocalDb();
    const newUser = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      ...userData,
      village: userData.village || '',
      district: userData.district || '',
      description: userData.description || '',
      rating: userData.rating !== undefined ? userData.rating : 5.0,
      blocked: userData.blocked !== undefined ? userData.blocked : false,
      negativeFeedbacksCount: userData.negativeFeedbacksCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeLocalDb(db);
    return newUser;
  },

  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (isDbConnected()) return RealUserModel.findByIdAndUpdate(id, updateData, options);
    const db = readLocalDb();
    const index = db.users.findIndex(u => u.id === id || u._id === id);
    if (index === -1) return null;
    
    if (updateData.$inc) {
      for (const field of Object.keys(updateData.$inc)) {
        db.users[index][field] = (db.users[index][field] || 0) + updateData.$inc[field];
      }
    }
    
    const cleanUpdate = { ...updateData };
    delete cleanUpdate.$inc;
    delete cleanUpdate.$set;
    
    const setUpdates = updateData.$set || cleanUpdate;

    db.users[index] = {
      ...db.users[index],
      ...setUpdates,
      updatedAt: new Date().toISOString()
    };
    writeLocalDb(db);
    return db.users[index];
  },

  find: async (query = {}) => {
    if (isDbConnected()) return RealUserModel.find(query);
    const db = readLocalDb();
    let filtered = [...db.users];
    Object.keys(query).forEach(key => {
      filtered = filtered.filter(u => u[key] === query[key]);
    });
    return filtered;
  }
};

module.exports = MockUser;
