import React from 'react';
import { View, Text } from 'react-native';
import SeloStatus from './SeloStatus';
import { LUX_ADEQUADA, LUX_INEXISTENTE, LUX_SATURADO, ESCALA_MEDIDOR_LUX } from '../constants/limiares';
import { INFO_ESTADO_LUZ, INFO_SEM_MEDICAO } from '../constants/status';
import { formatarLux } from '../utils/formatadores';
import estilos, { corDaLeitura } from '../styles/MedidorLux.styles';

const porcentagem = (lux) => `${Math.min(100, Math.max(0, (lux / ESCALA_MEDIDOR_LUX) * 100))}%`;

// Medidor ao vivo: valor atual, barra com as faixas (3 e 10 lux), estado da última janela
// e um histórico curto em barrinhas.
export default function MedidorLux({ lux, estado, historico = [], modoAgente = false, compacto = false }) {
  const saturado = lux !== null && lux !== undefined && lux >= LUX_SATURADO;
  const textoLux = saturado ? 'saturado' : `${formatarLux(lux)} lux`;
  const info = estado ? INFO_ESTADO_LUZ[estado] : INFO_SEM_MEDICAO;

  return (
    <View
      style={estilos.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Leitura atual: ${textoLux}. Última janela: ${info.rotulo}.`}
    >
      <View style={estilos.topo}>
        <Text style={[estilos.valor, compacto && estilos.valorCompacto]}>{textoLux}</Text>
        <SeloStatus estadoLuz={estado} modoAgente={modoAgente} />
      </View>

      <View style={estilos.barra}>
        <View style={[estilos.faixa, estilos.faixaInexistente, { width: porcentagem(LUX_INEXISTENTE) }]} />
        <View
          style={[
            estilos.faixa,
            estilos.faixaFraca,
            { left: porcentagem(LUX_INEXISTENTE), width: porcentagem(LUX_ADEQUADA - LUX_INEXISTENTE) },
          ]}
        />
        {lux !== null && lux !== undefined ? (
          <View style={[estilos.ponteiro, { left: porcentagem(saturado ? ESCALA_MEDIDOR_LUX : lux) }]} />
        ) : null}
      </View>
      <View style={estilos.legenda}>
        <Text style={estilos.textoLegenda}>0</Text>
        <Text style={[estilos.textoLegenda, estilos.marca, { left: porcentagem(LUX_INEXISTENTE) }]}>{LUX_INEXISTENTE}</Text>
        <Text style={[estilos.textoLegenda, estilos.marca, { left: porcentagem(LUX_ADEQUADA) }]}>{LUX_ADEQUADA}</Text>
        <Text style={estilos.textoLegenda}>{ESCALA_MEDIDOR_LUX}+ lux</Text>
      </View>

      {!compacto && historico.length ? (
        <View style={estilos.historico}>
          {historico.map((valor, i) => (
            <View
              key={i}
              style={[
                estilos.barrinha,
                {
                  height: porcentagem(valor >= LUX_SATURADO ? ESCALA_MEDIDOR_LUX : Math.max(valor, 1)),
                  backgroundColor: corDaLeitura(valor),
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
