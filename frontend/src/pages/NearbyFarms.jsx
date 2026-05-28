import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Search, Star, Navigation, ChevronRight, Filter
} from "lucide-react";

const FARMERS = [
  { id: 1, name: "Madhavan Nair", distance: "1.2 km", rating: 4.9, reviews: 32, specialty: "Dairy & Eggs", image: null, availability: "Open Now" },
  { id: 2, name: "Devika Rajan", distance: "2.4 km", rating: 4.8, reviews: 28, specialty: "Organic Vegetables", image: null, availability: "Open Now" },
  { id: 3, name: "Anil Kumar", distance: "3.1 km", rating: 4.7, reviews: 21, specialty: "Fruits & Spices", image: null, availability: "Open Now" },
  { id: 4, name: "Saraswati Menon", distance: "0.8 km", rating: 5.0, reviews: 45, specialty: "Fresh Milk & Curd", image: null, availability: "Open Now" },
  { id: 5, name: "Rajesh Pillai", distance: "4.2 km", rating: 4.6, reviews: 18, specialty: "Rice & Grains", image: null, availability: "Closed Today" },
  { id: 6, name: "Lekshmi Varma", distance: "2.9 km", rating: 4.9, reviews: 37, specialty: "Honey & Herbs", image: null, availability: "Open Now" },
];

const CATEGORIES = ["All", "Dairy", "Vegetables", "Fruits", "Eggs", "Spices"];

export default function NearbyFarms() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = FARMERS.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.specialty.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || f.specialty.includes(category);
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px",
        padding: "2rem 2.5rem",
        color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <MapPin size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Nearby Farms</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>Fresh produce from farms around you</p>
          </div>
        </div>
      </div>

      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color="#6A994E" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Search farms or specialties..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width: "100%", background: "#F4F6F3", border: "1px solid #E0EAE0", borderRadius: "999px",
            padding: "0.8rem 1rem 0.8rem 2.8rem", outline: "none", fontSize: "0.9rem",
          }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "0.5rem 1rem", borderRadius: "999px", border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: "0.78rem",
              background: category === cat ? "#013220" : "#F4F6F3",
              color: category === cat ? "white" : "#444",
              transition: "all 0.2s",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: "1.25rem",
      }}>
        {filtered.map(f => (
          <div key={f.id} style={{
            background: "white", borderRadius: "16px", padding: "clamp(1rem, 3vw, 1.5rem)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            display: "flex", gap: "1.25rem",
          }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "16px",
              background: "#EBF5EB", display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: "1.3rem",
              color: "#013220", flexShrink: 0,
            }}>
              {f.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "1rem" }}>{f.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <Star size={12} fill="#D4A017" color="#D4A017" />
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>{f.rating} ({f.reviews})</span>
                  </div>
                </div>
                <div style={{
                  background: "#EBF5EB", borderRadius: "8px", padding: "0.25rem 0.6rem",
                  fontSize: "0.7rem", fontWeight: 600, color: "#013220", whiteSpace: "nowrap",
                }}>
                  <Navigation size={10} style={{ display: "inline", marginRight: 2 }} />
                  {f.distance}
                </div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6A994E", marginTop: "6px", fontWeight: 500 }}>
                {f.specialty}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "10px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  fontSize: "0.7rem", fontWeight: 600,
                  color: f.availability === "Open Now" ? "#2D6A4F" : "#999",
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: f.availability === "Open Now" ? "#2D6A4F" : "#999",
                    display: "inline-block",
                  }} />
                  {f.availability}
                </span>
                <button
                  onClick={() => navigate('/chat')}
                  style={{
                  marginLeft: "auto", background: "#013220", color: "white", border: "none",
                  borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer",
                  fontWeight: 600, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px",
                  transition: "all 0.2s",
                }}>
                  Visit Farm <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
          <MapPin size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>No farms found</div>
          <div style={{ fontSize: "0.85rem" }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
