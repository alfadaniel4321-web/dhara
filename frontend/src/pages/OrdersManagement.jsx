import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, CheckCircle2, Truck, Smartphone, MapPin, ListOrdered } from 'lucide-react';

export default function OrdersManagement() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const loadOrders = async () => {
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
    loadOrders();
  }, [user]);

  const handleUpdateStatus = async (id, nextStatus) => {
    setSuccess('');
    try {
      await api.orders.updateOrderStatus(id, { orderStatus: nextStatus });
      setSuccess(`Order updated to status: ${nextStatus}`);
      loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await api.orders.updateOrderStatus(id, { paymentStatus: 'Paid' });
      setSuccess('Payment status marked as PAID');
      loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Link 
        to="/farmer" 
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Farmer Hub</span>
      </Link>

      <div className="border-b border-emerald-900/60 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Hyperlocal Delivery Dispatch</h2>
          <p className="text-sm text-emerald-300/70">Fulfill incoming checkout orders and coordinate cold-chain transit slots.</p>
        </div>
        <ListOrdered className="w-8 h-8 text-emerald-400 hidden sm:block" />
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-305 p-3.5 rounded-xl text-xs">
          {success}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="glassmorphism p-12 rounded-3xl text-center">
          <p className="text-xs text-emerald-305/75 italic">No incoming orders received yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const customer = order.customerId || {};
            const status = order.orderStatus;
            const isPaid = order.paymentStatus === 'Paid';
            const farmerProducts = order.products.filter(p => p.farmerId === user.id || p.farmerId === user._id);

            return (
              <div 
                key={order.id || order._id}
                className="bg-emerald-950/20 border border-emerald-900/80 p-5 rounded-2xl space-y-4 hover:border-emerald-500/20 transition-all"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-emerald-900/40 pb-3 text-xs">
                  <div>
                    <span className="font-bold text-white block">Order ID: #{order.id || order._id}</span>
                    <span className="text-[10px] text-emerald-300/60 block mt-0.5 font-mono">Date: {new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isPaid ? 'bg-emerald-500/25 text-emerald-300' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isPaid ? 'Paid' : 'COD Pending'}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Customer info */}
                  <div className="space-y-2 text-emerald-300">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-emerald-400">Customer Details</h4>
                    <p className="font-semibold text-white">{customer.name}</p>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono select-all">{customer.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                  </div>

                  {/* Right: Products list */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-emerald-400">Ordered Items</h4>
                    <div className="space-y-1 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60">
                      {farmerProducts.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-emerald-300">
                          <span>{p.title} <strong className="text-[10px] text-white">x{p.count}</strong></span>
                          <span className="font-mono text-emerald-250">₹{p.price * p.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer dispatch triggers */}
                {status !== 'Delivered' && (
                  <div className="border-t border-emerald-900/40 pt-3 flex flex-wrap gap-2 items-center justify-end">
                    {!isPaid && (
                      <button 
                        onClick={() => handleMarkAsPaid(order.id || order._id)}
                        className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                      >
                        Confirm COD Payment
                      </button>
                    )}

                    {status === 'Pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id || order._id, 'Processing')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-4 py-1.5 rounded-xl text-xs transition-all active:scale-95"
                      >
                        Start Preparing
                      </button>
                    )}

                    {status === 'Processing' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id || order._id, 'In Transit')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-4 py-1.5 rounded-xl text-xs transition-all active:scale-95 flex items-center space-x-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Shipment</span>
                      </button>
                    )}

                    {status === 'In Transit' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id || order._id, 'Delivered')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-4 py-1.5 rounded-xl text-xs transition-all active:scale-95 flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Handover Completed</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
