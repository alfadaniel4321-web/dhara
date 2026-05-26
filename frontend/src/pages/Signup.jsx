import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '../redux/slices/authSlice';
import { api } from '../services/api';
import { ShieldAlert, Leaf } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState('');
  
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch(setAuthFailure('Passwords do not match'));
      return;
    }

    dispatch(setAuthStart());
    try {
      const data = await api.auth.signup(name, email, password, role, phone, address);
      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      if (data.user.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      dispatch(setAuthFailure(err.message || 'Signup failed'));
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden bg-gradient-to-tr from-farmgreen-950 via-emerald-950 to-farmgreen-900">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md glassmorphism p-8 rounded-3xl border border-emerald-800 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <Leaf className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
          <h2 className="text-3xl font-bold text-white mt-3">Join Dhara</h2>
          <p className="text-sm text-emerald-300/70 mt-1">Register to trade organic Kerala harvests</p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-3.5 rounded-xl text-xs mb-4 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/40">
            <button 
              type="button" 
              onClick={() => setRole('customer')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'customer' ? 'bg-emerald-500 text-farmgreen-950 shadow-md' : 'text-emerald-300/60 hover:text-white'}`}
            >
              Customer
            </button>
            <button 
              type="button" 
              onClick={() => setRole('farmer')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'farmer' ? 'bg-emerald-500 text-farmgreen-950 shadow-md' : 'text-emerald-300/60 hover:text-white'}`}
            >
              Farmer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Name"
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Phone"
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@domain.com"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">Shipping / Farm Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Address in Kerala"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-emerald-300 uppercase mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3 rounded-xl transition-all shadow-lg active:scale-95 text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-emerald-300/60">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
