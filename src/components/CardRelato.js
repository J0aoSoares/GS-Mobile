import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SeloStatus from './SeloStatus';
import { buscarParada } from '../constants/paradas';
import { buscarTipoProblema } from '../constants/tiposProblema';
import { INFO_STATUS, ORIGEM } from '../constants/status';
import { tempoDecorrido } from '../utils/formatadores';
import estilos from '../styles/CardRelato.styles';
import { cores, tamanhosIcone } from '../styles/tema';

// Card de relato (cidadão) ou de chamado (agente, com a nota de prioridade).
export default function CardRelato({ relato, onPress, modoAgente = false, prioridade = null }) {
  const parada = buscarParada(relato.paradaId);
  const tipo = buscarTipoProblema(relato.tipo);
  const automatico = relato.origem === ORIGEM.ESTACAO;
  const quando = tempoDecorrido(relato.criadoEm);

  const rotuloAcessivel = [
    automatico ? 'Chamado automático da estação' : tipo?.rotulo,
    parada?.nome,
    `situação ${INFO_STATUS[relato.status]?.rotulo}`,
    prioridade ? `prioridade ${prioridade.total} de 100` : null,
    `aberto ${quando}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.card, pressed && estilos.pressionado]}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      accessibilityHint={modoAgente ? 'Abre o detalhe do chamado' : 'Abre o detalhe do seu relato'}
    >
      <View style={estilos.topo}>
        <View style={estilos.icone}>
          <Ionicons name={tipo?.icone || 'help'} size={tamanhosIcone.medio} color={cores.primaria} />
        </View>
        <View style={estilos.textos}>
          <Text style={estilos.titulo} numberOfLines={2}>
            {parada?.nome || 'Ponto desconhecido'}
          </Text>
          <Text style={estilos.subtitulo}>
            {automatico ? 'Chamado automático da estação' : tipo?.rotulo} · {quando}
          </Text>
        </View>
        {prioridade ? (
          <View style={estilos.prioridade}>
            <Text style={estilos.prioridadeValor}>{prioridade.total}</Text>
            <Text style={estilos.prioridadeRotulo}>prioridade</Text>
          </View>
        ) : null}
      </View>

      <View style={estilos.rodape}>
        <SeloStatus status={relato.status} modoAgente={modoAgente} />
        <Ionicons name="chevron-forward" size={tamanhosIcone.medio} color={cores.textoSecundario} />
      </View>

      {modoAgente && prioridade ? (
        <Text style={estilos.explicacao}>
          {prioridade.explicacao.map((f) => `${f.fator} ${f.pontos}/${f.max}`).join(' · ')}
        </Text>
      ) : null}
    </Pressable>
  );
}
