import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Botao from '../../components/Botao';
import { ROTULO_PERFIL } from '../../constants/status';
import { mascararCPFParcial, formatarTelefone } from '../../utils/formatadores';
import estilos from '../../styles/PerfilScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

function Linha({ icone, rotulo, valor }) {
  return (
    <View style={estilos.linha} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <Ionicons name={icone} size={tamanhosIcone.medio} color={cores.primaria} />
      <View style={estilos.textosLinha}>
        <Text style={estilos.rotuloCampo}>{rotulo}</Text>
        <Text style={estilos.valorCampo}>{valor}</Text>
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const { usuario, sair, restaurarDemo } = useAuth();
  const [restaurando, setRestaurando] = useState(false);
  const [erro, setErro] = useState(null);

  if (!usuario) return null;

  const confirmarRestauracao = () => {
    Alert.alert(
      'Restaurar dados de demonstração?',
      'Todos os relatos, alertas e contas criadas serão apagados e os dados de exemplo voltam. Você vai precisar entrar de novo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            setRestaurando(true);
            setErro(null);
            try {
              await restaurarDemo();
            } catch (e) {
              setErro('Não foi possível restaurar os dados. Tente de novo.');
              setRestaurando(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalho} accessible accessibilityRole="header">
        <View style={estilos.avatar}>
          <Ionicons name="person" size={tamanhosIcone.enorme} color={cores.textoSobrePrimaria} />
        </View>
        <Text style={estilos.nome}>{usuario.nome}</Text>
        <Text style={estilos.perfil}>{ROTULO_PERFIL[usuario.perfil]}</Text>
      </View>

      <View style={estilos.cartao}>
        <Linha icone="mail-outline" rotulo="E-mail" valor={usuario.email} />
        <Linha icone="card-outline" rotulo="CPF" valor={mascararCPFParcial(usuario.cpf)} />
        <Linha icone="call-outline" rotulo="Celular" valor={formatarTelefone(usuario.telefone)} />
      </View>

      {erro ? (
        <View style={estilos.caixaErro} accessibilityRole="alert">
          <Ionicons name="close-circle" size={tamanhosIcone.medio} color={cores.erro} />
          <Text style={estilos.textoErro}>{erro}</Text>
        </View>
      ) : null}

      <Botao
        titulo="Restaurar dados de demonstração"
        variante="secundario"
        icone="refresh"
        onPress={confirmarRestauracao}
        carregando={restaurando}
        accessibilityHint="Apaga os dados do app e recria os dados de exemplo"
      />
      <Botao
        titulo="Sair"
        variante="perigo"
        icone="log-out-outline"
        onPress={sair}
        accessibilityHint="Sai da sua conta e volta para a tela de login"
      />
    </ScrollView>
  );
}
