import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import { Clock, DollarSign, MapPin, ChevronRight, Check, Pencil } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const saved = localStorage.getItem('dhara_delivery_address') || user?.address || '';
  const [savedAddress] = useState(saved);
  const [editingAddress, setEditingAddress] = useState(!saved);
  const [address, setAddress] = useState(saved);
  const [deliveryTime, setDeliveryTime] = useState('Morning');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  
  const [totals, setTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    deliveryCost: 0,
    finalTotal: 0
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/dashboard');
      return;
    }
    const savedTotals = localStorage.getItem('checkout_totals');
    if (savedTotals) {
      setTotals(JSON.parse(savedTotals));
    }
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert('Please fill out the shipping address.');
      return;
    }

    try {
      const orderProducts = await Promise.all(cartItems.map(async (item) => {
        const rawId = typeof item.productId === 'string' ? item.productId : (item.productId?._id || item.productId?.id);
        let prod = typeof item.productId === 'object' ? (item.productId || {}) : {};
        const fId = prod.farmerId?._id || prod.farmerId?.id || prod.farmerId;

        if (!prod.title || !prod.quantity) {
          try {
            const fetched = await api.products.getProduct(rawId);
            if (fetched) prod = fetched;
          } catch {}
        }

        return {
          productId: rawId,
          title: prod.title,
          quantity: prod.quantity,
          price: prod.price ?? 0,
          count: item.count,
          farmerId: fId || prod.farmerId,
        };
      }));

      const orderObj = await api.orders.createOrder({
        products: orderProducts,
        deliveryTime,
        deliveryDate,
        subscriptionType: 'One-time',
        totalPrice: totals.finalTotal,
        address: address.trim(),
        paymentStatus: 'Pending'
      });

      // Save address for future orders
      localStorage.setItem('dhara_delivery_address', address.trim());
      
      // Clear client cart
      dispatch(clearCartLocal());
      
      // Navigate to my orders
      navigate('/my-orders');
    } catch (e) {
      alert(e.message || 'Order placement failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">Order Checkout</h2>
        <p className="text-sm text-emerald-300/70">Finalize shipping details and delivery timeslots.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
                1. Delivery Address
              </h3>
              {!editingAddress && (
                <button
                  type="button"
                  onClick={() => { setAddress(savedAddress); setEditingAddress(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-700 text-emerald-300 text-xs font-semibold hover:bg-emerald-800/40 hover:text-white transition-all"
                >
                  <Pencil size={14} /> Change
                </button>
              )}
            </div>
            {editingAddress ? (
              <div>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter complete shipping address in Kerala"
                  rows="3"
                  className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
                  required
                />
                {savedAddress && (
                  <button
                    type="button"
                    onClick={() => { setAddress(savedAddress); setEditingAddress(false); }}
                    className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4">
                <p className="text-sm text-white leading-relaxed">{savedAddress}</p>
              </div>
            )}
          </div>

          {/* Delivery timings */}
          <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-emerald-400" />
              2. Delivery Schedule
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-emerald-350 font-bold mb-2">Delivery Timeslot</label>
                <div className="grid grid-cols-2 gap-2 bg-emerald-950/40 p-1 rounded-xl border border-emerald-900/60">
                  <button 
                    type="button"
                    onClick={() => setDeliveryTime('Morning')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${deliveryTime === 'Morning' ? 'bg-emerald-550 text-white' : 'text-emerald-300/60 hover:text-white'}`}
                  >
                    Morning (6AM - 8AM)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDeliveryTime('Evening')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${deliveryTime === 'Evening' ? 'bg-emerald-550 text-white' : 'text-emerald-300/60 hover:text-white'}`}
                  >
                    Evening (5PM - 7PM)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-emerald-350 font-bold mb-2">Select Delivery Date</label>
                <input 
                  type="date"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-400" />
              3. Payment Method
            </h3>
            
            <div className="bg-emerald-900/10 border border-emerald-550 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-farmgreen-950 font-black">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white">Cash on Delivery (COD) only</span>
              </div>
              <p className="text-xs text-emerald-300/80 leading-relaxed font-light">
                To keep hyperlocal transaction fees at zero for our small-scale Kerala farmers, we process orders exclusively via Cash on Delivery. Hand over cash or pay via UPI directly to our delivery courier during product receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Panel */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white">Summary Review</h3>

          <div className="space-y-3.5 max-h-44 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-emerald-300 truncate max-w-[70%]">{item.productId?.title || '—'} <strong className="text-[10px] text-white">x{item.count}</strong></span>
                <span className="font-mono text-emerald-200">{item.productId?.price != null ? `₹${item.productId.price * item.count}` : '—'}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-xs border-t border-emerald-900/60 pt-4 text-emerald-350">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-white">₹{totals.subtotal}</span>
            </div>

            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-yellow-400">
                <span>Discount:</span>
                <span className="font-mono">-₹{totals.discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Cost:</span>
              <span className="font-semibold text-emerald-400">FREE</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-white border-t border-emerald-900/60 pt-3.5">
              <span>Final Total:</span>
              <span className="font-mono text-emerald-400 text-base">₹{totals.finalTotal}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-xs text-center flex items-center justify-center space-x-1.5"
          >
            <span>Confirm & Place Order</span>
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
