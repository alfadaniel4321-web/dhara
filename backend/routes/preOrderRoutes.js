const express = require('express');
const router = express.Router();
const preOrderController = require('../controllers/preOrderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, preOrderController.createPreOrder);
router.get('/customer', authMiddleware, preOrderController.getCustomerPreOrders);
router.get('/farmer', authMiddleware, preOrderController.getFarmerPreOrders);
router.get('/notifications', authMiddleware, preOrderController.getNotifications);
router.put('/notifications/read', authMiddleware, preOrderController.markNotificationsRead);

module.exports = router;
