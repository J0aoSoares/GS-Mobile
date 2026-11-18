import { cores, fontes, pesos, espacos, raios, bordas, sombra } from './tema';

// Peças de estilo comuns às telas (cada tela estende no seu próprio *.styles.js).
export const baseTela = {
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md, paddingBottom: espacos.xl, gap: espacos.md },
  lista: { padding: espacos.md, paddingBottom: espacos.xl, gap: espacos.md, flexGrow: 1 },
  tituloSecao: {
    fontSize: fontes.grande,
    fontWeight: pesos.negrito,
    color: cores.texto,
    marginTop: espacos.sm,
  },
  textoSecao: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    borderWidth: bordas.fina,
    borderColor: cores.bordaSuave,
    padding: espacos.md,
    gap: espacos.sm,
    ...sombra,
  },
  rotuloCampo: {
    fontSize: fontes.pequena,
    fontWeight: pesos.negrito,
    color: cores.textoSecundario,
    textTransform: 'uppercase',
  },
  valorCampo: {
    fontSize: fontes.media,
    color: cores.texto,
  },
  caixaAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    padding: espacos.md,
    borderRadius: raios.md,
    borderWidth: bordas.fina,
    borderColor: cores.aviso,
    backgroundColor: cores.fundoAviso,
  },
  textoAviso: {
    flex: 1,
    fontSize: fontes.base,
    color: cores.aviso,
    fontWeight: pesos.medio,
  },
  caixaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    padding: espacos.md,
    borderRadius: raios.md,
    borderWidth: bordas.fina,
    borderColor: cores.erro,
    backgroundColor: cores.fundoErro,
  },
  textoErro: {
    flex: 1,
    fontSize: fontes.base,
    color: cores.erro,
    fontWeight: pesos.medio,
  },
};
