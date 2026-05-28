import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
import NearbyFarms from '../pages/NearbyFarms';
import Products from '../pages/Products';
import HarvestCountdown from '../pages/HarvestCountdown';
import DailyOrders from '../pages/DailyOrders';
import Farmers from '../pages/Farmers';
import MyOrders from '../pages/MyOrders';
import Chat from '../pages/Chat';
import Offers from '../pages/Offers';

// Farmer Pages
import FarmerDashboard from '../pages/FarmerDashboard';
import AddProduct from '../pages/AddProduct';
import ManageProducts from '../pages/ManageProducts';
import OrdersManagement from '../pages/OrdersManagement';
import Feedback from '../pages/Feedback';

// Admin Page
import AdminDashboard from '../pages/AdminDashboard';

function ProtectedRoute() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicOnlyRoute() {
  const { user } = useSelector((state) => state.auth);
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Pages — fullscreen, no layout chrome */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Public Pages Layout */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Customer Dashboard Layout (post-login home & sub-pages) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nearby-farms" element={<NearbyFarms />} />
          <Route path="/products" element={<Products />} />
          <Route path="/harvest-countdown" element={<HarvestCountdown />} />
          <Route path="/daily-orders" element={<DailyOrders />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Farmer Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<FarmerLayout />}>
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/add" element={<AddProduct />} />
          <Route path="/farmer/manage" element={<ManageProducts />} />
          <Route path="/farmer/orders" element={<OrdersManagement />} />
          <Route path="/farmer/feedback" element={<Feedback />} />
        </Route>
      </Route>

      {/* Redirect Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
