const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');

exports.getDashboardStats = async (req, res) => {
  try {
    const [users, farmers, products, orders] = await Promise.all([
      User.countDocuments(),
      Farmer.countDocuments(),
      Product.countDocuments(),
      Order.find(),
    ]);

    const totalRevenue = orders
      .filter(o => o.orderStatus === 'Delivered' || o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const pendingDeliveries = orders.filter(o => o.orderStatus === 'In Transit').length;
    const pickupOrders = orders.filter(o => o.deliveryTime === 'pickup' || o.deliveryTime === 'Pickup').length;
    const directOrders = orders.length - pickupOrders;

    const orderStatusCounts = {
      pending: orders.filter(o => o.orderStatus === 'Pending').length,
      confirmed: orders.filter(o => o.orderStatus === 'Processing').length,
      packed: orders.filter(o => o.orderStatus === 'Packed').length,
      outForDelivery: orders.filter(o => o.orderStatus === 'In Transit').length,
      delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
    };

    const blockedFarmers = await Farmer.countDocuments({ blocked: true });

    res.json({
      totalUsers: users,
      totalFarmers: farmers,
      totalProducts: products,
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue),
      pendingDeliveries,
      pickupOrders,
      directOrders,
      blockedFarmers,
      orderStatusCounts,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    const farmersWithProducts = await Promise.all(
      farmers.map(async (f) => {
        const productCount = await Product.countDocuments({ farmerId: f._id });
        const feedbacks = await Feedback.find({ farmerId: f._id });
        const complaints = feedbacks.filter(fb => fb.negative).length;
        return {
          id: f._id, _id: f._id,
          name: f.name, email: f.email, phone: f.phone,
          address: f.address, village: f.village, district: f.district,
          description: f.description,
          rating: f.rating, blocked: f.blocked,
          negativeFeedbacksCount: f.negativeFeedbacksCount,
          productCount, complaints,
          createdAt: f.createdAt,
        };
      })
    );
    res.json(farmersWithProducts);
  } catch (err) {
    console.error('Get farmers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.blockFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { blocked: true, negativeFeedbacksCount: 3 },
      { new: true }
    );
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: `Blocked farmer: ${farmer.name}`, farmer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unblockFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { blocked: false },
      { new: true }
    );
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: `Unblocked farmer: ${farmer.name}`, farmer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetStrikes = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { blocked: false, negativeFeedbacksCount: 0, rating: 5.0 },
      { new: true }
    );
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    await Feedback.deleteMany({ farmerId: req.params.id, negative: true });
    res.json({ message: `Reset strikes for ${farmer.name}`, farmer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const farmerIds = [...new Set(products.map(p => p.farmerId?.toString()).filter(Boolean))];
    const farmers = await Farmer.find({ _id: { $in: farmerIds } }).select('name email').lean();
    const farmerMap = {};
    for (const f of farmers) farmerMap[f._id.toString()] = f.name;

    const results = products.map(p => ({
      ...p,
      farmerName: farmerMap[p.farmerId?.toString()] || 'Unknown',
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setOfferDetails = async (req, res) => {
  try {
    const { offerDetails } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { offerDetails: offerDetails || '' },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: `Offer ${offerDetails ? 'added' : 'removed'}`, product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleFeatureProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.featured = !product.featured;
    await product.save();
    res.json({ message: `Product ${product.featured ? 'featured' : 'unfeatured'}`, product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const customerIds = [...new Set(orders.map(o => o.customerId?.toString()).filter(Boolean))];
    const customers = await User.find({ _id: { $in: customerIds } }).select('name email phone').lean();
    const customerMap = {};
    for (const c of customers) customerMap[c._id.toString()] = c;

    const results = orders.map(o => ({
      ...o,
      customer: customerMap[o.customerId?.toString()] || null,
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const negativeFeedbacks = await Feedback.find({ negative: true })
      .populate('customerId', 'name email')
      .populate('productId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const farmerIds = [...new Set(negativeFeedbacks.map(f => f.farmerId?.toString()).filter(Boolean))];
    const farmers = await Farmer.find({ _id: { $in: farmerIds } }).select('name email phone blocked').lean();
    const farmerMap = {};
    for (const f of farmers) farmerMap[f._id.toString()] = f;

    const reports = negativeFeedbacks.map(f => ({
      ...f,
      farmer: farmerMap[f.farmerId?.toString()] || null,
    }));

    const complaintsByFarmer = {};
    for (const r of reports) {
      const fid = r.farmerId?.toString();
      if (!complaintsByFarmer[fid]) {
        complaintsByFarmer[fid] = {
          farmer: r.farmer,
          count: 0,
          reviews: [],
        };
      }
      complaintsByFarmer[fid].count++;
      complaintsByFarmer[fid].reviews.push(r);
    }

    res.json({
      totalComplaints: negativeFeedbacks.length,
      complaintsByFarmer: Object.values(complaintsByFarmer).sort((a, b) => b.count - a.count),
      recentComplaints: reports.slice(0, 20),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().lean();

    const dailyOrders = {};
    const revenueByDay = {};
    const farmerSales = {};
    const productSales = {};

    for (const o of orders) {
      const day = new Date(o.createdAt).toISOString().split('T')[0];
      dailyOrders[day] = (dailyOrders[day] || 0) + 1;

      if (o.orderStatus === 'Delivered' || o.paymentStatus === 'Paid') {
        revenueByDay[day] = (revenueByDay[day] || 0) + (o.totalPrice || 0);
      }

      for (const p of (o.products || [])) {
        const fId = p.farmerId?.toString() || 'unknown';
        farmerSales[fId] = (farmerSales[fId] || 0) + (p.count || 1);
        productSales[p.title || p.productId] = (productSales[p.title || p.productId] || 0) + (p.count || 1);
      }
    }

    const farmerIds = Object.keys(farmerSales).filter(id => id !== 'unknown');
    const farmers = await Farmer.find({ _id: { $in: farmerIds } }).select('name').lean();
    const farmerNameMap = {};
    for (const f of farmers) farmerNameMap[f._id.toString()] = f.name;

    const topFarmers = Object.entries(farmerSales)
      .map(([id, units]) => ({ name: farmerNameMap[id] || `Farmer ${id.slice(-4)}`, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);

    const topProducts = Object.entries(productSales)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);

    const dailyOrderData = Object.entries(dailyOrders)
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    const revenueData = Object.entries(revenueByDay)
      .map(([date, amount]) => ({ date, amount: Math.round(amount) }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    const activeUsers = await User.countDocuments({ role: 'customer' });
    const activeFarmers = await Farmer.countDocuments({ blocked: false });

    res.json({
      dailyOrderData,
      revenueData,
      topFarmers,
      topProducts,
      activeUsers,
      activeFarmers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type, target } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    let recipients = [];
    if (target === 'farmers') {
      const farmers = await Farmer.find().select('_id');
      recipients = farmers.map(f => f._id);
    } else if (target === 'customers') {
      const users = await User.find().select('_id');
      recipients = users.map(u => u._id);
    } else {
      const farmers = await Farmer.find().select('_id');
      const users = await User.find().select('_id');
      recipients = [...farmers.map(f => f._id), ...users.map(u => u._id)];
    }

    const notifications = recipients.map(recipientId => ({
      recipientId,
      senderId: req.user.userId,
      type: type || 'general',
      title,
      message,
      data: {},
      read: false,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.json({ message: `Notification sent to ${recipients.length} users`, count: recipients.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    const masked = users.map(u => ({
      id: u._id, _id: u._id,
      name: u.name, email: u.email, role: u.role,
      phone: u.phone, blocked: u.blocked || false,
      rating: u.rating || null,
      negativeFeedbacksCount: u.negativeFeedbacksCount || 0,
      createdAt: u.createdAt,
      source: 'users',
    }));

    res.json(masked);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Coupons ──────────────────────────────────────────────
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, validFrom, validUntil } = req.body;
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });
    const coupon = await Coupon.create({
      code, description, discountType, discountValue,
      minOrderValue: minOrderValue || 0, maxDiscount: maxDiscount || 0,
      usageLimit: usageLimit || 0, validFrom, validUntil,
      createdBy: req.user.userId,
    });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.active = !coupon.active;
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Banners ───────────────────────────────────────────────
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ priority: -1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      active: true,
      $or: [
      { validFrom: { $lte: now }, validUntil: { $gte: now } },
      { validFrom: { $exists: false } },
      { validFrom: null },
      ]
    }).sort({ priority: -1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, type, priority, validFrom, validUntil } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const banner = await Banner.create({
      title, subtitle, image, link, type: type || 'general',
      priority: priority || 0, validFrom, validUntil,
      createdBy: req.user.userId,
    });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    banner.active = !banner.active;
    await banner.save();
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
