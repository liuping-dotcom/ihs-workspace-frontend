<template>
  <a-config-provider
    :theme="{
      token: {
        colorBgContainer: 'rgba(255, 255, 255, 0.4)',
        colorBgElevated: 'rgba(255, 255, 255, 0.6)',
        colorBorder: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 12,
        colorPrimary: '#2563eb', 
      },
    }"
  >
    <div class="ambient-bg min-h-screen flex flex-col overflow-hidden text-slate-800">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </a-config-provider>
</template>

<script setup>
// 组件逻辑已被完全抽离到 vue-router 和 Pinia
// 这里仅需引入 AntD 配置即可
</script>

<style scoped>
/* 简单的路由切换淡入淡出动画，替代旧代码的 animate-in 效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>