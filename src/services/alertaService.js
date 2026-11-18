import { CHAVES } from '../constants/armazenamento';
import { PERFIL, DESTINO_AGENTES } from '../constants/status';
import { gerarId } from '../utils/id';
import * as storage from './storageService';

// Alertas: { id, usuarioId | 'agentes', relatoId, titulo, mensagem, criadoEm, lido }

const maisRecentePrimeiro = (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm);

// Destino dos alertas de um usuário: agentes compartilham a mesma caixa.
export function destinoDoUsuario(usuario) {
  if (!usuario) return null;
  return usuario.perfil === PERFIL.AGENTE ? DESTINO_AGENTES : usuario.id;
}

export async function criarAlerta({ usuarioId, relatoId = null, titulo, mensagem }) {
  const alerta = {
    id: gerarId(),
    usuarioId,
    relatoId,
    titulo,
    mensagem,
    criadoEm: new Date().toISOString(),
    lido: false,
  };
  await storage.atualizarLista(CHAVES.ALERTAS, (lista) => [alerta, ...lista]);
  return alerta;
}

export async function listarAlertas(usuario) {
  const destino = destinoDoUsuario(usuario);
  if (!destino) return [];
  const todos = await storage.getLista(CHAVES.ALERTAS);
  return todos.filter((a) => a.usuarioId === destino).sort(maisRecentePrimeiro);
}

export async function marcarComoLido(alertaId) {
  await storage.atualizarLista(CHAVES.ALERTAS, (lista) =>
    lista.map((a) => (a.id === alertaId ? { ...a, lido: true } : a))
  );
}

export async function marcarTodosComoLidos(usuario) {
  const destino = destinoDoUsuario(usuario);
  await storage.atualizarLista(CHAVES.ALERTAS, (lista) =>
    lista.map((a) => (a.usuarioId === destino ? { ...a, lido: true } : a))
  );
}
