const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart items
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, products: [], totalPrice: 0 });
    }
    
    res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error retrieving cart' });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, count } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, products: [], totalPrice: 0 });
    }

    const existingIndex = cart.products.findIndex(p => {
      const pId = p.productId?._id || p.productId?.id || p.productId;
      return pId == productId;
    });

    const addCount = Number(count) || 1;

    if (existingIndex > -1) {
      cart.products[existingIndex].count += addCount;
    } else {
      cart.products.push({ productId, count: addCount });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const p of cart.products) {
      const prod = await Product.findById(p.productId?._id || p.productId?.id || p.productId);
      if (prod) {
        totalPrice += (prod.price || 0) * p.count;
      }
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    
    // Fetch populated
    const updatedCart = await Cart.findOne({ userId });
    res.json(updatedCart);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

// Update product quantity in cart
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, count } = req.body;
    const userId = req.user.userId;

    if (!productId || count === undefined) {
      return res.status(400).json({ message: 'Product ID and count are required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(p => {
      const pId = p.productId?._id || p.productId?.id || p.productId;
      return pId == productId;
    });

    if (itemIndex > -1) {
      const newCount = Number(count);
      if (newCount <= 0) {
        cart.products.splice(itemIndex, 1);
      } else {
        cart.products[itemIndex].count = newCount;
      }

      // Recalculate total price
      let totalPrice = 0;
      for (const p of cart.products) {
        const prod = await Product.findById(p.productId?._id || p.productId?.id || p.productId);
        if (prod) {
          totalPrice += (prod.price || 0) * p.count;
        }
      }
      cart.totalPrice = totalPrice;

      await cart.save();
      const updatedCart = await Cart.findOne({ userId });
      return res.json(updatedCart);
    } else {
      return res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (err) {
    console.error('Update cart quantity error:', err);
    res.status(500).json({ message: 'Server error updating quantity' });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(p => {
      const pId = p.productId?._id || p.productId?.id || p.productId;
      return pId != productId;
    });

    // Recalculate total price
    let totalPrice = 0;
    for (const p of cart.products) {
      const prod = await Product.findById(p.productId?._id || p.productId?.id || p.productId);
      if (prod) {
        totalPrice += (prod.price || 0) * p.count;
      }
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    const updatedCart = await Cart.findOne({ userId });
    res.json(updatedCart);
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error removing product' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    let cart = await Cart.findOne({ userId });
    
    if (cart) {
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    
    res.json(cart || { userId, products: [], totalPrice: 0 });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};
