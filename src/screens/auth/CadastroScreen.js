import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import CampoTexto from '../../components/CampoTexto';
import CampoMascara from '../../components/CampoMascara';
import Botao from '../../components/Botao';
import {
  validarNome,
  validarCPF,
  validarEmail,
  validarTelefone,
  validarSenha,
  validarConfirmacaoSenha,
  juntarErros,
} from '../../utils/validadores';
import { MASCARAS } from '../../constants/limiares';
import estilos from '../../styles/CadastroScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

const INICIAL = { nome: '', cpf: '', email: '', telefone: '', senha: '', confirmacao: '' };

function validarTudo(v) {
  return {
    nome: validarNome(v.nome),
    cpf: validarCPF(v.cpf),
    email: validarEmail(v.email),
    telefone: validarTelefone(v.telefone),
    senha: validarSenha(v.senha),
    confirmacao: validarConfirmacaoSenha(v.senha, v.confirmacao),
  };
}

// Cadastro sempre cria um perfil de cidadão.
export default function CadastroScreen() {
  const { cadastrar } = useAuth();
  const [valores, setValores] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const refs = {
    email: useRef(null),
    senha: useRef(null),
    confirmacao: useRef(null),
  };

  const alterar = (campo) => (texto) => {
    const novo = { ...valores, [campo]: texto };
    setValores(novo);
    setErroGeral(null);
    // Revalida só os campos que já estavam com erro, enquanto a pessoa corrige.
    if (erros[campo] || (campo === 'senha' && erros.confirmacao)) {
      const todos = validarTudo(novo);
      setErros((e) => ({
        ...e,
        ...(e[campo] ? { [campo]: todos[campo] } : {}),
        ...(campo === 'senha' && e.confirmacao ? { confirmacao: todos.confirmacao } : {}),
      }));
    }
  };

  const validarCampo = (campo) => () =>
    setErros((e) => ({ ...e, [campo]: validarTudo(valores)[campo] }));

  const enviar = async () => {
    const novosErros = juntarErros(validarTudo(valores));
    setErros(novosErros);
    if (Object.keys(novosErros).length) {
      setErroGeral('Corrija os campos marcados em vermelho.');
      return;
    }

    setEnviando(true);
    try {
      await cadastrar({
        nome: valores.nome,
        cpf: valores.cpf,
        email: valores.email,
        telefone: valores.telefone,
        senha: valores.senha,
      });
      // O RootNavigator troca para as abas do cidadão sozinho.
    } catch (erro) {
      if (erro.campo) setErros((e) => ({ ...e, [erro.campo]: erro.message }));
      setErroGeral(erro.message || 'Não foi possível criar a conta. Tente de novo.');
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.introducao}>
          Crie sua conta para relatar pontos escuros e acompanhar o conserto.
        </Text>

        {erroGeral ? (
          <View style={estilos.caixaErroGeral} accessibilityRole="alert" accessibilityLiveRegion="assertive">
            <Ionicons name="close-circle" size={tamanhosIcone.medio} color={cores.erro} />
            <Text style={estilos.textoErroGeral}>{erroGeral}</Text>
          </View>
        ) : null}

        <CampoTexto
          rotulo="Nome completo"
          value={valores.nome}
          onChangeText={alterar('nome')}
          onBlur={validarCampo('nome')}
          erro={erros.nome}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
        <CampoMascara
          rotulo="CPF"
          mascara={MASCARAS.CPF}
          aoMudar={alterar('cpf')}
          onBlur={validarCampo('cpf')}
          erro={erros.cpf}
          placeholder="000.000.000-00"
          keyboardType="numeric"
          dica="Só números. Usamos o CPF para evitar contas repetidas."
        />
        <CampoTexto
          ref={refs.email}
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
        />
        <CampoMascara
          rotulo="Celular"
          mascara={MASCARAS.TELEFONE}
          aoMudar={alterar('telefone')}
          onBlur={validarCampo('telefone')}
          erro={erros.telefone}
          placeholder="(11) 90000-0000"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
        <CampoTexto
          ref={refs.senha}
          rotulo="Senha"
          senha
          value={valores.senha}
          onChangeText={alterar('senha')}
          onBlur={validarCampo('senha')}
          erro={erros.senha}
          dica="Pelo menos 6 caracteres, com uma letra e um número."
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => refs.confirmacao.current?.focus()}
        />
        <CampoTexto
          ref={refs.confirmacao}
          rotulo="Repita a senha"
          senha
          value={valores.confirmacao}
          onChangeText={alterar('confirmacao')}
          onBlur={validarCampo('confirmacao')}
          erro={erros.confirmacao}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={enviar}
        />

        <View style={estilos.acoes}>
          <Botao
            titulo="Criar minha conta"
            icone="checkmark-circle-outline"
            onPress={enviar}
            carregando={enviando}
            accessibilityHint="Cria a conta de cidadão e entra no app"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
