import { StyleSheet } from 'react-native';
import {
  cores,
  fontes,
  pesos,
  espacos,
  raios,
  bordas,
  ALVO_TOQUE,
  ALTURA_BOTAO_GRANDE,
  opacidades,
} from './tema';

const CONTEUDO = {
  primario: cores.textoSobrePrimaria,
  destaque: cores.textoSobreDestaque,
  secundario: cores.primaria,
  perigo: cores.textoSobrePrimaria,
  texto: cores.primaria,
};

export function corConteudo(variante, inativo) {
  if (inativo && variante !== 'primario' && variante !== 'perigo' && variante !== 'destaque') {
    return cores.textoDesabilitado;
  }
  return CONTEUDO[variante] || CONTEUDO.primario;
}

export default StyleSheet.create({
  base: {
    minHeight: ALVO_TOQUE,
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    borderRadius: raios.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: bordas.media,
    borderColor: cores.transparente,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
  },
  primario: { backgroundColor: cores.primaria },
  destaque: { backgroundColor: cores.destaque, borderColor: cores.textoSobreDestaque },
  secundario: { backgroundColor: cores.superficie, borderColor: cores.primaria },
  perigo: { backgroundColor: cores.erro },
  texto: { backgroundColor: cores.transparente },
  grande: {
    minHeight: ALTURA_BOTAO_GRANDE,
    borderRadius: raios.lg,
    paddingHorizontal: espacos.lg,
  },
  inativo: { opacity: opacidades.inativo },
  pressionado: { opacity: opacidades.pressionado },
  rotulo: {
    fontSize: fontes.base,
    fontWeight: pesos.negrito,
    textAlign: 'center',
  },
  rotuloGrande: { fontSize: fontes.grande },
});
