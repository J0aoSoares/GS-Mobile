import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChamadosScreen from '../screens/agente/ChamadosScreen';
import DetalheChamadoScreen from '../screens/agente/DetalheChamadoScreen';
import EstacoesScreen from '../screens/agente/EstacoesScreen';
import PerfilScreen from '../screens/comum/PerfilScreen';
import { useRelatos } from '../context/RelatosContext';
import { opcoesStack, opcoesTabs } from '../styles/navegacao.styles';
import { iconeTab } from './iconeTab';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Abas() {
  const { alertasNaoLidos } = useRelatos();

  return (
    <Tab.Navigator screenOptions={opcoesTabs}>
      <Tab.Screen
        name="Chamados"
        component={ChamadosScreen}
        options={{
          title: 'Chamados',
          headerTitle: 'Fila de chamados',
          tabBarIcon: iconeTab('clipboard'),
          tabBarBadge: alertasNaoLidos > 0 ? alertasNaoLidos : undefined,
          tabBarAccessibilityLabel:
            alertasNaoLidos > 0
              ? `Chamados, ${alertasNaoLidos} alertas não lidos`
              : 'Chamados',
        }}
      />
      <Tab.Screen
        name="Estacoes"
        component={EstacoesScreen}
        options={{
          title: 'Estações',
          headerTitle: 'Estações IoT',
          tabBarIcon: iconeTab('radio'),
          tabBarAccessibilityLabel: 'Estações',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: iconeTab('person'),
          tabBarAccessibilityLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AgenteTabs() {
  return (
    <Stack.Navigator screenOptions={opcoesStack}>
      <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetalheChamado"
        component={DetalheChamadoScreen}
        options={{ title: 'Detalhe do chamado' }}
      />
    </Stack.Navigator>
  );
}
