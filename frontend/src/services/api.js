const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('dhara_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const initLocalStorageMock = () => {
  if (!localStorage.getItem('mock_initialized_v2')) {
    const mockUsers = [
      {
        id: 'farmer1',
        _id: 'farmer1',
        name: 'Madhavan Nair (Wayanad Organic Farm)',
        email: 'farmer@dhara.com',
        password: 'password123',
        role: 'farmer',
        phone: '+91 94471 23456',
        address: 'Wayanad, Kerala',
        rating: 4.8,
        blocked: false,
        negativeFeedbacksCount: 0
      },
      {
        id: 'farmer2',
        _id: 'farmer2',
        name: 'Devika Rajan (Kuttanad Backwater Crops)',
        email: 'devika@dhara.com',
        password: 'password123',
        role: 'farmer',
        phone: '+91 94476 54321',
        address: 'Alappuzha, Kerala',
        rating: 4.9,
        blocked: false,
        negativeFeedbacksCount: 0
      },
      {
        id: 'customer1',
        _id: 'customer1',
        name: 'Albin Joseph',
        email: 'customer@dhara.com',
        password: 'password123',
        role: 'customer',
        phone: '+91 98451 12233',
        address: 'Kochi, Kerala',
        rating: 5.0,
        blocked: false,
        negativeFeedbacksCount: 0
      }
    ];

    const mockProducts = [
      {
        id: 'prod1',
        _id: 'prod1',
        title: 'Fresh A2 Malabar Cow Milk',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
        category: 'Milk',
        price: 65,
        quantity: '1 Litre',
        stock: 120,
        harvestDate: new Date().toISOString(),
        availableTime: '06:00 AM - 10:00 AM',
        nutrition: 'Energy: 64 kcal, Calcium: 120mg',
        protein: '3.3g',
        freshnessScore: 98,
        farmerId: { id: 'farmer1', _id: 'farmer1', name: 'Madhavan Nair (Wayanad Organic Farm)', rating: 4.8, blocked: false }
      },
      {
        id: 'prod2',
        _id: 'prod2',
        title: 'Kuttanad Duck Eggs (Tharavu Mutta)',
        image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=400',
        category: 'Eggs',
        price: 120,
        quantity: '12 Nos',
        stock: 45,
        harvestDate: new Date().toISOString(),
        availableTime: '07:00 AM - 11:00 AM',
        nutrition: 'Energy: 185 kcal, Iron: 3.8mg',
        protein: '12.8g',
        freshnessScore: 96,
        farmerId: { id: 'farmer2', _id: 'farmer2', name: 'Devika Rajan (Kuttanad Backwater Crops)', rating: 4.9, blocked: false }
      },
      {
        id: 'prod3',
        _id: 'prod3',
        title: 'Organic Nendran Bananas',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400',
        category: 'Vegetables',
        price: 80,
        quantity: '1 kg',
        stock: 200,
        harvestDate: new Date().toISOString(),
        availableTime: '08:00 AM - 02:00 PM',
        nutrition: 'Energy: 89 kcal, Potassium: 358mg',
        protein: '1.1g',
        freshnessScore: 97,
        farmerId: { id: 'farmer1', _id: 'farmer1', name: 'Madhavan Nair (Wayanad Organic Farm)', rating: 4.8, blocked: false }
      },
      {
        id: 'prod4',
        _id: 'prod4',
        title: 'Fresh Farm Tapioca (Kappa)',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400',
        category: 'Vegetables',
        price: 50,
        quantity: '2 kg',
        stock: 150,
        harvestDate: new Date().toISOString(),
        availableTime: '07:00 AM - 01:00 PM',
        nutrition: 'Energy: 160 kcal, Carbs: 38g',
        protein: '1.4g',
        freshnessScore: 95,
        farmerId: { id: 'farmer1', _id: 'farmer1', name: 'Madhavan Nair (Wayanad Organic Farm)', rating: 4.8, blocked: false }
      }
    ];

    localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    localStorage.setItem('mock_products', JSON.stringify(mockProducts));
    localStorage.setItem('mock_carts', JSON.stringify({}));
    localStorage.setItem('mock_orders', JSON.stringify([]));
    localStorage.setItem('mock_feedback', JSON.stringify([]));
    localStorage.setItem('mock_wishlist', JSON.stringify({}));
    localStorage.setItem('mock_initialized_v2', 'true');
  }
};

initLocalStorageMock();

const fetchFromMock = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveToMock = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`Backend request to ${url} failed, fallback to local storage simulation. Error: ${error.message}`);
    throw error;
  }
};

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      try {
        const data = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        localStorage.setItem('dhara_token', data.token);
        localStorage.setItem('dhara_user', JSON.stringify(data.user));
        return data;
      } catch (err) {
        const users = fetchFromMock('mock_users');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid credentials');
        if (user.blocked) throw new Error('Your account has been blocked due to multiple negative reviews');
        
        const mockToken = `mock_token_${user.id || user._id}_${Date.now()}`;
        localStorage.setItem('dhara_token', mockToken);
        localStorage.setItem('dhara_user', JSON.stringify(user));
        return { token: mockToken, user };
      }
    },

    signup: async (name, email, password, role, phone, address = '') => {
      try {
        const data = await request('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, role, phone, address })
        });
        localStorage.setItem('dhara_token', data.token);
        localStorage.setItem('dhara_user', JSON.stringify(data.user));
        return data;
      } catch (err) {
        const users = fetchFromMock('mock_users');
        if (users.some(u => u.email === email)) throw new Error('User already exists');
        
        const newUser = {
          id: `user_${Date.now()}`,
          _id: `user_${Date.now()}`,
          name,
          email,
          password,
          role,
          phone,
          address,
          rating: 5.0,
          blocked: false,
          negativeFeedbacksCount: 0
        };
        users.push(newUser);
        saveToMock('mock_users', users);

        const mockToken = `mock_token_${newUser.id}_${Date.now()}`;
        localStorage.setItem('dhara_token', mockToken);
        localStorage.setItem('dhara_user', JSON.stringify(newUser));
        return { token: mockToken, user: newUser };
      }
    },

    getMe: async () => {
      try {
        return await request('/auth/me');
      } catch (err) {
        const userStr = localStorage.getItem('dhara_user');
        if (userStr) return JSON.parse(userStr);
        throw new Error('Not authenticated');
      }
    },

    logout: () => {
      localStorage.removeItem('dhara_token');
      localStorage.removeItem('dhara_user');
    }
  },

  // Products
  products: {
    getProducts: async (category) => {
      try {
        const url = category ? `/products?category=${category}` : '/products';
        return await request(url);
      } catch (err) {
        let products = fetchFromMock('mock_products');
        const users = fetchFromMock('mock_users');
        
        products = products.filter(p => {
          const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
          const farmer = users.find(u => u.id === fId || u._id === fId);
          return farmer && !farmer.blocked;
        });

        if (category && category !== 'All') {
          products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        return products;
      }
    },

    createProduct: async (productData) => {
      try {
        return await request('/products', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
      } catch (err) {
        const products = fetchFromMock('mock_products');
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        
        const newProduct = {
          id: `prod_${Date.now()}`,
          _id: `prod_${Date.now()}`,
          ...productData,
          harvestDate: new Date().toISOString(),
          farmerId: {
            id: user.id || user._id,
            _id: user.id || user._id,
            name: user.name,
            rating: user.rating || 5.0,
            blocked: false
          }
        };
        products.push(newProduct);
        saveToMock('mock_products', products);
        return newProduct;
      }
    },

    updateProductStock: async (id, stock) => {
      try {
        // Simulated endpoint update
        return await request(`/products/${id}/stock`, {
          method: 'PUT',
          body: JSON.stringify({ stock })
        });
      } catch (err) {
        const products = fetchFromMock('mock_products');
        const idx = products.findIndex(p => p.id === id || p._id === id);
        if (idx !== -1) {
          products[idx].stock = Number(stock);
          saveToMock('mock_products', products);
          return products[idx];
        }
        throw new Error('Product not found');
      }
    },

    deleteProduct: async (id) => {
      try {
        return await request(`/products/${id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        const products = fetchFromMock('mock_products');
        const filtered = products.filter(p => p.id !== id && p._id !== id);
        saveToMock('mock_products', filtered);
        return { success: true };
      }
    }
  },

  // Cart
  cart: {
    getCart: async () => {
      try {
        return await request('/cart');
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const carts = JSON.parse(localStorage.getItem('mock_carts') || '{}');
        const cart = carts[user.id || user._id] || { userId: user.id || user._id, products: [], totalPrice: 0 };
        
        // Populating product references in mock
        const productsList = fetchFromMock('mock_products');
        const populatedProducts = cart.products.map(p => {
          const product = productsList.find(pr => pr.id === p.productId || pr._id === p.productId);
          return { productId: product || null, count: p.count };
        }).filter(item => item.productId !== null);

        // Recalculate price
        const totalPrice = populatedProducts.reduce((sum, item) => sum + (item.productId.price || 0) * item.count, 0);

        return { ...cart, products: populatedProducts, totalPrice };
      }
    },

    addToCart: async (productId, count = 1) => {
      try {
        return await request('/cart/add', {
          method: 'POST',
          body: JSON.stringify({ productId, count })
        });
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const carts = JSON.parse(localStorage.getItem('mock_carts') || '{}');
        const cart = carts[user.id || user._id] || { userId: user.id || user._id, products: [], totalPrice: 0 };

        const existingItem = cart.products.find(p => p.productId === productId);
        if (existingItem) {
          existingItem.count += Number(count);
        } else {
          cart.products.push({ productId, count: Number(count) });
        }

        carts[user.id || user._id] = cart;
        localStorage.setItem('mock_carts', JSON.stringify(carts));
        
        return api.cart.getCart();
      }
    },

    updateQuantity: async (productId, count) => {
      try {
        return await request('/cart/update', {
          method: 'PUT',
          body: JSON.stringify({ productId, count })
        });
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const carts = JSON.parse(localStorage.getItem('mock_carts') || '{}');
        const cart = carts[user.id || user._id] || { userId: user.id || user._id, products: [], totalPrice: 0 };

        const itemIdx = cart.products.findIndex(p => p.productId === productId);
        if (itemIdx !== -1) {
          if (count <= 0) {
            cart.products.splice(itemIdx, 1);
          } else {
            cart.products[itemIdx].count = Number(count);
          }
        }

        carts[user.id || user._id] = cart;
        localStorage.setItem('mock_carts', JSON.stringify(carts));
        
        return api.cart.getCart();
      }
    },

    removeFromCart: async (productId) => {
      try {
        return await request('/cart/remove', {
          method: 'POST',
          body: JSON.stringify({ productId })
        });
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const carts = JSON.parse(localStorage.getItem('mock_carts') || '{}');
        const cart = carts[user.id || user._id] || { userId: user.id || user._id, products: [], totalPrice: 0 };

        cart.products = cart.products.filter(p => p.productId !== productId);
        
        carts[user.id || user._id] = cart;
        localStorage.setItem('mock_carts', JSON.stringify(carts));
        
        return api.cart.getCart();
      }
    },

    clearCart: async () => {
      try {
        return await request('/cart/clear', {
          method: 'POST'
        });
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const carts = JSON.parse(localStorage.getItem('mock_carts') || '{}');
        carts[user.id || user._id] = { userId: user.id || user._id, products: [], totalPrice: 0 };
        localStorage.setItem('mock_carts', JSON.stringify(carts));
        return { products: [], totalPrice: 0 };
      }
    }
  },

  // Wishlist
  wishlist: {
    getWishlist: async () => {
      const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
      const wishlists = JSON.parse(localStorage.getItem('mock_wishlist') || '{}');
      const productIds = wishlists[user.id || user._id] || [];
      
      const allProds = fetchFromMock('mock_products');
      return allProds.filter(p => productIds.includes(p.id || p._id));
    },

    toggleWishlist: async (productId) => {
      const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
      const wishlists = JSON.parse(localStorage.getItem('mock_wishlist') || '{}');
      let productIds = wishlists[user.id || user._id] || [];

      if (productIds.includes(productId)) {
        productIds = productIds.filter(id => id !== productId);
      } else {
        productIds.push(productId);
      }

      wishlists[user.id || user._id] = productIds;
      localStorage.setItem('mock_wishlist', JSON.stringify(wishlists));
      return api.wishlist.getWishlist();
    }
  },

  // Orders
  orders: {
    createOrder: async (orderData) => {
      try {
        return await request('/orders', {
          method: 'POST',
          body: JSON.stringify(orderData)
        });
      } catch (err) {
        const orders = fetchFromMock('mock_orders');
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        
        // Decrement simulated stock
        const products = fetchFromMock('mock_products');
        orderData.products.forEach(item => {
          const prodIdx = products.findIndex(p => p.id === item.productId || p._id === item.productId);
          if (prodIdx !== -1) {
            products[prodIdx].stock = Math.max(0, products[prodIdx].stock - item.count);
          }
        });
        saveToMock('mock_products', products);

        const newOrder = {
          id: `ord_${Date.now()}`,
          _id: `ord_${Date.now()}`,
          customerId: user.id || user._id,
          products: orderData.products,
          totalPrice: orderData.totalPrice,
          deliveryTime: orderData.deliveryTime,
          paymentStatus: orderData.paymentStatus || 'Pending',
          orderStatus: 'Pending',
          subscriptionType: orderData.subscriptionType || 'One-time',
          createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        saveToMock('mock_orders', orders);

        // Clear cart mock
        await api.cart.clearCart();

        return newOrder;
      }
    },

    getOrders: async () => {
      try {
        return await request('/orders/history');
      } catch (err) {
        const orders = fetchFromMock('mock_orders');
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        
        if (user.role === 'customer') {
          return orders.filter(o => o.customerId === user.id || o.customerId === user._id);
        } else {
          return orders.filter(order => 
            order.products.some(p => p.farmerId === user.id || p.farmerId === user._id)
          );
        }
      }
    },

    trackOrder: async (id) => {
      try {
        return await request(`/orders/${id}/track`);
      } catch (err) {
        const orders = fetchFromMock('mock_orders');
        const order = orders.find(o => o.id === id || o._id === id);
        if (!order) throw new Error('Order not found');
        return order;
      }
    },

    updateOrderStatus: async (id, statusData) => {
      try {
        return await request(`/orders/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify(statusData)
        });
      } catch (err) {
        const orders = fetchFromMock('mock_orders');
        const idx = orders.findIndex(o => o.id === id || o._id === id);
        if (idx !== -1) {
          orders[idx] = {
            ...orders[idx],
            ...statusData,
            updatedAt: new Date().toISOString()
          };
          saveToMock('mock_orders', orders);
          return orders[idx];
        }
        throw new Error('Order not found');
      }
    }
  },

  // Payment Sim
  payment: {
    createPaymentOrder: async (amount, currency = 'INR') => {
      try {
        return await request('/payment/create-order', {
          method: 'POST',
          body: JSON.stringify({ amount, currency })
        });
      } catch (err) {
        return {
          id: `rzp_order_${Math.random().toString(36).substring(2, 9)}`,
          amount: amount * 100,
          currency,
          receipt: `receipt_${Date.now()}`,
          status: 'created'
        };
      }
    },

    verifyPayment: async (paymentData) => {
      try {
        return await request('/payment/verify', {
          method: 'POST',
          body: JSON.stringify(paymentData)
        });
      } catch (err) {
        return {
          success: true,
          message: 'Payment verified (mock)',
          invoice: {
            invoiceId: `INV-${Date.now()}`,
            transactionId: paymentData.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 9)}`,
            date: new Date().toISOString(),
            paymentStatus: 'Paid',
            billingCycle: 'Immediate'
          }
        };
      }
    }
  },

  // Feedback
  feedback: {
    createFeedback: async (feedbackData) => {
      try {
        return await request('/feedback', {
          method: 'POST',
          body: JSON.stringify(feedbackData)
        });
      } catch (err) {
        const feedbacks = fetchFromMock('mock_feedback');
        const users = fetchFromMock('mock_users');
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');

        const negative = Number(feedbackData.rating) <= 2;
        const newFeedback = {
          id: `fb_${Date.now()}`,
          _id: `fb_${Date.now()}`,
          customerId: { _id: user.id || user._id, name: user.name },
          farmerId: feedbackData.farmerId,
          rating: Number(feedbackData.rating),
          review: feedbackData.review,
          negative,
          createdAt: new Date().toISOString()
        };

        feedbacks.push(newFeedback);
        saveToMock('mock_feedback', feedbacks);

        // Update farmer rating
        const farmerIdx = users.findIndex(u => u.id === feedbackData.farmerId || u._id === feedbackData.farmerId);
        if (farmerIdx !== -1) {
          const farmerFeedbacks = feedbacks.filter(f => {
            const fId = f.farmerId?._id || f.farmerId?.id || f.farmerId;
            return fId === feedbackData.farmerId;
          });
          const sum = farmerFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
          const avgRating = parseFloat((sum / farmerFeedbacks.length).toFixed(1));
          
          users[farmerIdx].rating = avgRating;
          if (negative) {
            users[farmerIdx].negativeFeedbacksCount = (users[farmerIdx].negativeFeedbacksCount || 0) + 1;
            if (users[farmerIdx].negativeFeedbacksCount >= 3) {
              users[farmerIdx].blocked = true;
            }
          }
          saveToMock('mock_users', users);
        }

        return newFeedback;
      }
    },

    getFarmerFeedbacks: async (farmerId) => {
      try {
        return await request(`/feedback/farmer/${farmerId}`);
      } catch (err) {
        const feedbacks = fetchFromMock('mock_feedback');
        return feedbacks.filter(f => {
          const fId = f.farmerId?._id || f.farmerId?.id || f.farmerId;
          return fId === farmerId;
        });
      }
    }
  }
};
