const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/banners/active', publicController.getActiveBanners);
router.get('/coupons/active', publicController.getActiveCoupons);
router.post('/coupons/validate', publicController.validateCoupon);

module.exports = router;
