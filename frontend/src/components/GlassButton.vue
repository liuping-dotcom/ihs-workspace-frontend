<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/50 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-md transition-all duration-200 hover:bg-white/80 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<script setup>
</script>