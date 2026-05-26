import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, UserMinus, ShieldAlert, Award, Sliders, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const loadAdminData = () => {
    setLoading(true);
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const mockProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
      const mockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
      
      setUsers(mockUsers);
      setProducts(mockProducts);
      setOrders(mockOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleResetStrikes = (userId) => {
    setSuccess('');
    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const idx = mockUsers.findIndex(u => u.id === userId || u._id === userId);
    
    if (idx !== -1) {
      mockUsers[idx].blocked = false;
      mockUsers[idx].negativeFeedbacksCount = 0;
      mockUsers[idx].rating = 5.0; // reset
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));
      
      // Also clear negative reviews logs for this farmer to clean up
      const mockFeedback = JSON.parse(localStorage.getItem('mock_feedback') || '[]');
      const filteredFeedback = mockFeedback.filter(f => {
        const fId = f.farmerId?._id || f.farmerId?.id || f.farmerId;
        return fId !== userId;
      });
      localStorage.setItem('mock_feedback', JSON.stringify(filteredFeedback));

      setSuccess(`Reset strikes and unblocked farmer: ${mockUsers[idx].name}`);
      loadAdminData();
    }
  };

  const handleBlockFarmer = (userId) => {
    setSuccess('');
    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const idx = mockUsers.findIndex(u => u.id === userId || u._id === userId);
    
    if (idx !== -1) {
      mockUsers[idx].blocked = true;
      mockUsers[idx].negativeFeedbacksCount = 3;
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));
      setSuccess(`Blocked farmer: ${mockUsers[idx].name}`);
      loadAdminData();
    }
  };

  if (loading) return <LoadingSpinner />;

  const farmers = users.filter(u => u.role === 'farmer');
  const customers = users.filter(u => u.role === 'customer');
  const blockedFarmers = farmers.filter(f => f.blocked);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <ShieldCheck className="w-6 h-6 mr-2 text-emerald-400" />
          Dhara Platform Administration
        </h2>
        <p className="text-sm text-emerald-300/70">Moderate farmer reputation indices, reset negative strikes, and track aggregates.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-305 p-3.5 rounded-xl text-xs">
          {success}
        </div>
      )}

      {/* Analytics stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 text-center">
          <p className="text-2xl font-black text-white">{users.length}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-350 mt-1">Total Users</p>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 text-center">
          <p className="text-2xl font-black text-white">{farmers.length}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-350 mt-1">Active Farmers</p>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 text-center">
          <p className="text-2xl font-black text-white">{products.length}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-350 mt-1">Active Harvests</p>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 text-center">
          <p className="text-2xl font-black text-emerald-400">₹{totalRevenue}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-350 mt-1">Gross Sales</p>
        </div>
      </div>

      {/* Blocked Farmers list */}
      <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-450 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-red-400" />
          Blocked Merchant Moderation Queue
        </h3>
        
        {blockedFarmers.length === 0 ? (
          <p className="text-xs text-emerald-500 italic">No blocked farmers on the platform currently.</p>
        ) : (
          <div className="space-y-3">
            {blockedFarmers.map(f => (
              <div key={f.id || f._id} className="p-4 bg-red-950/10 border border-red-900/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{f.name}</span>
                  <span className="text-[10px] text-red-400 block mt-0.5 font-mono">{f.phone} • {f.negativeFeedbacksCount} negative reviews</span>
                </div>
                <button 
                  onClick={() => handleResetStrikes(f.id || f._id)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 px-3.5 py-1.5 rounded-lg font-bold"
                >
                  Reset Strikes & Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Farmers list for testing block triggers */}
      <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">All Registered Farmers</h3>
        
        <div className="space-y-3">
          {farmers.filter(f => !f.blocked).map(f => (
            <div key={f.id || f._id} className="p-3 bg-emerald-955/20 border border-emerald-900 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">{f.name}</span>
                <span className="text-[10px] text-emerald-350 block mt-0.5">Rating: {f.rating}★ • {f.negativeFeedbacksCount || 0} / 3 Strikes</span>
              </div>
              
              <button 
                onClick={() => handleBlockFarmer(f.id || f._id)}
                className="text-red-400 hover:text-red-300 hover:underline font-bold"
              >
                Force Block (Admin Override)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
