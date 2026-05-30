import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, User, MapPin, ListOrdered, Heart, ShieldAlert, PackageCheck, IndianRupee, Leaf, Award, Clock, ChevronRight, ShoppingBag } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(user?.address || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [hoveredOrder, setHoveredOrder] = useState(null);

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
    const updatedUser = { ...user, address };
    localStorage.setItem('dhara_user', JSON.stringify(updatedUser));
    setSuccess('Shipping address updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/login');
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const orderCount = orders.length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'from-emerald-500 to-green-400';
      case 'Shipped': return 'from-blue-500 to-cyan-400';
      case 'Processing': return 'from-amber-500 to-yellow-400';
      case 'Pending': return 'from-slate-500 to-gray-400';
      case 'Cancelled': return 'from-red-500 to-rose-400';
      default: return 'from-emerald-500 to-green-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return PackageCheck;
      case 'Shipped': return ShoppingBag;
      case 'Processing': return Clock;
      case 'Pending': return Clock;
      case 'Cancelled': return ShieldAlert;
      default: return PackageCheck;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/dashboard')}
        className="group flex items-center space-x-2 text-xs text-emerald-400/70 hover:text-emerald-300 transition-all duration-300"
      >
        <div className="p-1 rounded-lg bg-emerald-500/5 group-hover:bg-emerald-500/20 transition-all duration-300">
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
        <span className="tracking-wide font-medium">Dashboard</span>
      </button>

      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900/80 to-farmgreen-950 border border-emerald-800/40 p-8">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(52,211,153,0.8) 0px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(52,211,153,0.6) 0px, transparent 1px)`,
          backgroundSize: '32px 32px, 48px 48px',
        }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-3xl font-extrabold text-emerald-300 shadow-lg shadow-emerald-500/10">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-farmgreen-950 flex items-center justify-center">
                <Leaf className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-700/40">
                  <Award className="w-3 h-3" />
                  {user?.role} Account
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300/80 hover:text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-800/40 text-red-400/80 hover:text-red-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
            >
              <ShieldAlert className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: 'Total Orders', value: orderCount, suffix: '', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-700/30', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
          { icon: IndianRupee, label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, suffix: '', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-700/30', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
          { icon: PackageCheck, label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, suffix: '', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-700/30', iconBg: 'bg-purple-500/15', iconColor: 'text-purple-400' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} p-5 hover:scale-[1.02] transition-all duration-300 cursor-default`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/[0.02] to-transparent" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-white mt-0.5">{stat.value}{stat.suffix}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Address + Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left Column - Address */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 border border-emerald-800/30 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">Personal Info</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-emerald-400/60 font-medium">Email</span>
                  <span className="text-white font-medium text-right max-w-[60%] truncate">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-emerald-400/60 font-medium">Phone</span>
                  <span className="text-white font-medium">{user?.phone}</span>
                </div>
                {user?.role === 'farmer' && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-emerald-400/60 font-medium">Rating</span>
                    <span className="text-amber-400 font-bold">{user?.rating || 5.0} ★</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Address Form */}
          <form onSubmit={handleUpdateAddress} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 border border-emerald-800/30 p-6">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">Shipping Address</h3>
              </div>

              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-700/30 rounded-xl px-4 py-2.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <p className="text-[11px] text-emerald-300 font-medium">{success}</p>
                </div>
              )}

              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your shipping address in Kerala"
                rows="3"
                className="w-full bg-white/[0.04] border border-emerald-800/40 rounded-xl p-3.5 text-xs text-white/90 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-emerald-700/60 resize-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600/80 to-emerald-700/60 hover:from-emerald-500/80 hover:to-emerald-600/60 border border-emerald-500/20 text-emerald-200 font-bold py-2.5 rounded-xl text-xs transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                Update Address
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Order History */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ListOrdered className="w-4 h-4" />
              </div>
              <h3 className="text-sm uppercase tracking-widest text-emerald-400/70 font-bold">Order History</h3>
              {orderCount > 0 && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-700/30">
                  {orderCount} {orderCount === 1 ? 'order' : 'orders'}
                </span>
              )}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/20 to-emerald-900/10 border border-emerald-800/20 p-12 text-center">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(52,211,153,0.8) 0px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/5 border border-emerald-800/30 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-6 h-6 text-emerald-700/60" />
                </div>
                <p className="text-sm text-emerald-400/50 font-medium">No orders placed yet</p>
                <p className="text-[10px] text-emerald-600/60 mt-1">Your farm-fresh journey starts here</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-5 inline-flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-700/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
                >
                  Browse Products
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {orders.map(order => {
                const StatusIcon = getStatusIcon(order.orderStatus || 'Pending');
                const isPaid = order.paymentStatus === 'Paid';
                const status = order.orderStatus || 'Pending';
                const isHovered = hoveredOrder === (order.id || order._id);

                return (
                  <div
                    key={order.id || order._id}
                    onMouseEnter={() => setHoveredOrder(order.id || order._id)}
                    onMouseLeave={() => setHoveredOrder(null)}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/25 to-emerald-900/15 border border-emerald-800/25 hover:border-emerald-600/40 transition-all duration-500"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(status)} opacity-0 ${isHovered ? 'opacity-[0.03]' : ''} transition-opacity duration-500`} />

                    <div className="relative z-10 p-5 space-y-4">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${getStatusColor(status)}/10 border border-white/5 mt-0.5`}>
                            <StatusIcon className={`w-4 h-4 ${status === 'Delivered' ? 'text-emerald-400' : status === 'Cancelled' ? 'text-red-400' : status === 'Shipped' ? 'text-blue-400' : 'text-amber-400'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white flex items-center gap-2">
                              Order <span className="text-emerald-300 font-mono">#{order.id || order._id}</span>
                            </p>
                            <p className="text-[10px] text-emerald-400/50 font-mono mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-4">
                          <p className="text-lg font-bold text-emerald-300 font-mono tracking-tight">₹{order.totalPrice?.toLocaleString()}</p>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full mt-1 uppercase tracking-wider ${
                            status === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-700/30'
                              : status === 'Cancelled'
                              ? 'bg-red-500/15 text-red-400 border border-red-700/30'
                              : status === 'Shipped'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-700/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-700/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'Delivered' ? 'bg-emerald-400' : status === 'Cancelled' ? 'bg-red-400' : status === 'Shipped' ? 'bg-blue-400' : 'bg-amber-400'
                            }`} />
                            {status}
                          </span>
                          {isPaid && (
                            <span className="block text-[9px] text-emerald-500/60 mt-1 font-semibold">Paid</span>
                          )}
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-emerald-800/20">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex -space-x-2">
                            {order.products?.slice(0, 3).map((p, i) => (
                              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-700/40 to-emerald-800/30 border-2 border-emerald-900/50 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-emerald-400">{p.title?.charAt(0) || '?'}</span>
                              </div>
                            ))}
                            {(order.products?.length || 0) > 3 && (
                              <div className="w-7 h-7 rounded-full bg-emerald-800/40 border-2 border-emerald-900/50 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-emerald-400">+{order.products.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-emerald-400/60 font-medium truncate">
                            {order.products?.map(p => `${p.title} x${p.count}`).join(', ') || 'No items'}
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/track/${order.id || order._id}`)}
                          className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-700/30 text-emerald-400/70 hover:text-emerald-300 px-3.5 py-2 rounded-xl text-[10px] font-semibold transition-all duration-300 shrink-0"
                        >
                          Track
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
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
