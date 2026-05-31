import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Star, MessageSquare, AlertTriangle, Send, ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { t, onLanguageChange } from "../data/i18n";

export default function FarmerReviews() {
  const { user } = useSelector((state) => state.auth);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [replyingId, setReplyingId] = useState(null);
  const [, forceUpdate] = useState(0);
  useEffect(() => onLanguageChange(() => forceUpdate(n => n + 1)), []);

  const loadFeedbacks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.feedback.getFarmerFeedbacks(user.id || user._id);
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFeedbacks(); }, [user]);

  const handleReply = async (feedbackId) => {
    const text = replyText[feedbackId]?.trim();
    if (!text) return;
    try {
      await api.feedback.replyToFeedback(feedbackId, text);
      setReplyText(p => ({ ...p, [feedbackId]: "" }));
      setReplyingId(null);
      loadFeedbacks();
    } catch (err) {
      alert(err.message || "Failed to reply");
    }
  };

  if (loading) return <LoadingSpinner />;

  const negativeCount = feedbacks.filter(f => f.negative).length;
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : user?.rating || 5.0;
  const blocked = user?.blocked || false;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">{t('farmerReviews.title')}</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{t('farmerReviews.subtitle')}</p>
      </div>

      {/* Reputation Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-yellow-400">{avgRating}</p>
          <div className="flex justify-center gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={14} fill={i <= Math.round(Number(avgRating)) ? "#eab308" : "none"}
                color={i <= Math.round(Number(avgRating)) ? "#eab308" : "rgba(255,255,255,0.1)"} />
            ))}
          </div>
          <p className="text-[10px] text-emerald-400/50 font-medium">{t('farmerReviews.averageRating')}</p>
        </div>
        <div className={`bg-[#111811] border rounded-2xl p-5 text-center ${negativeCount >= 3 ? "border-red-800/30" : "border-emerald-900/20"}`}>
          <p className={`text-3xl font-bold ${negativeCount >= 3 ? "text-red-400" : "text-emerald-400"}`}>{negativeCount}</p>
          <div className="flex justify-center items-center gap-1.5 my-2">
            <ThumbsDown size={14} className={negativeCount > 0 ? "text-red-400" : "text-emerald-400/30"} />
          </div>
          <p className="text-[10px] text-emerald-400/50 font-medium">{t('farmerReviews.negativeReviews')}</p>
          {blocked && (
            <div className="mt-2 px-2 py-1 bg-red-900/30 rounded-lg text-[9px] font-bold text-red-400 flex items-center justify-center gap-1">
              <AlertTriangle size={10} /> {t('farmerReviews.accountBlocked')}
            </div>
          )}
        </div>
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{feedbacks.length}</p>
          <div className="flex justify-center items-center gap-1.5 my-2">
            <MessageSquare size={14} className="text-emerald-400" />
          </div>
          <p className="text-[10px] text-emerald-400/50 font-medium">{t('farmerReviews.totalReviews')}</p>
        </div>
      </div>

      {/* Warning */}
      {negativeCount > 0 && negativeCount < 3 && (
        <div className="px-4 py-3 rounded-xl bg-yellow-900/10 border border-yellow-800/30 flex items-center gap-3">
          <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-400/80">
            {t('farmerReviews.negativeWarning').replace('{count}', negativeCount).replace('{s}', negativeCount > 1 ? "s" : "").replace('{remaining}', 3 - negativeCount)}
          </p>
        </div>
      )}

      {/* Reviews List */}
      {feedbacks.length === 0 ? (
        <div className="text-center py-16 bg-[#111811] border border-emerald-900/20 rounded-2xl">
          <Star size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">{t('farmerReviews.noReviewsYet')}</p>
          <p className="text-xs text-emerald-400/40 mt-1">{t('farmerReviews.reviewsAppearHere')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => {
            const isReplying = replyingId === (fb._id || fb.id);
            const customerName = fb.customerId?.name || "Customer";
            const productName = fb.productId?.title || "";
            return (
              <motion.div key={fb._id || fb.id} layout
                className={`bg-[#111811] border rounded-2xl p-5 ${fb.negative ? "border-red-900/20" : "border-emerald-900/20"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                      fb.negative ? "bg-red-900/30 text-red-400" : "bg-emerald-900/30 text-emerald-400"
                    }`}>
                      {customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-emerald-100">{customerName}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={11} fill={i <= fb.rating ? "#eab308" : "none"}
                              color={i <= fb.rating ? "#eab308" : "rgba(255,255,255,0.1)"} />
                          ))}
                        </div>
                        {fb.negative && (
                          <span className="text-[9px] font-bold text-red-400 flex items-center gap-0.5">
                            <ThumbsDown size={10} /> {t('farmerReviews.negative')}
                          </span>
                        )}
                      </div>
                      {productName && (
                        <p className="text-[10px] text-emerald-400/50">{t('farmerReviews.on')} {productName}</p>
                      )}
                      <p className="text-xs text-emerald-200/80 mt-2">{fb.review}</p>

                      {/* Farmer Reply */}
                      {fb.reply && (
                        <div className="mt-3 pl-3 border-l-2 border-emerald-600/50">
                          <p className="text-[10px] text-emerald-400/50 font-semibold flex items-center gap-1">
                            <Reply size={10} /> {t('farmerReviews.yourReply')}
                          </p>
                          <p className="text-xs text-emerald-300/80 mt-1">{fb.reply}</p>
                        </div>
                      )}

                      {/* Reply Form */}
                      {isReplying ? (
                        <div className="mt-3 flex gap-2">
                          <input value={replyText[fb._id || fb.id] || ""}
                            onChange={e => setReplyText(p => ({ ...p, [fb._id || fb.id]: e.target.value }))}
                            placeholder={t('farmerReviews.writeReply')}
                            className="flex-1 px-3 py-2 bg-emerald-900/20 border border-emerald-700/30 rounded-xl text-xs text-emerald-100 outline-none placeholder-emerald-600/40"
                          />
                          <button onClick={() => handleReply(fb._id || fb.id)}
                            className="px-3 py-2 bg-emerald-600 rounded-xl text-white"
                          ><Send size={14} /></button>
                          <button onClick={() => { setReplyingId(null); setReplyText(p => ({ ...p, [fb._id || fb.id]: "" })); }}
                            className="px-3 py-2 bg-emerald-900/30 rounded-xl text-emerald-400 text-xs"
                          >{t('farmerReviews.cancel')}</button>
                        </div>
                      ) : !fb.reply && (
                        <button onClick={() => setReplyingId(fb._id || fb.id)}
                          className="mt-2 text-[10px] text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1"
                        >
                          <Reply size={11} /> {t('farmerReviews.reply')}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-400/30 flex-shrink-0">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
