<template>
  <div class="aux-mini-chart">
    <svg
      class="aux-mini-chart-svg"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="ariaLabel"
    >
      <line
        v-for="(y, idx) in gridYs"
        :key="`grid-${idx}`"
        :x1="padding.left"
        :y1="y"
        :x2="width - padding.right"
        :y2="y"
        class="aux-mini-chart-grid"
      />
      <template v-for="serie in series" :key="serie.key">
        <polyline
          :points="polylinePoints(serie.key)"
          fill="none"
          :stroke="serie.color"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          v-for="(point, idx) in points"
          :key="`${serie.key}-${idx}`"
          :cx="coords[idx].x"
          :cy="coordY(point[serie.key])"
          r="2.5"
          :fill="serie.color"
        />
      </template>
    </svg>
    <div class="aux-mini-chart-labels">
      <span v-for="(point, idx) in labelTicks" :key="idx">{{ point.date ?? point.label }}</span>
    </div>
    <div v-if="legend" class="aux-mini-chart-legend">
      <span v-for="serie in series" :key="serie.key" class="aux-mini-chart-legend-item">
        <i class="aux-mini-chart-legend-dot" :style="{ backgroundColor: serie.color }" />
        {{ serie.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  points: {
    type: Array,
    default: () => [],
  },
  series: {
    type: Array,
    default: () => [],
  },
  ariaLabel: {
    type: String,
    default: '趋势图',
  },
  legend: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
    default: 280,
  },
  height: {
    type: Number,
    default: 112,
  },
})

const padding = { top: 10, right: 8, bottom: 8, left: 8 }

const valueRange = computed(() => {
  const values = []
  props.points.forEach((point) => {
    props.series.forEach((serie) => {
      const v = Number(point[serie.key])
      if (!Number.isNaN(v)) values.push(v)
    })
  })
  if (!values.length) return { min: 0, max: 1 }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.12 || 4
  return { min: min - pad, max: max + pad }
})

const coords = computed(() => {
  const innerW = props.width - padding.left - padding.right
  const count = Math.max(props.points.length - 1, 1)
  return props.points.map((_, idx) => ({
    x: padding.left + (innerW * idx) / count,
  }))
})

const gridYs = computed(() => {
  const innerH = props.height - padding.top - padding.bottom
  return [0, 1, 2].map((i) => padding.top + (innerH * i) / 2)
})

const labelTicks = computed(() => {
  if (props.points.length <= 4) return props.points
  const picks = [0, Math.floor(props.points.length / 2), props.points.length - 1]
  return picks.map((i) => props.points[i])
})

function coordY(value) {
  const { min, max } = valueRange.value
  const innerH = props.height - padding.top - padding.bottom
  const ratio = (Number(value) - min) / (max - min || 1)
  return padding.top + innerH * (1 - ratio)
}

function polylinePoints(key) {
  return props.points
    .map((point, idx) => {
      const x = coords.value[idx]?.x ?? 0
      const y = coordY(point[key])
      return `${x},${y}`
    })
    .join(' ')
}
</script>
