import React, { useState, useEffect } from "react";
import { RefreshCw, Calendar, Check, Clock, Plus, Minus } from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Subscription() {
  const [activeTab, setActiveTab] = useState("plans");
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await api.subscriptions.getSubscriptions();
      setSubs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const toggleStatus = async (id) => {
    const sub = subs.find(s => s.id === id || s._id === id);
    const newStatus = sub?.status === "active" ? "paused" : "active";
    try {
      await api.subscriptions.updateSubscriptionStatus(id, { status: newStatus });
      loadSubscriptions();
    } catch (err) {
      console.error(err);
    }
  };

  const hasDeliveryOnDay = (day) => {
    return subs.some(s => {
      if (s.status !== "active") return false;
      if (s.subscriptionType === "Daily") return true;
      if (s.subscriptionType === "Mon-Wed-Fri" && ["Mon", "Wed", "Fri"].includes(day)) return true;
      if (s.subscriptionType === "Weekly" && day === "Mon") return true;
      return false;
    });
  };

  if (loading) return <LoadingSpinner />;

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
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
          <RefreshCw size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>Subscription Plans</div>
          <div style={{ fontSize: "0.85rem" }}>Browse plans available from our farmers</div>
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
                <div key={sub.id || sub._id} style={{
                  background: "white", borderRadius: "16px", padding: "1.5rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.95rem" }}>{sub.subscriptionType || 'Subscription'}</div>
                      <div style={{ fontSize: "0.78rem", color: "#777" }}>₹{sub.totalPrice || 0}/mo</div>
                    </div>
                    <span style={{
                      background: sub.status === "active" ? "#EBF5EB" : "#F4F6F3",
                      color: sub.status === "active" ? "#2D6A4F" : "#999",
                      padding: "0.25rem 0.7rem", borderRadius: "999px",
                      fontSize: "0.65rem", fontWeight: 700,
                    }}>{sub.status === "active" ? "Active" : "Paused"}</span>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "#666", marginBottom: "0.75rem" }}>
                    <div><Calendar size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> {sub.deliveryTime || 'Morning'}</div>
                    <div><Clock size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> {sub.subscriptionType}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => toggleStatus(sub.id || sub._id)} style={{
                      flex: 1, padding: "0.6rem", borderRadius: "10px", border: "none", cursor: "pointer",
                      fontWeight: 700, fontSize: "0.75rem",
                      background: sub.status === "active" ? "#FFF8E7" : "#013220",
                      color: sub.status === "active" ? "#D4A017" : "white",
                    }}>{sub.status === "active" ? "Pause" : "Resume"}</button>
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
