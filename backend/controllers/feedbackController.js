const Feedback = require('../models/Feedback');
const Farmer = require('../models/Farmer');

exports.createFeedback = async (req, res) => {
  try {
    const { farmerId, productId, rating, review } = req.body;
    const customerId = req.user.userId;

    if (!farmerId || rating === undefined || !review) {
      return res.status(400).json({ message: 'Farmer ID, rating, and review are required' });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (farmer.blocked) {
      return res.status(400).json({ message: 'Farmer is already blocked' });
    }

    const negative = Number(rating) <= 2;

    const feedback = await Feedback.create({
      customerId,
      farmerId,
      productId: productId || undefined,
      rating: Number(rating),
      review,
      negative
    });

    const feedbacks = await Feedback.find({ farmerId });
    const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = parseFloat((sum / feedbacks.length).toFixed(1));

    if (negative) {
      const updatedFarmer = await Farmer.findByIdAndUpdate(farmerId, {
        $inc: { negativeFeedbacksCount: 1 },
        rating: averageRating
      }, { new: true });

      if (updatedFarmer.negativeFeedbacksCount >= 3) {
        await Farmer.findByIdAndUpdate(farmerId, { blocked: true });
      }
    } else {
      await Farmer.findByIdAndUpdate(farmerId, { rating: averageRating });
    }

    res.status(201).json(feedback);
  } catch (err) {
    console.error('Create feedback error:', err);
    res.status(500).json({ message: 'Server error saving feedback' });
  }
};

exports.getFarmerFeedbacks = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const feedbacks = await Feedback.find({ farmerId })
      .populate('customerId', 'name email')
      .populate('productId', 'title image')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error('Get farmer feedbacks error:', err);
    res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
};

exports.replyToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const farmerId = req.user.userId;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.farmerId.toString() !== farmerId) {
      return res.status(403).json({ message: 'You can only reply to your own feedback' });
    }

    feedback.reply = reply.trim();
    feedback.replyAt = new Date();
    await feedback.save();

    res.json(feedback);
  } catch (err) {
    console.error('Reply to feedback error:', err);
    res.status(500).json({ message: 'Server error replying to feedback' });
  }
};
