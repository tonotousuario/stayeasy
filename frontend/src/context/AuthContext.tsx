import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; // type-only import
import type { User, UserRole } from '../types/domain.ts'; // type-only import
// TODO: Implement JWT decoding to get user info from token

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load token from local storage on initial render
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // TODO: Implement actual JWT decoding here to get user object
      // For now, a placeholder user object
      const dummyUser: User = {
        id: "dummy-user-id",
        username: "testuser",
        role: "RECEPTIONIST" // Default role for now
      };
      setToken(storedToken);
      setUser(dummyUser);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    // TODO: Decode token and set user object
    const dummyUser: User = {
      id: "dummy-user-id",
      username: "testuser",
      role: "RECEPTIONIST"
    };
    setToken(newToken);
    setUser(dummyUser);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
