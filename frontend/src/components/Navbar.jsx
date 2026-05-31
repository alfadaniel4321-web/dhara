import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Heart, ShoppingBag, User, LogOut, Leaf } from 'lucide-react';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const menuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

function AnimatedHamburger({ open, dark }) {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <motion.span
        className="absolute block h-[1.5px]"
        style={{ width: '20px', background: dark ? '#1B4332' : '#FFFFFF' }}
        animate={{
          rotate: open ? 45 : 0,
          translateY: open ? 0 : -5,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="absolute block h-[1.5px]"
        style={{ width: '20px', background: dark ? '#1B4332' : '#FFFFFF' }}
        animate={{
          opacity: open ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute block h-[1.5px]"
        style={{ width: '20px', background: dark ? '#1B4332' : '#FFFFFF' }}
        animate={{
          rotate: open ? -45 : 0,
          translateY: open ? 0 : 5,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function NavLink({ link, scrolled, onClick }) {
  const location = useLocation();
  const isActive = link.to === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(link.to);

  const fadedColor = 'rgba(27,67,50,0.65)';

  return (
    <Link
      to={link.to}
      onClick={onClick}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.8rem',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: isActive ? '#C9963F' : fadedColor,
        padding: '0.35rem 0',
        transition: 'color 0.4s ease',
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#C9963F'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = fadedColor; }}
    >
      {link.label}
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const menuRef = useRef(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.count, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navHeight = scrolled ? 78 : 96;
  const textColor = '#1B4332';
  const mutedTextColor = 'rgba(27,67,50,0.65)';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
      `}</style>

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] origin-left"
        style={{
          height: '1px',
          background: '#C9963F',
          scaleX: scrollYProgress,
          opacity: 0.6,
        }}
      />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60]"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Main navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          height: `${navHeight}px`,
          background: '#FFFFFF',
          borderBottom: scrolled
            ? '1px solid rgba(27,67,50,0.08)'
            : '1px solid rgba(0,0,0,0)',
          boxShadow: scrolled
            ? '0 2px 20px rgba(0,0,0,0.07)'
            : 'none',
        }}
        style={{
          transition: 'background-color 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-10"
          style={{ maxWidth: '1440px' }}
        >
          {/* ─── LEFT: Logo ─── */}
          <Link
            to={user ? (user.role === 'farmer' ? '/farmer' : '/dashboard') : '/'}
            onClick={closeMenu}
            className="flex-shrink-0 flex items-center gap-3 no-underline"
          >
            <div
              className="relative flex items-center gap-2"
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex flex-col items-center">
                <Leaf
                  size={14}
                  color="#C9963F"
                  style={{ strokeWidth: 1.5 }}
                />
                <motion.div
                  className="h-[1px] mt-1"
                  style={{ width: '18px', background: '#C9963F' }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div>
                <h1
                  className="m-0 leading-none tracking-tight"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: textColor,
                  }}
                >
                  DHARA
                </h1>
                <p
                  className="m-0 leading-none mt-[2px]"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '0.55rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: '#C9963F',
                  }}
                >
                  Organic Kerala
                </p>
              </div>
            </div>
          </Link>

          {/* ─── CENTER: Desktop Nav Links ─── */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} link={link} scrolled={scrolled} onClick={closeMenu} />
            ))}
          </div>

          {/* ─── RIGHT: Desktop Actions ─── */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="flex items-center justify-center"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                transition: 'background-color 0.3s ease',
                color: mutedTextColor,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(106,153,78,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              aria-label="Wishlist"
            >
              <Heart size={19} style={{ strokeWidth: 1.5 }} />
            </Link>


            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative flex items-center justify-center"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                color: textColor,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(106,153,78,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              aria-label="Cart"
            >
              <ShoppingBag size={19} style={{ strokeWidth: 1.5 }} />
              {totalCartCount > 0 && (
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    top: '2px',
                    right: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#C9963F',
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '9px',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Link
              to={user ? (user.role === 'farmer' ? '/farmer' : '/dashboard') : '/login'}
              onClick={closeMenu}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: '#FAF8F2',
                padding: '0.7rem 1.8rem',
                borderRadius: '4px',
                background: '#1B4332',
                transition: 'background-color 0.4s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2D6A4F'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1B4332'; }}
            >
              Shop Now
            </Link>

            {/* User controls */}
            {user && (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to={user.role === 'farmer' ? '/farmer' : '/profile'}
                  onClick={closeMenu}
                  className="flex items-center justify-center"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    transition: 'background-color 0.3s ease',
                    color: textColor,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(106,153,78,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  aria-label="Profile"
                >
                  <User size={19} style={{ strokeWidth: 1.5 }} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    transition: 'background-color 0.3s ease',
                    color: '#1B4332',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(106,153,78,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  aria-label="Log out"
                >
                  <LogOut size={19} style={{ strokeWidth: 1.5 }} />
                </button>
              </div>
            )}

            {!user && (
              <Link
                to="/login"
                onClick={closeMenu}
                className="no-underline transition-colors duration-300"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: mutedTextColor,
                  padding: '0.35rem 0.75rem',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#C9963F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = mutedTextColor; }}
              >
                Log In
              </Link>
            )}
          </div>

          {/* ─── MOBILE: Actions ─── */}
          <div className="flex lg:hidden items-center gap-2">
            {user ? (
              <>
                <Link to="/wishlist" onClick={closeMenu} className="flex items-center justify-center" style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(27,67,50,0.04)', color: textColor, textDecoration: 'none' }} aria-label="Wishlist">
                  <Heart size={18} strokeWidth={1.5} />
                </Link>
                <Link to="/cart" onClick={closeMenu} className="relative flex items-center justify-center" style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(27,67,50,0.04)', color: textColor, textDecoration: 'none' }} aria-label="Cart">
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  {totalCartCount > 0 && (
                    <span className="absolute flex items-center justify-center" style={{ top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#C9963F', color: '#FFFFFF', fontSize: '9px', fontWeight: 700, lineHeight: 1, fontFamily: '"DM Sans", sans-serif' }}>{totalCartCount}</span>
                  )}
                </Link>
                <Link to={user.role === 'farmer' ? '/farmer' : '/profile'} onClick={closeMenu} className="flex items-center justify-center" style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(27,67,50,0.04)', color: textColor, textDecoration: 'none' }} aria-label="Profile">
                  <Menu size={18} strokeWidth={1.5} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/cart" onClick={closeMenu} className="relative flex items-center justify-center" style={{ width: '38px', height: '38px', borderRadius: '50%', color: textColor }} aria-label="Cart">
                  <ShoppingBag size={19} style={{ strokeWidth: 1.5 }} />
                </Link>
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center justify-center" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: textColor }} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
                  <AnimatedHamburger open={menuOpen} dark={true} />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ─── MOBILE FULLSCREEN OVERLAY ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            key="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 flex flex-col justify-center"
            style={{
              background: '#0D1F17',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <div className="flex flex-col items-center justify-center gap-8 px-8">
              {NAV_LINKS.map((link, i) => {
                const isActive = link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
                return (
                  <motion.div
                    key={link.label}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%' }}
                  >
                    <Link
                      to={link.to}
                      onClick={closeMenu}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isActive ? '#C9963F' : '#FFFFFF',
                        paddingLeft: '1rem',
                        borderLeft: '1px solid #C9963F',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#C9963F'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#FFFFFF'; }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                custom={NAV_LINKS.length}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 w-full max-w-xs"
              >
                <Link
                  to={user ? (user.role === 'farmer' ? '/farmer' : '/dashboard') : '/login'}
                  onClick={closeMenu}
                  className="block w-full text-center no-underline"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#FAF8F2',
                    padding: '0.9rem 2rem',
                    borderRadius: '4px',
                    background: '#1B4332',
                    transition: 'background-color 0.4s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#2D6A4F'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#1B4332'; }}
                >
                  Shop Now
                </Link>
              </motion.div>

              {/* Mobile auth */}
              <motion.div
                custom={NAV_LINKS.length + 1}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 mt-4"
              >
                {user ? (
                  <>
                    <Link
                      to={user.role === 'farmer' ? '/farmer' : '/profile'}
                      onClick={closeMenu}
                      className="no-underline flex items-center gap-2 transition-colors duration-300"
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#C9963F'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                      <User size={14} /> {user.name.split(' ')[0]}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="transition-colors duration-300"
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#ef4444',
                        background: 'none',
                        border: '1px solid rgba(220,38,38,0.15)',
                        cursor: 'pointer',
                        padding: '0.4rem 0.8rem',
                      }}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="no-underline transition-colors duration-300"
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.6)',
                        padding: '0.5rem 1rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#C9963F'; e.currentTarget.style.borderColor = '#C9963F'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="no-underline transition-colors duration-300"
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#FAF8F2',
                        background: '#1B4332',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2D6A4F'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#1B4332'; }}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
