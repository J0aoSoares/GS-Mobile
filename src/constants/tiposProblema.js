import { ESTADO_LUZ } from './status';

// Os 3 tipos de problema que o cidadão escolhe, em linguagem simples.
// estadoEquivalente é usado na prioridade enquanto não há medição da estação.

export const TIPOS_PROBLEMA = [
  {
    id: 'ponto_escuro',
    rotulo: 'Ponto escuro',
    descricao: 'Não tem luz nenhuma',
    icone: 'moon',
    estadoEquivalente: ESTADO_LUZ.INEXISTENTE,
  },
  {
    id: 'luz_fraca',
    rotulo: 'Luz fraca',
    descricao: 'Tem luz, mas não dá para ver bem',
    icone: 'partly-sunny',
    estadoEquivalente: ESTADO_LUZ.FRACA,
  },
  {
    id: 'luz_piscando',
    rotulo: 'Luz piscando',
    descricao: 'A luz acende e apaga',
    icone: 'flash',
    estadoEquivalente: ESTADO_LUZ.OSCILANDO,
  },
];

export const TIPO_CHAMADO_ESTACAO = {
  id: 'alerta_estacao',
  rotulo: 'Alerta da estação',
  descricao: 'A estação detectou luz ruim por várias medições seguidas',
  icone: 'radio',
};

export function buscarTipoProblema(id) {
  if (id === TIPO_CHAMADO_ESTACAO.id) return TIPO_CHAMADO_ESTACAO;
  return TIPOS_PROBLEMA.find((t) => t.id === id) || null;
}
