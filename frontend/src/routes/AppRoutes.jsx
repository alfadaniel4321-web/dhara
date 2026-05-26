import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import FarmerLayout from '../layouts/FarmerLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// Customer Pages
import Dashboard from '../pages/Dashboard';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import OrderTracking from '../pages/OrderTracking';
import Wishlist from '../pages/Wishlist';
import Subscription from '../pages/Subscription';
import UserProfile from '../pages/UserProfile';

// Farmer Pages
import FarmerDashboard from '../pages/FarmerDashboard';
import AddProduct from '../pages/AddProduct';
import ManageProducts from '../pages/ManageProducts';
import OrdersManagement from '../pages/OrdersManagement';
import Feedback from '../pages/Feedback';

// Admin Page
import AdminDashboard from '../pages/AdminDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Customer Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track/:id" element={<OrderTracking />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Farmer Dashboard Layout */}
      <Route element={<FarmerLayout />}>
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/farmer/add" element={<AddProduct />} />
        <Route path="/farmer/manage" element={<ManageProducts />} />
        <Route path="/farmer/orders" element={<OrdersManagement />} />
        <Route path="/farmer/feedback" element={<Feedback />} />
      </Route>

      {/* Redirect Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
