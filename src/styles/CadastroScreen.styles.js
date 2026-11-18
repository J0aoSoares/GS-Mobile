import { StyleSheet } from 'react-native';
import { baseFormulario } from './formulario.styles';
import { cores, fontes, espacos } from './tema';

export default StyleSheet.create({
  ...baseFormulario,
  introducao: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
    marginBottom: espacos.lg,
  },
});
