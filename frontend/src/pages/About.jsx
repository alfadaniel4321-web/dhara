import React from "react";
import { Info, Leaf, Users, ShieldCheck, Award, Heart, ChevronRight } from "lucide-react";

const STATS = [
  { value: "980+", label: "Verified Farmers", icon: Users },
  { value: "50K+", label: "Happy Customers", icon: Heart },
  { value: "15K+", label: "Daily Deliveries", icon: ShieldCheck },
  { value: "4.9★", label: "Avg. Rating", icon: Award },
];

const TEAM = [
  { name: "Arun Nair", role: "Founder & CEO", initial: "AN" },
  { name: "Priya Menon", role: "Head of Operations", initial: "PM" },
  { name: "Sachin Raj", role: "Technology Lead", initial: "SR" },
  { name: "Lakshmi Varma", role: "Community Manager", initial: "LV" },
];

export default function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
          <Info size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>About Dhara</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Connecting Kerala's farmers directly to your table</p>
          </div>
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: "16px", padding: "1.75rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
          <Leaf size={22} color="#6A994E" />
          <h2 style={{ color: "#013220", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Our Mission</h2>
        </div>
        <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>
          Dhara was established in 2026 to resolve logistics barriers for small-scale Kerala farmers. 
          By introducing an AI-enabled Freshness Rating algorithm, direct timeline tracking, and routine 
          daily delivery schedules, we guarantee that consumers receive products within hours of harvest.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7, marginTop: "0.75rem" }}>
          All produce listed on Dhara is handled directly by the farmer. We enforce zero middlemen, 
          ensuring that farmers receive 100% of their listed price while buyers receive authentic organic harvests.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem",
      }}>
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{
              background: "white", borderRadius: "16px", padding: "1.5rem", textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px", background: "#EBF5EB",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem",
              }}>
                <Icon size={20} color="#013220" />
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#013220" }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: "#777", marginTop: "2px" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: "white", borderRadius: "16px", padding: "1.75rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
          <Users size={22} color="#6A994E" />
          <h2 style={{ color: "#013220", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Our Team</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {TEAM.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "#F8FAF8", borderRadius: "12px", padding: "0.85rem",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px", background: "#013220",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 700, color: "white", flexShrink: 0,
              }}>{t.initial}</div>
              <div>
                <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem" }}>{t.name}</div>
                <div style={{ fontSize: "0.7rem", color: "#6A994E" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: "#FFF8E7", border: "1px solid #F0D080", borderRadius: "16px",
        padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.95rem", marginBottom: "4px" }}>
            Want to partner with us?
          </div>
          <div style={{ fontSize: "0.8rem", color: "#666" }}>
            Join 980+ farmers already on Dhara. Sell directly to customers in your area.
          </div>
        </div>
        <button style={{
          background: "#013220", color: "white", border: "none", borderRadius: "10px",
          padding: "0.7rem 1.3rem", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap",
        }}>
          Become a Partner <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
