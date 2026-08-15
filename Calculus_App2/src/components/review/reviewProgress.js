export const DEFAULT_MASTERY_THRESHOLDS = Object.freeze({
  mastered: 90,
  developing: 75,
})

function resolveThresholds(thresholds = {}) {
  return { ...DEFAULT_MASTERY_THRESHOLDS, ...thresholds }
}

export function getMasteryStatus({
  percent = 0,
  completed = 0,
  planned = false,
  thresholds,
} = {}) {
  const resolvedThresholds = resolveThresholds(thresholds)

  if (planned) return { key: 'planned', label: 'Planned' }
  if (completed <= 0) return { key: 'not-started', label: 'Not started' }
  if (percent >= resolvedThresholds.mastered) return { key: 'mastered', label: 'Mastered' }
  if (percent >= resolvedThresholds.developing) return { key: 'developing', label: 'Developing' }
  return { key: 'needs-review', label: 'Needs review' }
}

export function countCompleted(value) {
  if (typeof value === 'number') return Math.max(0, value)
  if (Array.isArray(value)) return value.filter(Boolean).length
  if (value && typeof value === 'object') return Object.values(value).filter(Boolean).length
  return 0
}

export function getModuleProgress(module, completedMaps = {}, questionTotals = {}) {
  const progressValue = completedMaps[module.progressKey] ?? completedMaps[module.id]
  const completed = countCompleted(progressValue)
  const suppliedTotal = questionTotals[module.progressKey] ?? questionTotals[module.id]
  const total = Math.max(0, Number(suppliedTotal ?? module.questionTotal) || 0)
  const boundedCompleted = Math.min(completed, total)
  const percent = total > 0 ? Math.round((boundedCompleted / total) * 100) : 0

  return { completed: boundedCompleted, total, percent }
}
