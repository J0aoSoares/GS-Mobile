import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import * as seedService from '../services/seedService';
import * as iotSimulator from '../services/iotSimulator';

// Contexto de autenticação: guarda o usuário logado e expõe entrar/cadastrar/sair.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroInicial, setErroInicial] = useState(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        await seedService.garantirSeed();
        const sessao = await authService.restaurarSessao();
        if (ativo) setUsuario(sessao);
      } catch (erro) {
        console.warn('[auth] falha ao iniciar', erro);
        if (ativo) setErroInicial('Não foi possível carregar seus dados. Tente fechar e abrir o app.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email, senha) => {
    const logado = await authService.entrar(email, senha);
    setUsuario(logado);
    return logado;
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const novo = await authService.cadastrar(dados);
    setUsuario(novo);
    return novo;
  }, []);

  const sair = useCallback(async () => {
    try {
      await authService.sair();
    } finally {
      setUsuario(null);
    }
  }, []);

  // Apaga tudo e recria o seed. A sessão também é apagada, então volta para o login.
  // O simulador para antes (e termina as gravações pendentes) para não escrever por cima do seed novo.
  const restaurarDemo = useCallback(async () => {
    await iotSimulator.resetar();
    await seedService.restaurarDemo();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, erroInicial, entrar, cadastrar, sair, restaurarDemo }),
    [usuario, carregando, erroInicial, entrar, cadastrar, sair, restaurarDemo]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}
