import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/cidadao/InicioScreen';
import NovoRelatoScreen from '../screens/cidadao/NovoRelatoScreen';
import MeusRelatosScreen from '../screens/cidadao/MeusRelatosScreen';
import DetalheRelatoScreen from '../screens/cidadao/DetalheRelatoScreen';
import AlertasScreen from '../screens/cidadao/AlertasScreen';
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
        name="Inicio"
        component={InicioScreen}
        options={{
          title: 'Início',
          tabBarIcon: iconeTab('home'),
          tabBarAccessibilityLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="NovoRelato"
        component={NovoRelatoScreen}
        options={{
          title: 'Relatar',
          headerTitle: 'Relatar ponto escuro',
          tabBarIcon: iconeTab('add-circle'),
          tabBarAccessibilityLabel: 'Relatar ponto escuro',
        }}
      />
      <Tab.Screen
        name="MeusRelatos"
        component={MeusRelatosScreen}
        options={{
          title: 'Meus relatos',
          tabBarIcon: iconeTab('list'),
          tabBarAccessibilityLabel: 'Meus relatos',
        }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertasScreen}
        options={{
          title: 'Alertas',
          tabBarIcon: iconeTab('notifications'),
          tabBarBadge: alertasNaoLidos > 0 ? alertasNaoLidos : undefined,
          tabBarAccessibilityLabel:
            alertasNaoLidos > 0 ? `Alertas, ${alertasNaoLidos} não lidos` : 'Alertas',
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

// As abas ficam dentro de uma pilha para o detalhe abrir por cima delas.
export default function CidadaoTabs() {
  return (
    <Stack.Navigator screenOptions={opcoesStack}>
      <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetalheRelato"
        component={DetalheRelatoScreen}
        options={{ title: 'Detalhe do relato' }}
      />
    </Stack.Navigator>
  );
}
