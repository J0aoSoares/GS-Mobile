import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import estilos from '../styles/OpcaoSelecionavel.styles';
import { cores, tamanhosIcone } from '../styles/tema';

// Opção de escolha única (rádio) com área de toque grande.
// variante "bloco" = botão grande com ícone (tipo do problema); "linha" = item de lista;
// "chip" = filtro compacto.
export default function OpcaoSelecionavel({
  titulo,
  descricao,
  icone,
  selecionado = false,
  onPress,
  variante = 'linha',
  accessibilityHint,
}) {
  const corIcone = selecionado ? cores.textoSobrePrimaria : cores.primaria;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selecionado, selected: selecionado }}
      accessibilityLabel={descricao ? `${titulo}. ${descricao}` : titulo}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        selecionado && estilos.selecionado,
        pressed && estilos.pressionado,
      ]}
    >
      {icone ? (
        <Ionicons
          name={icone}
          size={variante === 'bloco' ? tamanhosIcone.grande : tamanhosIcone.medio}
          color={corIcone}
        />
      ) : null}
      <View style={variante === 'chip' ? null : estilos.textos}>
        <Text style={[estilos.titulo, variante === 'chip' && estilos.tituloChip, selecionado && estilos.textoSelecionado]}>
          {titulo}
        </Text>
        {descricao && variante !== 'chip' ? (
          <Text style={[estilos.descricao, selecionado && estilos.textoSelecionado]}>{descricao}</Text>
        ) : null}
      </View>
      {variante === 'linha' ? (
        <Ionicons
          name={selecionado ? 'radio-button-on' : 'radio-button-off'}
          size={tamanhosIcone.medio}
          color={corIcone}
        />
      ) : null}
    </Pressable>
  );
}
