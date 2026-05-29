import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Grid, Clock, ShoppingBag, Users, Package,
  Tag, Info
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', route: '/dashboard' },
  { icon: Grid, label: 'All Products', route: '/products' },
  { icon: Clock, label: 'Harvest Countdown', route: '/harvest-countdown' },
  { icon: ShoppingBag, label: 'Daily Orders', route: '/daily-orders' },
  { icon: Users, label: 'Farmers', route: '/farmers' },
  { icon: Package, label: 'My Orders', route: '/my-orders' },
  { icon: Tag, label: 'Offers & Deals', route: '/offers' },
  { icon: Info, label: 'About Us', route: '/about' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => {
    if (route.includes('#')) return location.hash === '#' + route.split('#')[1];
    if (route === '/dashboard') return location.pathname === '/dashboard' && !location.hash;
    return location.pathname === route;
  };

  return (
    <aside style={{
      width: '220px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#013220',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
    }}>
      <style>{`
        @media (max-width: 767px) {
          .fd-sidebar { display: none !important; }
        }
      `}</style>

      <div className="fd-sidebar" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.25rem 0.75rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          color: '#7BE495',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '0.5rem 0.75rem 0.75rem',
          opacity: 0.8,
        }}>
          MARKETPLACE
        </div>

        <nav style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          padding: '0 0.25rem',
        }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);
            return (
              <div
                key={item.label}
                onClick={() => {
                  if (item.route.startsWith('/dashboard') && item.route.includes('#')) {
                    const id = item.route.split('#')[1];
                    const el = document.getElementById('dash-' + id);
                    if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
                  }
                  navigate(item.route);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: active ? '#19C37D' : 'transparent',
                  color: active ? '#013220' : 'rgba(255,255,255,0.85)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.82rem',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  }
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={{
          margin: '0.5rem 0.25rem 0.25rem',
          padding: '1rem 0.85rem',
          background: '#EBF5EB',
          borderRadius: '16px',
          textAlign: 'left',
        }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>🌱</div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#013220',
            lineHeight: 1.25,
          }}>
            Eat Fresh<br />Live Healthy
          </div>
          <div style={{
            fontSize: '0.6rem',
            color: '#555',
            marginTop: '0.4rem',
            lineHeight: 1.4,
            fontWeight: 500,
          }}>
            Support Farmers Support Life
          </div>
        </div>
      </div>
    </aside>
  );
}
