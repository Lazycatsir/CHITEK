// 从 enSolutionRouting.js 翻译而来（中文唯一信息源）。device 取值：'ahf' | 'svg' | 'both'。

export const ROUTE_DEVICE_LABEL = {
  ahf: 'AHF',
  svg: 'SVG',
  both: 'AHF + SVG',
};

export const SYMPTOM_ROUTES = [
  {
    id: 'neutral-overheat',
    symptom: '中性线导体发热，或其电流接近相电流',
    measure: '中性线电流与相电流对比，以及中性线上的 3 次 / 9 次谐波含量',
    device: 'ahf',
    why: '单相电子负荷产生的三次谐波在中性线上叠加而非抵消。AHF 是两者中唯一能消除它们的装置。',
    note: '先检查三相平衡——仅不平衡本身就能在不含任何谐波的情况下加重中性线负担。',
  },
  {
    id: 'capacitor-resonance',
    symptom: '功率因数校正电容器故障，或开关柜在无明确故障下跳闸',
    measure: '电容器组与变压器电感是否在现场存在的某次谐波附近形成并联谐振',
    device: 'ahf',
    why: '电容器组在放大谐波而非滤波。选择性滤波次数配合抗谐振控制，可让电容器组保持运行。',
    note: '滤波器 CT 的采样位置决定能否激发 LC 谐振。采样在负荷侧是兜底方案。',
  },
  {
    id: 'pf-penalty',
    symptom: '电力公司功率因数罚款，或账单上出现无功电费',
    measure: '整个负载周期内的功率因数与无功需求，包括待机与夜间',
    device: 'svg',
    why: 'SVG 持续保持目标功率因数，即使在有功负载接近零时——而电容器组在此处会失去控制。',
    note: '若站点有分级投切的电容器组，SVG 还能消除轻载时出现的过补偿。',
  },
  {
    id: 'leading-pf',
    symptom: '夜间或周末测得的功率因数为超前',
    measure: '最小负载时的功率因数，以及任何长地下电缆段的电容',
    device: 'svg',
    why: '电缆电容在轻载时产生无功。SVG 吸收多余无功，而非继续叠加。',
    note: '传统电容器组只能增加无功，因此无法校正此问题。',
  },
  {
    id: 'voltage-sag',
    symptom: '设备在短时电压跌落时跳闸或重启',
    measure: '事件期间在设备端子记录的暂降深度与持续时间',
    device: 'svg',
    why: 'SVG 在一个周期内响应，保持母线电压。它减小暂降的深度与持续时间；但不能替代 UPS 应对持续断电。',
    note: '当暂降由同一母线上的大型电机启动引起时，母线处的无功支撑通常比更大容量的源变压器更有效。',
  },
  {
    id: 'voltage-flicker',
    symptom: '电炉、焊机或大型传动循环时灯光明显闪烁',
    measure: '公共连接点的短时闪变严重度 Pst / Plt',
    device: 'svg',
    why: '闪变来自快速摆动的无功需求。SVG 跟踪摆动并抵消它；AHF 不处理无功摆动。',
    note: '由单个间歇性电弧负荷引起的闪变，可能在确定无功补偿容量前需要先审视该负荷本身。',
  },
  {
    id: 'thd-high',
    symptom: '进线电源谐波畸变率高于约定或法定限值',
    measure: '电流与电压谐波频谱，以及哪些次数承载最多电流',
    device: 'ahf',
    why: 'AHF 逐次注入抵消电流，按实测频谱而非负载额定选型。',
    note: '仅按变压器 kVA 定容量，是装置最终偏小的最常见原因。先测量。',
  },
  {
    id: 'transformer-overheat',
    symptom: '变压器运行温度高于其负载所暗示的水平，或被降额',
    measure: '谐波损耗贡献，以及该负荷组合的 K 系数或降额要求',
    device: 'ahf',
    why: '谐波电流造成额外的涡流与杂散损耗，标准 kVA 额定未计入。消除谐波电流即消除该损耗。',
    note: '降额是症状，而非问题本身。在认定变压器偏小前，先确认谐波贡献。',
  },
  {
    id: 'vfd-bank',
    symptom: '变频器改造或新增传动线后出现谐波畸变',
    measure: '在驱动运行工况点，供给驱动器的馈线上的谐波频谱',
    device: 'ahf',
    why: '驱动器中的六脉波整流器是特征谐波源。畸变随驱动负载缩放，因此 AHF 输出随负载自然下降。',
    note: '同一母线上的多台驱动器交错其谐波；合并排放并非各额定之和。',
  },
  {
    id: 'inverter-resonance',
    symptom: '光伏、风电或储能站点上的逆变器或 PCS 同时跳闸',
    measure: '宽频振荡，以及由逆变器滤波器与集电或电网阻抗形成的谐振点',
    device: 'both',
    why: '多逆变器站点同时产生交错开关谐波与随输出变化的无功摆动。两者分别定容量。',
    note: '谐振扫描属于系统研究，而非设备选型。容量由研究得出。',
  },
  {
    id: 'load-step',
    symptom: '大型负荷或一组充电器同时启动时电压每次都跌落',
    measure: '阶跃大小与重复率，对照站点适用的闪变与电压变化限值',
    device: 'both',
    why: '阶跃本身基本是无功事件，因此 SVG 承担大部分。当充电器或整流器也增加谐波时，在同一母线上加 AHF。',
    note: '同一负荷阶跃产生的需量电费暴露是电价问题，与电能质量治理无关。',
  },
  {
    id: 'phase-imbalance',
    symptom: '某一相电流明显大于其他相，或电机发热',
    measure: '负序与零序电流，以及单相负荷在相间如何分布',
    device: 'both',
    why: '分布问题须先解决。AHF 消除叠加其上的谐波分量；SVG 在不平衡产生持续不平衡处支撑电压。',
    note: '在购置设备前，应始终考虑重新平衡单相负荷。',
  },
];

export const DECISION_TREE = {
  start: {
    question: '测量首先显示什么？',
    options: [
      { label: '电流畸变率超过限值', next: 'has-capacitor' },
      { label: '功率因数低，或被收取无功电费', next: 'light-load' },
      { label: '负荷阶跃下电压跌落或闪烁', next: 'sag-source' },
      { label: '中性线电流高，或电容器反复故障', next: 'done-ahf' },
    ],
  },
  'has-capacitor': {
    question: '同一母线上是否已有电容器组？',
    options: [
      { label: '有，且保持运行', next: 'done-ahf-resonance' },
      { label: '有，但可更换或移除', next: 'done-ahf' },
      { label: '现场无电容器组', next: 'done-ahf' },
    ],
  },
  'light-load': {
    question: '最小负载、夜间或周末时的功率因数是多少？',
    options: [
      { label: '仍偏低或滞后', next: 'done-svg' },
      { label: '摆动，或测得超前', next: 'done-svg' },
      { label: '轻载时良好，仅峰值偏低', next: 'done-svg' },
    ],
  },
  'sag-source': {
    question: '暂降与哪些工况相关？',
    options: [
      { label: '同一母线上的大型电机或传动启动', next: 'done-svg' },
      { label: '多台充电器或整流器同时启动', next: 'done-both' },
      { label: '外部供电事件，而非站点负荷', next: 'done-svg-external' },
    ],
  },
  // ---- 结果 ----
  'done-ahf': {
    device: 'ahf',
    heading: '从有源谐波滤波器（AHF）入手',
    body: '按公共连接点实测谐波频谱确定滤波器容量，而非按变压器额定。输出跟随负载，因此滤波器无需按永不发生的重合度选型。',
    nextSteps: [
      '在一个完整工作周期内记录进线电源的谐波频谱',
      '记录最严重的次数及其承载电流',
      '按实测谐波电流选取机架额定，并预留增长裕量',
    ],
  },
  'done-ahf-resonance': {
    device: 'ahf',
    heading: '从带抗谐振控制的 AHF 入手',
    body: '电容器组是难点。电容器组与变压器电感之间的并联谐振会放大谐波而非消除，因此滤波器须在电容器组保持运行的情况下，以选择性滤波次数与抗谐振控制运行。',
    nextSteps: [
      '确认滤波器 CT 在电网侧还是负荷侧采样',
      '若连接点位于纯电容器组下游，计划将 CT 采样移走，或接受抗谐振控制',
      '对照实际存在的谐波次数确认谐振点',
    ],
  },
  'done-svg': {
    device: 'svg',
    heading: '从静止无功发生器（SVG）入手',
    body: 'SVG 持续保持目标功率因数，并能发出与吸收无功。这正是它在轻载时能工作的原因——而电容器组要么过补偿，要么必须退出。',
    nextSteps: [
      '测量整个负载周期的无功剖面，而非仅在峰值',
      '检查最小负载时的功率因数，排查超前情况',
      '按无功摆动选型，并事先明确目标功率因数',
    ],
  },
  'done-svg-external': {
    device: 'svg',
    heading: '无功支撑有帮助，但仅作为整体方案的一部分',
    body: 'SVG 能在事件期间保持母线电压，但源自上游的暂降无法在低压母线消除。母线处的无功支撑减小深度与持续时间；超过几个周期的任何暂降须由 UPS 或供电侧方案覆盖。',
    nextSteps: [
      '区分源自站点的暂降与来自供电侧的事件',
      '在跳闸设备的端子记录暂降深度与持续时间',
      '将该设备的耐受曲线与记录结果对比',
    ],
  },
  'done-both': {
    device: 'both',
    heading: '规划 AHF 与 SVG 同时使用',
    body: '既是负荷阶跃又是谐波源的负载需要两者。SVG 承担无功阶跃；AHF 消除同一母线上整流器增加的谐波。二者分别测量、分别定容量。',
    nextSteps: [
      '在公共连接点测量阶跃大小与重复率',
      '同时在同一母线上测量谐波频谱',
      '据这两次测量在两种装置间分配容量',
    ],
  },
};
