import { DefaultTheme } from '@react-navigation/native';
import { cores, fontes, pesos, ALTURA_TAB_BAR, espacos } from './tema';

// Estilos e opções visuais da navegação (cabeçalho e barra de abas).

export const temaNavegacao = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: cores.primaria,
    background: cores.fundo,
    card: cores.superficie,
    text: cores.texto,
    border: cores.bordaSuave,
    notification: cores.erro,
  },
};

const cabecalho = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.textoSobrePrimaria,
  headerTitleStyle: { fontSize: fontes.media, fontWeight: pesos.negrito },
};

export const opcoesStack = {
  ...cabecalho,
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: cores.fundo },
};

export const opcoesTabs = {
  ...cabecalho,
  tabBarActiveTintColor: cores.primaria,
  tabBarInactiveTintColor: cores.textoSecundario,
  tabBarLabelStyle: { fontSize: fontes.pequena, fontWeight: pesos.medio },
  tabBarStyle: {
    height: ALTURA_TAB_BAR + espacos.md,
    paddingTop: espacos.xs,
    paddingBottom: espacos.md,
    backgroundColor: cores.superficie,
    borderTopColor: cores.borda,
  },
  tabBarItemStyle: { minHeight: ALTURA_TAB_BAR - espacos.sm },
  tabBarBadgeStyle: { backgroundColor: cores.erro, color: cores.textoSobrePrimaria },
  sceneStyle: { backgroundColor: cores.fundo },
};
