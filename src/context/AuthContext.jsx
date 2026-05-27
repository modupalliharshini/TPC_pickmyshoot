import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUserRole, setCurrentUserRole] = useState(
    localStorage.getItem('currentUserRole')
  );

  const login = (role) => {
    localStorage.setItem('currentUserRole', role);
    setCurrentUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('currentUserRole');
    setCurrentUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ currentUserRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
