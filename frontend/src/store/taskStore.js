import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { INITIAL_GLOBAL_TASKS } from '../data/constants'
import { APPROVAL_LIST } from '../data/portalData'

export const useTaskStore = defineStore('task', () => {
  const globalTasks = ref(INITIAL_GLOBAL_TASKS)
  const activeTaskId = ref(null)
  const pendingOmniInput = ref('')

  const plans = ref([])
  const isPlanLoading = ref(false)
  const pendingApprovals = ref([...APPROVAL_LIST])
  const approvalDetailId = ref(null)
  const portalToast = ref(null)

  let planStatusTimer = null
  let portalToastTimer = null

  const approvalDetail = computed(() =>
    pendingApprovals.value.find((a) => a.id === approvalDetailId.value) ?? null
  )

  const activeTask = computed(
    () => globalTasks.value.find((t) => t.id === activeTaskId.value) ?? null
  )

  const completeTask = (taskId) => {
    const taskIndex = globalTasks.value.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      globalTasks.value[taskIndex].status = 'completed'
    }
    message.success('任务已完成，双端数据已实时同步。', 2.6)
  }

  const startWork = (taskId) => {
    if (typeof taskId === 'string') {
      activeTaskId.value = taskId
    } else {
      const firstPending = globalTasks.value.find((t) => t.status !== 'completed')
      activeTaskId.value = firstPending ? firstPending.id : null
    }
  }

  const clearActiveWork = () => {
    activeTaskId.value = null
    pendingOmniInput.value = ''
  }

  const showPortalToast = (msg, tone = 'success') => {
    portalToast.value = { message: msg, tone }
    if (portalToastTimer) clearTimeout(portalToastTimer)
    portalToastTimer = setTimeout(() => {
      portalToast.value = null
      portalToastTimer = null
    }, 2600)
  }

  const handleCommandSubmit = (commandText, files) => {
    const trimmed = commandText?.trim()
    if (!trimmed && !files?.length) return

    if (planStatusTimer) clearTimeout(planStatusTimer)
    isPlanLoading.value = true
    planStatusTimer = setTimeout(() => {
      plans.value.push({
        id: `plan_${Date.now()}`,
        scheduleTime: '明天 10:00',
        scheduleDateTime: 'tomorrow-10:00',
        statusLabel: '筹备中',
        title: '14床 周杰 · 治疗方案讨论',
        activeTask: 'Agent 正在整理患者全维度资料...',
      })
      isPlanLoading.value = false
      planStatusTimer = null
    }, 1600)
  }

  const handleApprovalAction = (id, action) => {
    const item = pendingApprovals.value.find((a) => a.id === id)
    if (!item) return
    pendingApprovals.value = pendingApprovals.value.filter((a) => a.id !== id)
    if (approvalDetailId.value === id) approvalDetailId.value = null
    if (action === 'approve') {
      showPortalToast(`已通过：${item.title}`)
    } else {
      showPortalToast(`已打回：${item.title}`, 'warn')
    }
  }

  const openApprovalDetail = (id) => {
    approvalDetailId.value = id
  }

  const closeApprovalDetail = () => {
    approvalDetailId.value = null
  }

  const adoptApprovalSuggestion = (id) => {
    const item = pendingApprovals.value.find((a) => a.id === id)
    if (!item) return
    pendingApprovals.value = pendingApprovals.value.filter((a) => a.id !== id)
    if (approvalDetailId.value === id) approvalDetailId.value = null
    showPortalToast(`已采纳分身建议：${item.title}`)
  }

  return {
    globalTasks,
    activeTaskId,
    activeTask,
    pendingOmniInput,
    plans,
    isPlanLoading,
    pendingApprovals,
    approvalDetailId,
    approvalDetail,
    portalToast,
    completeTask,
    startWork,
    clearActiveWork,
    showPortalToast,
    handleCommandSubmit,
    handleApprovalAction,
    openApprovalDetail,
    closeApprovalDetail,
    adoptApprovalSuggestion,
  }
})
