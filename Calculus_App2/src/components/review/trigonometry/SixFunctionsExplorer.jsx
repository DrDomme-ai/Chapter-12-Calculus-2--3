import { useId, useRef, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import { unitCircleSpecialAngles } from '../../../data/unitCircleLesson'
import '../../../styles/six-functions-explorer.css'

const VIEW_SIZE = 520
const CENTER = VIEW_SIZE / 2
const RADIUS = 190
const EPSILON = 1e-9
const SNAP_TOLERANCE = 4

const specialAngles = unitCircleSpecialAngles.map((angle) => ({
  ...angle,
  radiansMath: angle.radianMath,
  cosineMath: angle.cosMath,
  sineMath: angle.sinMath,
  tangentMath: angle.tanMath,
}))

const reciprocalPairs = [
  { base: 'sin', reciprocal: 'csc', baseMath: String.raw`\sin\theta`, reciprocalMath: String.raw`\csc\theta`, formula: String.raw`\csc\theta=\frac{1}{\sin\theta}` },
  { base: 'cos', reciprocal: 'sec', baseMath: String.raw`\cos\theta`, reciprocalMath: String.raw`\sec\theta`, formula: String.raw`\sec\theta=\frac{1}{\cos\theta}` },
  { base: 'tan', reciprocal: 'cot', baseMath: String.raw`\tan\theta`, reciprocalMath: String.raw`\cot\theta`, formula: String.raw`\cot\theta=\frac{\cos\theta}{\sin\theta}\quad\left(=\frac1{\tan\theta}\text{ when tangent is defined}\right)` },
]

const reciprocalExactValues = new Map([
  ['1', '1'],
  ['-1', '-1'],
  ['0', String.raw`\text{undefined}`],
  [String.raw`\frac12`, '2'],
  [String.raw`-\frac12`, '-2'],
  [String.raw`\frac{\sqrt2}{2}`, String.raw`\sqrt2`],
  [String.raw`-\frac{\sqrt2}{2}`, String.raw`-\sqrt2`],
  [String.raw`\frac{\sqrt3}{2}`, String.raw`\frac{2\sqrt3}{3}`],
  [String.raw`-\frac{\sqrt3}{2}`, String.raw`-\frac{2\sqrt3}{3}`],
  [String.raw`\sqrt3`, String.raw`\frac{\sqrt3}{3}`],
  [String.raw`-\sqrt3`, String.raw`-\frac{\sqrt3}{3}`],
  [String.raw`\frac{\sqrt3}{3}`, String.raw`\sqrt3`],
  [String.raw`-\frac{\sqrt3}{3}`, String.raw`-\sqrt3`],
])

function greatestCommonDivisor(first, second) {
  let a = Math.abs(Math.round(first))
  let b = Math.abs(Math.round(second))
  while (b) {
    const remainder = a % b
    a = b
    b = remainder
  }
  return a || 1
}

function radiansMath(degrees) {
  if (degrees === 0) return '0'
  const divisor = greatestCommonDivisor(degrees, 180)
  const numerator = degrees / divisor
  const denominator = 180 / divisor
  if (denominator === 1) return numerator === 1 ? String.raw`\pi` : String.raw`${numerator}\pi`
  return numerator === 1
    ? String.raw`\frac{\pi}{${denominator}}`
    : String.raw`\frac{${numerator}\pi}{${denominator}}`
}

function pointForDegrees(degrees, radius = RADIUS) {
  const radians = (degrees * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER - radius * Math.sin(radians),
  }
}

function nearestSpecial(degrees) {
  return specialAngles.reduce((nearest, candidate) => (
    Math.abs(candidate.degrees - degrees) < Math.abs(nearest.degrees - degrees)
      ? candidate
      : nearest
  ), specialAngles[0])
}

function normalizedPointerAngle(event, svg, previousAngle) {
  const bounds = svg.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * VIEW_SIZE
  const y = ((event.clientY - bounds.top) / bounds.height) * VIEW_SIZE
  let degrees = (Math.atan2(CENTER - y, x - CENTER) * 180) / Math.PI
  if (degrees < 0) degrees += 360
  const rounded = Math.round(degrees)
  if (rounded === 0 && previousAngle > 270) return 360
  return rounded
}

function formatDecimal(value) {
  if (!Number.isFinite(value)) return 'undefined'
  if (Math.abs(value) < EPSILON) return '0'
  return Number(value.toFixed(3)).toString()
}

function reciprocalDisplay(exactValue, numericValue) {
  if (exactValue && reciprocalExactValues.has(exactValue)) return reciprocalExactValues.get(exactValue)
  if (Math.abs(numericValue) < EPSILON) return String.raw`\text{undefined}`
  return formatDecimal(1 / numericValue)
}

function SpecialAngleLabel({ angle }) {
  const position = pointForDegrees(angle.degrees, 226)
  return (
    <foreignObject x={position.x - 42} y={position.y - 15} width="84" height="30" className="six-functions-angle-label">
      <div xmlns="http://www.w3.org/1999/xhtml"><MathInline>{angle.radiansMath}</MathInline></div>
    </foreignObject>
  )
}

function valueRecord(angle) {
  const radians = (angle * Math.PI) / 180
  const sine = Math.sin(radians)
  const cosine = Math.cos(radians)
  const special = specialAngles.find((item) => item.degrees === angle)
  const sineMath = special?.sineMath ?? formatDecimal(sine)
  const cosineMath = special?.cosineMath ?? formatDecimal(cosine)
  const tangentDefined = Math.abs(cosine) >= EPSILON
  const cotangentDefined = Math.abs(sine) >= EPSILON

  return {
    radians,
    sine,
    cosine,
    special,
    sineMath,
    cosineMath,
    tangentDefined,
    tangentMath: special?.tangentMath ?? (tangentDefined ? formatDecimal(sine / cosine) : String.raw`\text{undefined}`),
    cosecantMath: reciprocalDisplay(special?.sineMath, sine),
    secantMath: reciprocalDisplay(special?.cosineMath, cosine),
    cotangentMath: !cotangentDefined
      ? String.raw`\text{undefined}`
      : !tangentDefined
        ? '0'
        : special?.tangentMath
          ? reciprocalDisplay(special.tangentMath, sine / cosine)
          : formatDecimal(cosine / sine),
    cosecantDefined: Math.abs(sine) >= EPSILON,
    secantDefined: Math.abs(cosine) >= EPSILON,
    cotangentDefined,
  }
}

const functionMeta = [
  { key: 'sine', short: 'sin', nameMath: String.raw`\sin\theta`, valueKey: 'sineMath', foundation: 'vertical coordinate' },
  { key: 'cosine', short: 'cos', nameMath: String.raw`\cos\theta`, valueKey: 'cosineMath', foundation: 'horizontal coordinate' },
  { key: 'tangent', short: 'tan', nameMath: String.raw`\tan\theta`, valueKey: 'tangentMath', definedKey: 'tangentDefined', foundation: 'sine ÷ cosine' },
  { key: 'cosecant', short: 'csc', nameMath: String.raw`\csc\theta`, valueKey: 'cosecantMath', definedKey: 'cosecantDefined', foundation: 'reciprocal sine' },
  { key: 'secant', short: 'sec', nameMath: String.raw`\sec\theta`, valueKey: 'secantMath', definedKey: 'secantDefined', foundation: 'reciprocal cosine' },
  { key: 'cotangent', short: 'cot', nameMath: String.raw`\cot\theta`, valueKey: 'cotangentMath', definedKey: 'cotangentDefined', foundation: 'cosine ÷ sine' },
]

/**
 * Unit-circle teaching visual for reconstructing all six trig functions.
 * onMilestone receives "coordinates", "tangent", or "all-six" as ideas are revealed.
 */
export function SixFunctionsExplorer({ initialAngle = 60, onMilestone }) {
  const safeInitialAngle = Math.max(0, Math.min(360, Math.round(initialAngle)))
  const [angle, setAngle] = useState(safeInitialAngle)
  const [stage, setStage] = useState(0)
  const [tangentStep, setTangentStep] = useState(0)
  const [showLabels, setShowLabels] = useState(true)
  const [snapEnabled, setSnapEnabled] = useState(true)
  const svgRef = useRef(null)
  const draggingRef = useRef(false)
  const angleRef = useRef(safeInitialAngle)
  const headingId = useId()
  const instructionsId = useId()
  const statusId = useId()

  const values = valueRecord(angle)
  const point = pointForDegrees(angle)
  const exactRadians = values.special?.radiansMath ?? radiansMath(angle)

  const updateAngle = (nextAngle, allowSnap = false) => {
    let next = Math.max(0, Math.min(360, Math.round(nextAngle)))
    if (allowSnap && snapEnabled) {
      const nearest = nearestSpecial(next)
      if (Math.abs(nearest.degrees - next) <= SNAP_TOLERANCE) next = nearest.degrees
    }
    angleRef.current = next
    setAngle(next)
  }

  const setFromPointer = (event) => {
    if (!svgRef.current) return
    updateAngle(normalizedPointerAngle(event, svgRef.current, angleRef.current), true)
  }

  const handlePointerDown = (event) => {
    draggingRef.current = true
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setFromPointer(event)
  }

  const handlePointerEnd = (event) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyboard = (event) => {
    const steps = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -15, PageUp: 15 }
    if (event.key in steps) {
      event.preventDefault()
      updateAngle(angleRef.current + steps[event.key])
    } else if (event.key === 'Home') {
      event.preventDefault()
      updateAngle(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      updateAngle(360)
    }
  }

  const revealCoordinates = () => {
    setStage(1)
    onMilestone?.('coordinates')
  }

  const beginTangent = () => {
    setStage(2)
    setTangentStep(0)
    onMilestone?.('tangent')
  }

  const revealTangentStep = () => setTangentStep((current) => Math.min(3, current + 1))

  const revealAll = () => {
    setStage(3)
    onMilestone?.('all-six')
  }

  const reset = () => {
    updateAngle(safeInitialAngle)
    setStage(0)
    setTangentStep(0)
    setShowLabels(true)
    setSnapEnabled(true)
  }

  const visibleFunctions = stage === 1
    ? functionMeta.slice(0, 2)
    : stage === 2
      ? functionMeta.slice(0, tangentStep >= 3 ? 3 : 2)
      : stage >= 3
        ? functionMeta
        : []

  return (
    <section className={`six-functions-explorer stage-${stage}`} aria-labelledby={headingId}>
      <header className="six-functions-explorer-header">
        <div>
          <span className="card-label">Interactive reconstruction</span>
          <h3 id={headingId}>Six functions. Two ingredients.</h3>
          <p id={instructionsId}>Drag point P around the circle, or focus it and use the arrow keys. Standard angles snap to exact values.</p>
        </div>
        <div className="six-functions-point-rule"><MathInline>{String.raw`P(\theta)=(\cos\theta,\sin\theta)`}</MathInline></div>
      </header>

      <div className="six-functions-toolbar">
        <div role="group" aria-label="Circle display controls">
          <button type="button" className={showLabels ? 'active' : ''} aria-pressed={showLabels} onClick={() => setShowLabels((current) => !current)}>
            {showLabels ? 'Hide' : 'Show'} angle labels
          </button>
          <button type="button" className={snapEnabled ? 'active' : ''} aria-pressed={snapEnabled} onClick={() => setSnapEnabled((current) => !current)}>
            Snap {snapEnabled ? 'on' : 'off'}
          </button>
        </div>
        <button type="button" onClick={reset}>Start over</button>
      </div>

      <div className="six-functions-circle-layout">
        <div className="six-functions-circle-scroll">
          <svg
            ref={svgRef}
            className="six-functions-circle"
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            role="slider"
            tabIndex="0"
            aria-label="Angle theta on the unit circle"
            aria-describedby={`${instructionsId} ${statusId}`}
            aria-valuemin="0"
            aria-valuemax="360"
            aria-valuenow={angle}
            aria-valuetext={stage === 0
              ? `${angle} degrees`
              : stage === 1 || (stage === 2 && tangentStep < 3)
                ? `${angle} degrees; sine ${formatDecimal(values.sine)}; cosine ${formatDecimal(values.cosine)}`
                : `${angle} degrees; sine ${formatDecimal(values.sine)}; cosine ${formatDecimal(values.cosine)}; tangent ${values.tangentDefined ? formatDecimal(values.sine / values.cosine) : 'undefined'}`}
            onKeyDown={handleKeyboard}
            onPointerDown={handlePointerDown}
            onPointerMove={(event) => { if (draggingRef.current) setFromPointer(event) }}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onLostPointerCapture={() => { draggingRef.current = false }}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} className="six-functions-ring" />
            <line x1="30" y1={CENTER} x2="490" y2={CENTER} className="six-functions-axis" />
            <line x1={CENTER} y1="30" x2={CENTER} y2="490" className="six-functions-axis" />
            <text x="486" y={CENTER - 11} textAnchor="end" className="six-functions-axis-label">x</text>
            <text x={CENTER + 12} y="39" className="six-functions-axis-label">y</text>

            {showLabels && specialAngles.filter((item) => item.degrees !== 360).map((item) => (
              <SpecialAngleLabel key={item.id} angle={item} />
            ))}

            <line x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} className="six-functions-radius" />
            {stage >= 1 && (
              <>
                <line x1={CENTER} y1={CENTER} x2={point.x} y2={CENTER} className="six-functions-cos-guide" />
                <line x1={point.x} y1={CENTER} x2={point.x} y2={point.y} className="six-functions-sin-guide" />
                <g className="six-functions-guide-label cosine-label">
                  <rect x={(CENTER + point.x) / 2 - 49} y={CENTER + 10} width="98" height="28" rx="8" />
                  <text x={(CENTER + point.x) / 2} y={CENTER + 29} textAnchor="middle">x = cos θ</text>
                </g>
                <g className="six-functions-guide-label sine-label">
                  <rect x={point.x + (values.cosine >= 0 ? 10 : -108)} y={(CENTER + point.y) / 2 - 14} width="98" height="28" rx="8" />
                  <text x={point.x + (values.cosine >= 0 ? 59 : -59)} y={(CENTER + point.y) / 2 + 5} textAnchor="middle">y = sin θ</text>
                </g>
              </>
            )}

            <circle cx={CENTER} cy={CENTER} r="5" className="six-functions-origin" />
            <circle cx={point.x} cy={point.y} r="12" className="six-functions-handle" />
            <text x={point.x + (values.cosine >= 0 ? 17 : -17)} y={point.y - 17} textAnchor={values.cosine >= 0 ? 'start' : 'end'} className="six-functions-point-label">P</text>
          </svg>
        </div>

        <aside className="six-functions-circle-controls">
          <label htmlFor={`${headingId}-angle`}>
            <span>Angle</span>
            <strong><MathInline>{String.raw`${angle}^{\circ}=${exactRadians}`}</MathInline></strong>
          </label>
          <input id={`${headingId}-angle`} type="range" min="0" max="360" step="1" value={angle} onChange={(event) => updateAngle(Number(event.target.value))} />

          <div className="six-functions-special-buttons" role="group" aria-label="Select an exact standard angle">
            {specialAngles.map((item) => (
              <button type="button" className={angle === item.degrees ? 'active' : ''} aria-pressed={angle === item.degrees} aria-label={`${item.degrees} degrees`} onClick={() => updateAngle(item.degrees)} key={item.id}>
                <MathInline>{item.radiansMath}</MathInline>
                <small>{item.degrees}°</small>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div id={statusId} className="six-functions-live-region" aria-live="polite" aria-atomic="true">
        {stage === 0 ? (
          <div className="six-functions-hook">
            <span className="card-label">Think first</span>
            <h4>If we already know sine and cosine, do we really need to memorize four more functions?</h4>
            <div role="group" aria-label="Choose a curiosity response">
              <button type="button" onClick={revealCoordinates}>Yes</button>
              <button type="button" onClick={revealCoordinates}>Maybe</button>
              <button type="button" className="primary-action" onClick={revealCoordinates}>Show me</button>
            </div>
          </div>
        ) : (
          <>
            <div className="six-functions-value-grid">
              {visibleFunctions.map((item) => {
                const defined = item.definedKey ? values[item.definedKey] : true
                return (
                  <article className={`six-functions-value-card ${defined ? '' : 'is-undefined'}`} key={item.key}>
                    <span>{item.foundation}</span>
                    <MathDisplay>{String.raw`${item.nameMath}=${values[item.valueKey]}`}</MathDisplay>
                    <small>{defined ? 'Defined at this angle' : 'Undefined — its denominator is zero'}</small>
                  </article>
                )
              })}
            </div>
            {stage === 1 && (
              <button type="button" className="six-functions-next-action" onClick={beginTangent}>Build tangent from these coordinates →</button>
            )}
          </>
        )}
      </div>

      {stage >= 2 && (
        <section className="six-functions-tangent-builder" aria-labelledby={`${headingId}-tangent`}>
          <header>
            <span className="card-label">Build tangent</span>
            <h4 id={`${headingId}-tangent`}>What ratio compares vertical change with horizontal change?</h4>
          </header>
          <ol>
            <li className={tangentStep >= 1 ? 'revealed' : ''}>
              <span>1</span>
              {tangentStep >= 1 ? <MathDisplay>{String.raw`\tan\theta=\frac{y}{x}`}</MathDisplay> : <p>Predict the coordinate ratio.</p>}
            </li>
            <li className={tangentStep >= 2 ? 'revealed' : ''}>
              <span>2</span>
              {tangentStep >= 2 ? <MathDisplay>{String.raw`y=\sin\theta,\qquad x=\cos\theta`}</MathDisplay> : <p>Replace each coordinate.</p>}
            </li>
            <li className={tangentStep >= 3 ? 'revealed' : ''}>
              <span>3</span>
              {tangentStep >= 3 ? <MathDisplay>{String.raw`\boxed{\tan\theta=\frac{\sin\theta}{\cos\theta}}`}</MathDisplay> : <p>Connect the two ideas.</p>}
            </li>
          </ol>
          {tangentStep < 3 ? (
            <button type="button" className="primary-action" onClick={revealTangentStep}>Reveal next connection</button>
          ) : stage < 3 ? (
            <button type="button" className="primary-action" onClick={revealAll}>Now build the reciprocals →</button>
          ) : (
            <p className="six-functions-discovery"><strong>Discovery:</strong> tangent is defined exactly when cosine is not zero.</p>
          )}

          {tangentStep >= 3 && !values.tangentDefined && (
            <aside className="six-functions-zero-warning" role="status">
              <strong>Cosine is zero here.</strong>
              <MathInline>{String.raw`\tan\theta=\frac{\sin\theta}{0}`}</MathInline>
              <span>Tangent is undefined. Denominator zero → function undefined.</span>
            </aside>
          )}
        </section>
      )}
    </section>
  )
}

/** Interactive map plus keyboard-friendly reciprocal matching activity. */
export function TrigRelationshipMap({ onComplete }) {
  const [revealedCount, setRevealedCount] = useState(0)
  const [selectedBase, setSelectedBase] = useState('')
  const [matched, setMatched] = useState([])
  const [feedback, setFeedback] = useState('Select a foundation function, then select its reciprocal.')
  const headingId = useId()

  const chooseReciprocal = (reciprocal) => {
    if (!selectedBase) {
      setFeedback('Choose sine, cosine, or tangent first.')
      return
    }
    const pair = reciprocalPairs.find((item) => item.reciprocal === reciprocal)
    if (pair.base === selectedBase) {
      const nextMatched = matched.includes(selectedBase) ? matched : [...matched, selectedBase]
      setMatched(nextMatched)
      setFeedback(`${pair.base.toUpperCase()} and ${pair.reciprocal.toUpperCase()} are reciprocal partners.`)
      setSelectedBase('')
      if (nextMatched.length === reciprocalPairs.length) onComplete?.()
    } else {
      setFeedback(`Not this pair yet. ${selectedBase.toUpperCase()} has a different reciprocal partner.`)
    }
  }

  const resetMatch = () => {
    setSelectedBase('')
    setMatched([])
    setFeedback('Select a foundation function, then select its reciprocal.')
  }

  return (
    <section className="trig-relationship-map" aria-labelledby={headingId}>
      <header>
        <span className="card-label">One connected system</span>
        <h3 id={headingId}>Build the reciprocal functions</h3>
        <p>Start with sine, cosine, and tangent. Turn each ratio upside down to reveal its reciprocal partner.</p>
      </header>

      <div className="trig-relationship-foundations" aria-label="Foundation trig relationships">
        <article><span>Vertical coordinate</span><MathDisplay>{String.raw`\sin\theta`}</MathDisplay></article>
        <article><span>Horizontal coordinate</span><MathDisplay>{String.raw`\cos\theta`}</MathDisplay></article>
        <article className="derived"><span>Build from both</span><MathDisplay>{String.raw`\tan\theta=\frac{\sin\theta}{\cos\theta}`}</MathDisplay></article>
      </div>

      <div className="trig-reciprocal-reveal" aria-live="polite">
        {reciprocalPairs.map((pair, index) => (
          <article className={index < revealedCount ? 'revealed' : ''} key={pair.base}>
            <div><MathInline>{pair.baseMath}</MathInline></div>
            <span aria-hidden="true">↕</span>
            <small>reciprocal</small>
            <div>{index < revealedCount ? <MathInline>{pair.reciprocalMath}</MathInline> : <strong>?</strong>}</div>
            {index < revealedCount && <MathDisplay>{pair.formula}</MathDisplay>}
          </article>
        ))}
      </div>

      {revealedCount < reciprocalPairs.length ? (
        <button type="button" className="primary-action trig-map-reveal" onClick={() => setRevealedCount((current) => Math.min(3, current + 1))}>
          Reveal {revealedCount === 0 ? 'first' : 'next'} reciprocal pair
        </button>
      ) : (
        <p className="trig-map-memory"><strong>Memory connection:</strong> cosecant pairs with sine; secant pairs with cosine.</p>
      )}

      <fieldset className="trig-reciprocal-match">
        <legend>Match the reciprocal pairs</legend>
        <p>Choose one function from each row. This button-based interaction works with touch, mouse, or keyboard.</p>
        <div className="trig-match-row" role="group" aria-label="Choose a foundation function">
          {reciprocalPairs.map((pair) => (
            <button
              type="button"
              className={`${selectedBase === pair.base ? 'selected' : ''} ${matched.includes(pair.base) ? 'matched' : ''}`}
              aria-pressed={selectedBase === pair.base || matched.includes(pair.base)}
              disabled={matched.includes(pair.base)}
              onClick={() => { setSelectedBase(pair.base); setFeedback(`Now choose the reciprocal of ${pair.base.toUpperCase()}.`) }}
              key={pair.base}
            >
              <MathInline>{pair.baseMath}</MathInline>
              {matched.includes(pair.base) && <small>Matched ✓</small>}
            </button>
          ))}
        </div>
        <div className="trig-match-connector" aria-hidden="true">choose its reciprocal ↓</div>
        <div className="trig-match-row" role="group" aria-label="Choose a reciprocal function">
          {[reciprocalPairs[1], reciprocalPairs[2], reciprocalPairs[0]].map((pair) => (
            <button
              type="button"
              className={matched.includes(pair.base) ? 'matched' : ''}
              aria-pressed={matched.includes(pair.base)}
              disabled={matched.includes(pair.base)}
              onClick={() => chooseReciprocal(pair.reciprocal)}
              key={pair.reciprocal}
            >
              <MathInline>{pair.reciprocalMath}</MathInline>
              {matched.includes(pair.base) && <small>Matched ✓</small>}
            </button>
          ))}
        </div>
        <p className="trig-match-feedback" role="status">{feedback}</p>
        <button type="button" className="secondary-action" onClick={resetMatch}>Reset matching</button>
      </fieldset>
    </section>
  )
}

/** A scalable right triangle showing that size changes do not change trig ratios. */
export function RightTriangleExplorer() {
  const [angle, setAngle] = useState(38)
  const [size, setSize] = useState(5)
  const svgRef = useRef(null)
  const draggingRef = useRef(false)
  const headingId = useId()
  const radians = (angle * Math.PI) / 180
  const adjacent = size * Math.cos(radians)
  const opposite = size * Math.sin(radians)
  const origin = { x: 64, y: 286 }
  const pixelsPerUnit = 38
  const tip = { x: origin.x + adjacent * pixelsPerUnit, y: origin.y - opposite * pixelsPerUnit }

  const setFromPointer = (event) => {
    if (!svgRef.current) return
    const bounds = svgRef.current.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 560
    const y = ((event.clientY - bounds.top) / bounds.height) * 340
    const dx = Math.max(1, x - origin.x)
    const dy = Math.max(1, origin.y - y)
    const nextAngle = Math.max(15, Math.min(75, Math.round((Math.atan2(dy, dx) * 180) / Math.PI)))
    const nextSize = Math.max(2.5, Math.min(7, Math.sqrt(dx ** 2 + dy ** 2) / pixelsPerUnit))
    setAngle(nextAngle)
    setSize(Number(nextSize.toFixed(1)))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault()
      setAngle((current) => Math.min(75, current + 1))
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault()
      setAngle((current) => Math.max(15, current - 1))
    } else if (event.key === 'PageUp') {
      event.preventDefault()
      setSize((current) => Math.min(7, Number((current + 0.2).toFixed(1))))
    } else if (event.key === 'PageDown') {
      event.preventDefault()
      setSize((current) => Math.max(2.5, Number((current - 0.2).toFixed(1))))
    }
  }

  const ratios = [
    { name: String.raw`\sin\theta`, ratio: String.raw`\frac{\text{opposite}}{\text{hypotenuse}}`, value: Math.sin(radians) },
    { name: String.raw`\cos\theta`, ratio: String.raw`\frac{\text{adjacent}}{\text{hypotenuse}}`, value: Math.cos(radians) },
    { name: String.raw`\tan\theta`, ratio: String.raw`\frac{\text{opposite}}{\text{adjacent}}`, value: Math.tan(radians) },
    { name: String.raw`\csc\theta`, ratio: String.raw`\frac{\text{hypotenuse}}{\text{opposite}}`, value: 1 / Math.sin(radians) },
    { name: String.raw`\sec\theta`, ratio: String.raw`\frac{\text{hypotenuse}}{\text{adjacent}}`, value: 1 / Math.cos(radians) },
    { name: String.raw`\cot\theta`, ratio: String.raw`\frac{\text{adjacent}}{\text{opposite}}`, value: 1 / Math.tan(radians) },
  ]

  return (
    <section className="right-triangle-explorer" aria-labelledby={headingId}>
      <header>
        <span className="card-label">Right-triangle connection</span>
        <h3 id={headingId}>Change the size. Keep the ratios.</h3>
        <p>Drag the blue point. A right angle is preserved automatically; the six ratios depend on θ, not on the triangle's overall size.</p>
      </header>
      <div className="right-triangle-layout">
        <div className="right-triangle-canvas-scroll">
          <svg ref={svgRef} viewBox="0 0 560 340" className="right-triangle-canvas" aria-label={`Right triangle with angle ${angle} degrees and hypotenuse ${size.toFixed(1)}`}>
            <path d={`M ${origin.x} ${origin.y} L ${tip.x} ${origin.y} L ${tip.x} ${tip.y} Z`} className="right-triangle-shape" />
            <path d={`M ${tip.x - 19} ${origin.y} L ${tip.x - 19} ${origin.y - 19} L ${tip.x} ${origin.y - 19}`} className="right-angle-marker" />
            <path d={`M ${origin.x + 36} ${origin.y} A 36 36 0 0 0 ${origin.x + 36 * Math.cos(radians)} ${origin.y - 36 * Math.sin(radians)}`} className="triangle-angle-arc" />
            <text x={origin.x + 43} y={origin.y - 12} className="triangle-theta">θ</text>
            <text x={(origin.x + tip.x) / 2} y={origin.y + 28} textAnchor="middle">adjacent = {adjacent.toFixed(2)}</text>
            <text x={tip.x + 12} y={(origin.y + tip.y) / 2} className="triangle-side-label">opposite = {opposite.toFixed(2)}</text>
            <text x={(origin.x + tip.x) / 2 - 8} y={(origin.y + tip.y) / 2 - 13} textAnchor="middle" className="triangle-hypotenuse-label">hypotenuse = {size.toFixed(1)}</text>
            <circle
              cx={tip.x}
              cy={tip.y}
              r="12"
              className="right-triangle-handle"
              role="slider"
              tabIndex="0"
              aria-label="Triangle size and angle handle"
              aria-valuemin="15"
              aria-valuemax="75"
              aria-valuenow={angle}
              aria-valuetext={`${angle} degrees; hypotenuse ${size.toFixed(1)}`}
              onKeyDown={handleKeyDown}
              onPointerDown={(event) => { draggingRef.current = true; event.currentTarget.setPointerCapture?.(event.pointerId); setFromPointer(event) }}
              onPointerMove={(event) => { if (draggingRef.current) setFromPointer(event) }}
              onPointerUp={(event) => { draggingRef.current = false; event.currentTarget.releasePointerCapture?.(event.pointerId) }}
              onPointerCancel={() => { draggingRef.current = false }}
            />
          </svg>
        </div>
        <div className="right-triangle-controls">
          <label htmlFor={`${headingId}-triangle-angle`}><span>Angle</span><strong>{angle}°</strong></label>
          <input id={`${headingId}-triangle-angle`} type="range" min="15" max="75" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
          <label htmlFor={`${headingId}-triangle-size`}><span>Hypotenuse size</span><strong>{size.toFixed(1)}</strong></label>
          <input id={`${headingId}-triangle-size`} type="range" min="2.5" max="7" step="0.1" value={size} onChange={(event) => setSize(Number(event.target.value))} />
          <p><strong>Try this:</strong> move only the size slider. The side lengths change, but every ratio below stays the same.</p>
        </div>
      </div>
      <div className="right-triangle-ratios" aria-live="polite">
        {ratios.map((ratio) => (
          <article key={ratio.name}>
            <MathInline>{ratio.name}</MathInline>
            <MathInline>{ratio.ratio}</MathInline>
            <strong>= {formatDecimal(ratio.value)}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

const axisAngles = specialAngles.filter((item) => [0, 90, 180, 270].includes(item.degrees))

/** Axis-angle challenge for reasoning about zero denominators. */
export function FunctionSurvivalChallenge({ onComplete }) {
  const [angle, setAngle] = useState(90)
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const headingId = useId()
  const values = valueRecord(angle)
  const miniCenter = 150
  const miniRadians = (angle * Math.PI) / 180
  const miniPoint = {
    x: miniCenter + 116 * Math.cos(miniRadians),
    y: miniCenter - 116 * Math.sin(miniRadians),
  }
  const defined = functionMeta.filter((item) => !item.definedKey || values[item.definedKey]).map((item) => item.key)
  const isCorrect = selected.length === defined.length && defined.every((key) => selected.includes(key))

  const chooseAngle = (degrees) => {
    setAngle(degrees)
    setSelected([])
    setChecked(false)
  }

  const toggleFunction = (key) => {
    setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
    setChecked(false)
  }

  const check = () => {
    setChecked(true)
    if (isCorrect) onComplete?.()
  }

  return (
    <section className="function-survival-challenge" aria-labelledby={headingId}>
      <header>
        <span className="card-label">Mini interactive challenge</span>
        <h3 id={headingId}>Which functions survive?</h3>
        <p>Select an axis angle, then choose every function that is defined there. Reason from the denominators.</p>
      </header>
      <div className="survival-angle-buttons" role="group" aria-label="Choose an axis angle">
        {axisAngles.map((item) => (
          <button type="button" className={angle === item.degrees ? 'active' : ''} aria-pressed={angle === item.degrees} onClick={() => chooseAngle(item.degrees)} key={item.id}>
            <MathInline>{item.radiansMath}</MathInline><small>{item.degrees}°</small>
          </button>
        ))}
      </div>
      <div className="survival-layout">
        <div className="survival-visual">
          <svg viewBox="0 0 300 300" role="img" aria-label={`Unit circle point at ${angle} degrees`}>
            <circle cx="150" cy="150" r="116" className="survival-ring" />
            <line x1="22" y1="150" x2="278" y2="150" className="survival-axis" />
            <line x1="150" y1="22" x2="150" y2="278" className="survival-axis" />
            <line x1="150" y1="150" x2={miniPoint.x} y2={miniPoint.y} className="survival-radius" />
            <circle cx={miniPoint.x} cy={miniPoint.y} r="11" className="survival-point" />
            <text x="268" y="140">x</text><text x="160" y="34">y</text>
          </svg>
          <div className="survival-coordinate-readout">
            <MathDisplay>{String.raw`P=(${values.cosineMath},${values.sineMath})`}</MathDisplay>
            <p><strong>x = cosine:</strong> {Math.abs(values.cosine) < EPSILON ? 'zero' : 'nonzero'}</p>
            <p><strong>y = sine:</strong> {Math.abs(values.sine) < EPSILON ? 'zero' : 'nonzero'}</p>
          </div>
        </div>
        <fieldset className="survival-options">
          <legend>Defined functions at <MathInline>{values.special?.radiansMath ?? radiansMath(angle)}</MathInline></legend>
          {functionMeta.map((item) => (
            <label className={selected.includes(item.key) ? 'selected' : ''} key={item.key}>
              <input type="checkbox" checked={selected.includes(item.key)} onChange={() => toggleFunction(item.key)} />
              <MathInline>{item.nameMath}</MathInline>
              <span>{selected.includes(item.key) ? 'Selected' : 'Not selected'}</span>
            </label>
          ))}
          <button type="button" className="primary-action" onClick={check}>Check survivors</button>
        </fieldset>
      </div>

      {checked && (
        <div className={`survival-feedback ${isCorrect ? 'correct' : 'needs-work'}`} role="status">
          <h4>{isCorrect ? 'Correct — every denominator is safe.' : 'Check the zero denominators again.'}</h4>
          {!isCorrect && <p>Sine and cosine themselves are always defined. Their zeros only affect functions that divide by them.</p>}
          <div className="survival-results">
            {functionMeta.map((item) => {
              const itemDefined = !item.definedKey || values[item.definedKey]
              return (
                <div key={item.key}>
                  <strong>{itemDefined ? '✓ Defined' : '✕ Undefined'}</strong>
                  <MathInline>{item.nameMath}</MathInline>
                  <small>{itemDefined ? (item.foundation) : `${item.foundation}; denominator is zero`}</small>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <aside className="survival-rule">
        <strong>Quick pattern</strong>
        <MathInline>{String.raw`\text{denominator }0\;\Longrightarrow\;\text{function undefined}`}</MathInline>
      </aside>
    </section>
  )
}

export default SixFunctionsExplorer
