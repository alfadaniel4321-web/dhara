const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/history', authMiddleware, orderController.getOrders);
router.get('/my', authMiddleware, orderController.getOrders);
router.get('/farmer/me', authMiddleware, orderController.getFarmerOrders);
router.get('/:id', authMiddleware, orderController.getSingleOrder);
router.get('/:id/track', authMiddleware, orderController.trackOrder);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
