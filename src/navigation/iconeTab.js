import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Gera a função de ícone de cada aba (versão cheia quando ativa, contorno quando inativa).
export function iconeTab(nome) {
  return function IconeAba({ color, size, focused }) {
    return <Ionicons name={focused ? nome : `${nome}-outline`} size={size} color={color} />;
  };
}
