import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFuncionarios, Hierarquia, type Funcionario } from './mockData';

interface AuthContextType {
  user: Funcionario | null;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Funcionario | null>(null);
  const navigate = useNavigate();

  const login = (email: string, pass: string): boolean => {
    const foundUser = mockFuncionarios.find(
      (f) => f.login === email && f.senha === pass
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.cargo === Hierarquia.Administrador;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
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