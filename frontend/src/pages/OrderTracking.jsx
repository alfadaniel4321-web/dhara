import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeft, MapPin, CheckCircle, Circle, Truck, Package, Sun, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'picked', label: 'Picked from Farm', icon: Leaf },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Sun },
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.orders.getOrderById(id);
        if (data) setOrder(data);
      } catch {
        try {
          const all = await api.orders.getOrders();
          const found = all.find((o) => (o._id || o.id) === id);
          if (found) setOrder(found);
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStageIndex = (status) => {
    const map = { placed: 0, confirmed: 1, picked: 2, out_for_delivery: 3, delivered: 4 };
    return map[status?.toLowerCase().replace(/\s+/g, '_')] ?? -1;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 mb-5 transition-all active:scale-95"
        style={{ color: "rgba(29,43,31,0.4)" }}
      >
        <ChevronLeft size={16} />
        <span className="text-xs font-medium">Back</span>
      </button>

      <h1 className="text-xl font-bold mb-1"
        style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Order Tracking
      </h1>
      {order && (
        <p className="text-xs mb-6" style={{ color: "rgba(29,43,31,0.35)" }}>
          #{order.orderNumber || order._id?.slice(-6) || "000000"}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(15,81,50,0.2)", borderTopColor: "#0F5132" }}
          />
        </div>
      ) : !order ? (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "rgba(29,43,31,0.4)" }}>
            Order not found
          </p>
        </div>
      ) : (
        <>
          {/* Timeline */}
          <div className="rounded-3xl p-5 mb-5"
            style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
          >
            <div className="relative">
              {STAGES.map((stage, i) => {
                const currentIndex = getStageIndex(order.status);
                const isCompleted = i <= currentIndex;
                const isCurrent = i === currentIndex;
                const Icon = stage.icon;
                const isLast = i === STAGES.length - 1;

                return (
                  <div key={stage.key} className="flex gap-3 relative">
                    {/* Timeline line */}
                    {!isLast && (
                      <div
                        className="absolute left-[15px] top-[36px] w-[2px]"
                        style={{
                          height: "calc(100% + 4px)",
                          background: isCompleted ? "#0F5132" : "rgba(29,43,31,0.06)",
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className="w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: isCompleted ? (isCurrent ? "rgba(15,81,50,0.12)" : "#0F5132") : "rgba(29,43,31,0.04)",
                          border: isCompleted ? "none" : "1px solid rgba(29,43,31,0.06)",
                        }}
                      >
                        <Icon
                          size={14}
                          color={isCompleted ? (isCurrent ? "#0F5132" : "#fff") : "rgba(29,43,31,0.15)"}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                      <p className="text-xs font-semibold"
                        style={{
                          color: isCompleted ? "#0A3B2A" : "rgba(29,43,31,0.25)",
                          marginTop: "5px",
                        }}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[10px] mt-0.5 font-medium"
                          style={{ color: "#0F5132" }}
                        >
                          {order.status === 'delivered' ? 'Delivered successfully' : 'In progress'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-3xl p-4 mb-5"
            style={{
              background: "rgba(15,81,50,0.04)",
              border: "1px solid rgba(15,81,50,0.06)",
            }}
          >
            <div className="flex items-start gap-3">
              <MapPin size={15} color="#0F5132" className="mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#1D2B1F" }}>
                  Delivery Address
                </p>
                <p className="text-[10px] leading-relaxed" style={{ color: "rgba(29,43,31,0.5)" }}>
                  {order.address || order.deliveryAddress || "Home delivery address"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          {order.items && order.items.length > 0 && (
            <div className="rounded-3xl p-4 mb-8"
              style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "#0A3B2A" }}>
                Items ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span style={{ color: "#1D2B1F" }}>
                      {item.title || item.name || "Product"} × {item.quantity || 1}
                    </span>
                    <span style={{ color: "rgba(29,43,31,0.5)" }}>
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-bold mt-3 pt-2"
                style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
              >
                <span style={{ color: "#0A3B2A" }}>Total</span>
                <span style={{ color: "#0F5132" }}>₹{order.totalAmount || order.total || 0}</span>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
