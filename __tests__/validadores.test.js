import {
  cpfEhValido,
  validarCPF,
  validarEmail,
  validarSenha,
  validarCEP,
  validarNome,
  validarTelefone,
  validarDescricao,
  validarConfirmacaoSenha,
} from '../src/utils/validadores';

describe('CPF', () => {
  test.each(['529.982.247-25', '52998224725', '111.444.777-35', '935.411.347-80'])(
    'aceita CPF válido %s',
    (cpf) => {
      expect(cpfEhValido(cpf)).toBe(true);
      expect(validarCPF(cpf)).toBeNull();
    }
  );

  test.each([
    ['dígito verificador errado', '529.982.247-24'],
    ['segundo dígito errado', '111.444.777-36'],
    ['todos iguais', '111.111.111-11'],
    ['zeros', '000.000.000-00'],
  ])('recusa CPF com %s', (_caso, cpf) => {
    expect(cpfEhValido(cpf)).toBe(false);
    expect(validarCPF(cpf)).toMatch(/não é válido/);
  });

  test('recusa CPF incompleto ou vazio', () => {
    expect(validarCPF('529.982.247')).toMatch(/11 números/);
    expect(validarCPF('')).toMatch(/Digite/);
  });
});

describe('e-mail', () => {
  test.each(['cidadao@luzsegura.app', 'nome.sobrenome@exemplo.com.br', '  a@b.co  '])('aceita %s', (email) => {
    expect(validarEmail(email)).toBeNull();
  });

  test.each(['', 'sem-arroba.com', 'a@b', 'a@b.c', 'com espaco@x.com'])('recusa "%s"', (email) => {
    expect(validarEmail(email)).not.toBeNull();
  });
});

describe('senha', () => {
  test('aceita senha com 6+ caracteres, letra e número', () => {
    expect(validarSenha('abc123')).toBeNull();
    expect(validarSenha('cidadao123')).toBeNull();
  });

  test('recusa senha curta', () => {
    expect(validarSenha('ab1')).toMatch(/6 caracteres/);
  });

  test('recusa senha sem número ou sem letra', () => {
    expect(validarSenha('abcdefg')).toMatch(/letra e um número/);
    expect(validarSenha('1234567')).toMatch(/letra e um número/);
  });

  test('confirmação precisa ser igual', () => {
    expect(validarConfirmacaoSenha('abc123', 'abc123')).toBeNull();
    expect(validarConfirmacaoSenha('abc123', 'abc124')).toMatch(/não são iguais/);
  });
});

describe('CEP', () => {
  test('é opcional: vazio é aceito', () => {
    expect(validarCEP('')).toBeNull();
  });

  test('aceita CEP com 8 dígitos (com ou sem máscara)', () => {
    expect(validarCEP('06010-000')).toBeNull();
    expect(validarCEP('06010000')).toBeNull();
  });

  test('recusa CEP incompleto', () => {
    expect(validarCEP('06010-0')).toMatch(/8 números/);
  });

  test('pode ser obrigatório', () => {
    expect(validarCEP('', { obrigatorio: true })).toMatch(/Digite/);
  });
});

describe('outros campos', () => {
  test('nome com mínimo de 3 letras', () => {
    expect(validarNome('Jo')).not.toBeNull();
    expect(validarNome('Ana')).toBeNull();
  });

  test('telefone com DDD + 9 dígitos', () => {
    expect(validarTelefone('(11) 98765-4321')).toBeNull();
    expect(validarTelefone('(11) 8765-4321')).not.toBeNull();
  });

  test('descrição com mínimo de 10 caracteres', () => {
    expect(validarDescricao('escuro')).not.toBeNull();
    expect(validarDescricao('poste apagado no ponto')).toBeNull();
  });
});
