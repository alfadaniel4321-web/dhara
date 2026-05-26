import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '../redux/slices/authSlice';
import { api } from '../services/api';
import { ShieldAlert, Leaf } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setAuthStart());
    try {
      const data = await api.auth.login(email, password);
      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      if (data.user.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      dispatch(setAuthFailure(err.message || 'Login failed'));
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden bg-gradient-to-tr from-farmgreen-950 via-emerald-950 to-farmgreen-900">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md glassmorphism p-8 rounded-3xl border border-emerald-800 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Leaf className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
          <h2 className="text-3xl font-bold text-white mt-3">Welcome Back</h2>
          <p className="text-sm text-emerald-300/70 mt-1">Sign in to buy or sell fresh local produce</p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-3.5 rounded-xl text-xs mb-6 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@domain.com"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-emerald-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-emerald-800"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
                className="rounded border-emerald-800 bg-emerald-950 text-emerald-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <span className="hover:underline cursor-pointer">Forgot password?</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-emerald-300/60">
          New to Dhara?{' '}
          <Link to="/signup" className="text-emerald-400 hover:underline font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
