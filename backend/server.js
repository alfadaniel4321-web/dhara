require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const preOrderRoutes = require('./routes/preOrderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/preorders', preOrderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'running', timestamp: new Date().toISOString() });
});

// Run server and seed data
const startServer = async () => {
  // Connect database (falls back to local JSON if MongoDB is not running)
  await connectDB();
  
  // Seed initial dummy users and products for a seamless demo experience
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const users = await User.find();
    if (users.length === 0) {
      console.log('🌱 Seeding initial demo data...');
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash('password123', salt);

      const farmer1 = await User.create({
        name: 'Madhavan Nair (Wayanad Organic Farm)',
        email: 'farmer@dhara.com',
        password: hashPassword,
        role: 'farmer',
        phone: '+91 94471 23456',
        rating: 4.8,
        blocked: false,
        negativeFeedbacksCount: 0
      });

      const farmer2 = await User.create({
        name: 'Devika Rajan (Kuttanad Backwater Crops)',
        email: 'devika@dhara.com',
        password: hashPassword,
        role: 'farmer',
        phone: '+91 94476 54321',
        rating: 4.9,
        blocked: false,
        negativeFeedbacksCount: 0
      });

      const customer = await User.create({
        name: 'Albin Joseph',
        email: 'customer@dhara.com',
        password: hashPassword,
        role: 'customer',
        phone: '+91 98451 12233',
        rating: 5.0,
        blocked: false,
        negativeFeedbacksCount: 0
      });

      // Products are created dynamically by farmers — no seed products

      console.log('🌱 Demo data seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
