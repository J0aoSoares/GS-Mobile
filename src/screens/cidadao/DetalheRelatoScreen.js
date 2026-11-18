import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelatos } from '../../context/RelatosContext';
import SeloStatus from '../../components/SeloStatus';
import LinhaDoTempo from '../../components/LinhaDoTempo';
import EstadoVazio from '../../components/EstadoVazio';
import Carregando from '../../components/Carregando';
import { INFO_STATUS, INFO_ESTADO_LUZ, STATUS } from '../../constants/status';
import { buscarParada, buscarEstacaoDaParada, ROTULO_TIPO_PONTO } from '../../constants/paradas';
import { buscarTipoProblema } from '../../constants/tiposProblema';
import { LUX_ADEQUADA } from '../../constants/limiares';
import { formatarLux, formatarHora, formatarDataHora, formatarCEP } from '../../utils/formatadores';
import estilos from '../../styles/DetalheRelatoScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

// Detalhe do relato do cidadão. Atualiza sozinho quando a estação termina a validação,
// porque o relato vem do contexto (que recarrega a cada mudança).
export default function DetalheRelatoScreen({ route, navigation }) {
  const { buscarRelato, carregando } = useRelatos();
  const relato = buscarRelato(route.params?.relatoId);

  if (carregando) return <Carregando />;
  if (!relato) {
    return (
      <EstadoVazio
        icone="search-outline"
        titulo="Relato não encontrado"
        mensagem="Ele pode ter sido apagado ao restaurar os dados de demonstração."
        textoAcao="Voltar"
        onAcao={() => navigation.goBack()}
      />
    );
  }

  const parada = buscarParada(relato.paradaId);
  const estacao = buscarEstacaoDaParada(relato.paradaId);
  const tipo = buscarTipoProblema(relato.tipo);
  const info = INFO_STATUS[relato.status];
  const validando = relato.status === STATUS.VALIDANDO;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cartao} accessible accessibilityLabel={`Situação: ${info.rotulo}. ${info.texto}`}>
        <SeloStatus status={relato.status} grande />
        <Text style={estilos.textoStatus}>{info.texto}</Text>
        {validando ? (
          <View style={estilos.linhaMedindo}>
            <ActivityIndicator color={cores.info} />
            <Text style={estilos.textoMedindo}>Medindo a luz agora...</Text>
          </View>
        ) : null}
      </View>

      {relato.medicao ? (
        <View style={estilos.cartaoMedicao} accessible>
          <Ionicons name="speedometer" size={tamanhosIcone.grande} color={cores.primaria} />
          <View style={estilos.textosMedicao}>
            <Text style={estilos.textoMedicao}>
              A estação mediu {formatarLux(relato.medicao.lux)} lux às {formatarHora(relato.medicao.em)}
            </Text>
            <Text style={estilos.textoSecao}>
              Resultado: {INFO_ESTADO_LUZ[relato.medicao.estado]?.rotulo}. Luz adequada é a partir de {LUX_ADEQUADA} lux.
            </Text>
          </View>
        </View>
      ) : null}

      {relato.semEstacao ? (
        <View style={estilos.caixaAviso}>
          <Ionicons name="radio-outline" size={tamanhosIcone.medio} color={cores.aviso} />
          <Text style={estilos.textoAviso}>
            Sem estação neste ponto. A equipe vai analisar o relato sem medição automática.
          </Text>
        </View>
      ) : null}

      <View style={estilos.cartao}>
        <Text style={estilos.rotuloCampo}>Local</Text>
        <Text style={estilos.valorCampo}>{parada?.nome}</Text>
        <Text style={estilos.textoSecao}>
          {ROTULO_TIPO_PONTO[parada?.tipo]}
          {estacao ? ` · estação ${estacao.codigo}` : ''}
        </Text>

        <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Problema</Text>
        <Text style={estilos.valorCampo}>{tipo?.rotulo}</Text>

        <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Descrição</Text>
        <Text style={estilos.valorCampo}>{relato.descricao}</Text>

        {relato.cep ? (
          <>
            <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>CEP</Text>
            <Text style={estilos.valorCampo}>{formatarCEP(relato.cep)}</Text>
          </>
        ) : null}

        <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Enviado em</Text>
        <Text style={estilos.valorCampo}>{formatarDataHora(relato.criadoEm)}</Text>
      </View>

      {relato.fotoUri ? (
        <Image
          source={{ uri: relato.fotoUri }}
          style={estilos.foto}
          accessible
          accessibilityLabel="Foto enviada com o relato"
        />
      ) : null}

      <Text style={estilos.tituloSecao} accessibilityRole="header">Andamento</Text>
      <View style={estilos.cartao}>
        <LinhaDoTempo historico={relato.historico} />
      </View>
    </ScrollView>
  );
}
