import { StyleSheet } from 'react-native';
import { cores, fontes, pesos, espacos, raios, bordas, tamanhosIcone } from './tema';

const TAMANHO_MARCADOR = tamanhosIcone.grande;

export default StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: espacos.md,
  },
  trilho: {
    alignItems: 'center',
    width: TAMANHO_MARCADOR,
  },
  marcador: {
    width: TAMANHO_MARCADOR,
    height: TAMANHO_MARCADOR,
    borderRadius: raios.pilula,
    borderWidth: bordas.media,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linha: {
    flex: 1,
    width: bordas.media,
    backgroundColor: cores.borda,
    marginVertical: espacos.xxs,
  },
  conteudo: {
    flex: 1,
    paddingBottom: espacos.lg,
    gap: espacos.xxs,
  },
  conteudoUltimo: { paddingBottom: 0 },
  titulo: {
    fontSize: fontes.base,
    fontWeight: pesos.medio,
    color: cores.texto,
  },
  tituloAtual: { fontWeight: pesos.negrito },
  hora: {
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
  },
  texto: {
    fontSize: fontes.base,
    color: cores.texto,
  },
});
