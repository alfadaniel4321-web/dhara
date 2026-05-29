import React, { useState, useEffect } from "react";
import { Package, Search, ChevronRight, Clock, CheckCircle, XCircle, RefreshCw, FileText, Truck, ShoppingBag } from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_STYLES = {
  "Delivered": { bg: "bg-green-900/30", color: "text-green-400", icon: CheckCircle },
  "In Transit": { bg: "bg-blue-900/30", color: "text-blue-400", icon: Truck },
  "Processing": { bg: "bg-purple-900/30", color: "text-purple-400", icon: Clock },
  "Pending": { bg: "bg-yellow-900/30", color: "text-yellow-400", icon: Clock },
  "Cancelled": { bg: "bg-red-900/30", color: "text-red-400", icon: XCircle },
};

const TABS = ["All", "Active", "Delivered", "Cancelled"];

export default function MyOrders() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.orders.updateOrderStatus(orderId, { orderStatus: 'Cancelled' });
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const filtered = orders.filter(o => {
    const matchTab = tab === "All" ? true : tab === "Active" ? o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled" : o.orderStatus === tab;
    const orderId = o._id || o.id || '';
    const productNames = (o.products || []).map(p => p.title || '').join(' ');
    const matchSearch = !search || orderId.toLowerCase().includes(search.toLowerCase()) || productNames.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="border-b border-emerald-900/60 pb-4">
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <p className="text-sm text-emerald-300/70">Track and manage all your orders</p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search by order ID or items..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-700/60 outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t ? 'bg-emerald-600 text-white' : 'bg-emerald-950/40 text-emerald-400/60 hover:text-emerald-300 border border-emerald-900/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(order => {
          const status = order.orderStatus || "Pending";
          const statusInfo = STATUS_STYLES[status] || STATUS_STYLES["Pending"];
          const StatusIcon = statusInfo.icon;
          return (
            <div key={order._id || order.id} className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 hover:border-emerald-700/50 transition-all">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusInfo.bg}`}>
                    <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">#{((order._id || order.id) || '').slice(-8)}</p>
                    <p className="text-[10px] text-emerald-400/50">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3" /> {status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(order.products || []).slice(0, 4).map((item, i) => (
                  <span key={i} className="bg-emerald-900/20 text-emerald-300/80 px-2.5 py-1 rounded-full text-[10px] font-medium">
                    {item.title || 'Item'} x{item.count}
                  </span>
                ))}
                {(order.products || []).length > 4 && (
                  <span className="text-[10px] text-emerald-400/40 self-center">+{(order.products || []).length - 4} more</span>
                )}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 border-t border-emerald-900/40 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">₹{order.totalPrice || 0}</span>
                  <span className="text-[10px] text-emerald-400/50">· {order.paymentStatus === 'Paid' ? 'Paid' : 'COD'}</span>
                  {order.deliveryTime && (
                    <span className="text-[10px] text-emerald-400/50">· {order.deliveryTime}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {status !== "Cancelled" && (
                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 rounded-xl text-[10px] font-semibold transition-all">
                      <RefreshCw className="w-3 h-3" /> Reorder
                    </button>
                  )}
                  {status !== "Cancelled" && status !== "Delivered" && (
                    <button onClick={() => handleCancelOrder(order._id || order.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl text-[10px] font-semibold transition-all"
                    >
                      <XCircle className="w-3 h-3" /> Cancel
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-semibold transition-all">
                    <FileText className="w-3 h-3" /> Invoice
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-emerald-950/20 border border-emerald-900 rounded-2xl">
          <ShoppingBag className="w-12 h-12 mx-auto text-emerald-700/50 mb-4" />
          <p className="text-base font-bold text-emerald-300 mb-1">No orders yet</p>
          <p className="text-sm text-emerald-400/50">Your order history will appear here</p>
        </div>
      )}
    </div>
  );
}
