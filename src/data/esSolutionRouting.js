// Traducido desde enSolutionRouting.js (fuente única en español). Las claves de dispositivo son: 'ahf' | 'svg' | 'both'.

export const ROUTE_DEVICE_LABEL = {
  ahf: 'AHF',
  svg: 'SVG',
  both: 'AHF + SVG',
};

export const SYMPTOM_ROUTES = [
  {
    id: 'neutral-overheat',
    symptom: 'El conductor neutro se calienta, o su corriente se acerca a la de la fase',
    measure: 'Corriente de neutro frente a la de fase, y el contenido de armónicos 3º y 9º en el neutro',
    device: 'ahf',
    why: 'Los armónicos tríplices de las cargas electrónicas monofásicas se suman en el neutro en lugar de cancelarse. El AHF es el único de los dos que los elimina.',
    note: 'Compruebe primero el equilibrio trifásico: el solo desequilibrio puede cargar el neutro sin ningún armónico.',
  },
  {
    id: 'capacitor-resonance',
    symptom: 'Fallan los condensadores de corrección de factor de potencia, o el interruptor trip sin fallo claro',
    measure: 'Si el banco de condensadores y la inductancia del transformador forman una resonancia paralela cerca de algún armónico presente',
    device: 'ahf',
    why: 'El banco de condensadores está amplificando armónicos en lugar de filtrarlos. El filtrado selectivo de 3º / 5º / 7º con control antirresonancia permite que el banco se mantenga.',
    note: 'Dónde muestrea el TC del filtro decide si se excita la resonancia LC. Muestrear en el lado de carga es la alternativa.',
  },
  {
    id: 'pf-penalty',
    symptom: 'Penalización por factor de potencia de la compañía eléctrica, o cargo por energía reactiva en la factura',
    measure: 'Factor de potencia y demanda de reactivo en todo el ciclo de carga, incluyendo stand-by y noches',
    device: 'svg',
    why: 'El SVG mantiene el factor de potencia objetivo de forma continua, incluso con carga activa cercana a cero, donde un banco de condensadores pierde el control.',
    note: 'Si el sitio tiene escalones de condensadores conmutados, el SVG también elimina la sobrecompensación a carga ligera.',
  },
  {
    id: 'leading-pf',
    symptom: 'El factor de potencia se lee en adelanto durante la noche o el fin de semana',
    measure: 'Factor de potencia a carga mínima, y cualquier capacitancia de cable subterráneo largo',
    device: 'svg',
    why: 'La capacitancia del cable genera reactivo a carga ligera. El SVG lo absorbe en lugar de añadir más.',
    note: 'Un banco de condensadores convencional solo puede añadir reactivo, por lo que no corrige esto.',
  },
  {
    id: 'voltage-sag',
    symptom: 'Los equipos trip o se reinician ante huecos de tensión cortos',
    measure: 'Profundidad y duración del hueco registradas en los bornes del equipo durante los eventos',
    device: 'svg',
    why: 'El SVG responde en un ciclo y sostiene la tensión del bus. Reduce la profundidad y duración del hueco, pero no sustituye a un UPS ante una caída sostenida.',
    note: 'Cuando el hueco lo causa un arranque de motor grande en el mismo bus, el soporte reactivo de bus suele ser más eficaz que un transformador de fuente mayor.',
  },
  {
    id: 'voltage-flicker',
    symptom: 'Las luces parpadean visiblemente cuando hornos, soldadoras o grandes accionamientos ciclan',
    measure: 'Severidad de parpadeo a corto plazo Pst / Plt en el punto de acoplamiento común',
    device: 'svg',
    why: 'El parpadeo viene de una demanda de reactivo que oscila rápido. El SVG sigue la oscilación y la cancela; el AHF no trata el balanceo reactivo.',
    note: 'El parpadeo de una sola carga de arco intermitente puede requerir mirar la propia carga antes de fijar el reactivo.',
  },
  {
    id: 'thd-high',
    symptom: 'La distorsión armónica de la alimentación de entrada supera el límite acordado o legal',
    measure: 'Espectro armónico de corriente y tensión, y qué órdenes llevan más corriente',
    device: 'ahf',
    why: 'El AHF inyecta corriente de cancelación orden a orden, dimensionado al espectro medido en lugar de a la potencia de la carga.',
    note: 'Dimensionar solo desde el kVA del transformador es la causa más común de que una instalación quede subdimensionada. Mida primero.',
  },
  {
    id: 'transformer-overheat',
    symptom: 'El transformador trabaja más caliente de lo que sugiere su carga, o está subdimensionado',
    measure: 'Contribución de pérdidas por armónicos, y el factor K o la reducción de capacidad que exige esta mezcla de carga',
    device: 'ahf',
    why: 'Las corrientes armónicas causan pérdidas eddy y dispersas extra que el kVA estándar no contabiliza. Elimine los armónicos y elimina esa pérdida.',
    note: 'La reducción de capacidad es un síntoma, no el problema. Confirme la contribución armónica antes de declarar el transformador pequeño.',
  },
  {
    id: 'vfd-bank',
    symptom: 'Aparece distorsión armónica tras una reforma de variadores o una nueva línea de accionamientos',
    measure: 'Espectro armónico en la alimentación de los variadores, en su punto de funcionamiento',
    device: 'ahf',
    why: 'El rectificador de seis pulsos de los variadores es una fuente armónica característica. La distorsión escala con la carga del variador, así que la salida del AHF baja con la carga.',
    note: 'Varios variadores en un mismo bus entrelazan sus armónicos; la emisión combinada no es la suma de sus potencias.',
  },
  {
    id: 'inverter-resonance',
    symptom: 'Los inversores o unidades PCS de un sitio de PV, eólica o almacenamiento trip a la vez',
    measure: 'Oscilación de banda ancha, y el punto de resonancia de los filtros del inversor y la impedancia de colector o red',
    device: 'both',
    why: 'Un sitio multiinversor produce armónicos de conmutación entrelazados y un balanceo reactivo que varía con la salida; ambos se dimensionan por separado.',
    note: 'El barrido de resonancia es un estudio de sistema, no una selección de equipo. La capacidad sale del estudio.',
  },
  {
    id: 'load-step',
    symptom: 'La tensión cae cada vez que una carga grande o un banco de cargadores arranca junto',
    measure: 'Tamaño y tasa de repetición del escalón frente a los límites de parpadeo y cambio de tensión del sitio',
    device: 'both',
    why: 'El escalón en sí es en gran parte un evento reactivo, así que el SVG lleva la mayor parte. Cuando los cargadores o rectificadores también añaden armónicos, añada AHF en el mismo bus.',
    note: 'La exposición a cargo por demanda del mismo escalón es un tema tarifario, ajeno al tratamiento de calidad de energía.',
  },
  {
    id: 'phase-imbalance',
    symptom: 'Una fase lleva claramente más corriente que las otras, o los motores se calientan',
    measure: 'Corrientes de secuencia negativa y cero, y cómo se reparte la carga monofásica entre fases',
    device: 'both',
    why: 'Un problema de reparto hay que resolver primero. El AHF elimina el componente armónico encima; el SVG sostiene la tensión donde el desequilibrio es sostenido.',
    note: 'Siempre considere reequilibrar la carga monofásica antes de comprar equipo.',
  },
];

export const DECISION_TREE = {
  start: {
    question: '¿Qué muestra primero la medición?',
    options: [
      { label: 'Distorsión de corriente por encima del límite', next: 'has-capacitor' },
      { label: 'Factor de potencia bajo, o cargo por energía reactiva', next: 'light-load' },
      { label: 'Hundimiento o parpadeo de tensión en escalones de carga', next: 'sag-source' },
      { label: 'Corriente de neutro alta, o fallos repetidos de condensadores', next: 'done-ahf' },
    ],
  },
  'has-capacitor': {
    question: '¿Hay ya un banco de condensadores en el mismo bus?',
    options: [
      { label: 'Sí, y se mantiene', next: 'done-ahf-resonance' },
      { label: 'Sí, pero se puede reemplazar o retirar', next: 'done-ahf' },
      { label: 'No hay banco de condensadores en el sitio', next: 'done-ahf' },
    ],
  },
  'light-load': {
    question: '¿Cuál es el factor de potencia a carga mínima, de noche o fin de semana?',
    options: [
      { label: 'Sigue bajo o en atraso', next: 'done-svg' },
      { label: 'Oscila, o se lee en adelanto', next: 'done-svg' },
      { label: 'Bueno a carga ligera, bajo solo en el pico', next: 'done-svg' },
    ],
  },
  'sag-source': {
    question: '¿Con qué correlaciona el hueco?',
    options: [
      { label: 'Arranque de motor o accionamiento grande en el mismo bus', next: 'done-svg' },
      { label: 'Varios cargadores o rectificadores que arrancan juntos', next: 'done-both' },
      { label: 'Un evento de suministro aguas arriba, no la carga del sitio', next: 'done-svg-external' },
    ],
  },
  // ---- Resultados ----
  'done-ahf': {
    device: 'ahf',
    heading: 'Empiece con un filtro activo de armónicos (AHF)',
    body: 'Dimensione el filtro desde el espectro armónico medido en el punto de acoplamiento común, no desde la potencia del transformador. La salida sigue la carga, así que el filtro no necesita dimensionarse para una coincidencia que nunca ocurre.',
    nextSteps: [
      'Registre el espectro armónico de la alimentación de entrada durante un ciclo de trabajo completo',
      'Anoté los órdenes peores y la corriente que llevan',
      'Elija la potencia de rack desde la corriente armónica medida, con margen de crecimiento',
    ],
  },
  'done-ahf-resonance': {
    device: 'ahf',
    heading: 'Empiece con un AHF con control antirresonancia',
    body: 'El banco de condensadores es la parte difícil. La resonancia paralela entre el banco y la inductancia del transformador amplifica los armónicos en lugar de eliminarlos, así que el filtro debe funcionar con filtrado de órdenes selectivos y control antirresonancia mientras el banco sigue en servicio.',
    nextSteps: [
      'Confirme si el TC del filtro muestrea por el lado de red o de carga',
      'Si la conexión está aguas abajo de un banco de condensadores puro, planee mover el muestreo o acepte el control antirresonancia',
      'Compruebe el punto de resonancia frente a los armónicos realmente presentes',
    ],
  },
  'done-svg': {
    device: 'svg',
    heading: 'Empiece con un generador estático de var (SVG)',
    body: 'El SVG mantiene el factor de potencia objetivo de forma continua y puede suministrar y absorber reactivo. Por eso funciona a carga ligera, donde un banco de condensadores o sobrecompensa o hay que desconectarlo.',
    nextSteps: [
      'Mida el perfil reactivo en todo el ciclo de carga, no solo en el pico',
      'Compruebe el factor de potencia a carga mínima por si hay adelanto',
      'Dimensione al balanceo reactivo y fije el factor de potencia objetivo por adelantado',
    ],
  },
  'done-svg-external': {
    device: 'svg',
    heading: 'El soporte reactivo ayuda, pero solo como parte de un plan más amplio',
    body: 'El SVG puede sostener la tensión del bus durante un evento, pero un hueco originado aguas arriba no se elimina en el bus de BT. El soporte reactivo de bus reduce profundidad y duración; cualquier cosa más allá de unos ciclos debe cubrirla un UPS o una solución de red.',
    nextSteps: [
      'Separe los huecos originados en el sitio de los eventos de suministro',
      'Registre profundidad y duración del hueco en los bornes del equipo que trip',
      'Compare la curva de tolerancia del equipo con el registro',
    ],
  },
  'done-both': {
    device: 'both',
    heading: 'Planee AHF y SVG juntos',
    body: 'Una carga que es a la vez escalón y fuente armónica necesita ambos. El SVG lleva el escalón reactivo; el AHF elimina los armónicos que los rectificadores añaden en el mismo bus. Se miden y dimensionan por separado.',
    nextSteps: [
      'Mida el tamaño y la tasa de repetición del escalón en el punto de acoplamiento común',
      'Mida a la vez el espectro armónico en el mismo bus',
      'Reparta la capacidad entre los dos dispositivos según esas dos mediciones',
    ],
  },
};
