import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, LogOut, Leaf, Menu, X, Globe, Bell, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { setLanguage, getLanguage, t } from '../data/i18n';

const LANGUAGES = [
  { code: 'ml', label: 'മലയാളം' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

const navItems = [
  { icon: Home, labelKey: 'home', path: '/farmer' },
  { icon: ShoppingBag, labelKey: 'orders', path: '/farmer/orders' },
  { icon: Bell, labelKey: 'notifications', path: '/farmer/notifications' },
  { icon: MessageCircle, labelKey: 'contact', path: '/farmer/profile' },
];

export default function FarmerNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getLanguage());

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/login');
  };

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setCurrentLang(code);
  };

  const lang = currentLang;

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(1,50,32,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/farmer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#EBF5EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Leaf size={18} color="#2D6A4F" />
            </div>
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.25rem', fontWeight: 700, color: '#013220',
              }}
            >
              DHARA
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '0.5rem 1rem', borderRadius: '10px',
                    textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
                    color: isActive ? '#2D6A4F' : '#666',
                    background: isActive ? 'rgba(45,106,79,0.08)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(45,106,79,0.05)'; e.currentTarget.style.color = '#2D6A4F'; }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }
                  }}
                >
                  <Icon size={16} />
                  <span>{t(`dashboard.${item.labelKey}`, lang)}</span>
                </Link>
              );
            })}

            {/* Language selector inline */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '2px',
                margin: '0 4px', padding: '4px 6px',
                borderRadius: '12px', background: 'rgba(1,50,32,0.04)',
              }}
            >
              <Globe size={14} color="#666" style={{ marginRight: '2px' }} />
              {LANGUAGES.map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => handleLanguageChange(langItem.code)}
                  style={{
                    padding: '0.4rem 0.6rem', borderRadius: '8px',
                    border: 'none', cursor: 'pointer',
                    fontSize: '0.7rem', lineHeight: 1.2,
                    fontWeight: currentLang === langItem.code ? 700 : 500,
                    color: currentLang === langItem.code ? '#fff' : '#666',
                    background: currentLang === langItem.code ? '#2D6A4F' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={`Switch to ${langItem.label}`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.5rem 1rem', borderRadius: '10px',
                border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600,
                color: '#999', background: 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#999'; }}
            >
              <LogOut size={16} />
              <span>{t('dashboard.logout', lang)}</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '1px',
                padding: '2px 4px', borderRadius: '10px',
                background: 'rgba(1,50,32,0.04)',
              }}
            >
              <Globe size={14} color="#666" />
              {LANGUAGES.map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => handleLanguageChange(langItem.code)}
                  style={{
                    padding: '0.3rem 0.4rem', borderRadius: '6px',
                    border: 'none', cursor: 'pointer',
                    fontSize: '0.6rem', lineHeight: 1.2,
                    fontWeight: currentLang === langItem.code ? 700 : 500,
                    color: currentLang === langItem.code ? '#fff' : '#666',
                    background: currentLang === langItem.code ? '#2D6A4F' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={`Switch to ${langItem.label}`}
                >
                  {langItem.code === 'ml' ? 'മല' : langItem.code === 'hi' ? 'हि' : 'En'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.5rem', color: '#013220',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '280px', maxWidth: '80vw', zIndex: 100,
              background: 'rgba(4,47,26,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex', flexDirection: 'column',
              padding: '2rem 1.5rem',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', color: '#fff',
                  padding: '0.5rem', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '2rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '1rem', borderRadius: '12px',
                      textDecoration: 'none', fontSize: '1rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#22c55e' : 'rgba(255,255,255,0.75)',
                      background: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={20} />
                    <span>{t(`dashboard.${item.labelKey}`, lang)}</span>
                  </Link>
                );
              })}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem',
                fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', margin: '0 0 0.75rem 0.5rem',
              }}>
                {t('language', lang)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => { handleLanguageChange(langItem.code); setMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0.9rem 1rem', borderRadius: '12px',
                      border: 'none', cursor: 'pointer', width: '100%',
                      fontSize: '1rem',
                      fontWeight: currentLang === langItem.code ? 700 : 500,
                      color: currentLang === langItem.code ? '#22c55e' : 'rgba(255,255,255,0.75)',
                      background: currentLang === langItem.code ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {langItem.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '1rem', borderRadius: '12px', width: '100%',
                  border: '1px solid rgba(239,68,68,0.2)',
                  cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
                  color: '#ef4444', background: 'rgba(239,68,68,0.06)',
                  transition: 'all 0.2s ease',
                }}
              >
                <LogOut size={18} />
                <span>{t('dashboard.logout', lang)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
