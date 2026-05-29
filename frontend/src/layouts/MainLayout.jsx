import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <div className="min-h-screen bg-farmgreen-950 text-emerald-100 flex flex-col font-sans">
      <Navbar />
      <main
        className="flex-grow flex flex-col relative z-10"
        style={isLanding ? {} : { paddingTop: '96px' }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
