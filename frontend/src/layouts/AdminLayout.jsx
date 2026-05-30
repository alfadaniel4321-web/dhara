import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Shield } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import MobileBottomNav from "../components/MobileBottomNav";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex" style={{ background: "#042f1a" }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-[#042f1a]/90 backdrop-blur-lg border-b border-emerald-900/20">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-emerald-800/20 text-emerald-400/70"
            ><Menu size={22} /></button>

            <div className="flex items-center gap-2 ml-auto">
              <Shield size={14} className="text-emerald-400" />
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-emerald-100">{user.name}</div>
                <div className="text-[10px] text-emerald-400/50 font-medium uppercase tracking-wider">Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-900/30">
                {user.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="px-4 lg:px-8 py-4 border-t border-emerald-900/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-emerald-700/40">
            <span>© 2026 Dhara Marketplace</span>
            <span>Admin Panel v1.0</span>
          </div>
        </footer>
      </div>
      <MobileBottomNav role="admin" />
    </div>
  );
}
