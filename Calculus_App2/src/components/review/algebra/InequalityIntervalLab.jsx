import { useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const VIEW_WIDTH = 720
const PLOT_LEFT = 38
const PLOT_RIGHT = 682
const AXIS_MIN = -10
const AXIS_MAX = 10
const TICKS = Array.from({ length: AXIS_MAX - AXIS_MIN + 1 }, (_, index) => AXIS_MIN + index)

function numberToX(value) {
  return PLOT_LEFT + ((value - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (PLOT_RIGHT - PLOT_LEFT)
}

function comparisonMath(a, b) {
  if (a > b) return 'a>b'
  if (a < b) return 'a<b'
  return 'a=b'
}

function ComparisonNumberLine({ a, b }) {
  const relation = a > b ? 'greater than' : a < b ? 'less than' : 'equal to'

  return (
    <svg
      className="algebra-comparison-number-line"
      viewBox={`0 0 ${VIEW_WIDTH} 128`}
      role="img"
      aria-label={`Number line showing a equals ${a}, which is ${relation} b equals ${b}`}
    >
      <line x1={PLOT_LEFT} y1="70" x2={PLOT_RIGHT} y2="70" className="algebra-number-line-axis" />
      <polygon points={`${PLOT_LEFT},70 ${PLOT_LEFT + 12},63 ${PLOT_LEFT + 12},77`} className="algebra-number-line-arrow" />
      <polygon points={`${PLOT_RIGHT},70 ${PLOT_RIGHT - 12},63 ${PLOT_RIGHT - 12},77`} className="algebra-number-line-arrow" />
      {TICKS.filter((tick) => tick % 2 === 0).map((tick) => (
        <g key={tick}>
          <line x1={numberToX(tick)} y1="64" x2={numberToX(tick)} y2="76" className="algebra-number-line-tick" />
          <text x={numberToX(tick)} y="99" textAnchor="middle" className="algebra-number-line-label">{tick}</text>
        </g>
      ))}
      <line x1={numberToX(a)} y1="43" x2={numberToX(a)} y2="70" className="algebra-comparison-guide algebra-comparison-guide-a" />
      <circle key={`a-${a}`} cx={numberToX(a)} cy="70" r="9" className="algebra-comparison-point algebra-comparison-point-a">
        <animate attributeName="r" values="5;11;9" dur="0.3s" />
      </circle>
      <text x={numberToX(a)} y="31" textAnchor="middle" className="algebra-comparison-label algebra-comparison-label-a">a = {a}</text>
      <line x1={numberToX(b)} y1="70" x2={numberToX(b)} y2="110" className="algebra-comparison-guide algebra-comparison-guide-b" />
      <circle key={`b-${b}`} cx={numberToX(b)} cy="70" r="7" className="algebra-comparison-point algebra-comparison-point-b">
        <animate attributeName="r" values="4;10;7" dur="0.3s" />
      </circle>
      <text x={numberToX(b)} y="122" textAnchor="middle" className="algebra-comparison-label algebra-comparison-label-b">b = {b}</text>
    </svg>
  )
}

function intervalNotation({ left, right, leftClosed, rightClosed, leftUnbounded, rightUnbounded }) {
  const opening = leftUnbounded || !leftClosed ? '(' : '['
  const closing = rightUnbounded || !rightClosed ? ')' : ']'
  const lower = leftUnbounded ? String.raw`-\infty` : String(left)
  const upper = rightUnbounded ? String.raw`\infty` : String(right)

  return `${opening}${lower},${upper}${closing}`
}

function intervalDescription({ left, right, leftClosed, rightClosed, leftUnbounded, rightUnbounded }) {
  if (leftUnbounded && rightUnbounded) return 'Every real number is highlighted.'

  const leftPhrase = leftUnbounded
    ? 'extends without bound to the left'
    : `${leftClosed ? 'includes' : 'does not include'} ${left}`
  const rightPhrase = rightUnbounded
    ? 'extends without bound to the right'
    : `${rightClosed ? 'includes' : 'does not include'} ${right}`

  return `The interval ${leftPhrase} and ${rightPhrase}.`
}

function IntervalNumberLine({ interval }) {
  const { left, right, leftClosed, rightClosed, leftUnbounded, rightUnbounded } = interval
  const start = leftUnbounded ? PLOT_LEFT : numberToX(left)
  const end = rightUnbounded ? PLOT_RIGHT : numberToX(right)

  return (
    <svg
      className="algebra-interval-number-line"
      viewBox={`0 0 ${VIEW_WIDTH} 128`}
      role="img"
      aria-label={intervalDescription(interval)}
    >
      <line x1={PLOT_LEFT} y1="58" x2={PLOT_RIGHT} y2="58" className="algebra-number-line-axis" />
      {TICKS.map((tick) => (
        <g key={tick}>
          <line x1={numberToX(tick)} y1="52" x2={numberToX(tick)} y2="64" className="algebra-number-line-tick" />
          {tick % 2 === 0 && <text x={numberToX(tick)} y="87" textAnchor="middle" className="algebra-number-line-label">{tick}</text>}
        </g>
      ))}
      <line x1={start} y1="58" x2={end} y2="58" className="algebra-interval-highlight" />
      {leftUnbounded
        ? <polygon points={`${PLOT_LEFT},58 ${PLOT_LEFT + 17},47 ${PLOT_LEFT + 17},69`} className="algebra-interval-ray" />
        : <circle cx={start} cy="58" r="10" className={leftClosed ? 'algebra-interval-endpoint algebra-interval-endpoint-closed' : 'algebra-interval-endpoint algebra-interval-endpoint-open'} />}
      {rightUnbounded
        ? <polygon points={`${PLOT_RIGHT},58 ${PLOT_RIGHT - 17},47 ${PLOT_RIGHT - 17},69`} className="algebra-interval-ray" />
        : <circle cx={end} cy="58" r="10" className={rightClosed ? 'algebra-interval-endpoint algebra-interval-endpoint-closed' : 'algebra-interval-endpoint algebra-interval-endpoint-open'} />}
      <text x={VIEW_WIDTH / 2} y="116" textAnchor="middle" className="algebra-interval-accessibility-key">
        Filled endpoint: included. Hollow endpoint: excluded. Arrow: continues forever.
      </text>
    </svg>
  )
}

function normalizeInequality(value) {
  return value
    .toLowerCase()
    .replace(/[−–]/g, '-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/\bin\b/g, 'in')
    .replace(/\s+/g, '')
}

function isReverseAnswerCorrect(value) {
  const answer = normalizeInequality(value)
  return new Set([
    '-2<x<=5',
    'x>-2andx<=5',
    'x<=5andx>-2',
    'x>-2,x<=5',
    'x<=5,x>-2',
    'xin(-2,5]',
  ]).has(answer)
}

export function InequalityIntervalLab() {
  const [a, setA] = useState(4)
  const [b, setB] = useState(-2)
  const [interval, setInterval] = useState({
    left: -3,
    right: 4,
    leftClosed: true,
    rightClosed: false,
    leftUnbounded: false,
    rightUnbounded: false,
  })
  const [reverseAnswer, setReverseAnswer] = useState('')
  const [reverseFeedback, setReverseFeedback] = useState(null)
  const [hintLevel, setHintLevel] = useState(0)

  const updateInterval = (change) => {
    setInterval((current) => ({ ...current, ...change }))
  }

  const updateLeft = (event) => {
    const requested = Number(event.target.value)
    updateInterval({ left: Math.min(requested, interval.right - 1) })
  }

  const updateRight = (event) => {
    const requested = Number(event.target.value)
    updateInterval({ right: Math.max(requested, interval.left + 1) })
  }

  const checkReverseAnswer = () => {
    if (!reverseAnswer.trim()) {
      setReverseFeedback({ kind: 'try', message: 'Enter an inequality before checking.' })
      return
    }

    setReverseFeedback(isReverseAnswerCorrect(reverseAnswer)
      ? { kind: 'correct', message: 'Correct. The open endpoint excludes -2, while the filled endpoint includes 5.' }
      : { kind: 'try', message: 'Not yet. Match each endpoint with a strict or inclusive inequality.' })
  }

  const relation = a > b ? '>' : a < b ? '<' : '='
  const relationWords = a > b
    ? 'a is to the right of b, so a is greater.'
    : a < b
      ? 'a is to the left of b, so a is less.'
      : 'The points coincide, so the values are equal.'

  return (
    <section className="algebra-inequality-lab" aria-labelledby="algebra-inequality-heading">
      <header className="algebra-lab-heading">
        <div>
          <span className="algebra-lab-label">Interactive inequality lab</span>
          <h3 id="algebra-inequality-heading">Position gives inequalities meaning</h3>
        </div>
        <p>
          On a number line, larger values live farther right. Thus <MathInline>{'a>b'}</MathInline> places{' '}
          <MathInline>{'a'}</MathInline> to the right of <MathInline>{'b'}</MathInline>, while{' '}
          <MathInline>{'a<b'}</MathInline> places it to the left.
        </p>
      </header>

      <div className="algebra-comparison-lab">
        <div className="algebra-comparison-controls">
          <label className="algebra-control-label">
            Value of a: <output>{a}</output>
            <input type="range" min={AXIS_MIN} max={AXIS_MAX} step="1" value={a} onChange={(event) => setA(Number(event.target.value))} />
          </label>
          <label className="algebra-control-label">
            Value of b: <output>{b}</output>
            <input type="range" min={AXIS_MIN} max={AXIS_MAX} step="1" value={b} onChange={(event) => setB(Number(event.target.value))} />
          </label>
        </div>
        <ComparisonNumberLine a={a} b={b} />
        <div className="algebra-comparison-result" aria-live="polite">
          <MathDisplay>{`${a}${relation}${b}`}</MathDisplay>
          <p>{relationWords}</p>
          <span className="algebra-comparison-symbol"><MathInline>{comparisonMath(a, b)}</MathInline></span>
        </div>
      </div>

      <div className="algebra-interval-builder" aria-labelledby="algebra-interval-builder-heading">
        <div className="algebra-builder-introduction">
          <span className="algebra-lab-label">Build an interval</span>
          <h3 id="algebra-interval-builder-heading">Choose the boundaries and decide whether they belong</h3>
          <p>Brackets include finite endpoints; parentheses leave them out. Infinity is a direction, not an endpoint, so it always receives a parenthesis.</p>
        </div>

        <div className="algebra-interval-controls">
          <fieldset className="algebra-interval-boundary">
            <legend>Left boundary</legend>
            <label className="algebra-checkbox-label">
              <input
                type="checkbox"
                checked={interval.leftUnbounded}
                onChange={(event) => updateInterval({ leftUnbounded: event.target.checked })}
              />
              Continue to negative infinity
            </label>
            <label className="algebra-control-label">
              Left endpoint: <output>{interval.left}</output>
              <input
                type="range"
                min="-9"
                max="8"
                step="1"
                value={interval.left}
                disabled={interval.leftUnbounded}
                onChange={updateLeft}
              />
            </label>
            <label className="algebra-control-label">
              Endpoint style
              <select
                value={interval.leftClosed ? 'closed' : 'open'}
                disabled={interval.leftUnbounded}
                onChange={(event) => updateInterval({ leftClosed: event.target.value === 'closed' })}
              >
                <option value="open">Open — exclude it</option>
                <option value="closed">Closed — include it</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="algebra-interval-boundary">
            <legend>Right boundary</legend>
            <label className="algebra-checkbox-label">
              <input
                type="checkbox"
                checked={interval.rightUnbounded}
                onChange={(event) => updateInterval({ rightUnbounded: event.target.checked })}
              />
              Continue to positive infinity
            </label>
            <label className="algebra-control-label">
              Right endpoint: <output>{interval.right}</output>
              <input
                type="range"
                min="-8"
                max="9"
                step="1"
                value={interval.right}
                disabled={interval.rightUnbounded}
                onChange={updateRight}
              />
            </label>
            <label className="algebra-control-label">
              Endpoint style
              <select
                value={interval.rightClosed ? 'closed' : 'open'}
                disabled={interval.rightUnbounded}
                onChange={(event) => updateInterval({ rightClosed: event.target.value === 'closed' })}
              >
                <option value="open">Open — exclude it</option>
                <option value="closed">Closed — include it</option>
              </select>
            </label>
          </fieldset>
        </div>

        <IntervalNumberLine interval={interval} />
        <div className="algebra-interval-output" aria-live="polite">
          <span>Interval notation</span>
          <MathDisplay>{intervalNotation(interval)}</MathDisplay>
          <p>{intervalDescription(interval)}</p>
        </div>
      </div>

      <div className="algebra-reverse-interval" aria-labelledby="algebra-reverse-heading">
        <span className="algebra-lab-label">Reverse the representation</span>
        <h3 id="algebra-reverse-heading">Write this interval as an inequality</h3>
        <MathDisplay>{'(-2,5]'}</MathDisplay>
        <label className="algebra-answer-label" htmlFor="algebra-reverse-answer">
          Inequality for x
          <input
            id="algebra-reverse-answer"
            type="text"
            value={reverseAnswer}
            onChange={(event) => {
              setReverseAnswer(event.target.value)
              setReverseFeedback(null)
            }}
            placeholder="For example: -2 < x <= 5"
            autoComplete="off"
          />
        </label>
        <div className="algebra-answer-actions">
          <button type="button" onClick={checkReverseAnswer}>Check answer</button>
          <button type="button" onClick={() => setHintLevel((current) => Math.max(current, 1))}>Hint 1</button>
          <button type="button" onClick={() => setHintLevel((current) => Math.max(current, 2))}>Hint 2</button>
          <button type="button" onClick={() => setHintLevel(3)}>Show solution</button>
        </div>
        {hintLevel >= 1 && <p className="algebra-answer-hint">The parenthesis at -2 means the boundary is not part of the interval.</p>}
        {hintLevel >= 2 && <p className="algebra-answer-hint">The bracket at 5 means that 5 is included.</p>}
        {hintLevel >= 3 && <div className="algebra-answer-solution"><MathDisplay>{String.raw`-2<x\le 5`}</MathDisplay></div>}
        {reverseFeedback && (
          <p className={`algebra-answer-feedback algebra-answer-feedback-${reverseFeedback.kind}`} role="status">
            {reverseFeedback.message}
          </p>
        )}
      </div>
    </section>
  )
}

export default InequalityIntervalLab
