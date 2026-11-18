import { PRIORIDADE, TEMPO } from '../constants/limiares';
import { STATUS, ORIGEM } from '../constants/status';
import { buscarParada } from '../constants/paradas';
import { buscarTipoProblema } from '../constants/tiposProblema';

// Prioridade de 0 a 100, sempre com a explicação de cada fator:
// { total, explicacao: [{ fator, pontos, max, detalhe }] }

const STATUS_CONFIRMADOS = [STATUS.CONFIRMADO, STATUS.EM_MANUTENCAO];

const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));

// Estado que define a severidade: medição da estação, ou o tipo relatado se não houver medição útil.
function estadoParaSeveridade(relato) {
  const medido = relato.medicao?.estado;
  if (medido && PRIORIDADE.PESO_SEVERIDADE[medido] !== undefined) return medido;
  return buscarTipoProblema(relato.tipo)?.estadoEquivalente || null;
}

export function calcularSeveridade(relato) {
  const chave = relato.status === STATUS.CONTESTADO ? STATUS.CONTESTADO : estadoParaSeveridade(relato);
  const peso = PRIORIDADE.PESO_SEVERIDADE[chave] ?? 0;
  return {
    fator: 'severidade',
    pontos: Math.round(peso * PRIORIDADE.SEVERIDADE_MAX),
    max: PRIORIDADE.SEVERIDADE_MAX,
    detalhe: chave ? `${chave} (peso ${peso.toFixed(1).replace('.', ',')})` : 'sem informação',
  };
}

export function calcularFluxo(parada) {
  const fluxo = limitar(parada?.fluxo ?? 0, 0, PRIORIDADE.FLUXO_SATURACAO_POR_HORA);
  return {
    fator: 'fluxo de pedestres',
    pontos: Math.round((fluxo / PRIORIDADE.FLUXO_SATURACAO_POR_HORA) * PRIORIDADE.FLUXO_MAX),
    max: PRIORIDADE.FLUXO_MAX,
    detalhe: `${parada?.fluxo ?? 0} pessoas/h à noite`,
  };
}

export function calcularTipoPonto(parada) {
  const peso = PRIORIDADE.PESO_TIPO_PONTO[parada?.tipo] ?? 0;
  return {
    fator: 'tipo do ponto',
    pontos: Math.round(peso * PRIORIDADE.TIPO_PONTO_MAX),
    max: PRIORIDADE.TIPO_PONTO_MAX,
    detalhe: `${parada?.tipo || 'desconhecido'} (peso ${peso.toFixed(1).replace('.', ',')})`,
  };
}

export function calcularTempoAberto(relato, agora = Date.now()) {
  const fim = relato.resolvidoEm ? new Date(relato.resolvidoEm).getTime() : agora;
  const horas = Math.max(0, (fim - new Date(relato.criadoEm).getTime()) / TEMPO.MS_POR_HORA);
  const fracao = Math.min(1, horas / PRIORIDADE.TEMPO_SATURACAO_HORAS);
  return {
    fator: 'tempo aberto',
    pontos: Math.round(fracao * PRIORIDADE.TEMPO_MAX),
    max: PRIORIDADE.TEMPO_MAX,
    detalhe: `${Math.floor(horas)} h (satura em ${PRIORIDADE.TEMPO_SATURACAO_HORAS} h)`,
  };
}

// Relatos de cidadãos confirmados pela estação (e ainda não resolvidos) na mesma parada.
export function contarConfirmadosNaParada(paradaId, relatos = []) {
  return relatos.filter(
    (r) =>
      r.paradaId === paradaId &&
      r.origem === ORIGEM.CIDADAO &&
      STATUS_CONFIRMADOS.includes(r.status)
  ).length;
}

export function calcularRepeticao(relato, relatos = []) {
  const quantidade = contarConfirmadosNaParada(relato.paradaId, relatos);
  return {
    fator: 'relatos confirmados',
    pontos: Math.min(PRIORIDADE.REPETICAO_MAX, quantidade * PRIORIDADE.PONTOS_POR_RELATO_CONFIRMADO),
    max: PRIORIDADE.REPETICAO_MAX,
    detalhe: `${quantidade} na mesma parada`,
  };
}

// Calcula a prioridade de um relato/chamado.
// `parada` é opcional (é buscada pelo id); `relatos` é a lista completa, para contar repetições.
export function calcularPrioridade(relato, { parada, relatos = [], agora = Date.now() } = {}) {
  const local = parada || buscarParada(relato.paradaId);
  const explicacao = [
    calcularSeveridade(relato),
    calcularFluxo(local),
    calcularTipoPonto(local),
    calcularTempoAberto(relato, agora),
    calcularRepeticao(relato, relatos),
  ];
  const soma = explicacao.reduce((acc, f) => acc + f.pontos, 0);
  return { total: limitar(soma, 0, PRIORIDADE.TOTAL_MAX), explicacao };
}

// Fila do agente: abertos primeiro (maior prioridade no topo), resolvidos no fim.
export function ordenarPorPrioridade(relatos, agora = Date.now()) {
  return relatos
    .map((relato) => ({ relato, prioridade: calcularPrioridade(relato, { relatos, agora }) }))
    .sort((a, b) => {
      const aResolvido = a.relato.status === STATUS.RESOLVIDO;
      const bResolvido = b.relato.status === STATUS.RESOLVIDO;
      if (aResolvido !== bResolvido) return aResolvido ? 1 : -1;
      if (aResolvido) return new Date(b.relato.resolvidoEm) - new Date(a.relato.resolvidoEm);
      return b.prioridade.total - a.prioridade.total;
    });
}

export function textoExplicacao(prioridade) {
  return prioridade.explicacao.map((f) => `${f.fator} ${f.pontos}/${f.max}`).join(' · ');
}
