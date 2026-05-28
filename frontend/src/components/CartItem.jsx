import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.productId || {};
  
  return (
    <div className="bg-emerald-950/20 border border-emerald-900/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-500/20 transition-all">
      <div className="flex items-center space-x-3.5 w-full sm:w-auto">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400'} 
          alt={product.title} 
          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl bg-emerald-900/30 shrink-0" 
        />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{product.title || 'Fresh Produce'}</h4>
          <p className="text-xs text-emerald-400 font-semibold">{product.quantity || '1 unit'}</p>
          <span className="text-[10px] text-emerald-300/60 block mt-1 font-mono">Slot: {product.availableTime || '06:00 AM - 10:00 AM'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
        {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-emerald-950/60 p-1 rounded-lg border border-emerald-800/40 shrink-0">
          <button 
            onClick={() => onUpdateQuantity(product._id || product.id, item.count - 1)}
            className="p-1 text-emerald-300 hover:text-white rounded-md hover:bg-emerald-900 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold font-mono text-white px-2.5">{item.count}</span>
          <button 
            onClick={() => onUpdateQuantity(product._id || product.id, item.count + 1)}
            className="p-1 text-emerald-300 hover:text-white rounded-md hover:bg-emerald-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pricing & Remove */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-sm font-extrabold text-white block">₹{(product.price || 50) * item.count}</span>
            <span className="text-[10px] text-emerald-300/60 block font-mono">₹{product.price || 50} each</span>
          </div>

          <button 
            onClick={() => onRemove(product._id || product.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
