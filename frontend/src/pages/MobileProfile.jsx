import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, updateUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import {
  ShoppingBag, Heart, MapPin, Star, Gift, Package,
  CreditCard, Bell, Globe, HelpCircle, Info, Shield,
  FileText, LogOut, ChevronRight, User, Moon, Sun,
  Navigation, Search, Menu, Edit2, Leaf, Check, X,
} from 'lucide-react';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: Package, label: 'My Orders', route: '/my-orders' },
      { icon: Heart, label: 'Wishlist', route: '/wishlist' },
      { icon: MapPin, label: 'Saved Addresses', route: '/profile' },
      { icon: CreditCard, label: 'Payment Methods', route: '/profile' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', route: '/profile' },
      { icon: Globe, label: 'Language', route: '/profile' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', route: '/contact' },
      { icon: Info, label: 'About DHARA', route: '/about' },
      { icon: Shield, label: 'Privacy Policy', route: '/about' },
      { icon: FileText, label: 'Terms & Conditions', route: '/about' },
    ],
  },
];

const LANGUAGES = ['English', 'Malayalam', 'Hindi'];

function HomeIcon({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default function MobileProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [locationOn, setLocationOn] = useState(true);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.count, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, wishlistData] = await Promise.all([
          api.orders.getOrders().catch(() => []),
          api.wishlist.getWishlist().catch(() => []),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setWishlistCount(Array.isArray(wishlistData) ? wishlistData.length : 0);
      } catch {}
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/login');
  };

  const handleEditSave = () => {
    dispatch(updateUser({ name: editName, email: editEmail, phone: editPhone }));
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setIsEditing(false);
  };

  const orderCount = orders.length;

  return (
    <div style={{
      background: '#F5F3E7',
      minHeight: '100vh',
      paddingBottom: '88px',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .scale-in { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .p-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(245,243,231,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .profile-card {
          background: #FFFFFF; border-radius: 24px; overflow: hidden;
          box-shadow: 0 2px 20px rgba(27,67,50,0.06);
        }
        .stat-card {
          background: #FFFFFF; border-radius: 20px; padding: 1rem;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
        }
        .menu-item {
          display: flex; align-items: center; gap: 0.85rem;
          padding: 0.9rem 0; cursor: pointer;
          transition: opacity 0.2s ease;
          background: none; border: none; width: 100%; text-align: left;
          font-family: '"DM Sans", sans-serif'; font-size: 0.82rem;
          color: #1B4332; text-decoration: none;
        }
        .menu-item:active { opacity: 0.6; }
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(27,67,50,0.06);
          padding: 0.5rem 0;
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          background: none; border: none; cursor: pointer; padding: 0.25rem 0;
          transition: transform 0.2s ease; text-decoration: none; min-width: 56px;
        }
        .nav-item:active { transform: scale(0.9); }
        .center-btn {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #1B4332, #2D6A4F);
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center; margin-top: -20px;
          box-shadow: 0 4px 20px rgba(27,67,50,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .center-btn:active { transform: scale(0.92); }
        .toggle-track {
          width: 44px; height: 24px; border-radius: 12px;
          cursor: pointer; position: relative;
          transition: background 0.3s ease; flex-shrink: 0;
        }
        .toggle-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #FFFFFF; position: absolute; top: 2px;
          transition: transform 0.3s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .lang-option {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.75rem 0; cursor: pointer;
          background: none; border: none; width: 100%; text-align: left;
          font-family: '"DM Sans", sans-serif'; font-size: 0.82rem;
          color: #1B4332;
        }
        .lang-option:active { opacity: 0.6; }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="p-header">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.25rem', maxWidth: '480px', margin: '0 auto',
        }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={16} color="#A3C87A" strokeWidth={2} />
            </div>
            <div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.2rem', fontWeight: 700, color: '#1B4332',
                letterSpacing: '-0.02em', lineHeight: 1,
              }}>DHARA</span>
              <span style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.4rem',
                letterSpacing: '0.3em', color: '#6A994E',
                display: 'block', textTransform: 'uppercase',
              }}>Organic Kerala</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/wishlist" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none', position: 'relative',
            }}>
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none', position: 'relative',
            }}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalCartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#D4A017', color: '#FFFFFF',
                  fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"DM Sans", sans-serif',
                }}>{totalCartCount}</span>
              )}
            </Link>
            <Link to="/profile" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none',
            }}>
              <Menu size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

        {/* ═══ PROFILE HEADER CARD ═══ */}
        <section style={{ marginTop: '0.75rem', animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{
            background: 'linear-gradient(135deg, #080E0A 0%, #1B4332 50%, #0F1E14 100%)',
            borderRadius: '24px', padding: '1.75rem 1.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative elements */}
            <div style={{
              position: 'absolute', right: '-2rem', top: '-2rem',
              width: '10rem', height: '10rem', borderRadius: '50%',
              border: '1px solid rgba(163,200,122,0.08)',
            }} />
            <div style={{
              position: 'absolute', left: '-1.5rem', bottom: '-1.5rem',
              width: '8rem', height: '8rem', borderRadius: '50%',
              border: '1px solid rgba(163,200,122,0.05)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(163,200,122,0.15), rgba(27,67,50,0.3))',
                    border: '2px solid rgba(163,200,122,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <span style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '1.4rem', fontWeight: 700, color: '#A3C87A',
                    }}>
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                    </span>
                    {/* Verified leaf badge */}
                    <div style={{
                      position: 'absolute', bottom: '-2px', right: '-2px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#1B4332', border: '2px solid #0F1E14',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Leaf size={10} color="#A3C87A" strokeWidth={2} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="Name"
                          style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
                            fontWeight: 600, color: '#F5F3E7',
                            background: 'rgba(245,243,231,0.08)',
                            border: '1px solid rgba(163,200,122,0.2)',
                            borderRadius: '10px', padding: '0.4rem 0.65rem',
                            outline: 'none', width: '100%', boxSizing: 'border-box',
                          }}
                        />
                        <input
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          placeholder="Phone"
                          style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                            color: 'rgba(245,243,231,0.7)',
                            background: 'rgba(245,243,231,0.08)',
                            border: '1px solid rgba(163,200,122,0.2)',
                            borderRadius: '10px', padding: '0.35rem 0.65rem',
                            outline: 'none', width: '100%', boxSizing: 'border-box',
                          }}
                        />
                        <input
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          placeholder="Email"
                          style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                            color: 'rgba(245,243,231,0.5)',
                            background: 'rgba(245,243,231,0.08)',
                            border: '1px solid rgba(163,200,122,0.2)',
                            borderRadius: '10px', padding: '0.3rem 0.65rem',
                            outline: 'none', width: '100%', boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h1 style={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          fontSize: '1.25rem', fontWeight: 700, color: '#F5F3E7',
                          margin: 0, lineHeight: 1.2,
                        }}>{user?.name || 'User'}</h1>
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                          color: 'rgba(245,243,231,0.5)', margin: '0.15rem 0 0 0',
                        }}>{user?.phone || ''}</p>
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                          color: 'rgba(245,243,231,0.35)', margin: '0.1rem 0 0 0',
                        }}>{user?.email || ''}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit / Cancel buttons */}
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={handleEditCancel} style={{
                      width: '36px', height: '36px', borderRadius: '12px',
                      background: 'rgba(220,38,38,0.1)',
                      border: '1px solid rgba(220,38,38,0.15)',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#DC2626', flexShrink: 0,
                    }}>
                      <X size={16} strokeWidth={1.5} />
                    </button>
                    <button onClick={handleEditSave} style={{
                      width: '36px', height: '36px', borderRadius: '12px',
                      background: 'rgba(163,200,122,0.15)',
                      border: '1px solid rgba(163,200,122,0.2)',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#A3C87A', flexShrink: 0,
                    }}>
                      <Check size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setEditName(user?.name || ''); setEditEmail(user?.email || ''); setEditPhone(user?.phone || ''); setIsEditing(true); }} style={{
                    width: '36px', height: '36px', borderRadius: '12px',
                    background: 'rgba(163,200,122,0.1)',
                    border: '1px solid rgba(163,200,122,0.15)',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#A3C87A', flexShrink: 0,
                  }}>
                    <Edit2 size={16} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ QUICK STATS (2×2) ═══ */}
        <section style={{ marginTop: '0.85rem' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem',
          }}>
            {[
              { icon: ShoppingBag, count: orderCount, label: 'Orders', route: '/my-orders', bg: 'rgba(27,67,50,0.06)', color: '#1B4332' },
              { icon: Heart, count: wishlistCount, label: 'Wishlist', route: '/wishlist', bg: 'rgba(212,160,23,0.1)', color: '#D4A017' },
              { icon: MapPin, count: user?.address ? 1 : 0, label: 'Saved Addresses', route: '/profile', bg: 'rgba(106,153,78,0.1)', color: '#6A994E' },
              { icon: Gift, count: '250', label: 'Reward Points', route: '/profile', bg: 'rgba(212,160,23,0.08)', color: '#D4A017' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Link key={i} to={s.route} className="stat-card fade-up" style={{ animationDelay: `${0.05 * i}s`, padding: '1.15rem 0.75rem', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '14px',
                    background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={s.color} strokeWidth={2} />
                  </div>
                  <span style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '1.3rem', fontWeight: 700, color: '#1B4332', lineHeight: 1,
                  }}>{s.count}</span>
                  <span style={{
                    fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
                    letterSpacing: '0.08em', color: 'rgba(27,67,50,0.4)',
                    textTransform: 'uppercase', textAlign: 'center',
                  }}>{s.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ═══ ACCOUNT MENU ═══ */}
        <section style={{ marginTop: '1.25rem' }}>
          {MENU_SECTIONS.map((section, si) => (
            <div key={section.title} style={{ marginBottom: si < MENU_SECTIONS.length - 1 ? '1.25rem' : 0 }}>
              <p style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
                letterSpacing: '0.15em', color: 'rgba(27,67,50,0.3)',
                textTransform: 'uppercase', marginBottom: '0.35rem',
                paddingLeft: '0.15rem',
              }}>{section.title}</p>
              <div className="profile-card" style={{ padding: '0.25rem 1rem' }}>
                {section.items.map((item, ii) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.route}
                      className="menu-item"
                      style={{
                        borderBottom: ii < section.items.length - 1 ? '1px solid rgba(27,67,50,0.04)' : 'none',
                      }}
                    >
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        background: 'rgba(27,67,50,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={16} color="rgba(27,67,50,0.5)" strokeWidth={1.5} />
                      </div>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <ChevronRight size={16} color="rgba(27,67,50,0.15)" strokeWidth={1.5} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* ═══ SETTINGS ═══ */}
        <section style={{ marginTop: '1.25rem' }}>
          <p style={{
            fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
            letterSpacing: '0.15em', color: 'rgba(27,67,50,0.3)',
            textTransform: 'uppercase', marginBottom: '0.35rem',
            paddingLeft: '0.15rem',
          }}>Settings</p>
          <div className="profile-card" style={{ padding: '0.25rem 1rem' }}>
            {/* Dark Mode */}
            <div className="menu-item" style={{ borderBottom: '1px solid rgba(27,67,50,0.04)', cursor: 'default' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'rgba(27,67,50,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {darkMode ? <Moon size={16} color="rgba(27,67,50,0.5)" strokeWidth={1.5} /> : <Sun size={16} color="rgba(27,67,50,0.5)" strokeWidth={1.5} />}
              </div>
              <span style={{ flex: 1 }}>Dark Mode</span>
              <div
                className="toggle-track"
                style={{ background: darkMode ? '#1B4332' : 'rgba(27,67,50,0.12)' }}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div className="toggle-thumb" style={{ transform: darkMode ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </div>

            {/* App Notifications */}
            <div className="menu-item" style={{ borderBottom: '1px solid rgba(27,67,50,0.04)', cursor: 'default' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'rgba(27,67,50,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Bell size={16} color="rgba(27,67,50,0.5)" strokeWidth={1.5} />
              </div>
              <span style={{ flex: 1 }}>App Notifications</span>
              <div
                className="toggle-track"
                style={{ background: notificationsOn ? '#1B4332' : 'rgba(27,67,50,0.12)' }}
                onClick={() => setNotificationsOn(!notificationsOn)}
              >
                <div className="toggle-thumb" style={{ transform: notificationsOn ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </div>

            {/* Location Access */}
            <div className="menu-item" style={{ cursor: 'default' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'rgba(27,67,50,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Navigation size={16} color="rgba(27,67,50,0.5)" strokeWidth={1.5} />
              </div>
              <span style={{ flex: 1 }}>Location Access</span>
              <div
                className="toggle-track"
                style={{ background: locationOn ? '#1B4332' : 'rgba(27,67,50,0.12)' }}
                onClick={() => setLocationOn(!locationOn)}
              >
                <div className="toggle-thumb" style={{ transform: locationOn ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ LANGUAGE ═══ */}
        <section style={{ marginTop: '1.25rem' }}>
          <p style={{
            fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
            letterSpacing: '0.15em', color: 'rgba(27,67,50,0.3)',
            textTransform: 'uppercase', marginBottom: '0.35rem',
            paddingLeft: '0.15rem',
          }}>Language</p>
          <div className="profile-card" style={{ padding: '0.25rem 1rem' }}>
            {LANGUAGES.map((lang, i) => (
              <button
                key={lang}
                className="lang-option"
                style={{
                  borderBottom: i < LANGUAGES.length - 1 ? '1px solid rgba(27,67,50,0.04)' : 'none',
                }}
                onClick={() => setSelectedLang(lang)}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: selectedLang === lang ? '5px solid #1B4332' : '2px solid rgba(27,67,50,0.15)',
                  transition: 'all 0.2s ease', flexShrink: 0,
                }} />
                <span>{lang}</span>
                {lang === 'English' && (
                  <span style={{
                    fontFamily: '"Courier New", monospace', fontSize: '0.45rem',
                    color: 'rgba(27,67,50,0.25)', textTransform: 'uppercase',
                    marginLeft: '0.25rem',
                  }}>(Default)</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ═══ LOGOUT ═══ */}
        <section style={{ marginTop: '1.25rem', marginBottom: '1rem' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '0.9rem', borderRadius: '16px',
              border: '1.5px solid rgba(220,38,38,0.2)',
              background: 'rgba(220,38,38,0.04)',
              color: '#DC2626', cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem',
              fontWeight: 600, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={18} strokeWidth={1.5} />
            Sign Out
          </button>
        </section>

      </div>

      {/* ─── BOTTOM NAV ─── */}
      <nav className="bottom-nav">
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
          maxWidth: '480px', margin: '0 auto', padding: '0 0.5rem',
        }}>
          <Link to="/dashboard" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <HomeIcon size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Home</span>
          </Link>
          <Link to="/products" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <Search size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Shop</span>
          </Link>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '60px' }}>
            <Link to="/cart" className="center-btn" style={{ textDecoration: 'none' }}>
              <ShoppingBag size={22} color="#FFFFFF" strokeWidth={2} />
            </Link>
          </div>
          <Link to="/my-orders" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <Package size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Orders</span>
          </Link>
          <Link to="/profile" className="nav-item" style={{ color: '#1B4332' }}>
            <User size={20} strokeWidth={2} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1B4332',
            }}>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
