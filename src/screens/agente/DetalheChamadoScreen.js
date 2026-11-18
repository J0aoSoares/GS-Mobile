import React, { useState } from 'react';
import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelatos, useEstacoes } from '../../context/RelatosContext';
import SeloStatus from '../../components/SeloStatus';
import LinhaDoTempo from '../../components/LinhaDoTempo';
import MedidorLux from '../../components/MedidorLux';
import EstadoVazio from '../../components/EstadoVazio';
import Carregando from '../../components/Carregando';
import Botao from '../../components/Botao';
import CampoTexto from '../../components/CampoTexto';
import { calcularPrioridade } from '../../services/prioridadeService';
import { INFO_STATUS, ROTULO_ACAO_AGENTE, ORIGEM, STATUS } from '../../constants/status';
import { buscarParada, buscarEstacaoDaParada, ROTULO_TIPO_PONTO } from '../../constants/paradas';
import { buscarTipoProblema } from '../../constants/tiposProblema';
import { formatarLux, formatarHora, formatarDataHora, formatarCEP } from '../../utils/formatadores';
import estilos from '../../styles/DetalheChamadoScreen.styles';
import { cores, tamanhosIcone } from '../../styles/tema';

const ICONE_ACAO = {
  [STATUS.EM_MANUTENCAO]: 'construct',
  [STATUS.RESOLVIDO]: 'checkmark-done',
};

function BarraFator({ fator }) {
  const fracao = fator.max ? fator.pontos / fator.max : 0;
  return (
    <View
      style={estilos.fator}
      accessible
      accessibilityLabel={`${fator.fator}: ${fator.pontos} de ${fator.max} pontos. ${fator.detalhe}`}
    >
      <View style={estilos.linhaFator}>
        <Text style={estilos.nomeFator}>{fator.fator}</Text>
        <Text style={estilos.pontosFator}>
          {fator.pontos}/{fator.max}
        </Text>
      </View>
      <View style={estilos.trilhaFator}>
        <View style={[estilos.preenchimentoFator, { flex: fracao }]} />
        <View style={[estilos.restoFator, { flex: 1 - fracao }]} />
      </View>
      <Text style={estilos.detalheFator}>{fator.detalhe}</Text>
    </View>
  );
}

export default function DetalheChamadoScreen({ route, navigation }) {
  const { buscarRelato, relatos, carregando, avancarStatus, proximosStatus } = useRelatos();
  const estacoes = useEstacoes();
  const [nota, setNota] = useState('');
  const [salvando, setSalvando] = useState(null);
  const [erro, setErro] = useState(null);

  const relato = buscarRelato(route.params?.relatoId);
  if (carregando) return <Carregando />;
  if (!relato) {
    return (
      <EstadoVazio
        icone="search-outline"
        titulo="Chamado não encontrado"
        mensagem="Ele pode ter sido apagado ao restaurar os dados de demonstração."
        textoAcao="Voltar para a fila"
        onAcao={() => navigation.goBack()}
      />
    );
  }

  const parada = buscarParada(relato.paradaId);
  const estacaoFixa = buscarEstacaoDaParada(relato.paradaId);
  const estacaoAoVivo = estacoes.find((e) => e.paradaId === relato.paradaId);
  const tipo = buscarTipoProblema(relato.tipo);
  const prioridade = calcularPrioridade(relato, { parada, relatos });
  const acoes = proximosStatus(relato);

  const avancar = async (novoStatus) => {
    setSalvando(novoStatus);
    setErro(null);
    try {
      await avancarStatus(relato.id, novoStatus, nota.trim() || null);
      setNota('');
    } catch (e) {
      setErro(e.message || 'Não foi possível mudar o status.');
    } finally {
      setSalvando(null);
    }
  };

  return (
    <KeyboardAvoidingView style={estilos.tela} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <View style={estilos.cartao}>
          <View style={estilos.linhaTopo}>
            <SeloStatus status={relato.status} modoAgente grande />
            <View style={estilos.caixaPrioridade} accessible accessibilityLabel={`Prioridade ${prioridade.total} de 100`}>
              <Text style={estilos.valorPrioridade}>{prioridade.total}</Text>
              <Text style={estilos.rotuloPrioridade}>de 100</Text>
            </View>
          </View>
          <Text style={estilos.textoSecao}>{INFO_STATUS[relato.status].texto}</Text>
          {relato.status === STATUS.CONTESTADO ? (
            <View style={estilos.caixaAviso}>
              <Ionicons name="help-circle" size={tamanhosIcone.medio} color={cores.aviso} />
              <Text style={estilos.textoAviso}>
                A estação mediu luz adequada. Decida se vale mandar a equipe ou encerrar.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={estilos.cartao}>
          <Text style={estilos.rotuloCampo}>Local</Text>
          <Text style={estilos.valorCampo}>{parada?.nome}</Text>
          <Text style={estilos.textoSecao}>
            {ROTULO_TIPO_PONTO[parada?.tipo]} · {parada?.fluxo} pessoas/h · {parada?.latitude}, {parada?.longitude}
          </Text>

          <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Origem</Text>
          <Text style={estilos.valorCampo}>
            {relato.origem === ORIGEM.ESTACAO ? `Automático (estação ${estacaoFixa?.codigo || ''})` : 'Relato de cidadão'}
          </Text>

          <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Tipo</Text>
          <Text style={estilos.valorCampo}>{tipo?.rotulo}</Text>

          <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Descrição</Text>
          <Text style={estilos.valorCampo}>{relato.descricao}</Text>

          {relato.cep ? (
            <>
              <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>CEP</Text>
              <Text style={estilos.valorCampo}>{formatarCEP(relato.cep)}</Text>
            </>
          ) : null}

          <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Aberto em</Text>
          <Text style={estilos.valorCampo}>{formatarDataHora(relato.criadoEm)}</Text>
        </View>

        {relato.fotoUri ? (
          <Image source={{ uri: relato.fotoUri }} style={estilos.foto} accessible accessibilityLabel="Foto enviada pelo cidadão" />
        ) : null}

        <Text style={estilos.tituloSecao} accessibilityRole="header">Medição da estação</Text>
        <View style={estilos.cartao}>
          {relato.medicao ? (
            <Text style={estilos.valorCampo}>
              Medido: {formatarLux(relato.medicao.lux)} lux às {formatarHora(relato.medicao.em)} ·{' '}
              {relato.medicao.estado}
            </Text>
          ) : (
            <Text style={estilos.textoSecao}>
              {relato.semEstacao ? 'Sem estação neste ponto: relato sem medição.' : 'Aguardando a medição da estação.'}
            </Text>
          )}
          {estacaoAoVivo ? (
            <>
              <Text style={[estilos.rotuloCampo, estilos.espacoAcima]}>Agora ({estacaoAoVivo.codigo})</Text>
              <MedidorLux lux={estacaoAoVivo.luxAtual} estado={estacaoAoVivo.estado} modoAgente compacto />
            </>
          ) : null}
        </View>

        <Text style={estilos.tituloSecao} accessibilityRole="header">Por que esta prioridade</Text>
        <View style={estilos.cartao}>
          {prioridade.explicacao.map((f) => (
            <BarraFator key={f.fator} fator={f} />
          ))}
        </View>

        {acoes.length ? (
          <>
            <Text style={estilos.tituloSecao} accessibilityRole="header">Ações</Text>
            <View style={estilos.cartao}>
              <CampoTexto
                rotulo="Observação"
                opcional
                value={nota}
                onChangeText={setNota}
                placeholder="Ex.: troca do reator agendada"
                dica="Fica registrada na linha do tempo."
              />
              {erro ? (
                <View style={estilos.caixaErro} accessibilityRole="alert">
                  <Ionicons name="close-circle" size={tamanhosIcone.medio} color={cores.erro} />
                  <Text style={estilos.textoErro}>{erro}</Text>
                </View>
              ) : null}
              {acoes.map((s) => (
                <Botao
                  key={s}
                  titulo={ROTULO_ACAO_AGENTE[s]}
                  icone={ICONE_ACAO[s]}
                  variante={s === STATUS.RESOLVIDO ? 'primario' : 'secundario'}
                  carregando={salvando === s}
                  desabilitado={Boolean(salvando)}
                  onPress={() => avancar(s)}
                  accessibilityHint={`Muda o status para ${s}`}
                />
              ))}
            </View>
          </>
        ) : null}

        <Text style={estilos.tituloSecao} accessibilityRole="header">Linha do tempo</Text>
        <View style={estilos.cartao}>
          <LinhaDoTempo historico={relato.historico} modoAgente />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
