import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import {
  User, MapPin, ListOrdered, Heart, ShieldAlert,
  PackageCheck, Leaf, ChevronRight, LogOut, Settings,
  HelpCircle, Info, Bell, CreditCard,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MENU_ITEMS = [
  { icon: MapPin, label: "My Addresses", route: "/profile/addresses" },
  { icon: CreditCard, label: "Payment Methods", route: "/profile/payments" },
  { icon: ListOrdered, label: "My Orders", route: "/my-orders" },
  { icon: Bell, label: "Notifications", route: "/profile/notifications" },
  { icon: HelpCircle, label: "Help & Support", route: "/contact" },
  { icon: Info, label: "About Dhara", route: "/about" },
  { icon: Settings, label: "Settings", route: "/profile/settings" },
];

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ orders: 0, spent: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orders = await api.orders.getOrders();
        if (orders && orders.length > 0) {
          setStats({
            orders: orders.length,
            spent: orders.reduce((s, o) => s + (o.totalAmount || o.total || 0), 0),
          });
        }
      } catch {}
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Profile Header */}
      <div
        className="mx-5 rounded-4xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0A3B2A, #0F5132)",
          boxShadow: "0 8px 32px rgba(10,59,42,0.2)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.06] pointer-events-none">
          <Leaf size={120} color="#fff" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.15)",
              color: "#D9A441",
            }}
          >
            {(user?.name || user?.email || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate"
              style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {user?.name || "Customer"}
            </h2>
            <p className="text-xs mt-0.5 truncate"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {user?.phone || user?.email || "Add contact info"}
            </p>
            <p className="text-[10px] truncate"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mx-5 mb-6">
        <div className="flex gap-3">
          {[
            { icon: PackageCheck, value: stats.orders, label: "Total Orders" },
            { icon: Heart, value: "—", label: "Wishlist" },
            { icon: Leaf, value: "100%", label: "Organic" },
          ].map((s) => (
            <div key={s.label}
              className="flex-1 rounded-3xl p-3.5 text-center"
              style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
            >
              <s.icon size={16} color="#0F5132" className="mx-auto mb-1" />
              <p className="text-sm font-bold" style={{ color: "#0A3B2A" }}>
                {s.value}
              </p>
              <p className="text-[9px] mt-0.5" style={{ color: "rgba(29,43,31,0.35)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="mx-5 mb-6 rounded-3xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
      >
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            onClick={() => navigate(item.route)}
            className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-opacity-50"
            style={{
              borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid rgba(0,0,0,0.03)" : "none",
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(15,81,50,0.06)" }}
            >
              <item.icon size={15} color="#0F5132" />
            </div>
            <span className="text-xs font-medium flex-1 text-left"
              style={{ color: "#1D2B1F" }}
            >
              {item.label}
            </span>
            <ChevronRight size={14} color="rgba(29,43,31,0.15)" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-5 mb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold tracking-wider transition-all active:scale-[0.98]"
          style={{
            background: "rgba(239,68,68,0.06)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.1)",
          }}
        >
          <LogOut size={14} />
          LOGOUT
        </button>
      </div>
    </motion.div>
  );
}
