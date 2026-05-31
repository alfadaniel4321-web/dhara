import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, Star, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Feedback() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await api.feedback.getFarmerFeedbacks(user.id || user._id);
      setFeedbacks(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const negativeFeedbacks = feedbacks.filter(f => f.negative);
  const rating = user?.rating;
  const strikes = user?.negativeFeedbacksCount ?? 0;

  return (
    <div className="space-y-6">
      <Link 
        to="/farmer" 
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Farmer Hub</span>
      </Link>

      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">Trust & Customer Reviews</h2>
        <p className="text-sm text-emerald-300/70">Monitor farmer reputation rating logs and negative feedback strikes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aggregates widget */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-xl font-bold text-yellow-500 mx-auto">
            {rating}★
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Reputation Index</h4>
            {rating >= 4.5 ? (
              <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-emerald-450 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified Farmer
              </span>
            ) : (
              <span className="inline-block text-[9px] uppercase font-bold text-emerald-300/60 mt-1">Standard Seller</span>
            )}
          </div>
        </div>

        {/* Strikes Widget */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl font-bold text-red-500 mx-auto font-mono">
            {strikes} / 3
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Negative Strikes</h4>
            <p className="text-[10px] text-emerald-300/60 mt-1">Auto-blocks account on 3 strikes</p>
          </div>
        </div>

        {/* Warning alerts */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 flex items-start space-x-3.5 text-xs text-emerald-305/80">
          <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="font-bold text-white">Strikes Policy Alert</h4>
            <p className="leading-relaxed font-light text-emerald-300/60">
              Customers leaving reviews rating ≤ 2 stars count as negative strikes. Upon reaching 3 strikes, the merchant account is automatically blocked from trades.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews log list */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-450">Review logs</h3>
        
        {feedbacks.length === 0 ? (
          <div className="glassmorphism p-8 rounded-3xl text-center">
            <p className="text-xs text-emerald-305/75 italic">No reviews submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map(fb => (
              <div 
                key={fb.id || fb._id}
                className={`p-4 rounded-2xl border ${
                  fb.negative 
                    ? 'bg-red-950/10 border-red-900/60' 
                    : 'bg-emerald-950/20 border-emerald-900'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{fb.customerId?.name}</span>
                  <span className="text-yellow-500 font-bold flex items-center">
                    {fb.rating}★
                    {fb.negative && (
                      <span className="ml-1.5 bg-red-500/20 text-red-400 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                        Negative Strike
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 leading-relaxed font-light mt-2">"{fb.review}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
