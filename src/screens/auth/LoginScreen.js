import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import CampoTexto from '../../components/CampoTexto';
import Botao from '../../components/Botao';
import { validarEmail, validarSenhaLogin, juntarErros } from '../../utils/validadores';
import { USUARIOS_TESTE } from '../../services/seedService';
import estilos from '../../styles/LoginScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

const VALIDADORES = {
  email: validarEmail,
  senha: validarSenhaLogin,
};

export default function LoginScreen({ navigation }) {
  const { entrar, erroInicial } = useAuth();
  const [valores, setValores] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(erroInicial);
  const [enviando, setEnviando] = useState(false);
  const senhaRef = useRef(null);

  const alterar = (campo) => (texto) => {
    setValores((v) => ({ ...v, [campo]: texto }));
    setErroGeral(null);
    // Se o campo já mostrava erro, revalida enquanto a pessoa corrige.
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: VALIDADORES[campo](texto) }));
  };

  const validarCampo = (campo) => () =>
    setErros((e) => ({ ...e, [campo]: VALIDADORES[campo](valores[campo]) }));

  const enviar = async () => {
    const novosErros = juntarErros({
      email: validarEmail(valores.email),
      senha: validarSenhaLogin(valores.senha),
    });
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    setEnviando(true);
    try {
      await entrar(valores.email, valores.senha);
    } catch (erro) {
      setErroGeral(erro.message || 'Não foi possível entrar. Tente de novo.');
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <View style={estilos.marca} accessible accessibilityRole="header">
          <View style={estilos.circuloIcone}>
            <Ionicons name="bulb" size={tamanhosIcone.enorme} color={cores.destaque} />
          </View>
          <Text style={estilos.nomeApp}>Luz Segura</Text>
          <Text style={estilos.slogan}>Avise a prefeitura sobre pontos escuros em Osasco.</Text>
        </View>

        {erroGeral ? (
          <View style={estilos.caixaErroGeral} accessibilityRole="alert" accessibilityLiveRegion="assertive">
            <Ionicons name="close-circle" size={tamanhosIcone.medio} color={cores.erro} />
            <Text style={estilos.textoErroGeral}>{erroGeral}</Text>
          </View>
        ) : null}

        <CampoTexto
          rotulo="E-mail"
          value={valores.email}
          onChangeText={alterar('email')}
          onBlur={validarCampo('email')}
          erro={erros.email}
          placeholder="nome@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current?.focus()}
        />
        <CampoTexto
          ref={senhaRef}
          rotulo="Senha"
          senha
          value={valores.senha}
          onChangeText={alterar('senha')}
          onBlur={validarCampo('senha')}
          erro={erros.senha}
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={enviar}
        />

        <View style={estilos.acoes}>
          <Botao
            titulo="Entrar"
            icone="log-in-outline"
            onPress={enviar}
            carregando={enviando}
            accessibilityHint="Entra no app com o e-mail e a senha digitados"
          />
          <Botao
            titulo="Criar conta"
            variante="secundario"
            icone="person-add-outline"
            onPress={() => navigation.navigate('Cadastro')}
            accessibilityHint="Abre o cadastro de cidadão"
          />
        </View>

        <View style={estilos.caixaTeste} accessible accessibilityLabel={`Usuários para testar. Cidadão: ${USUARIOS_TESTE.cidadao.email}, senha ${USUARIOS_TESTE.cidadao.senha}. Agente: ${USUARIOS_TESTE.agente.email}, senha ${USUARIOS_TESTE.agente.senha}.`}>
          <Text style={estilos.textoTeste}>
            <Text style={estilos.textoTesteForte}>Para testar: </Text>
            {'\n'}Cidadão: {USUARIOS_TESTE.cidadao.email} / {USUARIOS_TESTE.cidadao.senha}
            {'\n'}Agente: {USUARIOS_TESTE.agente.email} / {USUARIOS_TESTE.agente.senha}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
