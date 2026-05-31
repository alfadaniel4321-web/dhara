const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

router.get('/categories', productController.getCategories);
router.get('/trending', productController.getTrendingProducts);
router.get('/search', productController.searchProducts);
router.get('/nearby', productController.getNearbyProducts);
router.get('/farmer/:farmerId', productController.getFarmerProducts);
router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
