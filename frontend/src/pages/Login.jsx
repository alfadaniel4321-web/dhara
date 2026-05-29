import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setAuthStart, setAuthSuccess, setAuthFailure } from "../redux/slices/authSlice";
import { api } from "../services/api";
import { Leaf, User, Shield, Sprout, ChevronLeft } from "lucide-react";

const roles = [
  { id: "farmer", label: "Farmer", icon: Sprout, desc: "Sell your farm produce" },
  { id: "customer", label: "Customer", icon: User, desc: "Buy fresh farm products" },
  { id: "admin", label: "Admin", icon: Shield, desc: "Manage the marketplace" },
];

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(setAuthStart());

      try {
        const data = await api.auth.login(email, password);
        dispatch(setAuthSuccess({ user: data.user, token: data.token }));
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "farmer") navigate("/farmer");
        else navigate("/dashboard");
      } catch (err) {
        dispatch(setAuthFailure(err.message || "Login failed"));
      }
    },
    [email, password, dispatch, navigate]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#042f1a",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(149,213,178,0.8) 0px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 no-underline transition-all"
        style={{ color: "rgba(149,213,178,0.5)", fontSize: "0.75rem", fontWeight: 600 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#95D5B2")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(149,213,178,0.5)")}
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(4,47,26,0.6)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(149,213,178,0.12)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: "rgba(149,213,178,0.12)",
                border: "1px solid rgba(149,213,178,0.2)",
              }}
            >
              <Leaf size={32} style={{ color: "#95D5B2" }} />
            </div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              DHARA
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(149,213,178,0.5)" }}>
              Organic Kerala
            </p>
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: isActive
                      ? "rgba(149,213,178,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      isActive
                        ? "rgba(149,213,178,0.3)"
                        : "rgba(255,255,255,0.06)"
                    }`,
                    color: isActive ? "#95D5B2" : "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={20} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {role && (
            <p
              className="text-xs text-center mb-6"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {roles.find((r) => r.id === role)?.desc}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "admin"
                    ? "Admin Email"
                    : "Username or Email address"
                }
                autoComplete="username"
                required
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white transition-all"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(149,213,178,0.4)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.08)")
                }
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white transition-all"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(149,213,178,0.4)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.08)")
                }
              />
            </div>

            {error && (
              <p
                className="text-xs font-medium"
                style={{ color: "#ef4444" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-extrabold transition-all"
              style={{
                background: "linear-gradient(135deg, #2D6A4F, #1B4332)",
                border: "1px solid rgba(149,213,178,0.15)",
                color: "#fff",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #40916C, #2D6A4F)";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #2D6A4F, #1B4332)";
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p
              className="text-xs mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#95D5B2",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Register
              </Link>
            </p>

            <div
              className="pt-4 text-center"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                className="text-[10px] mb-2"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Demo Credentials
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{
                    background: "rgba(149,213,178,0.08)",
                    color: "rgba(149,213,178,0.6)",
                    border: "1px solid rgba(149,213,178,0.1)",
                  }}
                >
                  Farmer: farmer@dhara.com
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{
                    background: "rgba(149,213,178,0.08)",
                    color: "rgba(149,213,178,0.6)",
                    border: "1px solid rgba(149,213,178,0.1)",
                  }}
                >
                  Customer: customer@dhara.com
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{
                    background: "rgba(149,213,178,0.08)",
                    color: "rgba(149,213,178,0.6)",
                    border: "1px solid rgba(149,213,178,0.1)",
                  }}
                >
                  Admin: admin@dhara.com / admin123
                </span>
              </div>
              <p
                className="text-[10px] mt-2"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                Password: password123
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
