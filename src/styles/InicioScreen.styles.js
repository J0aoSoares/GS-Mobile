import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, bordas, ALVO_TOQUE, opacidades } from './tema';

export default StyleSheet.create({
  ...baseTela,
  saudacao: {
    fontSize: fontes.titulo,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  pressionado: { opacity: opacidades.pressionado },
  cartaoResumo: {
    ...baseTela.cartao,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    minHeight: ALVO_TOQUE + espacos.md,
    borderColor: cores.primaria,
    borderWidth: bordas.media,
  },
  textoResumo: {
    flex: 1,
    fontSize: fontes.media,
    fontWeight: pesos.medio,
    color: cores.texto,
  },
  cartaoParada: {
    ...baseTela.cartao,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    minHeight: ALVO_TOQUE + espacos.md,
  },
  textosParada: { flex: 1, gap: espacos.xxs },
  nomeParada: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  tipoParada: {
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
  },
  textoEstado: {
    fontSize: fontes.base,
    color: cores.texto,
  },
});
