# 💡 Luz Segura
O cidadão avisa a prefeitura de Osasco sobre pontos de ônibus e ruas escuros à noite. Uma estação IoT no local confirma ou contesta o relato, e o agente de manutenção recebe uma fila priorizada que mostra o motivo de cada prioridade.

![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo%20SDK-58-000020?logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![Testes](https://img.shields.io/badge/testes-jest--expo-C21325?logo=jest&logoColor=white)
![ODS 11](https://img.shields.io/badge/ODS-11%20%C2%B7%209%20%C2%B7%2010-F99D26)

> Global Solution 2026.2, FIAP: Mobile Development, tema **CitizenTech** (Engenharia de Software).

---

## 1. Integrantes

| Nome | RM |
|---|---|
| João Victor Soares Rodrigues | RM551410 |
---

## 2. Ficha da CitizenTech

| Item | Descrição |
|---|---|
| **Problema** | Pontos de ônibus, travessias e ruas escuros à noite aumentam o risco e a sensação de insegurança. A prefeitura demora para saber de cada ponto e não tem um critério claro para decidir qual consertar primeiro. |
| **Público beneficiado** | Quem usa ônibus à noite: trabalhadores de turno, estudantes do período noturno e idosos. A equipe de manutenção da iluminação pública também é beneficiada. |
| **Território** | Osasco (SP): Av. dos Autonomistas, Av. Maria Campos, Av. João Batista, Estação Osasco (CPTM), Rua Antônio Agú e Praça do Centro. |
| **Hipóteses** | **H1:** o cidadão consegue relatar um ponto escuro em menos de 1 minuto. **H2:** a validação pela estação reduz os chamados improcedentes. **H3:** uma prioridade com explicação ajuda o agente a decidir a ordem de atendimento. |
| **Indicadores** | Tempo médio entre o relato e a resolução · % de relatos confirmados pela estação · pontos críticos resolvidos · relatos repetidos agrupados no mesmo chamado. |
| **ODS** | **11** Cidades e comunidades sustentáveis (principal) · **9** Indústria, inovação e infraestrutura · **10** Redução das desigualdades. |

---

## 3. Funcionalidades por perfil

### Cidadão
- **Cadastro** com nome, CPF (máscara e validação dos dígitos verificadores), e-mail, celular (máscara), senha e confirmação. CPF e e-mail repetidos são bloqueados.
- **Início:** saudação, botão grande **"Relatar ponto escuro"** e o estado da luz de cada parada em linguagem simples ("Luz boa", "Luz fraca", "Ponto escuro", "Luz piscando"). Tocar numa parada abre o relato com ela já escolhida.
- **Novo relato em 3 passos:** parada, tipo do problema (3 botões grandes) e descrição. CEP (máscara) e foto são opcionais. Ao enviar, o relato entra em **Verificando** e abre o acompanhamento.
- **Meus relatos:** lista do mais recente para o mais antigo, com o selo de status (ícone + texto).
- **Detalhe do relato:** linha do tempo com todos os status e horários e a medição da estação ("A estação mediu 1,2 lux às 21:14"). A tela atualiza sozinha quando a validação termina.
- **Alertas:** relato confirmado, contestado ou resolvido, com "Marcar como lido" e "Marcar todos como lidos".

### Agente de manutenção
- **Chamados:** relatos e chamados automáticos ordenados por prioridade de 0 a 100, com a explicação visível no card (`severidade 50/50 · fluxo de pedestres 20/20 · tipo do ponto 15/15 · …`). Há filtros por status e uma caixa de alertas novos das estações.
- **Detalhe do chamado:** dados do local, a medição registrada, o medidor ao vivo da estação, barras com cada fator da prioridade, observação opcional e botões para avançar o status (`EM_MANUTENCAO` → `RESOLVIDO`). Ao resolver, o cidadão que relatou recebe um alerta.
- **Estações:** cada estação com o `MedidorLux` ao vivo, o estado classificado, o histórico curto e os botões **Simular queima**, **Simular luz fraca**, **Simular oscilação**, **Simular sensor com defeito** e **Normalizar**.

### Comum
- **Perfil:** dados do usuário (CPF mascarado parcialmente: `***.982.247-**`), **Restaurar dados de demonstração** e **Sair**.
- O login continua ativo ao reabrir o app.

### Status do relato

`RECEBIDO` → `VALIDANDO` → `CONFIRMADO` | `CONTESTADO` → `EM_MANUTENCAO` → `RESOLVIDO`

| Código (agente) | Texto para o cidadão |
|---|---|
| RECEBIDO | Recebemos seu relato. A equipe da prefeitura vai analisar. |
| VALIDANDO | A estação deste ponto está medindo a luz agora. |
| CONFIRMADO | A estação confirmou que falta luz neste ponto. |
| CONTESTADO | A estação mediu luz adequada neste ponto. A equipe vai revisar. |
| EM_MANUTENCAO | A equipe de manutenção está cuidando deste ponto. |
| RESOLVIDO | Pronto! A iluminação deste ponto foi consertada. |

Um relato **CONTESTADO** continua visível para o agente, com prioridade baixa, e ele decide se manda a equipe ou encerra o chamado.

---

## 4. Como instalar e rodar

**Pré-requisitos:** Node.js LTS e o app **Expo Go** no celular (Android ou iOS).

```bash
cd luz-segura-app
npm install
npx expo start
```

Leia o QR Code com o Expo Go (no Android, pelo próprio app; no iOS, pela câmera). O celular e o computador precisam estar na mesma rede. Se a rede bloquear a conexão, use `npx expo start --tunnel`.

**Testes automatizados:**

```bash
npm test
```

### Usuários de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Cidadão | `cidadao@luzsegura.app` | `cidadao123` |
| Agente | `agente@luzsegura.app` | `agente123` |

Os dois aparecem em texto pequeno na tela de login. Em **Perfil → Restaurar dados de demonstração**, o app apaga tudo e recria o seed: 2 usuários, 6 paradas, 5 estações, 4 relatos antigos e 2 alertas.

### Roteiro rápido para a demonstração
1. Entre como **agente** e abra **Estações**. Em ~9 s, a LS-03 (oscilando) completa 3 janelas ruins e abre um chamado automático em **Chamados**.
2. Em **Estações**, toque em **Simular queima** na LS-04 (Estação Osasco).
3. Saia e entre como **cidadão**. Relate um "Ponto escuro" na Estação Osasco (CPTM). Em ~3 s, o detalhe muda para **Confirmado**, mostrando o lux medido.
4. Relate outro ponto na Av. dos Autonomistas (luz normal). O relato vira **Em revisão** (CONTESTADO).
5. Volte como agente: o novo relato aparece no topo da fila. Abra, toque em **Iniciar manutenção** e depois em **Marcar como resolvido**. O cidadão recebe o alerta "Ponto consertado".

---

## 5. Simulação IoT

A simulação (`src/services/iotSimulator.js`) segue o mesmo modelo da estação física do grupo, feita com **ESP32 + LDR no Wokwi**.

### Cenários

| Cenário | Leituras geradas |
|---|---|
| `normal` | 25 a 40 lux, com ruído |
| `fraca` | 4 a 9 lux |
| `queima` | 0 a 1 lux |
| `oscilando` | alterna entre ~0,5 e ~40 lux |
| `sensor_suspeito` | valor saturado (9999): a janela não é classificada |

Estado inicial: LS-01, LS-04 e LS-05 em `normal`, LS-02 em `fraca` e LS-03 em `oscilando`. A Praça do Centro não tem estação: um relato nela vai direto para `RECEBIDO`, com o aviso "Sem estação neste ponto".

### Limiares (`src/constants/limiares.js`)

| Constante | Valor | Significado |
|---|---|---|
| `LUX_ADEQUADA` | 10 | 10 lux ou mais = **ADEQUADA** |
| `LUX_INEXISTENTE` | 3 | abaixo de 3 = **INEXISTENTE**; de 3 a 10 = **FRACA** |
| `LEITURAS_POR_JANELA` | 10 | leituras por janela de classificação |
| `JANELAS_RUINS_PARA_ALERTA` | 3 | janelas ruins seguidas para abrir chamado |
| `INTERVALO_LEITURA_MS` | 1000 | intervalo entre leituras |
| `VELOCIDADE_DEMO` | `true` | usa `INTERVALO_LEITURA_DEMO_MS = 300` (janela de ~3 s) para a gravação do vídeo |

Os limiares de **3 e 10 lux** foram escolhidos pelo grupo com base nas classes de iluminação **P4 e P2 da ABNT NBR 5101:2012** (iluminação pública para vias de pedestres).

### Como funciona
1. **Leitura:** um único `setInterval` para o app inteiro gera, a cada tique, o lux de cada estação conforme o cenário dela. O intervalo começa no `RelatosContext` quando há sessão e é limpo no logout e no unmount.
2. **Janela:** a cada 10 leituras, a função pura `classificarJanela(leituras)` classifica a janela pela **mediana** e pela **variação**. Se houver 3 ou mais "saltos" acima/abaixo de 10 lux, o estado é `OSCILANDO`. Caso contrário, a mediana define `ADEQUADA`, `FRACA` ou `INEXISTENTE`. Com o sensor saturado, o estado é `INDETERMINADO`.
3. **Alerta e chamado automático:** na 3ª janela ruim seguida, a estação cria **um** alerta para os agentes e **um** chamado (origem `estacao`). Se a parada já tiver um item aberto, o app só registra uma nota nele, agrupando em vez de duplicar. Quando a estação volta a `ADEQUADA`, isso é registrado no chamado, mas ele **não** fecha sozinho.
4. **Validação do relato:** quando um relato entra em `VALIDANDO`, a estação da parada mede uma **janela nova** e grava `CONFIRMADO` (luz ruim) ou `CONTESTADO` (`ADEQUADA`), com o lux e o horário, e avisa o cidadão. Se o app fechar no meio da medição, a validação recomeça na próxima abertura.
5. **Memória × armazenamento:** o estado ao vivo (lux atual, histórico curto e cenário) fica só em memória e chega às telas por `useSyncExternalStore`. Só relatos, chamados e alertas são gravados no armazenamento.

### Prioridade (`src/services/prioridadeService.js`)

A pontuação vai de 0 a 100 e sempre vem como `{ total, explicacao: [{ fator, pontos, max, detalhe }] }`.

| Fator | Máx. | Regra |
|---|---|---|
| Severidade | 50 | INEXISTENTE 1,0 · OSCILANDO 0,7 · FRACA 0,5 · CONTESTADO 0,1 (sem medição, vale o tipo relatado) |
| Fluxo de pedestres | 20 | fluxo simulado da parada (0 a 120/h), saturando em 120 |
| Tipo do ponto | 15 | parada e travessia 1,0 · praça 0,7 · rua 0,5 |
| Tempo aberto | 10 | satura em 48 h |
| Relatos confirmados na mesma parada | 5 | 1 ponto por relato, até 5 |

---

## 6. Arquitetura

```
luz-segura-app/
├── App.js                      # só providers + RootNavigator
├── jest.setup.js               # mocks de AsyncStorage e expo-crypto para os testes
├── __tests__/                  # validadores, classificação IoT, prioridade e fluxo integrado
├── src/
│   ├── navigation/             # RootNavigator, AuthStack, CidadaoTabs, AgenteTabs, iconeTab
│   ├── screens/
│   │   ├── auth/               # LoginScreen, CadastroScreen
│   │   ├── cidadao/            # InicioScreen, NovoRelatoScreen, MeusRelatosScreen,
│   │   │                       # DetalheRelatoScreen, AlertasScreen
│   │   ├── agente/             # ChamadosScreen, DetalheChamadoScreen, EstacoesScreen
│   │   └── comum/              # PerfilScreen
│   ├── components/             # Botao, CampoTexto, CampoMascara, CardRelato, SeloStatus,
│   │                           # LinhaDoTempo, MedidorLux, EstadoVazio, Carregando, OpcaoSelecionavel
│   ├── context/                # AuthContext.js, RelatosContext.js
│   ├── services/               # storageService, authService, relatoService, alertaService,
│   │                           # iotSimulator, prioridadeService, seedService
│   ├── utils/                  # validadores.js, formatadores.js, id.js
│   ├── constants/              # limiares.js, status.js, paradas.js, tiposProblema.js, armazenamento.js
│   └── styles/                 # tema.js + um *.styles.js por tela e por componente
├── docs/prints/
└── README.md
```

| Camada | Papel |
|---|---|
| **navigation** | O `RootNavigator` lê o `AuthContext`: sem sessão abre o `AuthStack`, `cidadao` abre `CidadaoTabs` e `agente` abre `AgenteTabs`. Enquanto a sessão carrega, mostra `Carregando`. As abas ficam dentro de uma pilha, e o detalhe abre por cima delas. |
| **screens** | Só interface e estado do formulário. Usam contextos e serviços de domínio, **nunca** o AsyncStorage nem o `storageService`. |
| **components** | Peças reutilizáveis e acessíveis (rótulo visível, `accessibilityRole/Label/Hint`, alvo de toque de pelo menos 48 dp). |
| **context** | `AuthContext`: sessão, login, cadastro, sair e restaurar. `RelatosContext`: relatos, alertas, ações do agente e o ciclo de vida do simulador. |
| **services** | Regras de negócio. **Só o `storageService` toca no AsyncStorage** (`getItem`, `setItem`, `removeItem`, `getJSON`, `setJSON`, `atualizarLista(chave, fn)`), com try/catch e uma fila por chave para que duas gravações não se sobrescrevam. |
| **constants** | Nada de número mágico: limiares, tempos, pesos, status, paradas e chaves ficam aqui. |
| **styles** | `tema.js` (cores, fontes, espaçamentos, raios e alvos de toque) e um arquivo de estilos por tela e por componente. |

### Chaves do AsyncStorage

| Chave | Conteúdo |
|---|---|
| `@luzsegura:usuarios` | usuários `{id, nome, cpf, email, telefone, senhaHash, perfil}` |
| `@luzsegura:sessao` | id do usuário logado (mantém o login ao reabrir o app) |
| `@luzsegura:relatos` | relatos de cidadãos e chamados automáticos, com histórico e medição |
| `@luzsegura:alertas` | `{id, usuarioId \| 'agentes', relatoId, titulo, mensagem, criadoEm, lido}` |
| `@luzsegura:seed_v1` | marca de que o seed já rodou |

Toda gravação de lista passa por `atualizarLista`, que lê a lista, aplica a função e grava a lista inteira, dentro de uma fila por chave.

### Acessibilidade
- Alvos de toque de pelo menos 48 dp, fonte base de 16 e texto escuro sobre fundo claro.
- Todo status aparece com **texto + ícone**, nunca só com cor.
- Os campos têm rótulo visível, e os erros de validação aparecem em texto embaixo do campo, sem modal.
- Cada campo usa o teclado certo (`email-address`, `numeric`, `phone-pad`), e os formulários ficam dentro de `KeyboardAvoidingView`.
- O cidadão só vê linguagem simples. Os códigos técnicos aparecem só para o agente.
- Todas as listas têm estado vazio e estado de carregamento.

---

## 7. Prints

| Tela | Print |
|---|---|
| Login | ![Login](docs/prints/login.png) |
| Cadastro | ![Cadastro](docs/prints/cadastro.png) |
| Início (cidadão) | ![Início](docs/prints/inicio.png) |
| Novo relato | ![Novo relato](docs/prints/novo-relato.png) |
| Meus relatos | ![Meus relatos](docs/prints/meus-relatos.png) |
| Detalhe do relato | ![Detalhe do relato](docs/prints/detalhe-relato.png) |
| Alertas | ![Alertas](docs/prints/alertas.png) |
| Chamados (agente) | ![Chamados](docs/prints/chamados.png) |
| Detalhe do chamado | ![Detalhe do chamado](docs/prints/detalhe-chamado.png) |
| Estações | ![Estações](docs/prints/estacoes.png) |
| Perfil | ![Perfil](docs/prints/perfil.png) |

---

## 8. Vídeo

[link do vídeo](https://youtu.be/SEU_VIDEO)

---

## 9. Limitações

- Todos os dados são mockados e ficam só no aparelho (AsyncStorage). Não há backend nem sincronização entre aparelhos.
- O hash SHA-256 da senha (com sal fixo) serve **só para demonstração**. Ele não substitui uma autenticação real com servidor.
- A estação IoT é simulada dentro do app. A estação física (ESP32 + LDR) existe só no Wokwi e não se conecta ao app.
- A foto do relato é guardada só como URI local. Ela não é enviada para lugar nenhum e pode sumir se o sistema limpar o cache.
- As coordenadas e o fluxo de pedestres das paradas são aproximados e simulados.
# GS-Mobile
