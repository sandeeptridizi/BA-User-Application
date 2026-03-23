import { useEffect, useState } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { getToken, setToken, setUser } from '../../../lib/auth';
import api from '../../../lib/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checking, setChecking] = useState(() => !!searchParams.get('authtoken'));

  useEffect(() => {
    const authtoken = searchParams.get('authtoken');
    if (!authtoken) return;

    setToken(authtoken);

    // Fetch user profile with the new token and clean up the URL
    api.get('/api/user/me', {
      headers: { Authorization: `Bearer ${authtoken}` },
    })
      .then(({ data }) => {
        setUser(data.data || data.user || data);
      })
      .catch(() => {
        // Token might still be valid even if /me fails; keep it
      })
      .finally(() => {
        // Remove authtoken from URL without full reload
        searchParams.delete('authtoken');
        setSearchParams(searchParams, { replace: true });
        setChecking(false);
      });
  }, []);

  if (checking) {
    return null; // Brief loading while processing authtoken
  }

  const token = getToken();
  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
