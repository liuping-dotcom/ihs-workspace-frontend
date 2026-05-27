<template>
  <div class="outpatient-consultation animate-in-fade">
    <p v-if="title" class="mb-3 text-sm font-bold text-slate-700">{{ title }}</p>

    <div class="outpatient-consultation-shell" :class="shellVariantClass">
      <div class="outpatient-consultation-wave" aria-hidden>
        <span
          v-for="i in 8"
          :key="i"
          class="outpatient-consultation-wave-bar"
          :style="waveStyle(i)"
        />
      </div>

      <div
        ref="transcriptRef"
        class="custom-scrollbar max-h-[300px] space-y-4 overflow-y-auto p-6"
      >
        <div v-for="(line, idx) in visibleLines" :key="idx" class="flex gap-3">
          <div
            class="flex size-6 shrink-0 items-center justify-center rounded-full"
            :class="line.role === 'doctor' ? 'bg-blue-100' : 'bg-slate-100'"
          >
            <span class="text-xs font-bold" :class="line.role === 'doctor' ? 'text-blue-600' : ''">
              {{ line.role === 'doctor' ? '医' : '患' }}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <p
              class="mb-1 text-xs font-bold"
              :class="line.role === 'doctor' ? 'text-blue-600' : 'text-slate-500'"
            >
              {{ line.role === 'doctor' ? '医生' : '患者' }}
            </p>
            <p class="text-sm text-slate-700">
              {{ line.text }}
              <span
                v-if="idx === visibleLines.length - 1 && isRecording"
                class="ml-1 inline-block h-4 w-0.5 animate-pulse bg-blue-500 align-middle"
                aria-hidden
              />
            </p>
          </div>
        </div>
      </div>

      <div v-if="!frozen" class="outpatient-consultation-footer flex gap-4 p-4">
        <button type="button" class="outpatient-consultation-btn-secondary flex-1">
          继续问诊
        </button>
        <button
          type="button"
          class="outpatient-consultation-btn-primary flex-1"
          @click="emit('end-consultation')"
        >
          {{ endLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { DEFAULT_CONSULTATION_SCRIPT } from '../../../../data/outpatientData.js'

const props = defineProps({
  title: {
    type: String,
    default: '实时语音问诊转录中...',
  },
  script: {
    type: Array,
    default: () => DEFAULT_CONSULTATION_SCRIPT,
  },
  variant: {
    type: String,
    default: 'primary',
  },
  endLabel: {
    type: String,
    default: '结束问诊并生成诊疗方案',
  },
  frozen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['end-consultation', 'complete'])

const visibleLines = ref([])
const isRecording = ref(true)
const transcriptRef = ref(null)
let timers = []

const resolvedScript = computed(() =>
  Array.isArray(props.script) && props.script.length > 0 ? props.script : DEFAULT_CONSULTATION_SCRIPT
)

const shellVariantClass = computed(() =>
  props.variant === 'followup' ? 'outpatient-consultation-shell-followup' : ''
)

function waveStyle(i) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const h = 6 + ((i * 7) % 12)
  return {
    height: `${h}px`,
    animationDelay: `${i * 0.08}s`,
    backgroundColor: colors[i % colors.length],
  }
}

function clearTimers() {
  timers.forEach((t) => clearTimeout(t))
  timers = []
}

function freezeTranscript() {
  clearTimers()
  visibleLines.value = [...resolvedScript.value]
  isRecording.value = false
}

function startPlayback() {
  if (props.frozen) {
    freezeTranscript()
    return
  }

  clearTimers()
  visibleLines.value = []
  isRecording.value = true
  const staggerMs = 850
  const lines = resolvedScript.value

  lines.forEach((line, i) => {
    timers.push(
      setTimeout(() => {
        visibleLines.value = [...visibleLines.value, line]
        transcriptRef.value?.scrollTo({ top: transcriptRef.value.scrollHeight, behavior: 'smooth' })
      }, 200 + i * staggerMs)
    )
  })

  timers.push(
    setTimeout(() => {
      isRecording.value = false
      emit('complete')
    }, 200 + lines.length * staggerMs + 500)
  )
}

watch(
  () => [props.frozen, resolvedScript.value],
  ([frozen]) => {
    if (frozen) {
      freezeTranscript()
      return
    }
    startPlayback()
  },
  { immediate: true }
)

watch(
  () => props.frozen,
  (frozen) => {
    if (frozen) freezeTranscript()
  }
)

onUnmounted(clearTimers)
</script>
