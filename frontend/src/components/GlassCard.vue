<template>
  <div 
    class="glass-panel p-5 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
// 如果未来卡片需要支持点击事件，透传机制会自动将 @click 绑定到根 div 上
</script>