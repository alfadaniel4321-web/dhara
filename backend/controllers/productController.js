const Product = require('../models/Product');
const User = require('../models/User');

exports.createProduct = async (req, res) => {
  try {
    const { title, image, category, quantity, harvestDate, availableTime, nutrition, protein, freshnessScore, price, stock, description } = req.body;
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

    if (!title || !category || !price) {
      return res.status(400).json({ message: 'Title, category, and price are required' });
    }

    const newProduct = await Product.create({
      title,
      image: image || '',
      category,
      price: Number(price),
      quantity: quantity || '',
      stock: stock !== undefined ? Number(stock) : 0,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      availableTime: availableTime || '',
      nutrition: nutrition || '',
      protein: protein || '',
      freshnessScore: freshnessScore !== undefined ? Number(freshnessScore) : 0,
      description: description || '',
      farmerId
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    const blockedFarmers = new Set();
    const farmerIds = [...new Set(products.map(p => p.farmerId).filter(Boolean))];
    for (const fId of farmerIds) {
      const farmer = await User.findById(fId);
      if (farmer && farmer.blocked) {
        blockedFarmers.add(fId);
      }
    }

    const activeProducts = products.filter(p => p.farmerId && !blockedFarmers.has(p.farmerId));

    res.json(activeProducts);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const farmer = await User.findById(product.farmerId);
    if (farmer && farmer.blocked) {
      return res.status(403).json({ message: 'Product from blocked farmer' });
    }

    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role !== 'farmer' || product.farmerId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const allowedFields = ['title', 'image', 'category', 'price', 'quantity', 'stock', 'harvestDate', 'availableTime', 'nutrition', 'protein', 'freshnessScore', 'description'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'price' || field === 'stock' || field === 'freshnessScore' ? Number(req.body[field]) : field === 'harvestDate' ? new Date(req.body[field]) : req.body[field];
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role !== 'farmer' || product.farmerId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.params.farmerId });
    res.json(products);
  } catch (err) {
    console.error('Get farmer products error:', err);
    res.status(500).json({ message: 'Server error fetching farmer products' });
  }
};

exports.getNearbyProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const blockedFarmers = new Set();
    const farmerIds = [...new Set(products.map(p => p.farmerId).filter(Boolean))];
    for (const fId of farmerIds) {
      const farmer = await User.findById(fId);
      if (farmer && farmer.blocked) {
        blockedFarmers.add(fId);
      }
    }

    const activeProducts = products.filter(p => p.farmerId && !blockedFarmers.has(p.farmerId));

    const locations = [
      'Alappuzha Hyperlocal Zone',
      'Kottayam Farm Belt',
      'Kochi Organic Hub',
      'Thrissur Greenlands',
      'Wayanad High-range Coop',
      'Muvattupuzha Fields'
    ];

    const nearbyProducts = activeProducts.map(p => {
      const seed = (p.title.length + (p.id || p._id || '').charCodeAt(0)) % 10;
      const distance = parseFloat((1.2 + seed * 1.3).toFixed(1));
      const location = locations[seed % locations.length];

      return {
        ...p,
        distance,
        location
      };
    }).sort((a, b) => a.distance - b.distance);

    res.json(nearbyProducts);
  } catch (err) {
    console.error('Get nearby products error:', err);
    res.status(500).json({ message: 'Server error fetching nearby products' });
  }
};
