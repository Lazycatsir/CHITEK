// Extracted from src/pages/pt/solutions.astro (single source of truth for PT solutions data).
// Do not hand-edit the arrays; edit the page and re-extract, or edit both.

export const industries = [
  { id: 'industry', label: 'Indústria', icon: 'factory' },
  { id: 'commercial', label: 'Comercial e Hospitalar', icon: 'building-2' },
  { id: 'datacenter', label: 'Centro de Dados', icon: 'server' },
  { id: 'renewable', label: 'Energia Renovável', icon: 'zap' },
  { id: 'rail', label: 'Ferroviário e Recarga de VE', icon: 'train-front' },
  { id: 'grid', label: 'Rede Elétrica', icon: 'globe' },
];

let activeIndustry = 'commercial';

export const painPointScenes = [
  {
    id: 'medical', label: 'Hospitalar', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Cenário Hospitalar', sceneSubtitle: 'Hospital / Clínica / Reabilitação',
    cards: [
      { icon: 'activity', title: 'CT / RM', desc: 'Equipamento de Imagem', metric: '15%', metricLabel: 'THD', consequences: [{ title: 'Artefatos de Imagem', sub: 'Risco de diagnóstico incorreto, exige exames repetidos, dobra o tempo de espera do paciente' }, { title: 'Superaquecimento de Equipamento', sub: 'Derating do transformador, vida útil de componentes reduzida, manutenção não planejada' }] },
      { icon: 'heart-pulse', title: 'Sala de Operação', desc: 'Equipamento Cirúrgico', metric: 'ms-level', metricLabel: 'Queda de Tensão', consequences: [{ title: 'Interrupção Cirúrgica', sub: 'Interrupção momentânea, ciclo de reinicialização do equipamento, atrasos no procedimento' }, { title: 'Risco à Segurança de Vida', sub: 'Mau funcionamento de equipamentos críticos de suporte, latência na transferência de backup de emergência' }] },
      { icon: 'flask-conical', title: 'Laboratório', desc: 'Analisadores Sensíveis', metric: 'High', metricLabel: 'Corrente de Seq. Zero', consequences: [{ title: 'Desbalanceamento de Fase', sub: 'Deriva de instrumento de precisão, calibração invalidada, desperdício de reagente' }, { title: 'Sobrecarga do Neutro', sub: 'Condutores superaquecidos, risco de incêndio, potencial de queima do condutor N' }] },
    ],
  },
  {
    id: 'office', label: 'Escritório Comercial', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Cenário de Escritório Comercial', sceneSubtitle: 'Escritório / Shopping / Hotel',
    cards: [
      { icon: 'lightbulb', title: 'Iluminação', desc: 'Harmônico de Driver LED', metric: '23%', metricLabel: 'THD', consequences: [{ title: 'Flicker Severo', sub: 'Fadiga visual, produtividade reduzida, reclamações de desconforto dos ocupantes' }, { title: 'Superaquecimento do Neutro', sub: 'Acúmulo de harmônico trilho, queima do condutor N, risco de incêndio' }] },
      { icon: 'arrow-up-down', title: 'Elevador', desc: 'Surtida de Partida de VFD', metric: '7x', metricLabel: 'Corrente de Partida', consequences: [{ title: 'Queda de Tensão', sub: 'Disparo de equipamento, reinicialização do sistema de controle, risco de aprisionamento de passageiros' }, { title: 'Desgaste Mecânico', sub: 'Manutenção frequente, substituição de pastilhas de freio, fadiga de cabo' }] },
      { icon: 'thermometer-snowflake', title: 'HVAC', desc: 'Reativo de Compressor', metric: '0.65', metricLabel: 'Fator de Potência', consequences: [{ title: 'Taxa de Penalidade', sub: 'Sobretaxa de fator de potência da concessionária, aumento de 30%+ na fatura mensal' }, { title: 'Sobrecarga do Transformador', sub: 'Corrente reativa excessiva, superaquecimento, vida útil reduzida' }] },
    ],
  },
  {
    id: 'lab', label: 'Laboratório / Sala Limpa', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Laboratório e Sala Limpa', sceneSubtitle: 'Semicondutor / Biotecnologia / Manufatura de Precisão',
    cards: [
      { icon: 'wind', title: 'Sala Limpa', desc: 'Ventilador FFU com VFD', metric: '> 1.0', metricLabel: 'Flicker Pst', consequences: [{ title: 'Perda de Rendimento', sub: 'Aumento da densidade de defeitos em wafer, rejeição de lote, impacto na receita' }, { title: 'Flutuação de Luz', sub: 'Desalinhamento de fotolitografia, falsas rejeições na inspeção' }] },
      { icon: 'cpu', title: 'Equipamento de Laboratório', desc: 'Instrumentos Sensíveis', metric: '30%', metricLabel: 'Queda de Tensão', consequences: [{ title: 'Perda de Dados', sub: 'Dados de medição não salvos, interrupção de experimento, desperdício de reagente' }, { title: 'Deriva de Calibração', sub: 'Recalibração pós-queda necessária, 4-8 horas de inatividade do instrumento' }] },
      { icon: 'toy-brick', title: 'Bombas de Resfriamento', desc: 'Partida de Motor', metric: '5~8x', metricLabel: 'Corrente de Partida', consequences: [{ title: 'Queda de Tensão no Barramento', sub: 'Risco de disparo em cascata, sub-tensão de equipamentos vizinhos, parada de lote' }, { title: 'Disparo de Disjuntor', sub: 'Disparo falso por sobrecorrente, parada não planejada de produção, procedimento de reinício' }] },
    ],
  },
];

export const topologyScenes = [
  {
    id: 'medical', sceneName: 'Topologia Hospitalar', sceneSubtitle: 'Hospital / Clínica / Reabilitação',
    deviceLabel: 'AHF-200A', deviceType: 'Filtro Ativo de Harmônicos',
    deviceDesc: 'Conectado em paralelo ao barramento BT, mitiga harmônicos para a distribuição de energia de centro cirúrgico / imagem / laboratório',
    branches: [
      { label: 'Distrib. do Centro Cirúrgico', sub: 'Proteção contra Queda de Tensão' },
      { label: 'Energia de Imagem', sub: 'Harmônicos CT / RM' },
      { label: 'Distrib. de Laboratório', sub: 'Desbalanceamento de Fase' },
    ],
  },
  {
    id: 'office', sceneName: 'Topologia de Escritório Comercial', sceneSubtitle: 'Escritório / Shopping / Hotel',
    deviceLabel: 'SVG-300A', deviceType: 'Gerador Estático de Var',
    deviceDesc: 'SVG no barramento BT, compensa potência reativa para circuitos de elevador / iluminação / HVAC',
    branches: [
      { label: 'Energia de Iluminação', sub: 'Fonte Harmônica' },
      { label: 'Energia de Elevador', sub: 'Surtida de VFD' },
      { label: 'Energia de HVAC', sub: 'Carga Reativa' },
    ],
  },
  {
    id: 'lab', sceneName: 'Topologia de Laboratório e Sala Limpa', sceneSubtitle: 'Semicondutor / Biotecnologia / Manufatura de Precisão',
    deviceLabel: 'AHF-150A', deviceType: 'Filtro Ativo de Harmônicos',
    deviceDesc: 'Conectado em série na entrada da UPS para supressão harmônica de resfriamento de processo / equipamento de laboratório',
    branches: [
      { label: 'Entrada da UPS', sub: 'Energia de Precisão' },
      { label: 'Resfriamento de Processo', sub: 'Corrente de Partida de Bomba' },
      { label: 'Equipamento de Laboratório', sub: 'Carga Sensível' },
    ],
  },
];

export const cases = [
  {
    title: 'Retrofit de Harmônicos de Iluminação LED e Sobrecarga do Neutro — Shopping Atacadista, Guangzhou',
    tabLabel: 'LED e neutro, shopping',
    highlight: 'Distorção de corrente 49% → 2,75%; corrente de sequência zero do neutro 365,76 A → 25,19 A',
    image: '/assets/images/solutions-commercial-medical-case-office.webp',
    industry: 'Edifício Comercial', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/pt/contact',
    site: 'Um mercado atacadista de vestuário em um único transformador de 2.500 kVA a cerca de 90% de carga, com dois gabinetes de compensação totalizando 600 kvar. A carga dominante é iluminação LED monofásica e paredes de vídeo LED nos pavimentos de vendas.',
    harmonics: [
      'Distorção de corrente de fase do pavimento 1: 49% antes do retrofit',
      'Corrente harmônica de sequência zero do neutro: 365,76 A',
      'Corrente aparente do neutro: 369 A, incluindo corrente de desbalanceamento',
      'Distorção de tensão do barramento: 4,75%',
    ],
    overview: 'Transformador de 2.500 kVA a 90% de carga com 600 kvar de bancos de capacitores. Iluminação LED e paredes de vídeo LED lotam o shopping — drivers LED monofásicos injetam forte harmônico de 3ª ordem que se acumula no condutor neutro, levando a distorção de corrente a 49% e sobrecarregando a linha N.',
    limitations: 'Medido nos alimentadores de entrada do pavimento em vez do ponto de medição da concessionária, então os números descrevem a distribuição do edifício, não o PCC do site. Apenas dois pavimentos foram tratados.',
    trend: 'Distorção 49% → 2,75%  ·  Corrente do neutro 369 A → 36,51 A',
    solution: [{ product: 'AHF-200A', qty: 2, use: 'Trifásico 4 fios, chave de entrada principal em cada pavimento de vendas' }],
    results: [
      'Harmônico de sequência zero do neutro: 365,76 A → 25,19 A',
      'Corrente aparente do neutro: 369 A → 36,51 A (incluindo corrente de desbalanceamento)',
      'Distorção de tensão do barramento: 4,75% → 3,75%',
      'Aprovado em teste conforme GB/T 14549',
    ],
  },
  {
    title: 'Retrofit Harmônico Antirressonância — Fabricante de Dispositivos Médicos, Dongguan',
    tabLabel: 'Antirressonância, hospitalar',
    highlight: 'Corrente harmônica 108 A → 25 A por fase com o banco de capacitores em operação, sem ressonância LC',
    image: '/assets/images/solutions-commercial-medical-case-hospital.webp',
    industry: 'Médico e Hospitalar', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/pt/contact',
    site: 'Três transformadores em uma fábrica de dispositivos médicos, cada um com um banco de capacitores puro de 600 kvar e operando entre 60% e 80% de carga. O site teve falhas repetidas de capacitores e disjuntores, o que desencadeou o levantamento.',
    harmonics: [
      'Corrente harmônica total, TR1 fases A / B / C: 108,16 / 106,64 / 79,22 A',
      'TR1 fase A, 3ª harmônica: 70,87 A',
      'TR1 fase A, 5ª harmônica: 50,78 A',
      'TR1 fase A, 7ª harmônica: 59,10 A',
      'Demanda reativa 168,91 kvar, fator de potência 0,967',
    ],
    overview: 'Três transformadores, cada um com compensação pura de capacitores de 600 kvar, operando a 60–80% de carga. O site teve falhas recorrentes de capacitores e disjuntores. A parte difícil: os TC do filtro amostram no lado da rede e a conexão é feita a jusante de um banco puramente capacitivo — a solução usual é mover a amostragem dos TC para o lado da carga. Filtragem seletiva de 3ª / 5ª / 7ª ordem com controle antirressonância de acoplamento inteligente manteve a instalação estável nesta configuração.',
    limitations: 'O relatório não informa as classificações de quadro do filtro selecionadas, então apenas as correntes medidas antes e depois são publicadas aqui. Os resultados são para o transformador TR1, salvo indicação em contrário.',
    trend: 'Corrente harmônica TR1 (A/B/C): 108,16 / 106,64 / 79,22 A → 25,27 / 26,68 / 22,79 A',
    solution: [{ product: 'AHF', qty: 3, use: 'Um por transformador (TR1 / TR2 / TR3), filtragem seletiva de 3ª / 5ª / 7ª ordem' }],
    results: [
      'Sem ressonância LC após energização, banco de capacitores em operação durante todo o processo',
      'Fase A: 3ª 70,87 A → 1,31 A, 5ª 50,78 A → 5,32 A, 7ª 59,10 A → 3,28 A',
      'Demanda reativa 168,91 kvar → 133,97 kvar; fator de potência 0,967 → 0,978',
      'Falhas recorrentes de capacitores e disjuntores resolvidas',
    ],
  },
  {
    title: 'Controle Harmônico Livre de Ressonância em uma Grande Fazenda de Pecuária, Anhui',
    tabLabel: 'Antirressonância, agrícola',
    highlight: 'Distorção perto de 50% → cerca de 5%, fator de potência 0,87 → 0,99 — após a devolução de outra marca',
    image: '/assets/images/solutions-commercial-medical-case-lab.webp',
    industry: 'Agronegócio e Produção de Alimentos', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/pt/contact',
    site: 'Uma operação de pecuária com automação densa e monitoramento ambiental, distante do ponto de fonte em uma rede fraca, com um quadro apertado e sem espaço para cubículos convencionais. Iluminação, ar condicionado e ventilação são todas cargas eletrônicas de potência.',
    harmonics: [
      'Corrente de operação 706 A no momento do levantamento',
      'Distorção de corrente perto de 50%, cerca de 342,6 A de corrente harmônica',
      'Fator de potência 0,87 antes do retrofit',
      'Quadro sem espaço para cubículos convencionais',
    ],
    overview: 'Uma operação de pecuária de rápido crescimento com automação densa e monitoramento ambiental. Iluminação, ar condicionado e ventiladores de ventilação são todas cargas eletrônicas de potência; o site fica distante do ponto de fonte em uma rede fraca; e o quadro é apertado. Os filtros ativos de um fornecedor anterior entraram em ressonância na energização — zumbido no transformador, motores operando instáveis — e foram devolvidos.',
    limitations: 'Os filtros ativos de um fornecedor anterior entraram em ressonância neste site e foram devolvidos; essa história é descrita porque moldou a seleção, não como uma comparação de marcas nomeadas. Nenhum gráfico de espectro antes e depois é publicado para este projeto.',
    trend: 'Distorção ~50% (342,6 A) → ~5%  ·  Fator de potência 0,87 → 0,99',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'Modelos antirressonância, ciclo de resposta sintonizado por IA e derating de saída' }],
    results: [
      'Harmônicos e ressonância ambos eliminados — harmônicos e ressonância foram "eliminados no momento da energização, além das expectativas" (cliente)',
      'Fator de potência elevado de cerca de 0,87 para 0,99',
      'Alta densidade de potência cabe no quadro existente — até 900 A em um único gabinete',
      'Equipamentos sensíveis de controle e monitoramento automático protegidos',
    ],
  },
];

// ===================== GRID DATA =====================
export const gridPainPoints = [
  {
    id: 'transmission', label: 'Transmissão', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Transmissão e Distribuição', sceneSubtitle: 'Subestação / Distribuição / Upgrade Rural',
    cards: [
      { icon: 'network', title: 'Carga Não Linear', desc: 'Injeção Harmônica de cargas industriais e de tração', metric: '>10%', metricLabel: 'THD', consequences: [{ title: 'Superaquecimento do Transformador', sub: 'Perda harmônica excessiva, envelhecimento de isolamento, derating forçado de até 30% da capacidade' }, { title: 'Maloperação de Proteção', sub: 'Disparo falso de relé, operação incômoda de disjuntor, degradação da confiabilidade da rede' }] },
      { icon: 'zap', title: 'Geração Distribuída', desc: 'Distúrbio de Rede da interconexão de GD', metric: '±10%', metricLabel: 'Flutuação de Tensão', consequences: [{ title: 'Fluxo de Potência Reverso', sub: 'Retroalimentação de GD causa elevação de tensão, caça do tap changer, falha de coordenação de proteção' }, { title: 'Risco de Ilha', sub: 'Formação não intencional de ilha, reconexão fora de sincronismo, danos a equipamentos' }] },
      { icon: 'git-branch', title: 'Reativo de Linha', desc: 'Perda reativa de transferência de longa distância', metric: '< 0.9', metricLabel: 'V Final (pu)', consequences: [{ title: 'Surgimento de Perda de Linha', sub: 'Aumento exponencial da perda I²R, colapso de tensão no final do alimentador rural, corte de carga' }, { title: 'Risco de Colapso de Tensão', sub: 'Cascata de déficit reativo, potencial de blecaute de ampla área, falha de contingência N-1' }] },
    ],
  },
  {
    id: 'urban', label: 'Distribuição Urbana', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Rede de Distribuição Urbana', sceneSubtitle: 'Centro da Cidade / Zona de Desenvolvimento / Residencial Antigo',
    cards: [
      { icon: 'plug-zap', title: 'Recarga de VE', desc: 'Surtida de impacto de clusters de recarga rápida', metric: '120kW+', metricLabel: 'Degrau de Carga', consequences: [{ title: 'Queda de Rede', sub: 'Pico de recarga concorrente causa queda de tensão de 15%+, disparo por sobrecarga do transformador de distribuição' }, { title: 'Injeção Harmônica', sub: 'Harmônicos de retificador de VE de 6 pulsos, THD excedendo 8% no PCC, poluição da rede' }] },
      { icon: 'building-2', title: 'Carga Comercial', desc: 'Desbalanceamento de fase de cargas monofásicas', metric: '>8%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Sobrecarga do Neutro', sub: 'Acúmulo de corrente de sequência zero, queima da linha N, risco de incêndio em áreas residenciais antigas' }, { title: 'Derating de Motor', sub: 'Aquecimento de sequência negativa em motores trifásicos, vida útil reduzida, indisponibilidade não planejada' }] },
      { icon: 'cable', title: 'Rede de Cabos', desc: 'Reativo capacitivo de cabos subterrâneos', metric: 'Leading', metricLabel: 'PF > 0.95', consequences: [{ title: 'Sobreactivação', sub: 'Capacitância do cabo causa PF em avanço em carga leve, elevação de tensão, estresse de isolamento' }, { title: 'Risco de Ressonância', sub: 'Capacitância do cabo + indutância do transformador ressonância paralela, amplificação harmônica' }] },
    ],
  },
  {
    id: 'microgrid', label: 'Rede Microgrid', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Rede Microgrid e CCHP', sceneSubtitle: 'Campus / Ilha / Área Remota',
    cards: [
      { icon: 'sun', title: 'Rede Multi-fonte', desc: 'Empilhamento harmônico de PV + eólica + armazenamento', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Violação do PCC', sub: 'Superposição harmônica multi-inversor, limite IEEE 519 do PCC excedido, penalidade da concessionária' }, { title: 'Instabilidade de Ressonância', sub: 'Interação de filtro LCL, oscilação de banda larga, disparo em cascata do inversor' }] },
      { icon: 'battery-charging', title: 'Ciclagem de Armazenamento', desc: 'Flutuação reativa de carga/descarga', metric: 'PF Swing', metricLabel: '0.7~1.0', consequences: [{ title: 'Taxa de Penalidade', sub: 'Oscilação de PF bidirecional aciona faturamento de energia reativa da concessionária, surto de custo mensal' }, { title: 'Perda de Vida de Ciclo', sub: 'Corrente reativa excessiva aquece o PCS da bateria, envelhecimento acelerado de IGBT, risco de perda de garantia' }] },
      { icon: 'shuffle', title: 'Comutação de Rede', desc: 'Queda de tensão durante transição ilha/rede', metric: '>20%', metricLabel: 'Profundidade de Queda', consequences: [{ title: 'Disparo de Carga', sub: 'Transferência STS > 4ms causa queda de contator, UPS de carga crítica transfere para bateria' }, { title: 'Falha de Partida do Diesel', sub: 'Queda durante a sequência de partida do gerador, colapso de excitação do AVR, falha de black-start' }] },
    ],
  },
];
export const gridTopology = [
  {
    id: 'transmission', sceneName: 'Topologia de Transmissão', sceneSubtitle: 'Subestação / Distribuição / Upgrade Rural',
    deviceLabel: 'SVG + AHF', deviceType: 'Sistema Combinado',
    deviceDesc: 'SVG no barramento 35kV/10kV para reativo + AHF no alimentador de carga crítica para harmônicos, ponto de conexão de GD marcado',
    branches: [
      { label: 'Carga Crítica', sub: 'Equipamento Sensível' },
      { label: 'Ponto de Conexão GD', sub: 'Fluxo de Potência Reverso' },
      { label: 'Alimentação Rural', sub: 'Queda de Linha Longa' },
    ],
  },
  {
    id: 'urban', sceneName: 'Topologia de Distribuição Urbana', sceneSubtitle: 'Centro da Cidade / Zona de Desenvolvimento / Residencial Antigo',
    deviceLabel: 'SPC + SVG-10kV', deviceType: 'Sistema de Distribuição',
    deviceDesc: 'SPC no alimentador 10kV para balanceamento + SVG no barramento para reativo, estação de VE/comercial/residencial marcados',
    branches: [
      { label: 'Estação VE', sub: 'Carga de Impacto' },
      { label: 'Carga Comercial', sub: 'Desbalanceamento de Fase' },
      { label: 'Residencial', sub: 'Carga Monofásica' },
    ],
  },
  {
    id: 'microgrid', sceneName: 'Topologia de Microrrede', sceneSubtitle: 'Campus / Ilha / Área Remota',
    deviceLabel: 'SVG+AHF + SPC', deviceType: 'Sistema de Microrrede',
    deviceDesc: 'SVG+AHF no PCC para qualidade de energia + SPC para balanceamento de carga, ramo PV/armazenamento/diesel marcado',
    branches: [
      { label: 'Arranjo PV', sub: 'Fonte Intermitente' },
      { label: 'PCS de Bateria', sub: 'Fluxo Bidirecional' },
      { label: 'Gerador Diesel', sub: 'Fornecimento de Backup' },
    ],
  },
];
export const gridCases = [
  {
    title: 'Configuração Típica — Suporte Reativo de Transmissão e Distribuição',
    tabLabel: 'Suporte reativo T&D',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-grid-case-substation.webp',
    industry: 'Configuração Típica · Rede Elétrica', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma subestação ou upgrade de alimentador rural: SVG no barramento 35 kV / 10 kV para suporte reativo e de tensão, com AHF colocado apenas nos alimentadores que carregam a pior carga harmônica.',
    overview: 'Para subestações que atendem uma mistura de carga industrial e de tração, o arranjo usual é um SVG no barramento para suporte reativo de tensão mais AHF nos alimentadores críticos para harmônicos. As classificações são definidas por um levantamento, não por um modelo — as quantidades abaixo são apenas um ponto de partida.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG', qty: 2, use: 'Suporte reativo de tensão no barramento' }, { product: 'AHF-200A', qty: 3, use: 'Filtragem harmônica de alimentador crítico' }],
    results: [
      'Dimensionado a partir de um espectro harmônico medido e perfil reativo',
      'Projetado para limites GB/T 14549 no ponto de acoplamento comum',
      'Solicite-nos projetos de referência em transmissão e distribuição',
    ],
  },
  {
    title: 'Configuração Típica — Rede de Distribuição Urbana',
    tabLabel: 'Distribuição urbana',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-grid-case-urban.webp',
    industry: 'Configuração Típica · Distribuição Urbana', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma rede de centro de cidade ou zona de desenvolvimento que carrega clusters de VE, carga comercial monofásica e áreas residenciais alimentadas por cabo.',
    overview: 'Para redes urbanas 10 kV que carregam clusters de recarga rápida de VE mais carga mista comercial e residencial, o arranjo usual é um dispositivo de balanceamento de fase no alimentador de recarga e um SVG no alimentador para suporte reativo. A capacitância de cabo subterrâneo em carga leve deve ser verificada antes do dimensionamento, ou o SVG lutará contra ela.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SPC-150A', qty: 4, use: 'Balanceamento trifásico de baia de recarga' }, { product: 'SVG', qty: 2, use: 'Compensação reativa de alimentador' }],
    results: [
      'Dimensionamento validado contra uma verificação capacitiva de carga leve',
      'Visa limites de desbalanceamento GB/T 15543 em cada estação de recarga',
      'Solicite-nos projetos de referência em distribuição urbana',
    ],
  },
  {
    title: 'Configuração Típica — Microrrede e CCHP',
    tabLabel: 'Microrrede e CCHP',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-grid-case-microgrid.webp',
    industry: 'Configuração Típica · Microrrede', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma microrrede de campus, ilha ou remota que combina PV, armazenamento de bateria e backup a diesel em um único ponto de acoplamento comum.',
    overview: 'Para microrredes de ilha e campus combinando PV, eólica, armazenamento e diesel, o arranjo usual é uma combinação SVG + AHF no ponto de acoplamento comum mais um dispositivo de balanceamento entre fases. A superposição harmônica multi-inversor e a queda de transferência ilha/rede ambas devem ser medidas antes de fixar as classificações.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'Condicionamento de qualidade de energia no PCC' }, { product: 'SPC-100A', qty: 1, use: 'Balanceamento de carga entre fases' }],
    results: [
      'Estudo harmônico em todos os tipos de inversor antes do dimensionamento',
      'Comportamento de transferência ilha/rede verificado por medição',
      'Solicite-nos projetos de referência em microrredes',
    ],
  },
];

// ===================== DATACENTER DATA =====================
export const dcPainPoints = [
  {
    id: 'cloud', label: 'Computação em Nuvem', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Grande Centro de Computação em Nuvem', sceneSubtitle: 'HPC / Provedor de Nuvem / Colocalização',
    cards: [
      { icon: 'cloud', title: 'Harmônicos de UPS', desc: 'Poluição refletida de retificadores de UPS', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Circulação Paralela', sub: 'Corrente harmônica de UPS circula entre unidades paralelas, desbalanceamento de compartilhamento de carga, risco de disparo térmico' }, { title: 'Vida da Bateria ↓', sub: 'Ondulação harmônica acelera corrosão de bateria VRLA, vida de 3 anos reduzida a 18 meses' }] },
      { icon: 'server', title: 'Fazenda de Servidores', desc: 'Desbalanceamento de fase de carga de TI monofásica', metric: '>15%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Superaquecimento do Neutro', sub: 'Trilho + desbalanceamento de fase combinam, seq zero > corrente de fase, risco de incêndio' }, { title: 'Disparo de PDU', sub: 'Sobrecarga por fase apesar de média abaixo da classificação, disparo incômodo de disjuntor de PDU de rack, indisponibilidade de fila' }] },
      { icon: 'fan', title: 'Sistema de Resfriamento', desc: 'Impacto reativo de chillers/CRAC com VFD', metric: 'PUE', metricLabel: 'Deterioração', consequences: [{ title: 'Sobrecarga do Transformador', sub: 'Reativo excessivo consome capacidade do transformador, upgrade de resfriamento forçado, desperdício de CapEx' }, { title: 'Penalidade de Energia', sub: 'PUE 1,6→1,8 por perdas reativas, OpEx anual +800K CNY em instalação de 10MW' }] },
    ],
  },
  {
    id: 'finance', label: 'Data Center Financeiro', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Data Center Financeiro', sceneSubtitle: 'Banco / Valores Mobiliários / Seguros',
    cards: [
      { icon: 'landmark', title: 'Negociação de Alta Frequência', desc: 'Infraestrutura de negociação sensível a queda', metric: '< 3ms', metricLabel: 'Tolerância a Queda', consequences: [{ title: 'Interrupção de Negociação', sub: 'Violação da curva CBEMA/ITIC, queda de PSU de servidor, queda de milissegundo = perda de milhão de yuans' }, { title: 'Multa Regulatória', sub: 'Mandato de continuidade de negociação da CSRC, indisponibilidade >5min dispara relatório obrigatório, penalidade de conformidade' }] },
      { icon: 'power', title: 'Troca de Diesel', desc: 'Choque de transferência durante teste/indisponibilidade de gerador', metric: '±15%', metricLabel: 'Degrau de Tensão', consequences: [{ title: 'Sobrecarga de UPS', sub: 'Corrente de entrada de transferência ATS, UPS muda para bateria, sobrecarga de walk-in de retificador, falha do sistema' }, { title: 'Caça de Gerador', sub: 'Degrau de carga causa oscilação do governador, desvio de frequência >2%, desligamento de PSU' }] },
      { icon: 'thermometer', title: 'HVAC de Precisão', desc: 'Fonte harmônica de compressores com VFD', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Elevação de PUE', sub: 'Derating harmônico de transformadores de resfriamento, capacidade de resfriamento reduzida, ponto quente em racks' }, { title: 'Falha de Controle', sub: 'Ruído harmônico na PSU do controlador HVAC, deriva de sensor, oscilação de temperatura' }] },
    ],
  },
  {
    id: 'edge', label: 'Computação de Borda', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Nó de Computação de Borda', sceneSubtitle: 'Estação Base 5G / IoT / Sala Distribuída',
    cards: [
      { icon: 'router', title: 'Qualidade de Rede', desc: 'Fornecimento instável em sites remotos/rurais', metric: '>20%', metricLabel: 'Profundidade de Queda', consequences: [{ title: 'Nó Offline', sub: 'Queda frequente dispara descarga de bateria mini-UPS, vida de ciclo esgotada em 6 meses' }, { title: 'Custo de Deslocamento', sub: 'Cada visita a site custa 800 CNY, 200+ nós = 160K CNY/mês de sobrecarga de O&M' }] },
      { icon: 'hard-drive', title: 'UPS Pequeno', desc: 'Risco de sobrecarga em sites de gabinete único', metric: '>80%', metricLabel: 'Taxa de Carga', consequences: [{ title: 'Sem Redundância', sub: 'Config N, falha de UPS única = indisponibilidade completa do nó, SLA 99,9% violado' }, { title: 'Superaquecimento de Bateria', sub: 'Alta taxa de carga em gabinete compacto, disparo térmico, risco de incêndio em sites não assistidos' }] },
      { icon: 'radio', title: 'Carga Distribuída', desc: 'Desbalanceamento de fase de 5G/IoT monofásicos', metric: '>10%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Perda de Eficiência', sub: 'Falha de coordenação DER, corrente de seq negativa, derating de PCS 15%, curtailment' }, { title: 'Disparo Monofásico', sub: 'Sobrecorrente por fase, disparo em cascata de equipamentos colocalizados no mesmo alimentador' }] },
    ],
  },
];
export const dcTopology = [
  {
    id: 'cloud', sceneName: 'Topologia de Computação em Nuvem', sceneSubtitle: 'HPC / Provedor de Nuvem / Colocalização',
    deviceLabel: 'AHF+SVG', deviceType: 'Sistema de Qualidade de Energia',
    deviceDesc: 'AHF na entrada da UPS para harmônicos + SVG no barramento BT para reativo, ramo do sistema de resfriamento marcado',
    branches: [
      { label: 'Entrada da UPS', sub: 'Fonte Harmônica' },
      { label: 'Rack de Servidores', sub: 'Carga Desbalanceada' },
      { label: 'CRAC/HVAC', sub: 'Carga Reativa VFD' },
    ],
  },
  {
    id: 'finance', sceneName: 'Topologia de Data Center Financeiro', sceneSubtitle: 'Banco / Valores Mobiliários / Seguros',
    deviceLabel: 'AHF-100A + SVG-150A', deviceType: 'Sistema de Precisão',
    deviceDesc: 'AHF em série na entrada da UPS + SVG no barramento BT, transferência ATS / mesa de negociação / HVAC marcados',
    branches: [
      { label: 'Sistema UPS', sub: 'Fonte Harmônica' },
      { label: 'Mesa de Negociação', sub: 'Sensível a Queda' },
      { label: 'HVAC de Precisão', sub: 'Harmônicos VFD' },
    ],
  },
  {
    id: 'edge', sceneName: 'Topologia de Nó de Borda', sceneSubtitle: 'Estação Base 5G / IoT / Sala Distribuída',
    deviceLabel: 'AHF-Slim 15A', deviceType: 'Unidade Rack-mount',
    deviceDesc: 'AHF-Slim rack-mount em gabinete de distribuição, loop de rede direta / mini UPS marcado',
    branches: [
      { label: 'Rede Direta', sub: 'Fornecimento de Rede Rural' },
      { label: 'Mini UPS', sub: 'Risco de Sobrecarga' },
      { label: 'Carga 5G/IoT', sub: 'Energia Distribuída' },
    ],
  },
];
export const dcCases = [
  {
    title: 'Mitigação Harmônica de UPS em um Alimentador de Data Center, Guangzhou',
    tabLabel: 'Alimentador IDC',
    highlight: 'Corrente harmônica 204,96 A → 19,18 A; distorção 26,94% → 3,12%',
    image: '/assets/images/solutions-datacenter-case-cloud.webp',
    industry: 'Colocalização / IDC', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/pt/contact',
    site: 'O alimentador TR1 de um salão IDC, operando entre 200 A e 850 A com fator de potência de deslocamento de 0,975 antes do retrofit. O gabinete de filtro existente foi reconstruído em vez de substituído.',
    harmonics: [
      'Corrente de carga 814,13 A a fator de carga 82%',
      'Corrente harmônica total 204,96 A, Ithd 26,94%',
      'Fator de potência de deslocamento 0,975 antes do retrofit',
      'Distorção por fase após tratamento: 3,12% / 2,50% / 2,55% em A / B / C',
    ],
    overview: 'Alimentador TR1 de um salão IDC, corrente de operação 200–850 A, fator de potência de deslocamento 0,975 antes do retrofit. O gabinete de filtro existente foi reconstruído em torno de um novo filtro ativo de 500 A. A 814,13 A de corrente de carga (fator de carga 82%) a corrente harmônica medida atingiu o pico de 204,96 A com 26,94% de distorção.',
    limitations: 'Cobre um alimentador do salão, não o site inteiro. Os números são medidos a 814,13 A de corrente de carga (fator de carga 82%), que é o ponto que o relatório de comissionamento usou para aceite.',
    trend: 'Corrente harmônica 204,96 A → 19,18 A  ·  Distorção 26,94% → 3,12%',
    solution: [{ product: 'AHF-500A', qty: 1, use: 'Gabinete de filtro reconstruído no alimentador TR1' }],
    results: [
      'Distorção por fase 3,12% / 2,50% / 2,55% em A / B / C',
      'Fator de potência mantido em 0,981 em operação',
      'Toda ordem harmônica dentro dos limites GB/T 14549',
      'As fases I e III do salão IDC passaram no arquivamento de inspeção de incêndio',
    ],
  },
  {
    title: 'Configuração Típica — Data Center Financeiro',
    tabLabel: 'Data Center Financeiro',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-datacenter-case-finance.webp',
    industry: 'Configuração Típica · Data Center Financeiro', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para um data center de banco, valores mobiliários ou seguros, onde harmônicos de retificador de UPS e transitórios de transferência ATS dominam o briefing de projeto.',
    overview: 'Para data centers de banco, valores mobiliários e seguros, o arranjo usual é AHF na entrada do retificador de UPS mais SVG no barramento BT para suporte reativo dinâmico. Testes de transferência ATS são o caso de estresse — a janela de queda deve ser medida antes de fixar a classificação do filtro.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'Filtragem na entrada do retificador de UPS' }, { product: 'SVG-100A', qty: 2, use: 'Suporte reativo dinâmico da mesa de negociação' }],
    results: [
      'Janela de queda medida durante um teste de transferência ATS antes do dimensionamento',
      'Visa requisitos de flicker IEC 61000-3-3 e tolerância a queda do site',
      'Solicite-nos projetos de referência em data centers financeiros',
    ],
  },
  {
    title: 'Configuração Típica — Nós de Computação de Borda',
    tabLabel: 'Nós de borda',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-datacenter-case-edge.webp',
    industry: 'Configuração Típica · Computação de Borda', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para sites 5G MEC e IoT distribuídos, onde o fornecimento é instável, o gabinete é pequeno e o custo de uma visita ao site supera o hardware.',
    overview: 'Para sites 5G MEC e IoT distribuídos, o arranjo usual é um AHF slim rack-mount dentro do gabinete existente mais monitoramento centralizado. Sites remotos trazem sua própria restrição: fornecimento instável e um custo de deslocamento que ofusca o hardware, então o monitoramento remoto não é opcional.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'AHF-Slim', qty: 1, use: 'Rack-mount 1U por gabinete de nó' }, { product: 'Cloud Monitor', qty: 1, use: 'Plataforma de monitoramento remoto centralizada' }],
    results: [
      'Classificação definida por gabinete após levantamento de site',
      'Monitoramento remoto incluído para que deslocamentos não sejam a resposta padrão',
      'Solicite-nos projetos de referência em computação de borda',
    ],
  },
];

// ===================== INDUSTRIAL DATA =====================
export const indPainPoints = [
  {
    id: 'welding', label: 'Soldagem e Metal', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Processamento de Soldagem e Metal', sceneSubtitle: 'Automotivo / Construção Naval / Estrutura de Aço',
    cards: [
      { icon: 'flame', title: 'Banco de Soldadores de Arco', desc: 'Surtida harmônica de soldagem de arco em lote', metric: '>25%', metricLabel: 'THD', consequences: [{ title: 'Superaquecimento do Transformador', sub: 'Corrente harmônica intermitente alta, envelhecimento de isolamento acelerado 3x, derating forçado' }, { title: 'Disparo de Proteção', sub: 'Pico harmônico dispara disparo falso de disjuntor, parada de linha de produção, custo de retrabalho' }] },
      { icon: 'factory', title: 'Forno de Média Frequência', desc: 'Flicker de tensão de forno de indução', metric: 'Reactive', metricLabel: 'Flutuação', consequences: [{ title: 'Queda de Tensão de Rede', sub: 'Ciclo de forno causa Pst > 1,5, mau funcionamento de equipamento vizinho, rejeição de lote' }, { title: 'Taxa de Penalidade', sub: 'Violação de flicker da concessionária, sobretaxa mensal de energia reativa, não conformidade contratual' }] },
      { icon: 'cpu', title: 'Centro de Usinagem CNC', desc: 'Desbalanceamento de fase de servomotores', metric: 'High', metricLabel: 'Seq. Zero', consequences: [{ title: 'Mau Funcionamento de Servo', sub: 'Desbalanceamento de fase causa erro de posição, deriva dimensional da peça, aumento da taxa de sucata' }, { title: 'Perda de Rendimento', sub: 'Quebra frequente de ferramenta, degradação de acabamento superficial, surto de taxa de devolução do cliente' }] },
    ],
  },
  {
    id: 'petrochemical', label: 'Químico e Petróleo', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Químico e Petroquímico', sceneSubtitle: 'Refino / Químico Fino / Petróleo e Gás',
    cards: [
      { icon: 'droplets', title: 'Banco de VFD', desc: 'Empilhamento harmônico de instalação multi-VFD', metric: '>18%', metricLabel: 'THD', consequences: [{ title: 'Violação de Rede', sub: 'Sobreposição harmônica multi-VFD, limite IEEE 519 do PCC excedido, aviso da concessionária' }, { title: 'Disparo de Capacitor', sub: 'Amplificação harmônica em capacitores PFC, queima de fusível, escalada de penalidade reativa' }] },
      { icon: 'waves', title: 'Bomba de Alta Potência', desc: 'Surtida de partida de grandes motores', metric: '6~10x', metricLabel: 'Corrente de Partida', consequences: [{ title: 'Queda de Tensão no Barramento', sub: 'Partida DOL causa queda de barramento de 20%+, brownout de módulo I/O DCS, instabilidade de malha de controle' }, { title: 'Alerta DCS', sub: 'Queda repetida dispara inundação de alarme DCS, sobrecarga cognitiva do operador, atraso de resposta' }] },
      { icon: 'shield-alert', title: 'Sistema DCS', desc: 'Infraestrutura de controle sensível a queda', metric: '>15%', metricLabel: 'Profundidade de Queda', consequences: [{ title: 'Congelamento de Controle', sub: 'Queda causa reset de processador DCS, perda de posição de válvula, risco de reação exotérmica' }, { title: 'Parada de Processo', sub: 'Sistema instrumentado de segurança dispara ESD, perda de lote, procedimento de reinício de 48h' }] },
    ],
  },
  {
    id: 'semiconductor', label: 'Semicondutor', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Semicondutor e Eletrônicos', sceneSubtitle: 'Fábrica de Wafer / Encapsulamento / PCB',
    cards: [
      { icon: 'cpu', title: 'Fábrica de Wafer', desc: 'Queda de tensão em scanners de litografia', metric: '< 5ms', metricLabel: 'Tolerância a Queda', consequences: [{ title: 'Parada de Scanner', sub: 'Queda sub-ciclo causa perda de posição do estágio do scanner, recalibração de 4h, sucata de wafer' }, { title: 'Sucata de Wafer', sub: 'Evento único de queda = 25 wafers descartados × $5K/wafer = perda de $125K por incidente' }] },
      { icon: 'wind', title: 'Sala Limpa', desc: 'Poluição harmônica de FFU/VFD', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Carga de Filtro ↑', sub: 'Corrente harmônica aumenta temperatura do motor FFU, taxa de falha de rolamento 3x, aumento da contagem de partículas' }, { title: 'Risco de Partícula', sub: 'Flutuação de velocidade FFU causa perda de pressão positiva, violação de sala limpa Classe 100' }] },
      { icon: 'microscope', title: 'Equipamento de Teste', desc: 'Desbalanceamento de fase no piso de teste ATE', metric: '>5%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Erro de Dados', sub: 'Rejeição de ondulação da fonte ATE degradada, falsa rejeição de DUT, erro de relatório de rendimento' }, { title: 'Superaquecimento do Neutro', sub: 'Alta corrente de seq zero na PDU do piso de teste, temp da linha N > 90°C, risco de incêndio' }] },
    ],
  },
];
export const indTopology = [
  {
    id: 'welding', sceneName: 'Topologia de Soldagem e Metal', sceneSubtitle: 'Automotivo / Construção Naval / Estrutura de Aço',
    deviceLabel: 'AHF-150A', deviceType: 'Filtro Harmônico',
    deviceDesc: 'Paralelo ao barramento BT da oficina, visa alimentadores de banco de soldadores / forno para supressão harmônica',
    branches: [
      { label: 'Dist. de Soldadores', sub: 'Surtida Harmônica' },
      { label: 'Dist. de Forno', sub: 'Fonte de Flicker' },
      { label: 'Dist. CNC', sub: 'Desbalanceamento de Fase' },
    ],
  },
  {
    id: 'petrochemical', sceneName: 'Topologia Químico e Petróleo', sceneSubtitle: 'Refino / Químico Fino / Petróleo e Gás',
    deviceLabel: 'SVG-800V', deviceType: 'Gerador Estático de Var',
    deviceDesc: 'SVG-800V/690V no barramento HV + AHF para harmônicos VFD, alimentador de carga sensível DCS marcado',
    branches: [
      { label: 'Dist. de Craqueamento', sub: 'Banco VFD' },
      { label: 'Destilação', sub: 'Carga de Aquecimento E' },
      { label: 'Água de Circulação', sub: 'Grande Bomba' },
    ],
  },
  {
    id: 'semiconductor', sceneName: 'Topologia de Semicondutor', sceneSubtitle: 'Fábrica de Wafer / Encapsulamento / PCB',
    deviceLabel: 'AHF+SVG', deviceType: 'Sistema Combinado',
    deviceDesc: 'Combo AHF+SVG na entrada da UPS, marca alimentadores de fábrica de wafer / sala limpa de dupla alimentação',
    branches: [
      { label: 'Entrada da UPS', sub: 'Energia de Precisão' },
      { label: 'Resfriamento de Processo', sub: 'Corrente de Partida de Bomba' },
      { label: 'Equipamento de Teste', sub: 'Carga Sensível' },
    ],
  },
];
export const indCases = [
  {
    title: 'Retrofit Harmônico em um Alimentador de Planta de 550 A — Fabricante de Eletrônicos, Guangdong',
    tabLabel: 'Alimentador de eletrônicos',
    highlight: 'Distorção de corrente 20,06% → 2,58% em um alimentador VFD / compressor / bomba',
    image: '/assets/images/solutions-industrial-case-semiconductor.webp',
    industry: 'Manufatura de Eletrônicos', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/pt/contact',
    site: 'Alimentador TM8 em uma fábrica de manufatura de eletrônicos, alimentando inversores de frequência variável, compressores de ar e bombas de água de resfriamento. O circuito já carregava 390 kvar de compensação de capacitores dentro de um banco instalado de 780 kvar, e operava entre 800 A e 1.000 A com fator de potência de sistema de 0,92.',
    harmonics: [
      'Corrente de operação 800–1.000 A no alimentador TM8',
      'Distorção de corrente 20,06% antes do retrofit',
      'Fator de potência de deslocamento de sistema 0,92',
      '390 kvar de compensação de capacitores no circuito, 780 kvar instalados',
    ],
    overview: 'Alimentador TM8 alimenta VFDs, compressores de ar e bombas de água de resfriamento, com 390 kvar de compensação de capacitores no circuito (780 kvar instalados). Corrente de operação 800–1.000 A, fator de potência de deslocamento de sistema 0,92 antes do retrofit.',
    limitations: 'Os resultados são relatados apenas para o alimentador TM8. Outros alimentadores da mesma planta não fizeram parte deste contrato e não são cobertos pelos números.',
    trend: 'Distorção 20,06% → 2,58%',
    solution: [{ product: 'AHF-550A', qty: 1, use: 'Compensação harmônica no alimentador TM8' }],
    results: [
      'Distorção de corrente 20,06% → 2,58%',
      'Amplificação harmônica e ressonância de sistema evitadas',
      'Aprovado em teste conforme GB/T 14549',
    ],
  },
  {
    title: 'Mitigação Harmônica Centralizada em Cinco Transformadores de 2.000 kVA — Fabricante de Componentes Ópticos, Dongguan',
    tabLabel: 'Óptica, 5 transformadores',
    highlight: 'Corrente harmônica 146,22 A → 30,96 A (TR4) e 124,71 A → 43,99 A (TR5)',
    image: '/assets/images/solutions-industrial-case-petrochemical.webp',
    industry: 'Manufatura de Óptica de Precisão', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/pt/contact',
    site: 'Um quadro BT de piso térreo com cinco transformadores de 2.000 kVA a cerca de 90% de carga, cada um alimentando inversores de frequência variável, máquinas de produção óptica e motores, com três gabinetes capacitor-reator totalizando 720 kvar.',
    harmonics: [
      'Corrente harmônica TR4 146,22 A, Ithd 5,39%',
      'Corrente harmônica TR5 124,71 A, Ithd 4,68%',
      'TR4 3ª / 5ª / 7ª harmônica: 122,52 / 70,45 / 22,54 A',
      'TR5 3ª / 5ª / 7ª harmônica: 100,04 / 59,97 / 33,84 A',
      'Limites GB/T 14549 para essas ordens: 62 / 62 / 44 A',
    ],
    overview: 'Quadro BT de piso térreo com 5 × 2.000 kVA transformadores, cada um pareado com um gabinete de filtro ativo de 500 A. A carga é VFDs, máquinas de produção óptica e motores, com três gabinetes capacitor-reator totalizando 720 kvar. Medido a fator de carga 90%.',
    limitations: 'Os resultados publicados cobrem os transformadores TR4 e TR5 apenas; os três transformadores restantes não são relatados aqui. A disponibilidade de módulos de filtro durante a janela de relatório está fora do escopo desta escrita.',
    trend: 'TR4 146,22 A → 30,96 A  ·  TR5 124,71 A → 43,99 A',
    solution: [{ product: 'AHF-500A', qty: 5, use: 'Um gabinete por transformador de 2.000 kVA no quadro BT' }],
    results: [
      'Distorção TR4 5,39% → 1,38%, TR5 4,68% → 1,67%',
      '3ª harmônica TR4 122,52 A → 12,69 A, TR5 100,04 A → 17,89 A',
      'Toda ordem monitorada dentro dos limites GB/T 14549 (62 / 62 / 44 A para 3ª / 5ª / 7ª)',
      'Aprovado em teste — resultado descrito como ideal no relatório de comissionamento',
    ],
  },
  {
    title: 'Controle Harmônico Livre de Ressonância em um Forno de Fusão por Indução',
    tabLabel: 'Forno de indução',
    highlight: 'Ressonância de partida, entalhes de tensão de rede e transtorno de comutação — os três resolvidos',
    image: '/assets/images/solutions-industrial-case-welding.webp',
    industry: 'Metais e Aquecimento por Indução', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/pt/contact',
    site: 'Uma fundição de metal operando um forno de indução. A forma de onda de corrente é próxima de uma onda quadrada, então o conteúdo harmônico é alto; entalhes repetidos de tensão de rede na partida estressam qualquer filtro ativo no alimentador.',
    overview: 'Fornos de indução são uma carga difícil para qualquer filtro ativo. A forma de onda de corrente é próxima de uma onda quadrada, então o conteúdo harmônico é alto e a ressonância vem facilmente. Entalhes repetidos de tensão de rede na partida estressam o filtro. E na energização o indutor de saída ressoa com o capacitor do filtro, disparando a proteção de corrente de saída — que por sua vez perturba a comutação do forno.',
    limitations: 'Nenhum número medido antes e depois é publicado para este projeto, então a entrada descreve o problema de engenharia e o remédio em vez de uma tabela de resultados. Trate como uma nota de capacidade, não como uma afirmação de desempenho.',
    trend: '',
    note: 'Valores medidos antes/depois não são publicados para este projeto. O que segue é o problema de engenharia e como foi resolvido.',
    solution: [{ product: 'AHF', qty: 1, use: 'Alimentador do forno, com parâmetros de indutor e capacitor de saída revisados' }],
    results: [
      'Indutor de saída e capacitor do filtro re-parametrizados para quebrar a ressonância de energização',
      'Alarmes de corrente de saída de partida e degrau de carga removidos por atualização de software de controle',
      'Comutação do forno restaurada à operação normal',
      'Distorção trazida dentro do requisito da rede nacional sem disparar ressonância',
    ],
  },
];

// ===================== RAIL DATA =====================
export const railPainPoints = [
  {
    id: 'metro', label: 'Metrô e LRT', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Metrô e Veículo Leve sobre Trilhos', sceneSubtitle: 'Tração / Estação / Depósito',
    cards: [
      { icon: 'train-front', title: 'Retificador de Tração', desc: 'Injeção harmônica de retificador de 24 pulsos', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'Penalidade de Rede', sub: 'Harmônicos característicos de 24 pulsos (23ª/25ª), violação IEEE 519 do PCC, sobretaxa da concessionária' }, { title: 'Falha de Capacitor', sub: 'Amplificação harmônica em banco PFC, capacitor pode romper, risco de incêndio em subestação subterrânea' }] },
      { icon: 'building', title: 'M&E de Estação', desc: 'Desbalanceamento de banco de equipamentos', metric: '>10%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Superaquecimento do Neutro', sub: 'Mistura de carga monofásica de elevador + HVAC, corrente da linha N excede a de fase, risco de fusão de isolamento' }, { title: 'Disparo de Disjuntor', sub: 'Sobrecarga por fase apesar de média < classificação, indisponibilidade de iluminação da estação, risco à segurança de passageiros' }] },
      { icon: 'battery-charging', title: 'Frenagem Regenerativa', desc: 'Elevação de tensão por retroalimentação de energia', metric: 'Voltage', metricLabel: 'Elevação', consequences: [{ title: 'OV de Inversor', sub: 'Retroalimentação de energia regenerativa, sobretensão do link DC, desligamento de proteção IGBT do inversor' }, { title: 'Disparo de Proteção', sub: 'Disparo em cascata de proteção OV, atraso de trem > 5min, penalidade de SLA de serviço' }] },
    ],
  },
  {
    id: 'hsr', label: 'Ferrovia de Alta Velocidade', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Ferrovia de Alta Velocidade', sceneSubtitle: 'Subestação de Tração / AT / Seção',
    cards: [
      { icon: 'gauge', title: 'Monofásico 27,5kV', desc: 'Sequência negativa de conexão V/V', metric: '>8%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Violação de Rede', sub: 'Carga de tração monofásica causa sequência negativa no PCC 220kV, ordem de curtimento da concessionária' }, { title: 'Aquecimento de Gerador', sub: 'Corrente de sequência negativa em geradores de usina térmica vizinha, alarme de temperatura de superfície do rotor' }] },
      { icon: 'zap', title: 'Conversor EMU', desc: 'Harmônico de banda larga de conversor 4Q', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Aquecimento de Fio de Contato', sub: 'Corrente harmônica de alta frequência aumenta perda I²R do fio de contato, recozimento acelerado, aumento de catenária' }, { title: 'Interferência de Sinalização', sub: 'EMI harmônico acopla ao circuito de trilho, distorção de sinal de cabo, degradação de disponibilidade ETCS' }] },
      { icon: 'cable', title: 'Linha de Alimentação', desc: 'Perda de tensão ao longo de alimentação AT de longa distância', metric: '>10%', metricLabel: 'Queda', consequences: [{ title: 'Limite de Velocidade', sub: 'Tensão final abaixo de 22,5kV limita potência do trem, restrição de velocidade imposta, atraso de cronograma' }, { title: 'Saturação AT', sub: 'Sobretensão na extremidade de envio causa saturação de núcleo do autotransformador, geração harmônica' }] },
    ],
  },
  {
    id: 'ev', label: 'Recarga de VE', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Infraestrutura de Recarga de VE', sceneSubtitle: 'Rodovia / Rápida Urbana / Depósito de Ônibus',
    cards: [
      { icon: 'plug-zap', title: 'Carregador Rápido', desc: 'Impacto de potência de recarga rápida DC', metric: '120kW+', metricLabel: 'Degrau de Carga', consequences: [{ title: 'Queda de Rede', sub: 'Partida simultânea de múltiplos carregadores, queda de tensão de 15%+, disparo de proteção do transformador de distribuição' }, { title: 'Taxa de Demanda', sub: 'Pico de demanda dispara catraca de demanda da concessionária, taxa de capacidade mensal 3x a base' }] },
      { icon: 'radio', title: 'Harmônicos de Carregador', desc: 'Empilhamento harmônico de carregadores de 12 pulsos', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'Penalidade de PF', sub: 'Harmônico + reativo combinam, PF < 0,85 no PCC, penalidade mensal + sobretaxa de imposto de carbono' }, { title: 'Problema de EMI', sub: 'EMI conduzida para a rede BT, interferência de TV/rádio residencial vizinha, surto de volume de reclamações' }] },
      { icon: 'wrench', title: 'Trafo de Distribuição', desc: 'Sobrecarga e desbalanceamento na estação de recarga', metric: '>90%', metricLabel: 'Carga', consequences: [{ title: 'Vida Reduzida', sub: 'Estresse térmico cíclico de carga de pico, envelhecimento de isolamento 5x mais rápido, vida esperada < 3 anos' }, { title: 'Trifásico Irregular', sub: 'Carregadores AC monofásicos dominam, corrente de seq zero > 40%, substituição da linha N a cada 2 anos' }] },
    ],
  },
];
export const railTopology = [
  {
    id: 'metro', sceneName: 'Topologia de Metrô', sceneSubtitle: 'Tração / Estação / Depósito',
    deviceLabel: 'SVG + AHF', deviceType: 'Sistema Combinado',
    deviceDesc: 'SVG no anel 35kV + AHF na subestação de tração retificador 750V/1500V, estação/depósito marcados',
    branches: [
      { label: 'Sub. de Tração', sub: 'Carga Retificadora' },
      { label: 'Dist. de Estação', sub: 'Carga M&E' },
      { label: 'Energia de Depósito', sub: 'Carga Auxiliar' },
    ],
  },
  {
    id: 'hsr', sceneName: 'Topologia de Ferrovia de Alta Velocidade', sceneSubtitle: 'Subestação de Tração / AT / Seção',
    deviceLabel: 'SVG-27.5kV + AHF-200A', deviceType: 'Sistema de Tração',
    deviceDesc: 'SVG-27,5kV no barramento de tração + AHF no alimentador 10kV, seção AT / fio de contato marcados',
    branches: [
      { label: 'Fio de Contato', sub: 'Carga Monofásica' },
      { label: 'Linha de Alimentação', sub: 'Fonte Harmônica' },
      { label: 'Energia de Estação', sub: 'Carga Composta' },
    ],
  },
  {
    id: 'ev', sceneName: 'Topologia de Recarga de VE', sceneSubtitle: 'Rodovia / Rápida Urbana / Depósito de Ônibus',
    deviceLabel: 'SVG + AHF-150A', deviceType: 'Sistema de Recarga',
    deviceDesc: 'SVG na estação de recarga 10kV + AHF no lado AC do carregador rápido DC, banco transformador/carregador marcado',
    branches: [
      { label: 'Dist. 10kV', sub: 'Alimentação de Estação' },
      { label: 'Carregador Rápido', sub: 'Carga de Surtida' },
      { label: 'Carregador de Ônibus', sub: 'Carga em Lote' },
    ],
  },
];
export const railCases = [
  {
    title: 'Correção de Fator de Potência em um Site de Recarga de VE — SVG de 100 kvar em Cada Transformador',
    tabLabel: 'Site de recarga VE',
    highlight: 'Fator de potência mantido na meta em standby e em recarga; payback em dois anos',
    image: '/assets/images/solutions-rail-case-charging.webp',
    industry: 'Recarga de VE', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/pt/contact',
    site: 'Um site de recarga em dois transformadores, 2.500 kVA e 2.000 kVA. Medido no painel de entrada BT, o site ficava em fator de potência capacitivo 0,1–0,2, porque os carregadores retiram quase nenhuma potência ativa em standby enquanto seus retificadores continuam a trocar potência reativa.',
    overview: 'Site de recarga em dois transformadores (2.500 kVA e 2.000 kVA). Medido no painel de entrada BT, o site operava em fator de potência capacitivo 0,1–0,2 porque os carregadores retiram quase nenhuma potência ativa em standby enquanto seus retificadores ainda trocam potência reativa — um banco de capacitores convencional não consegue acompanhar. Um gabinete de capacitor existente foi esvaziado e reutilizado para abrigar os módulos SVG.',
    limitations: 'A figura de economia decorre da própria tarifa e perfil de carga do site e não é transferível para outro site. Precisão de TC de classe 0,2 ou melhor é um pré-requisito, não uma opção.',
    trend: 'Fator de potência 0,1–0,2 capacitivo → valor alvo mantido em standby e sob carga',
    solution: [{ product: 'SVG-100kvar', qty: 2, use: 'Um por transformador; modo reativo constante carrega a condição de standby' }],
    results: [
      'Fator de potência na meta em ambos os estados, standby e recarga',
      'Cerca de 76.000 CNY economizados por ano nos dois transformadores',
      'Perdas de linha reduzidas e tensão no final da linha melhorada',
      'Payback em dois anos; gabinete de capacitor existente reutilizado em vez de um novo',
      'Requer TC de classe 0,2 ou melhor — corrente de standby é muito baixa',
    ],
  },
  {
    title: 'Configuração Típica — Metrô e Veículo Leve sobre Trilhos',
    tabLabel: 'Metrô e VLT',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-rail-case-metro.webp',
    industry: 'Configuração Típica · Metrô e VLT', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma rede de metrô ou VLT: SVG no barramento de anel para suporte reativo e de tensão, AHF na subestação de tração retificadora.',
    overview: 'Para redes de metrô e VLT, o arranjo usual é um SVG no barramento de anel mais AHF na subestação de tração retificadora. Harmônicos característicos do retificador e a elevação de tensão da frenagem regenerativa são as duas coisas que devem ser medidas antes de dimensionar qualquer coisa.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG-300A', qty: 3, use: 'Compensação reativa de barramento de anel' }, { product: 'AHF-200A', qty: 6, use: 'Filtragem harmônica de subestação de tração' }],
    results: [
      'Espectro harmônico do retificador medido na subestação antes do dimensionamento',
      'Elevação de tensão regenerativa verificada contra limites do link DC do inversor',
      'Solicite-nos projetos de referência em metrô e VLT',
    ],
  },
  {
    title: 'Configuração Típica — Tração de Ferrovia de Alta Velocidade',
    tabLabel: 'Ferrovia de alta velocidade',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-rail-case-hsr.webp',
    industry: 'Configuração Típica · Ferrovia de Alta Velocidade', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma subestação de tração 27,5 kV, onde a carga monofásica produz corrente de sequência negativa e a alimentação AT sofre queda de tensão no final da linha.',
    overview: 'Para subestações de tração conectadas V/V alimentando catenária monofásica, o arranjo usual é um SVG no barramento de tração mais AHF no alimentador da estação. A sequência negativa no PCC a montante é a restrição vinculante, então ela dirige a classificação — não o nível harmônico isoladamente.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG-27.5kV', qty: 2, use: 'Reativo e balanceamento do barramento de tração' }, { product: 'AHF-200A', qty: 2, use: 'Filtragem harmônica do alimentador da estação' }],
    results: [
      'Sequência negativa no PCC a montante medida primeiro — ela define a classificação',
      'Visa limites de desbalanceamento GB/T 15543',
      'Solicite-nos projetos de referência em tração ferroviária',
    ],
  },
];

// ===================== RENEWABLE DATA =====================
export const rePainPoints = [
  {
    id: 'solar', label: 'PV Solar', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Usina Fotovoltaica', sceneSubtitle: 'Utilidade / Distribuída / Agri-PV',
    cards: [
      { icon: 'sun', title: 'Harmônicos de Inversor', desc: 'Oscilação de banda larga de multi-inversor', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Risco de Ressonância', sub: 'Ressonância de filtro LCL + impedância de rede, oscilação de banda larga, disparo em cascata de inversor' }, { title: 'Violação de Rede', sub: 'Emissão harmônica excede GB/T 14549 no PCC, ordem de curtimento da empresa de rede' }] },
      { icon: 'activity', title: 'Tensão de Rede', desc: 'Flutuação de variação de irradiância', metric: 'PF Low', metricLabel: 'Dif. Reativa', consequences: [{ title: 'Penalidade de Despacho', sub: 'Desvio de potência reativa do setpoint de despacho, falha de avaliação AVC, dedução de receita' }, { title: 'Limite de Tensão', sub: 'Efeito borda de nuvem, oscilação de tensão ±10% em < 1min, disparo de proteção de potência reversa' }] },
      { icon: 'battery-charging', title: 'Ondulação DC', desc: 'Reflexão do lado AC de ondulação DC', metric: 'DC Bias', metricLabel: 'Superaquecimento de Trafo', consequences: [{ title: 'Saturação de Núcleo', sub: 'Componente DC causa saturação de núcleo de transformador em meio ciclo, surto de corrente de magnetização, zumbido' }, { title: 'Perda de Eficiência', sub: 'Perda de núcleo excessiva + perda de cobre harmônica, PR (razão de desempenho) cai 2-3 pontos percentuais' }] },
    ],
  },
  {
    id: 'wind', label: 'Parque Eólico', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Parque Eólico', sceneSubtitle: 'Onshore / Offshore / Distribuída',
    cards: [
      { icon: 'wind', title: 'Harmônicos de Conversor', desc: 'Distorção de baixa ordem de conversor de potência total', metric: '>10%', metricLabel: 'THD', consequences: [{ title: 'Rejeição de Rede', sub: 'Harmônicos 5ª/7ª dominantes, falha em teste de interconexão da empresa de rede, custo de atraso de energização' }, { title: 'Ressonância do Coletor', sub: 'Capacitância de cabo 35kV + indutância de transformador, ressonância paralela perto do 7º harmônico' }] },
      { icon: 'trending-up', title: 'Flutuação de Vento', desc: 'Surgimento reativo de rajada/turbulência', metric: 'Reativo', metricLabel: 'Oscilação', consequences: [{ title: 'Penalidade PF', sub: 'Oscilação reativa rápida de rajadas de vento, PF mensal < 0,85, cobrança reativa da concessionária 2x' }, { title: 'Caça AVC', sub: 'Oscilação do sistema AVC perseguindo variação do vento, desgaste excessivo do tap changer, 5x manutenção' }] },
      { icon: 'component', title: 'Transformador de Caixa', desc: 'Desbalanceamento de fase de carga auxiliar', metric: '>5%', metricLabel: 'Desbalanceamento', consequences: [{ title: 'Violação de Limite', sub: 'Desbalanceamento de alimentação auxiliar monofásica, sequência negativa excede limite do código de rede' }, { title: 'Disparo por Superaquecimento', sub: 'Desbalanceamento + harmônico combinados, alarme de temperatura de ponto quente do enrolamento, curtailment forçado' }] },
    ],
  },
  {
    id: 'storage', label: 'Armazenamento de Energia', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Sistema de Armazenamento de Energia', sceneSubtitle: 'Lado da Rede / Lado do Usuário / Lado da Fonte',
    cards: [
      { icon: 'battery-charging', title: 'Carga/Descarga', desc: 'Empilhamento harmônico de multi-PCS', metric: '>6%', metricLabel: 'THD', consequences: [{ title: 'Poluição da Rede', sub: 'Harmônicos entrelaçados de multi-PCS, THD no PCC excede GB/T 34120, aviso da concessionária' }, { title: 'Ondulação da Bateria', sub: 'Corrente de ondulação AC no barramento DC, aceleração de revestimento de lítio, vida de ciclo reduzida 20%' }] },
      { icon: 'arrow-left-right', title: 'Reativo PCS', desc: 'Regulação de atraso em baixa carga', metric: '< 0,9', metricLabel: 'PF', consequences: [{ title: 'Taxa de Penalidade', sub: 'Consumo reativo em modo standby dispara penalidade, cobrança mensal + ratchet de demanda' }, { title: 'Falha de Regulação', sub: 'Setpoint de despacho conjunto AGC/AVC não atendido, qualificação de serviço auxiliar revogada' }] },
      { icon: 'globe', title: 'Ponto de Rede', desc: 'Cintilação de tensão na interconexão', metric: '> 0,8', metricLabel: 'Pst', consequences: [{ title: 'Falha de Interconexão', sub: 'Cintilação Pst > 0,8 durante transição de modo, não conformidade do acordo de interconexão' }, { title: 'Risco de Ilhamento', sub: 'Detecção de distúrbio de rede confundida pela cintilação, ilhamento não intencional, risco de segurança' }] },
    ],
  },
];
export const reTopology = [
  {
    id: 'solar', sceneName: 'Topologia PV Solar', sceneSubtitle: 'Utilidade / Distribuída / Agri-PV',
    deviceLabel: 'SVG+AHF', deviceType: 'Sistema de Qualidade PV',
    deviceDesc: 'SVG no barramento de elevação 35kV + AHF no lado AC do inversor, caixa combinadora marcada',
    branches: [
      { label: 'Caixa Combinadora', sub: 'Coleta DC' },
      { label: 'AC do Inversor', sub: 'Fonte Harmônica' },
      { label: 'Elevação 35kV', sub: 'Interconexão Rede' },
    ],
  },
  {
    id: 'wind', sceneName: 'Topologia Parque Eólico', sceneSubtitle: 'Onshore / Offshore / Distribuída',
    deviceLabel: 'SVG-690V + AHF-100A', deviceType: 'Sistema de Qualidade Eólica',
    deviceDesc: 'SVG-690V no lado da turbina + AHF no BT do transformador de caixa, linha coletora 35kV marcada',
    branches: [
      { label: 'Conv. Turbina', sub: 'Fonte Harmônica' },
      { label: 'Transform. Caixa', sub: 'Carga Desbalanceada' },
      { label: 'Coletora 35kV', sub: 'Conexão Rede' },
    ],
  },
  {
    id: 'storage', sceneName: 'Topologia Armazenamento', sceneSubtitle: 'Lado da Rede / Lado do Usuário / Lado da Fonte',
    deviceLabel: 'Combo AHF+SVG', deviceType: 'Sistema de Qualidade Armazenamento',
    deviceDesc: 'Combo SVG+AHF no lado AC do PCS, cluster de bateria / PCS / transformador / ponto de rede marcados',
    branches: [
      { label: 'Cluster Bateria', sub: 'Fonte DC' },
      { label: 'Lado AC PCS', sub: 'Bidirecional' },
      { label: 'Ponto de Rede', sub: 'Interconexão' },
    ],
  },
];
export const reCases = [
  {
    title: 'Configuração Típica — Usina Solar PV',
    tabLabel: 'Usina solar PV',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-renewable-case-solar.webp',
    industry: 'Configuração Típica · Solar PV', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma usina PV de escala utilitária ou distribuída: SVG no barramento de elevação, AHF nos alimentadores AC do inversor.',
    overview: 'Para PV de escala utilitária e distribuída, o arranjo usual é um SVG no barramento de elevação mais AHF nos alimentadores AC do inversor. Ressonância multi-inversor e oscilações reativas de borda de nuvem são os dois modos de falha — ambos exigem uma campanha de medição antes de fixar as classificações.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG', qty: 2, use: 'Suporte reativo do barramento de elevação' }, { product: 'AHF-200A', qty: 4, use: 'Filtragem harmônica do alimentador AC do inversor' }],
    results: [
      'Varredura de ressonância em toda a rede coletora antes do dimensionamento',
      'Envelope reativo verificado contra o setpoint de despacho AVC',
      'Solicite-nos projetos de referência em solar PV',
    ],
  },
  {
    title: 'Configuração Típica — Parque Eólico',
    tabLabel: 'Parque eólico',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-renewable-case-wind.webp',
    industry: 'Configuração Típica · Parque Eólico', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para um parque eólico onshore ou offshore, onde conversores de potência total e capacitância de cabo coletor interagem perto do 7º harmônico.',
    overview: 'Para turbinas de conversor de potência total, o arranjo usual é um SVG no barramento coletor mais AHF nos alimentadores coletores. A capacitância de cabo contra a indutância do transformador geralmente coloca um ponto de ressonância paralela perto do 7º harmônico, então o sistema coletor é modelado antes de qualquer pedido.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG-690V', qty: 2, use: 'Suporte reativo do barramento coletor' }, { product: 'AHF-100A', qty: 2, use: 'Filtragem harmônica do alimentador coletor' }],
    results: [
      'Ponto de ressonância coletora modelado contra a capacitância de cabo',
      'Oscilação reativa por rajada medida ao longo de uma estação completa se possível',
      'Solicite-nos projetos de referência em eólica',
    ],
  },
  {
    title: 'Configuração Típica — Armazenamento de Bateria',
    tabLabel: 'Armazenamento bateria',
    highlight: 'Configuração ilustrativa — o dimensionamento começa a partir de um levantamento de qualidade de energia do site',
    image: '/assets/images/solutions-renewable-case-storage.webp',
    industry: 'Configuração Típica · Armazenamento de Energia', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/pt/contact',
    site: 'Um arranjo ilustrativo para uma instalação de bateria do lado da rede, do usuário ou da fonte, onde unidades PCS entrelaçam harmônicos e o modo standby reduz o fator de potência.',
    overview: 'Para armazenamento do lado da rede e do usuário, o arranjo usual é uma combinação SVG + AHF no barramento AC do PCS. As transições de carga/descarga são o caso de estresse: entrelaçamento harmônico multi-PCS mais um degrau de cintilação na mudança de modo, ambos medidos no ponto de acoplamento comum.',
    trend: '',
    note: 'Configuração ilustrativa — não é um projeto entregue específico. Projetos de referência neste setor estão disponíveis mediante solicitação.',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'Condicionamento de qualidade de energia do barramento AC do PCS' }, { product: 'PQ Gateway', qty: 1, use: 'Monitoramento de conformidade de rede' }],
    results: [
      'Transição carga/descarga medida, não assumida',
      'Cintilação no ponto de interconexão verificada contra o acordo de rede',
      'Solicite-nos projetos de referência em armazenamento de energia',
    ],
  },
];

// ===================== DATA MAP =====================
export const dataMap = {
  commercial: { painPoints: painPointScenes, topology: topologyScenes, cases: cases },
  grid:       { painPoints: gridPainPoints, topology: gridTopology, cases: gridCases },
  datacenter: { painPoints: dcPainPoints, topology: dcTopology, cases: dcCases },
  industry:   { painPoints: indPainPoints, topology: indTopology, cases: indCases },
  rail:       { painPoints: railPainPoints, topology: railTopology, cases: railCases },
  renewable:  { painPoints: rePainPoints, topology: reTopology, cases: reCases },
};
export const industryTitles = {
  commercial: 'Estudos de Caso de Edifícios Comerciais e Médicos',
  grid: 'Estudos de Caso de Rede Elétrica',
  datacenter: 'Estudos de Caso de Data Center',
  industry: 'Estudos de Caso de Manufatura Industrial',
  renewable: 'Estudos de Caso de Energia Renovável',
  rail: 'Estudos de Caso de Trânsito Ferroviário',
};
export const heroImages = {
  commercial: '/assets/images/solutions-commercial-medical-hero-bg.webp',
  grid: '/assets/images/solutions-grid-hero-bg.webp',
  datacenter: '/assets/images/solutions-datacenter-hero-bg.webp',
  industry: '/assets/images/solutions-industrial-hero-bg.webp',
  renewable: '/assets/images/solutions-renewable-hero-bg.webp',
  rail: '/assets/images/solutions-rail-hero-bg.webp',
};