const API_BASE_URL = 'https://dhara-5rgb.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('dhara_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const request = async (url, options = {}) => {
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
};

export const api = {
  auth: {
    login: async (email, password) => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('dhara_token', data.token);
      localStorage.setItem('dhara_user', JSON.stringify(data.user));
      return data;
    },

    signup: async (name, email, password, role, phone, address = '') => {
      const data = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, phone, address })
      });
      localStorage.setItem('dhara_token', data.token);
      localStorage.setItem('dhara_user', JSON.stringify(data.user));
      return data;
    },

    getMe: async () => {
      return await request('/auth/me');
    },

    logout: () => {
      localStorage.removeItem('dhara_token');
      localStorage.removeItem('dhara_user');
    },

    getFarmers: async () => {
      return await request('/auth/farmers');
    }
  },

  products: {
    searchProducts: async (query) => {
      return await request(`/products/search?q=${encodeURIComponent(query)}`);
    },

    getProducts: async (category) => {
      const url = category ? `/products?category=${category}` : '/products';
      return await request(url);
    },

    createProduct: async (productData) => {
      return await request('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    },

    updateProductStock: async (id, stock) => {
      return await request(`/products/${id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stock })
      });
    },

    deleteProduct: async (id) => {
      return await request(`/products/${id}`, {
        method: 'DELETE'
      });
    },

    getProduct: async (id) => {
      return await request(`/products/${id}`);
    },

    updateProduct: async (id, productData) => {
      return await request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    },

    getFarmerProducts: async (farmerId) => {
      return await request(`/products/farmer/${farmerId}`);
    }
  },

  cart: {
    getCart: async () => {
      return await request('/cart');
    },

    addToCart: async (productId, count = 1) => {
      return await request('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, count })
      });
    },

    updateQuantity: async (productId, count) => {
      return await request('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, count })
      });
    },

    removeFromCart: async (productId) => {
      return await request('/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
    },

    clearCart: async () => {
      return await request('/cart/clear', {
        method: 'POST'
      });
    }
  },

  wishlist: {
    getWishlist: async () => {
      return await request('/wishlist');
    },

    toggleWishlist: async (productId) => {
      return await request('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
    }
  },

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

  public: {
    getStats: async () => {
      return await request('/stats');
    },
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

  farmer: {
    getStats: async () => {
      return await request('/farmer/stats');
    },

    getRevenue: async () => {
      return await request('/revenue/farmer/me');
    },

    updateProfile: async (profileData) => {
      return await request('/farmer/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    }
  },

  payment: {
    createPaymentOrder: async (amount, currency = 'INR') => {
      return await request('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount, currency })
      });
    },

    verifyPayment: async (paymentData) => {
      return await request('/payment/verify', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
    }
  },

  feedback: {
    createFeedback: async (feedbackData) => {
      return await request('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackData)
      });
    },

    getFarmerFeedbacks: async (farmerId) => {
      return await request(`/feedback/farmer/${farmerId}`);
    },

    replyToFeedback: async (feedbackId, reply) => {
      return await request(`/feedback/reply/${feedbackId}`, {
        method: 'POST',
        body: JSON.stringify({ reply })
      });
    }
  },

  preOrders: {
    createPreOrder: async (productId, farmerId, quantity = 1) => {
      return await request('/preorders', {
        method: 'POST',
        body: JSON.stringify({ productId, farmerId, quantity })
      });
    },

    getCustomerPreOrders: async () => {
      return await request('/preorders/customer');
    },

    getFarmerPreOrders: async () => {
      return await request('/preorders/farmer');
    },

    getNotifications: async () => {
      return await request('/preorders/notifications');
    },

    markNotificationsRead: async () => {
      return await request('/preorders/notifications/read', { method: 'PUT' });
    }
  }
};
