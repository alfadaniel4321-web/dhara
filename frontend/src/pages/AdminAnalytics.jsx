import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Users, UserCheck, ShoppingBag, TrendingUp,
  Award
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const COLORS = ["#10b981", "#22c55e", "#f59e0b", "#06b6d4", "#059669", "#ef4444"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.admin.getAnalytics();
        setAnalytics(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <div className="text-center py-16 text-emerald-400/50 text-sm">Unable to load analytics</div>;

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

  const pieData = (analytics.topFarmers || []).slice(0, 5).map((f, i) => ({
    name: f.name.length > 12 ? f.name.slice(0, 12) + "..." : f.name,
    value: f.units,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Platform Analytics</h1>
        <p className="text-xs text-emerald-400/50 mt-1">Comprehensive insights and metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
          <Users size={20} className="mx-auto text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-emerald-100">{analytics.activeUsers || 0}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium">Active Users</p>
        </div>
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
          <UserCheck size={20} className="mx-auto text-green-400 mb-2" />
          <p className="text-2xl font-bold text-emerald-100">{analytics.activeFarmers || 0}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium">Active Farmers</p>
        </div>
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
          <ShoppingBag size={20} className="mx-auto text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-emerald-100">{analytics.dailyOrderData?.reduce((s, d) => s + d.orders, 0) || 0}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium">Total Orders (30d)</p>
        </div>
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
          <TrendingUp size={20} className="mx-auto text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-emerald-100">{analytics.topFarmers?.length || 0}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium">Top Farmers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-emerald-100 mb-6">Daily Orders</h3>
          {analytics.dailyOrderData?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={analytics.dailyOrderData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="text-center py-12 text-xs text-emerald-400/40">No data</div>}
        </div>

        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-emerald-100 mb-6">Revenue Growth</h3>
          {analytics.revenueData?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={analytics.revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="text-center py-12 text-xs text-emerald-400/40">No data</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-100">Top Farmers</h3>
          </div>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                  >
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0a2a14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="text-center py-12 text-xs text-emerald-400/40">No data</div>}
          <div className="mt-4 space-y-1.5">
            {analytics.topFarmers?.slice(0, 5).map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs px-2">
                <span className="text-emerald-300">{i + 1}. {f.name}</span>
                <span className="text-emerald-400 font-bold">{f.units} sold</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-100">Best-Selling Products</h3>
          </div>
          {analytics.topProducts?.length > 0 ? (
            <div className="space-y-2">
              {analytics.topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-900/5">
                  <span className="text-xs text-emerald-200">{i + 1}. {p.name}</span>
                  <span className="text-xs font-bold text-emerald-400">{p.units} sold</span>
                </div>
              ))}
            </div>
          ) : <div className="text-center py-12 text-xs text-emerald-400/40">No data</div>}
        </div>
      </div>
    </motion.div>
  );
}
