import { calcularPrioridade, ordenarPorPrioridade, textoExplicacao } from '../src/services/prioridadeService';
import { STATUS, ORIGEM, ESTADO_LUZ } from '../src/constants/status';
import { TEMPO } from '../src/constants/limiares';

const AGORA = new Date('2026-11-18T22:00:00Z').getTime();
const horasAtras = (h) => new Date(AGORA - h * TEMPO.MS_POR_HORA).toISOString();

const parada = { id: 'px', tipo: 'parada', fluxo: 120 };

function relato(dados = {}) {
  return {
    id: dados.id || 'r1',
    origem: ORIGEM.CIDADAO,
    paradaId: 'px',
    tipo: 'ponto_escuro',
    status: STATUS.CONFIRMADO,
    criadoEm: horasAtras(48),
    resolvidoEm: null,
    medicao: { lux: 0.5, estado: ESTADO_LUZ.INEXISTENTE },
    ...dados,
  };
}

const fator = (p, nome) => p.explicacao.find((f) => f.fator === nome);

describe('calcularPrioridade', () => {
  test('sempre devolve total e explicação com 5 fatores', () => {
    const p = calcularPrioridade(relato(), { parada, relatos: [], agora: AGORA });
    expect(p).toHaveProperty('total');
    expect(p.explicacao.map((f) => f.fator)).toEqual([
      'severidade',
      'fluxo de pedestres',
      'tipo do ponto',
      'tempo aberto',
      'relatos confirmados',
    ]);
    p.explicacao.forEach((f) => {
      expect(f.pontos).toBeGreaterThanOrEqual(0);
      expect(f.pontos).toBeLessThanOrEqual(f.max);
    });
  });

  test('pior caso chega a 100', () => {
    const r = relato();
    const outros = [1, 2, 3, 4, 5].map((i) => relato({ id: `o${i}` }));
    const p = calcularPrioridade(r, { parada, relatos: [r, ...outros], agora: AGORA });
    expect(p.total).toBe(100);
    expect(textoExplicacao(p)).toBe(
      'severidade 50/50 · fluxo de pedestres 20/20 · tipo do ponto 15/15 · tempo aberto 10/10 · relatos confirmados 5/5'
    );
  });

  test('pesos de severidade: INEXISTENTE 1,0 · OSCILANDO 0,7 · FRACA 0,5 · CONTESTADO 0,1', () => {
    const sev = (r) => fator(calcularPrioridade(r, { parada, agora: AGORA }), 'severidade').pontos;
    expect(sev(relato())).toBe(50);
    expect(sev(relato({ medicao: { estado: ESTADO_LUZ.OSCILANDO } }))).toBe(35);
    expect(sev(relato({ medicao: { estado: ESTADO_LUZ.FRACA } }))).toBe(25);
    expect(sev(relato({ status: STATUS.CONTESTADO, medicao: { estado: ESTADO_LUZ.ADEQUADA } }))).toBe(5);
  });

  test('sem medição usa o tipo relatado', () => {
    const r = relato({ status: STATUS.RECEBIDO, medicao: null, tipo: 'luz_piscando' });
    expect(fator(calcularPrioridade(r, { parada, agora: AGORA }), 'severidade').pontos).toBe(35);
  });

  test('fluxo satura em 120 pessoas/h', () => {
    const f = (fluxo) =>
      fator(calcularPrioridade(relato(), { parada: { ...parada, fluxo }, agora: AGORA }), 'fluxo de pedestres').pontos;
    expect(f(0)).toBe(0);
    expect(f(60)).toBe(10);
    expect(f(120)).toBe(20);
    expect(f(500)).toBe(20);
  });

  test('tipo do ponto: parada/travessia 1,0 · praça 0,7 · rua 0,5', () => {
    const t = (tipo) =>
      fator(calcularPrioridade(relato(), { parada: { ...parada, tipo }, agora: AGORA }), 'tipo do ponto').pontos;
    expect(t('parada')).toBe(15);
    expect(t('travessia')).toBe(15);
    expect(t('praca')).toBe(11);
    expect(t('rua')).toBe(8);
  });

  test('tempo aberto satura em 48 h', () => {
    const t = (h) =>
      fator(calcularPrioridade(relato({ criadoEm: horasAtras(h) }), { parada, agora: AGORA }), 'tempo aberto').pontos;
    expect(t(0)).toBe(0);
    expect(t(24)).toBe(5);
    expect(t(48)).toBe(10);
    expect(t(200)).toBe(10);
  });

  test('relatos confirmados na mesma parada: 1 ponto cada, até 5', () => {
    const r = relato();
    const contestado = relato({ id: 'c', status: STATUS.CONTESTADO });
    const outraParada = relato({ id: 'o', paradaId: 'py' });
    const p = calcularPrioridade(r, { parada, relatos: [r, contestado, outraParada], agora: AGORA });
    expect(fator(p, 'relatos confirmados').pontos).toBe(1);
  });

  test('CONTESTADO fica com prioridade baixa', () => {
    const confirmado = calcularPrioridade(relato(), { parada, agora: AGORA });
    const contestado = calcularPrioridade(relato({ status: STATUS.CONTESTADO }), { parada, agora: AGORA });
    expect(contestado.total).toBeLessThan(confirmado.total);
  });
});

describe('ordenarPorPrioridade', () => {
  test('abertos primeiro, do maior para o menor; resolvidos no fim', () => {
    const lista = [
      relato({ id: 'resolvido', status: STATUS.RESOLVIDO, resolvidoEm: horasAtras(1) }),
      relato({ id: 'contestado', status: STATUS.CONTESTADO }),
      relato({ id: 'confirmado' }),
    ];
    const ids = ordenarPorPrioridade(lista, AGORA).map((i) => i.relato.id);
    expect(ids[ids.length - 1]).toBe('resolvido');
    expect(ids.indexOf('confirmado')).toBeLessThan(ids.indexOf('contestado'));
  });
});
