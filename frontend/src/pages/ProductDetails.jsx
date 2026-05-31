import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { api } from "../services/api";
import { Heart, Minus, Plus, Leaf, Shield, Sun, Truck, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: Leaf, label: "100% Organic" },
  { icon: Shield, label: "Pesticide Free" },
  { icon: Sun, label: "Handpicked Daily" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.getProductById(id);
        setProduct(data);
      } catch {
        try {
          const all = await api.products.getProducts();
          const found = all.find((p) => (p._id || p.id) === id);
          if (found) setProduct(found);
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    try {
      const updatedCart = await api.cart.addToCart(product._id || product.id, quantity);
      dispatch(setCartSuccess(updatedCart));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  }, [product, quantity, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(15,81,50,0.2)", borderTopColor: "#0F5132" }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-5 py-8 text-center">
        <p className="text-sm" style={{ color: "rgba(29,43,31,0.4)" }}>Product not found</p>
        <button onClick={() => navigate("/products")} className="mt-3 text-xs font-semibold" style={{ color: "#0F5132" }}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative mx-5 rounded-4xl overflow-hidden mb-5"
        style={{
          background: "linear-gradient(135deg, #0A3B2A, #1a6b4a)",
          minHeight: "280px",
          boxShadow: "0 8px 32px rgba(10,59,42,0.15)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <ArrowLeft size={16} color="#fff" />
        </button>

        <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <Heart size={16} color="#fff" />
        </button>

        {product.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.image})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf size={60} color="rgba(255,255,255,0.15)" />
          </div>
        )}
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 50%, rgba(10,59,42,0.3) 100%)",
          }}
        />

        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Leaf size={10} />
            100% Organic
          </span>
        </div>
      </div>

      <div className="px-5">
        <div className="mb-5">
          <p className="text-[10px] font-semibold tracking-[0.15em] mb-1"
            style={{ color: "rgba(15,81,50,0.4)" }}
          >
            {product.category || "ORGANIC PRODUCE"}
          </p>
          <h1 className="text-2xl font-bold mb-1"
            style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {product.title || product.name}
          </h1>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold" style={{ color: "#0F5132" }}>
              ₹{product.price}
            </span>
            <span className="text-sm" style={{ color: "rgba(29,43,31,0.35)" }}>
              /{product.unit || "kg"}
            </span>
          </div>
          <p className="text-sm leading-relaxed"
            style={{ color: "rgba(29,43,31,0.55)" }}
          >
            {product.description || `Fresh, juicy & organically grown ${(product.title || product.name || "").toLowerCase()} from our farms.`}
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          {FEATURES.map((f) => (
            <div key={f.label}
              className="flex-1 rounded-2xl p-3 text-center"
              style={{ background: "rgba(15,81,50,0.04)" }}
            >
              <f.icon size={18} color="#0F5132" className="mx-auto mb-1" />
              <p className="text-[9px] font-semibold leading-tight"
                style={{ color: "rgba(29,43,31,0.6)" }}
              >
                {f.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6 px-4 py-3 rounded-2xl"
          style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "#1D2B1F" }}>
            Quantity
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(15,81,50,0.06)" }}
            >
              <Minus size={14} color="#0F5132" />
            </button>
            <span className="text-sm font-bold w-6 text-center"
              style={{ color: "#0A3B2A" }}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(15,81,50,0.06)" }}
            >
              <Plus size={14} color="#0F5132" />
            </button>
          </div>
        </div>

        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            background: addedToCart
              ? "linear-gradient(135deg, #0F5132, #1a6b4a)"
              : "linear-gradient(135deg, #0F5132, #0A3B2A)",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(15,81,50,0.25)",
            border: "none",
          }}
        >
          {addedToCart ? (
            <>Added to Cart</>
          ) : (
            <>
              <ShoppingBag size={16} />
              ADD TO CART
            </>
          )}
        </motion.button>

        <div className="flex items-center gap-2 justify-center mt-4 mb-8">
          <Truck size={12} color="rgba(15,81,50,0.4)" />
          <span className="text-[10px] font-medium"
            style={{ color: "rgba(29,43,31,0.4)" }}
          >
            Delivered in 24 min • Farm-to-table
          </span>
        </div>
      </div>
    </motion.div>
  );
}
