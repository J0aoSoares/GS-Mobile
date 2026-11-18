import * as Crypto from 'expo-crypto';
import { CHAVES } from '../constants/armazenamento';
import { PERFIL } from '../constants/status';
import { apenasDigitos } from '../utils/validadores';
import { gerarId } from '../utils/id';
import * as storage from './storageService';

// Regras de autenticação: cadastro, login, sessão.
// Hash SHA-256 só para demonstração (sem backend, a "segurança" é local).

export class ErroAutenticacao extends Error {
  constructor(mensagem, campo = null) {
    super(mensagem);
    this.name = 'ErroAutenticacao';
    this.campo = campo; // permite mostrar o erro embaixo do campo certo
  }
}

const SAL_DEMO = 'luzsegura';

const normalizarEmail = (email) => String(email ?? '').trim().toLowerCase();

export async function gerarHashSenha(email, senha) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${SAL_DEMO}:${normalizarEmail(email)}:${senha}`
  );
}

// Nunca devolve o hash da senha para as telas.
function semSenha(usuario) {
  if (!usuario) return null;
  const { senhaHash, ...publico } = usuario;
  return publico;
}

export async function listarUsuarios() {
  return storage.getLista(CHAVES.USUARIOS);
}

export async function buscarUsuario(id) {
  const usuarios = await listarUsuarios();
  return semSenha(usuarios.find((u) => u.id === id));
}

// Monta o registro completo de um usuário (usado pelo cadastro e pelo seed).
export async function montarUsuario({ nome, cpf, email, telefone, senha, perfil }) {
  return {
    id: gerarId(),
    nome: String(nome).trim(),
    cpf: apenasDigitos(cpf),
    email: normalizarEmail(email),
    telefone: apenasDigitos(telefone),
    senhaHash: await gerarHashSenha(email, senha),
    perfil,
  };
}

// Cadastro sempre cria um cidadão. Bloqueia CPF e e-mail repetidos.
export async function cadastrar(dados) {
  const novo = await montarUsuario({ ...dados, perfil: PERFIL.CIDADAO });

  await storage.atualizarLista(CHAVES.USUARIOS, (usuarios) => {
    if (usuarios.some((u) => u.email === novo.email)) {
      throw new ErroAutenticacao('Já existe uma conta com este e-mail.', 'email');
    }
    if (usuarios.some((u) => u.cpf === novo.cpf)) {
      throw new ErroAutenticacao('Já existe uma conta com este CPF.', 'cpf');
    }
    return [...usuarios, novo];
  });

  await storage.setItem(CHAVES.SESSAO, novo.id);
  return semSenha(novo);
}

export async function entrar(email, senha) {
  const usuarios = await listarUsuarios();
  const emailNormalizado = normalizarEmail(email);
  const usuario = usuarios.find((u) => u.email === emailNormalizado);
  const hash = await gerarHashSenha(emailNormalizado, senha);

  if (!usuario || usuario.senhaHash !== hash) {
    throw new ErroAutenticacao('E-mail ou senha incorretos. Confira e tente de novo.');
  }

  await storage.setItem(CHAVES.SESSAO, usuario.id);
  return semSenha(usuario);
}

// Mantém o login ao reabrir o app.
export async function restaurarSessao() {
  const id = await storage.getItem(CHAVES.SESSAO);
  if (!id) return null;
  const usuario = await buscarUsuario(id);
  if (!usuario) {
    await storage.removeItem(CHAVES.SESSAO);
    return null;
  }
  return usuario;
}

export async function sair() {
  await storage.removeItem(CHAVES.SESSAO);
}
