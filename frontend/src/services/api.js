const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('dhara_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const initLocalStorageMock = () => {
  // Clear any stale seed products from previous sessions
  localStorage.removeItem('mock_products');

  if (!localStorage.getItem('mock_initialized_v3')) {
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

    localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    localStorage.setItem('mock_products', JSON.stringify([]));
    localStorage.setItem('mock_carts', JSON.stringify({}));
    localStorage.setItem('mock_orders', JSON.stringify([]));
    localStorage.setItem('mock_feedback', JSON.stringify([]));
    localStorage.setItem('mock_wishlist', JSON.stringify({}));
    localStorage.setItem('mock_preorders', JSON.stringify([]));
    localStorage.setItem('mock_notifications', JSON.stringify([]));
    localStorage.setItem('mock_initialized_v3', 'true');
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
    },

    getFarmers: async () => {
      try {
        return await request('/auth/farmers');
      } catch (err) {
        const users = fetchFromMock('mock_users');
        return users.filter(u => u.role === 'farmer' && !u.blocked);
      }
    }
  },

  // Products
  products: {
    searchProducts: async (query) => {
      try {
        return await request(`/products/search?q=${encodeURIComponent(query)}`);
      } catch {
        const allProducts = await api.products.getProducts().catch(() => fetchFromMock('mock_products'));
        const q = query.toLowerCase();
        return (Array.isArray(allProducts) ? allProducts : []).filter(p => {
          const farmerName = p.farmerName || p.farmerId?.name || '';
          return (
            (p.title && p.title.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            farmerName.toLowerCase().includes(q)
          );
        }).slice(0, 8);
      }
    },

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
    },

    getProduct: async (id) => {
      try {
        return await request(`/products/${id}`);
      } catch (err) {
        const products = fetchFromMock('mock_products');
        return products.find(p => p.id === id || p._id === id) || null;
      }
    },

    updateProduct: async (id, productData) => {
      try {
        return await request(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
      } catch (err) {
        const products = fetchFromMock('mock_products');
        const idx = products.findIndex(p => p.id === id || p._id === id);
        if (idx !== -1) {
          Object.assign(products[idx], productData, { updatedAt: new Date().toISOString() });
          saveToMock('mock_products', products);
          return products[idx];
        }
        throw new Error('Product not found');
      }
    },

    getFarmerProducts: async (farmerId) => {
      try {
        return await request(`/products/farmer/${farmerId}`);
      } catch (err) {
        const products = fetchFromMock('mock_products');
        return products.filter(p => {
          const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
          return fId === farmerId;
        });
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
      return await request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    },

    getOrders: async () => {
      return await request('/orders/history');
    },

    getOrder: async (id) => {
      return await request(`/orders/${id}`);
    },

    trackOrder: async (id) => {
      return await request(`/orders/${id}/track`);
    },

    updateOrderStatus: async (id, statusData) => {
      return await request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData)
      });
    }
  },

  // Admin APIs
  admin: {
    getStats: async () => {
      return await request('/admin/stats');
    },
    getFarmers: async () => {
      return await request('/admin/farmers');
    },
    blockFarmer: async (id) => {
      return await request(`/admin/farmers/${id}/block`, { method: 'PUT' });
    },
    unblockFarmer: async (id) => {
      return await request(`/admin/farmers/${id}/unblock`, { method: 'PUT' });
    },
    resetFarmerStrikes: async (id) => {
      return await request(`/admin/farmers/${id}/reset-strikes`, { method: 'PUT' });
    },
    getProducts: async () => {
      return await request('/admin/products');
    },
    deleteProduct: async (id) => {
      return await request(`/admin/products/${id}`, { method: 'DELETE' });
    },
    getOrders: async () => {
      return await request('/admin/orders');
    },
    updateOrderStatus: async (id, data) => {
      return await request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) });
    },
    getReports: async () => {
      return await request('/admin/reports');
    },
    getAnalytics: async () => {
      return await request('/admin/analytics');
    },
    sendNotification: async (data) => {
      return await request('/admin/notifications', { method: 'POST', body: JSON.stringify(data) });
    },
    getUsers: async () => {
      return await request('/admin/users');
    },
    // Coupons
    getCoupons: async () => {
      return await request('/admin/coupons');
    },
    createCoupon: async (data) => {
      return await request('/admin/coupons', { method: 'POST', body: JSON.stringify(data) });
    },
    updateCoupon: async (id, data) => {
      return await request(`/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    toggleCoupon: async (id) => {
      return await request(`/admin/coupons/${id}/toggle`, { method: 'PUT' });
    },
    deleteCoupon: async (id) => {
      return await request(`/admin/coupons/${id}`, { method: 'DELETE' });
    },
    // Banners
    getBanners: async () => {
      return await request('/admin/banners');
    },
    getActiveBanners: async () => {
      return await request('/admin/banners/active');
    },
    createBanner: async (data) => {
      return await request('/admin/banners', { method: 'POST', body: JSON.stringify(data) });
    },
    updateBanner: async (id, data) => {
      return await request(`/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    toggleBanner: async (id) => {
      return await request(`/admin/banners/${id}/toggle`, { method: 'PUT' });
    },
    deleteBanner: async (id) => {
      return await request(`/admin/banners/${id}`, { method: 'DELETE' });
    }
  },

  // Public APIs (no auth required)
  public: {
    getActiveBanners: async () => {
      return await request('/banners/active');
    },
    getActiveCoupons: async () => {
      return await request('/coupons/active');
    },
    validateCoupon: async (data) => {
      return await request('/coupons/validate', { method: 'POST', body: JSON.stringify(data) });
    }
  },

  // Farmer-specific APIs
  farmer: {
    getStats: async () => {
      try {
        return await request('/farmer/stats');
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const products = fetchFromMock('mock_products');
        const orders = fetchFromMock('mock_orders');
        const farmerProds = products.filter(p => {
          const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
          return fId === user.id || fId === user._id;
        });
        const farmerOrders = orders.filter(o =>
          o.products?.some(p => p.farmerId === user.id || p.farmerId === user._id)
        );
        return {
          totalProducts: farmerProds.length,
          activeOrders: farmerOrders.filter(o => ['Pending', 'Processing', 'In Transit'].includes(o.orderStatus)).length,
          completedOrders: farmerOrders.filter(o => o.orderStatus === 'Delivered').length,
          totalEarnings: farmerOrders.filter(o => o.orderStatus === 'Delivered' || o.paymentStatus === 'Paid')
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
          productViews: 0,
          rating: user.rating || 5.0,
          lowStock: farmerProds.filter(p => p.stock > 0 && p.stock <= 5).length,
          outOfStock: farmerProds.filter(p => p.stock <= 0).length,
          pendingDeliveries: farmerOrders.filter(o => o.orderStatus === 'In Transit').length,
          orderStatusCounts: {
            pending: farmerOrders.filter(o => o.orderStatus === 'Pending').length,
            processing: farmerOrders.filter(o => o.orderStatus === 'Processing').length,
            shipped: farmerOrders.filter(o => o.orderStatus === 'In Transit').length,
            delivered: farmerOrders.filter(o => o.orderStatus === 'Delivered').length,
            cancelled: farmerOrders.filter(o => o.orderStatus === 'Cancelled').length
          }
        };
      }
    },

    getRevenue: async () => {
      try {
        return await request('/revenue/farmer/me');
      } catch (err) {
        return {
          totalEarnings: 0, weeklyRevenue: 0, monthlyRevenue: 0,
          pendingPayouts: 0, monthlyRevenueData: [], topProducts: [],
          totalOrders: 0, deliveredOrders: 0
        };
      }
    },

    updateProfile: async (profileData) => {
      try {
        return await request('/farmer/profile', {
          method: 'PUT',
          body: JSON.stringify(profileData)
        });
      } catch (err) {
        // For demo: just return success with the data
        return { ...profileData, message: 'Profile updated (mock)' };
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
    },

    replyToFeedback: async (feedbackId, reply) => {
      try {
        return await request(`/feedback/reply/${feedbackId}`, {
          method: 'POST',
          body: JSON.stringify({ reply })
        });
      } catch (err) {
        const feedbacks = fetchFromMock('mock_feedback');
        const idx = feedbacks.findIndex(f => f.id === feedbackId || f._id === feedbackId);
        if (idx !== -1) {
          feedbacks[idx].reply = reply;
          feedbacks[idx].replyAt = new Date().toISOString();
          saveToMock('mock_feedback', feedbacks);
          return feedbacks[idx];
        }
        throw new Error('Feedback not found');
      }
    }
  },

  // Pre-Orders
  preOrders: {
    createPreOrder: async (productId, farmerId, quantity = 1) => {
      try {
        return await request('/preorders', {
          method: 'POST',
          body: JSON.stringify({ productId, farmerId, quantity })
        });
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const products = fetchFromMock('mock_products');
        const product = products.find(p => p.id === productId || p._id === productId);
        if (!product) throw new Error('Product not found');

        const farmerIdStr = product.farmerId?._id || product.farmerId?.id || product.farmerId;
        const farmerName = product.farmerId?.name || 'Farmer';

        const confirmationTime = new Date().toISOString();
        const newPreOrder = {
          id: `preord_${Date.now()}`,
          _id: `preord_${Date.now()}`,
          customerId: user.id || user._id,
          productId,
          farmerId: farmerId || farmerIdStr,
          quantity: Number(quantity),
          productTitle: product.title,
          productName: product.title,
          price: product.price,
          customerName: user.name || 'Customer',
          farmerName,
          expectedHarvestDate: product.harvestDate,
          status: 'Confirmed',
          preOrderedAt: confirmationTime,
          notified: false,
          createdAt: confirmationTime,
          updatedAt: confirmationTime
        };

        const preOrders = fetchFromMock('mock_preorders');
        preOrders.push(newPreOrder);
        saveToMock('mock_preorders', preOrders);

        // Create notification for farmer
        const notifications = fetchFromMock('mock_notifications');
        notifications.push({
          id: `notif_${Date.now()}`,
          _id: `notif_${Date.now()}`,
          recipientId: farmerId || farmerIdStr,
          senderId: user.id || user._id,
          type: 'preorder',
          title: 'New Pre-Order Received',
          message: `${user.name || 'Customer'} has pre-ordered ${product.title} (Qty: ${quantity})`,
          data: {
            customerName: user.name || 'Customer',
            productName: product.title,
            quantity: Number(quantity),
            preOrderTime: confirmationTime,
            preOrderId: newPreOrder.id
          },
          read: false,
          createdAt: confirmationTime,
          updatedAt: confirmationTime
        });
        saveToMock('mock_notifications', notifications);

        return { success: true, message: 'Pre-order placed successfully', preOrder: newPreOrder, confirmationTime };
      }
    },

    getCustomerPreOrders: async () => {
      try {
        return await request('/preorders/customer');
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const preOrders = fetchFromMock('mock_preorders');
        return preOrders.filter(p => p.customerId === user.id || p.customerId === user._id);
      }
    },

    getFarmerPreOrders: async () => {
      try {
        return await request('/preorders/farmer');
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const preOrders = fetchFromMock('mock_preorders');
        return preOrders.filter(p => p.farmerId === user.id || p.farmerId === user._id);
      }
    },

    getNotifications: async () => {
      try {
        return await request('/preorders/notifications');
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const notifications = fetchFromMock('mock_notifications');
        const userNotifs = notifications.filter(n => n.recipientId === user.id || n.recipientId === user._id);
        const unreadCount = userNotifs.filter(n => !n.read).length;
        return { notifications: userNotifs, unreadCount };
      }
    },

    markNotificationsRead: async () => {
      try {
        return await request('/preorders/notifications/read', { method: 'PUT' });
      } catch (err) {
        const user = JSON.parse(localStorage.getItem('dhara_user') || '{}');
        const notifications = fetchFromMock('mock_notifications');
        notifications.forEach(n => {
          if (n.recipientId === user.id || n.recipientId === user._id) {
            n.read = true;
          }
        });
        saveToMock('mock_notifications', notifications);
        return { success: true };
      }
    }
  }
};
