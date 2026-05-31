import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Leaf, Home, ShoppingBag, Package, User } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/products', label: 'Shop', icon: ShoppingBag },
  { to: '/my-orders', label: 'Orders', icon: Package },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <style>{`
        @media(max-width:768px){
          body{padding-bottom:64px}
        }
      `}</style>
      <nav
        className="bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: '#FFFFFF',
          borderTop: '1px solid rgba(27,67,50,0.08)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          zIndex: 100,
          display: 'none',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '100%',
            padding: '0 0.5rem',
          }}
        >
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  textDecoration: 'none',
                  color: isActive ? '#1B4332' : 'rgba(27,67,50,0.35)',
                  padding: '0.5rem 0.75rem',
                  minWidth: '56px',
                  minHeight: '44px',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(27,67,50,0.06)' : 'transparent',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.55rem',
                  letterSpacing: '0.05em',
                }}>
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* Center floating brand button */}
          <Link
            to={user ? (user.role === 'farmer' ? '/farmer' : '/dashboard') : '/login'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#FFFFFF',
              background: '#1B4332',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              marginTop: '-24px',
              boxShadow: '0 4px 16px rgba(27,67,50,0.3)',
              transition: 'transform 0.2s ease',
            }}
          >
            <Leaf size={20} strokeWidth={1.5} />
          </Link>
        </div>

        <style>{`
          @media(max-width:768px){
            .bottom-nav{display:block !important}
          }
        `}</style>
      </nav>
    </>
  );
}
