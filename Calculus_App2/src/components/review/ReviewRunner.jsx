import { useMemo, useState } from 'react'
import ReviewQuestion from './ReviewQuestion'

export default function ReviewRunner({
  className = '',
  eyebrowText = 'MATH 243 · Calculus II',
  titleLines,
  description,
  kicker = 'Prerequisite refresh',
  topicLabel,
  topicDescription,
  stations,
  questions,
  completed = {},
  onCompletedChange,
  onReviewCenter,
  onHome,
  onContinue,
  backLabel = 'Fundamental Review',
  continueLabel = 'Continue',
  summaryHeadings,
  summaryDescription,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const currentQuestion = questions[currentIndex]
  const currentStation = stations.find((station) => station.id === currentQuestion?.stationId)
  const completeCount = Object.values(completed).filter(Boolean).length
  const completionPercent = Math.round((completeCount / questions.length) * 100)

  const stationProgress = useMemo(
    () => Object.fromEntries(stations.map((station) => {
      const stationQuestions = station.questions || []
      const correct = stationQuestions.filter((question) => completed[question.id]).length
      return [station.id, { correct, total: stationQuestions.length }]
    })),
    [completed, stations],
  )

  const goToQuestion = (nextIndex) => {
    setShowSummary(false)
    setCurrentIndex(Math.max(0, Math.min(questions.length - 1, nextIndex)))
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const goToStation = (stationId) => {
    const index = questions.findIndex((question) => question.stationId === stationId)
    goToQuestion(index)
  }

  const resetReview = () => {
    onCompletedChange({})
    setCurrentIndex(0)
    setShowSummary(false)
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const completionRatio = questions.length ? completeCount / questions.length : 0
  const summaryHeading = completionRatio === 1
    ? summaryHeadings.complete
    : completionRatio >= 0.75
      ? summaryHeadings.nearly
      : summaryHeadings.continue

  return (
    <div className={'readiness-review ' + className}>
      <nav className="review-toolbar" aria-label="Review navigation">
        <div>
          <button type="button" onClick={onReviewCenter}>← {backLabel}</button>
          <button type="button" onClick={onHome}>Home</button>
          <button type="button" onClick={resetReview}>Reset Review</button>
        </div>
        {onContinue && <button className="review-continue-top" type="button" onClick={onContinue}>{continueLabel} →</button>}
      </nav>

      <header className="review-hero">
        <div>
          <p className="eyebrow">{eyebrowText}</p>
          <span className="review-kicker">{kicker}</span>
          <h1>{titleLines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
          <p>{description}</p>
        </div>
        <div className="review-score">
          <strong>{completeCount}</strong>
          <span>of {questions.length}<br />activities correct</span>
        </div>
      </header>

      <div
        className="review-progress-track"
        role="progressbar"
        aria-label={titleLines.join(' ') + ' progress'}
        aria-valuemin="0"
        aria-valuemax={questions.length}
        aria-valuenow={completeCount}
      >
        <span style={{ width: completionPercent + '%' }} />
      </div>

      <div className="review-layout">
        <aside className="review-sidebar">
          <div>
            <span className="card-label">{topicLabel}</span>
            <p>{topicDescription}</p>
          </div>
          <nav aria-label={topicLabel}>
            {stations.map((station) => {
              const progress = stationProgress[station.id]
              const active = !showSummary && currentQuestion?.stationId === station.id
              return (
                <button
                  type="button"
                  className={active ? 'active' : ''}
                  onClick={() => goToStation(station.id)}
                  key={station.id}
                >
                  <span>{station.title}</span>
                  <small>{progress.correct}/{progress.total}</small>
                </button>
              )
            })}
          </nav>
          <button
            className="review-summary-link"
            type="button"
            onClick={() => {
              setShowSummary(true)
              const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
              window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
            }}
          >
            View summary
          </button>
        </aside>

        <section className="review-main">
          {!showSummary ? (
            <>
              <ReviewQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                station={currentStation}
                number={currentIndex + 1}
                total={questions.length}
                alreadyComplete={Boolean(completed[currentQuestion.id])}
                onResult={(correct) => {
                  if (correct && !completed[currentQuestion.id]) {
                    onCompletedChange({ ...completed, [currentQuestion.id]: true })
                  }
                }}
              />
              <div className="review-pager">
                <button type="button" disabled={currentIndex === 0} onClick={() => goToQuestion(currentIndex - 1)}>← Previous</button>
                <span>{currentQuestion.stationTitle}</span>
                {currentIndex < questions.length - 1 ? (
                  <button type="button" onClick={() => goToQuestion(currentIndex + 1)}>Next →</button>
                ) : (
                  <button type="button" onClick={() => setShowSummary(true)}>Finish Review →</button>
                )}
              </div>
            </>
          ) : (
            <section className="review-summary">
              <span className="summary-icon" aria-hidden="true">✓</span>
              <p className="eyebrow">Review summary</p>
              <h2>{summaryHeading}</h2>
              <p>You completed <strong>{completeCount} of {questions.length}</strong> {summaryDescription} activities.</p>
              <div className="summary-stations">
                {stations.map((station) => {
                  const progress = stationProgress[station.id]
                  return (
                    <button type="button" onClick={() => goToStation(station.id)} key={station.id}>
                      <span>{station.title}</span>
                      <b>{progress.correct}/{progress.total}</b>
                    </button>
                  )
                })}
              </div>
              <div className="summary-actions">
                <button type="button" onClick={onReviewCenter}>Return to {backLabel}</button>
                {onContinue && <button className="secondary" type="button" onClick={onContinue}>{continueLabel}</button>}
                <button className="secondary" type="button" onClick={() => goToQuestion(0)}>Review again</button>
              </div>
              <small>Completion is not required. Return to any topic whenever you want more practice.</small>
            </section>
          )}
        </section>
      </div>
    </div>
  )
}
