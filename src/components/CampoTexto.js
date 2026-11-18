import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import estilos from '../styles/CampoTexto.styles';
import { cores, tamanhosIcone } from '../styles/tema';

// Campo de texto com rótulo visível, dica e erro embaixo (sem modal).
// Com `senha`, mostra um botão de olho para exibir/ocultar.
const CampoTexto = forwardRef(function CampoTexto(
  { rotulo, erro, dica, opcional = false, senha = false, multiline = false, style, onFocus, onBlur, ...props },
  ref
) {
  const [oculto, setOculto] = useState(true);
  const [focado, setFocado] = useState(false);

  return (
    <View style={[estilos.container, style]}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {opcional && <Text style={estilos.opcional}> (opcional)</Text>}
      </Text>

      <View
        style={[
          estilos.caixa,
          focado && estilos.caixaFocada,
          erro && estilos.caixaErro,
          multiline && estilos.caixaMultilinha,
        ]}
      >
        <TextInput
          ref={ref}
          style={[estilos.entrada, multiline && estilos.entradaMultilinha]}
          placeholderTextColor={cores.textoDesabilitado}
          secureTextEntry={senha && oculto}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={rotulo}
          accessibilityHint={erro ? `Erro: ${erro}` : dica}
          accessibilityState={{ disabled: props.editable === false }}
          onFocus={(e) => {
            setFocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {senha && (
          <Pressable
            onPress={() => setOculto((v) => !v)}
            style={estilos.botaoOlho}
            accessibilityRole="button"
            accessibilityLabel={oculto ? 'Mostrar senha' : 'Esconder senha'}
            accessibilityHint="Alterna a exibição da senha digitada"
          >
            <Ionicons
              name={oculto ? 'eye-outline' : 'eye-off-outline'}
              size={tamanhosIcone.medio}
              color={cores.textoSecundario}
            />
          </Pressable>
        )}
      </View>

      {dica && !erro ? <Text style={estilos.dica}>{dica}</Text> : null}
      {erro ? (
        <View style={estilos.linhaErro} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={tamanhosIcone.pequeno} color={cores.erro} />
          <Text style={estilos.erro}>{erro}</Text>
        </View>
      ) : null}
    </View>
  );
});

export default CampoTexto;
