import React, { createContext, useContext } from 'react';

// Versão provisória (etapa 1). A autenticação real entra na etapa 2.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ usuario: null, carregando: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
