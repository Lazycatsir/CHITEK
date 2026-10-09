// Per-industry SEO metadata for the English solutions sub-pages.
// Hand-maintained. `id` must match a key in enSolutions.js -> dataMap.
// No customer names, no unsourced numbers: every claim here is either general
// engineering fact or covered by a case that is actually published on the page.

export const solutionMeta = [
  {
    id: 'industry',
    slug: 'industrial',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Industrial',
    h1: 'Power Quality Solutions for Industrial Manufacturing',
    answer:
      'CHITEK conditions harmonic and reactive problems on industrial plant feeders using active harmonic filters (AHF) and static var generators (SVG). The usual triggers are VFD banks, welding equipment and induction furnaces. Sizing follows a measured harmonic spectrum at the point of common coupling, not the transformer rating alone.',
    title: 'Power Quality Solutions for Industrial Manufacturing | CHITEK',
    description:
      'Harmonic filtering and reactive compensation for welding shops, induction furnaces, CNC lines, VFD banks and compressor feeders in industrial plants.',
    card: {
      lead:
        'Harmonic filtering and reactive compensation for',
      equipment: [
        'welding shops',
        'induction furnaces',
        'CNC and servo lines',
        'VFD banks',
        'compressor and pump feeders',
        'plating rectifiers',
        'rolling mill drives',
      ],
    },
    intro:
      'Welding banks, induction furnaces, CNC servo drives and large VFD installations all inject harmonic current back into the plant feeder. The result is transformer overheating, recurring capacitor failures and unstable process equipment. CHITEK active harmonic filters (AHF) and static var generators (SVG) are installed at the transformer or at the feeder to bring distortion back inside the plant limits.',
    comparison: {
      heading: 'AHF or SVG for a manufacturing plant?',
      intro:
        'Most industrial sites start by identifying which of the two problems is dominant. Distortion and reactive demand are measured separately in the survey, and either can be the binding constraint.',
      rows: [
        {
          aspect: 'What it does',
          ahf: 'Injects a compensating current that cancels the harmonic current drawn by non-linear loads.',
          svg: 'Supplies or absorbs reactive power continuously to hold power factor and support voltage.',
        },
        {
          aspect: 'Primary target',
          ahf: 'Current distortion (THDi) and harmonic spectrum at the point of common coupling.',
          svg: 'Power factor, voltage fluctuation and reactive demand across the load cycle.',
        },
        {
          aspect: 'Typical trigger',
          ahf: 'VFD banks, rectifiers, welding sets, induction furnaces, LED drivers, UPS rectifiers.',
          svg: 'Low or swinging power factor, voltage sag and rise, weak or long feeders, EV load steps.',
        },
        {
          aspect: 'Behaviour at light load',
          ahf: 'Compensation scales with the measured harmonic current, so output falls as load falls.',
          svg: 'Holds output as required to reach the target power factor even at near-zero active load.',
        },
        {
          aspect: 'Use in this sector',
          ahf: 'Feeder-level harmonic correction at the transformer or at the main incomer feeding VFD and furnace loads.',
          svg: 'Reactive support where power factor penalties apply or where furnace switching causes voltage fluctuation.',
        },
      ],
      note: 'Ratings are set from the survey. Where a plant runs both VFD banks and furnaces, the two devices are normally combined rather than sized as alternatives.',
    },
    faq: [
      {
        q: 'What causes harmonics in a manufacturing plant?',
        a: 'Non-linear loads: rectifiers in VFDs and servo drives, arc welders, induction melting furnaces and DC power supplies. They draw current in short pulses rather than as a sine wave, and those pulses appear as harmonic current on the feeder.',
      },
      {
        q: 'Can an active harmonic filter run alongside an existing capacitor bank?',
        a: 'Yes, but where the filter CTs sample matters. If the CTs are on the grid side and the connection point sits downstream of a pure capacitor bank, the filter can excite LC resonance. Use selective filtering orders with anti-resonance control, or move CT sampling to the load side.',
      },
      {
        q: 'Do I need an AHF, an SVG, or both?',
        a: 'An AHF cancels harmonic current. An SVG supplies or absorbs reactive power and holds power factor. If the problem is distortion, start with AHF. If it is low power factor or voltage fluctuation, start with SVG. Plants running both VFD banks and furnaces often need both.',
      },
      {
        q: 'How is filter capacity sized?',
        a: 'From a power quality survey at the point of common coupling: measure the harmonic spectrum, the reactive profile and the load cycle. Sizing from transformer kVA alone is the most common reason an installation ends up undersized.',
      },
    ],
  },
  {
    id: 'commercial',
    slug: 'commercial',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Commercial & Medical',
    h1: 'Power Quality Solutions for Commercial & Medical Buildings',
    answer:
      'CHITEK retrofits AHF and SVG onto existing commercial and medical switchboards to cut harmonic distortion, neutral current and capacitor resonance. Typical sources are single-phase LED drivers, lifts and imaging equipment. In most cases the existing capacitor bank stays in service, with anti-resonance control and selective filtering orders holding the installation stable.',
    title: 'Commercial & Medical Building Power Quality Solutions | CHITEK',
    description:
      'Retrofit AHF and SVG in malls, hospitals, laboratories and offices to cut LED harmonic overload, neutral current and capacitor resonance.',
    card: {
      lead:
        'Retrofit AHF and SVG onto existing switchboards in',
      equipment: [
        'shopping malls',
        'hospitals and clinics',
        'laboratories',
        'LED-lit offices',
        'hotels',
        'transport terminals',
      ],
    },
    intro:
      'LED lighting, lifts, chillers and imaging equipment fill modern commercial and medical buildings. Single-phase LED drivers add third-harmonic current onto the neutral conductor, while capacitor banks installed for power factor correction can resonate with the transformer. CHITEK retrofits AHF onto existing switchboards without replacing the compensation equipment.',
    comparison: {
      heading: 'AHF or SVG in a commercial building?',
      intro:
        'The split usually follows the dominant symptom: overheating neutrals and LED distortion point to AHF, while chiller reactive demand and lift surges point to SVG.',
      rows: [
        {
          aspect: 'What it does',
          ahf: 'Injects a compensating current that cancels the harmonic current drawn by non-linear loads.',
          svg: 'Supplies or absorbs reactive power continuously to hold power factor and support voltage.',
        },
        {
          aspect: 'Primary target',
          ahf: 'Current distortion (THDi) and harmonic spectrum at the point of common coupling.',
          svg: 'Power factor, voltage fluctuation and reactive demand across the load cycle.',
        },
        {
          aspect: 'Typical trigger',
          ahf: 'VFD banks, rectifiers, welding sets, induction furnaces, LED drivers, UPS rectifiers.',
          svg: 'Low or swinging power factor, voltage sag and rise, weak or long feeders, EV load steps.',
        },
        {
          aspect: 'Behaviour at light load',
          ahf: 'Compensation scales with the measured harmonic current, so output falls as load falls.',
          svg: 'Holds output as required to reach the target power factor even at near-zero active load.',
        },
        {
          aspect: 'Use in this sector',
          ahf: 'Neutral and harmonic correction on floors dominated by LED lighting and single-phase electronic loads.',
          svg: 'Reactive support for chiller and HVAC banks where power factor correction is already penalised, or to replace a resonating capacitor bank.',
        },
      ],
      note: 'Where a capacitor bank is already installed, the survey must confirm whether it can stay in service. Anti-resonance control and CT placement decide this, not the device type alone.',
    },
    faq: [
      {
        q: 'Why does the neutral conductor overheat in a building full of LED lighting?',
        a: 'Single-phase LED drivers draw a non-sinusoidal current that is rich in third harmonic. Third-harmonic currents do not cancel on the neutral, they add. On a heavily lit floor the neutral can end up carrying more current than a phase conductor.',
      },
      {
        q: 'Can we keep our existing capacitor bank?',
        a: 'Usually yes. The risk is parallel resonance between the capacitor bank and the transformer inductance, which amplifies harmonics instead of removing them. Anti-resonance control and selective filtering orders let the AHF operate with the bank still in service.',
      },
      {
        q: 'Does a hospital need a different approach from an office building?',
        a: 'The harmonic sources differ, and the consequences are different. Imaging equipment and surgical loads are sensitive to voltage sag and phase imbalance, so the survey has to cover sag depth and unbalance, not only current distortion. The filtering hardware is the same product family.',
      },
      {
        q: 'Will the retrofit require a shutdown?',
        a: 'The filter connects in parallel at the switchboard, so most retrofits are carried out on the existing board. The outage window is set by your site isolation and permitting procedure rather than by the equipment itself.',
      },
    ],
  },
  {
    id: 'datacenter',
    slug: 'data-center',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Data Center',
    h1: 'Power Quality Solutions for Data Centers',
    answer:
      'CHITEK mitigates UPS input harmonics, phase imbalance and reactive swing in data centres using AHF on the UPS feeder and SVG on the mechanical bus. Harmonic current raises transformer temperature and can circulate between parallel UPS units; imbalance loads the neutral. Both are measured in a single survey at the point of common coupling before sizing.',
    title: 'Data Center Power Quality Solutions | CHITEK',
    description:
      'UPS harmonic mitigation, phase balancing and reactive support for colocation halls, enterprise data centres and edge nodes.',
    card: {
      lead:
        'UPS input harmonics, phase imbalance and reactive support for',
      equipment: [
        'colocation halls',
        'enterprise data centres',
        'financial and banking sites',
        'edge and remote nodes',
        'disaster recovery sites',
      ],
    },
    intro:
      'UPS rectifiers, single-phase IT loads and VFD-driven cooling all sit on the same feeder. Harmonic current raises transformer temperature, phase imbalance loads the neutral, and reactive swing from chillers drags power factor down at part load. CHITEK conditions the feeder upstream of the UPS and on the mechanical bus.',
    comparison: {
      heading: 'AHF or SVG in a data centre?',
      intro:
        'Data centres usually separate the two buses: the UPS feeder is a harmonic problem, the mechanical bus is a reactive problem. They are measured and sized independently.',
      rows: [
        {
          aspect: 'What it does',
          ahf: 'Injects a compensating current that cancels the harmonic current drawn by non-linear loads.',
          svg: 'Supplies or absorbs reactive power continuously to hold power factor and support voltage.',
        },
        {
          aspect: 'Primary target',
          ahf: 'Current distortion (THDi) and harmonic spectrum at the point of common coupling.',
          svg: 'Power factor, voltage fluctuation and reactive demand across the load cycle.',
        },
        {
          aspect: 'Typical trigger',
          ahf: 'VFD banks, rectifiers, welding sets, induction furnaces, LED drivers, UPS rectifiers.',
          svg: 'Low or swinging power factor, voltage sag and rise, weak or long feeders, EV load steps.',
        },
        {
          aspect: 'Behaviour at light load',
          ahf: 'Compensation scales with the measured harmonic current, so output falls as load falls.',
          svg: 'Holds output as required to reach the target power factor even at near-zero active load.',
        },
        {
          aspect: 'Use in this sector',
          ahf: 'Harmonic correction on the UPS input feeder, where rectifier harmonics circulate between parallel units.',
          svg: 'Reactive and voltage support on the chiller and CRAC bus, where VFD starting and part-load operation move power factor.',
        },
      ],
      note: 'Installing a filter downstream of the UPS output is usually unnecessary, because the UPS already conditions its own output.',
    },
    faq: [
      {
        q: 'Where should an AHF be installed in a data centre?',
        a: 'At the feeder upstream of the UPS, or on the mechanical bus feeding chillers and CRAC units. Installing downstream of the UPS output is possible but usually unnecessary, because the UPS already conditions its own output.',
      },
      {
        q: 'Does harmonic filtering improve PUE?',
        a: 'Indirectly. Harmonic current causes extra loss in transformers and cables and can force a transformer to run hotter than designed, so removing that current reduces those losses. PUE depends on the whole mechanical and electrical design, so the effect has to be measured rather than assumed.',
      },
      {
        q: 'Is phase imbalance a separate problem from harmonics?',
        a: 'Yes. Single-phase IT loads spread unevenly across the phases create negative-sequence and zero-sequence current. Harmonics are a waveform problem, imbalance is a distribution problem, and both are normally measured in the same survey.',
      },
      {
        q: 'Can edge sites with small UPS systems use the same equipment?',
        a: 'Yes, in smaller ratings. Remote and rural edge nodes often have worse supply quality than a core data centre, so the survey step matters more there, not less.',
      },
    ],
  },
  {
    id: 'renewable',
    slug: 'renewable',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Renewable Energy',
    h1: 'Power Quality Solutions for Renewable Energy & Storage',
    answer:
      'CHITEK controls harmonic interleaving, flicker and reactive swing at PV, wind and battery-storage interconnect points using combined SVG and AHF equipment. Several inverters switching on one bus interleave their emissions, and charge-to-discharge transitions produce a reactive step. Compliance is assessed where the grid operator measures it: the point of common coupling.',
    title: 'Renewable Energy & Storage Power Quality Solutions | CHITEK',
    description:
      'Power quality at PV, wind and battery-storage interconnect points: harmonic interleaving, flicker and reactive swing at the point of common coupling.',
    card: {
      lead:
        'Harmonic interleaving, flicker and reactive swing at',
      equipment: [
        'utility-scale PV plants',
        'wind farms',
        'battery energy storage (BESS)',
        'hybrid PV plus storage',
        'CCHP plants',
        'microgrids',
      ],
    },
    intro:
      'PV inverters, full-power wind converters and battery PCS units all switch at high frequency. Several units on one interconnect point interleave their harmonics, and the charge and discharge transition produces a reactive step and a flicker event. The compliance question is what the grid operator measures at the point of common coupling.',
    comparison: {
      heading: 'AHF or SVG at an interconnect point?',
      intro:
        'At a PV, wind or storage interconnect the two problems arrive together, because the same inverters produce both switching harmonics and reactive swing.',
      rows: [
        {
          aspect: 'What it does',
          ahf: 'Injects a compensating current that cancels the harmonic current drawn by non-linear loads.',
          svg: 'Supplies or absorbs reactive power continuously to hold power factor and support voltage.',
        },
        {
          aspect: 'Primary target',
          ahf: 'Current distortion (THDi) and harmonic spectrum at the point of common coupling.',
          svg: 'Power factor, voltage fluctuation and reactive demand across the load cycle.',
        },
        {
          aspect: 'Typical trigger',
          ahf: 'VFD banks, rectifiers, welding sets, induction furnaces, LED drivers, UPS rectifiers.',
          svg: 'Low or swinging power factor, voltage sag and rise, weak or long feeders, EV load steps.',
        },
        {
          aspect: 'Behaviour at light load',
          ahf: 'Compensation scales with the measured harmonic current, so output falls as load falls.',
          svg: 'Holds output as required to reach the target power factor even at near-zero active load.',
        },
        {
          aspect: 'Use in this sector',
          ahf: 'Harmonic correction where multi-inverter interleaving or LCL filter interaction pushes emission past the grid limit.',
          svg: 'Reactive support and voltage hold as irradiance or state of charge changes, and to avoid leading power factor at low output.',
        },
      ],
      note: 'Compliance is assessed at the point of common coupling, so the survey should be taken there rather than at the inverter terminals.',
    },
    faq: [
      {
        q: 'What power quality problems appear at a PV or storage interconnect point?',
        a: 'Wideband harmonic emissions from many inverters switching together, reactive swing as irradiance or state of charge changes, and voltage flicker at the interconnect. Multi-inverter LCL filter interaction can also produce resonance.',
      },
      {
        q: 'Why does power factor drop at low output?',
        a: 'Inverters and PCS units are rated for active power. At low output their reactive capability is a smaller share of what the plant needs, and cable and transformer capacitance can push the measured power factor leading or lagging depending on the hour.',
      },
      {
        q: 'Can one device handle both harmonics and reactive power?',
        a: 'A combined SVG plus AHF arrangement is the usual answer. The SVG holds power factor and voltage, the AHF removes switching harmonics, and the ratings are split according to what the survey finds.',
      },
      {
        q: 'What does grid compliance depend on?',
        a: 'The grid agreement and the local standard, measured at the point of common coupling. Emission limits, flicker and reactive capability are all assessed there, so the survey should be taken at that point rather than at the inverter terminals.',
      },
    ],
  },
  {
    id: 'rail',
    slug: 'rail-transit',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Rail Transit',
    h1: 'Power Quality Solutions for Rail Transit & EV Charging',
    answer:
      'CHITEK supplies AHF and SVG for traction substations, rail feeders and EV charging sites, where large single-phase and pulsed loads inject harmonics and negative-sequence current. Traction rectifiers and DC fast chargers also pull power factor down at peak. Ratings follow a survey of harmonic spectrum, unbalance and reactive profile at the supply point.',
    title: 'Rail Transit & EV Charging Power Quality Solutions | CHITEK',
    description:
      'Power factor and harmonic control for DC fast-charging hubs, fleet depots, public charging stations and rail traction, sized from a measured survey.',
    card: {
      lead:
        'Power factor and harmonic control for',
      equipment: [
        'DC fast-charging hubs',
        'fleet and bus depots',
        'public charging stations',
        'workplace chargers',
        'rail traction',
      ],
    },
    intro:
      'Traction rectifiers, 27.5 kV single-phase feeds and DC fast chargers are all large single-phase or pulsed loads. They inject harmonics and negative-sequence current into the supply and pull power factor down at the charging peak. CHITEK supplies AHF for the harmonic feeders and SVG for reactive support at the transformer.',
    comparison: {
      heading: 'AHF or SVG for traction and charging?',
      intro:
        'Traction and charging loads are pulsed and often single-phase, so unbalance and reactive step appear alongside distortion.',
      rows: [
        {
          aspect: 'What it does',
          ahf: 'Injects a compensating current that cancels the harmonic current drawn by non-linear loads.',
          svg: 'Supplies or absorbs reactive power continuously to hold power factor and support voltage.',
        },
        {
          aspect: 'Primary target',
          ahf: 'Current distortion (THDi) and harmonic spectrum at the point of common coupling.',
          svg: 'Power factor, voltage fluctuation and reactive demand across the load cycle.',
        },
        {
          aspect: 'Typical trigger',
          ahf: 'VFD banks, rectifiers, welding sets, induction furnaces, LED drivers, UPS rectifiers.',
          svg: 'Low or swinging power factor, voltage sag and rise, weak or long feeders, EV load steps.',
        },
        {
          aspect: 'Behaviour at light load',
          ahf: 'Compensation scales with the measured harmonic current, so output falls as load falls.',
          svg: 'Holds output as required to reach the target power factor even at near-zero active load.',
        },
        {
          aspect: 'Use in this sector',
          ahf: 'Harmonic correction on feeders dominated by traction rectifiers and charger rectification.',
          svg: 'Reactive support at the transformer, where charging peaks and standby states each pull power factor in a different direction.',
        },
      ],
      note: 'Charging sites are mostly an SVG problem; AHF is added when charger harmonics also have to be held inside limits.',
    },
    faq: [
      {
        q: 'Why is negative-sequence current a problem for traction supply?',
        a: 'A single-phase traction load connected between two phases of a three-phase system produces negative-sequence current. That heats three-phase machines on the same network and can push unbalance past the grid limit.',
      },
      {
        q: 'Do EV charging sites need AHF or SVG?',
        a: 'Mostly SVG. The main issue at a charging site is reactive demand and power factor across the standby and charging states, plus the load step when several vehicles start together. AHF is added when charger harmonics also have to be held inside limits.',
      },
      {
        q: 'Can regenerative braking raise the supply voltage?',
        a: 'Yes. Energy fed back during braking raises voltage on the DC and AC side, and converters may trip on overvoltage. Handling it belongs to the traction power study rather than to a filter on its own.',
      },
      {
        q: 'How long does the investment take to pay back?',
        a: 'For a charging site the payback is driven mainly by avoided power factor penalties. It depends on the local tariff and the site load profile, so the number comes from your tariff rather than from a product sheet.',
      },
    ],
  },
  {
    id: 'grid',
    slug: 'power-grid',
    // ISO date of last substantive content review; keep in sync with the case data.
    published: '2026-09-29',
    updated: '2026-09-29',
    navLabel: 'Power Grid',
    h1: 'Power Quality Solutions for Transmission & Distribution',
    answer:
      'CHITEK provides reactive support and harmonic control for utility and distribution networks using SVG for voltage and power factor, and AHF where industrial or traction loads inject harmonics. Distributed generation, long feeders and EV clusters each stress the network differently, so ratings are set from measurements at the point of common coupling.',
    title: 'Power Grid & Distribution Power Quality Solutions | CHITEK',
    description:
      'SVG and AHF for transmission and distribution substations, urban networks, long rural feeders and DG tie-points, sized from a network study.',
    card: {
      lead:
        'Reactive and harmonic control on',
      equipment: [
        'transmission and distribution substations',
        'urban distribution networks',
        'long rural feeders',
        'distributed generation tie-points',
        'EV charging clusters',
      ],
    },
    intro:
      'Transmission and distribution networks carry the combined effect of everything downstream: industrial harmonics, traction unbalance, distributed generation and long-line reactive loss. The usual CHITEK arrangement is an SVG on the busbar for voltage and reactive support, with AHF on the feeders that carry the worst harmonic load.',
    comparison: {
      heading: 'AHF or SVG on a distribution network?',
      intro:
        'On utility and distribution networks the two devices address different network constraints, and both are normally specified together at the planning stage.',
      rows: [
        {
          aspect: 'What it does',
          ahf: 'Injects a compensating current that cancels the harmonic current drawn by non-linear loads.',
          svg: 'Supplies or absorbs reactive power continuously to hold power factor and support voltage.',
        },
        {
          aspect: 'Primary target',
          ahf: 'Current distortion (THDi) and harmonic spectrum at the point of common coupling.',
          svg: 'Power factor, voltage fluctuation and reactive demand across the load cycle.',
        },
        {
          aspect: 'Typical trigger',
          ahf: 'VFD banks, rectifiers, welding sets, induction furnaces, LED drivers, UPS rectifiers.',
          svg: 'Low or swinging power factor, voltage sag and rise, weak or long feeders, EV load steps.',
        },
        {
          aspect: 'Behaviour at light load',
          ahf: 'Compensation scales with the measured harmonic current, so output falls as load falls.',
          svg: 'Holds output as required to reach the target power factor even at near-zero active load.',
        },
        {
          aspect: 'Use in this sector',
          ahf: 'Harmonic correction at feeders where industrial or traction loads inject distortion into the network.',
          svg: 'Reactive support and voltage control on long feeders, at DG tie-points and at EV charging clusters.',
        },
      ],
      note: 'Network studies set the targets; the equipment ratings follow from the study rather than from a template.',
    },
    faq: [
      {
        q: 'Where do SVG and AHF go in a substation?',
        a: 'SVG on the busbar for reactive voltage support, AHF on the specific feeders with the highest harmonic load. Treating an entire station for harmonics is rarely economic.',
      },
      {
        q: 'What causes end-of-line voltage collapse on rural feeders?',
        a: 'Reactive loss over a long line. As current rises, both the resistive and the reactive drop grow, and the voltage at the far end falls out of the usable band. Reactive support near the load end is usually more effective than raising the source voltage.',
      },
      {
        q: 'Does distributed generation change the power quality picture?',
        a: 'Yes. Reverse power flow raises voltage at the connection point and inverters add switching harmonics. Protection coordination and tap changer behaviour both need rechecking when DG capacity grows.',
      },
      {
        q: 'Can an underground cable network be over-compensated?',
        a: 'Yes. Cable capacitance generates reactive power at light load and can push the measured power factor leading, which raises voltage and stresses insulation. It also creates a parallel resonance risk with the transformer inductance.',
      },
    ],
  },
];

export const solutionMetaById = Object.fromEntries(solutionMeta.map((m) => [m.id, m]));
export const solutionMetaBySlug = Object.fromEntries(solutionMeta.map((m) => [m.slug, m]));
