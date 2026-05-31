import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { api } from '../services/api';
import HomeDashboard from "./HomeDashboard";
import {
  Home,
  MapPin,
  Grid,
  Clock,
  ShoppingBag,
  Users,
  Package,
  Tag,
  Info,
  Star,
  Zap,
} from "lucide-react";
import SearchBar from "../components/SearchBar";

const NAV_ITEMS = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Grid, label: "All Products", id: "products" },
  { icon: Clock, label: "Harvest Countdown", id: "harvest" },
  { icon: ShoppingBag, label: "Daily Orders", id: "orders" },
  { icon: Users, label: "Farmers", id: "farmers" },
  { icon: Package, label: "My Orders", id: "myorders" },
  { icon: Tag, label: "Offers & Deals", id: "offers" },
  { icon: Info, label: "About Us", id: "about" },
];

const FEATURES = [
  { icon: Clock, label: "Harvest Countdown" },
  { icon: MapPin, label: "Nearby Products" },
  { icon: Zap, label: "AI Freshness Rating" },

  { icon: Users, label: "Meet Farmers" },
];



export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  }, [dispatch]);

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
          const offerProducts = data.filter(p => p.offerDetails);
          setOffers(offerProducts);
        }
      } catch {}
    };
    const fetchBanners = async () => {
      try {
        const data = await api.public.getActiveBanners();
        if (data && data.length > 0) setBanners(data);
      } catch {}
    };
    fetchProducts();
    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;

      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      setCountdown(`${h} : ${m} : ${s}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeSlides = banners.length > 0
    ? banners.map(b => ({
        badge: (b.type || 'general').replace(/_/g, ' ').toUpperCase(),
        heading: b.title,
        subtitle: b.subtitle || '',
        product: b.title,
        gradient: 'linear-gradient(135deg, #1B4332, #013220, #14532d)',
        image: b.image,
        link: b.link,
      }))
    : [];

  const slidesLenRef = useRef(activeSlides.length);

  useEffect(() => {
    slidesLenRef.current = activeSlides.length;
    if (bannerIndex >= activeSlides.length && activeSlides.length > 0) {
      setBannerIndex(0);
    }
  }, [activeSlides.length]);

  useEffect(() => {
    const len = activeSlides.length;
    if (len === 0) return;
    const id = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % len);
    }, 5000);
    return () => clearInterval(id);
  }, [activeSlides.length]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayHarvest = products.filter(p => {
    const harvestDay = p.harvestDate ? p.harvestDate.slice(0, 10) : '';
    return harvestDay === todayStr;
  });

  const sortedRecent = [...products].sort((a, b) => {
    const da = a.harvestDate ? new Date(a.harvestDate) : new Date(0);
    const db = b.harvestDate ? new Date(b.harvestDate) : new Date(0);
    return db - da;
  });

  const displayProducts = todayHarvest.length > 0 ? todayHarvest : sortedRecent.slice(0, 5);

  const searchResults = search.trim()
    ? products.filter(p => {
        const q = search.toLowerCase();
        const farmerName = p.farmerName || p.farmerId?.name || '';
        return (
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          farmerName.toLowerCase().includes(q)
        );
      })
    : [];

  const filteredProducts = search.trim()
    ? searchResults
    : displayProducts;

  if (isMobile) {
    return <HomeDashboard />;
  }

  return (
    <div style={{ background: "#F4F6F3" }}>
      <style>{`
        .hide-scroll::-webkit-scrollbar{
          display:none;
        }
        .shop-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(163,200,122,0.5) !important;
        }
        .shop-now-btn:active {
          transform: translateY(0);
        }
        .sale-banner:hover {
          box-shadow: 0 8px 32px rgba(1,50,32,0.25);
        }
        .sale-banner:hover .banner-image {
          transform: scale(1.08) !important;
        }
        @media (max-width: 1280px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .dashboard-main {
            padding: 1.25rem !important;
          }
        }
        @media (max-width: 768px) {
          .sale-banner {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1.25rem !important;
            min-height: auto !important;
          }
          .sale-banner > div:last-child {
            margin-left: 0 !important;
            margin-top: 0.75rem !important;
            min-width: auto !important;
            width: 100% !important;
          }
          .sale-banner h1 {
            font-size: 1.2rem !important;
          }
          .sale-banner .banner-image-wrapper {
            display: none !important;
          }
          .sale-banner .dashboard-features {
            gap: 0.75rem !important;
          }
          .sale-banner .dashboard-features > div {
            width: 80px !important;
          }
          .dashboard-main {
            padding: 1rem !important;
            gap: 1rem !important;
          }
          .dashboard-countdown {
            flex-direction: column !important;
            text-align: center !important;
          }
          .dashboard-section {
            padding: 1rem !important;
          }
        }
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .dashboard-main {
            padding: 0.75rem !important;
          }
        }
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .product-card-image {
            height: 120px !important;
          }
          .product-card-body {
            padding: 0.75rem !important;
          }
        }
      `}</style>

      {/* MAIN CONTENT */}

      <main
        className="dashboard-main"
        style={{
          padding: "clamp(0.75rem, 2vw, 2rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 1.5vw, 1.5rem)",
        }}
      >
        {/* SEARCH BAR */}

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SearchBar onSearchChange={setSearch} />
        </div>

        {/* PROMOTIONAL BANNER */}

        {activeSlides.length > 0 && (
        <div
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            className="sale-banner"
            style={{
              background: activeSlides[bannerIndex].gradient,
              borderRadius: "20px",
              padding: "2rem 2.5rem",
              minHeight: "220px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
              transition: "all 0.5s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.06,
                backgroundImage: `radial-gradient(circle at 25% 25%, #A3C87A 1px, transparent 1px), radial-gradient(circle at 75% 75%, #A3C87A 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }}
            />

            <div style={{ zIndex: 2, flex: 1 }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#A3C87A",
                  color: "#013220",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "6px 14px",
                  borderRadius: "6px",
                  letterSpacing: "0.08em",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                {activeSlides[bannerIndex].badge}
              </div>

              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}
              >
                {activeSlides[bannerIndex].heading}
              </h1>

              <p style={{ opacity: 0.75, fontSize: "0.9rem", marginBottom: "16px" }}>
                {activeSlides[bannerIndex].subtitle}
              </p>

              <button
                onClick={() => navigate('/products')}
                className="shop-now-btn"
                style={{
                  background: "#A3C87A",
                  border: "none",
                  color: "#013220",
                  padding: "0.75rem 2rem",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 14px rgba(163,200,122,0.3)",
                }}
              >
                Shop Now
              </button>
            </div>

            <div className="banner-image-wrapper" style={{ zIndex: 2, minWidth: "200px", width: "280px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", marginLeft: "1.5rem", flexShrink: 0 }}>
              <img
                src={activeSlides[bannerIndex].image}
                alt={activeSlides[bannerIndex].product}
                style={{ width: "100%", height: "180px", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                className="banner-image"
              />
            </div>
          </div>

          {/* Carousel Dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                style={{
                  width: i === bannerIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background: i === bannerIndex ? "#A3C87A" : "rgba(1,50,32,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
        )}

        {/* FEATURES */}

          <div
            className="dashboard-features"
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            {FEATURES.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#EBF5EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} color="#013220" />
                  </div>

                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#555",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

        {/* NEXT HARVEST COUNTDOWN */}

        <div
          className="dashboard-countdown"
          style={{
            background: "#013220",
            borderRadius: "16px",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "rgba(163,200,122,0.15)",
                borderRadius: "10px",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={18} color="#A3C87A" />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#A3C87A" }}>
                Next Harvest In
              </span>
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: "3px",
                color: "#fff",
              }}
            >
              {countdown}
            </div>
          </div>
          {activeSlides.length > 0 && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "#A3C87A",
              fontWeight: 600,
            }}
          >
            {activeSlides[bannerIndex].product}
          </div>
          )}
        </div>

        {/* 🌿 TODAY'S FRESH HARVEST */}

        <div
          className="dashboard-section"
          style={{
            background: "#D7F3DC",
            borderRadius: "20px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  color: "#013220",
                  fontSize: "1.4rem",
                  marginBottom: "4px",
                }}
              >
                {search.trim() ? "🔍 Search Results" : "🌿 Today's Fresh Harvest"}
              </h2>
              <p style={{ color: "#555", fontSize: "0.8rem" }}>
                {search.trim() ? `Found ${searchResults.length} products matching "${search}"` : "Handpicked today from nearby farms"}
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: "none",
                border: "none",
                color: "#6A994E",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              View All
            </button>
          </div>

          <div
            className="product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredProducts.length === 0 && search.trim() ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 1rem", color: "#999" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#013220", marginBottom: "6px" }}>No products found</div>
                <div style={{ fontSize: "0.85rem" }}>Try a different search term</div>
              </div>
            ) : null}
            {filteredProducts.length > 0 && filteredProducts.slice(0, search.trim() ? filteredProducts.length : 5).map((p) => (
              <div
                key={p.id || p._id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={p.image}
                  alt=""
                  className="product-card-image"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
                <div className="product-card-body" style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#013220",
                      marginBottom: "6px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    <Star size={13} fill="#D4A017" color="#D4A017" />
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      {p.freshnessScore || '—'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#013220",
                    }}
                  >
                    ₹{p.price}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#777",
                      marginBottom: "12px",
                    }}
                  >
                    / {p.quantity}
                  </div>
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      width: "100%",
                      background: "#013220",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "0.8rem",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OFFERS SECTION */}

        {offers.length > 0 && (
        <div
          className="dashboard-section"
          style={{
            background: "linear-gradient(135deg, #FEF9E7, #FDEBD0)",
            borderRadius: "20px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  color: "#013220",
                  fontSize: "1.4rem",
                  marginBottom: "4px",
                }}
              >
                🏷️ Offers
              </h2>
              <p style={{ color: "#8B6F00", fontSize: "0.8rem" }}>
                Exclusive deals on farm-fresh products
              </p>
            </div>
            <button
              onClick={() => navigate('/offers')}
              style={{
                background: "none",
                border: "none",
                color: "#D4A017",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              View All
            </button>
          </div>

          <div
            className="product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {offers.map((o) => (
              <div
                key={o.id || o._id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  position: "relative",
                  border: "2px solid #FDEBD0",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "#D4A017",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    zIndex: 2,
                  }}
                >
                  {o.offerDetails || o.discount || "OFFER"}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#013220",
                    color: "#FDEBD0",
                    fontSize: "0.55rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    zIndex: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Limited
                </div>
                <img
                  src={o.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#013220",
                      marginBottom: "6px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {o.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    <Star size={13} fill="#D4A017" color="#D4A017" />
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      {o.freshnessScore || '—'}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#013220",
                      }}
                    >
                      ₹{o.price}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#999",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{Math.round(o.price * 1.25)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#777",
                      marginBottom: "12px",
                    }}
                  >
                    / {o.quantity}
                  </div>
                  <button
                    onClick={() => handleAddToCart(o)}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #D4A017, #B8860B)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "0.8rem",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    Grab Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

      </main>

    </div>
  );
}