<template>
  <component :is="agentComponent" v-if="agentComponent" />
  <div
    v-else
    class="ambient-bg flex h-screen flex-col items-center justify-center gap-4 px-6 text-center font-sans text-slate-800"
  >
    <p class="text-sm text-slate-500">{{ placeholderMessage }}</p>
    <button type="button" class="glass-btn-primary" @click="goPortal">返回 Portal</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../../store/taskStore.js'
import { OUTPATIENT_PATIENT_QUEUE } from '../../data/outpatientData.js'
import OutpatientAgent from './services/Outpatient/index.vue'

/** 任务类型 → 独立 My Agent 组件（后续各 Agent 在 services/ 下独立研发） */
const AGENT_REGISTRY = {
  outpatient: OutpatientAgent,
  vip_clinic: OutpatientAgent,
}

const taskStore = useTaskStore()
const router = useRouter()

const activeTask = computed(() => taskStore.activeTask)

const agentComponent = computed(() => {
  const type = activeTask.value?.type
  if (type && AGENT_REGISTRY[type]) return AGENT_REGISTRY[type]
  const inOutpatientQueue = OUTPATIENT_PATIENT_QUEUE.some(
    (p) => p.taskId === taskStore.activeTaskId
  )
  return inOutpatientQueue ? OutpatientAgent : null
})

const placeholderMessage = computed(() => {
  const title = activeTask.value?.title
  if (title) return `「${title}」工作台开发中，敬请期待。`
  return '请从 Portal 选择工作流进入对应的 My Agent。'
})

function goPortal() {
  taskStore.clearActiveWork()
  router.push({ name: 'Portal' })
}

onMounted(() => {
  if (!taskStore.activeTaskId) {
    router.replace({ name: 'Portal' })
  }
})
</script>
