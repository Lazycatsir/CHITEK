// Traducido desde enSolutionMeta.js (fuente única en español). El orden de campos coincide con el inglés.

export const solutionMeta = [
  {
    id: 'industry',
    slug: 'industrial',
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Industria manufacturera',
    h1: 'Soluciones de calidad de energía para la industria manufacturera',
    answer:
      'CHITEK instala filtros activos de armónicos (AHF) y generadores estáticos de var (SVG) en las alimentaciones de fábrica para corregir armónicos y reactivo. Los disparadores habituales son bancos de variadores, equipos de soldadura y hornos de inducción. La capacidad se fija según el espectro armónico medido en el punto de acoplamiento común, no solo según la potencia nominal del transformador.',
    title: 'Soluciones de calidad de energía para la industria manufacturera | CHITEK',
    description:
      'Filtrado de armónicos y compensación de reactivo para líneas de soldadura, hornos de inducción, CNC y servomandos, bancos de variadores, compresores y bombas de agua.',
    card: {
      lead: 'Filtrado de armónicos y compensación de reactivo para:',
      equipment: [
        'Líneas de soldadura',
        'Hornos de inducción',
        'Líneas CNC y servomandos',
        'Bancos de variadores',
        'Alimentaciones de compresores y bombas',
        'Rectificadores de galvanoplastia',
        'Accionamientos de laminación',
      ],
    },
    intro:
      'Las máquinas de soldadura, los hornos de inducción, los servomandos CNC y los grandes variadores inyectan corrientes armónicas en la alimentación de fábrica. El resultado son transformadores sobrecalentados, fallos repetidos de condensadores y equipos de proceso inestables. Los AHF y SVG de CHITEK se instalan en el transformador o en la alimentación y devuelven la distorsión a los límites de la fábrica.',
    comparison: {
      heading: 'Industria manufacturera: ¿AHF o SVG?',
      intro:
        'La mayoría de las instalaciones industriales decide primero qué problema domina. Armónicos y reactivo se miden por separado en la encuesta, y cualquiera puede ser la restricción.',
      rows: [
        {
          aspect: 'Función',
          ahf: 'Inyecta corriente de compensación que cancela la corriente armónica generada por cargas no lineales.',
          svg: 'Suministra o absorbe potencia reactiva de forma continua para mantener el factor de potencia y sostener la tensión.',
        },
        {
          aspect: 'Objetivo principal',
          ahf: 'La distorsión de corriente (THDi) y el espectro armónico en el punto de acoplamiento común.',
          svg: 'El factor de potencia, la variación de tensión y la demanda de reactivo a lo largo de todo el ciclo de carga.',
        },
        {
          aspect: 'Desencadenante típico',
          ahf: 'Bancos de variadores, rectificadores, máquinas de soldadura, hornos de inducción, controladores LED, rectificadores de UPS.',
          svg: 'Factor de potencia bajo o variable, hundimientos y sobrecargas de tensión, red débil o alimentación larga, escalones de carga de VE.',
        },
        {
          aspect: 'Comportamiento a carga ligera',
          ahf: 'La compensación escala con la corriente armónica medida; al bajar la carga, la salida baja con ella.',
          svg: 'Suministra lo necesario para alcanzar el factor de potencia objetivo incluso con carga activa cercana a cero.',
        },
        {
          aspect: 'Aplicación en este sector',
          ahf: 'Corrección armónica a nivel de alimentación para variadores y cargas de horno en el transformador o entrada principal.',
          svg: 'Soporte reactivo donde hay penalizaciones por factor de potencia o oscilación de tensión por conmutación de hornos.',
        },
      ],
      note: 'La capacidad se fija en la encuesta. Cuando una fábrica hace funcionar variadores y hornos a la vez, los dos equipos suelen combinarse en lugar de elegir uno.',
    },
    faq: [
      {
        q: '¿Qué produce los armónicos en una fábrica?',
        a: 'Cargas no lineales: los rectificadores de variadores y servomandos, las soldadoras de arco, los hornos de fusión por inducción y las fuentes de alimentación de corriente continua. Toman corriente en pulsos cortos en lugar de sinusoidal, y esos pulsos aparecen en la alimentación como corrientes armónicas.',
      },
      {
        q: '¿Puede un filtro activo de armónicos funcionar en paralelo con los bancos de condensadores existentes?',
        a: 'Sí, pero la posición de muestreo del TC del filtro es crítica. Si el TC muestrea por el lado de red y la conexión está aguas abajo de un banco de condensadores puro, el filtro puede excitar una resonancia LC. Use filtrado de órdenes selectivos con control antirresonancia, o mueva el muestreo al lado de carga.',
      },
      {
        q: '¿Necesito AHF, SVG o ambos?',
        a: 'El AHF cancela corrientes armónicas. El SVG suministra o absorbe reactivo y mantiene el factor de potencia. Si el problema es distorsión, empiece por AHF; si es factor de potencia bajo o variación de tensión, empiece por SVG. Las fábricas con variadores y hornos a la vez suelen necesitar ambos.',
      },
      {
        q: '¿Cómo se dimensiona la capacidad del filtro?',
        a: 'Según la encuesta de calidad de energía en el punto de acoplamiento común: espectro armónico, perfil reactivo y ciclo de carga. Dimensionar solo por el kVA del transformador es la causa más común de que la instalación quede pequeña.',
      },
    ],
  },
  {
    id: 'commercial',
    slug: 'commercial',
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Comercial y sanitario',
    h1: 'Soluciones de calidad de energía para edificios comerciales y sanitarios',
    answer:
      'CHITEK añade AHF y SVG a los cuadros de distribución comerciales y sanitarios existentes para reducir la distorsión armónica, la corriente de neutro y la resonancia de condensadores. Las fuentes típicas son controladores LED monofásicos, ascensores y equipos de imagen. Por lo general los bancos de condensadores existentes siguen en servicio con control antirresonancia y órdenes de filtrado selectivos.',
    title: 'Soluciones de calidad de energía para edificios comerciales y sanitarios | CHITEK',
    description:
      'Añada AHF y SVG en centros comerciales, hospitales, laboratorios y oficinas para tratar la sobrecarga armónica de LED, la corriente de neutro y la resonancia de condensadores.',
    card: {
      lead: 'Añada AHF y SVG al cuadro existente para:',
      equipment: [
        'Centros comerciales',
        'Hospitales y clínicas',
        'Laboratorios',
        'Oficinas con iluminación LED',
        'Hoteles',
        'Nodos de transporte',
      ],
    },
    intro:
      'Los edificios comerciales y sanitarios modernos están llenos de iluminación LED, ascensores, enfriadoras y equipos de imagen. Los controladores LED monofásicos suman armónicos triples en el neutro, y los bancos de condensadores instalados para corrección de factor de potencia pueden resonar con el transformador. CHITEK añade AHF al cuadro existente sin sustituir el equipo de compensación.',
    comparison: {
      heading: 'Edificio comercial: ¿AHF o SVG?',
      intro:
        'La división suele seguir el síntoma dominante: neutro caliente y distorsión LED apuntan a AHF, mientras que la demanda reactiva de enfriadoras y el golpe de ascensores apuntan a SVG.',
      rows: [
        {
          aspect: 'Función',
          ahf: 'Inyecta corriente de compensación que cancela la corriente armónica generada por cargas no lineales.',
          svg: 'Suministra o absorbe potencia reactiva de forma continua para mantener el factor de potencia y sostener la tensión.',
        },
        {
          aspect: 'Objetivo principal',
          ahf: 'La distorsión de corriente (THDi) y el espectro armónico en el punto de acoplamiento común.',
          svg: 'El factor de potencia, la variación de tensión y la demanda de reactivo a lo largo de todo el ciclo de carga.',
        },
        {
          aspect: 'Desencadenante típico',
          ahf: 'Bancos de variadores, rectificadores, máquinas de soldadura, hornos de inducción, controladores LED, rectificadores de UPS.',
          svg: 'Factor de potencia bajo o variable, hundimientos y sobrecargas de tensión, red débil o alimentación larga, escalones de carga de VE.',
        },
        {
          aspect: 'Comportamiento a carga ligera',
          ahf: 'La compensación escala con la corriente armónica medida; al bajar la carga, la salida baja con ella.',
          svg: 'Suministra lo necesario para alcanzar el factor de potencia objetivo incluso con carga activa cercana a cero.',
        },
        {
          aspect: 'Aplicación en este sector',
          ahf: 'Corrección de neutro y armónicos en plantas dominadas por iluminación LED y carga electrónica monofásica.',
          svg: 'Soporte reactivo para enfriadoras y HVAC (si la corrección de factor de potencia ya recibe penalización), o sustitución de bancos de condensadores que resuenan.',
        },
      ],
      note: 'Si el sitio ya tiene un banco de condensadores, la encuesta debe confirmar si puede seguir. Que se mantenga depende del control antirresonancia y de la posición del TC, no solo del tipo de equipo.',
    },
    faq: [
      {
        q: '¿Por qué se calienta el neutro en un edificio lleno de iluminación LED?',
        a: 'Los controladores LED monofásicos toman corriente no sinusoidal, rica en armónicos triples. Estos no se cancelan en el neutro, sino que se suman. En plantas densas en iluminación, la corriente de neutro puede superar a la de fase.',
      },
      {
        q: '¿Se pueden mantener los bancos de condensadores existentes?',
        a: 'Por lo general sí. El riesgo es la resonancia paralela entre el banco y la inductancia del transformador, que amplifica en lugar de eliminar. El control antirresonancia y el filtrado de órdenes selectivos permiten que el AHF trabaje con el banco en servicio.',
      },
      {
        q: '¿Es distinto el enfoque en hospitales que en oficinas?',
        a: 'Las fuentes armónicas y las consecuencias cambian. El equipo de imagen y las cargas de quirófano son sensibles a huecos de tensión y al desequilibrio trifásico, así que la encuesta debe cubrir profundidad de hueco y desequilibrio, no solo distorsión de corriente. El hardware de filtrado es la misma familia de producto.',
      },
      {
        q: '¿La reforma requiere cortar suministro?',
        a: 'El filtro se conecta en paralelo al cuadro, así que la mayoría de las reformas se hacen sobre el propio armario. La ventana de corte la fija el aislamiento y el procedimiento de permisos del sitio, no el equipo.',
      },
    ],
  },
  {
    id: 'datacenter',
    slug: 'data-center',
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Centro de datos',
    h1: 'Soluciones de calidad de energía para centros de datos',
    answer:
      'CHITEK usa AHF en centros de datos para tratar los armónicos de entrada de UPS, el desequilibrio de fase y el balanceo reactivo, y SVG para el bus de maquinaria. Las corrientes armónicas elevan la temperatura del transformador y pueden circular entre grupos de UPS en paralelo; el desequilibrio carga el neutro. Ambos se miden en la misma encuesta en el punto de acoplamiento común antes de fijar la capacidad.',
    title: 'Soluciones de calidad de energía para centros de datos | CHITEK',
    description:
      'Tratamiento de armónicos de UPS, equilibrio de fase y soporte reactivo para alojamiento, centros de datos empresariales y nodos perimetrales.',
    card: {
      lead: 'Tratamiento de armónicos de UPS, desequilibrio de fase y soporte reactivo para:',
      equipment: [
        'Centros de alojamiento',
        'Centros de datos empresariales',
        'Sedes financieras y bancarias',
        'Nodos perimetrales y remotos',
        'Sedes de recuperación ante desastres',
      ],
    },
    intro:
      'Los rectificadores de UPS, la carga IT monofásica y los variadores de refrigeración conviven en la misma alimentación. Las corrientes armónicas elevan la temperatura del transformador, el desequilibrio carga el neutro y el balanceo reactivo de las enfriadoras baja el factor de potencia a carga parcial. CHITEK trata en la alimentación de entrada de la UPS y en el bus de maquinaria.',
    comparison: {
      heading: 'Centro de datos: ¿AHF o SVG?',
      intro:
        'Los centros de datos suelen separar los dos buses: la alimentación de UPS es un problema de armónicos y el bus de maquinaria uno de reactivo. Se miden y dimensionan por separado.',
      rows: [
        {
          aspect: 'Función',
          ahf: 'Inyecta corriente de compensación que cancela la corriente armónica generada por cargas no lineales.',
          svg: 'Suministra o absorbe potencia reactiva de forma continua para mantener el factor de potencia y sostener la tensión.',
        },
        {
          aspect: 'Objetivo principal',
          ahf: 'La distorsión de corriente (THDi) y el espectro armónico en el punto de acoplamiento común.',
          svg: 'El factor de potencia, la variación de tensión y la demanda de reactivo a lo largo de todo el ciclo de carga.',
        },
        {
          aspect: 'Desencadenante típico',
          ahf: 'Bancos de variadores, rectificadores, máquinas de soldadura, hornos de inducción, controladores LED, rectificadores de UPS.',
          svg: 'Factor de potencia bajo o variable, hundimientos y sobrecargas de tensión, red débil o alimentación larga, escalones de carga de VE.',
        },
        {
          aspect: 'Comportamiento a carga ligera',
          ahf: 'La compensación escala con la corriente armónica medida; al bajar la carga, la salida baja con ella.',
          svg: 'Suministra lo necesario para alcanzar el factor de potencia objetivo incluso con carga activa cercana a cero.',
        },
        {
          aspect: 'Aplicación en este sector',
          ahf: 'Corrección armónica en la alimentación de entrada de la UPS, donde los armónicos del rectificador circulan entre grupos en paralelo.',
          svg: 'Soporte reactivo y de tensión en el bus de enfriadoras y CRAC, donde los arranques de variador y la carga parcial cambian el factor de potencia.',
        },
      ],
      note: 'Instalar el filtro aguas abajo de la salida de la UPS suele ser innecesario, porque la propia UPS ya trata su salida.',
    },
    faq: [
      {
        q: '¿Dónde se instala el AHF en un centro de datos?',
        a: 'En la alimentación de entrada de la UPS, o en el bus de maquinaria que alimenta enfriadoras y CRAC. Instalarlo aguas abajo de la salida de la UPS es posible pero normalmente innecesario, porque la UPS ya trata su salida.',
      },
      {
        q: '¿El filtrado armónico mejora el PUE?',
        a: 'De forma indirecta. Las corrientes armónicas causan pérdidas extra en transformador y cables, y pueden forzar al transformador a trabajar por encima de su temperatura de diseño, así que eliminarlas reduce esas pérdidas. El PUE depende de todo el diseño electromecánico, así que el efecto debe medirse, no suponerse.',
      },
      {
        q: '¿El desequilibrio de fase es un problema distinto de los armónicos?',
        a: 'Sí. La carga IT monofásica repartida de forma desigual entre fases produce corrientes de secuencia negativa y cero. Los armónicos son un problema de forma de onda; el desequilibrio, de reparto. Ambos suelen medirse en la misma encuesta.',
      },
      {
        q: '¿Los nodos perimetrales con UPS pequeñas usan el mismo equipo?',
        a: 'Sí, solo con menor capacidad. Los nodos remotos y rurales suelen tener peor calidad de suministro que el centro de datos principal, así que el paso de encuesta allí es más importante, no menos.',
      },
    ],
  },
  {
    id: 'renewable',
    slug: 'renewable',
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Energías renovables',
    h1: 'Soluciones de calidad de energía para energías renovables y almacenamiento',
    answer:
      'CHITEK usa SVG y AHF en combinación en el punto de conexión de PV, eólica y almacenamiento para tratar el entrelazado de armónicos, el parpadeo y el balanceo reactivo. Varios inversores conmutando en el mismo bus entrelazan su emisión, y los cambios de carga y descarga producen escalones reactivos. El cumplimiento se evalúa donde mide la compañía de red: el punto de acoplamiento común.',
    title: 'Soluciones de calidad de energía para energías renovables y almacenamiento | CHITEK',
    description:
      'Calidad de energía en el punto de conexión de PV, eólica y almacenamiento: entrelazado armónico, parpadeo y balanceo reactivo en el punto de acoplamiento común.',
    card: {
      lead: 'Tratamiento del entrelazado armónico, parpadeo y balanceo reactivo en el punto de conexión de:',
      equipment: [
        'Centrales fotovoltaicas de gran escala',
        'Parques eólicos',
        'Almacenamiento de baterías (BESS)',
        'Solar más almacenamiento',
        'Cogeneración y microred',
      ],
    },
    intro:
      'Los inversores fotovoltaicos, los convertidores plenos de eólica y las unidades PCS de batería conmutan a alta frecuencia. Varios equipos en el mismo punto de conexión entrelazan sus armónicos, y los cambios de carga y descarga producen escalones reactivos y eventos de parpadeo. El cumplimiento depende de lo que mida la compañía de red en el punto de acoplamiento común.',
    comparison: {
      heading: 'Punto de conexión: ¿AHF o SVG?',
      intro:
        'En el punto de conexión de PV, eólica o almacenamiento aparecen los dos problemas a la vez, porque los mismos inversores producen armónicos de conmutación y balanceo reactivo.',
      rows: [
        {
          aspect: 'Función',
          ahf: 'Inyecta corriente de compensación que cancela la corriente armónica generada por cargas no lineales.',
          svg: 'Suministra o absorbe potencia reactiva de forma continua para mantener el factor de potencia y sostener la tensión.',
        },
        {
          aspect: 'Objetivo principal',
          ahf: 'La distorsión de corriente (THDi) y el espectro armónico en el punto de acoplamiento común.',
          svg: 'El factor de potencia, la variación de tensión y la demanda de reactivo a lo largo de todo el ciclo de carga.',
        },
        {
          aspect: 'Desencadenante típico',
          ahf: 'Bancos de variadores, rectificadores, máquinas de soldadura, hornos de inducción, controladores LED, rectificadores de UPS.',
          svg: 'Factor de potencia bajo o variable, hundimientos y sobrecargas de tensión, red débil o alimentación larga, escalones de carga de VE.',
        },
        {
          aspect: 'Comportamiento a carga ligera',
          ahf: 'La compensación escala con la corriente armónica medida; al bajar la carga, la salida baja con ella.',
          svg: 'Suministra lo necesario para alcanzar el factor de potencia objetivo incluso con carga activa cercana a cero.',
        },
        {
          aspect: 'Aplicación en este sector',
          ahf: 'Corrección armónica cuando el entrelazado multiinversor o la interacción de filtros LCL supera los límites de red.',
          svg: 'Soporte reactivo y de tensión según irradiancia o estado de carga, y evitar factor de potencia en adelanto a baja salida.',
        },
      ],
      note: 'El cumplimiento se evalúa en el punto de acoplamiento común, así que la encuesta debe hacerse allí, no en el inversor.',
    },
    faq: [
      {
        q: '¿Qué problemas de calidad de energía aparecen en un punto de conexión de PV o almacenamiento?',
        a: 'Emisiones armónicas de banda ancha por la conmutación simultánea de varios inversores, balanceo reactivo según irradiancia o estado de carga, y parpadeo de tensión en el punto de conexión. La interacción de los filtros LCL multiinversor también puede crear resonancia.',
      },
      {
        q: '¿Por qué baja el factor de potencia a baja salida?',
        a: 'Los inversores y unidades PCS se dimensionan por potencia activa. A baja salida, su capacidad reactiva es una fracción menor de lo que necesita la unidad, y la capacitancia de cables y transformador puede hacer que el factor de potencia medido se adelante o atrase según la hora.',
      },
      {
        q: '¿Un solo equipo puede tratar armónicos y reactivo a la vez?',
        a: 'La combinación SVG más AHF es la respuesta habitual. El SVG mantiene factor de potencia y tensión, y el AHF elimina los armónicos de conmutación, con capacidad repartida según la encuesta.',
      },
      {
        q: '¿De qué depende el cumplimiento de conexión?',
        a: 'Del acuerdo de conexión y las normas locales, medido en el punto de acoplamiento común. Allí se evalúan los límites de emisión, el parpadeo y la capacidad reactiva, así que la encuesta debe hacerse allí, no en el inversor.',
      },
    ],
  },
  {
    id: 'rail',
    slug: 'rail-transit',
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Ferrocarril y carga de VE',
    h1: 'Soluciones de calidad de energía para ferrocarril y carga de vehículos eléctricos',
    answer:
      'CHITEK suministra AHF y SVG para subestaciones de tracción, alimentaciones ferroviarias y estaciones de carga de VE, donde las grandes cargas monofásicas y pulsantes inyectan armónicos y corrientes de secuencia negativa. Los rectificadores de tracción y la carga rápida de CC también bajan el factor de potencia en el pico. La capacidad se fija según la encuesta de espectro armónico, desequilibrio y perfil reactivo en el punto de suministro.',
    title: 'Soluciones de calidad de energía para ferrocarril y carga de VE | CHITEK',
    description:
      'Tratamiento de factor de potencia y armónicos para hubs de carga rápida de CC, flotas, estaciones públicas y tracción ferroviaria, dimensionado según encuesta.',
    card: {
      lead: 'Tratamiento de factor de potencia y armónicos para:',
      equipment: [
        'Hubs de carga rápida de CC',
        'Flotas y cocheras de autobuses',
        'Estaciones de carga públicas',
        'Cargadores en el lugar de trabajo',
        'Tracción ferroviaria',
      ],
    },
    intro:
      'Los rectificadores de tracción, la alimentación monofásica de 27,5 kV y la carga rápida de CC son grandes cargas monofásicas o pulsantes. Inyectan armónicos y corrientes de secuencia negativa en el suministro y bajan el factor de potencia en el pico de carga. CHITEK aporta AHF para las alimentaciones armónicas y SVG para el soporte reactivo en el transformador.',
    comparison: {
      heading: 'Tracción y carga: ¿AHF o SVG?',
      intro:
        'Las cargas de tracción y carga son pulsantes y a menudo monofásicas, así que el desequilibrio y los escalones reactivos aparecen junto con la distorsión.',
      rows: [
        {
          aspect: 'Función',
          ahf: 'Inyecta corriente de compensación que cancela la corriente armónica generada por cargas no lineales.',
          svg: 'Suministra o absorbe potencia reactiva de forma continua para mantener el factor de potencia y sostener la tensión.',
        },
        {
          aspect: 'Objetivo principal',
          ahf: 'La distorsión de corriente (THDi) y el espectro armónico en el punto de acoplamiento común.',
          svg: 'El factor de potencia, la variación de tensión y la demanda de reactivo a lo largo de todo el ciclo de carga.',
        },
        {
          aspect: 'Desencadenante típico',
          ahf: 'Bancos de variadores, rectificadores, máquinas de soldadura, hornos de inducción, controladores LED, rectificadores de UPS.',
          svg: 'Factor de potencia bajo o variable, hundimientos y sobrecargas de tensión, red débil o alimentación larga, escalones de carga de VE.',
        },
        {
          aspect: 'Comportamiento a carga ligera',
          ahf: 'La compensación escala con la corriente armónica medida; al bajar la carga, la salida baja con ella.',
          svg: 'Suministra lo necesario para alcanzar el factor de potencia objetivo incluso con carga activa cercana a cero.',
        },
        {
          aspect: 'Aplicación en este sector',
          ahf: 'Corrección armónica en alimentaciones dominadas por rectificadores de tracción y cargadores.',
          svg: 'Soporte reactivo en el transformador, donde el pico de carga y el stand-by llevan el factor de potencia en sentidos opuestos.',
        },
      ],
      note: 'La estación de carga es sobre todo un problema de SVG; cuando también hay que limitar los armónicos del cargador, se añade AHF.',
    },
    faq: [
      {
        q: '¿Por qué la corriente de secuencia negativa es un problema para el suministro de tracción?',
        a: 'Una carga monofásica conectada entre dos fases de un sistema trifásico produce corriente de secuencia negativa. Hace calentar los motores trifásicos de la misma red y puede llevar el desequilibrio por encima del límite de red.',
      },
      {
        q: '¿Una estación de carga de VE necesita AHF o SVG?',
        a: 'Mayormente SVG. El problema principal es la demanda reactiva y el factor de potencia en stand-by y carga, más el escalón de carga cuando arrancan varios vehículos. Cuando los armónicos del cargador también deben limitarse, se añade AHF.',
      },
      {
        q: '¿La recuperación regenerativa eleva la tensión de suministro?',
        a: 'Sí. La energía devuelta al frenar eleva la tensión de CC y CA, y el convertidor puede trip por sobretensión. Esto es un estudio de tracción, no algo que resuelva solo un filtro.',
      },
      {
        q: '¿En cuánto tiempo se recupera la inversión?',
        a: 'Para una estación de carga, la recuperación depende sobre todo de la penalización por factor de potencia evitada. Depende de la tarifa local y del perfil de carga del sitio, así que el número sale de su tarifa, no del catálogo.',
      },
    ],
  },
  {
    id: 'grid',
    slug: 'power-grid',
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Red eléctrica',
    h1: 'Soluciones de calidad de energía para transmisión y distribución',
    answer:
      'CHITEK aporta soporte reactivo y tratamiento armónico a las redes eléctricas y de distribución: SVG para tensión y factor de potencia, AHF donde la carga industrial o de tracción inyecta armónicos. La generación distribuida, las alimentaciones largas y los clusters de VE ponen a prueba la red de formas distintas, así que la capacidad se fija según lo medido en el punto de acoplamiento común.',
    title: 'Soluciones de calidad de energía para redes y distribución | CHITEK',
    description:
      'SVG y AHF para subestaciones de transmisión y distribución, redes urbanas, alimentaciones rurales largas y puntos de conexión de GD, dimensionados según estudio de red.',
    card: {
      lead: 'Tratamiento reactivo y armónico en la red para:',
      equipment: [
        'Subestaciones de transmisión y distribución',
        'Redes de distribución urbanas',
        'Alimentaciones rurales largas',
        'Puntos de conexión de generación distribuida',
        'Clusters de carga de VE',
      ],
    },
    intro:
      'Las redes de transmisión y distribución soportan la suma de todo lo anterior: armónicos industriales, desequilibrio de tracción, generación distribuida y pérdidas reactivas de líneas largas. El enfoque habitual de CHITEK es colocar SVG en el bus para soporte de tensión y reactivo, y AHF en la alimentación con más armónicos.',
    comparison: {
      heading: 'Red de distribución: ¿AHF o SVG?',
      intro:
        'En las redes eléctricas y de distribución, los dos equipos resuelven restricciones distintas de la red y suelen fijarse juntos ya en la fase de planificación.',
      rows: [
        {
          aspect: 'Función',
          ahf: 'Inyecta corriente de compensación que cancela la corriente armónica generada por cargas no lineales.',
          svg: 'Suministra o absorbe potencia reactiva de forma continua para mantener el factor de potencia y sostener la tensión.',
        },
        {
          aspect: 'Objetivo principal',
          ahf: 'La distorsión de corriente (THDi) y el espectro armónico en el punto de acoplamiento común.',
          svg: 'El factor de potencia, la variación de tensión y la demanda de reactivo a lo largo de todo el ciclo de carga.',
        },
        {
          aspect: 'Desencadenante típico',
          ahf: 'Bancos de variadores, rectificadores, máquinas de soldadura, hornos de inducción, controladores LED, rectificadores de UPS.',
          svg: 'Factor de potencia bajo o variable, hundimientos y sobrecargas de tensión, red débil o alimentación larga, escalones de carga de VE.',
        },
        {
          aspect: 'Comportamiento a carga ligera',
          ahf: 'La compensación escala con la corriente armónica medida; al bajar la carga, la salida baja con ella.',
          svg: 'Suministra lo necesario para alcanzar el factor de potencia objetivo incluso con carga activa cercana a cero.',
        },
        {
          aspect: 'Aplicación en este sector',
          ahf: 'Corrección armónica en alimentaciones donde la carga industrial o de tracción inyecta distorsión a la red.',
          svg: 'Soporte reactivo y control de tensión en alimentaciones largas, puntos de GD y clusters de carga de VE.',
        },
      ],
      note: 'El estudio de red fija los objetivos; la capacidad del equipo sale del estudio, no de una plantilla.',
    },
    faq: [
      {
        q: '¿Dónde se colocan SVG y AHF en una subestación?',
        a: 'El SVG en el bus para soporte reactivo y de tensión, y el AHF en la alimentación concreta con más carga armónica. Tratar todo el armónico de la subestación rara vez es económico.',
      },
      {
        q: '¿Qué causa el colapso de tensión en el final de una alimentación rural larga?',
        a: 'Las pérdidas reactivas en la línea larga. Al subir la corriente, tanto la caída óhmica como la reactiva aumentan, y la tensión del final cae fuera de rango. El soporte reactivo cerca de la carga suele ser más eficaz que subir la tensión en la fuente.',
      },
      {
        q: '¿La generación distribuida cambia el panorama de calidad de energía?',
        a: 'Sí. El flujo inverso eleva la tensión en el punto de conexión y los inversores añaden armónicos de conmutación. Al crecer la GD, hay que recalibrar la coordinación de protecciones y el comportamiento de los tap.',
      },
      {
        q: '¿Una red de cable subterráneo puede sobrecompensar?',
        a: 'Sí. La capacitancia del cable produce reactivo a carga ligera, lo que puede adelantar el factor de potencia medido, elevar la tensión y estresar el aislamiento. También crea riesgo de resonancia paralela con la inductancia del transformador.',
      },
    ],
  },
];

export const solutionMetaById = Object.fromEntries(solutionMeta.map((m) => [m.id, m]));
export const solutionMetaBySlug = Object.fromEntries(solutionMeta.map((m) => [m.slug, m]));
