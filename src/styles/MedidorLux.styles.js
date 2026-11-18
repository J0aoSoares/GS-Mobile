import { StyleSheet } from 'react-native';
import { LUX_ADEQUADA, LUX_INEXISTENTE, LUX_SATURADO } from '../constants/limiares';
import { cores, fontes, pesos, espacos, raios, bordas } from './tema';

const ALTURA_BARRA = 16;
const LARGURA_PONTEIRO = 4;
const ALTURA_HISTORICO = 40;
const LARGURA_BARRINHA = 6;

// Cor de cada barrinha do histórico (apoio visual; o estado sempre aparece em texto no selo).
export function corDaLeitura(lux) {
  if (lux >= LUX_SATURADO) return cores.neutro;
  if (lux >= LUX_ADEQUADA) return cores.sucesso;
  if (lux >= LUX_INEXISTENTE) return cores.destaque;
  return cores.erro;
}

export default StyleSheet.create({
  container: { gap: espacos.sm },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.sm,
    flexWrap: 'wrap',
  },
  valor: {
    fontSize: fontes.gigante,
    fontWeight: pesos.negrito,
    color: cores.texto,
  },
  valorCompacto: { fontSize: fontes.grande },
  barra: {
    height: ALTURA_BARRA,
    borderRadius: raios.pilula,
    backgroundColor: cores.fundoSucesso,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    overflow: 'hidden',
  },
  faixa: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  faixaInexistente: { left: 0, backgroundColor: cores.fundoErro },
  faixaFraca: { backgroundColor: cores.fundoAviso },
  ponteiro: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: LARGURA_PONTEIRO,
    marginLeft: -LARGURA_PONTEIRO / 2,
    backgroundColor: cores.primaria,
  },
  legenda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textoLegenda: {
    fontSize: fontes.pequena,
    color: cores.textoSecundario,
  },
  marca: { position: 'absolute' },
  historico: {
    height: ALTURA_HISTORICO,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacos.xxs,
  },
  barrinha: {
    width: LARGURA_BARRINHA,
    borderTopLeftRadius: raios.sm / 2,
    borderTopRightRadius: raios.sm / 2,
  },
});
