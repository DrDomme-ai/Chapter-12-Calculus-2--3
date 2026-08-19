import { countCompleted } from './review/reviewProgress'
import { getCourseProfile } from './home/courseData'

const sharedReviewTotals = Object.freeze({
  trig: 23,
  limits: 11,
  derivatives: 17,
  expLog: 13,
})

function getSharedReviewSummary(reviewProgress = {}) {
  const entries = Object.entries(sharedReviewTotals)
  const total = entries.reduce((sum, [, activityTotal]) => sum + activityTotal, 0)
  const completed = entries.reduce((sum, [key, activityTotal]) => (
    sum + Math.min(countCompleted(reviewProgress[key]), activityTotal)
  ), 0)

  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

function CourseAction({ title, description, actionLabel, onAction, planned = false }) {
  return (
    <article className="course-overview__resource-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button
        className="secondary-button"
        type="button"
        onClick={onAction}
        disabled={planned || typeof onAction !== 'function'}
      >
        {planned ? 'Planned' : actionLabel} {!planned && <span aria-hidden="true">&rarr;</span>}
      </button>
    </article>
  )
}

export default function CourseOverview({
  courseId = 'calc2',
  reviewProgress = {},
  onHome,
  onOpenReview,
  onOpenChapter,
  onOpenProject,
}) {
  const course = getCourseProfile(courseId)
  const reviewSummary = getSharedReviewSummary(reviewProgress)

  return (
    <div className={`page course-overview course-overview--${course.route}`}>
      <nav className="course-overview__breadcrumb" aria-label={`${course.title} breadcrumb`}>
        <button type="button" onClick={onHome}>Home</button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{course.code}</span>
      </nav>

      <header className="course-overview__hero" aria-labelledby={`${course.route}-course-title`}>
        <div className="course-overview__hero-copy">
          <p className="eyebrow">{course.eyebrow}</p>
          <p className="card-label">Course Introduction</p>
          <h1 id={`${course.route}-course-title`}>{course.title}</h1>
          <p className="course-overview__descriptor">{course.descriptor}</p>
          <p>{course.introduction}</p>
        </div>
        <div className="course-overview__hero-actions">
          <button className="primary-button" type="button" onClick={onOpenChapter}>
            {course.continueLabel} <span aria-hidden="true">&rarr;</span>
          </button>
          <button className="secondary-button" type="button" onClick={onOpenReview}>
            Fundamental Review
          </button>
        </div>
      </header>

      <section className="course-overview__section" aria-labelledby={`${course.route}-roadmap-heading`}>
        <div className="course-overview__section-heading">
          <div>
            <p className="card-label">Course roadmap</p>
            <h2 id={`${course.route}-roadmap-heading`}>See how the ideas connect</h2>
          </div>
          <p>Use the roadmap for orientation; open a chapter when you are ready to learn.</p>
        </div>
        <ol className="course-overview__roadmap" aria-label={`${course.title} learning progression`}>
          {course.roadmap.map((step, index) => (
            <li key={step}>
              <span>STEP {index + 1}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <div className="course-overview__learning-grid">
        <section className="course-overview__section" aria-labelledby={`${course.route}-chapters-heading`}>
          <div className="course-overview__section-heading">
            <div>
              <p className="card-label">Chapters</p>
              <h2 id={`${course.route}-chapters-heading`}>Course learning library</h2>
            </div>
          </div>
          <div className="course-overview__chapter-list">
            {course.chapters.map((chapter) => {
              const isAvailable = chapter.status === 'available'

              return (
                <details className="course-overview__chapter-accordion" key={chapter.id}>
                  <summary><span>{chapter.chapterLabel}</span><strong>{chapter.title}</strong></summary>
                  <div className="course-overview__chapter-contents">
                    {chapter.subchapters?.length?<ul>{chapter.subchapters.map((subchapter)=><li key={subchapter}>{subchapter}</li>)}</ul>:<p>Lectures will appear here as chapter materials are added.</p>}
                    {chapter.chapterLabel==='CHAPTER 12'&&<button type="button" onClick={onOpenChapter}>Open Chapter 12</button>}
                    {!isAvailable&&<small>Planned</small>}
                  </div>
                </details>
              )
            })}
          </div>
        </section>

        <aside className="course-overview__progress" aria-labelledby={`${course.route}-progress-heading`}>
          <p className="card-label">Progress</p>
          <h2 id={`${course.route}-progress-heading`}>Your learning progress</h2>
          <strong>{reviewSummary.percent}%</strong>
          <label htmlFor={`${course.route}-review-progress`}>Shared Fundamental Review</label>
          <progress
            id={`${course.route}-review-progress`}
            max={reviewSummary.total}
            value={reviewSummary.completed}
          >
            {reviewSummary.percent}%
          </progress>
          <p>{reviewSummary.completed} of {reviewSummary.total} available review activities complete.</p>
          <button className="secondary-button" type="button" onClick={onOpenReview}>
            Continue Fundamental Review <span aria-hidden="true">&rarr;</span>
          </button>
        </aside>
      </div>

      <section className="course-overview__continue" aria-labelledby={`${course.route}-continue-heading`}>
        <div>
          <p className="card-label">Continue learning</p>
          <h2 id={`${course.route}-continue-heading`}>Chapter 12 · Vectors &amp; 3D Space</h2>
          <p>Enter the shared Chapter 12 module and continue from the three-dimensional coordinate system.</p>
        </div>
        <button className="primary-button" type="button" onClick={onOpenChapter}>
          Open Chapter 12 <span aria-hidden="true">&rarr;</span>
        </button>
      </section>

      <section className="course-overview__section" aria-labelledby={`${course.route}-resources-heading`}>
        <div className="course-overview__section-heading">
          <div>
            <p className="card-label">Course tools</p>
            <h2 id={`${course.route}-resources-heading`}>References, practice, and projects</h2>
          </div>
        </div>
        <div className="course-overview__resource-grid">
          <CourseAction
            title="Fundamental Review"
            description="Return to the same shared Algebra-to-Calculus III readiness library used by both courses."
            actionLabel="Open shared review"
            onAction={onOpenReview}
          />
          <CourseAction
            title="Formula Reference"
            description="A concise course reference will collect notation, definitions, and essential formulas."
            planned
          />
          <CourseAction
            title="Practice"
            description="Course-specific mixed practice and mastery checks will be added as chapters are developed."
            planned
          />
          <CourseAction
            title="Project"
            description="Open the project workspace for guided mathematical investigation and application."
            actionLabel="Open project"
            onAction={onOpenProject}
          />
        </div>
      </section>
    </div>
  )
}
