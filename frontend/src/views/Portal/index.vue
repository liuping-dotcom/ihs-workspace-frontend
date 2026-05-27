<template>
  <div class="portal-bg flex h-screen flex-col overflow-hidden font-sans text-slate-800">
    <header class="portal-header">
      <div class="portal-header-brand">
        <div class="portal-header-logo">
          <ThunderboltOutlined class="text-xl" aria-hidden />
        </div>
        <h1 class="portal-header-title">
          IHS<span class="portal-header-title-sub">Workspace</span>
        </h1>
      </div>

      <div ref="userMenuRootRef" class="relative">
        <button
          type="button"
          class="portal-user-trigger"
          :aria-expanded="isUserMenuOpen"
          aria-haspopup="menu"
          aria-label="用户菜单"
          @click="isUserMenuOpen = !isUserMenuOpen"
        >
          <div class="portal-user-trigger-text">
            <p class="text-sm font-bold text-slate-800">{{ userProfile.name }}</p>
            <p class="text-xs text-slate-500">{{ userProfile.department }}</p>
          </div>
          <div class="portal-user-avatar">
            <UserOutlined class="text-xl" />
          </div>
        </button>

        <div
          role="menu"
          class="portal-user-menu"
          :class="isUserMenuOpen ? 'portal-user-menu--open' : 'portal-user-menu--closed'"
        >
          <div class="portal-user-menu-panel">
            <div class="portal-user-menu-header">
              <div class="flex items-center gap-3">
                <div class="portal-user-menu-avatar-lg">
                  <UserOutlined class="text-2xl" />
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-slate-800">{{ userProfile.name }}</p>
                  <p class="text-xs text-slate-500">{{ userProfile.department }}</p>
                  <p class="portal-user-agent-status">
                    <ThunderboltOutlined
                      class="shrink-0 text-indigo-500 drop-shadow-[0_0_6px_rgba(99,102,241,0.45)]"
                      aria-hidden
                    />
                    <span class="portal-user-agent-status-text">
                      {{ userProfile.activeAgentsCount }} 个分身运行中
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="px-2 py-2">
              <button
                type="button"
                class="portal-user-menu-item"
                @click="runUserMenuAction(() => (isAvatarConfigOpen = true))"
              >
                <span class="portal-user-menu-item-icon">
                  <TeamOutlined />
                </span>
                <span>我的分身</span>
              </button>
              <button
                type="button"
                class="portal-user-menu-item portal-user-menu-item--highlight"
                @click="runUserMenuAction(handleCreateAvatar)"
              >
                <span class="portal-user-menu-item-icon portal-user-menu-item-icon--highlight">
                  <ThunderboltOutlined />
                </span>
                <span class="font-semibold">创建分身</span>
              </button>
            </div>

            <div class="portal-user-menu-divider" role="separator" />

            <div class="px-2 py-2">
              <button
                type="button"
                class="portal-user-menu-item"
                @click="runUserMenuAction(handlePermissionConfig)"
              >
                <span class="portal-user-menu-item-icon">
                  <SafetyOutlined />
                </span>
                <span>权限配置</span>
              </button>
              <button
                type="button"
                class="portal-user-menu-item"
                @click="runUserMenuAction(() => (isSubscriptionCenterOpen = true))"
              >
                <span class="portal-user-menu-item-icon">
                  <CreditCardOutlined />
                </span>
                <span>订阅中心</span>
              </button>
              <button
                type="button"
                class="portal-user-menu-item"
                @click="runUserMenuAction(handleSettings)"
              >
                <span class="portal-user-menu-item-icon">
                  <SettingOutlined />
                </span>
                <span>系统设置</span>
              </button>
            </div>

            <div class="portal-user-menu-divider" role="separator" />

            <div class="px-2 py-2">
              <button
                type="button"
                class="portal-user-menu-item portal-user-menu-item--danger"
                @click="runUserMenuAction(handleLogout)"
              >
                <span class="portal-user-menu-item-icon">
                  <LogoutOutlined />
                </span>
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-hidden">
      <div
        class="portal-three-col grid h-full min-h-0 w-full items-stretch gap-4 overflow-hidden px-5 py-5 sm:px-6"
      >
        <aside class="portal-left-column grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden" aria-label="本我与知识大脑">
          <MeAgentPanel />
          <PrivateKnowledgePanel />
        </aside>

        <CoreWorkflow />

        <aside
          class="portal-right-column grid h-full min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto_auto] gap-4 overflow-hidden"
          aria-label="右侧工作区"
        >
          <div class="min-h-0 overflow-hidden">
            <ApprovalQueue />
          </div>
          <MyPlan />
          <OmniInputBar />
        </aside>
      </div>
    </main>

    <!-- 审批详情弹窗 -->
    <div
      v-if="taskStore.approvalDetail"
      class="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        role="presentation"
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        @click="taskStore.closeApprovalDetail"
      />
      <div
        class="glass-modal relative flex max-h-[85vh] w-full max-w-md flex-col"
        @click.stop
      >
        <div class="glass-header flex shrink-0 items-start justify-between gap-3 !px-5 !py-4">
          <div class="min-w-0">
            <span class="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
              {{ taskStore.approvalDetail.category }}
            </span>
            <h3 class="mt-2 text-base font-bold text-slate-800">{{ taskStore.approvalDetail.title }}</h3>
            <p class="mt-1 text-xs text-slate-500">{{ taskStore.approvalDetail.applicant }}</p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            aria-label="关闭"
            @click="taskStore.closeApprovalDetail"
          >
            <CloseOutlined />
          </button>
        </div>
        <div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <p class="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">事项摘要</p>
            <p class="text-sm leading-relaxed text-slate-700">{{ taskStore.approvalDetail.summary }}</p>
          </div>
          <a-card v-if="taskStore.approvalDetail.detail" :bordered="false" class="glass-subcard">
            <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">完整说明</p>
            <p class="whitespace-pre-line text-xs leading-relaxed text-slate-600">
              {{ taskStore.approvalDetail.detail }}
            </p>
          </a-card>
          <a-card
            v-if="taskStore.approvalDetail.agentSuggestion"
            :bordered="false"
            class="border border-emerald-100 bg-emerald-50/80"
          >
            <p class="mb-0.5 text-[10px] font-bold text-emerald-800">Agent 预审意见</p>
            <p class="text-xs leading-relaxed text-emerald-700">{{ taskStore.approvalDetail.agentSuggestion }}</p>
          </a-card>
          <div
            v-if="taskStore.approvalDetail.chainOfThought?.length"
            class="glass-subcard space-y-2 p-3"
          >
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">分身决策链路</p>
            <ul class="space-y-1.5">
              <li
                v-for="(line, idx) in taskStore.approvalDetail.chainOfThought"
                :key="idx"
                class="text-xs leading-relaxed text-slate-600"
              >
                {{ line }}
              </li>
            </ul>
          </div>
        </div>
        <div class="glass-divider-soft flex shrink-0 gap-2 bg-white/30 px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            class="glass-btn-secondary flex-1"
            @click="taskStore.handleApprovalAction(taskStore.approvalDetail.id, 'reject')"
          >
            打回
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700"
            @click="taskStore.handleApprovalAction(taskStore.approvalDetail.id, 'approve')"
          >
            审批通过
          </button>
        </div>
      </div>
    </div>

    <!-- 分身配置弹窗 -->
    <div v-if="isAvatarConfigOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        role="presentation"
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        @click="isAvatarConfigOpen = false"
      />
      <div
        class="relative flex h-[70vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 backdrop-blur-2xl"
        @click.stop
      >
        <div class="flex w-1/3 flex-col border-r border-white/40 bg-slate-50/40 backdrop-blur-xl">
          <div class="border-b border-slate-100/80 p-5">
            <h3 class="text-base font-bold text-slate-800">Agent 分身管理</h3>
            <p class="mt-1 text-xs text-slate-500">配置不同工作流的 AI 授权级别</p>
          </div>
          <a-list :data-source="AVATAR_CONFIGS" :split="false" class="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <template #renderItem="{ item: avatar }">
              <a-list-item class="!border-none !px-0 !py-0 mb-1">
                <button
                  type="button"
                  class="flex w-full cursor-pointer flex-col gap-1 rounded-xl p-3 text-left transition-all"
                  :class="
                    activeConfigTab === avatar.id
                      ? 'border border-blue-100 bg-white/90 shadow-sm backdrop-blur-sm'
                      : 'border border-transparent hover:bg-slate-100/80'
                  "
                  @click="activeConfigTab = avatar.id"
                >
                  <div
                    class="flex items-center gap-2 text-sm font-bold"
                    :class="activeConfigTab === avatar.id ? 'text-blue-700' : 'text-slate-700'"
                  >
                    <RobotOutlined />
                    {{ avatar.name }}
                  </div>
                  <div class="line-clamp-2 text-xs text-slate-500">{{ avatar.desc }}</div>
                </button>
              </a-list-item>
            </template>
          </a-list>
        </div>
        <div class="flex flex-1 flex-col bg-white/50 backdrop-blur-xl">
          <div class="flex items-center justify-between border-b border-slate-100/90 p-6">
            <div>
              <h2 class="text-lg font-bold text-slate-800">
                权限与自动化规则：{{ activeAvatarConfig?.name ?? '科室主任分身' }}
              </h2>
              <div class="mt-1 flex items-center gap-2">
                <span class="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span class="text-xs text-slate-500">分身状态：已激活并在线</span>
              </div>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-400 hover:bg-slate-100/80"
              aria-label="关闭"
              @click="isAvatarConfigOpen = false"
            >
              <CloseOutlined />
            </button>
          </div>
          <div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
            <section>
              <h4 class="mb-3 border-l-4 border-blue-600 pl-2 text-sm font-bold text-slate-800">全局自治级别</h4>
              <div class="grid grid-cols-3 gap-3">
                <a-card :bordered="true" class="cursor-pointer border-slate-200/90 bg-white/40 backdrop-blur-sm">
                  <div class="mb-1 text-sm font-bold text-slate-700">Copilot (辅助模式)</div>
                  <div class="text-xs text-slate-500">仅提供建议与草稿，所有决策需陈主任手动点击确认。</div>
                </a-card>
                <a-card :bordered="true" class="relative border-2 border-blue-500 bg-blue-50/40 backdrop-blur-sm">
                  <div
                    class="absolute -top-2.5 right-2 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white"
                  >
                    当前生效
                  </div>
                  <div class="mb-1 text-sm font-bold text-blue-800">Auto-Agent (半自治)</div>
                  <div class="text-xs text-blue-600/80">
                    根据规则自动审批低风险任务，遇到疑似违规时拦截并呼叫人工。
                  </div>
                </a-card>
                <a-card
                  :bordered="true"
                  class="cursor-pointer border-slate-200/90 bg-white/30 opacity-60 backdrop-blur-sm"
                >
                  <div class="mb-1 text-sm font-bold text-slate-700">Full-Auto (全自治)</div>
                  <div class="text-xs text-slate-500">完全接管所授权务，仅输出周期性执行报告。</div>
                </a-card>
              </div>
            </section>
          </div>
          <div class="flex justify-end gap-3 rounded-br-2xl border-t border-slate-100/90 bg-slate-50/60 p-4 backdrop-blur-md">
            <button
              type="button"
              class="rounded-xl px-6 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200/80"
              @click="isAvatarConfigOpen = false"
            >
              取消
            </button>
            <button
              type="button"
              class="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700"
              @click="isAvatarConfigOpen = false"
            >
              保存配置并生效
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 能力集市弹窗 -->
    <div v-if="isSubscriptionCenterOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
      <div
        role="presentation"
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        @click="isSubscriptionCenterOpen = false"
      />
      <div
        class="relative flex h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-slate-50/95 shadow-2xl backdrop-blur-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-slate-200/50 bg-white/60 px-8 py-6">
          <div class="flex items-center gap-4">
            <div
              class="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg shadow-indigo-500/20"
            >
              <CloudServerOutlined class="text-2xl" />
            </div>
            <div>
              <h2 class="text-2xl font-bold tracking-wide text-slate-800">服务 Agent 能力集市</h2>
              <p class="mt-1 text-sm font-medium text-slate-500">
                按需装配数字原生能力，构建您的专属智能工作站
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <a-input
              v-model:value="agentSearchQuery"
              placeholder="搜索 Agent 名称或技能..."
              class="w-64"
              allow-clear
            >
              <template #prefix><SearchOutlined class="text-slate-400" /></template>
            </a-input>
            <button
              type="button"
              class="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-200"
              aria-label="关闭"
              @click="isSubscriptionCenterOpen = false"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>
        <div class="custom-scrollbar flex-1 overflow-y-auto p-8">
          <a-list
            :grid="{ gutter: 20, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }"
            :data-source="filteredAgentPool"
            :split="false"
          >
            <template #renderItem="{ item: agent }">
              <a-list-item>
                <a-card
                  :bordered="true"
                  class="h-full transition-all hover:shadow-lg"
                  :class="
                    agent.isSubscribed
                      ? 'border-indigo-300 shadow-md ring-1 ring-indigo-500/10'
                      : 'border-slate-200'
                  "
                >
                  <div class="mb-3 flex items-start justify-between">
                    <div>
                      <h4
                        class="text-base font-bold"
                        :class="agent.isSubscribed ? 'text-indigo-900' : 'text-slate-800'"
                      >
                        {{ agent.name }}
                      </h4>
                      <p class="mt-0.5 text-[10px] font-medium text-slate-500">
                        {{ agent.provider }} · {{ agent.version }}
                      </p>
                    </div>
                    <a-switch
                      v-if="!agent.locked"
                      :checked="agent.isSubscribed"
                      @change="() => toggleSubscription(agent.id)"
                    />
                    <a-tag v-else>院级锁定</a-tag>
                  </div>
                  <p class="mb-4 flex-1 text-sm leading-relaxed text-slate-600">{{ agent.desc }}</p>
                  <div class="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <a-tag v-for="(skill, idx) in agent.skills" :key="idx">{{ skill }}</a-tag>
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>

    <!-- 全局 Toast -->
    <div
      v-if="taskStore.portalToast"
      class="fixed left-1/2 top-20 z-[300] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg"
      :class="taskStore.portalToast.tone === 'warn' ? 'bg-amber-600' : 'bg-emerald-600'"
    >
      {{ taskStore.portalToast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ThunderboltOutlined,
  UserOutlined,
  CloseOutlined,
  RobotOutlined,
  CloudServerOutlined,
  SearchOutlined,
  TeamOutlined,
  SafetyOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useTaskStore } from '../../store/taskStore.js'
import { AVATAR_CONFIGS } from '../../data/portalData.js'
import CoreWorkflow from './components/CoreWorkflow.vue'
import MeAgentPanel from './components/MeAgentPanel.vue'
import PrivateKnowledgePanel from './components/PrivateKnowledgePanel.vue'
import ApprovalQueue from './components/ApprovalQueue.vue'
import MyPlan from './components/MyPlan.vue'
import OmniInputBar from './components/OmniInputBar.vue'

const taskStore = useTaskStore()

const userProfile = {
  name: '陈主任',
  department: '心血管内科',
  activeAgentsCount: 3,
}

const isUserMenuOpen = ref(false)
const userMenuRootRef = ref(null)

function closeUserMenu() {
  isUserMenuOpen.value = false
}

function runUserMenuAction(action) {
  closeUserMenu()
  action?.()
}

function handleCreateAvatar() {
  taskStore.showPortalToast('创建分身向导（演示）')
}

function handlePermissionConfig() {
  taskStore.showPortalToast('权限配置（演示）')
}

function handleSettings() {
  taskStore.showPortalToast('系统设置（演示）')
}

function handleLogout() {
  taskStore.showPortalToast('已退出登录（演示）', 'warn')
}

function onDocumentPointerDown(e) {
  const root = userMenuRootRef.value
  if (root && !root.contains(e.target)) {
    closeUserMenu()
  }
}

function onDocumentKeyDown(e) {
  if (e.key === 'Escape') closeUserMenu()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeyDown)
})

const isAvatarConfigOpen = ref(false)
const isSubscriptionCenterOpen = ref(false)
const activeConfigTab = ref('director')
const agentSearchQuery = ref('')

const INITIAL_AGENT_POOL = [
  {
    id: 'base_1',
    name: '医疗质量质控 Agent',
    type: 'base',
    isSubscribed: true,
    locked: true,
    desc: '对接医务质控系统。全天候运行病历审核、三级查房督查及不良事件预警。',
    provider: '医务处',
    version: 'v4.5',
    skills: ['运行病历质控', '核心制度校验'],
  },
  {
    id: 'cli_1',
    name: '专家门诊智能接诊',
    type: 'plugin',
    isSubscribed: true,
    locked: false,
    desc: '对接 HIS+EMR。支持预问诊、病史结构化录入、门诊病历极速生成。',
    provider: '门诊部',
    version: 'v5.1',
    skills: ['病史结构化', '极速文书生成'],
  },
  {
    id: 'cli_3',
    name: '心内查房研判助手',
    type: 'plugin',
    isSubscribed: false,
    locked: false,
    desc: '融合移动查房与体征数据。针对危重心衰、心梗进行病情研判。',
    provider: '心内科',
    version: 'v3.0',
    skills: ['体征动态研判', '下级方案校对'],
  },
]

const agentPool = ref([...INITIAL_AGENT_POOL])

const activeAvatarConfig = computed(() => AVATAR_CONFIGS.find((a) => a.id === activeConfigTab.value))

const filteredAgentPool = computed(() => {
  const q = agentSearchQuery.value.trim().toLowerCase()
  return agentPool.value.filter((agent) => {
    if (!q) return true
    return (
      agent.name.toLowerCase().includes(q) ||
      agent.skills?.some((s) => s.toLowerCase().includes(q)) ||
      agent.provider?.toLowerCase().includes(q) ||
      agent.desc?.toLowerCase().includes(q)
    )
  })
})

function toggleSubscription(id) {
  agentPool.value = agentPool.value.map((agent) => {
    if (agent.id === id && !agent.locked) {
      return { ...agent, isSubscribed: !agent.isSubscribed }
    }
    return agent
  })
}

</script>
