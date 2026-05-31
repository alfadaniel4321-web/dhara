import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, UserCheck, Package, ShoppingBag, IndianRupee, Truck,
  MapPin, Home, ShieldAlert, AlertTriangle, ArrowUpRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [s, a] = await Promise.all([
          api.admin.getStats(),
          api.admin.getAnalytics(),
        ]);
        setStats(s);
        setAnalytics(a);
      } catch (e) {
        setError(e.message);
      }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-900/30 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <p className="text-emerald-200 font-semibold text-lg">Failed to load dashboard data</p>
      <p className="text-emerald-400/50 text-sm mt-2 max-w-md mx-auto">{error}</p>
      <p className="text-emerald-400/40 text-xs mt-3">Try logging out and logging back in</p>
    </div>
  );

  const cards = [
    { icon: Users, label: "Total Users", value: stats?.totalUsers || 0, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    { icon: UserCheck, label: "Total Farmers", value: stats?.totalFarmers || 0, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    { icon: Package, label: "Total Products", value: stats?.totalProducts || 0, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { icon: ShoppingBag, label: "Total Orders", value: stats?.totalOrders || 0, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    { icon: IndianRupee, label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: "#059669", bg: "rgba(5,150,105,0.12)" },
    { icon: Truck, label: "Pending Deliveries", value: stats?.pendingDeliveries || 0, color: "#f97316", bg: "rgba(249,115,22,0.12)" },
    { icon: MapPin, label: "Pickup Orders", value: stats?.pickupOrders || 0, color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
    { icon: Home, label: "Direct Orders", value: stats?.directOrders || 0, color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  ];

  const chartData = analytics?.dailyOrderData || [];
  const revenueData = analytics?.revenueData || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#0a2a14] border border-emerald-800/30 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-xs text-emerald-400/70">{label}</p>
          <p className="text-lg font-bold text-emerald-300">{payload[0].value?.toLocaleString() || 0}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-emerald-100">Admin Dashboard</h1>
          <p className="text-xs text-emerald-400/50 mt-1">Platform overview and analytics</p>
        </div>
        {stats?.blockedFarmers > 0 && (
          <Link to="/admin/farmers"
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-800/30 rounded-xl text-xs font-bold text-red-400 hover:bg-red-900/50 transition-all"
          >
            <ShieldAlert size={14} /> {stats.blockedFarmers} Blocked Farmer{stats.blockedFarmers > 1 ? 's' : ''}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 hover:border-emerald-700/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: card.bg }}>
                <Icon size={18} color={card.color} />
              </div>
              <p className="text-xl font-bold text-emerald-100">{card.value}</p>
              <p className="text-[10px] text-emerald-400/50 mt-1 font-medium">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-emerald-100">Daily Orders (Last 30 days)</h3>
            {chartData.length > 0 && (
              <span className="text-[10px] text-emerald-400/40">{chartData.length} days</span>
            )}
          </div>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-xs text-emerald-400/40">No order data yet</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-emerald-100">Revenue Trend</h3>
          </div>
          {revenueData.length === 0 ? (
            <div className="text-center py-12 text-xs text-emerald-400/40">No revenue data yet</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Farmers & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-emerald-100">Top Farmers</h3>
            <Link to="/admin/farmers" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          {analytics?.topFarmers?.length > 0 ? (
            <div className="space-y-2">
              {analytics.topFarmers.slice(0, 5).map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-900/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-emerald-500 w-4">{i + 1}</span>
                    <span className="text-xs text-emerald-200">{f.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{f.units} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-emerald-400/40">No data yet</div>
          )}
        </div>

        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-emerald-100">Best-Selling Products</h3>
            <Link to="/admin/products" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          {analytics?.topProducts?.length > 0 ? (
            <div className="space-y-2">
              {analytics.topProducts.slice(0, 5).map((p, i) => (
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
            <div className="text-center py-8 text-xs text-emerald-400/40">No data yet</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
