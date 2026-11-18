import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRelatos } from '../../context/RelatosContext';
import CampoTexto from '../../components/CampoTexto';
import CampoMascara from '../../components/CampoMascara';
import Botao from '../../components/Botao';
import OpcaoSelecionavel from '../../components/OpcaoSelecionavel';
import { PARADAS, ROTULO_TIPO_PONTO, buscarEstacaoDaParada } from '../../constants/paradas';
import { TIPOS_PROBLEMA } from '../../constants/tiposProblema';
import { MASCARAS, QUALIDADE_FOTO } from '../../constants/limiares';
import {
  validarDescricao,
  validarCEP,
  validarObrigatorio,
  juntarErros,
} from '../../utils/validadores';
import estilos from '../../styles/NovoRelatoScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

const INICIAL = { paradaId: null, tipo: null, descricao: '', cep: '', fotoUri: null };

function validarTudo(v) {
  return {
    paradaId: validarObrigatorio(v.paradaId, 'Escolha a parada ou o local.'),
    tipo: validarObrigatorio(v.tipo, 'Escolha o tipo do problema.'),
    descricao: validarDescricao(v.descricao),
    cep: validarCEP(v.cep),
  };
}

function ErroCampo({ texto }) {
  if (!texto) return null;
  return (
    <View style={estilos.linhaErro} accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle" size={tamanhosIcone.pequeno} color={cores.erro} />
      <Text style={estilos.erro}>{texto}</Text>
    </View>
  );
}

export default function NovoRelatoScreen({ navigation, route }) {
  const { criarRelato } = useRelatos();
  const [valores, setValores] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [versaoForm, setVersaoForm] = useState(0); // troca a key do CEP para limpar a máscara

  // Permite abrir a tela com a parada já escolhida (vindo do Início).
  const paradaInicial = route.params?.paradaId;
  useEffect(() => {
    if (paradaInicial) {
      setValores((v) => ({ ...v, paradaId: paradaInicial }));
      setErros((e) => ({ ...e, paradaId: null }));
      navigation.setParams({ paradaId: undefined });
    }
  }, [paradaInicial, navigation]);

  const alterar = (campo, valor) => {
    const novo = { ...valores, [campo]: valor };
    setValores(novo);
    setErroGeral(null);
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: validarTudo(novo)[campo] }));
  };

  const validarCampo = (campo) => () =>
    setErros((e) => ({ ...e, [campo]: validarTudo(valores)[campo] }));

  const escolherFoto = async () => {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        setErroGeral('Sem permissão para abrir as fotos. A foto é opcional: você pode enviar sem ela.');
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: QUALIDADE_FOTO,
      });
      if (!resultado.canceled && resultado.assets?.length) {
        alterar('fotoUri', resultado.assets[0].uri);
      }
    } catch (e) {
      setErroGeral('Não foi possível abrir as fotos. Você pode enviar o relato sem foto.');
    }
  };

  const enviar = async () => {
    const novosErros = juntarErros(validarTudo(valores));
    setErros(novosErros);
    if (Object.keys(novosErros).length) {
      setErroGeral('Falta preencher alguns campos. Veja as mensagens em vermelho.');
      return;
    }

    setEnviando(true);
    try {
      const relato = await criarRelato(valores);
      setValores(INICIAL);
      setErros({});
      setVersaoForm((n) => n + 1);
      navigation.navigate('DetalheRelato', { relatoId: relato.id });
    } catch (e) {
      setErroGeral(e.message || 'Não foi possível enviar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  const paradaSemEstacao = valores.paradaId && !buscarEstacaoDaParada(valores.paradaId);

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.introducao}>São só 3 passos. A estação do local confere a luz na hora.</Text>

        {/* 1. Parada */}
        <Text style={estilos.passo} accessibilityRole="header">1. Onde fica?</Text>
        <View style={estilos.grupo} accessibilityRole="radiogroup" accessibilityLabel="Parada ou local">
          {PARADAS.map((p) => (
            <OpcaoSelecionavel
              key={p.id}
              titulo={p.nome}
              descricao={ROTULO_TIPO_PONTO[p.tipo]}
              selecionado={valores.paradaId === p.id}
              onPress={() => alterar('paradaId', p.id)}
            />
          ))}
        </View>
        <ErroCampo texto={erros.paradaId} />
        {paradaSemEstacao ? (
          <View style={estilos.caixaAviso}>
            <Ionicons name="information-circle" size={tamanhosIcone.medio} color={cores.aviso} />
            <Text style={estilos.textoAviso}>
              Sem estação neste ponto. O relato vai direto para a equipe, sem medição automática.
            </Text>
          </View>
        ) : null}

        {/* 2. Tipo */}
        <Text style={estilos.passo} accessibilityRole="header">2. O que está acontecendo?</Text>
        <View style={estilos.grupo} accessibilityRole="radiogroup" accessibilityLabel="Tipo do problema">
          {TIPOS_PROBLEMA.map((t) => (
            <OpcaoSelecionavel
              key={t.id}
              variante="bloco"
              icone={t.icone}
              titulo={t.rotulo}
              descricao={t.descricao}
              selecionado={valores.tipo === t.id}
              onPress={() => alterar('tipo', t.id)}
            />
          ))}
        </View>
        <ErroCampo texto={erros.tipo} />

        {/* 3. Descrição */}
        <Text style={estilos.passo} accessibilityRole="header">3. Conte rapidinho</Text>
        <CampoTexto
          rotulo="Descrição"
          value={valores.descricao}
          onChangeText={(t) => alterar('descricao', t)}
          onBlur={validarCampo('descricao')}
          erro={erros.descricao}
          placeholder="Ex.: o poste do ponto está apagado"
          dica="Pelo menos 10 letras."
          multiline
        />

        <Text style={estilos.passo} accessibilityRole="header">Se quiser, complete</Text>
        <CampoMascara
          key={`cep-${versaoForm}`}
          rotulo="CEP"
          opcional
          mascara={MASCARAS.CEP}
          aoMudar={(t) => alterar('cep', t)}
          onBlur={validarCampo('cep')}
          erro={erros.cep}
          placeholder="00000-000"
          keyboardType="numeric"
        />

        {valores.fotoUri ? (
          <View style={estilos.caixaFoto}>
            <Image
              source={{ uri: valores.fotoUri }}
              style={estilos.foto}
              accessible
              accessibilityLabel="Foto escolhida para o relato"
            />
            <Botao
              titulo="Remover foto"
              variante="texto"
              icone="trash-outline"
              onPress={() => alterar('fotoUri', null)}
            />
          </View>
        ) : (
          <Botao
            titulo="Adicionar foto (opcional)"
            variante="secundario"
            icone="camera-outline"
            onPress={escolherFoto}
            accessibilityHint="Abre a galeria para escolher uma foto do local"
          />
        )}

        {erroGeral ? (
          <View style={estilos.caixaErroGeral} accessibilityRole="alert" accessibilityLiveRegion="assertive">
            <Ionicons name="close-circle" size={tamanhosIcone.medio} color={cores.erro} />
            <Text style={estilos.textoErroGeral}>{erroGeral}</Text>
          </View>
        ) : null}

        <Botao
          titulo="Enviar relato"
          variante="destaque"
          icone="send"
          grande
          onPress={enviar}
          carregando={enviando}
          accessibilityHint="Envia o relato e abre o acompanhamento"
          style={estilos.botaoEnviar}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
