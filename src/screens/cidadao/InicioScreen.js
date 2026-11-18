import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRelatos, useEstacoes } from '../../context/RelatosContext';
import Botao from '../../components/Botao';
import SeloStatus from '../../components/SeloStatus';
import { PARADAS, ROTULO_TIPO_PONTO } from '../../constants/paradas';
import { INFO_ESTADO_LUZ, INFO_SEM_ESTACAO, INFO_SEM_MEDICAO, STATUS_ABERTOS } from '../../constants/status';
import { saudacao, primeiroNome } from '../../utils/formatadores';
import estilos from '../../styles/InicioScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

export default function InicioScreen({ navigation }) {
  const { usuario } = useAuth();
  const { meusRelatos } = useRelatos();
  const estacoes = useEstacoes();

  const emAndamento = meusRelatos.filter((r) => STATUS_ABERTOS.includes(r.status)).length;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View accessible accessibilityRole="header">
        <Text style={estilos.saudacao}>
          {saudacao()}, {primeiroNome(usuario?.nome)}!
        </Text>
        <Text style={estilos.textoSecao}>Viu um ponto escuro no caminho? Avise aqui.</Text>
      </View>

      <Botao
        titulo="Relatar ponto escuro"
        variante="destaque"
        icone="flashlight"
        grande
        onPress={() => navigation.navigate('NovoRelato')}
        accessibilityHint="Abre o formulário de relato, com 3 passos"
      />

      {emAndamento > 0 ? (
        <Pressable
          onPress={() => navigation.navigate('MeusRelatos')}
          style={({ pressed }) => [estilos.cartaoResumo, pressed && estilos.pressionado]}
          accessibilityRole="button"
          accessibilityLabel={`Você tem ${emAndamento} ${emAndamento === 1 ? 'relato' : 'relatos'} em andamento`}
          accessibilityHint="Abre a lista dos seus relatos"
        >
          <Ionicons name="time" size={tamanhosIcone.grande} color={cores.primaria} />
          <Text style={estilos.textoResumo}>
            Você tem {emAndamento} {emAndamento === 1 ? 'relato' : 'relatos'} em andamento
          </Text>
          <Ionicons name="chevron-forward" size={tamanhosIcone.medio} color={cores.textoSecundario} />
        </Pressable>
      ) : null}

      <Text style={estilos.tituloSecao} accessibilityRole="header">Como está a luz agora</Text>
      <Text style={estilos.textoSecao}>Medido pelas estações instaladas nos pontos. Toque para relatar.</Text>

      {PARADAS.map((parada) => {
        const estacao = estacoes.find((e) => e.paradaId === parada.id);
        const info = !estacao
          ? INFO_SEM_ESTACAO
          : estacao.estado
            ? INFO_ESTADO_LUZ[estacao.estado]
            : INFO_SEM_MEDICAO;

        return (
          <Pressable
            key={parada.id}
            onPress={() => navigation.navigate('NovoRelato', { paradaId: parada.id })}
            style={({ pressed }) => [estilos.cartaoParada, pressed && estilos.pressionado]}
            accessibilityRole="button"
            accessibilityLabel={`${parada.nome}, ${ROTULO_TIPO_PONTO[parada.tipo]}. ${info.texto}`}
            accessibilityHint="Abre o relato com este local já escolhido"
          >
            <View style={estilos.textosParada}>
              <Text style={estilos.nomeParada}>{parada.nome}</Text>
              <Text style={estilos.tipoParada}>{ROTULO_TIPO_PONTO[parada.tipo]}</Text>
              <Text style={estilos.textoEstado}>{info.texto}</Text>
            </View>
            <SeloStatus estadoLuz={estacao?.estado} semEstacao={!estacao} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
