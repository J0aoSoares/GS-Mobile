import { StyleSheet } from 'react-native';
import { baseFormulario } from './formulario.styles';
import { baseTela } from './tela.styles';
import { cores, fontes, pesos, espacos, raios } from './tema';

const PROPORCAO_FOTO = 4 / 3;

export default StyleSheet.create({
  ...baseFormulario,
  conteudo: { ...baseFormulario.conteudo, padding: espacos.md, gap: espacos.sm },
  caixaAviso: baseTela.caixaAviso,
  textoAviso: baseTela.textoAviso,
  introducao: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
  },
  passo: {
    fontSize: fontes.grande,
    fontWeight: pesos.negrito,
    color: cores.texto,
    marginTop: espacos.md,
  },
  grupo: { gap: espacos.sm },
  linhaErro: {
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
  caixaFoto: { gap: espacos.sm },
  foto: {
    width: '100%',
    aspectRatio: PROPORCAO_FOTO,
    borderRadius: raios.md,
    backgroundColor: cores.fundoNeutro,
  },
  botaoEnviar: { marginTop: espacos.lg },
});
