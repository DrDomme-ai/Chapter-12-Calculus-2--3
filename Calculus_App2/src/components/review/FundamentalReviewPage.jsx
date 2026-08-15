import { useState } from 'react'
import { fundamentalReviewCatalog } from '../../data/reviewCatalog'
import MasteryBadge from './MasteryBadge'
import { getModuleProgress } from './reviewProgress'

function getCategoryProgress(category, progress) {
  const availableModules = category.modules.filter((module) => module.status !== 'planned')
  const moduleProgress = availableModules.map((module) => getModuleProgress(module, progress))
  const completed = moduleProgress.reduce((sum, item) => sum + item.completed, 0)
  const total = moduleProgress.reduce((sum, item) => sum + item.total, 0)

  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    planned: availableModules.length === 0,
  }
}

function ReviewCategoryCard({ category, progress, framework, onOpenModule, onOpenCourse }) {
  const [expanded, setExpanded] = useState(false)
  const categoryProgress = getCategoryProgress(category, progress)
  const contentId = `fundamental-review-${category.id}-content`

  return (
    <article
      className={`review-module-card review-module-card--${categoryProgress.planned ? 'planned' : 'available'}`}
      aria-labelledby={`fundamental-review-${category.id}-title`}
    >
      <header className="review-module-card__header">
        <span className="review-module-card__number">{category.number}</span>
        <MasteryBadge
          completed={categoryProgress.completed}
          percent={categoryProgress.percent}
          planned={categoryProgress.planned}
          showPercent={!categoryProgress.planned}
        />
      </header>

      <div className="review-module-card__body">
        <h3 id={`fundamental-review-${category.id}-title`}>{category.title}</h3>
        <p>{category.description}</p>
        <ul className="review-module-card__topics" aria-label={`${category.title} review overview`}>
          {category.modules.map((module) => <li key={module.id}>{module.title}</li>)}
          {category.plannedTopics?.map((topic) => <li key={topic}>{topic}</li>)}
        </ul>
      </div>

      <footer className="review-module-card__footer">
        <button
          className="review-module-card__action"
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? 'Close category' : `Enter ${category.title} review`}
          <span aria-hidden="true"> {expanded ? '−' : '+'}</span>
        </button>

        {expanded && (
          <div id={contentId}>
            <p>
              <strong>Review framework:</strong> {framework.join(' · ')}
            </p>

            {category.modules.length > 0 ? (
              <ul className="review-module-card__topics" aria-label={`${category.title} review modules`}>
                {category.modules.map((module) => {
                  const isPlanned = module.status === 'planned'
                  return (
                    <li key={module.id}>
                      <span>{module.title} — {isPlanned ? 'Planned' : 'Available'}</span>{' '}
                      <button
                        className="secondary-button"
                        type="button"
                        disabled={isPlanned || !module.routeId}
                        onClick={() => onOpenModule?.(module.routeId)}
                      >
                        {isPlanned ? 'Coming soon' : 'Open module'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>This review category is planned. Its place in the shared progression is available now.</p>
            )}

            {category.courseId && onOpenCourse && (
              <button
                className="secondary-button"
                type="button"
                onClick={() => onOpenCourse(category.courseId)}
              >
                Open {category.courseLabel} course <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}
      </footer>
    </article>
  )
}

export default function FundamentalReviewPage({
  progress = {},
  onHome,
  onOpenModule,
  onOpenCourse,
  onOpenInstructor,
}) {
  const catalog = fundamentalReviewCatalog
  const availableModules = catalog.categories.flatMap((category) => category.modules)
    .filter((module) => module.status !== 'planned')
  const overallProgress = availableModules.map((module) => getModuleProgress(module, progress))
  const completed = overallProgress.reduce((sum, item) => sum + item.completed, 0)
  const total = overallProgress.reduce((sum, item) => sum + item.total, 0)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="page review-path-page">
      <button className="text-button" type="button" onClick={onHome}>
        <span aria-hidden="true">←</span> Home
      </button>

      <div className="review-dashboard review-dashboard--fundamental">
        <header className="review-dashboard__hero">
          <div className="review-dashboard__hero-copy">
            <p className="review-dashboard__eyebrow">Shared by MATH 243 and MATH 344</p>
            <span>One connected mathematical foundation</span>
            <h1>{catalog.title}</h1>
            <p>{catalog.subtitle}</p>
          </div>

          <aside className="review-dashboard__readiness" aria-label="Shared review progress and sequence">
            <span>Overall mastery</span>
            <strong>{percent}%</strong>
            <MasteryBadge percent={percent} completed={completed} />
            <p>{catalog.progression.join(' → ')}</p>
            {onOpenInstructor && (
              <div style={{ marginTop: 12 }}>
                <button className="secondary-button" onClick={() => onOpenInstructor()}>Instructor Lectures</button>
              </div>
            )}
          </aside>
        </header>

        <section className="review-dashboard__section" aria-labelledby="fundamental-review-categories-heading">
          <header className="review-dashboard__section-header">
            <div>
              <p className="review-dashboard__section-eyebrow">Choose your starting point</p>
              <h2 id="fundamental-review-categories-heading">Enter any stage of the progression.</h2>
            </div>
            <p>{catalog.description}</p>
          </header>

          <div className="review-dashboard__grid">
            {catalog.categories.map((category) => (
              <ReviewCategoryCard
                key={category.id}
                category={category}
                progress={progress}
                framework={catalog.framework}
                onOpenModule={onOpenModule}
                onOpenCourse={onOpenCourse}
              />
            ))}
          </div>
        </section>

        <section className="review-dashboard__continue" aria-labelledby="fundamental-review-progression-heading">
          <div>
            <p className="review-dashboard__section-eyebrow">A connected curriculum</p>
            <h2 id="fundamental-review-progression-heading">Mathematics grows one foundation at a time.</h2>
            <p>{catalog.progression.join(' → ')}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
