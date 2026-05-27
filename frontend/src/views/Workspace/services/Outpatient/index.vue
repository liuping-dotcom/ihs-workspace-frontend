<template>
  <div class="ambient-bg flex h-screen flex-col overflow-hidden font-sans text-slate-800">
    <header class="portal-header">
      <div class="portal-header-brand">
        <button
          type="button"
          class="workspace-back-btn"
          aria-label="返回工作空间"
          @click="goPortal"
        >
          <ThunderboltOutlined class="text-xl" aria-hidden />
        </button>
        <h1 class="portal-header-title">
          IHS<span class="portal-header-title-sub">门诊诊疗</span>
        </h1>
      </div>

      <div class="workspace-header-actions">
        <div class="workspace-scenario-badge">
          <span class="workspace-scenario-dot" aria-hidden />
          <span class="workspace-scenario-label">当前情景：{{ scenarioLabel }}</span>
        </div>
        <span class="workspace-header-divider" aria-hidden="true" />
        <div class="workspace-header-user">
          <div class="workspace-header-user-text">
            <p class="workspace-header-user-name">陈主任</p>
            <p class="workspace-header-user-dept">心血管内科</p>
          </div>
          <div class="workspace-header-avatar" aria-hidden="true">
            <UserOutlined class="text-xl" />
          </div>
        </div>
      </div>
    </header>

    <main class="workspace-shell-main">
      <div class="workspace-shell-body">
        <div class="workspace-layout">
        <!-- 左：患者队列 (~20%) -->
        <aside class="workspace-queue-aside glass-sidebar">
          <div class="flex flex-col gap-4 border-b border-white/40 px-4 pb-3 pt-4">
            <button type="button" class="glass-btn-primary w-full" @click="handleNewDialogue">
              <ThunderboltOutlined aria-hidden />
              新任务 / 对话
            </button>
            <div class="glass-tab-track">
              <span class="glass-tab-active flex-1 py-1.5 text-center text-xs font-bold">
                待办任务
                <span v-if="pendingTaskCount" class="workspace-tab-badge">{{ pendingTaskCount }}</span>
              </span>
              <span class="glass-tab-inactive flex-1 py-1.5 text-center text-xs font-bold">历史对话</span>
            </div>
          </div>
          <div class="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-2">
            <PatientQueue
              :active-task-id="activeTaskId"
              :completed-task-ids="completedTaskIds"
              @select="handleSelectPatient"
            />
          </div>
        </aside>

        <!-- 中：诊疗主画布 (~60%) -->
        <section class="workspace-main-panel glass-panel-elevated relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            class="glass-header outpatient-main-header flex items-center gap-3"
            :class="{ 'outpatient-main-header--elevated': chatScrolled }"
          >
            <PatientTriageHeader
              class="min-w-0 flex-1"
              :profile="currentProfile"
              @recall="handleTriageRecall"
              @next="handleTriageNext"
              @cancel="handleTriageCancel"
              @end="handleTriageEnd"
            />
            <div
              v-if="isAiThinking"
              class="flex shrink-0 items-center text-xs font-medium text-blue-600"
            >
              <ThunderboltOutlined class="mr-1 animate-pulse" aria-hidden />
              分身处理中...
            </div>
          </div>

          <div class="outpatient-session-body">
            <Transition
              name="outpatient-todo"
              @after-enter="scheduleScrollChat"
              @after-leave="scheduleScrollChat"
            >
              <div
                v-if="sessionTodosVisible && sessionTodoItems.length"
                key="todo-panel"
                class="outpatient-todo-shell"
              >
                <SessionTodoPanel :items="sessionTodoItems" @action="handleTodoAction" />
              </div>
            </Transition>

            <div
              ref="chatScrollRef"
              class="outpatient-chat-panel custom-scrollbar min-h-0 flex-1 scroll-pb-4 overflow-y-auto px-5 py-4"
              @scroll="handleChatScroll"
            >
              <div ref="chatContentRef" class="space-y-4">
                <template v-for="(block, index) in sessionBlocks" :key="block.id">
                  <div
                    v-if="block.type === 'user'"
                    class="outpatient-session-block-user flex items-start justify-end gap-3"
                  >
                    <div class="outpatient-session-user-bubble">
                      <p class="outpatient-session-user-text">{{ block.text }}</p>
                    </div>
                    <div class="workspace-user-avatar shrink-0" aria-hidden="true">
                      <UserOutlined class="text-sm" />
                    </div>
                  </div>

                  <div
                    v-else-if="isAgentMicroformBlock(block)"
                    class="outpatient-session-block outpatient-session-block--agent flex items-start gap-3"
                    :data-session-block-type="block.type"
                    :data-session-block-id="block.id"
                  >
                    <div class="workspace-ai-avatar shrink-0">
                      <RobotOutlined class="text-blue-500" aria-hidden />
                    </div>
                    <div class="outpatient-session-agent-body min-w-0 flex-1">
                      <PanoramaBoard
                        v-if="block.type === 'profile'"
                        :profile="block.profile"
                        :frozen="!isBlockInteractive(index)"
                        @start-consultation="startVoiceConsultation"
                        @refresh="handleRefreshProfile"
                        @view-visit="handleViewVisitRecord"
                      />
                      <VisitRecordBoard
                        v-else-if="block.type === 'visit_record'"
                        :record="block.record"
                        frozen
                      />
                    </div>
                  </div>

                  <div
                    v-else
                    class="outpatient-session-block outpatient-session-block--record flex items-start gap-3"
                  >
                    <div class="workspace-ai-avatar shrink-0">
                      <CheckCircleOutlined class="text-emerald-500" aria-hidden />
                    </div>
                    <div class="min-w-0 flex-1">
                    <div class="outpatient-session-record-bubble">
                      <p class="outpatient-session-record-label">处理记录</p>
                      <p class="outpatient-session-record-text">{{ block.text }}</p>
                    </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="workspace-input-bar">
            <form class="workspace-omni-form" @submit.prevent="handleSubmit">
              <button
                type="button"
                class="workspace-omni-mic"
                :disabled="isAiThinking"
                aria-label="语音输入"
                @click="handleMic"
              >
                <AudioOutlined class="text-lg" aria-hidden />
              </button>
              <input
                v-model="inputText"
                type="text"
                class="workspace-omni-input"
                :placeholder="inputPlaceholder"
                :disabled="isAiThinking"
                aria-label="诊疗指令输入"
              />
              <button
                type="submit"
                class="workspace-omni-send"
                :class="{ 'workspace-omni-send--active': canSendMessage }"
                :disabled="!canSendMessage"
                aria-label="发送"
              >
                <SendOutlined class="text-base" aria-hidden />
              </button>
            </form>
          </div>
        </section>

        <!-- 右：辅助信息 (~20%) -->
        <aside class="workspace-aux-aside glass-sidebar">
          <div class="border-b border-white/40 px-4 py-3">
            <h3 class="workspace-aux-title !mb-0">
              <HeartOutlined aria-hidden />
              辅助信息
            </h3>
          </div>

          <div class="custom-scrollbar flex-1 overflow-y-auto px-3 py-3">
            <AuxiliaryPanel
              v-if="showAuxiliaryPanel"
              :voice-active="voiceConsultationActive"
              :voice-paused="voicePaused"
              :voice-stopped="voiceStopped"
              :transcript-lines="voiceTranscriptLines"
              @toggle-voice-pause="toggleVoicePause"
              @stop-voice="stopVoiceConsultation"
            />
            <p
              v-else
              class="rounded-xl border border-dashed border-slate-200/80 bg-white/40 p-3 text-xs leading-relaxed text-slate-500"
            >
              选择患者并生成全景档案后，将在此展示跨域辅助信息。
            </p>
          </div>
        </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ThunderboltOutlined,
  RobotOutlined,
  AudioOutlined,
  HeartOutlined,
  SendOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useTaskStore } from '../../../../store/taskStore.js'
import {
  DEFAULT_OUTPATIENT_PROFILE,
  OUTPATIENT_FIRST_PATIENT_TASK_ID,
  OUTPATIENT_PATIENT_QUEUE,
  OUTPATIENT_PATIENT_HEADER_META,
  OUTPATIENT_PANORAMA_SESSION_TODOS,
  DEFAULT_CONSULTATION_SCRIPT,
  getVisitRecordById,
} from '../../../../data/outpatientData.js'
import PatientQueue from './PatientQueue.vue'
import PatientTriageHeader from './PatientTriageHeader.vue'
import SessionTodoPanel from './SessionTodoPanel.vue'
import PanoramaBoard from './PanoramaBoard.vue'
import VisitRecordBoard from './VisitRecordBoard.vue'
import AuxiliaryPanel from './AuxiliaryPanel.vue'

const router = useRouter()
const taskStore = useTaskStore()

const phase = ref('profile')
const sessionTodosVisible = ref(false)
const isAiThinking = ref(false)
const inputText = ref('')
const sessionTodoItems = ref([])
const sessionBlocks = ref([])
const chatScrollRef = ref(null)
const chatContentRef = ref(null)
const chatScrolled = ref(false)
const stickToBottom = ref(true)
let chatResizeObserver = null
let scrollChatTimer = null
let scrollFollowupTimer = null
let resizeScrollTimer = null
let programmaticScrollUntil = 0
let todoRevealTimer = null
let panoramaTodoCheckTimer = null
let panoramaIntersectionObserver = null
let voiceTranscriptTimer = null

const voiceConsultationActive = ref(false)
const voicePaused = ref(false)
const voiceStopped = ref(false)
const voiceTranscriptLines = ref([])

const activeTaskId = computed(() => taskStore.activeTaskId)
const activeTask = computed(() => taskStore.activeTask)
const completedTaskIds = computed(() =>
  taskStore.globalTasks.filter((t) => t.type === 'outpatient' && t.status === 'completed').map((t) => t.id)
)

const scenarioLabel = computed(() => activeTask.value?.role ?? '门诊专家')

const pendingTaskCount = computed(() => {
  const done = new Set(completedTaskIds.value)
  return OUTPATIENT_PATIENT_QUEUE.filter((p) => !done.has(p.taskId) && p.status !== '已就诊').length
})

function findQueuePatient(taskId) {
  return OUTPATIENT_PATIENT_QUEUE.find((p) => p.taskId === taskId)
}

function buildPatientLabels(patient) {
  const visitLabel = patient.visitType === '复诊' ? '复诊' : '初诊'
  return [visitLabel, '市医保', '高血压']
}

function buildProfileFromQueue(patient) {
  if (!patient) return DEFAULT_OUTPATIENT_PROFILE
  const headerMeta = OUTPATIENT_PATIENT_HEADER_META[patient.taskId] ?? {}
  if (patient.taskId === 'task_outpatient') {
    return { ...DEFAULT_OUTPATIENT_PROFILE, ...headerMeta }
  }
  return {
    ...DEFAULT_OUTPATIENT_PROFILE,
    name: patient.name,
    gender: patient.gender,
    age: `${patient.age}岁`,
    patientLabels: patient.patientLabels ?? buildPatientLabels(patient),
    queueNo: patient.queueNo,
    outpatientNo: `M20260514${patient.queueNo.padStart(3, '0')}`,
    chiefComplaint: patient.chiefComplaint,
    ...headerMeta,
  }
}

const currentProfile = computed(() => buildProfileFromQueue(findQueuePatient(activeTaskId.value)))

const showAuxiliaryPanel = computed(() => {
  if (activeTaskId.value !== OUTPATIENT_FIRST_PATIENT_TASK_ID) return false
  if (isAiThinking.value) return false
  return sessionBlocks.value.some((block) => block.type === 'profile')
})

const inputPlaceholder = computed(() => '输入语音或文本指示（例如：剂量减半）...')

const canSendMessage = computed(
  () => Boolean(String(inputText.value ?? '').trim()) && !isAiThinking.value
)

function isValidOutpatientSession() {
  if (!activeTaskId.value) return false
  const type = activeTask.value?.type
  if (type === 'outpatient' || type === 'vip_clinic') return true
  return Boolean(findQueuePatient(activeTaskId.value))
}

function shouldHydrateFor(taskId) {
  return Boolean(taskId && findQueuePatient(taskId))
}

function ensureDefaultPatient() {
  const first = OUTPATIENT_PATIENT_QUEUE[0]
  if (!first) return false
  if (!activeTaskId.value || !findQueuePatient(activeTaskId.value)) {
    taskStore.startWork(first.taskId)
  }
  return true
}

function goPortal() {
  taskStore.clearActiveWork()
  router.push({ name: 'Portal' })
}

function isAgentMicroformBlock(block) {
  return block.type === 'profile' || block.type === 'visit_record'
}

function findLastBlockIndex(type) {
  for (let i = sessionBlocks.value.length - 1; i >= 0; i--) {
    if (sessionBlocks.value[i].type === type) return i
  }
  return -1
}

function isBlockInteractive(index) {
  const block = sessionBlocks.value[index]
  if (!block || block.type !== 'profile') return false
  return phase.value === 'profile' && index === findLastBlockIndex('profile')
}

function pushSessionBlock(block) {
  sessionBlocks.value = [
    ...sessionBlocks.value,
    { id: `${block.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...block },
  ]
  stickToBottom.value = true
  scheduleScrollChat()
}

function isNearBottom(el, threshold = 96) {
  if (!el) return true
  return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
}

function scrollChatToBottom(behavior = 'smooth') {
  const el = chatScrollRef.value
  if (!el) return
  programmaticScrollUntil = Date.now() + (behavior === 'smooth' ? 900 : 80)
  el.scrollTo({ top: el.scrollHeight, behavior })
}

function scheduleScrollChat() {
  window.clearTimeout(scrollChatTimer)
  window.clearTimeout(scrollFollowupTimer)

  stickToBottom.value = true
  scrollChatToBottom('auto')
  nextTick(() => {
    requestAnimationFrame(() => {
      scrollChatToBottom('smooth')
    })
  })

  scrollChatTimer = window.setTimeout(() => scrollChatToBottom('smooth'), 120)
  scrollFollowupTimer = window.setTimeout(() => scrollChatToBottom('smooth'), 480)
  window.setTimeout(() => scrollChatToBottom('smooth'), 960)
}

function handleChatScroll(event) {
  const el = event.target
  chatScrolled.value = el.scrollTop > 4
  if (Date.now() < programmaticScrollUntil) return
  stickToBottom.value = isNearBottom(el)
  checkPanoramaOffscreenForTodos()
}

function setupChatAutoScroll() {
  chatResizeObserver?.disconnect()
  const content = chatContentRef.value
  if (!content) return

  chatResizeObserver = new ResizeObserver(() => {
    if (!stickToBottom.value) return
    programmaticScrollUntil = Date.now() + 900
    window.clearTimeout(resizeScrollTimer)
    resizeScrollTimer = window.setTimeout(() => scrollChatToBottom('smooth'), 32)
  })
  chatResizeObserver.observe(content)
}

function clearVoiceConsultation() {
  window.clearInterval(voiceTranscriptTimer)
  voiceTranscriptTimer = null
  voiceConsultationActive.value = false
  voicePaused.value = false
  voiceStopped.value = false
  voiceTranscriptLines.value = []
}

function clearSessionTodos() {
  window.clearTimeout(todoRevealTimer)
  todoRevealTimer = null
  sessionTodoItems.value = []
  sessionTodosVisible.value = false
}

function hasVisitRecordBlocks() {
  return sessionBlocks.value.some((block) => block.type === 'visit_record')
}

function revealSessionTodosAuto() {
  if (sessionTodosVisible.value) return
  if (!hasVisitRecordBlocks()) return
  const todos = OUTPATIENT_PANORAMA_SESSION_TODOS.map((item) => ({ ...item }))
  if (!todos.length) return
  sessionTodoItems.value = todos
  sessionTodosVisible.value = true
  nextTick(() => scheduleScrollChat())
}

function isPanoramaAboveViewport() {
  const root = chatScrollRef.value
  const profileEl = chatContentRef.value?.querySelector('[data-session-block-type="profile"]')
  if (!root || !profileEl) return false
  const rootRect = root.getBoundingClientRect()
  const profileRect = profileEl.getBoundingClientRect()
  return profileRect.bottom <= rootRect.top + 12
}

function checkPanoramaOffscreenForTodos() {
  if (sessionTodosVisible.value || !hasVisitRecordBlocks()) return
  if (isPanoramaAboveViewport()) {
    revealSessionTodosAuto()
  }
}

function schedulePanoramaTodoCheck() {
  window.clearTimeout(panoramaTodoCheckTimer)
  panoramaTodoCheckTimer = window.setTimeout(() => {
    panoramaTodoCheckTimer = null
    checkPanoramaOffscreenForTodos()
  }, 400)
  window.setTimeout(checkPanoramaOffscreenForTodos, 980)
}

function setupPanoramaVisibilityObserver() {
  panoramaIntersectionObserver?.disconnect()
  const root = chatScrollRef.value
  const profileEl = chatContentRef.value?.querySelector('[data-session-block-type="profile"]')
  if (!root || !profileEl) return

  panoramaIntersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry?.isIntersecting && hasVisitRecordBlocks()) {
        revealSessionTodosAuto()
      }
    },
    { root, threshold: 0 }
  )
  panoramaIntersectionObserver.observe(profileEl)
}

function scrollToSessionBlock(blockId) {
  const root = chatScrollRef.value
  const el = chatContentRef.value?.querySelector(`[data-session-block-id="${blockId}"]`)
  if (!root || !el) return
  programmaticScrollUntil = Date.now() + 600
  const offset = el.offsetTop - root.offsetTop - 12
  root.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' })
}

function handleViewVisitRecord(visit) {
  const record = getVisitRecordById(visit.id)
  if (!record) {
    message.warning('暂无该次就诊病历')
    return
  }

  const existing = sessionBlocks.value.find(
    (block) => block.type === 'visit_record' && block.visitId === visit.id
  )
  if (existing) {
    nextTick(() => scrollToSessionBlock(existing.id))
    return
  }

  pushSessionBlock({
    type: 'visit_record',
    visitId: visit.id,
    record: { ...record },
  })

  nextTick(() => {
    setupPanoramaVisibilityObserver()
    schedulePanoramaTodoCheck()
  })
}

function scrollToPanoramaProfile() {
  const profileBlock = sessionBlocks.value.find((block) => block.type === 'profile')
  if (!profileBlock) return
  nextTick(() => scrollToSessionBlock(profileBlock.id))
}

function scheduleVoiceTranscriptLine() {
  window.clearInterval(voiceTranscriptTimer)
  voiceTranscriptTimer = window.setInterval(() => {
    if (voicePaused.value || voiceStopped.value) return
    const lineIndex = voiceTranscriptLines.value.length
    if (lineIndex >= DEFAULT_CONSULTATION_SCRIPT.length) {
      window.clearInterval(voiceTranscriptTimer)
      voiceTranscriptTimer = null
      return
    }
    const entry = DEFAULT_CONSULTATION_SCRIPT[lineIndex]
    voiceTranscriptLines.value = [
      ...voiceTranscriptLines.value,
      {
        id: `voice-line-${Date.now()}-${lineIndex}`,
        role: entry.role,
        text: entry.text,
      },
    ]
  }, 1400)
}

function startVoiceConsultation() {
  if (activeTaskId.value !== OUTPATIENT_FIRST_PATIENT_TASK_ID) {
    message.info('当前演示语音问诊仅关联首位患者')
    return
  }
  if (!showAuxiliaryPanel.value) {
    message.warning('请先加载患者全景档案')
    return
  }

  clearVoiceConsultation()
  voiceConsultationActive.value = true
  voicePaused.value = false
  voiceStopped.value = false
  scheduleVoiceTranscriptLine()
  message.success('已开始语音问诊，右侧可查看实时转录')
}

function toggleVoicePause() {
  if (!voiceConsultationActive.value || voiceStopped.value) return
  voicePaused.value = !voicePaused.value
}

function stopVoiceConsultation() {
  if (!voiceConsultationActive.value) return
  voiceStopped.value = true
  voicePaused.value = true
  window.clearInterval(voiceTranscriptTimer)
  voiceTranscriptTimer = null
  message.info('语音录入已停止')
}

function handleTodoAction(item, actionKey) {
  if (item.id === 'todo_panorama_profile') {
    if (actionKey === 'start-consultation') {
      scrollToPanoramaProfile()
      startVoiceConsultation()
      return
    }
    if (actionKey === 'refresh') {
      scrollToPanoramaProfile()
      handleRefreshProfile()
      return
    }
  }

  if (!item.persistOnAction) {
    sessionTodoItems.value = sessionTodoItems.value.filter((todo) => todo.id !== item.id)
  }

  const isReject = actionKey === 'reject' || actionKey === 'defer'
  const recordText =
    actionKey === 'reject' && item.rejectLog
      ? item.rejectLog
      : actionKey === 'defer'
        ? `已暂缓：${item.title}`
        : item.resolveLog ?? `已处理：${item.title}`

  pushSessionBlock({ type: 'record', text: recordText })
  message.success(isReject ? '操作已记录' : '处理完成')
}

function hydrateProfile() {
  phase.value = 'profile'
  sessionBlocks.value = []
  chatScrolled.value = false
  stickToBottom.value = true
  clearSessionTodos()
  clearVoiceConsultation()
  isAiThinking.value = true

  setTimeout(() => {
    isAiThinking.value = false
    pushSessionBlock({
      type: 'profile',
      profile: { ...currentProfile.value },
    })
    nextTick(setupPanoramaVisibilityObserver)
  }, 700)
}

function handleSelectPatient(taskId) {
  taskStore.startWork(taskId)
}

function handleTriageRecall() {
  const name = currentProfile.value.name
  message.success(`已重呼患者：${name}`)
}

function handleTriageNext() {
  const queue = OUTPATIENT_PATIENT_QUEUE
  const currentIdx = queue.findIndex((p) => p.taskId === activeTaskId.value)
  if (currentIdx === -1) return

  for (let i = 1; i <= queue.length; i++) {
    const next = queue[(currentIdx + i) % queue.length]
    if (next.status !== '已就诊') {
      taskStore.startWork(next.taskId)
      message.info(`已切换至：${next.name}`)
      return
    }
  }
  message.warning('暂无下一位待诊患者')
}

function handleTriageCancel() {
  phase.value = 'profile'
  sessionBlocks.value = []
  chatScrolled.value = false
  stickToBottom.value = true
  clearSessionTodos()
  clearVoiceConsultation()
  message.info('已取消当前就诊流程')
}

function handleTriageEnd() {
  if (activeTaskId.value) {
    taskStore.completeTask(activeTaskId.value)
  }
  message.success('就诊已结束')
}

function handleNewDialogue() {
  taskStore.clearActiveWork()
  phase.value = 'profile'
  sessionBlocks.value = []
  chatScrolled.value = false
  stickToBottom.value = true
  clearSessionTodos()
  clearVoiceConsultation()
}

function handleRefreshProfile() {
  const profileIndex = findLastBlockIndex('profile')
  if (profileIndex === -1) return

  isAiThinking.value = true
  setTimeout(() => {
    const nextProfile = { ...currentProfile.value }
    const blocks = [...sessionBlocks.value]
    blocks[profileIndex] = { ...blocks[profileIndex], profile: nextProfile }
    sessionBlocks.value = blocks
    isAiThinking.value = false
    message.success('患者全景档案已刷新')
    scheduleScrollChat()
  }, 600)
}

function handleMic() {
  message.info('语音输入（演示）')
}

function handleSubmit() {
  const text = String(inputText.value ?? '').trim()
  if (!text || isAiThinking.value) return
  inputText.value = ''

  pushSessionBlock({
    type: 'user',
    text,
  })
  isAiThinking.value = true

  setTimeout(() => {
    if (text.includes('档案')) {
      phase.value = 'profile'
      pushSessionBlock({
        type: 'profile',
        profile: { ...currentProfile.value },
      })
    }
    isAiThinking.value = false
  }, 900)
}

onMounted(() => {
  if (!ensureDefaultPatient() || !isValidOutpatientSession()) {
    router.replace({ name: 'Portal' })
    return
  }
  nextTick(setupChatAutoScroll)
})

onUnmounted(() => {
  chatResizeObserver?.disconnect()
  panoramaIntersectionObserver?.disconnect()
  window.clearTimeout(scrollChatTimer)
  window.clearTimeout(scrollFollowupTimer)
  window.clearTimeout(resizeScrollTimer)
  window.clearTimeout(todoRevealTimer)
  window.clearTimeout(panoramaTodoCheckTimer)
  clearVoiceConsultation()
})

watch(sessionBlocks, () => {
  nextTick(() => {
    setupPanoramaVisibilityObserver()
    if (hasVisitRecordBlocks()) {
      schedulePanoramaTodoCheck()
    }
  })
})

watch(
  activeTaskId,
  (id) => {
    if (shouldHydrateFor(id)) {
      hydrateProfile()
    }
  },
  { immediate: true }
)
</script>
