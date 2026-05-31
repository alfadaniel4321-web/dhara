const express = require('express');
const router = express.Router();
const siteContentController = require('../controllers/siteContentController');
const authMiddleware = require('../middleware/auth');

router.get('/', siteContentController.getAllContent);
router.get('/:key', siteContentController.getContent);
router.put('/', authMiddleware, siteContentController.upsertContent);
router.delete('/:key', authMiddleware, siteContentController.deleteContent);

module.exports = router;
