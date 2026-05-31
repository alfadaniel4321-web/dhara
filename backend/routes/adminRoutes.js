const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

router.use(authMiddleware, adminOnly);

router.get('/stats', adminController.getDashboardStats);
router.get('/farmers', adminController.getFarmers);
router.put('/farmers/:id/block', adminController.blockFarmer);
router.put('/farmers/:id/unblock', adminController.unblockFarmer);
router.put('/farmers/:id/reset-strikes', adminController.resetStrikes);
router.get('/products', adminController.getProducts);
router.delete('/products/:id', adminController.deleteProduct);
router.put('/products/:id/feature', adminController.toggleFeatureProduct);
router.put('/products/:id/offer', adminController.setOfferDetails);
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.get('/reports', adminController.getReports);
router.get('/analytics', adminController.getAnalytics);
router.post('/notifications', adminController.sendNotification);
router.get('/users', adminController.getUsers);

// Coupons
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.put('/coupons/:id/toggle', adminController.toggleCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Banners
router.get('/banners', adminController.getBanners);
router.get('/banners/active', adminController.getActiveBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.put('/banners/:id/toggle', adminController.toggleBanner);
router.delete('/banners/:id', adminController.deleteBanner);

module.exports = router;
