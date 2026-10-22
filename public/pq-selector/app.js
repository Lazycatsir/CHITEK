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
    preview: "/assets/images/products-ahf-sic.webp",
    family: "Active Harmonic Filter",
    voltage: "220~480V / 50(60)Hz"
  },
  svg: {
    name: "CHITEK ASVG 400V Datasheet",
    file: "/assets/pdf/distributed-svg-user-manual-en.pdf",
    preview: "/assets/images/products-asvg-cabinet.webp",
    family: "Advanced Static Var Generator",
    voltage: "400V / 50(60)Hz"
  }
};

const ahfCatalog = [
  { current: 15, model: "CHITEK AHF-15", orderCode: "CHITEK-AHF-15-4-4L", ratedVoltage: "220/400/440 VAC", size: "320×400×125 mm", weight: "11 kg" },
  { current: 25, model: "CHITEK AHF-25", orderCode: "CHITEK-AHF-25-4-4L", ratedVoltage: "220/400/440 VAC", size: "320×400×160 mm", weight: "15 kg" },
  { current: 50, model: "CHITEK AHF-50", orderCode: "CHITEK-AHF-50-4-4L", ratedVoltage: "220/400/440/480 VAC", size: "505×600×220 mm", weight: "33 kg" },
  { current: 75, model: "CHITEK AHF-75", orderCode: "CHITEK-AHF-75-4-4L", ratedVoltage: "220/400/440/480 VAC", size: "505×600×220 mm", weight: "35 kg" },
  { current: 100, model: "CHITEK AHF-100", orderCode: "CHITEK-AHF-100-4-4L", ratedVoltage: "220/400/440/480 VAC", size: "505×600×220 mm", weight: "43 kg" },
  { current: 150, model: "CHITEK AHF-150", orderCode: "CHITEK-AHF-150-4-4L", ratedVoltage: "220/400/440/480 VAC", size: "505×600×220 mm", weight: "45 kg" },
  { current: 200, model: "CHITEK AHF-200", orderCode: "CHITEK-AHF-200-4-4L", ratedVoltage: "220/400/440/480 VAC", size: "525×710×250 mm", weight: "70 kg" }
];

const svgCatalog = [
  { kvar: 10, current: 15, model: "CHITEK ASVG-10", ratedVoltage: "400 VAC", size: "320×400×160 mm", weight: "11 kg" },
  { kvar: 15, current: 25, model: "CHITEK ASVG-15", ratedVoltage: "400 VAC", size: "320×400×160 mm", weight: "15 kg" },
  { kvar: 30, current: 50, model: "CHITEK ASVG-30", ratedVoltage: "400 VAC", size: "505×600×220 mm", weight: "33 kg" },
  { kvar: 50, current: 75, model: "CHITEK ASVG-50", ratedVoltage: "400 VAC", size: "450×514×180 mm", weight: "35 kg" },
  { kvar: 75, current: 100, model: "CHITEK ASVG-75", ratedVoltage: "400 VAC", size: "505×600×220 mm", weight: "43 kg" },
  { kvar: 100, current: 150, model: "CHITEK ASVG-100", ratedVoltage: "400 VAC", size: "505×600×220 mm", weight: "45 kg" },
  { kvar: 135, current: 200, model: "CHITEK ASVG-135", ratedVoltage: "400 VAC", size: "575×710×250 mm", weight: "70 kg" }
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
  localStorage.setItem("ytSelectorLead", JSON.stringify(lead));
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
              ${["400V", "480V", "525V", "690V", "Other"]
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
      label: "AHF current rating",
      value: state.result.ahfCurrentRating ? `${state.result.ahfCurrentRating} A` : "Not primary"
    },
    {
      label: "SVG kvar rating",
      value: state.result.svgKvarRating ? `${state.result.svgKvarRating} kvar` : "Not primary"
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

  const products = buildMatchedProducts(solutionType, ahfCurrentRating, svgKvarRating);

  return {
    solutionType,
    solutionLabel,
    ahfCurrentRating,
    svgKvarRating,
    topology,
    installationType,
    estimatedPfAfter,
    estimatedThdiAfter,
    estimatedThdiReduction,
    whySelected,
    compensationCapacityLabel,
    inferredSystemKva,
    confidenceLabel:
      data.harmonicInfo === "Not measured" || data.powerFactor === "Not sure"
        ? "Preliminary confidence: medium"
        : "Preliminary confidence: high",
    reasonSummary,
    engineeringNotes: [
      "Final sizing should be confirmed against a single-line diagram, transformer impedance, and feeder diversity.",
      "Harmonic current spectrum and kvar demand should be validated with a site measurement or power quality analyzer.",
      solutionType === "Hybrid"
        ? "Hybrid systems are especially useful where capacitor banks have already shown instability near variable-speed loads."
        : "Centralized vs distributed placement should be finalized after reviewing load distribution and switchboard space."
    ],
    products
  };
}

function buildMatchedProducts(solutionType, ahfCurrentRating, svgKvarRating) {
  const matches = [];

  if (solutionType === "AHF" || solutionType === "Hybrid") {
    const ahfMatch = findCatalogOptions(ahfCatalog, ahfCurrentRating, "current");
    const ahf = ahfMatch.primary;
    matches.push({
      category: "AHF",
      heading: "Matched AHF model",
      model: ahf.model,
      description: `Matched from the official CHITEK SiC Ultra AHF datasheet for a target of ${ahfCurrentRating} A harmonic compensation.`,
      capacityLabel: `${ahf.current} A rated current`,
      voltageLabel: ahf.ratedVoltage,
      sizeLabel: ahf.size,
      weightLabel: ahf.weight,
      orderCode: ahf.orderCode,
      matchLabel: `Primary recommendation for ${ahfCurrentRating} A target`,
      alternatives: buildAlternativeEntries(ahfMatch, "current", "A"),
      datasheetName: datasheetLibrary.ahf.name,
      datasheetFile: datasheetLibrary.ahf.file,
      datasheetPreview: datasheetLibrary.ahf.preview,
      previewClass: "preview-focus-ahf"
    });
  }

  if (solutionType === "SVG" || solutionType === "Hybrid") {
    const svgMatch = findCatalogOptions(svgCatalog, svgKvarRating, "kvar");
    const svg = svgMatch.primary;
    matches.push({
      category: "SVG",
      heading: "Matched SVG model",
      model: svg.model,
      description: `Matched from the official CHITEK ASVG datasheet for a target of ${svgKvarRating} kvar dynamic correction.`,
      capacityLabel: `${svg.kvar} kvar (${svg.current} A)`,
      voltageLabel: svg.ratedVoltage,
      sizeLabel: svg.size,
      weightLabel: svg.weight,
      orderCode: svg.model,
      matchLabel: `Primary recommendation for ${svgKvarRating} kvar target`,
      alternatives: buildAlternativeEntries(svgMatch, "kvar", "kvar"),
      datasheetName: datasheetLibrary.svg.name,
      datasheetFile: datasheetLibrary.svg.file,
      datasheetPreview: datasheetLibrary.svg.preview,
      previewClass: "preview-focus-svg"
    });
  }

  return matches;
}

function findCatalogOptions(catalog, targetValue, key) {
  const minimum = catalog[0][key];
  const safeTarget = Math.max(targetValue, minimum);
  let primaryIndex = catalog.findIndex((item) => item[key] >= safeTarget);

  if (primaryIndex === -1) {
    primaryIndex = catalog.length - 1;
  }

  return {
    primary: catalog[primaryIndex],
    lower: primaryIndex > 0 ? catalog[primaryIndex - 1] : null,
    higher: primaryIndex < catalog.length - 1 ? catalog[primaryIndex + 1] : null
  };
}

function buildAlternativeEntries(match, key, unit) {
  const alternatives = [];

  if (match.lower) {
    alternatives.push({
      label: "Alternative smaller option",
      model: match.lower.model || match.lower.orderCode,
      value: `${match.lower[key]} ${unit}`
    });
  }

  if (match.higher) {
    alternatives.push({
      label: "Alternative larger option",
      model: match.higher.model || match.higher.orderCode,
      value: `${match.higher[key]} ${unit}`
    });
  }

  if (!alternatives.length) {
    alternatives.push({
      label: "Alternative sizing note",
      model: "Custom engineering review",
      value: "Nearest standard catalog point already selected"
    });
  }

  return alternatives;
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
        <div>
          <p>Matched capacity</p>
          <strong>${product.capacityLabel}</strong>
        </div>
        <div>
          <p>Rated voltage</p>
          <strong>${product.voltageLabel}</strong>
        </div>
        <div>
          <p>Order code</p>
          <strong>${product.orderCode}</strong>
        </div>
        <div>
          <p>Package size</p>
          <strong>${product.sizeLabel} / ${product.weightLabel}</strong>
        </div>
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
  const standards = [30, 50, 60, 75, 100, 120, 150, 200, 250, 300, 400, 500, 600];
  const voltage = parseVoltage(data);
  const sizingCurrent = inferSizingCurrent(data, voltage);

  if (!Number.isFinite(sizingCurrent) || sizingCurrent <= 0) {
    if (solutionType === "AHF") return roundToStandard(120 + harmonicScore * 18, standards);
    if (solutionType === "Hybrid") return roundToStandard(80 + harmonicScore * 16, standards);
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

  return ratio > 0 ? roundToStandard(sizingCurrent * ratio, standards) : 0;
}

function inferSvgSizing(data, solutionType, systemKva, existingPf, targetPf) {
  const standards = [30, 50, 75, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800];
  if (solutionType === "AHF") return 0;

  let kvar = computeReactiveCompensation(systemKva, existingPf, targetPf);
  if (solutionType === "Hybrid") kvar *= 0.7;
  if (data.mainProblem === "Low power factor penalties") kvar *= 1.1;
  return roundToStandard(kvar, standards);
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

function roundToStandard(value, standards) {
  const positive = Math.max(value, standards[0]);
  return standards.find((item) => item >= positive) || standards[standards.length - 1];
}

render();
