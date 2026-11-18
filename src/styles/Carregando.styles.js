import { StyleSheet } from 'react-native';
import { cores, fontes, espacos } from './tema';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.lg,
    gap: espacos.md,
    backgroundColor: cores.fundo,
  },
  texto: {
    fontSize: fontes.media,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
