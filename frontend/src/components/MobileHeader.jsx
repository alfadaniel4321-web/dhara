import { useNavigate } from "react-router-dom";
import { ShoppingBag, Menu } from "lucide-react";
import { useSelector } from "react-redux";

export default function MobileHeader({ onMenuToggle }) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 pb-2"
      style={{
        background: "#F8F6F0",
        paddingTop: "env(safe-area-inset-top, 12px)",
        height: "72px",
        borderBottomLeftRadius: "24px",
        borderBottomRightRadius: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0F5132, #0A3B2A)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 6 6 6 12C6 16 9 19 12 20C15 19 18 16 18 12C18 6 12 2 12 2Z" fill="#D9A441" opacity="0.9"/>
            <path d="M12 2C12 2 8 5 8 9.5C8 13 10 16 12 17.5" fill="#D9A441" opacity="0.5"/>
          </svg>
        </div>
        <div>
          <h1
            className="text-base font-bold leading-tight tracking-wide"
            style={{
              color: "#0A3B2A",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            DHARA
          </h1>
          <p
            className="text-[8px] font-medium tracking-[0.15em]"
            style={{ color: "rgba(15,81,50,0.45)" }}
          >
            ORGANIC KERALA
          </p>
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/cart")}
          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(15,81,50,0.06)" }}
        >
          <ShoppingBag size={18} color="#0A3B2A" />
          {cartItems.length > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{
                background: "#D9A441",
                color: "#fff",
                boxShadow: "0 2px 6px rgba(217,164,65,0.3)",
              }}
            >
              {cartItems.length}
            </span>
          )}
        </button>
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(15,81,50,0.06)" }}
        >
          <Menu size={18} color="#0A3B2A" />
        </button>
      </div>
    </header>
  );
}
