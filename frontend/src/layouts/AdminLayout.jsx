import { useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Shield, AlertTriangle, LogOut } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { logoutUser } from "../redux/slices/authSlice";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const token = localStorage.getItem("dhara_token");
  const isMockToken = token && token.startsWith("mock_");

  if (isMockToken) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#042f1a" }}>
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-900/30 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-emerald-100 mb-2">Invalid Session</h1>
          <p className="text-sm text-emerald-400/60 mb-6">
            You are logged in with an offline/mock session. Please log out and log back in while the backend server is running.
          </p>
          <button onClick={() => { dispatch(logoutUser()); navigate("/login"); }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 mx-auto"
          >
            <LogOut size={16} /> Logout & Re-login
          </button>
        </div>
      </div>
    );
  }

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
    </div>
  );
}
