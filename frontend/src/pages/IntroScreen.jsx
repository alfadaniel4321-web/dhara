import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

export default function IntroScreen({ onFinish }) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeIn(true), 50);
    const finishTimer = setTimeout(() => {
      const token = localStorage.getItem('dhara_token');
      if (token) {
        window.location.hash = '#/dashboard';
      } else {
        window.location.hash = '#/login';
      }
      onFinish();
    }, 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #013220 0%, #1B4332 50%, #0D3B2E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.6s ease',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      {/* Decorative top-right grain */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163,200,122,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,228,149,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'rgba(163,200,122,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(163,200,122,0.2)',
          }}
        >
          <Leaf size={40} color="#A3C87A" style={{ strokeWidth: 1.5 }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            DHARA
          </h1>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)',
              color: 'rgba(163,200,122,0.7)',
              margin: '8px 0 0',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            Direct From Farmers
          </p>
        </div>
      </div>

      {/* Spinner */}
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#A3C87A',
            animation: 'introBounce 1s ease-in-out infinite',
          }}
        />
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#A3C87A',
            animation: 'introBounce 1s ease-in-out 0.2s infinite',
          }}
        />
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#A3C87A',
            animation: 'introBounce 1s ease-in-out 0.4s infinite',
          }}
        />
      </div>

      {/* Version */}
      <p
        style={{
          position: 'absolute',
          bottom: '32px',
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.1em',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        v1.0.0
      </p>

      <style>{`
        @keyframes introBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
