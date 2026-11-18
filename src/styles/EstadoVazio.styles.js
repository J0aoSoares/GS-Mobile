import { StyleSheet } from 'react-native';
import { cores, fontes, pesos, espacos } from './tema';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.lg,
  },
  textos: {
    alignItems: 'center',
    gap: espacos.sm,
  },
  titulo: {
    fontSize: fontes.grande,
    fontWeight: pesos.negrito,
    color: cores.texto,
    textAlign: 'center',
  },
  mensagem: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  botao: { alignSelf: 'stretch' },
});
