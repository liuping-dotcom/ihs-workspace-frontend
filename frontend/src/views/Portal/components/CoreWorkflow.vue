<template>
  <section
    class="glass-panel flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-4"
    aria-label="今日核心工作流"
  >
    <header class="approval-section-header">
      <div class="approval-section-header-title">
        <ApartmentOutlined class="shrink-0 text-lg leading-none text-blue-600" aria-hidden />
        <h3 class="m-0 text-lg font-bold leading-none tracking-wide text-slate-800">今日核心工作流</h3>
      </div>
      <span
        class="shrink-0 rounded-full border border-white/60 bg-white/40 px-2 py-0.5 text-[10px] font-bold leading-none text-slate-500 backdrop-blur-sm"
      >
        {{ workflowTasks.length }} 项
      </span>
    </header>

    <div class="custom-scrollbar mt-1 flex min-h-0 flex-1 flex-col overflow-y-auto pr-0.5">
      <a-list
        v-if="workflowTasks.length"
        :data-source="workflowTasks"
        :split="false"
        class="portal-workflow-list space-y-4 pb-1"
      >
        <template #renderItem="{ item: task }">
          <a-list-item class="!border-none !px-0 !py-0 mb-4">
            <!-- MDT 协作卡片 -->
            <article
              v-if="isMdtCard(task)"
              class="glass-card group relative flex flex-col overflow-hidden px-4 pt-4 pb-0 workflow-mdt-card"
            >
              <div class="workflow-mdt-accent" aria-hidden />

              <div class="mb-2 flex items-start justify-between gap-3 pl-0.5">
                <div class="flex min-w-0 flex-1 items-start gap-2">
                  <FundOutlined class="mt-0.5 shrink-0 text-lg text-violet-600" aria-hidden />
                  <div class="min-w-0 flex-1">
                    <h4 class="text-base font-semibold leading-snug text-slate-800">{{ task.title }}</h4>
                    <div class="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-500">
                      <span class="shrink-0 font-medium workflow-type-tag-mdt">{{ task.typeLabel }}</span>
                      <template v-if="task.timeSlot">
                        <span class="shrink-0 text-gray-300" aria-hidden>·</span>
                        <span class="inline-flex shrink-0 items-center gap-1 font-medium text-slate-600">
                          <ClockCircleOutlined class="shrink-0 text-slate-400" aria-hidden />
                          {{ task.timeSlot }}
                        </span>
                      </template>
                      <template v-if="task.location || task.consultationMode">
                        <span class="shrink-0 text-gray-300" aria-hidden>·</span>
                        <WorkflowLocationMeta :task="task" />
                      </template>
                    </div>
                  </div>
                </div>
                <span class="workflow-mdt-status-tag">
                  <ClockCircleOutlined aria-hidden />
                  {{ task.tagText ?? '待您裁定' }}
                </span>
              </div>

              <div v-if="task.patient" class="glass-subcard mb-3 px-3 py-2.5">
                <p class="text-sm font-medium text-slate-800">
                  {{ task.patient.name }}
                  <span class="font-normal text-slate-500"> · {{ task.patient.info }}</span>
                  <span class="text-slate-400"> · </span>
                  {{ task.patient.diagnosis }}
                </p>
                <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ task.patient.keyIssue }}</p>
              </div>

              <div v-if="task.progress?.steps?.length" class="workflow-mdt-stepper" aria-label="MDT 协作进度">
                <div class="flex min-w-max items-center">
                  <template v-for="(stepLabel, index) in task.progress.steps" :key="stepLabel">
                    <div class="flex shrink-0 items-center gap-1">
                      <ClockCircleOutlined
                        v-if="index + 1 === (task.progress.currentStep ?? 1)"
                        class="shrink-0 text-blue-600"
                        aria-hidden
                      />
                      <span
                        :class="
                          index + 1 === (task.progress.currentStep ?? 1)
                            ? 'workflow-mdt-step--current'
                            : 'workflow-mdt-step--idle'
                        "
                      >
                        {{ stepLabel }}
                      </span>
                    </div>
                    <div
                      v-if="index < task.progress.steps.length - 1"
                      class="workflow-mdt-step-divider"
                      aria-hidden
                    />
                  </template>
                </div>
              </div>

              <div class="workflow-mdt-insight">
                <div class="flex gap-2.5">
                  <ThunderboltOutlined class="mt-0.5 shrink-0 text-lg text-indigo-500" aria-hidden />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold tracking-wide text-blue-600/90">Agent 协作综述</p>
                    <p class="mt-1 text-sm leading-relaxed text-blue-900/85">{{ task.agentSummary }}</p>
                  </div>
                </div>
                <template v-if="task.departments?.length">
                  <div class="workflow-mdt-insight-divider" aria-hidden />
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="dept in task.departments"
                      :key="dept.name"
                      class="workflow-dept-badge"
                      :class="
                        dept.color === 'green' ? 'workflow-dept-badge--green' : 'workflow-dept-badge--yellow'
                      "
                    >
                      {{ dept.name }}
                      <CheckCircleOutlined
                        v-if="dept.status === '已提交'"
                        class="shrink-0 opacity-80"
                        aria-hidden
                      />
                      <ClockCircleOutlined v-else class="shrink-0 opacity-80" aria-hidden />
                    </span>
                  </div>
                </template>
              </div>

              <div class="workflow-card-footer">
                <button
                  type="button"
                  class="workflow-action-btn"
                  :class="actionBtnClass(task.type)"
                  @click="handleEnterWorkspace(task)"
                >
                  <span>{{ task.actionLabel ?? '进入工作舱' }}</span>
                  <RightOutlined class="opacity-90 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>

            <!-- Session 会话卡片 -->
            <article
              v-else-if="isSessionCard(task)"
              class="glass-card group relative flex flex-col overflow-hidden px-4 pt-4 pb-0"
            >
              <div class="mb-1.5 flex items-start justify-between gap-3">
                <div class="flex min-w-0 flex-1 items-start gap-2">
                  <component
                    :is="typeIconComponent(task.type)"
                    class="mt-0.5 shrink-0 text-lg text-slate-500"
                    aria-hidden
                  />
                  <h4 class="min-w-0 line-clamp-2 text-base font-semibold leading-snug text-slate-800">
                    {{ task.title }}
                  </h4>
                </div>
                <span v-if="task.queueStatLabel" class="glass-chip-stat">{{ task.queueStatLabel }}</span>
              </div>

              <div class="mb-2.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                <span
                  class="inline-flex shrink-0 items-center gap-1.5 font-medium"
                  :class="typeTagClass(task.type)"
                >
                  <component :is="typeIconComponent(task.type)" class="shrink-0" aria-hidden />
                  {{ task.typeLabel }}
                </span>
                <template v-if="task.timeSlot">
                  <span class="shrink-0 text-gray-300" aria-hidden>·</span>
                  <span class="inline-flex shrink-0 items-center gap-1 font-medium text-slate-600">
                    <ClockCircleOutlined class="shrink-0 text-slate-400" aria-hidden />
                    {{ task.timeSlot }}
                  </span>
                </template>
                <template v-if="task.location">
                  <span class="shrink-0 text-gray-300" aria-hidden>·</span>
                  <WorkflowLocationMeta :task="task" />
                </template>
              </div>

              <div class="glass-agent-insight">
                <component
                  :is="insightIconComponent(task.insightIcon)"
                  class="glass-agent-insight-icon"
                  aria-hidden
                />
                <div class="glass-agent-insight-content">
                  <p class="glass-agent-insight-label">AI 提前洞察</p>
                  <p class="glass-agent-insight-text">{{ task.agentSummary }}</p>
                </div>
              </div>

              <div v-if="task.patientQueue?.length" class="mt-3">
                <p class="mb-2 text-xs font-semibold tracking-wide text-slate-500">
                  队列预览 · 共 {{ queueCount(task) }} {{ queueUnit(task.type) }}
                </p>
                <div class="workflow-queue-scroll">
                  <div
                    v-for="patient in task.patientQueue"
                    :key="patient.id"
                    class="workflow-queue-chip"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="workflow-queue-identifier">
                        {{ formatQueueIdentifier(patient, identifierPrefix(task.type)) }}
                      </p>
                      <p class="workflow-queue-patient-name">{{ patient.name }}</p>
                      <span
                        class="workflow-queue-tone-tag"
                        :class="queueToneTagClass(patient.statusTone)"
                      >
                        <span
                          class="workflow-queue-tone-dot"
                          :class="queueToneDotClass(patient.statusTone)"
                          aria-hidden
                        />
                        {{ patient.statusLabel }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="workflow-card-footer">
                <button
                  type="button"
                  class="workflow-action-btn"
                  :class="actionBtnClass(task.type)"
                  @click="handleEnterWorkspace(task)"
                >
                  <span>{{ task.actionLabel ?? '进入工作舱' }}</span>
                  <RightOutlined class="opacity-90 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          </a-list-item>
        </template>
      </a-list>
      <p v-else class="py-10 text-center text-xs text-slate-400">暂无核心临床任务</p>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ApartmentOutlined,
  MedicineBoxOutlined,
  CrownOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DesktopOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ContainerOutlined,
  FundOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue'
import { useTaskStore } from '../../../store/taskStore.js'
import { WORKFLOW_TASKS } from '../../../data/portalData.js'

const router = useRouter()
const taskStore = useTaskStore()

const workflowTasks = WORKFLOW_TASKS

const SESSION_IDENTIFIER_PREFIX = {
  vip_clinic: '排号',
  surgical_schedule: '台次',
}

const SESSION_QUEUE_UNIT = {
  surgical_schedule: '台',
}

const WorkflowLocationMeta = {
  props: {
    task: { type: Object, required: true },
  },
  setup(props) {
    return () => {
      const { task } = props
      if (task.type === 'mdt') {
        const isOnline = task.consultationMode === 'online'
        return h(
          'span',
          { class: 'inline-flex min-w-0 items-center gap-1 text-sm font-medium text-slate-600' },
          [
            isOnline
              ? h(DesktopOutlined, { class: 'shrink-0 text-indigo-500' })
              : h(EnvironmentOutlined, { class: 'shrink-0 text-rose-500' }),
            h(
              'span',
              { class: 'truncate' },
              isOnline ? '线上会诊' : `线下会诊 · ${task.location ?? '待定'}`
            ),
          ]
        )
      }
      if (!task.location) return null
      return h(
        'span',
        { class: 'inline-flex min-w-0 items-center gap-1 text-sm font-medium text-slate-600' },
        [
          h(EnvironmentOutlined, { class: 'shrink-0 text-slate-400' }),
          h('span', { class: 'truncate' }, task.location),
        ]
      )
    }
  },
}

function isMdtCard(task) {
  return task.type === 'mdt' && task.patient?.name
}

function isSessionCard(task) {
  return task.mode === 'session' || (task.patientQueue && task.patientQueue.length > 0)
}

function typeIconComponent(type) {
  const map = {
    shift_handover: ContainerOutlined,
    ward_rounds: MedicineBoxOutlined,
    mdt: FundOutlined,
    vip_clinic: CrownOutlined,
    surgical_schedule: HeartOutlined,
    research_cohort: ExperimentOutlined,
  }
  return map[type] ?? HeartOutlined
}

function workflowStyleSuffix(type) {
  return String(type).replace(/_/g, '-')
}

function typeTagClass(type) {
  const known = ['shift_handover', 'ward_rounds', 'mdt', 'vip_clinic', 'surgical_schedule', 'research_cohort']
  return known.includes(type)
    ? `workflow-type-tag-${workflowStyleSuffix(type)}`
    : 'workflow-type-tag-ward-rounds'
}

const QUEUE_STATUS_TONES = new Set(['red', 'amber', 'green', 'violet', 'blue'])

function normalizeQueueTone(tone) {
  return QUEUE_STATUS_TONES.has(tone) ? tone : 'amber'
}

function queueToneTagClass(tone) {
  return `workflow-queue-tone-tag-${normalizeQueueTone(tone)}`
}

function queueToneDotClass(tone) {
  return `workflow-queue-tone-dot-${normalizeQueueTone(tone)}`
}

function insightIconComponent(icon) {
  return icon === 'bot' ? RobotOutlined : ThunderboltOutlined
}

function actionBtnClass(type) {
  const known = ['shift_handover', 'ward_rounds', 'vip_clinic', 'mdt', 'surgical_schedule']
  return known.includes(type)
    ? `workflow-action-btn-${workflowStyleSuffix(type)}`
    : 'workflow-action-btn-default'
}

function identifierPrefix(type) {
  return SESSION_IDENTIFIER_PREFIX[type] ?? null
}

function queueUnit(type) {
  return SESSION_QUEUE_UNIT[type] ?? '位'
}

function queueCount(task) {
  return task.patientQueue?.length ?? task.totalPatients ?? 0
}

function formatQueueIdentifier(patient, defaultPrefix) {
  const prefix = patient.identifierPrefix ?? defaultPrefix
  const suffix = patient.identifierSuffix ?? ''
  if (prefix && suffix) return `${prefix}${patient.identifier}${suffix}`
  if (prefix) return `${prefix} ${patient.identifier}`
  return patient.identifier
}

function isOutpatientWorkflow(task) {
  return task.type === 'vip_clinic' && task.workspaceTaskId === 'task_outpatient'
}

function handleEnterWorkspace(task) {
  if (!isOutpatientWorkflow(task)) {
    message.info(`${task.actionLabel ?? '该工作流'}工作台即将开放，敬请期待。`)
    return
  }
  taskStore.startWork(task.workspaceTaskId)
  router.push({ name: 'Workspace' })
}
</script>
