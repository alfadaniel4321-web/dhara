import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { api } from '../services/api';
import {
  Star, Clock, Leaf, Truck, ChevronRight, ArrowRight,
  ShoppingBag, Sparkles, Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import farmVideo from "../assets/farm-video.mp4";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const TRUST_METRICS = [
  { icon: Star, value: "4.9 ★", label: "Customer Rating" },
  { icon: ShoppingBag, value: "9+", label: "Organic Deliveries" },
  { icon: Leaf, value: "5+", label: "Verified Farmers" },
  { icon: Truck, value: "24 min", label: "Avg Delivery" },
];

const CATEGORIES = [
  { label: "Vegetables", image: "🥬" },
  { label: "Fruits", image: "🍎" },
  { label: "Greens", image: "🥗" },
  { label: "Herbs", image: "🌿" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getProducts();
        if (data && data.length > 0) setProducts(data);
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

  useEffect(() => {
    const len = banners.length;
    if (len === 0) return;
    const id = setInterval(() => setBannerIndex((prev) => (prev + 1) % len), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  const activeSlide = banners.length > 0 ? banners[bannerIndex] : null;

  const handleAddToCart = useCallback(async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  }, [dispatch]);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={fadeUp} className="relative mx-5 overflow-hidden rounded-4xl mb-6"
        style={{
          background: "#0A3B2A",
          minHeight: "340px",
          boxShadow: "0 12px 40px rgba(10,59,42,0.2)",
        }}
      >
        {/* Background Video */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          style={{ filter: "brightness(0.5)" }}
        >
          <source src={farmVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(10,59,42,0.3) 0%, rgba(10,59,42,0.85) 70%, rgba(10,59,42,0.95) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 pt-10 flex flex-col justify-between min-h-[340px]">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] mb-3"
              style={{ color: "rgba(217,164,65,0.7)" }}
            >
              KERALA'S PREMIUM ORGANIC MARKETPLACE
            </p>
            <h2 className="text-4xl font-bold leading-tight mb-2"
              style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              DHARA
            </h2>
            <p className="text-xs font-medium tracking-[0.15em] mb-3"
              style={{ color: "#D9A441" }}
            >
              FARM • TABLE • TRUST
            </p>
            <p className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              From Kerala's oldest organic families to your table — harvest to home in under 24 hours.
            </p>
          </div>

          <div>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-wider transition-all duration-300 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              SIGN IN
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Trust Metrics Card */}
      <motion.div variants={fadeUp} className="mx-5 mb-6 rounded-4xl p-5"
        style={{
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        }}
      >
        <div className="grid grid-cols-4 gap-3">
          {TRUST_METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                style={{ background: "rgba(15,81,50,0.06)" }}
              >
                <m.icon size={16} color="#0F5132" />
              </div>
              <p className="text-sm font-bold leading-tight"
                style={{ color: "#0A3B2A" }}
              >
                {m.value}
              </p>
              <p className="text-[9px] leading-tight mt-0.5"
                style={{ color: "rgba(29,43,31,0.4)" }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Heritage Banner */}
      <motion.div variants={fadeUp} className="relative mx-5 mb-6 rounded-4xl overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, #0A3B2A, #0F5132, #0A3B2A)",
          boxShadow: "0 8px 32px rgba(10,59,42,0.2)",
        }}
      >
        <div className="relative z-10">
          <p className="text-[9px] font-semibold tracking-[0.2em] mb-2"
            style={{ color: "rgba(217,164,65,0.6)" }}
          >
            OUR BEGINNING
          </p>
          <h3 className="text-xl font-bold leading-tight mb-3 max-w-[220px]"
            style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            BORN FROM KERALA'S OLDEST FARMING FAMILIES.
          </h3>
          <div className="w-12 h-0.5 mb-3" style={{ background: "#D9A441" }} />
          <p className="text-xs leading-relaxed max-w-[260px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Three generations of organic farming heritage, now delivering straight to your doorstep.
          </p>
        </div>

        {/* Decorative farmer silhouette */}
        <div className="absolute right-0 bottom-0 opacity-[0.06] pointer-events-none">
          <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
            <circle cx="60" cy="30" r="15" fill="white"/>
            <path d="M45 55C45 55 30 40 25 30C20 20 25 10 35 15" stroke="white" strokeWidth="2"/>
            <path d="M75 55C75 55 90 40 95 30C100 20 95 10 85 15" stroke="white" strokeWidth="2"/>
            <rect x="30" y="55" width="60" height="45" rx="8" fill="white"/>
            <rect x="25" y="80" width="12" height="45" rx="4" fill="white"/>
            <rect x="83" y="80" width="12" height="45" rx="4" fill="white"/>
            <rect x="50" y="95" width="20" height="30" rx="4" fill="white"/>
          </svg>
        </div>
      </motion.div>

      {/* Fresh Harvest Card */}
      <motion.div variants={fadeUp} className="mx-5 mb-6 rounded-4xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex">
          {/* Left - Image */}
          <div className="w-[40%] min-h-[140px] flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #0A3B2A, #1a6b4a)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Leaf size={60} color="#fff" />
            </div>
            <div className="absolute top-2.5 left-2.5 text-[10px] font-bold opacity-40"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              01 /
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <h4 className="text-base font-bold mb-1"
              style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Fresh Harvest
            </h4>
            <p className="text-xs leading-relaxed mb-3"
              style={{ color: "rgba(29,43,31,0.5)" }}
            >
              Handpicked & harvested daily from our organic farms.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider transition-all"
              style={{ color: "#0F5132" }}
            >
              SHOP NOW
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <motion.div variants={fadeUp} className="mx-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold"
            style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Categories
          </h4>
          <button
            onClick={() => navigate("/products")}
            className="text-[11px] font-semibold tracking-wide transition-all"
            style={{ color: "rgba(15,81,50,0.5)" }}
          >
            View All
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(`/products?category=${cat.label.toLowerCase()}`)}
              className="flex flex-col items-center gap-2 flex-shrink-0 transition-all active:scale-95"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.02)",
                }}
              >
                {cat.image}
              </div>
              <span className="text-[11px] font-medium"
                style={{ color: "rgba(29,43,31,0.6)" }}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Today's Harvest Section */}
      {products.length > 0 && (
        <motion.div variants={fadeUp} className="mx-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold"
              style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Today's Harvest
            </h4>
            {countdown && (
              <div className="flex items-center gap-1.5">
                <Clock size={11} color="rgba(15,81,50,0.4)" />
                <span className="text-[10px] font-mono font-medium"
                  style={{ color: "rgba(15,81,50,0.5)" }}
                >
                  {countdown}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.slice(0, 8).map((product) => (
              <button
                key={product._id || product.id}
                onClick={() => navigate(`/product/${product._id || product.id}`)}
                className="flex-shrink-0 w-[140px] rounded-3xl overflow-hidden text-left transition-all active:scale-95"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="h-[100px] bg-cover bg-center"
                  style={{
                    backgroundImage: product.image
                      ? `url(${product.image})`
                      : "linear-gradient(135deg, #0A3B2A, #1a6b4a)",
                  }}
                />
                <div className="p-2.5">
                  <p className="text-xs font-semibold mb-0.5 truncate"
                    style={{ color: "#1D2B1F" }}
                  >
                    {product.title || product.name}
                  </p>
                  <p className="text-xs font-bold"
                    style={{ color: "#0F5132" }}
                  >
                    ₹{product.price}/{product.unit || "kg"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Banners / Promo Section */}
      {activeSlide && (
        <motion.div variants={fadeUp} className="mx-5 mb-8 rounded-4xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #0A3B2A, #0F5132)",
            boxShadow: "0 8px 32px rgba(10,59,42,0.15)",
          }}
        >
          {activeSlide.image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${activeSlide.image})` }}
            />
          )}
          <div className="relative z-10 p-5">
            <p className="text-[9px] font-semibold tracking-[0.2em] mb-2"
              style={{ color: "rgba(217,164,65,0.6)" }}
            >
              {(activeSlide.type || 'special').replace(/_/g, ' ').toUpperCase()}
            </p>
            <h4 className="text-lg font-bold mb-1"
              style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeSlide.title}
            </h4>
            {activeSlide.subtitle && (
              <p className="text-xs mb-3"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {activeSlide.subtitle}
              </p>
            )}
            {activeSlide.link && (
              <button
                onClick={() => navigate(activeSlide.link)}
                className="inline-flex items-center gap-1 text-xs font-bold transition-all"
                style={{ color: "#D9A441" }}
              >
                SHOP NOW
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
