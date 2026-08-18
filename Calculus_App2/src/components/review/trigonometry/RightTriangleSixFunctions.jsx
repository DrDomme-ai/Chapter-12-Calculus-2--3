import { useId, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import '../../../styles/right-triangle-six-functions.css'

const EPSILON = 1e-9
const MIN_SCALE = 2
const MAX_SCALE = 10

const exactAngles = {
  0: {
    radians: '0',
    sin: '0',
    cos: '1',
    tan: '0',
    csc: String.raw`\text{undefined}`,
    sec: '1',
    cot: String.raw`\text{undefined}`,
  },
  30: {
    radians: String.raw`\frac{\pi}{6}`,
    sin: String.raw`\frac{1}{2}`,
    cos: String.raw`\frac{\sqrt{3}}{2}`,
    tan: String.raw`\frac{\sqrt{3}}{3}`,
    csc: '2',
    sec: String.raw`\frac{2\sqrt{3}}{3}`,
    cot: String.raw`\sqrt{3}`,
  },
  45: {
    radians: String.raw`\frac{\pi}{4}`,
    sin: String.raw`\frac{\sqrt{2}}{2}`,
    cos: String.raw`\frac{\sqrt{2}}{2}`,
    tan: '1',
    csc: String.raw`\sqrt{2}`,
    sec: String.raw`\sqrt{2}`,
    cot: '1',
  },
  60: {
    radians: String.raw`\frac{\pi}{3}`,
    sin: String.raw`\frac{\sqrt{3}}{2}`,
    cos: String.raw`\frac{1}{2}`,
    tan: String.raw`\sqrt{3}`,
    csc: String.raw`\frac{2\sqrt{3}}{3}`,
    sec: '2',
    cot: String.raw`\frac{\sqrt{3}}{3}`,
  },
  90: {
    radians: String.raw`\frac{\pi}{2}`,
    sin: '1',
    cos: '0',
    tan: String.raw`\text{undefined}`,
    csc: '1',
    sec: String.raw`\text{undefined}`,
    cot: '0',
  },
}

const ratioMetadata = [
  { id: 'sin', name: 'Sine', symbol: String.raw`\sin`, numerator: 'opposite', denominator: 'hypotenuse', reciprocal: 'cosecant' },
  { id: 'cos', name: 'Cosine', symbol: String.raw`\cos`, numerator: 'adjacent', denominator: 'hypotenuse', reciprocal: 'secant' },
  { id: 'tan', name: 'Tangent', symbol: String.raw`\tan`, numerator: 'opposite', denominator: 'adjacent', reciprocal: 'cotangent' },
  { id: 'csc', name: 'Cosecant', symbol: String.raw`\csc`, numerator: 'hypotenuse', denominator: 'opposite', reciprocal: 'sine' },
  { id: 'sec', name: 'Secant', symbol: String.raw`\sec`, numerator: 'hypotenuse', denominator: 'adjacent', reciprocal: 'cosine' },
  { id: 'cot', name: 'Cotangent', symbol: String.raw`\cot`, numerator: 'adjacent', denominator: 'opposite', reciprocal: 'tangent' },
]

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function formatDecimal(value, digits = 3) {
  if (Math.abs(value) < EPSILON) return '0'
  return String(Number(value.toFixed(digits)))
}

function RatioCard({ ratio, exactValue }) {
  const definitionMath = String.raw`${ratio.symbol}\theta=\frac{\text{${ratio.numerator}}}{\text{${ratio.denominator}}}`
  const numericMath = ratio.defined
    ? String.raw`\frac{${formatDecimal(ratio.numeratorValue)}}{${formatDecimal(ratio.denominatorValue)}}\approx ${formatDecimal(ratio.numericValue)}`
    : String.raw`\frac{${formatDecimal(ratio.numeratorValue)}}{0}\;\text{ is undefined}`

  return (
    <article className={`triangle-ratio-card${ratio.defined ? '' : ' is-undefined'}`} aria-label={`${ratio.name}: ${ratio.defined ? 'defined' : 'undefined'}`}>
      <header>
        <span>{ratio.name}</span>
        <strong><MathInline>{String.raw`${ratio.symbol}\theta`}</MathInline></strong>
      </header>
      <MathDisplay>{definitionMath}</MathDisplay>
      <div className="triangle-ratio-calculation">
        <MathInline>{numericMath}</MathInline>
      </div>
      {ratio.defined && exactValue && (
        <p className="triangle-exact-value">
          Exact value: <MathInline>{String.raw`${ratio.symbol}\theta=${exactValue}`}</MathInline>
        </p>
      )}
      <p className="triangle-ratio-status">
        {ratio.defined
          ? `${ratio.denominator} is not zero. Reciprocal partner: ${ratio.reciprocal}.`
          : `Undefined because the ${ratio.denominator} length is zero.`}
      </p>
    </article>
  )
}

export function RightTriangleSixFunctions({ initialAngle = 45, initialScale = 6 }) {
  const parsedInitialAngle = Number(initialAngle)
  const parsedInitialScale = Number(initialScale)
  const safeInitialAngle = Number.isFinite(parsedInitialAngle) ? clamp(Math.round(parsedInitialAngle), 0, 90) : 45
  const safeInitialScale = Number.isFinite(parsedInitialScale) ? clamp(parsedInitialScale, MIN_SCALE, MAX_SCALE) : 6
  const [angle, setAngle] = useState(safeInitialAngle)
  const [scale, setScale] = useState(safeInitialScale)
  const [scaleWasChanged, setScaleWasChanged] = useState(false)
  const headingId = useId()
  const descriptionId = useId()
  const readoutId = useId()

  const geometry = useMemo(() => {
    const radians = (angle * Math.PI) / 180
    const cosine = Math.abs(Math.cos(radians)) < EPSILON ? 0 : Math.cos(radians)
    const sine = Math.abs(Math.sin(radians)) < EPSILON ? 0 : Math.sin(radians)
    const lengths = {
      adjacent: scale * cosine,
      opposite: scale * sine,
      hypotenuse: scale,
    }
    const visualHypotenuse = 175 + ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 125
    const origin = { x: 76, y: 330 }
    const corner = { x: origin.x + visualHypotenuse * cosine, y: origin.y }
    const point = { x: corner.x, y: origin.y - visualHypotenuse * sine }

    return { cosine, sine, lengths, visualHypotenuse, origin, corner, point }
  }, [angle, scale])

  const ratios = useMemo(() => {
    const values = geometry.lengths
    return ratioMetadata.map((metadata) => {
      const numeratorValue = values[metadata.numerator]
      const denominatorValue = values[metadata.denominator]
      const defined = Math.abs(denominatorValue) >= EPSILON
      return {
        ...metadata,
        numeratorValue,
        denominatorValue,
        defined,
        numericValue: defined ? numeratorValue / denominatorValue : null,
      }
    })
  }, [geometry.lengths])

  const exact = exactAngles[angle]
  const degenerate = angle === 0 || angle === 90
  const rightMarkerVisible = geometry.corner.x - geometry.origin.x > 24 && geometry.origin.y - geometry.point.y > 24
  const arcRadius = 48
  const angleArcEnd = {
    x: geometry.origin.x + arcRadius * geometry.cosine,
    y: geometry.origin.y - arcRadius * geometry.sine,
  }
  const angleLabel = {
    x: geometry.origin.x + 72 * Math.cos((angle * Math.PI) / 360),
    y: geometry.origin.y - 72 * Math.sin((angle * Math.PI) / 360),
  }

  const changeScale = (nextScale) => {
    setScale(Number(nextScale))
    setScaleWasChanged(true)
  }

  const reset = () => {
    setAngle(safeInitialAngle)
    setScale(safeInitialScale)
    setScaleWasChanged(false)
  }

  return (
    <section className="right-triangle-six-functions" aria-labelledby={headingId}>
      <header className="right-triangle-heading">
        <div>
          <span className="card-label">Interactive right triangle</span>
          <h3 id={headingId}>One angle, six connected ratios</h3>
          <p id={descriptionId}>Set the angle, then resize the triangle. The right angle is preserved and every side changes, but the six trigonometric ratios depend only on <MathInline>{String.raw`\theta`}</MathInline>.</p>
        </div>
        <div className="right-triangle-angle-badge" aria-label={`${angle} degrees`}>
          <MathInline>{String.raw`\theta=${angle}^{\circ}`}</MathInline>
          {exact && <small><MathInline>{String.raw`=${exact.radians}`}</MathInline></small>}
        </div>
      </header>

      <div className="right-triangle-workspace">
        <div className="right-triangle-stage">
          <svg viewBox="0 0 520 390" role="img" aria-labelledby={`${headingId}-visual-title ${headingId}-visual-description`}>
            <title id={`${headingId}-visual-title`}>Right triangle with angle theta</title>
            <desc id={`${headingId}-visual-description`}>A right triangle whose hypotenuse is {formatDecimal(geometry.lengths.hypotenuse)} units, adjacent side is {formatDecimal(geometry.lengths.adjacent)} units, and opposite side is {formatDecimal(geometry.lengths.opposite)} units.</desc>
            <polygon
              points={`${geometry.origin.x},${geometry.origin.y} ${geometry.corner.x},${geometry.corner.y} ${geometry.point.x},${geometry.point.y}`}
              className="right-triangle-area"
            />
            <line x1={geometry.origin.x} y1={geometry.origin.y} x2={geometry.corner.x} y2={geometry.corner.y} className="triangle-side triangle-adjacent" />
            <line x1={geometry.corner.x} y1={geometry.corner.y} x2={geometry.point.x} y2={geometry.point.y} className="triangle-side triangle-opposite" />
            <line x1={geometry.origin.x} y1={geometry.origin.y} x2={geometry.point.x} y2={geometry.point.y} className="triangle-side triangle-hypotenuse" />

            {rightMarkerVisible && (
              <path
                d={`M ${geometry.corner.x - 17} ${geometry.corner.y} L ${geometry.corner.x - 17} ${geometry.corner.y - 17} L ${geometry.corner.x} ${geometry.corner.y - 17}`}
                className="triangle-right-angle-marker"
              />
            )}

            {angle > 0 && (
              <path
                d={`M ${geometry.origin.x + arcRadius} ${geometry.origin.y} A ${arcRadius} ${arcRadius} 0 0 0 ${angleArcEnd.x} ${angleArcEnd.y}`}
                className="triangle-angle-arc"
              />
            )}
            <text x={angleLabel.x} y={angleLabel.y} className="triangle-theta-label">{angle}°</text>

            <text x={(geometry.origin.x + geometry.corner.x) / 2} y={geometry.origin.y + 28} textAnchor="middle" className="triangle-side-label triangle-adjacent-label">
              adjacent = {formatDecimal(geometry.lengths.adjacent)}
            </text>
            <text x={geometry.corner.x + 12} y={(geometry.corner.y + geometry.point.y) / 2} className="triangle-side-label triangle-opposite-label">
              opposite = {formatDecimal(geometry.lengths.opposite)}
            </text>
            <text x={(geometry.origin.x + geometry.point.x) / 2 - 10} y={(geometry.origin.y + geometry.point.y) / 2 - 16} textAnchor="middle" className="triangle-side-label triangle-hypotenuse-label">
              hypotenuse = {formatDecimal(geometry.lengths.hypotenuse)}
            </text>
            <text x={geometry.corner.x - 8} y={geometry.corner.y - 7} textAnchor="end" className="triangle-right-angle-text">right angle</text>
          </svg>

          <ul className="triangle-side-key" aria-label="Triangle side styles">
            <li><span className="key-line adjacent" aria-hidden="true" /><strong>Adjacent</strong><small>next to θ</small></li>
            <li><span className="key-line opposite" aria-hidden="true" /><strong>Opposite</strong><small>across from θ</small></li>
            <li><span className="key-line hypotenuse" aria-hidden="true" /><strong>Hypotenuse</strong><small>across from 90°</small></li>
          </ul>
        </div>

        <aside className="right-triangle-controls" aria-describedby={descriptionId}>
          <div className="triangle-control">
            <label htmlFor={`${headingId}-angle`}>
              <span>Angle θ</span>
              <output htmlFor={`${headingId}-angle`}>{angle}°</output>
            </label>
            <input
              id={`${headingId}-angle`}
              type="range"
              min="0"
              max="90"
              step="1"
              value={angle}
              aria-valuetext={`${angle} degrees`}
              aria-controls={readoutId}
              onChange={(event) => setAngle(Number(event.target.value))}
            />
            <small>Use arrow keys for 1° steps. Endpoints show when a denominator becomes zero.</small>
          </div>

          <div className="triangle-common-angles" role="group" aria-label="Choose a common angle">
            {[0, 30, 45, 60, 90].map((commonAngle) => (
              <button
                type="button"
                className={angle === commonAngle ? 'active' : ''}
                aria-pressed={angle === commonAngle}
                onClick={() => setAngle(commonAngle)}
                key={commonAngle}
              >
                <MathInline>{exactAngles[commonAngle].radians}</MathInline>
                <small>{commonAngle}°</small>
              </button>
            ))}
          </div>

          <div className="triangle-control triangle-scale-control">
            <label htmlFor={`${headingId}-scale`}>
              <span>Triangle size</span>
              <output htmlFor={`${headingId}-scale`}>hypotenuse = {formatDecimal(scale, 1)}</output>
            </label>
            <input
              id={`${headingId}-scale`}
              type="range"
              min={MIN_SCALE}
              max={MAX_SCALE}
              step="0.5"
              value={scale}
              aria-valuetext={`Hypotenuse length ${formatDecimal(scale, 1)} units; angle remains ${angle} degrees`}
              aria-controls={readoutId}
              onChange={(event) => changeScale(event.target.value)}
            />
            <small><strong>Angle locked at {angle}° while resizing.</strong> The right angle remains 90°.</small>
          </div>

          <button type="button" className="triangle-reset-button" onClick={reset}>Reset triangle</button>

          <div className={`triangle-scale-discovery${scaleWasChanged ? ' is-discovered' : ''}`} role="status" aria-live="polite">
            <span>{scaleWasChanged ? 'Discovery' : 'Try this'}</span>
            <strong>Make the triangle larger. Did the ratios change?</strong>
            <p>{scaleWasChanged ? `No. At ${angle}°, scaling changes all three lengths by the same factor, so every defined ratio stays the same.` : 'Move the triangle-size slider while keeping the angle fixed.'}</p>
          </div>
        </aside>
      </div>

      {degenerate && (
        <aside className="triangle-endpoint-note" role="note">
          <strong>Endpoint note:</strong> at {angle}° the triangle collapses to a line. Values shown come from the unit-circle definitions; any ratio with a zero denominator is explicitly marked undefined.
        </aside>
      )}

      <section id={readoutId} className="triangle-ratio-section" aria-labelledby={`${headingId}-ratios`}>
        <header>
          <div>
            <span className="card-label">Live ratio lab</span>
            <h4 id={`${headingId}-ratios`}>All six functions</h4>
          </div>
          <p>{exact ? <>Common angle selected—exact values are shown alongside the live side-length ratios.</> : <>This is not a standard angle, so the live values are decimal approximations.</>}</p>
        </header>
        <div className="triangle-ratio-grid">
          {ratios.map((ratio) => <RatioCard ratio={ratio} exactValue={exact?.[ratio.id]} key={ratio.id} />)}
        </div>
      </section>

      <aside className="triangle-similarity-proof">
        <div>
          <span className="card-label">Why size does not matter</span>
          <h4>Scaling multiplies both parts of every ratio.</h4>
          <p>The common scale factor cancels. That is why similar right triangles with the same angle have identical trigonometric ratios.</p>
        </div>
        <MathDisplay>{String.raw`\frac{k(\text{opposite})}{k(\text{hypotenuse})}=\frac{\text{opposite}}{\text{hypotenuse}}`}</MathDisplay>
      </aside>
    </section>
  )
}

export default RightTriangleSixFunctions
