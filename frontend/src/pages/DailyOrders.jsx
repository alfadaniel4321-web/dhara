import React, { useState } from "react";
import {
  ShoppingBag, Clock, RefreshCw, ChevronRight, Package, CheckCircle, Truck
} from "lucide-react";

const TODAY_ORDERS = [
  { id: "ORD-001", items: ["Kuttanad Duck Eggs", "Fresh Tapioca"], total: 117, status: "Out for Delivery", time: "07:30 AM", eta: "08:15 AM", deliveryBy: "Raju" },
  { id: "ORD-002", items: ["Organic Tomato", "Farm Fresh Milk"], total: 90, status: "Preparing", time: "08:00 AM", eta: "09:00 AM", deliveryBy: "Suresh" },
  { id: "ORD-003", items: ["Country Chicken", "Green Chilli"], total: 295, status: "Delivered", time: "06:45 AM", eta: "07:15 AM", deliveryBy: "Raju" },
  { id: "ORD-004", items: ["Coconut Oil", "Raw Honey"], total: 530, status: "Confirmed", time: "09:30 AM", eta: "10:30 AM", deliveryBy: "Suresh" },
];

const STATUS_STYLES = {
  "Delivered": { bg: "#EBF5EB", color: "#2D6A4F", icon: CheckCircle },
  "Out for Delivery": { bg: "#E8F4FD", color: "#1A73E8", icon: Truck },
  "Preparing": { bg: "#FFF8E7", color: "#D4A017", icon: Package },
  "Confirmed": { bg: "#F4F6F3", color: "#777", icon: Clock },
};

export default function DailyOrders() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Active", "Delivered"];

  const filtered = filter === "All" ? TODAY_ORDERS : filter === "Active" ? TODAY_ORDERS.filter(o => o.status !== "Delivered") : TODAY_ORDERS.filter(o => o.status === "Delivered");

  const totalAmount = TODAY_ORDERS.filter(o => o.status !== "Delivered").reduce((sum, o) => sum + o.total, 0);
  const totalItems = TODAY_ORDERS.filter(o => o.status !== "Delivered").reduce((sum, o) => sum + o.items.length, 0);

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
            { label: "Pending Orders", value: TODAY_ORDERS.filter(o => o.status !== "Delivered").length },
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
          const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES["Confirmed"];
          const StatusIcon = statusInfo.icon;
          return (
            <div key={order.id} style={{
              background: "white", borderRadius: "16px", padding: "1.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.9rem" }}>{order.id}</div>
                  <div style={{ fontSize: "0.75rem", color: "#777" }}>{order.time} — ETA: {order.eta}</div>
                </div>
                <span style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  background: statusInfo.bg, color: statusInfo.color,
                  padding: "0.3rem 0.7rem", borderRadius: "999px",
                  fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  <StatusIcon size={12} />
                  {order.status}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {order.items.map((item, i) => (
                  <span key={i} style={{
                    background: "#F4F6F3", padding: "0.25rem 0.7rem", borderRadius: "999px",
                    fontSize: "0.72rem", color: "#555",
                  }}>{item}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F4F6F3", paddingTop: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "#777" }}>Delivery by </span>
                  <span style={{ fontWeight: 600, fontSize: "0.8rem", color: "#013220" }}>{order.deliveryBy}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontWeight: 800, color: "#013220", fontSize: "1.1rem" }}>₹{order.total}</span>
                  <button style={{
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
