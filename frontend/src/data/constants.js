/** 演示用全局任务（与 taskStore 联动） */
export const INITIAL_GLOBAL_TASKS = [
  {
    id: 'task_outpatient',
    type: 'outpatient',
    priority: 'high',
    persona: '【临床-知名专家】',
    title: '特需门诊首诊 (患者: 赵强)',
    agent: '预问诊 Agent',
    summary: '患者赵强因反复胸闷伴心悸 1 周就诊，AI 已跨域调取全景档案。',
    suggestion: '请点击进入工作舱开启首诊语音问诊。',
    status: 'pending',
    role: '门诊专家',
    time: '09:30',
    patient: '赵强 · 男 · 58岁',
    statusLabel: '高危史',
    visitType: '初诊',
    description: '演示重点：AI 跨院域病历调取与语音首诊。',
  },
]
