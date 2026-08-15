import { useRef, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const VIEW_WIDTH = 720
const PLOT_LEFT = 42
const PLOT_RIGHT = 678
const AXIS_MIN = -3
const AXIS_MAX = 9
const TICKS = Array.from({ length: AXIS_MAX - AXIS_MIN + 1 }, (_, index) => AXIS_MIN + index)

function numberToX(value) {
  return PLOT_LEFT + ((value - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (PLOT_RIGHT - PLOT_LEFT)
}

function xToNumber(clientX, element) {
  const bounds = element.getBoundingClientRect()
  const viewX = ((clientX - bounds.left) / bounds.width) * VIEW_WIDTH
  const raw = AXIS_MIN + ((viewX - PLOT_LEFT) / (PLOT_RIGHT - PLOT_LEFT)) * (AXIS_MAX - AXIS_MIN)
  return Math.max(AXIS_MIN, Math.min(AXIS_MAX, Math.round(raw * 10) / 10))
}

function formatNumber(value) {
  const safeValue = Object.is(value, -0) ? 0 : value
  return Number.isInteger(safeValue) ? String(safeValue) : safeValue.toFixed(1)
}

function DistanceNumberLine({ value, onChange }) {
  const dragging = useRef(false)
  const pointX = numberToX(value)
  const anchorX = numberToX(3)
  const distance = Math.abs(value - 3)

  const updateFromPointer = (event) => {
    onChange(xToNumber(event.clientX, event.currentTarget))
  }

  const handlePointerDown = (event) => {
    dragging.current = true
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updateFromPointer(event)
  }

  const handlePointerMove = (event) => {
    if (dragging.current) updateFromPointer(event)
  }

  const handlePointerUp = (event) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event) => {
    let nextValue = value
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextValue = Math.max(AXIS_MIN, value - 0.1)
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextValue = Math.min(AXIS_MAX, value + 0.1)
    if (event.key === 'Home') nextValue = AXIS_MIN
    if (event.key === 'End') nextValue = AXIS_MAX
    if (nextValue !== value) {
      event.preventDefault()
      onChange(Math.round(nextValue * 10) / 10)
    }
  }

  return (
    <svg
      className="algebra-absolute-number-line"
      viewBox={`0 0 ${VIEW_WIDTH} 180`}
      role="slider"
      tabIndex="0"
      aria-label="Drag x along the number line"
      aria-valuemin={AXIS_MIN}
      aria-valuemax={AXIS_MAX}
      aria-valuenow={value}
      aria-valuetext={`x equals ${formatNumber(value)}; its distance from 3 is ${formatNumber(distance)}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <line x1={PLOT_LEFT} y1="102" x2={PLOT_RIGHT} y2="102" className="algebra-number-line-axis" />
      <polygon points={`${PLOT_LEFT},102 ${PLOT_LEFT + 13},95 ${PLOT_LEFT + 13},109`} className="algebra-number-line-arrow" />
      <polygon points={`${PLOT_RIGHT},102 ${PLOT_RIGHT - 13},95 ${PLOT_RIGHT - 13},109`} className="algebra-number-line-arrow" />
      {TICKS.map((tick) => (
        <g key={tick}>
          <line x1={numberToX(tick)} y1="94" x2={numberToX(tick)} y2="110" className="algebra-number-line-tick" />
          <text x={numberToX(tick)} y="134" textAnchor="middle" className="algebra-number-line-label">{tick}</text>
        </g>
      ))}
      <line x1={Math.min(pointX, anchorX)} y1="55" x2={Math.max(pointX, anchorX)} y2="55" className="algebra-distance-span" />
      <line x1={pointX} y1="48" x2={pointX} y2="63" className="algebra-distance-cap" />
      <line x1={anchorX} y1="48" x2={anchorX} y2="63" className="algebra-distance-cap" />
      <text x={(pointX + anchorX) / 2} y="38" textAnchor="middle" className="algebra-distance-label">
        distance = {formatNumber(distance)}
      </text>
      <line x1={anchorX} y1="71" x2={anchorX} y2="102" className="algebra-distance-anchor-guide" />
      <circle cx={anchorX} cy="102" r="8" className="algebra-distance-anchor" />
      <text x={anchorX} y="160" textAnchor="middle" className="algebra-distance-anchor-label">center 3</text>
      <line x1={pointX} y1="72" x2={pointX} y2="102" className="algebra-distance-point-guide" />
      <circle key={value} cx={pointX} cy="102" r="11" className="algebra-distance-point">
        <animate attributeName="r" values="8;13;11" dur="0.25s" />
      </circle>
      <text x={pointX} y="82" textAnchor="middle" className="algebra-distance-point-label">x = {formatNumber(value)}</text>
    </svg>
  )
}

function AbsoluteInequalityNumberLine() {
  const left = numberToX(1)
  const center = numberToX(3)
  const right = numberToX(5)

  return (
    <svg
      className="algebra-absolute-solution-line"
      viewBox={`0 0 ${VIEW_WIDTH} 154`}
      role="img"
      aria-label="The open interval from 1 to 5, representing every point less than 2 units from 3"
    >
      <line x1={PLOT_LEFT} y1="72" x2={PLOT_RIGHT} y2="72" className="algebra-number-line-axis" />
      {TICKS.map((tick) => (
        <g key={tick}>
          <line x1={numberToX(tick)} y1="65" x2={numberToX(tick)} y2="79" className="algebra-number-line-tick" />
          <text x={numberToX(tick)} y="101" textAnchor="middle" className="algebra-number-line-label">{tick}</text>
        </g>
      ))}
      <line x1={left} y1="72" x2={right} y2="72" className="algebra-absolute-solution-span">
        <animate attributeName="stroke-dashoffset" values="160;0" dur="0.7s" />
      </line>
      <circle cx={left} cy="72" r="10" className="algebra-interval-endpoint algebra-interval-endpoint-open" />
      <circle cx={right} cy="72" r="10" className="algebra-interval-endpoint algebra-interval-endpoint-open" />
      <circle cx={center} cy="72" r="7" className="algebra-distance-anchor" />
      <line x1={left} y1="35" x2={center} y2="35" className="algebra-distance-span" />
      <line x1={center} y1="35" x2={right} y2="35" className="algebra-distance-span" />
      <text x={(left + center) / 2} y="24" textAnchor="middle" className="algebra-distance-label">2 units</text>
      <text x={(center + right) / 2} y="24" textAnchor="middle" className="algebra-distance-label">2 units</text>
      <text x={VIEW_WIDTH / 2} y="137" textAnchor="middle" className="algebra-absolute-solution-caption">Endpoints 1 and 5 are excluded because the distance must be strictly less than 2.</text>
    </svg>
  )
}

export function AbsoluteValueLab() {
  const [value, setValue] = useState(-1)
  const [showSolution, setShowSolution] = useState(false)
  const distance = Math.abs(value - 3)

  return (
    <section className="algebra-absolute-lab" aria-labelledby="algebra-absolute-heading">
      <header className="algebra-lab-heading">
        <div>
          <span className="algebra-lab-label">Distance lab</span>
          <h3 id="algebra-absolute-heading">Absolute value measures distance</h3>
          <MathDisplay>{String.raw`|x|=\operatorname{distance}(x,0)`}</MathDisplay>
        </div>
        <p>
          Absolute value records how far a number is from zero, without assigning a left or right direction.
          That is why opposite locations can have the same absolute value.
        </p>
      </header>

      <div className="algebra-absolute-examples" aria-label="Absolute value examples">
        <div className="algebra-absolute-example"><MathDisplay>{'|5|=5'}</MathDisplay></div>
        <div className="algebra-absolute-example"><MathDisplay>{'|-5|=5'}</MathDisplay></div>
        <p>Both 5 and -5 sit exactly five units from zero.</p>
      </div>

      <div className="algebra-distance-explorer" aria-labelledby="algebra-distance-explorer-heading">
        <h3 id="algebra-distance-explorer-heading">Move x and measure its distance from 3</h3>
        <p>
          The expression <MathInline>{'|x-3|'}</MathInline> measures the distance between{' '}
          <MathInline>{'x'}</MathInline> and <MathInline>{'3'}</MathInline>. Drag the point, use the arrow
          keys on the graph, or adjust the slider.
        </p>
        <DistanceNumberLine value={value} onChange={setValue} />
        <label className="algebra-control-label" htmlFor="algebra-absolute-x-control">
          Set x precisely: <output>{formatNumber(value)}</output>
          <input
            id="algebra-absolute-x-control"
            type="range"
            min={AXIS_MIN}
            max={AXIS_MAX}
            step="0.1"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </label>
        <div className="algebra-distance-live-result" aria-live="polite">
          <MathDisplay>{`|${formatNumber(value)}-3|=${formatNumber(distance)}`}</MathDisplay>
          <p>The point is {formatNumber(distance)} units from 3.</p>
        </div>
      </div>

      <div className="algebra-absolute-inequality" aria-labelledby="algebra-absolute-inequality-heading">
        <span className="algebra-lab-label">Solve by interpreting distance</span>
        <h3 id="algebra-absolute-inequality-heading">Which x-values stay within two units of 3?</h3>
        <MathDisplay>{'|x-3|<2'}</MathDisplay>
        <p>Predict the interval first. Then reveal the geometric argument.</p>
        <button type="button" onClick={() => setShowSolution((current) => !current)} aria-expanded={showSolution}>
          {showSolution ? 'Hide visual solution' : 'Reveal visual solution'}
        </button>
        {showSolution && (
          <div className="algebra-absolute-inequality-solution">
            <AbsoluteInequalityNumberLine />
            <p>
              Starting at 3, moving less than two units left keeps us above 1; moving less than two units
              right keeps us below 5. Therefore:
            </p>
            <MathDisplay>{'1<x<5'}</MathDisplay>
          </div>
        )}
      </div>

      <aside className="algebra-absolute-connection" aria-labelledby="algebra-absolute-connection-heading">
        <span className="algebra-lab-label">Coming later</span>
        <h3 id="algebra-absolute-connection-heading">Distance becomes the language of closeness</h3>
        <p>
          In limits and convergence, absolute value gives a precise way to say that two quantities are
          close—even when one lies to the left and the other lies to the right.
        </p>
      </aside>
    </section>
  )
}

export default AbsoluteValueLab
