import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos } from './tema';

export default StyleSheet.create({
  ...baseTela,
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  textosTitulo: { flex: 1 },
  codigo: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  linhaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },
  info: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
  },
  infoForte: {
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  infoAlerta: {
    color: cores.erro,
    fontWeight: pesos.negrito,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },
  botaoGrade: {
    flexGrow: 1,
    flexBasis: '45%',
  },
});
