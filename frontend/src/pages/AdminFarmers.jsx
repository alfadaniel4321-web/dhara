import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Shield, ShieldOff, RefreshCw, Star,
  AlertTriangle, Mail, Phone, Package, Trash2
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getFarmers();
      setFarmers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleBlock = async (id) => {
    if (!window.confirm("Block this farmer permanently?")) return;
    try {
      await api.admin.blockFarmer(id);
      setSuccess("Farmer blocked");
      load();
    } catch (err) { alert(err.message); }
  };

  const handleUnblock = async (id) => {
    try {
      await api.admin.unblockFarmer(id);
      setSuccess("Farmer unblocked");
      load();
    } catch (err) { alert(err.message); }
  };

  const handleResetStrikes = async (id) => {
    if (!window.confirm("Reset all negative strikes and unblock farmer?")) return;
    try {
      await api.admin.resetFarmerStrikes(id);
      setSuccess("Strikes reset");
      load();
    } catch (err) { alert(err.message); }
  };

  const filtered = farmers.filter(f =>
    !search || f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.village?.toLowerCase().includes(search.toLowerCase()) ||
    f.district?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Farmer Management</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{farmers.length} registered farmers</p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium">
          {success}
        </div>
      )}

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search farmers by name, email, location..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0a1a0e] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl">
          <Users size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">No farmers found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((f) => (
            <motion.div key={f._id || f.id} layout
              className={`bg-[#0a1a0e] border rounded-2xl p-5 ${f.blocked ? "border-red-900/30" : "border-emerald-900/20"} hover:border-emerald-700/30 transition-all`}
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${f.blocked ? "bg-red-900/30 text-red-400" : "bg-emerald-900/30 text-emerald-400"}`}>
                    {f.name?.charAt(0) || "F"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-emerald-100">{f.name}</p>
                      {f.blocked && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded">BLOCKED</span>}
                    </div>
                    <p className="text-[10px] text-emerald-400/50 flex items-center gap-2 mt-0.5">
                      <Mail size={10} /> {f.email} · <Phone size={10} /> {f.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${f.rating >= 4 ? "bg-green-900/30 text-green-400" : f.rating >= 3 ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}>
                    {f.rating}★
                  </span>
                  {f.negativeFeedbacksCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-900/30 text-red-400">
                      {f.negativeFeedbacksCount} strikes
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-900/5 rounded-xl p-3 text-xs">
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Location</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{f.village || "—"}, {f.district || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Products</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{f.productCount || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Complaints</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{f.complaints || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400/40 uppercase">Joined</p>
                  <p className="text-emerald-200 font-medium mt-0.5">{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "—"}</p>
                </div>
              </div>

              {f.description && (
                <p className="mt-2 text-[10px] text-emerald-400/60 italic px-3">"{f.description}"</p>
              )}

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {f.blocked ? (
                  <>
                    <button onClick={() => handleUnblock(f._id || f.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600/20 hover:bg-green-600/30 rounded-xl text-[10px] font-bold text-green-400 transition-all"
                    ><Shield size={12} /> Unblock</button>
                    <button onClick={() => handleResetStrikes(f._id || f.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-xl text-[10px] font-bold text-emerald-400 transition-all"
                    ><RefreshCw size={12} /> Reset Strikes</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleBlock(f._id || f.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-xl text-[10px] font-bold text-red-400 transition-all"
                    ><ShieldOff size={12} /> Block</button>
                    {f.negativeFeedbacksCount > 0 && (
                      <button onClick={() => handleResetStrikes(f._id || f.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-xl text-[10px] font-bold text-yellow-400 transition-all"
                      ><RefreshCw size={12} /> Reset Strikes</button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
