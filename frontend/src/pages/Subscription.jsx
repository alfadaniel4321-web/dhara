import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import SubscriptionCard from '../components/SubscriptionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, ChevronLeft, Info, Check } from 'lucide-react';

export default function Subscription() {
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const list = await api.subscriptions.getSubscriptions();
      setSubs(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
      const nextType = currentStatus === 'active' ? 'Paused' : 'Daily';
      await api.subscriptions.updateSubscriptionStatus(id, {
        status: nextStatus,
        subscriptionType: nextType
      });
      loadSubscriptions();
    } catch (e) {
      alert(e.message || 'Failed to update subscription status');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Deliveries calendar simulator based on active weekly configs
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="border-b border-emerald-900/60 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Daily Subscriptions</h2>
          <p className="text-sm text-emerald-300/70">Manage recurring morning/evening deliveries of organic dairy and groceries.</p>
        </div>
        <Calendar className="w-8 h-8 text-emerald-400 hidden sm:block" />
      </div>

      {subs.length === 0 ? (
        <div className="glassmorphism p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-emerald-700 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Subscriptions</h3>
          <p className="text-xs text-emerald-305/65">
            You don't have any products scheduled for delivery. Choose milk, eggs, or fresh vegetables on the marketplace to create a subscription.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subs.map(sub => (
              <SubscriptionCard 
                key={sub.id || sub._id}
                subscription={sub}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {/* Delivery Calendar Visualization */}
          <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-450">Weekly Delivery Dispatch Calendar</h3>
            <p className="text-xs text-emerald-300/60">Highlights scheduled deliveries for the current billing cycle.</p>
            
            <div className="grid grid-cols-7 gap-2 text-center pt-2">
              {daysOfWeek.map((day, idx) => {
                // Check if any active subscription covers this day
                // Daily: all days. Mon-Wed-Fri: Mon, Wed, Fri. Weekly: Mon.
                const hasDelivery = subs.some(sub => {
                  if (sub.status !== 'active') return false;
                  const type = sub.subscriptionType;
                  if (type === 'Daily') return true;
                  if (type === 'Mon-Wed-Fri' && (day === 'Mon' || day === 'Wed' || day === 'Fri')) return true;
                  if (type === 'Weekly' && day === 'Mon') return true;
                  return false;
                });

                return (
                  <div key={day} className={`p-3.5 rounded-xl border flex flex-col items-center justify-between ${
                    hasDelivery 
                      ? 'bg-emerald-500/20 border-emerald-400/80 text-white' 
                      : 'bg-emerald-950/30 border-emerald-900 text-emerald-800'
                  }`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">{day}</span>
                    <div className="mt-2.5">
                      {hasDelivery ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-farmgreen-950">
                          <Check className="w-3 h-3 font-bold" />
                        </div>
                      ) : (
                        <span className="text-[10px] block font-mono text-emerald-800">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Helper alert */}
          <div className="bg-emerald-900/10 border border-emerald-800/80 p-5 rounded-3xl space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center">
              <Info className="w-4 h-4 mr-2 text-emerald-400" />
              Important Subscription Policies:
            </h4>
            <ul className="text-xs text-emerald-300/80 space-y-1.5 list-disc pl-5 font-light">
              <li>Pauses requested before 10:00 PM will take effect starting next day morning deliveries.</li>
              <li>Subscriptions require COD payment upon handover at the door for each cycle.</li>
              <li>Freshness score is verified prior to dispatch by the hyperlocal coordinator.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
