import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function FarmerLayout() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'farmer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-farmgreen-950 text-emerald-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row">
        <Sidebar role="farmer" />
        <main className="flex-grow p-4 md:p-8 max-w-screen-2xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
