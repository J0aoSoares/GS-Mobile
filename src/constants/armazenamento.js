// Chaves do AsyncStorage. Só o storageService grava/lê com elas.

export const CHAVES = {
  USUARIOS: '@luzsegura:usuarios',
  SESSAO: '@luzsegura:sessao',
  RELATOS: '@luzsegura:relatos',
  ALERTAS: '@luzsegura:alertas',
  SEED: '@luzsegura:seed_v1',
};

export const TODAS_AS_CHAVES = Object.values(CHAVES);
