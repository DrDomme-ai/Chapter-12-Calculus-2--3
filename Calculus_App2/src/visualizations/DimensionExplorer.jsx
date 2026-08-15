import { useState } from 'react'

const dimensionCopy = {
  1: { space: 'ℝ', numbers: 'One number', directions: 'One direction', freedom: 'One degree of freedom' },
  2: { space: 'ℝ²', numbers: 'Two numbers', directions: 'Two independent directions', freedom: 'Two degrees of freedom' },
  3: { space: 'ℝ³', numbers: 'Three numbers', directions: 'Three independent directions', freedom: 'Three degrees of freedom' },
}

function Axis({ x1, y1, x2, y2, label, className = '' }) {
  return (
    <g className={`coordinate-axis ${className}`}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <text x={x2} y={y2 - 10}>{label}</text>
    </g>
  )
}

function DimensionExplorer() {
  const [dimension, setDimension] = useState(1)
  const [coordinates, setCoordinates] = useState({ x: 2, y: 1, z: 1 })
  const copy = dimensionCopy[dimension]

  const updateCoordinate = (axis, value) => {
    setCoordinates((current) => ({ ...current, [axis]: Number(value) }))
  }

  const pointX = dimension === 3
    ? 300 + coordinates.x * 32 - coordinates.y * 32
    : 300 + coordinates.x * 37
  const pointY = dimension === 3
    ? 235 + coordinates.x * 15 + coordinates.y * 15 - coordinates.z * 32
    : 190 - (dimension >= 2 ? coordinates.y * 37 : 0)
  const floorX = 300 + coordinates.x * 32 - coordinates.y * 32
  const floorY = 235 + coordinates.x * 15 + coordinates.y * 15

  return (
    <section className="dimension-explorer" aria-labelledby="dimension-title">
      <div className="dimension-tabs" role="group" aria-label="Choose coordinate system">
        {[1, 2, 3].map((value) => (
          <button key={value} type="button" className={dimension === value ? 'active' : ''} onClick={() => setDimension(value)} aria-pressed={dimension === value}>
            {value}D
          </button>
        ))}
      </div>

      <div className="dimension-stage">
        <div className="dimension-visual">
          <svg viewBox="0 0 600 380" role="img" aria-label={`${dimension}-dimensional coordinate system with a movable point`}>
            {dimension === 3 && (
              <g className="space-grid" aria-hidden="true">
                <polygon points="300,85 540,200 300,315 60,200" />
                {[-3, -2, -1, 1, 2, 3].map((step) => (
                  <g key={step}>
                    <line x1={300 + step * 45} y1={85 + step * 21.5} x2={60 + step * 45} y2={200 + step * 21.5} />
                    <line x1={300 - step * 45} y1={85 + step * 21.5} x2={540 - step * 45} y2={200 + step * 21.5} />
                  </g>
                ))}
              </g>
            )}
            {dimension === 2 && <Axis x1="300" y1="340" x2="300" y2="35" label="y" className="axis-y" />}
            {dimension === 3 ? (
              <>
                <Axis x1="75" y1="130" x2="525" y2="340" label="x" />
                <Axis x1="525" y1="130" x2="75" y2="340" label="y" className="axis-y" />
                <Axis x1="300" y1="350" x2="300" y2="25" label="z" className="axis-z" />
              </>
            ) : <Axis x1="45" y1="190" x2="555" y2="190" label="x" />}
            <circle className="origin" cx="300" cy={dimension === 3 ? 235 : 190} r="5" />
            <text className="origin-label" x="278" y={dimension === 3 ? 258 : 215}>O</text>
            {dimension === 2 && <line className="guide-line" x1={pointX} y1={pointY} x2={pointX} y2="190" />}
            {dimension === 3 && (
              <g className="projection-guides">
                <line className="guide-line vertical" x1={floorX} y1={floorY} x2={pointX} y2={pointY} />
                <circle className="floor-point" cx={floorX} cy={floorY} r="6" />
                <line className="guide-line depth" x1="300" y1="235" x2={floorX} y2={floorY} />
              </g>
            )}
            <circle className="moving-point" cx={pointX} cy={pointY} r="10" />
            <text className="point-label" x={pointX + 15} y={pointY - 13}>
              {dimension === 1 ? `(${coordinates.x})` : dimension === 2 ? `(${coordinates.x}, ${coordinates.y})` : `(${coordinates.x}, ${coordinates.y}, ${coordinates.z})`}
            </text>
          </svg>
          <p className="visual-caption">
            {dimension === 1 && 'The point can only move left or right.'}
            {dimension === 2 && 'A second coordinate unlocks movement perpendicular to the number line.'}
            {dimension === 3 && 'A third coordinate lifts the point out of the xy-plane.'}
          </p>
        </div>

        <div className="dimension-panel">
          <p className="math-space" id="dimension-title">{copy.space}</p>
          <ul>
            <li>{copy.numbers}</li>
            <li>{copy.directions}</li>
            <li>{copy.freedom}</li>
          </ul>
          <div className="coordinate-controls">
            <label>x <output>{coordinates.x}</output><input type="range" min="-5" max="5" step="1" value={coordinates.x} onChange={(event) => updateCoordinate('x', event.target.value)} /></label>
            {dimension >= 2 && <label>y <output>{coordinates.y}</output><input type="range" min="-4" max="4" step="1" value={coordinates.y} onChange={(event) => updateCoordinate('y', event.target.value)} /></label>}
            {dimension === 3 && <label>z <output>{coordinates.z}</output><input type="range" min="-4" max="4" step="1" value={coordinates.z} onChange={(event) => updateCoordinate('z', event.target.value)} /></label>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DimensionExplorer
