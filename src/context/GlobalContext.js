import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [error, setError] = useState('');
  const [permissions, setPermissions] = useState([]);

  const addError = (message) => {
    setError(message);
  };

  const clearError = () => {
    setError('');
  };

  const updatePermissions = (newPermissions) => {
    setPermissions(newPermissions);
  };

  return (
    <GlobalContext.Provider value={{ error, addError, clearError, permissions, updatePermissions }}>
      {children}
    </GlobalContext.Provider>
  );
};