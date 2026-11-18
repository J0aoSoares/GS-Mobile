import { StyleSheet } from 'react-native';
import { cores, fontes, espacos } from './tema';

// Estilo provisório das telas ainda não implementadas (etapa 1).
export default StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espacos.lg, backgroundColor: cores.fundo },
  texto: { fontSize: fontes.media, color: cores.texto },
});
