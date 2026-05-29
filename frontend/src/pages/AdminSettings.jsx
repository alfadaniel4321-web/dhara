import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Shield, Settings, Mail, Calendar, User, Info } from "lucide-react";

export default function AdminSettings() {
  const { user } = useSelector((state) => state.auth);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center">
          <Settings size={24} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-100">Admin Settings</h1>
          <p className="text-xs text-emerald-400/50 mt-0.5">Platform configuration and admin profile</p>
        </div>
      </div>

      <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-emerald-100 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" /> Admin Profile
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900/5">
            <User size={16} className="text-emerald-400" />
            <div>
              <p className="text-[10px] text-emerald-400/50 font-medium">Name</p>
              <p className="text-sm text-emerald-100 font-semibold">{user?.name || "Admin"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900/5">
            <Mail size={16} className="text-emerald-400" />
            <div>
              <p className="text-[10px] text-emerald-400/50 font-medium">Email</p>
              <p className="text-sm text-emerald-100 font-semibold">{user?.email || "admin@dhara.com"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900/5">
            <Shield size={16} className="text-emerald-400" />
            <div>
              <p className="text-[10px] text-emerald-400/50 font-medium">Role</p>
              <p className="text-sm text-emerald-100 font-semibold capitalize">{user?.role || "Admin"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-emerald-100 mb-4 flex items-center gap-2">
          <Info size={16} className="text-emerald-400" /> Platform Info
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="px-4 py-3 rounded-xl bg-emerald-900/5">
            <p className="text-[10px] text-emerald-400/50">Platform</p>
            <p className="text-emerald-200 font-semibold mt-0.5">Dhara Marketplace</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-emerald-900/5">
            <p className="text-[10px] text-emerald-400/50">Version</p>
            <p className="text-emerald-200 font-semibold mt-0.5">Admin Panel v1.0</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-emerald-900/5">
            <p className="text-[10px] text-emerald-400/50">Role Model</p>
            <p className="text-emerald-200 font-semibold mt-0.5">Admin · Farmer · Customer</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-emerald-900/5">
            <p className="text-[10px] text-emerald-400/50">Database</p>
            <p className="text-emerald-200 font-semibold mt-0.5">MongoDB Atlas</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-emerald-100 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <a href="/admin/farmers"
            className="px-4 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-900/30 rounded-xl text-xs font-semibold text-emerald-300 text-center transition-all"
          >Manage Farmers</a>
          <a href="/admin/products"
            className="px-4 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-900/30 rounded-xl text-xs font-semibold text-emerald-300 text-center transition-all"
          >Moderate Products</a>
          <a href="/admin/reports"
            className="px-4 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-900/30 rounded-xl text-xs font-semibold text-emerald-300 text-center transition-all"
          >View Reports</a>
          <a href="/admin/analytics"
            className="px-4 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-900/30 rounded-xl text-xs font-semibold text-emerald-300 text-center transition-all"
          >View Analytics</a>
        </div>
      </div>
    </motion.div>
  );
}
