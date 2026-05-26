import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';
import { 
  ShoppingBag, 
  Calendar, 
  ShoppingCart, 
  Clock, 
  Heart, 
  User, 
  LogOut, 
  TrendingUp, 
  PlusCircle, 
  Sliders, 
  ListOrdered, 
  MessageSquare,
  BarChart2
} from 'lucide-react';

export default function Sidebar({ role = 'customer' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/');
  };

  const customerLinks = [
    { to: '/dashboard', label: 'Marketplace', icon: ShoppingBag },
    { to: '/subscription', label: 'Subscriptions', icon: Calendar },
    { to: '/cart', label: 'My Cart', icon: ShoppingCart },
    { to: '/wishlist', label: 'My Wishlist', icon: Heart },
    { to: '/profile', label: 'Profile & Orders', icon: User },
  ];

  const farmerLinks = [
    { to: '/farmer', label: 'Overview', icon: BarChart2 },
    { to: '/farmer/add', label: 'Add Harvest', icon: PlusCircle },
    { to: '/farmer/manage', label: 'Manage Stock', icon: Sliders },
    { to: '/farmer/orders', label: 'Incoming Orders', icon: ListOrdered },
    { to: '/farmer/feedback', label: 'Trust & Feedback', icon: MessageSquare },
    { to: '/profile', label: 'Settings', icon: User },
  ];

  const links = role === 'farmer' ? farmerLinks : customerLinks;

  return (
    <aside className="w-full md:w-64 bg-emerald-950/30 border-r border-emerald-900/60 p-4 flex flex-row md:flex-col md:justify-between justify-around shrink-0 flex-wrap gap-2 md:gap-0">
      <div className="w-full space-y-2 flex flex-row md:flex-col items-center md:items-stretch overflow-x-auto md:overflow-visible py-1 md:py-0">
        <div className="hidden md:block px-3 py-2 text-xs uppercase tracking-widest text-emerald-500 font-semibold mb-2">
          {role === 'farmer' ? 'Farmer Hub' : 'Marketplace'}
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/farmer'}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 w-auto md:w-full ${
                  isActive 
                    ? 'bg-emerald-500 text-farmgreen-950 shadow-md shadow-emerald-500/10' 
                    : 'text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline md:inline">{link.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 w-auto md:w-full text-red-400 hover:bg-red-950/20"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline md:inline">Log Out</span>
        </button>
      </div>

      {role === 'farmer' && user && (
        <div className="hidden md:block border-t border-emerald-900/60 pt-4 mt-4 w-full">
          <div className="bg-emerald-950/60 border border-emerald-900 p-4 rounded-2xl text-center">
            <div className="text-emerald-400 font-bold text-lg leading-tight">{user.rating || 5.0}★</div>
            <div className="text-[10px] uppercase text-emerald-300/60 font-bold tracking-wider mt-0.5">Farmer Rating</div>
            <div className="text-xs text-red-400/80 mt-2 font-mono">{user.negativeFeedbacksCount || 0} / 3 Strikes</div>
          </div>
        </div>
      )}
    </aside>
  );
}
