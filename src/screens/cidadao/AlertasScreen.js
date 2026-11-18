import React, { useState } from 'react';
import { FlatList, RefreshControl, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelatos } from '../../context/RelatosContext';
import EstadoVazio from '../../components/EstadoVazio';
import Carregando from '../../components/Carregando';
import Botao from '../../components/Botao';
import { formatarDataHora } from '../../utils/formatadores';
import estilos from '../../styles/AlertasScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

export default function AlertasScreen({ navigation }) {
  const { alertas, alertasNaoLidos, carregando, recarregar, marcarAlertaLido, marcarTodosLidos, buscarRelato } =
    useRelatos();
  const [atualizando, setAtualizando] = useState(false);

  const atualizar = async () => {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  };

  const abrir = async (alerta) => {
    if (!alerta.lido) await marcarAlertaLido(alerta.id);
    if (alerta.relatoId && buscarRelato(alerta.relatoId)) {
      navigation.navigate('DetalheRelato', { relatoId: alerta.relatoId });
    }
  };

  if (carregando) return <Carregando mensagem="Carregando alertas..." />;

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.lista}
      data={alertas}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} colors={[cores.primaria]} />}
      ListHeaderComponent={
        alertasNaoLidos > 0 ? (
          <Botao
            titulo={`Marcar todos como lidos (${alertasNaoLidos})`}
            variante="secundario"
            icone="checkmark-done"
            onPress={marcarTodosLidos}
          />
        ) : null
      }
      renderItem={({ item }) => (
        <View style={[estilos.cartao, !item.lido && estilos.naoLido]}>
          <Pressable
            onPress={() => abrir(item)}
            style={estilos.areaToque}
            accessibilityRole="button"
            accessibilityLabel={`${item.lido ? '' : 'Não lido. '}${item.titulo}. ${item.mensagem}. ${formatarDataHora(item.criadoEm)}`}
            accessibilityHint={item.relatoId ? 'Abre o relato deste alerta' : undefined}
          >
            <Ionicons
              name={item.lido ? 'notifications-outline' : 'notifications'}
              size={tamanhosIcone.medio}
              color={item.lido ? cores.textoSecundario : cores.primaria}
            />
            <View style={estilos.textos}>
              <View style={estilos.linhaTitulo}>
                <Text style={estilos.titulo}>{item.titulo}</Text>
                {!item.lido && <Text style={estilos.etiquetaNovo}>NOVO</Text>}
              </View>
              <Text style={estilos.mensagem}>{item.mensagem}</Text>
              <Text style={estilos.hora}>{formatarDataHora(item.criadoEm)}</Text>
            </View>
          </Pressable>
          {!item.lido && (
            <Botao
              titulo="Marcar como lido"
              variante="texto"
              icone="checkmark"
              onPress={() => marcarAlertaLido(item.id)}
              accessibilityHint="Tira a marca de não lido deste alerta"
            />
          )}
        </View>
      )}
      ListEmptyComponent={
        <EstadoVazio
          icone="notifications-off-outline"
          titulo="Nenhum alerta por enquanto"
          mensagem="Quando a estação confirmar ou a equipe consertar um ponto que você relatou, o aviso aparece aqui."
        />
      }
    />
  );
}
