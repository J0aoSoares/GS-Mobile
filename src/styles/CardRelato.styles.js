import { StyleSheet } from 'react-native';
import { cores, fontes, pesos, espacos, raios, bordas, sombra, ALVO_TOQUE, opacidades } from './tema';

export default StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    borderWidth: bordas.fina,
    borderColor: cores.bordaSuave,
    padding: espacos.md,
    gap: espacos.sm,
    minHeight: ALVO_TOQUE,
    ...sombra,
  },
  pressionado: { opacity: opacidades.pressionado },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacos.md,
  },
  icone: {
    width: ALVO_TOQUE,
    height: ALVO_TOQUE,
    borderRadius: raios.md,
    backgroundColor: cores.fundoInfo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: espacos.xxs },
  titulo: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  subtitulo: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
  },
  prioridade: {
    minWidth: ALVO_TOQUE + espacos.md,
    alignItems: 'center',
    paddingVertical: espacos.xs,
    borderRadius: raios.md,
    backgroundColor: cores.primaria,
  },
  prioridadeValor: {
    fontSize: fontes.grande,
    fontWeight: pesos.negrito,
    color: cores.textoSobrePrimaria,
  },
  prioridadeRotulo: {
    fontSize: fontes.pequena,
    color: cores.textoSobrePrimaria,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  explicacao: {
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
    borderTopWidth: bordas.fina,
    borderTopColor: cores.bordaSuave,
    paddingTop: espacos.sm,
  },
});
