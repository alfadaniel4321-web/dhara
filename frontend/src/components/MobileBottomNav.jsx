import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Grid, ShoppingBag, User, Package,
  LayoutDashboard, Users, Sprout,
  BarChart3, IndianRupee, Bell, Star
} from "lucide-react";

const CUSTOMER_ITEMS = [
  { icon: Home, label: "Home", route: "/dashboard" },
  { icon: Grid, label: "Products", route: "/products" },
  { icon: ShoppingBag, label: "Cart", route: "/cart" },
  { icon: Package, label: "Orders", route: "/my-orders" },
  { icon: User, label: "Profile", route: "/profile" },
];

const ADMIN_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", route: "/admin" },
  { icon: Users, label: "Farmers", route: "/admin/farmers" },
  { icon: Grid, label: "Products", route: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", route: "/admin/orders" },
  { icon: User, label: "Profile", route: "/admin/settings" },
];

const FARMER_ITEMS = [
  { icon: Home, label: "Dashboard", route: "/farmer" },
  { icon: Grid, label: "Products", route: "/farmer/products" },
  { icon: IndianRupee, label: "Revenue", route: "/farmer/revenue" },
  { icon: ShoppingBag, label: "Orders", route: "/farmer/orders" },
  { icon: User, label: "Profile", route: "/farmer/profile" },
];

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={isActive ? "active" : ""}
      aria-label={item.label}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
      <span>{item.label}</span>
    </button>
  );
}

export default function MobileBottomNav({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items =
    role === "farmer"
      ? FARMER_ITEMS
      : role === "admin"
        ? ADMIN_ITEMS
        : CUSTOMER_ITEMS;

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const isActive = item.route === "/farmer" || item.route === "/admin" || item.route === "/dashboard"
          ? location.pathname === item.route
          : location.pathname.startsWith(item.route);
        return (
          <NavItem
            key={item.route}
            item={item}
            isActive={isActive}
            onClick={() => navigate(item.route)}
          />
        );
      })}
    </nav>
  );
}
