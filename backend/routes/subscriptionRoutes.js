const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, subscriptionController.createSubscription);
router.get('/', authMiddleware, subscriptionController.getSubscriptions);
router.put('/:id/status', authMiddleware, subscriptionController.updateSubscriptionStatus);

module.exports = router;
