import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket, Image, Plus, Trash2, ToggleLeft, ToggleRight,
  Percent, Calendar, Search, AlertTriangle, CheckCircle
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const BANNER_TYPES = [
  { value: "general", label: "General" },
  { value: "fest", label: "Festival" },
  { value: "mega_sale", label: "Mega Sale" },
  { value: "seasonal", label: "Seasonal" },
  { value: "offer", label: "Offer" },
];

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount (₹)" },
];

export default function AdminPromotions() {
  const [tab, setTab] = useState("coupons");
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  // Coupon form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "", description: "", discountType: "percentage",
    discountValue: "", minOrderValue: "", maxDiscount: "",
    usageLimit: "", validFrom: "", validUntil: "",
  });

  // Banner form
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "", subtitle: "", image: "", link: "",
    type: "general", priority: "0", validFrom: "", validUntil: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [c, b] = await Promise.all([
        api.admin.getCoupons().catch(() => []),
        api.admin.getBanners().catch(() => []),
      ]);
      setCoupons(Array.isArray(c) ? c : []);
      setBanners(Array.isArray(b) ? b : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ─── Coupon handlers ──────────────────────────────────
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon(couponForm);
      setSuccess("Coupon created");
      setShowCouponForm(false);
      setCouponForm({ code: "", description: "", discountType: "percentage", discountValue: "", minOrderValue: "", maxDiscount: "", usageLimit: "", validFrom: "", validUntil: "" });
      load();
    } catch (err) { alert(err.message); }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await api.admin.toggleCoupon(id);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await api.admin.deleteCoupon(id);
      setSuccess("Coupon deleted");
      load();
    } catch (err) { alert(err.message); }
  };

  // ─── Banner handlers ──────────────────────────────────
  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createBanner(bannerForm);
      setSuccess("Banner created");
      setShowBannerForm(false);
      setBannerForm({ title: "", subtitle: "", image: "", link: "", type: "general", priority: "0", validFrom: "", validUntil: "" });
      load();
    } catch (err) { alert(err.message); }
  };

  const handleToggleBanner = async (id) => {
    try {
      await api.admin.toggleBanner(id);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await api.admin.deleteBanner(id);
      setSuccess("Banner deleted");
      load();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-emerald-100">Promotions</h1>
          <p className="text-xs text-emerald-400/50 mt-1">Manage coupons and promotional banners</p>
        </div>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-900/20 border border-green-700/30 text-green-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button onClick={() => setTab("coupons")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "coupons" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-900/10 text-emerald-400/60 hover:bg-emerald-900/20"}`}
        ><Ticket size={16} className="inline mr-1.5" />Coupons</button>
        <button onClick={() => setTab("banners")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "banners" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-900/10 text-emerald-400/60 hover:bg-emerald-900/20"}`}
        ><Image size={16} className="inline mr-1.5" />Banners</button>
      </div>

      {/* ──────── COUPONS TAB ──────── */}
      {tab === "coupons" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowCouponForm(!showCouponForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all"
            ><Plus size={16} /> New Coupon</button>
          </div>

          {showCouponForm && (
            <form onSubmit={handleCreateCoupon} className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Code *</label>
                <input value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="FEST50" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Description</label>
                <input value={couponForm.description} onChange={e => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="Festival offer" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Discount Type *</label>
                <select value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50">
                  {DISCOUNT_TYPES.map(d => <option key={d.value} value={d.value} className="bg-[#042f1a]">{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Discount Value *</label>
                <input type="number" value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="50" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Min Order (₹)</label>
                <input type="number" value={couponForm.minOrderValue} onChange={e => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="0" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Max Discount (₹)</label>
                <input type="number" value={couponForm.maxDiscount} onChange={e => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="0 = unlimited" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Usage Limit</label>
                <input type="number" value={couponForm.usageLimit} onChange={e => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="0 = unlimited" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Valid From *</label>
                <input type="date" value={couponForm.validFrom} onChange={e => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Valid Until *</label>
                <input type="date" value={couponForm.validUntil} onChange={e => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50" required />
              </div>
              <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all">Create Coupon</button>
                <button type="button" onClick={() => setShowCouponForm(false)} className="px-6 py-2.5 bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 text-sm font-bold rounded-xl transition-all">Cancel</button>
              </div>
            </form>
          )}

          {coupons.length === 0 ? (
            <div className="text-center py-16 bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl">
              <Ticket size={40} className="mx-auto text-emerald-700/40 mb-3" />
              <p className="text-sm text-emerald-400/60 font-medium">No coupons yet</p>
              <p className="text-xs text-emerald-400/30 mt-1">Create your first coupon to start promotions</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {coupons.map((c) => (
                <div key={c._id} className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900/30 flex items-center justify-center">
                      <Percent size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-100 font-mono">{c.code}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>{c.active ? "Active" : "Inactive"}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400/50 mt-0.5">
                        {c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                        {c.minOrderValue > 0 && ` · Min ₹${c.minOrderValue}`}
                        {c.usageLimit > 0 && ` · ${c.usedCount || 0}/${c.usageLimit} used`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400/30">Valid: {c.validFrom?.slice(0, 10)} → {c.validUntil?.slice(0, 10)}</span>
                    <button onClick={() => handleToggleCoupon(c._id)}
                      className="p-2 rounded-lg hover:bg-emerald-800/20 text-emerald-400/70">{c.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}</button>
                    <button onClick={() => handleDeleteCoupon(c._id)}
                      className="p-2 rounded-lg hover:bg-red-900/20 text-red-400/70"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────── BANNERS TAB ──────── */}
      {tab === "banners" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowBannerForm(!showBannerForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all"
            ><Plus size={16} /> New Banner</button>
          </div>

          {showBannerForm && (
            <form onSubmit={handleCreateBanner} className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Title *</label>
                <input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="Mega Festival Sale" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Subtitle</label>
                <input value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="Up to 50% off on fresh farm produce" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Image URL</label>
                <input value={bannerForm.image} onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="https://example.com/banner.jpg" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Link URL</label>
                <input value={bannerForm.link} onChange={e => setBannerForm({ ...bannerForm, link: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="/products?category=Fruits" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Banner Type</label>
                <select value={bannerForm.type} onChange={e => setBannerForm({ ...bannerForm, type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50">
                  {BANNER_TYPES.map(t => <option key={t.value} value={t.value} className="bg-[#042f1a]">{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Priority</label>
                <input type="number" value={bannerForm.priority} onChange={e => setBannerForm({ ...bannerForm, priority: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
                  placeholder="0" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Valid From</label>
                <input type="date" value={bannerForm.validFrom} onChange={e => setBannerForm({ ...bannerForm, validFrom: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400/70 mb-1">Valid Until</label>
                <input type="date" value={bannerForm.validUntil} onChange={e => setBannerForm({ ...bannerForm, validUntil: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all">Create Banner</button>
                <button type="button" onClick={() => setShowBannerForm(false)} className="px-6 py-2.5 bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 text-sm font-bold rounded-xl transition-all">Cancel</button>
              </div>
            </form>
          )}

          {banners.length === 0 ? (
            <div className="text-center py-16 bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl">
              <Image size={40} className="mx-auto text-emerald-700/40 mb-3" />
              <p className="text-sm text-emerald-400/60 font-medium">No banners yet</p>
              <p className="text-xs text-emerald-400/30 mt-1">Create promotional banners for festivals and sales</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {banners.map((b) => (
                <div key={b._id} className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {b.image ? <img src={b.image} className="w-full h-full object-cover" /> : <Image size={18} className="text-emerald-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-100">{b.title}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-900/20 text-emerald-400 rounded">{b.type}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${b.active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>{b.active ? "Active" : "Inactive"}</span>
                      </div>
                      {b.subtitle && <p className="text-[10px] text-emerald-400/50 mt-0.5">{b.subtitle}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400/30">Priority: {b.priority || 0}</span>
                    <button onClick={() => handleToggleBanner(b._id)}
                      className="p-2 rounded-lg hover:bg-emerald-800/20 text-emerald-400/70">{b.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}</button>
                    <button onClick={() => handleDeleteBanner(b._id)}
                      className="p-2 rounded-lg hover:bg-red-900/20 text-red-400/70"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
