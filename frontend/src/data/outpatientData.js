/** 特需门诊患者队列（与顶层设计 OutpatientQueue 一致） */
export const OUTPATIENT_PATIENT_QUEUE = [
  {
    taskId: 'task_outpatient',
    queueNo: '001',
    name: '赵强',
    gender: '男',
    age: 58,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint:
      '感心脏漏跳1周。',
    lastMessage: '预问诊语音结构化已完成（20分钟前）',
    patientLabels: ['初诊', '市医保', '高血压'],
  },
  {
    taskId: 'task_outpatient_vip_p2',
    queueNo: '002',
    name: '孙丽',
    gender: '女',
    age: 55,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint: '头晕乏力 2 月，伴间断心悸，无晕厥及黑朦。',
    lastMessage: '外院 Holter 报告已回传（45分钟前）',
  },
  {
    taskId: 'task_outpatient_vip_p3',
    queueNo: '003',
    name: '李峰',
    gender: '男',
    age: 52,
    visitType: '复诊',
    status: '待回诊',
    chiefComplaint:
      'PCI 术后 3 月复诊，近 1 周活动耐量下降，偶有夜间阵发性呼吸困难。',
    criticalValue: '肌钙蛋白 I 0.08 ng/mL (↑ 临界)',
    lastMessage: '术后随访问卷已提交（1小时前）',
  },
  {
    taskId: 'task_outpatient_vip_p4',
    queueNo: '004',
    name: '王建华',
    gender: '男',
    age: 61,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint: '体检发现血压偏高伴血脂异常，要求专科评估与用药指导。',
    criticalValue: 'LDL-C 3.9 mmol/L (↑)',
    lastMessage: '体检报告 OCR 已入库（30分钟前）',
  },
  {
    taskId: 'task_outpatient_vip_p5',
    queueNo: '005',
    name: '陈敏',
    gender: '女',
    age: 48,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint: '胸痛 10 余年，近 2 周发作频率增加，含服硝酸甘油可缓解。',
    criticalValue: 'D-二聚体 0.92 mg/L (↑)',
    lastMessage: '胸痛日记已同步（25分钟前）',
  },
  {
    taskId: 'task_outpatient_vip_p6',
    queueNo: '006',
    name: '杨波',
    gender: '男',
    age: 44,
    visitType: '初诊',
    status: '已就诊',
    chiefComplaint: '间断心悸 3 天，伴乏力，无胸痛及呼吸困难。',
    lastMessage: '医嘱已确认（1小时前）',
  },
  {
    taskId: 'task_outpatient_vip_p7',
    queueNo: '007',
    name: '黄梅',
    gender: '女',
    age: 56,
    visitType: '复诊',
    status: '未就诊',
    chiefComplaint: '心衰随访，近 1 周下肢水肿加重，体重增加约 2 kg。',
    criticalValue: 'BNP 486 pg/mL (↑)',
    lastMessage: '居家体重监测数据已上传（40分钟前）',
  },
  {
    taskId: 'task_outpatient_vip_p8',
    queueNo: '008',
    name: '林涛',
    gender: '男',
    age: 50,
    visitType: '复诊',
    status: '未就诊',
    chiefComplaint: '支架术后 6 月复查，无胸痛，希望评估能否减停部分药物。',
    lastMessage: '用药清单已核对（15分钟前）',
  },
]

/** 队列患者顶栏扩展信息（身份证号、手机、过敏史、诊断） */
export const OUTPATIENT_PATIENT_HEADER_META = {
  task_outpatient: {
    idCard: '330102196705****1234',
    phone: '138****5678',
    allergy: '无',
    diagnosis: '高血压、高脂血症',
  },
  task_outpatient_vip_p2: {
    idCard: '330102197005****5678',
    phone: '139****1234',
    allergy: '无',
    diagnosis: '心律失常待查',
  },
  task_outpatient_vip_p3: {
    idCard: '330102197305****9012',
    phone: '137****8899',
    allergy: '无',
    diagnosis: 'PCI 术后随访',
  },
  task_outpatient_vip_p4: {
    idCard: '330102196405****3456',
    phone: '136****5566',
    allergy: '磺胺类',
    diagnosis: '高血压、高脂血症',
  },
  task_outpatient_vip_p5: {
    idCard: '330102197805****7890',
    phone: '135****7788',
    allergy: '青霉素',
    diagnosis: '冠心病',
  },
  task_outpatient_vip_p6: {
    idCard: '330102198105****2345',
    phone: '133****9900',
    allergy: '无',
    diagnosis: '心悸待查',
  },
  task_outpatient_vip_p7: {
    idCard: '330102197005****6789',
    phone: '132****1122',
    allergy: '无',
    diagnosis: '慢性心力衰竭',
  },
  task_outpatient_vip_p8: {
    idCard: '330102197605****4567',
    phone: '131****3344',
    allergy: '无',
    diagnosis: '冠心病（支架术后）',
    reports: [],
  },
}

/** 全景档案微表单标题 */
export const PANORAMA_FORM_TITLE = '已为您跨域调取并整理了患者全景档案：'

/** 医技报告纳入「近期」的月数 */
export const PANORAMA_REPORT_RECENT_MONTHS = 3

/**
 * 筛选近 N 个月内的医技报告（按 date 字段 YYYY-MM-DD）
 * @param {Array<{ date?: string }>} reports
 * @param {Date} [referenceDate]
 */
export function filterRecentPanoramaReports(
  reports,
  referenceDate = new Date(),
  months = PANORAMA_REPORT_RECENT_MONTHS
) {
  if (!Array.isArray(reports) || !reports.length) return []
  const cutoff = new Date(referenceDate)
  cutoff.setMonth(cutoff.getMonth() - months)
  cutoff.setHours(0, 0, 0, 0)

  return reports.filter((report) => {
    if (!report?.date) return false
    const parsed = new Date(`${report.date}T00:00:00`)
    return !Number.isNaN(parsed.getTime()) && parsed >= cutoff
  })
}

/** 门诊全景档案默认数据（赵强首诊演示） */
export const DEFAULT_OUTPATIENT_PROFILE = {
  name: '赵强',
  gender: '男',
  age: '58岁',
  visitTag: '初诊',
  patientLabels: ['初诊', '市医保', '高血压'],
  queueNo: '001',
  outpatientNo: '20260514003',
  idCard: '330102196705****1234',
  phone: '138****5678',
  allergy: '无',
  diagnosis: '高血压、高脂血症',
  vitals: {
    temperature: '36.5',
    heartRate: '88',
    respiration: '18',
    bloodPressure: '145/90',
    weight: '72',
  },
  preConsultation: {
    chiefComplaint: '感心脏漏跳1周。',
    presentIllness:'近一周感心脏漏跳，活动耐量下降，偶有夜间阵发性呼吸困难，无胸痛，无胸闷。',
    pastHistory: '高血压10年，高血脂5年，吸烟史 20 年，已戒烟 2 年；偶饮酒。',
    familyHistory: '冠心病史，高血压史。',
    allergyHistory: '无',
  },
  reports: [
    {
      id: 'report-lipid',
      title: '血脂全套 (本院)',
      date: '2026-03-15',
      category: 'lab',
      abnormalSummary: 'TG 2.10 mmol/L (↑)；LDL-C 1.53 mmol/L (↓)',
      abnormal: true,
      labDetailId: 'lipid-panel',
    },
    {
      id: 'report-ecg',
      title: '动态心电图及心率变异性检查（本院）',
      date: '2026-03-15',
      category: 'exam',
      abnormalSummary: '1.窦性心律 2.房性早搏 3.室性早搏 4.ST段轻度改变',
      abnormal: false,
      examDetailId: 'ecg-holter',
    },
  ],
}

/** 队列首位患者（赵强）taskId，用于辅助信息联动 */
export const OUTPATIENT_FIRST_PATIENT_TASK_ID = 'task_outpatient'

/** 首位患者全景档案展示时，右侧辅助信息演示数据 */
export const OUTPATIENT_AUX_PANEL_DATA = {
  visitHistory: [
    {
      id: 'visit-1',
      date: '2026-03-27 09:20',
      diagnosis:
        '1.高血压病、心律失常；2.频发房性早搏、偶发室性早搏； 3.高脂血症； 4.慢性心肌缺血',
      department: '心血管内科',
      hospital: '市第一人民医院',
    },
  ],
  bloodPressureTrend: {
    sourceLabel: '穿戴设备同步 · 近 1 个月',
    unit: 'mmHg',
    series: [
      { key: 'systolic', label: '收缩压', color: '#ef4444' },
      { key: 'diastolic', label: '舒张压', color: '#3b82f6' },
    ],
    points: [
      { date: '04-27', systolic: 132, diastolic: 82 },
      { date: '04-30', systolic: 138, diastolic: 86 },
      { date: '05-03', systolic: 142, diastolic: 88 },
      { date: '05-06', systolic: 136, diastolic: 84 },
      { date: '05-09', systolic: 145, diastolic: 90 },
      { date: '05-12', systolic: 140, diastolic: 87 },
      { date: '05-15', systolic: 148, diastolic: 92 },
      { date: '05-18', systolic: 143, diastolic: 89 },
      { date: '05-21', systolic: 146, diastolic: 91 },
      { date: '05-24', systolic: 145, diastolic: 90 },
    ],
  },
  lipidTrend: {
    sourceLabel: '年度体检 · 近 5 年 TG',
    unit: 'mmol/L',
    target: 1.7,
    abnormal: true,
    points: [
      { label: '2021', value: 1.62 },
      { label: '2022', value: 1.78 },
      { label: '2023', value: 1.95 },
      { label: '2024', value: 2.08 },
      { label: '2025', value: 2.1 },
    ],
  },
  medications: [
    {
      id: 'med-1',
      name: '苯磺酸氨氯地平片',
      spec: '5mg',
      frequency: '每日 1 次 · 晨服',
      indication: '高血压',
      status: '服用中',
    },
    {
      id: 'med-2',
      name: '阿司匹林肠溶片',
      spec: '100mg',
      frequency: '每日 1 次 · 餐后',
      indication: '冠心病',
      status: '已停药 7 天',
      statusType: 'warning',
    },
    {
      id: 'med-3',
      name: '阿托伐他汀钙片',
      spec: '20mg',
      frequency: '每日 1 次 · 晚服',
      indication: '高脂血症',
      status: '服用中',
    },
    {
      id: 'med-4',
      name: '单硝酸异山梨酯缓释片',
      spec: '40mg',
      frequency: '每日 1 次',
      indication: '冠心病',
      status: '服用中',
    },
  ],
}

/** 历史就诊病历详情（辅助区「查看」→ 会话区微表单，患者：赵强） */
export const OUTPATIENT_VISIT_RECORDS = {
  'visit-1': {
    visitId: 'visit-1',
    title: '历史就诊病历',
    visitDate: '2026-03-27 09:20',
    hospital: '市第一人民医院',
    department: '心血管内科',
    patientName: '赵强',
    chiefComplaint: '高血压病史近10年，间断心悸、胸闷1个月。',
    presentIllness:
      '患者高血压病史近10年，平时规律服用降压药物，1个月前无明显诱因出现心悸、胸闷感，多于劳累或情绪激动后出现，持续数分钟可自行缓解，无呼吸困难，无夜间阵发性呼吸困难，无黑朦及晕厥。',
    pastHistory: '高脂血症病史5年，未规律服用降脂药物。',
    allergyHistory: '无',
    physicalExamLine:
      '体温：36.6℃、脉搏/心率：70次/分、呼吸频率：18/分、血压：152/94 mmHg、血氧饱和度：98%。心前区无隆起，心尖搏动正常。心率 76 次/分，心律不齐，可闻及早搏，约 4-6 次/分，各瓣膜听诊区未闻及病理性杂音。',
    auxiliaryExamLabel: '辅助检查',
    auxiliaryExamText:
      '动态心电图：1. 窦性心律；2. 电轴左偏-39°；3. 下壁导联r波较小',
    diagnosisLabel: '初步诊断',
    outpatientDiagnosis:
      '1.高血压病、心律失常；2.频发房性早搏、偶发室性早搏；3.高脂血症；4.慢性心肌缺血',
    treatmentPlanLabel: '处置',
    treatmentPlan: `检查/检验
1. 动态心电图及心率变异性检查
2. 生化全项
药品
1. 氯沙坦钾(氯沙坦钾片) 科素亚 50mgx7片/盒 50mg 口服 1次/日 28天 4盒
2. 琥珀酸美托洛尔(琥珀酸美托洛尔缓释片) 倍他乐克 47.5mgx7片/盒 47.5mg 口服 1次/日 28天 4盒
3. 阿托伐他汀钙(阿托伐他汀钙片) 美达信 10mgx14片/盒 10mg 口服 1次/日 28天 2盒`,
    precautions:
      '低盐低脂饮食，戒烟限酒，避免情绪激动、暴饮暴食及剧烈运动。每日早晚各测量一次血压并做好记录。若出现持续性胸痛、胸闷加重、向肩背部放射，或伴有大汗、濒死感，请立即就近急诊就医，1个月后门诊复查血压、血脂、心电图。',
  },
  'visit-2': {
    visitId: 'visit-2',
    title: '历史就诊病历',
    visitDate: '2025-11-06 14:05',
    hospital: '市第一人民医院',
    department: '心血管内科门诊',
    patientName: '赵强',
    chiefComplaint: '胸闷 1 月余，活动后加重，伴乏力、心悸。',
    presentIllness:
      '患者 1 月来反复胸闷，与快走、爬楼相关，休息 3–5 分钟可缓解，伴乏力、心悸，无典型胸痛放射，无晕厥、黑朦；外院查血脂升高，冠脉 CTA 提示 LAD 中段狭窄约 50%，今至我院进一步诊治。',
    pastHistory: '高血压病史 4 年，血压控制欠佳；否认糖尿病。吸烟史 20 年，已戒烟 2 年。',
    allergyHistory: '无',
    vitals: {
      temperature: '36.4',
      heartRate: '82',
      respiration: '19',
      bloodPressure: '142/88',
    },
    auxiliaryExamText:
      '冠脉 CTA（外院，2025-11-01）：LAD 中段狭窄约 50%。血脂全套（2025-11-05）：LDL-C 3.5 mmol/L（↑），TG 2.1 mmol/L（↑）。',
    outpatientDiagnosis: '胸闷待查；高脂血症；高血压病 2 级',
    treatmentPlan:
      '1、阿托伐他汀钙片 20mg*7片/盒 QN 20mg 口服 4\n2、苯磺酸氨氯地平片 5mg*7片/盒 QD 5mg 口服 7\n3、阿司匹林肠溶片 100mg*30片/盒 QD 100mg 口服 30',
    precautions:
      '完善心电图、心肌酶谱；低盐低脂饮食，避免剧烈活动；若胸痛持续不缓解或伴大汗、气促，立即急诊就诊；已预约心脏超声。',
  },
  'visit-3': {
    visitId: 'visit-3',
    title: '历史就诊病历',
    visitDate: '2025-06-12 08:40',
    hospital: '社区卫生服务中心',
    department: '全科医学科',
    patientName: '赵强',
    chiefComplaint: '发现血压升高 3 月，伴头晕、偶有心悸。',
    presentIllness:
      '患者 3 月来多次测血压偏高，最高 158/96 mmHg，伴轻度头晕，偶有心悸，无头痛、视物模糊，无胸闷胸痛，未规律服药，为评估及用药指导来诊。',
    pastHistory: '否认冠心病、糖尿病；父亲有高血压、冠心病史。',
    allergyHistory: '无',
    vitals: {
      temperature: '36.5',
      heartRate: '80',
      respiration: '18',
      bloodPressure: '152/94',
    },
    auxiliaryExamText:
      '血常规、生化初筛（2025-06-10）：空腹血糖 5.4 mmol/L；肾功能正常；TC 5.6 mmol/L（↑），LDL-C 3.4 mmol/L（↑）。',
    outpatientDiagnosis: '高血压病 2 级',
    treatmentPlan:
      '1、苯磺酸氨氯地平片 5mg*7片/盒 QD 5mg 口服 7\n2、健康生活方式指导，家庭血压监测',
    precautions:
      '低盐饮食，控制体重，戒烟限酒；每日监测血压并记录；2 周复测血压，效果不佳转诊心内科进一步评估。',
  },
}

export function getVisitRecordById(visitId) {
  return OUTPATIENT_VISIT_RECORDS[visitId] ?? null
}

/** 首诊实时语音问诊剧本 */
export const DEFAULT_CONSULTATION_SCRIPT = [
  { role: 'doctor', text: '赵先生您好。看记录您这周胸闷频繁了？发作时有顺着后背疼吗？' },
  { role: 'patient', text: '陈主任，没有后背疼，就是心慌得厉害，上楼梯感觉喘不上气。' },
  { role: 'doctor', text: '药有按时吃吗？' },
  { role: 'patient', text: '阿司匹林吃完一星期了，最近家里事忙，就没去配。' },
]

/** 回诊语音剧本 */
export const CONSULTATION_FOLLOWUP_SCRIPT = [
  { role: 'doctor', text: '赵先生，刚才看了你的报告，肌钙蛋白这个指标确实高了，说明心脏还是有损伤。' },
  { role: 'patient', text: '陈主任，那严重吗？我现在还是觉得稍微动一下就有点气短。' },
  { role: 'doctor', text: '你的超声显示心脏泵血能力（EF值）也有所下降。现在必须调整方案，我建议你需要住院做进一步的冠脉介入检查，药也要加量。' },
  { role: 'patient', text: '行，听您的，我这就去办住院。' },
]

export const OUTPATIENT_LAB_ITEMS = [
  '心肌酶谱 (CK, CK-MB)',
  '肌钙蛋白 T (cTnT)',
  'BNP / NT-proBNP',
]

export const OUTPATIENT_IMAGING_ITEMS = [
  '常规心电图 (12导联)',
  '心脏彩色多普勒超声',
]

/** 全景档案滚出会话可视区后展示的 TODO（单条：开始问诊 / 刷新） */
export const OUTPATIENT_PANORAMA_SESSION_TODOS = [
  {
    id: 'todo_panorama_profile',
    title: '患者全景档案',
    subtitle: '档案已生成，可继续问诊或刷新',
    urgency: 'normal',
    primaryAction: { label: '开始问诊', key: 'start-consultation' },
    secondaryAction: { label: '刷新', key: 'refresh' },
    persistOnAction: true,
  },
]

/** 血脂全套纸质报告详情（弹窗展示，版式参考检验报告单） */
export const LIPID_LAB_REPORT_DETAIL = {
  id: 'lipid-panel',
  pageLabel: '第1页，共1页',
  categoryLabel: '血脂全套',
  hospitalName: 'XX大学人民医院',
  hospitalNameEn: "XX University People's Hospital Laboratory Report",
  qrPayload: 'report-lipid:202603150886',
  sampleTime: '2026-03-15 08:20',
  specimenNo: 'L2026031500186',
  serialNo: '202603150886',
  department: '心血管内科',
  clinicalDiagnosis: '高血压、高脂血症',
  ward: '门诊',
  bedNo: '—',
  executionDept: '检验科',
  specimenType: '静脉血',
  requestingDoctor: '陈主任',
  instrument: '罗氏 Cobas 8000',
  sampleLocation: '门诊采血室',
  tester: '王检验',
  reviewer: '李审核',
  times: {
    requested: '2026-03-15 07:50',
    sampled: '2026-03-15 08:20',
    received: '2026-03-15 09:05',
    reported: '2026-03-15 11:30',
  },
  notes: [
    '注1：标记「*」为异常结果，需结合临床判断。',
    '注2：本报告仅对送检标本负责；参考区间受年龄、性别及检测方法影响。',
  ],
  address: '北京市西城区西直门南大街11号 · 咨询电话：010-88326666',
  items: [
    {
      no: 1,
      name: '总胆固醇(TC)',
      result: '4.85',
      unit: 'mmol/L',
      refRange: '<5.2',
      judgment: '正常',
      tone: 'normal',
    },
    {
      no: 2,
      name: '甘油三酯(TG)',
      result: '2.10',
      unit: 'mmol/L',
      refRange: '<1.7',
      judgment: '偏高',
      tone: 'high',
    },
    {
      no: 3,
      name: '低密度脂蛋白胆固醇(LDL-C)',
      result: '1.53',
      unit: 'mmol/L',
      refRange: '<3.4',
      judgment: '偏低?',
      tone: 'low',
      emphasis: true,
    },
    {
      no: 4,
      name: '高密度脂蛋白胆固醇(HDL-C)',
      result: '1.02',
      unit: 'mmol/L',
      refRange: '>1.0',
      judgment: '正常',
      tone: 'normal',
    },
    {
      no: 5,
      name: '脂蛋白(a) [Lp(a)]',
      result: '25',
      unit: 'mg/dL',
      refRange: '<30',
      judgment: '正常',
      tone: 'normal',
    },
  ],
}

/** 动态心电图及心率变异性分析报告详情（版式参考 Holter 报告单） */
export const ECG_HOLTER_REPORT_DETAIL = {
  id: 'ecg-holter',
  hospitalName: 'XX大学人民医院',
  reportTitle: '动态心电图及心率变异性分析报告',
  department: '心血管内科',
  reportDate: '2026-03-15',
  startTime: '08:00:00',
  effectiveDuration: '24:00:00',
  heartRate: {
    average: 62,
    minimum: { value: 48, at: '2026-03-15 02:58:46' },
    maximum: { value: 114, at: '2026-03-15 10:27:10' },
    totalBeats: 81528,
    abnormalBeats: 9602,
    abnormalPermille: 118,
  },
  pause: {
    rrOver2000Count: 0,
  },
  sve: {
    total: 8607,
    single: 5280,
    pairs: { episodes: 40, beats: 80 },
    bigeminy: 0,
    trigeminy: 0,
    svt: { episodes: 3, beats: 10, durationSec: 4.63 },
    permille: 106,
    maxPerMinute: 0,
  },
  ve: {
    total: 995,
    single: 946,
    pairs: { episodes: 5, beats: 10 },
    bigeminy: 0,
    trigeminy: 0,
    vt: { episodes: 0, beats: 0 },
    permille: 12,
    maxPerMinute: 0,
  },
  hrvTime: {
    sdnn: 107.94,
    sdann: 0,
    rmssd: 0,
    pnn50: 0,
    cv: 0,
    sdnnRef: '141±39',
  },
  hrvFreq: {
    totalPower: 0,
    ulf: 0,
    vlf: 0,
    lf: 0,
    hf: 0,
  },
  conclusions: [
    '基础心律为窦性心律。',
    '房性早搏：频发，可见单发及成对出现；短阵性室上性心动过速，共检出3阵，持续10次，历时4.63秒。',
    '室性早搏：可见单发及成对出现。',
    'ST-T：ST段轻度改变。',
    '心率变异性：SDNN 107.94 ms，低于正常范围（141±39 ms）。',
  ],
  operators: {
    operator: '—',
    reporter: '—',
    reviewer: '—',
  },
}

const LAB_REPORT_DETAIL_REGISTRY = {
  'lipid-panel': LIPID_LAB_REPORT_DETAIL,
}

const EXAM_REPORT_DETAIL_REGISTRY = {
  'ecg-holter': ECG_HOLTER_REPORT_DETAIL,
}

/** @param {string | undefined} labDetailId */
export function getLabReportDetail(labDetailId) {
  if (!labDetailId) return null
  return LAB_REPORT_DETAIL_REGISTRY[labDetailId] ?? null
}

/** @param {string | undefined} examDetailId */
export function getExamReportDetail(examDetailId) {
  if (!examDetailId) return null
  return EXAM_REPORT_DETAIL_REGISTRY[examDetailId] ?? null
}

function shortLabItemName(name) {
  const paren = String(name).match(/\(([^)]+)\)/)
  if (paren) return paren[1]
  const bracket = String(name).match(/\[([^\]]+)\]/)
  if (bracket) return bracket[1]
  return name
}

const LAB_ABNORMAL_ARROW = { high: '↑', low: '↓' }

/** 根据检验报告明细生成左侧卡片异常摘要（与报告表内数据一致） */
export function formatLabReportAbnormalSummary(detail) {
  if (!detail?.items?.length) return ''
  const parts = detail.items
    .filter((item) => item.tone === 'high' || item.tone === 'low')
    .map((item) => {
      const arrow = LAB_ABNORMAL_ARROW[item.tone] ?? ''
      return `${shortLabItemName(item.name)} ${item.result} ${item.unit} (${arrow})`
    })
  return parts.join('；')
}

/** 列表展示用摘要：有检验明细时以明细为准 */
export function getReportDisplaySummary(report) {
  const detail = getLabReportDetail(report?.labDetailId)
  if (detail) {
    const fromItems = formatLabReportAbnormalSummary(detail)
    if (fromItems) return fromItems
  }
  return report?.abnormalSummary ?? report?.summary ?? ''
}
