const Product = require('../models/Product');
const User = require('../models/User');

// Create Product (Farmer only)
exports.createProduct = async (req, res) => {
  try {
    const { title, image, category, quantity, harvestDate, availableTime, nutrition, protein, freshnessScore } = req.body;
    const farmerId = req.user.userId;

    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers are allowed to upload products' });
    }

    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer account not found' });
    }

    if (farmer.blocked) {
      return res.status(403).json({ message: 'Your account has been blocked and you cannot upload products.' });
    }

    if (!title || !image || !category || !quantity || !harvestDate || !availableTime || !nutrition || !protein || !freshnessScore) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    const newProduct = await Product.create({
      title,
      image,
      category,
      quantity,
      harvestDate: new Date(harvestDate),
      availableTime,
      nutrition,
      protein,
      freshnessScore: Number(freshnessScore),
      farmerId
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Get All Products (optional filter by category)
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    
    // Filter out products from blocked farmers
    const activeProducts = products.filter(p => p.farmerId && !p.farmerId.blocked);

    res.json(activeProducts);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// Get Nearby Products listing (hyperlocal simulator)
exports.getNearbyProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // Filter out blocked farmers
    const activeProducts = products.filter(p => p.farmerId && !p.farmerId.blocked);

    // Hyperlocal simulation: attach random location details & distance (1.2km to 12km) and sort
    const locations = [
      'Alappuzha Hyperlocal Zone',
      'Kottayam Farm Belt',
      'Kochi Organic Hub',
      'Thrissur Greenlands',
      'Wayanad High-range Coop',
      'Muvattupuzha Fields'
    ];

    const nearbyProducts = activeProducts.map(p => {
      // Create stable pseudo-random distance based on product title length and id
      const seed = (p.title.length + (p.id || p._id || '').charCodeAt(0)) % 10;
      const distance = parseFloat((1.2 + seed * 1.3).toFixed(1)); // 1.2km to 12.9km
      const location = locations[seed % locations.length];

      return {
        ...p,
        distance, // in km
        location
      };
    }).sort((a, b) => a.distance - b.distance); // sort by proximity

    res.json(nearbyProducts);
  } catch (err) {
    console.error('Get nearby products error:', err);
    res.status(500).json({ message: 'Server error fetching nearby products' });
  }
};
