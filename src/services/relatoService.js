import { CHAVES } from '../constants/armazenamento';
import {
  STATUS,
  STATUS_ABERTOS,
  TRANSICOES_AGENTE,
  ORIGEM,
  ESTADO_LUZ,
  ESTADOS_RUINS,
  INFO_ESTADO_LUZ,
  DESTINO_AGENTES,
} from '../constants/status';
import { buscarParada, buscarEstacaoDaParada, ESTACOES } from '../constants/paradas';
import { TIPO_CHAMADO_ESTACAO } from '../constants/tiposProblema';
import { JANELAS_RUINS_PARA_ALERTA } from '../constants/limiares';
import { apenasDigitos } from '../utils/validadores';
import { formatarLux, formatarHora } from '../utils/formatadores';
import { gerarId } from '../utils/id';
import * as storage from './storageService';
import * as alertaService from './alertaService';

// Relatos do cidadão e chamados automáticos das estações ficam na mesma lista.
// Formato:
// { id, origem, usuarioId, paradaId, tipo, descricao, cep, fotoUri, status,
//   criadoEm, atualizadoEm, resolvidoEm, semEstacao, medicao: {lux, estado, em, estacaoId} | null,
//   historico: [{ id, tipo: 'status' | 'nota', status?, texto, em }] }

export class ErroRelato extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroRelato';
  }
}

const agoraISO = () => new Date().toISOString();
const maisRecentePrimeiro = (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm);

const entradaStatus = (status, texto = null, em = agoraISO()) => ({
  id: gerarId(),
  tipo: 'status',
  status,
  texto,
  em,
});

const entradaNota = (texto, em = agoraISO()) => ({ id: gerarId(), tipo: 'nota', texto, em });

const nomeParada = (paradaId) => buscarParada(paradaId)?.nome || 'Ponto desconhecido';

export const estaAberto = (relato) => STATUS_ABERTOS.includes(relato.status);

// Aplica uma alteração a um relato dentro da fila de gravação. Devolve o relato alterado.
async function alterarRelato(relatoId, alterar) {
  let alterado = null;
  await storage.atualizarLista(CHAVES.RELATOS, (lista) => {
    const indice = lista.findIndex((r) => r.id === relatoId);
    if (indice < 0) throw new ErroRelato('Relato não encontrado.');
    const resultado = alterar(lista[indice]);
    if (!resultado) return lista; // nada a mudar
    alterado = { ...resultado, atualizadoEm: agoraISO() };
    const nova = [...lista];
    nova[indice] = alterado;
    return nova;
  });
  return alterado;
}

// ---------- Consultas ----------

export async function listarRelatos() {
  const lista = await storage.getLista(CHAVES.RELATOS);
  return lista.sort(maisRecentePrimeiro);
}

export async function buscarRelato(id) {
  const lista = await storage.getLista(CHAVES.RELATOS);
  return lista.find((r) => r.id === id) || null;
}

export async function listarPendentesDeValidacao() {
  const lista = await storage.getLista(CHAVES.RELATOS);
  return lista.filter((r) => r.status === STATUS.VALIDANDO);
}

// ---------- Cidadão ----------

// Cria o relato. Com estação no ponto, já entra em VALIDANDO; sem estação, fica RECEBIDO.
export async function criarRelato({ usuarioId, paradaId, tipo, descricao, cep, fotoUri }) {
  if (!buscarParada(paradaId)) throw new ErroRelato('Escolha uma parada válida.');
  const estacao = buscarEstacaoDaParada(paradaId);
  const agora = agoraISO();

  const historico = [entradaStatus(STATUS.RECEBIDO, null, agora)];
  if (estacao) {
    historico.push(
      entradaStatus(STATUS.VALIDANDO, `A estação ${estacao.codigo} começou a medir a luz.`, agora)
    );
  } else {
    historico.push(
      entradaNota('Sem estação neste ponto. A equipe vai analisar o relato sem medição.', agora)
    );
  }

  const relato = {
    id: gerarId(),
    origem: ORIGEM.CIDADAO,
    usuarioId,
    paradaId,
    tipo,
    descricao: String(descricao).trim(),
    cep: apenasDigitos(cep),
    fotoUri: fotoUri || null,
    status: estacao ? STATUS.VALIDANDO : STATUS.RECEBIDO,
    criadoEm: agora,
    atualizadoEm: agora,
    resolvidoEm: null,
    semEstacao: !estacao,
    medicao: null,
    historico,
  };

  await storage.atualizarLista(CHAVES.RELATOS, (lista) => [relato, ...lista]);
  return relato;
}

// ---------- Estação (simulador IoT) ----------

// Resultado da validação feita pela estação: CONFIRMADO (luz ruim) ou CONTESTADO (ADEQUADA).
export async function registrarValidacao(relatoId, medicao) {
  const atualizado = await alterarRelato(relatoId, (r) => {
    if (r.status !== STATUS.VALIDANDO) return null; // já validado (evita duplicar)

    const ruim = ESTADOS_RUINS.includes(medicao.estado);
    const adequada = medicao.estado === ESTADO_LUZ.ADEQUADA;
    const textoMedicao = `A estação mediu ${formatarLux(medicao.lux)} lux às ${formatarHora(medicao.em)} (${INFO_ESTADO_LUZ[medicao.estado].rotulo.toLowerCase()}).`;

    if (!ruim && !adequada) {
      // Sensor sem leitura confiável: volta para RECEBIDO e a equipe analisa.
      return {
        ...r,
        status: STATUS.RECEBIDO,
        medicao,
        historico: [
          ...r.historico,
          entradaStatus(STATUS.RECEBIDO, 'O sensor da estação não deu uma leitura confiável. A equipe vai analisar.', medicao.em),
        ],
      };
    }

    return {
      ...r,
      status: ruim ? STATUS.CONFIRMADO : STATUS.CONTESTADO,
      medicao,
      historico: [
        ...r.historico,
        entradaStatus(ruim ? STATUS.CONFIRMADO : STATUS.CONTESTADO, textoMedicao, medicao.em),
      ],
    };
  });

  if (!atualizado) return null;

  const parada = nomeParada(atualizado.paradaId);
  const lux = formatarLux(medicao.lux);
  if (atualizado.status === STATUS.CONFIRMADO) {
    await alertaService.criarAlerta({
      usuarioId: atualizado.usuarioId,
      relatoId: atualizado.id,
      titulo: 'Seu relato foi confirmado',
      mensagem: `${parada}: a estação mediu ${lux} lux. O pedido foi para a fila da manutenção.`,
    });
    await alertaService.criarAlerta({
      usuarioId: DESTINO_AGENTES,
      relatoId: atualizado.id,
      titulo: 'Relato confirmado pela estação',
      mensagem: `${parada}: ${lux} lux (${INFO_ESTADO_LUZ[medicao.estado].rotulo.toLowerCase()}).`,
    });
  } else if (atualizado.status === STATUS.CONTESTADO) {
    await alertaService.criarAlerta({
      usuarioId: atualizado.usuarioId,
      relatoId: atualizado.id,
      titulo: 'Seu relato vai ser revisado',
      mensagem: `${parada}: a estação mediu ${lux} lux, que é luz adequada. A equipe vai revisar.`,
    });
  }
  return atualizado;
}

// Chamado automático após várias janelas ruins seguidas.
// Se já houver item aberto na parada, só registra uma nota nele (agrupa, não duplica).
export async function abrirChamadoDaEstacao({ estacaoId, paradaId, medicao }) {
  const estacao = ESTACOES.find((e) => e.id === estacaoId);
  const textoMedicao = `A estação ${estacao?.codigo || ''} registrou ${JANELAS_RUINS_PARA_ALERTA} medições seguidas com ${INFO_ESTADO_LUZ[medicao.estado].rotulo.toLowerCase()} (${formatarLux(medicao.lux)} lux às ${formatarHora(medicao.em)}).`;
  let resultado = { criado: false, relato: null };

  await storage.atualizarLista(CHAVES.RELATOS, (lista) => {
    const indice = lista.findIndex((r) => r.paradaId === paradaId && estaAberto(r));
    if (indice >= 0) {
      const existente = lista[indice];
      const atualizado = {
        ...existente,
        atualizadoEm: agoraISO(),
        historico: [...existente.historico, entradaNota(textoMedicao, medicao.em)],
      };
      const nova = [...lista];
      nova[indice] = atualizado;
      resultado = { criado: false, relato: atualizado };
      return nova;
    }

    const chamado = {
      id: gerarId(),
      origem: ORIGEM.ESTACAO,
      usuarioId: null,
      paradaId,
      tipo: TIPO_CHAMADO_ESTACAO.id,
      descricao: 'Chamado aberto automaticamente pela estação de medição.',
      cep: '',
      fotoUri: null,
      status: STATUS.CONFIRMADO,
      criadoEm: medicao.em,
      atualizadoEm: medicao.em,
      resolvidoEm: null,
      semEstacao: false,
      medicao,
      historico: [entradaStatus(STATUS.CONFIRMADO, textoMedicao, medicao.em)],
    };
    resultado = { criado: true, relato: chamado };
    return [chamado, ...lista];
  });

  await alertaService.criarAlerta({
    usuarioId: DESTINO_AGENTES,
    relatoId: resultado.relato.id,
    titulo: resultado.criado ? 'Novo chamado automático' : 'Estação reforçou um chamado aberto',
    mensagem: `${nomeParada(paradaId)}: ${textoMedicao}`,
  });
  return resultado;
}

// A estação voltou a medir luz ADEQUADA: anota nos chamados abertos da parada, sem fechar.
export async function registrarEstacaoNormalizada({ paradaId, medicao }) {
  const texto = `A estação voltou a medir luz adequada (${formatarLux(medicao.lux)} lux às ${formatarHora(medicao.em)}). O chamado continua aberto até o agente fechar.`;
  await storage.atualizarLista(CHAVES.RELATOS, (lista) =>
    lista.map((r) =>
      r.paradaId === paradaId && r.origem === ORIGEM.ESTACAO && estaAberto(r)
        ? { ...r, atualizadoEm: agoraISO(), historico: [...r.historico, entradaNota(texto, medicao.em)] }
        : r
    )
  );
}

// ---------- Agente ----------

export function proximosStatus(relato) {
  return TRANSICOES_AGENTE[relato.status] || [];
}

export async function avancarStatus(relatoId, novoStatus, nota = null) {
  const atualizado = await alterarRelato(relatoId, (r) => {
    if (!proximosStatus(r).includes(novoStatus)) {
      throw new ErroRelato('Esta mudança de status não é permitida.');
    }
    const agora = agoraISO();
    return {
      ...r,
      status: novoStatus,
      resolvidoEm: novoStatus === STATUS.RESOLVIDO ? agora : r.resolvidoEm,
      historico: [...r.historico, entradaStatus(novoStatus, nota, agora)],
    };
  });

  if (novoStatus === STATUS.RESOLVIDO && atualizado.origem === ORIGEM.CIDADAO && atualizado.usuarioId) {
    await alertaService.criarAlerta({
      usuarioId: atualizado.usuarioId,
      relatoId: atualizado.id,
      titulo: 'Ponto consertado',
      mensagem: `A iluminação em ${nomeParada(atualizado.paradaId)} foi consertada. Obrigado por avisar!`,
    });
  }
  return atualizado;
}
