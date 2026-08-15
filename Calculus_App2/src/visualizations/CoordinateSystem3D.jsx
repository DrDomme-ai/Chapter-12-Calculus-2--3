import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'

const cameraViews = {
  perspective: { eye: { x: 1.55, y: 1.55, z: 1.25 }, up: { x: 0, y: 0, z: 1 } },
  xy: { eye: { x: 0, y: 0, z: 2.5 }, up: { x: 0, y: 1, z: 0 } },
  front: { eye: { x: 0, y: 2.5, z: 0 }, up: { x: 0, y: 0, z: 1 } },
}

function axisLine(axis, color, label) {
  const coordinates = {
    x: { x: [-5, 5], y: [0, 0], z: [0, 0] },
    y: { x: [0, 0], y: [-5, 5], z: [0, 0] },
    z: { x: [0, 0], y: [0, 0], z: [-5, 5] },
  }[axis]

  return {
    type: 'scatter3d', mode: 'lines+text', ...coordinates,
    line: { color, width: 8 },
    text: ['', label], textfont: { color, size: 18 }, textposition: 'top center',
    hoverinfo: 'skip', showlegend: false,
  }
}

function axisArrow(axis, color) {
  const position = { x: { x: [4.85], y: [0], z: [0], u: [1], v: [0], w: [0] }, y: { x: [0], y: [4.85], z: [0], u: [0], v: [1], w: [0] }, z: { x: [0], y: [0], z: [4.85], u: [0], v: [0], w: [1] } }[axis]
  return { type: 'cone', ...position, anchor: 'tail', sizemode: 'absolute', sizeref: .5, colorscale: [[0, color], [1, color]], showscale: false, hoverinfo: 'skip', showlegend: false }
}

function CoordinateSystem3D() {
  const [view, setView] = useState('perspective')
  const [revision, setRevision] = useState(0)
  const [showOrientation, setShowOrientation] = useState(false)
  const [showProbe, setShowProbe] = useState(true)
  const [point, setPoint] = useState({ x: 3, y: 2, z: 3 })

  const traces = useMemo(() => [
    axisLine('x', '#c1493f', 'x'), axisArrow('x', '#c1493f'),
    axisLine('y', '#0d766e', 'y'), axisArrow('y', '#0d766e'),
    axisLine('z', '#d99a3b', 'z'), axisArrow('z', '#d99a3b'),
    { type: 'scatter3d', mode: 'markers+text', x: [0], y: [0], z: [0], marker: { size: 6, color: '#172731' }, text: ['O'], textposition: 'bottom left', textfont: { size: 16, color: '#172731' }, hovertemplate: 'Origin (0, 0, 0)<extra></extra>', showlegend: false },
    ...(showProbe ? [
      { type: 'scatter3d', mode: 'lines', x: [0, point.x], y: [0, 0], z: [0, 0], line: { color: '#c1493f', width: 7 }, hoverinfo: 'skip', showlegend: false },
      { type: 'scatter3d', mode: 'lines', x: [point.x, point.x], y: [0, point.y], z: [0, 0], line: { color: '#0d766e', width: 7 }, hoverinfo: 'skip', showlegend: false },
      { type: 'scatter3d', mode: 'lines', x: [point.x, point.x], y: [point.y, point.y], z: [0, point.z], line: { color: '#d99a3b', width: 7 }, hoverinfo: 'skip', showlegend: false },
      { type: 'scatter3d', mode: 'lines', x: [point.x, point.x], y: [point.y, point.y], z: [0, point.z], line: { color: '#8a9699', width: 3, dash: 'dash' }, hoverinfo: 'skip', showlegend: false },
      { type: 'scatter3d', mode: 'markers+text', x: [point.x], y: [point.y], z: [point.z], marker: { size: 8, color: '#243b53', line: { color: 'white', width: 3 } }, text: [`P = (${point.x}, ${point.y}, ${point.z})`], textposition: 'top center', textfont: { size: 15, color: '#172731' }, hovertemplate: `<b>Point P</b><br>x = ${point.x}<br>y = ${point.y}<br>z = ${point.z}<extra></extra>`, showlegend: false },
      { type: 'scatter3d', mode: 'markers', x: [point.x], y: [point.y], z: [0], marker: { size: 5, color: '#d99a3b', symbol: 'circle-open' }, hovertemplate: `Floor projection<br>(${point.x}, ${point.y}, 0)<extra></extra>`, showlegend: false },
    ] : []),
  ], [point, showProbe])

  const selectView = (nextView) => {
    setView(nextView)
    setRevision((current) => current + 1)
  }

  const updatePoint = (axis, value) => setPoint((current) => ({ ...current, [axis]: Number(value) }))

  return (
    <section className="coordinate-system-lab" aria-labelledby="coordinate-system-title">
      <div className="lab-toolbar">
        <div className="view-buttons" role="group" aria-label="3D viewpoint">
          <button type="button" className={view === 'perspective' ? 'active' : ''} onClick={() => selectView('perspective')}>Perspective</button>
          <button type="button" className={view === 'xy' ? 'active' : ''} onClick={() => selectView('xy')}>Top view</button>
          <button type="button" className={view === 'front' ? 'active' : ''} onClick={() => selectView('front')}>Front view</button>
        </div>
        <button className="reset-view" type="button" onClick={() => selectView('perspective')}>↺ Reset View</button>
      </div>

      <div className="plot-wrap">
        <Plot
          data={traces}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, t: 8, b: 0 },
            paper_bgcolor: '#fffdf8',
            scene: {
              aspectmode: 'cube',
              bgcolor: '#fffdf8',
              camera: cameraViews[view],
              dragmode: 'orbit',
              xaxis: { title: 'x-axis', range: [-5.5, 5.5], gridcolor: '#dce2df', zeroline: false, showbackground: true, backgroundcolor: '#f7f4ec' },
              yaxis: { title: 'y-axis', range: [-5.5, 5.5], gridcolor: '#dce2df', zeroline: false, showbackground: true, backgroundcolor: '#eef5f3' },
              zaxis: { title: 'z-axis', range: [-5.5, 5.5], gridcolor: '#dce2df', zeroline: false, showbackground: true, backgroundcolor: '#f6f3ea' },
            },
            uirevision: revision,
          }}
          config={{ responsive: true, displaylogo: false, scrollZoom: true, modeBarButtonsToRemove: ['toImage'] }}
          revision={revision}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
        <div className="interaction-tip"><span aria-hidden="true">↻</span> Drag to rotate · Scroll to zoom · Shift + drag to pan</div>
      </div>

      <div className="coordinate-probe">
        <div className="probe-heading">
          <div><span className="card-label">Coordinate probe</span><h3>Locate a point in space</h3><p>Follow the colored path: move in <em>x</em>, then parallel to <em>y</em>, then parallel to <em>z</em>.</p></div>
          <label className="switch-control"><input type="checkbox" checked={showProbe} onChange={(event) => setShowProbe(event.target.checked)} /><span /> Show point</label>
        </div>
        {showProbe && (
          <div className="probe-content">
            <div className="probe-sliders">
              {['x', 'y', 'z'].map((axis) => (
                <label key={axis} className={`probe-${axis}`}>
                  <span>{axis}</span><output>{point[axis]}</output>
                  <input type="range" min="-4" max="4" step="1" value={point[axis]} onChange={(event) => updatePoint(axis, event.target.value)} />
                </label>
              ))}
            </div>
            <div className="ordered-triple" aria-live="polite"><span>Ordered triple</span><strong>P = ({point.x}, {point.y}, {point.z})</strong></div>
          </div>
        )}
        <div className="axis-key" aria-label="Axis color key">
          <span><i className="key-x" /> Red: <em>x</em>, left/right</span>
          <span><i className="key-y" /> Teal: <em>y</em>, forward/back</span>
          <span><i className="key-z" /> Gold: <em>z</em>, down/up</span>
        </div>
      </div>

      <div className="orientation-row">
        <div>
          <span className="card-label">Definition</span>
          <h3 id="coordinate-system-title">Three mutually perpendicular axes</h3>
          <p>Each pair of axes meets at a right angle. Together, they intersect at the origin <span className="math-inline">O = (0, 0, 0)</span>. Every axis extends infinitely in both its positive and negative direction.</p>
        </div>
        <button className="why-button" type="button" aria-expanded={showOrientation} onClick={() => setShowOrientation((shown) => !shown)}>
          {showOrientation ? 'Hide orientation' : 'Show right-hand orientation'}
        </button>
      </div>

      {showOrientation && (
        <div className="right-hand-panel">
          <div className="hand-symbol" aria-hidden="true"><span>x</span><span>y</span><span>z</span></div>
          <div><h4>Right-hand orientation</h4><p>Point your right index finger along positive <em>x</em> and your middle finger along positive <em>y</em>. Your thumb points along positive <em>z</em>. Rotating the model does not change this relationship.</p></div>
        </div>
      )}
    </section>
  )
}

export default CoordinateSystem3D
