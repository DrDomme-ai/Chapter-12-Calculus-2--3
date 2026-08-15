import { useState } from 'react'
import { MathDisplay, MathInline } from '../MathDisplay'

const powerExamples = [
  { id: 'negative-two', label: '-2', source: 'x^{-2}', derivative: '-2x^{-3}', coefficient: '-2', exponent: '-3' },
  { id: 'negative-one', label: '-1', source: 'x^{-1}', derivative: '-x^{-2}', coefficient: '-1', exponent: '-2' },
  { id: 'negative-half', label: '-1/2', source: 'x^{-1/2}', derivative: '-\\frac12x^{-3/2}', coefficient: '-\\frac12', exponent: '-\\frac32' },
  { id: 'one-third', label: '1/3', source: 'x^{1/3}', derivative: '\\frac13x^{-2/3}', coefficient: '\\frac13', exponent: '-\\frac23' },
  { id: 'one-half', label: '1/2', source: 'x^{1/2}', derivative: '\\frac12x^{-1/2}', coefficient: '\\frac12', exponent: '-\\frac12' },
  { id: 'one', label: '1', source: 'x', derivative: '1', coefficient: '1', exponent: '0' },
  { id: 'two', label: '2', source: 'x^2', derivative: '2x', coefficient: '2', exponent: '1' },
  { id: 'three', label: '3', source: 'x^3', derivative: '3x^2', coefficient: '3', exponent: '2' },
  { id: 'four', label: '4', source: 'x^4', derivative: '4x^3', coefficient: '4', exponent: '3' },
]

function PowerRuleLab() {
  const [selectedId, setSelectedId] = useState('three')
  const example = powerExamples.find((item) => item.id === selectedId) || powerExamples[7]

  return (
    <section className="derivative-lab" aria-labelledby="power-rule-lab-heading">
      <div className="derivative-visual-heading">
        <div>
          <span className="card-label">Rule laboratory</span>
          <h3 id="power-rule-lab-heading">Watch the exponent change jobs</h3>
        </div>
        <label className="derivative-select-label">
          <span>Choose an exponent</span>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {powerExamples.map((item) => <option value={item.id} key={item.id}>n = {item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="power-rule-flow" aria-live="polite">
        <div className="derivative-concept-card">
          <small>Start</small>
          <MathDisplay>{example.source}</MathDisplay>
          <span>The exponent is <MathInline>{example.label}</MathInline>.</span>
        </div>
        <div className="power-rule-action" aria-hidden="true">
          <b>1</b><span>bring it forward</span>
          <b>2</b><span>subtract one</span>
        </div>
        <div className="derivative-concept-card result-card">
          <small>Derivative pattern</small>
          <MathDisplay>{example.derivative}</MathDisplay>
          <span>Coefficient <MathInline>{example.coefficient}</MathInline>; new exponent <MathInline>{example.exponent}</MathInline>.</span>
        </div>
      </div>
      <p className="derivative-visual-note"><MathInline>{'\\frac{d}{dx}x^n=nx^{n-1}'}</MathInline> works for integer and fractional powers wherever the function is differentiable.</p>
    </section>
  )
}

const variableTerms = {
  x: [
    [{ math: 't', role: 'Held constant' }, { math: 'x^2', role: 'Varies with x', active: true }],
    [{ math: 't^5', role: 'Held constant' }, { math: 'x', role: 'Varies with x', active: true }],
  ],
  t: [
    [{ math: 't', role: 'Varies with t', active: true }, { math: 'x^2', role: 'Held constant' }],
    [{ math: 't^5', role: 'Varies with t', active: true }, { math: 'x', role: 'Held constant' }],
  ],
}

function VariableToggle({ expression }) {
  const [variable, setVariable] = useState('x')
  const constant = variable === 'x' ? 't' : 'x'

  return (
    <section className="derivative-lab" aria-labelledby="variable-toggle-heading">
      <div className="derivative-visual-heading">
        <div>
          <span className="card-label">Variable lens</span>
          <h3 id="variable-toggle-heading">Which symbol is allowed to change?</h3>
        </div>
        <div className="derivative-toggle-group" role="group" aria-label="Choose the differentiation variable">
          {['x', 't'].map((symbol) => (
            <button
              className={variable === symbol ? 'active' : ''}
              type="button"
              aria-pressed={variable === symbol}
              onClick={() => setVariable(symbol)}
              key={symbol}
            >
              With respect to <MathInline>{symbol}</MathInline>
            </button>
          ))}
        </div>
      </div>

      <MathDisplay>{expression || 'y=tx^2+t^5x'}</MathDisplay>
      <div className="variable-term-grid">
        {variableTerms[variable].map((term, termIndex) => (
          <div className="variable-term" key={variable + '-' + termIndex}>
            <small>Term {termIndex + 1}</small>
            <div>
              {term.map((factor) => (
                <span className={'variable-factor ' + (factor.active ? 'varies' : 'constant')} key={factor.math}>
                  <MathInline>{factor.math}</MathInline>
                  <em>{factor.role}</em>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="derivative-status" aria-live="polite">
        Differentiating with respect to <MathInline>{variable}</MathInline>: powers of <MathInline>{constant}</MathInline> are coefficients held constant.
      </p>
    </section>
  )
}

const FAMILY_GRAPH = {
  width: 720,
  height: 350,
  left: 54,
  right: 28,
  top: 54,
  bottom: 42,
  xMin: 0,
  xMax: 16,
  yMin: -3.2,
  yMax: 3.6,
}

const familyFunctions = {
  f: (x) => 3 * x - 4 * x ** (7 / 8),
  first: (x) => 3 - (7 / 2) * x ** (-1 / 8),
  second: (x) => (7 / 16) * x ** (-9 / 8),
}

const familySeries = [
  { id: 'f', label: 'f', description: 'function', className: 'family-f' },
  { id: 'first', label: "f'", description: 'slope', className: 'family-first' },
  { id: 'second', label: "f''", description: 'concavity', className: 'family-second' },
]

const familyX = (value) => FAMILY_GRAPH.left + ((value - FAMILY_GRAPH.xMin) / (FAMILY_GRAPH.xMax - FAMILY_GRAPH.xMin)) * (FAMILY_GRAPH.width - FAMILY_GRAPH.left - FAMILY_GRAPH.right)
const familyY = (value) => FAMILY_GRAPH.height - FAMILY_GRAPH.bottom - ((value - FAMILY_GRAPH.yMin) / (FAMILY_GRAPH.yMax - FAMILY_GRAPH.yMin)) * (FAMILY_GRAPH.height - FAMILY_GRAPH.top - FAMILY_GRAPH.bottom)

function familyPath(fn) {
  const points = []
  const start = 0.25
  const end = FAMILY_GRAPH.xMax

  for (let index = 0; index <= 280; index += 1) {
    const x = start + (index / 280) * (end - start)
    const y = fn(x)
    if (Number.isFinite(y) && y >= FAMILY_GRAPH.yMin && y <= FAMILY_GRAPH.yMax) {
      points.push((points.length ? 'L' : 'M') + familyX(x).toFixed(2) + ' ' + familyY(y).toFixed(2))
    }
  }
  return points.join(' ')
}

function DerivativeFamily() {
  const [position, setPosition] = useState(3.5)
  const [visible, setVisible] = useState({ f: true, first: true, second: true })
  const firstValue = familyFunctions.first(position)
  const secondValue = familyFunctions.second(position)
  const slopeWord = Math.abs(firstValue) < 0.025 ? 'nearly level' : firstValue > 0 ? 'increasing' : 'decreasing'
  const concavityWord = secondValue > 0 ? 'concave up' : secondValue < 0 ? 'concave down' : 'nearly linear'

  const toggleSeries = (id) => setVisible((current) => ({ ...current, [id]: !current[id] }))

  return (
    <section className="derivative-lab family-lab" aria-labelledby="derivative-family-heading">
      <div className="derivative-visual-heading">
        <div>
          <span className="card-label">Derivative family</span>
          <h3 id="derivative-family-heading">Connect shape, slope, and concavity</h3>
        </div>
        <div className="family-series-toggles" role="group" aria-label="Choose curves to display">
          {familySeries.map((series) => (
            <button
              className={'family-toggle ' + series.className + (visible[series.id] ? ' active' : '')}
              type="button"
              aria-pressed={visible[series.id]}
              onClick={() => toggleSeries(series.id)}
              key={series.id}
            >
              <span aria-hidden="true" />{series.label}: {series.description}
            </button>
          ))}
        </div>
      </div>

      <svg className="derivative-family-graph" viewBox={'0 0 ' + FAMILY_GRAPH.width + ' ' + FAMILY_GRAPH.height} role="img" aria-label="Graphs of f, f prime, and f double prime for positive x, with a movable vertical guide">
        <rect width={FAMILY_GRAPH.width} height={FAMILY_GRAPH.height} rx="12" className="derivative-graph-background" />
        {[0, 4, 8, 12, 16].map((value) => (
          <g key={'family-x-' + value}>
            <line x1={familyX(value)} y1={FAMILY_GRAPH.top} x2={familyX(value)} y2={FAMILY_GRAPH.height - FAMILY_GRAPH.bottom} className="derivative-grid-line" />
            <text x={familyX(value)} y={FAMILY_GRAPH.height - 18} textAnchor="middle">{value}</text>
          </g>
        ))}
        {[-2, 0, 2].map((value) => (
          <g key={'family-y-' + value}>
            <line x1={FAMILY_GRAPH.left} y1={familyY(value)} x2={FAMILY_GRAPH.width - FAMILY_GRAPH.right} y2={familyY(value)} className={value === 0 ? 'derivative-axis' : 'derivative-grid-line'} />
            <text x={FAMILY_GRAPH.left - 10} y={familyY(value) + 4} textAnchor="end">{value}</text>
          </g>
        ))}
        <line x1={familyX(0)} y1={FAMILY_GRAPH.top} x2={familyX(0)} y2={FAMILY_GRAPH.height - FAMILY_GRAPH.bottom} className="derivative-axis" />
        {familySeries.map((series) => visible[series.id] && (
          <path d={familyPath(familyFunctions[series.id])} className={'derivative-family-curve ' + series.className} key={series.id} />
        ))}
        <line x1={familyX(position)} y1={FAMILY_GRAPH.top} x2={familyX(position)} y2={FAMILY_GRAPH.height - FAMILY_GRAPH.bottom} className="derivative-position-guide" />
        {familySeries.map((series) => visible[series.id] && (
          <circle cx={familyX(position)} cy={familyY(familyFunctions[series.id](position))} r="6" className={'family-marker ' + series.className} key={'marker-' + series.id} />
        ))}
        <text x={FAMILY_GRAPH.width - 18} y={familyY(0) - 8} textAnchor="end" className="axis-name">x</text>
        <text x={familyX(position) + 7} y={FAMILY_GRAPH.top + 15} className="guide-label">selected x</text>
      </svg>

      <label className="derivative-range-label" htmlFor="derivative-family-position">
        <span>Move the shared x-position</span>
        <input
          id="derivative-family-position"
          type="range"
          min="0.25"
          max="15"
          step="0.25"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
        />
        <output htmlFor="derivative-family-position">x = {position.toFixed(2)}</output>
      </label>
      <p className="derivative-status" aria-live="polite">
        At x = {position.toFixed(2)}, the sign of <MathInline>{String.raw`f\prime(x)`}</MathInline> says f is {slopeWord}; the sign of <MathInline>{String.raw`f\prime\prime(x)`}</MathInline> says the graph is {concavityWord}.
      </p>
    </section>
  )
}

const ruleContent = {
  product: [
    {
      title: 'Name both changing factors',
      description: 'Call the first factor u and the second factor v.',
      cards: [{ label: 'Factor one', math: 'u(x)' }, { label: 'Factor two', math: 'v(x)' }],
    },
    {
      title: 'Differentiate one factor at a time',
      description: 'Each term keeps one original factor and differentiates the other.',
      cards: [{ label: 'First contribution', math: String.raw`u\,v\prime` }, { label: 'Second contribution', math: String.raw`v\,u\prime` }],
    },
    {
      title: 'Assemble the two contributions',
      description: 'Addition is essential: changing either factor changes the product.',
      formula: String.raw`\frac{d}{dx}[uv]=u\,v\prime+v\,u\prime`,
    },
  ],
  quotient: [
    {
      title: 'Separate top and bottom',
      description: 'Name the numerator N and denominator D before differentiating.',
      cards: [{ label: 'Numerator', math: 'N(x)' }, { label: 'Denominator', math: 'D(x)' }],
    },
    {
      title: 'Preserve the subtraction order',
      description: 'Bottom times derivative of top, minus top times derivative of bottom.',
      cards: [{ label: 'First product', math: String.raw`D\,N\prime` }, { label: 'Subtract', math: String.raw`N\,D\prime` }],
    },
    {
      title: 'Square the original denominator',
      description: 'The order in the numerator matters; reversing it changes the sign.',
      formula: String.raw`\frac{d}{dx}\left[\frac ND\right]=\frac{D\,N\prime-N\,D\prime}{D^2}`,
    },
  ],
  'product-chain': [
    {
      title: 'See the outer product first',
      description: 'Treat each entire powered expression as one factor.',
      cards: [{ label: 'Composite factor', math: 'u(x)' }, { label: 'Composite factor', math: 'v(x)' }],
    },
    {
      title: 'Apply the Product Rule outside',
      description: 'The prime on each factor signals more work inside that factor.',
      formula: String.raw`(uv)\prime=u\prime v+uv\prime`,
    },
    {
      title: 'Use the Chain Rule inside each prime',
      description: 'Differentiate the outer power, keep its inner expression, then multiply by the inner derivative.',
      cards: [{ label: 'Inside the first prime', math: String.raw`u\prime=F\prime(g)g\prime` }, { label: 'Inside the second prime', math: String.raw`v\prime=H\prime(k)k\prime` }],
    },
  ],
}

function RuleScaffold({ rule = 'product' }) {
  const [layer, setLayer] = useState(0)
  const layers = ruleContent[rule] || ruleContent.product
  const current = layers[layer]
  const label = rule === 'product-chain' ? 'Product and Chain Rules' : rule.charAt(0).toUpperCase() + rule.slice(1) + ' Rule'

  return (
    <section className="derivative-lab" aria-labelledby={'rule-scaffold-' + rule}>
      <div className="derivative-visual-heading">
        <div>
          <span className="card-label">Rule scaffold</span>
          <h3 id={'rule-scaffold-' + rule}>{label}: organize before calculating</h3>
        </div>
        <span className="derivative-layer-count">Layer {layer + 1} of {layers.length}</span>
      </div>

      <div className="rule-scaffold-stage" aria-live="polite">
        <h4>{current.title}</h4>
        <p>{current.description}</p>
        {current.cards && (
          <div className="rule-scaffold-cards" role="list">
            {current.cards.map((card) => (
              <div className="derivative-concept-card" role="listitem" key={card.label + card.math}>
                <small>{card.label}</small>
                <MathDisplay>{card.math}</MathDisplay>
              </div>
            ))}
          </div>
        )}
        {current.formula && <div className="rule-generic-formula"><MathDisplay>{current.formula}</MathDisplay></div>}
      </div>
      <div className="derivative-visual-actions">
        <button type="button" onClick={() => setLayer((value) => Math.min(value + 1, layers.length - 1))} disabled={layer === layers.length - 1}>Reveal next layer</button>
        <button className="secondary" type="button" onClick={() => setLayer(0)} disabled={layer === 0}>Reset map</button>
      </div>
    </section>
  )
}

const trigDerivatives = [
  { id: 'sine', name: 'sine', source: '\\sin x', result: '\\cos x', cue: 'Sine becomes cosine; the sign stays positive.' },
  { id: 'cosine', name: 'cosine', source: '\\cos x', result: '-\\sin x', cue: 'Cosine becomes negative sine.' },
  { id: 'tangent', name: 'tangent', source: '\\tan x', result: '\\sec^2x', cue: 'Tangent produces a positive secant squared.' },
  { id: 'cotangent', name: 'cotangent', source: '\\cot x', result: '-\\csc^2x', cue: 'Cotangent carries a negative sign.' },
  { id: 'secant', name: 'secant', source: '\\sec x', result: '\\sec x\\tan x', cue: 'Secant keeps itself and gains tangent.' },
  { id: 'cosecant', name: 'cosecant', source: '\\csc x', result: '-\\csc x\\cot x', cue: 'Cosecant keeps itself, gains cotangent, and carries a negative sign.' },
]

function TrigDerivativeMap() {
  const [selectedId, setSelectedId] = useState('sine')
  const selected = trigDerivatives.find((item) => item.id === selectedId) || trigDerivatives[0]

  return (
    <section className="derivative-lab" aria-labelledby="trig-derivative-map-heading">
      <div className="derivative-visual-heading">
        <div>
          <span className="card-label">Derivative map</span>
          <h3 id="trig-derivative-map-heading">Explore one trig rule at a time</h3>
        </div>
      </div>
      <div className="trig-rule-buttons" role="group" aria-label="Choose a trigonometric function">
        {trigDerivatives.map((item) => (
          <button
            className={selectedId === item.id ? 'active' : ''}
            type="button"
            aria-label={'Show the derivative of ' + item.name}
            aria-pressed={selectedId === item.id}
            onClick={() => setSelectedId(item.id)}
            key={item.id}
          >
            <MathInline>{item.source}</MathInline>
          </button>
        ))}
      </div>
      <div className="trig-rule-result" aria-live="polite">
        <div><small>Original function</small><MathDisplay>{selected.source}</MathDisplay></div>
        <span className="trig-rule-arrow" aria-hidden="true">d/dx</span>
        <div><small>Derivative</small><MathDisplay>{selected.result}</MathDisplay></div>
      </div>
      <p className="derivative-status">{selected.cue}</p>
    </section>
  )
}

const chainLayers = [
  {
    title: 'Identify the nesting',
    description: 'The inner function g(x) is the input to the outer function F.',
    formula: 'y=F(g(x))',
  },
  {
    title: 'Differentiate the outside',
    description: 'Differentiate F while leaving its input g(x) in place.',
    formula: String.raw`F\prime(g(x))`,
  },
  {
    title: 'Multiply by the inside derivative',
    description: 'The derivative of the inner input completes the chain.',
    formula: String.raw`\frac{dy}{dx}=F\prime(g(x))g\prime(x)`,
  },
]

function ChainRuleLayers() {
  const [layer, setLayer] = useState(0)
  const current = chainLayers[layer]

  return (
    <section className="derivative-lab" aria-labelledby="chain-rule-layers-heading">
      <div className="derivative-visual-heading">
        <div>
          <span className="card-label">Composition layers</span>
          <h3 id="chain-rule-layers-heading">Work from the outside inward</h3>
        </div>
        <span className="derivative-layer-count">Layer {layer + 1} of {chainLayers.length}</span>
      </div>

      <div className="chain-layer-stage" aria-live="polite">
        <div className="chain-shell outer-shell">
          <span>Outer function</span>
          <div className="chain-shell inner-shell">
            <span>Inner function</span>
            <MathInline>{'g(x)'}</MathInline>
          </div>
        </div>
        <div className="chain-layer-copy">
          <h4>{current.title}</h4>
          <p>{current.description}</p>
          <MathDisplay>{current.formula}</MathDisplay>
        </div>
      </div>
      <div className="derivative-visual-actions">
        <button type="button" onClick={() => setLayer((value) => Math.min(value + 1, chainLayers.length - 1))} disabled={layer === chainLayers.length - 1}>Peel next layer</button>
        <button className="secondary" type="button" onClick={() => setLayer(0)} disabled={layer === 0}>Reset layers</button>
      </div>
    </section>
  )
}

export function DerivativeQuestionVisual({ visual }) {
  if (!visual) return null

  let content = null
  if (visual.type === 'power-rule-lab') content = <PowerRuleLab />
  if (visual.type === 'variable-toggle') content = <VariableToggle expression={visual.expression} />
  if (visual.type === 'derivative-family') content = <DerivativeFamily />
  if (visual.type === 'rule-scaffold') content = <RuleScaffold rule={visual.rule} />
  if (visual.type === 'trig-derivative-map') content = <TrigDerivativeMap />
  if (visual.type === 'chain-rule-layers') content = <ChainRuleLayers />

  return content ? <div className={'derivative-question-visual ' + visual.type}>{content}</div> : null
}
