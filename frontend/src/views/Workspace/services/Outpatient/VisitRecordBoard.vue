<template>
  <div class="outpatient-visit-record animate-in-fade">
    <div class="outpatient-microform-shell outpatient-microform-shell--visit-record">
      <header class="outpatient-panorama-header outpatient-microform-header--visit-record">
        <h4 class="outpatient-panorama-header-title">{{ headerTitle }}</h4>
      </header>

      <div class="outpatient-visit-record-emr">
        <p
          v-for="line in emrLines"
          :key="line.key"
          class="outpatient-visit-record-line"
          :class="{ 'outpatient-visit-record-line--block': line.multiline }"
        >
          <span class="outpatient-visit-record-label">{{ line.label }}：</span>
          <span class="outpatient-visit-record-value">{{ line.value }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  frozen: {
    type: Boolean,
    default: true,
  },
})

const headerTitle = computed(() => {
  const r = props.record
  return [r.title, r.visitDate, r.hospital, r.department].filter(Boolean).join(' · ')
})

function formatPhysicalExamLine(vitals) {
  const v = vitals ?? {}
  const parts = []
  if (v.temperature != null && v.temperature !== '') {
    parts.push(`体温：${v.temperature}℃`)
  }
  if (v.heartRate != null && v.heartRate !== '') {
    parts.push(`脉搏：${v.heartRate}次/分`)
  }
  if (v.respiration != null && v.respiration !== '') {
    parts.push(`呼吸：${v.respiration}次/分`)
  }
  if (v.bloodPressure != null && v.bloodPressure !== '') {
    parts.push(`血压：${v.bloodPressure}mmHg`)
  }
  return parts.join('，') || '—'
}

const emrLines = computed(() => {
  const r = props.record
  const lines = [
    { key: 'chiefComplaint', label: '主诉', value: r.chiefComplaint },
    { key: 'presentIllness', label: '现病史', value: r.presentIllness },
    { key: 'pastHistory', label: '既往史', value: r.pastHistory },
    { key: 'allergyHistory', label: '过敏史', value: r.allergyHistory },
    {
      key: 'physicalExam',
      label: '体格检查',
      value: r.physicalExamLine ?? formatPhysicalExamLine(r.vitals),
    },
    {
      key: 'auxiliaryExam',
      label: r.auxiliaryExamLabel ?? '辅助检查结果',
      value: r.auxiliaryExamText,
      multiline: true,
    },
    {
      key: 'outpatientDiagnosis',
      label: r.diagnosisLabel ?? '门诊诊断',
      value: r.outpatientDiagnosis ?? r.diagnosis,
      multiline: true,
    },
    {
      key: 'treatmentPlan',
      label: r.treatmentPlanLabel ?? '诊疗处理意见',
      value: r.treatmentPlan,
      multiline: true,
    },
    { key: 'precautions', label: '注意事项', value: r.precautions, multiline: true },
  ]
  return lines.filter((line) => Boolean(String(line.value ?? '').trim()))
})
</script>
