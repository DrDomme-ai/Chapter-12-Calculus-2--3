import { useId, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import { getMasteryStatus } from '../reviewProgress'
import '../../../styles/trig-lesson-blocks.css'

const EMPTY_LIST = Object.freeze([])

function normalizeAnswer(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/\u03c0/g, 'pi')
    .replace(/\u00b0/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\s+/g, '')
}

function fieldIsCorrect(field, value) {
  if (typeof field.checkAnswer === 'function') return Boolean(field.checkAnswer(value))

  const normalizer = field.normalizeAnswer || normalizeAnswer
  const studentAnswer = normalizer(value)
  return Boolean(studentAnswer) && (field.acceptedAnswers || EMPTY_LIST)
    .some((accepted) => studentAnswer === normalizer(accepted))
}

function FormulaList({ formulas }) {
  const formulaList = Array.isArray(formulas) ? formulas : [formulas]

  return formulaList.filter(Boolean).map((formula, index) => (
    <MathDisplay key={`${formula}-${index}`}>{formula}</MathDisplay>
  ))
}

export function SectionHeading({
  number,
  label = 'Foundation 02 · Trigonometry',
  title,
  introduction,
  question,
  headingId,
  children,
}) {
  return (
    <header className="trig-lesson-section-heading">
      {number && <span className="trig-lesson-section-number" aria-hidden="true">{number}</span>}
      <div>
        <p className="trig-lesson-label">{label}</p>
        <h2 id={headingId}>{title}</h2>
        {introduction && <div className="trig-lesson-introduction">{introduction}</div>}
        {question && <p className="trig-lesson-opening-question">{question}</p>}
        {children}
      </div>
    </header>
  )
}

export function DefinitionCard({
  label = 'Definition',
  title,
  math,
  children,
}) {
  return (
    <article className="trig-lesson-card trig-lesson-definition-card">
      <p className="trig-lesson-label">{label}</p>
      {title && <h3>{title}</h3>}
      {math && <FormulaList formulas={math} />}
      {children && <div className="trig-lesson-card-copy">{children}</div>}
    </article>
  )
}

export function FormulaCard({
  label = 'Important relationship',
  title,
  formula,
  formulas,
  description,
  children,
}) {
  const displayedFormulas = formulas || formula

  return (
    <article className="trig-lesson-card trig-lesson-formula-card">
      <p className="trig-lesson-label">{label}</p>
      {title && <h3>{title}</h3>}
      {displayedFormulas && <FormulaList formulas={displayedFormulas} />}
      {description && <p>{description}</p>}
      {children && <div className="trig-lesson-card-copy">{children}</div>}
    </article>
  )
}

export function ProgressiveExample({
  label = 'Professor-guided example',
  title,
  prompt,
  promptMath,
  steps = EMPTY_LIST,
  conclusion,
  conclusionMath,
}) {
  const [visibleStepCount, setVisibleStepCount] = useState(0)
  const availableSteps = steps.filter(Boolean)
  const isComplete = availableSteps.length > 0 && visibleStepCount >= availableSteps.length

  const revealNext = () => {
    setVisibleStepCount((current) => Math.min(availableSteps.length, current + 1))
  }

  const revealCompleteSolution = () => {
    setVisibleStepCount(availableSteps.length)
  }

  return (
    <article className="trig-lesson-example">
      <header>
        <p className="trig-lesson-label">{label}</p>
        <h3>{title}</h3>
        {prompt && <p>{prompt}</p>}
        {promptMath && <MathDisplay>{promptMath}</MathDisplay>}
      </header>

      <ol className="trig-lesson-example-steps" aria-live="polite">
        {availableSteps.slice(0, visibleStepCount).map((step, index) => (
          <li key={step.id || `${step.math || step.text}-${index}`}>
            <span aria-hidden="true">{index + 1}</span>
            <div>
              {step.label && <strong>{step.label}</strong>}
              {step.text && <p>{step.text}</p>}
              {step.math && <MathDisplay>{step.math}</MathDisplay>}
            </div>
          </li>
        ))}
      </ol>

      {isComplete && (conclusion || conclusionMath) && (
        <div className="trig-lesson-example-conclusion" role="status">
          <strong>Conclusion</strong>
          {conclusion && <p>{conclusion}</p>}
          {conclusionMath && <MathDisplay>{conclusionMath}</MathDisplay>}
        </div>
      )}

      <div className="trig-lesson-actions">
        <button type="button" className="trig-lesson-primary-action" onClick={revealNext} disabled={isComplete || availableSteps.length === 0}>
          {visibleStepCount === 0 ? 'Reveal next step' : isComplete ? 'All steps revealed' : 'Next step'}
        </button>
        <button type="button" className="trig-lesson-secondary-action" onClick={revealCompleteSolution} disabled={isComplete || availableSteps.length === 0}>
          Show complete solution
        </button>
        <button type="button" className="trig-lesson-secondary-action" onClick={() => setVisibleStepCount(0)} disabled={visibleStepCount === 0}>
          Reset example
        </button>
      </div>
    </article>
  )
}

export function StudentChallenge({
  label = 'Your turn',
  title,
  prompt,
  promptMath,
  fields,
  hints = EMPTY_LIST,
  solution,
  solutionMath,
  onResult,
}) {
  const instanceId = useId()
  const challengeFields = useMemo(() => {
    const source = fields?.length ? fields : [{ id: 'answer', label: 'Answer', acceptedAnswers: EMPTY_LIST }]
    return source.slice(0, 3).map((field, index) => ({ ...field, id: field.id || `answer-${index + 1}` }))
  }, [fields])
  const emptyAnswers = () => Object.fromEntries(challengeFields.map((field) => [field.id, '']))
  const [answers, setAnswers] = useState(emptyAnswers)
  const [fieldResults, setFieldResults] = useState(null)
  const [visibleHintCount, setVisibleHintCount] = useState(0)
  const [solutionVisible, setSolutionVisible] = useState(false)

  const readyToCheck = challengeFields.every((field) => String(answers[field.id] || '').trim())

  const checkAnswer = () => {
    const results = Object.fromEntries(
      challengeFields.map((field) => [field.id, fieldIsCorrect(field, answers[field.id])]),
    )
    const correct = Object.values(results).every(Boolean)
    setFieldResults(results)
    onResult?.({ correct, results, answers: { ...answers } })
  }

  const reset = () => {
    setAnswers(emptyAnswers())
    setFieldResults(null)
    setVisibleHintCount(0)
    setSolutionVisible(false)
  }

  return (
    <article className="trig-lesson-challenge">
      <header>
        <p className="trig-lesson-label">{label}</p>
        <h3>{title}</h3>
        {prompt && <p>{prompt}</p>}
        {promptMath && <MathDisplay>{promptMath}</MathDisplay>}
      </header>

      <div className={`trig-lesson-answer-fields trig-lesson-answer-fields--${challengeFields.length}`}>
        {challengeFields.map((field) => {
          const inputId = `${instanceId}-${field.id}`
          const resultId = `${inputId}-result`
          const result = fieldResults?.[field.id]

          return (
            <label key={field.id} htmlFor={inputId}>
              <span>{field.label}</span>
              {field.labelMath && <MathInline>{field.labelMath}</MathInline>}
              <input
                id={inputId}
                value={answers[field.id] || ''}
                placeholder={field.placeholder || ''}
                inputMode={field.inputMode || 'text'}
                autoComplete="off"
                aria-describedby={fieldResults ? resultId : undefined}
                aria-invalid={fieldResults ? !result : undefined}
                onChange={(event) => {
                  setAnswers((current) => ({ ...current, [field.id]: event.target.value }))
                  setFieldResults(null)
                }}
              />
              {field.helpText && <small>{field.helpText}</small>}
              {fieldResults && (
                <small id={resultId} className={`trig-lesson-field-result ${result ? 'is-correct' : 'is-incorrect'}`}>
                  {result ? (field.correctFeedback || 'Correct.') : (field.incorrectFeedback || 'Check this part and try again.')}
                </small>
              )}
            </label>
          )
        })}
      </div>

      <div className="trig-lesson-actions trig-lesson-challenge-actions">
        <button type="button" className="trig-lesson-primary-action" onClick={checkAnswer} disabled={!readyToCheck}>Check answer</button>
        <button type="button" className="trig-lesson-secondary-action" onClick={() => setVisibleHintCount((current) => Math.max(current, 1))} disabled={!hints[0]}>Hint 1</button>
        <button type="button" className="trig-lesson-secondary-action" onClick={() => setVisibleHintCount((current) => Math.max(current, 2))} disabled={!hints[1]}>Hint 2</button>
        <button type="button" className="trig-lesson-secondary-action" onClick={() => setSolutionVisible(true)} disabled={!solution && !solutionMath}>Show solution</button>
        <button type="button" className="trig-lesson-quiet-action" onClick={reset}>Reset</button>
      </div>

      {fieldResults && (
        <p className={`trig-lesson-feedback ${Object.values(fieldResults).every(Boolean) ? 'is-correct' : 'is-incorrect'}`} role="status">
          {Object.values(fieldResults).every(Boolean)
            ? 'Correct. Every part agrees with the mathematical relationship.'
            : 'Not yet. Use the feedback beside each field, then revise your response.'}
        </p>
      )}

      {visibleHintCount > 0 && (
        <div className="trig-lesson-hints" aria-live="polite">
          {hints.slice(0, visibleHintCount).map((hint, index) => (
            <div key={`${hint}-${index}`}><strong>Hint {index + 1}</strong><p>{hint}</p></div>
          ))}
        </div>
      )}

      {solutionVisible && (
        <div className="trig-lesson-solution" role="status">
          <strong>Solution</strong>
          {solution && <div>{solution}</div>}
          {solutionMath && <MathDisplay>{solutionMath}</MathDisplay>}
        </div>
      )}
    </article>
  )
}

export function CommonMistakeCard({
  label = 'Common mistake',
  title,
  claim,
  claimMath,
  question = 'What went wrong?',
  explanation,
  correctionMath,
  counterexampleMath,
  children,
}) {
  const [revealed, setRevealed] = useState(false)

  return (
    <article className="trig-lesson-mistake">
      <header>
        <span aria-hidden="true">!</span>
        <div><p className="trig-lesson-label">{label}</p><h3>{title}</h3></div>
      </header>
      {claim && <p className="trig-lesson-mistake-claim">{claim}</p>}
      {claimMath && <MathDisplay>{claimMath}</MathDisplay>}
      <p className="trig-lesson-mistake-question">{question}</p>
      <button
        type="button"
        className="trig-lesson-secondary-action"
        aria-expanded={revealed}
        onClick={() => setRevealed((current) => !current)}
      >
        {revealed ? 'Hide explanation' : 'Reveal explanation'}
      </button>
      {revealed && (
        <div className="trig-lesson-mistake-explanation" role="status">
          {explanation && <p>{explanation}</p>}
          {correctionMath && <MathDisplay>{correctionMath}</MathDisplay>}
          {counterexampleMath && <MathDisplay>{counterexampleMath}</MathDisplay>}
          {children}
        </div>
      )}
    </article>
  )
}

export function ConceptCheck({
  label = 'Concept check',
  title,
  prompt,
  promptMath,
  options = EMPTY_LIST,
  correctAnswer,
  explanation,
  explanationMath,
  onResult,
}) {
  const instanceId = useId()
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = selected === correctAnswer

  const check = () => {
    if (!selected) return
    setChecked(true)
    onResult?.({ correct, answer: selected })
  }

  return (
    <article className="trig-lesson-concept-check">
      <p className="trig-lesson-label">{label}</p>
      {title && <h3>{title}</h3>}
      {prompt && <p>{prompt}</p>}
      {promptMath && <MathDisplay>{promptMath}</MathDisplay>}
      <div className="trig-lesson-choice-grid" role="radiogroup" aria-label={prompt || title}>
        {options.map((option, index) => {
          const optionId = `${instanceId}-option-${index}`
          return (
            <label key={option.id} htmlFor={optionId} className={selected === option.id ? 'is-selected' : ''}>
              <input
                id={optionId}
                type="radio"
                name={`${instanceId}-choice`}
                value={option.id}
                checked={selected === option.id}
                onChange={() => { setSelected(option.id); setChecked(false) }}
              />
              <span>{option.label}{option.math && <MathInline>{option.math}</MathInline>}</span>
            </label>
          )
        })}
      </div>
      <div className="trig-lesson-actions">
        <button type="button" className="trig-lesson-primary-action" onClick={check} disabled={!selected}>Check answer</button>
        <button type="button" className="trig-lesson-secondary-action" onClick={() => { setSelected(''); setChecked(false) }}>Reset</button>
      </div>
      {checked && (
        <div className={`trig-lesson-concept-explanation ${correct ? 'is-correct' : 'is-incorrect'}`} role="status">
          <strong>{correct ? 'Correct.' : 'Not quite.'}</strong>
          {explanation && <p>{explanation}</p>}
          {explanationMath && <MathDisplay>{explanationMath}</MathDisplay>}
        </div>
      )}
    </article>
  )
}

export function TopicMasteryCheck({
  title = 'Topic mastery check',
  description = 'Answer every question, then check your readiness for this topic.',
  items = EMPTY_LIST,
  previousResult,
  onComplete,
}) {
  const instanceId = useId()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const answeredAll = items.length >= 3 && items.every((item) => answers[item.id])
  const percent = items.length ? Math.round((score / items.length) * 100) : 0
  const status = submitted
    ? getMasteryStatus({ percent, completed: Math.max(score, 1) })
    : previousResult?.percent != null
      ? getMasteryStatus({ percent: previousResult.percent, completed: Math.max(previousResult.score || 0, 1) })
    : { key: 'not-started', label: 'Not started' }

  const submit = () => {
    if (!answeredAll) return
    const nextScore = items.filter((item) => answers[item.id] === item.correctAnswer).length
    const nextPercent = Math.round((nextScore / items.length) * 100)
    setScore(nextScore)
    setSubmitted(true)
    onComplete?.({ score: nextScore, total: items.length, percent: nextPercent, answers: { ...answers } })
  }

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  return (
    <section className="trig-lesson-mastery" aria-labelledby={`${instanceId}-title`}>
      <header>
        <div><p className="trig-lesson-label">Mastery</p><h3 id={`${instanceId}-title`}>{title}</h3><p>{description}</p></div>
        <span className={`trig-lesson-mastery-status status-${status.key}`}>{status.label}</span>
      </header>

      <div className="trig-lesson-mastery-items">
        {items.map((item, questionIndex) => {
          const correct = submitted && answers[item.id] === item.correctAnswer
          return (
            <fieldset key={item.id} className={submitted ? (correct ? 'is-correct' : 'is-incorrect') : ''}>
              <legend><span>{questionIndex + 1}</span>{item.prompt}</legend>
              {item.promptMath && <MathDisplay>{item.promptMath}</MathDisplay>}
              <div className="trig-lesson-choice-grid">
                {item.options.map((option, optionIndex) => {
                  const optionId = `${instanceId}-${item.id}-${optionIndex}`
                  return (
                    <label key={option.id} htmlFor={optionId} className={answers[item.id] === option.id ? 'is-selected' : ''}>
                      <input
                        id={optionId}
                        type="radio"
                        name={`${instanceId}-${item.id}`}
                        value={option.id}
                        checked={answers[item.id] === option.id}
                        disabled={submitted}
                        onChange={() => setAnswers((current) => ({ ...current, [item.id]: option.id }))}
                      />
                      <span>{option.label}{option.math && <MathInline>{option.math}</MathInline>}</span>
                    </label>
                  )
                })}
              </div>
              {submitted && (
                <div className="trig-lesson-mastery-explanation" role="status">
                  <strong>{correct ? 'Correct.' : 'Review this idea.'}</strong>
                  {item.explanation && <p>{item.explanation}</p>}
                  {item.explanationMath && <MathDisplay>{item.explanationMath}</MathDisplay>}
                </div>
              )}
            </fieldset>
          )
        })}
      </div>

      {!submitted && previousResult?.percent != null && (
        <div className="trig-lesson-mastery-result trig-lesson-previous-result">
          <div><span>Best saved score</span><strong>{previousResult.score}/{previousResult.total || items.length}</strong></div>
          <progress max="100" value={previousResult.percent}>{previousResult.percent}%</progress>
          <p>{previousResult.percent}% · {status.label}</p>
        </div>
      )}

      {items.length < 3 && <p className="trig-lesson-feedback is-incorrect">A topic mastery check requires at least three items.</p>}

      {submitted && (
        <div className="trig-lesson-mastery-result" role="status">
          <div><span>Score</span><strong>{score}/{items.length}</strong></div>
          <progress max="100" value={percent}>{percent}%</progress>
          <p>{percent}% · {status.label}</p>
        </div>
      )}

      <div className="trig-lesson-actions">
        {!submitted
          ? <button type="button" className="trig-lesson-primary-action" onClick={submit} disabled={!answeredAll}>Check mastery</button>
          : <button type="button" className="trig-lesson-primary-action" onClick={retry}>Retry mastery check</button>}
      </div>
    </section>
  )
}
