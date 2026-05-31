import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '../redux/slices/authSlice';
import { api } from '../services/api';

const Particles = ({ count = 14 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{
          background: i % 3 === 0 ? 'rgba(201, 150, 63, 0.3)' : 'rgba(106, 153, 78, 0.2)',
          left: `${(i * 9.1 + 7) % 100}%`,
          top: `${(i * 11.3 + 13) % 100}%`,
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          animation: `floatParticle ${10 + (i % 4) * 2}s ease-in-out ${i * 0.9}s infinite`,
        }}
      />
    ))}
  </div>
);

const FloatingLeaf = ({ index }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      left: `${15 + (index * 27) % 70}%`,
      top: `${-15 - index * 10}%`,
      fontSize: `${1.2 + (index % 3) * 0.5}rem`,
      opacity: 0.06 + (index % 4) * 0.03,
    }}
    animate={{
      y: ['0vh', '120vh'],
      x: [0, -20, 30, -10, 0],
      rotate: [0, -30, 50, -20, 0],
    }}
    transition={{
      duration: 20 + index * 5,
      repeat: Infinity,
      ease: 'linear',
      delay: index * 3,
    }}
  >
    🍃
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const FloatingLabelInput = ({ label, type, value, onChange, placeholder, autoComplete }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <label
        className={`block text-[9px] tracking-[0.2em] uppercase font-semibold mb-1.5 transition-colors duration-300 ${
          focused ? 'text-[#C9963F]' : 'text-[#6A994E]/70'
        }`}
      >
        {label}
      </label>
      <div
        className={`relative rounded-2xl border transition-all duration-300 ${
          focused
            ? 'border-[#C9963F]/60 shadow-[0_0_20px_rgba(201,150,63,0.08)]'
            : 'border-[#6A994E]/20 hover:border-[#6A994E]/40'
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          autoComplete={autoComplete}
          className="w-full bg-transparent px-4 py-3 text-sm text-[#F5F3E7] placeholder:text-[#F5F3E7]/20 focus:outline-none font-light tracking-wide"
          required
        />
        {focused && (
          <motion.div
            layoutId={`underline-${label}`}
            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9963F]/60 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
          />
        )}
      </div>
    </div>
  );
};

const RoleToggle = ({ role, onChange }) => (
  <div
    className="flex gap-1.5 p-1 rounded-2xl border"
    style={{ borderColor: 'rgba(106, 153, 78, 0.12)', background: 'rgba(106, 153, 78, 0.04)' }}
  >
    {['customer', 'farmer'].map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => onChange(r)}
        className={`flex-1 py-2.5 rounded-xl text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-500 ${
          role === r
            ? 'bg-[#6A994E] text-[#0F1E14] shadow-lg shadow-[#6A994E]/20'
            : 'text-[#F5F3E7]/40 hover:text-[#F5F3E7]/70'
        }`}
      >
        {r}
      </button>
    ))}
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState('');

  const { loading, error } = useSelector((state) => state.auth);

  const handleSignup = useCallback(async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch(setAuthFailure('Passwords do not match'));
      return;
    }
    dispatch(setAuthStart());
    try {
      const data = await api.auth.signup(name, email, password, role, phone, address);
      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      navigate(data.user.role === 'farmer' ? '/farmer' : '/dashboard');
    } catch (err) {
      dispatch(setAuthFailure(err.message || 'Signup failed'));
    }
  }, [name, email, password, confirmPassword, role, phone, address, dispatch, navigate]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0F1E14] flex">
      <Particles />
      <FloatingLeaf index={0} />
      <FloatingLeaf index={1} />
      <FloatingLeaf index={2} />

      {/* Ambient glow */}
      <div className="absolute top-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#6A994E]/4 blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#C9963F]/4 blur-[100px]" />

      {/* ─── LEFT: Brand Panel ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex relative w-[55%] min-h-screen flex-col justify-between p-16"
      >
        <div className="absolute inset-0 bg-gradient-to-tl from-[#0F1E14]/90 via-[#0F1E14]/50 to-[#0F1E14]/20" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-['Georgia',serif] text-[#C9963F] text-3xl tracking-[-0.03em]">
              DHARA
            </span>
            <div className="w-8 h-[1px] bg-[#C9963F]/40 mt-4 mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <p className="text-[#6A994E] text-[10px] tracking-[0.25em] uppercase font-['Courier_New',monospace] mb-4">
              Join the Movement
            </p>
            <h1 className="font-['Georgia',serif] text-[#F5F3E7] text-[clamp(2.5rem,4vw,4.5rem)] font-light leading-[1.05] tracking-[-0.03em]">
              Become Part<br />of Kerala's<br />Organic Future
            </h1>
            <p className="text-[#F5F3E7]/50 text-sm font-light leading-relaxed mt-6 max-w-sm">
              Whether you're a family farmer with generations of wisdom or a household seeking
              pure nutrition — your place is here.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="relative z-10"
        >
          <div className="flex flex-col gap-2 text-[10px] text-[#F5F3E7]/30 font-['Courier_New',monospace] tracking-[0.15em]">
            <span className="text-[#C9963F]/60">Zero middlemen. Direct from farm.</span>
          </div>
        </motion.div>

        <div className="absolute bottom-16 left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-[#C9963F]/10 to-[#6A994E]/20" />
      </motion.div>

      {/* ─── RIGHT: Signup Card Panel ─── */}
      <div className="relative w-full lg:w-[45%] min-h-screen flex items-center justify-center p-6 lg:p-16">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-1.5 no-underline transition-all"
          style={{ color: "rgba(106,153,78,0.5)", fontSize: "0.75rem", fontWeight: 600 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#6A994E")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(106,153,78,0.5)")}
        >
          <ChevronLeft size={16} />
          Back
        </Link>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[480px]"
        >
          <motion.div
            variants={itemVariants}
            className="relative rounded-[2.5rem] p-8 lg:p-10 border backdrop-blur-2xl"
            style={{
              background: 'rgba(15, 30, 20, 0.35)',
              borderColor: 'rgba(106, 153, 78, 0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C9963F]/5 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#6A994E]/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <span className="font-['Georgia',serif] text-[#C9963F] text-xl tracking-[-0.03em]">DHARA</span>
              <span className="w-6 h-[1px] bg-[#6A994E]/30" />
              <span className="text-[#6A994E] text-[8px] tracking-[0.2em] uppercase font-['Courier_New',monospace]">Register</span>
            </div>

            {/* Header */}
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="font-['Georgia',serif] text-2xl lg:text-3xl text-[#F5F3E7] font-light tracking-[-0.02em]">
                Create your account
              </h2>
              <p className="text-[#F5F3E7]/40 text-xs font-light mt-2 tracking-wide">
                Join Dhara's organic marketplace
              </p>
            </motion.div>

            {/* Role */}
            <motion.div variants={itemVariants} className="mb-6">
              <RoleToggle role={role} onChange={setRole} />
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="bg-red-950/40 border border-red-900/50 rounded-2xl px-4 py-3 text-xs text-red-300/90 font-light tracking-wide">
                  {error}
                </div>
              </motion.div>
            )}

            {/* Form */}
            <motion.form variants={itemVariants} onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingLabelInput
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
                <FloatingLabelInput
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </div>

              <FloatingLabelInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                autoComplete="email"
              />

              <FloatingLabelInput
                label="Address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your address in Kerala"
                autoComplete="street-address"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <FloatingLabelInput
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-2xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden group mt-2"
                style={{
                  background: 'linear-gradient(135deg, #6A994E 0%, #5A8840 100%)',
                  color: '#F5F3E7',
                  boxShadow: '0 8px 32px rgba(106, 153, 78, 0.25)',
                }}
              >
                <span className="relative z-10">
                  {loading ? 'Creating Account…' : 'Create Account'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.form>

            {/* Login link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-[10px] text-[#F5F3E7]/30 tracking-wide">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="text-[#C9963F]/80 hover:text-[#C9963F] font-semibold transition-colors relative group"
                >
                  Sign in
                  <span className="absolute -bottom-px left-0 right-0 h-[1px] bg-[#C9963F]/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
