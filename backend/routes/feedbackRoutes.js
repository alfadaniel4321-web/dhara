const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, feedbackController.createFeedback);
router.get('/farmer/:farmerId', feedbackController.getFarmerFeedbacks);
router.post('/reply/:id', authMiddleware, feedbackController.replyToFeedback);

module.exports = router;
