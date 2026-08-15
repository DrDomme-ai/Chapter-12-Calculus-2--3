const GRAPH_WIDTH = 300
const GRAPH_HEIGHT = 170
const GRAPH_LEFT = 24
const GRAPH_RIGHT = 286
const GRAPH_TOP = 14
const GRAPH_BOTTOM = 148
const X_MIN = -Math.PI
const X_MAX = Math.PI
const Y_MIN = -3.4
const Y_MAX = 3.4

const graphX = (value) => GRAPH_LEFT + ((value - X_MIN) / (X_MAX - X_MIN)) * (GRAPH_RIGHT - GRAPH_LEFT)
const graphY = (value) => GRAPH_BOTTOM - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (GRAPH_BOTTOM - GRAPH_TOP)

const graphFunction = {
  sine: (x) => Math.sin(x),
  tangent: (x) => Math.tan(x),
  'negative-tangent': (x) => -Math.tan(x),
  secant: (x) => 1 / Math.cos(x),
  'negative-double-sine': (x) => -3 * Math.sin(2 * x),
}

function buildGraphPaths(variant) {
  const fn = graphFunction[variant] || graphFunction.sine
  const paths = []
  let points = []

  for (let index = 0; index <= 360; index += 1) {
    const x = X_MIN + (index / 360) * (X_MAX - X_MIN)
    const y = fn(x)
    const discontinuity = !Number.isFinite(y) || Math.abs(y) > Y_MAX

    if (discontinuity) {
      if (points.length > 1) paths.push(points)
      points = []
    } else {
      const previous = points[points.length - 1]
      if (previous && Math.abs(previous.y - y) > 1.2) {
        if (points.length > 1) paths.push(points)
        points = []
      }
      points.push({ x, y })
    }
  }

  if (points.length > 1) paths.push(points)
  return paths.map((segment) =>
    segment.map((point, index) => (index === 0 ? 'M' : 'L') + graphX(point.x).toFixed(2) + ' ' + graphY(point.y).toFixed(2)).join(' '),
  )
}

export function TrigGraphThumbnail({ variant, label }) {
  const hasAsymptotes = ['tangent', 'negative-tangent', 'secant'].includes(variant)
  const paths = buildGraphPaths(variant)

  return (
    <svg className="trig-graph-svg" viewBox={'0 0 ' + GRAPH_WIDTH + ' ' + GRAPH_HEIGHT} role="img" aria-label={label}>
      <rect x="0" y="0" width={GRAPH_WIDTH} height={GRAPH_HEIGHT} rx="8" className="trig-graph-background" />
      {[-2, -1, 1, 2].map((value) => (
        <line key={'y-' + value} x1={GRAPH_LEFT} y1={graphY(value)} x2={GRAPH_RIGHT} y2={graphY(value)} className="trig-grid-line" />
      ))}
      {[-Math.PI / 2, Math.PI / 2].map((value) => (
        <line key={'x-' + value} x1={graphX(value)} y1={GRAPH_TOP} x2={graphX(value)} y2={GRAPH_BOTTOM} className="trig-grid-line" />
      ))}
      <line x1={GRAPH_LEFT} y1={graphY(0)} x2={GRAPH_RIGHT} y2={graphY(0)} className="trig-axis" />
      <line x1={graphX(0)} y1={GRAPH_TOP} x2={graphX(0)} y2={GRAPH_BOTTOM} className="trig-axis" />
      {hasAsymptotes && [-Math.PI / 2, Math.PI / 2].map((value) => (
        <line key={'asymptote-' + value} x1={graphX(value)} y1={GRAPH_TOP} x2={graphX(value)} y2={GRAPH_BOTTOM} className="trig-asymptote" />
      ))}
      {paths.map((path, index) => <path key={variant + '-' + index} d={path} className="trig-function-path" />)}
      <text x={GRAPH_LEFT} y="164">−π</text>
      <text x={graphX(0) - 3} y="164">0</text>
      <text x={GRAPH_RIGHT - 7} y="164">π</text>
    </svg>
  )
}

function UnitCircleDiagram({ angle, angleLabel }) {
  const center = 160
  const radius = 108
  const pointX = center + radius * Math.cos(angle)
  const pointY = center - radius * Math.sin(angle)
  const arcRadius = 38
  const arcX = center + arcRadius * Math.cos(angle)
  const arcY = center - arcRadius * Math.sin(angle)
  const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const largeArc = normalizedAngle > Math.PI ? 1 : 0

  return (
    <svg className="unit-circle-diagram" viewBox="0 0 320 320" role="img" aria-label={'Unit circle with a ray at ' + angleLabel}>
      <circle cx={center} cy={center} r={radius} className="unit-circle-ring" />
      <line x1="35" y1={center} x2="285" y2={center} className="unit-circle-axis" />
      <line x1={center} y1="35" x2={center} y2="285" className="unit-circle-axis" />
      <text x="288" y={center + 5}>x</text>
      <text x={center + 7} y="30">y</text>
      <text x="267" y={center + 18}>1</text>
      <text x="39" y={center + 18}>−1</text>
      <text x={center + 8} y="55">1</text>
      <text x={center + 8} y="278">−1</text>
      <path d={'M ' + (center + arcRadius) + ' ' + center + ' A ' + arcRadius + ' ' + arcRadius + ' 0 ' + largeArc + ' 0 ' + arcX + ' ' + arcY} className="unit-circle-arc" />
      <line x1={center} y1={center} x2={pointX} y2={pointY} className="unit-circle-ray" />
      <line x1={pointX} y1={pointY} x2={pointX} y2={center} className="unit-circle-projection" />
      <line x1={pointX} y1={pointY} x2={center} y2={pointY} className="unit-circle-projection" />
      <circle cx={pointX} cy={pointY} r="7" className="unit-circle-point" />
      <text x="176" y="145" className="unit-circle-angle-label">θ</text>
      <text x="12" y="307" className="unit-circle-caption">Point = (cos θ, sin θ)</text>
    </svg>
  )
}

function ReferenceTriangleDiagram({ inverse = false }) {
  if (inverse) {
    return (
      <svg className="reference-triangle-diagram" viewBox="0 0 360 230" role="img" aria-label="Quadrant four reference triangle with adjacent side 4 and opposite side negative 3">
        <line x1="35" y1="72" x2="330" y2="72" className="triangle-axis" />
        <line x1="175" y1="25" x2="175" y2="210" className="triangle-axis" />
        <path d="M 175 72 L 295 72 L 295 162 Z" className="triangle-fill" />
        <line x1="175" y1="72" x2="295" y2="162" className="triangle-hypotenuse" />
        <text x="229" y="61">4</text>
        <text x="304" y="122">−3</text>
        <text x="226" y="130">5</text>
        <text x="185" y="94">θ</text>
        <text x="232" y="212" className="triangle-caption">Quadrant IV</text>
      </svg>
    )
  }

  return (
    <svg className="reference-triangle-diagram" viewBox="0 0 360 230" role="img" aria-label="Quadrant three reference triangle with horizontal coordinate negative 4 and radius 5">
      <line x1="30" y1="88" x2="330" y2="88" className="triangle-axis" />
      <line x1="205" y1="24" x2="205" y2="212" className="triangle-axis" />
      <path d="M 205 88 L 85 88 L 85 178 Z" className="triangle-fill" />
      <line x1="205" y1="88" x2="85" y2="178" className="triangle-hypotenuse" />
      <text x="138" y="76">x = −4</text>
      <text x="57" y="138">y = ?</text>
      <text x="137" y="142">r = 5</text>
      <text x="178" y="110">θ</text>
      <text x="52" y="212" className="triangle-caption">Quadrant III</text>
    </svg>
  )
}

export function TrigQuestionVisual({ visual }) {
  if (!visual) return null

  if (visual.type === 'unit-circle') {
    return <div className="trig-question-visual"><UnitCircleDiagram angle={visual.angle} angleLabel={visual.angleLabel} /></div>
  }

  if (visual.type === 'reference-triangle') {
    return <div className="trig-question-visual"><ReferenceTriangleDiagram /></div>
  }

  if (visual.type === 'inverse-triangle') {
    return <div className="trig-question-visual"><ReferenceTriangleDiagram inverse /></div>
  }

  if (visual.type === 'function-graph') {
    return <div className="trig-question-visual graph-preview"><TrigGraphThumbnail variant={visual.variant} label={visual.label} /><span>{visual.label}</span></div>
  }

  return null
}
