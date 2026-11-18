import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import * as relatoService from '../services/relatoService';
import * as alertaService from '../services/alertaService';
import { ORIGEM } from '../constants/status';
import { ESTACOES } from '../constants/paradas';

// Contexto de relatos, chamados e alertas do usuário logado.

const RelatosContext = createContext(null);

export function RelatosProvider({ children }) {
  const { usuario } = useAuth();
  const [relatos, setRelatos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    if (!usuario) return;
    try {
      const [listaRelatos, listaAlertas] = await Promise.all([
        relatoService.listarRelatos(),
        alertaService.listarAlertas(usuario),
      ]);
      setRelatos(listaRelatos);
      setAlertas(listaAlertas);
      setErro(null);
    } catch (e) {
      console.warn('[relatos] falha ao carregar', e);
      setErro('Não foi possível carregar os dados. Puxe a lista para tentar de novo.');
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (!usuario) {
      setRelatos([]);
      setAlertas([]);
      setCarregando(true);
      return undefined;
    }
    recarregar();
    return undefined;
  }, [usuario, recarregar]);

  const criarRelato = useCallback(
    async (dados) => {
      const relato = await relatoService.criarRelato({ ...dados, usuarioId: usuario.id });
      await recarregar();
      return relato;
    },
    [usuario, recarregar]
  );

  const avancarStatus = useCallback(
    async (relatoId, novoStatus, nota) => {
      const relato = await relatoService.avancarStatus(relatoId, novoStatus, nota);
      await recarregar();
      return relato;
    },
    [recarregar]
  );

  const marcarAlertaLido = useCallback(
    async (alertaId) => {
      await alertaService.marcarComoLido(alertaId);
      await recarregar();
    },
    [recarregar]
  );

  const marcarTodosLidos = useCallback(async () => {
    await alertaService.marcarTodosComoLidos(usuario);
    await recarregar();
  }, [usuario, recarregar]);

  const valor = useMemo(() => {
    const meusRelatos = usuario
      ? relatos.filter((r) => r.origem === ORIGEM.CIDADAO && r.usuarioId === usuario.id)
      : [];
    return {
      relatos,
      meusRelatos,
      alertas,
      alertasNaoLidos: alertas.filter((a) => !a.lido).length,
      carregando,
      erro,
      recarregar,
      criarRelato,
      avancarStatus,
      marcarAlertaLido,
      marcarTodosLidos,
      buscarRelato: (id) => relatos.find((r) => r.id === id) || null,
      proximosStatus: relatoService.proximosStatus,
    };
  }, [usuario, relatos, alertas, carregando, erro, recarregar, criarRelato, avancarStatus, marcarAlertaLido, marcarTodosLidos]);

  return <RelatosContext.Provider value={valor}>{children}</RelatosContext.Provider>;
}

export function useRelatos() {
  const ctx = useContext(RelatosContext);
  if (!ctx) throw new Error('useRelatos precisa estar dentro de <RelatosProvider>.');
  return ctx;
}

// Provisório (etapa 3): estações sem medição. A simulação IoT entra na etapa 4.
const ESTACOES_SEM_LEITURA = ESTACOES.map((e) => ({ ...e, estado: null, luxAtual: null }));
export function useEstacoes() {
  return ESTACOES_SEM_LEITURA;
}
