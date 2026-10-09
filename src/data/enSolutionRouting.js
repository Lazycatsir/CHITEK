// Symptom -> device routing data for the English solutions hub (/en/solutions).
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
 *
 * `symptom` is written the way a facilities or electrical engineer would raise
 * it, not in marketing language.
 * `measure` is what you look at to confirm it, which is also what makes each row
 * self-contained enough to be lifted out by a search or AI engine.
 * `note` is the caveat that stops the row from being wrong in edge cases.
 */
export const SYMPTOM_ROUTES = [
  {
    id: 'neutral-overheat',
    symptom: 'Neutral conductor running hot, or its current is close to a phase current',
    measure: 'Neutral current vs phase current, and the 3rd / 9th harmonic content on the neutral',
    device: 'ahf',
    why: 'Triplen harmonics from single-phase electronic loads add on the neutral instead of cancelling. AHF is the only one of the two that removes them.',
    note: 'Check phase balance first — unbalance alone can load the neutral without any harmonic contribution.',
  },
  {
    id: 'capacitor-resonance',
    symptom: 'Power factor correction capacitors failing or switchgear tripping without an obvious fault',
    measure: 'Whether the capacitor bank and transformer inductance put a parallel resonance near a harmonic order present on site',
    device: 'ahf',
    why: 'The bank is amplifying harmonics rather than filtering them. Selective filtering orders plus anti-resonance control let the bank stay in service.',
    note: 'Where the filter CTs sample decides whether LC resonance can be excited. Sampling on the load side is the fallback.',
  },
  {
    id: 'pf-penalty',
    symptom: 'Utility power factor penalty, or reactive energy appearing on the bill',
    measure: 'Power factor and reactive demand across the whole load cycle, including standby and overnight',
    device: 'svg',
    why: 'SVG holds a target power factor continuously, including when active load is near zero, which is where a capacitor bank loses control.',
    note: 'If the site has a capacitor bank that steps in lumps, SVG also removes the over-compensation that shows up at light load.',
  },
  {
    id: 'leading-pf',
    symptom: 'Power factor measured leading at night or at the weekend',
    measure: 'Power factor at minimum load, and the capacitance of any long underground cable runs',
    device: 'svg',
    why: 'Cable capacitance generates reactive power at light load. SVG absorbs the excess instead of adding more.',
    note: 'A conventional capacitor bank can only ever add reactive power, so it cannot correct this.',
  },
  {
    id: 'voltage-sag',
    symptom: 'Equipment tripping or restarting on short voltage dips',
    measure: 'Sag depth and duration at the equipment terminals, logged during the incidents',
    device: 'svg',
    why: 'SVG responds within a cycle to hold bus voltage. It reduces the depth and duration of the dip; it does not replace a UPS for a sustained outage.',
    note: 'Where the sag is caused by a large motor start on the same bus, reactive support at the bus is usually more effective than a larger source transformer.',
  },
  {
    id: 'voltage-flicker',
    symptom: 'Lights visibly flickering when a furnace, welder or large drive cycles',
    measure: 'Pst / Plt short-term flicker severity at the point of common coupling',
    device: 'svg',
    why: 'Flicker comes from a rapidly swinging reactive demand. SVG tracks the swing and cancels it; AHF does not address reactive swing.',
    note: 'Flicker caused by a single intermittent arc load may need the load itself reviewed before reactive compensation is sized.',
  },
  {
    id: 'thd-high',
    symptom: 'Harmonic distortion at the incoming supply above the agreed or statutory limit',
    measure: 'Current and voltage harmonic spectrum, and which orders carry the most current',
    device: 'ahf',
    why: 'AHF injects a cancelling current, order by order, sized to the measured spectrum rather than to the load rating.',
    note: 'Sizing from transformer kVA alone is the usual reason an installation ends up undersized. Measure first.',
  },
  {
    id: 'transformer-overheat',
    symptom: 'Transformer running hotter than its loading suggests, or being derated',
    measure: 'Harmonic loss contribution and the K-factor or derating requirement for the load mix',
    device: 'ahf',
    why: 'Harmonic current causes extra eddy and stray loss that a standard kVA rating does not account for. Removing the harmonic current removes that loss.',
    note: 'Derating is a symptom, not the problem. Confirm the harmonic contribution before assuming the transformer is undersized.',
  },
  {
    id: 'vfd-bank',
    symptom: 'Harmonic distortion appearing after a VFD retrofit or a new drive line',
    measure: 'Harmonic spectrum on the feeder that supplies the drives, at their operating duty point',
    device: 'ahf',
    why: 'Six-pulse rectifiers in drives are a characteristic harmonic source. The distortion scales with drive loading, so AHF output falls with load naturally.',
    note: 'Multiple drives on one bus interleave their harmonics; the combined emission is not the sum of the individual ratings.',
  },
  {
    id: 'inverter-resonance',
    symptom: 'Inverter or PCS units tripping together on a PV, wind or storage site',
    measure: 'Wideband oscillation and the resonance point formed by the inverter filters and the collector or grid impedance',
    device: 'both',
    why: 'Multi-inverter sites produce both interleaved switching harmonics and a reactive swing as output changes. The two are rated separately.',
    note: 'The resonance scan belongs to a system study, not to an equipment selection. Ratings follow the study.',
  },
  {
    id: 'load-step',
    symptom: 'Voltage dipping each time a large load or a group of chargers starts together',
    measure: 'Step size and repetition rate against the flicker and voltage-change limits that apply to the site',
    device: 'both',
    why: 'The step itself is largely a reactive event, so SVG carries most of it. Where the chargers or rectifiers also add harmonics, AHF is added on the same bus.',
    note: 'Demand-charge exposure from the same load step is a tariff question and is separate from the power quality fix.',
  },
  {
    id: 'phase-imbalance',
    symptom: 'One phase carrying noticeably more current than the others, or motors running hot',
    measure: 'Negative-sequence and zero-sequence current, and how the single-phase load is distributed between phases',
    device: 'both',
    why: 'The distribution problem has to be fixed first. AHF removes the harmonic component that rides on top of it; SVG supports the voltage where the imbalance produces a sustained unbalance.',
    note: 'Re-balancing the single-phase load should always be considered before buying equipment.',
  },
];

/**
 * Decision tree used by the "Which device do I need?" section.
 * Node ids are referenced by `next` so the walk can be rendered without any
 * framework, and so the whole tree stays readable in source.
 */
export const DECISION_TREE = {
  start: {
    question: 'What does the measurement show first?',
    options: [
      { label: 'Current distortion is above the limit', next: 'has-capacitor' },
      { label: 'Power factor is low, or reactive is being charged for', next: 'light-load' },
      { label: 'Voltage dips or flickers under load steps', next: 'sag-source' },
      { label: 'Neutral current is high, or capacitors keep failing', next: 'done-ahf' },
    ],
  },
  'has-capacitor': {
    question: 'Is there an existing capacitor bank on the same bus?',
    options: [
      { label: 'Yes, and it stays in service', next: 'done-ahf-resonance' },
      { label: 'Yes, but it can be replaced or removed', next: 'done-ahf' },
      { label: 'No capacitor bank on site', next: 'done-ahf' },
    ],
  },
  'light-load': {
    question: 'What is the power factor at minimum load, overnight or at the weekend?',
    options: [
      { label: 'Still low or lagging', next: 'done-svg' },
      { label: 'Swinging, or measured leading', next: 'done-svg' },
      { label: 'Fine at light load, only low at peak', next: 'done-svg' },
    ],
  },
  'sag-source': {
    question: 'What conditions is the sag tied to?',
    options: [
      { label: 'A large motor or drive starting on the same bus', next: 'done-svg' },
      { label: 'Several chargers or rectifiers starting together', next: 'done-both' },
      { label: 'An external supply event, not a site load', next: 'done-svg-external' },
    ],
  },
  // ---- Outcomes ----
  'done-ahf': {
    device: 'ahf',
    heading: 'Start with an active harmonic filter (AHF)',
    body: 'Size the filter from the measured harmonic spectrum at the point of common coupling, not from the transformer rating. Output follows the load, so the filter does not need to be rated for coincidence that never happens.',
    nextSteps: [
      'Log the harmonic spectrum at the incoming supply over a full working cycle',
      'Note the worst orders and the current they carry',
      'Pick a frame rating from the measured harmonic current, with headroom for growth',
    ],
  },
  'done-ahf-resonance': {
    device: 'ahf',
    heading: 'Start with an AHF, with anti-resonance control',
    body: 'The capacitor bank is the complication. Parallel resonance between the bank and the transformer inductance amplifies harmonics instead of removing them, so the filter has to run with selective filtering orders and anti-resonance control while the bank stays in service.',
    nextSteps: [
      'Establish whether the filter CTs sample on the grid side or the load side',
      'If the connection sits downstream of a pure capacitor bank, plan to move CT sampling or accept anti-resonance control',
      'Confirm the resonance point against the harmonic orders actually present',
    ],
  },
  'done-svg': {
    device: 'svg',
    heading: 'Start with a static var generator (SVG)',
    body: 'SVG holds a target power factor continuously and absorbs as well as supplies reactive power. That is what lets it work at light load, where a capacitor bank either over-compensates or has to be stepped out.',
    nextSteps: [
      'Measure the reactive profile over the full load cycle, not only at peak',
      'Check the power factor at minimum load for a leading condition',
      'Size from the reactive swing, with the target power factor stated up front',
    ],
  },
  'done-svg-external': {
    device: 'svg',
    heading: 'Reactive support will help, but treat it as one part of the fix',
    body: 'SVG will hold bus voltage through the event, but a sag that originates upstream cannot be eliminated at the LV bus. Reactive support at the bus reduces depth and duration; anything longer than a few cycles has to be covered by the UPS or by a supply-side arrangement.',
    nextSteps: [
      'Separate site-originated sags from events that come in from the supply',
      'Log sag depth and duration at the terminals of the equipment that trips',
      'Compare the withstand curve of that equipment against what the log shows',
    ],
  },
  'done-both': {
    device: 'both',
    heading: 'Plan for AHF and SVG together',
    body: 'A load step that is also a harmonic source needs both. SVG carries the reactive step; AHF takes out the harmonics the rectifiers add on the same bus. They are measured separately and rated separately.',
    nextSteps: [
      'Measure the step size and repetition rate at the point of common coupling',
      'Measure the harmonic spectrum on the same bus at the same time',
      'Split the ratings between the two devices from those two measurements',
    ],
  },
};
