import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, User, MapPin, ListOrdered, Calendar, Heart, ShieldAlert } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(user?.address || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const loadProfileDetails = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const history = await api.orders.getOrders();
      setOrders(history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileDetails();
  }, [user]);

  const handleUpdateAddress = (e) => {
    e.preventDefault();
    setSuccess('');
    // Update local storage user address
    const updatedUser = { ...user, address };
    localStorage.setItem('dhara_user', JSON.stringify(updatedUser));
    
    // In mock, also update database
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id || u._id === user._id);
    if (idx !== -1) {
      users[idx].address = address;
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
    
    setSuccess('✅ Shipping address updated successfully!');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">Profile & History</h2>
        <p className="text-sm text-emerald-300/70">Manage personal details, addresses, and track order history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Personal Details & Address */}
        <div className="space-y-6">
          <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 mx-auto flex items-center justify-center text-2xl font-extrabold text-emerald-400">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name}</h3>
              <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-800/40">
                {user?.role} Account
              </span>
            </div>

            <div className="text-xs text-emerald-350/80 text-left space-y-2 pt-4 border-t border-emerald-900/60 font-mono">
              <p>Email: <span className="text-white font-medium select-all">{user?.email}</span></p>
              <p>Phone: <span className="text-white font-medium select-all">{user?.phone}</span></p>
              {user?.role === 'farmer' && <p>Rating: <span className="text-yellow-400 font-bold">{user?.rating || 5.0}★</span></p>}
            </div>
          </div>

          {/* Edit Address Form */}
          <form onSubmit={handleUpdateAddress} className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-emerald-450 font-bold flex items-center">
              <MapPin className="w-4.5 h-4.5 mr-1.5 text-emerald-400" />
              Saved Shipping Address
            </h3>

            {success && <p className="text-[10px] text-emerald-400 font-semibold">{success}</p>}

            <div>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter shipping address in Kerala"
                rows="3"
                className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-900/65 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 font-bold py-2 rounded-xl text-xs transition-all"
            >
              Update Address
            </button>
          </form>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-450 flex items-center">
            <ListOrdered className="w-4.5 h-4.5 mr-2 text-emerald-400" />
            Historical Order Receipts
          </h3>

          {orders.length === 0 ? (
            <div className="glassmorphism p-12 rounded-3xl text-center">
              <ListOrdered className="w-8 h-8 text-emerald-800 mx-auto mb-2" />
              <p className="text-xs text-emerald-305/70 italic">No checkout orders placed yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const isPaid = order.paymentStatus === 'Paid';
                const status = order.orderStatus || 'Pending';
                
                return (
                  <div key={order.id || order._id} className="bg-emerald-950/20 border border-emerald-900 p-4 rounded-2xl space-y-3 hover:border-emerald-500/20 transition-all">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-white block">Order ID: #{order.id || order._id}</span>
                        <span className="text-[10px] text-emerald-300/60 font-mono block mt-0.5">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-emerald-400 text-sm block">₹{order.totalPrice}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded mt-1 inline-block uppercase tracking-wider ${
                          status === 'Delivered' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-emerald-900/40 pt-2.5 flex items-center justify-between text-xs">
                      <span className="text-emerald-350 font-light truncate max-w-[60%]">
                        {order.products.map(p => `${p.title} x${p.count}`).join(', ')}
                      </span>
                      
                      <button 
                        onClick={() => navigate(`/track/${order.id || order._id}`)}
                        className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-350 px-3.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all shrink-0"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
