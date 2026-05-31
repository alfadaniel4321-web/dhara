import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Leaf, Eye, EyeOff, Mail, Phone, User, Check, X, Sparkles, Globe } from 'lucide-react';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '../redux/slices/authSlice';
import { api } from '../services/api';

/* ─── Desktop-specific decorations (unchanged) ─── */
const Particles = ({ count = 14 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute w-1 h-1 rounded-full" style={{
        background: i % 3 === 0 ? 'rgba(201, 150, 63, 0.3)' : 'rgba(106, 153, 78, 0.2)',
        left: `${(i * 9.1 + 7) % 100}%`, top: `${(i * 11.3 + 13) % 100}%`,
        width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
        animation: `floatParticle ${10 + (i % 4) * 2}s ease-in-out ${i * 0.9}s infinite`,
      }} />
    ))}
  </div>
);

const FloatingLeaf = ({ index }) => (
  <motion.div className="absolute pointer-events-none" style={{
    left: `${15 + (index * 27) % 70}%`, top: `${-15 - index * 10}%`,
    fontSize: `${1.2 + (index % 3) * 0.5}rem`, opacity: 0.06 + (index % 4) * 0.03,
  }}
    animate={{ y: ['0vh', '120vh'], x: [0, -20, 30, -10, 0], rotate: [0, -30, 50, -20, 0] }}
    transition={{ duration: 20 + index * 5, repeat: Infinity, ease: 'linear', delay: index * 3 }}
  >🍃</motion.div>
);

/* ─── Desktop shared components (unchanged) ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Mobile-specific components ─── */

function HeroVisual() {
  return (
    <div style={{
      position: 'relative', height: '190px', borderRadius: '24px', overflow: 'hidden',
      background: 'linear-gradient(135deg, #1B4332 0%, #0F1E14 50%, #1B4332 100%)',
      boxShadow: '0 8px 32px rgba(27,67,50,0.15)',
    }}>
      <div style={{
        position: 'absolute', top: '-50%', right: '-30%', width: '280px', height: '280px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,200,122,0.08) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40%', left: '-20%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(15,30,20,0.1) 0%, rgba(15,30,20,0.4) 100%)',
      }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1 }}>
        <Leaf size={36} color="#A3C87A" style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
        <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.6rem', fontWeight: 400, color: '#F5F3E7', margin: 0, letterSpacing: '-0.02em' }}>
          DHARA
        </h2>
        <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.35em', color: '#A3C87A', margin: '0.35rem 0 0 0', textTransform: 'uppercase' }}>
          Farm · Table · Trust
        </p>
      </div>
      <div style={{
        position: 'absolute', bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(163,200,122,0.08)', borderRadius: '20px', padding: '0.25rem 0.75rem',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.4rem', letterSpacing: '0.15em', color: 'rgba(163,200,122,0.4)', textTransform: 'uppercase' }}>
          Kerala's Organic Marketplace
        </span>
      </div>
    </div>
  );
}

function RoleCard({ value, selected, icon, label, description, onClick }) {
  return (
    <motion.button
      type="button" onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{
        flex: 1, cursor: 'pointer', textAlign: 'left', padding: '0.85rem 1rem',
        borderRadius: '14px', border: selected ? '2px solid #6A994E' : '2px solid rgba(27,67,50,0.08)',
        background: selected ? 'rgba(106,153,78,0.06)' : '#FFFFFF',
        boxShadow: selected ? '0 4px 20px rgba(106,153,78,0.12)' : '0 1px 4px rgba(27,67,50,0.04)',
        transition: 'all 0.25s ease',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? 'rgba(106,153,78,0.12)' : 'rgba(27,67,50,0.04)',
        transition: 'background 0.25s ease',
      }}>
        {icon}
      </div>
      <div>
        <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#1B4332', display: 'block', marginBottom: '0.1rem' }}>
          {label}
        </span>
        <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.6rem', fontWeight: 300, color: 'rgba(27,67,50,0.45)', display: 'block' }}>
          {description}
        </span>
      </div>
      {selected && (
        <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: '#6A994E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={12} color="#FFFFFF" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
}

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
];

function PasswordStrengthBar({ password }) {
  const score = PASSWORD_REQUIREMENTS.reduce((s, r) => s + (r.test(password) ? 1 : 0), 0);
  const pct = (score / PASSWORD_REQUIREMENTS.length) * 100;
  const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#6A994E', '#1B4332'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return (
    <div style={{ marginTop: '0.4rem' }}>
      <div style={{ height: '3px', background: 'rgba(27,67,50,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: colors[Math.min(score, PASSWORD_REQUIREMENTS.length - 1)], borderRadius: '2px', transition: 'width 0.3s ease, background 0.3s ease' }} />
      </div>
      {password.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', letterSpacing: '0.05em', color: colors[Math.min(score, PASSWORD_REQUIREMENTS.length - 1)] }}>
            {labels[Math.min(score, PASSWORD_REQUIREMENTS.length - 1)]}
          </span>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {PASSWORD_REQUIREMENTS.slice(0, 3).map((req, i) => {
              const met = req.test(password);
              return met ? (
                <span key={i} style={{ fontFamily: '"Courier New", monospace', fontSize: '0.4rem', color: '#6A994E' }}>{req.label}</span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmDescription, setFarmDescription] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const emailValid = EMAIL_REGEX.test(email);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;
  const formValid = name.trim()
    && emailValid
    && phone.trim().length >= 10
    && password.length >= 8
    && password === confirmPassword
    && agreeTerms;

  const handleSignup = useCallback(async (e) => {
    e.preventDefault();
    if (!formValid) { setSubmitted(true); return; }
    dispatch(setAuthStart());
    try {
      const payload = { name: name.trim(), email: email.trim().toLowerCase(), password, role, phone: phone.trim() };
      if (role === 'farmer') {
        payload.address = [farmLocation, address].filter(Boolean).join(', ');
      } else {
        payload.address = address;
      }
      const data = await api.auth.signup(payload.name, payload.email, payload.password, role, payload.phone, payload.address);
      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      navigate(data.user.role === 'farmer' ? '/farmer' : '/dashboard');
    } catch (err) {
      dispatch(setAuthFailure(err.message || 'Signup failed'));
    }
  }, [name, email, phone, password, role, address, farmName, farmLocation, farmDescription, agreeTerms, formValid, dispatch, navigate]);

  /* ─── DESKTOP LAYOUT (unchanged) ─── */
  if (!isMobile) {
    const FloatingLabelInput = ({ label, type, value, onChange, placeholder, autoComplete }) => {
      const [focused, setFocused] = useState(false);
      return (
        <div className="relative group">
          <label className={`block text-[9px] tracking-[0.2em] uppercase font-semibold mb-1.5 transition-colors duration-300 ${focused ? 'text-[#C9963F]' : 'text-[#6A994E]/70'}`}>{label}</label>
          <div className={`relative rounded-2xl border transition-all duration-300 ${focused ? 'border-[#C9963F]/60 shadow-[0_0_20px_rgba(201,150,63,0.08)]' : 'border-[#6A994E]/20 hover:border-[#6A994E]/40'}`}>
            <input type={type} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder={focused ? placeholder : ''} autoComplete={autoComplete}
              className="w-full bg-transparent px-4 py-3 text-sm text-[#F5F3E7] placeholder:text-[#F5F3E7]/20 focus:outline-none font-light tracking-wide" required />
            {focused && (
              <motion.div layoutId={`underline-${label}`}
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9963F]/60 to-transparent"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} />
            )}
          </div>
        </div>
      );
    };

    const RoleToggle = ({ role, onChange }) => (
      <div className="flex gap-1.5 p-1 rounded-2xl border" style={{ borderColor: 'rgba(106, 153, 78, 0.12)', background: 'rgba(106, 153, 78, 0.04)' }}>
        {['customer', 'farmer'].map((r) => (
          <button key={r} type="button" onClick={() => onChange(r)}
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-500 ${role === r ? 'bg-[#6A994E] text-[#0F1E14] shadow-lg shadow-[#6A994E]/20' : 'text-[#F5F3E7]/40 hover:text-[#F5F3E7]/70'}`}>{r}</button>
        ))}
      </div>
    );

    return (
      <div className="relative w-full min-h-screen overflow-hidden bg-[#0F1E14] flex">
        <Particles /><FloatingLeaf index={0} /><FloatingLeaf index={1} /><FloatingLeaf index={2} />
        <div className="absolute top-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#6A994E]/4 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#C9963F]/4 blur-[100px]" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex relative w-[55%] min-h-screen flex-col justify-between p-16">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#0F1E14]/90 via-[#0F1E14]/50 to-[#0F1E14]/20" />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <span className="font-['Georgia',serif] text-[#C9963F] text-3xl tracking-[-0.03em]">DHARA</span>
              <div className="w-8 h-[1px] bg-[#C9963F]/40 mt-4 mb-8" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-md">
              <p className="text-[#6A994E] text-[10px] tracking-[0.25em] uppercase font-['Courier_New',monospace] mb-4">Join the Movement</p>
              <h1 className="font-['Georgia',serif] text-[#F5F3E7] text-[clamp(2.5rem,4vw,4.5rem)] font-light leading-[1.05] tracking-[-0.03em]">Become Part<br />of Kerala's<br />Organic Future</h1>
              <p className="text-[#F5F3E7]/50 text-sm font-light leading-relaxed mt-6 max-w-sm">Whether you're a family farmer with generations of wisdom or a household seeking pure nutrition — your place is here.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 1.5 }} className="relative z-10">
            <div className="flex flex-col gap-2 text-[10px] text-[#F5F3E7]/30 font-['Courier_New',monospace] tracking-[0.15em]">
              <span className="text-[#C9963F]/60">Zero middlemen. Direct from farm.</span>
            </div>
          </motion.div>
          <div className="absolute bottom-16 left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-[#C9963F]/10 to-[#6A994E]/20" />
        </motion.div>

        <div className="relative w-full lg:w-[45%] min-h-screen flex items-center justify-center p-6 lg:p-16">
          <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-1.5 no-underline transition-all"
            style={{ color: "rgba(106,153,78,0.5)", fontSize: "0.75rem", fontWeight: 600 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6A994E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(106,153,78,0.5)")}>
            <ChevronLeft size={16} />Back
          </Link>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[480px]">
            <motion.div variants={itemVariants} className="relative rounded-[2.5rem] p-8 lg:p-10 border backdrop-blur-2xl"
              style={{ background: 'rgba(15, 30, 20, 0.35)', borderColor: 'rgba(106, 153, 78, 0.12)', boxShadow: '0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C9963F]/5 rounded-full blur-[70px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#6A994E]/5 rounded-full blur-[60px] pointer-events-none" />

              <div className="lg:hidden flex items-center gap-3 mb-6">
                <span className="font-['Georgia',serif] text-[#C9963F] text-xl tracking-[-0.03em]">DHARA</span>
                <span className="w-6 h-[1px] bg-[#6A994E]/30" />
                <span className="text-[#6A994E] text-[8px] tracking-[0.2em] uppercase font-['Courier_New',monospace]">Register</span>
              </div>

              <motion.div variants={itemVariants} className="mb-6">
                <h2 className="font-['Georgia',serif] text-2xl lg:text-3xl text-[#F5F3E7] font-light tracking-[-0.02em]">Create your account</h2>
                <p className="text-[#F5F3E7]/40 text-xs font-light mt-2 tracking-wide">Join Dhara's organic marketplace</p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <RoleToggle role={role} onChange={setRole} />
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="bg-red-950/40 border border-red-900/50 rounded-2xl px-4 py-3 text-xs text-red-300/90 font-light tracking-wide">{error}</div>
                </motion.div>
              )}

              <motion.form variants={itemVariants} onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingLabelInput label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
                  <FloatingLabelInput label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                </div>
                <FloatingLabelInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" autoComplete="email" />
                <FloatingLabelInput label="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address in Kerala" autoComplete="street-address" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingLabelInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  <FloatingLabelInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                </div>
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-4 rounded-2xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden group mt-2"
                  style={{ background: 'linear-gradient(135deg, #6A994E 0%, #5A8840 100%)', color: '#F5F3E7', boxShadow: '0 8px 32px rgba(106, 153, 78, 0.25)' }}>
                  <span className="relative z-10">{loading ? 'Creating Account…' : 'Create Account'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-[10px] text-[#F5F3E7]/30 tracking-wide">
                  Already registered?{' '}
                  <Link to="/login" className="text-[#C9963F]/80 hover:text-[#C9963F] font-semibold transition-colors relative group">
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

  /* ═══════════════════════════════════════════════════════ */
  /* ─── MOBILE LAYOUT — Premium, modern, App Store quality ─── */
  /* ═══════════════════════════════════════════════════════ */

  const shakeError = submitted && error ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {};

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3E7', overflowX: 'hidden', paddingBottom: '2rem' }}>
      <style>{`
        @keyframes fadeUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{0%{opacity:0;max-height:0}100%{opacity:1;max-height:400px}}
        @keyframes pulse{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
        .su-fade-up{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both}
        .su-input{transition:border-color 0.2s ease,box-shadow 0.2s ease}
        .su-input:focus{outline:none;border-color:#6A994E!important;box-shadow:0 0 0 3px rgba(106,153,78,0.1)!important}
      `}</style>

      {/* ── HEADER ── */}
      <div className="su-fade-up" style={{ animationDelay: '0s', textAlign: 'center', padding: '1.5rem 1rem 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Leaf size={18} color="#6A994E" />
          <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.3rem', fontWeight: 400, color: '#1B4332', margin: 0, letterSpacing: '-0.02em' }}>
            DHARA
          </h1>
        </div>
        <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.3em', color: 'rgba(27,67,50,0.4)', margin: '0.2rem 0 0 0', textTransform: 'uppercase' }}>
          Organic Kerala
        </p>
      </div>

      {/* ── HERO VISUAL ── */}
      <div className="su-fade-up" style={{ animationDelay: '0.05s', padding: '0 1rem', marginBottom: '0.75rem' }}>
        <HeroVisual />
      </div>

      {/* ── WELCOME ── */}
      <div className="su-fade-up" style={{ animationDelay: '0.1s', textAlign: 'center', padding: '0 1rem', marginBottom: '0.75rem' }}>
        <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.4rem', fontWeight: 400, color: '#1B4332', margin: '0 0 0.3rem 0', letterSpacing: '-0.02em' }}>
          Create Your Account
        </h2>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.78rem', fontWeight: 300, color: 'rgba(27,67,50,0.55)', margin: 0, lineHeight: 1.5, maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
          Join Kerala's trusted farm-to-table marketplace.
        </p>
      </div>

      {/* ── FORM CARD ── */}
      <div className="su-fade-up" style={{ animationDelay: '0.15s', padding: '0 1rem' }}>
        <motion.div animate={shakeError} transition={{ duration: 0.4 }} style={{
          background: '#FFFFFF', borderRadius: '24px', padding: '1.5rem',
          boxShadow: '0 4px 24px rgba(27,67,50,0.06), 0 1px 4px rgba(27,67,50,0.04)',
          border: '1px solid rgba(27,67,50,0.04)',
        }}>
          <form onSubmit={handleSignup} noValidate>

            {/* ── Role Selection ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(27,67,50,0.45)', margin: '0 0 0.6rem 0', textTransform: 'uppercase' }}>
                I want to join as
              </p>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <RoleCard
                  value="customer" selected={role === 'customer'}
                  icon={<User size={18} color={role === 'customer' ? '#6A994E' : 'rgba(27,67,50,0.3)'} />}
                  label="Customer" description="Order fresh produce"
                  onClick={() => setRole('customer')}
                />
                <RoleCard
                  value="farmer" selected={role === 'farmer'}
                  icon={<Leaf size={18} color={role === 'farmer' ? '#6A994E' : 'rgba(27,67,50,0.3)'} />}
                  label="Farmer" description="Sell your harvest"
                  onClick={() => setRole('farmer')}
                />
              </div>
            </motion.div>

            {/* ── Error ── */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -6, height: 0 }}
                  style={{ marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.12)', borderRadius: '12px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <X size={14} color="#e74c3c" />
                    <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.72rem', fontWeight: 400, color: '#c0392b' }}>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Full Name ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="rgba(27,67,50,0.25)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" required
                  className="su-input" style={{
                    width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.6rem', borderRadius: '12px', border: '1px solid rgba(27,67,50,0.1)',
                    background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif', fontSize: '0.85rem', fontWeight: 400, color: '#1B4332',
                    boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                  }} />
              </div>
            </motion.div>

            {/* ── Email ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="rgba(27,67,50,0.25)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input value={email} onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }} onBlur={() => setEmailTouched(true)}
                  placeholder="you@example.com" autoComplete="email" type="email" required
                  className="su-input" style={{
                    width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.6rem', borderRadius: '12px',
                    border: `1px solid ${emailTouched && email.length > 0 ? (emailValid ? 'rgba(106,153,78,0.3)' : 'rgba(231,76,60,0.3)') : 'rgba(27,67,50,0.1)'}`,
                    background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif', fontSize: '0.85rem', fontWeight: 400, color: '#1B4332',
                    boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                  }} />
                {emailTouched && email.length > 0 && (
                  <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                    {emailValid ? <Check size={15} color="#6A994E" /> : <X size={15} color="#e74c3c" />}
                  </div>
                )}
              </div>
              {emailTouched && email.length > 0 && !emailValid && (
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.6rem', fontWeight: 400, color: '#e74c3c', margin: '0.25rem 0 0 0' }}>
                  Please enter a valid email address
                </p>
              )}
            </motion.div>

            {/* ── Phone ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative', display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0 0.7rem',
                  borderRadius: '12px', border: '1px solid rgba(27,67,50,0.1)',
                  background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif',
                  fontSize: '0.78rem', fontWeight: 400, color: 'rgba(27,67,50,0.5)', flexShrink: 0,
                }}>
                  <Globe size={13} color="rgba(27,67,50,0.25)" />
                  <span>+91</span>
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Phone size={15} color="rgba(27,67,50,0.25)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="98765 43210" autoComplete="tel" type="tel" required
                    className="su-input" style={{
                      width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.6rem', borderRadius: '12px',
                      border: '1px solid rgba(27,67,50,0.1)', background: 'rgba(27,67,50,0.02)',
                      fontFamily: '-apple-system, sans-serif', fontSize: '0.85rem', fontWeight: 400, color: '#1B4332',
                      boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                    }} />
                </div>
              </div>
            </motion.div>

            {/* ── Password ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" autoComplete="new-password" type={showPassword ? 'text' : 'password'} required
                  className="su-input" style={{
                    width: '100%', padding: '0.85rem 2.6rem 0.85rem 1rem', borderRadius: '12px',
                    border: '1px solid rgba(27,67,50,0.1)', background: 'rgba(27,67,50,0.02)',
                    fontFamily: '-apple-system, sans-serif', fontSize: '0.85rem', fontWeight: 400, color: '#1B4332',
                    boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                  }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(27,67,50,0.25)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrengthBar password={password} />
            </motion.div>

            {/* ── Confirm Password ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: '1rem' }}>
              <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" type={showConfirmPassword ? 'text' : 'password'} required
                  className="su-input" style={{
                    width: '100%', padding: '0.85rem 2.6rem 0.85rem 1rem', borderRadius: '12px',
                    border: `1px solid ${confirmPassword.length > 0 ? (passwordsMatch ? 'rgba(106,153,78,0.3)' : 'rgba(231,76,60,0.3)') : 'rgba(27,67,50,0.1)'}`,
                    background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif', fontSize: '0.85rem', fontWeight: 400, color: '#1B4332',
                    boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                  }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(27,67,50,0.25)' }}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.6rem', fontWeight: 400, color: '#e74c3c', margin: '0.25rem 0 0 0' }}>
                  Passwords do not match
                </p>
              )}
              {confirmPassword.length > 0 && passwordsMatch && password.length > 0 && (
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.6rem', fontWeight: 400, color: '#6A994E', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Check size={12} /> Passwords match
                </p>
              )}
            </motion.div>

            {/* ── Farmer Additional Fields ── */}
            <AnimatePresence>
              {role === 'farmer' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden', marginBottom: '0.25rem' }}>
                  <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(27,67,50,0.06)' }}>
                    <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(106,153,78,0.5)', textTransform: 'uppercase', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={11} color="#6A994E" /> Farmer Details
                    </p>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Farm Name</label>
                      <input value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="e.g. Green Valley Farm" autoComplete="organization"
                        className="su-input" style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(27,67,50,0.1)',
                          background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif', fontSize: '0.82rem', fontWeight: 400, color: '#1B4332',
                          boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                        }} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Farm Location</label>
                      <input value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="District / Village in Kerala" autoComplete="address-level2"
                        className="su-input" style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(27,67,50,0.1)',
                          background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif', fontSize: '0.82rem', fontWeight: 400, color: '#1B4332',
                          boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none',
                        }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Farm Description</label>
                      <textarea value={farmDescription} onChange={(e) => setFarmDescription(e.target.value)} placeholder="Tell us about your farm, what you grow, and your farming practices..." rows={3}
                        className="su-input" style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(27,67,50,0.1)',
                          background: 'rgba(27,67,50,0.02)', fontFamily: '-apple-system, sans-serif', fontSize: '0.82rem', fontWeight: 400, color: '#1B4332', resize: 'vertical',
                          boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none', minHeight: '72px', lineHeight: 1.5,
                        }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Terms ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <div onClick={() => setAgreeTerms(!agreeTerms)} style={{
                  width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: agreeTerms ? '#6A994E' : 'rgba(27,67,50,0.04)',
                  border: agreeTerms ? '2px solid #6A994E' : '2px solid rgba(27,67,50,0.1)',
                  transition: 'all 0.2s ease',
                }}>
                  {agreeTerms && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.72rem', fontWeight: 400, color: 'rgba(27,67,50,0.5)', lineHeight: 1.4 }}>
                  I agree to the{' '}
                  <span style={{ color: '#6A994E', fontWeight: 500, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); }}>Terms & Conditions</span>{' '}
                  and{' '}
                  <span style={{ color: '#6A994E', fontWeight: 500, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); }}>Privacy Policy</span>
                </span>
              </label>
              {submitted && !agreeTerms && (
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.6rem', fontWeight: 400, color: '#e74c3c', margin: '0.3rem 0 0 0' }}>
                  Please agree to the terms
                </p>
              )}
            </motion.div>

            {/* ── Signup Button ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? 'rgba(27,67,50,0.5)' : '#1B4332',
                  color: '#FFFFFF', fontFamily: '"Courier New", monospace', fontSize: '0.72rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', opacity: formValid ? 1 : 0.6,
                  transition: 'all 0.25s ease', boxShadow: '0 4px 16px rgba(27,67,50,0.2)',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#D4A017'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,160,23,0.3)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#1B4332'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,67,50,0.2)'; } }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', animation: 'spin 0.6s linear infinite' }} />
                    Creating Account…
                  </span>
                ) : 'Create Account'}
              </motion.button>
            </motion.div>

          </form>
        </motion.div>
      </div>

      {/* ── Login Redirect ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ textAlign: 'center', marginTop: '1.25rem', padding: '0 1rem' }}>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.78rem', fontWeight: 400, color: 'rgba(27,67,50,0.4)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1B4332', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(27,67,50,0.15)', paddingBottom: '1px' }}>
            Sign In
          </Link>
        </p>
      </motion.div>

      {/* ── Spin keyframe ── */}
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(min-width:768px){
          body > [data-signup-mobile]{display:none!important}
        }
      `}</style>

    </div>
  );
}
