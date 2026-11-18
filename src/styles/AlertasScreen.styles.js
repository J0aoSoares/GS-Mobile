import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, raios, bordas, ALVO_TOQUE } from './tema';

export default StyleSheet.create({
  ...baseTela,
  naoLido: {
    borderColor: cores.primaria,
    borderWidth: bordas.media,
    backgroundColor: cores.fundoInfo,
  },
  areaToque: {
    flexDirection: 'row',
    gap: espacos.md,
    minHeight: ALVO_TOQUE,
  },
  textos: { flex: 1, gap: espacos.xs },
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    flexWrap: 'wrap',
  },
  titulo: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.texto,
    flexShrink: 1,
  },
  etiquetaNovo: {
    fontSize: fontes.pequena,
    fontWeight: pesos.negrito,
    color: cores.textoSobrePrimaria,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.sm,
    paddingVertical: espacos.xxs,
    borderRadius: raios.sm,
    overflow: 'hidden',
  },
  mensagem: { fontSize: fontes.base, color: cores.texto },
  hora: { fontSize: fontes.pequena, color: cores.textoSecundario },
});
