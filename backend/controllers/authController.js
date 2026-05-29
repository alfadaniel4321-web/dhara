const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Farmer = require('../models/Farmer');

const JWT_SECRET = process.env.JWT_SECRET || 'dhara_secret_key_kerala';

// Sign Up Handler
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['farmer', 'customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    const existingFarmer = await Farmer.findOne({ email });
    if (existingUser || existingFarmer) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (role === 'farmer') {
      newUser = await Farmer.create({
        name, email, password: hashedPassword, role, phone,
        rating: 5.0, blocked: false, negativeFeedbacksCount: 0
      });
    } else {
      newUser = await User.create({
        name, email, password: hashedPassword, role, phone
      });
    }

    const token = jwt.sign(
      { userId: newUser.id || newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const userResp = {
      id: newUser.id || newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone
    };
    if (role === 'farmer') {
      userResp.rating = newUser.rating;
      userResp.blocked = newUser.blocked;
    }
    res.status(201).json({ token, user: userResp });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login Handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user = await User.findOne({ email });
    if (!user) user = await Farmer.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.blocked) {
      return res.status(403).json({ message: 'Your account has been blocked due to multiple negative reviews' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id || user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const userResp = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    if (user.role === 'farmer') {
      userResp.rating = user.rating;
      userResp.blocked = user.blocked;
    }
    res.json({ token, user: userResp });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get all farmers
exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({ blocked: false });
    res.json(farmers.map(f => ({
      id: f.id || f._id,
      _id: f._id || f.id,
      name: f.name,
      email: f.email,
      phone: f.phone,
      rating: f.rating,
      blocked: f.blocked,
      negativeFeedbacksCount: f.negativeFeedbacksCount,
      village: f.village || '',
      district: f.district || '',
      description: f.description || ''
    })));
  } catch (err) {
    console.error('Get farmers error:', err);
    res.status(500).json({ message: 'Server error fetching farmers' });
  }
};

// Get User Profile
exports.getMe = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'farmer') {
      user = await Farmer.findById(req.user.userId);
      if (!user) user = await User.findById(req.user.userId);
    } else {
      user = await User.findById(req.user.userId);
      if (!user) user = await Farmer.findById(req.user.userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResp = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    if (user.role === 'farmer') {
      userResp.rating = user.rating;
      userResp.blocked = user.blocked;
    }
    res.json(userResp);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error getting profile' });
  }
};
