import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import {
  ShoppingBag, Heart, MapPin, Star, ChevronRight, Leaf,
  Users, ShieldCheck, Truck, Clock, TrendingUp, Eye,
  Menu, Package, Search, X, Timer, Award,
  CheckCircle, Sprout, Store, User, ArrowRight,
} from 'lucide-react';
import farmVideo from "../assets/farm-video.mp4";
import heroImg from "../assets/hero.png";
import storyGroveImg from "../assets/story-grove.jpg";

const EMOJI_MAP = {
  'Vegetables': '🥬', 'Fruits': '🍎', 'Milk': '🥛', 'Eggs': '🥚',
  'Rice & Grains': '🌾', 'Fresh Herbs': '🌿', 'Spices': '🧂',
  'Honey & Jams': '🍯', 'Dry Products': '🏝️', 'Snacks': '🥜',
  'Drinks': '🧃', 'Meat': '🥩', 'Fish': '🐟', 'Others': '🌱'
};

function getCategoryEmoji(name) {
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return '🌱';
}

const CATEGORY_LABELS = {
  'Vegetables': 'Vegetables',
  'Fruits': 'Fruits',
  'Rice & Grains': 'Rice & Grains',
  'Milk': 'Farm Dairy',
  'Fresh Herbs': 'Herbs',
  'Spices': 'Spices',
  'Honey & Jams': 'Honey & Jams',
  'Dry Products': 'Dry Products',
  'Snacks': 'Health Snacks',
  'Drinks': 'Farm Drinks',
};

export default function HomeDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlistState] = useState([]);

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.count, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, farmersData, statsData, catsData] = await Promise.all([
          api.products.getProducts(),
          api.auth.getFarmers(),
          api.public.getStats(),
          api.products.getCategories().catch(() => []),
        ]);
        if (productsData) setProducts(productsData);
        if (farmersData) setFarmers(farmersData);
        if (statsData) setStats(statsData);
        if (catsData) setCategories(catsData);
      } catch {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    api.wishlist.getWishlist()
      .then(data => setWishlistState(data.products || data || []))
      .catch(() => {});
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  }, [dispatch]);

  const isWishlisted = (productId) => {
    return wishlist.some(item => (item._id || item.id) === productId);
  };

  const handleToggleWishlist = useCallback(async (productId) => {
    try {
      const data = await api.wishlist.toggleWishlist(productId);
      setWishlistState(data.products || data || []);
    } catch {}
  }, []);

  const featuredProducts = products.slice(0, 6);
  const topFarmers = farmers.slice(0, 3);

  return (
    <div style={{
      background: '#F5F3E7',
      minHeight: '100vh',
      paddingBottom: '88px',
      position: 'relative',
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fade-in { animation: fadeIn 0.5s ease both; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .home-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(245,243,231,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .product-card {
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:active {
          transform: scale(0.97);
        }
        .stat-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .category-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 76px;
          padding: 0.75rem 0.5rem;
          border-radius: 20px;
          background: #FFFFFF;
          box-shadow: 0 2px 12px rgba(27,67,50,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          border: none;
          text-decoration: none;
          flex-shrink: 0;
        }
        .category-chip:active {
          transform: scale(0.93);
        }
        .trust-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 1.25rem;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(27,67,50,0.06);
          padding: 0.5rem 0;
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0;
          transition: transform 0.2s ease;
          text-decoration: none;
          min-width: 56px;
        }
        .nav-item:active {
          transform: scale(0.9);
        }
        .center-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1B4332, #2D6A4F);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -20px;
          box-shadow: 0 4px 20px rgba(27,67,50,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .center-btn:active {
          transform: scale(0.92);
        }
      `}</style>

      {/* ─── STICKY HEADER ─── */}
      <header className="home-header">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          maxWidth: '480px',
          margin: '0 auto',
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
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#1B4332',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>DHARA</span>
              <span style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.4rem',
                letterSpacing: '0.3em',
                color: '#6A994E',
                display: 'block',
                textTransform: 'uppercase',
              }}>Organic Kerala</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/wishlist" style={{
              width: '38px', height: '38px',
              borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none',
              position: 'relative',
            }}>
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" style={{
              width: '38px', height: '38px',
              borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none',
              position: 'relative',
            }}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalCartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#D4A017', color: '#FFFFFF',
                  fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"DM Sans", sans-serif',
                }}>{totalCartCount}</span>
              )}
            </Link>
            <Link to="/profile" style={{
              width: '38px', height: '38px',
              borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none',
            }}>
              <Menu size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

        {/* ═══ HERO SECTION ═══ */}
        <section style={{ marginTop: '0.75rem', animation: 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '380px',
            background: 'linear-gradient(135deg, #080E0A 0%, #1B4332 50%, #0F1E14 100%)',
          }}>
            {/* Background pattern */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A3C87A' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }} />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(8,14,10,0.1) 0%, rgba(27,67,50,0.3) 60%, rgba(8,14,10,0.6) 100%)',
            }} />
            {/* Decorative circles */}
            <div style={{
              position: 'absolute', right: '-3rem', top: '-3rem',
              width: '14rem', height: '14rem', borderRadius: '50%',
              border: '1px solid rgba(163,200,122,0.08)',
            }} />
            <div style={{
              position: 'absolute', left: '-2rem', bottom: '-2rem',
              width: '10rem', height: '10rem', borderRadius: '50%',
              border: '1px solid rgba(163,200,122,0.05)',
            }} />

            <div style={{
              position: 'relative', zIndex: 2,
              padding: '2.5rem 1.75rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: '380px',
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.55rem', letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#A3C87A',
                  background: 'rgba(163,200,122,0.1)',
                  border: '1px solid rgba(163,200,122,0.15)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                }}>
                  Kerala's Premium Marketplace
                </span>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <h1 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(3.2rem, 12vw, 4.5rem)',
                  fontWeight: 700,
                  color: '#F5F3E7',
                  lineHeight: 0.92,
                  letterSpacing: '-0.03em',
                  margin: '0 0 0.5rem 0',
                }}>
                  DHARA
                </h1>
                <p style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color: '#D4A017',
                  marginBottom: '1rem',
                }}>
                  FARM • TABLE • TRUST
                </p>
                <p style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: 'rgba(245,243,231,0.6)',
                  marginBottom: '1.75rem',
                  maxWidth: '320px',
                }}>
                  From Kerala's oldest organic families to your table — harvest to home in under 24 hours.
                </p>
                <Link to={user ? '/products' : '/login'} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  background: '#A3C87A',
                  color: '#0F1E14',
                  padding: '0.85rem 2rem',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(163,200,122,0.3)',
                }}>
                  {user ? 'Shop Now' : 'Sign In'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATISTICS SECTION ═══ */}
        <section style={{ marginTop: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
          }}>
            <div className="stat-card animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(212,160,23,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Star size={18} color="#D4A017" fill="#D4A017" />
              </div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.4rem', fontWeight: 700, color: '#1B4332', lineHeight: 1,
              }}>
                {stats?.avgRating || '4.9'}<span style={{ color: '#D4A017', fontSize: '1rem' }}>★</span>
              </span>
              <span style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.5rem', letterSpacing: '0.08em',
                color: 'rgba(27,67,50,0.5)', textTransform: 'uppercase',
              }}>Customer Rating</span>
            </div>
            <div className="stat-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(106,153,78,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sprout size={18} color="#6A994E" />
              </div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.4rem', fontWeight: 700, color: '#1B4332', lineHeight: 1,
              }}>
                {(stats?.totalCustomers || 0) + (stats?.totalFarmers || 0)}+
              </span>
              <span style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.5rem', letterSpacing: '0.08em',
                color: 'rgba(27,67,50,0.5)', textTransform: 'uppercase',
              }}>Organic Deliveries</span>
            </div>
            <div className="stat-card animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(39,174,96,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={18} color="#1B4332" />
              </div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.4rem', fontWeight: 700, color: '#1B4332', lineHeight: 1,
              }}>
                {stats?.totalFarmers || '5'}+
              </span>
              <span style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.5rem', letterSpacing: '0.08em',
                color: 'rgba(27,67,50,0.5)', textTransform: 'uppercase',
              }}>Verified Farmers</span>
            </div>
            <div className="stat-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(212,160,23,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Timer size={18} color="#D4A017" />
              </div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.4rem', fontWeight: 700, color: '#1B4332', lineHeight: 1,
              }}>
                24<span style={{ color: '#D4A017', fontSize: '0.85rem' }}> min</span>
              </span>
              <span style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.5rem', letterSpacing: '0.08em',
                color: 'rgba(27,67,50,0.5)', textTransform: 'uppercase',
              }}>Avg Delivery</span>
            </div>
          </div>
        </section>

        {/* ═══ STORY CARD ═══ */}
        <section style={{ marginTop: '1rem', animation: 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '0.3s' }}>
          <Link to="/about" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1B4332 0%, #0F1E14 100%)',
              borderRadius: '24px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-2rem', right: '-2rem',
                width: '10rem', height: '10rem', borderRadius: '50%',
                border: '1px solid rgba(163,200,122,0.06)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-1.5rem', left: '-1.5rem',
                width: '8rem', height: '8rem', borderRadius: '50%',
                border: '1px solid rgba(163,200,122,0.04)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '0.5rem', letterSpacing: '0.2em',
                    color: '#A3C87A', textTransform: 'uppercase',
                  }}>Our Beginning</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(163,200,122,0.1)' }} />
                </div>
                <h2 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#F5F3E7',
                  lineHeight: 1.15,
                  margin: '0 0 1rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}>
                  Born from Kerala's oldest farming families.
                </h2>
                <p style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: 'rgba(245,243,231,0.5)',
                  margin: '0 0 1.25rem 0',
                }}>
                  We started with seven farming families and a single WhatsApp group. Today we work with 980+ verified growers across 12 Kerala districts.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    color: '#A3C87A',
                    textTransform: 'uppercase',
                  }}>Read Our Story</span>
                  <ChevronRight size={14} color="#A3C87A" />
                </div>
              </div>
              {/* Right side decorative illustration */}
              <div style={{
                position: 'absolute', right: '0.5rem', top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.08,
                pointerEvents: 'none',
              }}>
                <Sprout size={80} color="#A3C87A" strokeWidth={0.8} />
              </div>
            </div>
          </Link>
        </section>

        {/* ═══ FEATURED CATEGORIES ═══ */}
        <section style={{ marginTop: '1.25rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <h3 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.1rem', fontWeight: 700, color: '#1B4332', margin: 0,
            }}>
              Categories
            </h3>
            <Link to="/products" style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '0.55rem', letterSpacing: '0.1em',
              color: '#6A994E', textDecoration: 'none',
              textTransform: 'uppercase',
            }}>
              View All
            </Link>
          </div>
          <div className="cat-scroll" style={{
            display: 'flex', gap: '0.65rem',
            overflowX: 'auto', paddingBottom: '0.5rem',
          }}>
            {categories.length > 0 ? categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="category-chip"
              >
                <span style={{ fontSize: '1.5rem' }}>{getCategoryEmoji(cat)}</span>
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.55rem', fontWeight: 600,
                  color: 'rgba(27,67,50,0.7)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {CATEGORY_LABELS[cat] || cat}
                </span>
              </Link>
            )) : (
              <>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🥬</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>All</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🥬</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Vegetables</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🍎</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Fruits</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🌾</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Rice & Grains</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🥛</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Farm Dairy</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🌿</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Herbs</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🧂</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Spices</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🍯</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Honey & Jams</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🏝️</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Dry Products</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🥜</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Health Snacks</span></div>
                <div className="category-chip"><span style={{ fontSize: '1.5rem' }}>🧃</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:'0.55rem',fontWeight:600,color:'rgba(27,67,50,0.7)'}}>Farm Drinks</span></div>
              </>
            )}
          </div>
        </section>

        {/* ═══ FEATURED PRODUCTS ═══ */}
        <section style={{ marginTop: '1.25rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <h3 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.1rem', fontWeight: 700, color: '#1B4332', margin: 0,
            }}>
              Featured Products
            </h3>
            <Link to="/products" style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '0.55rem', letterSpacing: '0.1em',
              color: '#6A994E', textDecoration: 'none',
              textTransform: 'uppercase',
            }}>
              View All
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
          }}>
            {featuredProducts.map((product, i) => {
              const pid = product.id || product._id;
              const wislisted = isWishlisted(pid);
              return (
                <div key={pid} className="product-card animate-scale-in" style={{ animationDelay: `${0.05 * i}s` }}>
                  <div style={{ position: 'relative' }}>
                    <Link to={`/product/${pid}`} style={{ display: 'block' }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '140px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Link>
                    {/* Organic badge */}
                    <span style={{
                      position: 'absolute', top: '0.5rem', left: '0.5rem',
                      background: 'rgba(27,67,50,0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      fontFamily: '"Courier New", monospace',
                      fontSize: '0.4rem', letterSpacing: '0.05em',
                      color: '#A3C87A',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                    }}>
                      <Leaf size={8} /> Organic
                    </span>
                    {/* Wishlist button */}
                    <button
                      onClick={() => handleToggleWishlist(pid)}
                      style={{
                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(8px)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <Heart
                        size={14}
                        color={wislisted ? '#D4A017' : 'rgba(27,67,50,0.4)'}
                        fill={wislisted ? '#D4A017' : 'none'}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <Link to={`/product/${pid}`} style={{ textDecoration: 'none' }}>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.8rem', fontWeight: 600,
                        color: '#1B4332', margin: '0 0 0.2rem 0',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{product.title}</p>
                    </Link>
                    <p style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '0.45rem', letterSpacing: '0.05em',
                      color: 'rgba(27,67,50,0.4)', margin: '0 0 0.4rem 0',
                      textTransform: 'uppercase',
                    }}>
                      {product.farmerId?.name || 'Kerala Farmer'}
                    </p>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.95rem', fontWeight: 700,
                        color: '#1B4332',
                      }}>
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{
                          width: '34px', height: '34px', borderRadius: '12px',
                          background: '#1B4332', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(27,67,50,0.2)',
                        }}
                      >
                        <ShoppingBag size={14} color="#FFFFFF" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ FARMER SPOTLIGHT ═══ */}
        {topFarmers.length > 0 && (
          <section style={{ marginTop: '1.25rem' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.75rem',
            }}>
              <h3 style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.1rem', fontWeight: 700, color: '#1B4332', margin: 0,
              }}>
                Meet Our Farmers
              </h3>
              <Link to="/farmers" style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.55rem', letterSpacing: '0.1em',
                color: '#6A994E', textDecoration: 'none',
                textTransform: 'uppercase',
              }}>
                View All
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto' }} className="cat-scroll">
              {topFarmers.map((farmer) => {
                const fId = farmer.id || farmer._id;
                const initials = (farmer.name || 'KF').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                const location = [farmer.village, farmer.district].filter(Boolean).join(', ') || 'Kerala, India';
                return (
                  <Link
                    key={fId}
                    to={`/farmers`}
                    style={{
                      textDecoration: 'none', flexShrink: 0,
                      width: '200px',
                    }}
                  >
                    <div style={{
                      background: '#FFFFFF',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 16px rgba(27,67,50,0.06)',
                    }}>
                      <div style={{
                        height: '100px',
                        background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <div style={{
                          width: '56px', height: '56px', borderRadius: '50%',
                          background: '#1B4332',
                          border: '3px solid rgba(163,200,122,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '1rem', fontWeight: 700, color: '#A3C87A',
                          }}>{initials}</span>
                        </div>
                        {/* Verified badge */}
                        <div style={{
                          position: 'absolute', top: '0.5rem', right: '0.5rem',
                          background: 'rgba(163,200,122,0.15)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '20px',
                          padding: '0.15rem 0.5rem',
                          display: 'flex', alignItems: 'center', gap: '0.2rem',
                        }}>
                          <CheckCircle size={10} color="#A3C87A" />
                          <span style={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.4rem', color: '#A3C87A',
                            textTransform: 'uppercase',
                          }}>Verified</span>
                        </div>
                      </div>
                      <div style={{ padding: '0.75rem' }}>
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontSize: '0.85rem', fontWeight: 600,
                          color: '#1B4332', margin: '0 0 0.15rem 0',
                        }}>{farmer.name}</p>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.25rem',
                          marginBottom: '0.4rem',
                        }}>
                          <MapPin size={10} color="#6A994E" />
                          <span style={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.45rem', color: 'rgba(27,67,50,0.4)',
                            letterSpacing: '0.03em',
                          }}>{location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={10} color="#D4A017" fill="#D4A017" />
                          <span style={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.5rem', fontWeight: 700, color: '#D4A017',
                          }}>{farmer.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ TRUST SECTION ═══ */}
        <section style={{ marginTop: '1.25rem', marginBottom: '1rem' }}>
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.1rem', fontWeight: 700, color: '#1B4332', margin: '0 0 0.75rem 0',
          }}>
            Why Choose Us
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.65rem',
          }}>
            <div className="trust-card animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(106,153,78,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={20} color="#6A994E" />
              </div>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.6rem', fontWeight: 600, color: '#1B4332',
              }}>100% Organic</span>
            </div>
            <div className="trust-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(27,67,50,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Truck size={20} color="#1B4332" />
              </div>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.6rem', fontWeight: 600, color: '#1B4332',
              }}>Fast Delivery</span>
            </div>
            <div className="trust-card animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '14px',
                background: 'rgba(212,160,23,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Store size={20} color="#D4A017" />
              </div>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.6rem', fontWeight: 600, color: '#1B4332',
              }}>Direct From Farmers</span>
            </div>
          </div>
        </section>

      </div>

      {/* ═══ BOTTOM NAVIGATION ═══ */}
      <nav className="bottom-nav">
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 0.5rem',
        }}>
          <Link to="/dashboard" className="nav-item" style={{ color: '#1B4332' }}>
            <Home size={20} strokeWidth={2} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Home</span>
          </Link>
          <Link to="/products" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <Search size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: 'rgba(27,67,50,0.4)',
            }}>Products</span>
          </Link>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '60px' }}>
            <Link to="/cart" className="center-btn" style={{ textDecoration: 'none' }}>
              <ShoppingBag size={22} color="#FFFFFF" strokeWidth={2} />
            </Link>
          </div>
          <Link to="/my-orders" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <Package size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: 'rgba(27,67,50,0.4)',
            }}>Orders</span>
          </Link>
          <Link to="/profile" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <User size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: 'rgba(27,67,50,0.4)',
            }}>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function Home({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
