import React, { useState, useEffect } from "react";
import {
  Users, Search, Star, Mail, UserPlus, ChevronRight, MapPin, Award
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Farmers() {
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const data = await api.auth.getFarmers();
      setFarmers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const filtered = farmers.filter(f =>
    (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.specialty || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (id) => {
    setFarmers(prev => prev.map(f => (f.id === id || f._id === id) ? { ...f, followed: !f.followed } : f));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Users size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Our Farmers</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Meet the people behind your fresh produce</p>
          </div>
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: "16px", padding: "1.25rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color="#6A994E" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Search farmers by location (e.g. Wayanad, Idukki, Thrissur)..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width: "100%", background: "#F4F6F3", border: "1px solid #E0EAE0", borderRadius: "999px",
            padding: "0.8rem 1rem 0.8rem 2.8rem", outline: "none", fontSize: "0.9rem", color: "#000",
          }} />
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem",
      }}>
        {filtered.map(f => (
          <div key={f.id || f._id} style={{
            background: "white", borderRadius: "16px", padding: "1.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                width: "70px", height: "70px", borderRadius: "16px",
                background: "linear-gradient(135deg,#EBF5EB,#D5ECD5)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, color: "#013220", flexShrink: 0,
              }}>
                {(f.name || "F").split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#013220", fontSize: "1.05rem" }}>{f.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#777" }}>{f.email}</div>
                  </div>
                  <button onClick={() => toggleFollow(f.id || f._id)} style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    background: f.followed ? "#EBF5EB" : "#013220",
                    color: f.followed ? "#013220" : "white",
                    border: "none", borderRadius: "10px", padding: "0.4rem 0.8rem",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.7rem",
                    transition: "all 0.2s",
                  }}>
                    <UserPlus size={12} /> {f.followed ? "Following" : "Follow"}
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                  <Star size={12} fill="#D4A017" color="#D4A017" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#013220" }}>{f.rating || "N/A"}</span>
                </div>
                {f.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px", fontSize: "0.75rem", color: "#6A994E" }}>
                    <MapPin size={10} /> {f.location}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              {f.specialty && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontSize: "0.75rem", fontWeight: 600, color: "#013220" }}>
                  <Award size={14} color="#6A994E" /> {f.specialty}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "#013220", color: "white", border: "none", borderRadius: "10px",
                padding: "0.65rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem",
              }}>
                <Mail size={14} /> Contact
              </button>
              <button style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "#EBF5EB", color: "#013220", border: "none", borderRadius: "10px",
                padding: "0.65rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem",
              }}>
                View Profile <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
          <Users size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>No farmers found</div>
          <div style={{ fontSize: "0.85rem" }}>Try a different search term</div>
        </div>
      )}
    </div>
  );
}
