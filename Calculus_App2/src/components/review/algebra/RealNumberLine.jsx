import { useMemo, useRef, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const SVG_WIDTH = 920
const SVG_HEIGHT = 280
const PLOT_LEFT = 64
const PLOT_RIGHT = 856
const AXIS_Y = 142

const NUMBER_POINTS = [
  {
    id: 'negative-five-halves',
    exact: String.raw`-\frac{5}{2}`,
    spoken: 'negative 5 halves',
    value: -5 / 2,
  },
  {
    id: 'negative-ten-sevenths',
    exact: String.raw`-\frac{10}{7}`,
    spoken: 'negative 10 sevenths',
    value: -10 / 7,
  },
  {
    id: 'negative-sqrt-three-halves',
    exact: String.raw`-\frac{\sqrt{3}}{2}`,
    spoken: 'negative square root of 3 over 2',
    value: -Math.sqrt(3) / 2,
  },
  {
    id: 'one-half',
    exact: String.raw`\frac{1}{2}`,
    spoken: '1 half',
    value: 1 / 2,
  },
  {
    id: 'two-thirds',
    exact: String.raw`\frac{2}{3}`,
    spoken: '2 thirds',
    value: 2 / 3,
  },
  {
    id: 'sqrt-two',
    exact: String.raw`\sqrt{2}`,
    spoken: 'square root of 2',
    value: Math.sqrt(2),
  },
  {
    id: 'pi',
    exact: String.raw`\pi`,
    spoken: 'pi',
    value: Math.PI,
  },
]

const COMPARISON_POINT = {
  id: 'seven-fifths',
  exact: String.raw`\frac{7}{5}`,
  spoken: '7 fifths',
  value: 7 / 5,
  comparison: true,
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function chooseTickStep(span) {
  if (span <= 0.8) return 0.1
  if (span <= 2) return 0.25
  if (span <= 4) return 0.5
  if (span <= 8) return 1
  if (span <= 16) return 2
  return 5
}

function createTicks(minimum, maximum) {
  const step = chooseTickStep(maximum - minimum)
  const start = Math.ceil(minimum / step) * step
  const ticks = []

  for (let value = start; value <= maximum + step / 10; value += step) {
    ticks.push(Number(value.toFixed(6)))
  }

  return { ticks, step }
}

function formatTick(value, step) {
  if (Math.abs(value) < 1e-8) return '0'
  if (step >= 1) return String(Math.round(value))
  if (step >= 0.25) return value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  return value.toFixed(1)
}

function NumberPoint({ point, pointIndex, toPixel, selected, onSelect }) {
  const x = toPixel(point.value)
  const placeAbove = point.comparison || pointIndex % 2 === 0
  const labelY = placeAbove ? AXIS_Y - 47 : AXIS_Y + 62
  const stemEnd = placeAbove ? AXIS_Y - 31 : AXIS_Y + 33

  const selectPoint = () => onSelect(point.id)

  return (
    <g
      className={`algebra-number-line-point ${selected ? 'is-selected' : ''} ${point.comparison ? 'is-comparison' : ''}`}
      role="button"
      tabIndex="0"
      aria-label={`${point.spoken}, approximately ${point.value.toFixed(3)}`}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={selectPoint}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          selectPoint()
        }
      }}
    >
      <line x1={x} y1={AXIS_Y} x2={x} y2={stemEnd} />
      <circle cx={x} cy={AXIS_Y} r={selected ? 10 : 8} />
      <circle className="algebra-number-line-hit-area" cx={x} cy={AXIS_Y} r="20" />
      <text x={x} y={labelY} textAnchor="middle">{point.spoken}</text>
    </g>
  )
}

export function RealNumberLine() {
  const [center, setCenter] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [selectedId, setSelectedId] = useState('sqrt-two')
  const [prediction, setPrediction] = useState(null)
  const [comparisonRevealed, setComparisonRevealed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef(null)

  const halfRange = 4 / zoom
  const minimum = center - halfRange
  const maximum = center + halfRange
  const visibleSpan = maximum - minimum
  const { ticks, step } = useMemo(() => createTicks(minimum, maximum), [minimum, maximum])
  const displayedPoints = comparisonRevealed ? [...NUMBER_POINTS, COMPARISON_POINT] : NUMBER_POINTS
  const selectedPoint = displayedPoints.find((point) => point.id === selectedId)
    ?? NUMBER_POINTS.find((point) => point.id === selectedId)
    ?? NUMBER_POINTS[0]

  const toPixel = (value) => PLOT_LEFT + ((value - minimum) / visibleSpan) * (PLOT_RIGHT - PLOT_LEFT)

  const pan = (direction) => {
    setCenter((current) => clamp(current + direction * halfRange * 0.45, -12, 12))
  }

  const resetView = () => {
    setCenter(0)
    setZoom(1)
  }

  const handlePointerDown = (event) => {
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startCenter: center,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return
    const plotPixels = PLOT_RIGHT - PLOT_LEFT
    const difference = event.clientX - dragState.current.startX
    const nextCenter = dragState.current.startCenter - (difference / plotPixels) * visibleSpan
    setCenter(clamp(nextCenter, -12, 12))
  }

  const finishDrag = (event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return
    dragState.current = null
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const revealComparison = () => {
    if (!prediction) return
    setComparisonRevealed(true)
    setSelectedId('sqrt-two')
    setCenter((Math.sqrt(2) + 7 / 5) / 2)
    setZoom(12)
  }

  const choosePrediction = (choice) => {
    setPrediction(choice)
    setComparisonRevealed(false)
  }

  return (
    <div className="algebra-real-number-line">
      <section className="algebra-number-line-explorer" aria-labelledby="algebra-real-line-heading">
        <header className="algebra-lab-heading">
          <div>
            <span className="card-label">Interactive number line</span>
            <h3 id="algebra-real-line-heading">Exact values have exact locations</h3>
          </div>
          <p>Drag the line to pan, use the zoom control, or select any plotted value.</p>
        </header>

        <div className="algebra-number-line-toolbar">
          <div className="algebra-pan-controls" role="group" aria-label="Pan number line">
            <button type="button" onClick={() => pan(-1)} aria-label="Pan left">← Pan left</button>
            <button type="button" onClick={() => pan(1)} aria-label="Pan right">Pan right →</button>
          </div>

          <label className="algebra-zoom-control">
            <span>Zoom: {zoom.toFixed(zoom % 1 === 0 ? 0 : 1)}x</span>
            <input
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </label>

          <button className="secondary-button" type="button" onClick={resetView}>Reset view</button>
        </div>

        <div className={`algebra-number-line-canvas ${isDragging ? 'is-dragging' : ''}`}>
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            role="group"
            aria-label={`Interactive real number line from ${minimum.toFixed(2)} to ${maximum.toFixed(2)}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            style={{ touchAction: 'none' }}
          >
            <title>Interactive real number line</title>
            <desc>Points mark exact rational and irrational values. Select a point to inspect its decimal approximation.</desc>
            <line className="algebra-number-line-axis" x1={PLOT_LEFT} y1={AXIS_Y} x2={PLOT_RIGHT} y2={AXIS_Y} />
            <path className="algebra-number-line-arrow" d={`M ${PLOT_LEFT} ${AXIS_Y} l 12 -7 v 14 z`} />
            <path className="algebra-number-line-arrow" d={`M ${PLOT_RIGHT} ${AXIS_Y} l -12 -7 v 14 z`} />

            {ticks.map((tick) => {
              const x = toPixel(tick)
              return (
                <g className="algebra-number-line-tick" key={tick}>
                  <line x1={x} y1={AXIS_Y - 8} x2={x} y2={AXIS_Y + 8} />
                  <text x={x} y={AXIS_Y + 28} textAnchor="middle">{formatTick(tick, step)}</text>
                </g>
              )
            })}

            {displayedPoints.map((point, index) => (
              point.value >= minimum && point.value <= maximum && (
                <NumberPoint
                  key={point.id}
                  point={point}
                  pointIndex={index}
                  toPixel={toPixel}
                  selected={selectedId === point.id}
                  onSelect={setSelectedId}
                />
              )
            ))}
          </svg>
        </div>

        <div className="algebra-number-line-values" role="group" aria-label="Select an exact value">
          {NUMBER_POINTS.map((point) => (
            <button
              key={point.id}
              type="button"
              className={selectedId === point.id ? 'is-active' : ''}
              aria-pressed={selectedId === point.id}
              aria-label={`Inspect ${point.spoken}`}
              onClick={() => setSelectedId(point.id)}
            >
              <MathInline>{point.exact}</MathInline>
            </button>
          ))}
          {comparisonRevealed && (
            <button
              type="button"
              className={selectedId === COMPARISON_POINT.id ? 'is-active' : ''}
              aria-pressed={selectedId === COMPARISON_POINT.id}
              onClick={() => setSelectedId(COMPARISON_POINT.id)}
            >
              <MathInline>{COMPARISON_POINT.exact}</MathInline>
            </button>
          )}
        </div>

        <aside className="algebra-number-inspector" aria-live="polite">
          <div>
            <span>Exact value</span>
            <MathDisplay>{selectedPoint.exact}</MathDisplay>
          </div>
          <div>
            <span>Decimal approximation</span>
            <strong>{selectedPoint.value.toFixed(3)}</strong>
          </div>
          <p>The decimal helps estimate position; the exact expression preserves the number without rounding.</p>
        </aside>
      </section>

      <section className="algebra-number-comparison" aria-labelledby="algebra-number-comparison-heading">
        <header className="algebra-lab-heading">
          <div>
            <span className="card-label">Predict, then reveal</span>
            <h3 id="algebra-number-comparison-heading">Which number is larger?</h3>
          </div>
          <MathDisplay>{String.raw`\sqrt{2}\quad\text{or}\quad\frac{7}{5}`}</MathDisplay>
        </header>

        <div className="algebra-comparison-choices" role="group" aria-label="Predict which value is larger">
          <button
            type="button"
            className={prediction === 'sqrt-two' ? 'is-selected' : ''}
            aria-pressed={prediction === 'sqrt-two'}
            onClick={() => choosePrediction('sqrt-two')}
          >
            <MathInline>{String.raw`\sqrt{2}\text{ is larger}`}</MathInline>
          </button>
          <button
            type="button"
            className={prediction === 'seven-fifths' ? 'is-selected' : ''}
            aria-pressed={prediction === 'seven-fifths'}
            onClick={() => choosePrediction('seven-fifths')}
          >
            <MathInline>{String.raw`\frac{7}{5}\text{ is larger}`}</MathInline>
          </button>
        </div>

        <button type="button" disabled={!prediction} onClick={revealComparison}>
          Show both points on the line
        </button>

        {comparisonRevealed && (
          <div className={`algebra-comparison-feedback ${prediction === 'sqrt-two' ? 'is-correct' : 'is-incorrect'}`} aria-live="polite">
            <strong>{prediction === 'sqrt-two' ? 'Your prediction is correct.' : 'The number line shows a different order.'}</strong>
            <MathDisplay>{String.raw`\frac{7}{5}=1.4\quad\text{and}\quad\sqrt{2}\approx1.414`}</MathDisplay>
            <p>Because 1.414 is slightly to the right of 1.4, <MathInline>{String.raw`\sqrt{2}>\frac{7}{5}`}</MathInline>.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default RealNumberLine
