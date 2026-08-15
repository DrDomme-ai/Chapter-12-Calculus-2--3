import { useId, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import { matchesAlgebraicAnswer } from '../algebraicEquivalence'
import '../../../styles/exact-value-practice.css'

const defaultQuestions = Object.freeze([
  {
    id: 'sin-pi-six',
    functionName: 'sin',
    angleMath: String.raw`\frac{\pi}{6}`,
    promptMath: String.raw`\sin\left(\frac{\pi}{6}\right)`,
    acceptedAnswers: ['1/2'],
    answerMath: String.raw`\frac12`,
    hint: 'Sine is the vertical coordinate of the unit-circle point. Locate the angle in Quadrant I.',
    explanation: 'At this special angle, the vertical coordinate of the unit-circle point is one half.',
  },
  {
    id: 'cos-three-pi-four',
    functionName: 'cos',
    angleMath: String.raw`\frac{3\pi}{4}`,
    promptMath: String.raw`\cos\left(\frac{3\pi}{4}\right)`,
    acceptedAnswers: ['-sqrt(2)/2', '-1/sqrt(2)'],
    answerMath: String.raw`-\frac{\sqrt2}{2}`,
    hint: 'Cosine is the horizontal coordinate. First identify the quadrant, then use the reference angle.',
    explanation: 'The reference angle is π/4, and the horizontal coordinate is negative in Quadrant II.',
  },
  {
    id: 'tan-five-pi-four',
    functionName: 'tan',
    angleMath: String.raw`\frac{5\pi}{4}`,
    promptMath: String.raw`\tan\left(\frac{5\pi}{4}\right)`,
    acceptedAnswers: ['1'],
    answerMath: '1',
    hint: 'Use tangent as sine divided by cosine, and check the signs of both coordinates in this quadrant.',
    explanation: 'The sine and cosine coordinates are equal and have the same sign, so their quotient is 1.',
  },
  {
    id: 'sin-seven-pi-six',
    functionName: 'sin',
    angleMath: String.raw`\frac{7\pi}{6}`,
    promptMath: String.raw`\sin\left(\frac{7\pi}{6}\right)`,
    acceptedAnswers: ['-1/2'],
    answerMath: String.raw`-\frac12`,
    hint: 'The reference angle is π/6. Decide the sign of the vertical coordinate in Quadrant III.',
    explanation: 'The π/6 reference value supplies the magnitude, while Quadrant III makes sine negative.',
  },
  {
    id: 'cos-eleven-pi-six',
    functionName: 'cos',
    angleMath: String.raw`\frac{11\pi}{6}`,
    promptMath: String.raw`\cos\left(\frac{11\pi}{6}\right)`,
    acceptedAnswers: ['sqrt(3)/2'],
    answerMath: String.raw`\frac{\sqrt3}{2}`,
    hint: 'Read the horizontal coordinate and use the π/6 reference angle in Quadrant IV.',
    explanation: 'Cosine is positive in Quadrant IV, and its magnitude comes from the π/6 special triangle.',
  },
  {
    id: 'tan-pi-two',
    functionName: 'tan',
    angleMath: String.raw`\frac{\pi}{2}`,
    promptMath: String.raw`\tan\left(\frac{\pi}{2}\right)`,
    acceptedAnswers: ['undefined', 'DNE', 'does not exist', 'not defined'],
    answerMath: String.raw`\text{undefined}`,
    hint: 'Write tangent as sine divided by cosine and inspect the denominator at this angle.',
    explanation: 'Cosine is zero here, so the quotient defining tangent has a zero denominator.',
  },
  {
    id: 'csc-three-pi-two',
    functionName: 'csc',
    angleMath: String.raw`\frac{3\pi}{2}`,
    promptMath: String.raw`\csc\left(\frac{3\pi}{2}\right)`,
    acceptedAnswers: ['-1'],
    answerMath: '-1',
    hint: 'Cosecant is the reciprocal of sine. Read the vertical coordinate first.',
    explanation: 'The unit-circle point has sine −1, whose reciprocal is also −1.',
  },
  {
    id: 'sec-pi',
    functionName: 'sec',
    angleMath: String.raw`\pi`,
    promptMath: String.raw`\sec\left(\pi\right)`,
    acceptedAnswers: ['-1'],
    answerMath: '-1',
    hint: 'Secant is the reciprocal of the horizontal unit-circle coordinate.',
    explanation: 'At π radians, cosine is −1, and its reciprocal remains −1.',
  },
])

const undefinedAliases = new Set([
  'undefined',
  'dne',
  'doesnotexist',
  'notdefined',
  'noanswer',
])

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/\u03c0/g, 'pi')
    .replace(/\u221a/g, 'sqrt')
    .replace(/\\left|\\right/g, '')
    .replace(/\\d?frac/g, 'frac')
    .replace(/[\s_{}()[\],.]/g, '')
}

function isUndefined(value) {
  return undefinedAliases.has(normalizeText(value))
}

function answerIsCorrect(answer, acceptedAnswers) {
  const accepted = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers]
  if (!String(answer).trim() || accepted.length === 0) return false

  if (accepted.some(isUndefined)) return isUndefined(answer)
  const decimalPattern = /(?:^|[^a-z])[-+]?(?:\d+\.\d*|\.\d+)/i
  const decimalExplicitlyAccepted = accepted.some((candidate) => decimalPattern.test(String(candidate)))
  if (decimalPattern.test(String(answer)) && !decimalExplicitlyAccepted) return false
  if (accepted.some((candidate) => normalizeText(candidate) === normalizeText(answer))) return true
  return matchesAlgebraicAnswer(answer, accepted)
}

function parseAngle(angleMath) {
  const source = String(angleMath || '')
    .replace(/\\left|\\right/g, '')
    .replace(/\s+/g, '')
    .replace(/[{}]/g, '')
    .replace(/\u03c0|\\pi/g, 'pi')

  const degreeMatch = source.match(/^([+-]?\d+(?:\.\d+)?)\^?(?:\\circ|°)$/)
  if (degreeMatch) return (Number(degreeMatch[1]) * Math.PI) / 180

  const fractionMatch = source.match(/^([+-]?)\\(?:d?frac)([+-]?\d*)pi(\d+)$/)
  if (fractionMatch) {
    const sign = fractionMatch[1] === '-' ? -1 : 1
    const numerator = Number(fractionMatch[2] || 1)
    return sign * numerator * Math.PI / Number(fractionMatch[3])
  }

  const plainPiMatch = source.match(/^([+-]?)(\d*)pi(?:\/(\d+))?$/)
  if (plainPiMatch) {
    const sign = plainPiMatch[1] === '-' ? -1 : 1
    const numerator = Number(plainPiMatch[2] || 1)
    const denominator = Number(plainPiMatch[3] || 1)
    return sign * numerator * Math.PI / denominator
  }

  const numeric = Number(source)
  return Number.isFinite(numeric) ? numeric : 0
}

function normalizeAngle(angle) {
  const fullTurn = 2 * Math.PI
  return ((angle % fullTurn) + fullTurn) % fullTurn
}

function describePosition(angle) {
  const tolerance = 1e-7
  const x = Math.cos(angle)
  const y = Math.sin(angle)
  if (Math.abs(y) < tolerance && x > 0) return 'on the positive x-axis'
  if (Math.abs(x) < tolerance && y > 0) return 'on the positive y-axis'
  if (Math.abs(y) < tolerance && x < 0) return 'on the negative x-axis'
  if (Math.abs(x) < tolerance && y < 0) return 'on the negative y-axis'
  if (x > 0 && y > 0) return 'in Quadrant I'
  if (x < 0 && y > 0) return 'in Quadrant II'
  if (x < 0 && y < 0) return 'in Quadrant III'
  return 'in Quadrant IV'
}

function UnitCircleClue({ question }) {
  const titleId = useId()
  const descriptionId = useId()
  const centerX = 150
  const centerY = 137
  const radius = 94
  const angle = normalizeAngle(parseAngle(question.angleMath))
  const pointX = centerX + radius * Math.cos(angle)
  const pointY = centerY - radius * Math.sin(angle)
  const largeArc = angle > Math.PI ? 1 : 0
  const arcRadius = 31
  const arcEndX = centerX + arcRadius * Math.cos(angle)
  const arcEndY = centerY - arcRadius * Math.sin(angle)
  const arcPath = angle < 1e-7
    ? ''
    : `M ${centerX + arcRadius} ${centerY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`
  const position = describePosition(angle)

  return (
    <figure className="trig-exact-circle-clue">
      <svg viewBox="0 0 320 285" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>Unit-circle clue for the current exact-value question</title>
        <desc id={descriptionId}>The reference point P lies {position}. Dashed horizontal and vertical guides show the signs of its coordinates without labeling their exact values.</desc>
        <line className="trig-exact-axis" x1="28" y1={centerY} x2="292" y2={centerY} />
        <polygon className="trig-exact-axis-arrow" points={`292,${centerY} 282,${centerY - 5} 282,${centerY + 5}`} />
        <line className="trig-exact-axis" x1={centerX} y1="12" x2={centerX} y2="264" />
        <polygon className="trig-exact-axis-arrow" points={`${centerX},12 ${centerX - 5},22 ${centerX + 5},22`} />
        <circle className="trig-exact-unit-circle" cx={centerX} cy={centerY} r={radius} />
        <line className="trig-exact-radius" x1={centerX} y1={centerY} x2={pointX} y2={pointY} />
        <line className="trig-exact-coordinate-guide" x1={pointX} y1={pointY} x2={pointX} y2={centerY} />
        <line className="trig-exact-coordinate-guide" x1={pointX} y1={pointY} x2={centerX} y2={pointY} />
        {arcPath && <path className="trig-exact-angle-arc" d={arcPath} />}
        <circle className="trig-exact-reference-point" cx={pointX} cy={pointY} r="7" />
        <text className="trig-exact-point-label" x={pointX + (pointX >= centerX ? 11 : -20)} y={pointY - 11}>P</text>
        <text className="trig-exact-axis-label" x="296" y={centerY + 5}>x</text>
        <text className="trig-exact-axis-label" x={centerX + 8} y="17">y</text>
        <text className="trig-exact-origin-label" x={centerX + 7} y={centerY + 17}>O</text>
        <text className="trig-exact-angle-label" x={centerX + 39} y={centerY - 10}>θ</text>
      </svg>
      <figcaption>
        <span>Visual clue:</span> the point lies {position}. The dashed guides show horizontal and vertical coordinates; determine their exact values yourself.
      </figcaption>
    </figure>
  )
}

function ExactValuePracticeSession({ questionBank, onResult }) {
  const inputId = useId()
  const feedbackId = useId()
  const [currentId, setCurrentId] = useState(questionBank[0].id)
  const [remainingIds, setRemainingIds] = useState(() => questionBank.slice(1).map((question) => question.id))
  const [cyclePosition, setCyclePosition] = useState(1)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [hintVisible, setHintVisible] = useState(false)
  const [circleVisible, setCircleVisible] = useState(false)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const currentIndex = questionBank.findIndex((question) => question.id === currentId)
  const question = questionBank[currentIndex >= 0 ? currentIndex : 0]

  const clearQuestionState = () => {
    setAnswer('')
    setFeedback(null)
    setHintVisible(false)
    setCircleVisible(false)
    setSolutionVisible(false)
  }

  const checkAnswer = () => {
    if (!answer.trim()) return
    const correct = answerIsCorrect(answer, question.acceptedAnswers)
    setFeedback(correct ? 'correct' : 'incorrect')
    onResult?.({ questionId: question.id, question, answer, correct })
  }

  const nextQuestion = () => {
    const startingNewCycle = remainingIds.length === 0
    const pool = remainingIds.length
      ? remainingIds
      : questionBank.map((item) => item.id).filter((id) => id !== question.id)
    if (pool.length === 0) {
      clearQuestionState()
      return
    }
    const selectedPoolIndex = Math.floor(Math.random() * pool.length)
    setCurrentId(pool[selectedPoolIndex])
    setRemainingIds(pool.filter((_, index) => index !== selectedPoolIndex))
    setCyclePosition((current) => (startingNewCycle ? 1 : current + 1))
    clearQuestionState()
  }

  const reset = () => {
    setCurrentId(questionBank[0].id)
    setRemainingIds(questionBank.slice(1).map((item) => item.id))
    setCyclePosition(1)
    clearQuestionState()
  }

  const displayPrompt = question.promptMath
    || String.raw`\operatorname{${question.functionName}}\left(${question.angleMath}\right)`

  return (
    <section className="trig-exact-practice" aria-labelledby={`${inputId}-title`}>
      <header className="trig-exact-practice-heading">
        <div>
          <p className="trig-exact-label">Exact-value practice</p>
          <h3 id={`${inputId}-title`}>Read the circle. Give an exact value.</h3>
          <p>Use a special angle, its quadrant, and the relationship among the six trigonometric functions. Avoid decimal approximations.</p>
        </div>
        <span>Question {cyclePosition} of {questionBank.length}</span>
      </header>

      <div className="trig-exact-prompt">
        <span>Evaluate</span>
        <MathDisplay>{displayPrompt}</MathDisplay>
      </div>

      <label className="trig-exact-answer" htmlFor={inputId}>
        <span>Your exact answer</span>
        <input
          id={inputId}
          value={answer}
          placeholder="Example: sqrt(3)/2"
          autoComplete="off"
          spellCheck="false"
          aria-describedby={feedback ? feedbackId : undefined}
          aria-invalid={feedback === 'incorrect' ? 'true' : undefined}
          onChange={(event) => { setAnswer(event.target.value); setFeedback(null); setSolutionVisible(false) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              checkAnswer()
            }
          }}
        />
        <small>Use pi for π, sqrt(2) for √2, or type “undefined” when appropriate.</small>
      </label>

      <div className="trig-exact-actions">
        <button type="button" className="trig-exact-primary" onClick={checkAnswer} disabled={!answer.trim()}>Check answer</button>
        <button type="button" onClick={() => setHintVisible(true)} disabled={!question.hint}>Hint</button>
        <button type="button" aria-expanded={circleVisible} onClick={() => setCircleVisible((visible) => !visible)}>
          {circleVisible ? 'Hide unit circle' : 'Show unit circle'}
        </button>
        <button type="button" onClick={() => setSolutionVisible(true)}>Show solution</button>
        <button type="button" onClick={nextQuestion}>Next question</button>
        <button type="button" className="trig-exact-quiet" onClick={reset}>Reset</button>
      </div>

      {feedback && (
        <p id={feedbackId} className={`trig-exact-feedback is-${feedback}`} role="status">
          {feedback === 'correct'
            ? 'Correct. Your exact value matches the unit-circle relationship.'
            : `Not yet. Recheck the quadrant and the definition of ${question.functionName}.`}
        </p>
      )}

      {hintVisible && (
        <aside className="trig-exact-hint" aria-live="polite">
          <strong>Conceptual hint</strong>
          <p>{question.hint}</p>
        </aside>
      )}

      {circleVisible && <UnitCircleClue question={question} />}

      {solutionVisible && (
        <aside className="trig-exact-solution" role="status">
          <strong>Solution</strong>
          <div className="trig-exact-solution-equation">
            <MathInline>{displayPrompt}</MathInline><span aria-hidden="true">=</span><MathInline>{question.answerMath}</MathInline>
          </div>
          <p>{question.explanation}</p>
        </aside>
      )}
    </section>
  )
}

export function ExactValuePractice({ questions, onResult }) {
  const questionBank = useMemo(() => {
    const supplied = Array.isArray(questions) ? questions.filter((question) => question?.id) : []
    return supplied.length ? supplied : defaultQuestions
  }, [questions])
  const questionSetKey = questionBank.map((question) => question.id).join('|')

  return <ExactValuePracticeSession key={questionSetKey} questionBank={questionBank} onResult={onResult} />
}

export default ExactValuePractice
