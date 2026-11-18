import React, { useState } from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelatos } from '../../context/RelatosContext';
import CardRelato from '../../components/CardRelato';
import EstadoVazio from '../../components/EstadoVazio';
import Carregando from '../../components/Carregando';
import estilos from '../../styles/MeusRelatosScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

export default function MeusRelatosScreen({ navigation }) {
  const { meusRelatos, carregando, erro, recarregar } = useRelatos();
  const [atualizando, setAtualizando] = useState(false);

  const atualizar = async () => {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  };

  if (carregando) return <Carregando mensagem="Carregando seus relatos..." />;

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.lista}
      data={meusRelatos}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} colors={[cores.primaria]} />}
      ListHeaderComponent={
        erro ? (
          <View style={estilos.caixaErro} accessibilityRole="alert">
            <Ionicons name="cloud-offline" size={tamanhosIcone.medio} color={cores.erro} />
            <Text style={estilos.textoErro}>{erro}</Text>
          </View>
        ) : meusRelatos.length ? (
          <Text style={estilos.textoSecao}>Toque em um relato para ver o andamento.</Text>
        ) : null
      }
      renderItem={({ item }) => (
        <CardRelato
          relato={item}
          onPress={() => navigation.navigate('DetalheRelato', { relatoId: item.id })}
        />
      )}
      ListEmptyComponent={
        <EstadoVazio
          icone="flashlight-outline"
          titulo="Você ainda não fez relatos"
          mensagem="Viu um ponto de ônibus ou rua escura? Avise a prefeitura em menos de 1 minuto."
          textoAcao="Relatar ponto escuro"
          onAcao={() => navigation.navigate('NovoRelato')}
        />
      }
    />
  );
}
