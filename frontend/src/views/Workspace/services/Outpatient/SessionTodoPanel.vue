<template>
  <aside class="outpatient-todo-panel" aria-label="待处理事项">
    <header class="outpatient-todo-header">
      <span class="outpatient-todo-header-title">待处理事项</span>
      <span class="outpatient-todo-header-count">{{ items.length }}</span>
    </header>

    <div class="custom-scrollbar outpatient-todo-list">
      <article
        v-for="item in items"
        :key="item.id"
        class="outpatient-todo-card"
        :class="`outpatient-todo-card--${item.urgency}`"
      >
        <p class="outpatient-todo-card-title">{{ item.title }}</p>
        <p v-if="item.subtitle" class="outpatient-todo-card-subtitle">{{ item.subtitle }}</p>
        <div class="outpatient-todo-card-actions">
          <button
            type="button"
            class="outpatient-todo-action-btn outpatient-todo-action-btn--primary"
            @click="$emit('action', item, item.primaryAction.key)"
          >
            {{ item.primaryAction.label }}
          </button>
          <button
            type="button"
            class="outpatient-todo-action-btn"
            @click="$emit('action', item, item.secondaryAction.key)"
          >
            {{ item.secondaryAction.label }}
          </button>
        </div>
      </article>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['action'])
</script>
