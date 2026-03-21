import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../../../lib/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = getToken();
  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
