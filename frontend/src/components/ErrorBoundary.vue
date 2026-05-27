<template>
  <div 
    v-if="hasError" 
    class="ambient-bg fixed inset-0 flex flex-col items-center justify-center p-6 text-center z-[999]"
  >
    <div class="glass-panel-elevated p-8 max-w-md border-red-200/50 bg-white/60">
      <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mx-auto mb-4">
        ⚠️
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-2">工作站组件加载异常</h3>
      <p class="text-sm text-slate-500 mb-6">
        系统捕获到临床模块局部运行时错误。双端数据已安全暂存，请尝试刷新。
      </p>
      <div class="flex gap-3 justify-center">
        <button 
          @click="handleRetry" 
          class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-blue-700 transition-colors"
        >
          重试恢复
        </button>
      </div>
    </div>
  </div>
  
  <slot v-else></slot>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorLog = ref(null)

// 核心：捕获子孙组件的错误
onErrorCaptured((err, instance, info) => {
  console.error('IHS Error Boundary Caught:', err, info)
  hasError.value = true
  errorLog.value = err
  
  // 返回 false 阻止错误继续向上传播到 window
  return false
})

const handleRetry = () => {
  hasError.value = false
  errorLog.value = null
  // 刷新当前路由或尝试重新跑生命周期
  window.location.reload()
}
</script>