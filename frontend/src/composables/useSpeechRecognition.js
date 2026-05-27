import { ref, onMounted, onUnmounted } from 'vue'

const SPEECH_ERROR_MESSAGES = {
  'not-allowed': '麦克风权限被拒绝，请在浏览器地址栏允许麦克风访问。',
  'service-not-allowed': '当前环境不允许使用语音识别，请使用 HTTPS 或在 Chrome 中打开。',
  'no-speech': '未检测到语音，请靠近麦克风后重试。',
  'audio-capture': '无法访问麦克风，请检查设备连接。',
  network: '语音识别需要网络连接，请检查网络后重试。',
  aborted: '',
  'language-not-supported': '当前语言不受支持，已尝试使用中文识别。',
}

function getSpeechRecognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

/**
 * Chrome / Edge Web Speech API 封装（由 IHS顶层设计 useSpeechRecognition 迁移）
 */
export function useSpeechRecognition(options = {}) {
  const { lang = 'zh-CN', continuous = true, interimResults = true, onTranscript } = options

  const isListening = ref(false)
  const isSupported = ref(false)
  const error = ref(null)

  let recognition = null
  let baseText = ''

  const handleTranscript = (text) => {
    onTranscript?.(text)
  }

  onMounted(() => {
    const SpeechRecognition = getSpeechRecognitionCtor()
    isSupported.value = Boolean(SpeechRecognition)
    if (!SpeechRecognition) return

    recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      isListening.value = true
      error.value = null
    }

    recognition.onend = () => {
      isListening.value = false
    }

    recognition.onerror = (event) => {
      const code = event.error
      if (code === 'aborted') return
      const message = SPEECH_ERROR_MESSAGES[code] || `语音识别出错（${code}），请重试。`
      if (message) error.value = message
      isListening.value = false
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += piece
        } else {
          interimTranscript += piece
        }
      }
      handleTranscript(`${baseText}${finalTranscript}${interimTranscript}`)
    }
  })

  onUnmounted(() => {
    if (!recognition) return
    try {
      recognition.abort()
    } catch {
      // ignore
    }
    recognition = null
  })

  function start(base = '') {
    if (!recognition) {
      error.value = '当前浏览器不支持 Web Speech API，请使用 Chrome 或 Edge。'
      return
    }
    baseText = base
    error.value = null
    try {
      recognition.start()
    } catch {
      try {
        recognition.stop()
        recognition.start()
      } catch {
        error.value = '无法启动语音识别，请稍后重试。'
      }
    }
  }

  function stop() {
    if (!recognition) return
    try {
      recognition.stop()
    } catch {
      // ignore
    }
  }

  function toggle(base = '') {
    if (isListening.value) {
      stop()
    } else {
      start(base)
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    isListening,
    isSupported,
    error,
    start,
    stop,
    toggle,
    clearError,
  }
}
