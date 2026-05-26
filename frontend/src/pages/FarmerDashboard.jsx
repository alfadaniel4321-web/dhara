import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BarChart2, 
  TrendingUp, 
  ListOrdered, 
  AlertTriangle, 
  DollarSign, 
  PlusCircle, 
  Sliders, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allProds = await api.products.getProducts();
      // Filter products uploaded by this farmer
      const farmerProds = allProds.filter(p => {
        const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
        return fId === user.id || fId === user._id;
      });
      setProducts(farmerProds);

      const allOrders = await api.orders.getOrders();
      setOrders(allOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  // Calculate analytics parameters
  const totalCompletedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  
  // Total Revenue calculation
  let totalEarnings = 0;
  orders.forEach(o => {
    // Only calculate items that match this farmer's id
    const farmerItems = o.products.filter(p => p.farmerId === user.id || p.farmerId === user._id);
    const itemTotal = farmerItems.reduce((acc, curr) => acc + (curr.price * curr.count), 0);
    // If order is completed or paid, add to earnings
    if (o.orderStatus === 'Delivered' || o.paymentStatus === 'Paid') {
      totalEarnings += itemTotal;
    }
  });

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Subscriptions simulation count
  const subscriptionCustomerCount = orders.filter(o => o.subscriptionType !== 'One-time' && o.orderStatus !== 'Cancelled').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header with quick links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-900/60 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Farmer Analytics Hub</h2>
          <p className="text-sm text-emerald-300/70">Completed orders and inventory metrics.</p>
        </div>

        <div className="flex space-x-2 shrink-0">
          <Link 
            to="/farmer/add" 
            className="bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-500/10"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Harvest</span>
          </Link>
          
          <Link 
            to="/farmer/manage" 
            className="bg-emerald-900/40 hover:bg-emerald-900 border border-emerald-800 text-emerald-350 px-4 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-1.5"
          >
            <Sliders className="w-4 h-4" />
            <span>Inventory</span>
          </Link>
        </div>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 hover:border-emerald-500/20 transition-all text-center">
          <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">₹{totalEarnings}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-300/60 mt-1">Total Earnings</p>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 hover:border-emerald-500/20 transition-all text-center">
          <ListOrdered className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{orders.length}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-300/60 mt-1">Orders Received</p>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 hover:border-emerald-500/20 transition-all text-center">
          <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{products.length}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-300/60 mt-1">Harvest Entries</p>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 hover:border-emerald-500/20 transition-all text-center">
          <MessageSquare className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{subscriptionCustomerCount}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-300/60 mt-1">Subscribed Routines</p>
        </div>
      </div>

      {/* Warning notices */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-yellow-950/40 border border-yellow-800 p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-yellow-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" />
            Inventory Stock Alerts
          </h3>
          
          <ul className="text-xs text-yellow-300/90 space-y-1.5 pl-6 list-disc">
            {outOfStockProducts.map(p => (
              <li key={p.id || p._id}><strong className="text-white">{p.title}</strong> is OUT of stock!</li>
            ))}
            {lowStockProducts.filter(p => p.stock > 0).map(p => (
              <li key={p.id || p._id}><strong className="text-white">{p.title}</strong> is running low ({p.stock} left in stock)</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Recent Shipments</h3>
          
          {orders.length === 0 ? (
            <p className="text-xs text-emerald-500 italic">No shipments registered.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map(o => (
                <div key={o.id || o._id} className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Order ID: #{o.id || o._id}</span>
                    <span className="text-[10px] text-emerald-300/60 block mt-0.5">{o.deliveryTime} Slot</span>
                  </div>
                  <Link 
                    to="/farmer/orders"
                    className="text-xs text-emerald-400 hover:text-white font-bold bg-emerald-900/40 border border-emerald-800 px-3 py-1.5 rounded-lg"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Farmer reputation status */}
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Farmer Reputation Index</h3>
          
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/60 space-y-3.5 text-xs text-emerald-305/90">
            <div className="flex justify-between">
              <span>Farmer Trust Rating:</span>
              <span className="font-bold text-yellow-400">{user?.rating || 5.0}★</span>
            </div>
            
            <div className="flex justify-between">
              <span>Negative Feedback Count:</span>
              <span className="font-mono font-semibold text-red-400">{user?.negativeFeedbacksCount || 0} / 3 Strikes</span>
            </div>

            <div className="border-t border-emerald-900/40 pt-3 text-[10px] text-emerald-300/60 flex items-start space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>To ensure product freshness standards in the hyperlocal sector, farmers are blocked automatically upon receiving three negative feedbacks (review score ≤ 2★).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
