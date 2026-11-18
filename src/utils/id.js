import * as Crypto from 'expo-crypto';

// Gera um identificador único para usuários, relatos e alertas.
export function gerarId() {
  return Crypto.randomUUID();
}
