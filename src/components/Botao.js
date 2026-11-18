import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import estilos, { corConteudo } from '../styles/Botao.styles';
import { tamanhosIcone } from '../styles/tema';

// Botão acessível do app. Variantes: primario, secundario, destaque, perigo, texto.
export default function Botao({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  grande = false,
  carregando = false,
  desabilitado = false,
  accessibilityLabel,
  accessibilityHint,
  selecionado,
  style,
}) {
  const inativo = desabilitado || carregando;
  const cor = corConteudo(variante, inativo);

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || titulo}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inativo, busy: carregando, selected: selecionado }}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        grande && estilos.grande,
        inativo && estilos.inativo,
        pressed && !inativo && estilos.pressionado,
        style,
      ]}
    >
      <View style={estilos.conteudo}>
        {carregando ? (
          <ActivityIndicator color={cor} />
        ) : (
          icone && (
            <Ionicons
              name={icone}
              size={grande ? tamanhosIcone.grande : tamanhosIcone.medio}
              color={cor}
            />
          )
        )}
        <Text style={[estilos.rotulo, grande && estilos.rotuloGrande, { color: cor }]}>
          {titulo}
        </Text>
      </View>
    </Pressable>
  );
}
