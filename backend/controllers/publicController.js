const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');

exports.getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      active: true,
      $or: [
        { validFrom: { $lte: now }, validUntil: { $gte: now } },
        { validFrom: { $exists: false } },
        { validFrom: null },
        { validFrom: '' },
      ]
    }).sort({ priority: -1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({ active: true }).sort({ createdAt: -1 });

    const active = coupons.filter(c => {
      const fromOk = !c.validFrom || new Date(c.validFrom) <= now;
      const untilOk = !c.validUntil || new Date(c.validUntil) >= now;
      const usageOk = c.usageLimit <= 0 || c.usedCount < c.usageLimit;
      return fromOk && untilOk && usageOk;
    });

    const result = active.map(c => ({
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscount: c.maxDiscount,
      validUntil: c.validUntil,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalProducts, totalFarmers, avgRatingResult, totalCustomers] = await Promise.all([
      Product.countDocuments({}),
      Farmer.countDocuments({ blocked: false }),
      Farmer.aggregate([
        { $match: { blocked: false } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      User.countDocuments({ role: 'customer' })
    ]);

    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 5.0;

    res.json({
      totalProducts,
      totalFarmers,
      avgRating: Math.round(avgRating * 10) / 10,
      totalCustomers
    });
  } catch (err) {
    console.error('Get public stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code', valid: false });
    }

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return res.status(400).json({ message: 'Coupon is not yet valid', valid: false });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return res.status(400).json({ message: 'Coupon has expired', valid: false });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached', valid: false });
    }
    if (cartTotal && coupon.minOrderValue > 0 && cartTotal < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value of ₹${coupon.minOrderValue} required`, valid: false });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal || 0) * coupon.discountValue / 100);
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
