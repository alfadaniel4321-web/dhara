import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        opacity: 1,
        animation: 'fadeIn 1.2s ease-out forwards',
      }}>
        <p style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#A3C87A',
          marginBottom: '1.5rem',
        }}>
          Kerala's Premium Organic Marketplace
        </p>

        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(3.5rem, 10vw, 9rem)',
          fontWeight: 400,
          lineHeight: 0.92,
          color: '#F5F3E7',
          letterSpacing: '-0.03em',
          margin: '0 0 0.5rem 0',
        }}>
          DHARA
        </h1>

        <p style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: '#D4A017',
          marginBottom: '2.5rem',
        }}>
          Farm • Table • Trust
        </p>

        <p style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
          fontWeight: 300,
          color: 'rgba(245, 243, 231, 0.75)',
          maxWidth: '520px',
          lineHeight: 1.7,
          margin: '0 auto 3rem',
        }}>
          From Kerala's oldest organic families to your table — harvest to home in under 24 hours.
        </p>

        <div className="hero-cta-wrapper" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <Link
            to={user ? (user.role === 'farmer' ? '/farmer' : '/dashboard') : '/login'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#1B4332',
              color: '#F5F3E7',
              fontFamily: '"Courier New", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.9rem 2rem',
              border: '1px solid rgba(245,243,231,0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D4A017'; e.currentTarget.style.borderColor = '#D4A017'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1B4332'; e.currentTarget.style.borderColor = 'rgba(245,243,231,0.15)'; }}
          >
            Sign in
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
