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
    const Product = require('./models/Product');
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

      await Product.create({
        title: 'Fresh A2 Malabar Cow Milk',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
        category: 'Milk',
        price: 65,
        quantity: '1 Litre',
        stock: 120,
        harvestDate: new Date(),
        availableTime: '06:00 AM - 10:00 AM',
        nutrition: 'Energy: 64 kcal, Calcium: 120mg',
        protein: '3.3g',
        freshnessScore: 98,
        farmerId: farmer1.id || farmer1._id
      });

      await Product.create({
        title: 'Kuttanad Duck Eggs (Tharavu Mutta)',
        image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=400',
        category: 'Eggs',
        price: 120,
        quantity: '12 Nos',
        stock: 45,
        harvestDate: new Date(),
        availableTime: '07:00 AM - 11:00 AM',
        nutrition: 'Energy: 185 kcal, Iron: 3.8mg',
        protein: '12.8g',
        freshnessScore: 96,
        farmerId: farmer2.id || farmer2._id
      });

      await Product.create({
        title: 'Organic Nendran Bananas',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400',
        category: 'Vegetables',
        price: 80,
        quantity: '1 kg',
        stock: 200,
        harvestDate: new Date(),
        availableTime: '08:00 AM - 02:00 PM',
        nutrition: 'Energy: 89 kcal, Potassium: 358mg',
        protein: '1.1g',
        freshnessScore: 97,
        farmerId: farmer1.id || farmer1._id
      });

      await Product.create({
        title: 'Fresh Farm Tapioca (Kappa)',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400',
        category: 'Vegetables',
        price: 50,
        quantity: '2 kg',
        stock: 150,
        harvestDate: new Date(),
        availableTime: '07:00 AM - 01:00 PM',
        nutrition: 'Energy: 160 kcal, Carbs: 38g',
        protein: '1.4g',
        freshnessScore: 95,
        farmerId: farmer1.id || farmer1._id
      });

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
