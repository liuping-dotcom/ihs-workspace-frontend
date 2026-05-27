<template>
  <div class="workspace-aux-content">
    <AuxVoiceSession
      v-if="voiceActive"
      :voice-active="voiceActive"
      :voice-paused="voicePaused"
      :voice-stopped="voiceStopped"
      :transcript-lines="transcriptLines"
      @toggle-pause="emit('toggle-voice-pause')"
      @stop="emit('stop-voice')"
    />

    <!-- 近期血压趋势 -->
    <section class="workspace-aux-card">
      <h4 class="workspace-aux-section-title">近期血压趋势图</h4>
      <p class="workspace-aux-card-subtitle">{{ data.bloodPressureTrend.sourceLabel }}</p>
      <AuxMiniLineChart
        :points="data.bloodPressureTrend.points"
        :series="data.bloodPressureTrend.series"
        aria-label="近一个月血压趋势"
      />
    </section>

    <!-- 近期血脂趋势 -->
    <section class="workspace-aux-card">
      <h4 class="workspace-aux-section-title">近期血脂趋势图</h4>
      <p class="workspace-aux-card-subtitle">{{ data.lipidTrend.sourceLabel }}</p>
      <div class="workspace-aux-lipid-chart">
        <svg
          class="workspace-aux-lipid-svg"
          viewBox="0 0 280 112"
          preserveAspectRatio="none"
          role="img"
          aria-label="近五年血脂趋势"
        >
          <line
            v-for="(y, idx) in lipidGridYs"
            :key="idx"
            x1="8"
            :y1="y"
            x2="272"
            :y2="y"
            class="aux-mini-chart-grid"
          />
          <line
            :x1="8"
            :y1="lipidTargetY"
            :x2="272"
            :y2="lipidTargetY"
            class="workspace-aux-lipid-target-line"
          />
          <polyline
            :points="lipidLinePoints"
            fill="none"
            :stroke="lipidTrendStroke"
            stroke-width="2"
          />
          <circle
            v-for="(point, idx) in data.lipidTrend.points"
            :key="point.label"
            :cx="lipidCoords[idx].x"
            :cy="lipidCoords[idx].y"
            r="3"
            :fill="lipidTrendStroke"
          />
        </svg>
        <div class="aux-mini-chart-labels">
          <span v-for="point in data.lipidTrend.points" :key="point.label">{{ point.label }}</span>
        </div>
        <p class="workspace-aux-lipid-target-label">
          目标线 {{ data.lipidTrend.target }} {{ data.lipidTrend.unit }}
        </p>
      </div>
    </section>

    <!-- 近期用药 -->
    <section class="workspace-aux-card">
      <h4 class="workspace-aux-section-title">近期用药情况</h4>
      <p class="workspace-aux-card-subtitle">高血压 · 冠心病 · 高脂血症 长期用药</p>
      <ul class="workspace-aux-med-list">
        <li v-for="med in data.medications" :key="med.id" class="workspace-aux-med-item">
          <div class="workspace-aux-med-head">
            <p class="workspace-aux-med-name">{{ med.name }}</p>
            <span
              class="workspace-aux-med-status"
              :class="
                med.statusType === 'warning' ? 'workspace-aux-med-status--warning' : undefined
              "
            >
              {{ med.status }}
            </span>
          </div>
          <p class="workspace-aux-med-spec">{{ med.spec }} · {{ med.frequency }}</p>
          <span class="workspace-aux-med-tag">{{ med.indication }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { OUTPATIENT_AUX_PANEL_DATA } from '../../../../data/outpatientData.js'
import AuxMiniLineChart from './AuxMiniLineChart.vue'
import AuxVoiceSession from './AuxVoiceSession.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => OUTPATIENT_AUX_PANEL_DATA,
  },
  voiceActive: {
    type: Boolean,
    default: false,
  },
  voicePaused: {
    type: Boolean,
    default: false,
  },
  voiceStopped: {
    type: Boolean,
    default: false,
  },
  transcriptLines: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['toggle-voice-pause', 'stop-voice'])

const lipidPadding = { top: 10, left: 8, right: 8, bottom: 8 }
const lipidHeight = 112
const lipidWidth = 280

const lipidTrendStroke = computed(() =>
  props.data.lipidTrend.abnormal ? '#ef4444' : '#8b5cf6'
)

const lipidValues = computed(() => props.data.lipidTrend.points.map((p) => p.value))

const lipidRange = computed(() => {
  const values = lipidValues.value
  const min = Math.min(...values, props.data.lipidTrend.target) - 0.3
  const max = Math.max(...values) + 0.3
  return { min, max }
})

const lipidCoords = computed(() => {
  const points = props.data.lipidTrend.points
  const innerW = lipidWidth - lipidPadding.left - lipidPadding.right
  const innerH = lipidHeight - lipidPadding.top - lipidPadding.bottom
  const { min, max } = lipidRange.value
  const count = Math.max(points.length - 1, 1)
  return points.map((point, idx) => {
    const ratio = (point.value - min) / (max - min || 1)
    return {
      x: lipidPadding.left + (innerW * idx) / count,
      y: lipidPadding.top + innerH * (1 - ratio),
    }
  })
})

const lipidLinePoints = computed(() =>
  lipidCoords.value.map((c) => `${c.x},${c.y}`).join(' ')
)

const lipidGridYs = computed(() => {
  const innerH = lipidHeight - lipidPadding.top - lipidPadding.bottom
  return [0, 1, 2].map((i) => lipidPadding.top + (innerH * i) / 2)
})

const lipidTargetY = computed(() => {
  const innerH = lipidHeight - lipidPadding.top - lipidPadding.bottom
  const { min, max } = lipidRange.value
  const target = props.data.lipidTrend.target
  const ratio = (target - min) / (max - min || 1)
  return lipidPadding.top + innerH * (1 - ratio)
})

</script>
