import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, raios, bordas } from './tema';

const PROPORCAO_FOTO = 4 / 3;

export default StyleSheet.create({
  ...baseTela,
  textoStatus: {
    fontSize: fontes.media,
    color: cores.texto,
  },
  linhaMedindo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  textoMedindo: {
    fontSize: fontes.base,
    color: cores.info,
    fontWeight: pesos.medio,
  },
  cartaoMedicao: {
    ...baseTela.cartao,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    borderColor: cores.primaria,
    borderWidth: bordas.media,
  },
  textosMedicao: { flex: 1, gap: espacos.xs },
  textoMedicao: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  espacoAcima: { marginTop: espacos.sm },
  foto: {
    width: '100%',
    aspectRatio: PROPORCAO_FOTO,
    borderRadius: raios.lg,
    backgroundColor: cores.fundoNeutro,
  },
});
