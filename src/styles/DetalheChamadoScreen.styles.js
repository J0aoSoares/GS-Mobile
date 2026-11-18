import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, raios, ALVO_TOQUE } from './tema';

const PROPORCAO_FOTO = 4 / 3;
const ALTURA_TRILHA = 10;

export default StyleSheet.create({
  ...baseTela,
  linhaTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.sm,
    flexWrap: 'wrap',
  },
  caixaPrioridade: {
    minWidth: ALVO_TOQUE + espacos.lg,
    alignItems: 'center',
    padding: espacos.sm,
    borderRadius: raios.md,
    backgroundColor: cores.primaria,
  },
  valorPrioridade: {
    fontSize: fontes.titulo,
    fontWeight: pesos.negrito,
    color: cores.textoSobrePrimaria,
  },
  rotuloPrioridade: {
    fontSize: fontes.pequena,
    color: cores.textoSobrePrimaria,
  },
  espacoAcima: { marginTop: espacos.sm },
  foto: {
    width: '100%',
    aspectRatio: PROPORCAO_FOTO,
    borderRadius: raios.lg,
    backgroundColor: cores.fundoNeutro,
  },
  fator: { gap: espacos.xs, marginBottom: espacos.sm },
  linhaFator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nomeFator: {
    fontSize: fontes.base,
    fontWeight: pesos.medio,
    color: cores.texto,
    textTransform: 'capitalize',
  },
  pontosFator: {
    fontSize: fontes.base,
    fontWeight: pesos.negrito,
    color: cores.primaria,
  },
  trilhaFator: {
    height: ALTURA_TRILHA,
    flexDirection: 'row',
    borderRadius: raios.pilula,
    backgroundColor: cores.fundoNeutro,
    overflow: 'hidden',
  },
  restoFator: { backgroundColor: cores.transparente },
  preenchimentoFator: {
    backgroundColor: cores.primaria,
  },
  detalheFator: {
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
  },
});
