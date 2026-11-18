import { CHAVES, TODAS_AS_CHAVES } from '../constants/armazenamento';
import { PERFIL, STATUS, ORIGEM, ESTADO_LUZ, DESTINO_AGENTES } from '../constants/status';
import { TEMPO } from '../constants/limiares';
import { gerarId } from '../utils/id';
import * as storage from './storageService';
import { montarUsuario } from './authService';

// Dados de demonstração: rodam só na 1ª execução (marca @luzsegura:seed_v1).

export const USUARIOS_TESTE = {
  cidadao: { email: 'cidadao@luzsegura.app', senha: 'cidadao123' },
  agente: { email: 'agente@luzsegura.app', senha: 'agente123' },
};

const horasAtras = (agora, horas) => new Date(agora - horas * TEMPO.MS_POR_HORA).toISOString();

function passo(status, em, texto) {
  return { id: gerarId(), tipo: 'status', status, em, texto: texto || null };
}

function medicao(lux, estado, em) {
  return { lux, estado, em, estacaoId: null };
}

// Monta os 4 relatos antigos (status variados) do cidadão de teste.
function montarRelatos(cidadaoId, agora) {
  const h = (n) => horasAtras(agora, n);

  const base = (dados) => ({
    id: gerarId(),
    origem: ORIGEM.CIDADAO,
    usuarioId: cidadaoId,
    cep: '',
    fotoUri: null,
    semEstacao: false,
    resolvidoEm: null,
    ...dados,
    atualizadoEm: dados.historico[dados.historico.length - 1].em,
  });

  return [
    base({
      paradaId: 'p4',
      tipo: 'ponto_escuro',
      descricao: 'Poste da saída da estação está apagado faz dias.',
      status: STATUS.RESOLVIDO,
      criadoEm: h(72),
      resolvidoEm: h(20),
      medicao: { ...medicao(0.6, ESTADO_LUZ.INEXISTENTE, h(71.9)), estacaoId: 'e4' },
      historico: [
        passo(STATUS.RECEBIDO, h(72)),
        passo(STATUS.VALIDANDO, h(72)),
        passo(STATUS.CONFIRMADO, h(71.9)),
        passo(STATUS.EM_MANUTENCAO, h(48)),
        passo(STATUS.RESOLVIDO, h(20), 'Lâmpada trocada pela equipe.'),
      ],
    }),
    base({
      paradaId: 'p1',
      tipo: 'luz_piscando',
      descricao: 'A luz do ponto fica acendendo e apagando a noite toda.',
      status: STATUS.EM_MANUTENCAO,
      criadoEm: h(30),
      medicao: { ...medicao(5.1, ESTADO_LUZ.OSCILANDO, h(29.9)), estacaoId: 'e1' },
      historico: [
        passo(STATUS.RECEBIDO, h(30)),
        passo(STATUS.VALIDANDO, h(30)),
        passo(STATUS.CONFIRMADO, h(29.9)),
        passo(STATUS.EM_MANUTENCAO, h(6)),
      ],
    }),
    base({
      paradaId: 'p2',
      tipo: 'luz_fraca',
      descricao: 'Luz muito fraca, não dá para ver quem está no ponto.',
      status: STATUS.CONFIRMADO,
      criadoEm: h(5),
      medicao: { ...medicao(6.4, ESTADO_LUZ.FRACA, h(4.9)), estacaoId: 'e2' },
      historico: [
        passo(STATUS.RECEBIDO, h(5)),
        passo(STATUS.VALIDANDO, h(5)),
        passo(STATUS.CONFIRMADO, h(4.9)),
      ],
    }),
    base({
      paradaId: 'p5',
      tipo: 'ponto_escuro',
      descricao: 'Trecho da rua perto do mercado parece escuro.',
      status: STATUS.CONTESTADO,
      criadoEm: h(2),
      medicao: { ...medicao(31.5, ESTADO_LUZ.ADEQUADA, h(1.9)), estacaoId: 'e5' },
      historico: [
        passo(STATUS.RECEBIDO, h(2)),
        passo(STATUS.VALIDANDO, h(2)),
        passo(STATUS.CONTESTADO, h(1.9)),
      ],
    }),
  ];
}

function montarAlertas(cidadaoId, relatos, agora) {
  const resolvido = relatos.find((r) => r.status === STATUS.RESOLVIDO);
  const confirmado = relatos.find((r) => r.status === STATUS.CONFIRMADO);
  return [
    {
      id: gerarId(),
      usuarioId: cidadaoId,
      relatoId: resolvido.id,
      titulo: 'Ponto consertado',
      mensagem: 'A iluminação da Estação Osasco (CPTM) foi consertada. Obrigado por avisar!',
      criadoEm: resolvido.resolvidoEm,
      lido: false,
    },
    {
      id: gerarId(),
      usuarioId: DESTINO_AGENTES,
      relatoId: confirmado.id,
      titulo: 'Relato confirmado pela estação',
      mensagem: 'Av. Maria Campos: a estação LS-02 mediu 6,4 lux (luz fraca).',
      criadoEm: horasAtras(agora, 4.9),
      lido: false,
    },
  ];
}

async function criarDados() {
  const agora = Date.now();
  const cidadao = await montarUsuario({
    nome: 'Maria da Silva',
    cpf: '52998224725',
    email: USUARIOS_TESTE.cidadao.email,
    telefone: '11987654321',
    senha: USUARIOS_TESTE.cidadao.senha,
    perfil: PERFIL.CIDADAO,
  });
  const agente = await montarUsuario({
    nome: 'Carlos Souza',
    cpf: '11144477735',
    email: USUARIOS_TESTE.agente.email,
    telefone: '11912345678',
    senha: USUARIOS_TESTE.agente.senha,
    perfil: PERFIL.AGENTE,
  });

  const relatos = montarRelatos(cidadao.id, agora);
  const alertas = montarAlertas(cidadao.id, relatos, agora);

  await storage.atualizarLista(CHAVES.USUARIOS, () => [cidadao, agente]);
  await storage.atualizarLista(CHAVES.RELATOS, () => relatos);
  await storage.atualizarLista(CHAVES.ALERTAS, () => alertas);
  await storage.setItem(CHAVES.SEED, new Date(agora).toISOString());
}

// Roda o seed só se ainda não rodou.
export async function garantirSeed() {
  const jaRodou = await storage.getItem(CHAVES.SEED);
  if (jaRodou) return false;
  await criarDados();
  return true;
}

// "Restaurar dados de demonstração": apaga todas as chaves (inclusive a sessão) e recria.
export async function restaurarDemo() {
  await storage.removerVarios(TODAS_AS_CHAVES);
  await criarDados();
}
