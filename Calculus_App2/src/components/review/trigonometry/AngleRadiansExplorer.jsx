import { useEffect, useId, useRef, useState } from 'react'
import { MathInline } from '../../MathDisplay'
import '../../../styles/angle-radians-explorer.css'

const VIEW_SIZE = 420
const CENTER = VIEW_SIZE / 2
const INITIAL_ANGLE = 135
const INITIAL_RADIUS = 2

const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 225, 270, 315, 360]

const speeds = {
  slow: { label: 'Slower', step: 1, delay: 130 },
  normal: { label: 'Normal', step: 2, delay: 80 },
  fast: { label: 'Faster', step: 5, delay: 55 },
}

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

function reducedFractionMath(numerator, denominator) {
  if (numerator === 0) return '0'
  const divisor = greatestCommonDivisor(numerator, denominator)
  const reducedNumerator = numerator / divisor
  const reducedDenominator = denominator / divisor

  return reducedDenominator === 1
    ? String(reducedNumerator)
    : String.raw`\frac{${reducedNumerator}}{${reducedDenominator}}`
}

function piMultipleMath(numerator, denominator) {
  if (numerator === 0) return '0'
  const divisor = greatestCommonDivisor(numerator, denominator)
  const reducedNumerator = numerator / divisor
  const reducedDenominator = denominator / divisor

  if (reducedDenominator === 1) {
    return reducedNumerator === 1 ? String.raw`\pi` : String.raw`${reducedNumerator}\pi`
  }

  return reducedNumerator === 1
    ? String.raw`\frac{\pi}{${reducedDenominator}}`
    : String.raw`\frac{${reducedNumerator}\pi}{${reducedDenominator}}`
}

function pointOnCircle(radius, angleDegrees) {
  const angleRadians = (angleDegrees * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(angleRadians),
    y: CENTER - radius * Math.sin(angleRadians),
  }
}

function arcPath(radius, angleDegrees) {
  if (angleDegrees <= 0) return ''

  if (angleDegrees >= 360) {
    return [
      `M ${CENTER + radius} ${CENTER}`,
      `A ${radius} ${radius} 0 1 0 ${CENTER - radius} ${CENTER}`,
      `A ${radius} ${radius} 0 1 0 ${CENTER + radius} ${CENTER}`,
    ].join(' ')
  }

  const end = pointOnCircle(radius, angleDegrees)
  const largeArc = angleDegrees > 180 ? 1 : 0
  return `M ${CENTER + radius} ${CENTER} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function sectorPath(angleDegrees) {
  if (angleDegrees <= 0 || angleDegrees >= 360) return ''
  const wedgeRadius = 48
  const end = pointOnCircle(wedgeRadius, angleDegrees)
  const largeArc = angleDegrees > 180 ? 1 : 0
  return `M ${CENTER} ${CENTER} L ${CENTER + wedgeRadius} ${CENTER} A ${wedgeRadius} ${wedgeRadius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

function angleFromPointer(event, svg, previousAngle) {
  const bounds = svg.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * VIEW_SIZE
  const y = ((event.clientY - bounds.top) / bounds.height) * VIEW_SIZE
  let degrees = (Math.atan2(CENTER - y, x - CENTER) * 180) / Math.PI
  if (degrees < 0) degrees += 360

  const rounded = Math.round(degrees)
  if (rounded === 0 && previousAngle > 270) return 360
  return Math.min(359, rounded)
}

export function AngleRadiansExplorer({ presentationLayout = 'full' }) {
  const [angle, setAngle] = useState(INITIAL_ANGLE)
  const [radius, setRadius] = useState(INITIAL_RADIUS)
  const [displayMode, setDisplayMode] = useState('both')
  const [playing, setPlaying] = useState(false)
  const [speedId, setSpeedId] = useState('normal')
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  const svgRef = useRef(null)
  const draggingRef = useRef(false)
  const angleRef = useRef(INITIAL_ANGLE)
  const headingId = useId()
  const descriptionId = useId()
  const readoutId = useId()
  const isSlideSplit = presentationLayout === 'slide-split'

  const updateAngle = (nextAngle) => {
    const clamped = Math.max(0, Math.min(360, Math.round(nextAngle)))
    angleRef.current = clamped
    setAngle(clamped)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mediaQuery) return undefined

    const handleChange = (event) => {
      setReduceMotion(event.matches)
      if (event.matches) setPlaying(false)
    }

    mediaQuery.addEventListener?.('change', handleChange)
    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [])

  useEffect(() => {
    if (!playing || reduceMotion) return undefined
    const speed = speeds[speedId]
    const intervalId = window.setInterval(() => {
      const nextAngle = Math.min(360, angleRef.current + speed.step)
      angleRef.current = nextAngle
      setAngle(nextAngle)
      if (nextAngle === 360) setPlaying(false)
    }, speed.delay)

    return () => window.clearInterval(intervalId)
  }, [playing, reduceMotion, speedId])

  const visualRadius = 96 + ((radius - 1) / 7) * 48
  const point = pointOnCircle(visualRadius, angle)
  const midpoint = pointOnCircle(visualRadius + 22, Math.max(12, angle / 2))
  const radiansMath = piMultipleMath(angle, 180)
  const revolutionsMath = reducedFractionMath(angle, 360)
  const radiusHalfUnits = Math.round(radius * 2)
  const arcLengthMath = piMultipleMath(radiusHalfUnits * angle, 360)
  const radiansDecimal = (angle * Math.PI) / 180
  const arcLengthDecimal = radius * radiansDecimal

  const setFromPointer = (event) => {
    if (!svgRef.current) return
    updateAngle(angleFromPointer(event, svgRef.current, angleRef.current))
  }

  const handlePointerDown = (event) => {
    setPlaying(false)
    draggingRef.current = true
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setFromPointer(event)
  }

  const finishPointer = (event) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyboard = (event) => {
    const keyChanges = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -15,
      PageUp: 15,
    }

    if (event.key in keyChanges) {
      event.preventDefault()
      setPlaying(false)
      updateAngle(angleRef.current + keyChanges[event.key])
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setPlaying(false)
      updateAngle(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setPlaying(false)
      updateAngle(360)
    }
  }

  const togglePlayback = () => {
    if (reduceMotion) return
    if (!playing && angleRef.current >= 360) updateAngle(0)
    setPlaying((current) => !current)
  }

  const reset = () => {
    setPlaying(false)
    updateAngle(INITIAL_ANGLE)
    setRadius(INITIAL_RADIUS)
    setDisplayMode('both')
    setSpeedId('normal')
  }

  return (
    <section className={`angle-radians-explorer${isSlideSplit ? ' is-slide-split' : ''}`} aria-labelledby={headingId}>
      <header className="angle-radians-heading">
        <div>
          <span className="card-label">Visualize it</span>
          <h3 id={headingId}>Measure one rotation three ways</h3>
          <p id={descriptionId}>Drag the radius, use the angle slider, or choose a special angle. Degrees, radians, and revolutions describe the same rotation.</p>
        </div>
        <div className="angle-radians-equivalence" aria-label="One complete revolution equals 360 degrees equals 2 pi radians">
          <MathInline>{String.raw`1\text{ revolution}=360^\circ=2\pi\text{ radians}`}</MathInline>
        </div>
      </header>

      <div className="angle-radians-display-controls" role="group" aria-label="Choose angle labels to display">
        {[
          ['degrees', 'Show degrees'],
          ['radians', 'Show radians'],
          ['both', 'Show both'],
        ].map(([id, label]) => (
          <button type="button" className={displayMode === id ? 'active' : ''} aria-pressed={displayMode === id} onClick={() => setDisplayMode(id)} key={id}>{label}</button>
        ))}
        <button type="button" className="angle-reset-button" onClick={reset}>Reset</button>
      </div>

      <div className="angle-radians-workspace">
        <div className="angle-circle-panel">
          <svg
            ref={svgRef}
            className="angle-circle-svg"
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            role="slider"
            tabIndex="0"
            aria-describedby={`${descriptionId} ${readoutId}`}
            aria-label="Angle on a circle"
            aria-valuemin="0"
            aria-valuemax="360"
            aria-valuenow={angle}
            aria-valuetext={`${angle} degrees, approximately ${radiansDecimal.toFixed(3)} radians, ${(angle / 360).toFixed(3)} revolutions`}
            onKeyDown={handleKeyboard}
            onPointerDown={handlePointerDown}
            onPointerMove={(event) => {
              if (draggingRef.current) setFromPointer(event)
            }}
            onPointerUp={finishPointer}
            onPointerCancel={finishPointer}
            onLostPointerCapture={() => { draggingRef.current = false }}
          >
            <circle cx={CENTER} cy={CENTER} r={visualRadius} className="angle-circle-ring" />
            <line x1="35" y1={CENTER} x2="385" y2={CENTER} className="angle-circle-axis" />
            <line x1={CENTER} y1="35" x2={CENTER} y2="385" className="angle-circle-axis" />
            <line x1={CENTER} y1={CENTER} x2={CENTER + visualRadius} y2={CENTER} className="angle-start-radius" />
            {angle === 360 && <circle cx={CENTER} cy={CENTER} r="48" className="angle-sector-full" />}
            {angle > 0 && angle < 360 && <path d={sectorPath(angle)} className="angle-sector" />}
            {angle > 0 && <path d={arcPath(visualRadius, angle)} className="angle-growing-arc" />}
            <line x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} className="angle-rotating-radius" />
            <circle cx={point.x} cy={point.y} r="10" className="angle-drag-handle" />
            <circle cx={CENTER} cy={CENTER} r="5" className="angle-origin" />
            <text x={CENTER + visualRadius / 2 - 4} y={CENTER - 10} className="angle-radius-label">r</text>
            {angle > 12 && <text x={midpoint.x} y={midpoint.y} textAnchor="middle" className="angle-arc-label">arc s</text>}
            <text x="374" y={CENTER - 10} className="angle-axis-label">0°</text>
            <text x={CENTER + 10} y="46" className="angle-axis-label">90°</text>
            <text x="40" y={CENTER - 10} className="angle-axis-label">180°</text>
            <text x={CENTER + 10} y="386" className="angle-axis-label">270°</text>
          </svg>
          <p className="angle-interaction-note">Drag anywhere around the circle. Keyboard: arrow keys adjust by 1°, Page Up/Down by 15°, Home/End jump to 0°/360°.</p>
        </div>

        <div className="angle-control-panel">
          <div className="angle-primary-control">
            <label htmlFor={`${headingId}-angle`}>Angle: <strong>{angle}°</strong></label>
            <input
              id={`${headingId}-angle`}
              type="range"
              min="0"
              max="360"
              step="1"
              value={angle}
              onChange={(event) => {
                setPlaying(false)
                updateAngle(Number(event.target.value))
              }}
            />
          </div>

          <div className="angle-primary-control">
            <label htmlFor={`${headingId}-radius`}>Circle radius: <strong>{radius}</strong></label>
            <input id={`${headingId}-radius`} type="range" min="1" max="8" step="0.5" value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
          </div>

          <div className="angle-animation-controls">
            <button type="button" onClick={togglePlayback} disabled={reduceMotion} aria-pressed={playing}>{playing ? 'Pause' : 'Play'}</button>
            <div role="group" aria-label="Animation speed">
              {Object.entries(speeds).map(([id, speed]) => (
                <button type="button" className={speedId === id ? 'active' : ''} aria-pressed={speedId === id} onClick={() => setSpeedId(id)} disabled={reduceMotion} key={id}>{speed.label}</button>
              ))}
            </div>
          </div>
          {reduceMotion && <p className="angle-motion-note" role="status">Automatic rotation is paused because reduced motion is enabled. All manual controls remain available.</p>}

          <div className="angle-special-angles" role="group" aria-label="Choose a special angle">
            <span>Special angles</span>
            <div>
              {(isSlideSplit ? [0, 30, 45, 60, 90, 180, 270, 360] : specialAngles).map((specialAngle) => (
                <button
                  type="button"
                  className={angle === specialAngle ? 'active' : ''}
                  aria-pressed={angle === specialAngle}
                  onClick={() => {
                    setPlaying(false)
                    updateAngle(specialAngle)
                  }}
                  key={specialAngle}
                >
                  {specialAngle}°
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id={readoutId} className="angle-readout-grid" aria-live="polite">
        {(displayMode === 'degrees' || displayMode === 'both') && (
          <div>
            <span>Degrees</span>
            <strong><MathInline>{String.raw`${angle}^\circ`}</MathInline></strong>
            <small>{angle}/360 of a turn</small>
          </div>
        )}
        {(displayMode === 'radians' || displayMode === 'both') && (
          <div>
            <span>Radians</span>
            <strong><MathInline>{radiansMath}</MathInline></strong>
            <small>Approximately {radiansDecimal.toFixed(3)} rad</small>
          </div>
        )}
        <div>
          <span>Revolutions</span>
          <strong><MathInline>{revolutionsMath}</MathInline></strong>
          <small>Fraction of one complete turn</small>
        </div>
        <div className="angle-arc-readout">
          <span>Arc length</span>
          <strong><MathInline>{String.raw`s=r\theta=${arcLengthMath}`}</MathInline></strong>
          <small>With r = {radius}, s ≈ {arcLengthDecimal.toFixed(3)}</small>
        </div>
      </div>

      <aside className="angle-radian-why">
        <span className="card-label">Why radians are natural</span>
        <p>In radians, the angle is the ratio <MathInline>{String.raw`\theta=s/r`}</MathInline>. Rearranging gives <MathInline>{String.raw`s=r\theta`}</MathInline>, so the angle and arc length are connected without an extra conversion factor.</p>
      </aside>
    </section>
  )
}

export default AngleRadiansExplorer
