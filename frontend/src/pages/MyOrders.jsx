import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { motion } from "framer-motion";

const TABS = ["All", "Processing", "Delivered", "Cancelled"];

const STATUS_CONFIG = {
  Processing: { color: "#D9A441", bg: "rgba(217,164,65,0.1)", icon: Clock },
  Delivered: { color: "#0F5132", bg: "rgba(15,81,50,0.1)", icon: CheckCircle },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
  Shipped: { color: "#0F5132", bg: "rgba(15,81,50,0.1)", icon: Truck },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.getOrders();
        if (data && data.length > 0) setOrders(data);
      } catch {}
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filtered = activeTab === "All"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5"
    >
      <h1 className="text-xl font-bold mb-5"
        style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        My Orders
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 active:scale-95"
              style={{
                background: isActive ? "#0F5132" : "#fff",
                color: isActive ? "#fff" : "rgba(29,43,31,0.5)",
                border: isActive ? "none" : "1px solid rgba(0,0,0,0.04)",
                boxShadow: isActive ? "0 4px 12px rgba(15,81,50,0.2)" : "0 1px 4px rgba(0,0,0,0.02)",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(15,81,50,0.2)", borderTopColor: "#0F5132" }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(15,81,50,0.06)" }}
          >
            <Package size={24} color="rgba(15,81,50,0.3)" />
          </div>
          <p className="text-sm font-medium" style={{ color: "#1D2B1F" }}>
            No orders yet
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(29,43,31,0.35)" }}>
            Start shopping from our fresh harvest
          </p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {filtered.map((order, i) => {
            const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
            const StatusIcon = statusInfo.icon;
            const itemCount = order.items?.length || 0;

            return (
              <motion.div
                key={order._id || order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/track/${order._id || order.id}`)}
                className="rounded-3xl p-4 cursor-pointer transition-all active:scale-[0.98]"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: "#1D2B1F" }}>
                      #{order.orderNumber || order._id?.slice(-6) || "000000"}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(29,43,31,0.35)" }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                    </p>
                  </div>
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-semibold"
                    style={{
                      background: statusInfo.bg,
                      color: statusInfo.color,
                    }}
                  >
                    <StatusIcon size={10} />
                    {order.status || "Processing"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px]" style={{ color: "rgba(29,43,31,0.4)" }}>
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs font-bold" style={{ color: "#0F5132" }}>
                    ₹{order.totalAmount || order.total || 0}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.03)" }}
                >
                  <span className="text-[10px] font-medium" style={{ color: "#0F5132" }}>
                    View Details
                  </span>
                  <ChevronRight size={12} color="rgba(15,81,50,0.3)" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
