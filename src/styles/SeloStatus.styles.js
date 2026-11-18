import { StyleSheet } from 'react-native';
import { fontes, pesos, espacos, raios, bordas } from './tema';

export default StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espacos.xs,
    paddingHorizontal: espacos.sm,
    paddingVertical: espacos.xs,
    borderRadius: raios.pilula,
    borderWidth: bordas.fina,
  },
  seloGrande: {
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    gap: espacos.sm,
  },
  texto: {
    fontSize: fontes.pequena,
    fontWeight: pesos.negrito,
  },
  textoGrande: {
    fontSize: fontes.media,
  },
});
