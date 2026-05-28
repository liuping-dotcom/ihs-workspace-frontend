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
    chiefComplaint: '反复头痛伴右侧肢体麻木 1 周，近 2 日加重。',
    lastMessage: '预问诊语音结构化已完成（20分钟前）',
    patientLabels: ['初诊', '市医保', '脑卒中'],
  },
  {
    taskId: 'task_outpatient_vip_p2',
    queueNo: '002',
    name: '孙丽',
    gender: '女',
    age: 72,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint: '进行性记忆力减退 6 月，伴性格改变、定向力下降。',
    lastMessage: '外院头颅 MRI 报告已回传（45分钟前）',
    patientLabels: ['初诊', '市医保', '阿尔茨海默病'],
  },
  {
    taskId: 'task_outpatient_vip_p3',
    queueNo: '003',
    name: '李峰',
    gender: '男',
    age: 65,
    visitType: '复诊',
    status: '待回诊',
    chiefComplaint:
      '急性脑梗死静脉溶栓后 3 月复诊，近 1 周右侧肢体无力加重，偶有饮水呛咳。',
    criticalValue: 'NIHSS 评分 6 分（↑ 较上次）',
    lastMessage: '神经功能评估问卷已提交（1小时前）',
    patientLabels: ['复诊', '市医保', '脑卒中'],
  },
  {
    taskId: 'task_outpatient_vip_p4',
    queueNo: '004',
    name: '王建华',
    gender: '男',
    age: 61,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint: '反复眩晕伴行走不稳 2 月，转头时加重，无耳鸣及听力下降。',
    criticalValue: '颈动脉超声：左侧斑块不稳定（↑）',
    lastMessage: '颈动脉超声报告 OCR 已入库（30分钟前）',
    patientLabels: ['初诊', '市医保', '脑卒中'],
  },
  {
    taskId: 'task_outpatient_vip_p5',
    queueNo: '005',
    name: '陈敏',
    gender: '女',
    age: 48,
    visitType: '初诊',
    status: '未就诊',
    chiefComplaint: '反复偏头痛 10 余年，近 2 周发作频率增加，伴畏光、恶心。',
    criticalValue: '脑电图：颞区棘慢波（↑）',
    lastMessage: '头痛日记已同步（25分钟前）',
    patientLabels: ['初诊', '市医保', '偏头痛'],
  },
  {
    taskId: 'task_outpatient_vip_p6',
    queueNo: '006',
    name: '杨波',
    gender: '男',
    age: 34,
    visitType: '初诊',
    status: '已就诊',
    chiefComplaint: '肢体抽搐发作 3 天，伴短暂意识丧失，发作后嗜睡约 30 分钟。',
    lastMessage: '医嘱已确认（1小时前）',
    patientLabels: ['初诊', '市医保', '癫痫'],
  },
  {
    taskId: 'task_outpatient_vip_p7',
    queueNo: '007',
    name: '黄梅',
    gender: '女',
    age: 68,
    visitType: '复诊',
    status: '未就诊',
    chiefComplaint: '帕金森病随访，近 1 周静止性震颤加重，起步困难明显。',
    criticalValue: '左旋多巴血药浓度偏低（↓）',
    lastMessage: '居家运动监测数据已上传（40分钟前）',
    patientLabels: ['复诊', '市医保', '帕金森病'],
  },
  {
    taskId: 'task_outpatient_vip_p8',
    queueNo: '008',
    name: '林涛',
    gender: '男',
    age: 55,
    visitType: '复诊',
    status: '未就诊',
    chiefComplaint: '脑梗死后 6 月复查，无新发抽搐，希望评估能否减停部分药物。',
    lastMessage: '用药清单已核对（15分钟前）',
    patientLabels: ['复诊', '市医保', '脑卒中'],
  },
]

/** 队列患者顶栏扩展信息（身份证号、手机、过敏史、诊断） */
export const OUTPATIENT_PATIENT_HEADER_META = {
  task_outpatient: {
    idCard: '330102196705****1234',
    phone: '138****5678',
    allergy: '无',
    diagnosis: '急性脑梗死？；高血压病',
  },
  task_outpatient_vip_p2: {
    idCard: '330102195305****5678',
    phone: '139****1234',
    allergy: '无',
    diagnosis: '阿尔茨海默病待查',
  },
  task_outpatient_vip_p3: {
    idCard: '330102196005****9012',
    phone: '137****8899',
    allergy: '无',
    diagnosis: '脑梗死（溶栓后）',
  },
  task_outpatient_vip_p4: {
    idCard: '330102196405****3456',
    phone: '136****5566',
    allergy: '磺胺类',
    diagnosis: '后循环缺血；颈动脉斑块',
  },
  task_outpatient_vip_p5: {
    idCard: '330102197805****7890',
    phone: '135****7788',
    allergy: '青霉素',
    diagnosis: '偏头痛；癫痫待排',
  },
  task_outpatient_vip_p6: {
    idCard: '330102199105****2345',
    phone: '133****9900',
    allergy: '无',
    diagnosis: '癫痫',
  },
  task_outpatient_vip_p7: {
    idCard: '330102195805****6789',
    phone: '132****1122',
    allergy: '无',
    diagnosis: '帕金森病',
  },
  task_outpatient_vip_p8: {
    idCard: '330102197105****4567',
    phone: '131****3344',
    allergy: '无',
    diagnosis: '脑梗死（恢复期）',
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
  patientLabels: ['初诊', '市医保', '脑卒中'],
  queueNo: '001',
  outpatientNo: '20260514003',
  idCard: '330102196705****1234',
  phone: '138****5678',
  allergy: '无',
  diagnosis: '急性脑梗死？；高血压病',
  vitals: {
    temperature: '36.5',
    heartRate: '78',
    respiration: '18',
    bloodPressure: '158/92',
    weight: '72',
  },
  preConsultation: {
    chiefComplaint: '反复头痛伴右侧肢体麻木 1 周，近 2 日加重。',
    presentIllness:
      '近 1 周反复枕部胀痛，伴右侧上肢麻木无力，持物不稳；昨日出现行走偏斜，无抽搐、无意识丧失，无言语不清及视物重影；发病来精神可，睡眠欠佳。',
    pastHistory: '高血压病 10 年，高脂血症 5 年；吸烟史 20 年，已戒烟 2 年；偶饮酒。',
    familyHistory: '父亲有脑卒中史，母亲有高血压史。',
    allergyHistory: '无',
  },
  reports: [
    {
      id: 'report-csf',
      title: '腰穿脑脊液检查（本院）',
      date: '2026-03-15',
      category: 'lab',
      abnormalSummary: '蛋白 0.68 g/L (↑)；白细胞 12×10⁶/L (↑)',
      abnormal: true,
      labDetailId: 'csf-panel',
    },
    {
      id: 'report-mri',
      title: '头颅 MRI 平扫+DWI（本院）',
      date: '2026-03-15',
      category: 'exam',
      abnormalSummary:
        '1.左侧额顶叶急性脑梗死灶 2.脑白质疏松 3.轻度脑萎缩 4.未见明显出血灶',
      abnormal: true,
      examDetailId: 'brain-mri',
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
        '1.短暂性脑缺血发作；2.高血压病 2 级；3.高脂血症；4.颈动脉粥样硬化',
      department: '神经内科',
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
      { date: '04-27', systolic: 148, diastolic: 90 },
      { date: '04-30', systolic: 152, diastolic: 94 },
      { date: '05-03', systolic: 156, diastolic: 96 },
      { date: '05-06', systolic: 154, diastolic: 92 },
      { date: '05-09', systolic: 160, diastolic: 98 },
      { date: '05-12', systolic: 158, diastolic: 94 },
      { date: '05-15', systolic: 162, diastolic: 100 },
      { date: '05-18', systolic: 159, diastolic: 96 },
      { date: '05-21', systolic: 161, diastolic: 98 },
      { date: '05-24', systolic: 158, diastolic: 92 },
    ],
  },
  lipidTrend: {
    sourceLabel: '年度随访 · 近 5 年同型半胱氨酸',
    unit: 'μmol/L',
    target: 15,
    abnormal: true,
    points: [
      { label: '2021', value: 12.8 },
      { label: '2022', value: 14.2 },
      { label: '2023', value: 15.6 },
      { label: '2024', value: 16.9 },
      { label: '2025', value: 18.2 },
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
      name: '硫酸氢氯吡格雷片',
      spec: '75mg',
      frequency: '每日 1 次 · 晨服',
      indication: '脑梗死二级预防',
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
      name: '左乙拉西坦片',
      spec: '500mg',
      frequency: '每日 2 次',
      indication: '癫痫预防',
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
    department: '神经内科',
    patientName: '赵强',
    chiefComplaint: '反复头晕伴行走不稳 1 个月，近 1 周右侧肢体麻木加重。',
    presentIllness:
      '患者 1 月来反复头晕，与体位改变相关，伴行走不稳；近 1 周出现右侧肢体麻木无力，持物不稳，无抽搐及意识丧失，无言语含糊；外院颈动脉超声提示双侧斑块形成，今至我院进一步诊治。',
    pastHistory: '高血压病 10 年；高脂血症 5 年，未规律服用降脂药物。',
    allergyHistory: '无',
    physicalExamLine:
      '体温：36.6℃、脉搏/心率：76 次/分、呼吸频率：18/分、血压：156/94 mmHg、血氧饱和度：98%。神志清，构音清晰。右侧上肢肌力 4+ 级，下肢 4 级；左侧肢体肌力 5 级。双侧病理征未引出，共济运动右侧欠佳。',
    auxiliaryExamLabel: '辅助检查',
    auxiliaryExamText:
      '头颅 MRI（外院）：脑白质疏松；颈动脉超声：双侧颈动脉内膜增厚伴斑块。脑电图：未见明显痫样放电。',
    diagnosisLabel: '初步诊断',
    outpatientDiagnosis:
      '1.短暂性脑缺血发作；2.高血压病 2 级；3.高脂血症；4.颈动脉粥样硬化',
    treatmentPlanLabel: '处置',
    treatmentPlan: `检查/检验
1. 头颅 MRI 平扫+DWI
2. 腰穿脑脊液检查
3. 颈动脉超声
药品
1. 氯沙坦钾片 50mg 口服 1次/日 28天
2. 阿托伐他汀钙片 20mg 口服 1次/日 28天
3. 硫酸氢氯吡格雷片 75mg 口服 1次/日 28天`,
    precautions:
      '低盐低脂饮食，戒烟限酒，避免情绪激动与过度疲劳。若出现突发剧烈头痛、言语不清、一侧肢体无力加重或抽搐发作，请立即急诊就医；1 个月后门诊复查血压、血脂及头颅 MRI。',
  },
  'visit-2': {
    visitId: 'visit-2',
    title: '历史就诊病历',
    visitDate: '2025-11-06 14:05',
    hospital: '市第一人民医院',
    department: '神经内科门诊',
    patientName: '赵强',
    chiefComplaint: '反复头痛 1 月余，伴右侧肢体麻木，无抽搐。',
    presentIllness:
      '患者 1 月来反复枕部胀痛，伴右侧肢体麻木，无晕厥及意识丧失；外院头颅 CT 未见出血，MRI 提示脑白质疏松；颈动脉超声提示左侧斑块，今至我院进一步诊治。',
    pastHistory: '高血压病史 4 年，血压控制欠佳；否认糖尿病。吸烟史 20 年，已戒烟 2 年。',
    allergyHistory: '无',
    vitals: {
      temperature: '36.4',
      heartRate: '76',
      respiration: '19',
      bloodPressure: '154/90',
    },
    auxiliaryExamText:
      '头颅 MRI（外院，2025-11-01）：脑白质疏松，未见急性梗死灶。颈动脉超声（2025-11-05）：左侧颈动脉斑块形成。同型半胱氨酸 16.8 μmol/L（↑）。',
    outpatientDiagnosis: '头痛待查；脑白质疏松；高血压病 2 级',
    treatmentPlan:
      '1、阿托伐他汀钙片 20mg 口服 QN 28天\n2、苯磺酸氨氯地平片 5mg 口服 QD 28天\n3、硫酸氢氯吡格雷片 75mg 口服 QD 28天',
    precautions:
      '完善头颅 MRI、脑电图；控制血压血脂；若出现突发偏瘫、言语不清或抽搐，立即急诊就诊；已预约颈动脉超声复查。',
  },
  'visit-3': {
    visitId: 'visit-3',
    title: '历史就诊病历',
    visitDate: '2025-06-12 08:40',
    hospital: '社区卫生服务中心',
    department: '全科医学科',
    patientName: '赵强',
    chiefComplaint: '发现血压升高 3 月，伴头晕、偶有肢体麻木。',
    presentIllness:
      '患者 3 月来多次测血压偏高，最高 162/98 mmHg，伴头晕及偶发右侧肢体麻木，无抽搐、无意识丧失，未规律服药，为评估及用药指导来诊。',
    pastHistory: '否认脑卒中、糖尿病；父亲有脑卒中、高血压史。',
    allergyHistory: '无',
    vitals: {
      temperature: '36.5',
      heartRate: '80',
      respiration: '18',
      bloodPressure: '158/94',
    },
    auxiliaryExamText:
      '血常规、生化初筛（2025-06-10）：空腹血糖 5.4 mmol/L；肾功能正常；同型半胱氨酸 15.2 μmol/L（↑）。',
    outpatientDiagnosis: '高血压病 2 级',
    treatmentPlan:
      '1、苯磺酸氨氯地平片 5mg 口服 QD 7天\n2、健康生活方式指导，家庭血压监测',
    precautions:
      '低盐饮食，控制体重，戒烟限酒；每日监测血压并记录；2 周复测血压，效果不佳转诊神经内科进一步评估。',
  },
}

export function getVisitRecordById(visitId) {
  return OUTPATIENT_VISIT_RECORDS[visitId] ?? null
}

/** 首诊实时语音问诊剧本 */
export const DEFAULT_CONSULTATION_SCRIPT = [
  {
    role: 'doctor',
    text: '赵先生您好。头痛和右边肢体麻木这一周加重了吗？有没有说话不清楚或者视物重影？',
  },
  {
    role: 'patient',
    text: '张主任，右边胳膊使不上劲，说话倒是还清楚，就是头胀得厉害。',
  },
  { role: 'doctor', text: '抗血小板药有按时吃吗？' },
  {
    role: 'patient',
    text: '氯吡格雷吃完一星期了，最近家里事忙，就没去配。',
  },
]

/** 回诊语音剧本 */
export const CONSULTATION_FOLLOWUP_SCRIPT = [
  {
    role: 'doctor',
    text: '赵先生，刚看了你的头颅 MRI 和脑脊液结果，DWI 上提示急性期脑梗死灶，需要高度重视。',
  },
  {
    role: 'patient',
    text: '张主任，那严重吗？我现在右手还是发麻，走路也有点偏。',
  },
  {
    role: 'doctor',
    text: '发病仍在静脉溶栓时间窗内，建议立即住院并启动溶栓评估；同时把血压控制在合理范围，抗血小板药不能停。',
  },
  { role: 'patient', text: '行，听您的，我这就去办住院。' },
]

export const OUTPATIENT_LAB_ITEMS = [
  '腰穿脑脊液常规+生化',
  '抗癫痫药物血药浓度监测',
  'D-二聚体',
]

export const OUTPATIENT_IMAGING_ITEMS = [
  '头颅 MRI 平扫+DWI',
  '脑电图 (EEG)',
  '颈动脉超声',
  '肌电图 (EMG)',
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

/** 腰穿脑脊液检查报告详情（弹窗展示，版式参考检验报告单） */
export const LIPID_LAB_REPORT_DETAIL = {
  id: 'csf-panel',
  pageLabel: '第1页，共1页',
  categoryLabel: '腰穿脑脊液检查',
  hospitalName: 'XX大学人民医院',
  hospitalNameEn: "XX University People's Hospital Laboratory Report",
  qrPayload: 'report-csf:202603150886',
  sampleTime: '2026-03-15 09:10',
  specimenNo: 'C2026031500286',
  serialNo: '202603150992',
  department: '神经内科',
  clinicalDiagnosis: '急性脑梗死？；高血压病',
  ward: '门诊',
  bedNo: '—',
  executionDept: '检验科',
  specimenType: '脑脊液',
  requestingDoctor: '张主任',
  instrument: '罗氏 Cobas 8000',
  sampleLocation: '神经内科门诊穿刺室',
  tester: '王检验',
  reviewer: '李审核',
  times: {
    requested: '2026-03-15 08:40',
    sampled: '2026-03-15 09:10',
    received: '2026-03-15 09:35',
    reported: '2026-03-15 11:20',
  },
  notes: [
    '注1：标记「*」为异常结果，需结合临床判断。',
    '注2：本报告仅对送检标本负责；脑脊液结果需结合细胞学及影像学综合判读。',
  ],
  address: '北京市西城区西直门南大街11号 · 咨询电话：010-88326666',
  items: [
    {
      no: 1,
      name: '脑脊液压力(CSF-P)',
      result: '185',
      unit: 'mmH₂O',
      refRange: '80～180',
      judgment: '偏高',
      tone: 'high',
    },
    {
      no: 2,
      name: '白细胞计数(WBC)',
      result: '12',
      unit: '×10⁶/L',
      refRange: '0～8',
      judgment: '偏高',
      tone: 'high',
    },
    {
      no: 3,
      name: '蛋白(CSF-Pro)',
      result: '0.68',
      unit: 'g/L',
      refRange: '0.15～0.45',
      judgment: '偏高',
      tone: 'high',
      emphasis: true,
    },
    {
      no: 4,
      name: '葡萄糖(CSF-Glu)',
      result: '3.8',
      unit: 'mmol/L',
      refRange: '2.5～4.5',
      judgment: '正常',
      tone: 'normal',
    },
    {
      no: 5,
      name: '氯化物(CSF-Cl)',
      result: '128',
      unit: 'mmol/L',
      refRange: '120～130',
      judgment: '正常',
      tone: 'normal',
    },
  ],
}

/** 头颅 MRI 检查报告详情（复用 Holter 报告版式字段结构） */
export const ECG_HOLTER_REPORT_DETAIL = {
  id: 'brain-mri',
  hospitalName: 'XX大学人民医院',
  reportTitle: '头颅 MRI 平扫+DWI 检查报告',
  department: '神经内科',
  reportDate: '2026-03-15',
  startTime: '08:30:00',
  effectiveDuration: '扫描完成',
  heartRate: {
    average: 0,
    minimum: { value: 0, at: '—' },
    maximum: { value: 0, at: '—' },
    totalBeats: 0,
    abnormalBeats: 0,
    abnormalPermille: 0,
  },
  pause: {
    rrOver2000Count: 0,
  },
  sve: {
    total: 0,
    single: 0,
    pairs: { episodes: 0, beats: 0 },
    bigeminy: 0,
    trigeminy: 0,
    svt: { episodes: 0, beats: 0, durationSec: 0 },
    permille: 0,
    maxPerMinute: 0,
  },
  ve: {
    total: 0,
    single: 0,
    pairs: { episodes: 0, beats: 0 },
    bigeminy: 0,
    trigeminy: 0,
    vt: { episodes: 0, beats: 0 },
    permille: 0,
    maxPerMinute: 0,
  },
  hrvTime: {
    sdnn: 0,
    sdann: 0,
    rmssd: 0,
    pnn50: 0,
    cv: 0,
    sdnnRef: '—',
  },
  hrvFreq: {
    totalPower: 0,
    ulf: 0,
    vlf: 0,
    lf: 0,
    hf: 0,
  },
  conclusions: [
    '左侧额顶叶 DWI 高信号灶，考虑急性脑梗死。',
    '脑白质疏松（Fazekas 2 级）。',
    '轻度脑萎缩，脑沟略增宽。',
    '未见明显脑出血及占位性病变。',
    '建议结合临床及脑脊液结果，评估静脉溶栓指征。',
  ],
  operators: {
    operator: '王影像',
    reporter: '李报告',
    reviewer: '张审核',
  },
}

const LAB_REPORT_DETAIL_REGISTRY = {
  'csf-panel': LIPID_LAB_REPORT_DETAIL,
  'lipid-panel': LIPID_LAB_REPORT_DETAIL,
}

const EXAM_REPORT_DETAIL_REGISTRY = {
  'brain-mri': ECG_HOLTER_REPORT_DETAIL,
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
