import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  IndianRupee, TrendingUp, TrendingDown, Calendar,
  BarChart3, Wallet, ArrowUpRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { t, onLanguageChange } from "../data/i18n";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function FarmerRevenue() {
  const { user } = useSelector((state) => state.auth);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0);
  useEffect(() => onLanguageChange(() => forceUpdate(n => n + 1)), []);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await api.farmer.getRevenue();
        setRevenue(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!revenue) return (
    <div className="text-center py-16 text-emerald-400/50 text-sm">{t('farmerRevenue.unableToLoad')}</div>
  );

  const summaryCards = [
    { icon: IndianRupee, label: t('farmerRevenue.totalEarnings'), value: `₹${(revenue.totalEarnings ?? 0).toLocaleString()}`, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    { icon: TrendingUp, label: t('farmerRevenue.weeklyRevenue'), value: `₹${(revenue.weeklyRevenue ?? 0).toLocaleString()}`, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    { icon: Calendar, label: t('farmerRevenue.monthlyRevenue'), value: `₹${(revenue.monthlyRevenue ?? 0).toLocaleString()}`, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { icon: Wallet, label: t('farmerRevenue.pendingPayouts'), value: `₹${(revenue.pendingPayouts ?? 0).toLocaleString()}`, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  ];

  const chartData = revenue.monthlyRevenueData?.length > 0 ? revenue.monthlyRevenueData : [];

  const pieData = (revenue.topProducts || []).slice(0, 5).map((p, i) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
    value: p.units,
    color: COLORS[i % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1a1f1a] border border-emerald-800/30 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-xs text-emerald-400/70">{label}</p>
          <p className="text-lg font-bold text-emerald-300">₹{payload[0].value?.toLocaleString() ?? 0}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">{t('farmerRevenue.title')}</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{t('farmerRevenue.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-100">{t('farmerRevenue.monthlyRevenueChart')}</h3>
          </div>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-xs text-emerald-400/40">{t('farmerRevenue.noRevenueData')}</div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Products Pie */}
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-100">{t('farmerRevenue.topSellingProducts')}</h3>
          </div>
          {pieData.length === 0 ? (
            <div className="text-center py-12 text-xs text-emerald-400/40">{t('farmerRevenue.noSalesData')}</div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-[10px] text-emerald-400/60">{value}</span>}
                  />
                  <Tooltip contentStyle={{ background: "#1a1f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-emerald-100 mb-4">{t('farmerRevenue.productSalesBreakdown')}</h3>
        {revenue.topProducts?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-emerald-400/60 uppercase tracking-wider border-b border-emerald-900/20">
                  <th className="pb-3 font-semibold">{t('farmerRevenue.num')}</th>
                  <th className="pb-3 font-semibold">{t('farmerRevenue.product')}</th>
                  <th className="pb-3 font-semibold text-right">{t('farmerRevenue.unitsSold')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10">
                {revenue.topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-emerald-900/5">
                    <td className="py-3 text-emerald-500 font-bold">{i + 1}</td>
                    <td className="py-3 text-emerald-200 font-medium">{p.name}</td>
                    <td className="py-3 text-right font-bold text-emerald-400">{p.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-emerald-400/40">{t('farmerRevenue.noProductsSold')}</div>
        )}
      </div>
    </motion.div>
  );
}
