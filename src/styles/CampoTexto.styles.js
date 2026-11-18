import { StyleSheet } from 'react-native';
import { cores, fontes, pesos, espacos, raios, bordas, ALVO_TOQUE } from './tema';

const ALTURA_MULTILINHA = 3 * ALVO_TOQUE;

export default StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },
  rotulo: {
    fontSize: fontes.base,
    fontWeight: pesos.negrito,
    color: cores.texto,
    marginBottom: espacos.xs,
  },
  opcional: {
    fontWeight: pesos.regular,
    color: cores.textoSecundario,
  },
  caixa: {
    minHeight: ALVO_TOQUE + espacos.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderWidth: bordas.media,
    borderColor: cores.borda,
    borderRadius: raios.md,
  },
  caixaFocada: {
    borderColor: cores.primaria,
  },
  caixaErro: {
    borderColor: cores.erro,
    backgroundColor: cores.fundoErro,
  },
  caixaMultilinha: {
    alignItems: 'flex-start',
  },
  entrada: {
    flex: 1,
    minHeight: ALVO_TOQUE,
    paddingHorizontal: espacos.md,
    fontSize: fontes.media,
    color: cores.texto,
  },
  entradaMultilinha: {
    minHeight: ALTURA_MULTILINHA,
    paddingTop: espacos.sm,
  },
  botaoOlho: {
    width: ALVO_TOQUE,
    height: ALVO_TOQUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dica: {
    marginTop: espacos.xs,
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
  },
  linhaErro: {
    marginTop: espacos.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.xs,
  },
  erro: {
    flex: 1,
    fontSize: fontes.base,
    color: cores.erro,
    fontWeight: pesos.medio,
  },
});
