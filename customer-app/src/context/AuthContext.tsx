import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  selectedWard: string;
  setSelectedWard: (ward: string) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dar_customer_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dar_customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedWard, setSelectedWard] = useState<string>(() => localStorage.getItem('dar_selected_ward') || 'Masaki');

  useEffect(() => {
    localStorage.setItem('dar_selected_ward', selectedWard);
  }, [selectedWard]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('dar_customer_token', newToken);
    localStorage.setItem('dar_customer_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dar_customer_token');
    localStorage.removeItem('dar_customer_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, selectedWard, setSelectedWard, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
