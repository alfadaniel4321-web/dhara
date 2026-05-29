const express = require('express');
const router = express.Router();
const { getFarmerRevenue } = require('../controllers/revenueController');
const authMiddleware = require('../middleware/auth');

router.get('/farmer/me', authMiddleware, getFarmerRevenue);

module.exports = router;
