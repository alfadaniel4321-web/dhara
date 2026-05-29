const mongoose = require('mongoose');
const { isDbConnected, readLocalDb, writeLocalDb } = require('../config/db');

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{
    productId: { type: String, required: true },
    count: { type: Number, default: 1 }
  }],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

const RealCartModel = mongoose.model('Cart', CartSchema);

const MockCart = {
  findOne: async (query) => {
    if (isDbConnected()) return RealCartModel.findOne(query);
    const db = readLocalDb();
    if (!db.carts) db.carts = [];
    
    const key = Object.keys(query)[0];
    const val = query[key];
    const cart = db.carts.find(c => c[key] == val);
    if (!cart) return null;

    // Simulate population
    const populatedProducts = cart.products.map(p => {
      const product = db.products.find(prod => prod.id === p.productId || prod._id === p.productId);
      return {
        productId: product || null,
        count: p.count
      };
    });

    return {
      ...cart,
      products: populatedProducts,
      save: async function() {
        const index = db.carts.findIndex(c => c.userId == this.userId);
        // Depopulate for save
        const savedProducts = this.products.map(p => ({
          productId: p.productId?._id || p.productId?.id || p.productId,
          count: p.count
        }));
        
        const updatedCart = {
          ...this,
          products: savedProducts
        };
        
        if (index !== -1) {
          db.carts[index] = updatedCart;
        } else {
          db.carts.push(updatedCart);
        }
        writeLocalDb(db);
        return this;
      }
    };
  },

  create: async (cartData) => {
    if (isDbConnected()) return RealCartModel.create(cartData);
    const db = readLocalDb();
    if (!db.carts) db.carts = [];

    const newCart = {
      _id: Math.random().toString(36).substring(2, 9),
      id: Math.random().toString(36).substring(2, 9),
      userId: cartData.userId,
      products: cartData.products || [],
      totalPrice: cartData.totalPrice || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.carts.push(newCart);
    writeLocalDb(db);
    return newCart;
  }
};

module.exports = MockCart;
