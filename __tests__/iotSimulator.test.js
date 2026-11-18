import { classificarJanela, gerarLux, mediana, contarSaltos } from '../src/services/iotSimulator';
import { ESTADO_LUZ } from '../src/constants/status';
import {
  CENARIO,
  FAIXAS_CENARIO,
  LUX_SATURADO,
  LEITURAS_POR_JANELA,
} from '../src/constants/limiares';

const janelaDoCenario = (cenario) =>
  Array.from({ length: LEITURAS_POR_JANELA }, (_, i) => gerarLux(cenario, i));

describe('classificarJanela (função pura)', () => {
  test('ADEQUADA: mediana de 10 lux ou mais', () => {
    const r = classificarJanela([28, 31, 25, 33, 40, 29, 35, 27, 30, 32]);
    expect(r.estado).toBe(ESTADO_LUZ.ADEQUADA);
    expect(r.lux).toBe(30.5);
  });

  test('ADEQUADA no limite exato de 10 lux', () => {
    expect(classificarJanela(Array(10).fill(10)).estado).toBe(ESTADO_LUZ.ADEQUADA);
  });

  test('FRACA: mediana entre 3 e 10 lux', () => {
    expect(classificarJanela([5, 6, 4, 8, 7, 6, 5, 9, 6, 7]).estado).toBe(ESTADO_LUZ.FRACA);
    expect(classificarJanela(Array(10).fill(3)).estado).toBe(ESTADO_LUZ.FRACA);
  });

  test('INEXISTENTE: mediana abaixo de 3 lux', () => {
    const r = classificarJanela([0.2, 0.8, 0.5, 1, 0, 0.4, 0.9, 0.3, 0.6, 0.1]);
    expect(r.estado).toBe(ESTADO_LUZ.INEXISTENTE);
  });

  test('OSCILANDO: vários saltos acima/abaixo de 10 lux', () => {
    const r = classificarJanela([40, 0.5, 39, 0.6, 41, 0.4, 40, 0.5, 39, 0.7]);
    expect(r.estado).toBe(ESTADO_LUZ.OSCILANDO);
    expect(r.saltos).toBe(9);
    expect(r.lux).toBe(0.4); // menor leitura: o momento em que apaga
  });

  test('poucos saltos não contam como oscilação', () => {
    // um único apagão rápido: 2 saltos
    expect(classificarJanela([30, 31, 0.5, 32, 30, 29, 33, 31, 30, 32]).estado).toBe(ESTADO_LUZ.ADEQUADA);
  });

  test('INDETERMINADO: sensor saturado não classifica', () => {
    expect(classificarJanela(Array(10).fill(LUX_SATURADO)).estado).toBe(ESTADO_LUZ.INDETERMINADO);
  });

  test('INDETERMINADO: janela vazia', () => {
    expect(classificarJanela([]).estado).toBe(ESTADO_LUZ.INDETERMINADO);
  });
});

describe('cenários simulados geram a classificação esperada', () => {
  test.each([
    [CENARIO.NORMAL, ESTADO_LUZ.ADEQUADA],
    [CENARIO.FRACA, ESTADO_LUZ.FRACA],
    [CENARIO.QUEIMA, ESTADO_LUZ.INEXISTENTE],
    [CENARIO.OSCILANDO, ESTADO_LUZ.OSCILANDO],
    [CENARIO.SENSOR_SUSPEITO, ESTADO_LUZ.INDETERMINADO],
  ])('cenário %s → %s', (cenario, esperado) => {
    for (let rodada = 0; rodada < 20; rodada += 1) {
      expect(classificarJanela(janelaDoCenario(cenario)).estado).toBe(esperado);
    }
  });

  test('leituras do cenário normal ficam na faixa 25–40 lux', () => {
    janelaDoCenario(CENARIO.NORMAL).forEach((lux) => {
      expect(lux).toBeGreaterThanOrEqual(FAIXAS_CENARIO[CENARIO.NORMAL].min);
      expect(lux).toBeLessThanOrEqual(FAIXAS_CENARIO[CENARIO.NORMAL].max);
    });
  });
});

describe('auxiliares', () => {
  test('mediana com quantidade par e ímpar', () => {
    expect(mediana([3, 1, 2])).toBe(2);
    expect(mediana([4, 1, 3, 2])).toBe(2.5);
    expect(mediana([])).toBeNull();
  });

  test('contarSaltos cruza o limiar de 10 lux', () => {
    expect(contarSaltos([5, 15, 5, 15])).toBe(3);
    expect(contarSaltos([15, 20, 30])).toBe(0);
  });
});
