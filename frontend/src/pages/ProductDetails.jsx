import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import FarmerCard from '../components/FarmerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, CheckCircle2, ChevronLeft, ShieldCheck, Clock, Award } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Description');
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // Find product in list
      const products = await api.products.getProducts();
      const p = products.find(prod => prod.id === id || prod._id === id);
      setProduct(p);

      // Load related items
      if (p) {
        const list = products.filter(item => item.category === p.category && (item.id !== p.id && item._id !== p._id));
        setRelated(list.slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const updatedCart = await api.cart.addToCart(product.id || product._id, quantity);
      dispatch(setCartSuccess(updatedCart));
      alert(`🛒 Added ${quantity} unit(s) of ${product.title} to cart!`);
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      // Add to cart first, then navigate to cart page for immediate checkout
      await api.cart.addToCart(product.id || product._id, quantity);
      const updatedCart = await api.cart.getCart();
      dispatch(setCartSuccess(updatedCart));
      navigate('/cart');
    } catch (err) {
      alert(err.message || 'Buy Now failed');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm text-emerald-300">Product not found.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-emerald-500 text-farmgreen-950 font-bold px-4 py-2 rounded-xl text-xs">Back to Dashboard</button>
      </div>
    );
  }

  const fName = product.farmerId?.name;
  const fRating = product.farmerId?.rating;
  const isVerified = fRating >= 4.5;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      {/* Main product view grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-emerald-900 bg-emerald-950/20">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex flex-col space-y-2 items-start">
              <span className="bg-emerald-500 text-farmgreen-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Harvested Today
              </span>
            </div>
            <div className="absolute bottom-4 right-4">
              <CountdownTimer availableTime={product.availableTime} />
            </div>
          </div>
          
          {/* Thumbnails placeholder */}
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-video bg-emerald-950/20 border border-emerald-900/60 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-500 transition-all">
              <img src={product.image} alt="Thumb 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video bg-emerald-950/20 border border-emerald-900/60 rounded-xl flex items-center justify-center text-xs text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer">
              Fresh Crop View
            </div>
            <div className="aspect-video bg-emerald-950/20 border border-emerald-900/60 rounded-xl flex items-center justify-center text-xs text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer">
              Soil & Farm View
            </div>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">{product.category}</span>
            <h1 className="text-3xl font-extrabold text-white leading-tight">{product.title}</h1>
            
            <div className="flex items-center space-x-3 pt-2">
              <span className="text-2xl font-black text-emerald-400">₹{product.price}</span>
              <span className="text-xs text-emerald-350 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-lg font-bold">
                {product.quantity} unit
              </span>
            </div>
          </div>

          {/* AI Freshness Panel */}
          {product.freshnessScore != null && (
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                AI Freshness score: {product.freshnessScore}%
              </span>
              <span className="text-emerald-300 font-mono">Harvest-to-Door Proximity</span>
            </div>
            <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 rounded-full"
                style={{ width: `${product.freshnessScore}%` }}
              />
            </div>
          </div>
          )}

          {/* Quantity Selector and CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-b border-emerald-900/60 py-6">
            <div className="flex items-center space-x-3 bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-800/60 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/40 transition-colors text-lg"
              >
                -
              </button>
              <span className="text-sm font-extrabold font-mono text-white px-4">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock ?? 99, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/40 transition-colors text-lg"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 font-extrabold py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center space-x-2"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs"
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery and stock status */}
          <div className="flex items-center justify-between text-xs text-emerald-300/80">
            {product.availableTime && (
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-emerald-400" />
              Delivery timing: {product.availableTime}
            </span>
            )}
            {product.stock != null && (
            <span className="font-semibold text-emerald-400">
              {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
            </span>
            )}
          </div>

        </div>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-4 pt-6 border-t border-emerald-900/60">
        <div className="flex items-center space-x-6 border-b border-emerald-900/60 pb-2">
          {['Description', 'Nutrition', 'Reviews', 'Delivery info'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold pb-2 transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-emerald-500 text-emerald-400' 
                  : 'border-transparent text-emerald-300/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-sm leading-relaxed text-emerald-250 min-h-24">
          {activeTab === 'Description' && (
            <p className="font-light">
              This organic {product.title} is harvested fresh daily from {fName}'s local farm in Kerala. Cultivated with sustainable methods and natural water channels. Zero preservative chemicals added. Perfect for a premium healthy lifestyle.
            </p>
          )}

          {activeTab === 'Nutrition' && (
            <div className="max-w-md bg-emerald-950/20 p-4 rounded-2xl border border-emerald-900/85 grid grid-cols-2 gap-4">
              {product.nutrition && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-emerald-500 font-bold">Nutrition Details</span>
                <span className="block text-sm text-white font-medium mt-1">{product.nutrition}</span>
              </div>
              )}
              {product.protein && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-emerald-500 font-bold">Protein Amount</span>
                <span className="block text-sm text-white font-mono font-semibold mt-1">{product.protein}</span>
              </div>
              )}
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="max-w-md">
              <span className="block text-xs text-emerald-400 font-bold mb-4">Farmer Trust & Review Log</span>
              <FarmerCard 
                farmer={product.farmerId} 
                currentUserId={user ? (user.id || user._id) : null}
                onReviewSubmitted={loadProduct}
              />
            </div>
          )}

          {activeTab === 'Delivery info' && (
            <p className="font-light">
              We operate a direct harvest-to-door delivery route in Kerala. Orders placed during the product slot will be processed and shipped immediately in cold-preserved packaging. Proximity-based delivery ensures transit time under 2 hours.
            </p>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-emerald-900/60">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Related Farm Produce</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(p => (
              <div 
                key={p.id || p._id} 
                onClick={() => navigate(`/product/${p.id || p._id}`)}
                className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/20 transition-all flex flex-col justify-between"
              >
                <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-xl bg-emerald-900/20" />
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">₹{p.price} / {p.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
