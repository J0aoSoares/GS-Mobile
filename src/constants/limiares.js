// Limiares e tempos do app. Mesmo modelo da estação física (ESP32 + LDR no Wokwi).
// 3 e 10 lux: escolha do grupo com base nas classes P4 e P2 da ABNT NBR 5101:2012.

// ---- Classificação da luz (lux) ----
export const LUX_ADEQUADA = 10; // 10 lux ou mais = ADEQUADA
export const LUX_INEXISTENTE = 3; // abaixo de 3 = INEXISTENTE; entre 3 e 10 = FRACA

// ---- Janelas de leitura ----
export const LEITURAS_POR_JANELA = 10;
export const JANELAS_RUINS_PARA_ALERTA = 3;

// ---- Tempo entre leituras ----
export const INTERVALO_LEITURA_MS = 1000;
export const VELOCIDADE_DEMO = true; // encurta a janela para a gravação do vídeo
export const INTERVALO_LEITURA_DEMO_MS = 300;
export const INTERVALO_LEITURA_EFETIVO_MS = VELOCIDADE_DEMO
  ? INTERVALO_LEITURA_DEMO_MS
  : INTERVALO_LEITURA_MS;

// ---- Detecção de oscilação e de sensor com defeito ----
// Quantidade de "saltos" (cruzar o limiar de 10 lux entre leituras seguidas)
// a partir da qual a janela é considerada OSCILANDO.
export const MIN_SALTOS_OSCILACAO = 3;
// Valor que o sensor devolve quando está saturado (travado no topo da escala).
export const LUX_SATURADO = 9999;
// Se esta fração (ou mais) da janela estiver saturada, a janela não é classificada.
export const PROPORCAO_SATURADA_SUSPEITA = 0.5;

// ---- Cenários simulados ----
export const CENARIO = {
  NORMAL: 'normal',
  FRACA: 'fraca',
  QUEIMA: 'queima',
  OSCILANDO: 'oscilando',
  SENSOR_SUSPEITO: 'sensor_suspeito',
};

export const FAIXAS_CENARIO = {
  [CENARIO.NORMAL]: { min: 25, max: 40 },
  [CENARIO.FRACA]: { min: 4, max: 9 },
  [CENARIO.QUEIMA]: { min: 0, max: 1 },
  [CENARIO.OSCILANDO]: { baixo: 0.5, alto: 40, ruido: 0.5 },
};

// Quantas leituras ficam no histórico curto (em memória) de cada estação.
export const TAMANHO_HISTORICO_AO_VIVO = 30;

// ---- Prioridade (0 a 100) ----
export const PRIORIDADE = {
  TOTAL_MAX: 100,
  SEVERIDADE_MAX: 50,
  FLUXO_MAX: 20,
  TIPO_PONTO_MAX: 15,
  TEMPO_MAX: 10,
  REPETICAO_MAX: 5,
  FLUXO_SATURACAO_POR_HORA: 120,
  TEMPO_SATURACAO_HORAS: 48,
  PONTOS_POR_RELATO_CONFIRMADO: 1,
  PESO_SEVERIDADE: {
    INEXISTENTE: 1.0,
    OSCILANDO: 0.7,
    FRACA: 0.5,
    CONTESTADO: 0.1,
  },
  PESO_TIPO_PONTO: {
    parada: 1.0,
    travessia: 1.0,
    praca: 0.7,
    rua: 0.5,
  },
};

// ---- Regras dos formulários ----
export const VALIDACAO = {
  NOME_MIN: 3,
  SENHA_MIN: 6,
  DESCRICAO_MIN: 10,
  CPF_DIGITOS: 11,
  TELEFONE_DIGITOS: 11,
  CEP_DIGITOS: 8,
};

export const MASCARAS = {
  CPF: '999.999.999-99',
  TELEFONE: '(99) 99999-9999',
  CEP: '99999-999',
};

// ---- Conversões de tempo ----
export const TEMPO = {
  MS_POR_SEGUNDO: 1000,
  MS_POR_MINUTO: 60 * 1000,
  MS_POR_HORA: 60 * 60 * 1000,
  HORAS_POR_DIA: 24,
};
