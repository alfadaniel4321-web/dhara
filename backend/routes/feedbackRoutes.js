const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, feedbackController.createFeedback);
router.get('/farmer/:farmerId', feedbackController.getFarmerFeedbacks);

module.exports = router;
