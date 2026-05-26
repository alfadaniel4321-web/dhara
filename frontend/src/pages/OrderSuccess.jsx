import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_order_details');
    if (saved) {
      setOrder(JSON.parse(saved));
    }
  }, []);

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-xs text-emerald-300">Loading order receipt...</p>
        <Link to="/dashboard" className="text-xs text-emerald-500 underline mt-2 inline-block">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-lg glassmorphism p-8 rounded-3xl border border-emerald-800 shadow-2xl text-center space-y-6 animate-fade-in">
        
        {/* Success Icon */}
        <div className="inline-flex bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 pulse-glow">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-white">Order Confirmed Successfully!</h2>
          <p className="text-xs text-emerald-300/80">Thank you for supporting small-scale Kerala agriculture.</p>
        </div>

        {/* Invoice details */}
        <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-900/60 text-xs text-left space-y-2.5">
          <div className="flex justify-between border-b border-emerald-900/40 pb-2 text-emerald-400 font-bold">
            <span>Order Number:</span>
            <span className="font-mono text-white select-all">{order.id || order._id}</span>
          </div>

          <div className="flex justify-between text-emerald-300">
            <span>Method of Payment:</span>
            <span className="font-bold text-white">Cash on Delivery (COD)</span>
          </div>

          <div className="flex justify-between text-emerald-300">
            <span>Total Payable Amount:</span>
            <span className="font-mono font-bold text-emerald-400">₹{order.totalPrice || 0}</span>
          </div>

          <div className="flex justify-between text-emerald-300">
            <span>Estimated Proximity Time:</span>
            <span className="font-semibold text-white">{order.deliveryTime || 'Morning'} (Next available slot)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button 
            onClick={() => navigate(`/track/${order.id || order._id}`)}
            className="w-full sm:flex-grow bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery</span>
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:flex-grow bg-emerald-900/40 hover:bg-emerald-900 border border-emerald-800 text-emerald-350 py-3 rounded-xl text-xs transition-all"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
