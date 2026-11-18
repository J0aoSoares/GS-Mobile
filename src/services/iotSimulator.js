import {
  LUX_ADEQUADA,
  LUX_INEXISTENTE,
  LEITURAS_POR_JANELA,
  JANELAS_RUINS_PARA_ALERTA,
  INTERVALO_LEITURA_EFETIVO_MS,
  MIN_SALTOS_OSCILACAO,
  LUX_SATURADO,
  PROPORCAO_SATURADA_SUSPEITA,
  CENARIO,
  FAIXAS_CENARIO,
  TAMANHO_HISTORICO_AO_VIVO,
} from '../constants/limiares';
import { ESTADO_LUZ, ESTADOS_RUINS } from '../constants/status';
import { ESTACOES, buscarEstacaoDaParada } from '../constants/paradas';
import * as relatoService from './relatoService';

// Simulação das estações IoT (mesmo modelo do ESP32 + LDR do Wokwi).
// - O estado ao vivo (lux atual, histórico curto, cenário) fica só em memória.
// - Só o que importa vai para o armazenamento: validação de relatos, chamados e alertas.
// - Um único intervalo para o app inteiro (iniciar/parar chamados pelo RelatosContext).

// ===================== Funções puras (testáveis) =====================

const sortear = (min, max, aleatorio) => min + (max - min) * aleatorio();
const arredondar = (valor) => Math.round(valor * 10) / 10;

// Gera uma leitura de lux para o cenário. `indice` é a posição da leitura (usada na oscilação).
export function gerarLux(cenario, indice = 0, aleatorio = Math.random) {
  switch (cenario) {
    case CENARIO.FRACA:
    case CENARIO.QUEIMA:
    case CENARIO.NORMAL: {
      const { min, max } = FAIXAS_CENARIO[cenario];
      return arredondar(sortear(min, max, aleatorio));
    }
    case CENARIO.OSCILANDO: {
      const { baixo, alto, ruido } = FAIXAS_CENARIO[CENARIO.OSCILANDO];
      const base = indice % 2 === 0 ? alto : baixo;
      return arredondar(Math.max(0, base + sortear(-ruido, ruido, aleatorio)));
    }
    case CENARIO.SENSOR_SUSPEITO:
      return LUX_SATURADO;
    default: {
      const { min, max } = FAIXAS_CENARIO[CENARIO.NORMAL];
      return arredondar(sortear(min, max, aleatorio));
    }
  }
}

export function mediana(valores) {
  if (!valores.length) return null;
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 ? ordenados[meio] : (ordenados[meio - 1] + ordenados[meio]) / 2;
}

// Quantas vezes as leituras seguidas cruzam o limiar de luz adequada (para cima ou para baixo).
export function contarSaltos(valores, limiar = LUX_ADEQUADA) {
  let saltos = 0;
  for (let i = 1; i < valores.length; i += 1) {
    const antes = valores[i - 1] >= limiar;
    const depois = valores[i] >= limiar;
    if (antes !== depois) saltos += 1;
  }
  return saltos;
}

// Classifica uma janela de leituras: ADEQUADA, FRACA, INEXISTENTE, OSCILANDO
// ou INDETERMINADO (sensor saturado / sem leituras).
// Devolve { estado, lux, saltos }, onde lux é a mediana da janela
// (na oscilação, a menor leitura, que representa o momento em que a luz apaga).
export function classificarJanela(leituras) {
  const validas = (leituras || []).filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (!validas.length) return { estado: ESTADO_LUZ.INDETERMINADO, lux: null, saltos: 0 };

  const saturadas = validas.filter((v) => v >= LUX_SATURADO).length;
  if (saturadas / validas.length >= PROPORCAO_SATURADA_SUSPEITA) {
    return { estado: ESTADO_LUZ.INDETERMINADO, lux: null, saltos: 0 };
  }

  const uteis = validas.filter((v) => v < LUX_SATURADO);
  const saltos = contarSaltos(uteis);
  if (saltos >= MIN_SALTOS_OSCILACAO) {
    return { estado: ESTADO_LUZ.OSCILANDO, lux: Math.min(...uteis), saltos };
  }

  const lux = mediana(uteis);
  let estado = ESTADO_LUZ.FRACA;
  if (lux >= LUX_ADEQUADA) estado = ESTADO_LUZ.ADEQUADA;
  else if (lux < LUX_INEXISTENTE) estado = ESTADO_LUZ.INEXISTENTE;
  return { estado, lux: arredondar(lux), saltos };
}

// ===================== Estado em memória =====================

let estacoes = {};
let snapshot = [];
let timer = null;
let aoMudarDados = null;
const ouvintes = new Set();
const validacoes = new Map(); // relatoId → { estacaoId, leituras: [] }
let fila = Promise.resolve(); // serializa as gravações feitas pelo simulador

function criarEstadoInicial() {
  estacoes = {};
  ESTACOES.forEach((e) => {
    estacoes[e.id] = {
      id: e.id,
      codigo: e.codigo,
      paradaId: e.paradaId,
      cenario: e.cenarioInicial,
      luxAtual: null,
      historico: [],
      janela: [],
      estado: null,
      ultimaJanelaLux: null,
      janelasRuins: 0,
      emAlerta: false,
      indice: 0,
      atualizadoEm: null,
    };
  });
  publicar();
}

function publicar() {
  snapshot = Object.values(estacoes).map(({ janela, indice, ...publico }) => ({
    ...publico,
    leiturasNaJanela: janela.length,
  }));
  ouvintes.forEach((fn) => fn());
}

function enfileirar(tarefa) {
  fila = fila
    .then(tarefa)
    .then(() => aoMudarDados?.())
    .catch((erro) => console.warn('[iot] falha ao gravar', erro));
  return fila;
}

function processarJanela(estacao, resultado, em) {
  estacao.estado = resultado.estado;
  estacao.ultimaJanelaLux = resultado.lux;
  const medicao = { lux: resultado.lux, estado: resultado.estado, em, estacaoId: estacao.id };

  if (ESTADOS_RUINS.includes(resultado.estado)) {
    estacao.janelasRuins += 1;
    // Exatamente na 3ª janela ruim seguida: um alerta e um chamado (sem repetir na 4ª, 5ª...).
    if (estacao.janelasRuins === JANELAS_RUINS_PARA_ALERTA) {
      estacao.emAlerta = true;
      enfileirar(() =>
        relatoService.abrirChamadoDaEstacao({
          estacaoId: estacao.id,
          paradaId: estacao.paradaId,
          medicao,
        })
      );
    }
  } else if (resultado.estado === ESTADO_LUZ.ADEQUADA) {
    if (estacao.emAlerta) {
      enfileirar(() => relatoService.registrarEstacaoNormalizada({ paradaId: estacao.paradaId, medicao }));
    }
    estacao.emAlerta = false;
    estacao.janelasRuins = 0;
  }
  // INDETERMINADO (sensor suspeito): não conta como janela ruim nem zera a sequência.
}

function concluirValidacao(relatoId, estacao, leituras, em) {
  const resultado = classificarJanela(leituras);
  const medicao = { lux: resultado.lux, estado: resultado.estado, em, estacaoId: estacao.id };
  enfileirar(() => relatoService.registrarValidacao(relatoId, medicao));
}

function lerSensores() {
  const em = new Date().toISOString();

  Object.values(estacoes).forEach((estacao) => {
    const lux = gerarLux(estacao.cenario, estacao.indice);
    estacao.indice += 1;
    estacao.luxAtual = lux;
    estacao.atualizadoEm = em;
    estacao.historico = [...estacao.historico, lux].slice(-TAMANHO_HISTORICO_AO_VIVO);
    estacao.janela.push(lux);

    // Validações de relatos pendentes nesta estação: cada uma mede uma janela nova.
    validacoes.forEach((v, relatoId) => {
      if (v.estacaoId !== estacao.id) return;
      v.leituras.push(lux);
      if (v.leituras.length >= LEITURAS_POR_JANELA) {
        validacoes.delete(relatoId);
        concluirValidacao(relatoId, estacao, v.leituras, em);
      }
    });

    if (estacao.janela.length >= LEITURAS_POR_JANELA) {
      const resultado = classificarJanela(estacao.janela);
      estacao.janela = [];
      processarJanela(estacao, resultado, em);
    }
  });

  publicar();
}

// ===================== API pública =====================

export async function iniciar({ aoMudarDados: callback } = {}) {
  aoMudarDados = callback || null;
  if (timer) return;
  if (!Object.keys(estacoes).length) criarEstadoInicial();
  timer = setInterval(lerSensores, INTERVALO_LEITURA_EFETIVO_MS);

  // Retoma validações que ficaram pela metade (ex.: app fechado durante a medição).
  try {
    const pendentes = await relatoService.listarPendentesDeValidacao();
    pendentes.forEach((r) => solicitarValidacao(r.id, r.paradaId));
  } catch (erro) {
    console.warn('[iot] não foi possível retomar validações', erro);
  }
}

// Para o intervalo. Devolve uma promessa que termina quando as gravações pendentes acabam.
export function parar() {
  if (timer) clearInterval(timer);
  timer = null;
  aoMudarDados = null;
  validacoes.clear();
  return fila;
}

// Para tudo e volta as estações aos cenários iniciais (usado ao restaurar a demonstração).
export async function resetar() {
  await parar();
  criarEstadoInicial();
}

export function estaRodando() {
  return Boolean(timer);
}

// Pede para a estação da parada medir uma janela nova e validar o relato.
export function solicitarValidacao(relatoId, paradaId) {
  const estacao = buscarEstacaoDaParada(paradaId);
  if (!estacao || validacoes.has(relatoId)) return false;
  validacoes.set(relatoId, { estacaoId: estacao.id, leituras: [] });
  return true;
}

export function definirCenario(estacaoId, cenario) {
  const estacao = estacoes[estacaoId];
  if (!estacao || !Object.values(CENARIO).includes(cenario)) return;
  estacao.cenario = cenario;
  estacao.janela = []; // a próxima janela já reflete o novo cenário
  publicar();
}

// Para useSyncExternalStore: assinatura e leitura do estado ao vivo.
export function assinar(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export function obterEstacoes() {
  return snapshot;
}

// Garante que as estações existam antes da 1ª leitura (snapshot nunca fica vazio).
criarEstadoInicial();
