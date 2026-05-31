import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import FarmerLayout from '../layouts/FarmerLayout';

import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminLogin from '../pages/AdminLogin';

import Dashboard from '../pages/Dashboard';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import OrderTracking from '../pages/OrderTracking';
import Wishlist from '../pages/Wishlist';

import UserProfile from '../pages/UserProfile';
import Products from '../pages/Products';
import HarvestCountdown from '../pages/HarvestCountdown';
import DailyOrders from '../pages/DailyOrders';
import Farmers from '../pages/Farmers';
import MyOrders from '../pages/MyOrders';
import Offers from '../pages/Offers';

import FarmerDashboard from '../pages/FarmerDashboard';
import FarmerNotifications from '../pages/FarmerNotifications';
import AddProduct from '../pages/AddProduct';
import ManageProducts from '../pages/ManageProducts';
import OrdersManagement from '../pages/OrdersManagement';
import Feedback from '../pages/Feedback';
import FarmerProfile from '../pages/FarmerProfile';
import FarmerProducts from '../pages/FarmerProducts';
import FarmerOrders from '../pages/FarmerOrders';
import FarmerRevenue from '../pages/FarmerRevenue';
import FarmerReviews from '../pages/FarmerReviews';
import FarmerInventory from '../pages/FarmerInventory';
import FarmerSettings from '../pages/FarmerSettings';

import AdminDashboard from '../pages/AdminDashboard';
import AdminFarmers from '../pages/AdminFarmers';
import AdminProducts from '../pages/AdminProducts';
import AdminOrders from '../pages/AdminOrders';
import AdminReports from '../pages/AdminReports';
import AdminAnalytics from '../pages/AdminAnalytics';
import AdminNotifications from '../pages/AdminNotifications';
import AdminSettings from '../pages/AdminSettings';
import AdminPromotions from '../pages/AdminPromotions';
import AdminLayout from '../layouts/AdminLayout';

function ProtectedRoute() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicOnlyRoute() {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return <Navigate to={user.role === 'farmer' ? '/farmer' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/farmers" element={<AdminFarmers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/harvest-countdown" element={<HarvestCountdown />} />
          <Route path="/daily-orders" element={<DailyOrders />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<FarmerLayout />}>
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/products" element={<FarmerProducts />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/farmer/revenue" element={<FarmerRevenue />} />
          <Route path="/farmer/reviews" element={<FarmerReviews />} />
          <Route path="/farmer/inventory" element={<FarmerInventory />} />
          <Route path="/farmer/settings" element={<FarmerSettings />} />
          <Route path="/farmer/add" element={<AddProduct />} />
          <Route path="/farmer/manage" element={<ManageProducts />} />
          <Route path="/farmer/orders-old" element={<OrdersManagement />} />
          <Route path="/farmer/feedback" element={<Feedback />} />
          <Route path="/farmer/notifications" element={<FarmerNotifications />} />
          <Route path="/farmer/profile" element={<FarmerProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
