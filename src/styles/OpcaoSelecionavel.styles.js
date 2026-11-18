import { StyleSheet } from 'react-native';
import { cores, fontes, pesos, espacos, raios, bordas, ALVO_TOQUE, ALTURA_BOTAO_GRANDE, opacidades } from './tema';

export default StyleSheet.create({
  base: {
    minHeight: ALVO_TOQUE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    borderWidth: bordas.media,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
  },
  linha: {
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    minHeight: ALTURA_BOTAO_GRANDE - espacos.sm,
  },
  bloco: {
    minHeight: ALTURA_BOTAO_GRANDE,
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.md,
    borderRadius: raios.lg,
  },
  chip: {
    paddingHorizontal: espacos.md,
    borderRadius: raios.pilula,
    gap: espacos.xs,
  },
  selecionado: {
    backgroundColor: cores.primaria,
    borderColor: cores.primariaEscura,
  },
  pressionado: { opacity: opacidades.pressionado },
  textos: { flex: 1, gap: espacos.xxs },
  titulo: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  tituloChip: { fontSize: fontes.base },
  descricao: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
  },
  textoSelecionado: { color: cores.textoSobrePrimaria },
});
