import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, Search, ChevronRight, Clock, CheckCircle, XCircle, RefreshCw, FileText, Truck, ShoppingBag, Star, MessageSquare } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import MobileOrders from "./MobileOrders";

const STATUS_STYLES = {
  "Delivered": { bg: "bg-green-900/30", color: "text-green-400", icon: CheckCircle },
  "In Transit": { bg: "bg-blue-900/30", color: "text-blue-400", icon: Truck },
  "Processing": { bg: "bg-purple-900/30", color: "text-purple-400", icon: Clock },
  "Pending": { bg: "bg-yellow-900/30", color: "text-yellow-400", icon: Clock },
  "Cancelled": { bg: "bg-red-900/30", color: "text-red-400", icon: XCircle },
};

const TABS = ["All", "Active", "Delivered", "Cancelled"];

export default function MyOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [showSuccess, setShowSuccess] = useState(location.state?.orderSuccess || false);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleReorder = async (order) => {
    try {
      for (const item of (order.products || [])) {
        await api.cart.addToCart(item.productId || item._id, item.count || 1);
      }
      dispatch(setCartSuccess(true));
      navigate('/cart');
    } catch (err) {
      console.error('Failed to reorder', err);
    }
  };

  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackReview, setFeedbackReview] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (feedbackRating === 0 || !feedbackReview.trim()) return;
    setSubmittingFeedback(true);
    try {
      const product = (feedbackOrder.products || [])[0];
      await api.feedback.createFeedback({
        farmerId: feedbackOrder.farmerId || feedbackOrder.products?.[0]?.farmerId,
        productId: product?.productId || product?._id,
        rating: feedbackRating,
        review: feedbackReview,
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackOrder(null);
        setFeedbackRating(0);
        setFeedbackReview("");
        setFeedbackSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Feedback failed', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.orders.updateOrderStatus(orderId, { orderStatus: 'Cancelled' });
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const filtered = orders.filter(o => {
    const matchTab = tab === "All" ? true : tab === "Active" ? o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled" : o.orderStatus === tab;
    const orderId = o._id || o.id || '';
    const productNames = (o.products || []).map(p => p.title || '').join(' ');
    const matchSearch = !search || orderId.toLowerCase().includes(search.toLowerCase()) || productNames.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (isMobile) return <MobileOrders />;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="border-b border-emerald-900/60 pb-4">
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <p className="text-sm text-emerald-300/70">Track and manage all your orders</p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search by order ID or items..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-700/60 outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t ? 'bg-emerald-600 text-white' : 'bg-emerald-950/40 text-emerald-400/60 hover:text-emerald-300 border border-emerald-900/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300 font-medium">Order successfully placed!</p>
          <button onClick={() => setShowSuccess(false)} className="ml-auto text-green-400/60 hover:text-green-300 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(order => {
          const status = order.orderStatus || "Pending";
          const statusInfo = STATUS_STYLES[status] || STATUS_STYLES["Pending"];
          const StatusIcon = statusInfo.icon;
          return (
            <div key={order._id || order.id} className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 hover:border-emerald-700/50 transition-all">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusInfo.bg}`}>
                    <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">#{((order._id || order.id) || '').slice(-8)}</p>
                    <p className="text-[10px] text-emerald-400/50">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3" /> {status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(order.products || []).slice(0, 4).map((item, i) => (
                  <span key={i} className="bg-emerald-900/20 text-emerald-300/80 px-2.5 py-1 rounded-full text-[10px] font-medium">
                    {item.title || 'Item'} x{item.count}
                  </span>
                ))}
                {(order.products || []).length > 4 && (
                  <span className="text-[10px] text-emerald-400/40 self-center">+{(order.products || []).length - 4} more</span>
                )}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 border-t border-emerald-900/40 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">₹{order.totalPrice || 0}</span>
                  <span className="text-[10px] text-emerald-400/50">· {order.paymentStatus === 'Paid' ? 'Paid' : 'COD'}</span>
                  {order.deliveryTime && (
                    <span className="text-[10px] text-emerald-400/50">· {order.deliveryTime}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {status !== "Cancelled" && (
                    <button onClick={() => handleReorder(order)} className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 rounded-xl text-[10px] font-semibold transition-all">
                      <RefreshCw className="w-3 h-3" /> Reorder
                    </button>
                  )}
                  {status !== "Cancelled" && status !== "Delivered" && (
                    <button onClick={() => handleCancelOrder(order._id || order.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl text-[10px] font-semibold transition-all"
                    >
                      <XCircle className="w-3 h-3" /> Cancel
                    </button>
                  )}
                  {status === "Delivered" && (
                    <button onClick={() => { setFeedbackOrder(order); setFeedbackRating(0); setFeedbackReview(""); setFeedbackSuccess(false); }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 rounded-xl text-[10px] font-semibold transition-all"
                    >
                      <Star className="w-3 h-3" /> Feedback
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {feedbackOrder && (
        <>
          <div onClick={() => setFeedbackOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50 bg-emerald-950 border border-emerald-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <MessageSquare size={16} className="text-amber-400" /> Rate Your Order
              </h3>
              <button onClick={() => setFeedbackOrder(null)} className="text-emerald-400/60 hover:text-emerald-300">
                <XCircle size={18} />
              </button>
            </div>

            {feedbackSuccess ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="mx-auto text-green-400 mb-3" />
                <p className="text-green-300 font-bold text-sm">Thank you for your feedback!</p>
              </div>
            ) : (
              <>
                <div className="text-[10px] text-emerald-400/50 mb-3">
                  Order #{((feedbackOrder._id || feedbackOrder.id) || '').slice(-8)}
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setFeedbackRating(s)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star size={28} fill={s <= feedbackRating ? "#F59E0B" : "none"}
                        color={s <= feedbackRating ? "#F59E0B" : "#6B7280"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>

                {/* Review */}
                <textarea value={feedbackReview} onChange={e => setFeedbackReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-3 text-sm text-white placeholder-emerald-600/60 outline-none focus:border-amber-500/50 resize-none min-h-[80px]"
                  rows={3}
                />

                <button onClick={handleFeedbackSubmit} disabled={submittingFeedback || feedbackRating === 0 || !feedbackReview.trim()}
                  className="w-full mt-4 py-3 rounded-xl text-xs font-bold transition-all bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-emerald-950/20 border border-emerald-900 rounded-2xl">
          <ShoppingBag className="w-12 h-12 mx-auto text-emerald-700/50 mb-4" />
          <p className="text-base font-bold text-emerald-300 mb-1">No orders yet</p>
          <p className="text-sm text-emerald-400/50">Your order history will appear here</p>
        </div>
      )}
    </div>
  );
}
