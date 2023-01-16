import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Admin from './Admin';
import Layout from './Layout';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth);

  return auth?.email ? (
    <Outlet />
  ) : (
    <Navigate to={'/'} state={{ from: location }} replace />
  );
};

export default RequireAuth;
