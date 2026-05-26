import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function SubscriptionCard({ subscription, onToggleStatus }) {
  const item = subscription.products[0] || {};
  const isActive = subscription.status === 'active';
  
  return (
    <div className={`p-5 rounded-2xl border transition-all ${isActive ? 'bg-emerald-950/20 border-emerald-900' : 'bg-black/20 border-emerald-950 opacity-60'}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isActive ? 'Active Schedule' : 'Paused Schedule'}
          </span>
          <h5 className="text-base font-bold text-white mt-1.5">{item.title || 'Fresh Harvest Item'}</h5>
          <p className="text-xs text-emerald-300/80 mt-1">Recurency: {item.quantity || '1 unit'}</p>
        </div>
        <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold px-2.5 py-1 rounded-lg">
          {subscription.subscriptionType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-xs bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60">
        <div>
          <span className="block text-[9px] text-emerald-500 uppercase tracking-wider font-bold flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Time Slot
          </span>
          <span className="font-semibold text-white mt-0.5 block">{subscription.deliveryTime} Slot</span>
        </div>
        <div>
          <span className="block text-[9px] text-emerald-500 uppercase tracking-wider font-bold flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Timing Range
          </span>
          <span className="font-semibold text-emerald-300 mt-0.5 block">
            {subscription.deliveryTime === 'Morning' ? '06:00 AM - 08:00 AM' : '05:00 PM - 07:00 PM'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => onToggleStatus(subscription.id || subscription._id, subscription.status)}
          className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            isActive 
              ? 'bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-800 text-yellow-400' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950'
          }`}
        >
          {isActive ? 'Pause Delivery Routine' : 'Resume Delivery Routine'}
        </button>
      </div>
    </div>
  );
}
