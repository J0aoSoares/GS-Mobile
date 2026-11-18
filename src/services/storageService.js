import AsyncStorage from '@react-native-async-storage/async-storage';

// Única camada do app que toca no AsyncStorage.
// Todas as funções tratam erros e nunca deixam a tela quebrar por falha de leitura/gravação.

export class ErroArmazenamento extends Error {
  constructor(mensagem, causa) {
    super(mensagem);
    this.name = 'ErroArmazenamento';
    this.causa = causa;
  }
}

// Fila por chave: garante que leitura+gravação de uma lista não se intercalem
// (duas gravações simultâneas não se sobrescrevem).
const filas = new Map();

function enfileirar(chave, tarefa) {
  const anterior = filas.get(chave) || Promise.resolve();
  const atual = anterior.catch(() => undefined).then(tarefa);
  filas.set(chave, atual);
  // Limpa a referência quando esta for a última tarefa da fila.
  atual
    .finally(() => {
      if (filas.get(chave) === atual) filas.delete(chave);
    })
    .catch(() => undefined);
  return atual;
}

export async function getItem(chave) {
  try {
    return await AsyncStorage.getItem(chave);
  } catch (erro) {
    throw new ErroArmazenamento(`Não foi possível ler os dados (${chave}).`, erro);
  }
}

export async function setItem(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, String(valor));
  } catch (erro) {
    throw new ErroArmazenamento(`Não foi possível salvar os dados (${chave}).`, erro);
  }
}

export async function removeItem(chave) {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (erro) {
    throw new ErroArmazenamento(`Não foi possível apagar os dados (${chave}).`, erro);
  }
}

export async function removerVarios(chaves) {
  try {
    await AsyncStorage.multiRemove(chaves);
  } catch (erro) {
    throw new ErroArmazenamento('Não foi possível apagar os dados do app.', erro);
  }
}

// Lê JSON; se não existir ou estiver corrompido, devolve o valor padrão.
export async function getJSON(chave, padrao = null) {
  const bruto = await getItem(chave);
  if (bruto === null || bruto === undefined) return padrao;
  try {
    return JSON.parse(bruto);
  } catch (erro) {
    console.warn(`[storage] JSON inválido em ${chave}; usando valor padrão.`);
    return padrao;
  }
}

export async function setJSON(chave, valor) {
  let texto;
  try {
    texto = JSON.stringify(valor);
  } catch (erro) {
    throw new ErroArmazenamento(`Dados inválidos para salvar (${chave}).`, erro);
  }
  await setItem(chave, texto);
}

// Lê a lista, aplica fn(lista) e grava a lista inteira de volta, em fila por chave.
// fn pode ser assíncrona e deve devolver a nova lista.
// Devolve a lista gravada.
export function atualizarLista(chave, fn) {
  return enfileirar(chave, async () => {
    const atual = await getJSON(chave, []);
    const lista = Array.isArray(atual) ? atual : [];
    const nova = await fn([...lista]);
    if (!Array.isArray(nova)) {
      throw new ErroArmazenamento(`A atualização de ${chave} precisa devolver uma lista.`);
    }
    await setJSON(chave, nova);
    return nova;
  });
}

// Leitura de lista que respeita a fila (não lê no meio de uma gravação).
export function getLista(chave) {
  return enfileirar(chave, async () => {
    const lista = await getJSON(chave, []);
    return Array.isArray(lista) ? lista : [];
  });
}
