import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../services/api';
import {
  Home,
  MapPin,
  Grid,
  Clock,
  ShoppingBag,
  RefreshCw,
  Users,
  Package,
  Tag,
  Info,
  Search,
  Star,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Grid, label: "All Products", id: "products" },
  { icon: Clock, label: "Harvest Countdown", id: "harvest" },
  { icon: ShoppingBag, label: "Daily Orders", id: "orders" },
  { icon: RefreshCw, label: "Subscriptions", id: "subscriptions" },
  { icon: Users, label: "Farmers", id: "farmers" },
  { icon: Package, label: "My Orders", id: "myorders" },
  { icon: Tag, label: "Offers & Deals", id: "offers" },
  { icon: Info, label: "About Us", id: "about" },
];

const FEATURES = [
  { icon: Clock, label: "Harvest Countdown" },
  { icon: MapPin, label: "Nearby Products" },
  { icon: Zap, label: "AI Freshness Rating" },

  { icon: RefreshCw, label: "Subscriptions" },
  { icon: Users, label: "Meet Farmers" },
];

const OFFERS = [
  { id: 1, title: "Fresh Coconut", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800", price: 25, quantity: "3 Nos", discount: "20% OFF" },
  { id: 2, title: "Organic Tomato", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=800", price: 35, quantity: "1 Kg", discount: "15% OFF" },
  { id: 3, title: "Raw Honey", image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=800", price: 350, quantity: "250 g", discount: "10% OFF" },
  { id: 4, title: "Country Chicken", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800", price: 280, quantity: "1 Kg", discount: "25% OFF" },
  { id: 5, title: "Coconut Oil", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800", price: 180, quantity: "500 ml", discount: "12% OFF" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch {
        // fallback below
      }
    };
    fetchProducts();
  }, []);

  const saleSlides = [
    {
      badge: "MEGA HARVEST SALE",
      heading: "GET READY FOR THE FRESHEST SALE",
      subtitle: "Organic products directly from nearby farms",
      product: "Farm Fresh Vegetables",
      gradient: "linear-gradient(135deg, #1B4332, #013220, #14532d)",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&h=300&fit=crop",
    },
    {
      badge: "DAIRY SPECIAL",
      heading: "FRESH FROM THE FARM TO YOUR DOOR",
      subtitle: "Pure & organic milk sourced from local farms",
      product: "Organic A2 Milk",
      gradient: "linear-gradient(135deg, #0D3B2E, #1B5E3A, #2D7A4A)",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&h=300&fit=crop",
    },
    {
      badge: "EGG FEST",
      heading: "FARM FRESH EGGS DAILY",
      subtitle: "Free-range eggs from happy hens",
      product: "Kuttanad Duck Eggs",
      gradient: "linear-gradient(135deg, #3A2A1A, #5C4033, #7A5A4A)",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=400&h=300&fit=crop",
    },
    {
      badge: "KERALA HARVEST",
      heading: "CELEBRATE LOCAL FLAVOURS",
      subtitle: "Special harvest from Kerala's finest farms",
      product: "Nendran Bananas",
      gradient: "linear-gradient(135deg, #2D1F0E, #4A3520, #6B4F30)",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b6f9?q=80&w=400&h=300&fit=crop",
    },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % saleSlides.length);
    }, 5000);

    return () => clearInterval(id);
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

  const todayStr = new Date().toISOString().slice(0, 10);
  const harvestProducts = products.length > 0 ? products : [
    { id: 1, title: "Fresh A2 Malabar Cow Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800", price: 65, quantity: "1 Litre", category: "Milk", harvestDate: new Date().toISOString() },
    { id: 2, title: "Kuttanad Duck Eggs", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=800", price: 72, quantity: "12 Nos", category: "Eggs", harvestDate: new Date().toISOString() },
    { id: 3, title: "Organic Nendran Bananas", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b6f9?q=80&w=800", price: 30, quantity: "1 Dozen", category: "Fruits", harvestDate: new Date().toISOString() },
    { id: 4, title: "Fresh Farm Tapioca", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800", price: 45, quantity: "2 Kg", category: "Vegetables", harvestDate: new Date().toISOString() },
    { id: 5, title: "Organic Tomato", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=800", price: 35, quantity: "1 Kg", category: "Vegetables", harvestDate: new Date().toISOString() },
  ];
  const todayHarvest = harvestProducts.filter(p => {
    const harvestDay = p.harvestDate ? p.harvestDate.slice(0, 10) : '';
    return harvestDay === todayStr;
  });

  const displayProducts = todayHarvest.length > 0 ? todayHarvest : harvestProducts;

  const filteredProducts = displayProducts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* SEARCH FILTER */}

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              color="#6A994E"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              type="text"
              placeholder="Search fresh harvest milk, duck eggs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && search.trim()) navigate('/products'); }}
              style={{
                width: "100%",
                background: "#F4F6F3",
                border: "1px solid #E0EAE0",
                borderRadius: "999px",
                padding: "0.8rem 1rem 0.8rem 2.8rem",
                outline: "none",
                color: "#000",
              }}
            />
          </div>

        </div>

        {/* PROMOTIONAL BANNER */}

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
              background: saleSlides[bannerIndex].gradient,
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
                {saleSlides[bannerIndex].badge}
              </div>

              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}
              >
                {saleSlides[bannerIndex].heading}
              </h1>

              <p style={{ opacity: 0.75, fontSize: "0.9rem", marginBottom: "16px" }}>
                {saleSlides[bannerIndex].subtitle}
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
                src={saleSlides[bannerIndex].image}
                alt={saleSlides[bannerIndex].product}
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
            {saleSlides.map((_, i) => (
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
          <div
            style={{
              fontSize: "0.8rem",
              color: "#A3C87A",
              fontWeight: 600,
            }}
          >
            {saleSlides[bannerIndex].product}
          </div>
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
                🌿 Today's Fresh Harvest
              </h2>
              <p style={{ color: "#555", fontSize: "0.8rem" }}>
                Handpicked today from nearby farms
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
            {filteredProducts.slice(0, 5).map((p) => (
              <div
                key={p.id}
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
                      4.9 (16)
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
                    onClick={() => navigate('/cart')}
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
            {OFFERS.map((o) => (
              <div
                key={o.id}
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
                  {o.discount}
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
                      4.8 (22)
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
                    onClick={() => navigate('/cart')}
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

      </main>

    </div>
  );
}