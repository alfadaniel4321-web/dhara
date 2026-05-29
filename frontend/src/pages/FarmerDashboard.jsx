import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SpeechReader from "../components/SpeechReader";
import { t, getLanguage, onLanguageChange } from "../data/i18n";
import {
  IndianRupee, Package, Sprout, RefreshCw, AlertTriangle,
  PlusCircle, Star, ShieldAlert, Clock
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [, forceUpdate] = useState(0);
  const lang = getLanguage();

  useEffect(() => {
    return onLanguageChange(() => forceUpdate(n => n + 1));
  }, []);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allProds = await api.products.getProducts();
      const farmerProds = allProds.filter((p) => {
        const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
        return fId === user.id || fId === user._id;
      });
      setProducts(farmerProds);

      const allOrders = await api.orders.getOrders();
      setOrders(allOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("dhara_user");
    localStorage.removeItem("dhara_token");
    navigate("/login");
  };

  if (loading) return <LoadingSpinner />;

  const totalEarnings = orders
    .filter((o) => o.orderStatus === "Delivered" || o.paymentStatus === "Paid")
    .reduce((sum, o) => {
      const farmerItems = o.products.filter(
        (p) => p.farmerId === user.id || p.farmerId === user._id
      );
      return sum + farmerItems.reduce((acc, curr) => acc + (curr.price || 0) * (curr.count || 1), 0);
    }, 0);

  const subscriptionCount = orders.filter(
    (o) => o.subscriptionType !== "One-time" && o.orderStatus !== "Cancelled"
  ).length;

  const warnings = user?.negativeFeedbacksCount || 0;
  const blocked = user?.blocked || false;

  const bigCards = [
    {
      icon: IndianRupee, value: `₹${totalEarnings}`, labelKey: "earnings",
      iconBg: "#EBF5EB", iconColor: "#22c55e", accent: "#22c55e"
    },
    {
      icon: Package, value: orders.length, labelKey: "orders",
      iconBg: "#EBF5EB", iconColor: "#3b82f6", accent: "#3b82f6"
    },
    {
      icon: Sprout, value: products.length, labelKey: "harvest",
      iconBg: "#EBF5EB", iconColor: "#eab308", accent: "#eab308"
    },
    {
      icon: RefreshCw, value: subscriptionCount, labelKey: "subscriptions",
      iconBg: "#EBF5EB", iconColor: "#a855f7", accent: "#a855f7"
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ─── HEADER ─── */}
      <motion.div variants={cardVariants} className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#c09402",
              margin: 0,
            }}
          >
            🌿 {t("dashboard.title", lang)}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", marginTop: "6px" }}>
            {user?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SpeechReader
            text={`${t("dashboard.title", lang)} - ${t("dashboard.earnings", lang)}: ${totalEarnings} rupees, ${t("dashboard.orders", lang)}: ${orders.length}, ${t("dashboard.warnings", lang)}: ${warnings}/3`}
            lang={lang === "ml" ? "ml-IN" : lang === "hi" ? "hi-IN" : "en-IN"}
          />
        </div>
      </motion.div>

      {/* ─── WARNING BANNER ─── */}
      {(warnings > 0 || blocked) && (
        <motion.div
          variants={cardVariants}
          style={{
            background: blocked
              ? "linear-gradient(135deg, #FFF5F5, #FFE4E4)"
              : "linear-gradient(135deg, #FFFEF5, #FFF8E1)",
            borderRadius: "16px",
            padding: "1rem 1.5rem",
          marginBottom: "1.75rem",
            border: `1px solid ${
              blocked ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)"
            }`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: blocked ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle
              size={18}
              color={blocked ? "#ef4444" : "#eab308"}
            />
          </div>
          <div>
            <p style={{ color: blocked ? "#ef4444" : "#eab308", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>
              {blocked
                ? `${t("warning.blocked", lang)}!`
                : `${t("warning.title", lang)}: ${warnings}/3`}
            </p>
            <p style={{ color: "#666", fontSize: "0.75rem", margin: "2px 0 0" }}>
              {blocked
                ? "You cannot post products. Contact admin."
                : `${warnings} severe ${warnings === 1 ? "comment" : "comments"} received. 3 will block your account.`}
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── STAT CARDS ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.25rem",
          marginBottom: "1.75rem",
        }}
      >
        {bigCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              style={{
                background: "rgba(255,255,255,0.92)",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: card.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={26} color={card.iconColor} />
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#888",
                  }}
                >
                  {t(`dashboard.${card.labelKey}`, lang)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "#013220",
                  margin: 0,
                }}
              >
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── WARNING & RATING STATUS ─── */}
      <motion.div
        variants={cardVariants}
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "16px",
          padding: "1rem 1.5rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#FFF8E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={16} color="#D4A017" fill="#D4A017" />
          </div>
          <div>
            <p style={{ color: "#999", fontSize: "0.7rem", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t("dashboard.warnings", lang)}
            </p>
            <p style={{ color: "#013220", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
              {warnings}/3
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", textAlign: "right" }}>
          <div>
            <p style={{ color: "#999", fontSize: "0.7rem", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Rating
            </p>
            <p style={{ color: "#D4A017", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
              {user?.rating || 5.0}★
            </p>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: warnings >= 3 ? "rgba(239,68,68,0.1)" : "#EBF5EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={16} color={warnings >= 3 ? "#ef4444" : "#22c55e"} />
          </div>
        </div>
      </motion.div>

      {/* ─── RECENT PRODUCTS ─── */}
      <motion.div
        variants={cardVariants}
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          marginBottom: "5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1rem",
          }}
        >
          <Clock size={16} color="#2D6A4F" />
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#013220",
              margin: 0,
            }}
          >
            Recent Products
          </h3>
        </div>
        {products.length === 0 ? (
          <p style={{ color: "#999", fontSize: "0.8rem", margin: 0 }}>
            No products added yet. Tap the "+ Add Product" button below to get started.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {products.slice(0, 5).map((p) => (
              <div
                key={p.id || p._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  background: "#F4F6F3",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "#EBF5EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#2D6A4F",
                      flexShrink: 0,
                    }}
                  >
                    {p.title?.charAt(0) || "?"}
                  </div>
                  <span
                    style={{
                      color: "#013220",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.title}
                  </span>
                </div>
                <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>
                  ₹{p.price}
                </span>
              </div>
            ))}
          </div>
        )}
        {products.length > 5 && (
          <Link
            to="/farmer/manage"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              color: "#2D6A4F",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all {products.length} products
          </Link>
        )}
      </motion.div>

      {/* ─── FLOATING ADD PRODUCT BUTTON ─── */}
      <Link
        to="/farmer/add"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "#013220",
          color: "white",
          border: "none",
          borderRadius: "16px",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(1,50,32,0.35)",
          textDecoration: "none",
          zIndex: 40,
          transition: "all 0.3s ease",
        }}
        className="fab-button"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2D6A4F";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(1,50,32,0.45)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#013220";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(1,50,32,0.35)";
        }}
      >
        <PlusCircle size={22} />
        <span className="fab-label">{t("dashboard.addProduct", lang)}</span>
      </Link>

      <style>{`
        .fab-button {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        @media (max-width: 480px) {
          .fab-label {
            display: none;
          }
          .fab-button {
            padding: 1rem !important;
            border-radius: 50% !important;
            bottom: 1.25rem !important;
            right: 1.25rem !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
