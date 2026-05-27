<template>
  <div 
    :class="[
      elevated ? 'glass-panel-elevated' : 'glass-panel',
      'transition-all duration-300 ease-out'
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  elevated: {
    type: Boolean,
    default: false
  }
})
</script>