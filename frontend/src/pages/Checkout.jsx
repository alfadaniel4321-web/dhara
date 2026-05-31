import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import { MapPin, Truck, Calendar, CreditCard, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [placing, setPlacing] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const DELIVERY_FEE = 20;
  const subtotal = (cartItems || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0
  );
  const total = subtotal + DELIVERY_FEE;

  const handlePlaceOrder = async () => {
    if (placing) return;
    setPlacing(true);
    try {
      const orderData = {
        items: (cartItems || []).map((item) => ({
          product: item.product?._id || item._id || item.id,
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        deliveryMethod: deliveryTime,
        paymentMethod: paymentMethod,
        totalAmount: total,
      };
      const order = await api.orders.createOrder(orderData);
      dispatch(clearCartLocal());
      navigate('/order-success', { state: { order } });
    } catch (err) {
      console.error('Order failed', err);
      setPlacing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5"
    >
      <h1 className="text-xl font-bold mb-6"
        style={{ color: "#0A3B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Checkout
      </h1>

      {/* Delivery Address */}
      <div className="rounded-3xl p-4 mb-4 transition-all"
        style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(15,81,50,0.06)" }}
            >
              <MapPin size={16} color="#0F5132" />
            </div>
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#1D2B1F" }}>
                Delivery Address
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: "rgba(29,43,31,0.5)" }}>
                {user?.address || user?.addresses?.[0] || "Add delivery address"}
              </p>
            </div>
          </div>
          <button className="text-[11px] font-semibold flex-shrink-0"
            style={{ color: "#0F5132" }}
          >
            Change
          </button>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="rounded-3xl p-4 mb-4"
        style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Truck size={16} color="#0F5132" />
          <span className="text-xs font-semibold" style={{ color: "#1D2B1F" }}>
            Delivery Time
          </span>
        </div>
        <div className="flex gap-2">
          {[
            { id: "express", label: "Express", sub: "24 min" },
            { id: "scheduled", label: "Scheduled", sub: "Pick a time" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDeliveryTime(opt.id)}
              className="flex-1 py-2.5 rounded-2xl text-center transition-all active:scale-95"
              style={{
                background: deliveryTime === opt.id ? "#0F5132" : "rgba(15,81,50,0.04)",
                color: deliveryTime === opt.id ? "#fff" : "rgba(29,43,31,0.5)",
              }}
            >
              <p className="text-xs font-semibold">{opt.label}</p>
              <p className="text-[9px] mt-0.5 opacity-70">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-3xl p-4 mb-4"
        style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <CreditCard size={16} color="#0F5132" />
          <span className="text-xs font-semibold" style={{ color: "#1D2B1F" }}>
            Payment Method
          </span>
        </div>
        <div className="space-y-2">
          {[
            { id: "upi", label: "UPI" },
            { id: "card", label: "Card" },
            { id: "cod", label: "Cash on Delivery" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPaymentMethod(opt.id)}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-2xl transition-all active:scale-[0.99]"
              style={{
                background: paymentMethod === opt.id ? "rgba(15,81,50,0.06)" : "transparent",
              }}
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: paymentMethod === opt.id ? "#0F5132" : "rgba(29,43,31,0.15)",
                }}
              >
                {paymentMethod === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#0F5132" }} />
                )}
              </div>
              <span className="text-xs" style={{ color: "#1D2B1F" }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
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

      {/* Place Order */}
      <motion.button
        onClick={handlePlaceOrder}
        disabled={placing}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 mb-8"
        style={{
          background: placing
            ? "rgba(15,81,50,0.5)"
            : "linear-gradient(135deg, #0F5132, #0A3B2A)",
          color: "#fff",
          boxShadow: placing ? "none" : "0 8px 24px rgba(15,81,50,0.25)",
          border: "none",
          cursor: placing ? "not-allowed" : "pointer",
        }}
      >
        {placing ? "PLACING ORDER..." : "PLACE ORDER"}
        {!placing && <ArrowRight size={16} />}
      </motion.button>
    </motion.div>
  );
}
