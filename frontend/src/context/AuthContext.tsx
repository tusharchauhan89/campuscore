
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';

import type { AuthUser, UserRole, Student, Faculty } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (role: UserRole, data: Student | Faculty | { id: number; name: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cms_user');

    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('cms_user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (
    role: UserRole,
    data: Student | Faculty | { id: number; name: string }
  ) => {
    const authUser: AuthUser = { role, data };

    setUser(authUser);
    localStorage.setItem('cms_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
