<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="lab-report-modal fixed inset-0 z-[260] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div
        class="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
        aria-hidden
        @click="emit('close')"
      />

      <div
        class="lab-report-modal-panel relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        @click.stop
      >
        <header class="lab-report-modal-toolbar flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 :id="titleId" class="m-0 text-base font-semibold text-slate-800">医技报告</h2>
          <button
            type="button"
            class="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="关闭"
            @click="emit('close')"
          >
            <CloseOutlined />
          </button>
        </header>

        <div class="flex min-h-0 flex-1">
          <aside class="lab-report-modal-aside flex w-[220px] shrink-0 flex-col border-r border-slate-200 bg-slate-50/80 sm:w-[240px]">
            <div class="lab-report-modal-tabs" role="tablist" aria-label="报告分类">
              <button
                v-for="tab in REPORT_TABS"
                :key="tab.key"
                type="button"
                role="tab"
                class="lab-report-modal-tab"
                :class="{ 'lab-report-modal-tab--active': activeTab === tab.key }"
                :aria-selected="activeTab === tab.key"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>

            <ul class="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
              <li v-if="!filteredReports.length" class="px-2 py-6 text-center text-xs text-slate-400">
                暂无报告
              </li>
              <li v-for="report in filteredReports" :key="report.id">
                <button
                  type="button"
                  class="lab-report-modal-list-item"
                  :class="{ 'lab-report-modal-list-item--active': report.id === selectedReportId }"
                  @click="selectedReportId = report.id"
                >
                  <span class="lab-report-modal-list-title">{{ report.title }}</span>
                  <span class="lab-report-modal-list-date">{{ report.date }}</span>
                  <span
                    v-if="listReportSummary(report)"
                    class="lab-report-modal-list-summary"
                    :class="{ 'lab-report-modal-list-summary--alert': listReportAbnormal(report) }"
                  >
                    {{ listReportSummary(report) }}
                  </span>
                </button>
              </li>
            </ul>
          </aside>

          <div class="custom-scrollbar min-w-0 flex-1 overflow-y-auto bg-slate-100/80 p-4 sm:p-6">
            <template v-if="selectedReport && labDetail">
              <article class="lab-report-sheet mx-auto max-w-[820px]">
                <div class="lab-report-sheet-title-wrap">
                  <h3 class="lab-report-sheet-title">{{ labDetail.hospitalName }}检验报告单</h3>
                  <p class="lab-report-sheet-subtitle">{{ labDetail.hospitalNameEn }}</p>
                  <div class="lab-report-sheet-qr">
                    <img
                      v-if="qrCodeDataUrl"
                      :src="qrCodeDataUrl"
                      class="lab-report-sheet-qr-img"
                      alt="报告二维码"
                    />
                  </div>
                </div>

                <dl class="lab-report-sheet-meta-grid lab-report-sheet-meta-grid--matrix">
                  <template v-for="(field, index) in labMetaFieldsMatrix" :key="field.key ?? index">
                    <div v-if="field.empty" class="lab-report-sheet-meta-item--empty" aria-hidden="true" />
                    <div v-else class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">{{ field.label }}</dt>
                      <dd class="lab-report-sheet-meta-value">{{ field.value }}</dd>
                    </div>
                  </template>
                </dl>

                <table class="lab-report-sheet-table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>检验项目</th>
                      <th>结果</th>
                      <th>单位</th>
                      <th>参考区间</th>
                      <th>判定</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in labDetail.items"
                      :key="item.no"
                      :class="[
                        item.emphasis ? 'lab-report-sheet-row--emphasis' : '',
                        item.tone === 'high' ? 'lab-report-sheet-row--high' : '',
                        item.tone === 'low' ? 'lab-report-sheet-row--low' : '',
                      ]"
                    >
                      <td>{{ item.no }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.result }}</td>
                      <td>{{ item.unit }}</td>
                      <td>{{ item.refRange }}</td>
                      <td>
                        <span
                          class="lab-report-sheet-judgment"
                          :class="`lab-report-sheet-judgment--${item.tone}`"
                        >
                          {{ item.judgment }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <footer class="lab-report-sheet-footer">
                  <dl class="lab-report-sheet-footer-grid">
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">检测仪器</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.instrument }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">采样地点</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.sampleLocation }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">检验者</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.tester }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">审核者</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.reviewer }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">申请时间</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.times.requested }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">采样时间</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.times.sampled }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">接收时间</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.times.received }}</dd>
                    </div>
                    <div class="lab-report-sheet-meta-item">
                      <dt class="lab-report-sheet-meta-label">报告时间</dt>
                      <dd class="lab-report-sheet-meta-value">{{ labDetail.times.reported }}</dd>
                    </div>
                  </dl>
                  <p class="lab-report-sheet-notes-inline">
                    {{ labDetail.notes.join('　') }}
                  </p>
                </footer>
              </article>
            </template>

            <article
              v-else-if="selectedReport && ecgDetail"
              class="ecg-holter-sheet mx-auto max-w-[820px]"
            >
              <header class="ecg-holter-sheet-head">
                <h3 class="ecg-holter-sheet-hospital">{{ ecgDetail.hospitalName }}</h3>
                <h4 class="ecg-holter-sheet-title">{{ ecgDetail.reportTitle }}</h4>
              </header>

              <dl class="ecg-holter-sheet-patient">
                <div class="ecg-holter-sheet-patient-item">
                  <dt>姓名</dt>
                  <dd>{{ patient.name }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>性别</dt>
                  <dd>{{ patient.gender }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>年龄</dt>
                  <dd>{{ patient.age }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>科室</dt>
                  <dd>{{ ecgDetail.department }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>病例号</dt>
                  <dd>{{ patient.outpatientNo }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>日期</dt>
                  <dd>{{ ecgDetail.reportDate }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>开始</dt>
                  <dd>{{ ecgDetail.startTime }}</dd>
                </div>
                <div class="ecg-holter-sheet-patient-item">
                  <dt>有效时长</dt>
                  <dd>{{ ecgDetail.effectiveDuration }}</dd>
                </div>
              </dl>

              <div class="ecg-holter-sheet-grid">
                <section class="ecg-holter-panel">
                  <h5 class="ecg-holter-panel-title">心率</h5>
                  <dl class="ecg-holter-panel-body">
                    <div class="ecg-holter-stat">
                      <dt>平均心率</dt>
                      <dd>{{ ecgDetail.heartRate.average }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>最低心率</dt>
                      <dd>
                        {{ ecgDetail.heartRate.minimum.value }}
                        <span class="ecg-holter-stat-note">(于{{ ecgDetail.heartRate.minimum.at }}发生)</span>
                      </dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>最高心率</dt>
                      <dd>
                        {{ ecgDetail.heartRate.maximum.value }}
                        <span class="ecg-holter-stat-note">(于{{ ecgDetail.heartRate.maximum.at }}发生)</span>
                      </dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>总心搏数</dt>
                      <dd>{{ formatCount(ecgDetail.heartRate.totalBeats) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>异常心搏数</dt>
                      <dd>{{ formatCount(ecgDetail.heartRate.abnormalBeats) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>异常心搏数千分比</dt>
                      <dd>{{ ecgDetail.heartRate.abnormalPermille }}‰</dd>
                    </div>
                  </dl>
                </section>

                <section class="ecg-holter-panel">
                  <h5 class="ecg-holter-panel-title">停搏时间</h5>
                  <p class="ecg-holter-panel-text">
                    R-R间期大于 2000 ms 的停搏发生次数：{{ ecgDetail.pause.rrOver2000Count }}
                  </p>
                </section>

                <section class="ecg-holter-panel">
                  <h5 class="ecg-holter-panel-title">室上性早搏</h5>
                  <dl class="ecg-holter-panel-body">
                    <div class="ecg-holter-stat">
                      <dt>室上性总数</dt>
                      <dd>{{ formatCount(ecgDetail.sve.total) }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>单发</dt>
                      <dd>{{ formatCount(ecgDetail.sve.single) }} SVE</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>室上性成对数</dt>
                      <dd>
                        {{ ecgDetail.sve.pairs.episodes }}（总计：{{ formatCount(ecgDetail.sve.pairs.beats) }} SVE）
                      </dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>二联律总数</dt>
                      <dd>{{ ecgDetail.sve.bigeminy }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>三联律总数</dt>
                      <dd>{{ ecgDetail.sve.trigeminy }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>室上速总数</dt>
                      <dd>
                        {{ ecgDetail.sve.svt.episodes }}（总计：{{ formatCount(ecgDetail.sve.svt.beats) }} SVE，历时{{ ecgDetail.sve.svt.durationSec }}秒）
                      </dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>室上性千分比</dt>
                      <dd>{{ ecgDetail.sve.permille }}‰</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>1分钟最大室上性数</dt>
                      <dd>{{ ecgDetail.sve.maxPerMinute }}</dd>
                    </div>
                  </dl>
                </section>

                <section class="ecg-holter-panel">
                  <h5 class="ecg-holter-panel-title">室性早搏</h5>
                  <dl class="ecg-holter-panel-body">
                    <div class="ecg-holter-stat">
                      <dt>室性总数</dt>
                      <dd>{{ formatCount(ecgDetail.ve.total) }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>单发</dt>
                      <dd>{{ formatCount(ecgDetail.ve.single) }} VE</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>室性成对数</dt>
                      <dd>
                        {{ ecgDetail.ve.pairs.episodes }}（总计：{{ formatCount(ecgDetail.ve.pairs.beats) }} VE）
                      </dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>二联律总数</dt>
                      <dd>{{ ecgDetail.ve.bigeminy }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>三联律总数</dt>
                      <dd>{{ ecgDetail.ve.trigeminy }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--indent">
                      <dt>室速总数</dt>
                      <dd>{{ ecgDetail.ve.vt.episodes }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>室性千分比</dt>
                      <dd>{{ ecgDetail.ve.permille }}‰</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>1分钟最大室性数</dt>
                      <dd>{{ ecgDetail.ve.maxPerMinute }}</dd>
                    </div>
                  </dl>
                </section>

                <section class="ecg-holter-panel">
                  <h5 class="ecg-holter-panel-title">心率变异性（时域）</h5>
                  <dl class="ecg-holter-panel-body ecg-holter-panel-body--cols">
                    <div class="ecg-holter-stat">
                      <dt>SDNN (ms)</dt>
                      <dd>{{ ecgDetail.hrvTime.sdnn }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>SDANN (ms)</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvTime.sdann) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>rMSSD (ms)</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvTime.rmssd) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>PNN50 (%)</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvTime.pnn50) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>CV</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvTime.cv) }}</dd>
                    </div>
                    <div class="ecg-holter-stat ecg-holter-stat--full">
                      <dt>正常范围</dt>
                      <dd>{{ ecgDetail.hrvTime.sdnnRef }} ms</dd>
                    </div>
                  </dl>
                </section>

                <section class="ecg-holter-panel">
                  <h5 class="ecg-holter-panel-title">心率变异性（频域）<span class="ecg-holter-panel-unit">(单位: ms*ms)</span></h5>
                  <dl class="ecg-holter-panel-body ecg-holter-panel-body--cols">
                    <div class="ecg-holter-stat">
                      <dt>总功率</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvFreq.totalPower) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>ULF</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvFreq.ulf) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>VLF</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvFreq.vlf) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>LF</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvFreq.lf) }}</dd>
                    </div>
                    <div class="ecg-holter-stat">
                      <dt>HF</dt>
                      <dd>{{ formatOptional(ecgDetail.hrvFreq.hf) }}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <section class="ecg-holter-conclusion">
                <h5 class="ecg-holter-conclusion-title">结论</h5>
                <ol class="ecg-holter-conclusion-list">
                  <li v-for="(line, index) in ecgDetail.conclusions" :key="index">{{ line }}</li>
                </ol>
              </section>

              <footer class="ecg-holter-sheet-footer">
                <span>操作者：{{ ecgDetail.operators.operator }}</span>
                <span>报告医生：{{ ecgDetail.operators.reporter }}</span>
                <span>审核医生：{{ ecgDetail.operators.reviewer }}</span>
              </footer>
            </article>

            <article
              v-else-if="selectedReport"
              class="lab-report-exam-sheet mx-auto max-w-[820px]"
            >
              <div class="lab-report-exam-sheet-head">
                <h3 class="lab-report-exam-sheet-title">{{ selectedReport.title }}</h3>
                <p class="lab-report-exam-sheet-meta">
                  <span>报告日期：{{ selectedReport.date }}</span>
                  <span>类型：{{ categoryLabel(selectedReport.category) }}</span>
                </p>
              </div>
              <section class="lab-report-exam-sheet-body">
                <h4 class="lab-report-exam-sheet-section-title">检查所见 / 结论</h4>
                <p class="lab-report-exam-sheet-content">
                  {{ selectedReport.abnormalSummary || '暂无详细报告内容。' }}
                </p>
              </section>
              <p class="lab-report-exam-sheet-footnote">
                患者：{{ patient.name }} · {{ patient.gender }} · {{ patient.age }} · 门诊号 {{ patient.outpatientNo }}
              </p>
            </article>

            <div v-else class="flex h-full min-h-[320px] items-center justify-center text-sm text-slate-400">
              请从左侧选择报告
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { CloseOutlined } from '@ant-design/icons-vue'
import {
  getExamReportDetail,
  getLabReportDetail,
  getReportDisplaySummary,
} from '../../../../data/outpatientData.js'

const REPORT_TABS = [
  { key: 'all', label: '全部' },
  { key: 'lab', label: '检验' },
  { key: 'exam', label: '检查' },
]

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  reports: {
    type: Array,
    default: () => [],
  },
  initialReportId: {
    type: String,
    default: null,
  },
  profile: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

const titleId = 'lab-report-detail-title'
const activeTab = ref('all')
const selectedReportId = ref(null)
const qrCodeDataUrl = ref('')

const sortedReports = computed(() =>
  [...props.reports].sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
)

const filteredReports = computed(() => {
  if (activeTab.value === 'lab') {
    return sortedReports.value.filter((r) => r.category === 'lab')
  }
  if (activeTab.value === 'exam') {
    return sortedReports.value.filter((r) => r.category === 'exam')
  }
  return sortedReports.value
})

const selectedReport = computed(
  () => sortedReports.value.find((r) => r.id === selectedReportId.value) ?? null
)

const labDetail = computed(() => getLabReportDetail(selectedReport.value?.labDetailId))

const ecgDetail = computed(() => getExamReportDetail(selectedReport.value?.examDetailId))

const patient = computed(() => ({
  name: props.profile?.name ?? '—',
  gender: props.profile?.gender ?? '—',
  age: props.profile?.age ?? '—',
  outpatientNo: props.profile?.outpatientNo ?? '—',
  diagnosis: props.profile?.diagnosis ?? '—',
}))

const labMetaFieldsMatrix = computed(() => {
  const detail = labDetail.value
  if (!detail) return []
  const p = patient.value
  const diagnosis = detail.clinicalDiagnosis ?? p.diagnosis
  const fields = [
    { key: 'name', label: '姓名', value: p.name },
    { key: 'gender', label: '性别', value: p.gender },
    { key: 'age', label: '年龄', value: p.age },
    { key: 'outpatientNo', label: '卡号/病案号', value: p.outpatientNo },
    { key: 'specimenNo', label: '标本编号', value: detail.specimenNo },
    { key: 'serialNo', label: '流水号', value: detail.serialNo },
    { key: 'department', label: '送检科室', value: detail.department },
    { key: 'category', label: '检验项目', value: detail.categoryLabel },
    { key: 'executionDept', label: '执行科室', value: detail.executionDept },
    { key: 'specimenType', label: '标本类型', value: detail.specimenType },
    { key: 'doctor', label: '申请医生', value: detail.requestingDoctor },
    { key: 'diagnosis', label: '临床诊断', value: diagnosis },
    { key: 'ward', label: '病房', value: detail.ward },
    { key: 'bedNo', label: '床号', value: detail.bedNo },
  ]
  const cells = [...fields]
  while (cells.length < 16) {
    cells.push({ key: `empty-${cells.length}`, empty: true })
  }
  return cells
})

function listReportSummary(report) {
  return getReportDisplaySummary(report)
}

function listReportAbnormal(report) {
  const detail = getLabReportDetail(report.labDetailId)
  if (detail?.items?.some((item) => item.tone === 'high' || item.tone === 'low')) {
    return true
  }
  return Boolean(report.abnormal)
}

async function refreshQrCode() {
  const detail = labDetail.value
  const report = selectedReport.value
  if (!detail || !report) {
    qrCodeDataUrl.value = ''
    return
  }
  const payload =
    detail.qrPayload ??
    `${detail.hospitalName}|${detail.categoryLabel}|${report.id}|${detail.serialNo}`
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(payload, {
      width: 88,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
  } catch {
    qrCodeDataUrl.value = ''
  }
}

function categoryLabel(category) {
  if (category === 'lab') return '检验'
  if (category === 'exam') return '检查'
  return '其他'
}

function formatCount(value) {
  if (value == null || value === '') return '—'
  return Number(value).toLocaleString('zh-CN')
}

function formatOptional(value) {
  if (value == null || value === '' || value === 0) return '—'
  return value
}

function syncSelectionToFilter() {
  const list = filteredReports.value
  if (!list.length) {
    selectedReportId.value = null
    return
  }
  if (!list.some((r) => r.id === selectedReportId.value)) {
    selectedReportId.value = list[0].id
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    activeTab.value = 'all'
    const preferred = props.initialReportId
    const exists = sortedReports.value.some((r) => r.id === preferred)
    selectedReportId.value = exists ? preferred : sortedReports.value[0]?.id ?? null
  }
)

watch(activeTab, syncSelectionToFilter)

watch(filteredReports, syncSelectionToFilter)

watch(
  [labDetail, selectedReport],
  () => {
    refreshQrCode()
  },
  { immediate: true }
)
</script>
