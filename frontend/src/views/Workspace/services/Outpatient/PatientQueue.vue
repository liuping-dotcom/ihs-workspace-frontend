<template>
  <div class="space-y-3" role="list" aria-label="特需门诊患者队列">
    <article
      v-for="patient in patients"
      :key="patient.taskId"
      role="button"
      tabindex="0"
      class="outpatient-queue-card glass-card cursor-pointer p-3.5"
      :class="cardClass(patient.taskId)"
      @click="emit('select', patient.taskId)"
      @keydown.enter.prevent="emit('select', patient.taskId)"
      @keydown.space.prevent="emit('select', patient.taskId)"
    >
      <header class="flex items-start justify-between gap-2">
        <h3 class="truncate text-base font-semibold text-slate-800">
          【{{ patient.queueNo }}】 {{ patient.name }}
        </h3>
        <span class="outpatient-queue-status" :class="statusBadgeClass(patient.taskId)">
          {{ displayStatus(patient) }}
        </span>
      </header>

      <p class="mt-0.5 text-xs text-gray-500">
        {{ patient.gender }} · {{ patient.age }}岁 · {{ patient.visitType }}
      </p>

      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-700">
        <ThunderboltOutlined class="mr-1 inline shrink-0 text-blue-500" aria-hidden />
        <span class="font-medium text-gray-600">主诉：</span>
        {{ patient.chiefComplaint }}
      </p>

      <div
        v-if="patient.criticalValue"
        class="mt-2 flex items-center gap-1 rounded bg-red-50 px-2 py-1.5 text-xs text-red-600"
      >
        <WarningOutlined class="shrink-0" aria-hidden />
        <span class="line-clamp-1">{{ patient.criticalValue }}</span>
      </div>

      <p v-if="patient.lastMessage" class="mt-2 flex items-center gap-1 text-xs text-gray-400">
        <ClockCircleOutlined class="shrink-0" aria-hidden />
        <span class="line-clamp-1">{{ patient.lastMessage }}</span>
      </p>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ThunderboltOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { OUTPATIENT_PATIENT_QUEUE } from '../../../../data/outpatientData.js'

const props = defineProps({
  patients: {
    type: Array,
    default: () => OUTPATIENT_PATIENT_QUEUE,
  },
  activeTaskId: {
    type: String,
    default: null,
  },
  completedTaskIds: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])

const completedSet = computed(() => new Set(props.completedTaskIds))

function displayStatus(patient) {
  if (completedSet.value.has(patient.taskId)) return '已就诊'
  if (props.activeTaskId === patient.taskId) return '就诊中'
  return patient.status
}

function statusBadgeClass(taskId) {
  const patient = props.patients.find((p) => p.taskId === taskId)
  const status = patient ? displayStatus(patient) : '未就诊'
  const map = {
    未就诊: 'outpatient-queue-status-idle',
    就诊中: 'outpatient-queue-status-active',
    待回诊: 'outpatient-queue-status-followup',
    已就诊: 'outpatient-queue-status-done',
  }
  return map[status] ?? map['未就诊']
}

function cardClass(taskId) {
  const isActive = props.activeTaskId === taskId
  const isCompleted = completedSet.value.has(taskId)
  if (isActive) return 'outpatient-queue-card-active'
  if (isCompleted) return 'outpatient-queue-card-done'
  return ''
}
</script>
