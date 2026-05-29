const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { products, deliveryTime, subscriptionType, totalPrice, address, paymentStatus } = req.body;
    const customerId = req.user.userId;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required' });
    }

    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        if (prod.stock < item.count) {
          return res.status(400).json({ message: `Insufficient stock for product: ${prod.title}` });
        }
        const nextStock = Math.max(0, prod.stock - item.count);
        await Product.findByIdAndUpdate(item.productId, { stock: nextStock });
      }
    }

    const newOrder = await Order.create({
      customerId,
      products,
      totalPrice: Number(totalPrice) || 0,
      address: address || '',
      deliveryDate: req.body.deliveryDate || null,
      deliveryTime: deliveryTime || 'Morning',
      paymentStatus: paymentStatus || 'Pending',
      orderStatus: 'Pending',
      subscriptionType: subscriptionType || 'One-time'
    });

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

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    let orders;

    if (req.user.role === 'customer') {
      orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });
    } else {
      const allOrders = await Order.find().sort({ createdAt: -1 });
      orders = allOrders.filter(order =>
        order.products.some(p => p.farmerId?.toString() === userId)
      );
    }

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error retrieving orders' });
  }
};

exports.getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const allOrders = await Order.find().sort({ createdAt: -1 });

    const orders = allOrders
      .filter(order => order.products.some(p => p.farmerId?.toString() === farmerId))
      .map(order => {
        const farmerItems = order.products.filter(p => p.farmerId?.toString() === farmerId);
        return {
          ...order.toObject(),
          farmerItems,
          customerItemsCount: farmerItems.reduce((sum, i) => sum + (i.count || 1), 0),
          farmerTotal: farmerItems.reduce((sum, i) => sum + (i.price || 0) * (i.count || 1), 0)
        };
      });

    res.json(orders);
  } catch (err) {
    console.error('Get farmer orders error:', err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Get single order error:', err);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const singleOrder = await Order.findById(id);

    if (!singleOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(singleOrder);
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ message: 'Server error tracking order' });
  }
};

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
