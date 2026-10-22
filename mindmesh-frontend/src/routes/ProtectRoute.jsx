import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx'

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export default ProtectedRoute;