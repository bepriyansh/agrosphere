import { useEffect, useState, useRef, type ReactNode } from 'react';
import { AuthContext } from './AuthContextValue';
import type { AuthResponse, IUser } from '../api/types';
import { refreshToken } from '../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from '../components/loaderPage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRunRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkUserSession = async () => {
      try {
        const response = await refreshToken();
        login(response.data);

        if (location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/');
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [location.pathname, navigate]);

  const login = (userData: AuthResponse) => setUser(userData.user);
  const logout = () => setUser(null);

  const authContextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
};
