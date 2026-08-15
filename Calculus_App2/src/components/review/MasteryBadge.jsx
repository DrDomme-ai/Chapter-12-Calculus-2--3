import { DEFAULT_MASTERY_THRESHOLDS, getMasteryStatus } from './reviewProgress'

export default function MasteryBadge({
  percent = 0,
  completed = 0,
  planned = false,
  thresholds = DEFAULT_MASTERY_THRESHOLDS,
  showPercent = false,
}) {
  const status = getMasteryStatus({ percent, completed, planned, thresholds })
  const percentText = showPercent && !planned ? ` · ${percent}%` : ''

  return (
    <span className={`mastery-badge mastery-badge--${status.key}`} data-status={status.key}>
      <span className="mastery-badge__marker" aria-hidden="true" />
      {status.label}{percentText}
    </span>
  )
}
