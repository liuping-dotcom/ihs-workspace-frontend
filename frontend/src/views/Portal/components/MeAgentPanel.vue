<template>
  <section class="glass-panel portal-me-panel flex shrink-0 flex-col p-4" aria-label="数字本我控制台">
    <header class="portal-me-panel-head">
      <div class="portal-me-identity">
        <div class="portal-me-avatar-ring" aria-hidden>
          <div class="portal-me-avatar">
            <UserOutlined class="text-xl text-indigo-600" />
          </div>
          <span class="portal-me-avatar-badge" :title="activeAgent.statusLabel">{{ activeAgent.statusEmoji }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="portal-me-name">{{ doctor.name }}</p>
          <p class="portal-me-dept">{{ doctor.department }} · {{ doctor.title }}</p>
        </div>
      </div>
    </header>

    <div class="portal-me-mode-block">
      <p class="portal-left-section-label">我的分身</p>
      <div class="portal-me-mode-grid" role="group" aria-label="切换我的分身">
        <button
          v-for="avatar in meAvatars"
          :key="avatar.key"
          type="button"
          class="portal-me-mode-btn"
          :class="{ 'portal-me-mode-btn--active': activeAvatarKey === avatar.key }"
          :aria-pressed="activeAvatarKey === avatar.key"
          :title="avatar.desc"
          @click="activeAvatarKey = avatar.key"
        >
          <span class="portal-me-mode-btn-label">{{ avatar.shortLabel }}</span>
          <span
            class="portal-me-mode-btn-status"
            :class="statusToneClass(avatarAgent(avatar.key).status)"
          >
            {{ avatarAgent(avatar.key).statusEmoji }} {{ avatarAgent(avatar.key).statusLabel }}
          </span>
          <span class="portal-me-mode-btn-autonomy">{{ avatarAgent(avatar.key).autonomyLevel }}</span>
        </button>
      </div>
    </div>

    <div class="portal-me-metrics-block shrink-0">
      <p class="portal-left-section-label">个人效能看板</p>
      <div class="portal-me-metrics">
        <div class="portal-me-metric-card">
          <p class="portal-me-metric-label">今日 AI 辅助节省</p>
          <p class="portal-me-metric-value">{{ metrics.timeSavedToday }}</p>
        </div>
        <div class="portal-me-metric-card">
          <p class="portal-me-metric-label">分身代办任务</p>
          <p class="portal-me-metric-value">{{ metrics.delegatedTasks }}<span class="text-sm font-semibold">项</span></p>
        </div>
      </div>
      <div class="portal-me-progress">
        <div class="flex items-center justify-between text-[10px] text-slate-500">
          <span>分身学习进度</span>
          <span class="font-bold text-indigo-600">{{ metrics.learningProgress }}%</span>
        </div>
        <div class="portal-me-progress-track" role="progressbar" :aria-valuenow="metrics.learningProgress" aria-valuemin="0" aria-valuemax="100">
          <div class="portal-me-progress-bar" :style="{ width: `${metrics.learningProgress}%` }" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { ME_AGENT_CONSOLE, PORTAL_ME_AVATARS } from '../../../data/portalData.js'

const meAvatars = PORTAL_ME_AVATARS
const { doctor, avatars, metrics } = ME_AGENT_CONSOLE

const activeAvatarKey = ref('clinical')

const activeAgent = computed(() => avatars[activeAvatarKey.value] ?? avatars.clinical)

function avatarAgent(key) {
  return avatars[key] ?? avatars.clinical
}

function statusToneClass(status) {
  if (status === 'learning') return 'portal-me-mode-btn-status--learning'
  if (status === 'suspended') return 'portal-me-mode-btn-status--suspended'
  return 'portal-me-mode-btn-status--active'
}
</script>
