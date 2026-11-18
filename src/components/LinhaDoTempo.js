import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INFO_STATUS } from '../constants/status';
import { formatarDataHora } from '../utils/formatadores';
import estilos from '../styles/LinhaDoTempo.styles';
import { tons, tamanhosIcone } from '../styles/tema';

const INFO_NOTA = { rotulo: 'Atualização', icone: 'information-circle', tom: 'neutro' };

// Linha do tempo com cada status (e notas da estação), horário e texto.
export default function LinhaDoTempo({ historico = [], modoAgente = false }) {
  return (
    <View accessibilityRole="list">
      {historico.map((item, indice) => {
        const info = item.tipo === 'status' ? INFO_STATUS[item.status] : INFO_NOTA;
        const tom = tons[info?.tom] || tons.neutro;
        const ultimo = indice === historico.length - 1;
        const rotulo = modoAgente && item.tipo === 'status' ? item.status : info?.rotulo;

        return (
          <View
            key={item.id || `${item.em}-${indice}`}
            style={estilos.item}
            accessible
            accessibilityLabel={`${rotulo}, ${formatarDataHora(item.em)}. ${item.texto || ''}`}
          >
            <View style={estilos.trilho}>
              <View style={[estilos.marcador, { backgroundColor: tom.fundo, borderColor: tom.texto }]}>
                <Ionicons name={info?.icone || 'ellipse'} size={tamanhosIcone.pequeno} color={tom.texto} />
              </View>
              {!ultimo && <View style={estilos.linha} />}
            </View>
            <View style={[estilos.conteudo, ultimo && estilos.conteudoUltimo]}>
              <Text style={[estilos.titulo, ultimo && estilos.tituloAtual]}>{rotulo}</Text>
              <Text style={estilos.hora}>{formatarDataHora(item.em)}</Text>
              {item.texto ? <Text style={estilos.texto}>{item.texto}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
