import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { PERFIL } from '../constants/status';
import Carregando from '../components/Carregando';
import AuthStack from './AuthStack';
import CidadaoTabs from './CidadaoTabs';
import AgenteTabs from './AgenteTabs';
import { temaNavegacao } from '../styles/navegacao.styles';

// Decide o fluxo pela sessão: sem sessão → login; cidadão → abas do cidadão; agente → abas do agente.
export default function RootNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <Carregando mensagem="Abrindo o Luz Segura..." />;
  }

  let conteudo = <AuthStack />;
  if (usuario?.perfil === PERFIL.AGENTE) conteudo = <AgenteTabs />;
  else if (usuario?.perfil === PERFIL.CIDADAO) conteudo = <CidadaoTabs />;

  return <NavigationContainer theme={temaNavegacao}>{conteudo}</NavigationContainer>;
}
