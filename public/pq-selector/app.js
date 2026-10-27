const stepLabels = ["Problem", "Electrical", "Loads", "Power Factor", "Harmonics", "Installation"];

const stepConfig = [
  {
    title: "Step 1: Main power quality issue",
    description:
      "Select the main issue first, then the tool will narrow the likely AHF, SVG, or hybrid direction."
  },
  {
    title: "Describe the electrical system",
    description:
      "A main incomer current or transformer size gives us a first-pass sizing basis for compensation capacity."
  },
  {
    title: "Select the dominant load types",
    description:
      "Nonlinear and inductive loads shape both the filtering strategy and the expected kvar requirement."
  },
  {
    title: "What is the existing power factor?",
    description:
      "Even an approximate band is enough for a preliminary kvar estimate."
  },
  {
    title: "What do you know about harmonics?",
    description:
      "If no report is available, choose the nearest estimate. Lower confidence will be flagged where measurements are missing."
  },
  {
    title: "Preferred installation format",
    description:
      "This helps suggest whether a cabinetized or modular layout is the best fit."
  }
];

const problemOptions = [
  {
    value: "Low power factor penalties",
    description: "Utility penalties or poor power factor trends are driving the project."
  },
  {
    value: "Harmonic distortion alarms",
    description: "Meters, analyzers, or protection devices indicate elevated THDi risk."
  },
  {
    value: "Capacitor bank failures",
    description: "Existing capacitor stages are unstable, aging early, or failing outright."
  },
  {
    value: "Transformer overheating",
    description: "Thermal stress suggests distortion, overload, or reactive demand issues."
  },
  {
    value: "Frequent breaker trips",
    description: "Protection nuisance trips can be linked to current distortion and peak loading."
  },
  {
    value: "VFD-related issues",
    description: "The site has known drive-heavy loads affecting power quality."
  },
  {
    value: "UPS/data center issues",
    description: "Sensitive digital loads need cleaner power and tighter control."
  },
  {
    value: "Not sure / need assessment",
    description: "Use the broader assessment path when symptoms are mixed or unclear."
  }
];

const loadOptions = [
  { value: "VFDs", description: "Common source of 5th, 7th, and higher-order harmonics." },
  { value: "UPS systems", description: "Sensitive load environment with nonlinear rectifier behavior." },
  { value: "Solar inverters", description: "Converter-based generation with varying harmonic contribution." },
  { value: "EV chargers", description: "Fast-changing electronic load blocks with reactive and harmonic effects." },
  { value: "Welding machines", description: "Pulsed nonlinear loads that often create waveform distortion." },
  { value: "Motors", description: "Inductive demand that can materially lower power factor." },
  { value: "Data center", description: "High uptime environment where harmonics and PF both matter." }
];

const powerFactorOptions = [
  { value: "Below 0.8", description: "Heavy reactive demand. SVG or hybrid solutions are often justified." },
  { value: "0.8–0.9", description: "Moderate correction likely required for utility and system efficiency targets." },
  { value: "Above 0.95", description: "Power factor is already strong, so the main issue may be harmonics." },
  { value: "Not sure", description: "We will infer a moderate baseline and flag the estimate as preliminary." }
];

const harmonicOptions = [
  { value: "THDi above 20%", description: "Strong signal for active filtering, often beyond passive correction comfort zones." },
  { value: "THDi 10–20%", description: "Moderate harmonic exposure that still may justify active mitigation." },
  { value: "THDi below 10%", description: "Low measured distortion, though load profile may still require targeted treatment." },
  { value: "Not measured", description: "We can still recommend a path, but field measurements should follow." }
];

const installOptions = [
  { value: "Cabinet solution", description: "Best for packaged delivery, cleaner commissioning, and large centralized projects." },
  { value: "Rack modules", description: "Useful where modular expansion and bay-level serviceability matter." },
  { value: "Not sure", description: "We will infer a format from likely size and architecture." }
];

const roadmapItems = [
  "Upload SLD",
  "Upload harmonic report",
  "AI engineering analysis",
  "ROI calculator",
  "Automatic quotation generation"
];

const salesRecipientEmail = "leo.li@chitek-inno.com";

const datasheetLibrary = {
  ahf: {
    name: "CHITEK SiC Ultra AHF Datasheet",
    file: "/assets/pdf/sic-ultra-ahf-datasheet.pdf",
    preview: "/assets/images/products-ahf-sic-r2.webp",
    family: "Active Harmonic Filter",
    voltage: "220~480V / 50(60)Hz"
  },
  svg: {
    name: "CHITEK Distributed SVG User Manual",
    file: "/assets/pdf/distributed-svg-user-manual-en.pdf",
    preview: "/assets/images/products-asvg-cabinet.webp",
    family: "Static Var Generator",
    voltage: "400V / 50(60)Hz"
  }
};

/* ============================================================
 * 真实机型口径 —— 本文件唯一的型号来源，改这里不要改别处
 * ------------------------------------------------------------
 * AHF 容量档 / 电压档 / 型号写法：src/pages/en/products.astro
 *   AHF Selection Matrix，型号 = AHF-<Series>-<NNN>A-<VVV>
 * AHF 尺寸 / 重量：各详情页 Module Parameters 表（src/data/ahfSku.js）
 * SVG 容量档 / 电压档：src/pages/en/products-svg/ 八个系列页
 * 并联上限：官方参数表 "Number of Parallel Connections ≤ 16 units"
 * 详情页没列尺寸的系列一律写 "Refer to datasheet"，不编数字。
 * ============================================================ */

const PARALLEL_LIMIT = 16;

const VOLT_BANDS = {
  208: { label: "200~240 V", tag: "208V" },
  400: { label: "380~415 V", tag: "400V" },
  480: { label: "460~500 V", tag: "480V" },
  690: { label: "660~800 V", tag: "690V" }
};

const UNKNOWN_DIM = "Refer to datasheet";

const AHF_SERIES = [
  {
    code: "U",
    name: "Ultra-Slim",
    desc: "Thinnest wall-mount module (45 mm deep) for tight switchboard bays.",
    caps: { 400: [15] },
    dims: { 15: "340 × 410 × 45 mm" },
    weight: { 15: "7.5 kg" }
  },
  {
    code: "D",
    name: "Distributed",
    desc: "Bay-level module for installation next to the dominant feeders.",
    caps: { 400: [30, 50] },
    dims: { 30: "380 × 400 × 88 mm", 50: "380 × 400 × 88 mm" },
    weight: { 30: "11.5 kg", 50: "11.5 kg" }
  },
  {
    code: "C",
    name: "SiC",
    desc: "SiC-based module with the highest switching frequency of the range.",
    caps: { 400: [50, 75, 100, 150], 208: [50, 75, 100, 150], 480: [50, 75, 100, 150] },
    dims: {
      50: "500 × 550 × 130 mm", 75: "500 × 550 × 130 mm",
      100: "500 × 550 × 130 mm", 150: "500 × 550 × 175 mm"
    },
    weight: { 50: "19 kg", 75: "24 kg", 100: "24 kg", 150: "29 kg" }
  },
  {
    code: "A",
    name: "Anti-Pollution",
    desc: "Sealed air path for dusty, corrosive or high-humidity plants.",
    caps: {
      400: [50, 75, 100, 150, 200],
      208: [50, 75, 100, 150, 200],
      480: [50, 75, 100, 150, 200],
      690: [85, 100]
    },
    dims: {
      50: "500 × 550 × 130 mm", 75: "500 × 550 × 130 mm",
      100: "500 × 550 × 130 mm", 150: "500 × 550 × 175 mm", 200: "500 × 550 × 175 mm"
    },
    weight: { 50: "19 kg", 75: "24 kg", 100: "24 kg", 150: "29 kg", 200: "34 kg" }
  },
  {
    code: "L",
    name: "Standard",
    desc: "Standard rack module with the widest capacity coverage.",
    caps: {
      400: [50, 75, 100, 150, 200],
      208: [50, 75, 100, 150, 200],
      480: [50, 75, 100, 150, 200],
      690: [85, 100]
    },
    dims: {},
    weight: {}
  }
];

const SVG_SERIES = [
  { code: "U", name: "Ultra-Slim", desc: "Slim module for space-constrained LV panels.", caps: { 400: [5, 10, 14], 208: [5, 10, 14], 480: [5, 10, 14] } },
  { code: "D", name: "Distributed", desc: "Feeder-level compensation close to inductive loads.", caps: { 400: [20, 30], 208: [20, 30], 480: [20, 30] } },
  { code: "C", name: "SiC", desc: "SiC-based module with fast dynamic response.", caps: { 400: [20, 35, 50, 75, 100, 150], 208: [20, 35, 50, 75, 100, 150], 480: [20, 35, 50, 75, 100, 150] } },
  { code: "A", name: "Anti-Pollution", desc: "Sealed air path for harsh plant environments.", caps: { 400: [35, 50, 75, 100, 150], 208: [35, 50, 75, 100, 150], 480: [35, 50, 75, 100, 150] } },
  { code: "H", name: "Anti-Pollution HV", desc: "Medium-voltage class cabinet for 690/800 V systems.", caps: { 690: [120, 150], 800: [120, 150] } }
];

const sampleData = {
  mainProblem: "Transformer overheating",
  voltage: "480V",
  otherVoltage: "",
  breakerCurrent: "1600",
  transformerCapacity: "",
  loadTypes: ["VFDs", "Motors", "Welding machines"],
  powerFactor: "0.8–0.9",
  harmonicInfo: "THDi above 20%",
  installPreference: "Cabinet solution"
};

const state = {
  step: 0,
  form: {
    mainProblem: "",
    voltage: "",
    otherVoltage: "",
    breakerCurrent: "",
    transformerCapacity: "",
    loadTypes: [],
    powerFactor: "",
    harmonicInfo: "",
    installPreference: ""
  },
  result: null
};

const progressTitle = document.getElementById("progress-title");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");
const stepGrid = document.getElementById("step-grid");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepContent = document.getElementById("step-content");
const errorBox = document.getElementById("error-box");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const previewMetrics = document.getElementById("preview-metrics");
const previewPanel = document.getElementById("preview-panel");
const signalList = document.getElementById("signal-list");
const resultsSection = document.getElementById("results-section");
const leadForm = document.getElementById("lead-form");
const leadStatus = document.getElementById("lead-status");
const loadSampleBtn = document.getElementById("load-sample-btn");
const roadmapGrid = document.getElementById("roadmap-grid");
const leadSummary = document.getElementById("lead-summary");
const copySummaryBtn = document.getElementById("copy-summary-btn");
const rfqMailtoBtn = document.getElementById("rfq-mailto-btn");

copySummaryBtn.addEventListener("click", async () => {
  if (!leadSummary.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(leadSummary.value);
    leadStatus.textContent = "RFQ summary copied. You can paste it into email, WhatsApp, or your CRM.";
  } catch (error) {
    leadStatus.textContent = "Could not copy automatically on this browser, but the RFQ summary is ready to copy manually.";
  }
});

loadSampleBtn.addEventListener("click", () => {
  state.form = JSON.parse(JSON.stringify(sampleData));
  state.step = 5;
  state.result = buildRecommendation(state.form);
  leadForm.reset();
  leadStatus.textContent =
    "This demo stores the lead in your browser only. In production, connect this form to CRM or RFQ routing.";
  render();
  scrollToSection(resultsSection);
});

backBtn.addEventListener("click", () => {
  if (state.step > 0) {
    state.step -= 1;
    clearError();
    render();
  }
});

nextBtn.addEventListener("click", () => {
  const validation = validateStep();
  if (validation) {
    showError(validation);
    return;
  }

  clearError();

  if (state.step === 5) {
    state.result = buildRecommendation(state.form);
    render();
    scrollToSection(resultsSection);
    return;
  }

  state.step += 1;
  render();
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lead = Object.fromEntries(new FormData(leadForm).entries());
  localStorage.setItem("chitekSelectorLead", JSON.stringify(lead));
  leadStatus.textContent =
    "Thanks. Your project details were saved in this browser for demo purposes and are ready for a production CRM handoff.";
});

function render() {
  renderProgress();
  renderStep();
  renderPreview();
  renderSignals();
  renderResults();
  renderRoadmap();
}

function renderProgress() {
  const completion = Math.round(((state.step + 1) / stepLabels.length) * 100);
  progressTitle.textContent = `Step ${state.step + 1} of ${stepLabels.length}`;
  progressPercent.textContent = `${completion}%`;
  progressFill.style.width = `${completion}%`;
  backBtn.disabled = state.step === 0;
  nextBtn.textContent = state.step === 5 ? "Generate Recommendation" : "Continue";

  stepGrid.innerHTML = stepLabels
    .map((label, index) => {
      const classes = [
        "step-badge",
        index === state.step ? "active" : "",
        index < state.step ? "complete" : ""
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <div class="${classes}">
          <strong>0${index + 1}</strong>
          <span>${label}</span>
        </div>
      `;
    })
    .join("");
}

function renderStep() {
  const config = stepConfig[state.step];
  stepTitle.textContent = config.title;
  stepDescription.textContent = config.description;

  if (state.step === 0) {
    stepContent.innerHTML = renderCardGrid(problemOptions, state.form.mainProblem, (value) => `
      <button class="step-card ${state.form.mainProblem === value ? "selected" : ""}" data-type="single" data-field="mainProblem" data-value="${escapeAttr(value)}" type="button">
        <div class="step-card-top">
          <div>
            <h3>${value}</h3>
            <p>${problemOptions.find((item) => item.value === value).description}</p>
          </div>
          <span class="selection-mark">${state.form.mainProblem === value ? "•" : "•"}</span>
        </div>
      </button>
    `, "two");
  }

  if (state.step === 1) {
    stepContent.innerHTML = `
      <div class="field-row electrical">
        <div class="field-box">
          <label>
            <span>System voltage</span>
            <select id="voltage-select">
              <option value="">Select voltage</option>
              ${["208V", "400V", "480V", "690V", "Other"]
                .map((option) => `<option value="${option}" ${state.form.voltage === option ? "selected" : ""}>${option}</option>`)
                .join("")}
            </select>
          </label>
          ${
            state.form.voltage === "Other"
              ? `
                <label style="margin-top: 14px;">
                  <span>Custom voltage (V)</span>
                  <input id="other-voltage-input" type="number" value="${escapeAttr(state.form.otherVoltage)}" placeholder="Enter voltage in V" />
                </label>
              `
              : ""
          }
        </div>

        <div class="field-grid">
          <div class="field-box">
            <label>
              <span>Main breaker current (A)</span>
              <input id="breaker-input" type="number" value="${escapeAttr(state.form.breakerCurrent)}" placeholder="Example: 1600" />
            </label>
          </div>
          <div class="or-pill">OR</div>
          <div class="field-box">
            <label>
              <span>Transformer capacity (kVA)</span>
              <input id="transformer-input" type="number" value="${escapeAttr(state.form.transformerCapacity)}" placeholder="Example: 1000" />
            </label>
          </div>
        </div>
      </div>
    `;
  }

  if (state.step === 2) {
    stepContent.innerHTML = renderCardGrid(loadOptions, state.form.loadTypes, (value) => `
      <button class="step-card ${state.form.loadTypes.includes(value) ? "selected" : ""}" data-type="multi" data-field="loadTypes" data-value="${escapeAttr(value)}" type="button">
        <div class="step-card-top">
          <div>
            <h3>${value}</h3>
            <p>${loadOptions.find((item) => item.value === value).description}</p>
          </div>
          <span class="selection-mark">${state.form.loadTypes.includes(value) ? "âœ“" : "âœ“"}</span>
        </div>
      </button>
    `, "three");
  }

  if (state.step === 3) {
    stepContent.innerHTML = renderCardGrid(powerFactorOptions, state.form.powerFactor, (value) => `
      <button class="step-card ${state.form.powerFactor === value ? "selected" : ""}" data-type="single" data-field="powerFactor" data-value="${escapeAttr(value)}" type="button">
        <div class="step-card-top">
          <div>
            <h3>${value}</h3>
            <p>${powerFactorOptions.find((item) => item.value === value).description}</p>
          </div>
          <span class="selection-mark">${state.form.powerFactor === value ? "•" : "•"}</span>
        </div>
      </button>
    `, "two");
  }

  if (state.step === 4) {
    stepContent.innerHTML = renderCardGrid(harmonicOptions, state.form.harmonicInfo, (value) => `
      <button class="step-card ${state.form.harmonicInfo === value ? "selected" : ""}" data-type="single" data-field="harmonicInfo" data-value="${escapeAttr(value)}" type="button">
        <div class="step-card-top">
          <div>
            <h3>${value}</h3>
            <p>${harmonicOptions.find((item) => item.value === value).description}</p>
          </div>
          <span class="selection-mark">${state.form.harmonicInfo === value ? "•" : "•"}</span>
        </div>
      </button>
    `, "two");
  }

  if (state.step === 5) {
    stepContent.innerHTML = renderCardGrid(installOptions, state.form.installPreference, (value) => `
      <button class="step-card ${state.form.installPreference === value ? "selected" : ""}" data-type="single" data-field="installPreference" data-value="${escapeAttr(value)}" type="button">
        <div class="step-card-top">
          <div>
            <h3>${value}</h3>
            <p>${installOptions.find((item) => item.value === value).description}</p>
          </div>
          <span class="selection-mark">${state.form.installPreference === value ? "•" : "•"}</span>
        </div>
      </button>
    `, "three");
  }

  bindStepInteractions();
}

function renderCardGrid(options, selected, renderItem, densityClass) {
  const values = Array.isArray(selected) ? selected : options.map((item) => item.value);
  void values;
  return `<div class="card-grid ${densityClass}">${options.map((item) => renderItem(item.value)).join("")}</div>`;
}

function bindStepInteractions() {
  stepContent.querySelectorAll("[data-type='single']").forEach((button) => {
    button.addEventListener("click", () => {
      state.form[button.dataset.field] = button.dataset.value;
      clearError();
      render();
    });
  });

  stepContent.querySelectorAll("[data-type='multi']").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.value;
      const exists = state.form.loadTypes.includes(value);
      state.form.loadTypes = exists
        ? state.form.loadTypes.filter((item) => item !== value)
        : [...state.form.loadTypes, value];
      clearError();
      render();
    });
  });

  const voltageSelect = document.getElementById("voltage-select");
  if (voltageSelect) {
    voltageSelect.addEventListener("change", (event) => {
      state.form.voltage = event.target.value;
      if (state.form.voltage !== "Other") {
        state.form.otherVoltage = "";
      }
      clearError();
      render();
    });
  }

  const otherVoltageInput = document.getElementById("other-voltage-input");
  if (otherVoltageInput) {
    otherVoltageInput.addEventListener("input", (event) => {
      state.form.otherVoltage = event.target.value;
    });
  }

  const breakerInput = document.getElementById("breaker-input");
  if (breakerInput) {
    breakerInput.addEventListener("input", (event) => {
      state.form.breakerCurrent = event.target.value;
    });
  }

  const transformerInput = document.getElementById("transformer-input");
  if (transformerInput) {
    transformerInput.addEventListener("input", (event) => {
      state.form.transformerCapacity = event.target.value;
    });
  }
}

function renderPreview() {
  if (!state.result) {
    previewPanel.classList.add("hidden");
    return;
  }

  previewPanel.classList.remove("hidden");
  const preview = buildRecommendation(state.form);
  previewMetrics.innerHTML = [
    { label: "Likely solution path", value: preview.solutionLabel },
    { label: "Projected compensation", value: preview.compensationCapacityLabel },
    { label: "Likely topology", value: preview.topology }
  ]
    .map(
      (item) => `
        <div class="preview-metric">
          <p>${item.label}</p>
          <strong>${item.value}</strong>
        </div>
      `
    )
    .join("");
}

function renderSignals() {
  const signals = [
    { label: "Main issue", value: state.form.mainProblem || "Waiting for input" },
    {
      label: "Voltage",
      value:
        state.form.voltage === "Other"
          ? `${state.form.otherVoltage || "Custom"} V`
          : state.form.voltage || "Waiting for input"
    },
    {
      label: "Load profile",
      value: state.form.loadTypes.length ? state.form.loadTypes.join(", ") : "Waiting for input"
    },
    {
      label: "Power quality data",
      value: `${state.form.powerFactor || "PF pending"} / ${state.form.harmonicInfo || "THDi pending"}`
    }
  ];

  signalList.innerHTML = signals
    .map(
      (item) => `
        <article class="signal-card">
          <p>${item.label}</p>
          <strong>${item.value}</strong>
        </article>
      `
    )
    .join("");
}

function renderResults() {
  if (!state.result) {
    resultsSection.classList.add("hidden");
    return;
  }

  resultsSection.classList.remove("hidden");

  document.getElementById("result-solution-title").textContent = state.result.solutionLabel;
  document.getElementById("result-why").textContent = state.result.whySelected;
  document.getElementById("result-confidence").textContent = state.result.confidenceLabel;
  document.getElementById("result-solution-type").textContent = state.result.solutionLabel;
  document.getElementById("result-size").textContent = state.result.compensationCapacityLabel;
  document.getElementById("result-installation").textContent = state.result.installationType;
  document.getElementById("result-topology").textContent = state.result.topology;

  document.getElementById("result-metrics").innerHTML = [
    {
      label: "Estimated THDi reduction",
      value: `${state.result.estimatedThdiReduction}%`,
      progress: state.result.estimatedThdiReduction
    },
    {
      label: "Estimated PF improvement",
      value: `to ${state.result.estimatedPfAfter.toFixed(2)}`,
      progress: Math.min(100, state.result.estimatedPfAfter * 100)
    },
    {
      label: "Suggested compensation capacity",
      value: state.result.compensationCapacityLabel,
      progress: state.result.solutionType === "Hybrid" ? 88 : state.result.solutionType === "AHF" ? 76 : 72
    }
  ]
    .map(
      (item) => `
        <article class="metric-card">
          <div class="metric-row">
            <p>${item.label}</p>
            <strong>${item.value}</strong>
          </div>
          <div class="metric-bar">
            <div class="metric-bar-fill" style="width: ${item.progress}%"></div>
          </div>
        </article>
      `
    )
    .join("");

  document.getElementById("topology-metrics").innerHTML = [
    {
      label: "AHF installed / target",
      value: state.result.ahfInstalledRating
        ? `${state.result.ahfInstalledRating} A / ${state.result.ahfTargetRating} A`
        : "Not primary"
    },
    {
      label: "SVG installed / target",
      value: state.result.svgInstalledRating
        ? `${state.result.svgInstalledRating} kvar / ${state.result.svgTargetRating} kvar`
        : "Not primary"
    },
    { label: "Estimated THDi after", value: `${state.result.estimatedThdiAfter}%` },
    { label: "Inferred system size", value: `${state.result.inferredSystemKva} kVA` }
  ]
    .map(
      (item) => `
        <div class="topology-metric">
          <p>${item.label}</p>
          <strong>${item.value}</strong>
        </div>
      `
    )
    .join("");

  document.getElementById("reason-stack").innerHTML = state.result.reasonSummary
    .map((reason) => `<article class="reason-card">${reason}</article>`)
    .join("");

  document.getElementById("note-stack").innerHTML = state.result.engineeringNotes
    .map((note) => `<article class="note-card">${note}</article>`)
    .join("");

  document.getElementById("product-grid").innerHTML = state.result.products
    .map((product) => renderProductCard(product))
    .join("");

  const leadData = getLeadData();
  const summaryText = buildRfQSummary(state.form, state.result, leadData);
  leadSummary.value = summaryText;
  rfqMailtoBtn.href = buildMailtoLink(summaryText, state.result, leadData);
}

function renderRoadmap() {
  if (roadmapGrid.children.length) {
    return;
  }

  roadmapGrid.innerHTML = roadmapItems
    .map(
      (item) => `
        <article class="roadmap-card">
          <div class="roadmap-icon">+</div>
          <h3>${item}</h3>
          <p>${roadmapDescription(item)}</p>
          <span class="roadmap-tag">Coming next</span>
        </article>
      `
    )
    .join("");
}

function roadmapDescription(item) {
  const descriptions = {
    "Upload SLD": "Attach single-line diagrams for more accurate feeder-level topology guidance.",
    "Upload harmonic report":
      "Use measured THDi and spectrum data to refine filter sizing and confidence.",
    "AI engineering analysis":
      "Future module for project-specific engineering reasoning and risk flags.",
    "ROI calculator":
      "Estimate utility penalty reduction, loss reduction, and payback period.",
    "Automatic quotation generation":
      "Convert approved recommendations directly into structured quotation drafts."
  };

  return descriptions[item];
}

function validateStep() {
  if (state.step === 0 && !state.form.mainProblem) {
    return "Select the main problem so the recommendation engine can prioritize the solution path.";
  }

  if (state.step === 1) {
    if (!state.form.voltage) {
      return "Select the system voltage before continuing.";
    }

    if (state.form.voltage === "Other" && !state.form.otherVoltage) {
      return "Enter the custom system voltage.";
    }

    if (!state.form.breakerCurrent && !state.form.transformerCapacity) {
      return "Enter either the main breaker current or the transformer capacity.";
    }
  }

  if (state.step === 2 && state.form.loadTypes.length === 0) {
    return "Choose at least one dominant load type.";
  }

  if (state.step === 3 && !state.form.powerFactor) {
    return "Choose the closest existing power factor range.";
  }

  if (state.step === 4 && !state.form.harmonicInfo) {
    return "Select the best available harmonic information level.";
  }

  if (state.step === 5 && !state.form.installPreference) {
    return "Choose an installation preference, even if it is not sure.";
  }

  return "";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function scrollToSection(section) {
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function escapeAttr(value) {
  return String(value).replaceAll('"', "&quot;");
}

function buildRecommendation(data) {
  const voltage = parseVoltage(data);
  const inferredSystemKva = Math.round(inferSystemKva(data, voltage));
  const harmonicScore = inferHarmonicSeverity(data);
  const reactiveScore = inferReactiveSeverity(data);
  const solutionType = inferSolutionType(data, harmonicScore, reactiveScore);
  const existingPf = powerFactorToValue(data.powerFactor);
  const targetPf = inferTargetPowerFactor(data);
  const ahfCurrentRating = inferAhfSizing(data, solutionType, harmonicScore);
  const svgKvarRating = inferSvgSizing(data, solutionType, inferredSystemKva, existingPf, targetPf);
  const installationType = inferInstallationType(data, ahfCurrentRating, svgKvarRating);
  const topology = inferTopology(solutionType, ahfCurrentRating, svgKvarRating);
  const estimatedPfAfter = Number((solutionType === "AHF" ? Math.max(existingPf, 0.93) : targetPf).toFixed(2));
  const estimatedThdiAfter = inferEstimatedThdiAfter(data, solutionType);
  const baselineThdi = baselineHarmonicPercent(data.harmonicInfo);
  const estimatedThdiReduction = Math.max(
    0,
    Math.round(((baselineThdi - estimatedThdiAfter) / baselineThdi) * 100)
  );

  const reasonSummary = [
    `Detected ${inferredSystemKva} kVA class system at ${voltage} V.`,
    harmonicScore >= 5
      ? "Nonlinear load profile indicates a high harmonic mitigation need."
      : "Reactive power correction demand is more prominent than harmonic stress.",
    reactiveScore >= 4
      ? "Power factor correction demand is strong enough to justify dynamic kvar support."
      : "Harmonic treatment is the primary driver of the recommendation."
  ];

  if (data.mainProblem === "Capacitor bank failures") {
    reasonSummary.push(
      "Capacitor bank failures usually indicate resonance risk and justify a detuned or hybrid approach."
    );
  }

  const solutionLabel =
    solutionType === "AHF"
      ? "Active Harmonic Filter (AHF/APF)"
      : solutionType === "SVG"
        ? "Static Var Generator (SVG)"
        : "Hybrid AHF + SVG";

  const compensationCapacityLabel =
    solutionType === "AHF"
      ? `${ahfCurrentRating} A harmonic compensation`
      : solutionType === "SVG"
        ? `${svgKvarRating} kvar dynamic reactive compensation`
        : `${ahfCurrentRating} A + ${svgKvarRating} kvar combined compensation`;

  const whySelected =
    solutionType === "AHF"
      ? "The site signals point to harmonic stress from nonlinear loads, so the first priority is current-based active filtering."
      : solutionType === "SVG"
        ? "The dominant issue appears to be dynamic reactive power demand and poor power factor, making SVG the most direct correction method."
        : "Your inputs show both harmonic distortion and reactive power instability, so a hybrid architecture offers the best first-pass fit.";

  // 建议容量与匹配机型必须出自同一次解析，否则页面会自相矛盾
  const buildVoltage = Number.isFinite(voltage) ? voltage : 400;
  const buildVoltClass = voltageClass(buildVoltage);
  const ahfSelection =
    solutionType === "AHF" || solutionType === "Hybrid"
      ? resolveModules(AHF_SERIES, ahfSeriesOrder(data.installPreference), ahfCurrentRating, buildVoltClass)
      : null;
  const svgSelection =
    solutionType === "SVG" || solutionType === "Hybrid"
      ? resolveModules(SVG_SERIES, svgSeriesOrder(data.installPreference), svgKvarRating, buildVoltClass)
      : null;

  const selectionLabel = (selection, unit, target) => {
    if (!selection || !selection.available) return null;
    return selection.modules > 1
      ? `${selection.total} ${unit} (${selection.modules} × ${selection.cap} ${unit} modules, target ${Math.round(target)} ${unit})`
      : `${selection.cap} ${unit}`;
  };

  const ahfInstalledLabel = selectionLabel(ahfSelection, "A", ahfCurrentRating);
  const svgInstalledLabel = selectionLabel(svgSelection, "kvar", svgKvarRating);

  const installedCapacityLabel = (() => {
    if (solutionType === "AHF") {
      return ahfInstalledLabel
        ? `${ahfInstalledLabel} harmonic compensation`
        : "Custom AHF — no standard module at this voltage";
    }
    if (solutionType === "SVG") {
      return svgInstalledLabel
        ? `${svgInstalledLabel} dynamic reactive compensation`
        : "Custom SVG — no standard module at this voltage";
    }
    if (!ahfInstalledLabel && !svgInstalledLabel) {
      return "Custom AHF + SVG — no standard module at this voltage";
    }
    return `${ahfInstalledLabel || "Custom AHF"} + ${svgInstalledLabel || "Custom SVG"} combined compensation`;
  })();

  const voltageNotice = voltageBandNotice(buildVoltage, buildVoltClass);
  const needsParallel =
    (ahfSelection && ahfSelection.modules > 1) || (svgSelection && svgSelection.modules > 1);
  const needsCustom =
    (ahfSelection && !ahfSelection.available) || (svgSelection && !svgSelection.available);

  const confidenceLabel =
    needsCustom || voltageNotice
      ? "Preliminary confidence: low — engineering review required"
      : needsParallel || data.harmonicInfo === "Not measured" || data.powerFactor === "Not sure"
        ? "Preliminary confidence: medium"
        : "Preliminary confidence: high";

  const products = buildMatchedProducts(
    solutionType,
    ahfCurrentRating,
    svgKvarRating,
    buildVoltage,
    data.installPreference
  );

  const dynamicNotes = [
    "Final sizing should be confirmed against a single-line diagram, transformer impedance, and feeder diversity.",
    "Harmonic current spectrum and kvar demand should be validated with a site measurement or power quality analyzer.",
    solutionType === "Hybrid"
      ? "Hybrid systems are especially useful where capacitor banks have already shown instability near variable-speed loads."
      : "Centralized vs distributed placement should be finalized after reviewing load distribution and switchboard space."
  ];

  if (needsParallel) {
    dynamicNotes.push(
      `The target exceeds the largest single module at this voltage class, so the result is split into parallel modules (official link limit: ${PARALLEL_LIMIT} units). Confirm the parallel busbar and CT arrangement with CHITEK.`
    );
  }

  if (voltageNotice) dynamicNotes.push(voltageNotice);

  return {
    solutionType,
    solutionLabel,
    ahfCurrentRating,
    svgKvarRating,
    ahfTargetRating: Math.round(ahfCurrentRating),
    svgTargetRating: Math.round(svgKvarRating),
    ahfInstalledRating: ahfSelection && ahfSelection.available ? ahfSelection.total : null,
    svgInstalledRating: svgSelection && svgSelection.available ? svgSelection.total : null,
    ahfModules: ahfSelection && ahfSelection.available ? ahfSelection.modules : 0,
    svgModules: svgSelection && svgSelection.available ? svgSelection.modules : 0,
    voltClass: buildVoltClass,
    topology,
    installationType,
    estimatedPfAfter,
    estimatedThdiAfter,
    estimatedThdiReduction,
    whySelected,
    compensationCapacityLabel: installedCapacityLabel,
    targetCapacityLabel: compensationCapacityLabel,
    inferredSystemKva,
    confidenceLabel,
    reasonSummary,
    engineeringNotes: dynamicNotes,
    products
  };
}

/** 额定电压 → 站内机型电压档（矩阵里只有 208 / 400 / 480 / 690 四档）。
 *  超出 200~800 V 一律返回 null —— 没有标准机型，不能硬套邻近档。 */
function voltageClass(voltage) {
  const v = Number(voltage);
  if (!Number.isFinite(v) || v < 200 || v > 800) return null;
  if (v <= 240) return 208;
  if (v <= 415) return 400;
  if (v <= 500) return 480;
  return 690;
}

function bandLabel(voltClass) {
  return VOLT_BANDS[voltClass] ? VOLT_BANDS[voltClass].label : "Non-standard system voltage";
}

function bandTag(voltClass) {
  return VOLT_BANDS[voltClass] ? VOLT_BANDS[voltClass].tag : "custom";
}

function bandRange(voltClass) {
  const nums = VOLT_BANDS[voltClass].label.match(/\d+/g).map(Number);
  return [nums[0], nums[1]];
}

/** 不在标称带内（如 525 V）时给一句提示，不静默套用。 */
function voltageBandNotice(voltage, voltClass) {
  const v = Number(voltage);
  if (!Number.isFinite(v) || v < 100) return "";
  if (!voltClass) {
    return `${Math.round(v)} V is outside the 200~800 V range of the standard CHITEK low-voltage range. A custom or medium-voltage solution has to be quoted individually.`;
  }
  const range = bandRange(voltClass);
  if (v >= range[0] && v <= range[1]) return "";
  return `${Math.round(v)} V falls outside the standard ${VOLT_BANDS[voltClass].label} band of the ${VOLT_BANDS[voltClass].tag} class. Confirm the actual winding voltage with CHITEK before ordering.`;
}

function ahfPartNo(seriesCode, cap, voltClass) {
  return "AHF-" + seriesCode + "-" + String(cap).padStart(3, "0") + "A-" + voltClass;
}

function ahfSeriesOrder(installPref) {
  if (installPref === "Rack modules") return ["C", "D", "U", "A", "L"];
  if (installPref === "Cabinet solution") return ["A", "C", "L", "D", "U"];
  return ["C", "A", "L", "D", "U"];
}

function svgSeriesOrder(installPref) {
  if (installPref === "Rack modules") return ["C", "D", "U", "A", "H"];
  return ["A", "C", "H", "D", "U"];
}

/**
 * 先找单机能覆盖的档位，找不到才并联——绝不再"越界后静默取最大一档"。
 * 并联上限取官方参数表的 "Number of Parallel Connections ≤ 16 units"。
 */
function resolveModules(catalog, order, target, voltClass) {
  const candidates = order
    .map((code) => catalog.find((series) => series.code === code))
    .filter((series) => series && (series.caps[voltClass] || []).length);

  if (!candidates.length) return { available: false, voltClass };

  const safeTarget = Math.max(Number(target) || 0, 1);

  for (const series of candidates) {
    const caps = series.caps[voltClass];
    const cap = caps.find((value) => value >= safeTarget);
    if (cap !== undefined) {
      return { available: true, series, cap, modules: 1, voltClass, total: cap, capped: false };
    }
  }

  // 并联：模块数与余量综合最优，且每档都参与比较（不只看最大档）
  let bestPlan = null;
  candidates.forEach((series, index) => {
    series.caps[voltClass].forEach((unit) => {
      const needed = Math.ceil(safeTarget / unit);
      const modules = Math.min(needed, PARALLEL_LIMIT);
      const total = unit * modules;
      const overshoot = total / safeTarget;
      const score = modules + overshoot + index * 0.01;
      if (!bestPlan || score < bestPlan.score) {
        bestPlan = { series, unit, modules, total, overshoot, score, needed };
      }
    });
  });

  return {
    available: true,
    series: bestPlan.series,
    cap: bestPlan.unit,
    modules: bestPlan.modules,
    voltClass,
    total: bestPlan.total,
    capped: bestPlan.needed > PARALLEL_LIMIT
  };
}

function buildAlternatives(series, voltClass, cap, unit, target, formatModel) {
  const caps = (series.caps[voltClass] || []).slice().sort((a, b) => a - b);
  const index = caps.indexOf(cap);
  const alternatives = [];

  if (index > 0) {
    const lower = caps[index - 1];
    alternatives.push({
      label: "Smaller module, same series",
      model: formatModel(lower),
      value:
        lower >= target
          ? `${lower} ${unit} still covers the target alone`
          : `${lower} ${unit} would need more parallel units`
    });
  }

  if (index >= 0 && index < caps.length - 1) {
    const higher = caps[index + 1];
    alternatives.push({
      label: "Larger module, same series",
      model: formatModel(higher),
      value: `${higher} ${unit} — fewer parallel units, more headroom`
    });
  }

  if (!alternatives.length) {
    alternatives.push({
      label: "Only one capacity in this series",
      model: "Custom engineering review",
      value: "Confirm frame size with CHITEK sales engineering"
    });
  }

  return alternatives;
}

function svgLineCurrent(totalKvar, voltage) {  const v = Number(voltage) > 100 ? Number(voltage) : 400;
  return Math.round((totalKvar * 1000) / (Math.sqrt(3) * v));
}

function buildAhfProduct(selection, target, voltage) {
  if (!selection.available) {
    return {
      category: "AHF",
      heading: "No standard AHF at this voltage class",
      model: "Custom engineering review",
      description: `CHITEK does not list a standard AHF module in the ${bandLabel(selection.voltClass)} class. A medium-voltage or custom cabinet solution has to be engineered.`,
      capacityLabel: `${Math.round(target)} A target — not standard`,
      voltageLabel: bandLabel(selection.voltClass),
      orderCode: "Custom",
      matchLabel: "Outside the standard range",
      facts: [
        { label: "Requested target", value: `${Math.round(target)} A` },
        { label: "Voltage class", value: `${bandLabel(selection.voltClass)} · ${bandTag(selection.voltClass)}` },
        { label: "Standard range", value: "No standard module" }
      ],
      alternatives: [
        {
          label: "Next step",
          model: "Custom MV / HV engineering study",
          value: "Send the single-line diagram for a tailored design"
        }
      ],
      datasheetName: datasheetLibrary.ahf.name,
      datasheetFile: datasheetLibrary.ahf.file,
      datasheetPreview: datasheetLibrary.ahf.preview,
      previewClass: "preview-focus-ahf"
    };
  }

  const band = bandLabel(selection.voltClass);
  const tag = bandTag(selection.voltClass);
  const partNo = ahfPartNo(selection.series.code, selection.cap, selection.voltClass);
  const parallel = selection.modules > 1;
  const dims = selection.series.dims[selection.cap] || UNKNOWN_DIM;
  const weight = selection.series.weight[selection.cap] || UNKNOWN_DIM;

  return {
    category: "AHF",
    heading: parallel ? "Matched AHF module bank" : "Matched AHF model",
    model: parallel ? `${selection.modules} × ${partNo}` : partNo,
    description: `Selected from the CHITEK AHF selection matrix: ${selection.series.name} series, ${selection.cap} A module${parallel ? `, ${selection.modules} units in parallel` : ""}. ${selection.series.desc}`,
    capacityLabel: parallel
      ? `${selection.total} A installed (${selection.modules} × ${selection.cap} A)`
      : `${selection.cap} A rated current`,
    voltageLabel: `${band} · ${tag} class`,
    orderCode: partNo,
    matchLabel: `Target ${Math.round(target)} A → ${selection.total} A selected`,
    facts: [
      { label: "Installed capacity", value: parallel ? `${selection.total} A (${selection.modules} × ${selection.cap} A)` : `${selection.cap} A` },
      { label: "Rated voltage", value: `${band} · ${tag}` },
      { label: "Order code", value: partNo },
      { label: "Module frame / weight", value: `${dims} / ${weight}` }
    ],
    alternatives: buildAlternatives(
      selection.series,
      selection.voltClass,
      selection.cap,
      "A",
      target,
      (cap) => ahfPartNo(selection.series.code, cap, selection.voltClass)
    ),
    datasheetName: datasheetLibrary.ahf.name,
    datasheetFile: datasheetLibrary.ahf.file,
    datasheetPreview: datasheetLibrary.ahf.preview,
    previewClass: "preview-focus-ahf"
  };
}

function buildSvgProduct(selection, target, voltage) {
  if (!selection.available) {
    return {
      category: "SVG",
      heading: "No standard SVG at this voltage class",
      model: "Custom engineering review",
      description: `CHITEK does not list a standard SVG module in the ${bandLabel(selection.voltClass)} class. A medium-voltage or custom cabinet solution has to be engineered.`,
      capacityLabel: `${Math.round(target)} kvar target — not standard`,
      voltageLabel: bandLabel(selection.voltClass),
      orderCode: "Custom",
      matchLabel: "Outside the standard range",
      facts: [
        { label: "Requested target", value: `${Math.round(target)} kvar` },
        { label: "Voltage class", value: `${bandLabel(selection.voltClass)} · ${bandTag(selection.voltClass)}` },
        { label: "Standard range", value: "No standard module" }
      ],
      alternatives: [
        {
          label: "Next step",
          model: "Custom MV / HV engineering study",
          value: "Send the single-line diagram for a tailored design"
        }
      ],
      datasheetName: datasheetLibrary.svg.name,
      datasheetFile: datasheetLibrary.svg.file,
      datasheetPreview: datasheetLibrary.svg.preview,
      previewClass: "preview-focus-svg"
    };
  }

  const band = bandLabel(selection.voltClass);
  const tag = bandTag(selection.voltClass);
  const parallel = selection.modules > 1;
  const lineCurrent = svgLineCurrent(selection.total, voltage);

  return {
    category: "SVG",
    heading: parallel ? "Matched SVG module bank" : "Matched SVG model",
    model: parallel
      ? `${selection.modules} × SVG-${selection.series.code}-${selection.cap}K`
      : `SVG-${selection.series.code}-${selection.cap}K`,
    description: `Selected from the CHITEK SVG range: ${selection.series.name} series, ${selection.cap} kvar module${parallel ? `, ${selection.modules} units in parallel` : ""}. ${selection.series.desc}`,
    capacityLabel: parallel
      ? `${selection.total} kvar installed (${selection.modules} × ${selection.cap} kvar)`
      : `${selection.cap} kvar per module`,
    voltageLabel: `${band} · ${tag} class`,
    orderCode: `${selection.series.code}-${selection.cap}K`,
    matchLabel: `Target ${Math.round(target)} kvar → ${selection.total} kvar selected`,
    facts: [
      { label: "Installed capacity", value: parallel ? `${selection.total} kvar (${selection.modules} × ${selection.cap})` : `${selection.cap} kvar` },
      { label: "Rated voltage", value: `${band} · ${tag}` },
      { label: "Configuration", value: `${selection.series.name} series, ${selection.cap} kvar module` },
      { label: "Line current", value: `≈ ${lineCurrent.toLocaleString("en-US")} A at ${Math.round(voltage)} V` }
    ],
    alternatives: buildAlternatives(
      selection.series,
      selection.voltClass,
      selection.cap,
      "kvar",
      target,
      (kvar) => `${selection.series.name} SVG ${kvar} kvar`
    ),
    datasheetName: datasheetLibrary.svg.name,
    datasheetFile: datasheetLibrary.svg.file,
    datasheetPreview: datasheetLibrary.svg.preview,
    previewClass: "preview-focus-svg"
  };
}

function buildMatchedProducts(solutionType, ahfTarget, svgTarget, voltage, installPref) {
  const voltClass = voltageClass(voltage);
  const matches = [];

  if (solutionType === "AHF" || solutionType === "Hybrid") {
    const ahfSelection = resolveModules(AHF_SERIES, ahfSeriesOrder(installPref), ahfTarget, voltClass);
    const product = buildAhfProduct(ahfSelection, ahfTarget, voltage);
    product.selection = ahfSelection;
    matches.push(product);
  }

  if (solutionType === "SVG" || solutionType === "Hybrid") {
    const svgSelection = resolveModules(SVG_SERIES, svgSeriesOrder(installPref), svgTarget, voltClass);
    const product = buildSvgProduct(svgSelection, svgTarget, voltage);
    product.selection = svgSelection;
    matches.push(product);
  }

  return matches;
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <p class="eyebrow">${product.category}</p>
      <h3>${product.heading}</h3>
      <h4>${product.model}</h4>
      <span class="product-badge">${product.matchLabel}</span>
      <p class="product-copy">${product.description}</p>
      <div class="product-facts">
        ${product.facts
          .map(
            (fact) => `
        <div>
          <p>${fact.label}</p>
          <strong>${fact.value}</strong>
        </div>`
          )
          .join("")}
      </div>
      <div class="alternative-block">
        <p>Alternative model options</p>
        <div class="alternative-list">
          ${product.alternatives
            .map(
              (alternative) => `
                <div class="alternative-item">
                  <div>
                    <strong>${alternative.label}</strong>
                    <span>${alternative.model}</span>
                  </div>
                  <span>${alternative.value}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
      <a class="product-preview" href="${product.datasheetPreview}" target="_blank" rel="noopener noreferrer">
        <img class="${product.previewClass}" src="${product.datasheetPreview}" alt="${product.datasheetName} preview" />
      </a>
      <div class="product-actions">
        <a class="inline-link-btn secondary" href="${product.datasheetPreview}" target="_blank" rel="noopener noreferrer">Open Preview</a>
        <a class="inline-link-btn primary" href="${product.datasheetFile}" target="_blank" rel="noopener noreferrer">Open Datasheet</a>
        <a class="inline-link-btn secondary" href="${product.datasheetFile}" download>Download PDF</a>
      </div>
    </article>
  `;
}

function getLeadData() {
  return {
    name: document.getElementById("lead-name").value.trim(),
    company: document.getElementById("lead-company").value.trim(),
    email: document.getElementById("lead-email").value.trim(),
    whatsapp: document.getElementById("lead-whatsapp").value.trim()
  };
}

function buildRfQSummary(form, result, leadData) {
  const breakerOrTransformer = form.breakerCurrent
    ? `${form.breakerCurrent} A main breaker`
    : `${form.transformerCapacity || "N/A"} kVA transformer`;

  const products = result.products
    .map((product) => {
      const alternativeText = product.alternatives
        .map((item) => `${item.label}: ${item.model} (${item.value})`)
        .join("; ");

      return `${product.category}: ${product.model} | ${product.capacityLabel} | ${alternativeText}`;
    })
    .join("\n");

  return [
    "CHITEK RFQ SUMMARY",
    "",
    "Customer Information",
    `Name: ${leadData.name || "Not provided"}`,
    `Company: ${leadData.company || "Not provided"}`,
    `Email: ${leadData.email || "Not provided"}`,
    `WhatsApp: ${leadData.whatsapp || "Not provided"}`,
    "",
    "Project Inputs",
    `Main issue: ${form.mainProblem || "Not specified"}`,
    `Voltage: ${form.voltage === "Other" ? `${form.otherVoltage} V` : form.voltage || "Not specified"}`,
    `System basis: ${breakerOrTransformer}`,
    `Load types: ${form.loadTypes.length ? form.loadTypes.join(", ") : "Not specified"}`,
    `Existing power factor: ${form.powerFactor || "Not specified"}`,
    `Harmonic information: ${form.harmonicInfo || "Not specified"}`,
    `Installation preference: ${form.installPreference || "Not specified"}`,
    "",
    "Preliminary Recommendation",
    `Solution: ${result.solutionLabel}`,
    `Suggested capacity: ${result.compensationCapacityLabel}`,
    `Topology: ${result.topology}`,
    `Installation type: ${result.installationType}`,
    `Estimated THDi after: ${result.estimatedThdiAfter}%`,
    `Estimated PF after: ${result.estimatedPfAfter.toFixed(2)}`,
    "",
    "Matched Products",
    products,
    "",
    "Engineering Notes",
    result.engineeringNotes.map((note) => `- ${note}`).join("\n")
  ].join("\n");
}

function buildMailtoLink(summaryText, result, leadData) {
  const subjectParts = ["RFQ Request"];

  if (leadData.company) {
    subjectParts.push(leadData.company);
  } else if (leadData.name) {
    subjectParts.push(leadData.name);
  }

  subjectParts.push(result.solutionLabel);
  const subject = encodeURIComponent(subjectParts.join(" - "));
  const body = encodeURIComponent(summaryText);
  return `mailto:${salesRecipientEmail}?subject=${subject}&body=${body}`;
}

["lead-name", "lead-company", "lead-email", "lead-whatsapp"].forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => {
    if (!state.result) {
      return;
    }

    const leadData = getLeadData();
    const summaryText = buildRfQSummary(state.form, state.result, leadData);
    leadSummary.value = summaryText;
    rfqMailtoBtn.href = buildMailtoLink(summaryText, state.result, leadData);
  });
});

function parseVoltage(data) {
  if (data.voltage === "Other") {
    const parsed = Number.parseFloat(data.otherVoltage);
    return Number.isFinite(parsed) ? parsed : 400;
  }

  const parsed = Number.parseFloat(data.voltage);
  return Number.isFinite(parsed) ? parsed : 400;
}

function inferSystemKva(data, voltage) {
  const transformerKva = Number.parseFloat(data.transformerCapacity);
  if (Number.isFinite(transformerKva) && transformerKva > 0) {
    return transformerKva;
  }

  const breakerCurrent = Number.parseFloat(data.breakerCurrent);
  if (Number.isFinite(breakerCurrent) && breakerCurrent > 0) {
    return (1.732 * voltage * breakerCurrent) / 1000;
  }

  return 250;
}

function inferSizingCurrent(data, voltage) {
  const breakerCurrent = Number.parseFloat(data.breakerCurrent);
  if (Number.isFinite(breakerCurrent) && breakerCurrent > 0) {
    return breakerCurrent;
  }

  const transformerKva = Number.parseFloat(data.transformerCapacity);
  if (Number.isFinite(transformerKva) && transformerKva > 0) {
    return (transformerKva * 1000) / (1.732 * voltage);
  }

  return null;
}

function powerFactorToValue(label) {
  switch (label) {
    case "Below 0.8":
      return 0.76;
    case "0.8–0.9":
      return 0.86;
    case "Above 0.95":
      return 0.97;
    default:
      return 0.88;
  }
}

function inferTargetPowerFactor(data) {
  if (data.powerFactor === "Above 0.95") {
    return 0.99;
  }

  if (data.mainProblem === "Low power factor penalties") {
    return 0.99;
  }

  return 0.98;
}

function computeReactiveCompensation(systemKva, existingPf, targetPf) {
  const realPowerKw = systemKva * existingPf * 0.92;
  const qExisting = realPowerKw * Math.tan(Math.acos(existingPf));
  const qTarget = realPowerKw * Math.tan(Math.acos(targetPf));
  return Math.max(qExisting - qTarget, 30);
}

function inferHarmonicSeverity(data) {
  let score = 0;
  if (data.harmonicInfo === "THDi above 20%") score += 4;
  else if (data.harmonicInfo === "THDi 10–20%") score += 2.5;
  else if (data.harmonicInfo === "THDi below 10%") score += 1;
  else score += 1.5;

  const nonlinearLoads = ["VFDs", "UPS systems", "Solar inverters", "EV chargers", "Welding machines"];
  score += data.loadTypes.filter((load) => nonlinearLoads.includes(load)).length * 0.9;

  if (
    [
      "Harmonic distortion alarms",
      "Transformer overheating",
      "Frequent breaker trips",
      "VFD-related issues",
      "UPS/data center issues"
    ].includes(data.mainProblem)
  ) {
    score += 1.5;
  }

  if (data.mainProblem === "Capacitor bank failures") {
    score += 1;
  }

  return score;
}

function inferReactiveSeverity(data) {
  let score = 0;
  if (data.powerFactor === "Below 0.8") score += 4;
  else if (data.powerFactor === "0.8–0.9") score += 2.5;
  else if (data.powerFactor === "Not sure") score += 1.5;

  if (data.mainProblem === "Low power factor penalties") score += 3;
  if (data.loadTypes.includes("Motors")) score += 1.8;
  if (data.loadTypes.includes("EV chargers") || data.loadTypes.includes("Data center")) score += 0.8;

  return score;
}

function inferSolutionType(data, harmonicScore, reactiveScore) {
  const hasVfd = data.loadTypes.includes("VFDs");
  const hasCapacitorIssue = data.mainProblem === "Capacitor bank failures";

  if (hasCapacitorIssue && hasVfd) return "Hybrid";
  if (harmonicScore >= 5.5 && reactiveScore >= 3.5) return "Hybrid";

  if (
    hasVfd &&
    data.harmonicInfo === "THDi above 20%" &&
    data.mainProblem === "Transformer overheating"
  ) {
    return "AHF";
  }

  if (reactiveScore >= harmonicScore + 1.4) return "SVG";
  if (harmonicScore >= reactiveScore + 1.2) return "AHF";
  return harmonicScore >= reactiveScore ? "Hybrid" : "SVG";
}

function inferAhfSizing(data, solutionType, harmonicScore) {
  const voltage = parseVoltage(data);
  const sizingCurrent = inferSizingCurrent(data, voltage);

  if (!Number.isFinite(sizingCurrent) || sizingCurrent <= 0) {
    if (solutionType === "AHF") return Math.round(120 + harmonicScore * 18);
    if (solutionType === "Hybrid") return Math.round(80 + harmonicScore * 16);
    return 0;
  }

  let ratio = 0.18;
  if (data.harmonicInfo === "THDi above 20%") ratio = 0.35;
  else if (data.harmonicInfo === "THDi 10–20%") ratio = 0.22;
  else if (data.harmonicInfo === "THDi below 10%") ratio = 0.12;

  if (solutionType === "Hybrid") ratio *= 0.75;
  if (solutionType === "SVG") ratio = 0;
  if (data.loadTypes.includes("Welding machines")) ratio += 0.04;
  if (data.loadTypes.includes("UPS systems") || data.loadTypes.includes("Data center")) ratio += 0.03;

  // 不再四舍五入到"虚构标准档"——交给 resolveModules 按真实模块档位对齐
  return ratio > 0 ? Math.round(sizingCurrent * ratio) : 0;
}

function inferSvgSizing(data, solutionType, systemKva, existingPf, targetPf) {
  if (solutionType === "AHF") return 0;

  let kvar = computeReactiveCompensation(systemKva, existingPf, targetPf);
  if (solutionType === "Hybrid") kvar *= 0.7;
  if (data.mainProblem === "Low power factor penalties") kvar *= 1.1;
  return Math.round(kvar);
}

function inferInstallationType(data, ahfCurrent, svgKvar) {
  if (data.installPreference === "Cabinet solution") return "Integrated floor-standing cabinet";
  if (data.installPreference === "Rack modules") return "Modular rack-mounted power quality bay";
  return ahfCurrent + svgKvar > 350
    ? "Integrated floor-standing cabinet"
    : "Modular rack-mounted power quality bay";
}

function inferTopology(solutionType, ahfCurrent, svgKvar) {
  if (solutionType === "AHF") {
    return ahfCurrent >= 200
      ? "Centralized bus-mounted AHF at the main low-voltage switchboard"
      : "Distributed AHF modules close to dominant nonlinear feeders";
  }

  if (solutionType === "SVG") {
    return svgKvar >= 250
      ? "Centralized SVG cabinet with dynamic kvar control at the PCC"
      : "Sectional SVG modules near inductive motor groups";
  }

  return "Hybrid topology with centralized SVG compensation and dedicated AHF harmonic mitigation";
}

function inferEstimatedThdiAfter(data, solutionType) {
  const baseline = baselineHarmonicPercent(data.harmonicInfo);
  if (solutionType === "AHF") return Math.max(5, Math.round(baseline * 0.32));
  if (solutionType === "Hybrid") return Math.max(4, Math.round(baseline * 0.28));
  return Math.max(7, Math.round(baseline * 0.78));
}

function baselineHarmonicPercent(label) {
  if (label === "THDi above 20%") return 24;
  if (label === "THDi 10–20%") return 15;
  if (label === "THDi below 10%") return 8;
  return 18;
}

render();
