import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from './Botao';
import estilos from '../styles/EstadoVazio.styles';
import { cores, tamanhosIcone } from '../styles/tema';

// Mensagem para listas vazias, orientando o próximo passo.
export default function EstadoVazio({ icone = 'file-tray-outline', titulo, mensagem, textoAcao, onAcao }) {
  return (
    <View style={estilos.container}>
      <View accessible accessibilityLabel={`${titulo}. ${mensagem || ''}`} style={estilos.textos}>
        <Ionicons name={icone} size={tamanhosIcone.enorme} color={cores.textoSecundario} />
        <Text style={estilos.titulo}>{titulo}</Text>
        {mensagem ? <Text style={estilos.mensagem}>{mensagem}</Text> : null}
      </View>
      {textoAcao && onAcao ? <Botao titulo={textoAcao} onPress={onAcao} style={estilos.botao} /> : null}
    </View>
  );
}
