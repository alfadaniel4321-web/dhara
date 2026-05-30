import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setWishlist, setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, ShoppingCart, ChevronLeft, AlertTriangle } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.cart);

  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const items = await api.wishlist.getWishlist();
      setProductsList(items);
      dispatch(setWishlist(items.map(item => item.id || item._id)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      const updatedList = await api.wishlist.toggleWishlist(id);
      const items = Array.isArray(updatedList) ? updatedList : [];
      dispatch(setWishlist(items.map(item => item.id || item._id)));
      setProductsList(items);
    } catch (e) {
      alert(e.message || 'Failed to remove from wishlist');
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      // Add to cart
      const updatedCart = await api.cart.addToCart(product.id || product._id, 1);
      dispatch(setCartSuccess(updatedCart));

      // Remove from wishlist
      await handleRemove(product.id || product._id);
      alert(`🛒 ${product.title} moved to cart!`);
    } catch (e) {
      alert(e.message || 'Failed to move to cart');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
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
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsList.map(product => {
            const stock = product.stock !== undefined ? product.stock : 10;
            const isLowStock = stock > 0 && stock <= 5;
            
            return (
              <div 
                key={product.id || product._id}
                className="bg-emerald-950/20 rounded-3xl border border-emerald-900 p-4 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-2xl transition-all"
              >
                <div className="space-y-3.5">
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-emerald-900/20">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    
                    <button 
                      onClick={() => handleRemove(product.id || product._id)}
                      className="absolute top-2 right-2 p-2 rounded-full glassmorphism text-red-400 hover:text-red-300 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white truncate">{product.title}</h4>
                    <p className="text-xs font-semibold text-emerald-400">₹{product.price} / {product.quantity}</p>

                    {isLowStock && (
                      <div className="bg-yellow-950/40 p-2 rounded-lg border border-yellow-800/40 flex items-center text-[10px] text-yellow-400 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span>Hurry, only {stock} left in stock!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center gap-2">
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                    disabled={stock <= 0}
                  >
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
