require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Banner = require('./models/Banner');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Farmer.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);

    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const customer = await User.create({
      name: 'Albin Joseph',
      email: 'customer@dhara.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+91 98451 12233',
      address: 'Kochi, Kerala',
    });

    const farmer1 = await Farmer.create({
      name: 'Madhavan Nair',
      email: 'farmer@dhara.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 94471 23456',
      address: 'Wayanad, Kerala',
      rating: 4.8,
    });

    const farmer2 = await Farmer.create({
      name: 'Devika Rajan',
      email: 'devika@dhara.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 94476 54321',
      address: 'Alappuzha, Kerala',
      rating: 4.9,
    });

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@dhara.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 9999999999',
    });

    const products = await Product.insertMany([
      {
        title: 'Organic Bananas',
        price: 50,
        quantity: '1 kg',
        category: 'Fruits',
        description: 'Fresh organic bananas from Wayanad',
        image: '',
        stock: 99,
        farmerId: farmer1._id,
        harvestDate: new Date(),
      },
      {
        title: 'Free-Range Eggs',
        price: 80,
        quantity: '12 nos',
        category: 'Milk & Eggs',
        description: 'Farm fresh free-range eggs',
        image: '',
        stock: 100,
        farmerId: farmer1._id,
        harvestDate: new Date(),
        offerDetails: 'Buy any 2 dairy items, get 1 free!',
      },
      {
        title: 'Fresh Coconut',
        price: 75,
        quantity: '1 kg',
        category: 'Fruits',
        description: 'Fresh tender coconuts from Kerala',
        image: '',
        stock: 100,
        farmerId: farmer2._id,
        harvestDate: new Date(),
        offerDetails: 'Combo offer: Buy 2 kg & get 5% off!',
      },
      {
        title: 'Farm Fresh Tomatoes',
        price: 40,
        quantity: '500 g',
        category: 'Vegetables',
        description: 'Juicy red tomatoes from local farms',
        image: '',
        stock: 80,
        farmerId: farmer1._id,
        harvestDate: new Date(),
      },
      {
        title: 'Organic Spinach',
        price: 30,
        quantity: '250 g',
        category: 'Vegetables',
        description: 'Fresh green spinach packed with iron',
        image: '',
        stock: 50,
        farmerId: farmer2._id,
        harvestDate: new Date(),
      },
    ]);

    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 100,
        maxDiscount: 100,
        usageLimit: 100,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date('2027-12-31'),
        active: true,
        description: '10% off on your first order (max ₹100)',
      },
      {
        code: 'FLAT50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 200,
        usageLimit: 50,
        usedCount: 5,
        validFrom: new Date(),
        validUntil: new Date('2027-12-31'),
        active: true,
        description: '₹50 flat off on orders above ₹200',
      },
    ]);

    const banners = await Banner.insertMany([
      {
        title: 'MEGA HARVEST SALE',
        subtitle: 'Get ready for the freshest sale! Organic products directly from nearby farms.',
        image: '',
        link: '/products',
        type: 'mega_sale',
        priority: 1,
        validFrom: new Date(),
        validUntil: new Date('2027-12-31'),
        active: true,
      },
      {
        title: 'DAIRY SPECIAL',
        subtitle: 'Fresh from the farm to your door. Pure & organic milk sourced from local farms.',
        image: '',
        link: '/products?category=Milk',
        type: 'seasonal',
        priority: 2,
        validFrom: new Date(),
        validUntil: new Date('2027-12-31'),
        active: true,
      },
    ]);

    console.log('Seed complete!');
    console.log(`  Users: ${customer.email}, ${farmer1.email}, ${farmer2.email}, ${admin.email}`);
    console.log(`  Products: ${products.length} created`);
    console.log(`  Coupons: ${coupons.length} created`);
    console.log(`  Banners: ${banners.length} created`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
