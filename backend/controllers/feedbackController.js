const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Create feedback and update farmer rating/blocking status
exports.createFeedback = async (req, res) => {
  try {
    const { farmerId, rating, review } = req.body;
    const customerId = req.user.userId;

    if (!farmerId || rating === undefined || !review) {
      return res.status(400).json({ message: 'Farmer ID, rating, and review are required' });
    }

    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (farmer.blocked) {
      return res.status(400).json({ message: 'Farmer is already blocked' });
    }

    // Determine if feedback is negative: rating <= 2 is treated as negative
    const negative = Number(rating) <= 2;

    // Create feedback
    const feedback = await Feedback.create({
      customerId,
      farmerId,
      rating: Number(rating),
      review,
      negative
    });

    // Update farmer's stats:
    // 1. If negative, increment negative counter.
    // 2. Recalculate average rating.
    const feedbacks = await Feedback.find({ farmerId });
    const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = parseFloat((sum / feedbacks.length).toFixed(1));

    // Prepare update parameters
    const updateData = {
      rating: averageRating
    };

    if (negative) {
      // Increment negative feedbacks
      const updatedFarmer = await User.findByIdAndUpdate(farmerId, {
        $inc: { negativeFeedbacksCount: 1 },
        rating: averageRating
      }, { new: true });

      // Auto-block if negative reviews >= 3
      if (updatedFarmer.negativeFeedbacksCount >= 3) {
        await User.findByIdAndUpdate(farmerId, { blocked: true });
        console.log(`❌ Farmer ${farmer.name} has been BLOCKED due to ${updatedFarmer.negativeFeedbacksCount} negative feedbacks.`);
      }
    } else {
      // Just update average rating
      await User.findByIdAndUpdate(farmerId, { rating: averageRating });
    }

    res.status(201).json(feedback);
  } catch (err) {
    console.error('Create feedback error:', err);
    res.status(500).json({ message: 'Server error saving feedback' });
  }
};

// Get all feedbacks for a farmer
exports.getFarmerFeedbacks = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const feedbacks = await Feedback.find({ farmerId });
    res.json(feedbacks);
  } catch (err) {
    console.error('Get farmer feedbacks error:', err);
    res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
};
