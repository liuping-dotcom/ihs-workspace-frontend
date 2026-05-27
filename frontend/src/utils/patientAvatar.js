/** 根据年龄（岁）映射 public/avatars 文件名中的年龄段 */
export function resolveAgeGroup(age) {
  const years = parsePatientAge(age)
  if (years <= 1) return '婴儿'
  if (years <= 6) return '幼儿'
  if (years <= 14) return '儿童'
  if (years <= 35) return '青年'
  if (years <= 59) return '中年'
  return '老年'
}

export function parsePatientAge(age) {
  if (typeof age === 'number' && !Number.isNaN(age)) return age
  const matched = String(age ?? '').match(/\d+/)
  return matched ? Number(matched[0]) : 40
}

/**
 * @param {string} gender 男 | 女
 * @param {number | string} age 58 或 "58岁"
 * @returns {string} 指向 public/avatars 的 URL
 */
export function resolvePatientAvatarUrl(gender, age) {
  const normalizedGender = gender === '女' ? '女' : gender === '男' ? '男' : null
  const filename = normalizedGender
    ? `${normalizedGender}_${resolveAgeGroup(age)}.jpg`
    : '中性.jpg'
  return `/avatars/${encodeURIComponent(filename)}`
}

export const PATIENT_AVATAR_FALLBACK = `/avatars/${encodeURIComponent('中性.jpg')}`
