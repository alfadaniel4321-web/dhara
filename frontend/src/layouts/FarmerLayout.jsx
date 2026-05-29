import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FarmerNavbar from '../components/FarmerNavbar';

export default function FarmerLayout() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'farmer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#013220' }}>
      <FarmerNavbar />
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
