const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/nearby', productController.getNearbyProducts);

module.exports = router;
