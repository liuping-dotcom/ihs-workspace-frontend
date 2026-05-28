<template>
  <section
    class="glass-panel flex h-full min-h-0 flex-col overflow-hidden p-4"
    aria-label="待审批事务"
  >
    <header class="approval-section-header">
      <div class="approval-section-header-title">
        <AuditOutlined class="shrink-0 text-lg leading-none text-blue-600" aria-hidden />
        <h3 class="m-0 text-lg font-bold leading-none tracking-wide text-slate-800">待审批事务</h3>
      </div>
      <span
        class="shrink-0 rounded-full border border-white/60 bg-white/40 px-2 py-0.5 text-[10px] font-bold text-slate-500 backdrop-blur-sm"
      >
        {{ displayList.length }} 项
      </span>
    </header>

    <div class="custom-scrollbar mt-1 flex min-h-0 flex-1 flex-col overflow-y-auto pr-0.5">
      <a-list
        v-if="displayList.length"
        :data-source="displayList"
        :split="false"
        class="portal-approval-list"
      >
        <template #renderItem="{ item }">
          <a-list-item
            class="!border-none !px-0 !py-0"
            :class="isUrgentApproval(item) ? 'approval-urgent-shell mb-3' : 'mb-3'"
          >
            <article
              class="group approval-card"
              :class="[
                approvalCardModifier(item.agentState),
                isUrgentApproval(item) ? 'approval-card--urgent' : '',
              ]"
            >
              <div class="approval-card-header">
                <h4 class="approval-card-title">
                  {{ item.title }}
                </h4>
                <div class="approval-card-badges">
                  <span
                    v-if="item.urgency === 'urgent'"
                    class="approval-urgency-badge approval-urgency-badge--urgent"
                  >
                    <ExclamationCircleOutlined class="text-[11px]" aria-hidden />
                    紧急
                  </span>
                  <span
                    v-else-if="item.urgency === 'high'"
                    class="approval-urgency-badge approval-urgency-badge--high"
                  >
                    <WarningOutlined class="text-[11px]" aria-hidden />
                    较急
                  </span>
                  <span class="approval-status-badge" :class="approvalStatusModifier(item)">
                    <RobotOutlined
                      v-if="item.agentState === 'processing'"
                      class="animate-spin text-[11px]"
                      aria-hidden
                    />
                    <WarningOutlined
                      v-else-if="item.agentState === 'suggested'"
                      class="text-[11px]"
                      aria-hidden
                    />
                    <CheckCircleOutlined
                      v-else-if="item.agentState === 'auto_handled' && item.autoResult !== 'rejected'"
                      class="text-[11px]"
                      aria-hidden
                    />
                    <CloseCircleOutlined
                      v-else-if="item.agentState === 'auto_handled' && item.autoResult === 'rejected'"
                      class="text-[11px]"
                      aria-hidden
                    />
                    {{ approvalStatusLabel(item) }}
                  </span>
                </div>
              </div>

              <div class="approval-card-meta">
                <span class="approval-card-meta-category">{{ item.category }}</span>
                <span class="approval-card-meta-dot" aria-hidden>·</span>
                <time class="approval-card-meta-time">{{ item.time }}</time>
                <span class="approval-card-meta-dot" aria-hidden>·</span>
                <span class="approval-card-meta-applicant">{{ item.applicant }}</span>
              </div>

              <div v-if="item.agentState === 'processing'" class="approval-processing-block">
                <RobotOutlined class="mt-0.5 shrink-0 animate-spin text-lg text-indigo-500" aria-hidden />
                <p class="text-sm leading-relaxed text-indigo-700/90">分身正在分析临床数据...</p>
              </div>
              <p v-else class="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {{ item.summary }}
              </p>

              <div
                v-if="item.agentState === 'suggested' && item.agentOpinion"
                class="approval-suggested-opinion"
              >
                <p class="approval-suggested-opinion-label">分身预审建议</p>
                <p class="approval-suggested-opinion-text">{{ item.agentOpinion }}</p>
              </div>

              <p
                v-if="item.agentState === 'auto_handled' && item.agentOpinion"
                class="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500"
              >
                {{ item.agentOpinion }}
              </p>

              <div v-if="item.agentState !== 'processing'" class="approval-card-actions">
                <template v-if="item.agentState === 'pending'">
                  <button
                    type="button"
                    class="glass-btn-secondary inline-flex shrink-0 !px-2.5 !py-1.5 !text-xs !font-medium"
                    @click="handleViewDetail(item)"
                  >
                    <FileTextOutlined class="shrink-0 text-xs" aria-hidden />
                    查看详情
                  </button>
                  <button
                    type="button"
                    class="glass-btn-primary inline-flex shrink-0 !px-3 !py-1.5 !text-xs"
                    @click="taskStore.handleApprovalAction(item.id, 'approve')"
                  >
                    审批通过
                  </button>
                </template>

                <template v-else-if="item.agentState === 'suggested'">
                  <button
                    type="button"
                    class="glass-btn-secondary inline-flex shrink-0 !px-2.5 !py-1.5 !text-xs !font-medium"
                    @click="handleViewDetail(item)"
                  >
                    <FileTextOutlined class="shrink-0 text-xs" aria-hidden />
                    查看详情
                  </button>
                  <button
                    type="button"
                    class="approval-adopt-btn"
                    @click="taskStore.adoptApprovalSuggestion(item.id)"
                  >
                    <ThunderboltOutlined class="shrink-0 text-xs" aria-hidden />
                    一键采纳建议
                  </button>
                </template>

                <button
                  v-else-if="item.agentState === 'auto_handled'"
                  type="button"
                  class="approval-decision-detail-btn"
                  @click="handleViewDecisionDetail(item)"
                >
                  <RobotOutlined class="shrink-0 text-xs opacity-70" aria-hidden />
                  查看决策详情
                </button>
              </div>
            </article>
          </a-list-item>
        </template>
      </a-list>
      <p v-else class="py-10 text-center text-xs text-slate-400">暂无待审批事项</p>
    </div>

  </section>

  <!-- 急会诊分派弹窗（原 EmergencyConsultationModal） -->
  <div
    v-if="consultModalOpen"
    class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="emergency-consult-title"
  >
    <div
      class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
      aria-hidden
      @click="consultModalOpen = false"
    />

    <div
      class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-2xl backdrop-blur-xl"
      @click.stop
    >
      <header
        class="flex shrink-0 items-center justify-between gap-4 border-b border-white/50 bg-white/40 px-6 py-3 backdrop-blur-md"
      >
        <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <h2 id="emergency-consult-title" class="text-lg font-semibold leading-snug text-slate-800">
            {{ consultMock.title }}
          </h2>
          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-rose-300/80 bg-rose-50/90 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 animate-pulse"
          >
            <span class="size-1.5 rounded-full bg-rose-500" aria-hidden />
            急会诊
          </span>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-xl border border-white/60 bg-white/50 p-2 text-slate-400 transition-colors hover:bg-white/80 hover:text-slate-600"
          aria-label="关闭"
          @click="consultModalOpen = false"
        >
          <CloseOutlined />
        </button>
      </header>

      <div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <section class="rounded-xl border border-white/60 bg-white/40 p-4 backdrop-blur-sm">
          <div class="mb-3 flex items-center gap-2">
            <BulbOutlined class="shrink-0 text-indigo-500" />
            <span class="text-xs font-semibold tracking-wide text-indigo-600">Agent 自动提炼</span>
          </div>
          <p class="mb-2 text-sm font-medium text-slate-800">
            {{ consultMock.patient.bed }} | {{ consultMock.patient.name }} |
            {{ consultMock.patient.gender }} | {{ consultMock.patient.age }}
          </p>
          <p class="text-sm leading-relaxed text-slate-600">{{ consultMock.aiSummary }}</p>
          <p
            class="mt-3 rounded-lg border border-rose-200/60 bg-rose-50/70 px-3 py-2 text-sm font-semibold text-rose-700"
          >
            {{ consultMock.aiAlert }}
          </p>
        </section>

        <section class="rounded-xl border border-white/50 bg-slate-50/50 p-4 backdrop-blur-sm">
          <h3 class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">申请详情</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex gap-2">
              <dt class="shrink-0 font-medium text-slate-500">申请人</dt>
              <dd class="text-slate-800">{{ consultMock.applicant }}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="shrink-0 font-medium text-slate-500">会诊目的</dt>
              <dd class="leading-relaxed text-slate-800">{{ consultMock.purpose }}</dd>
            </div>
          </dl>
        </section>

        <section>
          <p class="mb-3 text-sm font-medium text-slate-700">
            Agent 已核对排班与实时定位，推荐以下接诊医师：
          </p>
          <ul class="space-y-3">
            <li
              v-for="doc in consultMock.recommended"
              :key="doc.id"
              class="flex flex-col gap-3 rounded-xl border p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
              :class="
                doc.preferred
                  ? 'border-blue-200/70 bg-white/50 ring-1 ring-blue-100/60'
                  : 'border-white/60 bg-white/40'
              "
            >
              <div class="min-w-0 flex-1">
                <div class="mb-1.5 flex flex-wrap items-center gap-2">
                  <span class="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                    <UserOutlined class="text-slate-400" />
                    {{ doc.name }}
                    <span class="text-sm font-normal text-slate-500">({{ doc.title }})</span>
                  </span>
                  <span
                    class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                    :class="
                      doc.statusTone === 'green'
                        ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-700'
                        : 'border-amber-200/80 bg-amber-50/90 text-amber-800'
                    "
                  >
                    <span
                      class="size-1.5 rounded-full"
                      :class="doc.statusTone === 'green' ? 'bg-emerald-500' : 'bg-amber-500'"
                      aria-hidden
                    />
                    {{ doc.status }}{{ doc.statusHint ? ` (${doc.statusHint})` : '' }}
                  </span>
                </div>
                <p class="flex items-start gap-1.5 text-xs text-slate-500">
                  <EnvironmentOutlined class="mt-0.5 shrink-0 text-slate-400" />
                  <span>{{ doc.location }}{{ doc.eta ? ` · ${doc.eta}` : '' }}</span>
                </p>
              </div>
              <button
                type="button"
                class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.98]"
                :class="
                  doc.preferred
                    ? 'bg-gradient-to-r from-blue-600/95 to-indigo-600/95 text-white shadow-[0_4px_14px_rgba(37,99,235,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-px hover:from-blue-600 hover:to-indigo-600'
                    : 'border border-white/60 bg-white/50 text-slate-600 backdrop-blur-md hover:bg-white/80 hover:text-slate-800'
                "
                @click="handleConsultDispatch(doc.id, doc.name)"
              >
                派发给他
              </button>
            </li>
          </ul>
          <button
            type="button"
            class="mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            @click="handleConsultManualAssign"
          >
            手动指派其他医师
            <RightOutlined />
          </button>
        </section>
      </div>

      <footer
        class="flex shrink-0 flex-wrap items-center gap-2 border-t border-white/50 bg-white/40 px-6 py-4 backdrop-blur-md"
      >
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm font-semibold text-slate-600 backdrop-blur-md transition-all hover:bg-white/80"
          @click="handleConsultContact"
        >
          <PhoneOutlined />
          联系申请人
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm font-semibold text-slate-600 backdrop-blur-md transition-all hover:bg-white/80 hover:text-rose-600"
          @click="handleConsultReject"
        >
          <StopOutlined />
          驳回申请
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  AuditOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  CloseOutlined,
  BulbOutlined,
  UserOutlined,
  EnvironmentOutlined,
  RightOutlined,
  PhoneOutlined,
  StopOutlined,
} from '@ant-design/icons-vue'
import { useTaskStore } from '../../../store/taskStore.js'

const taskStore = useTaskStore()
const consultModalOpen = ref(false)

const consultMock = {
  title: '急诊科申请神经内科急会诊',
  patient: { bed: '3床', name: '李伟', gender: '男', age: '68岁' },
  aiSummary:
    '急诊绿色通道收治，发病 2.5 小时，右侧肢体无力，NIHSS 12 分，头颅 CT 未见出血。',
  aiAlert: 'AI 预警：急性缺血性卒中，仍在静脉溶栓时间窗内，需紧急评估。',
  applicant: '急诊科 · 王建国 主任医师',
  purpose: '评估静脉溶栓指征，指导血压控制与抗栓方案',
  recommended: [
    {
      id: 'doc_zhang',
      name: '张磊',
      title: '主治医师',
      status: '空闲中',
      statusTone: 'green',
      statusHint: '今日二线值班',
      location: '神经内科护士站',
      eta: '预计到达神内用时 3 分钟',
      preferred: true,
    },
    {
      id: 'doc_zhao',
      name: '赵强',
      title: '副主任医师',
      status: '查房中',
      statusTone: 'amber',
      statusHint: '',
      location: '神经内科 12床',
      eta: '',
      preferred: false,
    },
  ],
}

const displayList = computed(() => taskStore.pendingApprovals)

function isUrgentApproval(item) {
  return item.urgency === 'urgent'
}

function approvalCardModifier(agentState) {
  switch (agentState) {
    case 'pending':
      return 'approval-card--pending'
    case 'processing':
      return 'approval-card--processing'
    case 'suggested':
      return 'approval-card--suggested'
    case 'auto_handled':
      return 'approval-card--auto-handled'
    default:
      return 'approval-card--pending'
  }
}

function approvalStatusLabel(item) {
  switch (item.agentState) {
    case 'processing':
      return '分身分析中'
    case 'suggested':
      return '待人工确认'
    case 'auto_handled':
      return item.autoResult === 'rejected' ? '分身已拦截' : '分身已审批通过'
    case 'pending':
    default:
      return '人工待办'
  }
}

function approvalStatusModifier(item) {
  switch (item.agentState) {
    case 'processing':
      return 'approval-status-badge--processing'
    case 'suggested':
      return 'approval-status-badge--suggested'
    case 'auto_handled':
      return item.autoResult === 'rejected'
        ? 'approval-status-badge--rejected'
        : 'approval-status-badge--approved'
    case 'pending':
    default:
      return 'approval-status-badge--pending'
  }
}

function handleViewDetail(item) {
  if (item.id === 'appr_consult') {
    consultModalOpen.value = true
    return
  }
  taskStore.openApprovalDetail(item.id)
}

function handleViewDecisionDetail(item) {
  taskStore.openApprovalDetail(item.id)
}

function handleConsultDispatch(doctorId, doctorName) {
  console.log('[ApprovalQueue] 急会诊派单', { doctorId, doctorName })
  consultModalOpen.value = false
  taskStore.handleApprovalAction('appr_consult', 'approve')
}

function handleConsultReject() {
  console.log('[ApprovalQueue] 驳回急会诊申请')
  consultModalOpen.value = false
  taskStore.handleApprovalAction('appr_consult', 'reject')
}

function handleConsultContact() {
  console.log('[ApprovalQueue] 联系申请人')
}

function handleConsultManualAssign() {
  console.log('[ApprovalQueue] 手动指派其他医师')
}
</script>
