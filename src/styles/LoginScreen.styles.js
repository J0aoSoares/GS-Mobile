import { StyleSheet } from 'react-native';
import { baseFormulario } from './formulario.styles';
import { cores, fontes, pesos, espacos, raios, bordas, TAMANHO_LOGO, ALTURA_LINHA } from './tema';

export default StyleSheet.create({
  ...baseFormulario,
  conteudo: {
    ...baseFormulario.conteudo,
    flexGrow: 1,
    justifyContent: 'center',
  },
  marca: {
    alignItems: 'center',
    marginBottom: espacos.xl,
    gap: espacos.sm,
  },
  circuloIcone: {
    width: TAMANHO_LOGO,
    height: TAMANHO_LOGO,
    borderRadius: raios.pilula,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeApp: {
    fontSize: fontes.titulo,
    fontWeight: pesos.negrito,
    color: cores.primaria,
  },
  slogan: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  caixaTeste: {
    marginTop: espacos.xl,
    padding: espacos.md,
    borderRadius: raios.md,
    borderWidth: bordas.fina,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.superficie,
  },
  textoTeste: {
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
    lineHeight: fontes.pequena * ALTURA_LINHA,
  },
  textoTesteForte: {
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
});
