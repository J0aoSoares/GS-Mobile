// Tema central do app: toda cor, fonte e espaçamento sai daqui.
// Contraste pensado para leitura à noite e por pessoas idosas (texto escuro em fundo claro).

export const cores = {
  primaria: '#0B3D91',
  primariaEscura: '#082C69',
  textoSobrePrimaria: '#FFFFFF',
  destaque: '#FFC20E',
  textoSobreDestaque: '#1A1A1A',

  fundo: '#F4F6FA',
  superficie: '#FFFFFF',
  borda: '#8F98AB',
  bordaSuave: '#D5DAE3',
  texto: '#1A1A1A',
  textoSecundario: '#3F4859',
  textoDesabilitado: '#6B7385',

  erro: '#B3261E',
  fundoErro: '#FDECEA',
  sucesso: '#1B6E3A',
  fundoSucesso: '#E3F3E8',
  aviso: '#7A4F00',
  fundoAviso: '#FFF1CC',
  info: '#0B4F9C',
  fundoInfo: '#E1ECFA',
  neutro: '#3F4859',
  fundoNeutro: '#E9ECF2',

  sombra: '#000000',
  transparente: 'transparent',
};

// Tons usados por selos de status e estados de luz (sempre com texto + ícone).
export const tons = {
  sucesso: { fundo: cores.fundoSucesso, texto: cores.sucesso },
  erro: { fundo: cores.fundoErro, texto: cores.erro },
  aviso: { fundo: cores.fundoAviso, texto: cores.aviso },
  info: { fundo: cores.fundoInfo, texto: cores.info },
  neutro: { fundo: cores.fundoNeutro, texto: cores.neutro },
};

export const fontes = {
  pequena: 14,
  base: 16,
  media: 18,
  grande: 22,
  titulo: 26,
  gigante: 40,
};

export const pesos = {
  regular: '400',
  medio: '600',
  negrito: '700',
};

export const espacos = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const raios = {
  sm: 8,
  md: 12,
  lg: 16,
  pilula: 999,
};

export const bordas = {
  fina: 1,
  media: 2,
  grossa: 3,
};

// Alvo mínimo de toque (acessibilidade): 48 dp.
export const ALVO_TOQUE = 48;
export const ALTURA_BOTAO_GRANDE = 72;
export const ALTURA_TAB_BAR = 68;

export const tamanhosIcone = {
  pequeno: 18,
  medio: 24,
  grande: 32,
  enorme: 56,
};

export const sombra = {
  shadowColor: cores.sombra,
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

export const opacidades = {
  inativo: 0.55,
  pressionado: 0.8,
};

export const TAMANHO_LOGO = 96;
export const ALTURA_LINHA = 1.4; // multiplicador do tamanho da fonte
