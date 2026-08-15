import MasteryBadge from './MasteryBadge'
import { DEFAULT_MASTERY_THRESHOLDS } from './reviewProgress'

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

export default function ReviewModuleCard({
  module,
  completed = 0,
  total = 0,
  onOpen,
  thresholds = DEFAULT_MASTERY_THRESHOLDS,
}) {
  const isPlanned = module.status === 'planned'
  const safeTotal = Math.max(0, Number(total) || 0)
  const safeCompleted = clamp(Number(completed) || 0, 0, safeTotal)
  const percent = safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0
  const moduleLabel = module.label || (module.number ? `Module ${module.number}` : 'Review module')
  const headingId = `review-module-${module.id}`

  const openModule = () => {
    if (!isPlanned && module.routeId) onOpen?.(module.routeId, module)
  }

  return (
    <article className={`review-module-card review-module-card--${isPlanned ? 'planned' : 'available'}`} aria-labelledby={headingId}>
      <header className="review-module-card__header">
        <span className="review-module-card__number">{moduleLabel}</span>
        <MasteryBadge
          percent={percent}
          completed={safeCompleted}
          planned={isPlanned}
          thresholds={thresholds}
        />
      </header>

      <div className="review-module-card__body">
        <h3 id={headingId}>{module.title}</h3>
        <p>{module.description}</p>
        {module.topics?.length > 0 && (
          <ul className="review-module-card__topics" aria-label={`${module.title} topics`}>
            {module.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        )}
      </div>

      <footer className="review-module-card__footer">
        {!isPlanned && (
          <div className="review-module-card__progress">
            <div className="review-module-card__progress-copy">
              <span>{safeCompleted} of {safeTotal} complete</span>
              <strong>{percent}%</strong>
            </div>
            <div
              className="review-module-card__track"
              role="progressbar"
              aria-label={`${module.title} progress`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={percent}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        <button
          className="review-module-card__action"
          type="button"
          disabled={isPlanned || !module.routeId}
          onClick={openModule}
        >
          {isPlanned ? 'Coming soon' : safeCompleted > 0 ? 'Continue module' : 'Start module'}
          {!isPlanned && <span aria-hidden="true"> →</span>}
        </button>
      </footer>
    </article>
  )
}
