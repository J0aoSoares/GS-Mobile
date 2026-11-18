import { VALIDACAO } from '../constants/limiares';

// Validadores puros. Cada um devolve a mensagem de erro (texto simples) ou null se estiver ok.

export function apenasDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

// Verifica os dois dígitos verificadores do CPF.
export function cpfEhValido(valor) {
  const cpf = apenasDigitos(valor);
  if (cpf.length !== VALIDACAO.CPF_DIGITOS) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // 000.000.000-00, 111..., etc.

  const digitos = cpf.split('').map(Number);
  const calcularDigito = (quantidade) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i += 1) {
      soma += digitos[i] * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiro = calcularDigito(9);
  if (primeiro !== digitos[9]) return false;
  const segundo = calcularDigito(10);
  return segundo === digitos[10];
}

export function validarNome(nome) {
  const texto = String(nome ?? '').trim();
  if (!texto) return 'Digite seu nome.';
  if (texto.length < VALIDACAO.NOME_MIN) {
    return `O nome precisa ter pelo menos ${VALIDACAO.NOME_MIN} letras.`;
  }
  return null;
}

export function validarCPF(cpf) {
  const digitos = apenasDigitos(cpf);
  if (!digitos) return 'Digite seu CPF.';
  if (digitos.length !== VALIDACAO.CPF_DIGITOS) return 'O CPF precisa ter 11 números.';
  if (!cpfEhValido(digitos)) return 'Este CPF não é válido. Confira os números.';
  return null;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEmail(email) {
  const texto = String(email ?? '').trim();
  if (!texto) return 'Digite seu e-mail.';
  if (!REGEX_EMAIL.test(texto)) return 'Digite um e-mail válido, como nome@exemplo.com.';
  return null;
}

export function validarTelefone(telefone) {
  const digitos = apenasDigitos(telefone);
  if (!digitos) return 'Digite seu telefone com DDD.';
  if (digitos.length !== VALIDACAO.TELEFONE_DIGITOS) {
    return 'O telefone precisa ter DDD + 9 números.';
  }
  return null;
}

export function validarSenha(senha) {
  const texto = String(senha ?? '');
  if (!texto) return 'Crie uma senha.';
  if (texto.length < VALIDACAO.SENHA_MIN) {
    return `A senha precisa ter pelo menos ${VALIDACAO.SENHA_MIN} caracteres.`;
  }
  if (!/[A-Za-zÀ-ÿ]/.test(texto) || !/\d/.test(texto)) {
    return 'A senha precisa ter pelo menos uma letra e um número.';
  }
  return null;
}

export function validarConfirmacaoSenha(senha, confirmacao) {
  if (!confirmacao) return 'Repita a senha.';
  if (senha !== confirmacao) return 'As senhas não são iguais.';
  return null;
}

// Senha do login: só verifica se foi preenchida (as regras valem no cadastro).
export function validarSenhaLogin(senha) {
  if (!senha) return 'Digite sua senha.';
  return null;
}

// CEP é opcional no relato: vazio é aceito.
export function validarCEP(cep, { obrigatorio = false } = {}) {
  const digitos = apenasDigitos(cep);
  if (!digitos) return obrigatorio ? 'Digite o CEP.' : null;
  if (digitos.length !== VALIDACAO.CEP_DIGITOS) return 'O CEP precisa ter 8 números.';
  return null;
}

export function validarDescricao(descricao) {
  const texto = String(descricao ?? '').trim();
  if (!texto) return 'Conte rapidamente o que está acontecendo.';
  if (texto.length < VALIDACAO.DESCRICAO_MIN) {
    return `Escreva pelo menos ${VALIDACAO.DESCRICAO_MIN} letras.`;
  }
  return null;
}

export function validarObrigatorio(valor, mensagem) {
  return valor ? null : mensagem;
}

// Junta os erros de um formulário: { campo: mensagem }. Só inclui campos com erro.
export function juntarErros(mapa) {
  return Object.fromEntries(Object.entries(mapa).filter(([, erro]) => Boolean(erro)));
}
