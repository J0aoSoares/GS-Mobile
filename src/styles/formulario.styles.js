import { StyleSheet } from 'react-native';
import { cores, fontes, pesos, espacos, raios, bordas } from './tema';

// Base compartilhada pelas telas de formulário (login, cadastro, novo relato).
export const baseFormulario = {
  flex: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    padding: espacos.lg,
    paddingBottom: espacos.xl * 2,
  },
  caixaErroGeral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    padding: espacos.md,
    marginBottom: espacos.md,
    borderRadius: raios.md,
    borderWidth: bordas.media,
    borderColor: cores.erro,
    backgroundColor: cores.fundoErro,
  },
  textoErroGeral: {
    flex: 1,
    fontSize: fontes.base,
    fontWeight: pesos.medio,
    color: cores.erro,
  },
  acoes: {
    gap: espacos.md,
    marginTop: espacos.sm,
  },
};

export default StyleSheet.create(baseFormulario);
