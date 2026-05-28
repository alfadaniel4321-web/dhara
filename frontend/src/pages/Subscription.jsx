import React, { useState } from "react";
import { RefreshCw, Calendar, Check, Clock, Plus, Minus } from "lucide-react";

const PLANS = [
  { id: 1, name: "Daily Essentials", price: 149, items: ["1L Fresh Milk", "6 Duck Eggs", "500ml Curd"], delivery: "Daily", color: "#013220" },
  { id: 2, name: "Weekly Veggie Box", price: 299, items: ["Mixed Vegetables (3Kg)", "Fresh Herbs", "2Kg Rice"], delivery: "Mon-Wed-Fri", color: "#6A994E" },
  { id: 3, name: "Premium Family", price: 599, items: ["2L Fresh Milk", "12 Duck Eggs", "1L Coconut Oil", "1Kg Honey"], delivery: "Daily", color: "#D4A017" },
  { id: 4, name: "Fruit Lover", price: 199, items: ["Seasonal Fruits (2Kg)", "Coconut (3 Nos)", "Banana (1 Dozen)"], delivery: "Weekly", color: "#E74C3C" },
];

const ACTIVE_SUBS = [
  { id: 1, name: "Daily Essentials", plan: "Milk, Eggs, Curd", status: "Active", nextDelivery: "Tomorrow 7:00 AM", deliveriesLeft: 28, type: "Daily" },
  { id: 2, name: "Weekly Veggie Box", plan: "Vegetables, Herbs", status: "Active", nextDelivery: "Wed 7:30 AM", deliveriesLeft: 8, type: "Mon-Wed-Fri" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Subscription() {
  const [activeTab, setActiveTab] = useState("plans");
  const [subs, setSubs] = useState(ACTIVE_SUBS);

  const toggleStatus = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Paused" : "Active" } : s));
  };

  const hasDeliveryOnDay = (day) => {
    return subs.some(s => {
      if (s.status !== "Active") return false;
      if (s.type === "Daily") return true;
      if (s.type === "Mon-Wed-Fri" && ["Mon", "Wed", "Fri"].includes(day)) return true;
      if (s.type === "Weekly" && day === "Mon") return true;
      return false;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <RefreshCw size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Subscriptions</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Never run out of farm essentials</p>
          </div>
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: "16px", padding: "0.75rem",
        display: "flex", gap: "0.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        {[
          { id: "plans", label: "Plans" },
          { id: "active", label: "My Subscriptions" },
          { id: "calendar", label: "Calendar" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: "0.6rem", borderRadius: "10px", border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "0.78rem", transition: "all 0.2s",
            background: activeTab === tab.id ? "#013220" : "transparent",
            color: activeTab === tab.id ? "white" : "#666",
          }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "plans" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: "white", borderRadius: "16px", padding: "1.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                <div style={{
                  width: "12px", height: "12px", borderRadius: "50%", background: plan.color, flexShrink: 0,
                }} />
                <span style={{ fontWeight: 700, color: "#013220", fontSize: "1rem" }}>{plan.name}</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#013220", marginBottom: "0.75rem" }}>
                ₹{plan.price}<span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#777" }}>/month</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem", flex: 1 }}>
                {plan.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#555" }}>
                    <Check size={14} color="#6A994E" />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#6A994E", fontWeight: 600, marginBottom: "0.75rem" }}>
                <Clock size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                Delivery: {plan.delivery}
              </div>
              <button style={{
                width: "100%", background: "#013220", color: "white", border: "none",
                borderRadius: "10px", padding: "0.7rem", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
                transition: "all 0.2s",
              }}>Subscribe Now</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "active" && (
        <>
          {subs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
              <RefreshCw size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
              <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>No Active Subscriptions</div>
              <div style={{ fontSize: "0.85rem" }}>Browse plans and subscribe to get regular deliveries</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {subs.map(sub => (
                <div key={sub.id} style={{
                  background: "white", borderRadius: "16px", padding: "1.5rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.95rem" }}>{sub.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#777" }}>{sub.plan}</div>
                    </div>
                    <span style={{
                      background: sub.status === "Active" ? "#EBF5EB" : "#F4F6F3",
                      color: sub.status === "Active" ? "#2D6A4F" : "#999",
                      padding: "0.25rem 0.7rem", borderRadius: "999px",
                      fontSize: "0.65rem", fontWeight: 700,
                    }}>{sub.status}</span>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "#666", marginBottom: "0.75rem" }}>
                    <div><Calendar size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> Next: {sub.nextDelivery}</div>
                    <div><Clock size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> {sub.deliveriesLeft} deliveries left</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => toggleStatus(sub.id)} style={{
                      flex: 1, padding: "0.6rem", borderRadius: "10px", border: "none", cursor: "pointer",
                      fontWeight: 700, fontSize: "0.75rem",
                      background: sub.status === "Active" ? "#FFF8E7" : "#013220",
                      color: sub.status === "Active" ? "#D4A017" : "white",
                    }}>{sub.status === "Active" ? "Pause" : "Resume"}</button>
                    <button style={{
                      flex: 1, padding: "0.6rem", borderRadius: "10px", border: "none", cursor: "pointer",
                      fontWeight: 700, fontSize: "0.75rem", background: "#EBF5EB", color: "#013220",
                    }}>Manage</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "calendar" && (
        <div style={{
          background: "white", borderRadius: "16px", padding: "1.25rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{ color: "#013220", fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>Delivery Schedule</h3>
          <p style={{ fontSize: "0.75rem", color: "#777", marginBottom: "1rem" }}>Your weekly delivery calendar based on active subscriptions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
            {DAYS.map(day => {
              const delivery = hasDeliveryOnDay(day);
              return (
                <div key={day} style={{
                  textAlign: "center", padding: "0.75rem 0.4rem", borderRadius: "12px",
                  background: delivery ? "#EBF5EB" : "#F9F9F9",
                  border: delivery ? "1px solid #6A994E" : "1px solid #E0EAE0",
                }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: delivery ? "#013220" : "#999", marginBottom: "6px" }}>{day}</div>
                  {delivery ? <Check size={16} color="#2D6A4F" /> : <span style={{ color: "#ddd", fontSize: "0.8rem" }}>—</span>}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", fontSize: "0.72rem", color: "#777" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#EBF5EB", border: "1px solid #6A994E", display: "inline-block" }} /> Delivery Day
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#F9F9F9", border: "1px solid #E0EAE0", display: "inline-block" }} /> No Delivery
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
