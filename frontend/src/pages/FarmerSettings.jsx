import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Settings, User, MapPin, Phone, Mail, FileText, Save, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { updateUser } from "../redux/slices/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { t, onLanguageChange } from "../data/i18n";

export default function FarmerSettings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(0);
  useEffect(() => onLanguageChange(() => forceUpdate(n => n + 1)), []);

  const [form, setForm] = useState({
    name: "", phone: "", address: "", village: "", district: "", description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        village: user.village ?? "",
        district: user.district ?? "",
        description: user.description ?? "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const updated = await api.farmer.updateProfile(form);
      if (updated) {
        const updatedUser = { ...user, ...form };
        localStorage.setItem("dhara_user", JSON.stringify(updatedUser));
        dispatch(updateUser(updatedUser));
        setSuccess(t('farmerSettings.profileUpdated'));
      }
    } catch (err) {
      setError(err.message || t('farmerSettings.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const fields = [
    { key: "name", icon: User, label: t('farmerSettings.farmName'), placeholder: t('farmerSettings.placeholders.farmName') },
    { key: "phone", icon: Phone, label: t('farmerSettings.phoneNumber'), placeholder: t('farmerSettings.placeholders.phone'), type: "tel" },
    { key: "address", icon: MapPin, label: t('farmerSettings.address'), placeholder: t('farmerSettings.placeholders.address') },
    { key: "village", icon: MapPin, label: t('farmerSettings.village'), placeholder: t('farmerSettings.placeholders.village') },
    { key: "district", icon: MapPin, label: t('farmerSettings.district'), placeholder: t('farmerSettings.placeholders.district') },
    { key: "description", icon: FileText, label: t('farmerSettings.farmDescription'), placeholder: t('farmerSettings.placeholders.description'), textarea: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center">
          <Settings size={24} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-100">{t('farmerSettings.title')}</h1>
          <p className="text-xs text-emerald-400/50 mt-0.5">{t('farmerSettings.subtitle')}</p>
        </div>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, icon: Icon, label, placeholder, textarea, type }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-emerald-400/70 mb-1.5 flex items-center gap-1.5">
              <Icon size={12} /> {label}
            </label>
            {textarea ? (
              <textarea value={form[key]} onChange={handleChange(key)}
                placeholder={placeholder} rows={3}
                className="w-full px-4 py-3 bg-[#111811] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50 transition-all resize-none"
              />
            ) : (
              <input type={type || "text"} value={form[key]} onChange={handleChange(key)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-[#111811] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50 transition-all"
              />
            )}
          </div>
        ))}

        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/30"
          >
            <Save size={16} />
            {saving ? t('farmerSettings.saving') : t('farmerSettings.saveChanges')}
          </button>
        </div>
      </form>

      {/* Account Info */}
      <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-emerald-100 mb-3">{t('farmerSettings.accountInformation')}</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-900/5">
            <span className="text-emerald-400/60">{t('farmerSettings.email')}</span>
            <span className="text-emerald-200 font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-900/5">
            <span className="text-emerald-400/60">{t('farmerSettings.accountType')}</span>
            <span className="text-emerald-200 font-medium capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-900/5">
            <span className="text-emerald-400/60">{t('farmerSettings.rating')}</span>
            <span className="text-yellow-400 font-bold">{user?.rating} ★</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
