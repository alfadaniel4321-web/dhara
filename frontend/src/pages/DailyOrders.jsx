import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileOrders from "./MobileOrders";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import {
  ShoppingBag, Clock, RefreshCw, Package, CheckCircle, Truck
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_STYLES = {
  "Delivered": { bg: "#EBF5EB", color: "#2D6A4F", icon: CheckCircle },
  "In Transit": { bg: "#E8F4FD", color: "#1A73E8", icon: Truck },
  "Processing": { bg: "#FFF8E7", color: "#D4A017", icon: Package },
  "Pending": { bg: "#F4F6F3", color: "#777", icon: Clock },
};

export default function DailyOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Active", "Delivered"];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getOrders();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleReorder = async (order) => {
    try {
      for (const item of (order.products || [])) {
        await api.cart.addToCart(item.productId || item._id, item.count || 1);
      }
      dispatch(setCartSuccess(true));
      navigate('/cart');
    } catch (err) {
      console.error('Failed to reorder', err);
    }
  };

  const filtered = filter === "All" ? orders : filter === "Active" ? orders.filter(o => o.orderStatus !== "Delivered") : orders.filter(o => o.orderStatus === "Delivered");

  const totalAmount = orders.filter(o => o.orderStatus !== "Delivered").reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalItems = orders.filter(o => o.orderStatus !== "Delivered").reduce((sum, o) => sum + (o.products?.length || 0), 0);

  if (loading) return <LoadingSpinner />;

  if (isMobile) return <MobileOrders />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
          <ShoppingBag size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Daily Orders</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Today's deliveries at a glance</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "Pending Orders", value: orders.filter(o => o.orderStatus !== "Delivered").length },
            { label: "Total Items", value: totalItems },
            { label: "Total Amount", value: `₹${totalAmount}` },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "0.75rem 1.25rem", flex: 1, minWidth: "120px",
            }}>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, marginBottom: "4px" }}>{s.label}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: "16px", padding: "0.75rem",
        display: "flex", gap: "0.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flex: 1, padding: "0.6rem", borderRadius: "10px", border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "0.8rem", transition: "all 0.2s",
            background: filter === f ? "#013220" : "transparent",
            color: filter === f ? "white" : "#666",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filtered.map(order => {
          const status = order.orderStatus || "Pending";
          const statusInfo = STATUS_STYLES[status] || STATUS_STYLES["Pending"];
          const StatusIcon = statusInfo.icon;
          return (
            <div key={order.id || order._id} style={{
              background: "white", borderRadius: "16px", padding: "1.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.9rem" }}>#{order.id || order._id}</div>
                  <div style={{ fontSize: "0.75rem", color: "#777" }}>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <span style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  background: statusInfo.bg, color: statusInfo.color,
                  padding: "0.3rem 0.7rem", borderRadius: "999px",
                  fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  <StatusIcon size={12} />
                  {status}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {(order.products || []).map((item, i) => (
                  <span key={i} style={{
                    background: "#F4F6F3", padding: "0.25rem 0.7rem", borderRadius: "999px",
                    fontSize: "0.72rem", color: "#555",
                  }}>{item.title || item.productId} x{item.count}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F4F6F3", paddingTop: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "#777" }}>{order.deliveryTime || 'Morning'} delivery</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontWeight: 800, color: "#013220", fontSize: "1.1rem" }}>₹{order.totalPrice || 0}</span>
                  <button onClick={() => handleReorder(order)} style={{
                    display: "flex", alignItems: "center", gap: "4px", background: "#EBF5EB", color: "#013220",
                    border: "none", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer",
                    fontWeight: 600, fontSize: "0.75rem",
                  }}>
                    <RefreshCw size={12} /> Reorder
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
          <ShoppingBag size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>No orders found</div>
          <div style={{ fontSize: "0.85rem" }}>Start ordering from nearby farms</div>
        </div>
      )}
    </div>
  );
}
