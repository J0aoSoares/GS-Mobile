import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RelatosProvider } from './src/context/RelatosContext';
import RootNavigator from './src/navigation/RootNavigator';

// App.js só monta os providers e o navegador raiz.
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RelatosProvider>
          <RootNavigator />
        </RelatosProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
