import { getReviewCatalog } from '../../data/reviewCatalog'
import MasteryBadge from './MasteryBadge'
import ReviewModuleCard from './ReviewModuleCard'
import { DEFAULT_MASTERY_THRESHOLDS, getModuleProgress } from './reviewProgress'

function ModuleSection({ id, eyebrow, title, description, modules, progressById, onOpenModule, thresholds }) {
  if (!modules?.length) return null

  return (
    <section className="review-dashboard__section" aria-labelledby={id}>
      <header className="review-dashboard__section-header">
        <div>
          {eyebrow && <p className="review-dashboard__section-eyebrow">{eyebrow}</p>}
          <h2 id={id}>{title}</h2>
        </div>
        {description && <p>{description}</p>}
      </header>
      <div className="review-dashboard__grid">
        {modules.map((module) => {
          const moduleProgress = progressById[module.id]
          return (
            <ReviewModuleCard
              key={module.id}
              module={module}
              completed={moduleProgress.completed}
              total={moduleProgress.total}
              onOpen={onOpenModule}
              thresholds={thresholds}
            />
          )
        })}
      </div>
    </section>
  )
}

export default function ReviewDashboard({
  courseId = 'calc2',
  catalog: catalogOverride,
  completedMaps = {},
  progress,
  questionTotals = {},
  thresholds = DEFAULT_MASTERY_THRESHOLDS,
  onOpenModule,
  onContinue,
  continueLabel,
}) {
  const catalog = catalogOverride || getReviewCatalog(courseId)
  const resolvedCompletedMaps = progress || completedMaps
  const allModules = [
    ...(catalog.sharedCore || []),
    ...(catalog.supplemental || []),
    ...(catalog.extensions || []),
  ]
  const progressById = Object.fromEntries(
    allModules.map((module) => [module.id, getModuleProgress(module, resolvedCompletedMaps, questionTotals)]),
  )
  const activeModules = allModules.filter((module) => module.status !== 'planned' && progressById[module.id].total > 0)
  const completedTotal = activeModules.reduce((sum, module) => sum + progressById[module.id].completed, 0)
  const questionTotal = activeModules.reduce((sum, module) => sum + progressById[module.id].total, 0)
  const overallPercent = questionTotal > 0 ? Math.round((completedTotal / questionTotal) * 100) : 0

  return (
    <div className={`review-dashboard review-dashboard--${catalog.id}`}>
      <header className="review-dashboard__hero">
        <div className="review-dashboard__hero-copy">
          <p className="review-dashboard__eyebrow">{catalog.courseLabel}</p>
          <span>{catalog.eyebrow}</span>
          <h1>{catalog.title}</h1>
          <p>{catalog.description}</p>
        </div>
        <aside className="review-dashboard__readiness" aria-label="Overall review progress">
          <span>Overall readiness</span>
          <strong>{overallPercent}%</strong>
          <MasteryBadge
            percent={overallPercent}
            completed={completedTotal}
            thresholds={thresholds}
          />
          <p>{completedTotal} of {questionTotal} available activities complete</p>
        </aside>
      </header>

      <ModuleSection
        id={`${catalog.id}-shared-core-heading`}
        eyebrow="Foundational review"
        title={catalog.id === 'calc3' ? 'Shared calculus core' : 'Prerequisite modules'}
        description={catalog.id === 'calc3'
          ? 'Begin with the same single-variable foundations used by Calculus II students.'
          : 'Complete only the areas that need reinforcement before beginning Calculus II.'}
        modules={catalog.sharedCore}
        progressById={progressById}
        onOpenModule={onOpenModule}
        thresholds={thresholds}
      />

      <ModuleSection
        id={`${catalog.id}-supplemental-heading`}
        eyebrow="Focused practice"
        title="Supplemental review"
        description="Use this targeted module when these high-frequency differentiation skills need more practice."
        modules={catalog.supplemental}
        progressById={progressById}
        onOpenModule={onOpenModule}
        thresholds={thresholds}
      />

      <ModuleSection
        id={`${catalog.id}-extensions-heading`}
        eyebrow="Calculus II refreshers"
        title="Calculus III extensions"
        description="These modules revisit selected Calculus II ideas. Multivariable topics begin after the readiness review."
        modules={catalog.extensions}
        progressById={progressById}
        onOpenModule={onOpenModule}
        thresholds={thresholds}
      />

      <section className="review-dashboard__continue" aria-labelledby={`${catalog.id}-continue-heading`}>
        <div>
          <p className="review-dashboard__section-eyebrow">Ready to move forward?</p>
          <h2 id={`${catalog.id}-continue-heading`}>Continue when your foundations feel dependable.</h2>
          <p>You can return to this review dashboard whenever a prerequisite skill slows your progress.</p>
        </div>
        <button className="review-dashboard__primary-action" type="button" onClick={onContinue}>
          {continueLabel || catalog.continueLabel} <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  )
}
