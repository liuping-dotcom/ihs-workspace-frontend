import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useMeStore = defineStore('me', () => {
  // 对应旧代码的 activeScenarios
  const activeScenarios = reactive({
    '住院主任': true,
    '门诊专家': true,
    '手术专家': true,
    '科室主任': true,
    '副院长': true,
    '科研组组长': false,
  })

  const toggleScenario = (role) => {
    if (role in activeScenarios) {
      activeScenarios[role] = !activeScenarios[role]
    }
  }

  return {
    activeScenarios,
    toggleScenario
  }
})