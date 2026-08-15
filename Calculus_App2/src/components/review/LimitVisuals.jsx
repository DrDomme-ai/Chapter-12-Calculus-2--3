import { useState } from 'react'

const WIDTH = 720
const HEIGHT = 410
const MARGIN = { left: 52, right: 24, top: 22, bottom: 42 }

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index)

function plotCoordinates(xMin, xMax, yMin, yMax) {
  return {
    x: (value) => MARGIN.left + ((value - xMin) / (xMax - xMin)) * (WIDTH - MARGIN.left - MARGIN.right),
    y: (value) => HEIGHT - MARGIN.bottom - ((value - yMin) / (yMax - yMin)) * (HEIGHT - MARGIN.top - MARGIN.bottom),
  }
}

function samplePath(fn, start, end, coordinates, yMin, yMax, steps = 150) {
  let path = ''
  let drawing = false

  for (let index = 0; index <= steps; index += 1) {
    const xValue = start + (index / steps) * (end - start)
    const yValue = fn(xValue)
    const visible = Number.isFinite(yValue) && yValue > yMin - 0.3 && yValue < yMax + 0.3

    if (!visible) {
      drawing = false
      continue
    }

    path += (drawing ? ' L ' : ' M ') + coordinates.x(xValue).toFixed(2) + ' ' + coordinates.y(yValue).toFixed(2)
    drawing = true
  }

  return path
}

function GraphFrame({
  xMin,
  xMax,
  yMin,
  yMax,
  label,
  verticalAsymptotes = [],
  horizontalAsymptotes = [],
  children,
}) {
  const coordinates = plotCoordinates(xMin, xMax, yMin, yMax)
  const xTicks = range(Math.ceil(xMin), Math.floor(xMax))
  const yTicks = range(Math.ceil(yMin), Math.floor(yMax))

  return (
    <svg className="limit-graph" viewBox={'0 0 ' + WIDTH + ' ' + HEIGHT} role="img" aria-label={label}>
      <rect x="0" y="0" width={WIDTH} height={HEIGHT} rx="12" className="limit-graph-background" />
      {xTicks.map((value) => (
        <line key={'x-grid-' + value} x1={coordinates.x(value)} y1={MARGIN.top} x2={coordinates.x(value)} y2={HEIGHT - MARGIN.bottom} className="limit-grid-line" />
      ))}
      {yTicks.map((value) => (
        <line key={'y-grid-' + value} x1={MARGIN.left} y1={coordinates.y(value)} x2={WIDTH - MARGIN.right} y2={coordinates.y(value)} className="limit-grid-line" />
      ))}
      {horizontalAsymptotes.map((value) => (
        <line key={'horizontal-' + value} x1={MARGIN.left} y1={coordinates.y(value)} x2={WIDTH - MARGIN.right} y2={coordinates.y(value)} className="limit-asymptote-line horizontal" />
      ))}
      {verticalAsymptotes.map((value) => (
        <line key={'vertical-' + value} x1={coordinates.x(value)} y1={MARGIN.top} x2={coordinates.x(value)} y2={HEIGHT - MARGIN.bottom} className="limit-asymptote-line" />
      ))}
      {yMin <= 0 && yMax >= 0 && <line x1={MARGIN.left} y1={coordinates.y(0)} x2={WIDTH - MARGIN.right} y2={coordinates.y(0)} className="limit-axis" />}
      {xMin <= 0 && xMax >= 0 && <line x1={coordinates.x(0)} y1={MARGIN.top} x2={coordinates.x(0)} y2={HEIGHT - MARGIN.bottom} className="limit-axis" />}
      {xTicks.map((value) => value !== 0 && (
        <text key={'x-label-' + value} x={coordinates.x(value)} y={coordinates.y(0) + 18} textAnchor="middle">{value}</text>
      ))}
      {yTicks.map((value) => value !== 0 && (
        <text key={'y-label-' + value} x={coordinates.x(0) - 9} y={coordinates.y(value) + 4} textAnchor="end">{value}</text>
      ))}
      <text x={WIDTH - MARGIN.right + 4} y={coordinates.y(0) + 5} className="axis-name">x</text>
      <text x={coordinates.x(0) + 7} y={MARGIN.top - 5} className="axis-name">y</text>
      {children(coordinates, { yMin, yMax })}
    </svg>
  )
}

function PiecewiseLimitGraph() {
  return (
    <GraphFrame xMin={-2} xMax={7} yMin={0} yMax={5} label="Piecewise graph with a jump at x equals 2 and a removable hole at x equals 4">
      {(coordinates, bounds) => (
        <>
          <path
            d={samplePath((x) => 3.3 - 0.1775 * (x - 0.7) ** 2, -1.8, 2, coordinates, bounds.yMin, bounds.yMax)}
            className="limit-function-curve"
          />
          <path
            d={samplePath((x) => 1 + 1.5 * (x - 2), 2, 4, coordinates, bounds.yMin, bounds.yMax)}
            className="limit-function-curve alternate"
          />
          <path
            d={samplePath((x) => 4 + 0.2 * (x - 4) - 0.18 * (x - 4) ** 2, 4, 6.8, coordinates, bounds.yMin, bounds.yMax)}
            className="limit-function-curve alternate"
          />
          <line x1={coordinates.x(2)} y1={coordinates.y(0)} x2={coordinates.x(2)} y2={coordinates.y(3)} className="limit-guide" />
          <line x1={coordinates.x(4)} y1={coordinates.y(0)} x2={coordinates.x(4)} y2={coordinates.y(4)} className="limit-guide" />
          <circle cx={coordinates.x(2)} cy={coordinates.y(3)} r="7" className="limit-closed-point" />
          <circle cx={coordinates.x(2)} cy={coordinates.y(1)} r="8" className="limit-open-point" />
          <circle cx={coordinates.x(4)} cy={coordinates.y(4)} r="8" className="limit-open-point" />
          <text x={coordinates.x(2) + 10} y={coordinates.y(3) - 10} className="point-label">(2, 3)</text>
          <text x={coordinates.x(2) + 10} y={coordinates.y(1) + 24} className="point-label">(2, 1)</text>
          <text x={coordinates.x(4) + 10} y={coordinates.y(4) - 12} className="point-label">(4, 4)</text>
        </>
      )}
    </GraphFrame>
  )
}

function AsymptoteLimitGraph() {
  return (
    <GraphFrame
      xMin={-5}
      xMax={5}
      yMin={-5}
      yMax={5}
      verticalAsymptotes={[-3, -1, 2]}
      label="Graph with vertical asymptotes at negative 3, negative 1, and 2"
    >
      {(coordinates, bounds) => (
        <>
          <path d={samplePath((x) => 1 / ((x + 3) ** 2), -5, -3.03, coordinates, bounds.yMin, bounds.yMax)} className="limit-function-curve" />
          <path d={samplePath((x) => 1 / (x + 3) + 1 / (x + 1), -2.97, -1.03, coordinates, bounds.yMin, bounds.yMax)} className="limit-function-curve" />
          <path d={samplePath((x) => -1 / (x + 1) + 1 / (x - 2), -0.97, 1.97, coordinates, bounds.yMin, bounds.yMax)} className="limit-function-curve" />
          <path d={samplePath((x) => 1 / (x - 2) + x - 4, 2.03, 5, coordinates, bounds.yMin, bounds.yMax)} className="limit-function-curve" />
          {[-3, -1, 2].map((value) => <text key={value} x={coordinates.x(value) + 6} y="38" className="asymptote-label">x = {value}</text>)}
        </>
      )}
    </GraphFrame>
  )
}

function CubicRationalGraph() {
  return (
    <GraphFrame
      xMin={-2.5}
      xMax={3}
      yMin={-8}
      yMax={8}
      verticalAsymptotes={[1]}
      horizontalAsymptotes={[0]}
      label="Graph of 5 divided by x cubed minus 1 with vertical asymptote x equals 1"
    >
      {(coordinates, bounds) => (
        <>
          <path d={samplePath((x) => 5 / (x ** 3 - 1), -2.5, 0.98, coordinates, bounds.yMin, bounds.yMax, 220)} className="limit-function-curve" />
          <path d={samplePath((x) => 5 / (x ** 3 - 1), 1.02, 3, coordinates, bounds.yMin, bounds.yMax, 220)} className="limit-function-curve alternate" />
          <text x={coordinates.x(1) + 8} y="38" className="asymptote-label">x = 1</text>
        </>
      )}
    </GraphFrame>
  )
}

function EndBehaviorGraph() {
  return (
    <GraphFrame
      xMin={-4}
      xMax={7}
      yMin={-5}
      yMax={5}
      verticalAsymptotes={[1, 3]}
      horizontalAsymptotes={[-2, 2]}
      label="Three-branch graph with vertical asymptotes x equals 1 and 3 and horizontal asymptotes y equals 2 and negative 2"
    >
      {(coordinates, bounds) => (
        <>
          <path d={samplePath((x) => 2 + 1 / (1 - x), -4, 0.97, coordinates, bounds.yMin, bounds.yMax, 220)} className="limit-function-curve" />
          <path d={samplePath((x) => 1 / (x - 1) + 1 / (x - 3), 1.03, 2.97, coordinates, bounds.yMin, bounds.yMax, 220)} className="limit-function-curve alternate" />
          <path d={samplePath((x) => -2 - 1 / (x - 3), 3.03, 7, coordinates, bounds.yMin, bounds.yMax, 220)} className="limit-function-curve" />
          <text x={coordinates.x(1) + 7} y="38" className="asymptote-label">x = 1</text>
          <text x={coordinates.x(3) + 7} y="38" className="asymptote-label">x = 3</text>
          <text x={WIDTH - 78} y={coordinates.y(2) - 7} className="asymptote-label">y = 2</text>
          <text x={WIDTH - 84} y={coordinates.y(-2) - 7} className="asymptote-label">y = −2</text>
        </>
      )}
    </GraphFrame>
  )
}

function LimitTable({ rows, leftHeading = 'x < a', rightHeading = 'x > a' }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="limit-table-lab">
      <div className="limit-table-heading">
        <div>
          <span className="card-label">Numerical lab</span>
          <p>Approach the target from both directions.</p>
        </div>
        <button type="button" onClick={() => setRevealed((current) => !current)}>
          {revealed ? 'Hide values' : 'Evaluate table'}
        </button>
      </div>
      <div className="limit-table-scroll">
        <table>
          <thead>
            <tr><th colSpan="2">{leftHeading}</th><th colSpan="2">{rightHeading}</th></tr>
            <tr><th>x</th><th>f(x)</th><th>x</th><th>f(x)</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0] + '-' + row[2]}>
                <td>{row[0]}</td><td className={revealed ? 'revealed' : ''}>{revealed ? row[1] : '—'}</td>
                <td>{row[2]}</td><td className={revealed ? 'revealed' : ''}>{revealed ? row[3] : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CubicRationalExplorer({ rows }) {
  const [view, setView] = useState('graph')

  return (
    <div className="limit-explorer">
      <div className="limit-view-tabs" role="group" aria-label="Choose graph or table view">
        <button className={view === 'graph' ? 'active' : ''} type="button" onClick={() => setView('graph')}>Graph</button>
        <button className={view === 'table' ? 'active' : ''} type="button" onClick={() => setView('table')}>Table</button>
      </div>
      {view === 'graph'
        ? <CubicRationalGraph />
        : <LimitTable rows={rows} leftHeading="x < 1" rightHeading="x > 1" />}
    </div>
  )
}

export function LimitQuestionVisual({ visual }) {
  if (!visual) return null

  let content = null
  if (visual.type === 'limit-piecewise') content = <PiecewiseLimitGraph />
  if (visual.type === 'limit-asymptote-graph') content = <AsymptoteLimitGraph />
  if (visual.type === 'cubic-rational-limit') content = <CubicRationalExplorer rows={visual.rows} />
  if (visual.type === 'limit-table') content = <LimitTable {...visual} />
  if (visual.type === 'limit-end-behavior') content = <EndBehaviorGraph />

  return content ? <div className="limit-question-visual">{content}</div> : null
}
