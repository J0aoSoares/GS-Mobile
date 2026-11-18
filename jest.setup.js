// Mocks dos módulos nativos usados pelos serviços nos testes.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-crypto', () => {
  const crypto = require('crypto');
  return {
    CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
    randomUUID: () => crypto.randomUUID(),
    digestStringAsync: async (_algoritmo, dados) =>
      crypto.createHash('sha256').update(dados).digest('hex'),
  };
});
