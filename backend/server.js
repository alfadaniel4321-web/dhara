require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const preOrderRoutes = require('./routes/preOrderRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const rewriteImages = (val) => {
      if (val && typeof val.toObject === 'function') val = val.toObject();
      if (val && typeof val.toJSON === 'function') val = val.toJSON();
      if (!val || typeof val !== 'object') return val;
      if (Array.isArray(val)) return val.map(rewriteImages);
      for (const key of Object.keys(val)) {
        if (typeof val[key] === 'string' && (key === 'image' || key === 'images') && /^https?:\/\//i.test(val[key])) {
          val[key] = `/api/images/proxy?url=${encodeURIComponent(val[key])}`;
        } else if (typeof val[key] === 'object') {
          val[key] = rewriteImages(val[key]);
        }
      }
      return val;
    };
    return originalJson(rewriteImages(body));
  };
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/preorders', preOrderRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/api/images/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');
  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).send('Failed to fetch image');
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (err) {
    res.status(500).send('Image proxy error');
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'running', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
