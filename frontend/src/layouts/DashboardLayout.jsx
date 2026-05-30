import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-farmgreen-950 text-emerald-100 flex flex-col font-sans">
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div style={{ height: '96px' }} />
      <div className="flex-grow flex flex-col md:flex-row">
        <Sidebar role="customer" />
        <main className="flex-grow p-3 sm:p-4 md:p-6 xl:p-8 max-w-screen-2xl mx-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileBottomNav role="customer" />
    </div>
  );
}
