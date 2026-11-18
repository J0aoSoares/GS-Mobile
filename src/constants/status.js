// Status dos relatos/chamados e estados de luz da estação.
// Cada item tem texto + ícone (nunca só cor) e um texto simples para o cidadão.

export const STATUS = {
  RECEBIDO: 'RECEBIDO',
  VALIDANDO: 'VALIDANDO',
  CONFIRMADO: 'CONFIRMADO',
  CONTESTADO: 'CONTESTADO',
  EM_MANUTENCAO: 'EM_MANUTENCAO',
  RESOLVIDO: 'RESOLVIDO',
};

export const ORDEM_STATUS = [
  STATUS.RECEBIDO,
  STATUS.VALIDANDO,
  STATUS.CONFIRMADO,
  STATUS.CONTESTADO,
  STATUS.EM_MANUTENCAO,
  STATUS.RESOLVIDO,
];

export const INFO_STATUS = {
  [STATUS.RECEBIDO]: {
    rotulo: 'Recebido',
    icone: 'mail-outline',
    tom: 'neutro',
    texto: 'Recebemos seu relato. A equipe da prefeitura vai analisar.',
  },
  [STATUS.VALIDANDO]: {
    rotulo: 'Verificando',
    icone: 'hourglass-outline',
    tom: 'info',
    texto: 'A estação deste ponto está medindo a luz agora. Leva poucos segundos.',
  },
  [STATUS.CONFIRMADO]: {
    rotulo: 'Confirmado',
    icone: 'alert-circle',
    tom: 'aviso',
    texto: 'A estação confirmou que falta luz neste ponto. O pedido foi para a fila da manutenção.',
  },
  [STATUS.CONTESTADO]: {
    rotulo: 'Em revisão',
    icone: 'help-circle',
    tom: 'neutro',
    texto: 'A estação mediu luz adequada neste ponto. A equipe vai revisar.',
  },
  [STATUS.EM_MANUTENCAO]: {
    rotulo: 'Em manutenção',
    icone: 'construct',
    tom: 'info',
    texto: 'A equipe de manutenção está cuidando deste ponto.',
  },
  [STATUS.RESOLVIDO]: {
    rotulo: 'Resolvido',
    icone: 'checkmark-done-circle',
    tom: 'sucesso',
    texto: 'Pronto! A iluminação deste ponto foi consertada.',
  },
};

// Status considerados "abertos" (ainda exigem ação).
export const STATUS_ABERTOS = [
  STATUS.RECEBIDO,
  STATUS.VALIDANDO,
  STATUS.CONFIRMADO,
  STATUS.CONTESTADO,
  STATUS.EM_MANUTENCAO,
];

// Para onde o agente pode levar o chamado a partir de cada status.
export const TRANSICOES_AGENTE = {
  [STATUS.RECEBIDO]: [STATUS.EM_MANUTENCAO],
  [STATUS.VALIDANDO]: [],
  [STATUS.CONFIRMADO]: [STATUS.EM_MANUTENCAO],
  [STATUS.CONTESTADO]: [STATUS.EM_MANUTENCAO, STATUS.RESOLVIDO],
  [STATUS.EM_MANUTENCAO]: [STATUS.RESOLVIDO],
  [STATUS.RESOLVIDO]: [],
};

export const ROTULO_ACAO_AGENTE = {
  [STATUS.EM_MANUTENCAO]: 'Iniciar manutenção',
  [STATUS.RESOLVIDO]: 'Marcar como resolvido',
};

// ---- Estados de luz (classificação da janela de leituras) ----
export const ESTADO_LUZ = {
  ADEQUADA: 'ADEQUADA',
  FRACA: 'FRACA',
  INEXISTENTE: 'INEXISTENTE',
  OSCILANDO: 'OSCILANDO',
  INDETERMINADO: 'INDETERMINADO',
};

export const ESTADOS_RUINS = [ESTADO_LUZ.FRACA, ESTADO_LUZ.INEXISTENTE, ESTADO_LUZ.OSCILANDO];

export const INFO_ESTADO_LUZ = {
  [ESTADO_LUZ.ADEQUADA]: {
    rotulo: 'Luz boa',
    icone: 'sunny',
    tom: 'sucesso',
    texto: 'A luz está boa neste ponto.',
  },
  [ESTADO_LUZ.FRACA]: {
    rotulo: 'Luz fraca',
    icone: 'partly-sunny',
    tom: 'aviso',
    texto: 'A luz está fraca neste ponto.',
  },
  [ESTADO_LUZ.INEXISTENTE]: {
    rotulo: 'Ponto escuro',
    icone: 'moon',
    tom: 'erro',
    texto: 'Este ponto está sem luz.',
  },
  [ESTADO_LUZ.OSCILANDO]: {
    rotulo: 'Luz piscando',
    icone: 'flash',
    tom: 'aviso',
    texto: 'A luz está piscando neste ponto.',
  },
  [ESTADO_LUZ.INDETERMINADO]: {
    rotulo: 'Sem leitura',
    icone: 'warning',
    tom: 'neutro',
    texto: 'O sensor está com problema. A equipe foi avisada.',
  },
};

export const INFO_SEM_MEDICAO = {
  rotulo: 'Medindo...',
  icone: 'time-outline',
  tom: 'neutro',
  texto: 'A estação ainda está fazendo a primeira medição.',
};

export const INFO_SEM_ESTACAO = {
  rotulo: 'Sem estação',
  icone: 'radio-outline',
  tom: 'neutro',
  texto: 'Este ponto ainda não tem estação de medição.',
};

export const PERFIL = {
  CIDADAO: 'cidadao',
  AGENTE: 'agente',
};

export const ROTULO_PERFIL = {
  [PERFIL.CIDADAO]: 'Cidadão',
  [PERFIL.AGENTE]: 'Agente de manutenção',
};

export const ORIGEM = {
  CIDADAO: 'cidadao',
  ESTACAO: 'estacao',
};

export const DESTINO_AGENTES = 'agentes';
