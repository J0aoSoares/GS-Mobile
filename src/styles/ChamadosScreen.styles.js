import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, raios, bordas, ALVO_TOQUE } from './tema';

export default StyleSheet.create({
  ...baseTela,
  cabecalho: { gap: espacos.md },
  caixaAlertas: {
    gap: espacos.sm,
    padding: espacos.md,
    borderRadius: raios.lg,
    borderWidth: bordas.media,
    borderColor: cores.aviso,
    backgroundColor: cores.fundoAviso,
  },
  linhaTituloAlertas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  tituloAlertas: {
    fontSize: fontes.media,
    fontWeight: pesos.negrito,
    color: cores.aviso,
  },
  alerta: {
    minHeight: ALVO_TOQUE,
    padding: espacos.sm,
    borderRadius: raios.md,
    backgroundColor: cores.superficie,
    gap: espacos.xxs,
  },
  alertaTitulo: {
    fontSize: fontes.base,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  alertaMensagem: {
    fontSize: fontes.base,
    color: cores.texto,
  },
  filtros: {
    gap: espacos.sm,
    paddingVertical: espacos.xs,
  },
});
