import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import SearchBar from '../components/SearchBar';
import {
  ShoppingBag, Heart, MapPin, Star, ChevronRight, Leaf,
  Users, ShieldCheck, Truck, Package, Clock, TrendingUp, Eye
} from 'lucide-react';

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

function formatCategoryLabel(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

function Skeleton({ width, height, radius = '12px', style }) {
  return (
    <div style={{
      width: width || '100%', height: height || '16px',
      borderRadius: radius, background: 'linear-gradient(90deg, #e8ece6 25%, #f0f2ee 50%, #e8ece6 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
      ...style,
    }} />
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const ORDER_STATUS_FLOW = ['Pending', 'Processing', 'In Transit', 'Delivered'];

export default function HomeDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [whyChoose, setWhyChoose] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [wishlistSet, setWishlistSet] = useState(new Set());
  const [bannerIndex, setBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const categoryScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);

  const carts = useSelector((state) => state.cart.cartItems) || [];

  const handleAddToCart = useCallback(async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  }, [dispatch]);

  const handleWishlistToggle = useCallback(async (productId) => {
    try {
      const result = await api.wishlist.toggleWishlist(productId);
      setWishlistSet(prev => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
    } catch (err) {
      console.error('Wishlist toggle failed', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [productsData, categoriesData, bannersData, farmersData, ordersData, whyChooseData, seasonalData, wishlistData] = await Promise.all([
          api.products.getProducts(),
          api.products.getCategories(),
          api.public.getActiveBanners(),
          api.auth.getFarmers(),
          api.orders.getOrders(),
          api.siteContent.getByKey('whyChooseDhara').catch(() => null),
          api.siteContent.getByKey('seasonalCollections').catch(() => null),
          api.wishlist.getWishlist().catch(() => []),
        ]);
        if (cancelled) return;
        if (productsData) setProducts(productsData);
        if (categoriesData) setCategories(categoriesData);
        if (bannersData) setBanners(bannersData);
        if (farmersData) setFarmers(farmersData);
        if (ordersData) setOrders(ordersData);
        if (whyChooseData?.data) setWhyChoose(whyChooseData.data);
        if (seasonalData?.data) setSeasonal(seasonalData.data);
        if (wishlistData?.products) {
          setWishlistSet(new Set((wishlistData.products || []).map(p => p._id || p.id)));
        }
      } catch (err) {
        console.error('HomeDashboard fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const activeBanners = banners.length > 0 ? banners.map(b => ({
    badge: (b.type || 'general').replace(/_/g, ' ').toUpperCase(),
    heading: b.title,
    subtitle: b.subtitle || '',
    image: b.image,
    link: b.link,
  })) : [];

  useEffect(() => {
    const len = activeBanners.length;
    if (len === 0) return;
    const id = setInterval(() => setBannerIndex((prev) => (prev + 1) % len), 5000);
    return () => clearInterval(id);
  }, [activeBanners.length]);

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  const farmerProductCount = {};
  products.forEach(p => {
    const fid = p.farmerId?._id || p.farmerId?.id;
    if (fid) farmerProductCount[fid] = (farmerProductCount[fid] || 0) + 1;
  });

  const spotlightFarmer = farmers
    .map(f => ({ ...f, productCount: farmerProductCount[f.id || f._id] || 0 }))
    .filter(f => f.productCount > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.productCount - a.productCount)
    [0] || null;

  const trendingProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0) || new Date(b.createdAt || b.harvestDate) - new Date(a.createdAt || a.harvestDate))
    .slice(0, 10);

  const recentOrders = orders.slice(0, 3);

  const deliveryLocation = user?.address || [user?.village, user?.district].filter(Boolean).join(', ') || 'Kerala';

  if (loading) {
    return (
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F4F6F3', minHeight: '100vh' }}>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <Skeleton height="80px" radius="16px" />
        <Skeleton height="48px" radius="12px" />
        <Skeleton height="180px" radius="16px" />
        <Skeleton height="80px" radius="16px" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Skeleton height="220px" radius="16px" />
          <Skeleton height="220px" radius="16px" />
          <Skeleton height="220px" radius="16px" />
          <Skeleton height="220px" radius="16px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F4F6F3', minHeight: '100vh', paddingBottom: '1rem' }}>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{0%{opacity:0;transform:scale(0.92)}100%{opacity:1;transform:scale(1)}}
        .hm-fade-up{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both}
        .hm-scale-in{animation:scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both}
        .hm-hide-scroll::-webkit-scrollbar{display:none}
        .hm-hide-scroll{scrollbar-width:none;-ms-overflow-style:none}
        .hm-banner-dot{transition:all 0.3s ease}
        .hm-product-card{transition:transform 0.25s ease,box-shadow 0.25s ease}
        .hm-product-card:active{transform:scale(0.97)}
        .hm-cat-circle{transition:transform 0.2s ease,box-shadow 0.2s ease}
        .hm-cat-circle:active{transform:scale(0.92)}
        .hm-carousel-item{transition:transform 0.3s ease,opacity 0.3s ease}
        .hm-trend-card{transition:transform 0.25s ease}
        .hm-trend-card:active{transform:scale(0.96)}
        .shop-now-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(163,200,122,0.5)!important}
        .shop-now-btn:active{transform:translateY(0)}
        @media(min-width:768px){
          .hm-mobile-only{display:none!important}
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 1rem 0' }}>

        {/* ── WELCOME SECTION ── */}
        <div className="hm-fade-up" style={{ animationDelay: '0s', background: 'linear-gradient(135deg, #1B4332 0%, #0F1E14 100%)', borderRadius: '20px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '8rem', height: '8rem', borderRadius: '50%', border: '1px solid rgba(163,200,122,0.1)' }} />
          <div style={{ position: 'absolute', bottom: '-1.5rem', left: '-1.5rem', width: '6rem', height: '6rem', borderRadius: '50%', border: '1px solid rgba(163,200,122,0.06)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(163,200,122,0.7)', margin: '0 0 0.35rem 0' }}>
              {getGreeting()}
            </p>
            <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.5rem', fontWeight: 400, color: '#F5F3E7', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
              {user?.name || 'Guest'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={12} color="#A3C87A" />
                <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.05em', color: 'rgba(163,200,122,0.6)', textTransform: 'uppercase' }}>
                  {deliveryLocation}
                </span>
              </div>
              <span style={{ color: 'rgba(163,200,122,0.2)' }}>|</span>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.08em', color: '#D4A017', textTransform: 'uppercase' }}>
                {user?.role === 'farmer' ? 'Farmer' : 'Member'}
              </span>
            </div>
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div className="hm-fade-up" style={{ animationDelay: '0.05s', background: '#FFFFFF', borderRadius: '16px', padding: '0.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <SearchBar />
        </div>

        {/* ── PROMOTIONAL BANNER ── */}
        {activeBanners.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.1s', position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(27,67,50,0.1)' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1B4332, #013220, #14532d)',
              borderRadius: '20px', padding: '1.25rem 1.5rem', minHeight: '170px',
              position: 'relative', overflow: 'hidden', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', color: 'white',
              transition: 'all 0.5s ease',
            }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 25% 25%, #A3C87A 1px, transparent 1px), radial-gradient(circle at 75% 75%, #A3C87A 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
              <div style={{ zIndex: 2, flex: 1 }}>
                <div style={{ display: 'inline-block', background: '#A3C87A', color: '#013220', fontSize: '0.55rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.08em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  {activeBanners[bannerIndex].badge}
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 4px 0', lineHeight: 1.2 }}>
                  {activeBanners[bannerIndex].heading}
                </h2>
                {activeBanners[bannerIndex].subtitle && (
                  <p style={{ opacity: 0.75, fontSize: '0.78rem', margin: '0 0 12px 0' }}>
                    {activeBanners[bannerIndex].subtitle}
                  </p>
                )}
                <button onClick={() => navigate('/products')} className="shop-now-btn" style={{ background: '#A3C87A', border: 'none', color: '#013220', padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.3s ease', boxShadow: '0 4px 14px rgba(163,200,122,0.3)' }}>
                  Shop Now
                </button>
              </div>
              {activeBanners[bannerIndex].image && (
                <div style={{ zIndex: 2, width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', marginLeft: '1rem', flexShrink: 0 }}>
                  <img src={activeBanners[bannerIndex].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
              {activeBanners.map((_, i) => (
                <button key={i} onClick={() => setBannerIndex(i)} className="hm-banner-dot" style={{ width: i === bannerIndex ? '20px' : '6px', height: '6px', borderRadius: '3px', border: 'none', background: i === bannerIndex ? '#A3C87A' : 'rgba(1,50,32,0.2)', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.15s', background: '#FFFFFF', borderRadius: '16px', padding: '1rem 0.75rem 0.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
              <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', fontWeight: 400, color: '#1B4332', margin: 0 }}>Categories</h3>
              <Link to="/products" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A994E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                View All <ChevronRight size={10} />
              </Link>
            </div>
            <div ref={categoryScrollRef} className="hm-hide-scroll" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {categories.map((cat) => (
                <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', minWidth: '60px', flexShrink: 0 }}>
                  <div className="hm-cat-circle" style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(27,67,50,0.04)', border: '1px solid rgba(27,67,50,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {getCategoryEmoji(cat)}
                  </div>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.5rem', fontWeight: 700, color: 'rgba(27,67,50,0.6)', textAlign: 'center', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatCategoryLabel(cat)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── FEATURED PRODUCTS ── */}
        {displayFeatured.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
              <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', fontWeight: 400, color: '#1B4332', margin: 0 }}>
                {featuredProducts.length > 0 ? 'Featured Products' : 'Fresh Arrivals'}
              </h3>
              <Link to="/products" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A994E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                View All <ChevronRight size={10} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {displayFeatured.slice(0, 6).map((p) => {
                const pid = p._id || p.id;
                const inWishlist = wishlistSet.has(pid);
                const inStock = p.stock > 0;
                return (
                  <div key={pid} className="hm-product-card" style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', position: 'relative' }}>
                    <button onClick={(e) => { e.preventDefault(); handleWishlistToggle(pid); }} style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 3, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                      <Heart size={15} fill={inWishlist ? '#D4A017' : 'none'} color={inWishlist ? '#D4A017' : 'rgba(27,67,50,0.3)'} />
                    </button>
                    <Link to={`/product/${pid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#F4F6F3' }}>
                        {p.image ? (
                          <img src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={32} color="rgba(27,67,50,0.15)" />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '0.75rem' }}>
                        <h4 style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#1B4332', margin: '0 0 0.2rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </h4>
                        <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', color: 'rgba(27,67,50,0.45)', margin: '0 0 0.35rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.farmerId?.name || p.farmerName || 'Local Farmer'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                          <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1rem', fontWeight: 700, color: '#1B4332' }}>
                            ₹{p.price}
                          </span>
                          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', color: 'rgba(27,67,50,0.35)' }}>
                            / {p.quantity || 'kg'}
                          </span>
                        </div>
                        {!inStock && (
                          <span style={{ display: 'inline-block', fontFamily: '"Courier New", monospace', fontSize: '0.45rem', letterSpacing: '0.05em', color: '#C0392B', background: 'rgba(192,57,43,0.08)', padding: '0.15rem 0.4rem', marginTop: '0.3rem', textTransform: 'uppercase' }}>
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </Link>
                    {inStock && (
                      <div style={{ padding: '0 0.75rem 0.75rem' }}>
                        <button onClick={() => handleAddToCart(p)} style={{ width: '100%', background: '#1B4332', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0.65rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem', fontFamily: '"Courier New", monospace', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                          <ShoppingBag size={13} /> Add
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FARMER SPOTLIGHT ── */}
        {spotlightFarmer && (
          <div className="hm-fade-up" style={{ animationDelay: '0.25s', background: 'linear-gradient(135deg, #0F1E14 0%, #1B4332 100%)', borderRadius: '20px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-1.5rem', right: '-1.5rem', width: '10rem', height: '10rem', borderRadius: '50%', border: '1px solid rgba(163,200,122,0.08)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(163,200,122,0.6)', margin: 0, textTransform: 'uppercase' }}>
                  Farmer Spotlight
                </p>
                <Link to="/farmers" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A3C87A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  Meet All <ChevronRight size={10} />
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(163,200,122,0.15)', border: '2px solid rgba(163,200,122,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#A3C87A' }}>
                    {(spotlightFarmer.name || 'F').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1rem', fontWeight: 400, color: '#F5F3E7', margin: '0 0 0.15rem 0' }}>
                    {spotlightFarmer.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <Star size={11} fill="#D4A017" color="#D4A017" />
                    <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', color: '#D4A017' }}>{spotlightFarmer.rating || '—'}</span>
                    {spotlightFarmer.productCount > 0 && (
                      <>
                        <span style={{ color: 'rgba(163,200,122,0.2)' }}>·</span>
                        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', color: 'rgba(163,200,122,0.5)' }}>
                          {spotlightFarmer.productCount} products
                        </span>
                      </>
                    )}
                    {spotlightFarmer.village && (
                      <>
                        <span style={{ color: 'rgba(163,200,122,0.2)' }}>·</span>
                        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', color: 'rgba(163,200,122,0.5)' }}>
                          {spotlightFarmer.village}, {spotlightFarmer.district}
                        </span>
                      </>
                    )}
                  </div>
                  {spotlightFarmer.description && (
                    <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.72rem', fontWeight: 300, lineHeight: 1.5, color: 'rgba(245,243,231,0.55)', margin: '0.5rem 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {spotlightFarmer.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRENDING PRODUCTS ── */}
        {trendingProducts.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={14} color="#6A994E" />
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', fontWeight: 400, color: '#1B4332', margin: 0 }}>Trending</h3>
              </div>
              <Link to="/products" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A994E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                View All <ChevronRight size={10} />
              </Link>
            </div>
            <div ref={trendingScrollRef} className="hm-hide-scroll" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {trendingProducts.map((p) => {
                const pid = p._id || p.id;
                const inWishlist = wishlistSet.has(pid);
                return (
                  <div key={pid} className="hm-trend-card" style={{ minWidth: '150px', maxWidth: '160px', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                    <Link to={`/product/${pid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ width: '100%', height: '120px', overflow: 'hidden', background: '#F4F6F3', position: 'relative' }}>
                        {p.image ? (
                          <img src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={24} color="rgba(27,67,50,0.15)" />
                          </div>
                        )}
                        <button onClick={(e) => { e.preventDefault(); handleWishlistToggle(pid); }} style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 2, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Heart size={12} fill={inWishlist ? '#D4A017' : 'none'} color={inWishlist ? '#D4A017' : 'rgba(27,67,50,0.3)'} />
                        </button>
                      </div>
                      <div style={{ padding: '0.65rem' }}>
                        <h4 style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#1B4332', margin: '0 0 0.15rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </h4>
                        <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', color: 'rgba(27,67,50,0.4)', margin: '0 0 0.3rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.farmerId?.name || p.farmerName || ''}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                          <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.9rem', fontWeight: 700, color: '#1B4332' }}>
                            ₹{p.price}
                          </span>
                          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.4rem', color: 'rgba(27,67,50,0.35)' }}>
                            / {p.quantity || 'kg'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SEASONAL COLLECTIONS ── */}
        {seasonal.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.35s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
              <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', fontWeight: 400, color: '#1B4332', margin: 0 }}>Seasonal Collections</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {seasonal.map((item, i) => (
                <Link key={i} to={item.link || '/products'} style={{ textDecoration: 'none', display: 'flex', borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  {item.image && (
                    <div style={{ width: '100px', flexShrink: 0 }}>
                      <img src={item.image} alt={item.title || ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                    <h4 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.9rem', fontWeight: 400, color: '#1B4332', margin: '0 0 0.2rem 0' }}>
                      {item.title || ''}
                    </h4>
                    {item.subtitle && (
                      <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.05em', color: 'rgba(27,67,50,0.45)', margin: 0, textTransform: 'uppercase' }}>
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem' }}>
                    <ChevronRight size={16} color="rgba(27,67,50,0.2)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── WHY CHOOSE DHARA ── */}
        {whyChoose.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.4s', background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', fontWeight: 400, color: '#1B4332', margin: '0 0 1rem 0' }}>
              Why Choose Dhara
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {whyChoose.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.5rem', borderRadius: '12px', background: 'rgba(27,67,50,0.02)', border: '1px solid rgba(27,67,50,0.05)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: item.bgColor || 'rgba(27,67,50,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon === 'leaf' ? <Leaf size={18} color={item.color || '#1B4332'} /> : null}
                    {item.icon === 'users' ? <Users size={18} color={item.color || '#1B4332'} /> : null}
                    {item.icon === 'shield' ? <ShieldCheck size={18} color={item.color || '#1B4332'} /> : null}
                    {item.icon === 'truck' ? <Truck size={18} color={item.color || '#1B4332'} /> : null}
                    {item.icon === 'star' ? <Star size={18} color={item.color || '#1B4332'} /> : null}
                    {item.icon === 'clock' ? <Clock size={18} color={item.color || '#1B4332'} /> : null}
                    {!item.icon && <Leaf size={18} color={item.color || '#1B4332'} />}
                  </div>
                  <h4 style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#1B4332', margin: 0, textAlign: 'center' }}>
                    {item.title || ''}
                  </h4>
                  <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.6rem', fontWeight: 300, color: 'rgba(27,67,50,0.5)', margin: 0, textAlign: 'center', lineHeight: 1.4 }}>
                    {item.description || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RECENT ORDERS ── */}
        {recentOrders.length > 0 && (
          <div className="hm-fade-up" style={{ animationDelay: '0.45s', background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Package size={14} color="#6A994E" />
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', fontWeight: 400, color: '#1B4332', margin: 0 }}>Recent Orders</h3>
              </div>
              <Link to="/my-orders" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A994E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                View All <ChevronRight size={10} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map((order) => {
                const oid = order._id || order.id;
                const currentStatusIdx = ORDER_STATUS_FLOW.indexOf(order.orderStatus);
                const progress = currentStatusIdx >= 0 ? (currentStatusIdx / (ORDER_STATUS_FLOW.length - 1)) * 100 : 0;
                const productNames = (order.products || []).map(p => p.title).filter(Boolean).join(', ');
                return (
                  <Link key={oid} to={`/track/${oid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(27,67,50,0.02)', border: '1px solid rgba(27,67,50,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1, marginRight: '0.5rem' }}>
                          <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.05em', color: 'rgba(27,67,50,0.35)', margin: '0 0 0.2rem 0', textTransform: 'uppercase' }}>
                            Order #{((oid || '') + '').slice(-8)}
                          </p>
                          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#1B4332', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {productNames || `Order #${((oid || '') + '').slice(-8)}`}
                          </p>
                        </div>
                        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.05em', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0,
                          background: order.orderStatus === 'Delivered' ? 'rgba(106,153,78,0.1)' : order.orderStatus === 'Cancelled' ? 'rgba(192,57,43,0.08)' : 'rgba(212,160,23,0.1)',
                          color: order.orderStatus === 'Delivered' ? '#2D6A4F' : order.orderStatus === 'Cancelled' ? '#C0392B' : '#B8860B',
                        }}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </div>
                      {order.orderStatus !== 'Cancelled' && currentStatusIdx >= 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ height: '3px', background: 'rgba(27,67,50,0.08)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: currentStatusIdx >= ORDER_STATUS_FLOW.length - 1 ? '#6A994E' : '#D4A017', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                            {ORDER_STATUS_FLOW.map((s, i) => (
                              <span key={s} style={{ fontFamily: '"Courier New", monospace', fontSize: '0.4rem', color: i <= currentStatusIdx ? '#1B4332' : 'rgba(27,67,50,0.2)', textTransform: 'uppercase' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', color: 'rgba(27,67,50,0.35)' }}>
                          ₹{order.totalPrice || 0}
                        </span>
                        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', color: 'rgba(27,67,50,0.35)' }}>
                          {order.deliveryTime || ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
