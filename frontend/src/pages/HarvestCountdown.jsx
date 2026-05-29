import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { api } from "../services/api";
import {
  Clock, Calendar, Sprout, CheckCircle, MapPin, Phone, User,
  ChevronRight, Leaf, Package, ArrowLeft, X, Truck, Star
} from "lucide-react";

const STATUS_COLORS = {
  Harvesting: "#2D6A4F",
  Growing: "#6A994E",
  Planting: "#A3C87A",
};

const STATUS_ICONS = {
  Harvesting: "🌿",
  Growing: "🌱",
  Planting: "🌾",
};

function getHarvestStatus(harvestDate) {
  const now = new Date();
  const harvest = new Date(harvestDate);
  const diffMs = harvest - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) return { status: "Harvesting", daysLeft: 0, progress: 100 };
  if (daysLeft <= 5) return { status: "Harvesting", daysLeft, progress: Math.max(85, 100 - daysLeft * 3) };
  if (daysLeft <= 15) return { status: "Growing", daysLeft, progress: Math.max(40, 90 - daysLeft * 3) };
  return { status: "Planting", daysLeft, progress: Math.min(30, Math.max(10, 100 - daysLeft * 2)) };
}

function getCountdown(harvestDate) {
  const now = new Date();
  const harvest = new Date(harvestDate);
  const diff = harvest - now;
  if (diff <= 0) return { h: "00", m: "00", s: "00" };
  return {
    h: String(Math.floor(diff / 3600000) % 24).padStart(2, "0"),
    m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
  };
}

function formatDateTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }) + " at " + d.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}

function getDaysUntil(isoString) {
  const now = new Date();
  const target = new Date(isoString);
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function HarvestCountdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFarmerList, setShowFarmerList] = useState(false);
  const [preOrderSuccess, setPreOrderSuccess] = useState(null);
  const [preOrderedIds, setPreOrderedIds] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [globalCountdown, setGlobalCountdown] = useState({ h: "00", m: "00", s: "00" });

  // Global countdown to midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      setGlobalCountdown({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time per-product countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      products.forEach(p => {
        newCountdowns[p._id || p.id] = getCountdown(p.harvestDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(timer);
  }, [products]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.products.getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setShowFarmerList(true);
    setPreOrderSuccess(null);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setShowFarmerList(false);
    setPreOrderSuccess(null);
  };

  const handlePreOrder = useCallback(async (product, farmer) => {
    const productId = product._id || product.id;
    const farmerId = farmer._id || farmer.id || farmer.farmerId?._id || farmer.farmerId?.id || farmer.farmerId;
    const key = `${productId}_${farmerId}`;

    if (preOrderedIds[key]) return;

    try {
      const result = await api.preOrders.createPreOrder(productId, farmerId, 1);
      setPreOrderedIds(prev => ({ ...prev, [key]: true }));
      setPreOrderSuccess({
        productTitle: product.title,
        farmerName: farmer.farmerId?.name || farmer.name || "Farmer",
        confirmationTime: result.confirmationTime || new Date().toISOString(),
      });
    } catch (err) {
      console.error("Pre-order failed:", err);
    }
  }, [preOrderedIds]);

  const uniqueFarmers = selectedProduct
    ? (() => {
        const farmersMap = new Map();
        products.forEach(p => {
          const title = p.title?.toLowerCase();
          const selectedTitle = selectedProduct.title?.toLowerCase();
          if (title === selectedTitle && p.farmerId) {
            const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
            if (!farmersMap.has(fId)) {
              farmersMap.set(fId, {
                ...p,
                farmerId: p.farmerId,
                stock: p.stock || Math.floor(Math.random() * 80) + 20,
              });
            } else {
              const existing = farmersMap.get(fId);
              existing.stock = (existing.stock || 0) + (p.stock || Math.floor(Math.random() * 50) + 10);
            }
          }
        });
        return Array.from(farmersMap.values());
      })()
    : [];

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "400px", gap: "1rem",
      }}>
        <div style={{
          width: 48, height: 48, border: "4px solid #EBF5EB",
          borderTop: "4px solid #2D6A4F", borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: "#2D6A4F", fontWeight: 600, fontSize: "0.9rem" }}>
          Loading harvest products...
        </span>
      </div>
    );
  }

  // ── Farmer List View ──
  if (showFarmerList && selectedProduct) {
    const productImage = selectedProduct.image;
    const harvestInfo = getHarvestStatus(selectedProduct.harvestDate);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #013220, #14532d)",
          borderRadius: "20px", padding: "1.5rem 2rem", color: "white",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <button
              onClick={handleBackToProducts}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "10px",
                padding: "8px", cursor: "pointer", display: "flex", alignItems: "center",
                color: "white", transition: "background 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.15)"}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Choose a Farmer
              </h1>
              <p style={{ opacity: 0.8, fontSize: "0.85rem", margin: "4px 0 0" }}>
                Select a farmer to pre-order <strong>{selectedProduct.title}</strong>
              </p>
            </div>
          </div>

          {/* Product summary card */}
          <div style={{
            background: "rgba(0,0,0,0.25)", borderRadius: "14px", padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
          }}>
            {productImage && (
              <img
                src={productImage}
                alt={selectedProduct.title}
                style={{
                  width: 56, height: 56, borderRadius: "12px",
                  objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)",
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>{selectedProduct.title}</div>
              <div style={{ opacity: 0.8, fontSize: "0.8rem" }}>
                {selectedProduct.quantity} &middot; ₹{selectedProduct.price}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                background: STATUS_COLORS[harvestInfo.status] + "40",
                color: "#7BE495", padding: "4px 12px", borderRadius: "999px",
                fontSize: "0.7rem", fontWeight: 700,
              }}>
                {STATUS_ICONS[harvestInfo.status]} {harvestInfo.status}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={14} color="#7BE495" />
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700 }}>
                  {countdowns[selectedProduct._id || selectedProduct.id]?.h || "00"}:
                  {countdowns[selectedProduct._id || selectedProduct.id]?.m || "00"}:
                  {countdowns[selectedProduct._id || selectedProduct.id]?.s || "00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {preOrderSuccess && (
          <div style={{
            background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
            border: "2px solid #10B981", borderRadius: "16px",
            padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem",
            animation: "slideIn 0.4s ease-out",
          }}>
            <style>{`
              @keyframes slideIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: "#10B981",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <CheckCircle size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: "#065F46", fontSize: "1rem", marginBottom: "2px" }}>
                Successfully Pre-Ordered
              </div>
              <div style={{ fontSize: "0.82rem", color: "#047857", marginBottom: "6px" }}>
                {preOrderSuccess.productTitle} from {preOrderSuccess.farmerName}
              </div>
              <div style={{
                fontSize: "0.72rem", color: "#6B7280",
                background: "rgba(255,255,255,0.6)", display: "inline-block",
                padding: "3px 10px", borderRadius: "8px",
              }}>
                <Calendar size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                {formatDateTime(preOrderSuccess.confirmationTime)}
              </div>
            </div>
            <button
              onClick={() => setPreOrderSuccess(null)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#6B7280", padding: 4, flexShrink: 0,
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Farmer Cards */}
        {uniqueFarmers.length === 0 ? (
          <div style={{
            background: "white", borderRadius: "16px", padding: "2.5rem",
            textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <Sprout size={40} color="#A3C87A" style={{ marginBottom: "0.75rem" }} />
            <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>
              No Farmers Available
            </div>
            <div style={{ fontSize: "0.82rem", color: "#777" }}>
              No farmers currently have this product available for pre-order.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {uniqueFarmers.map((item, idx) => {
              const farmerId = item.farmerId?._id || item.farmerId?.id || item.farmerId;
              const farmerName = item.farmerId?.name || item.farmerName || "Farmer";
              const farmerPhone = item.farmerId?.phone || "+91 98765 43210";
              const farmerRating = item.farmerId?.rating || 4.5;
              const productId = selectedProduct._id || selectedProduct.id;
              const preOrderKey = `${productId}_${farmerId}`;
              const isPreOrdered = preOrderedIds[preOrderKey];
              const harvestDays = getDaysUntil(selectedProduct.harvestDate);

              return (
                <div key={idx} style={{
                  background: "white", borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Farmer Info */}
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "14px",
                        background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <User size={24} color="#2D6A4F" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.95rem", marginBottom: "2px" }}>
                          {farmerName}
                        </div>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "4px",
                          fontSize: "0.75rem", color: "#777", marginBottom: "4px",
                        }}>
                          <MapPin size={12} />
                          <span>Wayanad, Kerala</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "3px",
                            fontSize: "0.72rem", color: "#D4A017", fontWeight: 600,
                          }}>
                            <Star size={12} fill="#D4A017" /> {farmerRating}
                          </span>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "3px",
                            fontSize: "0.72rem", color: "#555",
                          }}>
                            <Phone size={11} /> {farmerPhone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div style={{
                      background: "#F8FAF8", borderRadius: "12px", padding: "0.85rem 1rem",
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem",
                    }}>
                      <div>
                        <div style={{ fontSize: "0.65rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                          Quantity Available
                        </div>
                        <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Package size={13} color="#6A994E" />
                          {item.stock || 50} {selectedProduct.quantity}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.65rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                          Expected Harvest
                        </div>
                        <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Truck size={13} color="#6A994E" />
                          {harvestDays === 0 ? "Ready Now" : `${harvestDays} days`}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.65rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                          Harvest Time
                        </div>
                        <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem" }}>
                          {selectedProduct.availableTime || "06:00 AM - 10:00 AM"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.65rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                          Price
                        </div>
                        <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem" }}>
                          ₹{selectedProduct.price} / {selectedProduct.quantity}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pre-Order Button */}
                  <div style={{
                    padding: "0 1.5rem 1.25rem",
                    display: "flex", justifyContent: "flex-end",
                  }}>
                    <button
                      onClick={() => handlePreOrder(selectedProduct, item)}
                      disabled={isPreOrdered}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: isPreOrdered
                          ? "linear-gradient(135deg, #D1FAE5, #ECFDF5)"
                          : "linear-gradient(135deg, #013220, #14532d)",
                        color: isPreOrdered ? "#065F46" : "white",
                        border: isPreOrdered ? "2px solid #10B981" : "2px solid transparent",
                        borderRadius: "12px", padding: "0.6rem 1.25rem",
                        cursor: isPreOrdered ? "default" : "pointer",
                        fontWeight: 700, fontSize: "0.8rem",
                        transition: "all 0.2s ease",
                        boxShadow: isPreOrdered ? "none" : "0 4px 12px rgba(1,50,32,0.3)",
                      }}
                      onMouseEnter={e => {
                        if (!isPreOrdered) {
                          e.target.style.transform = "translateY(-1px)";
                          e.target.style.boxShadow = "0 6px 16px rgba(1,50,32,0.4)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isPreOrdered) {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(1,50,32,0.3)";
                        }
                      }}
                    >
                      {isPreOrdered ? (
                        <>
                          <CheckCircle size={16} /> Pre-Ordered
                        </>
                      ) : (
                        <>
                          <Sprout size={16} /> Pre-Order from {farmerName.split(" ")[0]}
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Product List View (Main) ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #013220, #14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
          <Clock size={28} color="#7BE495" />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Harvest Countdown</h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: "4px 0 0" }}>
              Track when your favorite crops will be ready &middot; Pre-order now
            </p>
          </div>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.25)", borderRadius: "14px", padding: "1.25rem 2rem",
          display: "inline-flex", alignItems: "center", gap: "1.5rem",
        }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>NEXT HARVEST IN</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "monospace" }}>
            {globalCountdown.h} : {globalCountdown.m} : {globalCountdown.s}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div style={{
          background: "white", borderRadius: "16px", padding: "2.5rem",
          textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          <Sprout size={40} color="#A3C87A" style={{ marginBottom: "0.75rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>
            No Products Available
          </div>
          <div style={{ fontSize: "0.82rem", color: "#777" }}>
            Check back soon for fresh harvest products.
          </div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}>
          {products.map((product) => {
            const pid = product._id || product.id;
            const harvestInfo = getHarvestStatus(product.harvestDate);
            const cd = countdowns[pid] || { h: "00", m: "00", s: "00" };
            const farmerName = product.farmerId?.name || "Farmer";
            const hasAnyPreOrder = Object.keys(preOrderedIds).some(k => k.startsWith(pid));

            return (
              <div key={pid} style={{
                background: "white", borderRadius: "16px", overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                }}
              >
                {/* Product Image */}
                {product.image && (
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: "100%", height: 180, objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                    />
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: STATUS_COLORS[harvestInfo.status],
                      color: "white", padding: "4px 12px", borderRadius: "999px",
                      fontSize: "0.68rem", fontWeight: 700,
                      backdropFilter: "blur(8px)",
                    }}>
                      {STATUS_ICONS[harvestInfo.status]} {harvestInfo.status}
                    </div>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: 4, background: "rgba(0,0,0,0.1)",
                    }}>
                      <div style={{
                        height: "100%", width: `${harvestInfo.progress}%`,
                        background: `linear-gradient(90deg, ${harvestInfo.progress >= 85 ? "#22c55e" : "#D4A017"}, ${harvestInfo.progress >= 85 ? "#16a34a" : "#B8860B"})`,
                        transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <div style={{ padding: "1.25rem" }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    marginBottom: "0.75rem",
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#013220", fontSize: "1rem", marginBottom: "2px" }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#777", display: "flex", alignItems: "center", gap: "4px" }}>
                        <User size={11} /> {farmerName}
                      </div>
                    </div>
                    <div style={{
                      background: "#F8FAF8", padding: "4px 10px", borderRadius: "8px",
                      fontSize: "0.75rem", fontWeight: 700, color: "#013220",
                    }}>
                      ₹{product.price}
                    </div>
                  </div>

                  {/* Countdown */}
                  <div style={{
                    background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)",
                    borderRadius: "12px", padding: "0.75rem 1rem",
                    marginBottom: "0.75rem",
                  }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginBottom: "6px",
                    }}>
                      <span style={{ fontSize: "0.65rem", color: "#6A994E", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Harvest Countdown
                      </span>
                      <span style={{
                        fontSize: "0.65rem", color: "#999",
                      }}>
                        {harvestInfo.daysLeft === 0 ? "Ready" : `${harvestInfo.daysLeft}d left`}
                      </span>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}>
                      {["h", "m", "s"].map((unit, i) => (
                        <React.Fragment key={unit}>
                          {i > 0 && <span style={{ color: "#A3C87A", fontWeight: 800, fontSize: "1.1rem" }}>:</span>}
                          <div style={{
                            background: "white", borderRadius: "8px", padding: "6px 10px",
                            minWidth: 42, textAlign: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          }}>
                            <div style={{
                              fontFamily: "monospace", fontWeight: 800, fontSize: "1.1rem",
                              color: "#013220", lineHeight: 1,
                            }}>
                              {cd[unit]}
                            </div>
                            <div style={{ fontSize: "0.5rem", color: "#999", textTransform: "uppercase" }}>
                              {unit === "h" ? "HRS" : unit === "m" ? "MIN" : "SEC"}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Details Row */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: "0.75rem", fontSize: "0.75rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6A994E" }}>
                      <Calendar size={13} />
                      <span>{new Date(product.harvestDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#777" }}>
                      <Package size={13} />
                      <span>{product.quantity} &middot; {product.stock || 50} available</span>
                    </div>
                  </div>

                  {/* Pre-Order Button */}
                  <button
                    onClick={() => handleSelectProduct(product)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "6px",
                      background: hasAnyPreOrder
                        ? "linear-gradient(135deg, #D1FAE5, #ECFDF5)"
                        : "linear-gradient(135deg, #013220, #14532d)",
                      color: hasAnyPreOrder ? "#065F46" : "white",
                      border: hasAnyPreOrder ? "2px solid #10B981" : "2px solid transparent",
                      borderRadius: "12px", padding: "0.65rem 1rem",
                      cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
                      transition: "all 0.2s ease",
                      boxShadow: hasAnyPreOrder ? "none" : "0 4px 12px rgba(1,50,32,0.3)",
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(1,50,32,0.4)";
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = hasAnyPreOrder ? "none" : "0 4px 12px rgba(1,50,32,0.3)";
                    }}
                  >
                    {hasAnyPreOrder ? (
                      <><CheckCircle size={16} /> Pre-Ordered</>
                    ) : (
                      <><Sprout size={16} /> Pre-Order Now <ChevronRight size={14} /></>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Banner */}
      <div style={{
        background: "linear-gradient(135deg, #FFF8E7, #FEF3C7)",
        border: "1px solid #F0D080", borderRadius: "16px",
        padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start",
        gap: "1rem", flexWrap: "wrap",
      }}>
        <Sprout size={20} color="#D4A017" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem", marginBottom: "4px" }}>
            Pre-order Available &middot; 10% Off
          </div>
          <div style={{ fontSize: "0.78rem", color: "#666" }}>
            Reserve your harvest before it's ready. Pre-order now and get 10% off on first delivery.
          </div>
        </div>
        <button
          onClick={() => navigate("/products")}
          style={{
            background: "#013220", color: "white", border: "none",
            borderRadius: "10px", padding: "0.5rem 1rem", fontWeight: 700,
            fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >Browse All Products</button>
      </div>
    </div>
  );
}
