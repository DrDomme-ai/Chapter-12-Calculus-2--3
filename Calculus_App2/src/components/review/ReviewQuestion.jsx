import { useRef, useState } from 'react'
import { MathDisplay, MathInline } from '../MathDisplay'
import { TrigGraphThumbnail, TrigQuestionVisual } from './TrigVisuals'
import { LimitQuestionVisual } from './LimitVisuals'
import { DerivativeQuestionVisual } from './DerivativeVisuals'
import { ExpLogQuestionVisual } from './ExpLogVisuals'
import { matchesAlgebraicAnswer } from './algebraicEquivalence'

const resolveLearnFirst = (question, station) => {
  const stationContent = station?.learnFirst || {}
  const questionContent = question.learnFirst || {}

  if (!station?.learnFirst && !question.learnFirst) return null

  return {
    intuition: questionContent.intuition || stationContent.intuition,
    definition: questionContent.definition || stationContent.definition,
    definitionMath: questionContent.definitionMath || stationContent.definitionMath,
    decisionCue: questionContent.decisionCue || stationContent.decisionCue,
  }
}

const initialAnswer = (question) => {
  if (['multi-expression', 'multi-select'].includes(question.type)) {
    return question.fields.map(() => '')
  }
  return ''
}

// This is intentionally a small exact-answer normalizer, not a symbolic
// algebra system. It accepts common keyboard and LaTeX forms without silently
// accepting decimal approximations when an exact answer is requested.
const normalizeExpression = (value) => {
  let normalized = String(value)
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/[\u00B7\u00D7]/g, '*')
    .replace(/\\left|\\right/g, '')
    .replace(/\\pi/g, 'pi')
    .replace(/\u03C0/g, 'pi')
    .replace(/\\infty/g, 'infinity')
    .replace(/\u221E/g, 'infinity')
    .replace(/\\sqrt\s*\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\u221A\s*\(?\s*([a-z0-9]+)\s*\)?/g, 'sqrt($1)')
    .replace(/\bdegrees?\b/g, '')
    .replace(/\b(?:inf|infty)\b/g, 'infinity')
    .replace(/\bd\.?n\.?e\.?\b/g, 'dne')
    .replace(/\u00B0/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '')
    .replace(/\*/g, '')
    .replace(/\\/g, '')

  normalized = normalized.replace(/\(([^()+*/-]+)\)/g, '$1')
  normalized = normalized.replace(/^-\((.+)\)$/, '-$1')
  normalized = normalized.replace(/^\+infinity$/, 'infinity')
  return normalized
}

const matchesAcceptedAnswer = (answer, acceptedAnswers) => {
  const response = normalizeExpression(answer)
  return response !== '' && acceptedAnswers.some((accepted) => normalizeExpression(accepted) === response)
}

const parseSolutionSet = (value) => {
  const withoutOuterBraces = String(value).trim().replace(/^[{[(]\s*/, '').replace(/\s*[}\])]$/, '')
  return withoutOuterBraces
    .split(/[,;]/)
    .map((item) => normalizeExpression(item).replace(/^x=/, ''))
    .filter(Boolean)
    .sort()
}

const parseUnorderedList = (value) => String(value)
  .trim()
  .replace(/^[{[(]\s*/, '')
  .replace(/\s*[}\])]$/, '')
  .split(/[,;]/)
  .map((item) => normalizeExpression(item).replace(/^[xy]=/, ''))
  .filter(Boolean)
  .sort()

const matchesField = (answer, field) => {
  if (field.match === 'algebraic') {
    return matchesAlgebraicAnswer(answer, field.acceptedAnswers)
  }

  if (field.match === 'unordered-list') {
    const response = parseUnorderedList(answer)
    const expected = field.expectedItems.map(normalizeExpression).sort()
    return response.length === expected.length && response.every((value, index) => value === expected[index])
  }

  return matchesAcceptedAnswer(answer, field.acceptedAnswers)
}

const hasAnswer = (question, answer) => {
  if (['multi-expression', 'multi-select'].includes(question.type)) {
    return answer.every((value) => String(value).trim() !== '')
  }
  return String(answer).trim() !== ''
}

const evaluateAnswer = (question, answer) => {
  if (['choice', 'graph-choice'].includes(question.type)) {
    return { correct: answer === question.correctAnswer }
  }

  if (question.type === 'expression') {
    return {
      correct: question.match === 'algebraic'
        ? matchesAlgebraicAnswer(answer, question.acceptedAnswers)
        : matchesAcceptedAnswer(answer, question.acceptedAnswers),
    }
  }

  if (question.type === 'multi-expression') {
    const fieldResults = question.fields.map((field, index) => matchesField(answer[index], field))
    return { correct: fieldResults.every(Boolean), fieldResults }
  }

  if (question.type === 'multi-select') {
    const fieldResults = question.fields.map((field, index) => answer[index] === field.correctAnswer)
    return { correct: fieldResults.every(Boolean), fieldResults }
  }

  if (question.type === 'solution-set') {
    const response = parseSolutionSet(answer)
    const expected = question.expectedSolutions.map(normalizeExpression).sort()
    return { correct: response.length === expected.length && response.every((value, index) => value === expected[index]) }
  }

  return { correct: false }
}

function ChoiceInput({ question, answer, onChange }) {
  return (
    <fieldset className="review-choice-list">
      <legend className="sr-only">Choose one answer</legend>
      {question.options.map((option) => (
        <label className={answer === option.id ? 'selected' : ''} key={option.id}>
          <input
            type="radio"
            name={question.id}
            value={option.id}
            checked={answer === option.id}
            onChange={() => onChange(option.id)}
          />
          <span>{option.math ? <MathInline>{option.math}</MathInline> : option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}

function GraphChoiceInput({ question, answer, onChange }) {
  return (
    <fieldset className="review-image-choices">
      <legend className="sr-only">Choose one graph</legend>
      {question.options.map((option) => (
        <label className={answer === option.id ? 'selected' : ''} key={option.id}>
          <input
            type="radio"
            name={question.id}
            value={option.id}
            checked={answer === option.id}
            onChange={() => onChange(option.id)}
          />
          <TrigGraphThumbnail variant={option.variant} label={option.accessibleLabel} />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}

function FieldResult({ result }) {
  if (result === undefined) return null
  return <small className={result ? 'field-result correct-field' : 'field-result incorrect-field'}>{result ? 'Correct' : 'Try again'}</small>
}

function FieldLabel({ field }) {
  return field.math ? <MathInline>{field.math}</MathInline> : field.label
}

function MultiExpressionInput({ question, value, onChange, fieldResults }) {
  const update = (index, nextValue) => {
    const next = [...value]
    next[index] = nextValue
    onChange(next)
  }

  return (
    <div className={'review-multi-fields' + (question.presentation === 'coordinate' ? ' coordinate-fields' : '')}>
      {question.fields.map((field, index) => (
        <label className={fieldResults?.[index] === false ? 'has-error' : ''} key={field.id || field.label || field.math}>
          <span><FieldLabel field={field} /></span>
          <input
            type="text"
            value={value[index]}
            placeholder={field.placeholder || 'Exact value'}
            onChange={(event) => update(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.closest('article')?.querySelector('.review-submit')?.click()
            }}
            autoComplete="off"
          />
          <FieldResult result={fieldResults?.[index]} />
        </label>
      ))}
    </div>
  )
}

function MultiSelectInput({ question, value, onChange, fieldResults }) {
  const update = (index, nextValue) => {
    const next = [...value]
    next[index] = nextValue
    onChange(next)
  }

  return (
    <div className="review-multi-selects">
      {question.fields.map((field, index) => (
        <label className={fieldResults?.[index] === false ? 'has-error' : ''} key={field.id || field.label}>
          <span>{field.label}</span>
          <select value={value[index]} onChange={(event) => update(index, event.target.value)}>
            {field.options.map((option) => (
              <option value={option.id} key={option.id || 'blank'}>{option.label || option.math}</option>
            ))}
          </select>
          <FieldResult result={fieldResults?.[index]} />
        </label>
      ))}
    </div>
  )
}

function AnswerControl({ question, answer, onChange, fieldResults }) {
  if (question.type === 'choice') {
    return <ChoiceInput question={question} answer={answer} onChange={onChange} />
  }

  if (question.type === 'graph-choice') {
    return <GraphChoiceInput question={question} answer={answer} onChange={onChange} />
  }

  if (question.type === 'multi-expression') {
    return <MultiExpressionInput question={question} value={answer} onChange={onChange} fieldResults={fieldResults} />
  }

  if (question.type === 'multi-select') {
    return <MultiSelectInput question={question} value={answer} onChange={onChange} fieldResults={fieldResults} />
  }

  return (
    <label className="review-text-answer">
      <span>{question.type === 'solution-set' ? 'Solutions' : 'Answer'}</span>
      <input
        type="text"
        value={answer}
        placeholder={question.placeholder || 'Enter an exact answer'}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.closest('article')?.querySelector('.review-submit')?.click()
        }}
        autoComplete="off"
      />
      {question.type === 'solution-set' && <small>Use commas between solutions. Order does not matter.</small>}
    </label>
  )
}

function LearnFirstPanel({ content, compact = false }) {
  return (
    <div className={'learn-first-panel' + (compact ? ' compact' : '')}>
      <div className="learn-first-block intuition-block">
        <span className="learn-first-step" aria-hidden="true">1</span>
        <div>
          <h3>Build the idea</h3>
          <p>{content.intuition}</p>
        </div>
      </div>

      <div className="learn-first-block definition-block">
        <span className="learn-first-step" aria-hidden="true">2</span>
        <div>
          <h3>Definition and rule</h3>
          <p>{content.definition}</p>
          {content.definitionMath && <MathDisplay>{content.definitionMath}</MathDisplay>}
        </div>
      </div>

      <div className="learn-first-cue">
        <strong>How to decide</strong>
        <p>{content.decisionCue}</p>
      </div>
    </div>
  )
}

export default function ReviewQuestion({ question, station, number, total, alreadyComplete, onResult }) {
  const hasLearnFirst = Boolean(question.learnFirst || station?.learnFirst)
  const learnFirst = hasLearnFirst ? resolveLearnFirst(question, station) : null
  const [answer, setAnswer] = useState(() => initialAnswer(question))
  const [feedback, setFeedback] = useState(alreadyComplete ? { correct: true, previous: true } : null)
  const [visibleHintCount, setVisibleHintCount] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [stage, setStage] = useState(() => (hasLearnFirst ? 'learn' : 'exercise'))
  const [showConceptReview, setShowConceptReview] = useState(false)
  const exerciseHeadingRef = useRef(null)
  const hints = question.hints || []
  const answerReady = hasAnswer(question, answer)

  const startExercise = () => {
    setStage('exercise')
    window.requestAnimationFrame(() => exerciseHeadingRef.current?.focus())
  }

  const submit = () => {
    const result = evaluateAnswer(question, answer)
    setFeedback({ ...result, previous: false })
    if (result.correct) setShowSolution(true)
    onResult(result.correct)
  }

  const changeAnswer = (next) => {
    setAnswer(next)
    setFeedback(null)
    setShowSolution(false)
  }

  if (stage === 'learn' && learnFirst) {
    return (
      <article className="review-question-card learn-first-card">
        <header className="review-card-context">
          <div>
            <span className="review-question-count">Question {number} of {total}</span>
            <span className="review-station-label">{question.stationTitle}</span>
          </div>
        </header>

        <section className="learn-first-stage" aria-labelledby={'learn-first-' + question.id}>
          <p className="learn-first-kicker">Learn first</p>
          <h2 id={'learn-first-' + question.id}>{question.stationTitle}</h2>
          <p className="learn-first-introduction">Understand the idea and its rule before opening the exercise.</p>
          <LearnFirstPanel content={learnFirst} />
          <div className="learn-first-actions">
            <button className="start-exercise-button" type="button" onClick={startExercise}>
              Start Exercise <span aria-hidden="true">&rarr;</span>
            </button>
            <small>Your hints, answer check, and worked solution remain available in the exercise.</small>
          </div>
        </section>
      </article>
    )
  }

  return (
    <article className="review-question-card exercise-stage-card">
      <header className="review-card-context">
        <div>
          <span className="review-question-count">Question {number} of {total}</span>
          <span className="review-station-label">{question.stationTitle}</span>
        </div>
      </header>

      {learnFirst && (
        <div className="exercise-stage-bar">
          <span><b aria-hidden="true">2</b> Exercise</span>
          <button
            type="button"
            onClick={() => setShowConceptReview((visible) => !visible)}
            aria-expanded={showConceptReview}
            aria-controls={'concept-review-' + question.id}
          >
            {showConceptReview ? 'Hide concept' : 'Review concept'}
          </button>
        </div>
      )}

      {learnFirst && showConceptReview && (
        <section id={'concept-review-' + question.id} className="concept-review-drawer" aria-label="Concept review">
          <LearnFirstPanel content={learnFirst} compact />
        </section>
      )}

      <header className="review-exercise-header">
        <h2 ref={exerciseHeadingRef} tabIndex="-1">{question.title}</h2>
        <p>{question.prompt}</p>
        {question.math && <MathDisplay>{question.math}</MathDisplay>}
      </header>

      <TrigQuestionVisual visual={question.visual} />
      <LimitQuestionVisual visual={question.visual} />
      <DerivativeQuestionVisual visual={question.visual} />
      <ExpLogQuestionVisual visual={question.visual} />

      <div className="review-answer-area">
        <AnswerControl question={question} answer={answer} onChange={changeAnswer} fieldResults={feedback?.fieldResults} />
      </div>

      <div className="review-question-actions">
        <button className="review-submit" type="button" onClick={submit} disabled={!answerReady}>Check Answer</button>
        {visibleHintCount < hints.length && (
          <button
            className="review-hint-button"
            type="button"
            onClick={() => setVisibleHintCount((count) => count + 1)}
          >
            Hint {visibleHintCount + 1}
          </button>
        )}
        {visibleHintCount > 0 && (
          <button className="review-hint-button subtle" type="button" onClick={() => setVisibleHintCount(0)}>
            Hide hints
          </button>
        )}
        <button
          className="review-hint-button solution-button"
          type="button"
          onClick={() => setShowSolution((visible) => !visible)}
          aria-expanded={showSolution}
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {visibleHintCount > 0 && (
        <div className="review-hints" aria-live="polite">
          {hints.slice(0, visibleHintCount).map((hint, index) => (
            <p className="review-hint" key={hint}><strong>Hint {index + 1}:</strong> {hint}</p>
          ))}
        </div>
      )}

      {feedback && (
        <div className={'review-feedback ' + (feedback.correct ? 'correct-feedback' : 'incorrect-feedback')} role="status">
          <span aria-hidden="true">{feedback.correct ? '\u2713' : '!'}</span>
          <div>
            {feedback.previous ? (
              <p>Completed earlier. You can still practice this question again.</p>
            ) : feedback.correct ? (
              <p><strong>Correct.</strong> Every required value is mathematically consistent.</p>
            ) : (
              <p><strong>Not yet.</strong> {feedback.fieldResults ? feedback.fieldResults.filter(Boolean).length + ' of ' + feedback.fieldResults.length + ' parts are correct. Check the highlighted parts or open the next hint.' : (question.incorrectFeedback || 'Recheck the mathematical relationship or open the next hint before trying again.')}</p>
            )}
          </div>
        </div>
      )}

      {showSolution && (
        <div className="review-solution" role="region" aria-label="Worked solution">
          <span className="card-label">Worked solution</span>
          <p>{question.explanation}</p>
          {question.explanationMath && <MathDisplay>{question.explanationMath}</MathDisplay>}
        </div>
      )}
    </article>
  )
}

