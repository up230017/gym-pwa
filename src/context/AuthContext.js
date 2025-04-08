import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Cargar el estado de autenticación al iniciar la aplicación
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwt.decode(token);
      console.log('Token decodificado al cargar:', decodedToken);
      setUser({ id: decodedToken.id, role: decodedToken.role });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    Cookies.set('token', token);
    const decodedToken = jwt.decode(token);
    setUser({ id: decodedToken.id, role: decodedToken.role });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};