import { CENARIO } from './limiares';

// Paradas de Osasco (SP) usadas no seed. Coordenadas aproximadas.
// fluxo = pedestres por hora à noite (valor simulado, 0 a 120).

export const TIPO_PONTO = {
  PARADA: 'parada',
  TRAVESSIA: 'travessia',
  PRACA: 'praca',
  RUA: 'rua',
};

export const ROTULO_TIPO_PONTO = {
  [TIPO_PONTO.PARADA]: 'Parada de ônibus',
  [TIPO_PONTO.TRAVESSIA]: 'Travessia de pedestres',
  [TIPO_PONTO.PRACA]: 'Praça',
  [TIPO_PONTO.RUA]: 'Rua',
};

export const PARADAS = [
  {
    id: 'p1',
    nome: 'Av. dos Autonomistas (Shopping União)',
    tipo: TIPO_PONTO.PARADA,
    fluxo: 110,
    latitude: -23.5329,
    longitude: -46.7767,
  },
  {
    id: 'p2',
    nome: 'Av. Maria Campos',
    tipo: TIPO_PONTO.PARADA,
    fluxo: 80,
    latitude: -23.5205,
    longitude: -46.7781,
  },
  {
    id: 'p3',
    nome: 'Av. João Batista (travessia)',
    tipo: TIPO_PONTO.TRAVESSIA,
    fluxo: 95,
    latitude: -23.5352,
    longitude: -46.7863,
  },
  {
    id: 'p4',
    nome: 'Estação Osasco (CPTM)',
    tipo: TIPO_PONTO.PARADA,
    fluxo: 120,
    latitude: -23.5266,
    longitude: -46.7752,
  },
  {
    id: 'p5',
    nome: 'Rua Antônio Agú',
    tipo: TIPO_PONTO.RUA,
    fluxo: 60,
    latitude: -23.5318,
    longitude: -46.7792,
  },
  {
    id: 'p6',
    nome: 'Praça do Centro',
    tipo: TIPO_PONTO.PRACA,
    fluxo: 40,
    latitude: -23.534,
    longitude: -46.78,
  },
];

// 5 estações: a Praça do Centro (p6) fica sem estação de propósito.
export const ESTACOES = [
  { id: 'e1', codigo: 'LS-01', paradaId: 'p1', cenarioInicial: CENARIO.NORMAL },
  { id: 'e2', codigo: 'LS-02', paradaId: 'p2', cenarioInicial: CENARIO.FRACA },
  { id: 'e3', codigo: 'LS-03', paradaId: 'p3', cenarioInicial: CENARIO.OSCILANDO },
  { id: 'e4', codigo: 'LS-04', paradaId: 'p4', cenarioInicial: CENARIO.NORMAL },
  { id: 'e5', codigo: 'LS-05', paradaId: 'p5', cenarioInicial: CENARIO.NORMAL },
];

export function buscarParada(paradaId) {
  return PARADAS.find((p) => p.id === paradaId) || null;
}

export function buscarEstacaoDaParada(paradaId) {
  return ESTACOES.find((e) => e.paradaId === paradaId) || null;
}
