// Per-industry SEO metadata for the Portuguese solutions sub-pages.
// Hand-maintained. `id` must match a key in ptSolutions.js -> dataMap.
// No customer names, no unsourced numbers: every claim here is either general
// engineering fact or covered by a case that is actually published on the page.

export const solutionMeta = [
  {
    id: 'industry',
    slug: 'industrial',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Indústria',
    h1: 'Soluções de Qualidade de Energia para a Indústria de Manufatura',
    answer:
      'A CHITEK condiciona problemas harmônicos e reativos em alimentadores de plantas industriais usando filtros ativos de harmônicos (AHF) e geradores estáticos de var (SVG). Os gatilhos habituais são bancos de VFD, equipamentos de soldagem e fornos de indução. O dimensionamento segue um espectro harmônico medido no ponto de acoplamento comum, não apenas a classificação do transformador.',
    title: 'Soluções de Qualidade de Energia para a Indústria de Manufatura | CHITEK',
    description:
      'Filtragem de harmônicos e compensação reativa para oficinas de soldagem, fornos de indução, linhas CNC, bancos de VFD e alimentadores de compressores em plantas industriais.',
    card: {
      lead:
        'Filtragem de harmônicos e compensação reativa para',
      equipment: [
        'oficinas de soldagem',
        'fornos de indução',
        'linhas CNC e de servomotores',
        'bancos de VFD',
        'alimentadores de compressores e bombas',
        'retificadores de galvanoplastia',
        'acionamentos de laminadores',
      ],
    },
    intro:
      'Bancos de soldagem, fornos de indução, acionamentos servo CNC e grandes instalações de VFD injetam corrente harmônica de volta no alimentador da planta. O resultado é superaquecimento do transformador, falhas recorrentes de capacitores e equipamentos de processo instáveis. Os filtros ativos de harmônicos (AHF) e geradores estáticos de var (SVG) da CHITEK são instalados no transformador ou no alimentador para trazer a distorção de volta dentro dos limites da planta.',
    comparison: {
      heading: 'AHF ou SVG em uma planta de manufatura?',
      intro:
        'A maioria dos sites industriais começa identificando qual dos dois problemas é dominante. Distorção e demanda reativa são medidas separadamente no levantamento, e qualquer uma pode ser a restrição vinculante.',
      rows: [
        {
          aspect: 'O que faz',
          ahf: 'Injeta uma corrente de compensação que cancela a corrente harmônica desenhada por cargas não lineares.',
          svg: 'Fornece ou absorve potência reativa continuamente para manter o fator de potência e suportar a tensão.',
        },
        {
          aspect: 'Alvo principal',
          ahf: 'Distorção de corrente (THDi) e espectro harmônico no ponto de acoplamento comum.',
          svg: 'Fator de potência, flutuação de tensão e demanda reativa ao longo do ciclo de carga.',
        },
        {
          aspect: 'Gatilho típico',
          ahf: 'Bancos de VFD, retificadores, conjuntos de soldagem, fornos de indução, drivers LED, retificadores de UPS.',
          svg: 'Fator de potência baixo ou oscilante, queda e elevação de tensão, alimentadores fracos ou longos, degraus de carga de VE.',
        },
        {
          aspect: 'Comportamento em carga leve',
          ahf: 'A compensação escala com a corrente harmônica medida, então a saída cai conforme a carga cai.',
          svg: 'Mantém a saída conforme necessário para atingir o fator de potência alvo mesmo com carga ativa quase zero.',
        },
        {
          aspect: 'Uso neste setor',
          ahf: 'Correção harmônica no nível do alimentador no transformador ou na entrada principal alimentando cargas de VFD e forno.',
          svg: 'Suporte reativo onde há penalidades de fator de potência ou onde a comutação de fornos causa flutuação de tensão.',
        },
      ],
      note: 'As classificações são definidas a partir do levantamento. Onde uma planta opera tanto bancos de VFD quanto fornos, os dois dispositivos são normalmente combinados em vez de dimensionados como alternativas.',
    },
    faq: [
      {
        q: 'O que causa harmônicos em uma planta de manufatura?',
        a: 'Cargas não lineares: retificadores em VFDs e servomotores, soldadores de arco, fornos de fusão por indução e fontes de alimentação de corrente contínua. Elas retiram corrente em pulsos curtos em vez de como uma onda senoidal, e esses pulsos aparecem como corrente harmônica no alimentador.',
      },
      {
        q: 'Um filtro ativo de harmônicos pode operar junto com um banco de capacitores existente?',
        a: 'Sim, mas onde os TC do filtro amostram importa. Se os TC estão no lado da rede e o ponto de conexão fica a jusante de um banco puramente capacitivo, o filtro pode excitar ressonância LC. Use ordens de filtragem seletiva com controle antirressonância, ou mova a amostragem dos TC para o lado da carga.',
      },
      {
        q: 'Preciso de um AHF, um SVG ou ambos?',
        a: 'Um AHF cancela corrente harmônica. Um SVG fornece ou absorve potência reativa e mantém o fator de potência. Se o problema é distorção, comece com AHF. Se é fator de potência baixo ou flutuação de tensão, comece com SVG. Plantas que operam tanto bancos de VFD quanto fornos frequentemente precisam de ambos.',
      },
      {
        q: 'Como a capacidade do filtro é dimensionada?',
        a: 'A partir de um levantamento de qualidade de energia no ponto de acoplamento comum: meça o espectro harmônico, o perfil reativo e o ciclo de carga. Dimensionar a partir do kVA do transformador isoladamente é o motivo mais comum de uma instalação ficar subdimensionada.',
      },
    ],
  },
  {
    id: 'commercial',
    slug: 'commercial',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Comercial e Hospitalar',
    h1: 'Soluções de Qualidade de Energia para Edifícios Comerciais e Hospitalares',
    answer:
      'A CHITEK faz retrofit de AHF e SVG em quadros de distribuição comerciais e hospitalares existentes para reduzir a distorção harmônica, a corrente de neutro e a ressonância de capacitores. As fontes típicas são drivers LED monofásicos, elevadores e equipamentos de imagem. Na maioria dos casos, o banco de capacitores existente permanece em operação, com controle antirressonância e ordens de filtragem seletiva mantendo a instalação estável.',
    title: 'Soluções de Qualidade de Energia para Edifícios Comerciais e Hospitalares | CHITEK',
    description:
      'Retrofit de AHF e SVG em shoppings, hospitais, laboratórios e escritórios para reduzir a sobrecarga harmônica de LED, a corrente de neutro e a ressonância de capacitores.',
    card: {
      lead:
        'Retrofit de AHF e SVG em quadros existentes em',
      equipment: [
        'centros comerciais',
        'hospitais e clínicas',
        'laboratórios',
        'escritórios com iluminação LED',
        'hotéis',
        'terminais de transporte',
      ],
    },
    intro:
      'Iluminação LED, elevadores, chillers e equipamentos de imagem lotam os edifícios comerciais e hospitalares modernos. Drivers LED monofásicos adicionam corrente harmônica de terceira ordem ao condutor neutro, enquanto bancos de capacitores instalados para correção de fator de potência podem ressoar com o transformador. A CHITEK faz retrofit de AHF em quadros existentes sem substituir o equipamento de compensação.',
    comparison: {
      heading: 'AHF ou SVG em um edifício comercial?',
      intro:
        'A divisão geralmente segue o sintoma dominante: neutros superaquecidos e distorção de LED apontam para AHF, enquanto a demanda reativa de chillers e as surtidas de elevadores apontam para SVG.',
      rows: [
        {
          aspect: 'O que faz',
          ahf: 'Injeta uma corrente de compensação que cancela a corrente harmônica desenhada por cargas não lineares.',
          svg: 'Fornece ou absorve potência reativa continuamente para manter o fator de potência e suportar a tensão.',
        },
        {
          aspect: 'Alvo principal',
          ahf: 'Distorção de corrente (THDi) e espectro harmônico no ponto de acoplamento comum.',
          svg: 'Fator de potência, flutuação de tensão e demanda reativa ao longo do ciclo de carga.',
        },
        {
          aspect: 'Gatilho típico',
          ahf: 'Bancos de VFD, retificadores, conjuntos de soldagem, fornos de indução, drivers LED, retificadores de UPS.',
          svg: 'Fator de potência baixo ou oscilante, queda e elevação de tensão, alimentadores fracos ou longos, degraus de carga de VE.',
        },
        {
          aspect: 'Comportamento em carga leve',
          ahf: 'A compensação escala com a corrente harmônica medida, então a saída cai conforme a carga cai.',
          svg: 'Mantém a saída conforme necessário para atingir o fator de potência alvo mesmo com carga ativa quase zero.',
        },
        {
          aspect: 'Uso neste setor',
          ahf: 'Correção de neutro e harmônicos em pavimentos dominados por iluminação LED e cargas eletrônicas monofásicas.',
          svg: 'Suporte reativo para bancos de chiller e HVAC onde a correção de fator de potência já é penalizada, ou para substituir um banco de capacitores em ressonância.',
        },
      ],
      note: 'Onde um banco de capacitores já está instalado, o levantamento deve confirmar se ele pode permanecer em operação. Controle antirressonância e posicionamento de TC decidem isso, não o tipo de dispositivo isoladamente.',
    },
    faq: [
      {
        q: 'Por que o condutor neutro superaquece em um edifício repleto de iluminação LED?',
        a: 'Drivers LED monofásicos retiram uma corrente não senoidal rica em terceiro harmônico. Correntes de terceiro harmônico não se cancelam no neutro, elas se somam. Em um pavimento fortemente iluminado, o neutro pode acabar carregando mais corrente que um condutor de fase.',
      },
      {
        q: 'Podemos manter nosso banco de capacitores existente?',
        a: 'Geralmente sim. O risco é a ressonância paralela entre o banco de capacitores e a indutância do transformador, que amplifica harmônicos em vez de removê-los. Controle antirressonância e ordens de filtragem seletiva permitem que o AHF opere com o banco ainda em operação.',
      },
      {
        q: 'Um hospital precisa de uma abordagem diferente de um edifício corporativo?',
        a: 'As fontes harmônicas diferem, e as consequências também. Equipamentos de imagem e cargas cirúrgicas são sensíveis a queda de tensão e desbalanceamento de fases, então o levantamento tem de cobrir profundidade de queda e desbalanceamento, não apenas distorção de corrente. O hardware de filtragem é a mesma família de produtos.',
      },
      {
        q: 'O retrofit exigirá uma interrupção?',
        a: 'O filtro conecta em paralelo no quadro, então a maioria dos retrofits é realizada no quadro existente. A janela de indisponibilidade é definida pelo seu procedimento de isolamento e permissão do local, não pelo equipamento em si.',
      },
    ],
  },
  {
    id: 'datacenter',
    slug: 'data-center',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Centro de Dados',
    h1: 'Soluções de Qualidade de Energia para Centros de Dados',
    answer:
      'A CHITEK mitiga harmônicos de entrada de UPS, desbalanceamento de fases e oscilação reativa em centros de dados usando AHF no alimentador da UPS e SVG no barramento mecânico. A corrente harmônica eleva a temperatura do transformador e pode circular entre unidades UPS paralelas; o desbalanceamento carrega o neutro. Ambos são medidos em um único levantamento no ponto de acoplamento comum antes do dimensionamento.',
    title: 'Soluções de Qualidade de Energia para Centros de Dados | CHITEK',
    description:
      'Mitigação de harmônicos de UPS, balanceamento de fases e suporte reativo para salas de colocalização, data centers corporativos e nós de borda.',
    card: {
      lead:
        'Harmônicos de entrada de UPS, desbalanceamento de fases e suporte reativo para',
      equipment: [
        'salas de colocalização',
        'data centers corporativos',
        'sites financeiros e bancários',
        'nós de borda e remotos',
        'sites de recuperação de desastres',
      ],
    },
    intro:
      'Retificadores de UPS, cargas de TI monofásicas e resfriamento acionado por VFD ficam todos no mesmo alimentador. A corrente harmônica eleva a temperatura do transformador, o desbalanceamento de fases carrega o neutro, e a oscilação reativa dos chillers puxa o fator de potência para baixo em carga parcial. A CHITEK condiciona o alimentador a montante da UPS e no barramento mecânico.',
    comparison: {
      heading: 'AHF ou SVG em um centro de dados?',
      intro:
        'Os centros de dados geralmente separam os dois barramentos: o alimentador de UPS é um problema harmônico, o barramento mecânico é um problema reativo. Eles são medidos e dimensionados de forma independente.',
      rows: [
        {
          aspect: 'O que faz',
          ahf: 'Injeta uma corrente de compensação que cancela a corrente harmônica desenhada por cargas não lineares.',
          svg: 'Fornece ou absorve potência reativa continuamente para manter o fator de potência e suportar a tensão.',
        },
        {
          aspect: 'Alvo principal',
          ahf: 'Distorção de corrente (THDi) e espectro harmônico no ponto de acoplamento comum.',
          svg: 'Fator de potência, flutuação de tensão e demanda reativa ao longo do ciclo de carga.',
        },
        {
          aspect: 'Gatilho típico',
          ahf: 'Bancos de VFD, retificadores, conjuntos de soldagem, fornos de indução, drivers LED, retificadores de UPS.',
          svg: 'Fator de potência baixo ou oscilante, queda e elevação de tensão, alimentadores fracos ou longos, degraus de carga de VE.',
        },
        {
          aspect: 'Comportamento em carga leve',
          ahf: 'A compensação escala com a corrente harmônica medida, então a saída cai conforme a carga cai.',
          svg: 'Mantém a saída conforme necessário para atingir o fator de potência alvo mesmo com carga ativa quase zero.',
        },
        {
          aspect: 'Uso neste setor',
          ahf: 'Correção harmônica no alimentador de entrada da UPS, onde harmônicos de retificador circulam entre unidades paralelas.',
          svg: 'Suporte reativo e de tensão no barramento de chiller e CRAC, onde a partida de VFD e a operação em carga parcial movem o fator de potência.',
        },
      ],
      note: 'Instalar um filtro a jusante da saída da UPS geralmente é desnecessário, porque a UPS já condiciona sua própria saída.',
    },
    faq: [
      {
        q: 'Onde um AHF deve ser instalado em um centro de dados?',
        a: 'No alimentador a montante da UPS, ou no barramento mecânico alimentando chillers e unidades CRAC. Instalar a jusante da saída da UPS é possível, mas geralmente desnecessário, porque a UPS já condiciona sua própria saída.',
      },
      {
        q: 'A filtragem harmônica melhora o PUE?',
        a: 'Indiretamente. A corrente harmônica causa perda extra em transformadores e cabos e pode forçar um transformador a operar mais quente do que projetado, então remover essa corrente reduz essas perdas. O PUE depende de todo o projeto mecânico e elétrico, então o efeito tem de ser medido em vez de presumido.',
      },
      {
        q: 'O desbalanceamento de fases é um problema separado dos harmônicos?',
        a: 'Sim. Cargas de TI monofásicas espalhadas de forma desigual entre as fases criam corrente de sequência negativa e de sequência zero. Harmônicos são um problema de forma de onda, desbalanceamento é um problema de distribuição, e ambos são normalmente medidos no mesmo levantamento.',
      },
      {
        q: 'Sites de borda com pequenos sistemas de UPS podem usar o mesmo equipamento?',
        a: 'Sim, em classificações menores. Nós de borda remotos e rurais frequentemente têm pior qualidade de fornecimento que um data center central, então a etapa de levantamento importa mais lá, não menos.',
      },
    ],
  },
  {
    id: 'renewable',
    slug: 'renewable',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Energia Renovável',
    h1: 'Soluções de Qualidade de Energia para Energia Renovável e Armazenamento',
    answer:
      'A CHITEK controla intercalação harmônica, flicker e oscilação reativa em pontos de interconexão de PV, eólica e armazenamento de baterias usando equipamento combinado de SVG e AHF. Vários inversores comutando em um barramento intercalam suas emissões, e transições de carga e descarga produzem um degrau reativo. A conformidade é avaliada onde a concessionária mede: o ponto de acoplamento comum.',
    title: 'Soluções de Qualidade de Energia para Energia Renovável e Armazenamento | CHITEK',
    description:
      'Qualidade de energia em pontos de interconexão de PV, eólica e armazenamento de baterias: intercalação harmônica, flicker e oscilação reativa no ponto de acoplamento comum.',
    card: {
      lead:
        'Intercalação harmônica, flicker e oscilação reativa em',
      equipment: [
        'usinas fotovoltaicas de grande porte',
        'parques eólicos',
        'armazenamento de energia em baterias (BESS)',
        'PV híbrido com armazenamento',
        'plantas de cogeração CCHP',
        'microrredes',
      ],
    },
    intro:
      'Inversores fotovoltaicos, conversores eólicos de potência total e unidades PCS de bateria comutam todas em alta frequência. Várias unidades em um ponto de interconexão intercalam seus harmônicos, e a transição de carga e descarga produz um degrau reativo e um evento de flicker. A questão de conformidade é o que a concessionária mede no ponto de acoplamento comum.',
    comparison: {
      heading: 'AHF ou SVG em um ponto de interconexão?',
      intro:
        'Em um ponto de interconexão de PV, eólica ou armazenamento, os dois problemas chegam juntos, porque os mesmos inversores produzem tanto harmônicos de comutação quanto oscilação reativa.',
      rows: [
        {
          aspect: 'O que faz',
          ahf: 'Injeta uma corrente de compensação que cancela a corrente harmônica desenhada por cargas não lineares.',
          svg: 'Fornece ou absorve potência reativa continuamente para manter o fator de potência e suportar a tensão.',
        },
        {
          aspect: 'Alvo principal',
          ahf: 'Distorção de corrente (THDi) e espectro harmônico no ponto de acoplamento comum.',
          svg: 'Fator de potência, flutuação de tensão e demanda reativa ao longo do ciclo de carga.',
        },
        {
          aspect: 'Gatilho típico',
          ahf: 'Bancos de VFD, retificadores, conjuntos de soldagem, fornos de indução, drivers LED, retificadores de UPS.',
          svg: 'Fator de potência baixo ou oscilante, queda e elevação de tensão, alimentadores fracos ou longos, degraus de carga de VE.',
        },
        {
          aspect: 'Comportamento em carga leve',
          ahf: 'A compensação escala com a corrente harmônica medida, então a saída cai conforme a carga cai.',
          svg: 'Mantém a saída conforme necessário para atingir o fator de potência alvo mesmo com carga ativa quase zero.',
        },
        {
          aspect: 'Uso neste setor',
          ahf: 'Correção harmônica onde a intercalação multi-inversor ou a interação do filtro LCL empurra a emissão além do limite da rede.',
          svg: 'Suporte reativo e retenção de tensão conforme a irradiância ou o estado de carga mudam, e para evitar fator de potência em avanço em baixa saída.',
        },
      ],
      note: 'A conformidade é avaliada no ponto de acoplamento comum, então o levantamento deve ser feito lá, em vez de nos terminais do inversor.',
    },
    faq: [
      {
        q: 'Quais problemas de qualidade de energia aparecem em um ponto de interconexão de PV ou armazenamento?',
        a: 'Emissões harmônicas de banda larga de muitos inversores comutando juntos, oscilação reativa conforme a irradiância ou o estado de carga muda, e flicker de tensão na interconexão. A interação do filtro LCL multi-inversor também pode produzir ressonância.',
      },
      {
        q: 'Por que o fator de potência cai em baixa saída?',
        a: 'Inversores e unidades PCS são dimensionados para potência ativa. Em baixa saída, sua capacidade reativa é uma fração menor do que a planta precisa, e a capacitância de cabo e transformador pode empurrar o fator de potência medido para avanço ou atraso dependendo da hora.',
      },
      {
        q: 'Um único dispositivo pode tratar tanto harmônicos quanto potência reativa?',
        a: 'Um arranjo combinado de SVG mais AHF é a resposta usual. O SVG mantém fator de potência e tensão, o AHF remove harmônicos de comutação, e as classificações são divididas de acordo com o que o levantamento encontra.',
      },
      {
        q: 'De que depende a conformidade com a rede?',
        a: 'O contrato de conexão e o padrão local, medidos no ponto de acoplamento comum. Limites de emissão, flicker e capacidade reativa são todos avaliados lá, então o levantamento deve ser feito nesse ponto, em vez de nos terminais do inversor.',
      },
    ],
  },
  {
    id: 'rail',
    slug: 'rail-transit',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Ferroviário e Recarga de VE',
    h1: 'Soluções de Qualidade de Energia para Ferroviário e Recarga de VE',
    answer:
      'A CHITEK fornece AHF e SVG para subestações de tração, alimentadores ferroviários e sites de recarga de VE, onde grandes cargas monofásicas e pulsadas injetam harmônicos e corrente de sequência negativa. Retificadores de tração e carregadores rápidos DC também puxam o fator de potência para baixo no pico. As classificações seguem um levantamento de espectro harmônico, desbalanceamento e perfil reativo no ponto de fornecimento.',
    title: 'Soluções de Qualidade de Energia para Ferroviário e Recarga de VE | CHITEK',
    description:
      'Controle de fator de potência e harmônicos para hubs de recarga rápida DC, depósitos de frota, estações de recarga públicas e tração ferroviária, dimensionado a partir de um levantamento medido.',
    card: {
      lead:
        'Controle de fator de potência e harmônicos para',
      equipment: [
        'hubs de recarga rápida DC',
        'depósitos de frota e ônibus',
        'estações de recarga públicas',
        'carregadores no local de trabalho',
        'tração ferroviária',
      ],
    },
    intro:
      'Retificadores de tração, alimentações monofásicas de 27,5 kV e carregadores rápidos DC são todas cargas monofásicas grandes ou pulsadas. Eles injetam harmônicos e corrente de sequência negativa na alimentação e puxam o fator de potência para baixo no pico de recarga. A CHITEK fornece AHF para os alimentadores harmônicos e SVG para suporte reativo no transformador.',
    comparison: {
      heading: 'AHF ou SVG para tração e recarga?',
      intro:
        'Cargas de tração e recarga são pulsadas e frequentemente monofásicas, então desbalanceamento e degrau reativo aparecem junto com a distorção.',
      rows: [
        {
          aspect: 'O que faz',
          ahf: 'Injeta uma corrente de compensação que cancela a corrente harmônica desenhada por cargas não lineares.',
          svg: 'Fornece ou absorve potência reativa continuamente para manter o fator de potência e suportar a tensão.',
        },
        {
          aspect: 'Alvo principal',
          ahf: 'Distorção de corrente (THDi) e espectro harmônico no ponto de acoplamento comum.',
          svg: 'Fator de potência, flutuação de tensão e demanda reativa ao longo do ciclo de carga.',
        },
        {
          aspect: 'Gatilho típico',
          ahf: 'Bancos de VFD, retificadores, conjuntos de soldagem, fornos de indução, drivers LED, retificadores de UPS.',
          svg: 'Fator de potência baixo ou oscilante, queda e elevação de tensão, alimentadores fracos ou longos, degraus de carga de VE.',
        },
        {
          aspect: 'Comportamento em carga leve',
          ahf: 'A compensação escala com a corrente harmônica medida, então a saída cai conforme a carga cai.',
          svg: 'Mantém a saída conforme necessário para atingir o fator de potência alvo mesmo com carga ativa quase zero.',
        },
        {
          aspect: 'Uso neste setor',
          ahf: 'Correção harmônica em alimentadores dominados por retificadores de tração e retificação de carregadores.',
          svg: 'Suporte reativo no transformador, onde os picos de recarga e os estados de standby puxam o fator de potência em direções diferentes.',
        },
      ],
      note: 'Sites de recarga são majoritariamente um problema de SVG; o AHF é adicionado quando os harmônicos dos carregadores também precisam ser mantidos dentro dos limites.',
    },
    faq: [
      {
        q: 'Por que a corrente de sequência negativa é um problema para o fornecimento de tração?',
        a: 'Uma carga de tração monofásica conectada entre duas fases de um sistema trifásico produz corrente de sequência negativa. Isso aquece máquinas trifásicas na mesma rede e pode empurrar o desbalanceamento além do limite da rede.',
      },
      {
        q: 'Sites de recarga de VE precisam de AHF ou SVG?',
        a: 'Majoritariamente SVG. O problema principal em um site de recarga é a demanda reativa e o fator de potência ao longo dos estados de standby e recarga, além do degrau de carga quando vários veículos partem juntos. O AHF é adicionado quando os harmônicos dos carregadores também precisam ser mantidos dentro dos limites.',
      },
      {
        q: 'O freio regenerativo pode elevar a tensão de fornecimento?',
        a: 'Sim. A energia devolvida durante a frenagem eleva a tensão nos lados DC e AC, e os conversores podem desarmar por sobretensão. Tratar isso pertence ao estudo de energia de tração, não a um filtro isolado.',
      },
      {
        q: 'Quanto tempo o investimento leva para se pagar?',
        a: 'Para um site de recarga, o payback é impulsionado principalmente por penalidades de fator de potência evitadas. Depende da tarifa local e do perfil de carga do site, então o número vem da sua tarifa, não de uma ficha de produto.',
      },
    ],
  },
  {
    id: 'grid',
    slug: 'power-grid',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Rede Elétrica',
    h1: 'Soluções de Qualidade de Energia para Transmissão e Distribuição',
    answer:
      'A CHITEK fornece suporte reativo e controle harmônico para redes de concessionária e distribuição usando SVG para tensão e fator de potência, e AHF onde cargas industriais ou de tração injetam harmônicos. Geração distribuída, longos alimentadores e clusters de VE estressam a rede de formas diferentes, então as classificações são definidas a partir de medições no ponto de acoplamento comum.',
    title: 'Soluções de Qualidade de Energia para Rede de Transmissão e Distribuição | CHITEK',
    description:
      'SVG e AHF para subestações de transmissão e distribuição, redes urbanas, longos alimentadores rurais e pontos de conexão de GD, dimensionados a partir de um estudo de rede.',
    card: {
      lead:
        'Controle reativo e harmônico em',
      equipment: [
        'subestações de transmissão e distribuição',
        'redes de distribuição urbanas',
        'longos alimentadores rurais',
        'pontos de conexão de geração distribuída',
        'clusters de recarga de VE',
      ],
    },
    intro:
      'As redes de transmissão e distribuição carregam o efeito combinado de tudo a jusante: harmônicos industriais, desbalanceamento de tração, geração distribuída e perda reativa de linha longa. O arranjo usual da CHITEK é um SVG no barramento para suporte de tensão e reativo, com AHF nos alimentadores que carregam a pior carga harmônica.',
    comparison: {
      heading: 'AHF ou SVG em uma rede de distribuição?',
      intro:
        'Em redes de concessionária e distribuição, os dois dispositivos abordam restrições de rede diferentes, e ambos são normalmente especificados juntos na fase de planejamento.',
      rows: [
        {
          aspect: 'O que faz',
          ahf: 'Injeta uma corrente de compensação que cancela a corrente harmônica desenhada por cargas não lineares.',
          svg: 'Fornece ou absorve potência reativa continuamente para manter o fator de potência e suportar a tensão.',
        },
        {
          aspect: 'Alvo principal',
          ahf: 'Distorção de corrente (THDi) e espectro harmônico no ponto de acoplamento comum.',
          svg: 'Fator de potência, flutuação de tensão e demanda reativa ao longo do ciclo de carga.',
        },
        {
          aspect: 'Gatilho típico',
          ahf: 'Bancos de VFD, retificadores, conjuntos de soldagem, fornos de indução, drivers LED, retificadores de UPS.',
          svg: 'Fator de potência baixo ou oscilante, queda e elevação de tensão, alimentadores fracos ou longos, degraus de carga de VE.',
        },
        {
          aspect: 'Comportamento em carga leve',
          ahf: 'A compensação escala com a corrente harmônica medida, então a saída cai conforme a carga cai.',
          svg: 'Mantém a saída conforme necessário para atingir o fator de potência alvo mesmo com carga ativa quase zero.',
        },
        {
          aspect: 'Uso neste setor',
          ahf: 'Correção harmônica em alimentadores onde cargas industriais ou de tração injetam distorção na rede.',
          svg: 'Suporte reativo e controle de tensão em longos alimentadores, em pontos de conexão de GD e em clusters de recarga de VE.',
        },
      ],
      note: 'Estudos de rede definem as metas; as classificações do equipamento seguem o estudo em vez de um modelo.',
    },
    faq: [
      {
        q: 'Onde SVG e AHF vão em uma subestação?',
        a: 'SVG no barramento para suporte reativo de tensão, AHF nos alimentadores específicos com a maior carga harmônica. Tratar uma estação inteira para harmônicos raramente é econômico.',
      },
      {
        q: 'O que causa o colapso de tensão no final da linha em alimentadores rurais?',
        a: 'Perda reativa ao longo de uma linha longa. Conforme a corrente sobe, tanto a queda resistiva quanto a reativa crescem, e a tensão na extremidade distante cai fora da faixa utilizável. Suporte reativo perto do fim da carga é geralmente mais eficaz do que elevar a tensão de origem.',
      },
      {
        q: 'A geração distribuída muda o quadro de qualidade de energia?',
        a: 'Sim. O fluxo de potência reverso eleva a tensão no ponto de conexão e os inversores adicionam harmônicos de comutação. O coordenamento de proteção e o comportamento do tap changer ambos precisam ser revistos quando a capacidade de GD cresce.',
      },
      {
        q: 'Uma rede de cabos subterrâneos pode ser sobrecompensada?',
        a: 'Sim. A capacitância do cabo gera potência reativa em carga leve e pode empurrar o fator de potência medido para avanço, o que eleva a tensão e estressa o isolamento. Também cria um risco de ressonância paralela com a indutância do transformador.',
      },
    ],
  },
];

export const solutionMetaById = Object.fromEntries(solutionMeta.map((m) => [m.id, m]));
export const solutionMetaBySlug = Object.fromEntries(solutionMeta.map((m) => [m.slug, m]));
