import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '../redux/slices/authSlice';
import { api } from '../services/api';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import storyGroveImg from "../assets/story-grove.jpg";
import bgImage from "../assets/image.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(''); // accepts username or email
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    dispatch(setAuthStart());
    try {
      const data = await api.auth.login(email, password);
      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      navigate(data.user.role === 'farmer' ? '/farmer' : '/dashboard');
    } catch (err) {
      dispatch(setAuthFailure(err.message || 'Login failed'));
    }
  }, [email, password, dispatch, navigate]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background image */}
      <img src={bgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 30, 20, 0.45)' }} />

      {/* Glass Card */}
      <div className="login-glass-card" style={{
        position: 'relative',
        zIndex: 2,
        width: '520px',
        maxWidth: '90vw',
        background: 'rgba(20, 40, 28, 0.45)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
      }}>
        {/* Top-left hamburger + DHARA ORGANIC */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>≡</span>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>DHARA ORGANIC</span>
        </div>

        {/* Two-column layout: image + heading */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Left: square image */}
          <div style={{ width: '40%', flexShrink: 0 }}>
            <img
              src={storyGroveImg}
              alt="Kerala farmland"
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
            />
          </div>
          {/* Right: heading */}
          <div style={{ width: '60%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <h1 style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: 0,
              textAlign: 'right',
            }}>
              Fresh<br />from<br />Kerala
            </h1>
          </div>
        </div>

        {/* Welcome Back section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.2rem', fontWeight: 400, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>Welcome Back</h2>
          <div style={{ width: '3rem', height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0, fontFamily: '-apple-system, sans-serif' }}>
            Sign in to your Dhara account to access fresh organic produce from verified Kerala farmers.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Username or Email address"
              autoComplete="username"
              required
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
                padding: '0.6rem 0',
                fontSize: '0.85rem',
                fontFamily: '-apple-system, sans-serif',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={e => e.currentTarget.style.borderBottomColor = '#A3C87A'}
              onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
                padding: '0.6rem 0',
                fontSize: '0.85rem',
                fontFamily: '-apple-system, sans-serif',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={e => e.currentTarget.style.borderBottomColor = '#A3C87A'}
              onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)'}
            />
          </div>

          {/* Error message */}
          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '0.72rem', fontFamily: '-apple-system, sans-serif', margin: '0.5rem 0', fontWeight: 300 }}>
              {error}
            </p>
          )}
        </form>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowForgot(true)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontFamily: '"Courier New", monospace', cursor: 'pointer', padding: 0, letterSpacing: '0.05em', transition: 'color 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#A3C87A'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            Forgot password?
          </button>
        </div>

        {/* Bottom bar: Connect with Dhara + pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontFamily: '"Courier New", monospace', letterSpacing: '0.05em' }}>
            Connect with Dhara
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                background: 'transparent',
                color: '#FFFFFF',
                borderRadius: '999px',
                padding: '0.45rem 1.4rem',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'transparent'; } }}
            >
              {loading ? (
                <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'loginSpin 0.6s linear infinite' }} />
              ) : null}
              Sign In
            </button>
            <Link
              to="/signup"
              style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#1B4332',
                borderRadius: '999px',
                padding: '0.45rem 1.4rem',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFFFFF'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <style>{`
        @keyframes loginSpin { to { transform: rotate(360deg); } }
        @media(max-width:480px){
          .login-glass-card > div:first-of-type { flex-direction: column !important; }
          .login-glass-card > div:first-of-type > div:first-child { width: 100% !important; }
          .login-glass-card > div:first-of-type > div:last-child { width: 100% !important; justify-content: center !important; }
          .login-glass-card > div:first-of-type > div:last-child h1 { text-align: center !important; }
        }
      `}</style>
    </div>
  );
}
