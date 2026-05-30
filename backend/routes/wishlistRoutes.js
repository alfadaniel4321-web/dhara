const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.userId }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.userId, products: [] });
    }
    res.json(wishlist.products);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
});

router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.userId, products: [productId] });
    } else {
      const idx = wishlist.products.findIndex(p => p.toString() === productId);
      if (idx > -1) {
        wishlist.products.splice(idx, 1);
      } else {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    const populated = await Wishlist.findOne({ userId: req.user.userId }).populate('products');
    res.json(populated.products);
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
});

module.exports = router;
