// Symptom -> device routing data for the Portuguese solutions hub (/pt/solutions).
//
// Hand-maintained. This is the "I have a reading, which product fixes it?" entry
// point that sits alongside the industry cards. Kept deliberately free of
// customer names and unsourced numbers: every row is either general engineering
// fact or traceable to a case published on one of the six industry sub-pages.
//
// `device` must be one of: 'ahf' | 'svg' | 'both'. It drives the row badge colour
// and is also what the decision tree branches on.

export const ROUTE_DEVICE_LABEL = {
  ahf: 'AHF',
  svg: 'SVG',
  both: 'AHF + SVG',
};

/**
 * Symptom -> measurement -> device routing table.
 */
export const SYMPTOM_ROUTES = [
  {
    id: 'neutral-overheat',
    symptom: 'O condutor neutro está quente ou sua corrente está próxima da corrente de fase',
    measure: 'Corrente do neutro versus corrente de fase e o conteúdo harmônico de 3ª / 9ª ordem no neutro',
    device: 'ahf',
    why: 'Os harmônicos trilhos (triplen) de cargas eletrônicas monofásicas se somam no neutro em vez de se cancelarem. O AHF é o único dos dois que os elimina.',
    note: 'Verifique o balanceamento de fases primeiro — o desbalanceamento isolado pode carregar o neutro sem nenhuma contribuição harmônica.',
  },
  {
    id: 'capacitor-resonance',
    symptom: 'Bancos de correção de fator de potência falhando ou disjuntores abrindo sem uma falha óbvia',
    measure: 'Se a indutância do banco de capacitores e do transformador forma uma ressonância paralela próxima a uma ordem harmônica presente no local',
    device: 'ahf',
    why: 'O banco está amplificando harmônicos em vez de filtrá-los. Ordens de filtragem seletiva mais controle antirressonância permitem que o banco permaneça em operação.',
    note: 'Onde os TC do filtro amostram decide se a ressonância LC pode ser excitada. Amostragem no lado da carga é o recurso de fallback.',
  },
  {
    id: 'pf-penalty',
    symptom: 'Multa de fator de potência da concessionária ou energia reativa aparecendo na fatura',
    measure: 'Fator de potência e demanda reativa em todo o ciclo de carga, incluindo standby e noturno',
    device: 'svg',
    why: 'O SVG mantém um fator de potência alvo continuamente, inclusive quando a carga ativa está próxima de zero, que é onde um banco de capacitores perde o controle.',
    note: 'Se o local tem um banco de capacitores que entra em degraus, o SVG também remove a sobrecompensação que aparece em carga leve.',
  },
  {
    id: 'leading-pf',
    symptom: 'Fator de potência medido em avanço (leading) à noite ou no fim de semana',
    measure: 'Fator de potência na carga mínima e a capacitância de qualquer extensão longa de cabo subterrâneo',
    device: 'svg',
    why: 'A capacitância do cabo gera potência reativa em carga leve. O SVG absorve o excesso em vez de adicionar mais.',
    note: 'Um banco de capacitores convencional só pode adicionar potência reativa, portanto não pode corrigir isso.',
  },
  {
    id: 'voltage-sag',
    symptom: 'Equipamentos desarmando ou reiniciando em quedas de tensão curtas',
    measure: 'Profundidade e duração da queda nos terminais do equipamento, registradas durante os incidentes',
    device: 'svg',
    why: 'O SVG responde em um ciclo para segurar a tensão do barramento. Reduz a profundidade e a duração da queda; não substitui um UPS para uma interrupção sustentada.',
    note: 'Quando a queda é causada por uma partida de motor grande no mesmo barramento, o suporte reativo no barramento é geralmente mais eficaz do que um transformador de fonte maior.',
  },
  {
    id: 'voltage-flicker',
    symptom: 'Luzes piscando visivelmente quando um forno, soldador ou grande inversor cicla',
    measure: 'Severidade de flicker de curto prazo Pst / Plt no ponto de acoplamento comum',
    device: 'svg',
    why: 'O flicker vem de uma demanda reativa oscilando rapidamente. O SVG acompanha a oscilação e a cancela; o AHF não trata a oscilação reativa.',
    note: 'Flicker causado por uma única carga de arco intermitente pode exigir que a própria carga seja revisada antes de dimensionar a compensação reativa.',
  },
  {
    id: 'thd-high',
    symptom: 'Distorção harmônica na alimentação de entrada acima do limite acordado ou legal',
    measure: 'Espectro harmônico de corrente e tensão e quais ordens carregam mais corrente',
    device: 'ahf',
    why: 'O AHF injeta uma corrente de cancelamento, ordem por ordem, dimensionada para o espectro medido em vez da potência nominal da carga.',
    note: 'Dimensionar a partir do kVA do transformador isoladamente é o motivo usual de uma instalação ficar subdimensionada. Meça primeiro.',
  },
  {
    id: 'transformer-overheat',
    symptom: 'Transformador operando mais quente do que sua carga sugere ou sendo derated',
    measure: 'Contribuição de perda harmônica e o fator K ou requisito de derating para o mix de carga',
    device: 'ahf',
    why: 'A corrente harmônica causa perdas extras por correntes parasitas e dispersas que uma classificação padrão de kVA não considera. Remover a corrente harmônica remove essa perda.',
    note: 'O derating é um sintoma, não o problema. Confirme a contribuição harmônica antes de assumir que o transformador está subdimensionado.',
  },
  {
    id: 'vfd-bank',
    symptom: 'Distorção harmônica aparecendo após retrofit de VFD ou nova linha de inversores',
    measure: 'Espectro harmônico no alimentador que supre os inversores, no ponto de operação deles',
    device: 'ahf',
    why: 'Retificadores de seis pulsos em inversores são uma fonte harmônica característica. A distorção escala com a carga do inversor, então a saída do AHF cai com a carga naturalmente.',
    note: 'Vários inversores em um barramento intercalam seus harmônicos; a emissão combinada não é a soma das classificações individuais.',
  },
  {
    id: 'inverter-resonance',
    symptom: 'Unidades de inversor ou PCS desarmando juntas em um site de PV, eólica ou armazenamento',
    measure: 'Oscilação de banda larga e o ponto de ressonância formado pelos filtros do inversor e a impedância do coletor ou da rede',
    device: 'both',
    why: 'Sites com múltiplos inversores produzem tanto harmônicos de comutação intercalados quanto uma oscilação reativa conforme a saída muda. Os dois são dimensionados separadamente.',
    note: 'O varredura de ressonância pertence a um estudo de sistema, não à seleção de equipamento. As classificações seguem o estudo.',
  },
  {
    id: 'load-step',
    symptom: 'Tensão caindo cada vez que uma grande carga ou um grupo de carregadores parte junto',
    measure: 'Tamanho do degrau e taxa de repetição contra os limites de flicker e de variação de tensão aplicáveis ao local',
    device: 'both',
    why: 'O degrau em si é largamente um evento reativo, então o SVG carrega a maior parte. Onde os carregadores ou retificadores também adicionam harmônicos, o AHF é adicionado no mesmo barramento.',
    note: 'A exposição à tarifa de demanda do mesmo degrau de carga é uma questão tarifária e é separada do reparo de qualidade de energia.',
  },
  {
    id: 'phase-imbalance',
    symptom: 'Uma fase carregando visivelmente mais corrente que as outras ou motores operando quentes',
    measure: 'Corrente de sequência negativa e de sequência zero, e como a carga monofásica é distribuída entre as fases',
    device: 'both',
    why: 'O problema de distribuição tem de ser corrigido primeiro. O AHF remove o componente harmônico que se sobrepõe a ele; o SVG suporta a tensão onde o desbalanceamento produz um desbalanceamento sustentado.',
    note: 'O rebalanceamento da carga monofásica deve sempre ser considerado antes de comprar equipamento.',
  },
];

/**
 * Decision tree used by the "Which device do I need?" section.
 * Node ids are referenced by `next` so the walk can be rendered without any
 * framework, and so the whole tree stays readable in source.
 */
export const DECISION_TREE = {
  start: {
    question: 'O que a medição mostra primeiro?',
    options: [
      { label: 'A distorção de corrente está acima do limite', next: 'has-capacitor' },
      { label: 'O fator de potência está baixo ou está sendo cobrado reativo', next: 'light-load' },
      { label: 'Quedas ou flicker de tensão sob degraus de carga', next: 'sag-source' },
      { label: 'A corrente de neutro está alta ou os capacitores continuam falhando', next: 'done-ahf' },
    ],
  },
  'has-capacitor': {
    question: 'Existe um banco de capacitores existente no mesmo barramento?',
    options: [
      { label: 'Sim, e ele permanece em operação', next: 'done-ahf-resonance' },
      { label: 'Sim, mas pode ser substituído ou removido', next: 'done-ahf' },
      { label: 'Nenhum banco de capacitores no local', next: 'done-ahf' },
    ],
  },
  'light-load': {
    question: 'Qual é o fator de potência na carga mínima, durante a noite ou no fim de semana?',
    options: [
      { label: 'Ainda baixo ou atrasado (lagging)', next: 'done-svg' },
      { label: 'Oscilando ou medido em avanço (leading)', next: 'done-svg' },
      { label: 'Bom em carga leve, baixo só no pico', next: 'done-svg' },
    ],
  },
  'sag-source': {
    question: 'A queda está vinculada a que condições?',
    options: [
      { label: 'Uma grande partida de motor ou inversor no mesmo barramento', next: 'done-svg' },
      { label: 'Vários carregadores ou retificadores partindo juntos', next: 'done-both' },
      { label: 'Um evento externo de fornecimento, não uma carga do local', next: 'done-svg-external' },
    ],
  },
  // ---- Outcomes ----
  'done-ahf': {
    device: 'ahf',
    heading: 'Comece com um filtro ativo de harmônicos (AHF)',
    body: 'Dimensione o filtro a partir do espectro harmônico medido no ponto de acoplamento comum, não a partir da classificação do transformador. A saída acompanha a carga, então o filtro não precisa ser dimensionado para uma coincidência que nunca acontece.',
    nextSteps: [
      'Registre o espectro harmônico na alimentação de entrada durante um ciclo de trabalho completo',
      'Anote as piores ordens e a corrente que elas carregam',
      'Escolha uma classificação de quadro a partir da corrente harmônica medida, com margem para crescimento',
    ],
  },
  'done-ahf-resonance': {
    device: 'ahf',
    heading: 'Comece com um AHF, com controle antirressonância',
    body: 'O banco de capacitores é a complicação. A ressonância paralela entre o banco e a indutância do transformador amplifica harmônicos em vez de removê-los, então o filtro tem de operar com ordens de filtragem seletiva e controle antirressonância enquanto o banco permanece em operação.',
    nextSteps: [
      'Estabeleça se os TC do filtro amostram no lado da rede ou no lado da carga',
      'Se a conexão fica a jusante de um banco puramente capacitivo, planeje mover a amostragem dos TC ou aceite o controle antirressonância',
      'Confirme o ponto de ressonância contra as ordens harmônicas realmente presentes',
    ],
  },
  'done-svg': {
    device: 'svg',
    heading: 'Comece com um gerador estático de var (SVG)',
    body: 'O SVG mantém um fator de potência alvo continuamente e absorve tanto quanto fornece potência reativa. Isso é o que permite que ele funcione em carga leve, onde um banco de capacitores ou sobrecompensa ou tem de ser desligado em degraus.',
    nextSteps: [
      'Meça o perfil reativo durante o ciclo de carga completo, não só no pico',
      'Verifique o fator de potência na carga mínima para uma condição de avanço',
      'Dimensione a partir da oscilação reativa, com o fator de potência alvo definido antecipadamente',
    ],
  },
  'done-svg-external': {
    device: 'svg',
    heading: 'O suporte reativo ajudará, mas trate-o como uma parte do reparo',
    body: 'O SVG segurará a tensão do barramento durante o evento, mas uma queda que se origina a montante não pode ser eliminada no barramento BT. O suporte reativo no barramento reduz a profundidade e a duração; qualquer coisa mais longa que alguns ciclos tem de ser coberta pelo UPS ou por um arranjo no lado do fornecimento.',
    nextSteps: [
      'Separe as quedas originadas no local das que vêm do fornecimento',
      'Registre profundidade e duração da queda nos terminais do equipamento que desarma',
      'Compare a curva de suporte do equipamento com o que o registro mostra',
    ],
  },
  'done-both': {
    device: 'both',
    heading: 'Planeje AHF e SVG juntos',
    body: 'Um degrau de carga que também é fonte harmônica precisa de ambos. O SVG carrega o degrau reativo; o AHF elimina os harmônicos que os retificadores adicionam no mesmo barramento. Eles são medidos separadamente e dimensionados separadamente.',
    nextSteps: [
      'Meça o tamanho do degrau e a taxa de repetição no ponto de acoplamento comum',
      'Meça o espectro harmônico no mesmo barramento ao mesmo tempo',
      'Divida as classificações entre os dois dispositivos a partir dessas duas medições',
    ],
  },
};
