import FoundationProgression from '../../components/review/fundamental/FoundationProgression'
import { MathDisplay } from '../../components/MathDisplay'
import {
  trigonometryModules,
  trigonometryNextTopic,
  trigonometryOverview,
  trigonometryReviewTopics,
} from '../../data/trigonometryReview'
import '../../styles/algebra-review.css'
import '../../styles/trigonometry-review.css'

function scrollToSection(id) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function getProgressStatus(completed, total) {
  if (completed === 0) return 'Not started'
  const percent = total ? Math.round((completed / total) * 100) : 0
  if (percent >= 90) return 'Mastered'
  if (percent >= 75) return 'Developing'
  return 'In progress'
}

export default function TrigonometryReview({
  completed = {},
  totalActivities = 25,
  onReviewHome,
  onHome,
  onPrevious,
  onNext,
  onOpenAngles,
  onOpenUnitCircle,
  onOpenSixFunctions,
  onOpenCofunctions,
  onOpenModule,
  onOpenPractice,
}) {
  const completeCount = Object.values(completed).filter(Boolean).length
  const progressPercent = totalActivities ? Math.round((completeCount / totalActivities) * 100) : 0
  const status = getProgressStatus(completeCount, totalActivities)

  return (
    <div className="algebra-review-page trig-review-page">
      <nav className="algebra-review-toolbar trig-review-toolbar" aria-label="Trigonometry review navigation">
        <div className="trig-breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={onReviewHome}>Fundamental Review</button>
          <span aria-hidden="true">›</span>
          <strong>Trigonometry</strong>
        </div>
        <div className="trig-toolbar-actions">
          <button type="button" onClick={onPrevious}>Previous topic</button>
          <button type="button" onClick={onNext}>Next topic</button>
          <button type="button" onClick={() => scrollToSection('trigonometry-progress')}>My progress</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
      </nav>

      <header className="algebra-review-hero trig-review-hero">
        <FoundationProgression current="Trigonometry" />
        <div className="algebra-review-hero-grid">
          <div>
            <p className="card-label">Foundation {trigonometryOverview.foundation}</p>
            <span className="algebra-review-kicker">Fundamental Review</span>
            <h1>{trigonometryOverview.title}</h1>
            <h2>{trigonometryOverview.subtitle}</h2>
            <p>{trigonometryOverview.introduction}</p>
            <button className="primary-button" type="button" onClick={onOpenAngles}>
              Begin Trigonometry Review →
            </button>
          </div>
          <aside aria-label="Trigonometry module progress">
            <span>{status}</span>
            <strong>{progressPercent}%</strong>
            <progress max="100" value={progressPercent}>{progressPercent}%</progress>
            <p>{completeCount} of {totalActivities} saved lesson and guided-practice goals complete.</p>
          </aside>
        </div>
      </header>

      <section className="trig-why-calculus" aria-labelledby="trig-why-calculus-title">
        <div>
          <p className="card-label">Why this matters in calculus</p>
          <h2 id="trig-why-calculus-title">Trigonometry is a working language of change.</h2>
        </div>
        <p>{trigonometryOverview.whyItMatters}</p>
        <MathDisplay>{String.raw`(\cos\theta,\sin\theta)\quad\longrightarrow\quad\text{rotation, waves, vectors, and change}`}</MathDisplay>
      </section>

      <section id="trig-review-overview" className="algebra-objectives trig-review-overview" aria-labelledby="trig-review-topics-title">
        <div>
          <p className="card-label">What you will review</p>
          <h2 id="trig-review-topics-title">See the geometry before memorizing the relationship.</h2>
          <button className="primary-button" type="button" onClick={onOpenAngles}>Begin review →</button>
        </div>
        <ul>{trigonometryReviewTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
      </section>

      <div className="trig-overview-content">
        <section className="trig-learning-sequence" aria-labelledby="trig-learning-sequence-title">
          <p className="card-label">Learning sequence</p>
          <h2 id="trig-learning-sequence-title">From visual meaning to independent use.</h2>
          <ol>
            {trigonometryOverview.philosophy.map((stage, index) => (
              <li key={stage}><span>{String(index + 1).padStart(2, '0')}</span><strong>{stage}</strong></li>
            ))}
          </ol>
        </section>

        <section className="trig-module-map" aria-labelledby="trig-module-map-title">
          <header>
            <div>
              <p className="card-label">Review pathway</p>
              <h2 id="trig-module-map-title">Thirteen connected ideas</h2>
            </div>
            <p>Each lesson will connect a visual model, a formal relationship, guided examples, practice, mistakes, and mastery evidence.</p>
          </header>
          <div className="trig-module-grid">
            {trigonometryModules.map((module) => {
              const openLesson = module.id === 'angles-radians'
                ? onOpenAngles
                : module.id === 'unit-circle'
                  ? onOpenUnitCircle
                  : module.id === 'six-functions'
                    ? onOpenSixFunctions
                  : module.id === 'cofunctions'
                      ? onOpenCofunctions
                      : () => onOpenModule?.(module.id)
              return (
              <article key={module.id} className={openLesson ? 'is-available' : ''}>
                <div><span>{module.number}</span>{module.status && <small>{module.status}</small>}{module.advanced && <small>Advanced review</small>}</div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                {openLesson ? (
                  <button className="secondary-button" type="button" onClick={openLesson}>Open lesson →</button>
                ) : (
                  <span className="trig-module-status">Planned</span>
                )}
              </article>
              )
            })}
          </div>
        </section>

        <section id="trigonometry-progress" className="trig-progress-card" aria-labelledby="trigonometry-progress-title">
          <div>
            <p className="card-label">My progress</p>
            <h2 id="trigonometry-progress-title">{status}</h2>
            <p>This result combines your saved visual-lesson goals and guided-practice answers—not a sample score.</p>
          </div>
          <div className="trig-progress-measure">
            <strong>{completeCount}/{totalActivities}</strong>
            <progress max={totalActivities} value={completeCount}>{completeCount}</progress>
            <span>{progressPercent}% complete</span>
          </div>
          <button className="primary-button" type="button" onClick={onOpenPractice}>
            {completeCount ? 'Continue guided practice →' : 'Start guided practice →'}
          </button>
        </section>

        <nav className="trig-topic-navigation" aria-label="Previous and next Fundamental Review topics">
          <button type="button" onClick={onPrevious}><span>Previous</span><strong>← {trigonometryNextTopic.previous}</strong></button>
          <button type="button" onClick={onReviewHome}><span>Shared library</span><strong>Fundamental Review Home</strong></button>
          <button type="button" onClick={onNext}><span>Next</span><strong>{trigonometryNextTopic.next} →</strong></button>
        </nav>
      </div>
    </div>
  )
}
