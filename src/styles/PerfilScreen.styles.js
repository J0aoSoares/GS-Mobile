import { StyleSheet } from 'react-native';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, raios, TAMANHO_LOGO, ALVO_TOQUE } from './tema';

export default StyleSheet.create({
  ...baseTela,
  cabecalho: {
    alignItems: 'center',
    gap: espacos.xs,
    paddingVertical: espacos.md,
  },
  avatar: {
    width: TAMANHO_LOGO,
    height: TAMANHO_LOGO,
    borderRadius: raios.pilula,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacos.sm,
  },
  nome: {
    fontSize: fontes.grande,
    fontWeight: pesos.negrito,
    color: cores.texto,
    textAlign: 'center',
  },
  perfil: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    minHeight: ALVO_TOQUE,
  },
  textosLinha: { flex: 1 },
});
