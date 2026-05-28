import React, { useState, useEffect } from "react";
import {
  Tag, Copy, Clock, Zap, ChevronRight, Gift, Sparkles, ShoppingBag
} from "lucide-react";

const COUPONS = [
  { code: "HARVEST15", discount: "15% OFF", minOrder: "₹200", validTill: "Jun 15, 2026", used: false, desc: "Fresh Harvest Season Sale" },
  { code: "FRESH10", discount: "10% OFF", minOrder: "₹100", validTill: "Jun 10, 2026", used: false, desc: "First Order Discount" },
  { code: "ORGANIC20", discount: "20% OFF", minOrder: "₹500", validTill: "Jun 20, 2026", used: true, desc: "Organic Products Special" },
  { code: "FARMFRESH", discount: "Free Delivery", minOrder: "₹150", validTill: "Jun 25, 2026", used: false, desc: "Free Delivery on All Orders" },
  { code: "WELCOME50", discount: "₹50 OFF", minOrder: "₹300", validTill: "Jul 1, 2026", used: false, desc: "Welcome Offer for New Users" },
  { code: "MONSOON25", discount: "25% OFF", minOrder: "₹750", validTill: "Jun 30, 2026", used: false, desc: "Monsoon Season Special" },
];

const DEALS = [
  { title: "Buy 2 Get 1 Free", desc: "On all dairy products", validTill: "Jun 5, 2026", icon: Gift, color: "#013220" },
  { title: "Free Delivery", desc: "On orders above ₹300", validTill: "Ongoing", icon: ShoppingBag, color: "#6A994E" },
  { title: "Combo Offer", desc: "Eggs + Milk at ₹99 only", validTill: "Jun 10, 2026", icon: Sparkles, color: "#D4A017" },
];

export default function Offers() {
  const [copied, setCopied] = useState(null);
  const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" });

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

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-20px", fontSize: "6rem", opacity: 0.08 }}>🎉</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Tag size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Offers & Deals</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Save big on farm fresh produce</p>
          </div>
        </div>
        <div style={{
          marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "1rem",
          background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "0.7rem 1.2rem",
        }}>
          <Zap size={16} color="#F1C40F" />
          <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Deals expire in</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "monospace" }}>
            {countdown.h}:{countdown.m}:{countdown.s}
          </span>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem",
      }}>
        {COUPONS.map((c, i) => (
          <div key={i} style={{
            background: c.used ? "#F9F9F9" : "white",
            borderRadius: "16px", padding: "1.5rem",
            boxShadow: c.used ? "none" : "0 4px 16px rgba(0,0,0,0.06)",
            border: c.used ? "1px solid #E0EAE0" : "none", opacity: c.used ? 0.6 : 1,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div style={{
                background: "#FFF8E7", border: "1px solid #F0D080", borderRadius: "10px",
                padding: "0.5rem 0.8rem", fontWeight: 800, fontSize: "0.85rem", color: "#B8860B",
                fontFamily: "monospace", letterSpacing: "0.05em",
              }}>
                {c.code}
              </div>
              {c.used && <span style={{
                fontSize: "0.65rem", color: "#999", background: "#F4F6F3",
                padding: "0.15rem 0.5rem", borderRadius: "999px",
              }}>Used</span>}
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#013220", marginBottom: "4px" }}>{c.discount}</div>
            <div style={{ fontSize: "0.75rem", color: "#6A994E", fontWeight: 500, marginBottom: "6px" }}>{c.desc}</div>
            <div style={{ fontSize: "0.68rem", color: "#999", marginBottom: "0.75rem" }}>
              Min. order {c.minOrder} · Valid till {c.validTill}
            </div>
            <button onClick={() => handleCopy(c.code)} style={{
              width: "100%", padding: "0.6rem", borderRadius: "10px", border: "none",
              cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", transition: "all 0.2s",
              background: copied === c.code ? "#2D6A4F" : c.used ? "#ccc" : "#013220",
              color: "white",
            }}>
              {copied === c.code ? "Copied!" : c.used ? "Unavailable" : "Copy Code"}
            </button>
          </div>
        ))}
      </div>

      <div>
        <h2 style={{ color: "#013220", fontSize: "1.1rem", marginBottom: "0.75rem", fontWeight: 700 }}>
          <Gift size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
          Seasonal Deals
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {DEALS.map((deal, i) => {
            const Icon = deal.icon;
            return (
              <div key={i} style={{
                background: "white", borderRadius: "16px", padding: "1.25rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", gap: "1rem",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: `${deal.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={24} color={deal.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.9rem" }}>{deal.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px" }}>{deal.desc}</div>
                  <div style={{ fontSize: "0.65rem", color: "#6A994E", marginTop: "4px", fontWeight: 600 }}>
                    {deal.validTill}
                  </div>
                </div>
                <ChevronRight size={18} color="#ccc" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
