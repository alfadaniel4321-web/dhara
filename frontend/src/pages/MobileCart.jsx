import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess, clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import {
  ShoppingBag, ChevronLeft, Minus, Plus, Trash2,
  Tag, ShieldCheck, Leaf, Search, Package, User, Home,
  Heart, Menu,
} from 'lucide-react';

function HomeIcon({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
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
      paddingBottom: cartItems.length > 0 ? '190px' : '68px',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .fade-up { animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .scale-in { animation: scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .cart-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(245,243,231,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .cart-card {
          background: #FFFFFF; border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
        }
        .bottom-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          background: none; border: none; cursor: pointer; padding: 0.25rem 0;
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
          width: 30px; height: 30px; border-radius: 10px;
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          background: rgba(27,67,50,0.06); color: #1B4332;
          transition: all 0.15s ease;
        }
        .qty-btn:active { transform: scale(0.85); }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="cart-header">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.25rem', maxWidth: '480px', margin: '0 auto',
        }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={16} color="#A3C87A" strokeWidth={2} />
            </div>
            <div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.2rem', fontWeight: 700, color: '#1B4332',
                letterSpacing: '-0.02em', lineHeight: 1,
              }}>DHARA</span>
              <span style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.4rem',
                letterSpacing: '0.3em', color: '#6A994E',
                display: 'block', textTransform: 'uppercase',
              }}>Organic Kerala</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/wishlist" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none', position: 'relative',
            }}>
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none', position: 'relative',
            }}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#D4A017', color: '#FFFFFF',
                  fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"DM Sans", sans-serif',
                }}>{itemCount}</span>
              )}
            </Link>
            <Link to="/profile" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none',
            }}>
              <Menu size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

        {cartItems.length === 0 ? (
          /* ─── EMPTY STATE ─── */
          <div style={{
            textAlign: 'center', padding: '4rem 1.5rem',
            marginTop: '1rem',
          }}>
            <div style={{
              width: '72px', height: '72px', margin: '0 auto 1rem',
              borderRadius: '24px', background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={32} color="rgba(27,67,50,0.15)" strokeWidth={1.5} />
            </div>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '1rem',
              fontWeight: 600, color: '#1B4332', margin: '0 0 0.35rem',
            }}>Your cart is empty</p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
              color: 'rgba(27,67,50,0.4)', margin: '0 0 1.25rem',
            }}>Browse our farm-fresh produce and add items you love.</p>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem',
              fontWeight: 600, color: '#FFFFFF', background: '#1B4332',
              borderRadius: '14px', padding: '0.75rem 1.5rem',
              textDecoration: 'none',
            }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* ─── CART ITEMS ─── */}
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {cartItems.map((item, idx) => {
                const product = item.productId || {};
                const pid = product._id || product.id;
                return (
                  <div key={pid || idx} className="cart-card fade-up" style={{ animationDelay: `${0.03 * idx}s`, padding: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {/* Image */}
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '16px', flexShrink: 0,
                        background: 'rgba(27,67,50,0.04)', overflow: 'hidden',
                      }}>
                        {product.image ? (
                          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={24} color="rgba(27,67,50,0.15)" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <p style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem',
                              fontWeight: 600, color: '#1B4332', margin: 0,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{product.title || 'Item'}</p>
                            <button onClick={() => handleRemove(pid)} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              padding: '0.2rem', color: 'rgba(27,67,50,0.2)',
                              flexShrink: 0, marginLeft: '0.25rem',
                            }}>
                              <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                          {product.quantity && (
                            <p style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                              color: 'rgba(27,67,50,0.4)', margin: '0.1rem 0 0 0',
                            }}>{product.quantity}</p>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                          {/* Price */}
                          <div>
                            <p style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.95rem',
                              fontWeight: 700, color: '#1B4332', margin: 0,
                            }}>₹{product.price != null ? product.price * item.count : 0}</p>
                            {product.price != null && (
                              <p style={{
                                fontFamily: '"DM Sans", sans-serif', fontSize: '0.55rem',
                                color: 'rgba(27,67,50,0.3)', margin: '0.05rem 0 0 0',
                              }}>₹{product.price}/each</p>
                            )}
                          </div>

                          {/* Quantity controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              className="qty-btn"
                              onClick={() => handleUpdateQuantity(pid, item.count - 1)}
                              disabled={item.count <= 1}
                              style={{ opacity: item.count <= 1 ? 0.3 : 1 }}
                            >
                              <Minus size={13} strokeWidth={2} />
                            </button>
                            <span style={{
                              fontFamily: '"Courier New", monospace', fontSize: '0.78rem',
                              fontWeight: 700, color: '#1B4332', minWidth: '20px',
                              textAlign: 'center',
                            }}>{item.count}</span>
                            <button
                              className="qty-btn"
                              onClick={() => handleUpdateQuantity(pid, item.count + 1)}
                            >
                              <Plus size={13} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── COUPON ─── */}
            <div className="cart-card" style={{ marginTop: '0.75rem', padding: '0.85rem 1rem' }}>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={16} color="rgba(27,67,50,0.3)" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
                    color: '#1B4332', background: 'transparent',
                    padding: '0.4rem 0',
                  }}
                />
                <button type="submit" style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                  fontWeight: 700, color: '#FFFFFF', background: '#1B4332',
                  border: 'none', borderRadius: '10px', padding: '0.45rem 0.85rem',
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
          </>
        )}

      </div>

      {/* ─── BOTTOM BAR (summary + nav combined) ─── */}
      <div className="bottom-bar">
        {cartItems.length > 0 && (
          <div style={{ borderBottom: '1px solid rgba(27,67,50,0.06)' }}>
            <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0.7rem 1rem 0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', color: 'rgba(27,67,50,0.5)' }}>Subtotal</span>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', fontWeight: 600, color: '#1B4332' }}>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', color: '#D4A017' }}>Discount ({discountPercent}%)</span>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', fontWeight: 600, color: '#D4A017' }}>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', color: 'rgba(27,67,50,0.5)' }}>Delivery</span>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', fontWeight: 600, color: '#1B4332' }}>₹{deliveryCost}</span>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '14px',
                  border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #1B4332, #0F1E14)',
                  color: '#F5F3E7', fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.78rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 20px rgba(27,67,50,0.25)',
                }}
              >
                Proceed to Checkout <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{ padding: '0.35rem 0 0.5rem' }}>
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
