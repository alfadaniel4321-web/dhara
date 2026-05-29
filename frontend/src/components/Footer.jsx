import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Globe,
  Camera,
  MessageCircle,
} from 'lucide-react';

const linkStyle = {
  fontFamily: '"Courier New", monospace',
  fontSize: '0.7rem',
  letterSpacing: '0.02em',
  color: 'rgba(245, 243, 231, 0.55)',
  textDecoration: 'none',
  transition: 'color 0.25s ease',
  display: 'inline-block',
};

const socialIconStyle = {
  width: '36px',
  height: '36px',
  border: '1px solid rgba(106, 153, 78, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(245, 243, 231, 0.5)',
  textDecoration: 'none',
  transition: 'color 0.25s ease, border-color 0.25s ease',
  borderRadius: 0,
};

export default function Footer() {
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setEmail('');
    }
  };

  return (
    <footer style={{ background: '#080E0A', width: '100%' }}>
      {/* ───── TOP CTA BAND ───── */}
      <div
        style={{
          borderBottom: '1px solid rgba(106, 153, 78, 0.15)',
          padding: '3rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 400,
                color: '#F5F3E7',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                margin: '0 0 0.35rem 0',
                lineHeight: 1.1,
              }}
            >
              Start Your Fresh Journey
            </h2>
            <p
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(245, 243, 231, 0.4)',
                margin: 0,
              }}
            >
              Farm-to-table. Zero middlemen. Kerala's finest.
            </p>
          </div>

          <Link
            to={user ? (user.role === 'farmer' ? '/farmer' : '/dashboard') : '/login'}
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: '#A3C87A',
              color: '#0F1E14',
              padding: '0.85rem 2rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.25s ease',
              borderRadius: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6A994E' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#A3C87A' }}
          >
            Shop Now
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ───── MAIN GRID ───── */}
      <div style={{ padding: 'clamp(1.5rem, 3vw, 3.5rem) clamp(1rem, 3vw, 1.5rem)' }}>
        <div
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Column 1 — Brand */}
          <div>
            <h3
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '1.75rem',
                fontWeight: 400,
                color: '#F5F3E7',
                letterSpacing: '-0.02em',
                margin: '0 0 0.15rem 0',
                lineHeight: 1,
              }}
            >
              DHARA
            </h3>
            <p
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#6A994E',
                margin: '0 0 1.25rem 0',
              }}
            >
              Organic Kerala
            </p>
            <p
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'rgba(245, 243, 231, 0.45)',
                margin: '0 0 1.5rem 0',
                maxWidth: '320px',
              }}
            >
              Kerala's luxury hyperlocal farm-to-table platform. Connecting
              local farmers directly to customers with real-time freshness
              indexes and daily routine subscriptions.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a
                href="#"
                aria-label="Instagram"
                style={socialIconStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#A3C87A';
                  e.currentTarget.style.borderColor = 'rgba(163, 200, 122, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(106, 153, 78, 0.3)';
                }}
              >
                <Globe size={16} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                style={socialIconStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#A3C87A';
                  e.currentTarget.style.borderColor = 'rgba(163, 200, 122, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(106, 153, 78, 0.3)';
                }}
              >
                <Camera size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                style={socialIconStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#A3C87A';
                  e.currentTarget.style.borderColor = 'rgba(163, 200, 122, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(106, 153, 78, 0.3)';
                }}
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <h4
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6A994E',
                margin: '0 0 1.25rem 0',
              }}
            >
              Shop
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Vegetables', 'Fruits', 'Dairy & Eggs', 'Grains', 'Herbs & Spices', 'All Products'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'All Products' ? '/dashboard' : `/dashboard?category=${item.toLowerCase().replace(/\s&\s/g, '-').replace(/\s/g, '-')}`}
                    style={linkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.55)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Platform */}
          <div>
            <h4
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6A994E',
                margin: '0 0 1.25rem 0',
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'How It Works', to: '/about' },
                { label: 'Become a Farmer', to: '/signup?role=farmer' },
                { label: 'Freshness Promise', to: '/about' },
                { label: 'Delivery Zones', to: '/about' },
                { label: 'Bulk Orders', to: '/dashboard' },
                { label: 'Partner Program', to: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.55)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6A994E',
                margin: '0 0 1.25rem 0',
              }}
            >
              Contact
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <a
                href="tel:+919447123456"
                style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.55)' }}
              >
                <Phone size={11} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: '#6A994E' }} />
                +91 94471 23456
              </a>
              <a
                href="mailto:hello@dharaorganic.com"
                style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.55)' }}
              >
                <Mail size={11} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: '#6A994E' }} />
                hello@dharaorganic.com
              </a>
              <span style={linkStyle}>
                <MapPin size={11} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: '#6A994E' }} />
                Kochi, Kerala, India
              </span>
            </div>

            <div>
              <p
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.5rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245, 243, 231, 0.35)',
                  margin: '0 0 0.65rem 0',
                }}
              >
                Weekly Harvest Updates
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                style={{ display: 'flex', alignItems: 'stretch' }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email for newsletter"
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '0.65rem',
                    background: 'rgba(15, 30, 20, 0.7)',
                    border: '1px solid rgba(106, 153, 78, 0.3)',
                    borderRight: 'none',
                    color: '#F5F3E7',
                    padding: '0.65rem 0.75rem',
                    outline: 'none',
                    flex: 1,
                    minWidth: 0,
                    borderRadius: 0,
                  }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  style={{
                    background: '#6A994E',
                    border: 'none',
                    color: '#F5F3E7',
                    padding: '0.65rem 0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.25s ease',
                    borderRadius: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1B4332' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#6A994E' }}
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ───── BOTTOM BAR ───── */}
      <div
        style={{
          borderTop: '1px solid rgba(106, 153, 78, 0.15)',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '0.55rem',
              letterSpacing: '0.05em',
              color: 'rgba(245, 243, 231, 0.3)',
              margin: 0,
            }}
          >
            &copy; 2026 Dhara Inc. Kerala, India.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {['Privacy Policy', 'Terms of Service', 'Returns'].map((item) => (
              <Link
                key={item}
                to="/about"
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.05em',
                  color: 'rgba(245, 243, 231, 0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F5F3E7' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.3)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
