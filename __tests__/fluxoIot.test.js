// Teste de integração do fluxo IoT com o AsyncStorage simulado:
// validação de relato, chamado automático sem duplicar, estação normalizada.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as iot from '../src/services/iotSimulator';
import * as relatoService from '../src/services/relatoService';
import * as alertaService from '../src/services/alertaService';
import * as authService from '../src/services/authService';
import { garantirSeed, USUARIOS_TESTE } from '../src/services/seedService';
import {
  CENARIO,
  INTERVALO_LEITURA_EFETIVO_MS,
  LEITURAS_POR_JANELA,
  JANELAS_RUINS_PARA_ALERTA,
} from '../src/constants/limiares';
import { STATUS, ORIGEM, PERFIL, ESTADO_LUZ } from '../src/constants/status';

const flush = async () => {
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setImmediate(r));
  }
};

async function avancarJanelas(n) {
  for (let i = 0; i < n * LEITURAS_POR_JANELA; i += 1) {
    jest.advanceTimersByTime(INTERVALO_LEITURA_EFETIVO_MS);
    // eslint-disable-next-line no-await-in-loop
    await flush();
  }
}

const abertosNaParada = (relatos, paradaId) =>
  relatos.filter((r) => r.paradaId === paradaId && r.status !== STATUS.RESOLVIDO);

describe('fluxo IoT integrado', () => {
  let cidadao;

  beforeAll(async () => {
    jest.useFakeTimers({ doNotFake: ['setImmediate', 'nextTick'] });
    await AsyncStorage.clear();
    await garantirSeed();
    cidadao = await authService.entrar(USUARIOS_TESTE.cidadao.email, USUARIOS_TESTE.cidadao.senha);
    await iot.resetar();
    await iot.iniciar();
  });

  afterAll(async () => {
    await iot.parar();
    jest.useRealTimers();
  });

  test('login de teste funciona e senha errada é recusada', async () => {
    expect(cidadao.perfil).toBe(PERFIL.CIDADAO);
    expect(cidadao.senhaHash).toBeUndefined();
    await expect(authService.entrar(USUARIOS_TESTE.cidadao.email, 'errada1')).rejects.toThrow(
      'E-mail ou senha incorretos'
    );
  });

  test('3 janelas ruins seguidas abrem um único chamado automático', async () => {
    // e3 começa oscilando na p3 (sem relato aberto no seed).
    await avancarJanelas(JANELAS_RUINS_PARA_ALERTA);
    let relatos = await relatoService.listarRelatos();
    let p3 = abertosNaParada(relatos, 'p3');
    expect(p3).toHaveLength(1);
    expect(p3[0].origem).toBe(ORIGEM.ESTACAO);
    expect(p3[0].medicao.estado).toBe(ESTADO_LUZ.OSCILANDO);

    // Mais janelas ruins não duplicam.
    await avancarJanelas(JANELAS_RUINS_PARA_ALERTA);
    relatos = await relatoService.listarRelatos();
    p3 = abertosNaParada(relatos, 'p3');
    expect(p3).toHaveLength(1);

    const alertasAgentes = await alertaService.listarAlertas({ perfil: PERFIL.AGENTE });
    expect(alertasAgentes.filter((a) => a.titulo === 'Novo chamado automático')).toHaveLength(1);
    // Só a p3 gera chamado novo: a p2 (fraca) já tem relato aberto e recebe uma nota.
  });

  test('parada com relato aberto recebe nota em vez de chamado novo', async () => {
    const relatos = await relatoService.listarRelatos();
    const p2 = abertosNaParada(relatos, 'p2');
    expect(p2).toHaveLength(1);
    expect(p2[0].origem).toBe(ORIGEM.CIDADAO);
    expect(p2[0].historico.some((h) => h.tipo === 'nota')).toBe(true);
  });

  test('relato em ponto com luz boa vira CONTESTADO', async () => {
    const relato = await relatoService.criarRelato({
      usuarioId: cidadao.id,
      paradaId: 'p1',
      tipo: 'ponto_escuro',
      descricao: 'Ponto parece escuro hoje',
    });
    expect(relato.status).toBe(STATUS.VALIDANDO);
    iot.solicitarValidacao(relato.id, relato.paradaId);
    await avancarJanelas(1);
    const validado = await relatoService.buscarRelato(relato.id);
    expect(validado.status).toBe(STATUS.CONTESTADO);
    expect(validado.medicao.estado).toBe(ESTADO_LUZ.ADEQUADA);
  });

  test('relato em ponto com lâmpada queimada vira CONFIRMADO e avisa o cidadão', async () => {
    iot.definirCenario('e4', CENARIO.QUEIMA);
    const relato = await relatoService.criarRelato({
      usuarioId: cidadao.id,
      paradaId: 'p4',
      tipo: 'ponto_escuro',
      descricao: 'Poste da estação apagado',
    });
    iot.solicitarValidacao(relato.id, relato.paradaId);
    await avancarJanelas(1);
    const validado = await relatoService.buscarRelato(relato.id);
    expect(validado.status).toBe(STATUS.CONFIRMADO);
    expect(validado.medicao.estado).toBe(ESTADO_LUZ.INEXISTENTE);
    const alertas = await alertaService.listarAlertas(cidadao);
    expect(alertas.some((a) => a.relatoId === relato.id && a.titulo === 'Seu relato foi confirmado')).toBe(true);
  });

  test('parada sem estação fica RECEBIDO', async () => {
    const relato = await relatoService.criarRelato({
      usuarioId: cidadao.id,
      paradaId: 'p6',
      tipo: 'luz_fraca',
      descricao: 'Praça bem escura à noite',
    });
    expect(relato.status).toBe(STATUS.RECEBIDO);
    expect(relato.semEstacao).toBe(true);
  });

  test('estação normalizada registra nota sem fechar o chamado', async () => {
    iot.definirCenario('e3', CENARIO.NORMAL);
    await avancarJanelas(1);
    const relatos = await relatoService.listarRelatos();
    const [chamado] = abertosNaParada(relatos, 'p3');
    expect(chamado.status).toBe(STATUS.CONFIRMADO);
    expect(chamado.historico.some((h) => h.texto?.includes('voltou a medir luz adequada'))).toBe(true);
  });

  test('agente resolve e o cidadão recebe alerta', async () => {
    const relatos = await relatoService.listarRelatos();
    const alvo = relatos.find((r) => r.paradaId === 'p4' && r.status === STATUS.CONFIRMADO);
    await relatoService.avancarStatus(alvo.id, STATUS.EM_MANUTENCAO);
    await expect(relatoService.avancarStatus(alvo.id, STATUS.CONFIRMADO)).rejects.toThrow();
    const resolvido = await relatoService.avancarStatus(alvo.id, STATUS.RESOLVIDO);
    expect(resolvido.resolvidoEm).toBeTruthy();
    const alertas = await alertaService.listarAlertas(cidadao);
    expect(alertas.some((a) => a.relatoId === alvo.id && a.titulo === 'Ponto consertado')).toBe(true);
  });

  test('cadastro bloqueia e-mail e CPF repetidos', async () => {
    await expect(
      authService.cadastrar({
        nome: 'Outra Pessoa',
        cpf: '529.982.247-25',
        email: 'nova@exemplo.com',
        telefone: '(11) 98888-7777',
        senha: 'abc123',
      })
    ).rejects.toThrow('CPF');
    await expect(
      authService.cadastrar({
        nome: 'Outra Pessoa',
        cpf: '935.411.347-80',
        email: USUARIOS_TESTE.cidadao.email,
        telefone: '(11) 98888-7777',
        senha: 'abc123',
      })
    ).rejects.toThrow('e-mail');
  });
});
