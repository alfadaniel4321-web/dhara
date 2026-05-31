import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { api } from '../services/api';
import { Search, Plus, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Greens", "Herbs"];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      if (match) setActiveCategory(match);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getProducts();
        if (data && data.length > 0) setProducts(data);
      } catch {}
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" ||
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesSearch = !search.trim() ||
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = useCallback(async (e, product) => {
    e.stopPropagation();
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
      className="px-5"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold"
          style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Shop
        </h1>
        <p className="text-xs" style={{ color: "rgba(29,43,31,0.35)" }}>
          {filtered.length} products
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="relative mb-4">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "rgba(29,43,31,0.25)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for organic products..."
          className="w-full rounded-3xl py-3.5 pl-10 pr-4 text-sm transition-all duration-300"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.04)",
            color: "#1D2B1F",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="flex gap-2 mb-5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 active:scale-95"
              style={{
                background: isActive ? "#0F5132" : "#fff",
                color: isActive ? "#fff" : "rgba(29,43,31,0.5)",
                border: isActive ? "none" : "1px solid rgba(0,0,0,0.04)",
                boxShadow: isActive ? "0 4px 12px rgba(15,81,50,0.2)" : "0 1px 4px rgba(0,0,0,0.02)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 pb-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            className="rounded-3xl overflow-hidden cursor-pointer transition-all active:scale-[0.97]"
            style={{
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="relative h-[130px] bg-cover bg-center"
              style={{
                backgroundImage: product.image
                  ? `url(${product.image})`
                  : "linear-gradient(135deg, #0A3B2A, #1a6b4a)",
              }}
            >
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    color: "#0F5132",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Leaf size={8} />
                  100%
                </span>
              </div>
            </div>

            <div className="p-3">
              <p className="text-xs font-semibold mb-0.5 truncate"
                style={{ color: "#1D2B1F" }}
              >
                {product.title || product.name}
              </p>
              <p className="text-[10px] mb-2"
                style={{ color: "rgba(29,43,31,0.35)" }}
              >
                {product.unit || "kg"}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-sm font-bold"
                  style={{ color: "#0F5132" }}
                >
                  ₹{product.price}
                  <span className="text-[9px] font-normal"
                    style={{ color: "rgba(29,43,31,0.35)" }}
                  >
                    /{product.unit || "kg"}
                  </span>
                </p>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{
                    background: "#0F5132",
                    boxShadow: "0 2px 8px rgba(15,81,50,0.2)",
                  }}
                >
                  <Plus size={14} color="#fff" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: "rgba(29,43,31,0.3)" }}>
            No products found
          </p>
        </div>
      )}
    </motion.div>
  );
}
