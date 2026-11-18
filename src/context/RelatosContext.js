import React, { createContext, useContext } from 'react';

// Versão provisória (etapa 1). Relatos, alertas e simulação entram nas etapas 3 e 4.
const RelatosContext = createContext({ alertasNaoLidos: 0 });

export function RelatosProvider({ children }) {
  return (
    <RelatosContext.Provider value={{ alertasNaoLidos: 0 }}>{children}</RelatosContext.Provider>
  );
}

export function useRelatos() {
  return useContext(RelatosContext);
}
