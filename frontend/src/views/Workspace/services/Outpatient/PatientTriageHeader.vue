<template>
  <div class="outpatient-triage-header">
    <div class="outpatient-patient-info" aria-label="患者信息">
      <div class="outpatient-patient-avatar-wrap">
        <img
          :src="avatarUrl"
          :alt="`${profile.name} 头像`"
          class="outpatient-patient-avatar"
          @error="onAvatarError"
        />
      </div>
      <div class="outpatient-patient-info-text">
      <p class="outpatient-patient-info-line1">
        <span class="outpatient-patient-name">{{ profile.name }}</span>
        <span v-if="profile.patientLabels?.length" class="outpatient-patient-labels">
          <span
            v-for="label in profile.patientLabels"
            :key="label"
            class="outpatient-patient-label-chip"
            :class="labelChipClass(label)"
          >
            {{ label }}
          </span>
        </span>
      </p>
      <p class="outpatient-patient-info-line2">
        <template v-for="(item, index) in metaLineItems" :key="item.key">
          <span v-if="index > 0" class="outpatient-patient-meta-dot" aria-hidden>·</span>
          <span :class="item.className">{{ item.text }}</span>
        </template>
      </p>
      </div>
    </div>

    <div class="outpatient-triage-actions" role="group" aria-label="分诊操作">
      <button type="button" class="outpatient-triage-btn outpatient-triage-btn--recall" @click="$emit('recall')">
        重呼
      </button>
      <button type="button" class="outpatient-triage-btn outpatient-triage-btn--next" @click="$emit('next')">
        下一个
      </button>
      <button type="button" class="outpatient-triage-btn outpatient-triage-btn--cancel" @click="$emit('cancel')">
        取消就诊
      </button>
      <button type="button" class="outpatient-triage-btn outpatient-triage-btn--end" @click="$emit('end')">
        结束就诊
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  resolvePatientAvatarUrl,
  PATIENT_AVATAR_FALLBACK,
} from '../../../../utils/patientAvatar.js'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

defineEmits(['recall', 'next', 'cancel', 'end'])

const LABEL_CHIP_CLASS = {
  初诊: 'outpatient-patient-label-chip--visit',
  复诊: 'outpatient-patient-label-chip--visit',
  市医保: 'outpatient-patient-label-chip--insurance',
  高血压: 'outpatient-patient-label-chip--condition',
  脑卒中: 'outpatient-patient-label-chip--condition',
  癫痫: 'outpatient-patient-label-chip--condition',
  偏头痛: 'outpatient-patient-label-chip--condition',
  帕金森病: 'outpatient-patient-label-chip--condition',
  阿尔茨海默病: 'outpatient-patient-label-chip--condition',
}

function labelChipClass(label) {
  return LABEL_CHIP_CLASS[label] ?? 'outpatient-patient-label-chip--default'
}

const metaLineItems = computed(() => {
  const p = props.profile
  const allergyText = p.allergy ?? '无'
  return [
    p.gender && { key: 'gender', text: p.gender },
    p.age && { key: 'age', text: p.age },
    p.outpatientNo && { key: 'outpatientNo', text: `门诊号：${p.outpatientNo}` },
    p.idCard && { key: 'idCard', text: `身份证：${p.idCard}` },
    p.phone && { key: 'phone', text: `手机：${p.phone}` },
    {
      key: 'allergy',
      text: `过敏：${allergyText}`,
      className: allergyText !== '无' ? 'outpatient-patient-meta-allergy' : undefined,
    },
  ].filter(Boolean)
})

const avatarUrl = ref(
  resolvePatientAvatarUrl(props.profile.gender, props.profile.age)
)

watch(
  () => [props.profile.gender, props.profile.age],
  () => {
    avatarUrl.value = resolvePatientAvatarUrl(props.profile.gender, props.profile.age)
  }
)

function onAvatarError() {
  avatarUrl.value = PATIENT_AVATAR_FALLBACK
}
</script>
