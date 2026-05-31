import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Heart, ShoppingCart, ChevronLeft, Trash2, Leaf,
  Search, Package, User, Star, ShoppingBag, ChevronRight,
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

function StarRating({ rating, size = 10 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.12rem' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? "#D4A017" : "rgba(27,67,50,0.06)"} color={i <= Math.round(rating) ? "#D4A017" : "rgba(27,67,50,0.06)"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [removingId, setRemovingId] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const [items, productsData] = await Promise.all([
        api.wishlist.getWishlist(),
        api.products.getProducts().catch(() => []),
      ]);
      setProductsList(items || []);
      setAllProducts(Array.isArray(productsData) ? productsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = useCallback(async (id) => {
    setRemovingId(id);
    setTimeout(async () => {
      try {
        const updatedList = await api.wishlist.toggleWishlist(id);
        const items = Array.isArray(updatedList) ? updatedList : [];
        setProductsList(items);
      } catch (e) {
        alert(e.message || 'Failed to remove from wishlist');
      }
      setRemovingId(null);
    }, 250);
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
    } catch (e) {
      alert(e.message || 'Failed to add to cart');
    }
  }, [dispatch]);

  const handleBuyNow = useCallback(async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
      navigate('/checkout');
    } catch (e) {
      alert(e.message || 'Failed to process order');
    }
  }, [dispatch, navigate]);

  const wishlistIds = new Set(productsList.map(p => p.id || p._id));
  const recommended = allProducts.filter(p => !wishlistIds.has(p.id || p._id)).slice(0, 10);

  // ─── DESKTOP ───
  if (!isMobile) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="border-b border-emerald-900/60 pb-4">
          <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
          <p className="text-sm text-emerald-300/70">Manage fresh harvests saved for future orders.</p>
        </div>
        {productsList.length === 0 ? (
          <div className="glassmorphism p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="text-base font-bold text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-emerald-300/65">Browse the marketplace catalog and save products you like for later.</p>
            <button onClick={() => navigate('/dashboard')} className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95">Explore Marketplace</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.map(product => {
              const stock = product.stock !== undefined ? product.stock : 10;
              const isLowStock = stock > 0 && stock <= 5;
              return (
                <div key={product.id || product._id} className="bg-emerald-950/20 rounded-3xl border border-emerald-900 p-4 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-2xl transition-all">
                  <div className="space-y-3.5">
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-emerald-900/20">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      <button onClick={() => handleRemove(product.id || product._id)} className="absolute top-2 right-2 p-2 rounded-full glassmorphism text-red-400 hover:text-red-300 transition-colors" title="Remove from wishlist">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white truncate">{product.title}</h4>
                      <p className="text-xs font-semibold text-emerald-400">₹{product.price} / {product.quantity}</p>
                      {isLowStock && (
                        <div className="bg-yellow-950/40 p-2 rounded-lg border border-yellow-800/40 flex items-center text-[10px] text-yellow-400 mt-1">
                          <span>Hurry, only {stock} left in stock!</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center gap-2">
                    <button onClick={() => handleAddToCart(product)} className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5" disabled={stock <= 0}>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── MOBILE ───
  return (
    <div style={{
      background: '#F5F3E7',
      minHeight: '100vh',
      paddingBottom: '140px',
      position: 'relative',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .scale-in { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .wishlist-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(245,243,231,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .wishlist-card {
          background: #FFFFFF; border-radius: 20px;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .wishlist-card.removing {
          opacity: 0; transform: translateX(40px) scale(0.95);
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
        .action-btn {
          flex: 1; height: 44px; border: none; border-radius: 14px;
          cursor: pointer; font-family: '"DM Sans", sans-serif';
          font-size: 0.72rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          gap: 0.35rem; transition: transform 0.2s ease;
        }
        .action-btn:active { transform: scale(0.96); }
        .rec-card {
          min-width: 130px; max-width: 130px;
          background: #FFFFFF; border-radius: 18px;
          box-shadow: 0 2px 12px rgba(27,67,50,0.04);
          overflow: hidden; flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .rec-card:active { transform: scale(0.96); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="wishlist-header">
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
            }}>My Wishlist</span>
          </div>
          {productsList.length > 0 && (
            <span style={{
              fontFamily: '"Courier New", monospace', fontSize: '0.6rem',
              letterSpacing: '0.05em', color: 'rgba(27,67,50,0.4)',
              background: 'rgba(27,67,50,0.04)', padding: '0.25rem 0.65rem',
              borderRadius: '20px',
            }}>{productsList.length} item{productsList.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

        {loading && productsList.length === 0 ? (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : productsList.length === 0 ? (
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
              <Heart size={40} color="rgba(27,67,50,0.12)" strokeWidth={1.5} />
            </div>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '1.05rem',
              fontWeight: 600, color: '#1B4332', margin: '0 0 0.35rem',
            }}>Your wishlist is empty</p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
              color: 'rgba(27,67,50,0.4)', margin: '0 0 1.5rem', lineHeight: 1.5,
              maxWidth: '260px', marginLeft: 'auto', marginRight: 'auto',
            }}>Save your favorite farm-fresh products and come back to them anytime.</p>
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
            {/* ─── SUMMARY CARD ─── */}
            <div className="wishlist-card" style={{
              marginTop: '0.85rem', padding: '0.85rem 1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(212,160,23,0.1), rgba(212,160,23,0.04))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Heart size={18} color="#D4A017" fill="#D4A017" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                    fontWeight: 600, color: '#1B4332', margin: 0,
                  }}>{productsList.length} Saved Items</p>
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: '0.58rem',
                    color: 'rgba(27,67,50,0.35)', margin: '0.05rem 0 0 0',
                  }}>Ready to order whenever you are</p>
                </div>
              </div>
              <span style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
                color: '#D4A017', background: 'rgba(212,160,23,0.08)',
                padding: '0.2rem 0.5rem', borderRadius: '8px',
                letterSpacing: '0.03em',
              }}>Saved</span>
            </div>

            {/* ─── WISHLIST ITEMS ─── */}
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {productsList.map((product, idx) => {
                const pid = product.id || product._id;
                const stock = product.stock !== undefined ? product.stock : 10;
                const isLowStock = stock > 0 && stock <= 5;
                const isOutOfStock = stock <= 0;
                const isRemoving = removingId === pid;
                const freshness = product.freshnessScore || product.rating || 0;

                return (
                  <div
                    key={pid}
                    className={`wishlist-card fade-up${isRemoving ? ' removing' : ''}`}
                    style={{ animationDelay: `${0.04 * idx}s`, overflow: 'hidden' }}
                  >
                    <div style={{ display: 'flex', gap: '0.85rem', padding: '0.85rem' }}>
                      {/* Image */}
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '16px', flexShrink: 0,
                        background: 'rgba(27,67,50,0.04)', overflow: 'hidden', position: 'relative',
                      }}>
                        {product.image ? (
                          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={32} color="rgba(27,67,50,0.1)" strokeWidth={1.5} />
                          </div>
                        )}
                        {/* Heart icon - filled, top right */}
                        <button onClick={() => handleRemove(pid)} style={{
                          position: 'absolute', top: '0.3rem', right: '0.3rem',
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(4px)',
                          border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                          <Heart size={12} color="#D4A017" fill="#D4A017" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Details */}
                      <div style={{
                        flex: 1, minWidth: 0, display: 'flex',
                        flexDirection: 'column', justifyContent: 'space-between',
                      }}>
                        {/* Top section */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <p style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem',
                              fontWeight: 600, color: '#1B4332', margin: 0,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              flex: 1,
                            }}>{product.title || 'Product'}</p>
                          </div>

                          {/* Organic badge */}
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                            fontFamily: '"Courier New", monospace', fontSize: '0.42rem',
                            letterSpacing: '0.04em', color: '#6A994E',
                            background: 'rgba(106,153,78,0.08)', padding: '0.12rem 0.4rem',
                            borderRadius: '6px', marginTop: '0.2rem',
                          }}>
                            <Leaf size={7} color="#6A994E" fill="#6A994E" strokeWidth={2} />
                            Organic
                          </span>

                          {/* Farmer name */}
                          {product.farmerId?.name && (
                            <p style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.58rem',
                              color: 'rgba(27,67,50,0.4)', margin: '0.25rem 0 0 0',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>By {product.farmerId.name}</p>
                          )}

                          {/* Rating */}
                          {freshness > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                              <StarRating rating={freshness} size={9} />
                              <span style={{
                                fontFamily: '"DM Sans", sans-serif', fontSize: '0.5rem',
                                color: 'rgba(27,67,50,0.35)',
                              }}>({freshness})</span>
                            </div>
                          )}
                        </div>

                        {/* Price + Stock */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.2rem' }}>
                          <div>
                            <span style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem',
                              fontWeight: 700, color: '#1B4332',
                            }}>₹{product.price}</span>
                            {product.quantity && (
                              <span style={{
                                fontFamily: '"DM Sans", sans-serif', fontSize: '0.55rem',
                                color: 'rgba(27,67,50,0.35)', marginLeft: '0.25rem',
                              }}>/ {product.quantity}</span>
                            )}
                          </div>
                          {isLowStock && (
                            <span style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.48rem',
                              fontWeight: 600, color: '#D4A017',
                              background: 'rgba(212,160,23,0.08)',
                              padding: '0.12rem 0.45rem', borderRadius: '6px',
                            }}>Only {stock} left</span>
                          )}
                          {isOutOfStock && (
                            <span style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.48rem',
                              fontWeight: 600, color: '#DC2626',
                              background: 'rgba(220,38,38,0.06)',
                              padding: '0.12rem 0.45rem', borderRadius: '6px',
                            }}>Out of stock</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      padding: '0 0.85rem 0.85rem',
                      display: 'flex', gap: '0.55rem',
                    }}>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="action-btn"
                        disabled={isOutOfStock}
                        style={{
                          background: isOutOfStock ? 'rgba(27,67,50,0.04)' : 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                          color: isOutOfStock ? 'rgba(27,67,50,0.2)' : '#FFFFFF',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <ShoppingCart size={14} strokeWidth={2} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="action-btn"
                        disabled={isOutOfStock}
                        style={{
                          background: isOutOfStock ? 'rgba(27,67,50,0.04)' : 'rgba(27,67,50,0.04)',
                          color: isOutOfStock ? 'rgba(27,67,50,0.2)' : '#1B4332',
                          border: isOutOfStock ? '1px solid rgba(27,67,50,0.04)' : '1px solid rgba(27,67,50,0.1)',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── RECOMMENDED PRODUCTS ─── */}
            {recommended.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '0.65rem',
                }}>
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
                    fontWeight: 700, color: '#1B4332', margin: 0,
                  }}>You Might Also Like</p>
                  <Link to="/products" style={{
                    fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
                    letterSpacing: '0.08em', color: '#6A994E',
                    textDecoration: 'none', textTransform: 'uppercase',
                  }}>View All</Link>
                </div>
                <div style={{
                  display: 'flex', gap: '0.65rem', overflowX: 'auto',
                  paddingBottom: '0.5rem',
                }} className="hide-scrollbar">
                  {recommended.map((p) => {
                    const pid = p.id || p._id;
                    return (
                      <div key={pid} className="rec-card">
                        <Link to={`/product/${pid}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            width: '100%', height: '100px',
                            background: 'rgba(27,67,50,0.04)', overflow: 'hidden',
                          }}>
                            {p.image ? (
                              <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Leaf size={24} color="rgba(27,67,50,0.08)" strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                        </Link>
                        <div style={{ padding: '0.55rem 0.6rem 0.6rem' }}>
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.62rem',
                            fontWeight: 600, color: '#1B4332', margin: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{p.title}</p>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginTop: '0.35rem',
                          }}>
                            <span style={{
                              fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                              fontWeight: 700, color: '#1B4332',
                            }}>₹{p.price}</span>
                            <button
                              onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                              style={{
                                width: '30px', height: '30px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                                border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(27,67,50,0.15)',
                              }}
                            >
                              <ShoppingBag size={13} color="#FFFFFF" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── BOTTOM NAV ─── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0.35rem 0 0.5rem',
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
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
              <Heart size={20} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
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
  );
}
