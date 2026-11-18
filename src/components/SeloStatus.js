import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  INFO_STATUS,
  INFO_ESTADO_LUZ,
  INFO_SEM_MEDICAO,
  INFO_SEM_ESTACAO,
} from '../constants/status';
import estilos from '../styles/SeloStatus.styles';
import { tons, tamanhosIcone } from '../styles/tema';

// Selo com ícone + texto (nunca só cor).
// Use `status` para relatos/chamados ou `estadoLuz` para a leitura de uma estação.
// `modoAgente` mostra o código técnico (ex.: EM_MANUTENCAO) junto do texto.
export default function SeloStatus({
  status,
  estadoLuz,
  semEstacao = false,
  modoAgente = false,
  grande = false,
}) {
  let info;
  let codigo = null;
  if (status) {
    info = INFO_STATUS[status];
    codigo = status;
  } else if (semEstacao) {
    info = INFO_SEM_ESTACAO;
  } else if (estadoLuz) {
    info = INFO_ESTADO_LUZ[estadoLuz];
    codigo = estadoLuz;
  } else {
    info = INFO_SEM_MEDICAO;
  }
  if (!info) return null;

  const tom = tons[info.tom] || tons.neutro;
  const texto = modoAgente && codigo ? codigo : info.rotulo;

  return (
    <View
      style={[estilos.selo, grande && estilos.seloGrande, { backgroundColor: tom.fundo, borderColor: tom.texto }]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Situação: ${info.rotulo}`}
    >
      <Ionicons
        name={info.icone}
        size={grande ? tamanhosIcone.medio : tamanhosIcone.pequeno}
        color={tom.texto}
      />
      <Text style={[estilos.texto, grande && estilos.textoGrande, { color: tom.texto }]}>
        {texto}
      </Text>
    </View>
  );
}
