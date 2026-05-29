import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { Clock, Calendar, Sprout, CheckCircle } from "lucide-react";

const CROPS = [
  { id: 1, name: "Kuttanad Rice", icon: "🌾", progress: 85, readyIn: "3 days", status: "Harvesting", expectedDate: "May 31, 2026", farm: "Madhavan Nair", color: "#D4A017", price: 85, quantity: "5 Kg" },
  { id: 2, name: "Organic Tomato", icon: "🍅", progress: 60, readyIn: "12 days", status: "Growing", expectedDate: "Jun 9, 2026", farm: "Devika Rajan", color: "#E74C3C", price: 35, quantity: "1 Kg" },
  { id: 3, name: "Fresh Papaya", icon: "🥭", progress: 40, readyIn: "18 days", status: "Growing", expectedDate: "Jun 15, 2026", farm: "Anil Kumar", color: "#F39C12", price: 40, quantity: "1 Kg" },
  { id: 4, name: "Banana", icon: "🍌", progress: 90, readyIn: "2 days", status: "Harvesting", expectedDate: "May 30, 2026", farm: "Saraswati Menon", color: "#F1C40F", price: 30, quantity: "1 Dozen" },
  { id: 5, name: "Green Chilli", icon: "🌶️", progress: 25, readyIn: "22 days", status: "Planting", expectedDate: "Jun 19, 2026", farm: "Lekshmi Varma", color: "#2ECC71", price: 60, quantity: "250 g" },
  { id: 6, name: "Coconut", icon: "🥥", progress: 75, readyIn: "7 days", status: "Growing", expectedDate: "Jun 4, 2026", farm: "Rajesh Pillai", color: "#8B4513", price: 25, quantity: "3 Nos" },
];

const STATUS_COLORS = {
  Harvesting: "#2D6A4F",
  Growing: "#6A994E",
  Planting: "#A3C87A",
};

export default function HarvestCountdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" });
  const [preOrdered, setPreOrdered] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      setCountdown({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePreOrder = (crop) => {
    if (preOrdered[crop.id]) return;
    setPreOrdered(prev => ({ ...prev, [crop.id]: true }));
    dispatch(setCartSuccess({
      products: [{
        id: crop.id,
        title: crop.name,
        image: null,
        price: crop.price,
        quantity: crop.quantity,
        count: 1,
      }],
      totalPrice: crop.price,
    }));
    setMessage(`${crop.name} added to pre-order successfully!`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
          <Clock size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Harvest Countdown</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Track when your favorite crops will be ready</p>
          </div>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.25)", borderRadius: "14px", padding: "1.25rem 2rem",
          display: "inline-flex", alignItems: "center", gap: "1.5rem",
        }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>NEXT HARVEST IN</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "monospace" }}>
            {countdown.h} : {countdown.m} : {countdown.s}
          </span>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem",
      }}>
        {CROPS.map(crop => (
          <div key={crop.id} style={{
            background: "white", borderRadius: "16px", padding: "1.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "2rem" }}>{crop.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "1rem" }}>{crop.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#777" }}>{crop.farm}</div>
                </div>
              </div>
              <span style={{
                background: STATUS_COLORS[crop.status] + "20",
                color: STATUS_COLORS[crop.status],
                padding: "0.25rem 0.7rem", borderRadius: "999px",
                fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap",
              }}>
                {crop.status}
              </span>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#777", marginBottom: "6px" }}>
                <span>Progress</span>
                <span style={{ fontWeight: 700, color: "#013220" }}>{crop.progress}%</span>
              </div>
              <div style={{ height: "8px", background: "#F4F6F3", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${crop.progress}%`, borderRadius: "999px",
                  background: `linear-gradient(90deg, ${crop.color}88, ${crop.color})`,
                  transition: "width 1s ease",
                }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6A994E", fontWeight: 600 }}>
                <Clock size={14} />
                {crop.readyIn}
              </div>
              <button
                onClick={() => handlePreOrder(crop)}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  background: preOrdered[crop.id] ? "#EBF5EB" : "#013220",
                  color: preOrdered[crop.id] ? "#013220" : "white",
                  border: "none", borderRadius: "10px",
                  padding: "0.4rem 0.8rem", cursor: preOrdered[crop.id] ? "default" : "pointer",
                  fontWeight: 700, fontSize: "0.72rem", whiteSpace: "nowrap",
                }}
              >
                {preOrdered[crop.id] ? <><CheckCircle size={12} /> Pre-Ordered</> : "Pre-Order"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <div style={{
          background: "#EBF5EB", border: "1px solid #2D6A4F", borderRadius: "16px",
          padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <CheckCircle size={20} color="#2D6A4F" />
          <span style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem" }}>{message}</span>
        </div>
      )}

      <div style={{
        background: "#FFF8E7", border: "1px solid #F0D080", borderRadius: "16px",
        padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem",
        flexWrap: "wrap",
      }}>
        <Sprout size={20} color="#D4A017" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem", marginBottom: "4px" }}>
            Pre-order Available
          </div>
          <div style={{ fontSize: "0.78rem", color: "#666" }}>
            Reserve your harvest before it's ready. Pre-order now and get 10% off on first delivery.
          </div>
        </div>
        <button
          onClick={() => navigate("/products")}
          style={{
            background: "#013220", color: "white", border: "none",
            borderRadius: "10px", padding: "0.5rem 1rem", fontWeight: 700, fontSize: "0.75rem",
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >Browse Products</button>
      </div>
    </div>
  );
}
