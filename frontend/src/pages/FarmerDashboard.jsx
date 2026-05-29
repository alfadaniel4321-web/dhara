import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Package, ShoppingBag, IndianRupee, Eye, Star, AlertTriangle,
  TrendingUp, Clock, ArrowUpRight, PlusCircle, BarChart3, Truck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function FarmerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [statsData, revenueData, allProds, allOrders] = await Promise.all([
        api.farmer.getStats().catch(() => null),
        api.farmer.getRevenue().catch(() => null),
        api.products.getProducts().catch(() => []),
        api.orders.getOrders().catch(() => []),
      ]);

      const farmerProds = (Array.isArray(allProds) ? allProds : []).filter((p) => {
        const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
        return fId === user.id || fId === user._id;
      });

      setStats(statsData);
      setRevenue(revenueData);
      setProducts(farmerProds);
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  if (loading) return <LoadingSpinner />;

  const totalEarnings = revenue?.totalEarnings || stats?.totalEarnings || 0;
  const monthRev = revenue?.monthlyRevenue || 0;
  const activeOrders = stats?.activeOrders || 0;
  const totalProducts = stats?.totalProducts || products.length;
  const rating = stats?.rating || user?.rating || 5.0;
  const lowStock = stats?.lowStock || 0;
  const warnings = user?.negativeFeedbacksCount || 0;
  const blocked = user?.blocked || false;

  const recentOrders = orders.slice(0, 5);

  const chartData = revenue?.monthlyRevenueData?.length > 0
    ? revenue.monthlyRevenueData
    : [
        { month: "Jan", amount: 0 }, { month: "Feb", amount: 0 }, { month: "Mar", amount: 0 },
        { month: "Apr", amount: 0 }, { month: "May", amount: 0 }, { month: "Jun", amount: 0 },
      ];

  const statCards = [
    { icon: Package, label: "Total Products", value: totalProducts, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    { icon: ShoppingBag, label: "Active Orders", value: activeOrders, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    { icon: IndianRupee, label: "Total Earnings", value: `₹${totalEarnings.toLocaleString()}`, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { icon: TrendingUp, label: "Monthly Revenue", value: `₹${monthRev.toLocaleString()}`, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
    { icon: Eye, label: "Product Views", value: stats?.productViews || 0, color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
    { icon: Star, label: "Rating", value: `${rating} ★`, color: "#eab308", bg: "rgba(234,179,8,0.12)" },
    { icon: BarChart3, label: "Low Stock Items", value: lowStock, color: lowStock > 0 ? "#ef4444" : "#22c55e", bg: lowStock > 0 ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)" },
    { icon: Truck, label: "Pending Deliveries", value: stats?.pendingDeliveries || 0, color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1a1f1a] border border-emerald-800/30 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-xs text-emerald-400/70 font-medium">{label}</p>
          <p className="text-lg font-bold text-emerald-300">₹{payload[0].value?.toLocaleString() || 0}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-emerald-100">Dashboard Overview</h1>
          <p className="text-xs text-emerald-400/50 mt-1">Welcome back, {user?.name} 🌿</p>
        </div>
        <Link
          to="/farmer/products?action=add"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/30"
        >
          <PlusCircle size={16} />
          Add Product
        </Link>
      </motion.div>

      {/* Warning Banner */}
      {(warnings > 0 || blocked) && (
        <motion.div variants={cardVariants}
          className={`px-5 py-4 rounded-2xl flex items-center gap-3 border ${blocked ? "bg-red-900/10 border-red-800/30" : "bg-yellow-900/10 border-yellow-800/30"}`}
        >
          <AlertTriangle size={20} className={blocked ? "text-red-400" : "text-yellow-400"} />
          <div>
            <p className={`text-sm font-bold ${blocked ? "text-red-400" : "text-yellow-400"}`}>
              {blocked ? "Account Blocked" : `${warnings}/3 Negative Reviews`}
            </p>
            <p className="text-xs text-emerald-400/50">
              {blocked ? "You cannot post products. Contact admin." : `${warnings} severe comment${warnings > 1 ? "s" : ""} received. 3 will block your account.`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={cardVariants}
              className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5 hover:border-emerald-700/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon size={18} color={card.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-100">{card.value}</p>
              <p className="text-xs text-emerald-400/50 mt-1 font-medium">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={cardVariants} className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-emerald-100">Revenue Overview</h3>
              <p className="text-[10px] text-emerald-400/40 mt-0.5">Monthly earnings</p>
            </div>
            <Link to="/farmer/revenue" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={cardVariants} className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-100">Recent Orders</h3>
              <p className="text-[10px] text-emerald-400/40 mt-0.5">Latest {recentOrders.length} orders</p>
            </div>
            <Link to="/farmer/orders" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={28} className="mx-auto text-emerald-700/50 mb-2" />
              <p className="text-xs text-emerald-400/40">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order._id || order.id}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-900/10 border border-emerald-900/10"
                >
                  <div>
                    <p className="text-xs font-semibold text-emerald-200">
                      Order #{((order._id || order.id) || "").slice(-6)}
                    </p>
                    <p className="text-[10px] text-emerald-400/40">
                      {order.products?.length || 0} items · ₹{order.farmerTotal || order.totalPrice || 0}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    order.orderStatus === "Delivered" ? "bg-green-900/30 text-green-400" :
                    order.orderStatus === "Cancelled" ? "bg-red-900/30 text-red-400" :
                    order.orderStatus === "In Transit" ? "bg-blue-900/30 text-blue-400" :
                    "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants} className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-emerald-100 mb-4">Top Selling Products</h3>
          {revenue?.topProducts?.length > 0 ? (
            <div className="space-y-2">
              {revenue.topProducts.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-900/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-emerald-500 w-4">{i + 1}</span>
                    <span className="text-xs text-emerald-200">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{p.units} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-emerald-400/40">No sales data yet</div>
          )}
        </motion.div>

        <motion.div variants={cardVariants} className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-100">Low Stock Alerts</h3>
              <p className="text-[10px] text-emerald-400/40 mt-0.5">Products running low</p>
            </div>
            <Link to="/farmer/inventory" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              Manage <ArrowUpRight size={12} />
            </Link>
          </div>
          {products.filter(p => p.stock <= 5).length === 0 ? (
            <div className="text-center py-8">
              <Package size={28} className="mx-auto text-emerald-700/50 mb-2" />
              <p className="text-xs text-emerald-400/40">All products well stocked</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.filter(p => p.stock <= 5).slice(0, 5).map((p) => (
                <div key={p._id || p.id}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-red-900/10 border border-red-900/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                    <span className="text-xs text-emerald-200 truncate">{p.title}</span>
                  </div>
                  <span className={`text-xs font-bold ${p.stock <= 0 ? "text-red-400" : "text-yellow-400"}`}>
                    {p.stock <= 0 ? "Out of Stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
