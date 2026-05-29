import React, { useState } from "react";
import {
  Users, Search, Star, Mail, UserPlus, ChevronRight, MapPin, Award
} from "lucide-react";

const FARMERS = [
  { id: 1, name: "Madhavan Nair", age: 54, experience: "28 yrs", specialty: "Dairy & Eggs", rating: 4.9, reviews: 32, crops: ["Duck Eggs", "Milk", "Curd"], location: "Kuttanad", followed: false, image: null },
  { id: 2, name: "Devika Rajan", age: 38, experience: "15 yrs", specialty: "Organic Vegetables", rating: 4.8, reviews: 28, crops: ["Tomato", "Spinach", "Chilli"], location: "Idukki", followed: true, image: null },
  { id: 3, name: "Anil Kumar", age: 45, experience: "20 yrs", specialty: "Fruits & Spices", rating: 4.7, reviews: 21, crops: ["Banana", "Papaya", "Coconut"], location: "Palakkad", followed: false, image: null },
  { id: 4, name: "Saraswati Menon", age: 42, experience: "18 yrs", specialty: "Fresh Milk & Curd", rating: 5.0, reviews: 45, crops: ["Milk", "Curd", "Buttermilk"], location: "Kozhikode", followed: true, image: null },
  { id: 5, name: "Rajesh Pillai", age: 50, experience: "25 yrs", specialty: "Rice & Grains", rating: 4.6, reviews: 18, crops: ["Kuttanad Rice", "Wheat"], location: "Alappuzha", followed: false, image: null },
  { id: 6, name: "Lekshmi Varma", age: 35, experience: "12 yrs", specialty: "Honey & Herbs", rating: 4.9, reviews: 37, crops: ["Raw Honey", "Herbal Tea", "Turmeric"], location: "Wayanad", followed: false, image: null },
  { id: 7, name: "Suresh Chandran", age: 48, experience: "22 yrs", specialty: "Free Range Poultry", rating: 4.7, reviews: 24, crops: ["Country Chicken", "Eggs"], location: "Thrissur", followed: true, image: null },
  { id: 8, name: "Geetha Nambiar", age: 40, experience: "16 yrs", specialty: "Organic Spices", rating: 4.8, reviews: 29, crops: ["Coconut Oil", "Pepper", "Cardamom"], location: "Munnar", followed: false, image: null },
];

export default function Farmers() {
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState(FARMERS);

  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.specialty.toLowerCase().includes(search.toLowerCase()) ||
    f.location.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (id) => {
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, followed: !f.followed } : f));
  };

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
          <div key={f.id} style={{
            background: "white", borderRadius: "16px", padding: "1.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                width: "70px", height: "70px", borderRadius: "16px",
                background: "linear-gradient(135deg,#EBF5EB,#D5ECD5)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, color: "#013220", flexShrink: 0,
              }}>
                {f.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#013220", fontSize: "1.05rem" }}>{f.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#777" }}>{f.age} yrs · {f.experience} exp</div>
                  </div>
                  <button onClick={() => toggleFollow(f.id)} style={{
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
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#013220" }}>{f.rating}</span>
                  <span style={{ fontSize: "0.7rem", color: "#777" }}>({f.reviews} reviews)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px", fontSize: "0.75rem", color: "#6A994E" }}>
                  <MapPin size={10} /> {f.location}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontSize: "0.75rem", fontWeight: 600, color: "#013220" }}>
                <Award size={14} color="#6A994E" /> {f.specialty}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {f.crops.map((crop, i) => (
                  <span key={i} style={{
                    background: "#EBF5EB", padding: "0.2rem 0.6rem", borderRadius: "999px",
                    fontSize: "0.68rem", color: "#013220", fontWeight: 500,
                  }}>{crop}</span>
                ))}
              </div>
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
