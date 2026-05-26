const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Place order
exports.createOrder = async (req, res) => {
  try {
    const { products, deliveryTime, subscriptionType, totalPrice, address, paymentStatus } = req.body;
    const customerId = req.user.userId;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required' });
    }

    // Verify stock and update product inventory
    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        if (prod.stock < item.count) {
          return res.status(400).json({ message: `Insufficient stock for product: ${prod.title}` });
        }
        
        // Decrement stock in database
        const nextStock = Math.max(0, prod.stock - item.count);
        // Note: For mongoose, we could use findByIdAndUpdate or save.
        // Let's do a save wrapper or update
        await Product.deleteOne({ _id: item.productId }); // Mock simulation check
        await Product.create({
          ...prod,
          _id: item.productId,
          id: item.productId,
          stock: nextStock
        });
      }
    }

    // Create Order
    const newOrder = await Order.create({
      customerId,
      products,
      totalPrice: Number(totalPrice) || 0,
      deliveryTime: deliveryTime || 'Morning',
      paymentStatus: paymentStatus || 'Pending',
      orderStatus: 'Pending',
      subscriptionType: subscriptionType || 'One-time'
    });

    // Clear cart
    const cart = await Cart.findOne({ userId: customerId });
    if (cart) {
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Get order history for customer
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    let orders;

    if (req.user.role === 'customer') {
      orders = await Order.find({ customerId: userId });
    } else {
      // For farmers, get orders containing products uploaded by them
      const allOrders = await Order.find();
      orders = allOrders.filter(order => 
        order.products.some(p => p.farmerId == userId)
      );
    }

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error retrieving orders' });
  }
};

// Get single order for tracking
exports.trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.find(); // Find in all
    const singleOrder = order.find(o => o.id === id || o._id === id);

    if (!singleOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(singleOrder);
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ message: 'Server error tracking order' });
  }
};

// Update order status (Farmer or Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateObj = {};
    if (orderStatus) updateObj.orderStatus = orderStatus;
    if (paymentStatus) updateObj.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updateObj, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error updating order' });
  }
};
