import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Search, ShoppingBag, Package, User,
  Leaf,
} from "lucide-react";

const CUSTOMER_ITEMS = [
  { icon: Home, label: "Home", route: "/dashboard" },
  { icon: Search, label: "Products", route: "/products" },
  { icon: ShoppingBag, label: "Cart", route: "/cart" },
  { icon: Package, label: "Orders", route: "/my-orders" },
  { icon: User, label: "Profile", route: "/profile" },
];

const ADMIN_ITEMS = [
  { icon: Home, label: "Dashboard", route: "/admin" },
  { icon: Search, label: "Products", route: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", route: "/admin/orders" },
  { icon: Package, label: "Farmers", route: "/admin/farmers" },
  { icon: User, label: "Profile", route: "/admin/settings" },
];

const FARMER_ITEMS = [
  { icon: Home, label: "Dashboard", route: "/farmer" },
  { icon: Search, label: "Products", route: "/farmer/products" },
  { icon: ShoppingBag, label: "Orders", route: "/farmer/orders" },
  { icon: Package, label: "Revenue", route: "/farmer/revenue" },
  { icon: User, label: "Profile", route: "/farmer/profile" },
];

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={isActive ? "active" : ""}
      aria-label={item.label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.2rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem 0',
        textDecoration: 'none',
        minWidth: '56px',
        color: isActive ? '#1B4332' : 'rgba(27,67,50,0.4)',
        transition: 'color 0.2s ease',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
      <span style={{
        fontSize: '0.45rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {item.label}
      </span>
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

  const isActiveRoute = (route) => {
    if (route === "/farmer" || route === "/admin" || route === "/dashboard") {
      return location.pathname === route;
    }
    return location.pathname.startsWith(route);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(27,67,50,0.06)',
      padding: '0.5rem 0',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
      display: { md: 'none' },
    }}
      className="md:hidden"
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '0 0.5rem',
      }}>
        {/* First 2 items */}
        {items.slice(0, 2).map((item) => (
          <NavItem
            key={item.route}
            item={item}
            isActive={isActiveRoute(item.route)}
            onClick={() => navigate(item.route)}
          />
        ))}

        {/* Center cart button */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          width: '60px',
        }}>
          <button
            onClick={() => navigate('/cart')}
            aria-label="Cart"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-20px',
              boxShadow: '0 4px 20px rgba(27,67,50,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              color: '#FFFFFF',
            }}
          >
            <ShoppingBag size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Last 2 items */}
        {items.slice(3).map((item) => (
          <NavItem
            key={item.route}
            item={item}
            isActive={isActiveRoute(item.route)}
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>
    </nav>
  );
}
