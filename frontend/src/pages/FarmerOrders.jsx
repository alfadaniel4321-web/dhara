import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ShoppingBag, Search, Filter, ChevronDown,
  Package, Clock, CheckCircle, XCircle, Truck, Eye
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { t, onLanguageChange } from "../data/i18n";

const STATUS_FLOW = ["Pending", "Processing", "In Transit", "Delivered"];
const STATUS_ACTIONS = {
  Pending: { label: () => t('farmerOrders.acceptOrder'), next: "Processing", color: "bg-emerald-600 hover:bg-emerald-500" },
  Processing: { label: () => t('farmerOrders.markShipped'), next: "In Transit", color: "bg-blue-600 hover:bg-blue-500" },
  "In Transit": { label: () => t('farmerOrders.markDelivered'), next: "Delivered", color: "bg-green-600 hover:bg-green-500" },
};

export default function FarmerOrders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [, forceUpdate] = useState(0);
  useEffect(() => onLanguageChange(() => forceUpdate(n => n + 1)), []);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.orders.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateOrderStatus(orderId, { orderStatus: newStatus });
      loadOrders();
    } catch (err) {
      alert(err.message || "Failed to update");
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await api.orders.updateOrderStatus(orderId, { orderStatus: "Processing" });
      loadOrders();
    } catch (err) {
      alert(err.message || "Failed to accept");
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      await api.orders.updateOrderStatus(orderId, { orderStatus: "Cancelled" });
      loadOrders();
    } catch (err) {
      alert(err.message || "Failed to reject");
    }
  };

  const filtered = orders.filter(o => {
    const sMatch = statusFilter === "All" || o.orderStatus === statusFilter;
    const q = search.toLowerCase();
    const sMatch2 = !q || (o._id || "").toLowerCase().includes(q) ||
      o.products?.some(p => p.title?.toLowerCase().includes(q));
    return sMatch && sMatch2;
  });

  if (loading) return <LoadingSpinner />;

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter(o => o.orderStatus === "Pending").length,
    Processing: orders.filter(o => o.orderStatus === "Processing").length,
    "In Transit": orders.filter(o => o.orderStatus === "In Transit").length,
    Delivered: orders.filter(o => o.orderStatus === "Delivered").length,
    Cancelled: orders.filter(o => o.orderStatus === "Cancelled").length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">{t('farmerOrders.title')}</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{t('farmerOrders.totalOrders').replace('{count}', orders.length)}</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([key, count]) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === key
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                : "bg-emerald-900/10 text-emerald-400/60 border border-transparent hover:bg-emerald-900/20"
            }`}
          >
            {({ All: t('farmerOrders.status.all'), Pending: t('farmerOrders.status.pending'), Processing: t('farmerOrders.status.processing'), "In Transit": t('farmerOrders.status.inTransit'), Delivered: t('farmerOrders.status.delivered'), Cancelled: t('farmerOrders.status.cancelled') })[key] || key} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t('farmerOrders.search')}
          className="w-full pl-10 pr-4 py-2.5 bg-[#111811] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111811] border border-emerald-900/20 rounded-2xl">
          <ShoppingBag size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">{t('farmerOrders.noOrdersFound')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((order) => {
            const canAct = STATUS_ACTIONS[order.orderStatus];
            return (
              <motion.div key={order._id || order.id} layout
                className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5 hover:border-emerald-700/30 transition-all"
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.orderStatus === "Delivered" ? "bg-green-900/30" :
                      order.orderStatus === "Cancelled" ? "bg-red-900/30" :
                      order.orderStatus === "In Transit" ? "bg-blue-900/30" :
                      "bg-yellow-900/30"
                    }`}>
                      {order.orderStatus === "Delivered" ? <CheckCircle size={18} className="text-green-400" /> :
                       order.orderStatus === "Cancelled" ? <XCircle size={18} className="text-red-400" /> :
                       order.orderStatus === "In Transit" ? <Truck size={18} className="text-blue-400" /> :
                       <Clock size={18} className="text-yellow-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-100">
                        {t('farmerOrders.orderHash')}{((order._id || order.id) || "").slice(-8)}
                      </p>
                      <p className="text-[10px] text-emerald-400/50">
                        {order.products?.length || 0} {t('farmerOrders.items')} · ₹{order.farmerTotal || order.totalPrice || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      order.orderStatus === "Delivered" ? "bg-green-900/30 text-green-400" :
                      order.orderStatus === "Cancelled" ? "bg-red-900/30 text-red-400" :
                      order.orderStatus === "In Transit" ? "bg-blue-900/30 text-blue-400" :
                      order.orderStatus === "Processing" ? "bg-purple-900/30 text-purple-400" :
                      "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {({ Pending: t('farmerOrders.status.pending'), Processing: t('farmerOrders.status.processing'), "In Transit": t('farmerOrders.status.inTransit'), Delivered: t('farmerOrders.status.delivered'), Cancelled: t('farmerOrders.status.cancelled') })[order.orderStatus] || order.orderStatus}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      order.paymentStatus === "Paid" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {order.paymentStatus === "Paid" ? t('farmerOrders.payment.paid') : t('farmerOrders.payment.pending')}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-900/5 rounded-xl p-3">
                  <div>
                    <p className="text-[9px] text-emerald-400/40 uppercase tracking-wider">{t('farmerOrders.customer')}</p>
                    <p className="text-xs text-emerald-200 font-semibold mt-0.5">{order.customerName || `Customer #${((order.customerId?._id || order.customerId || "") + "").slice(-4)}`}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-emerald-400/40 uppercase tracking-wider">{t('farmerOrders.items')}</p>
                    <p className="text-xs text-emerald-200 font-semibold mt-0.5">{order.farmerItems?.length || order.products?.length || 0} {t('farmerOrders.products')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-emerald-400/40 uppercase tracking-wider">{t('farmerOrders.delivery')}</p>
                    <p className="text-xs text-emerald-200 font-semibold mt-0.5">{order.deliveryTime || "Morning"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-emerald-400/40 uppercase tracking-wider">{t('farmerOrders.date')}</p>
                    <p className="text-xs text-emerald-200 font-semibold mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Products list */}
                {(order.farmerItems || order.products).slice(0, 3).map((item, i) => (
                  <div key={i} className="mt-2 flex items-center justify-between px-3 py-2 bg-emerald-900/5 rounded-xl">
                    <span className="text-xs text-emerald-200">{item.title || item.productId}</span>
                    <span className="text-xs font-bold text-emerald-400">₹{item.price} x {item.count || 1}</span>
                  </div>
                ))}
                {(order.farmerItems || order.products).length > 3 && (
                  <p className="mt-1 text-[10px] text-emerald-400/40 text-center">
                    {t('farmerOrders.moreItems').replace('{count}', (order.farmerItems || order.products).length - 3)}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {canAct && (
                    <button onClick={() => updateStatus(order._id || order.id, canAct.next)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${canAct.color}`}
                    >
                      {canAct.label()}
                    </button>
                  )}
                  {order.orderStatus === "Pending" && (
                    <button onClick={() => rejectOrder(order._id || order.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-all"
                    >
                      {t('farmerOrders.reject')}
                    </button>
                  )}
                  <button onClick={() => setSelectedOrder(selectedOrder === (order._id || order.id) ? null : (order._id || order.id))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-900/10 hover:bg-emerald-900/20 transition-all flex items-center gap-1.5"
                  >
                    <Eye size={14} /> {t('farmerOrders.details')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
