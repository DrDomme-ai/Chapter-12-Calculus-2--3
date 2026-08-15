import { useId, useRef, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import { unitCircleSpecialAngles } from '../../../data/unitCircleLesson'
import '../../../styles/interactive-unit-circle.css'

const VIEW_SIZE = 480
const CENTER = VIEW_SIZE / 2
const CIRCLE_RADIUS = 172
const SNAP_TOLERANCE = 3
const EPSILON = 1e-10

const specialAngles = unitCircleSpecialAngles.map((angle) => ({
  degrees: angle.degrees,
  radians: angle.radianMath,
  cosine: angle.cosMath,
  sine: angle.sinMath,
  tangent: angle.tanMath,
}))

// Legacy SVG text labels are retained only for saved-layout compatibility;
// visible labels below use KaTeX and the structured radianMath values.
// eslint-disable-next-line no-unused-vars
const svgAngleLabels = {
  0: '0', 30: 'π/6', 45: 'π/4', 60: 'π/3', 90: 'π/2', 120: '2π/3',
  135: '3π/4', 150: '5π/6', 180: 'π', 210: '7π/6', 225: '5π/4',
  240: '4π/3', 270: '3π/2', 300: '5π/3', 315: '7π/4', 330: '11π/6',
}

const labelAngles = specialAngles.filter((angle) => ![360].includes(angle.degrees))

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
  return numerator === 1 ? String.raw`\frac{\pi}{${denominator}}` : String.raw`\frac{${numerator}\pi}{${denominator}}`
}

function pointForDegrees(degrees, radius = CIRCLE_RADIUS) {
  const radians = (degrees * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER - radius * Math.sin(radians),
  }
}

function nearestSpecial(degrees) {
  return specialAngles.reduce((nearest, candidate) => (
    Math.abs(candidate.degrees - degrees) < Math.abs(nearest.degrees - degrees) ? candidate : nearest
  ), specialAngles[0])
}

function normalizeAngle(degrees, previousAngle) {
  let next = degrees
  if (next < 0) next += 360
  const rounded = Math.round(next)
  return rounded === 0 && previousAngle > 270 ? 360 : Math.min(359, rounded)
}

function pointerAngle(event, svg, previousAngle) {
  const bounds = svg.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * VIEW_SIZE
  const y = ((event.clientY - bounds.top) / bounds.height) * VIEW_SIZE
  const degrees = (Math.atan2(CENTER - y, x - CENTER) * 180) / Math.PI
  return normalizeAngle(degrees, previousAngle)
}

function angleLocation(degrees) {
  if (degrees === 0 || degrees === 360) return 'positive x-axis'
  if (degrees === 90) return 'positive y-axis'
  if (degrees === 180) return 'negative x-axis'
  if (degrees === 270) return 'negative y-axis'
  if (degrees > 0 && degrees < 90) return 'Quadrant I'
  if (degrees > 90 && degrees < 180) return 'Quadrant II'
  if (degrees > 180 && degrees < 270) return 'Quadrant III'
  return 'Quadrant IV'
}

function signOf(value) {
  if (Math.abs(value) < EPSILON) return 'zero'
  return value > 0 ? 'positive' : 'negative'
}

function formatApproximation(value) {
  if (Math.abs(value) < EPSILON) return '0'
  return value.toFixed(3)
}

function SpecialAngleLabel({ angle }) {
  const position = pointForDegrees(angle.degrees, 207)
  const verticalAdjustment = angle.degrees === 90 ? -8 : angle.degrees === 270 ? -4 : -10

  return (
    <foreignObject x={position.x-40} y={position.y+verticalAdjustment} width="80" height="28" className="unit-special-label">
      <div xmlns="http://www.w3.org/1999/xhtml"><MathInline>{angle.radians}</MathInline></div>
    </foreignObject>
  )
}

export function InteractiveUnitCircle() {
  const [angle, setAngle] = useState(45)
  const [showLabels, setShowLabels] = useState(true)
  const [practiceMode, setPracticeMode] = useState(false)
  const [snapEnabled, setSnapEnabled] = useState(true)
  const svgRef = useRef(null)
  const draggingRef = useRef(false)
  const angleRef = useRef(45)
  const headingId = useId()
  const directionsId = useId()
  const readoutId = useId()

  const updateAngle = (degrees, allowSnap = false) => {
    let next = Math.max(0, Math.min(360, Math.round(degrees)))
    if (snapEnabled && allowSnap) {
      const nearest = nearestSpecial(next)
      if (Math.abs(nearest.degrees - next) <= SNAP_TOLERANCE) next = nearest.degrees
    }
    angleRef.current = next
    setAngle(next)
  }

  const radians = (angle * Math.PI) / 180
  const cosine = Math.cos(radians)
  const sine = Math.sin(radians)
  const tangentDefined = Math.abs(cosine) >= EPSILON
  const tangent = tangentDefined ? sine / cosine : null
  const special = specialAngles.find((item) => item.degrees === angle)
  const point = pointForDegrees(angle)
  const exactRadians = special?.radians ?? radiansMath(angle)
  const cosineDisplay = special?.cosine ?? formatApproximation(cosine)
  const sineDisplay = special?.sine ?? formatApproximation(sine)
  const tangentDisplay = special?.tangent ?? (tangentDefined ? formatApproximation(tangent) : String.raw`\text{undefined}`)
  const location = angleLocation(angle)
  const sineSign = signOf(sine)
  const cosineSign = signOf(cosine)
  const tangentSign = tangentDefined ? signOf(tangent) : 'undefined'

  const setFromPointer = (event) => {
    if (!svgRef.current) return
    updateAngle(pointerAngle(event, svgRef.current, angleRef.current), true)
  }

  const handlePointerDown = (event) => {
    draggingRef.current = true
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setFromPointer(event)
  }

  const endPointer = (event) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleKeyboard = (event) => {
    const deltas = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -15, PageUp: 15 }
    if (event.key in deltas) {
      event.preventDefault()
      updateAngle(angleRef.current + deltas[event.key])
    }
    if (event.key === 'Home') {
      event.preventDefault()
      updateAngle(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      updateAngle(360)
    }
  }

  const reset = () => {
    updateAngle(45)
    setShowLabels(true)
    setPracticeMode(false)
    setSnapEnabled(true)
  }

  return (
    <section className={`interactive-unit-circle${practiceMode ? ' is-practice' : ''}`} aria-labelledby={headingId}>
      <header className="interactive-unit-heading">
        <div>
          <span className="card-label">Interactive unit circle</span>
          <h3 id={headingId}>Coordinates become sine and cosine</h3>
          <p id={directionsId}>Move point P. Its horizontal coordinate is cosine, its vertical coordinate is sine, and the circle always satisfies <MathInline>{String.raw`x^2+y^2=1`}</MathInline>.</p>
        </div>
        <div className="unit-circle-equation"><MathInline>{String.raw`x^2+y^2=1`}</MathInline></div>
      </header>

      <div className="unit-circle-toolbar">
        <div role="group" aria-label="Unit circle display controls">
          <button type="button" aria-pressed={showLabels} className={showLabels ? 'active' : ''} onClick={() => setShowLabels(true)}>Show labels</button>
          <button type="button" aria-pressed={!showLabels} className={!showLabels ? 'active' : ''} onClick={() => setShowLabels(false)}>Hide labels</button>
          <button type="button" aria-pressed={practiceMode} className={practiceMode ? 'active practice-button' : 'practice-button'} onClick={() => setPracticeMode((current) => !current)}>Practice mode</button>
        </div>
        <div>
          <button type="button" aria-pressed={snapEnabled} className={snapEnabled ? 'active' : ''} onClick={() => setSnapEnabled((current) => !current)}>Snap {snapEnabled ? 'on' : 'off'}</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      {practiceMode && (
        <div className="unit-practice-message" role="status">
          <strong>Practice mode:</strong> exact values are hidden. Predict the coordinates and signs, then leave practice mode to check your reasoning.
        </div>
      )}

      <div className="unit-circle-workspace">
        <div className="unit-circle-stage">
          <svg
            ref={svgRef}
            className="interactive-unit-svg"
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            role="slider"
            tabIndex="0"
            aria-describedby={`${directionsId} ${readoutId}`}
            aria-label="Point P on the unit circle"
            aria-valuemin="0"
            aria-valuemax="360"
            aria-valuenow={angle}
            aria-valuetext={practiceMode
              ? `${angle} degrees, ${location}; exact coordinate values and signs hidden for practice`
              : `${angle} degrees, ${location}; cosine ${formatApproximation(cosine)}, sine ${formatApproximation(sine)}, tangent ${tangentDefined ? formatApproximation(tangent) : 'undefined'}`}
            onKeyDown={handleKeyboard}
            onPointerDown={handlePointerDown}
            onPointerMove={(event) => {
              if (draggingRef.current) setFromPointer(event)
            }}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onLostPointerCapture={() => { draggingRef.current = false }}
          >
            <circle cx={CENTER} cy={CENTER} r={CIRCLE_RADIUS} className="interactive-unit-ring" />
            <line x1="34" y1={CENTER} x2="446" y2={CENTER} className="interactive-unit-axis" />
            <line x1={CENTER} y1="34" x2={CENTER} y2="446" className="interactive-unit-axis" />
            <text x="442" y={CENTER - 10} textAnchor="end" className="unit-axis-name">x</text>
            <text x={CENTER + 11} y="42" className="unit-axis-name">y</text>

            {showLabels && labelAngles.map((item) => <SpecialAngleLabel angle={item} key={item.degrees} />)}

            <line x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} className="unit-radius-line" />
            <line x1={point.x} y1={point.y} x2={point.x} y2={CENTER} className="unit-cosine-guide" />
            <line x1={point.x} y1={point.y} x2={CENTER} y2={point.y} className="unit-sine-guide" />

            <g className="unit-guide-label unit-guide-label-cosine">
              <rect x={(CENTER + point.x) / 2 - 55} y={CENTER + (sine >= 0 ? 10 : -34)} width="110" height="25" rx="8" />
              <text x={(CENTER + point.x) / 2} y={CENTER + (sine >= 0 ? 27 : -17)} textAnchor="middle">cosine · x-coordinate</text>
            </g>
            <g className="unit-guide-label unit-guide-label-sine">
              <rect x={CENTER + (cosine >= 0 ? 10 : -126)} y={(CENTER + point.y) / 2 - 12} width="116" height="25" rx="8" />
              <text x={CENTER + (cosine >= 0 ? 68 : -68)} y={(CENTER + point.y) / 2 + 5} textAnchor="middle">sine · y-coordinate</text>
            </g>

            <circle cx={point.x} cy={point.y} r="11" className="unit-point-handle" />
            <text x={point.x + (cosine >= 0 ? 15 : -15)} y={point.y - 15} textAnchor={cosine >= 0 ? 'start' : 'end'} className="unit-point-label">P</text>
            <circle cx={CENTER} cy={CENTER} r="5" className="unit-circle-origin" />
          </svg>
          <p>Drag point P. Keyboard: arrow keys move by 1°, Page Up/Down by 15°, and Home/End select 0°/360°.</p>
        </div>

        <aside className="unit-circle-controls">
          <label htmlFor={`${headingId}-angle`}>
            <span>Angle</span>
            <strong>{angle}°</strong>
          </label>
          <input
            id={`${headingId}-angle`}
            type="range"
            min="0"
            max="360"
            step="1"
            value={angle}
            onChange={(event) => updateAngle(Number(event.target.value))}
          />

          <div className="unit-special-buttons" role="group" aria-label="Choose a special angle">
            {specialAngles.map((item) => (
              <button
                type="button"
                className={angle === item.degrees ? 'active' : ''}
                aria-label={`${item.degrees} degrees`}
                aria-pressed={angle === item.degrees}
                onClick={() => updateAngle(item.degrees)}
                key={item.degrees}
              >
                <MathInline>{item.radians}</MathInline>
                <small>{item.degrees}°</small>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div id={readoutId} className={`unit-circle-readouts${practiceMode ? ' is-hidden' : ''}`} aria-live="polite" aria-atomic="true">
        {practiceMode ? (
          <p>Exact coordinate and value readouts are hidden for practice.</p>
        ) : (
          <>
            <div className="unit-angle-readout">
              <span>Angle</span>
              <strong><MathInline>{String.raw`${angle}^\circ=${exactRadians}`}</MathInline></strong>
              <small>{location}</small>
            </div>
            <div className="unit-point-readout">
              <span>Point P</span>
              <strong><MathInline>{String.raw`P=(\cos\theta,\sin\theta)=(${cosineDisplay},${sineDisplay})`}</MathInline></strong>
              <small>The first coordinate is horizontal; the second is vertical.</small>
            </div>
            <div>
              <span>Tangent</span>
              <strong><MathInline>{String.raw`\tan\theta=${tangentDisplay}`}</MathInline></strong>
              <small>{tangentDefined ? 'sine divided by cosine' : 'Undefined because cosine is zero.'}</small>
            </div>
          </>
        )}
      </div>

      <section className="unit-sign-panel" aria-labelledby={`${headingId}-signs`} aria-live="polite" aria-atomic="true">
        <div>
          <span className="card-label">Location and signs</span>
          <h4 id={`${headingId}-signs`}>{location}</h4>
        </div>
        <dl>
          <div><dt>Sine</dt><dd>{practiceMode ? 'Predict' : sineSign}</dd></div>
          <div><dt>Cosine</dt><dd>{practiceMode ? 'Predict' : cosineSign}</dd></div>
          <div><dt>Tangent</dt><dd>{practiceMode ? 'Predict' : tangentSign}</dd></div>
        </dl>
      </section>

      <aside className="unit-circle-identity">
        <span className="card-label">The identity is visible</span>
        <MathDisplay>{String.raw`(\cos\theta)^2+(\sin\theta)^2=1`}</MathDisplay>
        <p>Every possible point P remains exactly one unit from the origin.</p>
      </aside>
    </section>
  )
}

export default InteractiveUnitCircle
