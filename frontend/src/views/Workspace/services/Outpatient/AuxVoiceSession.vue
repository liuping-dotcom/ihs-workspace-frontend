<template>
  <div class="workspace-aux-voice-session">
    <section class="workspace-aux-card workspace-aux-voice-card">
      <h4 class="workspace-aux-section-title">语音录入</h4>
      <p class="workspace-aux-card-subtitle">{{ statusLabel }}</p>
      <div
        class="aux-voice-wave"
        :class="{
          'aux-voice-wave--paused': voicePaused || voiceStopped,
          'aux-voice-wave--stopped': voiceStopped,
        }"
        aria-hidden
      >
        <span
          v-for="i in barCount"
          :key="i"
          class="aux-voice-wave-bar"
          :style="{ animationDelay: `${(i % 7) * 0.08}s` }"
        />
      </div>
      <div class="aux-voice-controls">
        <button
          type="button"
          class="aux-voice-btn aux-voice-btn--secondary"
          :disabled="voiceStopped"
          @click="emit('toggle-pause')"
        >
          <PauseCircleOutlined v-if="!voicePaused" aria-hidden />
          <PlayCircleOutlined v-else aria-hidden />
          {{ voicePaused ? '继续' : '暂停' }}
        </button>
        <button
          type="button"
          class="aux-voice-btn aux-voice-btn--danger"
          :disabled="voiceStopped"
          @click="emit('stop')"
        >
          <StopOutlined aria-hidden />
          停止
        </button>
      </div>
    </section>

    <section class="workspace-aux-card workspace-aux-transcript-card">
      <h4 class="workspace-aux-section-title">语音实时转录</h4>
      <div ref="transcriptRef" class="aux-voice-transcript custom-scrollbar">
        <p v-if="!transcriptLines.length" class="aux-voice-transcript-empty">
          等待语音输入，转录内容将在此实时显示…
        </p>
        <div
          v-for="line in transcriptLines"
          :key="line.id"
          class="aux-voice-transcript-line"
          :class="
            line.role === 'doctor' ? 'aux-voice-transcript-line--doctor' : 'aux-voice-transcript-line--patient'
          "
        >
          <span class="aux-voice-transcript-role">
            {{ line.role === 'doctor' ? '医师' : '患者' }}
          </span>
          <p class="aux-voice-transcript-text">{{ line.text }}</p>
        </div>
        <p
          v-if="isListening"
          class="aux-voice-transcript-listening"
          aria-live="polite"
        >
          正在转录…
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { PauseCircleOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  voiceActive: {
    type: Boolean,
    default: true,
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

const emit = defineEmits(['toggle-pause', 'stop'])

const barCount = 28
const transcriptRef = ref(null)

const isListening = computed(
  () => props.voiceActive && !props.voicePaused && !props.voiceStopped
)

const statusLabel = computed(() => {
  if (props.voiceStopped) return '录入已结束'
  if (props.voicePaused) return '录入已暂停'
  return '正在采集医患对话'
})

watch(
  () => props.transcriptLines.length,
  () => {
    nextTick(() => {
      const el = transcriptRef.value
      if (el) el.scrollTop = el.scrollHeight
    })
  }
)
</script>
