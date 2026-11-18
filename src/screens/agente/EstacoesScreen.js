import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelatos, useEstacoes } from '../../context/RelatosContext';
import MedidorLux from '../../components/MedidorLux';
import Botao from '../../components/Botao';
import EstadoVazio from '../../components/EstadoVazio';
import { buscarParada } from '../../constants/paradas';
import {
  CENARIO,
  ROTULO_CENARIO,
  JANELAS_RUINS_PARA_ALERTA,
  LEITURAS_POR_JANELA,
  INTERVALO_LEITURA_EFETIVO_MS,
  VELOCIDADE_DEMO,
  TEMPO,
} from '../../constants/limiares';
import estilos from '../../styles/EstacoesScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

const ACOES = [
  { cenario: CENARIO.QUEIMA, titulo: 'Simular queima', icone: 'flash-off' },
  { cenario: CENARIO.FRACA, titulo: 'Simular luz fraca', icone: 'partly-sunny' },
  { cenario: CENARIO.OSCILANDO, titulo: 'Simular oscilação', icone: 'pulse' },
  { cenario: CENARIO.SENSOR_SUSPEITO, titulo: 'Simular sensor com defeito', icone: 'warning' },
];

const segundosPorJanela = (LEITURAS_POR_JANELA * INTERVALO_LEITURA_EFETIVO_MS) / TEMPO.MS_POR_SEGUNDO;

function CartaoEstacao({ estacao, aoSimular }) {
  const parada = buscarParada(estacao.paradaId);

  return (
    <View style={estilos.cartao}>
      <View style={estilos.linhaTitulo}>
        <Ionicons name="radio" size={tamanhosIcone.medio} color={cores.primaria} />
        <View style={estilos.textosTitulo}>
          <Text style={estilos.codigo} accessibilityRole="header">
            {estacao.codigo}
          </Text>
          <Text style={estilos.textoSecao}>{parada?.nome}</Text>
        </View>
      </View>

      <MedidorLux lux={estacao.luxAtual} estado={estacao.estado} historico={estacao.historico} modoAgente />

      <View style={estilos.linhaInfo}>
        <Text style={estilos.info}>
          Cenário: <Text style={estilos.infoForte}>{ROTULO_CENARIO[estacao.cenario]}</Text>
        </Text>
        <Text style={estilos.info}>
          Janela: {estacao.leiturasNaJanela}/{LEITURAS_POR_JANELA}
        </Text>
      </View>
      <Text style={[estilos.info, estacao.emAlerta && estilos.infoAlerta]}>
        {estacao.emAlerta ? '⚠ ' : ''}Janelas ruins seguidas: {estacao.janelasRuins}
        {estacao.janelasRuins < JANELAS_RUINS_PARA_ALERTA ? `/${JANELAS_RUINS_PARA_ALERTA}` : ' (alerta enviado)'}
      </Text>

      <View style={estilos.grade}>
        {ACOES.map((a) => (
          <Botao
            key={a.cenario}
            titulo={a.titulo}
            icone={a.icone}
            variante={estacao.cenario === a.cenario ? 'primario' : 'secundario'}
            onPress={() => aoSimular(estacao.id, a.cenario)}
            accessibilityLabel={`${a.titulo} na estação ${estacao.codigo}`}
            selecionado={estacao.cenario === a.cenario}
            style={estilos.botaoGrade}
          />
        ))}
      </View>
      <Botao
        titulo="Normalizar"
        icone="sunny"
        variante={estacao.cenario === CENARIO.NORMAL ? 'primario' : 'secundario'}
        selecionado={estacao.cenario === CENARIO.NORMAL}
        onPress={() => aoSimular(estacao.id, CENARIO.NORMAL)}
        accessibilityLabel={`Normalizar a estação ${estacao.codigo}`}
        accessibilityHint="Volta a luz para o nível normal"
      />
    </View>
  );
}

export default function EstacoesScreen() {
  const { simularCenario } = useRelatos();
  const estacoes = useEstacoes();

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.lista}
      data={estacoes}
      keyExtractor={(e) => e.id}
      ListHeaderComponent={
        <Text style={estilos.textoSecao}>
          Cada janela tem {LEITURAS_POR_JANELA} leituras (~{String(segundosPorJanela).replace('.', ',')} s
          {VELOCIDADE_DEMO ? ', modo demonstração' : ''}). Com {JANELAS_RUINS_PARA_ALERTA} janelas ruins
          seguidas, a estação abre um chamado automático.
        </Text>
      }
      renderItem={({ item }) => <CartaoEstacao estacao={item} aoSimular={simularCenario} />}
      ListEmptyComponent={<EstadoVazio icone="radio-outline" titulo="Nenhuma estação" mensagem="Nenhuma estação cadastrada." />}
    />
  );
}
