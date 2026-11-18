import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelatos } from '../../context/RelatosContext';
import CardRelato from '../../components/CardRelato';
import EstadoVazio from '../../components/EstadoVazio';
import Carregando from '../../components/Carregando';
import Botao from '../../components/Botao';
import OpcaoSelecionavel from '../../components/OpcaoSelecionavel';
import { ordenarPorPrioridade } from '../../services/prioridadeService';
import { STATUS, STATUS_ABERTOS, INFO_STATUS } from '../../constants/status';
import { formatarHora } from '../../utils/formatadores';
import estilos from '../../styles/ChamadosScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

const FILTRO_ABERTOS = 'ABERTOS';
const FILTRO_TODOS = 'TODOS';
const FILTROS = [
  { id: FILTRO_ABERTOS, rotulo: 'Abertos' },
  { id: STATUS.CONFIRMADO, rotulo: STATUS.CONFIRMADO },
  { id: STATUS.CONTESTADO, rotulo: STATUS.CONTESTADO },
  { id: STATUS.RECEBIDO, rotulo: STATUS.RECEBIDO },
  { id: STATUS.VALIDANDO, rotulo: STATUS.VALIDANDO },
  { id: STATUS.EM_MANUTENCAO, rotulo: STATUS.EM_MANUTENCAO },
  { id: STATUS.RESOLVIDO, rotulo: STATUS.RESOLVIDO },
  { id: FILTRO_TODOS, rotulo: 'Todos' },
];
const MAX_ALERTAS_VISIVEIS = 3;

function filtrar(itens, filtro) {
  if (filtro === FILTRO_TODOS) return itens;
  if (filtro === FILTRO_ABERTOS) return itens.filter((i) => STATUS_ABERTOS.includes(i.relato.status));
  return itens.filter((i) => i.relato.status === filtro);
}

export default function ChamadosScreen({ navigation }) {
  const { relatos, alertas, carregando, erro, recarregar, marcarAlertaLido, marcarTodosLidos } = useRelatos();
  const [filtro, setFiltro] = useState(FILTRO_ABERTOS);
  const [atualizando, setAtualizando] = useState(false);

  const fila = useMemo(() => ordenarPorPrioridade(relatos), [relatos]);
  const visiveis = useMemo(() => filtrar(fila, filtro), [fila, filtro]);
  const naoLidos = alertas.filter((a) => !a.lido);

  const atualizar = async () => {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  };

  const abrirAlerta = async (alerta) => {
    await marcarAlertaLido(alerta.id);
    if (alerta.relatoId && relatos.some((r) => r.id === alerta.relatoId)) {
      navigation.navigate('DetalheChamado', { relatoId: alerta.relatoId });
    }
  };

  if (carregando) return <Carregando mensagem="Carregando a fila de chamados..." />;

  const cabecalho = (
    <View style={estilos.cabecalho}>
      {erro ? (
        <View style={estilos.caixaErro} accessibilityRole="alert">
          <Ionicons name="cloud-offline" size={tamanhosIcone.medio} color={cores.erro} />
          <Text style={estilos.textoErro}>{erro}</Text>
        </View>
      ) : null}

      {naoLidos.length ? (
        <View style={estilos.caixaAlertas}>
          <View style={estilos.linhaTituloAlertas}>
            <Ionicons name="notifications" size={tamanhosIcone.medio} color={cores.aviso} />
            <Text style={estilos.tituloAlertas} accessibilityRole="header">
              {naoLidos.length} {naoLidos.length === 1 ? 'alerta novo' : 'alertas novos'}
            </Text>
          </View>
          {naoLidos.slice(0, MAX_ALERTAS_VISIVEIS).map((a) => (
            <Pressable
              key={a.id}
              onPress={() => abrirAlerta(a)}
              style={estilos.alerta}
              accessibilityRole="button"
              accessibilityLabel={`${a.titulo}. ${a.mensagem}. ${formatarHora(a.criadoEm)}`}
              accessibilityHint="Marca como lido e abre o chamado"
            >
              <Text style={estilos.alertaTitulo}>
                {formatarHora(a.criadoEm)} · {a.titulo}
              </Text>
              <Text style={estilos.alertaMensagem}>{a.mensagem}</Text>
            </Pressable>
          ))}
          <Botao
            titulo="Marcar todos como lidos"
            variante="texto"
            icone="checkmark-done"
            onPress={marcarTodosLidos}
          />
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.filtros}
        accessibilityRole="radiogroup"
        accessibilityLabel="Filtrar chamados por status"
      >
        {FILTROS.map((f) => (
          <OpcaoSelecionavel
            key={f.id}
            variante="chip"
            titulo={f.rotulo}
            selecionado={filtro === f.id}
            onPress={() => setFiltro(f.id)}
            accessibilityHint={INFO_STATUS[f.id]?.rotulo ? `Mostra só chamados ${INFO_STATUS[f.id].rotulo.toLowerCase()}` : undefined}
          />
        ))}
      </ScrollView>

      <Text style={estilos.textoSecao}>
        {visiveis.length} {visiveis.length === 1 ? 'chamado' : 'chamados'} · ordenados pela prioridade (0 a 100)
      </Text>
    </View>
  );

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.lista}
      data={visiveis}
      keyExtractor={(item) => item.relato.id}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} colors={[cores.primaria]} />}
      ListHeaderComponent={cabecalho}
      renderItem={({ item }) => (
        <CardRelato
          relato={item.relato}
          prioridade={item.prioridade}
          modoAgente
          onPress={() => navigation.navigate('DetalheChamado', { relatoId: item.relato.id })}
        />
      )}
      ListEmptyComponent={
        <EstadoVazio
          icone="checkmark-circle-outline"
          titulo="Nenhum chamado aqui"
          mensagem={
            filtro === FILTRO_ABERTOS
              ? 'Não há chamados abertos. Simule uma falha na aba Estações para ver a fila funcionando.'
              : 'Nenhum chamado com este status. Troque o filtro acima.'
          }
          textoAcao={filtro !== FILTRO_TODOS ? 'Ver todos' : undefined}
          onAcao={() => setFiltro(FILTRO_TODOS)}
        />
      }
    />
  );
}
