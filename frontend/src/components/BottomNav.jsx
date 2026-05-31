import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingBag, Package, User, Leaf } from "lucide-react";

const ITEMS = [
  { icon: Home, label: "Home", route: "/dashboard" },
  { icon: Grid, label: "Shop", route: "/products" },
  { icon: Leaf, label: "", route: "/cart", center: true },
  { icon: Package, label: "Orders", route: "/my-orders" },
  { icon: User, label: "Profile", route: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => {
    if (route === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(route);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 pb-safe-bottom"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.04)",
        height: "72px",
      }}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.route);

        if (item.center) {
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className="relative -top-4 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #0F5132, #0A3B2A)",
                boxShadow: "0 4px 20px rgba(15,81,50,0.35)",
                border: "3px solid #F8F6F0",
              }}
            >
              <Icon size={22} color="#fff" />
            </button>
          );
        }

        return (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className="flex flex-col items-center gap-0.5 transition-all duration-200 active:scale-90"
            style={{ minWidth: "56px" }}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.5}
              style={{
                color: active ? "#0F5132" : "rgba(29,43,31,0.35)",
                transition: "color 0.2s",
              }}
            />
            <span
              className="text-[10px] font-medium tracking-wide"
              style={{
                color: active ? "#0F5132" : "rgba(29,43,31,0.35)",
                transition: "color 0.2s",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
