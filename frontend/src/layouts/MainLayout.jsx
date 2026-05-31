import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-farmgreen-950 text-emerald-100 flex flex-col font-sans">
      <Navbar />
      <main
        className={`flex-grow flex flex-col relative z-10${isLanding ? ' lp-main' : ''}`}
        style={!isLanding ? { paddingTop: '96px' } : {}}
      >
        <Outlet />
      </main>
      {!isMobile && <Footer />}
    </div>
  );
}
