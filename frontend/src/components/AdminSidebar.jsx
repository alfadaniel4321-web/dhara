import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard, Users, Package, ShoppingBag, AlertTriangle,
  BarChart3, Bell, User, Shield, LogOut, X, Sprout, Percent
} from "lucide-react";
import { logoutUser } from "../redux/slices/authSlice";

const NAV_ITEMS = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/farmers", icon: Users, label: "Farmers" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/promotions", icon: Percent, label: "Promotions" },
  { to: "/admin/reports", icon: AlertTriangle, label: "Reports" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications" },
  { to: "/admin/settings", icon: User, label: "Profile" },
];

export default function AdminSidebar({ open, onClose }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-5 border-b border-emerald-800/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">Dhara</div>
            <div className="text-[10px] text-emerald-400/70 font-medium">Admin Panel</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-emerald-800/30 text-emerald-400/70">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-300 shadow-sm border border-emerald-500/10"
                  : "text-emerald-200/70 hover:bg-emerald-800/20 hover:text-emerald-200"
              }`}
            >
              <Icon size={18} className={isActive ? "text-emerald-400" : "text-emerald-400/50 group-hover:text-emerald-400"} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-emerald-800/30 space-y-1">
        <NavLink to="/dashboard" onClick={onClose}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-emerald-200/60 hover:bg-emerald-800/20 hover:text-emerald-200 transition-all"
        >
          <Sprout size={18} className="text-emerald-400/50" />
          <span>Customer View</span>
        </NavLink>
        <button onClick={() => { dispatch(logoutUser()); onClose(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-900/20 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-72 h-screen fixed left-0 top-0 z-30 bg-gradient-to-b from-[#013220] to-[#011a10] border-r border-emerald-800/20">
        {content}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative w-72 h-full bg-gradient-to-b from-[#013220] to-[#011a10] shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
