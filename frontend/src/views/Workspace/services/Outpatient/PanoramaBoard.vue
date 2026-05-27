<template>
  <div class="outpatient-panorama animate-in-fade">
    <div class="outpatient-microform-shell outpatient-microform-shell--panorama">
      <!-- 上：标题区 -->
      <header class="outpatient-panorama-header">
        <h4 class="outpatient-panorama-header-title">{{ formTitle }}</h4>
      </header>

      <!-- 中：内容区 -->
      <div
        class="outpatient-panorama-body"
        :class="{ 'outpatient-panorama-body--single': !hasSideColumns }"
      >
        <section class="outpatient-panorama-main" aria-label="体征与预问诊病历">
          <div class="outpatient-panorama-vitals">
            <div
              v-for="item in vitalItems"
              :key="item.key"
              class="outpatient-panorama-vital-item"
            >
              <span class="outpatient-panorama-vital-label">{{ item.label }}</span>
              <span
                v-if="item.bpParts"
                class="outpatient-panorama-vital-value"
              >
                <span
                  :class="{ 'outpatient-panorama-vital-value--alert': item.bpParts.systolicAlert }"
                >{{ item.bpParts.systolic }}</span><span class="outpatient-panorama-vital-value-sep">/</span><span
                  :class="{ 'outpatient-panorama-vital-value--alert': item.bpParts.diastolicAlert }"
                >{{ item.bpParts.diastolic }}</span>
              </span>
              <span
                v-else
                class="outpatient-panorama-vital-value"
                :class="{ 'outpatient-panorama-vital-value--alert': item.alert }"
              >
                {{ item.value }}
              </span>
              <span class="outpatient-panorama-vital-unit">{{ item.unit }}</span>
            </div>
          </div>

          <div class="outpatient-panorama-record">
            <p
              v-for="field in preConsultationFields"
              :key="field.key"
              class="outpatient-panorama-record-item"
            >
              <span class="outpatient-panorama-record-label">{{ field.label }}：</span>
              <span class="outpatient-panorama-record-text">{{ field.value }}</span>
            </p>
          </div>
        </section>

        <section
          v-if="hasVisitHistory"
          class="outpatient-panorama-visits"
          aria-label="历史就诊记录"
        >
          <p class="outpatient-panorama-visits-heading">历史就诊记录</p>
          <ul class="outpatient-panorama-visits-list">
            <li
              v-for="visit in visitHistory"
              :key="visit.id"
              class="outpatient-panorama-visit-item"
            >
              <p class="outpatient-panorama-visit-time">{{ visit.date }}</p>
              <p class="outpatient-panorama-visit-meta">
                {{ visit.department }} · {{ visit.hospital }}
              </p>
              <p class="outpatient-panorama-visit-diagnosis">{{ visit.diagnosis }}</p>
              <button
                type="button"
                class="outpatient-panorama-visit-view-btn"
                :disabled="frozen"
                @click="emit('view-visit', visit)"
              >
                查看
              </button>
            </li>
          </ul>
        </section>

        <section
          v-if="hasRecentReports"
          class="outpatient-panorama-reports"
          aria-label="近期医技报告"
        >
          <p class="outpatient-panorama-reports-heading">
            <FileTextOutlined aria-hidden />
            近期医技报告（近 3 个月）
            <span class="outpatient-panorama-reports-count">{{ recentReports.length }}</span>
          </p>
          <div
            class="outpatient-panorama-reports-tabs"
            role="tablist"
            aria-label="报告分类"
          >
            <button
              v-for="tab in REPORT_TABS"
              :key="tab.key"
              type="button"
              role="tab"
              class="outpatient-panorama-reports-tab"
              :class="{ 'outpatient-panorama-reports-tab--active': reportCategoryTab === tab.key }"
              :aria-selected="reportCategoryTab === tab.key"
              :disabled="frozen"
              @click="reportCategoryTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          <ul class="outpatient-panorama-reports-list">
            <li
              v-if="!filteredRecentReports.length"
              class="outpatient-panorama-reports-empty"
            >
              暂无{{ activeReportTabLabel }}报告
            </li>
            <li
              v-for="report in filteredRecentReports"
              :key="report.id ?? `${report.title}-${report.date}`"
              class="outpatient-panorama-report-card"
            >
              <div class="outpatient-panorama-report-head">
                <div class="min-w-0 flex-1">
                  <p class="outpatient-panorama-report-title">{{ report.title }}</p>
                  <p class="outpatient-panorama-report-date">{{ report.date }}</p>
                </div>
                <button
                  type="button"
                  class="outpatient-panorama-report-view-btn"
                  :disabled="frozen"
                  @click="handleViewReport(report)"
                >
                  查看
                </button>
              </div>
              <p
                v-if="getReportDisplaySummary(report)"
                class="outpatient-panorama-report-abnormal"
                :class="{ 'outpatient-panorama-report-abnormal--normal': !isReportAbnormal(report) }"
              >
                {{ getReportDisplaySummary(report) }}
              </p>
            </li>
          </ul>
        </section>
      </div>

      <!-- 下：按钮区 -->
      <footer class="outpatient-panorama-footer">
        <button
          type="button"
          class="outpatient-panorama-btn outpatient-panorama-btn--secondary"
          :disabled="frozen"
          @click="emit('refresh')"
        >
          <ReloadOutlined aria-hidden />
          刷新
        </button>
        <button
          type="button"
          class="outpatient-panorama-btn outpatient-panorama-btn--primary"
          :disabled="frozen"
          @click="emit('start-consultation')"
        >
          <AudioOutlined aria-hidden />
          开始语音问诊
        </button>
      </footer>
    </div>

    <LabReportDetailModal
      :open="reportModalOpen"
      :reports="profile.reports ?? []"
      :initial-report-id="initialReportId"
      :profile="profile"
      @close="closeReportModal"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FileTextOutlined, AudioOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import {
  DEFAULT_OUTPATIENT_PROFILE,
  OUTPATIENT_AUX_PANEL_DATA,
  PANORAMA_FORM_TITLE,
  filterRecentPanoramaReports,
  getLabReportDetail,
  getReportDisplaySummary,
} from '../../../../data/outpatientData.js'
import LabReportDetailModal from './LabReportDetailModal.vue'

const props = defineProps({
  profile: {
    type: Object,
    default: () => DEFAULT_OUTPATIENT_PROFILE,
  },
  frozen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: PANORAMA_FORM_TITLE,
  },
  visitHistory: {
    type: Array,
    default: () => OUTPATIENT_AUX_PANEL_DATA.visitHistory,
  },
})

const emit = defineEmits(['start-consultation', 'refresh', 'view-visit'])

const REPORT_TABS = [
  { key: 'all', label: '全部' },
  { key: 'lab', label: '检验' },
  { key: 'exam', label: '检查' },
]

const reportModalOpen = ref(false)
const initialReportId = ref(null)
const reportCategoryTab = ref('all')

const formTitle = computed(() => props.title || PANORAMA_FORM_TITLE)

function closeReportModal() {
  reportModalOpen.value = false
  initialReportId.value = null
}

const recentReports = computed(() =>
  filterRecentPanoramaReports(props.profile.reports ?? [])
)

const filteredRecentReports = computed(() => {
  if (reportCategoryTab.value === 'lab') {
    return recentReports.value.filter((report) => report.category === 'lab')
  }
  if (reportCategoryTab.value === 'exam') {
    return recentReports.value.filter((report) => report.category === 'exam')
  }
  return recentReports.value
})

const activeReportTabLabel = computed(
  () => REPORT_TABS.find((tab) => tab.key === reportCategoryTab.value)?.label ?? ''
)

const hasRecentReports = computed(() => recentReports.value.length > 0)
const hasVisitHistory = computed(() => (props.visitHistory ?? []).length > 0)
const hasSideColumns = computed(() => hasVisitHistory.value || hasRecentReports.value)

function parseBloodPressure(value) {
  const matched = String(value ?? '').match(/^(\d+)\s*\/\s*(\d+)/)
  if (!matched) return null
  const systolic = Number(matched[1])
  const diastolic = Number(matched[2])
  return {
    systolic: matched[1],
    diastolic: matched[2],
    systolicAlert: systolic >= 140,
    diastolicAlert: diastolic > 90,
  }
}

const vitalItems = computed(() => {
  const v = props.profile.vitals ?? {}
  const bpParts = parseBloodPressure(v.bloodPressure)
  return [
    { key: 'temperature', label: '体温', value: v.temperature ?? '—', unit: '℃', alert: false },
    { key: 'heartRate', label: '心率', value: v.heartRate ?? '—', unit: '次/分', alert: false },
    { key: 'respiration', label: '呼吸', value: v.respiration ?? '—', unit: '次/分', alert: false },
    {
      key: 'bloodPressure',
      label: '血压',
      value: v.bloodPressure ?? '—',
      unit: 'mmHg',
      alert: Boolean(bpParts?.systolicAlert || bpParts?.diastolicAlert),
      bpParts,
    },
  ]
})

const preConsultationFields = computed(() => {
  const record = props.profile.preConsultation ?? {}
  const legacy = props.profile
  const fields = [
    { key: 'chiefComplaint', label: '主诉', value: record.chiefComplaint ?? legacy.chiefComplaint },
    { key: 'presentIllness', label: '现病史', value: record.presentIllness },
    { key: 'pastHistory', label: '既往史', value: record.pastHistory ?? legacy.pastHistory },
    { key: 'familyHistory', label: '家族史', value: record.familyHistory },
    { key: 'allergyHistory', label: '过敏史', value: record.allergyHistory ?? legacy.allergy },
    { key: 'personalHistory', label: '个人史', value: record.personalHistory },
  ]
  return fields.filter((field) => Boolean(String(field.value ?? '').trim()))
})

function isReportAbnormal(report) {
  const detail = getLabReportDetail(report.labDetailId)
  if (detail?.items?.some((item) => item.tone === 'high' || item.tone === 'low')) {
    return true
  }
  return Boolean(report.abnormal)
}

function handleViewReport(report) {
  initialReportId.value = report.id
  reportModalOpen.value = true
}
</script>
