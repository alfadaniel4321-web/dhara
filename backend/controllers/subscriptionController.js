const Order = require('../models/Order');

// Create Subscription or Order
exports.createSubscription = async (req, res) => {
  try {
    const { products, deliveryTime, subscriptionType } = req.body;
    const customerId = req.user.userId;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products list is required' });
    }

    if (!deliveryTime || !subscriptionType) {
      return res.status(400).json({ message: 'Delivery time and subscription type are required' });
    }

    const newOrder = await Order.create({
      customerId,
      products,
      deliveryTime,
      subscriptionType,
      status: 'active'
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Create subscription error:', err);
    res.status(500).json({ message: 'Server error creating subscription' });
  }
};

// Get Subscriptions for Current User (Customer or Farmer)
exports.getSubscriptions = async (req, res) => {
  try {
    const userId = req.user.userId;
    let orders;

    if (req.user.role === 'customer') {
      orders = await Order.find({ customerId: userId });
    } else {
      // For farmers, get orders containing products uploaded by them
      const allOrders = await Order.find();
      // Since it's a mock or mongoose search, filter by products matching the farmerId
      orders = allOrders.filter(order => 
        order.products.some(p => p.farmerId === userId)
      );
    }

    res.json(orders);
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ message: 'Server error fetching subscriptions' });
  }
};

// Pause/Resume/Cancel Subscription
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, subscriptionType } = req.body; // active, paused, or completed

    const updateObj = {};
    if (status) updateObj.status = status;
    if (subscriptionType) updateObj.subscriptionType = subscriptionType;

    const order = await Order.findByIdAndUpdate(id, updateObj, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Subscription order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Update subscription error:', err);
    res.status(500).json({ message: 'Server error updating subscription' });
  }
};
