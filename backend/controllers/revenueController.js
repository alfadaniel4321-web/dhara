const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getFarmerRevenue = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const allOrders = await Order.find();
    const farmerOrders = allOrders.filter(order =>
      order.products.some(p => p.farmerId?.toString() === farmerId)
    );
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let totalEarnings = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    let pendingPayouts = 0;

    const revenueByMonth = {};
    const productSales = {};

    for (const order of farmerOrders) {
      const farmerItems = order.products.filter(p => p.farmerId?.toString() === farmerId);
      for (const item of farmerItems) {
        const itemTotal = (item.price || 0) * (item.count || 1);
        if (order.orderStatus === 'Delivered' || order.paymentStatus === 'Paid') {
          totalEarnings += itemTotal;
          if (new Date(order.createdAt) >= weekAgo) weeklyRevenue += itemTotal;
          if (new Date(order.createdAt) >= monthAgo) monthlyRevenue += itemTotal;

          const monthKey = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
          revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + itemTotal;

          const productKey = item.title || item.productId;
          productSales[productKey] = (productSales[productKey] || 0) + (item.count || 1);
        }
        if (order.paymentStatus === 'Pending') {
          pendingPayouts += itemTotal;
        }
      }
    }

    const monthlyRevenueData = Object.entries(revenueByMonth)
      .map(([month, amount]) => ({ month, amount: Math.round(amount) }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });

    const topProducts = Object.entries(productSales)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);

    res.json({
      totalEarnings: Math.round(totalEarnings),
      weeklyRevenue: Math.round(weeklyRevenue),
      monthlyRevenue: Math.round(monthlyRevenue),
      pendingPayouts: Math.round(pendingPayouts),
      monthlyRevenueData,
      topProducts,
      totalOrders: farmerOrders.length,
      deliveredOrders: farmerOrders.filter(o => o.orderStatus === 'Delivered').length
    });
  } catch (err) {
    console.error('Revenue error:', err);
    res.status(500).json({ message: 'Server error fetching revenue' });
  }
};
