<template>
  <div class="glass-panel relative flex min-h-0 flex-1 flex-col overflow-hidden p-4">
    <ShareAltOutlined
      class="pointer-events-none absolute -right-6 -top-6 text-[120px] text-indigo-500 opacity-10"
      aria-hidden
    />

    <header class="relative z-10 mb-3 flex shrink-0 items-center justify-between gap-2">
      <div class="flex min-w-0 items-center gap-2">
        <DeploymentUnitOutlined class="shrink-0 text-lg leading-none text-indigo-600" aria-hidden />
        <h3 class="m-0 truncate text-sm font-bold text-slate-800">私域图谱与知识萃取</h3>
      </div>
      <button
        type="button"
        class="shrink-0 rounded border border-slate-200 bg-white/60 px-2 py-1 text-[10px] text-slate-600 transition hover:bg-white/80"
        @click="handleOpenObsidian"
      >
        打开 Obsidian
      </button>
    </header>

    <div class="custom-scrollbar relative z-10 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
      <!-- 模块 A：知识引擎巡航中 -->
      <section>
        <div class="mb-2 flex items-center justify-between gap-2">
          <p class="m-0 text-xs font-semibold text-slate-700">知识引擎巡航中</p>
          <span class="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
            实时采集
          </span>
        </div>
        <div class="glass-subcard space-y-2 border-emerald-100/50 bg-emerald-50/30 p-2.5">
          <div class="flex items-center gap-2 text-xs text-slate-700">
            <WechatOutlined class="shrink-0 text-base text-emerald-600" aria-hidden />
            <span>正在轮询：心血管时间</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-700">
            <GlobalOutlined class="shrink-0 text-base text-sky-600" aria-hidden />
            <span>正在轮询：NEJM Cardiology</span>
          </div>
        </div>
      </section>

      <!-- 模块 B：最新结构化卡片 -->
      <section>
        <p class="portal-left-section-label mb-2">最新结构化卡片</p>
        <ul class="space-y-2">
          <li
            v-for="card in structuredCards"
            :key="card.id"
            class="glass-card cursor-pointer p-2.5 transition-transform hover:-translate-y-px"
          >
            <span
              class="mb-1.5 inline-block rounded-md border border-white/60 bg-white/50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600"
            >
              {{ card.tag }}
            </span>
            <p class="text-xs font-semibold leading-snug text-slate-800">{{ card.title }}</p>
            <p
              class="mt-2 flex items-center gap-1 text-[10px]"
              :class="card.extracting ? 'text-indigo-600' : 'text-slate-500'"
            >
              <SyncOutlined v-if="card.extracting" spin class="shrink-0" aria-hidden />
              <NodeIndexOutlined v-else class="shrink-0" aria-hidden />
              {{ card.statusText }}
            </p>
          </li>
        </ul>
      </section>

      <!-- 模块 C：图谱规模概览 -->
      <section>
        <p class="portal-left-section-label mb-2">图谱规模概览</p>
        <div class="flex gap-2">
          <div class="glass-subcard flex flex-1 flex-col items-center justify-center p-2 text-center">
            <p class="text-lg font-bold tabular-nums text-slate-800">1,248</p>
            <p class="text-[10px] text-slate-500">知识卡片数</p>
          </div>
          <div class="glass-subcard flex flex-1 flex-col items-center justify-center p-2 text-center">
            <p class="text-lg font-bold tabular-nums text-slate-800">3,592</p>
            <p class="text-[10px] text-slate-500">语义连接数</p>
          </div>
        </div>
      </section>
    </div>

    <footer class="relative z-10 mt-auto border-t border-white/40 pt-3">
      <div class="glass-input-bar !border-white/80 !shadow-none flex items-center gap-2 p-1 pr-1.5">
        <input
          v-model="linkInput"
          type="text"
          class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400"
          placeholder="粘贴文章/公众号链接进行萃取..."
          @keydown.enter.prevent="handleExtract"
        />
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white shadow-sm transition hover:bg-indigo-600 active:scale-95"
          aria-label="开始萃取"
          @click="handleExtract"
        >
          <ArrowUpOutlined class="text-sm" aria-hidden />
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  DeploymentUnitOutlined,
  ShareAltOutlined,
  WechatOutlined,
  GlobalOutlined,
  NodeIndexOutlined,
  SyncOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons-vue'
import { useTaskStore } from '../../../store/taskStore.js'

const taskStore = useTaskStore()
const linkInput = ref('')

const structuredCards = [
  {
    id: 'card-1',
    tag: '概念解析',
    title: 'HFrEF 治疗中 ARNI 替代 ACEI 的血流动力学优势机制',
    extracting: false,
    statusText: '已链接至 3 个本体节点',
  },
  {
    id: 'card-2',
    tag: '指南更新',
    title: '2024 ESC 心衰指南：SGLT2i 在 HFpEF 中的证据等级与适用边界',
    extracting: false,
    statusText: '已链接至 5 个本体节点',
  },
  {
    id: 'card-3',
    tag: '文献速览',
    title: 'EMPEROR-Preserved 亚组：肾功能分层下的心血管结局',
    extracting: true,
    statusText: 'Claude 正在抽提卡片...',
  },
]

function handleOpenObsidian() {
  taskStore.showPortalToast('正在打开 Obsidian 私域库（演示）')
}

function handleExtract() {
  const url = linkInput.value.trim()
  if (!url) {
    taskStore.showPortalToast('请粘贴文章或公众号链接', 'warn')
    return
  }
  taskStore.showPortalToast('已提交萃取任务，Claude 正在结构化卡片…')
  linkInput.value = ''
}
</script>
