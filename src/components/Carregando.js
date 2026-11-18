import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import estilos from '../styles/Carregando.styles';
import { cores } from '../styles/tema';

// Indicador de carregamento com texto (leitor de tela anuncia a mensagem).
export default function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <View
      style={estilos.container}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={mensagem}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={estilos.texto}>{mensagem}</Text>
    </View>
  );
}
