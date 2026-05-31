import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  Package, 
  Truck, 
  Home,
  MessageSquare
} from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState(null);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const ord = await api.orders.trackOrder(id);
      setOrder(ord);

      const fItem = ord.products[0];
      if (fItem && fItem.farmerId) {
        try {
          const farmers = await api.auth.getFarmers();
          const foundFarmer = farmers.find(u => u.id === fItem.farmerId || u._id === fItem.farmerId);
          setFarmer(foundFarmer || null);
        } catch {
          setFarmer(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-xs text-emerald-300">Order tracking details not found.</p>
        <Link to="/dashboard" className="text-xs text-emerald-500 underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  // Map orderStatus string to timeline stage index
  const stages = [
    { title: 'Order Placed', desc: 'Received by farmer', icon: Package },
    { title: 'Preparing', desc: 'Harvesting & sorting', icon: Clock },
    { title: 'Out for Delivery', desc: 'In transit to door', icon: Truck },
    { title: 'Delivered', desc: 'Completed handover', icon: Home },
  ];

  let currentStageIdx = 0;
  if (order.orderStatus === 'Processing') currentStageIdx = 1;
  else if (order.orderStatus === 'In Transit') currentStageIdx = 2;
  else if (order.orderStatus === 'Delivered') currentStageIdx = 3;

  return (
    <div className="space-y-6">
      {/* Header back */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">Track Delivery Route</h2>
        <p className="text-sm text-emerald-300/70">Real-time timeline monitor for order #{order.id || order._id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Timeline tracker */}
        <div className="lg:col-span-2 bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-8">
          
          <div className="flex justify-between items-center bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/60 text-xs">
            <span className="text-emerald-350">Status: <strong className="text-white uppercase">{order.orderStatus}</strong></span>
            <span className="text-emerald-350">Expected Slot: <strong className="text-emerald-400">{order.deliveryTime} Slot</strong></span>
          </div>

          {/* Graphical timeline */}
          <div className="relative pl-8 space-y-10 border-l border-emerald-900/80">
            {stages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isPast = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={idx} className="relative">
                  {/* Circle indicator */}
                  <div className={`absolute -left-12.5 top-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isPast 
                      ? 'bg-emerald-500 border-emerald-400 text-farmgreen-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-farmgreen-950 border-emerald-900 text-emerald-800'
                  }`}>
                    <StageIcon className="w-4.5 h-4.5" />
                  </div>

                  <div className="space-y-0.5 pl-4">
                    <h4 className={`text-sm font-bold flex items-center ${isPast ? 'text-white' : 'text-emerald-305/40'}`}>
                      <span>{stage.title}</span>
                      {isCurrent && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </h4>
                    <p className={`text-xs ${isPast ? 'text-emerald-300/80' : 'text-emerald-305/20'}`}>{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Farmer and items overview sidebar */}
        <div className="space-y-6">
          {/* Farmer Contact card */}
          {farmer && (
            <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Assigned Farmer</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
                  {farmer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{farmer.name}</h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400/80 font-medium">
                    <span>{farmer.rating}★ Rating</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-900/60 text-emerald-200">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono font-semibold select-all">{farmer.phone}</span>
              </div>
            </div>
          )}

          {/* Ordered Products summary */}
          <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Ordered Produce</h3>
            <div className="space-y-3">
              {order.products.map((p, index) => (
                <div key={index} className="flex justify-between items-center text-xs text-emerald-300">
                  <span>{p.title} <strong className="text-[10px] text-white">x{p.count ?? 1}</strong></span>
                  <span className="font-mono text-emerald-250">₹{(p.price ?? 0) * (p.count ?? 1)}</span>
                </div>
              ))}
              <div className="border-t border-emerald-900/60 pt-3 flex justify-between font-extrabold text-sm text-white">
                <span>Total Amount paid:</span>
                <span className="font-mono text-emerald-400">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
