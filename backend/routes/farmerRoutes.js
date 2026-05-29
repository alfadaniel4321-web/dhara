const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can update their profile' });
    }

    const allowed = ['name', 'phone', 'address', 'village', 'district', 'description'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const farmer = await Farmer.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    res.json(farmer);
  } catch (err) {
    console.error('Update farmer profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can view stats' });
    }

    const farmerId = req.user.userId;

    const products = await Product.find({ farmerId });
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;

    const allOrders = await Order.find();
    const farmerOrders = allOrders.filter(o =>
      o.products.some(p => p.farmerId?.toString() === farmerId)
    );
    const activeOrders = farmerOrders.filter(o =>
      ['Pending', 'Processing', 'In Transit'].includes(o.orderStatus)
    ).length;
    const completedOrders = farmerOrders.filter(o => o.orderStatus === 'Delivered').length;

    const totalEarnings = farmerOrders
      .filter(o => o.orderStatus === 'Delivered' || o.paymentStatus === 'Paid')
      .reduce((sum, o) => {
        const items = o.products.filter(p => p.farmerId?.toString() === farmerId);
        return sum + items.reduce((s, i) => s + (i.price || 0) * (i.count || 1), 0);
      }, 0);

    const productViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

    const farmer = await Farmer.findById(farmerId);
    const rating = farmer?.rating || 5.0;

    const orderStatusCounts = {
      pending: farmerOrders.filter(o => o.orderStatus === 'Pending').length,
      processing: farmerOrders.filter(o => o.orderStatus === 'Processing').length,
      shipped: farmerOrders.filter(o => o.orderStatus === 'In Transit').length,
      delivered: farmerOrders.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: farmerOrders.filter(o => o.orderStatus === 'Cancelled').length
    };

    res.json({
      totalProducts,
      activeOrders,
      completedOrders,
      totalEarnings: Math.round(totalEarnings),
      productViews,
      rating,
      lowStock,
      outOfStock,
      pendingDeliveries: orderStatusCounts.shipped,
      orderStatusCounts
    });
  } catch (err) {
    console.error('Farmer stats error:', err);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;
