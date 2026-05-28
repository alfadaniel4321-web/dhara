import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';

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

export default function OTPVerificationModal({ email, onClose, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setVerified(true);
    setTimeout(() => onClose(), 2000);
  };

  if (verified) {
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(106, 153, 78, 0.15)', border: '1px solid rgba(106, 153, 78, 0.3)' }}
          >
            <svg className="w-8 h-8 text-[#6A994E]" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-['Georgia',serif] text-2xl text-[#F5F3E7] font-light tracking-[-0.02em] mb-2">
            Password Reset
          </h2>
          <p className="text-sm text-[#F5F3E7]/60 font-light">
            Your password has been successfully reset.
          </p>
        </motion.div>
      </motion.div>
    );
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
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-[#F5F3E7]/5"
          style={{ borderColor: 'rgba(106, 153, 78, 0.15)' }}
        >
          <X className="w-3.5 h-3.5 text-[#F5F3E7]/40" />
        </button>

        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#C9963F]/5 rounded-full blur-[60px] pointer-events-none" />

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[10px] text-[#F5F3E7]/40 hover:text-[#F5F3E7]/70 transition-colors mb-6 tracking-wide"
        >
          <ChevronLeft className="w-3 h-3" />
          Back
        </button>

        <div className="text-center mb-8">
          <h2 className="font-['Georgia',serif] text-2xl text-[#F5F3E7] font-light tracking-[-0.02em]">
            Verification code
          </h2>
          <p className="text-[#F5F3E7]/40 text-xs font-light mt-2 tracking-wide">
            Enter the 6-digit code sent to
          </p>
          <p className="text-[#F5F3E7]/70 text-sm font-mono mt-1">{email}</p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="flex gap-2.5 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-lg font-mono rounded-2xl border transition-all duration-300 bg-transparent text-[#F5F3E7] focus:outline-none"
                style={{
                  borderColor: digit ? 'rgba(201, 150, 63, 0.5)' : 'rgba(106, 153, 78, 0.15)',
                  boxShadow: digit ? '0 0 16px rgba(201, 150, 63, 0.06)' : 'none',
                }}
              />
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={loading || otp.some((d) => !d)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 rounded-2xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden group disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #6A994E 0%, #5A8840 100%)',
              color: '#F5F3E7',
              boxShadow: '0 8px 32px rgba(106, 153, 78, 0.25)',
            }}
          >
            <span className="relative z-10">{loading ? 'Verifying…' : 'Verify Code'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </form>

        <p className="mt-5 text-center text-[10px] text-[#F5F3E7]/30 tracking-wide">
          Didn't receive it?{' '}
          <button type="button" className="text-[#C9963F]/60 hover:text-[#C9963F] transition-colors">
            Resend code
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
