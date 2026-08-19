import { useId, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import { matchesAlgebraicAnswer } from '../algebraicEquivalence'

const FUNCTION_IDS = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot']

function arraysMatch(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false
  const expected = new Set(right)
  return left.every((value) => expected.has(value))
}

function questionIsCorrect(question, answer) {
  if (question.type === 'multi-select') return arraysMatch(answer, question.correctAnswers)
  if (question.type === 'expression') return matchesAlgebraicAnswer(answer, question.acceptedAnswers)
  return answer === question.correctAnswer
}

function feedbackForField(field, answer, decimalFeedback) {
  if (/^-?\d*\.\d+$/.test(String(answer).trim()) && decimalFeedback) return decimalFeedback
  const specific = field.feedbackRules?.find((rule) => (
    rule.answers?.some((candidate) => matchesAlgebraicAnswer(answer, [candidate]))
  ))
  if (specific?.message) return specific.message
  return field.feedbackRules?.find((rule) => !rule.answers && rule.message)?.message || 'Rebuild this value from sine and cosine.'
}

export function SixFunctionValuePractice({ practice, onComplete }) {
  const instanceId = useId()
  const fields = practice?.fields || []
  const [answers, setAnswers] = useState(() => Object.fromEntries(fields.map((field) => [field.id, ''])))
  const [results, setResults] = useState(null)
  const [feedback, setFeedback] = useState({})
  const [hintCount, setHintCount] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const ready = fields.length > 0 && fields.every((field) => answers[field.id]?.trim())

  const check = (event) => {
    event.preventDefault()
    const nextResults = Object.fromEntries(
      fields.map((field) => [field.id, matchesAlgebraicAnswer(answers[field.id], field.acceptedAnswers)]),
    )
    setFeedback(Object.fromEntries(fields.map((field) => [
      field.id,
      feedbackForField(field, answers[field.id], practice.decimalFeedback),
    ])))
    const correct = Object.values(nextResults).every(Boolean)
    setResults(nextResults)
    if (correct) onComplete?.({ correct: true, answers })
  }

  const reset = () => {
    setAnswers(Object.fromEntries(fields.map((field) => [field.id, ''])))
    setResults(null)
    setFeedback({})
    setHintCount(0)
    setShowSolution(false)
  }

  return (
    <article className="six-value-practice">
      <header>
        <p className="trig-lesson-label">{practice?.label || 'Your turn'}</p>
        <h3>{practice?.title}</h3>
        {(practice?.prompt || practice?.directions) && <p>{practice.prompt || practice.directions}</p>}
        {(practice?.promptMath || practice?.problemMath) && <MathDisplay>{practice.promptMath || practice.problemMath}</MathDisplay>}
      </header>

      <form onSubmit={check}>
        <div className="six-value-grid">
          {fields.map((field) => {
            const inputId = `${instanceId}-${field.id}`
            const resultId = `${inputId}-result`
            const fieldResult = results?.[field.id]
            return (
              <label key={field.id} htmlFor={inputId}>
                <MathInline>{field.labelMath || field.mathLabel}</MathInline>
                <input
                  id={inputId}
                  value={answers[field.id] || ''}
                  placeholder={field.placeholder || 'Enter an exact value'}
                  autoComplete="off"
                  aria-invalid={results ? !fieldResult : undefined}
                  aria-describedby={results ? resultId : undefined}
                  onChange={(event) => {
                    setAnswers((current) => ({ ...current, [field.id]: event.target.value }))
                    setResults(null)
                  }}
                />
                {results && (
                  <small id={resultId} className={fieldResult ? 'is-correct' : 'is-incorrect'}>
                    {fieldResult ? (field.correctFeedback || 'Correct.') : feedback[field.id]}
                  </small>
                )}
              </label>
            )
          })}
        </div>

        <div className="trig-lesson-actions">
          <button className="trig-lesson-primary-action" type="submit" disabled={!ready}>Check all six</button>
          <button className="trig-lesson-secondary-action" type="button" disabled={!practice?.hints?.[0]} onClick={() => setHintCount((count) => Math.max(count, 1))}>Hint 1</button>
          <button className="trig-lesson-secondary-action" type="button" disabled={!practice?.hints?.[1]} onClick={() => setHintCount((count) => Math.max(count, 2))}>Hint 2</button>
          <button className="trig-lesson-secondary-action" type="button" onClick={() => setShowSolution(true)}>Show solution</button>
          <button className="trig-lesson-quiet-action" type="button" onClick={reset}>Reset</button>
        </div>
      </form>

      {results && (
        <p className={`six-practice-result ${Object.values(results).every(Boolean) ? 'is-correct' : 'is-incorrect'}`} role="status">
          {Object.values(results).every(Boolean)
            ? 'All six are correct. You built the system from sine and cosine.'
            : 'Some entries need another look. Use the note beside each function.'}
        </p>
      )}
      {hintCount > 0 && (
        <div className="trig-lesson-hints" aria-live="polite">
          {practice.hints.slice(0, hintCount).map((hint, index) => <div key={hint}><strong>Hint {index + 1}</strong><p>{hint}</p></div>)}
        </div>
      )}
      {showSolution && (
        <div className="six-practice-solution" role="status">
          <strong>Full solution</strong>
          {practice.solution?.introduction && <p>{practice.solution.introduction}</p>}
          <div>{practice.solution?.steps?.map((step) => (
            <div key={step.math}><p>{step.text}</p><MathDisplay>{step.math}</MathDisplay></div>
          ))}</div>
          {practice.solution?.answerMath && <MathDisplay>{practice.solution.answerMath}</MathDisplay>}
        </div>
      )}
    </article>
  )
}

function QuestionInput({ question, answer, setAnswer, checked }) {
  const instanceId = useId()
  if (question.type === 'expression') {
    return (
      <label className="six-check-expression" htmlFor={`${instanceId}-answer`}>
        <span>Exact value</span>
        <input
          id={`${instanceId}-answer`}
          value={answer || ''}
          placeholder={question.placeholder || 'Enter an exact value'}
          autoComplete="off"
          aria-invalid={checked ? !questionIsCorrect(question, answer) : undefined}
          onChange={(event) => setAnswer(event.target.value)}
        />
      </label>
    )
  }

  const multi = question.type === 'multi-select'
  return (
    <div className="six-check-options" role={multi ? 'group' : 'radiogroup'} aria-label={question.prompt}>
      {question.options.map((option) => {
        const optionId = `${instanceId}-${option.id}`
        const selected = multi ? (answer || []).includes(option.id) : answer === option.id
        return (
          <label key={option.id} htmlFor={optionId} className={selected ? 'is-selected' : ''}>
            <input
              id={optionId}
              type={multi ? 'checkbox' : 'radio'}
              name={multi ? undefined : `${instanceId}-choice`}
              value={option.id}
              checked={selected}
              onChange={() => {
                if (!multi) return setAnswer(option.id)
                setAnswer(selected ? answer.filter((id) => id !== option.id) : [...(answer || []), option.id])
              }}
            />
            <span>{option.label || option.id}</span>
            {option.math && <MathInline>{option.math}</MathInline>}
          </label>
        )
      })}
    </div>
  )
}

export function SixFunctionsCheck({
  label = 'Quick check',
  title,
  description,
  questions = [],
  previousResult,
  passPercent = 75,
  onComplete,
}) {
  const initialAnswers = useMemo(() => Object.fromEntries(
    questions.map((question) => [question.id, question.type === 'multi-select' ? [] : '']),
  ), [questions])
  const [answers, setAnswers] = useState(initialAnswers)
  const [result, setResult] = useState(null)
  const allAnswered = questions.every((question) => (
    question.type === 'multi-select' ? answers[question.id]?.length : String(answers[question.id] || '').trim()
  ))

  const submit = () => {
    const byQuestion = Object.fromEntries(
      questions.map((question) => [question.id, questionIsCorrect(question, answers[question.id])]),
    )
    const score = Object.values(byQuestion).filter(Boolean).length
    const percent = questions.length ? Math.round((score / questions.length) * 100) : 0
    const nextResult = { score, total: questions.length, percent, passed: percent >= passPercent, byQuestion }
    setResult(nextResult)
    onComplete?.(nextResult)
  }

  const reset = () => {
    setAnswers(initialAnswers)
    setResult(null)
  }

  return (
    <article className="six-functions-check">
      <header>
        <p className="trig-lesson-label">{label}</p>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      <div className="six-check-question-list">
        {questions.map((question, index) => {
          const correct = result?.byQuestion?.[question.id]
          return (
            <fieldset key={question.id}>
              <legend><span>{String(index + 1).padStart(2, '0')}</span>{question.prompt}</legend>
              {question.promptMath && <MathDisplay>{question.promptMath}</MathDisplay>}
              <QuestionInput
                question={question}
                answer={answers[question.id]}
                checked={Boolean(result)}
                setAnswer={(answer) => {
                  setAnswers((current) => ({ ...current, [question.id]: answer }))
                  setResult(null)
                }}
              />
              {result && (
                <div className={`six-check-feedback ${correct ? 'is-correct' : 'is-incorrect'}`}>
                  <strong>{correct ? 'Correct' : 'Review this relationship'}</strong>
                  <p>{question.explanation}</p>
                  {question.explanationMath && <MathDisplay>{question.explanationMath}</MathDisplay>}
                </div>
              )}
            </fieldset>
          )
        })}
      </div>
      {previousResult && !result && (
        <p className="six-check-prior-result">Best saved result: {previousResult.score}/{previousResult.total}</p>
      )}
      <div className="trig-lesson-actions">
        <button className="trig-lesson-primary-action" type="button" disabled={!allAnswered} onClick={submit}>Check my answers</button>
        <button className="trig-lesson-quiet-action" type="button" onClick={reset}>Try again</button>
      </div>
      {result && (
        <div className={`six-check-score ${result.passed ? 'is-passed' : ''}`} role="status">
          <span>{result.score}/{result.total}</span>
          <div><strong>{result.passed ? 'Reviewed' : 'Almost there'}</strong><p>{result.passed ? 'You can reconstruct the six-function system.' : 'Review the feedback, then try once more.'}</p></div>
        </div>
      )}
    </article>
  )
}

export function WhichFunctionsSurvive({ cases = [], onComplete }) {
  const [caseIndex, setCaseIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const [solved, setSolved] = useState([])
  const current = cases[caseIndex]
  const correct = current ? arraysMatch(selected, current.definedFunctions) : false

  const chooseCase = (index) => {
    setCaseIndex(index)
    setSelected([])
    setChecked(false)
  }

  const check = () => {
    setChecked(true)
    if (!correct || solved.includes(current.id)) return
    const nextSolved = [...solved, current.id]
    setSolved(nextSolved)
    if (nextSolved.length === cases.length) onComplete?.({ correct: true, solved: nextSolved })
  }

  if (!current) return null

  return (
    <article className="six-survival-challenge">
      <header><p className="trig-lesson-label">Mini interactive challenge</p><h3>Which functions survive?</h3><p>Choose an axis angle, then select every function that is defined there.</p></header>
      <div className="six-survival-angle-tabs" role="group" aria-label="Choose an axis angle">
        {cases.map((item, index) => (
          <button type="button" aria-pressed={caseIndex === index} key={item.id} onClick={() => chooseCase(index)}>
            <MathInline>{item.angleMath}</MathInline>{solved.includes(item.id) && <span className="sr-only"> solved</span>}
          </button>
        ))}
      </div>
      <div className="six-survival-core">
        <div className="six-survival-axis" role="img" aria-label={current.visualLabel}>
          <span className={`point point--${current.position}`} aria-hidden="true" />
          <span className="horizontal" aria-hidden="true" /><span className="vertical" aria-hidden="true" />
          <MathDisplay>{current.coordinateMath}</MathDisplay>
        </div>
        <div>
          <div className="six-function-selector" role="group" aria-label="Functions defined at the selected angle">
            {FUNCTION_IDS.map((id) => (
              <label key={id} className={selected.includes(id) ? 'is-selected' : ''}>
                <input
                  type="checkbox"
                  checked={selected.includes(id)}
                  onChange={() => {
                    setSelected((currentSelection) => currentSelection.includes(id)
                      ? currentSelection.filter((value) => value !== id)
                      : [...currentSelection, id])
                    setChecked(false)
                  }}
                />
                <MathInline>{`\\${id}\\theta`}</MathInline>
              </label>
            ))}
          </div>
          <button className="trig-lesson-primary-action" type="button" disabled={!selected.length} onClick={check}>Check functions</button>
        </div>
      </div>
      {checked && (
        <div className={`six-survival-feedback ${correct ? 'is-correct' : 'is-incorrect'}`} role="status">
          <strong>{correct ? 'Exactly.' : 'Check the denominators.'}</strong>
          <p>{current.explanation}</p>
          <MathDisplay>{current.reasonMath}</MathDisplay>
        </div>
      )}
      <p className="six-survival-progress">{solved.length}/{cases.length} axis cases solved</p>
    </article>
  )
}

export default SixFunctionValuePractice
