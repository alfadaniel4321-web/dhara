import React, { useState, useEffect } from "react";
import {
  Tag, Clock, Zap, Gift, ShoppingBag, Sparkles, Percent, Copy, Check
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, couponsData, bannersData] = await Promise.all([
          api.products.getProducts(),
          api.public.getActiveCoupons(),
          api.public.getActiveBanners(),
        ]);
        setProducts(productsData?.filter(p => p.offerDetails) || []);
        setCoupons(couponsData || []);
        setBanners(bannersData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const formatDiscount = (c) => {
    if (c.discountType === 'percentage') return `${c.discountValue}% OFF`;
    return `₹${c.discountValue} OFF`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "2rem 2.5rem", color: "white", position: "relative", overflow: "hidden",
      }}>
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

      {banners.length > 0 && (
        <div>
          <h2 style={{ color: "#013220", fontSize: "1.1rem", marginBottom: "0.75rem", fontWeight: 700 }}>
            <Sparkles size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
            Promotional Offers
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {banners.map((b, i) => (
              <div key={b._id || i} style={{
                background: "linear-gradient(135deg, #1B4332, #013220)",
                borderRadius: "16px", padding: "1.25rem", color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                {b.image && (
                  <img src={b.image} alt={b.title} style={{
                    width: "100%", height: "120px", borderRadius: "10px",
                    objectFit: "cover", marginBottom: "0.75rem",
                  }} />
                )}
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>{b.title}</div>
                {b.subtitle && <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{b.subtitle}</div>}
                {b.link && (
                  <a href={b.link} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-block", marginTop: "0.75rem", color: "#A3C87A",
                    fontSize: "0.8rem", fontWeight: 600,
                  }}>
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {coupons.length > 0 && (
        <div>
          <h2 style={{ color: "#013220", fontSize: "1.1rem", marginBottom: "0.75rem", fontWeight: 700 }}>
            <Percent size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
            Coupon Codes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {coupons.map((c, i) => (
              <div key={c.code || i} style={{
                background: "white", borderRadius: "16px", padding: "1.25rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #E8F0E8",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{
                      background: "#013220", color: "#A3C87A", padding: "4px 10px",
                      borderRadius: "6px", fontSize: "0.85rem", fontWeight: 800,
                      fontFamily: "monospace", letterSpacing: "1px", display: "inline-block",
                    }}>
                      {c.code}
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#013220", marginTop: "0.5rem" }}>
                      {formatDiscount(c)}
                    </div>
                  </div>
                  <button onClick={() => handleCopy(c.code)} style={{
                    background: copied === c.code ? "#2D6A4F" : "#EBF5EB",
                    border: "none", borderRadius: "10px", padding: "0.5rem 0.75rem",
                    cursor: "pointer", color: copied === c.code ? "white" : "#013220",
                    display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 600,
                    transition: "all 0.2s",
                  }}>
                    {copied === c.code ? <Check size={14} /> : <Copy size={14} />}
                    {copied === c.code ? "Copied!" : "Copy"}
                  </button>
                </div>
                {c.description && (
                  <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.5rem" }}>{c.description}</div>
                )}
                <div style={{ fontSize: "0.7rem", color: "#999", marginTop: "0.5rem" }}>
                  {c.minOrderValue > 0 && <span>Min. order: ₹{c.minOrderValue} • </span>}
                  {c.discountType === 'percentage' && c.maxDiscount > 0 && <span>Max discount: ₹{c.maxDiscount} • </span>}
                  {c.validUntil && <span>Valid till: {new Date(c.validUntil).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && coupons.length === 0 && banners.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#777" }}>
          <Tag size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, color: "#013220", marginBottom: "4px" }}>No offers available</div>
          <div style={{ fontSize: "0.85rem" }}>Farmers haven't listed any deals yet. Check back later!</div>
        </div>
      ) : (
        <>
          {products.length > 0 && (
            <>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem",
              }}>
                {products.map((p, i) => (
                  <div key={p.id || p._id || i} style={{
                    background: "white", borderRadius: "16px", padding: "1.5rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  }}>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
                      <img src={p.image} alt={p.title} style={{
                        width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover",
                        background: "#F4F6F3", flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.95rem" }}>{p.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6A994E", fontWeight: 500 }}>{p.category}</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#013220", marginTop: "2px" }}>₹{p.price}</div>
                      </div>
                    </div>
                    {p.offerDetails && (
                      <div style={{
                        background: "#FFF8E7", border: "1px solid #F0D080", borderRadius: "10px",
                        padding: "0.5rem 0.8rem", marginBottom: "0.5rem",
                        fontSize: "0.72rem", color: "#B8860B", fontWeight: 600,
                      }}>
                        <Tag size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                        {p.offerDetails}
                      </div>
                    )}
                    <button onClick={() => handleCopy(p.title)} style={{
                      width: "100%", padding: "0.6rem", borderRadius: "10px", border: "none",
                      cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", transition: "all 0.2s",
                      background: copied === p.title ? "#2D6A4F" : "#013220",
                      color: "white",
                    }}>
                      {copied === p.title ? "Copied!" : "Grab Deal"}
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
                  {products.slice(0, 3).map((p, i) => {
                    const icons = [Gift, ShoppingBag, Sparkles];
                    const colors = ["#013220", "#6A994E", "#D4A017"];
                    const Icon = icons[i % 3];
                    const color = colors[i % 3];
                    return (
                      <div key={i} style={{
                        background: "white", borderRadius: "16px", padding: "1.25rem",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                        display: "flex", alignItems: "center", gap: "1rem",
                      }}>
                        <div style={{
                          width: "52px", height: "52px", borderRadius: "14px",
                          background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Icon size={24} color={color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.9rem" }}>{p.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px" }}>{p.offerDetails}</div>
                          <div style={{ fontSize: "0.65rem", color: "#6A994E", marginTop: "4px", fontWeight: 600 }}>
                            ₹{p.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
