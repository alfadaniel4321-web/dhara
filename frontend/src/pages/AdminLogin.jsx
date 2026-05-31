import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthStart, setAuthSuccess, setAuthFailure } from "../redux/slices/authSlice";
import { api } from "../services/api";
import { Shield, Eye, EyeOff, Leaf } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setAuthStart());
    try {
      const data = await api.auth.login(email, password);
      if (data.user.role !== "admin") {
        dispatch(setAuthFailure("Unauthorized: Admin access only"));
        return;
      }
      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      navigate("/admin/dashboard");
    } catch (err) {
      dispatch(setAuthFailure(err.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#021a0e" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(4,47,26,0.6) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        className="relative w-full max-w-[400px] rounded-[28px] p-8"
        style={{
          background: "rgba(4,47,26,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(149,213,178,0.06)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(217,164,65,0.15), rgba(217,164,65,0.05))",
              border: "1px solid rgba(217,164,65,0.15)",
            }}
          >
            <Shield size={26} color="#D9A441" />
          </div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Admin Access
          </h1>
          <p className="text-xs mt-1.5" style={{ color: "rgba(149,213,178,0.45)" }}>
            Secure administrative portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest block mb-1.5"
              style={{ color: "rgba(149,213,178,0.35)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dhara.com"
              autoComplete="username"
              required
              className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-[#5a7a6a] outline-none transition-all"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(149,213,178,0.06)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(217,164,65,0.25)"; e.target.style.background = "rgba(0,0,0,0.4)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(149,213,178,0.06)"; e.target.style.background = "rgba(0,0,0,0.3)"; }}
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest block mb-1.5"
              style={{ color: "rgba(149,213,178,0.35)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl px-4 py-3 pr-11 text-sm text-white placeholder:text-[#5a7a6a] outline-none transition-all"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(149,213,178,0.06)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(217,164,65,0.25)"; e.target.style.background = "rgba(0,0,0,0.4)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(149,213,178,0.06)"; e.target.style.background = "rgba(0,0,0,0.3)"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "rgba(149,213,178,0.35)" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl text-sm font-bold tracking-wider transition-all duration-300"
            style={{
              background: loading ? "linear-gradient(135deg, #0D5B43, #1B4332)" : "linear-gradient(135deg, #D9A441, #B8860B)",
              color: "#fff",
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(217,164,65,0.25)",
            }}
          >
            {loading ? "AUTHENTICATING..." : "ACCESS PANEL"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Leaf size={12} className="inline-block mr-1" style={{ color: "rgba(149,213,178,0.2)" }} />
          <span className="text-[9px] font-mono tracking-widest" style={{ color: "rgba(149,213,178,0.15)" }}>
            DHARA ADMIN v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
