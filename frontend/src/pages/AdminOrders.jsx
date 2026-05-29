import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Search, Filter, Clock, Truck, CheckCircle, XCircle
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_OPTIONS = ["Pending", "Processing", "Packed", "In Transit", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.admin.updateOrderStatus(id, { orderStatus });
      setSuccess(`Order status updated to ${orderStatus}`);
      load();
    } catch (err) { alert(err.message); }
  };

  const filtered = orders.filter(o => {
    const s = statusFilter === "All" || o.orderStatus === statusFilter;
    const q = search.toLowerCase();
    const sq = !q || (o._id || "").toLowerCase().includes(q) ||
      o.products?.some(p => p.title?.toLowerCase().includes(q)) ||
      o.customer?.name?.toLowerCase().includes(q);
    return s && sq;
  });

  const statusCounts = { All: orders.length };
  for (const s of STATUS_OPTIONS) statusCounts[s] = orders.filter(o => o.orderStatus === s).length;

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Order Management</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{orders.length} total orders</p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium">{success}</div>
      )}

      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([key, count]) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`px-3.5 py-2 rounded-xl text-[10px] font-semibold transition-all ${statusFilter === key ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-900/10 text-emerald-400/60 hover:bg-emerald-900/20"}`}
          >{key} ({count})</button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by order ID, product, customer..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0a1a0e] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl">
          <ShoppingBag size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((order) => (
            <motion.div key={order._id || order.id} layout
              className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 hover:border-emerald-700/30 transition-all"
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    order.orderStatus === "Delivered" ? "bg-green-900/30" :
                    order.orderStatus === "Cancelled" ? "bg-red-900/30" :
                    order.orderStatus === "In Transit" ? "bg-blue-900/30" : "bg-yellow-900/30"
                  }`}>
                    {order.orderStatus === "Delivered" ? <CheckCircle size={18} className="text-green-400" /> :
                     order.orderStatus === "Cancelled" ? <XCircle size={18} className="text-red-400" /> :
                     order.orderStatus === "In Transit" ? <Truck size={18} className="text-blue-400" /> :
                     <Clock size={18} className="text-yellow-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-100">Order #{((order._id || order.id) || "").slice(-8)}</p>
                    <p className="text-[10px] text-emerald-400/50">{order.products?.length || 0} items · ₹{order.totalPrice || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    order.orderStatus === "Delivered" ? "bg-green-900/30 text-green-400" :
                    order.orderStatus === "Cancelled" ? "bg-red-900/30 text-red-400" :
                    "bg-yellow-900/30 text-yellow-400"
                  }`}>{order.orderStatus}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${order.paymentStatus === "Paid" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}>{order.paymentStatus || "Pending"}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-900/5 rounded-xl p-3 text-xs">
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Customer</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{order.customer?.name || "—"}</p>
                  {order.customer?.phone && <p className="text-[10px] text-emerald-400/50">{order.customer.phone}</p>}
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Items</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{order.products?.length || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Delivery</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{order.deliveryTime || "Morning"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Date</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {STATUS_OPTIONS.filter(s => s !== order.orderStatus && s !== "Cancelled").map(s => (
                  <button key={s} onClick={() => updateStatus(order._id || order.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      s === "Delivered" ? "bg-green-600/20 text-green-400 hover:bg-green-600/30" :
                      s === "In Transit" ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" :
                      "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                    }`}
                  >Mark {s}</button>
                ))}
                {order.orderStatus !== "Cancelled" && (
                  <button onClick={() => updateStatus(order._id || order.id, "Cancelled")}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  >Cancel Order</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
