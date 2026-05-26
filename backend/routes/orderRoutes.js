const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/history', authMiddleware, orderController.getOrders);
router.get('/:id/track', authMiddleware, orderController.trackOrder);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
