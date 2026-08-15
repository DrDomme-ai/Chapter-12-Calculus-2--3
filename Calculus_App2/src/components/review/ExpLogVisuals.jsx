import { useState } from 'react'
import { MathDisplay, MathInline } from '../MathDisplay'

const EXP_GRAPH = {
  width: 720,
  height: 320,
  left: 54,
  right: 24,
  top: 24,
  bottom: 44,
  xMin: -3,
  xMax: 2.3,
  yMin: 0,
  yMax: 10,
}

const expGraphX = (value) => EXP_GRAPH.left
  + ((value - EXP_GRAPH.xMin) / (EXP_GRAPH.xMax - EXP_GRAPH.xMin))
  * (EXP_GRAPH.width - EXP_GRAPH.left - EXP_GRAPH.right)

const expGraphY = (value) => EXP_GRAPH.height - EXP_GRAPH.bottom
  - ((value - EXP_GRAPH.yMin) / (EXP_GRAPH.yMax - EXP_GRAPH.yMin))
  * (EXP_GRAPH.height - EXP_GRAPH.top - EXP_GRAPH.bottom)

function exponentialPath() {
  const commands = []
  for (let index = 0; index <= 180; index += 1) {
    const x = EXP_GRAPH.xMin + (index / 180) * (EXP_GRAPH.xMax - EXP_GRAPH.xMin)
    const y = Math.exp(x)
    commands.push(`${index ? 'L' : 'M'}${expGraphX(x).toFixed(2)} ${expGraphY(y).toFixed(2)}`)
  }
  return commands.join(' ')
}

function ExpSelfLab() {
  const [position, setPosition] = useState(0)
  const height = Math.exp(position)
  const tangent = (x) => height + height * (x - position)

  return (
    <section className="exp-log-lab exp-self-lab" aria-labelledby="exp-self-heading">
      <div className="exp-log-heading">
        <div>
          <span className="card-label">Slope laboratory</span>
          <h3 id="exp-self-heading">For <MathInline>{'e^x'}</MathInline>, height and slope agree</h3>
        </div>
        <div className="exp-identity" aria-label="The derivative of e to the x equals e to the x">
          <MathInline>{String.raw`\frac{d}{dx}e^x=e^x`}</MathInline>
        </div>
      </div>

      <svg
        className="exp-self-graph"
        viewBox={`0 0 ${EXP_GRAPH.width} ${EXP_GRAPH.height}`}
        role="img"
        aria-label={`Graph of e to the x and its tangent at x equals ${position.toFixed(2)}. The function height and tangent slope are both ${height.toFixed(3)}.`}
      >
        <rect width={EXP_GRAPH.width} height={EXP_GRAPH.height} rx="12" className="exp-graph-background" />
        {[0, 2, 4, 6, 8, 10].map((value) => (
          <g key={`exp-y-${value}`}>
            <line x1={EXP_GRAPH.left} y1={expGraphY(value)} x2={EXP_GRAPH.width - EXP_GRAPH.right} y2={expGraphY(value)} className="exp-grid-line" />
            <text x={EXP_GRAPH.left - 9} y={expGraphY(value) + 4} textAnchor="end">{value}</text>
          </g>
        ))}
        {[-3, -2, -1, 0, 1, 2].map((value) => (
          <g key={`exp-x-${value}`}>
            <line x1={expGraphX(value)} y1={EXP_GRAPH.top} x2={expGraphX(value)} y2={EXP_GRAPH.height - EXP_GRAPH.bottom} className="exp-grid-line" />
            <text x={expGraphX(value)} y={EXP_GRAPH.height - 18} textAnchor="middle">{value}</text>
          </g>
        ))}
        <line x1={EXP_GRAPH.left} y1={expGraphY(0)} x2={EXP_GRAPH.width - EXP_GRAPH.right} y2={expGraphY(0)} className="exp-axis" />
        <line x1={expGraphX(0)} y1={EXP_GRAPH.top} x2={expGraphX(0)} y2={EXP_GRAPH.height - EXP_GRAPH.bottom} className="exp-axis" />
        <line
          x1={expGraphX(EXP_GRAPH.xMin)}
          y1={expGraphY(tangent(EXP_GRAPH.xMin))}
          x2={expGraphX(EXP_GRAPH.xMax)}
          y2={expGraphY(tangent(EXP_GRAPH.xMax))}
          className="exp-tangent-line"
        />
        <path d={exponentialPath()} className="exp-function-curve" />
        <circle cx={expGraphX(position)} cy={expGraphY(height)} r="7" className="exp-selected-point" />
        <text x={EXP_GRAPH.width - 30} y={EXP_GRAPH.top + 22} textAnchor="end" className="exp-curve-label">function: eˣ</text>
        <text x={EXP_GRAPH.width - 30} y={EXP_GRAPH.top + 43} textAnchor="end" className="exp-tangent-label">tangent: slope eˣ</text>
      </svg>

      <label className="exp-log-range" htmlFor="exp-self-position">
        <span>Move the point of tangency</span>
        <input
          id="exp-self-position"
          type="range"
          min="-2"
          max="2"
          step="0.25"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
        />
        <output htmlFor="exp-self-position">x = {position.toFixed(2)}</output>
      </label>
      <p className="exp-log-status" aria-live="polite">
        At <MathInline>{`x=${position.toFixed(2)}`}</MathInline>, the height and slope are both approximately <strong>{height.toFixed(3)}</strong>. A constant multiplier stays attached: <MathInline>{String.raw`(Ce^x)\prime=Ce^x`}</MathInline>.
      </p>
    </section>
  )
}

const nestingExamples = {
  product: {
    label: 'Product',
    expression: String.raw`(5x^2-7x)e^x`,
    layers: [
      { label: 'Outer structure', title: 'Two changing factors', formula: 'u(x)v(x)', note: 'Name the polynomial u and the exponential v.' },
      { label: 'Outer rule', title: 'Product Rule first', formula: String.raw`(uv)\prime=u\prime v+uv\prime`, note: 'Each term keeps one original factor.' },
      { label: 'Inner facts', title: 'Differentiate each factor', formula: String.raw`u\prime=10x-7,\qquad v\prime=e^x`, note: 'The exponential reproduces itself.' },
    ],
  },
  quotient: {
    label: 'Quotient with a product',
    expression: String.raw`\frac{x^6e^x}{x^6+e^x}`,
    layers: [
      { label: 'Outer structure', title: 'A numerator over a denominator', formula: String.raw`\frac{N(x)}{D(x)}`, note: 'Keep the entire numerator and denominator grouped.' },
      { label: 'Outer rule', title: 'Quotient Rule first', formula: String.raw`\left(\frac ND\right)\prime=\frac{DN\prime-ND\prime}{D^2}`, note: 'Preserve the subtraction order and square the original denominator.' },
      { label: 'Nested rule', title: 'The numerator needs a Product Rule', formula: String.raw`N\prime=(x^6e^x)\prime=6x^5e^x+x^6e^x`, note: 'Work inward only after the outer quotient is organized.' },
      { label: 'Denominator', title: 'Differentiate term by term', formula: String.raw`D\prime=6x^5+e^x`, note: 'Now every slot in the quotient template is ready.' },
    ],
  },
  'outer-chain': {
    label: 'Chain outside a quotient',
    expression: String.raw`\sin\!\left(\frac{e^x}{6+e^x}\right)`,
    layers: [
      { label: 'Outer structure', title: 'Sine is the outside function', formula: String.raw`\sin(q(x))`, note: 'Differentiate the outer sine before opening the quotient.' },
      { label: 'Outer rule', title: 'Start the Chain Rule', formula: String.raw`\cos(q(x))\,q\prime(x)`, note: 'Keep the full inner quotient in the cosine.' },
      { label: 'Nested rule', title: 'Differentiate the quotient', formula: String.raw`q\prime=\frac{(6+e^x)e^x-e^x(e^x)}{(6+e^x)^2}`, note: 'Both copies of e to the x differentiate to themselves.' },
    ],
  },
}

function ExpRuleNesting({ initialRule = 'product' }) {
  const safeInitialRule = nestingExamples[initialRule] ? initialRule : 'product'
  const [rule, setRule] = useState(safeInitialRule)
  const [visibleLayers, setVisibleLayers] = useState(1)
  const example = nestingExamples[rule]

  const chooseRule = (nextRule) => {
    setRule(nextRule)
    setVisibleLayers(1)
  }

  return (
    <section className="exp-log-lab" aria-labelledby="exp-nesting-heading">
      <div className="exp-log-heading">
        <div>
          <span className="card-label">Rule nesting map</span>
          <h3 id="exp-nesting-heading">Differentiate from the outside inward</h3>
        </div>
        <span className="exp-log-layer-count">{visibleLayers} of {example.layers.length} layers</span>
      </div>

      <div className="exp-log-tabs" role="group" aria-label="Choose a rule nesting example">
        {Object.entries(nestingExamples).map(([id, item]) => (
          <button
            type="button"
            className={rule === id ? 'active' : ''}
            aria-pressed={rule === id}
            onClick={() => chooseRule(id)}
            key={id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="exp-nesting-expression" aria-live="polite">
        <small>Expression being organized</small>
        <MathDisplay>{example.expression}</MathDisplay>
      </div>
      <ol className="exp-nesting-stack" aria-live="polite">
        {example.layers.slice(0, visibleLayers).map((layer, index) => (
          <li key={layer.label}>
            <span className="exp-layer-number">{index + 1}</span>
            <div>
              <small>{layer.label}</small>
              <h4>{layer.title}</h4>
              <MathDisplay>{layer.formula}</MathDisplay>
              <p>{layer.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="exp-log-actions">
        <button type="button" disabled={visibleLayers === example.layers.length} onClick={() => setVisibleLayers((count) => Math.min(count + 1, example.layers.length))}>Reveal next layer</button>
        <button className="secondary" type="button" disabled={visibleLayers === 1} onClick={() => setVisibleLayers(1)}>Reset map</button>
      </div>
    </section>
  )
}

const logChainExamples = {
  simple: {
    label: 'ln of a polynomial',
    expression: String.raw`g(t)=\ln(7+t^4)`,
    steps: [
      { title: 'Name the inner function', formula: 'u=7+t^4', note: 'The logarithm receives the entire polynomial as one input.' },
      { title: 'Differentiate the outer logarithm', formula: String.raw`\frac{d}{dt}\ln(u)=\frac{1}{u}\,u\prime`, note: 'The inner function moves to the denominator.' },
      { title: 'Multiply by the inner derivative', formula: String.raw`g\prime(t)=\frac{4t^3}{7+t^4}`, note: 'The factor 4t cubed is the chain factor.' },
    ],
  },
  sine: {
    label: 'sine of a logarithm',
    expression: String.raw`f(x)=\sin(9\ln x)`,
    steps: [
      { title: 'Outer layer: sine', formula: String.raw`\sin(u)\longrightarrow\cos(u)`, note: 'Leave the complete inner input unchanged.' },
      { title: 'Middle layer: constant multiple', formula: String.raw`u=9\ln x,\qquad u\prime=9\left(\frac1x\right)`, note: 'Nine remains a constant multiplier.' },
      { title: 'Combine the chain factors', formula: String.raw`f\prime(x)=\frac{9\cos(9\ln x)}{x}`, note: 'Every layer contributes one derivative factor.' },
    ],
  },
  nested: {
    label: 'nested logarithms',
    expression: String.raw`y=\ln(4+\ln x)`,
    steps: [
      { title: 'Outer logarithm', formula: String.raw`\ln(u)\longrightarrow\frac{u\prime}{u}`, note: 'Here u equals 4 plus ln x.' },
      { title: 'Inner logarithm', formula: String.raw`u\prime=\frac1x`, note: 'The constant 4 differentiates to zero.' },
      { title: 'First derivative', formula: String.raw`y\prime=\frac{1}{x(4+\ln x)}`, note: 'Keep the denominator grouped for the next derivative.' },
      { title: 'Second derivative', formula: String.raw`y\prime\prime=-\frac{5+\ln x}{x^2(4+\ln x)^2}`, note: 'Treat y prime as the reciprocal of x times (4 plus ln x).' },
    ],
  },
}

function LogChainLab({ initialExample = 'simple' }) {
  const safeInitialExample = logChainExamples[initialExample] ? initialExample : 'simple'
  const [exampleId, setExampleId] = useState(safeInitialExample)
  const [step, setStep] = useState(0)
  const example = logChainExamples[exampleId]
  const current = example.steps[step]

  const chooseExample = (nextExample) => {
    setExampleId(nextExample)
    setStep(0)
  }

  return (
    <section className="exp-log-lab" aria-labelledby="log-chain-heading">
      <div className="exp-log-heading">
        <div>
          <span className="card-label">Logarithm layers</span>
          <h3 id="log-chain-heading">Follow the Chain Rule through every shell</h3>
        </div>
        <span className="exp-log-layer-count">Step {step + 1} of {example.steps.length}</span>
      </div>
      <div className="exp-log-tabs" role="group" aria-label="Choose a logarithmic chain example">
        {Object.entries(logChainExamples).map(([id, item]) => (
          <button type="button" className={exampleId === id ? 'active' : ''} aria-pressed={exampleId === id} onClick={() => chooseExample(id)} key={id}>{item.label}</button>
        ))}
      </div>

      <div className="log-chain-workspace" aria-live="polite">
        <div className="log-chain-shells">
          <small>Nested expression</small>
          <MathDisplay>{example.expression}</MathDisplay>
          <div className="log-shell outer"><span>outside</span><div className="log-shell middle"><span>inside</span><div className="log-shell core">input</div></div></div>
        </div>
        <div className="log-chain-step">
          <small>Current move</small>
          <h4>{current.title}</h4>
          <MathDisplay>{current.formula}</MathDisplay>
          <p>{current.note}</p>
        </div>
      </div>
      <div className="exp-log-actions">
        <button type="button" disabled={step === example.steps.length - 1} onClick={() => setStep((value) => Math.min(value + 1, example.steps.length - 1))}>Reveal next step</button>
        <button className="secondary" type="button" disabled={step === 0} onClick={() => setStep(0)}>Start over</button>
      </div>
    </section>
  )
}

const logBases = [2, 'e', 7, 10]

function LogBaseLab({ initialBase = 7 }) {
  const [base, setBase] = useState(logBases.includes(initialBase) ? initialBase : 7)
  const baseMath = String(base)
  const derivative = base === 'e'
    ? String.raw`\frac{d}{dz}\left[e^z\ln z\right]=e^z\left(\ln z+\frac1z\right)`
    : String.raw`\frac{d}{dz}\left[${baseMath}^z\log_{${baseMath}}z\right]=${baseMath}^z\left(\ln z+\frac{1}{z\ln(${baseMath})}\right)`

  return (
    <section className="exp-log-lab" aria-labelledby="log-base-heading">
      <div className="exp-log-heading">
        <div>
          <span className="card-label">Base laboratory</span>
          <h3 id="log-base-heading">A base contributes a logarithmic conversion factor</h3>
        </div>
      </div>
      <div className="exp-log-tabs compact-tabs" role="group" aria-label="Choose an exponential and logarithm base">
        {logBases.map((item) => (
          <button type="button" className={base === item ? 'active' : ''} aria-pressed={base === item} onClick={() => setBase(item)} key={item}>
            Base <MathInline>{String(item)}</MathInline>
          </button>
        ))}
      </div>

      <div className="log-base-grid" aria-live="polite">
        <div className="exp-log-concept-card">
          <small>Exponential derivative</small>
          <MathDisplay>{String.raw`\frac{d}{dz}${baseMath}^z=${baseMath}^z\ln(${baseMath})`}</MathDisplay>
          <p>The factor <MathInline>{String.raw`\ln(${baseMath})`}</MathInline> measures the growth rate for this base.</p>
        </div>
        <div className="exp-log-concept-card">
          <small>Logarithm derivative</small>
          <MathDisplay>{String.raw`\frac{d}{dz}\log_{${baseMath}}z=\frac{1}{z\ln(${baseMath})}`}</MathDisplay>
          <p>The same conversion factor appears in the denominator.</p>
        </div>
      </div>
      <div className="log-cancellation">
        <span>Change-of-base connection</span>
        <MathDisplay>{String.raw`\log_{${baseMath}}(z)\,\ln(${baseMath})=\ln z`}</MathDisplay>
      </div>
      <div className="exp-log-result">
        <small>Product Rule result</small>
        <MathDisplay>{derivative}</MathDisplay>
      </div>
      <p className="exp-log-status">The logarithm requires <MathInline>{'z>0'}</MathInline>. A valid base satisfies <MathInline>{'a>0'}</MathInline> and <MathInline>{String.raw`a\ne1`}</MathInline>.</p>
    </section>
  )
}

const inverseExamples = {
  'arcsin-linear': {
    labelMath: String.raw`\arcsin(4x)`,
    accessibleLabel: 'arcsine of 4 x',
    family: 'arcsin',
    expression: String.raw`f(x)=\arcsin(4x)`,
    layers: [String.raw`u=4x`, String.raw`\frac{d}{du}\arcsin u=\frac1{\sqrt{1-u^2}}`, String.raw`u\prime=4`],
    derivative: String.raw`f\prime(x)=\frac4{\sqrt{1-16x^2}}`,
    functionDomain: String.raw`-\frac14\le x\le\frac14`,
    derivativeDomain: String.raw`-\frac14<x<\frac14`,
  },
  'arctan-root': {
    labelMath: String.raw`\arctan\!\left(\sqrt{x-7}\right)`,
    accessibleLabel: 'arctangent of the square root of x minus 7',
    family: 'arctan',
    expression: String.raw`y=\arctan\!\left(\sqrt{x-7}\right)`,
    layers: [String.raw`u=\sqrt{x-7}`, String.raw`\frac{d}{du}\arctan u=\frac1{1+u^2}`, String.raw`u\prime=\frac1{2\sqrt{x-7}}`],
    derivative: String.raw`y\prime=\frac1{2(x-6)\sqrt{x-7}}`,
    functionDomain: String.raw`x\ge7`,
    derivativeDomain: String.raw`x>7`,
  },
  'arctan-square': {
    labelMath: String.raw`[\arctan(9x)]^2`,
    accessibleLabel: 'the square of arctangent of 9 x',
    family: 'arctan',
    expression: String.raw`y=\left[\arctan(9x)\right]^2`,
    layers: [String.raw`v=\arctan(9x)`, String.raw`\frac{d}{dv}v^2=2v`, String.raw`v\prime=\frac9{1+81x^2}`],
    derivative: String.raw`y\prime=\frac{18\arctan(9x)}{1+81x^2}`,
    functionDomain: String.raw`x\in\mathbb R`,
    derivativeDomain: String.raw`x\in\mathbb R`,
  },
  'exp-arcsin': {
    labelMath: String.raw`e^{\arcsin(z^7)}`,
    accessibleLabel: 'e raised to the arcsine of z to the seventh power',
    family: 'arcsin',
    expression: String.raw`f(z)=e^{\arcsin(z^7)}`,
    layers: [String.raw`v=\arcsin(z^7)`, String.raw`\frac{d}{dv}e^v=e^v`, String.raw`v\prime=\frac{7z^6}{\sqrt{1-z^{14}}}`],
    derivative: String.raw`f\prime(z)=\frac{7z^6e^{\arcsin(z^7)}}{\sqrt{1-z^{14}}}`,
    functionDomain: String.raw`-1\le z\le1`,
    derivativeDomain: String.raw`-1<z<1`,
  },
}

function inverseInitialExample(visual) {
  if (inverseExamples[visual.example]) return visual.example
  return visual.function === 'arctan' ? 'arctan-root' : 'arcsin-linear'
}

function InverseTrigChainLab({ visual }) {
  const [exampleId, setExampleId] = useState(() => inverseInitialExample(visual))
  const example = inverseExamples[exampleId]

  return (
    <section className="exp-log-lab" aria-labelledby="inverse-trig-chain-heading">
      <div className="exp-log-heading">
        <div>
          <span className="card-label">Inverse-trig chain map</span>
          <h3 id="inverse-trig-chain-heading">Track the input and its domain</h3>
        </div>
        <span className={`inverse-family-badge ${example.family}`}>{example.family}</span>
      </div>
      <div className="exp-log-tabs inverse-example-tabs" role="group" aria-label="Choose an inverse trigonometric chain example">
        {Object.entries(inverseExamples).map(([id, item]) => (
          <button
            type="button"
            className={exampleId === id ? 'active' : ''}
            aria-label={`Show ${item.accessibleLabel}`}
            aria-pressed={exampleId === id}
            onClick={() => setExampleId(id)}
            key={id}
          >
            <MathInline>{item.labelMath}</MathInline>
          </button>
        ))}
      </div>

      <div className="inverse-chain-workspace" aria-live="polite">
        <div className="inverse-chain-expression">
          <small>Composite function</small>
          <MathDisplay>{example.expression}</MathDisplay>
          <div className="inverse-chain-factors" aria-label="Chain Rule factors">
            {example.layers.map((layer, index) => (
              <div key={layer}>
                <span>{index === 0 ? 'Name the input' : index === 1 ? 'Outer derivative' : 'Inner derivative'}</span>
                <MathDisplay>{layer}</MathDisplay>
              </div>
            ))}
          </div>
        </div>
        <div className="inverse-domain-panel">
          <small>Domain check</small>
          <div className={`inverse-domain-line ${example.family}`} aria-hidden="true">
            <span className="left-end" />
            <span className="domain-fill" />
            <span className="right-end" />
          </div>
          <dl>
            <div><dt>Function</dt><dd><MathInline>{example.functionDomain}</MathInline></dd></div>
            <div><dt>Derivative</dt><dd><MathInline>{example.derivativeDomain}</MathInline></dd></div>
          </dl>
          <p>Endpoints can belong to a function even when its derivative is undefined there.</p>
        </div>
      </div>
      <div className="exp-log-result">
        <small>Combined derivative</small>
        <MathDisplay>{example.derivative}</MathDisplay>
      </div>
    </section>
  )
}

// The review question component can render this dispatcher beside its existing
// trig, limits, and derivative dispatchers. Unknown visual types render nothing.
export function ExpLogQuestionVisual({ visual }) {
  if (!visual) return null

  let content = null
  if (visual.type === 'exp-self-lab') content = <ExpSelfLab />
  if (visual.type === 'exp-rule-nesting') content = <ExpRuleNesting initialRule={visual.rule} />
  if (visual.type === 'log-chain-lab') content = <LogChainLab initialExample={visual.example} />
  if (visual.type === 'log-base-lab') content = <LogBaseLab initialBase={visual.base} />
  if (visual.type === 'inverse-trig-chain-lab') content = <InverseTrigChainLab visual={visual} />

  return content ? <div className={`exp-log-question-visual ${visual.type}`}>{content}</div> : null
}
