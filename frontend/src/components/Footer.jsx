import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glassmorphism border-t border-emerald-900/60 py-10 px-4 md:px-8 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-wider">DHARA</span>
          </div>
          <p className="text-xs text-emerald-300/60 leading-relaxed font-light">
            Kerala's luxury hyperlocal farm-to-table platform. Connecting local farmers directly to customers with real-time freshness indexes and daily routine subscriptions.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Quick Links</h4>
          <ul className="text-xs space-y-2 text-emerald-300/80">
            <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Marketplace</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">E-Commerce</h4>
          <ul className="text-xs space-y-2 text-emerald-300/80">
            <li><Link to="/cart" className="hover:text-white transition-colors">My Shopping Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Order History</Link></li>
            <li><Link to="/subscription" className="hover:text-white transition-colors">Manage Subscriptions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Farmer Center</h4>
          <ul className="text-xs space-y-2 text-emerald-300/80">
            <li><Link to="/farmer" className="hover:text-white transition-colors">Farmer Dashboard</Link></li>
            <li><Link to="/farmer/add" className="hover:text-white transition-colors">List New Harvest</Link></li>
            <li><Link to="/farmer/orders" className="hover:text-white transition-colors">Manage Incoming Orders</Link></li>
            <li><Link to="/farmer/feedback" className="hover:text-white transition-colors">Trust & Feedback</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-emerald-900/60 pt-6 text-center text-xs text-emerald-500/60">
        <p>© 2026 Dhara Inc. Engineered for premium hyperlocal agricultural trade in Kerala, India.</p>
      </div>
    </footer>
  );
}
