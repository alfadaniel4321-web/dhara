import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Users, ThumbsDown, Shield, ShieldOff,
  RefreshCw, MessageSquare, Star
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getReports();
      setReports(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleBlock = async (id) => {
    if (!window.confirm("Block this farmer?")) return;
    try {
      await api.admin.blockFarmer(id);
      setSuccess("Farmer blocked");
      load();
    } catch (err) { alert(err.message); }
  };

  const handleReset = async (id) => {
    if (!window.confirm("Reset strikes for this farmer?")) return;
    try {
      await api.admin.resetFarmerStrikes(id);
      setSuccess("Strikes reset");
      load();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <LoadingSpinner />;
  if (!reports) return <div className="text-center py-16 text-emerald-400/50 text-sm">Unable to load reports</div>;

  const { totalComplaints, complaintsByFarmer, recentComplaints } = reports;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Reports & Complaints</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{totalComplaints} total complaints</p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium">{success}</div>
      )}

      {totalComplaints === 0 ? (
        <div className="text-center py-16 bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl">
          <Shield size={40} className="mx-auto text-green-700/40 mb-3" />
          <p className="text-sm text-green-400/60 font-medium">No complaints — platform is healthy!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-red-400">{totalComplaints}</p>
              <p className="text-[10px] text-emerald-400/50 font-medium mt-1">Total Complaints</p>
            </div>
            <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-yellow-400">{complaintsByFarmer?.length || 0}</p>
              <p className="text-[10px] text-emerald-400/50 font-medium mt-1">Farmers with Complaints</p>
            </div>
            <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-emerald-400">{complaintsByFarmer?.filter(f => f.farmer?.blocked).length || 0}</p>
              <p className="text-[10px] text-emerald-400/50 font-medium mt-1">Blocked Farmers</p>
            </div>
          </div>

          {complaintsByFarmer?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-emerald-100 mb-3">Farmers by Complaints</h3>
              <div className="grid gap-3">
                {complaintsByFarmer.map((item, i) => (
                  <div key={i} className="bg-[#0a1a0e] border border-red-900/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${item.farmer?.blocked ? "bg-red-900/30 text-red-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                          {item.farmer?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-100">{item.farmer?.name || "Unknown Farmer"}</p>
                          <p className="text-[10px] text-emerald-400/50">{item.count} complaint{item.count > 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!item.farmer?.blocked && (
                          <button onClick={() => handleBlock(item.farmer?._id || item.farmer?.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-xl text-[10px] font-bold text-red-400"
                          ><ShieldOff size={12} /> Block</button>
                        )}
                        <button onClick={() => handleReset(item.farmer?._id || item.farmer?.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-xl text-[10px] font-bold text-emerald-400"
                        ><RefreshCw size={12} /> Reset</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentComplaints?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-emerald-100 mb-3">Recent Complaints</h3>
              <div className="space-y-2">
                {recentComplaints.slice(0, 10).map((r, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#0a1a0e] border border-red-900/10">
                    <ThumbsDown size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-emerald-200 font-medium">{r.review}</p>
                      <p className="text-[10px] text-emerald-400/50 mt-0.5">
                        {r.customerId?.name || "Customer"} · {r.productId?.title || "Product"} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={10} fill={s <= r.rating ? "#eab308" : "none"} color={s <= r.rating ? "#eab308" : "rgba(255,255,255,0.1)"} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
