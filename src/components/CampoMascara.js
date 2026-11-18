import React, { forwardRef, useState } from 'react';
import { View, Text } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Ionicons } from '@expo/vector-icons';
import estilos from '../styles/CampoMascara.styles';
import { cores, tamanhosIcone } from '../styles/tema';

// Campo com máscara (CPF, telefone, CEP). Devolve o texto mascarado e só os dígitos.
// O componente de máscara é não-controlado: para limpar, troque a `key` do campo.
const CampoMascara = forwardRef(function CampoMascara(
  { rotulo, mascara, valorInicial = '', aoMudar, erro, dica, opcional = false, style, onBlur, ...props },
  ref
) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={[estilos.container, style]}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {opcional && <Text style={estilos.opcional}> (opcional)</Text>}
      </Text>

      <View style={[estilos.caixa, focado && estilos.caixaFocada, erro && estilos.caixaErro]}>
        <MaskedTextInput
          ref={ref}
          mask={mascara}
          defaultValue={valorInicial}
          onChangeText={(mascarado, bruto) => aoMudar?.(mascarado, bruto)}
          style={estilos.entrada}
          placeholderTextColor={cores.textoDesabilitado}
          accessibilityLabel={rotulo}
          accessibilityHint={erro ? `Erro: ${erro}` : dica}
          onFocus={() => setFocado(true)}
          onBlur={(e) => {
            setFocado(false);
            onBlur?.(e);
          }}
          {...props}
        />
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

export default CampoMascara;
