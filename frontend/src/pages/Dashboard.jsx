import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProductsStart, 
  fetchProductsSuccess, 
  fetchNearbySuccess, 
  fetchProductsFailure 
} from '../redux/slices/productSlice';
import { setCartSuccess, setWishlist } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, MapPin, TrendingUp, Calendar, Tag, ShieldCheck, X } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { products, nearbyProducts, loading } = useSelector((state) => state.products);
  const { wishlistItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  
  // Subscription Modal state
  const [subProd, setSubProd] = useState(null);
  const [subTime, setSubTime] = useState('Morning');
  const [subType, setSubType] = useState('Daily');
  const [subSuccess, setSubSuccess] = useState('');

  const loadData = async () => {
    dispatch(fetchProductsStart());
    try {
      const prodList = await api.products.getProducts();
      dispatch(fetchProductsSuccess(prodList));

      const nearbyList = await api.products.getNearbyProducts();
      dispatch(fetchNearbySuccess(nearbyList));

      // Load cart & wishlist
      const cartData = await api.cart.getCart();
      dispatch(setCartSuccess(cartData));

      const wishlistData = await api.wishlist.getWishlist();
      dispatch(setWishlist(wishlistData.map(item => item.id || item._id)));
    } catch (err) {
      dispatch(fetchProductsFailure(err.message || 'Failed to fetch dashboard data'));
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));
      alert(`🛒 ${product.title} added to cart!`);
    } catch (e) {
      alert(e.message || 'Failed to add item to cart');
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const updatedWishlist = await api.wishlist.toggleWishlist(productId);
      dispatch(setWishlist(updatedWishlist.map(item => item.id || item._id)));
    } catch (e) {
      alert(e.message || 'Failed to update wishlist');
    }
  };

  const handleConfirmSubscription = async () => {
    if (!subProd) return;
    try {
      const farmerId = subProd.farmerId?._id || subProd.farmerId?.id || subProd.farmerId;
      await api.subscriptions.createSubscription({
        products: [{
          productId: subProd.id || subProd._id,
          title: subProd.title,
          quantity: subProd.quantity,
          price: subProd.price || 50,
          count: 1,
          farmerId
        }],
        deliveryTime: subTime,
        subscriptionType: subType
      });
      setSubSuccess(`✨ Subscribed to ${subProd.title}!`);
      setTimeout(() => {
        setSubProd(null);
        setSubSuccess('');
      }, 1500);
    } catch (e) {
      alert(e.message || 'Failed to subscribe');
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const trendingProducts = [...products]
    .sort((a, b) => (b.freshnessScore || 0) - (a.freshnessScore || 0))
    .slice(0, 3);

  const subscriptionProducts = products.filter(p => 
    p.category === 'Milk' || p.category === 'Eggs'
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-emerald-700" />
          <input 
            type="text"
            placeholder="Search fresh harvest milk, duck eggs, local tapioca..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-emerald-950/40 border border-emerald-800/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all placeholder:text-emerald-750"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {['All', 'Milk', 'Eggs', 'Vegetables'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                selectedCat === cat 
                  ? 'bg-emerald-500 text-farmgreen-950 border-emerald-400 shadow-md shadow-emerald-500/10' 
                  : 'bg-emerald-950/20 border-emerald-900 text-emerald-300 hover:text-white'
              }`}
            >
              {cat === 'All' && 'All Produce'}
              {cat === 'Milk' && '🥛 Milk & Dairy'}
              {cat === 'Eggs' && '🥚 Duck/Hen Eggs'}
              {cat === 'Vegetables' && '🥗 Vegetables'}
            </button>
          ))}
        </div>
      </div>

      {/* DELIVERY BANNER / OFFERS */}
      <div className="bg-gradient-to-r from-emerald-900/60 to-emerald-950/40 border border-emerald-850 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-yellow-400" />
            Hyperlocal Delivery Zone Discount
          </h4>
          <p className="text-xs text-emerald-300/80 max-w-xl">
            Get 15% immediate discount simulated on checkout. Sourced within a 15km radius of your registered address.
          </p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-350 border border-emerald-500/30 text-xs px-4 py-2 rounded-xl font-bold uppercase tracking-wider block text-center shrink-0">
          Code: HARVEST15
        </span>
      </div>

      {/* TODAY'S HARVEST */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Today's Fresh Harvest</span>
        </h3>
        {filteredProducts.length === 0 ? (
          <div className="glassmorphism p-12 rounded-3xl text-center">
            <p className="text-sm text-emerald-300/60">No matching harvests found today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id || product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.includes(product.id || product._id)}
                onSubscribe={(prod) => {
                  setSubProd(prod);
                  setSubSuccess('');
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* NEARBY PRODUCTS */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>Hyperlocal Proximity Feed</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyProducts.map(p => (
            <div key={`nb-${p.id || p._id}`} className="bg-emerald-950/20 rounded-2xl border border-emerald-900/60 p-3.5 flex items-center space-x-3.5 hover:border-emerald-500/20 transition-all">
              <img src={p.image} alt={p.title} className="w-14 h-14 object-cover rounded-xl shrink-0 bg-emerald-900/20" />
              <div className="min-w-0 flex-grow">
                <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                <div className="flex items-center text-[10px] text-emerald-400/80 mt-1 space-x-1.5">
                  <span className="font-semibold">{p.distance} km away</span>
                  <span>•</span>
                  <span className="truncate">{p.location || 'Kochi Hub'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING PRODUCE & DAILY ROUTINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trending */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>AI Verified Top Freshness</span>
          </h3>
          <div className="space-y-3">
            {trendingProducts.map(p => (
              <div key={`tr-${p.id || p._id}`} className="bg-emerald-950/20 border border-emerald-900 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-emerald-900/20" />
                  <span className="text-xs font-semibold text-white">{p.title}</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">{p.freshnessScore}% Fresh</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription products */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Daily Routine Subscriptions</span>
          </h3>
          <div className="space-y-3">
            {subscriptionProducts.map(p => (
              <div key={`sb-${p.id || p._id}`} className="bg-emerald-950/20 border border-emerald-900 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{p.title}</span>
                <button 
                  onClick={() => {
                    setSubProd(p);
                    setSubSuccess('');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-350 hover:underline font-bold"
                >
                  Schedule Delivery
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION CONFIGURE MODAL */}
      {subProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glassmorphism p-6 rounded-3xl border border-emerald-800 shadow-2xl relative">
            <button 
              onClick={() => setSubProd(null)}
              className="absolute top-4 right-4 text-emerald-500 hover:text-white p-1 rounded-full hover:bg-emerald-900/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Configure Subscription</span>
            </h3>

            {subSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm my-6">
                {subSuccess}
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-3 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-900">
                  <img src={subProd.image} alt={subProd.title} className="w-14 h-14 object-cover rounded-xl bg-emerald-900/30" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{subProd.title}</h4>
                    <p className="text-xs text-emerald-400 font-semibold">{subProd.quantity}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-emerald-400 font-bold">Delivery Slot</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setSubTime('Morning')}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${subTime === 'Morning' ? 'bg-emerald-500 text-farmgreen-950 border-emerald-400 shadow-md' : 'bg-transparent border-emerald-900 text-emerald-300 hover:text-white'}`}
                    >
                      Morning (06:00 AM - 08:00 AM)
                    </button>
                    <button 
                      onClick={() => setSubTime('Evening')}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${subTime === 'Evening' ? 'bg-emerald-500 text-farmgreen-950 border-emerald-400 shadow-md' : 'bg-transparent border-emerald-900 text-emerald-300 hover:text-white'}`}
                    >
                      Evening (05:00 PM - 07:00 PM)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-emerald-400 font-bold">Subscription Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Daily', 'Weekly', 'Mon-Wed-Fri'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setSubType(type)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${subType === type ? 'bg-emerald-500 text-farmgreen-950 border-emerald-400 shadow-md' : 'bg-transparent border-emerald-900 text-emerald-300 hover:text-white'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleConfirmSubscription}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-xs mt-2"
                >
                  Confirm Subscription
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
