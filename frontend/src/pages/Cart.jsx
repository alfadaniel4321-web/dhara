import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess, clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import CartItem from '../components/CartItem';
import { ShoppingBag, ChevronRight, Tag, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const loadCart = async () => {
    try {
      const data = await api.cart.getCart();
      dispatch(setCartSuccess(data));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId, nextCount) => {
    try {
      const updated = await api.cart.updateQuantity(productId, nextCount);
      dispatch(setCartSuccess(updated));
    } catch (e) {
      alert(e.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const updated = await api.cart.removeFromCart(productId);
      dispatch(setCartSuccess(updated));
    } catch (e) {
      alert(e.message || 'Failed to remove item');
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    try {
      const result = await api.public.validateCoupon({ code: coupon, cartTotal: totalPrice });
      if (result.valid) {
        const pct = result.coupon.discountType === 'percentage' ? result.coupon.discountValue : 0;
        setDiscountPercent(pct);
        setCouponSuccess(result.coupon.description || 'Coupon applied successfully!');
      }
    } catch (err) {
      const msg = err.message || 'Invalid coupon code';
      setCouponError(msg);
      setDiscountPercent(0);
    }
  };

  const subtotal = totalPrice;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const deliveryCost = subtotal > 0 ? 25 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryCost);

  const handleCheckout = () => {
    // Save coupon/totals details to local storage so checkout page can read them
    localStorage.setItem('checkout_totals', JSON.stringify({
      subtotal,
      discountAmount,
      deliveryCost,
      finalTotal,
      discountPercent
    }));
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20">
          <ShoppingBag className="w-12 h-12 text-emerald-400 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h3>
        <p className="text-xs text-emerald-300/60 leading-relaxed">
          It looks like you haven't added any fresh farm products to your cart yet. Explore today's fresh harvests to start ordering!
        </p>
        <Link 
          to="/dashboard"
          className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center space-x-1.5"
        >
          <span>Explore Marketplace</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">My Shopping Cart</h2>
        <p className="text-sm text-emerald-300/70">Review items selected for hyperlocal delivery from Kerala farms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, idx) => (
            <CartItem 
              key={item.productId?.id || item.productId?._id || idx}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Cart summary panel */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white">Order Summary</h3>

          {/* Coupon Entry */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="block text-xs text-emerald-400 font-bold">Apply Coupon Code:</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. HARVEST15"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all font-mono"
              />
              <button 
                type="submit"
                className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Apply
              </button>
            </div>
            {couponSuccess && <p className="text-[10px] text-emerald-400 font-semibold">{couponSuccess}</p>}
            {couponError && <p className="text-[10px] text-red-400 font-semibold">{couponError}</p>}
          </form>

          {/* Price Breakdown */}
          <div className="space-y-3.5 text-xs border-t border-emerald-900/60 pt-4 text-emerald-300">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-white">₹{subtotal}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-yellow-400">
                <span>Discount ({discountPercent}%):</span>
                <span className="font-mono">-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Hyperlocal Delivery:</span>
              <span className="font-semibold text-emerald-400">₹25</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-white border-t border-emerald-900/60 pt-3.5">
              <span>Order Total:</span>
              <span className="font-mono text-emerald-400 text-base">₹{finalTotal}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-xs text-center flex items-center justify-center space-x-1.5"
          >
            <span>Proceed to Checkout</span>
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60 flex items-center space-x-2 text-[10px] text-emerald-300/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Products are backed by Dhara's Direct Harvest Guarantee.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
