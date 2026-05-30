import { useState, useEffect } from "react";
import {
  Users, Search, Star, Mail, Phone, UserPlus, ChevronRight, MapPin, Award, X, MessageCircle
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Farmers() {
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactFarmer, setContactFarmer] = useState(null);
  const [profileFarmer, setProfileFarmer] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

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

  useEffect(() => { loadFarmers(); }, []);

  const filtered = farmers.filter(f =>
    (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.village || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.district || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (id) => {
    setFarmers(prev => prev.map(f => (f.id === id || f._id === id) ? { ...f, followed: !f.followed } : f));
  };

  if (loading) return <LoadingSpinner />;

  const contactInfo = contactFarmer ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem 1rem", background: "#F4F6F3", borderRadius: "10px" }}>
        <Mail size={16} color="#2D6A4F" />
        <a href={`mailto:${contactFarmer.email}`} style={{ color: "#013220", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>{contactFarmer.email}</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem 1rem", background: "#F4F6F3", borderRadius: "10px" }}>
        <Phone size={16} color="#2D6A4F" />
        <a href={`tel:${contactFarmer.phone}`} style={{ color: "#013220", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>{contactFarmer.phone}</a>
      </div>
    </div>
  ) : null;

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
          <input type="text" placeholder="Search farmers by name or location..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width: "100%", background: "#F4F6F3", border: "1px solid #E0EAE0", borderRadius: "999px",
            padding: "0.8rem 1rem 0.8rem 2.8rem", outline: "none", fontSize: "0.9rem", color: "#000", boxSizing: "border-box",
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
                {(f.village || f.district) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px", fontSize: "0.75rem", color: "#6A994E" }}>
                    <MapPin size={10} /> {[f.village, f.district].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </div>

            {f.description && (
              <div style={{ marginBottom: "1rem", fontSize: "0.8rem", color: "#666", lineHeight: 1.5 }}>
                {f.description}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setContactFarmer(f)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "#013220", color: "white", border: "none", borderRadius: "10px",
                padding: "0.65rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem",
                transition: "all 0.2s",
              }}>
                <Mail size={14} /> Contact
              </button>
              <button onClick={async () => {
                setProfileFarmer(f);
                setProductsLoading(true);
                try {
                  const all = await api.products.getProducts();
                  const mine = (Array.isArray(all) ? all : []).filter(p => {
                    const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
                    return fId === (f.id || f._id);
                  });
                  setFarmerProducts(mine);
                } catch (e) {
                  setFarmerProducts([]);
                } finally {
                  setProductsLoading(false);
                }
              }} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "#EBF5EB", color: "#013220", border: "none", borderRadius: "10px",
                padding: "0.65rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem",
                transition: "all 0.2s",
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

      {profileFarmer && (
        <>
          <div onClick={() => { setProfileFarmer(null); setFarmerProducts([]); }} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999,
          }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "90%", maxWidth: "520px", maxHeight: "85vh", overflowY: "auto",
            background: "white", borderRadius: "20px", padding: "2rem", zIndex: 1000,
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: "linear-gradient(135deg,#EBF5EB,#D5ECD5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", fontWeight: 700, color: "#013220",
                }}>
                  {profileFarmer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "1.05rem" }}>{profileFarmer.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <Star size={12} fill="#D4A017" color="#D4A017" />
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#D4A017" }}>{profileFarmer.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setProfileFarmer(null); setFarmerProducts([]); }} style={{
                background: "#F4F6F3", border: "none", borderRadius: "10px",
                padding: "0.4rem", cursor: "pointer", display: "flex",
              }}>
                <X size={18} color="#666" />
              </button>
            </div>

            {(profileFarmer.village || profileFarmer.district) && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem", fontSize: "0.85rem", color: "#6A994E" }}>
                <MapPin size={14} />
                {[profileFarmer.village, profileFarmer.district].filter(Boolean).join(", ")}
              </div>
            )}

            {profileFarmer.description && (
              <div style={{
                background: "#F4F6F3", borderRadius: "12px", padding: "1rem",
                fontSize: "0.85rem", color: "#444", lineHeight: 1.6, marginBottom: "1.5rem",
              }}>
                {profileFarmer.description}
              </div>
            )}

            <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={16} color="#2D6A4F" /> Products
            </div>

            {productsLoading ? (
              <div style={{ textAlign: "center", padding: "1rem", color: "#777", fontSize: "0.85rem" }}>Loading products...</div>
            ) : farmerProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1rem", color: "#999", fontSize: "0.8rem" }}>No products listed yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {farmerProducts.map(p => (
                  <div key={p._id || p.id} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "0.65rem 1rem", background: "#F4F6F3", borderRadius: "10px",
                  }}>
                    {p.image && (
                      <img src={p.image} alt={p.title} style={{
                        width: 36, height: 36, borderRadius: "8px", objectFit: "cover",
                      }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#013220", fontSize: "0.85rem" }}>{p.title}</div>
                      <div style={{ fontSize: "0.72rem", color: "#777" }}>{p.category} · ₹{p.price}/{p.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {contactFarmer && (
        <>
          <div onClick={() => setContactFarmer(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999,
          }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "90%", maxWidth: "440px", maxHeight: "85vh", overflowY: "auto",
            background: "white", borderRadius: "20px", padding: "2rem", zIndex: 1000,
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: "linear-gradient(135deg,#EBF5EB,#D5ECD5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", fontWeight: 700, color: "#013220",
                }}>
                  {contactFarmer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "1.05rem" }}>{contactFarmer.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <Star size={12} fill="#D4A017" color="#D4A017" />
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#D4A017" }}>{contactFarmer.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setContactFarmer(null)} style={{
                background: "#F4F6F3", border: "none", borderRadius: "10px",
                padding: "0.4rem", cursor: "pointer", display: "flex",
              }}>
                <X size={18} color="#666" />
              </button>
            </div>

            {(contactFarmer.village || contactFarmer.district) && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem", fontSize: "0.85rem", color: "#6A994E" }}>
                <MapPin size={14} />
                {[contactFarmer.village, contactFarmer.district].filter(Boolean).join(", ")}
              </div>
            )}

            {contactFarmer.description && (
              <div style={{
                background: "#F4F6F3", borderRadius: "12px", padding: "1rem",
                fontSize: "0.85rem", color: "#444", lineHeight: 1.6, marginBottom: "1.5rem",
              }}>
                {contactFarmer.description}
              </div>
            )}

            <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Contact Information
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
              <a href={`mailto:${contactFarmer.email}`} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "0.75rem 1rem", background: "#F4F6F3", borderRadius: "10px",
                textDecoration: "none", color: "#013220", fontWeight: 600, fontSize: "0.9rem",
              }}>
                <Mail size={16} color="#2D6A4F" /> {contactFarmer.email}
              </a>
              <a href={`tel:${contactFarmer.phone}`} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "0.75rem 1rem", background: "#F4F6F3", borderRadius: "10px",
                textDecoration: "none", color: "#013220", fontWeight: 600, fontSize: "0.9rem",
              }}>
                <Phone size={16} color="#2D6A4F" /> {contactFarmer.phone}
              </a>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a href={`mailto:${contactFarmer.email}`} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "#013220", color: "white", border: "none", borderRadius: "10px",
                padding: "0.75rem", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem",
                textDecoration: "none",
              }}>
                <Mail size={16} /> Send Email
              </a>
              <a href={`tel:${contactFarmer.phone}`} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "#EBF5EB", color: "#013220", border: "none", borderRadius: "10px",
                padding: "0.75rem", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem",
                textDecoration: "none",
              }}>
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
