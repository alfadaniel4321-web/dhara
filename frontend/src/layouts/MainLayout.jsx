import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

export default function MainLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <div className="min-h-screen bg-farmgreen-950 text-emerald-100 flex flex-col font-sans">
      <Navbar />
      <main
        className={`flex-grow flex flex-col relative z-10${isLanding ? ' lp-main' : ''}`}
        style={!isLanding ? { paddingTop: '96px' } : {}}
      >
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
