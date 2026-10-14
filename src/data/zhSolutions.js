// 从 enSolutions.js 翻译而来（中文唯一信息源）。结构/字段顺序与英文完全一致，仅字符串中文化。
// 编号、产品型号（AHF-200A 等）、标准（GB/T 14549、IEEE 519）、地名（广州、东莞、安徽）保持原样。

export const industries = [
  { id: 'industry', label: '工业制造', icon: 'factory' },
  { id: 'commercial', label: '商业与医疗', icon: 'building-2' },
  { id: 'datacenter', label: '数据中心', icon: 'server' },
  { id: 'renewable', label: '新能源', icon: 'zap' },
  { id: 'rail', label: '轨道交通', icon: 'train-front' },
  { id: 'grid', label: '电网', icon: 'globe' },
];

let activeIndustry = 'commercial';

export const painPointScenes = [
  {
    id: 'medical', label: '医疗', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: '医疗场景', sceneSubtitle: '医院 / 诊所 / 康复中心',
    cards: [
      { icon: 'activity', title: 'CT / MRI', desc: '影像设备', metric: '15%', metricLabel: 'THD', consequences: [{ title: '图像伪影', sub: '误诊风险，需重复扫描，患者等待时间翻倍' }, { title: '设备过热', sub: '变压器降额运行，元器件寿命缩短，非计划维护' }] },
      { icon: 'heart-pulse', title: '手术室', desc: '手术设备', metric: '毫秒级', metricLabel: '电压暂降', consequences: [{ title: '手术中断', sub: '瞬时断电，设备重启周期，手术延误' }, { title: '生命安全风险', sub: '关键支撑设备故障，备用电源切换延迟' }] },
      { icon: 'flask-conical', title: '实验室', desc: '精密分析仪', metric: '高', metricLabel: '零序电流', consequences: [{ title: '三相不平衡', sub: '精密仪器漂移，校准失效，试剂浪费' }, { title: '中性线过载', sub: '导体过热，火灾风险，N线烧毁隐患' }] },
    ],
  },
  {
    id: 'office', label: '商业办公', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: '商业办公场景', sceneSubtitle: '写字楼 / 商场 / 酒店',
    cards: [
      { icon: 'lightbulb', title: '照明', desc: 'LED 驱动谐波', metric: '23%', metricLabel: 'THD', consequences: [{ title: '严重闪烁', sub: '视觉疲劳，生产力下降，租户投诉不适' }, { title: '中性线过热', sub: '三次谐波累积，N线烧毁，火灾隐患' }] },
      { icon: 'arrow-up-down', title: '电梯', desc: '变频器启动浪涌', metric: '7x', metricLabel: '冲击电流', consequences: [{ title: '电压跌落', sub: '设备跳闸，控制系统复位，乘客被困风险' }, { title: '机械磨损', sub: '维护频繁，制动片更换，钢丝绳疲劳' }] },
      { icon: 'thermometer-snowflake', title: '暖通空调', desc: '压缩机无功', metric: '0.65', metricLabel: '功率因数', consequences: [{ title: '罚款', sub: '电力公司功率因数加收，月度账单增加 30%+', }, { title: '变压器过载', sub: '无功电流过大，过热，使用寿命缩短' }] },
    ],
  },
  {
    id: 'lab', label: '实验室/洁净室', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: '实验室与洁净室', sceneSubtitle: '半导体 / 生物科技 / 精密制造',
    cards: [
      { icon: 'wind', title: '洁净室', desc: 'FFU 风机变频', metric: '> 1.0', metricLabel: 'Pst 闪变', consequences: [{ title: '良率损失', sub: '晶圆缺陷密度增加，批次报废，营收影响' }, { title: '光线波动', sub: '光刻对位偏差，检测误判' }] },
      { icon: 'cpu', title: '实验室设备', desc: '精密仪器', metric: '30%', metricLabel: '电压暂降', consequences: [{ title: '数据丢失', sub: '未保存的测量数据，实验中断，试剂浪费' }, { title: '校准漂移', sub: '暂降后需重新校准，仪器停机 4-8 小时' }] },
      { icon: 'toy-brick', title: '冷却水泵', desc: '电机启动', metric: '5~8x', metricLabel: '冲击电流', consequences: [{ title: '母线电压骤降', sub: '级联跳闸风险，相邻设备欠压，批次停产' }, { title: '断路器跳闸', sub: '误过流跳闸，非计划停机，重启 SOP' }] },
    ],
  },
];

export const topologyScenes = [
  {
    id: 'medical', sceneName: '医疗拓扑', sceneSubtitle: '医院 / 诊所 / 康复中心',
    deviceLabel: 'AHF-200A', deviceType: '有源谐波滤波器',
    deviceDesc: '并联接入低压母线，为手术室 / 影像 / 实验室配电系统治理谐波',
    branches: [
      { label: '手术室配电', sub: '电压暂降保护' },
      { label: '影像供电', sub: 'CT / MRI 谐波' },
      { label: '实验室配电', sub: '三相不平衡' },
    ],
  },
  {
    id: 'office', sceneName: '商业办公拓扑', sceneSubtitle: '写字楼 / 商场 / 酒店',
    deviceLabel: 'SVG-300A', deviceType: '静止无功发生器',
    deviceDesc: 'SVG 安装于低压母线，为电梯 / 照明 / 空调回路补偿无功功率',
    branches: [
      { label: '照明供电', sub: '谐波源' },
      { label: '电梯供电', sub: '变频器浪涌' },
      { label: '暖通供电', sub: '无功负荷' },
    ],
  },
  {
    id: 'lab', sceneName: '实验室与洁净室拓扑', sceneSubtitle: '半导体 / 生物科技 / 精密制造',
    deviceLabel: 'AHF-150A', deviceType: '有源谐波滤波器',
    deviceDesc: '串联于 UPS 前端，用于工艺冷却 / 实验室设备谐波抑制',
    branches: [
      { label: 'UPS 前端', sub: '精密供电' },
      { label: '工艺冷却', sub: '水泵冲击' },
      { label: '实验室设备', sub: '敏感负荷' },
    ],
  },
];

export const cases = [
  {
    title: 'LED 照明谐波与中性线过载改造 — 广州某服装批发市场',
    tabLabel: 'LED 与中性线，商场',
    highlight: '电流畸变率 49% → 2.75%；中性线零序电流 365.76 A → 25.19 A',
    image: '/assets/images/solutions-commercial-medical-case-office.webp',
    industry: '商业建筑', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/contact',
    site: '一台 2,500 kVA 变压器，负载率约 90%，带两套共 600 kvar 的补偿柜。主要负荷是单层相 LED 照明与交易大厅的 LED 视频墙。',
    harmonics: [
      '1 层相电流畸变率改造前为 49%',
      '中性线零序谐波电流 365.76 A',
      '中性线视在电流 369 A（含不平衡电流）',
      '母线电压畸变率 4.75%',
    ],
    overview: '2,500 kVA 变压器，负载率 90%，带 600 kvar 电容器组。商场内布满 LED 照明与 LED 视频墙——单相 LED 驱动电源注入大量三次谐波，在中性线上叠加，使电流畸变率达到 49%，中性线过载。',
    limitations: '测量点位于楼层进线馈线，而非供电计量点，因此数据描述的是建筑配电，而非站点 PCC。仅处理了两个楼层。',
    trend: '畸变率 49% → 2.75%  ·  中性线电流 369 A → 36.51 A',
    solution: [{ product: 'AHF-200A', qty: 2, use: '三相四线，各交易楼层主进线开关处' }],
    results: [
      '中性线零序谐波 365.76 A → 25.19 A',
      '中性线视在电流 369 A → 36.51 A（含不平衡电流）',
      '母线电压畸变率 4.75% → 3.75%',
      '按 GB/T 14549 标准验收通过',
    ],
  },
  {
    title: '抗谐振谐波改造 — 东莞某医疗器械制造商',
    tabLabel: '抗谐振，医疗',
    highlight: '电容器组在网运行下，每相谐波电流 108 A → 25 A，无 LC 谐振',
    image: '/assets/images/solutions-commercial-medical-case-hospital.webp',
    industry: '医疗与保健', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/contact',
    site: '医疗器械厂三台变压器，每台带 600 kvar 纯电容器组，负载率 60%–80%。站点曾多次发生电容器与开关柜故障，这正是触发本次测量的原因。',
    harmonics: [
      '总谐波电流，TR1 A/B/C 相：108.16 / 106.64 / 79.22 A',
      'TR1 A 相，3 次谐波：70.87 A',
      'TR1 A 相，5 次谐波：50.78 A',
      'TR1 A 相，7 次谐波：59.10 A',
      '无功需求 168.91 kvar，功率因数 0.967',
    ],
    overview: '三台变压器，每台配 600 kvar 纯电容补偿，负载率 60–80%。站点反复发生电容器与开关柜故障。难点在于：滤波器 CT 在电网侧采样，而连接点又位于纯电容器组下游——常规做法是把 CT 采样移到负荷侧。对 3/5/7 次选择性滤波，配合智能耦合抗谐振控制，在本配置下保持了装置稳定。',
    limitations: '报告未说明所选滤波器机架额定值，故此处仅公布改造前后的实测电流。除非特别说明，结果均对应变压器 TR1。',
    trend: 'TR1 谐波电流（A/B/C）：108.16 / 106.64 / 79.22 A → 25.27 / 26.68 / 22.79 A',
    solution: [{ product: 'AHF', qty: 3, use: '每台变压器（TR1 / TR2 / TR3）一台，选择性 3/5/7 次滤波' }],
    results: [
      '送电后无 LC 谐振，电容器组全程在网运行',
      'A 相：3 次 70.87 A → 1.31 A，5 次 50.78 A → 5.32 A，7 次 59.10 A → 3.28 A',
      '无功需求 168.91 kvar → 133.97 kvar；功率因数 0.967 → 0.978',
      '反复发生的电容器与开关柜故障得以解决',
    ],
  },
  {
    title: '大型养殖场无谐振谐波治理 — 安徽',
    tabLabel: '抗谐振，农业',
    highlight: '畸变率近 50% → 约 5%，功率因数 0.87 → 0.99（此前另一品牌被退货）',
    image: '/assets/images/solutions-commercial-medical-case-lab.webp',
    industry: '农业与食品生产', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/contact',
    site: '一家自动化密集、环境监测完善的养殖企业，位于弱电网末端、离电源点很远，开关室局促，没有空间放置常规柜体。照明、空调与通风均为电力电子负荷。',
    harmonics: [
      '测量时运行电流 706 A',
      '电流畸变率接近 50%，约 342.6 A 谐波电流',
      '改造前功率因数 0.87',
      '开关室无空间容纳常规柜体',
    ],
    overview: '一家快速发展的养殖企业，运行密集的自动化与环境监测。照明、空调与通风风机均为电力电子负荷；站点位于弱电网末端、离电源点很远；开关室十分局促。此前某供应商的有源滤波器送电即发生谐振——变压器嗡鸣、电机运行不稳——已被退货。',
    limitations: '此前某供应商的有源滤波器在本站点发生谐振后被退货；提及这段历史是因为它影响了选型，而非对比具名品牌。本项目未公布改造前后的频谱图。',
    trend: '畸变率 ~50%（342.6 A）→ ~5%  ·  功率因数 0.87 → 0.99',
    solution: [{ product: 'AHF-100A', qty: 4, use: '抗谐振机型，AI 调谐响应周期与输出降额' }],
    results: [
      '谐波与谐振同时清除——"送电瞬间即消除，超出预期"（客户语）',
      '功率因数由约 0.87 提升至 0.99',
      '高功率密度适配现有开关室——单柜可达 900 A',
      '敏感的自动控制与监测设备得到保护',
    ],
  },
];

// ===================== 电网数据 =====================
export const gridPainPoints = [
  {
    id: 'transmission', label: '输配电', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: '输配电', sceneSubtitle: '变电站 / 配电网 / 农网升级',
    cards: [
      { icon: 'network', title: '非线性负荷', desc: '工业与牵引负荷谐波注入', metric: '>10%', metricLabel: 'THD', consequences: [{ title: '变压器过热', sub: '附加谐波损耗，绝缘老化，被迫降额至 30% 容量' }, { title: '保护误动作', sub: '继电器误跳闸，断路器误动作，电网可靠性下降' }] },
      { icon: 'zap', title: '分布式发电', desc: 'DG 并网引发电网扰动', metric: '±10%', metricLabel: '电压波动', consequences: [{ title: '反向潮流', sub: 'DG 倒送功率引起电压升高，分接头频繁调节，保护配合失灵' }, { title: '孤岛风险', sub: '非计划孤岛形成，非同步重合闸，设备损坏' }] },
      { icon: 'git-branch', title: '线路无功', desc: '长距离传输无功损耗', metric: '< 0.9', metricLabel: '末端电压(pu)', consequences: [{ title: '线损激增', sub: 'I²R 损耗指数增长，农网馈线末端电压崩溃，切负荷' }, { title: '电压崩溃风险', sub: '无功缺额级联，大面积停电隐患，N-1 事故失效' }] },
    ],
  },
  {
    id: 'urban', label: '城市配网', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: '城市配电网', sceneSubtitle: '市中心 / 开发区 / 老旧居民区',
    cards: [
      { icon: 'plug-zap', title: '充电桩', desc: '快充集群冲击浪涌', metric: '120kW+', metricLabel: '负荷阶跃', consequences: [{ title: '电网电压暂降', sub: '并发充电高峰导致 15%+ 电压跌落，配电变压器过载跳闸' }, { title: '谐波注入', sub: 'EV 整流器 6 脉波谐波，PCC 点 THD 超过 8%，电网污染' }] },
      { icon: 'building-2', title: '商业负荷', desc: '单相负荷三相不平衡', metric: '>8%', metricLabel: '不平衡度', consequences: [{ title: '中性线过载', sub: '零序电流累积，N线烧毁，老旧居民区火灾隐患' }, { title: '电机降额', sub: '三相电机负序发热，使用寿命缩短，非计划停机' }] },
      { icon: 'cable', title: '电缆网络', desc: '地下电缆容性无功', metric: '超前', metricLabel: 'PF > 0.95', consequences: [{ title: '过补偿', sub: '电缆电容导致轻载时 PF 超前，电压升高，绝缘应力' }, { title: '谐振风险', sub: '电缆电容 + 变压器电感并联谐振，谐波放大' }] },
    ],
  },
  {
    id: 'microgrid', label: '微电网', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: '微电网与冷热电联供', sceneSubtitle: '园区 / 海岛 / 偏远地区',
    cards: [
      { icon: 'sun', title: '多源并网', desc: '光伏 + 风电 + 储能谐波叠加', metric: '>12%', metricLabel: 'THD', consequences: [{ title: 'PCC 点超标', sub: '多逆变器谐波叠加，IEEE 519 PCC 限值超标，电网运营商罚款' }, { title: '谐振不稳定', sub: 'LCL 滤波器交互，宽频振荡，逆变器级联脱网' }] },
      { icon: 'battery-charging', title: '储能充放', desc: '充放电无功波动', metric: 'PF 摆动', metricLabel: '0.7~1.0', consequences: [{ title: '罚款', sub: '双向 PF 摆动触发电力公司无功电费，月度费用激增' }, { title: '循环寿命损失', sub: '附加无功电流加热电池 PCS，IGBT 加速老化，质保失效风险' }] },
      { icon: 'shuffle', title: '并离网切换', desc: '并/离网切换电压暂降', metric: '>20%', metricLabel: '暂降深度', consequences: [{ title: '负荷脱扣', sub: 'STS 切换 > 4ms 导致接触器脱落，关键负荷 UPS 转电池' }, { title: '柴发启动失败', sub: '发电机启动过程中暂降，AVR 励磁崩溃，黑启动失败' }] },
    ],
  },
];
export const gridTopology = [
  {
    id: 'transmission', sceneName: '输电拓扑', sceneSubtitle: '变电站 / 配电网 / 农网升级',
    deviceLabel: 'SVG + AHF', deviceType: '组合系统',
    deviceDesc: 'SVG 安装于 35kV/10kV 母线用于无功 + AHF 安装于关键负荷馈线用于谐波，标注 DG 接入点',
    branches: [
      { label: '关键负荷', sub: '敏感设备' },
      { label: 'DG 接入点', sub: '反向潮流' },
      { label: '农网馈线', sub: '长线路压降' },
    ],
  },
  {
    id: 'urban', sceneName: '城市配电拓扑', sceneSubtitle: '市中心 / 开发区 / 老旧居民区',
    deviceLabel: 'SPC + SVG-10kV', deviceType: '配电系统',
    deviceDesc: 'SPC 安装于 10kV 馈线用于平衡 + SVG 安装于母线用于无功，标注充电站/商业/居民负荷',
    branches: [
      { label: '充电站', sub: '冲击负荷' },
      { label: '商业负荷', sub: '三相不平衡' },
      { label: '居民负荷', sub: '单相负荷' },
    ],
  },
  {
    id: 'microgrid', sceneName: '微电网拓扑', sceneSubtitle: '园区 / 海岛 / 偏远地区',
    deviceLabel: 'SVG+AHF + SPC', deviceType: '微电网系统',
    deviceDesc: 'SVG+AHF 安装于 PCC 点用于电能质量 + SPC 用于负荷平衡，标注光伏/储能/柴油分支',
    branches: [
      { label: '光伏阵列', sub: '间歇电源' },
      { label: '电池 PCS', sub: '双向流动' },
      { label: '柴油发电机', sub: '备用电源' },
    ],
  },
];
export const gridCases = [
  {
    title: '典型配置 — 输配电无功支撑',
    tabLabel: '输配电无功支撑',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-grid-case-substation.webp',
    industry: '典型配置 · 电网', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/contact',
    site: '一种用于变电站或农网馈线升级的示意配置：SVG 安装在 35 kV / 10 kV 母线用于无功与电压支撑，AHF 仅安装在谐波最严重的馈线上。',
    overview: '对于同时带工业与牵引负荷的变电站，通常做法是母线上的 SVG 负责无功电压支撑，关键馈线上的 AHF 负责谐波。容量由勘测确定，而非模板——下方数量仅为起点。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG', qty: 2, use: '母线无功电压支撑' }, { product: 'AHF-200A', qty: 3, use: '关键馈线谐波滤波' }],
    results: [
      '依据实测谐波频谱与无功剖面选型',
      '按 GB/T 14549 在公共连接点达标',
      '输配电行业参考项目可应要求提供',
    ],
  },
  {
    title: '典型配置 — 城市配电网',
    tabLabel: '城市配电',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-grid-case-urban.webp',
    industry: '典型配置 · 城市配电', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/contact',
    site: '一种用于市中心或开发区网络、承载 EV 集群、商业单相负荷与电缆馈电居民区的示意配置。',
    overview: '对于承载 EV 快充集群加混合商业与居民负荷的城市 10 kV 网络，通常做法是在充电馈线上装设分相平衡装置，在馈线上装设 SVG 用于无功支撑。轻载时地下电缆电容必须先校验，否则 SVG 会与之对抗。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SPC-150A', qty: 4, use: '充电车位三相平衡' }, { product: 'SVG', qty: 2, use: '馈线无功补偿' }],
    results: [
      '经轻载容性校验确认容量',
      '各充电站对标 GB/T 15543 不平衡限值',
      '城市配电行业参考项目可应要求提供',
    ],
  },
  {
    title: '典型配置 — 微电网与冷热电联供',
    tabLabel: '微电网与 CCHP',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-grid-case-microgrid.webp',
    industry: '典型配置 · 微电网', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/contact',
    site: '一种用于园区、海岛或偏远微电网的示意配置，在单一公共连接点汇集光伏、储能与柴油备用的配置。',
    overview: '对于汇集光伏、风电、储能与柴油的海岛与园区微电网，通常做法是在公共连接点装设 SVG + AHF 组合，并在相间加装平衡装置。多逆变器谐波叠加以及并/离网切换暂降都必须在确定容量前实测。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'PCC 点电能质量调节' }, { product: 'SPC-100A', qty: 1, use: '相间负荷平衡' }],
    results: [
      '选型前完成全部逆变器类型的谐波研究',
      '并/离网切换行为经测量验证',
      '微电网行业参考项目可应要求提供',
    ],
  },
];

// ===================== 数据中心数据 =====================
export const dcPainPoints = [
  {
    id: 'cloud', label: '云计算', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: '大型云计算中心', sceneSubtitle: 'HPC / 云服务商 / 托管',
    cards: [
      { icon: 'cloud', title: 'UPS 谐波', desc: 'UPS 整流器反射污染', metric: '>12%', metricLabel: 'THD', consequences: [{ title: '并联环流', sub: 'UPS 谐波电流在并联机组间环流，负载分配不均，热失控风险' }, { title: '电池寿命↓', sub: '谐波纹波加速 VRLA 电池腐蚀，3 年寿命降至 18 个月' }] },
      { icon: 'server', title: '服务器集群', desc: '单相 IT 负荷三相不平衡', metric: '>15%', metricLabel: '不平衡度', consequences: [{ title: '中性线过热', sub: '三次谐波 + 三相不平衡叠加，零序 > 相电流，火灾风险' }, { title: 'PDU 跳闸', sub: '单相过载但均值低于额定，机架 PDU 断路器误跳，整排断电' }] },
      { icon: 'fan', title: '制冷系统', desc: 'VFD 冷水机/CRAC 无功影响', metric: 'PUE', metricLabel: '恶化', consequences: [{ title: '变压器过载', sub: '附加无功消耗变压器容量，被迫冷却升级，资本支出浪费' }, { title: '能耗罚款', sub: 'PUE 1.6→1.8 因无功损耗，10MW 设施年运营费 +80 万元' }] },
    ],
  },
  {
    id: 'finance', label: '金融数据中心', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: '金融数据中心', sceneSubtitle: '银行 / 证券 / 保险',
    cards: [
      { icon: 'landmark', title: '高频交易', desc: '暂降敏感交易基础设施', metric: '< 3ms', metricLabel: '暂降耐受', consequences: [{ title: '交易中断', sub: 'CBEMA/ITIC 曲线违规，服务器 PSU 掉电，毫秒暂降 = 百万元损失' }, { title: '监管罚款', sub: '证监会交易连续性要求，中断 >5 分钟触发强制报告，合规罚款' }] },
      { icon: 'power', title: '柴油切换', desc: '机组测试/停电时切换冲击', metric: '±15%', metricLabel: '电压阶跃', consequences: [{ title: 'UPS 过载', sub: 'ATS 切换冲击，UPS 转电池，整流器爬坡过载，系统崩溃' }, { title: '发电机振荡', sub: '负荷阶跃导致调速器振荡，频率 >2% 偏差，PSU 关机' }] },
      { icon: 'thermometer', title: '精密空调', desc: 'VFD 压缩机谐波源', metric: '>8%', metricLabel: 'THD', consequences: [{ title: 'PUE 升高', sub: '冷却变压器谐波降额，制冷能力下降，机架热点' }, { title: '控制故障', sub: '谐波噪声干扰空调控制器 PSU，传感器漂移，温度振荡' }] },
    ],
  },
  {
    id: 'edge', label: '边缘计算', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: '边缘计算节点', sceneSubtitle: '5G 基站 / IoT / 分布式机房',
    cards: [
      { icon: 'router', title: '电网质量', desc: '偏远/农村站点供电不稳定', metric: '>20%', metricLabel: '暂降深度', consequences: [{ title: '节点离线', sub: '频繁暂降触发 mini-UPS 电池放电，6 个月内循环寿命耗尽' }, { title: '上门维护成本', sub: '每次上门 800 元，200+ 节点 = 月运维费 16 万元' }] },
      { icon: 'hard-drive', title: '小型 UPS', desc: '单柜站点过载风险', metric: '>80%', metricLabel: '负载率', consequences: [{ title: '无冗余', sub: 'N 配置，单台 UPS 故障 = 节点完全中断，SLA 99.9% 不达标' }, { title: '电池过热', sub: '紧凑柜体高充电倍率，热失控，无人值守站点火灾风险' }] },
      { icon: 'radio', title: '分布式负荷', desc: '单相 5G/IoT 三相不平衡', metric: '>10%', metricLabel: '不平衡度', consequences: [{ title: '效率损失', sub: 'DER 协调失败，负序电流，PCS 降额 15%，弃电' }, { title: '单相跳闸', sub: '单相过流，同馈线共址设备级联脱扣' }] },
    ],
  },
];
export const dcTopology = [
  {
    id: 'cloud', sceneName: '云计算拓扑', sceneSubtitle: 'HPC / 云服务商 / 托管',
    deviceLabel: 'AHF+SVG', deviceType: '电能质量系统',
    deviceDesc: 'AHF 安装于 UPS 输入端用于谐波 + SVG 安装于低压母线用于无功，标注制冷系统分支',
    branches: [
      { label: 'UPS 输入', sub: '谐波源' },
      { label: '服务器机架', sub: '不平衡负荷' },
      { label: 'CRAC/HVAC', sub: 'VFD 无功负荷' },
    ],
  },
  {
    id: 'finance', sceneName: '金融数据中心拓扑', sceneSubtitle: '银行 / 证券 / 保险',
    deviceLabel: 'AHF-100A + SVG-150A', deviceType: '精密系统',
    deviceDesc: 'AHF 串联于 UPS 前端 + SVG 安装于低压母线，标注 ATS 切换/交易终端/空调负荷',
    branches: [
      { label: 'UPS 系统', sub: '谐波源' },
      { label: '交易终端', sub: '暂降敏感' },
      { label: '精密空调', sub: 'VFD 谐波' },
    ],
  },
  {
    id: 'edge', sceneName: '边缘节点拓扑', sceneSubtitle: '5G 基站 / IoT / 分布式机房',
    deviceLabel: 'AHF-Slim 15A', deviceType: '机架式单元',
    deviceDesc: 'AHF-Slim 机架式安装于配电柜，标注市电直供 / mini-UPS 回路',
    branches: [
      { label: '市电直供', sub: '农村电网供电' },
      { label: 'Mini UPS', sub: '过载风险' },
      { label: '5G/IoT 负荷', sub: '分布式电源' },
    ],
  },
];
export const dcCases = [
  {
    title: '数据中心馈线 UPS 谐波治理，广州',
    tabLabel: 'IDC 馈线',
    highlight: '谐波电流 204.96 A → 19.18 A；畸变率 26.94% → 3.12%',
    image: '/assets/images/solutions-datacenter-case-cloud.webp',
    industry: '托管 / IDC', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/contact',
    site: '某 IDC 机房的 TR1 馈线，运行电流 200 A–850 A，改造前位移功率因数 0.975。原滤波柜为重建而非更换。',
    harmonics: [
      '负载电流 814.13 A，负载率 82%',
      '总谐波电流 204.96 A，Ithd 26.94%',
      '改造前位移功率因数 0.975',
      '处理后各相畸变率：A/B/C 相 3.12% / 2.50% / 2.55%',
    ],
    overview: '某 IDC 机房 TR1 馈线，运行电流 200–850 A，改造前位移功率因数 0.975。原滤波柜围绕一台新的 500 A 有源滤波器重建。在 814.13 A 负载电流（负载率 82%）下，实测谐波电流峰值 204.96 A，畸变率 26.94%。',
    limitations: '仅覆盖机房一条馈线，而非整个站点。数据取自 814.13 A 负载电流（负载率 82%），即验收报告采用的工况点。',
    trend: '谐波电流 204.96 A → 19.18 A  ·  畸变率 26.94% → 3.12%',
    solution: [{ product: 'AHF-500A', qty: 1, use: 'TR1 馈线上重建的滤波柜' }],
    results: [
      '各相畸变率 A/B/C 相 3.12% / 2.50% / 2.55%',
      '运行中功率因数保持 0.981',
      '各次谐波均满足 GB/T 14549 限值',
      'IDC 机房一、三相通过消防验收备案',
    ],
  },
  {
    title: '典型配置 — 金融数据中心',
    tabLabel: '金融 DC',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-datacenter-case-finance.webp',
    industry: '典型配置 · 金融 DC', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/contact',
    site: '一种用于银行、证券或保险数据中心的示意配置，UPS 整流器谐波与 ATS 切换暂态主导设计。',
    overview: '对于银行、证券和保险数据中心，通常做法是在 UPS 整流器前端装设 AHF，在低压母线装设 SVG 用于动态无功支撑。ATS 切换测试是应力工况——暂降窗口必须在确定滤波器容量前实测。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'AHF-100A', qty: 4, use: 'UPS 整流器前端滤波' }, { product: 'SVG-100A', qty: 2, use: '交易大厅动态无功支撑' }],
    results: [
      '选型前在 ATS 切换测试中实测暂降窗口',
      '对标 IEC 61000-3-3 闪变与站点暂降耐受要求',
      '金融数据中心行业参考项目可应要求提供',
    ],
  },
  {
    title: '典型配置 — 边缘计算节点',
    tabLabel: '边缘节点',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-datacenter-case-edge.webp',
    industry: '典型配置 · 边缘计算', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/contact',
    site: '一种用于 5G MEC 与分布式 IoT 站点的示意配置，供电不稳、机柜狭小、上门成本高于硬件本身。',
    overview: '对于 5G MEC 与分布式 IoT 站点，通常做法是在现有柜体内装设纤薄机架式 AHF，并集中监控。偏远站点有其特殊约束：供电不稳，且上门成本远超硬件，因此远程监控不是可选项。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'AHF-Slim', qty: 1, use: '每节点机柜 1U 机架式' }, { product: 'Cloud Monitor', qty: 1, use: '集中远程监控平台' }],
    results: [
      '按机柜实测确定容量',
      '包含远程监控，避免以上门为默认响应',
      '边缘计算行业参考项目可应要求提供',
    ],
  },
];

// ===================== 工业数据 =====================
export const indPainPoints = [
  {
    id: 'welding', label: '焊接与金属', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: '焊接与金属加工', sceneSubtitle: '汽车 / 造船 / 钢结构',
    cards: [
      { icon: 'flame', title: '电焊机组', desc: '批量电弧焊谐波浪涌', metric: '>25%', metricLabel: 'THD', consequences: [{ title: '变压器过热', sub: '间歇性高谐波电流，绝缘老化加速 3 倍，被迫降额' }, { title: '保护跳闸', sub: '谐波峰值触发断路器误跳，产线停产，返工成本' }] },
      { icon: 'factory', title: '中频炉', desc: '感应炉电压闪烁', metric: '无功', metricLabel: '波动', consequences: [{ title: '电网电压暂降', sub: '电炉周期导致 Pst > 1.5，邻近设备故障，批次报废' }, { title: '罚款', sub: '电力公司闪烁违规，月度无功电费加收，合同违约' }] },
      { icon: 'cpu', title: '数控加工中心', desc: '伺服驱动三相不平衡', metric: '高', metricLabel: '零序', consequences: [{ title: '伺服故障', sub: '三相不平衡导致位置误差，工件尺寸漂移，废品率上升' }, { title: '良率损失', sub: '频繁断刀，表面质量下降，客户退货率激增' }] },
    ],
  },
  {
    id: 'petrochemical', label: '化工与石油', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: '化工与石化', sceneSubtitle: '炼化 / 精细化工 / 油气',
    cards: [
      { icon: 'droplets', title: '变频器群', desc: '多台变频器谐波叠加', metric: '>18%', metricLabel: 'THD', consequences: [{ title: '电网违规', sub: '多变频器谐波叠加，IEEE 519 PCC 限值超标，电力公司警告' }, { title: '电容跳闸', sub: 'PFC 电容器谐波放大，熔丝熔断，无功罚款升级' }] },
      { icon: 'waves', title: '大功率泵', desc: '大型电机启动浪涌', metric: '6~10x', metricLabel: '冲击电流', consequences: [{ title: '母线电压跌落', sub: '直接启动导致 20%+ 母线跌落，DCS I/O 模块欠压，控制环路不稳' }, { title: 'DCS 告警', sub: '反复暂降触发 DCS 告警风暴，操作员认知超负荷，响应延迟' }] },
      { icon: 'shield-alert', title: 'DCS 系统', desc: '暂降敏感控制基础设施', metric: '>15%', metricLabel: '暂降深度', consequences: [{ title: '控制冻结', sub: '暂降导致 DCS 处理器复位，阀门位置丢失，放热反应风险' }, { title: '工艺停机', sub: '安全仪表系统触发 ESD，批次损失，48 小时重启程序' }] },
    ],
  },
  {
    id: 'semiconductor', label: '半导体', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: '半导体与电子', sceneSubtitle: '晶圆厂 / 封装 / PCB',
    cards: [
      { icon: 'cpu', title: '晶圆厂', desc: '光刻扫描仪电压暂降', metric: '< 5ms', metricLabel: '暂降耐受', consequences: [{ title: '扫描仪停机', sub: '亚周波暂降导致扫描仪台面位置丢失，4 小时重新校准，晶圆报废' }, { title: '晶圆报废', sub: '单次暂降事件 = 25 片晶圆报废 × $5K/片 = 每次损失 $125K' }] },
      { icon: 'wind', title: '洁净室', desc: 'FFU/VFD 谐波污染', metric: '>8%', metricLabel: 'THD', consequences: [{ title: '过滤器负荷↑', sub: '谐波电流增加 FFU 电机温度，轴承故障率 3 倍，粒子计数上升' }, { title: '粒子风险', sub: 'FFU 转速波动导致正压丧失，百级洁净室超标' }] },
      { icon: 'microscope', title: '测试设备', desc: 'ATE/测试层三相不平衡', metric: '>5%', metricLabel: '不平衡度', consequences: [{ title: '数据错误', sub: 'ATE 电源纹波抑制退化，DUT 误判报废，良率报告错误' }, { title: '中性线过热', sub: '测试层 PDU 零序电流高，N 线温度 > 90°C，火灾风险' }] },
    ],
  },
];
export const indTopology = [
  {
    id: 'welding', sceneName: '焊接与金属拓扑', sceneSubtitle: '汽车 / 造船 / 钢结构',
    deviceLabel: 'AHF-150A', deviceType: '谐波滤波器',
    deviceDesc: '并联至车间低压母线，针对焊机/电炉馈线进行谐波抑制',
    branches: [
      { label: '焊机配电', sub: '谐波浪涌' },
      { label: '电炉配电', sub: '闪烁源' },
      { label: '数控配电', sub: '三相不平衡' },
    ],
  },
  {
    id: 'petrochemical', sceneName: '化工与石油拓扑', sceneSubtitle: '炼化 / 精细化工 / 油气',
    deviceLabel: 'SVG-800V', deviceType: '静止无功发生器',
    deviceDesc: 'SVG-800V/690V 安装于高压母线 + AHF 用于变频器谐波，标注 DCS 敏感负荷馈线',
    branches: [
      { label: '裂解配电', sub: '变频器群' },
      { label: '蒸馏装置', sub: '电加热负荷' },
      { label: '循环水', sub: '大功率泵' },
    ],
  },
  {
    id: 'semiconductor', sceneName: '半导体拓扑', sceneSubtitle: '晶圆厂 / 封装 / PCB',
    deviceLabel: 'AHF+SVG', deviceType: '组合系统',
    deviceDesc: 'AHF+SVG 组合安装于 UPS 前端，标注双路供电晶圆厂 / 洁净室馈线',
    branches: [
      { label: 'UPS 前端', sub: '精密供电' },
      { label: '工艺冷却', sub: '水泵冲击' },
      { label: '测试设备', sub: '敏感负荷' },
    ],
  },
];
export const indCases = [
  {
    title: '550 A 厂房馈线谐波改造 — 广东某电子制造商',
    tabLabel: '电子馈线',
    highlight: '电流畸变率 20.06% → 2.58%（变频器 / 压缩机 / 水泵馈线）',
    image: '/assets/images/solutions-industrial-case-semiconductor.webp',
    industry: '电子制造', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/contact',
    site: '某电子制造厂的 TM8 馈线，带变频器、空气压缩机与冷却水泵。该回路已带 390 kvar 电容补偿（总装 780 kvar），运行电流 800 A–1,000 A，系统功率因数 0.92。',
    harmonics: [
      'TM8 馈线运行电流 800–1,000 A',
      '改造前电流畸变率 20.06%',
      '系统位移功率因数 0.92',
      '回路带 390 kvar 电容补偿（总装 780 kvar）',
    ],
    overview: 'TM8 馈线带变频器、空气压缩机与冷却水泵，回路带 390 kvar 电容补偿（总装 780 kvar）。运行电流 800–1,000 A，改造前系统位移功率因数 0.92。',
    limitations: '结果仅对应 TM8 馈线。同厂其他馈线不在本合同范围内，数据不涵盖。',
    trend: '畸变率 20.06% → 2.58%',
    solution: [{ product: 'AHF-550A', qty: 1, use: 'TM8 馈线谐波补偿' }],
    results: [
      '电流畸变率 20.06% → 2.58%',
      '避免谐波放大与系统谐振',
      '按 GB/T 14549 验收通过',
    ],
  },
  {
    title: '五台 2,000 kVA 变压器集中谐波治理 — 东莞某光学元件制造商',
    tabLabel: '光学，5 台变压器',
    highlight: '谐波电流 146.22 A → 30.96 A（TR4）与 124.71 A → 43.99 A（TR5）',
    image: '/assets/images/solutions-industrial-case-petrochemical.webp',
    industry: '精密光学制造', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/contact',
    site: '一层低压开关室，五台 2,000 kVA 变压器，负载率约 90%，各带变频器、光学生产设备与电机，含三台电容-电抗柜共 720 kvar。',
    harmonics: [
      'TR4 谐波电流 146.22 A，Ithd 5.39%',
      'TR5 谐波电流 124.71 A，Ithd 4.68%',
      'TR4 3/5/7 次谐波：122.52 / 70.45 / 22.54 A',
      'TR5 3/5/7 次谐波：100.04 / 59.97 / 33.84 A',
      'GB/T 14549 各次限值：62 / 62 / 44 A',
    ],
    overview: '一层低压开关室，5 × 2,000 kVA 变压器，每台配一台 500 A 有源滤波柜。负荷为变频器、光学生产设备与电机，含三台电容-电抗柜共 720 kvar。负载率 90% 下实测。',
    limitations: '公布结果仅涵盖变压器 TR4 与 TR5；其余三台未报告。报告窗口内的滤波器模块可用率不在本说明范围内。',
    trend: 'TR4 146.22 A → 30.96 A  ·  TR5 124.71 A → 43.99 A',
    solution: [{ product: 'AHF-500A', qty: 5, use: '低压开关室每台 2,000 kVA 变压器一台柜' }],
    results: [
      '畸变率 TR4 5.39% → 1.38%，TR5 4.68% → 1.67%',
      '3 次谐波 TR4 122.52 A → 12.69 A，TR5 100.04 A → 17.89 A',
      '各监测次数均在 GB/T 14549 限值内（3/5/7 次 62 / 62 / 44 A）',
      '验收通过——验收报告称结果"理想"',
    ],
  },
  {
    title: '感应熔炼炉无谐振谐波治理',
    tabLabel: '感应炉',
    highlight: '启动谐振、电网电压缺口与换流扰乱——三者全解',
    image: '/assets/images/solutions-industrial-case-welding.webp',
    industry: '金属与感应加热', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/contact',
    site: '一家金属熔炼车间，运行感应炉。电流波形接近方波，谐波含量极高；启动时的反复电网电压缺口对任何馈线上的有源滤波器都是应力。',
    overview: '感应炉对任何有源滤波器都是硬负荷。电流波形接近方波，谐波含量高且易谐振。启动时的反复电网电压缺口给滤波器带来应力。合闸瞬间输出电感与滤波电容谐振，触发输出过流保护——进而扰乱炉子换流。',
    limitations: '本项目未公布改造前后实测数值，故此处描述工程问题与对策，而非结果表。请将其视为能力说明，而非性能承诺。',
    trend: '',
    note: '本项目未公布改造前后实测值。以下为工程问题及其解决方式。',
    solution: [{ product: 'AHF', qty: 1, use: '炉子馈线，重新整定输出电感与电容参数' }],
    results: [
      '重新整定输出电感与滤波电容参数，打破合闸谐振',
      '通过控制软件更新，消除启动与负载阶跃时的输出过流告警',
      '炉子换流恢复正常',
      '在满足国家电网要求的前提下将畸变率降至限值内，且不触发谐振',
    ],
  },
];

// ===================== 轨道交通数据 =====================
export const railPainPoints = [
  {
    id: 'metro', label: '地铁与轻轨', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: '地铁与轻轨', sceneSubtitle: '牵引 / 车站 / 车辆段',
    cards: [
      { icon: 'train-front', title: '牵引整流', desc: '24 脉波整流器谐波注入', metric: '>15%', metricLabel: 'THD', consequences: [{ title: '电网罚款', sub: '24 脉波特征谐波（23/25 次），IEEE 519 PCC 违规，电力公司加收' }, { title: '电容器故障', sub: 'PFC 柜谐波放大，电容器可能爆裂，地下变电站火灾风险' }] },
      { icon: 'building', title: '车站机电', desc: '设备群不平衡', metric: '>10%', metricLabel: '不平衡度', consequences: [{ title: '中性线过热', sub: '电梯 + 空调单相负荷混合，N 线电流超过相电流，绝缘融化风险' }, { title: '断路器跳闸', sub: '单相过载但均值 < 额定，车站照明中断，乘客安全隐患' }] },
      { icon: 'battery-charging', title: '再生制动', desc: '能量回馈电压升高', metric: '电压', metricLabel: '升高', consequences: [{ title: '逆变器过压', sub: '再生能量倒送，直流母线过压，逆变器 IGBT 保护关机' }, { title: '保护跳闸', sub: '过压保护级联跳闸，列车延误 > 5 分钟，运营 SLA 罚款' }] },
    ],
  },
  {
    id: 'hsr', label: '高铁', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: '高速铁路', sceneSubtitle: '牵引变电所 / AT 所 / 分区所',
    cards: [
      { icon: 'gauge', title: '27.5kV 单相', desc: 'V/V 接线负序分量', metric: '>8%', metricLabel: '不平衡度', consequences: [{ title: '电网违规', sub: '单相牵引负荷在 220kV PCC 产生负序，电力公司限电令' }, { title: '发电机发热', sub: '附近火电厂发电机负序电流，转子表面温度告警' }] },
      { icon: 'zap', title: '动车变流', desc: '四象限变流器宽频谐波', metric: '>12%', metricLabel: 'THD', consequences: [{ title: '接触线发热', sub: '高频谐波电流增加接触线 I²R 损耗，退火加速，弛度增大' }, { title: '信号干扰', sub: '谐波 EMI 耦合至轨道电路，机车信号失真，ETCS 可用性下降' }] },
      { icon: 'cable', title: '馈线', desc: '长距离 AT 馈线电压损失', metric: '>10%', metricLabel: '压降', consequences: [{ title: '限速', sub: '末端电压低于 22.5kV 限制列车功率，实施限速，延误' }, { title: 'AT 饱和', sub: '首端过电压导致自耦变压器铁芯饱和，产生谐波' }] },
    ],
  },
  {
    id: 'ev', label: '充电桩', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: '充电基础设施', sceneSubtitle: '高速服务区 / 城市快充 / 公交场站',
    cards: [
      { icon: 'plug-zap', title: '快充桩', desc: '直流快充功率冲击', metric: '120kW+', metricLabel: '负荷阶跃', consequences: [{ title: '电网暂降', sub: '多充电器同时启动，15%+ 电压跌落，配电变压器保护跳闸' }, { title: '需量电费', sub: '峰值需量尖峰触发电力公司需量棘轮，月度容量电费 3 倍基准' }] },
      { icon: 'radio', title: '充电谐波', desc: '12 脉波充电器谐波叠加', metric: '>15%', metricLabel: 'THD', consequences: [{ title: 'PF 罚款', sub: '谐波 + 无功叠加，PCC 点 PF < 0.85，月度罚款 + 碳税附加' }, { title: 'EMI 问题', sub: '传导 EMI 进入低压电网，附近居民电视/收音机干扰，投诉量激增' }] },
      { icon: 'wrench', title: '配电变压器', desc: '充电站过载与不平衡', metric: '>90%', metricLabel: '负荷', consequences: [{ title: '寿命缩短', sub: '峰谷负荷循环热应力，绝缘老化 5 倍速，预期寿命 < 3 年' }, { title: '三相不均', sub: '单相交流充电器主导，零序电流 > 40%，N 线每 2 年更换' }] },
    ],
  },
];
export const railTopology = [
  {
    id: 'metro', sceneName: '地铁拓扑', sceneSubtitle: '牵引 / 车站 / 车辆段',
    deviceLabel: 'SVG + AHF', deviceType: '组合系统',
    deviceDesc: 'SVG 安装于 35kV 环网 + AHF 安装于牵引变电所 750V/1500V 整流器，标注车站/车辆段',
    branches: [
      { label: '牵引变电所', sub: '整流负荷' },
      { label: '车站配电', sub: '机电负荷' },
      { label: '车辆段供电', sub: '辅助负荷' },
    ],
  },
  {
    id: 'hsr', sceneName: '高铁拓扑', sceneSubtitle: '牵引变电所 / AT 所 / 分区所',
    deviceLabel: 'SVG-27.5kV + AHF-200A', deviceType: '牵引系统',
    deviceDesc: 'SVG-27.5kV 安装于牵引母线 + AHF 安装于 10kV 馈线，标注 AT 段/接触线',
    branches: [
      { label: '接触线', sub: '单相负荷' },
      { label: '馈线', sub: '谐波源' },
      { label: '车站电源', sub: '复合负荷' },
    ],
  },
  {
    id: 'ev', sceneName: '充电桩拓扑', sceneSubtitle: '高速服务区 / 城市快充 / 公交场站',
    deviceLabel: 'SVG + AHF-150A', deviceType: '充电系统',
    deviceDesc: 'SVG 安装于充电站 10kV 侧 + AHF 安装于直流快充桩交流侧，标注变压器/充电机组',
    branches: [
      { label: '10kV 配电', sub: '站用馈线' },
      { label: '快充桩', sub: '冲击负荷' },
      { label: '公交充电', sub: '批量负荷' },
    ],
  },
];
export const railCases = [
  {
    title: '充电站功率因数校正 — 每台变压器 100 kvar SVG',
    tabLabel: '充电站',
    highlight: '待机与充电两种状态下功率因数均保持在目标值；两年内回本',
    image: '/assets/images/solutions-rail-case-charging.webp',
    industry: '充电桩', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/contact',
    site: '一座充电站，两台变压器，2,500 kVA 与 2,000 kVA。在低压进线柜实测，站点功率因数处于 0.1–0.2 容性，因为充电器待机时几乎不取有功，而其整流器仍在交换无功。',
    overview: '充电站两台变压器（2,500 kVA 与 2,000 kVA）。在低压进线柜实测，站点功率因数处于 0.1–0.2 容性，因为充电器待机时几乎不取有功，但其整流器仍在交换无功——传统电容器组无法跟随。原有一台电容柜被拆空，用于容纳 SVG 模块。',
    limitations: '节省数据来自站点自身电价与负荷曲线，不能套用于其他站点。0.2 级及以上精度 CT 是前提，而非可选项。',
    trend: '功率因数 0.1–0.2 容性 → 待机与带载均保持目标值',
    solution: [{ product: 'SVG-100kvar', qty: 2, use: '每台变压器一台；恒无功模式承载待机工况' }],
    results: [
      '待机与充电两种状态下功率因数均达目标',
      '两台变压器年省约 76,000 元',
      '线损降低，末端电压改善',
      '两年内回本；复用原电容柜而非新购',
      '需 0.2 级及以上 CT——待机电流极小',
    ],
  },
  {
    title: '典型配置 — 地铁与轻轨',
    tabLabel: '地铁与轻轨',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-rail-case-metro.webp',
    industry: '典型配置 · 地铁与轻轨', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/contact',
    site: '一种用于地铁或轻轨网络的示意配置：环网母线上的 SVG 用于无功与电压支撑，牵引变电所整流器处的 AHF。',
    overview: '对于地铁与轻轨网络，通常做法是在环网母线上装设 SVG，在牵引变电所整流器处装设 AHF。整流器的特征谐波与再生制动的电压升高是两项必须在选型前实测的内容。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG-300A', qty: 3, use: '环网母线无功补偿' }, { product: 'AHF-200A', qty: 6, use: '牵引变电所谐波滤波' }],
    results: [
      '选型前在变电所实测整流器谐波频谱',
      '按逆变器直流母线限值校验再生电压升高',
      '地铁与轻轨行业参考项目可应要求提供',
    ],
  },
  {
    title: '典型配置 — 高铁牵引',
    tabLabel: '高铁',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-rail-case-hsr.webp',
    industry: '典型配置 · 高铁', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/contact',
    site: '一种用于 27.5 kV 牵引变电所的示意配置，单相负荷产生负序电流，AT 馈线存在末端电压跌落。',
    overview: '对于馈送单相接触网的 V/V 接线牵引变电所，通常做法是在牵引母线上装设 SVG，在站用馈线上装设 AHF。上游 PCC 的负序是约束条件，因此由它决定容量——而非单纯的谐波水平。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG-27.5kV', qty: 2, use: '牵引母线无功与平衡' }, { product: 'AHF-200A', qty: 2, use: '站用馈线谐波滤波' }],
    results: [
      '先测上游 PCC 负序——它由之决定容量',
      '对标 GB/T 15543 不平衡限值',
      '铁路牵引行业参考项目可应要求提供',
    ],
  },
];

// ===================== 新能源数据 =====================
export const rePainPoints = [
  {
    id: 'solar', label: '光伏', color: 'text-electric-orange', colorHex: '#e76f51',
    sceneName: '光伏发电站', sceneSubtitle: '集中式 / 分布式 / 农光互补',
    cards: [
      { icon: 'sun', title: '逆变器谐波', desc: '多逆变器宽频振荡', metric: '>8%', metricLabel: 'THD', consequences: [{ title: '谐振风险', sub: 'LCL 滤波器 + 电网阻抗谐振，宽频振荡，逆变器级联脱网' }, { title: '电网违规', sub: '谐波排放超过 GB/T 14549 PCC 限值，电网公司限电令' }] },
      { icon: 'activity', title: '电网电压', desc: '辐照度变化引起波动', metric: 'PF 低', metricLabel: '无功偏差', consequences: [{ title: '调度罚款', sub: '无功偏离调度设定值，AVC 考核不合格，收入扣减' }, { title: '电压越限', sub: '云边效应，1 分钟内 ±10% 电压摆动，反向功率保护跳闸' }] },
      { icon: 'battery-charging', title: '直流纹波', desc: '直流纹波交流侧反射', metric: '直流偏磁', metricLabel: '变压器过热', consequences: [{ title: '铁芯饱和', sub: '直流分量导致变压器铁芯半波饱和，励磁电流激增，噪声' }, { title: '效率损失', sub: '附加铁损 + 谐波铜损，PR（性能比）下降 2-3 个百分点' }] },
    ],
  },
  {
    id: 'wind', label: '风电', color: 'text-brand-orange', colorHex: '#f4a261',
    sceneName: '风力发电场', sceneSubtitle: '陆上 / 海上 / 分布式',
    cards: [
      { icon: 'wind', title: '变流器谐波', desc: '全功率变流器低次畸变', metric: '>10%', metricLabel: 'THD', consequences: [{ title: '电网拒收', sub: '5 次/7 次谐波主导，电力公司并网测试失败，延迟并网成本' }, { title: '集电谐振', sub: '35kV 电缆电容 + 变压器电感，并联谐振点靠近 7 次谐波' }] },
      { icon: 'trending-up', title: '风速波动', desc: '阵风/湍流无功浪涌', metric: '无功', metricLabel: '摆动', consequences: [{ title: 'PF 罚款', sub: '阵风引起快速无功摆动，月度 PF < 0.85，电力公司无功费 2 倍' }, { title: 'AVC 振荡', sub: 'AVC 系统追逐风速变化振荡，分接头过度磨损，维护 5 倍' }] },
      { icon: 'component', title: '箱式变压器', desc: '辅助负荷三相不平衡', metric: '>5%', metricLabel: '不平衡度', consequences: [{ title: '限值违规', sub: '单相辅助电源不平衡，负序超过电网规范限值' }, { title: '过热跳闸', sub: '不平衡 + 谐波叠加，绕组热点温度告警，被迫限电' }] },
    ],
  },
  {
    id: 'storage', label: '储能', color: 'text-brand-navy', colorHex: '#264653',
    sceneName: '储能系统', sceneSubtitle: '电网侧 / 用户侧 / 电源侧',
    cards: [
      { icon: 'battery-charging', title: '充放电', desc: '多 PCS 谐波叠加', metric: '>6%', metricLabel: 'THD', consequences: [{ title: '电网污染', sub: '多 PCS 交错谐波，PCC 点 THD 超过 GB/T 34120，电网运营商警告' }, { title: '电池纹波', sub: '直流母线交流纹波电流，锂枝晶加速，循环寿命降低 20%' }] },
      { icon: 'arrow-left-right', title: 'PCS 无功', desc: '低载滞后调节', metric: '< 0.9', metricLabel: 'PF', consequences: [{ title: '罚款', sub: '待机模式无功消耗触发罚款，月度费用 + 需量棘轮' }, { title: '调节不合格', sub: 'AGC/AVC 联合调度设定值不达标，辅助服务资格取消' }] },
      { icon: 'globe', title: '并网点', desc: '并网连接处电压闪烁', metric: '> 0.8', metricLabel: 'Pst', consequences: [{ title: '并网失败', sub: '模式切换时闪烁 Pst > 0.8，并网协议不合规' }, { title: '孤岛风险', sub: '电网扰动检测被闪烁干扰，非计划孤岛，安全隐患' }] },
    ],
  },
];
export const reTopology = [
  {
    id: 'solar', sceneName: '光伏拓扑', sceneSubtitle: '集中式 / 分布式 / 农光互补',
    deviceLabel: 'SVG+AHF', deviceType: '光伏电能质量系统',
    deviceDesc: 'SVG 安装于 35kV 升压母线 + AHF 安装于逆变器交流侧，标注汇流箱',
    branches: [
      { label: '汇流箱', sub: '直流汇集' },
      { label: '逆变器交流', sub: '谐波源' },
      { label: '35kV 升压', sub: '并网连接' },
    ],
  },
  {
    id: 'wind', sceneName: '风电拓扑', sceneSubtitle: '陆上 / 海上 / 分布式',
    deviceLabel: 'SVG-690V + AHF-100A', deviceType: '风电电能质量系统',
    deviceDesc: 'SVG-690V 安装于风机侧 + AHF 安装于箱变低压侧，标注 35kV 集电线路',
    branches: [
      { label: '风机变流', sub: '谐波源' },
      { label: '箱式变压器', sub: '不平衡负荷' },
      { label: '35kV 集电', sub: '并网连接' },
    ],
  },
  {
    id: 'storage', sceneName: '储能拓扑', sceneSubtitle: '电网侧 / 用户侧 / 电源侧',
    deviceLabel: 'AHF+SVG 组合', deviceType: '储能电能质量系统',
    deviceDesc: 'SVG+AHF 组合安装于 PCS 交流侧，标注电池簇/PCS/变压器/并网点',
    branches: [
      { label: '电池簇', sub: '直流源' },
      { label: 'PCS 交流侧', sub: '双向' },
      { label: '并网点', sub: '并网连接' },
    ],
  },
];
export const reCases = [
  {
    title: '典型配置 — 光伏电站',
    tabLabel: '光伏电站',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-renewable-case-solar.webp',
    industry: '典型配置 · 光伏', colorClass: 'text-electric-orange', bgClass: 'bg-orange-50',
    link: '/contact',
    site: '一种用于集中式或分布式光伏电站的示意配置：升压母线上的 SVG，逆变器交流馈线上的 AHF。',
    overview: '对于集中式与分布式光伏，通常做法是在升压母线上装设 SVG，在逆变器交流馈线上装设 AHF。多逆变器谐振与云边无功摆动是两种失效模式——二者都需在确定容量前开展测量。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG', qty: 2, use: '升压母线无功支撑' }, { product: 'AHF-200A', qty: 4, use: '逆变器交流馈线谐波滤波' }],
    results: [
      '选型前完成集电网络谐振扫描',
      '按 AVC 调度设定值校验无功包络',
      '光伏行业参考项目可应要求提供',
    ],
  },
  {
    title: '典型配置 — 风电场',
    tabLabel: '风电场',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-renewable-case-wind.webp',
    industry: '典型配置 · 风电', colorClass: 'text-brand-orange', bgClass: 'bg-amber-50',
    link: '/contact',
    site: '一种用于陆上或海上风电场的示意配置，全功率变流器与集电电缆电容在 7 次谐波附近交互。',
    overview: '对于全功率变流器风机，通常做法是在集电母线上装设 SVG，在集电馈线上装设 AHF。电缆电容与变压器电感常在 7 次谐波附近形成并联谐振点，因此订货前需对集电系统建模。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG-690V', qty: 2, use: '集电母线无功支撑' }, { product: 'AHF-100A', qty: 2, use: '集电馈线谐波滤波' }],
    results: [
      '按电缆电容建模集电谐振点',
      '尽可能在一个完整季节内实测阵风驱动的无功摆动',
      '风电行业参考项目可应要求提供',
    ],
  },
  {
    title: '典型配置 — 电池储能',
    tabLabel: '电池储能',
    highlight: '示意配置 — 容量由现场电能质量勘测确定',
    image: '/assets/images/solutions-renewable-case-storage.webp',
    industry: '典型配置 · 储能', colorClass: 'text-brand-navy', bgClass: 'bg-slate-100',
    link: '/contact',
    site: '一种用于电网侧、用户侧或电源侧电池配置的示意配置，PCS 单元交错谐波，待机模式拉低功率因数。',
    overview: '对于电网侧与用户侧储能，通常做法是在 PCS 交流母线上装设 SVG + AHF 组合。充放电切换是应力工况：多 PCS 谐波交错，叠加模式切换时的闪变阶跃，二者均在公共连接点实测。',
    trend: '',
    note: '示意配置——并非具体已交付项目。本行业参考项目可应要求提供。',
    solution: [{ product: 'SVG + AHF', qty: 2, use: 'PCS 交流母线电能质量调节' }, { product: 'PQ Gateway', qty: 1, use: '并网合规监测' }],
    results: [
      '实测充放电切换，而非假设',
      '按并网协议校验并网点闪变',
      '储能行业参考项目可应要求提供',
    ],
  },
];

// ===================== 数据映射 =====================
export const dataMap = {
  commercial: { painPoints: painPointScenes, topology: topologyScenes, cases: cases },
  grid:       { painPoints: gridPainPoints, topology: gridTopology, cases: gridCases },
  datacenter: { painPoints: dcPainPoints, topology: dcTopology, cases: dcCases },
  industry:   { painPoints: indPainPoints, topology: indTopology, cases: indCases },
  rail:       { painPoints: railPainPoints, topology: railTopology, cases: railCases },
  renewable:  { painPoints: rePainPoints, topology: reTopology, cases: reCases },
};
export const industryTitles = {
  commercial: '商业与医疗建筑案例研究',
  grid: '电网案例研究',
  datacenter: '数据中心案例研究',
  industry: '工业制造案例研究',
  renewable: '新能源案例研究',
  rail: '轨道交通案例研究',
};
export const heroImages = {
  commercial: '/assets/images/solutions-commercial-medical-hero-bg.webp',
  grid: '/assets/images/solutions-grid-hero-bg.webp',
  datacenter: '/assets/images/solutions-datacenter-hero-bg.webp',
  industry: '/assets/images/solutions-industrial-hero-bg.webp',
  renewable: '/assets/images/solutions-renewable-hero-bg.webp',
  rail: '/assets/images/solutions-rail-hero-bg.webp',
};
