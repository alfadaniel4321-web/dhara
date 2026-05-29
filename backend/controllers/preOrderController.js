const PreOrder = require('../models/PreOrder');
const Notification = require('../models/Notification');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const User = require('../models/User');

// Create a pre-order
exports.createPreOrder = async (req, res) => {
  try {
    const { productId, farmerId, quantity = 1 } = req.body;
    const customerId = req.user.userId;

    if (!productId || !farmerId) {
      return res.status(400).json({ message: 'Product ID and Farmer ID are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const preOrder = await PreOrder.create({
      customerId,
      productId,
      farmerId,
      quantity: Number(quantity),
      productTitle: product.title,
      productName: product.title,
      price: product.price,
      customerName: customer.name,
      farmerName: farmer.name,
      expectedHarvestDate: product.harvestDate,
      status: 'Confirmed',
      preOrderedAt: new Date(),
      notified: false
    });

    // Create notification for the farmer
    await Notification.create({
      recipientId: farmerId,
      senderId: customerId,
      type: 'preorder',
      title: 'New Pre-Order Received',
      message: `${customer.name} has pre-ordered ${product.title} (Qty: ${quantity})`,
      data: {
        customerName: customer.name,
        productName: product.title,
        quantity: Number(quantity),
        preOrderTime: new Date(),
        preOrderId: preOrder.id || preOrder._id
      }
    });

    // Mark as notified
    await PreOrder.findOneAndUpdate(
      { _id: preOrder.id || preOrder._id },
      { notified: true }
    );

    res.status(201).json({
      success: true,
      message: 'Pre-order placed successfully',
      preOrder,
      confirmationTime: new Date().toISOString()
    });
  } catch (err) {
    console.error('Create pre-order error:', err);
    res.status(500).json({ message: 'Server error creating pre-order' });
  }
};

// Get pre-orders for a customer
exports.getCustomerPreOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const preOrders = await PreOrder.find({ customerId });
    res.json(preOrders);
  } catch (err) {
    console.error('Get customer pre-orders error:', err);
    res.status(500).json({ message: 'Server error retrieving pre-orders' });
  }
};

// Get pre-orders for a farmer
exports.getFarmerPreOrders = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const preOrders = await PreOrder.find({ farmerId });
    res.json(preOrders);
  } catch (err) {
    console.error('Get farmer pre-orders error:', err);
    res.status(500).json({ message: 'Server error retrieving pre-orders' });
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ recipientId: userId });
    const unreadCount = await Notification.countDocuments({ recipientId: userId, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error retrieving notifications' });
  }
};

// Mark notifications as read
exports.markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Notification.updateMany({ recipientId: userId, read: false }, { read: true });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    console.error('Mark notifications read error:', err);
    res.status(500).json({ message: 'Server error marking notifications' });
  }
};
