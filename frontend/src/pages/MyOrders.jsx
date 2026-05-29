import React, { useState, useEffect } from "react";
import {
  Package, Search, ChevronRight, Clock, CheckCircle, XCircle, RefreshCw, FileText, Truck
} from "lucide-react";
import { api } from "../services/api";

const STATUS_STYLES = {
  "Delivered": { bg: "#EBF5EB", color: "#2D6A4F", icon: CheckCircle },
  "Out for Delivery": { bg: "#E8F4FD", color: "#1A73E8", icon: Truck },
  "Preparing": { bg: "#FFF8E7", color: "#D4A017", icon: Clock },
  "Cancelled": { bg: "#FEE2E2", color: "#DC2626", icon: XCircle },
};

const TABS = ["All", "Active", "Delivered", "Cancelled"];

export default function MyOrders() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await api.orders.getOrders();
      const mapped = data.map(o => ({
        id: o.id || o._id,
        date: new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: o.orderStatus === 'Pending' ? 'Preparing' : (o.orderStatus || 'Preparing'),
        items: (o.products || []).map(p => p.title || 'Item'),
        total: o.totalPrice,
        payment: o.paymentStatus === 'Paid' ? 'Paid' : 'COD',
      }));
      setOrders(mapped);
    } catch (err) {
      console.error('Failed to load orders', err);
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
    const matchTab = tab === "All" || tab === "Active" ? (tab === "Active" ? o.status !== "Delivered" && o.status !== "Cancelled" : true) : o.status === tab;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.items.some(i => i.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const getStatusIcon = (status) => {
    const s = STATUS_STYLES[status] || STATUS_STYLES["Preparing"];
    const Icon = s.icon;
    return <Icon size={12} />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "clamp(1rem, 3vw, 2.5rem)" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "clamp(1.25rem, 3vw, 2.5rem)", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Package size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, margin: 0 }}>My Orders</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Track and manage all your orders</p>
          </div>
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: "16px", padding: "1.25rem",
        display: "flex", flexDirection: "column", gap: "0.75rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color="#6A994E" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Search by order ID or items..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width: "100%", background: "#F4F6F3", border: "1px solid #E0EAE0", borderRadius: "999px",
            padding: "0.8rem 1rem 0.8rem 2.8rem", outline: "none", fontSize: "0.9rem", boxSizing: "border-box", color: "#000",
          }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "0.45rem", borderRadius: "10px", border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: "0.78rem", transition: "all 0.2s",
              background: tab === t ? "#013220" : "#F4F6F3",
              color: tab === t ? "white" : "#555",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filtered.map(order => {
          const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES["Preparing"];
          return (
            <div key={order.id} style={{
              background: "white", borderRadius: "16px", padding: "clamp(1rem, 2vw, 1.5rem)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#013220", fontSize: "0.9rem" }}>{order.id}</span>
                  <span style={{ fontSize: "0.72rem", color: "#999", marginLeft: "8px" }}>{order.date}</span>
                </div>
                <span style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  background: statusInfo.bg, color: statusInfo.color,
                  padding: "0.25rem 0.7rem", borderRadius: "999px",
                  fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                {order.items.map((item, i) => (
                  <span key={i} style={{
                    background: "#F4F6F3", padding: "0.2rem 0.6rem", borderRadius: "999px",
                    fontSize: "0.72rem", color: "#555",
                  }}>{item}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F4F6F3", paddingTop: "0.75rem" }}>
                <div>
                  <span style={{ fontWeight: 800, color: "#013220", fontSize: "1.1rem" }}>₹{order.total}</span>
                  <span style={{ fontSize: "0.7rem", color: "#999", marginLeft: "6px" }}>· {order.payment}</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {order.status !== "Cancelled" && (
                    <button style={{
                      display: "flex", alignItems: "center", gap: "4px", background: "#EBF5EB", color: "#013220",
                      border: "none", borderRadius: "10px", padding: "0.45rem 0.9rem", cursor: "pointer",
                      fontWeight: 600, fontSize: "0.7rem",
                    }}>
                      <RefreshCw size={12} /> Reorder
                    </button>
                  )}
                  {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <button onClick={() => handleCancelOrder(order.id)} style={{
                      display: "flex", alignItems: "center", gap: "4px", background: "#FEE2E2", color: "#DC2626",
                      border: "none", borderRadius: "10px", padding: "0.45rem 0.9rem", cursor: "pointer",
                      fontWeight: 600, fontSize: "0.7rem",
                    }}>
                      <XCircle size={12} /> Cancel
                    </button>
                  )}
                  <button style={{
                    display: "flex", alignItems: "center", gap: "4px", background: "#013220", color: "white",
                    border: "none", borderRadius: "10px", padding: "0.45rem 0.9rem", cursor: "pointer",
                    fontWeight: 600, fontSize: "0.7rem",
                  }}>
                    <FileText size={12} /> Invoice
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
          <Package size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>No orders yet</div>
          <div style={{ fontSize: "0.85rem" }}>Your order history will appear here</div>
        </div>
      )}
    </div>
  );
}
