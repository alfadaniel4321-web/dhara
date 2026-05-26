import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted, 
  onSubscribe 
}) {
  const navigate = useNavigate();

  const title = product.title || 'Organic Produce';
  const price = product.price || 50;
  const stock = product.stock !== undefined ? product.stock : 10;
  const quantity = product.quantity || '1 unit';
  const fName = product.farmerId?.name || 'Verified Kerala Farmer';
  const fRating = product.farmerId?.rating || 5.0;
  const isVerified = fRating >= 4.5;
  const discount = product.price ? Math.round(product.price * 0.15) : 10; // Simulated 15% discount tag

  const handleCardClick = (e) => {
    // Navigate to details page (avoiding double triggers on buttons)
    if (e.target.tagName !== 'BUTTON' && e.target.closest('button') === null) {
      navigate(`/product/${product.id || product._id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-emerald-950/30 rounded-3xl border border-emerald-900/80 hover:border-emerald-500/40 p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/5 group cursor-pointer"
    >
      <div className="space-y-3">
        {/* Gallery Image & Wishlist Button */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-emerald-900/20">
          <img 
            src={product.image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          
          <div className="absolute top-2 left-2 flex flex-col space-y-1.5 items-start">
            <span className="bg-emerald-500 text-farmgreen-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Freshness Verified
            </span>
            {discount > 0 && (
              <span className="bg-yellow-500 text-farmgreen-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                SAVE ₹{discount}
              </span>
            )}
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id || product._id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full glassmorphism text-white hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-emerald-100'}`} />
          </button>

          <div className="absolute bottom-2 right-2">
            <CountdownTimer availableTime={product.availableTime} />
          </div>
        </div>

        {/* Title, price, quantity */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate max-w-[70%]">{title}</h4>
            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-emerald-400">₹{price}</span>
              <span className="text-[10px] text-emerald-300/60 block leading-none">{quantity}</span>
            </div>
          </div>

          {/* AI Freshness Rating */}
          <div className="bg-farmgreen-950/50 p-2 rounded-xl border border-emerald-900/60 mt-1">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-emerald-400 font-semibold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                AI Freshness Rating
              </span>
              <span className="font-mono font-bold text-emerald-300">{product.freshnessScore || 95}%</span>
            </div>
            <div className="w-full bg-emerald-950 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 rounded-full" 
                style={{ width: `${product.freshnessScore || 95}%` }}
              />
            </div>
          </div>

          {/* Stock and slot details */}
          <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1">
            <span>Slot: {product.availableTime || '07:00 AM - 12:00 PM'}</span>
            <span className={`font-semibold ${stock > 5 ? 'text-emerald-400' : stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {stock > 0 ? `${stock} left in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Nutrition Summary */}
          <div className="bg-emerald-950/20 px-2.5 py-1 rounded-lg text-[10px] text-emerald-300/80 flex justify-between items-center mt-1.5">
            <span>Protein: <strong className="text-emerald-200">{product.protein || '1.2g'}</strong></span>
            <span className="truncate max-w-[60%] text-emerald-300/60">{product.nutrition || 'Fiber, Vitamins'}</span>
          </div>

          {/* Farmer Details */}
          <div className="flex items-center space-x-1.5 bg-emerald-950/10 p-1.5 rounded-lg border border-emerald-900/40 mt-2">
            <div className="w-6 h-6 rounded-full bg-emerald-900/60 flex items-center justify-center text-[10px] font-bold text-emerald-300">
              {fName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-grow">
              <div className="text-[10px] font-bold text-white flex items-center truncate">
                <span>{fName}</span>
                {isVerified && <CheckCircle2 className="w-2.5 h-2.5 ml-1 text-emerald-400" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Actions */}
      <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center gap-2">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onSubscribe(product); }}
          className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold py-2 rounded-xl text-xs transition-all active:scale-95 disabled:bg-emerald-950 disabled:text-emerald-700"
          disabled={stock <= 0}
        >
          Subscribe
        </button>
        
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 p-2 rounded-xl transition-all disabled:opacity-40"
          disabled={stock <= 0}
          title="Add to Cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
