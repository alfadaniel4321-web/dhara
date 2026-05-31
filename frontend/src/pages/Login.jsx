import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { setAuthStart, setAuthSuccess, setAuthFailure } from "../redux/slices/authSlice";
import { api } from "../services/api";
import { Leaf, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";



const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(setAuthStart());
      try {
        const data = await api.auth.login(email, password);
        dispatch(setAuthSuccess({ user: data.user, token: data.token }));
        if (data.user.role === "admin") navigate("/admin/dashboard");
        else if (data.user.role === "farmer") navigate("/farmer");
        else navigate("/dashboard");
      } catch (err) {
        dispatch(setAuthFailure(err.message || "Login failed"));
      }
    },
    [email, password, dispatch, navigate]
  );

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#021a0e" }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-70"
        style={{ color: "rgba(149,213,178,0.6)", fontFamily: '"Courier New", monospace' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            filter: "blur(6px) brightness(0.3)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(2,26,14,0.92) 0%, rgba(4,47,26,0.5) 40%, rgba(4,47,26,0.6) 60%, rgba(2,26,14,0.95) 100%)",
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(2,15,8,0.85) 100%)",
          }}
        />
      </div>

      {/* Floating decorative leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[15%] right-[8%] w-20 h-20 opacity-[0.04]"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf size={80} color="#95D5B2" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[6%] w-12 h-12 opacity-[0.03]"
          animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Leaf size={48} color="#95D5B2" />
        </motion.div>
        <motion.div
          className="absolute top-[45%] left-[3%] w-8 h-8 opacity-[0.02]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        >
          <Leaf size={32} color="#D9A441" />
        </motion.div>
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px] lg:max-w-[480px] px-5"
      >
        <div
          className="rounded-[32px] p-6"
          style={{
            background: "rgba(4,47,26,0.5)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(149,213,178,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Branding - Top Left */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div
                className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(149,213,178,0.12), rgba(217,164,65,0.08))",
                  border: "1px solid rgba(217,164,65,0.15)",
                }}
              >
                <Leaf size={22} color="#D9A441" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em]"
                  style={{ color: "rgba(149,213,178,0.45)" }}
                >
                  ORGANIC KERALA
                </p>
                <h1 className="text-base font-bold tracking-wider"
                  style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  DHARA
                </h1>
              </div>
            </motion.div>

            {/* Heading Section */}
            <motion.div variants={fadeUp} className="mb-5">
              <h2 className="text-[27px] font-bold leading-tight mb-1.5"
                style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Welcome Back
              </h2>
              <p className="text-sm font-medium mb-1.5" style={{ color: "#D9A441" }}>
                Farm Fresh Goodness Awaits
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(149,213,178,0.5)" }}>
                Sign in to access fresh organic produce directly from Kerala's trusted farmers.
              </p>
            </motion.div>

            {/* Organic Leaves Visual */}
            <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden mb-6 h-[110px] shadow-lg">
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(4,47,26,0.8), rgba(2,26,14,0.9))",
                }}
              />
              <div className="absolute inset-0"
                style={{
                  background: "linear-gradient(0deg, rgba(4,47,26,0.35) 0%, transparent 50%)",
                }}
              />
              <div className="absolute bottom-2.5 left-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(4,47,26,0.55)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    color: "rgba(149,213,178,0.7)",
                    border: "1px solid rgba(149,213,178,0.08)",
                  }}
                >
                  <Sparkles size={10} />
                  Fresh from Kerala
                </span>
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div variants={fadeUp}>
              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Email Field */}
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="username"
                    required
                    className="w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-[#5a7a6a] transition-all duration-300 outline-none"
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      border: "1px solid rgba(149,213,178,0.06)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(217,164,65,0.25)";
                      e.currentTarget.style.background = "rgba(0,0,0,0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(149,213,178,0.06)";
                      e.currentTarget.style.background = "rgba(0,0,0,0.25)";
                    }}
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-2xl px-4 py-3.5 pr-11 text-sm text-white placeholder:text-[#5a7a6a] transition-all duration-300 outline-none"
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      border: "1px solid rgba(149,213,178,0.06)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(217,164,65,0.25)";
                      e.currentTarget.style.background = "rgba(0,0,0,0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(149,213,178,0.06)";
                      e.currentTarget.style.background = "rgba(0,0,0,0.25)";
                    }}
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className="relative w-4 h-4 rounded-[4px] overflow-hidden transition-all duration-200 flex items-center justify-center"
                      style={{
                        background: rememberMe ? "#D9A441" : "rgba(0,0,0,0.3)",
                        border: rememberMe ? "1px solid #D9A441" : "1px solid rgba(149,213,178,0.1)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {rememberMe && (
                        <svg viewBox="0 0 16 16" className="w-full h-full p-[2px]">
                          <path d="M3 8L6.5 11.5L13 4.5" stroke="#021a0e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs select-none" style={{ color: "rgba(149,213,178,0.45)" }}>
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-medium bg-transparent border-none cursor-pointer transition-all hover:opacity-70"
                    style={{ color: "#D9A441" }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium"
                    style={{ color: "#ef4444" }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* SIGN IN Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full text-sm font-bold tracking-[0.08em] transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #0D5B43, #1B4332)",
                    border: "1px solid rgba(217,164,65,0.1)",
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(13,91,67,0.35)",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  whileHover={loading ? {} : { scale: 1.01, y: -1 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "linear-gradient(135deg, #0D5B43, #D9A441)";
                      e.currentTarget.style.boxShadow = "0 8px 40px rgba(217,164,65,0.25)";
                      e.currentTarget.style.borderColor = "rgba(217,164,65,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "linear-gradient(135deg, #0D5B43, #1B4332)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(13,91,67,0.35)";
                      e.currentTarget.style.borderColor = "rgba(217,164,65,0.1)";
                    }
                  }}
                >
                  <span className="relative z-10">
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                  </span>
                </motion.button>
              </form>
            </motion.div>

            {/* Bottom Section */}
            <motion.div variants={fadeUp} className="mt-6 text-center">
              <p className="text-xs" style={{ color: "rgba(149,213,178,0.35)" }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold no-underline transition-all hover:opacity-70"
                  style={{ color: "#D9A441" }}
                >
                  Create Account
                </Link>
              </p>
            </motion.div>


          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
