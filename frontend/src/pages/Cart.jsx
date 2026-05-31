import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess, clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import { Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const DELIVERY_FEE = 20;
  const subtotal = (cartItems || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0
  );
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  const handleQuantity = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    try {
      const updated = await api.cart.addToCart(item.product?._id || item._id || item.id, delta);
      dispatch(setCartSuccess(updated));
    } catch {}
  };

  const handleRemove = async (item) => {
    try {
      const updated = await api.cart.removeFromCart(item.product?._id || item._id || item.id);
      dispatch(setCartSuccess(updated));
    } catch {
      dispatch(clearCartLocal());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold"
          style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My Cart
        </h1>
        <span className="text-xs" style={{ color: "rgba(29,43,31,0.35)" }}>
          {cartItems?.length || 0} items
        </span>
      </div>

      {(!cartItems || cartItems.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(15,81,50,0.06)" }}
          >
            <ShoppingBag size={24} color="rgba(15,81,50,0.3)" />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "#1D2B1F" }}>
            Your cart is empty
          </p>
          <p className="text-xs mb-5" style={{ color: "rgba(29,43,31,0.35)" }}>
            Add items from our fresh harvest
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-wider transition-all"
            style={{
              background: "#0F5132",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(15,81,50,0.2)",
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {(cartItems || []).map((item, i) => {
              const product = item.product || item;
              const productId = product._id || product.id;
              return (
                <motion.div
                  key={productId || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-3 p-3 rounded-3xl"
                  style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                >
                  <div
                    className="w-[70px] h-[70px] rounded-2xl bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: product.image
                        ? `url(${product.image})`
                        : "linear-gradient(135deg, #0A3B2A, #1a6b4a)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-semibold truncate"
                        style={{ color: "#1D2B1F" }}
                      >
                        {product.title || product.name || "Product"}
                      </p>
                      <button
                        onClick={() => handleRemove(item)}
                        className="p-1 transition-all active:scale-90"
                      >
                        <Trash2 size={13} color="rgba(29,43,31,0.25)" />
                      </button>
                    </div>
                    <p className="text-[11px] font-bold mb-2" style={{ color: "#0F5132" }}>
                      ₹{product.price}/{product.unit || "kg"}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantity(item, -1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                        style={{ background: "rgba(15,81,50,0.06)" }}
                      >
                        <Minus size={11} color="#0F5132" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center"
                        style={{ color: "#0A3B2A" }}
                      >
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQuantity(item, 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                        style={{ background: "rgba(15,81,50,0.06)" }}
                      >
                        <Plus size={11} color="#0F5132" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="rounded-3xl p-4 mb-6"
            style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
          >
            <h3 className="text-xs font-semibold mb-3"
              style={{ color: "#0A3B2A" }}
            >
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: "rgba(29,43,31,0.45)" }}>Subtotal</span>
                <span style={{ color: "#1D2B1F" }}>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "rgba(29,43,31,0.45)" }}>Delivery Fee</span>
                <span style={{ color: "#1D2B1F" }}>₹{DELIVERY_FEE}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2"
                style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
              >
                <span style={{ color: "#0A3B2A" }}>Total</span>
                <span style={{ color: "#0F5132" }}>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Truck size={12} color="rgba(15,81,50,0.4)" />
            <span className="text-[10px]" style={{ color: "rgba(29,43,31,0.35)" }}>
              Free delivery on orders above ₹200
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-4 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0F5132, #0A3B2A)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(15,81,50,0.25)",
              border: "none",
            }}
          >
            PROCEED TO CHECKOUT
            <ArrowRight size={16} />
          </button>
        </>
      )}
    </motion.div>
  );
}
