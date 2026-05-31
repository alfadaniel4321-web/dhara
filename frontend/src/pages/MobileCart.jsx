import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import {
  ShoppingBag, ChevronLeft, Minus, Plus, Trash2,
  Tag, Leaf, Search, Package, User, Home, ChevronRight,
} from 'lucide-react';

function HomeIcon({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '20px', padding: '1rem',
      boxShadow: '0 2px 16px rgba(27,67,50,0.06)',
      display: 'flex', gap: '0.85rem', animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ width: '84px', height: '84px', borderRadius: '16px', background: 'rgba(27,67,50,0.04)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.2rem' }}>
        <div style={{ width: '65%', height: '14px', borderRadius: '6px', background: 'rgba(27,67,50,0.06)' }} />
        <div style={{ width: '40%', height: '10px', borderRadius: '6px', background: 'rgba(27,67,50,0.04)' }} />
        <div style={{ width: '30%', height: '12px', borderRadius: '6px', background: 'rgba(27,67,50,0.06)', marginTop: 'auto' }} />
      </div>
    </div>
  );
}

export default function MobileCart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [animQty, setAnimQty] = useState({});
  const [couponOpen, setCouponOpen] = useState(false);

  const loadCart = async () => {
    try {
      const data = await api.cart.getCart();
      dispatch(setCartSuccess(data));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleUpdateQuantity = async (productId, nextCount) => {
    if (nextCount < 1) return;
    setAnimQty(prev => ({ ...prev, [productId]: nextCount }));
    try {
      const updated = await api.cart.updateQuantity(productId, nextCount);
      dispatch(setCartSuccess(updated));
    } catch (e) {
      alert(e.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    setTimeout(async () => {
      try {
        const updated = await api.cart.removeFromCart(productId);
        dispatch(setCartSuccess(updated));
      } catch (e) {
        alert(e.message || 'Failed to remove item');
      }
      setRemovingId(null);
    }, 250);
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
  const itemCount = cartItems.reduce((sum, item) => sum + item.count, 0);

  const handleCheckout = () => {
    localStorage.setItem('checkout_totals', JSON.stringify({
      subtotal, discountAmount, deliveryCost, finalTotal, discountPercent,
    }));
    navigate('/checkout');
  };

  return (
    <div style={{
      background: '#F5F3E7',
      minHeight: '100vh',
      paddingBottom: cartItems.length > 0 ? '230px' : '80px',
      position: 'relative',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes qtyPop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .scale-in { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .cart-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(245,243,231,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .cart-card {
          background: #FFFFFF; border-radius: 20px;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .cart-card.removing {
          opacity: 0; transform: translateX(40px) scale(0.95);
        }
        .bottom-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .summary-sheet {
          background: #FFFFFF;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 24px rgba(27,67,50,0.08);
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          background: none; border: none; cursor: pointer; padding: 0.3rem 0;
          transition: transform 0.2s ease; text-decoration: none; min-width: 56px;
        }
        .nav-item:active { transform: scale(0.9); }
        .center-btn {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #1B4332, #2D6A4F);
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center; margin-top: -20px;
          box-shadow: 0 4px 20px rgba(27,67,50,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .center-btn:active { transform: scale(0.92); }
        .qty-btn {
          width: 36px; height: 36px; border-radius: 12px;
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          background: rgba(27,67,50,0.06); color: #1B4332;
          transition: all 0.15s ease;
        }
        .qty-btn:active { transform: scale(0.85); background: rgba(27,67,50,0.12); }
        .qty-btn:disabled { opacity: 0.25; }
        .checkout-btn {
          width: 100%; height: 54px; border: none; border-radius: 16px;
          cursor: pointer;
          background: linear-gradient(135deg, #1B4332, #0F1E14);
          color: #F5F3E7; font-family: '"DM Sans", sans-serif';
          font-size: 0.85rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 24px rgba(27,67,50,0.3);
          transition: transform 0.2s ease;
        }
        .checkout-btn:active { transform: scale(0.97); }
        .coupon-toggle {
          display: flex; align-items: center; gap: 0.5rem;
          background: none; border: none; cursor: pointer;
          font-family: '"DM Sans", sans-serif'; font-size: 0.72rem;
          font-weight: 600; color: #1B4332; padding: 0.65rem 0;
        }
        .coupon-toggle:active { opacity: 0.6; }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="cart-header">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1rem', maxWidth: '480px', margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={() => navigate(-1)} style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332',
            }}>
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <span style={{
              fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.1rem',
              fontWeight: 700, color: '#1B4332',
            }}>My Cart</span>
          </div>
          {cartItems.length > 0 && (
            <span style={{
              fontFamily: '"Courier New", monospace', fontSize: '0.6rem',
              letterSpacing: '0.05em', color: 'rgba(27,67,50,0.4)',
              background: 'rgba(27,67,50,0.04)', padding: '0.25rem 0.65rem',
              borderRadius: '20px',
            }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

        {loading && cartItems.length === 0 ? (
          /* ─── LOADING SKELETONS ─── */
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : cartItems.length === 0 ? (
          /* ─── EMPTY STATE ─── */
          <div style={{
            textAlign: 'center', padding: '4.5rem 1.5rem 2rem',
            marginTop: '1rem',
          }}>
            <div style={{
              width: '88px', height: '88px', margin: '0 auto 1.25rem',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(27,67,50,0.06), rgba(27,67,50,0.02))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(27,67,50,0.04)',
            }}>
              <ShoppingBag size={40} color="rgba(27,67,50,0.12)" strokeWidth={1.5} />
            </div>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '1.05rem',
              fontWeight: 600, color: '#1B4332', margin: '0 0 0.35rem',
            }}>Your cart is empty</p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
              color: 'rgba(27,67,50,0.4)', margin: '0 0 1.5rem', lineHeight: 1.5,
              maxWidth: '260px', marginLeft: 'auto', marginRight: 'auto',
            }}>Add fresh farm produce straight from Kerala's finest growers to your cart.</p>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem',
              fontWeight: 600, color: '#FFFFFF',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              borderRadius: '16px', padding: '0.85rem 1.75rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(27,67,50,0.2)',
            }}>
              Browse Products <ChevronRight size={16} strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <>
            {/* ─── CART ITEMS ─── */}
            <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cartItems.map((item, idx) => {
                const product = item.productId || {};
                const pid = product._id || product.id;
                const isRemoving = removingId === pid;
                const qtyAnimKey = animQty[pid];
                return (
                  <div
                    key={pid || idx}
                    className={`cart-card fade-up${isRemoving ? ' removing' : ''}`}
                    style={{ animationDelay: `${0.04 * idx}s`, padding: '1rem' }}
                  >
                    <div style={{ display: 'flex', gap: '0.85rem' }}>
                      {/* Image */}
                      <div style={{
                        width: '84px', height: '84px', borderRadius: '16px', flexShrink: 0,
                        background: 'rgba(27,67,50,0.04)', overflow: 'hidden',
                      }}>
                        {product.image ? (
                          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={28} color="rgba(27,67,50,0.1)" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        {/* Top row: name + delete */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
                            fontWeight: 600, color: '#1B4332', margin: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            flex: 1,
                          }}>{product.title || 'Item'}</p>
                          <button onClick={() => handleRemove(pid)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            width: '36px', height: '36px', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'rgba(27,67,50,0.2)', flexShrink: 0, marginLeft: '0.4rem',
                            transition: 'all 0.2s ease',
                          }}>
                            <Trash2 size={15} strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Weight/quantity label */}
                        {product.quantity && (
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem',
                            color: 'rgba(27,67,50,0.35)', margin: '0.05rem 0 0 0',
                            letterSpacing: '0.02em',
                          }}>{product.quantity}</p>
                        )}

                        {/* Bottom row: price + qty controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '1rem',
                            fontWeight: 700, color: '#1B4332', margin: 0,
                          }}>₹{product.price != null ? product.price * item.count : 0}</p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              className="qty-btn"
                              onClick={() => handleUpdateQuantity(pid, item.count - 1)}
                              disabled={item.count <= 1}
                            >
                              <Minus size={14} strokeWidth={2} />
                            </button>
                            <span key={qtyAnimKey} style={{
                              fontFamily: '"Courier New", monospace', fontSize: '0.82rem',
                              fontWeight: 700, color: '#1B4332', minWidth: '24px',
                              textAlign: 'center',
                              animation: qtyAnimKey ? 'qtyPop 0.25s ease' : 'none',
                            }}>{item.count}</span>
                            <button
                              className="qty-btn"
                              onClick={() => handleUpdateQuantity(pid, item.count + 1)}
                            >
                              <Plus size={14} strokeWidth={2} />
                            </button>
                          </div>
                        </div>

                        {/* Per-unit price */}
                        {product.price != null && (
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.5rem',
                            color: 'rgba(27,67,50,0.25)', margin: '0.05rem 0 0 0',
                          }}>₹{product.price} / unit</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── COUPON ─── */}
            <div className="cart-card" style={{ marginTop: '1rem', overflow: 'hidden' }}>
              <button className="coupon-toggle" onClick={() => setCouponOpen(!couponOpen)}
                style={{ width: '100%', padding: '0.75rem 1rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={16} color="rgba(27,67,50,0.3)" strokeWidth={1.5} />
                  <span>{couponSuccess ? 'Coupon applied' : 'Have a coupon code?'}</span>
                </div>
                <ChevronLeft size={14} color="rgba(27,67,50,0.25)" strokeWidth={2}
                  style={{ transform: couponOpen ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
              </button>
              {couponOpen && (
                <div className="slide-up" style={{ padding: '0 1rem 0.85rem' }}>
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      style={{
                        flex: 1, border: '1px solid rgba(27,67,50,0.1)', borderRadius: '12px',
                        outline: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
                        color: '#1B4332', background: 'rgba(27,67,50,0.03)',
                        padding: '0.6rem 0.75rem',
                      }}
                    />
                    <button type="submit" style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem',
                      fontWeight: 700, color: '#FFFFFF', background: '#1B4332',
                      border: 'none', borderRadius: '12px', padding: '0 1rem',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>Apply</button>
                  </form>
                  {couponSuccess && (
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', color: '#2D6A4F', fontWeight: 600, margin: '0.4rem 0 0 0' }}>{couponSuccess}</p>
                  )}
                  {couponError && (
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', color: '#DC2626', fontWeight: 600, margin: '0.4rem 0 0 0' }}>{couponError}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="bottom-bar">
        {cartItems.length > 0 && (
          <div className="summary-sheet">
            <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0.5rem 1rem 0.4rem' }}>
              {/* Summary rows */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', color: 'rgba(27,67,50,0.5)' }}>Subtotal</span>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', fontWeight: 600, color: '#1B4332' }}>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', color: '#D4A017' }}>Discount ({discountPercent}%)</span>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', fontWeight: 600, color: '#D4A017' }}>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', color: 'rgba(27,67,50,0.5)' }}>Delivery</span>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', fontWeight: 600, color: '#1B4332' }}>₹{deliveryCost}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(27,67,50,0.06)', marginBottom: '0.6rem' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#1B4332' }}>Total</span>
                <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.15rem', fontWeight: 700, color: '#1B4332' }}>₹{finalTotal}</span>
              </div>

              {/* Checkout Button */}
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '0.35rem 0 0.5rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
            maxWidth: '480px', margin: '0 auto', padding: '0 0.5rem',
          }}>
            <Link to="/dashboard" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
              <HomeIcon size={20} strokeWidth={1.5} />
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Home</span>
            </Link>
            <Link to="/products" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
              <Search size={20} strokeWidth={1.5} />
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Shop</span>
            </Link>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '60px' }}>
              <div className="center-btn" style={{ background: '#D4A017' }}>
                <ShoppingBag size={22} color="#FFFFFF" strokeWidth={2} />
              </div>
            </div>
            <Link to="/my-orders" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
              <Package size={20} strokeWidth={1.5} />
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Orders</span>
            </Link>
            <Link to="/profile" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
              <User size={20} strokeWidth={1.5} />
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
