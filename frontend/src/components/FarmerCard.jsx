import React, { useState, useEffect } from 'react';
import { Star, Smartphone, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function FarmerCard({ farmer, currentUserId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [reviewsList, setReviewsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const farmerId = farmer._id || farmer.id;
  const fName = farmer.name || 'Verified Kerala Farmer';
  const fRating = farmer.rating || 5.0;
  const isVerified = fRating >= 4.5;

  const fetchReviews = async () => {
    try {
      const list = await api.feedback.getFarmerFeedbacks(farmerId);
      setReviewsList(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [farmerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setSubmitting(true);
    setSuccess('');
    try {
      await api.feedback.createFeedback({
        farmerId,
        rating: Number(rating),
        review: review.trim()
      });
      setSuccess('⭐ Review added successfully!');
      setReview('');
      fetchReviews();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-emerald-950/20 rounded-3xl border border-emerald-900 p-6 space-y-4 hover:border-emerald-500/20 transition-all">
      <div className="flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-lg font-bold text-emerald-400">
          {fName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="text-base font-bold text-white flex items-center">
            <span>{fName}</span>
            {isVerified && (
              <span className="ml-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Verified
              </span>
            )}
          </h4>
          <p className="text-xs text-emerald-400/80">Average Rating: {fRating}★</p>
        </div>
      </div>

      <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-900/60 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-emerald-200">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{farmer.phone || '+91 94471 23456'}</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-200">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{farmer.address || 'Kerala, India'}</span>
        </div>
      </div>

      {/* Review Submission */}
      {currentUserId && currentUserId !== farmerId && (
        <form onSubmit={handleSubmit} className="border-t border-emerald-900/60 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">Add Rating:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-yellow-500 focus:outline-none"
                >
                  <Star className={`w-4 h-4 ${rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-emerald-900'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Describe product freshness and delivery speed..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="2"
            className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-[9px] text-red-400 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Rating ≤ 2 counts as negative feedback.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
          {success && <p className="text-[10px] text-emerald-300 font-semibold mt-1">{success}</p>}
        </form>
      )}

      {/* Customer reviews log */}
      <div className="border-t border-emerald-900/60 pt-4 space-y-2">
        <span className="block text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">Reviews Log</span>
        {reviewsList.length === 0 ? (
          <p className="text-xs text-emerald-500/80 italic">No reviews yet for this farmer.</p>
        ) : (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {reviewsList.map(fb => (
              <div key={fb.id || fb._id} className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900 text-xs">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold text-white">{fb.customerId?.name || 'Customer'}</span>
                  <span className="text-yellow-500 font-bold flex items-center">
                    {fb.rating}★
                    {fb.negative && (
                      <span className="ml-1 bg-red-500/20 text-red-400 text-[8px] font-bold px-1 py-0.2 rounded uppercase">
                        Negative
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-emerald-300/80 leading-relaxed font-light">{fb.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
