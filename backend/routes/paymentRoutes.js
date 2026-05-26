const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

router.post('/create-order', authMiddleware, paymentController.createPaymentOrder);
router.post('/verify', authMiddleware, paymentController.verifyPayment);

module.exports = router;
