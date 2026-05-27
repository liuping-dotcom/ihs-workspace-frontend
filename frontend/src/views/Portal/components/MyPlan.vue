<template>
  <section class="flex min-h-0 shrink-0 flex-col space-y-3" aria-labelledby="my-plans-heading">
    <h2 id="my-plans-heading" class="m-0 text-sm font-medium leading-none text-slate-800">我的计划</h2>
    <a-card
      v-if="taskStore.isPlanLoading"
      :bordered="false"
      class="rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur-xl"
      aria-busy="true"
    >
      <a-skeleton active :paragraph="{ rows: 2 }" />
      <p class="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
        <LoadingOutlined class="animate-spin" />
        Agent 正在识别意图、协调日程与整理资料...
      </p>
    </a-card>
    <a-list v-if="taskStore.plans.length" :data-source="taskStore.plans" :split="false">
      <template #renderItem="{ item: plan }">
        <a-list-item class="!border-none !px-0 !py-0 mb-3">
          <a-card
            :bordered="false"
            class="w-full rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur-xl"
          >
            <header class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <time class="text-sm font-semibold leading-none text-blue-600">{{ plan.scheduleTime }}</time>
              <a-tag color="blue" class="!m-0 shrink-0 !text-[10px]">{{ plan.statusLabel }}</a-tag>
            </header>
            <h3 class="mt-1.5 text-sm font-medium text-slate-800">{{ plan.title }}</h3>
            <div
              class="mt-3 flex w-full items-center justify-between rounded-lg bg-slate-50/50 p-2"
              role="status"
            >
              <div class="flex min-w-0 items-center space-x-2">
                <LoadingOutlined class="animate-spin text-blue-500" />
                <p class="truncate text-[11px] text-slate-500">{{ plan.activeTask }}</p>
              </div>
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <a-card
      v-else-if="!taskStore.isPlanLoading"
      :bordered="false"
      class="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <CalendarOutlined class="text-3xl text-slate-300" />
        <p class="max-w-[260px] text-center text-xs leading-relaxed text-slate-400">
          还没有计划，你可以在下方输入区进行创建
        </p>
      </div>
    </a-card>
  </section>
</template>

<script setup>
import { CalendarOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { useTaskStore } from '../../../store/taskStore.js'

const taskStore = useTaskStore()
</script>
