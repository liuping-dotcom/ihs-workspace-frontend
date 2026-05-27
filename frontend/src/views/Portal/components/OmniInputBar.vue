<template>
  <div class="shrink-0 w-full">
    <form
      class="omni-cmd-form"
      :class="{
        'omni-cmd-form--dragging': isDragging,
        'omni-cmd-form--processing': isProcessing,
      }"
      @submit.prevent="handleSubmit"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover.prevent
      @drop="handleDrop"
    >
      <div v-if="isProcessing" class="omni-cmd-breathe-glow" aria-hidden />

      <div
        class="omni-cmd-textarea-area"
        :class="{ 'omni-cmd-textarea-area--listening': isListening }"
      >
        <textarea
          ref="textareaRef"
          v-model="text"
          rows="1"
          class="omni-cmd-textarea"
          :placeholder="isListening ? '正在聆听，请说话…' : PLACEHOLDER"
          :disabled="isProcessing"
          aria-label="智能指令输入"
          @keydown="handleKeyDown"
          @input="adjustTextareaHeight"
        />

        <div v-if="attachedFiles.length" class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="(file, index) in attachedFiles"
            :key="`${file.name}-${file.size}`"
            class="omni-cmd-file-chip"
          >
            <PaperClipOutlined class="shrink-0 text-[10px]" />
            <span class="truncate">{{ file.name }}</span>
            <button
              type="button"
              class="ml-0.5 text-slate-400 hover:text-rose-500"
              :aria-label="`移除 ${file.name}`"
              @click="removeFile(index)"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <div class="relative flex items-center justify-between gap-2 px-3 pb-2.5 pt-0">
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="omni-cmd-icon-btn"
            :class="{ 'omni-cmd-icon-btn--listening': isListening }"
            :disabled="!isSupported || isProcessing"
            :aria-label="isListening ? '停止语音输入' : '语音输入'"
            :aria-pressed="isListening"
            :title="
              !isSupported
                ? '请使用 Chrome 或 Edge 以启用语音输入'
                : isListening
                  ? '停止录音'
                  : '语音输入'
            "
            @click="handleMicClick"
          >
            <AudioMutedOutlined v-if="isListening" />
            <AudioOutlined v-else />
          </button>
          <button
            type="button"
            class="omni-cmd-icon-btn"
            :disabled="isProcessing"
            aria-label="上传附件"
            title="上传病历或附件"
            @click="fileInputRef?.click()"
          >
            <PaperClipOutlined />
          </button>
          <input
            ref="fileInputRef"
            type="file"
            multiple
            class="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dcm"
            @change="handleFileChange"
          />
        </div>

        <button
          type="submit"
          class="omni-cmd-submit-btn"
          :disabled="isProcessing || (!text.trim() && !attachedFiles.length)"
        >
          <template v-if="isProcessing">
            <ThunderboltOutlined class="animate-spin" />
            解析中
          </template>
          <template v-else>
            <SendOutlined />
            执行指令
          </template>
        </button>
      </div>
    </form>

    <p v-if="speechError" role="alert" class="mt-1.5 px-1 text-center text-[11px] text-red-600">
      {{ speechError }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import {
  AudioOutlined,
  AudioMutedOutlined,
  PaperClipOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../../../store/taskStore.js'
import { useSpeechRecognition } from '../../../composables/useSpeechRecognition.js'

const PLACEHOLDER = '你可以对我说"安排明天上午10点对14床的病例讨论"'

const taskStore = useTaskStore()
const { isPlanLoading } = storeToRefs(taskStore)

const text = ref('')
const isDragging = ref(false)
const attachedFiles = ref([])
const textareaRef = ref(null)
const fileInputRef = ref(null)
const dragCounter = ref(0)

const isProcessing = computed(() => isPlanLoading.value)

function adjustTextareaHeight() {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = 'auto'
  const maxHeight = 120
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
}

const {
  isListening,
  isSupported,
  error: speechError,
  toggle: toggleSpeech,
  stop: stopSpeech,
  clearError: clearSpeechError,
} = useSpeechRecognition({
  onTranscript: (transcript) => {
    text.value = transcript
    nextTick(() => adjustTextareaHeight())
  },
})

watch(text, () => {
  nextTick(() => adjustTextareaHeight())
})

onMounted(() => {
  adjustTextareaHeight()
})

function addFiles(fileList) {
  if (!fileList?.length) return
  const next = [...attachedFiles.value]
  Array.from(fileList).forEach((file) => {
    if (!next.some((f) => f.name === file.name && f.size === file.size)) {
      next.push(file)
    }
  })
  attachedFiles.value = next.slice(0, 5)
}

function handleSubmit(overrideText) {
  const payload = (overrideText ?? text.value).trim()
  if (!payload && !attachedFiles.value.length) return
  if (isListening.value) stopSpeech()

  taskStore.handleCommandSubmit(payload, [...attachedFiles.value])
  text.value = ''
  attachedFiles.value = []
  nextTick(() => adjustTextareaHeight())
}

function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

function handleMicClick() {
  clearSpeechError()
  toggleSpeech(text.value)
}

function handleDragEnter(e) {
  e.preventDefault()
  e.stopPropagation()
  dragCounter.value += 1
  isDragging.value = true
}

function handleDragLeave(e) {
  e.preventDefault()
  e.stopPropagation()
  dragCounter.value -= 1
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  dragCounter.value = 0
  isDragging.value = false
  addFiles(e.dataTransfer?.files)
}

function handleFileChange(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function removeFile(index) {
  attachedFiles.value = attachedFiles.value.filter((_, i) => i !== index)
}
</script>
