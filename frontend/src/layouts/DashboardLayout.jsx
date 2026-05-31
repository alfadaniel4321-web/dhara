import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const SELF_CONTAINED_MOBILE = ['/dashboard', '/daily-orders', '/my-orders', '/profile', '/cart', '/track/'];

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isSelfContainedMobile = SELF_CONTAINED_MOBILE.some(p =>
    p.endsWith('/') ? location.pathname.startsWith(p) : location.pathname === p
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isMobile && isSelfContainedMobile) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-farmgreen-950 text-emerald-100 flex flex-col font-sans">
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div style={{ height: '96px' }} />
      <div className="flex-grow flex flex-col md:flex-row">
        <Sidebar role="customer" />
        <main className={`flex-grow max-w-screen-2xl mx-auto w-full min-w-0 ${!isMobile ? 'p-3 sm:p-4 md:p-6 xl:p-8' : ''}`}>
          <Outlet />
        </main>
      </div>
      {!isMobile && <Footer />}
    </div>
  );
}
