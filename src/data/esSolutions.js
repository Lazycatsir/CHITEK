// Traducido desde enSolutions.js (fuente única en español). Estructura y orden de campos idénticos al inglés; solo se traducen las cadenas.
// Se conservan: nombres de modelo (AHF-200A, etc.), normas (GB/T 14549, IEEE 519...), lugares (Guangzhou, Dongguan...) y unidades (CNY, kvar, A).

export const industries = [
  { id: 'industry', label: 'Industria', icon: 'factory' },
  { id: 'commercial', label: 'Comercial y sanitario', icon: 'building-2' },
  { id: 'datacenter', label: 'Centro de datos', icon: 'server' },
  { id: 'renewable', label: 'Energías renovables', icon: 'zap' },
  { id: 'rail', label: 'Ferrocarril', icon: 'train-front' },
  { id: 'grid', label: 'Red eléctrica', icon: 'globe' },
];

let activeIndustry = 'commercial';

export const painPointScenes = [
  {
    id: 'medical', label: 'Médico', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Escenario médico', sceneSubtitle: 'Hospital / Clínica / Rehabilitación',
    cards: [
      { icon: 'activity', title: 'TC / RM', desc: 'Equipo de imagen', metric: '15%', metricLabel: 'THD', consequences: [{ title: 'Artefactos de imagen', sub: 'Riesgo de error de diagnóstico, requiere repetir escaneos, duplica el tiempo de espera del paciente' }, { title: 'Sobrecalentamiento de equipo', sub: 'Reducción de capacidad del transformador, vida útil de componentes acortada, mantenimiento no planificado' }] },
      { icon: 'heart-pulse', title: 'Quirófano', desc: 'Equipo quirúrgico', metric: 'nivel ms', metricLabel: 'Hundimiento', consequences: [{ title: 'Interrupción de cirugía', sub: 'Corte momentáneo, ciclo de reinicio del equipo, retrasos en el procedimiento' }, { title: 'Riesgo para la seguridad de vida', sub: 'Fallo de equipo de soporte crítico, latencia de transferencia de respaldo de emergencia' }] },
      { icon: 'flask-conical', title: 'Laboratorio', desc: 'Analizadores sensibles', metric: 'Alto', metricLabel: 'Corriente de sec. cero', consequences: [{ title: 'Desequilibrio de fase', sub: 'Deriva de instrumento de precisión, calibración invalidada, desperdicio de reactivos' }, { title: 'Sobrecarga de neutro', sub: 'Conductores sobrecalentados, riesgo de incendio, riesgo de quemado de línea N' }] },
    ],
  },
  {
    id: 'office', label: 'Oficina comercial', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Escenario de oficina comercial', sceneSubtitle: 'Oficina / Centro comercial / Hotel',
    cards: [
      { icon: 'lightbulb', title: 'Iluminación', desc: 'Armónico de controlador LED', metric: '23%', metricLabel: 'THD', consequences: [{ title: 'Parpadeo severo', sub: 'Fatiga visual, productividad reducida, quejas de molestia de ocupantes' }, { title: 'Sobrecarga de neutro', sub: 'Acumulación de armónicos tríplices, quemado de línea N, riesgo de incendio' }] },
      { icon: 'arrow-up-down', title: 'Ascensor', desc: 'Sobretensión de arranque de VFD', metric: '7x', metricLabel: 'Entrada', consequences: [{ title: 'Caída de tensión', sub: 'Trip de equipo, reinicio de sistema de control, riesgo de atrapamiento de pasajeros' }, { title: 'Desgaste mecánico', sub: 'Mantenimiento frecuente, reemplazo de pastillas de freno, fatiga de cable' }] },
      { icon: 'thermometer-snowflake', title: 'HVAC', desc: 'Reactivo de compresor', metric: '0,65', metricLabel: 'Factor de potencia', consequences: [{ title: 'Cargo por penalización', sub: 'Recargo por factor de potencia de la compañía, aumento de más del 30% en factura mensual' }, { title: 'Sobrecarga de transformador', sub: 'Corriente reactiva excesiva, sobrecalentamiento, vida útil acortada' }] },
    ],
  },
  {
    id: 'lab', label: 'Lab / Sala limpia', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Laboratorio y sala limpia', sceneSubtitle: 'Semiconductores / Biotecnología / Fabricación de precisión',
    cards: [
      { icon: 'wind', title: 'Sala limpia', desc: 'VFD de ventilador FFU', metric: '> 1,0', metricLabel: 'Parpadeo Pst', consequences: [{ title: 'Pérdida de rendimiento', sub: 'Aumento de densidad de defectos en obleas, rechazo de lote, impacto en ingresos' }, { title: 'Fluctuación de luz', sub: 'Desalineación de fotolitografía, falsos rechazos en inspección' }] },
      { icon: 'cpu', title: 'Equipo de laboratorio', desc: 'Instrumentos sensibles', metric: '30%', metricLabel: 'Hundimiento', consequences: [{ title: 'Pérdida de datos', sub: 'Datos de medición no guardados, interrupción de experimento, desperdicio de reactivos' }, { title: 'Deriva de calibración', sub: 'Recalibración tras hueco requerida, 4-8 h de inactividad de instrumento' }] },
      { icon: 'toy-brick', title: 'Bombas de refrigeración', desc: 'Arranque de motor', metric: '5~8x', metricLabel: 'Entrada', consequences: [{ title: 'Caída de tensión de bus', sub: 'Riesgo de trip en cascada, caída de tensión de equipos vecinos, parada de lote' }, { title: 'Trip de disyuntor', sub: 'Falso trip por sobrecorriente, parada no planificada, procedimiento de reinicio' }] },
    ],
  },
];

export const topologyScenes = [
  {
    id: 'medical', sceneName: 'Topología médica', sceneSubtitle: 'Hospital / Clínica / Rehabilitación',
    deviceLabel: 'AHF-200A', deviceType: 'Filtro activo de armónicos',
    deviceDesc: 'Conexión en paralelo al bus de BT, mitiga armónicos para la distribución de quirófano / imagen / laboratorio',
    branches: [
      { label: 'Distribución de quirófano', sub: 'Protección contra hundimientos' },
      { label: 'Alimentación de imagen', sub: 'Armónicos TC / RM' },
      { label: 'Distribución de laboratorio', sub: 'Desequilibrio de fase' },
    ],
  },
  {
    id: 'office', sceneName: 'Topología de oficina comercial', sceneSubtitle: 'Oficina / Centro comercial / Hotel',
    deviceLabel: 'SVG-300A', deviceType: 'Generador estático de var',
    deviceDesc: 'SVG en bus de BT, compensa reactivo para circuitos de ascensor / iluminación / HVAC',
    branches: [
      { label: 'Alimentación de iluminación', sub: 'Fuente armónica' },
      { label: 'Alimentación de ascensor', sub: 'Sobretensión de VFD' },
      { label: 'Alimentación de HVAC', sub: 'Carga reactiva' },
    ],
  },
  {
    id: 'lab', sceneName: 'Topología de laboratorio y sala limpia', sceneSubtitle: 'Semiconductores / Biotecnología / Fabricación de precisión',
    deviceLabel: 'AHF-150A', deviceType: 'Filtro activo de armónicos',
    deviceDesc: 'Conexión en serie en el frontal de UPS para supresión de armónicos de refrigeración de proceso / equipo de laboratorio',
    branches: [
      { label: 'Frontal de UPS', sub: 'Potencia de precisión' },
      { label: 'Refrigeración de proceso', sub: 'Entrada de bomba' },
      { label: 'Equipo de laboratorio', sub: 'Carga sensible' },
    ],
  },
];

export const cases = [
  {
    title: 'Reforma de armónicos de iluminación LED y sobrecarga de neutro — Centro comercial mayorista, Guangzhou',
    tabLabel: 'LED y neutro, centro comercial',
    highlight: 'Distorsión de corriente 49% → 2,75%; corriente de secuencia cero de neutro 365,76 A → 25,19 A',
    image: '/assets/images/solutions-commercial-medical-case-office.webp',
    industry: 'Edificio comercial', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/es/contact',
    site: 'Un mercado mayorista de prendas en un solo transformador de 2.500 kVA a aproximadamente 90% de carga, con dos armarios de compensación que suman 600 kvar. La carga dominante son iluminación LED monofásica y pantallas LED de vídeo en las plantas de venta.',
    harmonics: [
      'Distorsión de corriente de fase 49% en la planta 1 antes de la reforma',
      'Corriente armónica de secuencia cero de neutro 365,76 A',
      'Corriente aparente de neutro 369 A, incluida corriente de desequilibrio',
      'Distorsión de tensión de bus 4,75%',
    ],
    overview: 'Transformador de 2.500 kVA al 90% de carga con 600 kvar de bancos de condensadores. El centro comercial está lleno de iluminación LED y pantallas de vídeo LED: los controladores LED monofásicos inyectan un fuerte armónico 3º que se suma en el conductor neutro, llevando la distorsión de corriente al 49% y sobrecargando la línea N.',
    limitations: 'Medido en las alimentaciones de entrada de planta, no en el punto de medida de la compañía, así que las cifras describen la distribución del edificio, no el punto de acoplamiento común del sitio. Solo se trataron dos plantas.',
    trend: 'Distorsión 49% → 2,75%  ·  Corriente de neutro 369 A → 36,51 A',
    solution: [{ product: 'AHF-200A', qty: 2, use: '4 hilos trifásico, interruptor de entrada principal en cada planta de venta' }],
    results: [
      'Corriente armónica de secuencia cero de neutro 365,76 A → 25,19 A',
      'Corriente aparente de neutro 369 A → 36,51 A (incluida corriente de desequilibrio)',
      'Distorsión de tensión de bus 4,75% → 3,75%',
      'Aceptado en prueba frente a GB/T 14549',
    ],
  },
  {
    title: 'Reforma armónica antirresonancia — Fabricante de dispositivos médicos, Dongguan',
    tabLabel: 'Antirresonancia, médico',
    highlight: 'Corriente armónica 108 A → 25 A por fase con el banco de condensadores en servicio, sin resonancia LC',
    image: '/assets/images/solutions-commercial-medical-case-hospital.webp',
    industry: 'Medicina y salud', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/es/contact',
    site: 'Tres transformadores en una planta de dispositivos médicos, cada uno con un banco de condensadores puro de 600 kvar y trabajando entre 60% y 80% de carga. El sitio tenía fallos repetidos de condensadores y equipos de conmutación, lo que desencadenó la encuesta.',
    harmonics: [
      'Corriente armónica total, fases A/B/C del TR1: 108,16 / 106,64 / 79,22 A',
      'TR1 fase A, armónico 3º: 70,87 A',
      'TR1 fase A, armónico 5º: 50,78 A',
      'TR1 fase A, armónico 7º: 59,10 A',
      'Demanda reactiva 168,91 kvar, factor de potencia 0,967',
    ],
    overview: 'Tres transformadores, cada uno con 600 kvar de compensación pura de condensadores, trabajando al 60-80% de carga. El sitio tenía fallos recurrentes de condensadores y equipos de conmutación. La parte difícil: los TC del filtro muestrean por el lado de red y la conexión está aguas abajo de un banco de condensadores puro; la solución habitual es mover el muestreo al lado de carga. El filtrado selectivo de 3º/5º/7º con control antirresonancia de acoplamiento inteligente mantuvo la instalación estable en esta configuración.',
    limitations: 'El informe no indica las potencias de rack del filtro seleccionadas, así que solo se publican las corrientes medidas antes y después. Los resultados son para el transformador TR1 salvo que se indique lo contrario.',
    trend: 'Corriente armónica TR1 (A/B/C): 108,16 / 106,64 / 79,22 A → 25,27 / 26,68 / 22,79 A',
    solution: [{ product: 'AHF', qty: 3, use: 'Uno por transformador (TR1/TR2/TR3), filtrado selectivo 3º/5º/7º' }],
    results: [
      'Sin resonancia LC tras la energización, banco de condensadores en servicio durante todo el proceso',
      'Fase A: 3º 70,87 A → 1,31 A, 5º 50,78 A → 5,32 A, 7º 59,10 A → 3,28 A',
      'Demanda reactiva 168,91 kvar → 133,97 kvar; factor de potencia 0,967 → 0,978',
      'Resueltos los fallos recurrentes de condensadores y equipos de conmutación',
    ],
  },
  {
    title: 'Control armónico sin resonancia en una gran granja ganadera, Anhui',
    tabLabel: 'Antirresonancia, agrícola',
    highlight: 'Distorsión cercana al 50% → aproximadamente 5%, factor de potencia 0,87 → 0,99, tras devolver otra marca',
    image: '/assets/images/solutions-commercial-medical-case-lab.webp',
    industry: 'Agro y producción de alimentos', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/es/contact',
    site: 'Una explotación ganadera con automatización densa y monitoreo ambiental, alejada del punto de fuente en una red débil, con un cuarto de interruptores reducido y sin espacio para cubículos convencionales. Iluminación, aire acondicionado y ventilación son todas cargas electrónicas de potencia.',
    harmonics: [
      'Corriente en marcha 706 A en el momento de la encuesta',
      'Distorsión de corriente cercana al 50%, unos 342,6 A de corriente armónica',
      'Factor de potencia 0,87 antes de la reforma',
      'Cuarto de interruptores sin espacio para cubículos convencionales',
    ],
    overview: 'Una explotación ganadera de rápido crecimiento con automatización densa y monitoreo ambiental. Iluminación, aire acondicionado y ventiladores son todas cargas electrónicas de potencia; el sitio está lejos del punto de fuente en una red débil; y el cuarto de interruptores es reducido. Los filtros activos de un proveedor anterior resonaron al energizarse — zumbido de transformador, motores inestables — y se devolvieron.',
    limitations: 'Los filtros activos de un proveedor anterior resonaron en este sitio y se devolvieron; esa historia se describe porque dio forma a la selección, no como comparación de marcas nombradas. No se publica un gráfico espectral antes y después para este proyecto.',
    trend: 'Distorsión ~50% (342,6 A) → ~5%  ·  Factor de potencia 0,87 → 0,99',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'Modelos antirresonancia, ciclo de respuesta ajustado por IA y reducción de salida' }],
    results: [
      'Armónicos y resonancia ambos eliminados: armónicos y resonancia "eliminados en el momento de energizar, más allá de lo esperado" (cliente)',
      'Factor de potencia elevado de aproximadamente 0,87 a 0,99',
      'Alta densidad de potencia cabe en el cuarto de interruptores existente: hasta 900 A en un solo armario',
      'Protegido el equipo sensible de control automático y monitoreo',
    ],
  },
];

// ===================== DATOS DE RED =====================
export const gridPainPoints = [
  {
    id: 'transmission', label: 'Transmisión', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Transmisión y distribución', sceneSubtitle: 'Subestación / Distribución / Mejora rural',
    cards: [
      { icon: 'network', title: 'Carga no lineal', desc: 'Inyección armónica de cargas industriales y de tracción', metric: '>10%', metricLabel: 'THD', consequences: [{ title: 'Sobrecalentamiento de transformador', sub: 'Pérdida armónica excesiva, envejecimiento del aislamiento, reducción forzada hasta 30%' }, { title: 'Mal funcionamiento de protección', sub: 'Falso trip de relé, maniobra impertinente de disyuntor, degradación de fiabilidad de red' }] },
      { icon: 'zap', title: 'Generación distribuida', desc: 'Perturbación de red por interconexión GD', metric: '±10%', metricLabel: 'Fluct. tensión', consequences: [{ title: 'Flujo de potencia inverso', sub: 'Realimentación GD eleva tensión, caza de tap, fallo de coordinación de protección' }, { title: 'Riesgo de isla', sub: 'Formación de isla no intencionada, reconexión fuera de sincronismo, daño de equipo' }] },
      { icon: 'git-branch', title: 'Reactivo de línea', desc: 'Pérdida reactiva de transmisión a larga distancia', metric: '< 0,9', metricLabel: 'V final (pu)', consequences: [{ title: 'Pico de pérdidas de línea', sub: 'Pérdida I²R exponencial, colapso de tensión en final de alimentación rural, deslastre de carga' }, { title: 'Riesgo de colapso de tensión', sub: 'Déficit reactivo en cascada, potencial de apagón de área amplia, fallo de contingencia N-1' }] },
    ],
  },
  {
    id: 'urban', label: 'Distribución urbana', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Red de distribución urbana', sceneSubtitle: 'Centro urbano / Zona de desarrollo / Residencial antiguo',
    cards: [
      { icon: 'plug-zap', title: 'Carga de VE', desc: 'Sobretensión de impacto de clusters de carga rápida', metric: '120kW+', metricLabel: 'Escalón de carga', consequences: [{ title: 'Hundimiento de red', sub: 'Pico de carga concurrente causa caída de tensión >15%, trip de sobrecarga de transformador de distribución' }, { title: 'Inyección armónica', sub: 'Armónicos 6 pulsos del rectificador VE, THD >8% en PCC, contaminación de red' }] },
      { icon: 'building-2', title: 'Carga comercial', desc: 'Desequilibrio de fase de cargas monofásicas', metric: '>8%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Sobrecarga de neutro', sub: 'Acumulación de corriente de secuencia cero, quemado de línea N, riesgo de incendio en residencial antiguo' }, { title: 'Reducción de motor', sub: 'Calentamiento de secuencia negativa en motores trifásicos, vida útil menor, parada no planificada' }] },
      { icon: 'cable', title: 'Red de cable', desc: 'Reactivo capacitivo de cables subterráneos', metric: 'En adelanto', metricLabel: 'PF > 0,95', consequences: [{ title: 'Sobrecompensación', sub: 'Capacitancia de cable causa PF en adelanto a carga ligera, elevación de tensión, estrés de aislamiento' }, { title: 'Riesgo de resonancia', sub: 'Resonancia paralela capacitancia de cable + inductancia de transformador, amplificación armónica' }] },
    ],
  },
  {
    id: 'microgrid', label: 'Microred', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Microred y CCHP', sceneSubtitle: 'Campus / Isla / Zona remota',
    cards: [
      { icon: 'sun', title: 'Red multi-fuente', desc: 'Apilamiento armónico de PV + eólica + almacenamiento', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Incumplimiento PCC', sub: 'Superposición armónica multiinversor, límite PCC IEEE 519 excedido, penalización de operador de red' }, { title: 'Inestabilidad de resonancia', sub: 'Interacción de filtro LCL, oscilación de banda ancha, trip en cascada de inversor' }] },
      { icon: 'battery-charging', title: 'Ciclo de almacenamiento', desc: 'Fluctuación reactiva de carga/descarga', metric: 'Oscilación PF', metricLabel: '0,7~1,0', consequences: [{ title: 'Cargo por penalización', sub: 'Oscilación PF bidireccional dispara facturación de energía reactiva, pico de costo mensual' }, { title: 'Pérdida de vida de ciclo', sub: 'Corriente reactiva excesiva calienta PCS de batería, envejecimiento acelerado de IGBT, riesgo de anulación de garantía' }] },
      { icon: 'shuffle', title: 'Conmutación de red', desc: 'Hundimiento de tensión en transición isla/red', metric: '>20%', metricLabel: 'Profundidad', consequences: [{ title: 'Trip de carga', sub: 'Transferencia STS > 4ms causa caída de contactor, UPS de carga crítica pasa a batería' }, { title: 'Fallo de arranque diésel', sub: 'Hundimiento durante arranque de generador, colapso de excitación AVR, fallo de arranque en negro' }] },
    ],
  },
];
export const gridTopology = [
  {
    id: 'transmission', sceneName: 'Topología de transmisión', sceneSubtitle: 'Subestación / Distribución / Mejora rural',
    deviceLabel: 'SVG + AHF', deviceType: 'Sistema combinado',
    deviceDesc: 'SVG en bus 35kV/10kV para reactivo + AHF en alimentación de carga crítica para armónicos, punto de conexión GD marcado',
    branches: [
      { label: 'Carga crítica', sub: 'Equipo sensible' },
      { label: 'Punto de conexión GD', sub: 'Flujo inverso' },
      { label: 'Alimentación rural', sub: 'Caída de línea larga' },
    ],
  },
  {
    id: 'urban', sceneName: 'Topología de distribución urbana', sceneSubtitle: 'Centro urbano / Zona desarrollo / Residencial antiguo',
    deviceLabel: 'SPC + SVG-10kV', deviceType: 'Sistema de distribución',
    deviceDesc: 'SPC en alimentación 10kV para equilibrio + SVG en bus para reactivo, estación VE / comercial / residencial marcados',
    branches: [
      { label: 'Estación VE', sub: 'Carga de impacto' },
      { label: 'Carga comercial', sub: 'Desequilibrio de fase' },
      { label: 'Residencial', sub: 'Carga monofásica' },
    ],
  },
  {
    id: 'microgrid', sceneName: 'Topología de microred', sceneSubtitle: 'Campus / Isla / Zona remota',
    deviceLabel: 'SVG+AHF + SPC', deviceType: 'Sistema de microred',
    deviceDesc: 'SVG+AHF en PCC para calidad de energía + SPC para equilibrio de carga, rama PV / almacenamiento / diésel marcada',
    branches: [
      { label: 'Campo PV', sub: 'Fuente intermitente' },
      { label: 'PCS de batería', sub: 'Flujo bidireccional' },
      { label: 'Grupo diésel', sub: 'Suministro de respaldo' },
    ],
  },
];
export const gridCases = [
  {
    title: 'Configuración típica — Soporte reactivo de transmisión y distribución',
    tabLabel: 'Soporte reactivo T&D',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-grid-case-substation.webp',
    industry: 'Configuración típica · Red eléctrica', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una subestación o mejora de alimentación rural: SVG en el bus de 35 kV / 10 kV para soporte reactivo y de tensión, con AHF solo en las alimentaciones con la peor carga armónica.',
    overview: 'Para subestaciones que sirven una mezcla de carga industrial y de tracción, la disposición habitual es un SVG en el bus para soporte reactivo de tensión más AHF en las alimentaciones críticas para armónicos. Las potencias las fija una encuesta, no una plantilla; las cantidades siguientes son solo un punto de partida.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG', qty: 2, use: 'Soporte reactivo de tensión en bus' }, { product: 'AHF-200A', qty: 3, use: 'Filtrado armónico de alimentación crítica' }],
    results: [
      'Dimensionado desde un espectro armónico medido y perfil reactivo',
      'Diseñado a límites GB/T 14549 en el punto de acoplamiento común',
      'Consúltenos proyectos de referencia en transmisión y distribución',
    ],
  },
  {
    title: 'Configuración típica — Red de distribución urbana',
    tabLabel: 'Distribución urbana',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-grid-case-urban.webp',
    industry: 'Configuración típica · Distribución urbana', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una red de centro urbano o zona de desarrollo con clusters de carga rápida de VE, carga monofásica comercial y zonas residenciales alimentadas por cable.',
    overview: 'Para redes urbanas 10 kV con clusters de carga rápida de VE más carga mixta comercial y residencial, la disposición habitual es un dispositivo de equilibrio de fase en la alimentación de carga y un SVG en la alimentación para soporte reactivo. La capacitancia de cable subterráneo a carga ligera debe comprobarse antes de dimensionar, o el SVG peleará contra ella.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SPC-150A', qty: 4, use: 'Equilibrio trifásico de bahía de carga' }, { product: 'SVG', qty: 2, use: 'Compensación reactiva de alimentación' }],
    results: [
      'Dimensionado validado frente a una comprobación capacitiva a carga ligera',
      'Objetivo de límites GB/T 15543 de desequilibrio en cada estación de carga',
      'Consúltenos proyectos de referencia en distribución urbana',
    ],
  },
  {
    title: 'Configuración típica — Microred y CCHP',
    tabLabel: 'Microred y CCHP',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-grid-case-microgrid.webp',
    industry: 'Configuración típica · Microred', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una microred de campus, isla o zona remota que combina PV, almacenamiento de batería y respaldo diésel en un punto de acoplamiento común.',
    overview: 'Para microredes de isla y campus que combinan PV, eólica, almacenamiento y diésel, la disposición habitual es una combinación SVG + AHF en el punto de acoplamiento común más un dispositivo de equilibrio entre fases. La superposición armónica multiinversor y el hueco de transición isla/red deben medirse antes de fijar las potencias.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'Acondicionamiento de calidad de energía en PCC' }, { product: 'SPC-100A', qty: 1, use: 'Equilibrio de carga entre fases' }],
    results: [
      'Estudio armónico en todos los tipos de inversor antes de dimensionar',
      'Comportamiento de transición isla/red verificado por medición',
      'Consúltenos proyectos de referencia en microredes',
    ],
  },
];

// ===================== DATOS DE CENTRO DE DATOS =====================
export const dcPainPoints = [
  {
    id: 'cloud', label: 'Cómputo en nube', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Gran centro de cómputo en nube', sceneSubtitle: 'HPC / Proveedor nube / Alojamiento',
    cards: [
      { icon: 'cloud', title: 'Armónicos de UPS', desc: 'Contaminación reflejada de rectificadores UPS', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Circulación paralela', sub: 'Corriente armónica UPS circula entre unidades paralelas, desequilibrio de reparto de carga, riesgo de fuga térmica' }, { title: 'Vida de batería ↓', sub: 'Ondulación armónica acelera corrosión VRLA, vida de 3 años reducida a 18 meses' }] },
      { icon: 'server', title: 'Granja de servidores', desc: 'Desequilibrio de fase de carga IT monofásica', metric: '>15%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Sobrecarga de neutro', sub: 'Tríplice + desequilibrio de fase combinados, secuencia cero > corriente de fase, riesgo de incendio' }, { title: 'Trip de PDU', sub: 'Sobrecarga por fase pese a promedio bajo, trip impertinente de disyuntor PDU de rack, caída de fila' }] },
      { icon: 'fan', title: 'Sistema de refrigeración', desc: 'Impacto reactivo de enfriadoras/CRAC VFD', metric: 'PUE', metricLabel: 'Deterioro', consequences: [{ title: 'Sobrecarga de transformador', sub: 'Reactivo excesivo consume capacidad de transformador, mejora de refrigeración forzada, desperdicio CapEx' }, { title: 'Penalización energética', sub: 'PUE 1,6→1,8 por pérdidas reactivas, OpEx anual +800K CNY en instalación 10MW' }] },
    ],
  },
  {
    id: 'finance', label: 'DC financiero', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Centro de datos financiero', sceneSubtitle: 'Banco / Valores / Seguros',
    cards: [
      { icon: 'landmark', title: 'Trading de alta frecuencia', desc: 'Infraestructura de trading sensible a huecos', metric: '< 3ms', metricLabel: 'Tolerancia hueco', consequences: [{ title: 'Interrupción de trade', sub: 'Violación curva CBEMA/ITIC, caída de PSU de servidor, hueco de ms = pérdida de millones' }, { title: 'Multa regulatoria', sub: 'Mandato de continuidad CSRC, corte >5min dispara reporte obligatorio, penalización de cumplimiento' }] },
      { icon: 'power', title: 'Cambio diésel', desc: 'Choque de transferencia en prueba de grupo/salida', metric: '±15%', metricLabel: 'Escalón tensión', consequences: [{ title: 'Sobrecarga de UPS', sub: 'Entrada de ATS, UPS pasa a batería, sobrecarga de caminata de rectificador, caída de sistema' }, { title: 'Caza de generador', sub: 'Escalón de carga causa oscilación de gobernador, frecuencia >2% desviación, apagado de PSU' }] },
      { icon: 'thermometer', title: 'HVAC de precisión', desc: 'Fuente armónica de compresores VFD', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Subida de PUE', sub: 'Reducción de capacidad de transformadores de refrigeración, capacidad de enfriamiento reducida, punto caliente en racks' }, { title: 'Fallo de control', sub: 'Ruido armónico en PSU de controlador HVAC, deriva de sensor, oscilación de temperatura' }] },
    ],
  },
  {
    id: 'edge', label: 'Cómputo perimetral', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Nodo de cómputo perimetral', sceneSubtitle: 'Base 5G / IoT / Sala distribuida',
    cards: [
      { icon: 'router', title: 'Calidad de red', desc: 'Suministro inestable en sitios remotos/rurales', metric: '>20%', metricLabel: 'Profundidad hueco', consequences: [{ title: 'Nodo fuera de línea', sub: 'Hueco frecuente dispara descarga de mini-UPS, vida de ciclo agotada en 6 meses' }, { title: 'Costo de camión', sub: 'Cada visita al sitio cuesta 800 CNY, 200+ nodos = 160K CNY/mes de mantenimiento' }] },
      { icon: 'hard-drive', title: 'UPS pequeña', desc: 'Riesgo de sobrecarga en sitios de gabinete único', metric: '>80%', metricLabel: 'Ratio carga', consequences: [{ title: 'Sin redundancia', sub: 'Configuración N, fallo de una UPS = caída total del nodo, SLA 99,9% incumplido' }, { title: 'Sobrecarga de batería', sub: 'Alta tasa de carga en gabinete compacto, fuga térmica, riesgo de incendio en sitios desatendidos' }] },
      { icon: 'radio', title: 'Carga distribuida', desc: 'Desequilibrio de fase de 5G/IoT monofásica', metric: '>10%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Pérdida de eficiencia', sub: 'Fallo de coordinación DER, corriente de secuencia negativa, reducción PCS 15%, recorte' }, { title: 'Trip monofásica', sub: 'Sobrecorriente por fase, trip en cascada de equipo colocalizado en misma alimentación' }] },
    ],
  },
];
export const dcTopology = [
  {
    id: 'cloud', sceneName: 'Topología de cómputo en nube', sceneSubtitle: 'HPC / Proveedor nube / Alojamiento',
    deviceLabel: 'AHF+SVG', deviceType: 'Sistema de calidad de energía',
    deviceDesc: 'AHF en entrada de UPS para armónicos + SVG en bus de BT para reactivo, rama de sistema de refrigeración marcada',
    branches: [
      { label: 'Entrada UPS', sub: 'Fuente armónica' },
      { label: 'Rack de servidor', sub: 'Carga desequilibrada' },
      { label: 'CRAC/HVAC', sub: 'Carga reactiva VFD' },
    ],
  },
  {
    id: 'finance', sceneName: 'Topología de DC financiero', sceneSubtitle: 'Banco / Valores / Seguros',
    deviceLabel: 'AHF-100A + SVG-150A', deviceType: 'Sistema de precisión',
    deviceDesc: 'AHF en serie en frontal de UPS + SVG en bus de BT, transferencia ATS / mesa de trading / HVAC marcados',
    branches: [
      { label: 'Sistema UPS', sub: 'Fuente armónica' },
      { label: 'Mesa de trading', sub: 'Sensible a huecos' },
      { label: 'HVAC de precisión', sub: 'Armónicos VFD' },
    ],
  },
  {
    id: 'edge', sceneName: 'Topología de nodo perimetral', sceneSubtitle: 'Base 5G / IoT / Sala distribuida',
    deviceLabel: 'AHF-Slim 15A', deviceType: 'Unidad montaje en rack',
    deviceDesc: 'AHF-Slim montaje en rack en gabinete de distribución, bucle red directa / mini UPS marcado',
    branches: [
      { label: 'Red directa', sub: 'Suministro rural' },
      { label: 'Mini UPS', sub: 'Riesgo sobrecarga' },
      { label: 'Carga 5G/IoT', sub: 'Potencia distribuida' },
    ],
  },
];
export const dcCases = [
  {
    title: 'Mitigación de armónicos de UPS en una alimentación de centro de datos, Guangzhou',
    tabLabel: 'Alimentación IDC',
    highlight: 'Corriente armónica 204,96 A → 19,18 A; distorsión 26,94% → 3,12%',
    image: '/assets/images/solutions-datacenter-case-cloud.webp',
    industry: 'Alojamiento / IDC', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/es/contact',
    site: 'La alimentación TR1 de una sala IDC, trabajando entre 200 A y 850 A con factor de potencia de desplazamiento 0,975 antes de la reforma. El armario de filtro existente se reconstruyó en lugar de reemplazarse.',
    harmonics: [
      'Corriente de carga 814,13 A al 82% de factor de carga',
      'Corriente armónica total 204,96 A, Ithd 26,94%',
      'Factor de potencia de desplazamiento 0,975 antes de la reforma',
      'Distorsión por fase tras tratamiento: 3,12% / 2,50% / 2,55% en A/B/C',
    ],
    overview: 'Alimentación TR1 de una sala IDC, corriente de marcha 200-850 A, factor de potencia de desplazamiento 0,975 antes de la reforma. El armario de filtro existente se reconstruyó alrededor de un nuevo filtro activo de 500 A. A 814,13 A de corriente de carga (82% de factor de carga) la corriente armónica medida alcanzó 204,96 A con 26,94% de distorsión.',
    limitations: 'Cubre una alimentación de la sala, no todo el sitio. Las cifras se toman a 814,13 A de corriente de carga (82% de factor de carga), que es el punto que usó el informe de puesta en marcha para la aceptación.',
    trend: 'Corriente armónica 204,96 A → 19,18 A  ·  Distorsión 26,94% → 3,12%',
    solution: [{ product: 'AHF-500A', qty: 1, use: 'Armario de filtro reconstruido en alimentación TR1' }],
    results: [
      'Distorsión por fase 3,12% / 2,50% / 2,55% en A/B/C',
      'Factor de potencia mantenido en 0,981 en servicio',
      'Cada orden armónico dentro de límites GB/T 14549',
      'Fases I y III de la sala IDC superaron el registro de inspección contra incendios',
    ],
  },
  {
    title: 'Configuración típica — Centro de datos financiero',
    tabLabel: 'DC financiero',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-datacenter-case-finance.webp',
    industry: 'Configuración típica · DC financiero', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para un centro de datos de banco, valores o seguros, donde los armónicos de rectificador UPS y las transitorios de transferencia ATS dominan el pliego.',
    overview: 'Para centros de datos de banco, valores y seguros, la disposición habitual es AHF en el frontal del rectificador UPS más SVG en el bus de BT para soporte reactivo dinámico. Las pruebas de transferencia ATS son el caso de estrés: la ventana de hueco debe medirse antes de fijar la potencia del filtro.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'Filtrado frontal de rectificador UPS' }, { product: 'SVG-100A', qty: 2, use: 'Soporte reactivo dinámico de sala de trading' }],
    results: [
      'Ventana de hueco medida durante prueba de transferencia ATS antes de dimensionar',
      'Objetivo de parpadeo IEC 61000-3-3 y requisitos de tolerancia a hueco del sitio',
      'Consúltenos proyectos de referencia en centros de datos financieros',
    ],
  },
  {
    title: 'Configuración típica — Nodos de cómputo perimetral',
    tabLabel: 'Nodos perimetrales',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-datacenter-case-edge.webp',
    industry: 'Configuración típica · Cómputo perimetral', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/es/contact',
    site: 'Disposición ilustrativa para sitios MEC 5G y IoT distribuidos, donde el suministro es inestable, el gabinete es pequeño y el costo de una visita al sitio supera al hardware.',
    overview: 'Para sitios MEC 5G y IoT distribuidos, la disposición habitual es un AHF slim montaje en rack dentro del gabinete existente más monitoreo centralizado. Los sitios remotos traen su propia restricción: suministro inestable y un costo de visita que eclipsa el hardware, así que el monitoreo remoto no es opcional.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'AHF-Slim', qty: 1, use: '1U montaje en rack por gabinete de nodo' }, { product: 'Cloud Monitor', qty: 1, use: 'Plataforma centralizada de monitoreo remoto' }],
    results: [
      'Potencia fijada por gabinete tras encuesta del sitio',
      'Monitoreo remoto incluido para que la visita no sea la respuesta por defecto',
      'Consúltenos proyectos de referencia en cómputo perimetral',
    ],
  },
];

// ===================== DATOS INDUSTRIALES =====================
export const indPainPoints = [
  {
    id: 'welding', label: 'Soldadura y metal', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Soldadura y metalurgia', sceneSubtitle: 'Automoción / Construcción naval / Estructura de acero',
    cards: [
      { icon: 'flame', title: 'Banco de soldadura de arco', desc: 'Sobretensión armónica de soldadura por lotes', metric: '>25%', metricLabel: 'THD', consequences: [{ title: 'Sobrecalentamiento de transformador', sub: 'Corriente armónica intermitente alta, envejecimiento de aislamiento acelerado 3x, reducción forzada' }, { title: 'Trip de protección', sub: 'Pico armónico dispara falso trip de disyuntor, parada de línea de producción, costo de retrabajo' }] },
      { icon: 'factory', title: 'Horno de frecuencia media', desc: 'Parpadeo de tensión de horno de inducción', metric: 'Reactivo', metricLabel: 'Fluctuación', consequences: [{ title: 'Hundimiento de tensión de red', sub: 'Ciclo de horno causa Pst > 1,5, mal funcionamiento de equipo vecino, rechazo de lote' }, { title: 'Cargo por penalización', sub: 'Incumplimiento de parpadeo de compañía, recargo mensual de energía reactiva, incumplimiento de contrato' }] },
      { icon: 'cpu', title: 'Centro de mecanizado CNC', desc: 'Desequilibrio de fase de servomandos', metric: 'Alto', metricLabel: 'Sec. cero', consequences: [{ title: 'Mal funcionamiento de servo', sub: 'Desequilibrio de fase causa error de posición, deriva dimensional de pieza, aumento de scrap' }, { title: 'Pérdida de rendimiento', sub: 'Rotura frecuente de herramienta, degradación de acabado superficial, pico de tasa de devolución' }] },
    ],
  },
  {
    id: 'petrochemical', label: 'Química y petróleo', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Química y petroquímica', sceneSubtitle: 'Refinación / Química fina / Petróleo y gas',
    cards: [
      { icon: 'droplets', title: 'Banco de VFD', desc: 'Apilamiento armónico de instalación multi-VFD', metric: '>18%', metricLabel: 'THD', consequences: [{ title: 'Incumplimiento de red', sub: 'Superposición armónica multi-VFD, límite PCC IEEE 519 excedido, aviso de compañía' }, { title: 'Trip de condensador', sub: 'Amplificación armónica en condensadores PFC, fusible fundido, escalada de penalización reactiva' }] },
      { icon: 'waves', title: 'Bomba de alta potencia', desc: 'Sobretensión de arranque de motores grandes', metric: '6~10x', metricLabel: 'Entrada', consequences: [{ title: 'Caída de tensión de bus', sub: 'Arranque DOL causa caída de bus >20%, caída de módulo E/S DCS, inestabilidad de lazo de control' }, { title: 'Alerta DCS', sub: 'Hundimiento repetido dispara inundación de alarma DCS, sobrecarga cognitiva de operador, retraso de respuesta' }] },
      { icon: 'shield-alert', title: 'Sistema DCS', desc: 'Infraestructura de control sensible a huecos', metric: '>15%', metricLabel: 'Profundidad hueco', consequences: [{ title: 'Congelación de control', sub: 'Hueco causa reinicio de procesador DCS, pérdida de posición de válvula, riesgo de reacción exotérmica' }, { title: 'Parada de proceso', sub: 'Sistema instrumentado de seguridad dispara ESD, pérdida de lote, procedimiento de reinicio 48h' }] },
    ],
  },
  {
    id: 'semiconductor', label: 'Semiconductor', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Semiconductor y electrónica', sceneSubtitle: 'Planta de obleas / Encapsulado / PCB',
    cards: [
      { icon: 'cpu', title: 'Planta de obleas', desc: 'Hundimiento de tensión en escáneres de litografía', metric: '< 5ms', metricLabel: 'Tolerancia hueco', consequences: [{ title: 'Parada de escáner', sub: 'Hueco sub-ciclo causa pérdida de posición de escenario, recalibración 4h, scrap de obleas' }, { title: 'Scrap de obleas', sub: 'Un solo hueco = 25 obleas descartadas × $5K/obla = $125K por incidente' }] },
      { icon: 'wind', title: 'Sala limpia', desc: 'Contaminación armónica de FFU/VFD', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Carga de filtro ↑', sub: 'Corriente armónica eleva temperatura de motor FFU, tasa de fallo de rodamiento 3x, aumento de conteo de partículas' }, { title: 'Riesgo de partículas', sub: 'Fluctuación de velocidad FFU causa pérdida de presión positiva, brecha de sala limpia Clase-100' }] },
      { icon: 'microscope', title: 'Equipo de prueba', desc: 'Desequilibrio de fase en piso ATE/prueba', metric: '>5%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Error de datos', sub: 'Rechazo de ondulación de fuente ATE degradado, falso rechazo de DUT, error de reporte de rendimiento' }, { title: 'Sobrecarga de neutro', sub: 'Alta corriente de secuencia cero en PDU de piso de prueba, N temp > 90°C, riesgo de incendio' }] },
    ],
  },
];
export const indTopology = [
  {
    id: 'welding', sceneName: 'Topología de soldadura y metal', sceneSubtitle: 'Automoción / Construcción naval / Estructura de acero',
    deviceLabel: 'AHF-150A', deviceType: 'Filtro de armónicos',
    deviceDesc: 'Paralelo a bus de BT de taller, apunta a alimentaciones de banco de soldadura / horno para supresión armónica',
    branches: [
      { label: 'Dist. soldadura', sub: 'Sobretensión armónica' },
      { label: 'Dist. horno', sub: 'Fuente de parpadeo' },
      { label: 'Dist. CNC', sub: 'Desequilibrio de fase' },
    ],
  },
  {
    id: 'petrochemical', sceneName: 'Topología química y petróleo', sceneSubtitle: 'Refinación / Química fina / Petróleo y gas',
    deviceLabel: 'SVG-800V', deviceType: 'Generador estático de var',
    deviceDesc: 'SVG-800V/690V en bus de AT + AHF para armónicos VFD, alimentación de carga sensible DCS marcada',
    branches: [
      { label: 'Dist. craqueo', sub: 'Banco VFD' },
      { label: 'Destilación', sub: 'Carga de calentamiento E' },
      { label: 'Agua de circuito', sub: 'Bomba grande' },
    ],
  },
  {
    id: 'semiconductor', sceneName: 'Topología de semiconductor', sceneSubtitle: 'Planta de obleas / Encapsulado / PCB',
    deviceLabel: 'AHF+SVG', deviceType: 'Sistema combinado',
    deviceDesc: 'Combo AHF+SVG en frontal de UPS, marca alimentaciones de obleas de doble alimentación / sala limpia',
    branches: [
      { label: 'Frontal UPS', sub: 'Potencia de precisión' },
      { label: 'Refrigeración de proceso', sub: 'Entrada de bomba' },
      { label: 'Equipo de prueba', sub: 'Carga sensible' },
    ],
  },
];
export const indCases = [
  {
    title: 'Reforma armónica en una alimentación de planta de 550 A — Fabricante electrónico, Guangdong',
    tabLabel: 'Alimentación electrónica',
    highlight: 'Distorsión de corriente 20,06% → 2,58% en alimentación de VFD / compresor / bomba',
    image: '/assets/images/solutions-industrial-case-semiconductor.webp',
    industry: 'Fabricación electrónica', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/es/contact',
    site: 'Alimentación TM8 en una planta de fabricación electrónica, que alimenta variadores de frecuencia, compresores de aire y bombas de agua de refrigeración. El circuito ya llevaba 390 kvar de compensación de condensadores dentro de un banco instalado de 780 kvar, y trabajaba entre 800 A y 1.000 A con factor de potencia de sistema 0,92.',
    harmonics: [
      'Corriente en marcha 800-1.000 A en alimentación TM8',
      'Distorsión de corriente 20,06% antes de la reforma',
      'Factor de potencia de desplazamiento de sistema 0,92',
      '390 kvar de compensación de condensadores en el circuito, 780 kvar instalados',
    ],
    overview: 'La alimentación TM8 alimenta VFD, compresores de aire y bombas de agua de refrigeración, con 390 kvar de compensación de condensadores en el circuito (780 kvar instalados). Corriente en marcha 800-1.000 A, factor de potencia de desplazamiento de sistema 0,92 antes de la reforma.',
    limitations: 'Los resultados se reportan solo para la alimentación TM8. Otras alimentaciones de la misma planta no formaron parte de este contrato y no están cubiertas por las cifras.',
    trend: 'Distorsión 20,06% → 2,58%',
    solution: [{ product: 'AHF-550A', qty: 1, use: 'Compensación armónica en alimentación TM8' }],
    results: [
      'Distorsión de corriente 20,06% → 2,58%',
      'Evitados amplificación armónica y resonancia de sistema',
      'Aceptado en prueba frente a GB/T 14549',
    ],
  },
  {
    title: 'Mitigación armónica centralizada en cinco transformadores de 2.000 kVA — Fabricante de componentes ópticos, Dongguan',
    tabLabel: 'Óptica, 5 transformadores',
    highlight: 'Corriente armónica 146,22 A → 30,96 A (TR4) y 124,71 A → 43,99 A (TR5)',
    image: '/assets/images/solutions-industrial-case-petrochemical.webp',
    industry: 'Fabricación de óptica de precisión', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/es/contact',
    site: 'Un cuarto de BT en planta baja con cinco transformadores de 2.000 kVA a aproximadamente 90% de carga, cada uno alimentando variadores de frecuencia, maquinaria de producción óptica y motores, con tres armarios condensador-reactancia que suman 720 kvar.',
    harmonics: [
      'Corriente armónica TR4 146,22 A, Ithd 5,39%',
      'Corriente armónica TR5 124,71 A, Ithd 4,68%',
      'TR4 3º / 5º / 7º armónico: 122,52 / 70,45 / 22,54 A',
      'TR5 3º / 5º / 7º armónico: 100,04 / 59,97 / 33,84 A',
      'Límites GB/T 14549 para estos órdenes: 62 / 62 / 44 A',
    ],
    overview: 'Cuarto de BT en planta baja con 5 × 2.000 kVA, cada uno emparejado con un armario de filtro activo de 500 A. La carga son VFD, máquinas de producción óptica y motores, con tres armarios condensador-reactancia que suman 720 kvar. Medido al 90% de factor de carga.',
    limitations: 'Los resultados publicados cubren solo los transformadores TR4 y TR5; los otros tres no se reportan aquí. La disponibilidad de módulos de filtro durante la ventana de reporte queda fuera del alcance.',
    trend: 'TR4 146,22 A → 30,96 A  ·  TR5 124,71 A → 43,99 A',
    solution: [{ product: 'AHF-500A', qty: 5, use: 'Un armario por transformador de 2.000 kVA en el cuarto de BT' }],
    results: [
      'Distorsión TR4 5,39% → 1,38%, TR5 4,68% → 1,67%',
      '3º armónico TR4 122,52 A → 12,69 A, TR5 100,04 A → 17,89 A',
      'Cada orden monitoreado dentro de límites GB/T 14549 (62/62/44 A para 3º/5º/7º)',
      'Aceptado en prueba — resultado descrito como ideal en el informe de puesta en marcha',
    ],
  },
  {
    title: 'Control armónico sin resonancia en un horno de fusión por inducción',
    tabLabel: 'Horno de inducción',
    highlight: 'Resonancia de arranque, muescas de tensión de red y trastorno de conmutación — los tres resueltos',
    image: '/assets/images/solutions-industrial-case-welding.webp',
    industry: 'Metales y calentamiento por inducción', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/es/contact',
    site: 'Un taller de fusión de metales con un horno de inducción. La forma de onda de corriente es cercana a un cuadrado, así que el contenido armónico es alto; las repetidas muescas de tensión de red al arranque estresan cualquier filtro activo en la alimentación.',
    overview: 'Los hornos de inducción son una carga dura para cualquier filtro activo. La forma de onda de corriente es cercana a un cuadrado, así que el contenido armónico es alto y la resonancia viene fácil. Las muescas repetidas de tensión de red al arranque estresan el filtro. Y al encenderse, la inductancia de salida resuena con el condensador del filtro, disparando la protección de corriente de salida, lo que a su vez altera la conmutación del horno.',
    limitations: 'No se publican cifras medidas antes y después para este proyecto, así que la entrada describe el problema de ingeniería y el remedio, no una tabla de resultados. Téngalo como nota de capacidad, no como afirmación de rendimiento.',
    trend: '',
    note: 'Los valores medidos antes/después no se publican para este proyecto. Lo que sigue es el problema de ingeniería y cómo se resolvió.',
    solution: [{ product: 'AHF', qty: 1, use: 'Alimentación de horno, con inductancia de salida y parámetros de condensador revisados' }],
    results: [
      'Inductancia de salida y condensador de filtro reparametrizados para romper la resonancia de encendido',
      'Alarmas de corriente de salida por arranque y escalón de carga eliminadas por actualización de software de control',
      'Conmutación de horno restaurada a operación normal',
      'Distorsión llevada dentro del requisito de red nacional sin disparar resonancia',
    ],
  },
];

// ===================== DATOS FERROVIARIOS =====================
export const railPainPoints = [
  {
    id: 'metro', label: 'Metro y LRT', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Metro y ferrocarril ligero', sceneSubtitle: 'Tracción / Estación / Cocheras',
    cards: [
      { icon: 'train-front', title: 'Rectificador de tracción', desc: 'Inyección armónica de rectificador de 24 pulsos', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'Penalización de red', sub: 'Armónicos característicos 23º/25º, incumplimiento PCC IEEE 519, recargo de compañía' }, { title: 'Fallo de condensador', sub: 'Amplificación armónica en banco PFC, ruptura de condensador, riesgo de incendio en subestación subterránea' }] },
      { icon: 'building', title: 'M&E de estación', desc: 'Desequilibrio de banco de equipos', metric: '>10%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Sobrecarga de neutro', sub: 'Mezcla de carga monofásica ascensor + HVAC, corriente N supera la de fase, riesgo de fusión de aislamiento' }, { title: 'Trip de disyuntor', sub: 'Sobrecarga por fase pese a promedio < potencia, corte de iluminación de estación, riesgo de seguridad de pasajeros' }] },
      { icon: 'battery-charging', title: 'Frenado regenerativo', desc: 'Elevación de tensión por realimentación de energía', metric: 'Tensión', metricLabel: 'Elevación', consequences: [{ title: 'Sobretensión inversor', sub: 'Realimentación de energía regenerativa, sobretensión de enlace CC, apagado por protección IGBT' }, { title: 'Trip de protección', sub: 'Cascada de protección por sobretensión, retraso de tren > 5min, penalización SLA de servicio' }] },
    ],
  },
  {
    id: 'hsr', label: 'Ferrocarril de alta velocidad', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Ferrocarril de alta velocidad', sceneSubtitle: 'Subestación de tracción / AT / Sección',
    cards: [
      { icon: 'gauge', title: 'Monofásica 27,5kV', desc: 'Secuencia negativa de conexión V/V', metric: '>8%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Incumplimiento de red', sub: 'Carga monofásica de tracción causa secuencia negativa en PCC 220kV, orden de recorte de compañía' }, { title: 'Calentamiento de generador', sub: 'Corriente de secuencia negativa en generadores térmicos cercanos, alarma de temperatura de superficie de rotor' }] },
      { icon: 'zap', title: 'Convertidor EMU', desc: 'Armónico de banda ancha de convertidor 4Q', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Calentamiento de contacto', sub: 'Corriente armónica de alta frecuencia aumenta pérdida I²R de hilo de contacto, recocido acelerado, aumento de flecha' }, { title: 'Interferencia de señalización', sub: 'EMI armónica acopla a circuito de vía, distorsión de señal de cabina, degradación de disponibilidad ETCS' }] },
      { icon: 'cable', title: 'Línea de alimentación', desc: 'Pérdida de tensión en alimentación AT larga', metric: '>10%', metricLabel: 'Caída', consequences: [{ title: 'Límite de velocidad', sub: 'Tensión de extremo < 22,5kV limita potencia de tren, impone restricción de velocidad, retraso de horario' }, { title: 'Saturación AT', sub: 'Sobretensión en extremo emisor causa saturación de núcleo de autotransformador, generación armónica' }] },
    ],
  },
  {
    id: 'ev', label: 'Carga de VE', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Infraestructura de carga de VE', sceneSubtitle: 'Autopista / Rápida urbana / Cocheras de bus',
    cards: [
      { icon: 'plug-zap', title: 'Cargador rápido', desc: 'Impacto de potencia de carga rápida CC', metric: '120kW+', metricLabel: 'Escalón carga', consequences: [{ title: 'Hundimiento de red', sub: 'Arranque simultáneo de múltiples cargadores, caída de tensión >15%, trip de protección de transformador de distribución' }, { title: 'Cargo por demanda', sub: 'Pico de demanda dispara trinquete de demanda, cargo de capacidad mensual 3x base' }] },
      { icon: 'radio', title: 'Armónicos de cargador', desc: 'Apilamiento armónico de cargadores de 12 pulsos', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'Penalización PF', sub: 'Armónico + reactivo combinados, PF < 0,85 en PCC, penalización mensual + recargo de impuesto al carbono' }, { title: 'Problema EMI', sub: 'EMI conducida a red BT, interferencia de TV/radio residencial cercana, pico de volumen de quejas' }] },
      { icon: 'wrench', title: 'Transformador de distribución', desc: 'Sobrecarga y desequilibrio en estación de carga', metric: '>90%', metricLabel: 'Carga', consequences: [{ title: 'Vida acortada', sub: 'Estrés térmico cíclico por carga de pico, envejecimiento de aislamiento 5x más rápido, vida esperada < 3 años' }, { title: 'Desigual 3 fases', sub: 'Dominan cargadores CA monofásicos, corriente de secuencia cero > 40%, reemplazo de línea N cada 2 años' }] },
    ],
  },
];
export const railTopology = [
  {
    id: 'metro', sceneName: 'Topología de metro', sceneSubtitle: 'Tracción / Estación / Cocheras',
    deviceLabel: 'SVG + AHF', deviceType: 'Sistema combinado',
    deviceDesc: 'SVG en anillo 35kV + AHF en rectificador de subestación de tracción 750V/1500V, estación/cocheras marcadas',
    branches: [
      { label: 'Subest. tracción', sub: 'Carga rectificador' },
      { label: 'Dist. estación', sub: 'Carga M&E' },
      { label: 'Potencia cochera', sub: 'Carga auxiliar' },
    ],
  },
  {
    id: 'hsr', sceneName: 'Topología de alta velocidad', sceneSubtitle: 'Subestación tracción / AT / Sección',
    deviceLabel: 'SVG-27.5kV + AHF-200A', deviceType: 'Sistema de tracción',
    deviceDesc: 'SVG-27.5kV en bus de tracción + AHF en alimentación 10kV, sección AT / hilo de contacto marcados',
    branches: [
      { label: 'Hilo de contacto', sub: 'Carga monofásica' },
      { label: 'Línea de alimentación', sub: 'Fuente armónica' },
      { label: 'Potencia estación', sub: 'Carga compuesta' },
    ],
  },
  {
    id: 'ev', sceneName: 'Topología de carga de VE', sceneSubtitle: 'Autopista / Rápida urbana / Cocheras bus',
    deviceLabel: 'SVG + AHF-150A', deviceType: 'Sistema de carga',
    deviceDesc: 'SVG en estación de carga 10kV + AHF en lado CA de cargador rápido CC, transformador/banco cargador marcados',
    branches: [
      { label: 'Dist. 10kV', sub: 'Alimentación estación' },
      { label: 'Cargador rápido', sub: 'Carga de impacto' },
      { label: 'Cargador bus', sub: 'Carga por lotes' },
    ],
  },
];
export const railCases = [
  {
    title: 'Corrección de factor de potencia en un sitio de carga de VE — 100 kvar SVG en cada transformador',
    tabLabel: 'Sitio de carga VE',
    highlight: 'Factor de potencia mantenido en objetivo en stand-by y carga; recuperación en menos de dos años',
    image: '/assets/images/solutions-rail-case-charging.webp',
    industry: 'Carga de VE', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/es/contact',
    site: 'Un sitio de carga en dos transformadores, 2.500 kVA y 2.000 kVA. Medido en el panel de entrada de BT, el sitio estaba a factor de potencia capacitivo 0,1-0,2, porque los cargadores apenas toman potencia activa en stand-by mientras sus rectificadores siguen intercambiando reactivo.',
    overview: 'Sitio de carga en dos transformadores (2.500 kVA y 2.000 kVA). Medido en el panel de entrada de BT, el sitio trabajaba a factor de potencia capacitivo 0,1-0,2 porque los cargadores apenas toman potencia activa en stand-by mientras sus rectificadores siguen intercambiando reactivo — un banco de condensadores convencional no puede seguir eso. Se desmontó y reutilizó un armario de condensadores existente para alojar los módulos SVG.',
    limitations: 'La cifra de ahorro sigue de la tarifa y el perfil de carga propios del sitio y no es transferible a otro. La precisión de TC de clase 0,2 o mejor es un prerrequisito, no una opción.',
    trend: 'Factor de potencia 0,1-0,2 capacitivo → valor objetivo mantenido en stand-by y bajo carga',
    solution: [{ product: 'SVG-100kvar', qty: 2, use: 'Uno por transformador; modo reactivo constante cubre la condición de stand-by' }],
    results: [
      'Factor de potencia en objetivo en stand-by y en carga',
      'Unos 76.000 CNY ahorrados por año en los dos transformadores',
      'Pérdidas de línea reducidas y tensión de final de línea mejorada',
      'Recuperación en menos de dos años; armario de condensadores existente reutilizado en lugar de nuevo',
      'Requiere TC de clase 0,2 o mejor — la corriente de stand-by es muy baja',
    ],
  },
  {
    title: 'Configuración típica — Metro y ferrocarril ligero',
    tabLabel: 'Metro y ferrocarril ligero',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-rail-case-metro.webp',
    industry: 'Configuración típica · Metro y LRT', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una red de metro o ferrocarril ligero: SVG en el bus de anillo para soporte reactivo y de tensión, AHF en el rectificador de la subestación de tracción.',
    overview: 'Para redes de metro y ferrocarril ligero, la disposición habitual es un SVG en el bus de anillo más AHF en el rectificador de la subestación de tracción. Los armónicos característicos del rectificador y la elevación de tensión por frenado regenerativo son las dos cosas que deben medirse antes de dimensionar nada.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG-300A', qty: 3, use: 'Compensación reactiva de bus de anillo' }, { product: 'AHF-200A', qty: 6, use: 'Filtrado armónico de subestación de tracción' }],
    results: [
      'Espectro armónico de rectificador medido en la subestación antes de dimensionar',
      'Elevación de tensión regenerativa comprobada frente a límites de enlace CC del inversor',
      'Consúltenos proyectos de referencia en metro y ferrocarril ligero',
    ],
  },
  {
    title: 'Configuración típica — Tracción de alta velocidad',
    tabLabel: 'Alta velocidad',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-rail-case-hsr.webp',
    industry: 'Configuración típica · Alta velocidad', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una subestación de tracción de 27,5 kV, donde la carga monofásica produce corriente de secuencia negativa y la alimentación AT sufre caída de tensión de final de línea.',
    overview: 'Para subestaciones de tracción conectadas V/V que alimentan catenaria monofásica, la disposición habitual es un SVG en el bus de tracción más AHF en la alimentación de la estación. La secuencia negativa en el PCC aguas arriba es la restricción vinculante, así que dirige la potencia — no el nivel armónico por sí solo.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG-27.5kV', qty: 2, use: 'Reactivo y equilibrio de bus de tracción' }, { product: 'AHF-200A', qty: 2, use: 'Filtrado armónico de alimentación de estación' }],
    results: [
      'Secuencia negativa en el PCC aguas arriba medida primero — fija la potencia',
      'Objetivo de límites GB/T 15543 de desequilibrio',
      'Consúltenos proyectos de referencia en tracción ferroviaria',
    ],
  },
];

// ===================== DATOS DE RENOVABLES =====================
export const rePainPoints = [
  {
    id: 'solar', label: 'PV solar', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Central fotovoltaica', sceneSubtitle: 'Gran escala / Distribuida / Agro-PV',
    cards: [
      { icon: 'sun', title: 'Armónicos de inversor', desc: 'Oscilación de banda ancha de multiinversor', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Riesgo de resonancia', sub: 'Resonancia filtro LCL + impedancia de red, oscilación de banda ancha, trip en cascada de inversor' }, { title: 'Incumplimiento de red', sub: 'Emisión armónica excede GB/T 14549 en PCC, orden de recorte de compañía' }] },
      { icon: 'activity', title: 'Tensión de red', desc: 'Fluctuación por variación de irradiancia', metric: 'PF bajo', metricLabel: 'Dif. reactiva', consequences: [{ title: 'Penalización de despacho', sub: 'Desviación reactiva del punto de despacho, fallo de evaluación AVC, deducción de ingresos' }, { title: 'Límite de tensión', sub: 'Efecto borde de nube, oscilación de tensión ±10% en < 1min, trip de protección de inversores' }] },
      { icon: 'battery-charging', title: 'Ondulación CC', desc: 'Reflexión de lado CA desde ondulación CC', metric: 'Sesgo CC', metricLabel: 'Sobrec. transformador', consequences: [{ title: 'Saturación de núcleo', sub: 'Componente CC causa media onda de saturación de núcleo de transformador, pico de corriente de magnetización, zumbido' }, { title: 'Pérdida de eficiencia', sub: 'Pérdida de núcleo extra + pérdida de cobre armónica, PR (ratio de rendimiento) baja 2-3 puntos' }] },
    ],
  },
  {
    id: 'wind', label: 'Parque eólico', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Parque eólico', sceneSubtitle: 'Onshore / Offshore / Distribuido',
    cards: [
      { icon: 'wind', title: 'Armónicos de convertidor', desc: 'Distorsión de orden bajo de convertidor pleno', metric: '>10%', metricLabel: 'THD', consequences: [{ title: 'Rechazo de red', sub: 'Armónicos 5º/7º dominantes, fallo de prueba de interconexión, costo de retraso de energización' }, { title: 'Resonancia de colector', sub: 'Capacitancia de cable 35kV + inductancia de transformador, resonancia paralela cerca de 7º' }] },
      { icon: 'trending-up', title: 'Fluctuación de viento', desc: 'Sobretensión reactiva de ráfaga/turbulencia', metric: 'Reactivo', metricLabel: 'Oscilación', consequences: [{ title: 'Penalización PF', sub: 'Oscilación reactiva rápida de ráfagas de viento, PF mensual < 0,85, cargo reactivo 2x' }, { title: 'Caza AVC', sub: 'Sistema AVC oscilando persiguiendo variación de viento, desgaste excesivo de tap, 5x mantenimiento' }] },
      { icon: 'component', title: 'Transformador de caja', desc: 'Desequilibrio de fase de carga auxiliar', metric: '>5%', metricLabel: 'Desequilibrio', consequences: [{ title: 'Incumplimiento límite', sub: 'Desequilibrio de suministro auxiliar monofásico, secuencia negativa excede límite de código de red' }, { title: 'Trip por sobrecalentamiento', sub: 'Desequilibrio + armónico combinados, alarma de temperatura de punto caliente de devanado, recorte forzado' }] },
    ],
  },
  {
    id: 'storage', label: 'Almacenamiento', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Sistema de almacenamiento', sceneSubtitle: 'Lado de red / Lado de usuario / Lado de fuente',
    cards: [
      { icon: 'battery-charging', title: 'Carga/Descarga', desc: 'Apilamiento armónico de multi-PCS', metric: '>6%', metricLabel: 'THD', consequences: [{ title: 'Contaminación de red', sub: 'Armónicos entrelazados multi-PCS, THD PCC excede GB/T 34120, aviso de operador de red' }, { title: 'Ondulación de batería', sub: 'Corriente de ondulación CA en bus CC, aceleración de plateado de litio, vida de ciclo reducida 20%' }] },
      { icon: 'arrow-left-right', title: 'Reactivo PCS', desc: 'Regulación en atraso a carga baja', metric: '< 0,9', metricLabel: 'PF', consequences: [{ title: 'Cargo por penalización', sub: 'Consumo reactivo en modo stand-by dispara penalización, cargo mensual + trinquete de demanda' }, { title: 'Fallo de regulación', sub: 'Punto de despacho AGC/AVC conjunto no cumplido, revocada calificación de servicio auxiliar' }] },
      { icon: 'globe', title: 'Punto de red', desc: 'Parpadeo de tensión en interconexión', metric: '> 0,8', metricLabel: 'Pst', consequences: [{ title: 'Fallo de interconexión', sub: 'Parpadeo Pst > 0,8 durante transición de modo, incumplimiento de acuerdo de interconexión' }, { title: 'Riesgo de isla', sub: 'Detección de perturbación de red confundida por parpadeo, isla no intencionada, riesgo de seguridad' }] },
    ],
  },
];
export const reTopology = [
  {
    id: 'solar', sceneName: 'Topología PV solar', sceneSubtitle: 'Gran escala / Distribuida / Agro-PV',
    deviceLabel: 'SVG+AHF', deviceType: 'Sistema de calidad PV',
    deviceDesc: 'SVG en bus de elevación 35kV + AHF en lado CA de inversor, caja combinadora marcada',
    branches: [
      { label: 'Caja combinadora', sub: 'Colección CC' },
      { label: 'Inversor CA', sub: 'Fuente armónica' },
      { label: 'Elevación 35kV', sub: 'Interconexión red' },
    ],
  },
  {
    id: 'wind', sceneName: 'Topología de parque eólico', sceneSubtitle: 'Onshore / Offshore / Distribuido',
    deviceLabel: 'SVG-690V + AHF-100A', deviceType: 'Sistema de calidad eólica',
    deviceDesc: 'SVG-690V en lado de turbina + AHF en BT de transformador de caja, línea colectora 35kV marcada',
    branches: [
      { label: 'Conv. turbina', sub: 'Fuente armónica' },
      { label: 'Transformador caja', sub: 'Carga desequilibrada' },
      { label: 'Colectora 35kV', sub: 'Conexión red' },
    ],
  },
  {
    id: 'storage', sceneName: 'Topología de almacenamiento', sceneSubtitle: 'Lado de red / Lado de usuario / Lado de fuente',
    deviceLabel: 'Combo AHF+SVG', deviceType: 'Sistema de calidad almacenamiento',
    deviceDesc: 'Combo SVG+AHF en lado CA PCS, clúster de batería / PCS / transformador / punto de red marcados',
    branches: [
      { label: 'Clúster batería', sub: 'Fuente CC' },
      { label: 'Lado CA PCS', sub: 'Bidireccional' },
      { label: 'Punto de red', sub: 'Interconexión' },
    ],
  },
];
export const reCases = [
  {
    title: 'Configuración típica — Central fotovoltaica',
    tabLabel: 'Central PV',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-renewable-case-solar.webp',
    industry: 'Configuración típica · PV solar', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una central PV de gran escala o distribuida: SVG en el bus de elevación, AHF en las alimentaciones CA de los inversores.',
    overview: 'Para PV de gran escala y distribuida, la disposición habitual es un SVG en el bus de elevación más AHF en las alimentaciones CA de los inversores. La resonancia multiinversor y los balanceos reactivos de borde de nube son los dos modos de fallo — ambos requieren una campaña de medición antes de fijar las potencias.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG', qty: 2, use: 'Soporte reactivo de bus de elevación' }, { product: 'AHF-200A', qty: 4, use: 'Filtrado armónico de alimentación CA de inversor' }],
    results: [
      'Barrido de resonancia en toda la red colectora antes de dimensionar',
      'Envolvente reactiva comprobada frente al punto de despacho AVC',
      'Consúltenos proyectos de referencia en PV solar',
    ],
  },
  {
    title: 'Configuración típica — Parque eólico',
    tabLabel: 'Parque eólico',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-renewable-case-wind.webp',
    industry: 'Configuración típica · Parque eólico', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/es/contact',
    site: 'Disposición ilustrativa para un parque eólico onshore u offshore, donde los convertidores plenos y la capacitancia de cable colector interactúan cerca del armónico 7º.',
    overview: 'Para turbinas de convertidor pleno, la disposición habitual es un SVG en el bus colector más AHF en las alimentaciones colectoras. La capacitancia de cable frente a la inductancia de transformador suele poner un punto de resonancia paralela cerca del armónico 7º, así que el sistema colector se modela antes de pedir nada.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG-690V', qty: 2, use: 'Soporte reactivo de bus colector' }, { product: 'AHF-100A', qty: 2, use: 'Filtrado armónico de alimentación colectora' }],
    results: [
      'Punto de resonancia colectora modelado frente a capacitancia de cable',
      'Oscilación reactiva por ráfagas medida durante una temporada completa si es posible',
      'Consúltenos proyectos de referencia en eólica',
    ],
  },
  {
    title: 'Configuración típica — Almacenamiento de baterías',
    tabLabel: 'Almacenamiento batería',
    highlight: 'Configuración ilustrativa — el dimensionado parte de una encuesta de calidad de energía del sitio',
    image: '/assets/images/solutions-renewable-case-storage.webp',
    industry: 'Configuración típica · Almacenamiento', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/es/contact',
    site: 'Disposición ilustrativa para una instalación de baterías de lado de red, lado de usuario o lado de fuente, donde las unidades PCS entrelazan armónicos y el modo stand-by baja el factor de potencia.',
    overview: 'Para almacenamiento de lado de red y lado de usuario, la disposición habitual es una combinación SVG + AHF en el bus CA PCS. Las transiciones de carga/descarga son el caso de estrés: entrelazado armónico multi-PCS más un escalón de parpadeo en el cambio de modo, ambos medidos en el punto de acoplamiento común.',
    trend: '',
    note: 'Configuración ilustrativa — no un proyecto entregado concreto. Los proyectos de referencia en este sector están disponibles a petición.',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'Acondicionamiento de calidad de energía en bus CA PCS' }, { product: 'PQ Gateway', qty: 1, use: 'Monitoreo de cumplimiento de red' }],
    results: [
      'Transición carga/descarga medida, no supuesta',
      'Parpadeo en el punto de interconexión comprobado frente al acuerdo de red',
      'Consúltenos proyectos de referencia en almacenamiento de energía',
    ],
  },
];

// ===================== MAPA DE DATOS =====================
export const dataMap = {
  commercial: { painPoints: painPointScenes, topology: topologyScenes, cases: cases },
  grid:       { painPoints: gridPainPoints, topology: gridTopology, cases: gridCases },
  datacenter: { painPoints: dcPainPoints, topology: dcTopology, cases: dcCases },
  industry:   { painPoints: indPainPoints, topology: indTopology, cases: indCases },
  rail:       { painPoints: railPainPoints, topology: railTopology, cases: railCases },
  renewable:  { painPoints: rePainPoints, topology: reTopology, cases: reCases },
};
export const industryTitles = {
  commercial: 'Casos de estudio de edificio comercial y sanitario',
  grid: 'Casos de estudio de red eléctrica',
  datacenter: 'Casos de estudio de centro de datos',
  industry: 'Casos de estudio de industria manufacturera',
  renewable: 'Casos de estudio de energías renovables',
  rail: 'Casos de estudio de ferrocarril',
};
export const heroImages = {
  commercial: '/assets/images/solutions-commercial-medical-hero-bg.webp',
  grid: '/assets/images/solutions-grid-hero-bg.webp',
  datacenter: '/assets/images/solutions-datacenter-hero-bg.webp',
  industry: '/assets/images/solutions-industrial-hero-bg.webp',
  renewable: '/assets/images/solutions-renewable-hero-bg.webp',
  rail: '/assets/images/solutions-rail-hero-bg.webp',
};
