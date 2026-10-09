// Extracted from src/pages/en/solutions.astro (single source of truth for EN solutions data).
// Do not hand-edit the arrays; edit the page and re-extract, or edit both.

export const industries = [
  { id: 'industry', label: 'Industrial', icon: 'factory' },
  { id: 'commercial', label: 'Commercial & Medical', icon: 'building-2' },
  { id: 'datacenter', label: 'Data Center', icon: 'server' },
  { id: 'renewable', label: 'Renewable Energy', icon: 'zap' },
  { id: 'rail', label: 'Rail Transit', icon: 'train-front' },
  { id: 'grid', label: 'Power Grid', icon: 'globe' },
];

let activeIndustry = 'commercial';

export const painPointScenes = [
  {
    id: 'medical', label: 'Medical', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Medical Scenario', sceneSubtitle: 'Hospital / Clinic / Rehabilitation',
    cards: [
      { icon: 'activity', title: 'CT / MRI', desc: 'Imaging Equipment', metric: '15%', metricLabel: 'THD', consequences: [{ title: 'Image Artifacts', sub: 'Misdiagnosis risk, requires repeat scans, doubling patient wait time' }, { title: 'Equipment Overheat', sub: 'Transformer derating, shortened component lifespan, unplanned maintenance' }] },
      { icon: 'heart-pulse', title: 'Operating Room', desc: 'Surgical Equipment', metric: 'ms-level', metricLabel: 'Voltage Sag', consequences: [{ title: 'Surgery Interruption', sub: 'Momentary outage, equipment reboot cycle, procedure delays' }, { title: 'Life Safety Risk', sub: 'Critical support equipment malfunction, emergency backup transfer latency' }] },
      { icon: 'flask-conical', title: 'Laboratory', desc: 'Sensitive Analyzers', metric: 'High', metricLabel: 'Zero-seq. Current', consequences: [{ title: 'Phase Imbalance', sub: 'Precision instrument drift, calibration invalidated, reagent waste' }, { title: 'Neutral Overload', sub: 'Overheated conductors, fire risk, N-line burnout potential' }] },
    ],
  },
  {
    id: 'office', label: 'Commercial Office', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Commercial Office Scenario', sceneSubtitle: 'Office / Mall / Hotel',
    cards: [
      { icon: 'lightbulb', title: 'Lighting', desc: 'LED Driver Harmonic', metric: '23%', metricLabel: 'THD', consequences: [{ title: 'Severe Flicker', sub: 'Visual fatigue, reduced productivity, occupant discomfort complaints' }, { title: 'Neutral Overheat', sub: 'Triplen harmonic accumulation, N-line burnout, fire hazard' }] },
      { icon: 'arrow-up-down', title: 'Elevator', desc: 'VFD Start-up Surge', metric: '7x', metricLabel: 'Inrush', consequences: [{ title: 'Voltage Dip', sub: 'Equipment trip, control system reset, passenger entrapment risk' }, { title: 'Mechanical Wear', sub: 'Frequent maintenance, brake pad replacement, rope fatigue' }] },
      { icon: 'thermometer-snowflake', title: 'HVAC', desc: 'Compressor Reactive', metric: '0.65', metricLabel: 'Power Factor', consequences: [{ title: 'Penalty Charge', sub: 'Utility power factor surcharge, monthly bill 30%+ increase' }, { title: 'Transformer Overload', sub: 'Excess reactive current, overheating, shortened service life' }] },
    ],
  },
  {
    id: 'lab', label: 'Lab / Cleanroom', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Lab & Cleanroom', sceneSubtitle: 'Semiconductor / Biotech / Precision Mfg',
    cards: [
      { icon: 'wind', title: 'Cleanroom', desc: 'FFU Fan VFD', metric: '> 1.0', metricLabel: 'Pst Flicker', consequences: [{ title: 'Yield Loss', sub: 'Wafer defect density increase, batch rejection, revenue impact' }, { title: 'Light Fluctuation', sub: 'Photolithography misalignment, inspection false rejects' }] },
      { icon: 'cpu', title: 'Lab Equipment', desc: 'Sensitive Instruments', metric: '30%', metricLabel: 'Voltage Dip', consequences: [{ title: 'Data Loss', sub: 'Unsaved measurement data, experiment interruption, reagent waste' }, { title: 'Calibration Drift', sub: 'Post-sag recalibration required, 4-8 hrs instrument downtime' }] },
      { icon: 'toy-brick', title: 'Cooling Pumps', desc: 'Motor Start-up', metric: '5~8x', metricLabel: 'Inrush', consequences: [{ title: 'Bus Voltage Drop', sub: 'Cascade trip risk, neighboring equipment brownout, batch shutdown' }, { title: 'Breaker Trip', sub: 'False overcurrent trip, unplanned production halt, restart SOP' }] },
    ],
  },
];

export const topologyScenes = [
  {
    id: 'medical', sceneName: 'Medical Topology', sceneSubtitle: 'Hospital / Clinic / Rehabilitation',
    deviceLabel: 'AHF-200A', deviceType: 'Active Harmonic Filter',
    deviceDesc: 'Parallel-connected to LV busbar, mitigates harmonics for OR / imaging / lab power distribution',
    branches: [
      { label: 'OR Power Dist.', sub: 'Voltage Sag Protection' },
      { label: 'Imaging Power', sub: 'CT / MRI Harmonics' },
      { label: 'Lab Power Dist.', sub: 'Phase Imbalance' },
    ],
  },
  {
    id: 'office', sceneName: 'Commercial Office Topology', sceneSubtitle: 'Office / Mall / Hotel',
    deviceLabel: 'SVG-300A', deviceType: 'Static Var Generator',
    deviceDesc: 'SVG at LV bus, compensates reactive power for elevator / lighting / HVAC circuits',
    branches: [
      { label: 'Lighting Power', sub: 'Harmonic Source' },
      { label: 'Elevator Power', sub: 'VFD Surge' },
      { label: 'HVAC Power', sub: 'Reactive Load' },
    ],
  },
  {
    id: 'lab', sceneName: 'Lab & Cleanroom Topology', sceneSubtitle: 'Semiconductor / Biotech / Precision Mfg',
    deviceLabel: 'AHF-150A', deviceType: 'Active Harmonic Filter',
    deviceDesc: 'Series-connected at UPS front-end for process cooling / lab equipment harmonic suppression',
    branches: [
      { label: 'UPS Front-end', sub: 'Precision Power' },
      { label: 'Process Cooling', sub: 'Pump Inrush' },
      { label: 'Lab Equipment', sub: 'Sensitive Load' },
    ],
  },
];

export const cases = [
  {
    title: 'LED Lighting Harmonic & Neutral Overload Retrofit — Wholesale Mall, Guangzhou',
    tabLabel: 'LED & neutral, mall',
    highlight: 'Current distortion 49% → 2.75%; neutral zero-sequence current 365.76 A → 25.19 A',
    image: '/assets/images/solutions-commercial-medical-case-office.webp',
    industry: 'Commercial Building', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/en/contact',
    site: 'A wholesale garment market on a single 2,500 kVA transformer at roughly 90% load, with two compensation cabinets totalling 600 kvar. The dominant load is single-phase LED lighting and LED video walls on the trading floors.',
    harmonics: [
      'Floor 1 phase current distortion 49% before the retrofit',
      'Neutral zero-sequence harmonic current 365.76 A',
      'Neutral apparent current 369 A, including unbalance current',
      'Busbar voltage distortion 4.75%',
    ],
    overview: '2,500 kVA transformer at 90% load with 600 kvar of capacitor banks. LED lighting and LED video walls fill the mall — single-phase LED drivers inject heavy 3rd harmonic that adds up on the neutral conductor, taking current distortion to 49% and overloading the N line.',
    limitations: 'Measured on the floor incoming feeders rather than at the utility metering point, so the figures describe the building distribution, not the site\'s PCC. Only two floors were treated.',
    trend: 'Distortion 49% → 2.75%  ·  Neutral current 369 A → 36.51 A',
    solution: [{ product: 'AHF-200A', qty: 2, use: '3-phase 4-wire, main incoming switch on each trading floor' }],
    results: [
      'Neutral zero-sequence harmonic 365.76 A → 25.19 A',
      'Neutral apparent current 369 A → 36.51 A (including unbalance current)',
      'Busbar voltage distortion 4.75% → 3.75%',
      'Accepted on test against GB/T 14549',
    ],
  },
  {
    title: 'Anti-Resonance Harmonic Retrofit — Medical Device Manufacturer, Dongguan',
    tabLabel: 'Anti-resonance, medical',
    highlight: 'Harmonic current 108 A → 25 A per phase with the capacitor bank in service, no LC resonance',
    image: '/assets/images/solutions-commercial-medical-case-hospital.webp',
    industry: 'Medical & Healthcare', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/en/contact',
    site: 'Three transformers at a medical device plant, each carrying a 600 kvar pure capacitor bank and running between 60% and 80% load. The site had repeated capacitor and switchgear failures, which is what triggered the survey.',
    harmonics: [
      'Total harmonic current, TR1 phases A / B / C: 108.16 / 106.64 / 79.22 A',
      'TR1 phase A, 3rd harmonic: 70.87 A',
      'TR1 phase A, 5th harmonic: 50.78 A',
      'TR1 phase A, 7th harmonic: 59.10 A',
      'Reactive demand 168.91 kvar, power factor 0.967',
    ],
    overview: 'Three transformers, each with 600 kvar of pure capacitor compensation, running at 60–80% load. The site had recurring capacitor and switchgear failures. The hard part: filter CTs sample on the grid side and the connection is taken downstream of a pure capacitor bank — the usual workaround is to move CT sampling to the load side. Selective 3rd / 5th / 7th filtering with intelligent-coupling anti-resonance control held the installation stable in this configuration.',
    limitations: 'The report does not state the filter frame ratings selected, so only the measured before-and-after currents are published here. Results are for transformer TR1 unless stated otherwise.',
    trend: 'TR1 harmonic current (A/B/C): 108.16 / 106.64 / 79.22 A → 25.27 / 26.68 / 22.79 A',
    solution: [{ product: 'AHF', qty: 3, use: 'One per transformer (TR1 / TR2 / TR3), selective 3rd / 5th / 7th filtering' }],
    results: [
      'No LC resonance after energisation, capacitor bank in service throughout',
      'Phase A: 3rd 70.87 A → 1.31 A, 5th 50.78 A → 5.32 A, 7th 59.10 A → 3.28 A',
      'Reactive demand 168.91 kvar → 133.97 kvar; power factor 0.967 → 0.978',
      'Recurring capacitor and switchgear failures resolved',
    ],
  },
  {
    title: 'Resonance-Free Harmonic Control at a Large Livestock Farm, Anhui',
    tabLabel: 'Anti-resonance, agri',
    highlight: 'Distortion near 50% → about 5%, power factor 0.87 → 0.99 — after another brand was returned',
    image: '/assets/images/solutions-commercial-medical-case-lab.webp',
    industry: 'Agri & Food Production', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/en/contact',
    site: 'A livestock operation with dense automation and environmental monitoring, sitting far from the source point on a weak grid, with a cramped switchroom and no space for conventional cubicles. Lighting, air conditioning and ventilation are all power-electronic loads.',
    harmonics: [
      'Running current 706 A at the time of the survey',
      'Current distortion close to 50%, about 342.6 A of harmonic current',
      'Power factor 0.87 before the retrofit',
      'Switchroom with no space for conventional cubicles',
    ],
    overview: 'A fast-growing livestock operation running dense automation and environmental monitoring. Lighting, air conditioning and ventilation fans are all power-electronic loads; the site sits far from the source point on a weak grid; and the switchroom is cramped. A previous supplier’s active filters went resonant on energisation — transformer humming, motors running unstable — and were returned.',
    limitations: 'A previous supplier\'s active filters went resonant on this site and were returned; that history is described because it shaped the selection, not as a comparison of named brands. No before-and-after spectrum chart is published for this project.',
    trend: 'Distortion ~50% (342.6 A) → ~5%  ·  Power factor 0.87 → 0.99',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'Anti-resonance models, AI-tuned response cycle and output derating' }],
    results: [
      'Harmonics and resonance both cleared — harmonics and resonance were "eliminated the moment it was energised, beyond expectations" (customer)',
      'Power factor lifted from about 0.87 to 0.99',
      'High power density fits the existing switchroom — up to 900 A in a single cabinet',
      'Sensitive automatic control and monitoring equipment protected',
    ],
  },
];

// ===================== GRID DATA =====================
export const gridPainPoints = [
  {
    id: 'transmission', label: 'Transmission', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Transmission & Distribution', sceneSubtitle: 'Substation / Distribution / Rural Upgrade',
    cards: [
      { icon: 'network', title: 'Nonlinear Load', desc: 'Harmonic Injection from industrial & traction loads', metric: '>10%', metricLabel: 'THD', consequences: [{ title: 'Transformer Overheat', sub: 'Excess harmonic loss, insulation aging, forced derating up to 30% capacity' }, { title: 'Protection Misoperation', sub: 'Relay false trip, breaker nuisance operation, grid reliability degradation' }] },
      { icon: 'zap', title: 'Distributed Gen', desc: 'Grid Disturbance from DG interconnection', metric: '±10%', metricLabel: 'Voltage Fluct.', consequences: [{ title: 'Reverse Power Flow', sub: 'DG backfeed causes voltage rise, tap changer hunting, protection coordination failure' }, { title: 'Islanding Risk', sub: 'Unintentional island formation, out-of-sync reconnection, equipment damage' }] },
      { icon: 'git-branch', title: 'Line Reactive', desc: 'Long-distance transfer reactive loss', metric: '< 0.9', metricLabel: 'End V (pu)', consequences: [{ title: 'Line Loss Surge', sub: 'I²R loss exponential increase, rural feeder end-voltage collapse, load shedding' }, { title: 'Voltage Collapse Risk', sub: 'Reactive deficit cascade, wide-area blackout potential, N-1 contingency failure' }] },
    ],
  },
  {
    id: 'urban', label: 'Urban Dist.', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Urban Distribution Network', sceneSubtitle: 'City Center / Development Zone / Old Residential',
    cards: [
      { icon: 'plug-zap', title: 'EV Charging', desc: 'Impact surge from fast-charging clusters', metric: '120kW+', metricLabel: 'Load Step', consequences: [{ title: 'Grid Sag', sub: 'Concurrent charging peak causes 15%+ voltage dip, distribution transformer overload trip' }, { title: 'Harmonic Injection', sub: 'EV rectifier 6-pulse harmonics, THD exceeding 8% at PCC, grid pollution' }] },
      { icon: 'building-2', title: 'Commercial Load', desc: 'Phase imbalance from single-phase loads', metric: '>8%', metricLabel: 'Unbalance', consequences: [{ title: 'Neutral Overload', sub: 'Zero-sequence current accumulation, N-line burnout, fire hazard in old residential areas' }, { title: 'Motor Derating', sub: 'Negative-sequence heating in 3-phase motors, shortened service life, unplanned outage' }] },
      { icon: 'cable', title: 'Cable Network', desc: 'Capacitive reactive from underground cables', metric: 'Leading', metricLabel: 'PF > 0.95', consequences: [{ title: 'Over-compensation', sub: 'Cable capacitance causes leading PF at light load, voltage rise, insulation stress' }, { title: 'Resonance Risk', sub: 'Cable capacitance + transformer inductance parallel resonance, harmonic amplification' }] },
    ],
  },
  {
    id: 'microgrid', label: 'Microgrid', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Microgrid & CCHP', sceneSubtitle: 'Campus / Island / Remote Area',
    cards: [
      { icon: 'sun', title: 'Multi-source Grid', desc: 'Harmonic stacking from PV + wind + storage', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'PCC Violation', sub: 'Multi-inverter harmonic superposition, IEEE 519 PCC limit exceeded, grid operator penalty' }, { title: 'Resonance Instability', sub: 'LCL filter interaction, wideband oscillation, inverter cascade trip' }] },
      { icon: 'battery-charging', title: 'Storage Cycling', desc: 'Reactive fluctuation from charge/discharge', metric: 'PF Swing', metricLabel: '0.7~1.0', consequences: [{ title: 'Penalty Charge', sub: 'Bidirectional PF swing triggers utility reactive energy billing, monthly cost surge' }, { title: 'Cycle Life Loss', sub: 'Excess reactive current heats battery PCS, accelerated IGBT aging, warranty void risk' }] },
      { icon: 'shuffle', title: 'Grid Switching', desc: 'Voltage sag during island/grid transition', metric: '>20%', metricLabel: 'Sag Depth', consequences: [{ title: 'Load Trip', sub: 'STS transfer > 4ms causes contactor dropout, critical load UPS transfer to battery' }, { title: 'Diesel Start Fail', sub: 'Sag during generator start sequence, AVR excitation collapse, black-start failure' }] },
    ],
  },
];
export const gridTopology = [
  {
    id: 'transmission', sceneName: 'Transmission Topology', sceneSubtitle: 'Substation / Distribution / Rural Upgrade',
    deviceLabel: 'SVG + AHF', deviceType: 'Combined System',
    deviceDesc: 'SVG at 35kV/10kV bus for reactive + AHF at critical load feeder for harmonics, DG tie-point marked',
    branches: [
      { label: 'Critical Load', sub: 'Sensitive Equipment' },
      { label: 'DG Tie-point', sub: 'Reverse Power Flow' },
      { label: 'Rural Feed', sub: 'Long Line Drop' },
    ],
  },
  {
    id: 'urban', sceneName: 'Urban Distribution Topology', sceneSubtitle: 'City Center / Dev Zone / Old Residential',
    deviceLabel: 'SPC + SVG-10kV', deviceType: 'Distribution System',
    deviceDesc: 'SPC at 10kV feeder for balance + SVG at bus for reactive, EV station/commercial/resident marked',
    branches: [
      { label: 'EV Station', sub: 'Impact Load' },
      { label: 'Commercial Load', sub: 'Phase Imbalance' },
      { label: 'Residential', sub: 'Single-phase Load' },
    ],
  },
  {
    id: 'microgrid', sceneName: 'Microgrid Topology', sceneSubtitle: 'Campus / Island / Remote Area',
    deviceLabel: 'SVG+AHF + SPC', deviceType: 'Microgrid System',
    deviceDesc: 'SVG+AHF at PCC for power quality + SPC for load balance, PV/storage/diesel branch marked',
    branches: [
      { label: 'PV Array', sub: 'Intermittent Source' },
      { label: 'Battery PCS', sub: 'Bidirectional Flow' },
      { label: 'Diesel Gen', sub: 'Backup Supply' },
    ],
  },
];
export const gridCases = [
  {
    title: 'Typical Configuration — Transmission & Distribution Reactive Support',
    tabLabel: 'T&D reactive support',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-grid-case-substation.webp',
    industry: 'Typical Configuration · Power Grid', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for a substation or rural feeder upgrade: SVG on the 35 kV / 10 kV busbar for reactive and voltage support, with AHF placed only on the feeders carrying the worst harmonic load.',
    overview: 'For substations serving a mix of industrial and traction load, the usual arrangement is an SVG on the busbar for reactive voltage support plus AHF on the critical feeders for harmonics. Ratings are set by a survey, not by a template — the quantities below are a starting point only.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG', qty: 2, use: 'Busbar reactive voltage support' }, { product: 'AHF-200A', qty: 3, use: 'Critical feeder harmonic filtering' }],
    results: [
      'Sized from a measured harmonic spectrum and reactive profile',
      'Designed to GB/T 14549 limits at the point of common coupling',
      'Ask us for reference projects in transmission and distribution',
    ],
  },
  {
    title: 'Typical Configuration — Urban Distribution Network',
    tabLabel: 'Urban distribution',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-grid-case-urban.webp',
    industry: 'Typical Configuration · Urban Distribution', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for a city-centre or development-zone network carrying EV clusters, commercial single-phase load and cable-fed residential areas.',
    overview: 'For city-centre 10 kV networks carrying EV fast-charging clusters plus mixed commercial and residential load, the usual arrangement is a phase-balancing device at the charging feeder and an SVG on the feeder for reactive support. Underground cable capacitance at light load has to be checked before sizing, or the SVG will fight it.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SPC-150A', qty: 4, use: 'Charging bay 3-phase balancing' }, { product: 'SVG', qty: 2, use: 'Feeder reactive compensation' }],
    results: [
      'Sizing validated against a light-load capacitive check',
      'Targets GB/T 15543 unbalance limits at every charging station',
      'Ask us for reference projects in urban distribution',
    ],
  },
  {
    title: 'Typical Configuration — Microgrid & CCHP',
    tabLabel: 'Microgrid & CCHP',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-grid-case-microgrid.webp',
    industry: 'Typical Configuration · Microgrid', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/en/contact',
    site: 'An illustrative arrangement for a campus, island or remote microgrid combining PV, battery storage and diesel back-up on one point of common coupling.',
    overview: 'For island and campus microgrids combining PV, wind, storage and diesel, the usual arrangement is an SVG + AHF combination at the point of common coupling plus a balancing device across phases. Multi-inverter harmonic superposition and the island/grid transfer sag both have to be measured before ratings are fixed.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'PCC power quality conditioning' }, { product: 'SPC-100A', qty: 1, use: 'Load balance across phases' }],
    results: [
      'Harmonic study across all inverter types before sizing',
      'Island/grid transfer behaviour verified by measurement',
      'Ask us for reference projects in microgrids',
    ],
  },
];

// ===================== DATACENTER DATA =====================
export const dcPainPoints = [
  {
    id: 'cloud', label: 'Cloud Computing', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Large Cloud Computing Center', sceneSubtitle: 'HPC / Cloud Provider / Colocation',
    cards: [
      { icon: 'cloud', title: 'UPS Harmonics', desc: 'Reflective pollution from UPS rectifiers', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Parallel Circulation', sub: 'UPS harmonic current circulates between parallel units, load sharing imbalance, thermal runaway risk' }, { title: 'Battery Life ↓', sub: 'Harmonic ripple accelerates VRLA battery corrosion, 3-year life reduced to 18 months' }] },
      { icon: 'server', title: 'Server Farm', desc: 'Phase imbalance from single-phase IT load', metric: '>15%', metricLabel: 'Unbalance', consequences: [{ title: 'Neutral Overheat', sub: 'Triplen + phase imbalance combine, zero-seq > phase current, fire risk' }, { title: 'PDU Trip', sub: 'Per-phase overload despite avg below rating, rack PDU breaker nuisance trip, row outage' }] },
      { icon: 'fan', title: 'Cooling System', desc: 'Reactive impact from VFD chillers/CRAC', metric: 'PUE', metricLabel: 'Deterioration', consequences: [{ title: 'Transformer Overload', sub: 'Excess reactive consumes transformer capacity, forced cooling upgrade, CapEx waste' }, { title: 'Energy Penalty', sub: 'PUE 1.6→1.8 from reactive losses, annual OpEx +800K CNY at 10MW facility' }] },
    ],
  },
  {
    id: 'finance', label: 'Financial DC', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Financial Data Center', sceneSubtitle: 'Bank / Securities / Insurance',
    cards: [
      { icon: 'landmark', title: 'High-freq Trading', desc: 'Sag sensitive trading infrastructure', metric: '< 3ms', metricLabel: 'Sag Tolerance', consequences: [{ title: 'Trade Interrupt', sub: 'CBEMA/ITIC curve violation, server PSU dropout, millisecond sag = million-yuan loss' }, { title: 'Regulatory Fine', sub: 'CSRC trading continuity mandate, outage >5min triggers mandatory reporting, compliance penalty' }] },
      { icon: 'power', title: 'Diesel Switchover', desc: 'Transfer shock during genset test/outage', metric: '±15%', metricLabel: 'Voltage Step', consequences: [{ title: 'UPS Overload', sub: 'ATS transfer inrush, UPS switches to battery, rectifier walk-in overload, system crash' }, { title: 'Generator Hunting', sub: 'Load step causes governor oscillation, frequency >2% deviation, PSU shutdown' }] },
      { icon: 'thermometer', title: 'Precision HVAC', desc: 'Harmonic source from VFD compressors', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'PUE Rise', sub: 'Harmonic derating of cooling xfmrs, reduced cooling capacity, hot spot in racks' }, { title: 'Control Fault', sub: 'Harmonic noise on HVAC controller PSU, sensor drift, temperature oscillation' }] },
    ],
  },
  {
    id: 'edge', label: 'Edge Computing', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Edge Computing Node', sceneSubtitle: '5G Base / IoT / Distributed Room',
    cards: [
      { icon: 'router', title: 'Grid Quality', desc: 'Unstable supply at remote/rural sites', metric: '>20%', metricLabel: 'Sag Depth', consequences: [{ title: 'Node Offline', sub: 'Frequent sag triggers mini-UPS battery discharge, cycle life exhausted within 6 months' }, { title: 'Truck Roll Cost', sub: 'Each site visit costs 800 CNY, 200+ nodes = 160K CNY/month O&M overhead' }] },
      { icon: 'hard-drive', title: 'Small UPS', desc: 'Overload risk at single-cabinet sites', metric: '>80%', metricLabel: 'Load Ratio', consequences: [{ title: 'No Redundancy', sub: 'N config, single UPS failure = complete node outage, SLA 99.9% breached' }, { title: 'Battery Overheat', sub: 'High charge rate in compact cabinet, thermal runaway, fire risk in unattended sites' }] },
      { icon: 'radio', title: 'Distributed Load', desc: 'Phase imbalance from single-phase 5G/IoT', metric: '>10%', metricLabel: 'Unbalance', consequences: [{ title: 'Efficiency Loss', sub: 'DER coordination failure, negative-seq current, PCS derating 15%, curtailment' }, { title: 'Single-phase Trip', sub: 'Per-phase overcurrent, cascade trip of co-located equipment on same feeder' }] },
    ],
  },
];
export const dcTopology = [
  {
    id: 'cloud', sceneName: 'Cloud Computing Topology', sceneSubtitle: 'HPC / Cloud Provider / Colocation',
    deviceLabel: 'AHF+SVG', deviceType: 'Power Quality System',
    deviceDesc: 'AHF at UPS input for harmonics + SVG at LV bus for reactive, cooling system branch marked',
    branches: [
      { label: 'UPS Input', sub: 'Harmonic Source' },
      { label: 'Server Rack', sub: 'Imbalanced Load' },
      { label: 'CRAC/HVAC', sub: 'VFD Reactive Load' },
    ],
  },
  {
    id: 'finance', sceneName: 'Financial DC Topology', sceneSubtitle: 'Bank / Securities / Insurance',
    deviceLabel: 'AHF-100A + SVG-150A', deviceType: 'Precision System',
    deviceDesc: 'AHF series at UPS front-end + SVG at LV bus, ATS switchover / trading desk / HVAC marked',
    branches: [
      { label: 'UPS System', sub: 'Harmonic Source' },
      { label: 'Trading Desk', sub: 'Sag Sensitive' },
      { label: 'Precision HVAC', sub: 'VFD Harmonics' },
    ],
  },
  {
    id: 'edge', sceneName: 'Edge Node Topology', sceneSubtitle: '5G Base / IoT / Distributed Room',
    deviceLabel: 'AHF-Slim 15A', deviceType: 'Rack-mount Unit',
    deviceDesc: 'AHF-Slim rack-mount in distribution cabinet, mains direct / mini UPS loop marked',
    branches: [
      { label: 'Mains Direct', sub: 'Rural Grid Supply' },
      { label: 'Mini UPS', sub: 'Overload Risk' },
      { label: '5G/IoT Load', sub: 'Distributed Power' },
    ],
  },
];
export const dcCases = [
  {
    title: 'UPS Harmonic Mitigation on a Data Centre Feeder, Guangzhou',
    tabLabel: 'IDC feeder',
    highlight: 'Harmonic current 204.96 A → 19.18 A; distortion 26.94% → 3.12%',
    image: '/assets/images/solutions-datacenter-case-cloud.webp',
    industry: 'Colocation / IDC', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/en/contact',
    site: 'The TR1 feeder of an IDC hall, running between 200 A and 850 A with a displacement power factor of 0.975 before the retrofit. The existing filter cabinet was rebuilt rather than replaced.',
    harmonics: [
      'Load current 814.13 A at 82% load factor',
      'Total harmonic current 204.96 A, Ithd 26.94%',
      'Displacement power factor 0.975 before the retrofit',
      'Per-phase distortion after treatment: 3.12% / 2.50% / 2.55% on A / B / C',
    ],
    overview: 'TR1 feeder of an IDC hall, running current 200–850 A, displacement power factor 0.975 before retrofit. The existing filter cabinet was rebuilt around a new 500 A active filter. At 814.13 A load current (82% load factor) the measured harmonic current peaked at 204.96 A with 26.94% distortion.',
    limitations: 'Covers one feeder of the hall, not the whole site. The figures are taken at 814.13 A load current (82% load factor), which is the point the commissioning report used for acceptance.',
    trend: 'Harmonic current 204.96 A → 19.18 A  ·  Distortion 26.94% → 3.12%',
    solution: [{ product: 'AHF-500A', qty: 1, use: 'Rebuilt filter cabinet on the TR1 feeder' }],
    results: [
      'Phase-level distortion 3.12% / 2.50% / 2.55% on A / B / C',
      'Power factor held at 0.981 in service',
      'Every harmonic order within GB/T 14549 limits',
      'IDC hall phases I and III passed fire-inspection filing',
    ],
  },
  {
    title: 'Typical Configuration — Financial Data Centre',
    tabLabel: 'Financial DC',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-datacenter-case-finance.webp',
    industry: 'Typical Configuration · Financial DC', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for a bank, securities or insurance data centre, where UPS rectifier harmonics and ATS transfer transients dominate the design brief.',
    overview: 'For bank, securities and insurance data centres, the usual arrangement is AHF at the UPS rectifier front-end plus SVG on the LV bus for dynamic reactive support. ATS transfer tests are the stress case — the sag window has to be measured before the filter rating is fixed.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'UPS rectifier front-end filtering' }, { product: 'SVG-100A', qty: 2, use: 'Trading floor dynamic reactive support' }],
    results: [
      'Sag window measured during an ATS transfer test before sizing',
      'Targets IEC 61000-3-3 flicker and site sag-tolerance requirements',
      'Ask us for reference projects in financial data centres',
    ],
  },
  {
    title: 'Typical Configuration — Edge Computing Nodes',
    tabLabel: 'Edge nodes',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-datacenter-case-edge.webp',
    industry: 'Typical Configuration · Edge Computing', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/en/contact',
    site: 'An illustrative arrangement for 5G MEC and distributed IoT sites, where the supply is unstable, the cabinet is small and the cost of a site visit outweighs the hardware.',
    overview: 'For 5G MEC and distributed IoT sites, the usual arrangement is a slim rack-mount AHF inside the existing cabinet plus centralised monitoring. Remote sites bring their own constraint: unstable supply and a truck-roll cost that dwarfs the hardware, so remote monitoring is not optional.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'AHF-Slim', qty: 1, use: '1U rack-mount per node cabinet' }, { product: 'Cloud Monitor', qty: 1, use: 'Centralised remote monitoring platform' }],
    results: [
      'Rating set per cabinet after a site survey',
      'Remote monitoring included so truck rolls are not the default response',
      'Ask us for reference projects in edge computing',
    ],
  },
];

// ===================== INDUSTRIAL DATA =====================
export const indPainPoints = [
  {
    id: 'welding', label: 'Welding & Metal', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Welding & Metal Processing', sceneSubtitle: 'Automotive / Shipbuilding / Steel Structure',
    cards: [
      { icon: 'flame', title: 'Arc Welder Bank', desc: 'Harmonic surge from batch arc welding', metric: '>25%', metricLabel: 'THD', consequences: [{ title: 'Transformer Overheat', sub: 'Intermittent high harmonic current, insulation aging accelerated 3x, forced derating' }, { title: 'Protection Trip', sub: 'Harmonic peak triggers breaker false trip, production line stoppage, rework cost' }] },
      { icon: 'factory', title: 'Medium Freq. Furnace', desc: 'Voltage flicker from induction furnace', metric: 'Reactive', metricLabel: 'Fluctuation', consequences: [{ title: 'Grid Voltage Sag', sub: 'Furnace cycle causes Pst > 1.5, neighboring equipment malfunction, batch rejection' }, { title: 'Penalty Fee', sub: 'Utility flicker violation, monthly reactive energy surcharge, contract non-compliance' }] },
      { icon: 'cpu', title: 'CNC Machining Center', desc: 'Phase imbalance from servo drives', metric: 'High', metricLabel: 'Zero-seq.', consequences: [{ title: 'Servo Malfunction', sub: 'Phase imbalance causes position error, workpiece dimensional drift, scrap rate increase' }, { title: 'Yield Loss', sub: 'Frequent tool breakage, surface finish degradation, customer return rate surge' }] },
    ],
  },
  {
    id: 'petrochemical', label: 'Chemical & Oil', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Chemical & Petrochemical', sceneSubtitle: 'Refining / Fine Chemical / Oil & Gas',
    cards: [
      { icon: 'droplets', title: 'VFD Bank', desc: 'Harmonic stacking from multi-VFD installation', metric: '>18%', metricLabel: 'THD', consequences: [{ title: 'Grid Violation', sub: 'Multi-VFD harmonic overlay, IEEE 519 PCC limit exceeded, utility warning notice' }, { title: 'Capacitor Trip', sub: 'Harmonic amplification in PFC capacitors, fuse blowing, reactive penalty escalation' }] },
      { icon: 'waves', title: 'High-power Pump', desc: 'Startup surge from large motors', metric: '6~10x', metricLabel: 'Inrush', consequences: [{ title: 'Bus Voltage Dip', sub: 'DOL start causes 20%+ bus dip, DCS I/O module brownout, control loop instability' }, { title: 'DCS Alert', sub: 'Repeated sag triggers DCS alarm flood, operator cognitive overload, response delay' }] },
      { icon: 'shield-alert', title: 'DCS System', desc: 'Sag sensitive control infrastructure', metric: '>15%', metricLabel: 'Sag Depth', consequences: [{ title: 'Control Freeze', sub: 'Sag causes DCS processor reset, valve position loss, exothermic reaction risk' }, { title: 'Process Stop', sub: 'Safety instrumented system triggers ESD, batch loss, 48hr restart procedure' }] },
    ],
  },
  {
    id: 'semiconductor', label: 'Semiconductor', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Semiconductor & Electronics', sceneSubtitle: 'Wafer Fab / Packaging / PCB',
    cards: [
      { icon: 'cpu', title: 'Wafer Fab', desc: 'Voltage sag at lithography scanners', metric: '< 5ms', metricLabel: 'Sag Tolerance', consequences: [{ title: 'Scanner Halt', sub: 'Sub-cycle sag causes scanner stage position loss, 4hr recalibration, wafer scrap' }, { title: 'Wafer Scrap', sub: 'Single sag event = 25 wafers scraped × $5K/wafer = $125K loss per incident' }] },
      { icon: 'wind', title: 'Cleanroom', desc: 'Harmonic pollution from FFU/VFD', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Filter Load ↑', sub: 'Harmonic current increases FFU motor temperature, bearing failure rate 3x, particle count rise' }, { title: 'Particle Risk', sub: 'FFU speed fluctuation causes positive pressure loss, Class-100 cleanroom breach' }] },
      { icon: 'microscope', title: 'Test Equipment', desc: 'Phase imbalance at ATE/test floor', metric: '>5%', metricLabel: 'Unbalance', consequences: [{ title: 'Data Error', sub: 'ATE power supply ripple rejection degraded, false DUT rejection, yield reporting error' }, { title: 'Neutral Overheat', sub: 'High zero-seq current in test floor PDU, N-line temp > 90°C, fire risk' }] },
    ],
  },
];
export const indTopology = [
  {
    id: 'welding', sceneName: 'Welding & Metal Topology', sceneSubtitle: 'Automotive / Shipbuilding / Steel Structure',
    deviceLabel: 'AHF-150A', deviceType: 'Harmonic Filter',
    deviceDesc: 'Parallel to workshop LV bus, targets welder bank / furnace feeders for harmonic suppression',
    branches: [
      { label: 'Welder Dist.', sub: 'Harmonic Surge' },
      { label: 'Furnace Dist.', sub: 'Flicker Source' },
      { label: 'CNC Dist.', sub: 'Phase Imbalance' },
    ],
  },
  {
    id: 'petrochemical', sceneName: 'Chemical & Oil Topology', sceneSubtitle: 'Refining / Fine Chemical / Oil & Gas',
    deviceLabel: 'SVG-800V', deviceType: 'Static Var Generator',
    deviceDesc: 'SVG-800V/690V at HV bus + AHF for VFD harmonics, DCS sensitive load feeder marked',
    branches: [
      { label: 'Cracking Dist.', sub: 'VFD Bank' },
      { label: 'Distillation', sub: 'E-Heating Load' },
      { label: 'Circ. Water', sub: 'Large Pump' },
    ],
  },
  {
    id: 'semiconductor', sceneName: 'Semiconductor Topology', sceneSubtitle: 'Wafer Fab / Packaging / PCB',
    deviceLabel: 'AHF+SVG', deviceType: 'Combo System',
    deviceDesc: 'AHF+SVG combo at UPS front-end, marks dual-feed wafer fab / cleanroom feeders',
    branches: [
      { label: 'UPS Front-end', sub: 'Precision Power' },
      { label: 'Process Cooling', sub: 'Pump Inrush' },
      { label: 'Test Equipment', sub: 'Sensitive Load' },
    ],
  },
];
export const indCases = [
  {
    title: 'Harmonic Retrofit on a 550 A Plant Feeder — Electronics Manufacturer, Guangdong',
    tabLabel: 'Electronics feeder',
    highlight: 'Current distortion 20.06% → 2.58% on a VFD / compressor / pump feeder',
    image: '/assets/images/solutions-industrial-case-semiconductor.webp',
    industry: 'Electronics Manufacturing', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/en/contact',
    site: 'Feeder TM8 at an electronics manufacturing plant, supplying variable-frequency drives, air compressors and cooling water pumps. The circuit already carried 390 kvar of capacitor compensation within a 780 kvar installed bank, and ran between 800 A and 1,000 A at a system power factor of 0.92.',
    harmonics: [
      'Running current 800–1,000 A on feeder TM8',
      'Current distortion 20.06% before the retrofit',
      'System displacement power factor 0.92',
      '390 kvar of capacitor compensation on the circuit, 780 kvar installed',
    ],
    overview: 'Feeder TM8 supplies VFDs, air compressors and cooling water pumps, with 390 kvar of capacitor compensation on the circuit (780 kvar installed). Running current 800–1,000 A, system displacement power factor 0.92 before retrofit.',
    limitations: 'Results are reported for the TM8 feeder only. Other feeders at the same plant were not part of this contract and are not covered by the figures.',
    trend: 'Distortion 20.06% → 2.58%',
    solution: [{ product: 'AHF-550A', qty: 1, use: 'Harmonic compensation on feeder TM8' }],
    results: [
      'Current distortion 20.06% → 2.58%',
      'Harmonic amplification and system resonance avoided',
      'Accepted on test against GB/T 14549',
    ],
  },
  {
    title: 'Centralised Harmonic Mitigation Across Five 2,000 kVA Transformers — Optical Component Manufacturer, Dongguan',
    tabLabel: 'Optics, 5 transformers',
    highlight: 'Harmonic current 146.22 A → 30.96 A (TR4) and 124.71 A → 43.99 A (TR5)',
    image: '/assets/images/solutions-industrial-case-petrochemical.webp',
    industry: 'Precision Optics Manufacturing', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/en/contact',
    site: 'A ground-floor LV switchroom with five 2,000 kVA transformers at roughly 90% load, each feeding variable-frequency drives, optical production machinery and motors, with three capacitor-reactor cabinets totalling 720 kvar.',
    harmonics: [
      'TR4 harmonic current 146.22 A, Ithd 5.39%',
      'TR5 harmonic current 124.71 A, Ithd 4.68%',
      'TR4 3rd / 5th / 7th harmonic: 122.52 / 70.45 / 22.54 A',
      'TR5 3rd / 5th / 7th harmonic: 100.04 / 59.97 / 33.84 A',
      'GB/T 14549 limits for these orders: 62 / 62 / 44 A',
    ],
    overview: 'Ground-floor LV switchroom with 5 × 2,000 kVA transformers, each paired with a 500 A active filter cabinet. Load is VFDs, optical production machines and motors, with three capacitor-reactor cabinets totalling 720 kvar. Measured at 90% load factor.',
    limitations: 'Published results cover transformers TR4 and TR5 only; the remaining three transformers are not reported here. Filter module availability during the reporting window is outside the scope of this write-up.',
    trend: 'TR4 146.22 A → 30.96 A  ·  TR5 124.71 A → 43.99 A',
    solution: [{ product: 'AHF-500A', qty: 5, use: 'One cabinet per 2,000 kVA transformer in the LV switchroom' }],
    results: [
      'Distortion TR4 5.39% → 1.38%, TR5 4.68% → 1.67%',
      '3rd harmonic TR4 122.52 A → 12.69 A, TR5 100.04 A → 17.89 A',
      'Every monitored order inside GB/T 14549 limits (62 / 62 / 44 A for 3rd / 5th / 7th)',
      'Accepted on test — result described as ideal in the commissioning report',
    ],
  },
  {
    title: 'Resonance-Free Harmonic Control on an Induction Melting Furnace',
    tabLabel: 'Induction furnace',
    highlight: 'Start-up resonance, grid voltage notches and commutation upset — all three solved',
    image: '/assets/images/solutions-industrial-case-welding.webp',
    industry: 'Metals & Induction Heating', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/en/contact',
    site: 'A metal melting shop running an induction furnace. The current waveform is close to a square wave, so harmonic content is high; repeated grid voltage notches at start-up stress any active filter on the feeder.',
    overview: 'Induction furnaces are a hard load for any active filter. The current waveform is close to a square wave, so harmonic content is high and resonance comes easily. Repetitive grid voltage notches at start-up stress the filter. And on switch-on the output inductor resonates with the filter capacitor, tripping output-current protection — which in turn upsets furnace commutation.',
    limitations: 'No measured before-and-after figures are published for this project, so the entry describes the engineering problem and the remedy rather than a result table. Treat it as a capability note, not a performance claim.',
    trend: '',
    note: 'Measured before/after values are not published for this project. What follows is the engineering problem and how it was solved.',
    solution: [{ product: 'AHF', qty: 1, use: 'Furnace feeder, with revised output inductor and capacitor parameters' }],
    results: [
      'Output inductor and filter capacitor re-parameterised to break the switch-on resonance',
      'Start-up and load-step output-current alarms removed by a control software update',
      'Furnace commutation restored to normal operation',
      'Distortion brought inside the national grid requirement without triggering resonance',
    ],
  },
];

// ===================== RAIL DATA =====================
export const railPainPoints = [
  {
    id: 'metro', label: 'Metro & LRT', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Metro & Light Rail', sceneSubtitle: 'Traction / Station / Depot',
    cards: [
      { icon: 'train-front', title: 'Traction Rectifier', desc: 'Harmonic injection from 24-pulse rectifier', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'Grid Penalty', sub: '24-pulse characteristic harmonics (23rd/25th), IEEE 519 PCC violation, utility surcharge' }, { title: 'Capacitor Failure', sub: 'Harmonic amplification in PFC bank, capacitor can rupture, fire risk in underground substation' }] },
      { icon: 'building', title: 'Station M&E', desc: 'Equipment bank imbalance', metric: '>10%', metricLabel: 'Unbalance', consequences: [{ title: 'Neutral Overheat', sub: 'Elevator + HVAC single-phase load mix, N-line current exceeds phase, insulation melt risk' }, { title: 'Breaker Trip', sub: 'Per-phase overload despite avg < rating, station lighting outage, passenger safety hazard' }] },
      { icon: 'battery-charging', title: 'Regen. Braking', desc: 'Energy feedback voltage rise', metric: 'Voltage', metricLabel: 'Rise', consequences: [{ title: 'Inverter OV', sub: 'Regenerative energy backfeed, DC link overvoltage, inverter IGBT protection shutdown' }, { title: 'Protection Trip', sub: 'OV protection cascade tripping, train delay > 5min, service SLA penalty' }] },
    ],
  },
  {
    id: 'hsr', label: 'High-speed Rail', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'High-speed Rail', sceneSubtitle: 'Traction Substation / AT / Section',
    cards: [
      { icon: 'gauge', title: '27.5kV Single-phase', desc: 'Negative sequence from V/V connection', metric: '>8%', metricLabel: 'Unbalance', consequences: [{ title: 'Grid Violation', sub: 'Single-phase traction load causes negative sequence at 220kV PCC, utility curtailment order' }, { title: 'Generator Heating', sub: 'Negative sequence current in nearby thermal plant generators, rotor surface temperature alarm' }] },
      { icon: 'zap', title: 'EMU Converter', desc: 'Wideband harmonic from 4Q converter', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'Contact Wire Heat', sub: 'High-freq harmonic current increases contact wire I²R loss, accelerated annealing, sag increase' }, { title: 'Signaling Interference', sub: 'Harmonic EMI couples to track circuit, cab signal distortion, ETCS availability degradation' }] },
      { icon: 'cable', title: 'Feeder Line', desc: 'Voltage loss along long-distance AT feed', metric: '>10%', metricLabel: 'Drop', consequences: [{ title: 'Speed Limit', sub: 'End-voltage below 22.5kV limits train power, speed restriction imposed, schedule delay' }, { title: 'AT Saturation', sub: 'Overvoltage at sending end causes autotransformer core saturation, harmonic generation' }] },
    ],
  },
  {
    id: 'ev', label: 'EV Charging', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'EV Charging Infrastructure', sceneSubtitle: 'Highway / Urban Fast / Bus Depot',
    cards: [
      { icon: 'plug-zap', title: 'Fast Charger', desc: 'Power impact from DC fast charging', metric: '120kW+', metricLabel: 'Load Step', consequences: [{ title: 'Grid Sag', sub: 'Multi-charger simultaneous start, 15%+ voltage dip, distribution transformer protection trip' }, { title: 'Demand Charge', sub: 'Peak demand spike triggers utility demand ratchet, monthly capacity charge 3x baseline' }] },
      { icon: 'radio', title: 'Charger Harmonics', desc: 'Harmonic stack from 12-pulse chargers', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'PF Penalty', sub: 'Harmonic + reactive combine, PF < 0.85 at PCC, monthly penalty + carbon tax surcharge' }, { title: 'EMI Issue', sub: 'Conducted EMI into LV grid, nearby residential TV/radio interference, complaint volume surge' }] },
      { icon: 'wrench', title: 'Distribution Xfmr', desc: 'Overload & imbalance at charging station', metric: '>90%', metricLabel: 'Load', consequences: [{ title: 'Life Shorten', sub: 'Cyclic thermal stress from peaking load, insulation aging 5x faster, expected life < 3 years' }, { title: '3-phase Uneven', sub: 'Single-phase AC chargers dominate, zero-seq current > 40%, N-line replacement every 2 years' }] },
    ],
  },
];
export const railTopology = [
  {
    id: 'metro', sceneName: 'Metro Topology', sceneSubtitle: 'Traction / Station / Depot',
    deviceLabel: 'SVG + AHF', deviceType: 'Combined System',
    deviceDesc: 'SVG at 35kV ring + AHF at traction substation 750V/1500V rectifier, station/depot marked',
    branches: [
      { label: 'Traction Sub.', sub: 'Rectifier Load' },
      { label: 'Station Dist.', sub: 'M&E Load' },
      { label: 'Depot Power', sub: 'Auxiliary Load' },
    ],
  },
  {
    id: 'hsr', sceneName: 'HSR Topology', sceneSubtitle: 'Traction Substation / AT / Section',
    deviceLabel: 'SVG-27.5kV + AHF-200A', deviceType: 'Traction System',
    deviceDesc: 'SVG-27.5kV at traction bus + AHF at 10kV feeder, AT section / contact wire marked',
    branches: [
      { label: 'Contact Wire', sub: 'Single-phase Load' },
      { label: 'Feeder Line', sub: 'Harmonic Source' },
      { label: 'Station Power', sub: 'Composite Load' },
    ],
  },
  {
    id: 'ev', sceneName: 'EV Charging Topology', sceneSubtitle: 'Highway / Urban Fast / Bus Depot',
    deviceLabel: 'SVG + AHF-150A', deviceType: 'Charging System',
    deviceDesc: 'SVG at charging station 10kV + AHF at DC fast charger AC side, transformer/charger bank marked',
    branches: [
      { label: '10kV Dist.', sub: 'Station Feed' },
      { label: 'Fast Charger', sub: 'Surge Load' },
      { label: 'Bus Charger', sub: 'Batch Load' },
    ],
  },
];
export const railCases = [
  {
    title: 'Power Factor Correction at an EV Charging Site — 100 kvar SVG on Each Transformer',
    tabLabel: 'EV charging site',
    highlight: 'Power factor held at target in both standby and charging; payback inside two years',
    image: '/assets/images/solutions-rail-case-charging.webp',
    industry: 'EV Charging', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/en/contact',
    site: 'A charging site on two transformers, 2,500 kVA and 2,000 kVA. Measured at the LV incoming panel the site sat at 0.1–0.2 capacitive power factor, because chargers draw almost no active power on standby while their rectifiers continue to exchange reactive power.',
    overview: 'Charging site on two transformers (2,500 kVA and 2,000 kVA). Measured at the LV incoming panel, the site ran at 0.1–0.2 capacitive power factor because chargers draw almost no active power on standby while their rectifiers still exchange reactive power — a conventional capacitor bank cannot follow that. One existing capacitor cabinet was stripped and reused to house the SVG modules.',
    limitations: 'The savings figure follows from the site\'s own tariff and load profile and is not transferable to another site. CT accuracy of 0.2 class or better is a prerequisite, not an option.',
    trend: 'Power factor 0.1–0.2 capacitive → target value held in standby and under load',
    solution: [{ product: 'SVG-100kvar', qty: 2, use: 'One per transformer; constant-reactive mode carries the standby condition' }],
    results: [
      'Power factor at target in both standby and charging states',
      'About 76,000 CNY saved per year across the two transformers',
      'Line losses reduced and end-of-line voltage improved',
      'Payback inside two years; existing capacitor cabinet reused instead of a new one',
      'Needs 0.2-class or better CTs — standby current is very low',
    ],
  },
  {
    title: 'Typical Configuration — Metro & Light Rail',
    tabLabel: 'Metro & light rail',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-rail-case-metro.webp',
    industry: 'Typical Configuration · Metro & LRT', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for a metro or light-rail network: SVG on the ring bus for reactive and voltage support, AHF at the traction substation rectifier.',
    overview: 'For metro and light-rail networks, the usual arrangement is an SVG on the ring bus plus AHF at the traction substation rectifier. Characteristic harmonics from the rectifier and the voltage rise from regenerative braking are the two things that have to be measured before anything is sized.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG-300A', qty: 3, use: 'Ring bus reactive compensation' }, { product: 'AHF-200A', qty: 6, use: 'Traction substation harmonic filtering' }],
    results: [
      'Rectifier harmonic spectrum measured at the substation before sizing',
      'Regenerative voltage rise checked against inverter DC-link limits',
      'Ask us for reference projects in metro and light rail',
    ],
  },
  {
    title: 'Typical Configuration — High-speed Rail Traction',
    tabLabel: 'High-speed rail',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-rail-case-hsr.webp',
    industry: 'Typical Configuration · High-speed Rail', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for a 27.5 kV traction substation, where single-phase load produces negative-sequence current and the AT feed suffers end-of-line voltage drop.',
    overview: 'For V/V-connected traction substations feeding single-phase catenary, the usual arrangement is an SVG on the traction bus plus AHF on the station feeder. Negative sequence at the upstream PCC is the binding constraint, so it drives the rating — not the harmonic level on its own.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG-27.5kV', qty: 2, use: 'Traction bus reactive and balancing' }, { product: 'AHF-200A', qty: 2, use: 'Station feeder harmonic filtering' }],
    results: [
      'Negative sequence at the upstream PCC measured first — it sets the rating',
      'Targets GB/T 15543 unbalance limits',
      'Ask us for reference projects in rail traction',
    ],
  },
];

// ===================== RENEWABLE DATA =====================
export const rePainPoints = [
  {
    id: 'solar', label: 'Solar PV', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: 'Solar PV Power Station', sceneSubtitle: 'Utility-scale / Distributed / Agri-PV',
    cards: [
      { icon: 'sun', title: 'Inverter Harmonics', desc: 'Wideband oscillation from multi-inverter', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'Resonance Risk', sub: 'LCL filter + grid impedance resonance, wideband oscillation, inverter cascade trip' }, { title: 'Grid Violation', sub: 'Harmonic emission exceeds GB/T 14549 at PCC, grid company curtailment order' }] },
      { icon: 'activity', title: 'Grid Voltage', desc: 'Fluctuation from irradiance variation', metric: 'PF Low', metricLabel: 'Reactive Diff.', consequences: [{ title: 'Dispatch Penalty', sub: 'Reactive power deviation from dispatch setpoint, AVC assessment failure, revenue deduction' }, { title: 'Voltage Limit', sub: 'Cloud-edge effect, ±10% voltage swing in < 1min, reverse power protection trip' }] },
      { icon: 'battery-charging', title: 'DC Ripple', desc: 'AC side reflection from DC ripple', metric: 'DC Bias', metricLabel: 'Xfmr Overheat', consequences: [{ title: 'Core Saturation', sub: 'DC component causes transformer core half-cycle saturation, magnetizing current surge, humming' }, { title: 'Efficiency Loss', sub: 'Excess core loss + harmonic copper loss, PR (performance ratio) drops 2-3 percentage points' }] },
    ],
  },
  {
    id: 'wind', label: 'Wind Farm', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: 'Wind Power Farm', sceneSubtitle: 'Onshore / Offshore / Distributed',
    cards: [
      { icon: 'wind', title: 'Converter Harmonics', desc: 'Low-order distortion from full-power converter', metric: '>10%', metricLabel: 'THD', consequences: [{ title: 'Grid Rejection', sub: '5th/7th harmonic dominant, utility interconnect test failure, energization delay cost' }, { title: 'Collector Resonance', sub: '35kV cable capacitance + transformer inductance, parallel resonance near 7th harmonic' }] },
      { icon: 'trending-up', title: 'Wind Fluctuation', desc: 'Reactive surge from gust/turbulence', metric: 'Reactive', metricLabel: 'Swing', consequences: [{ title: 'PF Penalty', sub: 'Rapid reactive swing from wind gusts, monthly PF < 0.85, utility reactive charge 2x' }, { title: 'AVC Hunting', sub: 'AVC system oscillation chasing wind variation, tap changer excessive wear, 5x maintenance' }] },
      { icon: 'component', title: 'Box Transformer', desc: 'Phase imbalance from auxiliary load', metric: '>5%', metricLabel: 'Unbalance', consequences: [{ title: 'Limit Violation', sub: 'Single-phase auxiliary supply imbalance, negative sequence exceeds grid code limit' }, { title: 'Overheat Trip', sub: 'Imbalance + harmonic combine, winding hot-spot temperature alarm, forced curtailment' }] },
    ],
  },
  {
    id: 'storage', label: 'Energy Storage', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: 'Energy Storage System', sceneSubtitle: 'Grid-side / User-side / Source-side',
    cards: [
      { icon: 'battery-charging', title: 'Charge/Discharge', desc: 'Harmonic stack from multi-PCS', metric: '>6%', metricLabel: 'THD', consequences: [{ title: 'Grid Pollution', sub: 'Multi-PCS interleaving harmonics, PCC THD exceeds GB/T 34120, grid operator warning' }, { title: 'Battery Ripple', sub: 'AC ripple current on DC bus, lithium plating acceleration, cycle life reduced 20%' }] },
      { icon: 'arrow-left-right', title: 'PCS Reactive', desc: 'Lag regulation at low load', metric: '< 0.9', metricLabel: 'PF', consequences: [{ title: 'Penalty Fee', sub: 'Standby mode reactive consumption triggers penalty, monthly charge + demand ratchet' }, { title: 'Regulation Fail', sub: 'AGC/AVC joint dispatch setpoint not met, ancillary service qualification revoked' }] },
      { icon: 'globe', title: 'Grid Point', desc: 'Voltage flicker at interconnect', metric: '> 0.8', metricLabel: 'Pst', consequences: [{ title: 'Interconnect Fail', sub: 'Flicker Pst > 0.8 during mode transition, grid interconnect agreement non-compliance' }, { title: 'Islanding Risk', sub: 'Grid disturbance detection confused by flicker, unintentional islanding, safety hazard' }] },
    ],
  },
];
export const reTopology = [
  {
    id: 'solar', sceneName: 'Solar PV Topology', sceneSubtitle: 'Utility-scale / Distributed / Agri-PV',
    deviceLabel: 'SVG+AHF', deviceType: 'PV Quality System',
    deviceDesc: 'SVG at 35kV step-up bus + AHF at inverter AC side, combiner box marked',
    branches: [
      { label: 'Combiner Box', sub: 'DC Collection' },
      { label: 'Inverter AC', sub: 'Harmonic Source' },
      { label: '35kV Step-up', sub: 'Grid Interconnect' },
    ],
  },
  {
    id: 'wind', sceneName: 'Wind Farm Topology', sceneSubtitle: 'Onshore / Offshore / Distributed',
    deviceLabel: 'SVG-690V + AHF-100A', deviceType: 'Wind Quality System',
    deviceDesc: 'SVG-690V at turbine side + AHF at box transformer LV, 35kV collector line marked',
    branches: [
      { label: 'Turbine Conv.', sub: 'Harmonic Source' },
      { label: 'Box Transformer', sub: 'Imbalance Load' },
      { label: '35kV Collect', sub: 'Grid Connection' },
    ],
  },
  {
    id: 'storage', sceneName: 'Storage Topology', sceneSubtitle: 'Grid-side / User-side / Source-side',
    deviceLabel: 'AHF+SVG Combo', deviceType: 'Storage Quality System',
    deviceDesc: 'SVG+AHF combo at PCS AC side, battery cluster / PCS / transformer / grid point marked',
    branches: [
      { label: 'Battery Cluster', sub: 'DC Source' },
      { label: 'PCS AC Side', sub: 'Bidirectional' },
      { label: 'Grid Point', sub: 'Interconnection' },
    ],
  },
];
export const reCases = [
  {
    title: 'Typical Configuration — Solar PV Plant',
    tabLabel: 'Solar PV plant',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-renewable-case-solar.webp',
    industry: 'Typical Configuration · Solar PV', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for a utility-scale or distributed PV plant: SVG at the step-up bus, AHF on the inverter AC feeders.',
    overview: 'For utility-scale and distributed PV, the usual arrangement is an SVG at the step-up bus plus AHF on the inverter AC feeders. Multi-inverter resonance and cloud-edge reactive swings are the two failure modes — both need a measurement campaign before ratings are fixed.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG', qty: 2, use: 'Step-up bus reactive support' }, { product: 'AHF-200A', qty: 4, use: 'Inverter AC feeder harmonic filtering' }],
    results: [
      'Resonance scan across the collector network before sizing',
      'Reactive envelope checked against the AVC dispatch setpoint',
      'Ask us for reference projects in solar PV',
    ],
  },
  {
    title: 'Typical Configuration — Wind Farm',
    tabLabel: 'Wind farm',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-renewable-case-wind.webp',
    industry: 'Typical Configuration · Wind Farm', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/en/contact',
    site: 'An illustrative arrangement for an onshore or offshore wind farm, where full-power converters and collector cable capacitance interact near the 7th harmonic.',
    overview: 'For full-power-converter turbines, the usual arrangement is an SVG at the collector bus plus AHF on the collector feeders. Cable capacitance against transformer inductance often puts a parallel resonance point near the 7th harmonic, so the collector system is modelled before anything is ordered.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG-690V', qty: 2, use: 'Collector bus reactive support' }, { product: 'AHF-100A', qty: 2, use: 'Collector feeder harmonic filtering' }],
    results: [
      'Collector resonance point modelled against cable capacitance',
      'Gust-driven reactive swing measured over a full season if possible',
      'Ask us for reference projects in wind',
    ],
  },
  {
    title: 'Typical Configuration — Battery Energy Storage',
    tabLabel: 'Battery storage',
    highlight: 'Illustrative configuration — sizing starts from a site power-quality survey',
    image: '/assets/images/solutions-renewable-case-storage.webp',
    industry: 'Typical Configuration · Energy Storage', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/en/contact',
    site: 'An illustrative arrangement for a grid-side, user-side or source-side battery installation, where PCS units interleave harmonics and standby mode drives power factor down.',
    overview: 'For grid-side and user-side storage, the usual arrangement is an SVG + AHF combination on the PCS AC bus. Charge/discharge transitions are the stress case: multi-PCS harmonic interleaving plus a flicker step at the mode change, both measured at the point of common coupling.',
    trend: '',
    note: 'Illustrative configuration — not a specific delivered project. Reference projects in this sector are available on request.',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'PCS AC bus power quality conditioning' }, { product: 'PQ Gateway', qty: 1, use: 'Grid compliance monitoring' }],
    results: [
      'Charge/discharge transition measured, not assumed',
      'Flicker at the interconnect point checked against the grid agreement',
      'Ask us for reference projects in energy storage',
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
  commercial: 'Commercial & Medical Building Case Studies',
  grid: 'Power Grid Case Studies',
  datacenter: 'Data Center Case Studies',
  industry: 'Industrial Manufacturing Case Studies',
  renewable: 'Renewable Energy Case Studies',
  rail: 'Rail Transit Case Studies',
};
export const heroImages = {
  commercial: '/assets/images/solutions-commercial-medical-hero-bg.webp',
  grid: '/assets/images/solutions-grid-hero-bg.webp',
  datacenter: '/assets/images/solutions-datacenter-hero-bg.webp',
  industry: '/assets/images/solutions-industrial-hero-bg.webp',
  renewable: '/assets/images/solutions-renewable-hero-bg.webp',
  rail: '/assets/images/solutions-rail-hero-bg.webp',
};
