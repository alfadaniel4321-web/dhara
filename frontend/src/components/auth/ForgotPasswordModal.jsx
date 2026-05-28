import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import OTPVerificationModal from './OTPVerificationModal';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending OTP
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  if (showOTP) {
    return <OTPVerificationModal email={email} onClose={onClose} onBack={() => setShowOTP(false)} />;
  }

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: 'rgba(15, 30, 20, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        variants={cardVariants}
        className="relative w-full max-w-[420px] rounded-[2.5rem] p-10 border backdrop-blur-2xl"
        style={{
          background: 'rgba(15, 30, 20, 0.5)',
          borderColor: 'rgba(106, 153, 78, 0.12)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-[#F5F3E7]/5"
          style={{ borderColor: 'rgba(106, 153, 78, 0.15)' }}
        >
          <X className="w-3.5 h-3.5 text-[#F5F3E7]/40" />
        </button>

        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#C9963F]/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="font-['Georgia',serif] text-2xl text-[#F5F3E7] font-light tracking-[-0.02em]">
            Reset password
          </h2>
          <p className="text-[#F5F3E7]/40 text-xs font-light mt-2 tracking-wide">
            Enter your email and we'll send a verification code
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(106, 153, 78, 0.1)', border: '1px solid rgba(106, 153, 78, 0.2)' }}
            >
              <svg className="w-6 h-6 text-[#6A994E]" viewBox="0 0 24 24" fill="none">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12.5L11 15.5L16 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-[#F5F3E7]/70 font-light mb-2">Code sent to:</p>
            <p className="text-sm text-[#F5F3E7] font-mono mb-6">{email}</p>
            <button
              type="button"
              onClick={() => setShowOTP(true)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #6A994E 0%, #5A8840 100%)',
                color: '#F5F3E7',
                boxShadow: '0 8px 32px rgba(106, 153, 78, 0.25)',
              }}
            >
              Enter Verification Code
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 text-[10px] text-[#C9963F]/60 hover:text-[#C9963F] transition-colors tracking-wide"
            >
              Resend code
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold mb-1.5 text-[#6A994E]/70">
                Email Address
              </label>
              <div className="relative rounded-2xl border border-[#6A994E]/20 hover:border-[#6A994E]/40 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-transparent px-5 py-3.5 text-sm text-[#F5F3E7] placeholder:text-[#F5F3E7]/20 focus:outline-none font-light tracking-wide"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 rounded-2xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #6A994E 0%, #5A8840 100%)',
                color: '#F5F3E7',
                boxShadow: '0 8px 32px rgba(106, 153, 78, 0.25)',
              }}
            >
              <span className="relative z-10">{loading ? 'Sending…' : 'Send Code'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          </form>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full text-center text-[10px] text-[#F5F3E7]/30 hover:text-[#F5F3E7]/60 transition-colors tracking-wide"
        >
          Back to Sign In
        </button>
      </motion.div>
    </motion.div>
  );
}
