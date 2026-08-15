import { useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const GRAPH = {
  width: 720,
  height: 390,
  left: 58,
  right: 28,
  top: 28,
  bottom: 50,
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 8,
}

const families = [
  {
    id: 'polynomial',
    label: 'Polynomial',
    formula: 'f(x)=x^2-3x+2',
    description: 'A polynomial combines nonnegative whole-number powers of the input. Its graph is smooth wherever it is drawn.',
    domain: String.raw`(-\infty,\infty)`,
    range: String.raw`\left[-\frac14,\infty\right)`,
    tableX: [-1, 0, 1, 2, 3],
    evaluate: (x) => x ** 2 - 3 * x + 2,
  },
  {
    id: 'rational',
    label: 'Rational',
    formula: String.raw`f(x)=\frac1{x-1}`,
    description: 'A rational function is a quotient of polynomials. Inputs that make its denominator zero must be excluded.',
    domain: String.raw`(-\infty,1)\cup(1,\infty)`,
    range: String.raw`(-\infty,0)\cup(0,\infty)`,
    tableX: [-1, 0, 0.5, 1, 2, 3],
    evaluate: (x) => (Math.abs(x - 1) < 1e-10 ? null : 1 / (x - 1)),
  },
  {
    id: 'radical',
    label: 'Radical',
    formula: String.raw`f(x)=\sqrt{x+2}`,
    description: 'A square-root function accepts inputs that keep the expression under the radical nonnegative.',
    domain: String.raw`[-2,\infty)`,
    range: String.raw`[0,\infty)`,
    tableX: [-2, -1, 0, 2, 3],
    evaluate: (x) => (x < -2 ? null : Math.sqrt(x + 2)),
  },
  {
    id: 'absolute',
    label: 'Absolute value',
    formula: 'f(x)=|x-1|',
    description: 'Absolute value measures distance. The V-shaped graph records how far each input lies from 1.',
    domain: String.raw`(-\infty,\infty)`,
    range: String.raw`[0,\infty)`,
    tableX: [-2, -1, 0, 1, 2, 3, 4],
    evaluate: (x) => Math.abs(x - 1),
  },
  {
    id: 'exponential',
    label: 'Exponential',
    formula: 'f(x)=2^x',
    description: 'The input appears in the exponent. Equal steps in x multiply the output by the same growth factor.',
    domain: String.raw`(-\infty,\infty)`,
    range: String.raw`(0,\infty)`,
    tableX: [-2, -1, 0, 1, 2, 3],
    evaluate: (x) => 2 ** x,
  },
  {
    id: 'logarithmic',
    label: 'Logarithmic',
    formula: String.raw`f(x)=\log_2 x`,
    description: 'A logarithm reports an exponent: log base 2 of x asks which power of 2 produces x.',
    domain: String.raw`(0,\infty)`,
    range: String.raw`(-\infty,\infty)`,
    tableX: [0.25, 0.5, 1, 2, 4],
    evaluate: (x) => (x <= 0 ? null : Math.log2(x)),
  },
]

const graphX = (value) => GRAPH.left
  + ((value - GRAPH.xMin) / (GRAPH.xMax - GRAPH.xMin))
  * (GRAPH.width - GRAPH.left - GRAPH.right)

const graphY = (value) => GRAPH.height - GRAPH.bottom
  - ((value - GRAPH.yMin) / (GRAPH.yMax - GRAPH.yMin))
  * (GRAPH.height - GRAPH.top - GRAPH.bottom)

function pointsToPath(points) {
  return points.map(([x, y], index) => `${index ? 'L' : 'M'}${graphX(x).toFixed(2)} ${graphY(y).toFixed(2)}`).join(' ')
}

function sampledPath(evaluate, start, end, steps = 180) {
  const points = []
  for (let index = 0; index <= steps; index += 1) {
    const x = start + (index / steps) * (end - start)
    const y = evaluate(x)
    if (Number.isFinite(y)) points.push([x, y])
  }
  return pointsToPath(points)
}

function pathsForFamily(id) {
  if (id === 'rational') {
    return [
      sampledPath((x) => 1 / (x - 1), -5, 0.94),
      sampledPath((x) => 1 / (x - 1), 1.06, 5),
    ]
  }
  if (id === 'radical') return [sampledPath((x) => Math.sqrt(x + 2), -2, 5)]
  if (id === 'absolute') return [sampledPath((x) => Math.abs(x - 1), -5, 5)]
  if (id === 'exponential') return [sampledPath((x) => 2 ** x, -5, 3)]
  if (id === 'logarithmic') return [sampledPath((x) => Math.log2(x), 0.04, 5)]
  return [sampledPath((x) => x ** 2 - 3 * x + 2, -1.7, 4.7)]
}

function formatDecimal(value, digits = 3) {
  if (value === null || !Number.isFinite(value)) return 'undefined'
  if (Math.abs(value) < 1e-10) return '0'
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')
}

function FunctionGraph({ family, input, showInverse }) {
  const selectedValue = family.evaluate(input)
  const showSelectedPoint = selectedValue !== null
    && selectedValue >= GRAPH.yMin
    && selectedValue <= GRAPH.yMax
    && input >= GRAPH.xMin
    && input <= GRAPH.xMax
  const inverseMode = showInverse && (family.id === 'exponential' || family.id === 'logarithmic')
  const primaryPaths = pathsForFamily(family.id)
  const inverseFamily = family.id === 'exponential'
    ? families.find((item) => item.id === 'logarithmic')
    : families.find((item) => item.id === 'exponential')

  return (
    <figure className="algebra-function-graph-wrap">
      <svg
        className="algebra-function-graph"
        viewBox={`0 0 ${GRAPH.width} ${GRAPH.height}`}
        role="img"
        aria-label={`Graph of ${family.label} function ${family.formula}${inverseMode ? ' together with its inverse and the line y equals x' : ''}`}
      >
        <rect width={GRAPH.width} height={GRAPH.height} rx="14" className="algebra-function-graph-bg" />
        {[-4, -2, 0, 2, 4].map((value) => (
          <g key={`function-x-grid-${value}`}>
            <line x1={graphX(value)} y1={GRAPH.top} x2={graphX(value)} y2={GRAPH.height - GRAPH.bottom} className="algebra-function-grid" />
            <text x={graphX(value)} y={GRAPH.height - 22} textAnchor="middle">{value}</text>
          </g>
        ))}
        {[-4, -2, 0, 2, 4, 6, 8].map((value) => (
          <g key={`function-y-grid-${value}`}>
            <line x1={GRAPH.left} y1={graphY(value)} x2={GRAPH.width - GRAPH.right} y2={graphY(value)} className="algebra-function-grid" />
            <text x={GRAPH.left - 10} y={graphY(value) + 4} textAnchor="end">{value}</text>
          </g>
        ))}
        <line x1={GRAPH.left} y1={graphY(0)} x2={GRAPH.width - GRAPH.right} y2={graphY(0)} className="algebra-function-axis" />
        <line x1={graphX(0)} y1={GRAPH.top} x2={graphX(0)} y2={GRAPH.height - GRAPH.bottom} className="algebra-function-axis" />
        <text x={GRAPH.width - GRAPH.right} y={graphY(0) - 9} textAnchor="end" className="algebra-function-axis-label">x</text>
        <text x={graphX(0) + 10} y={GRAPH.top + 14} className="algebra-function-axis-label">y</text>

        {family.id === 'rational' && <line x1={graphX(1)} y1={GRAPH.top} x2={graphX(1)} y2={GRAPH.height - GRAPH.bottom} className="algebra-function-asymptote" />}
        {inverseMode && (
          <>
            <line x1={graphX(-5)} y1={graphY(-5)} x2={graphX(5)} y2={graphY(5)} className="algebra-function-reflection" />
            {pathsForFamily(inverseFamily.id).map((path, index) => <path d={path} className="algebra-function-inverse-curve" key={`inverse-${index}`} />)}
            <text x={graphX(4.25)} y={graphY(4.25) - 9} textAnchor="end" className="algebra-function-reflection-label">y = x</text>
          </>
        )}
        {primaryPaths.map((path, index) => <path d={path} className="algebra-function-curve" key={`primary-${index}`} />)}
        {showSelectedPoint && (
          <g>
            <line x1={graphX(input)} y1={graphY(0)} x2={graphX(input)} y2={graphY(selectedValue)} className="algebra-function-guide" />
            <circle cx={graphX(input)} cy={graphY(selectedValue)} r="7" className="algebra-function-point" />
          </g>
        )}
      </svg>
      <figcaption>
        {showSelectedPoint
          ? <>The highlighted point is <MathInline>{`(${formatDecimal(input)},${formatDecimal(selectedValue)})`}</MathInline>.</>
          : <>This input does not produce a visible point in the selected graph window.</>}
      </figcaption>
    </figure>
  )
}

function FunctionMachine() {
  const [input, setInput] = useState(2)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const output = input ** 2 - 3 * input + 2
  const linearTerm = -3 * input
  const signedLinearTerm = linearTerm >= 0 ? `+${linearTerm}` : String(linearTerm)
  const steps = [
    String.raw`f(x)=x^2-3x+2`,
    `f(${input})=(${input})^2-3(${input})+2`,
    `f(${input})=${input ** 2}${signedLinearTerm}+2=${output}`,
  ]

  const updateInput = (value) => {
    const next = Number(value)
    if (Number.isFinite(next)) {
      setInput(next)
      setVisibleSteps(0)
    }
  }

  return (
    <section className="algebra-function-machine-lab" aria-labelledby="algebra-function-machine-heading">
      <header className="algebra-lab-heading">
        <div>
          <span className="card-label">Function machine</span>
          <h3 id="algebra-function-machine-heading">One allowed input receives exactly one output</h3>
        </div>
        <p>A function may be presented as a rule, but evaluating it means following that rule for a specific input.</p>
      </header>

      <div className="algebra-function-machine" aria-label={`Input ${input} passes through f of x equals x squared minus 3x plus 2 and produces output ${output}`}>
        <div className="algebra-machine-node algebra-machine-node--input">
          <small>Input</small>
          <strong>{input}</strong>
        </div>
        <span className="algebra-machine-arrow" aria-hidden="true">→</span>
        <div className="algebra-machine-node algebra-machine-node--rule">
          <small>Rule</small>
          <MathInline>{'f(x)=x^2-3x+2'}</MathInline>
        </div>
        <span className="algebra-machine-arrow" aria-hidden="true">→</span>
        <div className="algebra-machine-node algebra-machine-node--output">
          <small>Output</small>
          <strong>{visibleSteps >= steps.length ? output : '?'}</strong>
        </div>
      </div>

      <label className="algebra-function-input-control" htmlFor="algebra-machine-input">
        <span>Choose the input x</span>
        <input id="algebra-machine-input" type="range" min="-4" max="6" step="1" value={input} onChange={(event) => updateInput(event.target.value)} />
        <input type="number" min="-20" max="20" step="1" value={input} aria-label="Enter a numerical input for the function machine" onChange={(event) => updateInput(event.target.value)} />
      </label>

      <div className="algebra-function-machine-steps" aria-live="polite">
        {steps.slice(0, visibleSteps).map((step, index) => (
          <div key={step} className="algebra-function-machine-step">
            <span>{index + 1}</span>
            <MathDisplay>{step}</MathDisplay>
          </div>
        ))}
        <div className="algebra-function-machine-actions">
          <button type="button" disabled={visibleSteps >= steps.length} onClick={() => setVisibleSteps((current) => Math.min(steps.length, current + 1))}>
            {visibleSteps ? 'Reveal next step' : 'Begin evaluation'}
          </button>
          <button type="button" className="quiet" onClick={() => setVisibleSteps(0)}>Reset steps</button>
        </div>
      </div>
    </section>
  )
}

function RepresentationPanel({ family, representation, input, showInverse }) {
  if (representation === 'algebraic') {
    return (
      <div className="algebra-function-algebraic" aria-live="polite">
        <MathDisplay>{family.formula}</MathDisplay>
        <p>{family.description}</p>
        <dl className="algebra-function-domain-range">
          <div><dt>Domain</dt><dd><MathInline>{family.domain}</MathInline></dd></div>
          <div><dt>Range</dt><dd><MathInline>{family.range}</MathInline></dd></div>
        </dl>
        <p><strong>Domain</strong> is the collection of allowed inputs. <strong>Range</strong> is the collection of outputs the function can actually produce.</p>
      </div>
    )
  }

  if (representation === 'numerical') {
    return (
      <div className="algebra-function-table-wrap" aria-live="polite">
        <table className="algebra-function-table">
          <caption>Selected input-output pairs for {family.label.toLowerCase()} behavior</caption>
          <thead><tr><th scope="col">Input <MathInline>{'x'}</MathInline></th><th scope="col">Output <MathInline>{'f(x)'}</MathInline></th></tr></thead>
          <tbody>
            {family.tableX.map((x) => (
              <tr key={x}>
                <th scope="row"><MathInline>{String(x)}</MathInline></th>
                <td><MathInline>{formatDecimal(family.evaluate(x))}</MathInline></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Tables reveal change one input at a time; look for multiplication, symmetry, restrictions, or steady differences.</p>
      </div>
    )
  }

  return <FunctionGraph family={family} input={input} showInverse={showInverse} />
}

function FunctionPractice() {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [hint, setHint] = useState(0)

  const check = () => {
    const parsed = Number(answer.trim())
    setFeedback(parsed === 3
      ? 'Correct — the input 4 produces the single output 3.'
      : 'Not yet. Substitute 4 everywhere x appears before simplifying.')
  }

  return (
    <section className="algebra-function-practice" aria-labelledby="algebra-function-practice-heading">
      <span className="card-label">Your turn</span>
      <h3 id="algebra-function-practice-heading">Evaluate a function</h3>
      <MathDisplay>{String.raw`g(x)=2x-5\qquad\text{Find }g(4).`}</MathDisplay>
      <label htmlFor="algebra-function-practice-answer">
        <span>Your answer</span>
        <input id="algebra-function-practice-answer" inputMode="decimal" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback('') }} />
      </label>
      <div className="algebra-function-practice-actions">
        <button type="button" onClick={check}>Check answer</button>
        <button type="button" className="quiet" onClick={() => setHint((current) => Math.max(current, 1))}>Hint 1</button>
        <button type="button" className="quiet" onClick={() => setHint((current) => Math.max(current, 2))}>Hint 2</button>
        <button type="button" className="quiet" onClick={() => setHint(3)}>Show solution</button>
      </div>
      {hint >= 1 && <p className="algebra-function-hint">Replace each occurrence of <MathInline>{'x'}</MathInline> with 4.</p>}
      {hint >= 2 && <p className="algebra-function-hint">Compute multiplication before subtraction: <MathInline>{'2(4)-5'}</MathInline>.</p>}
      {hint >= 3 && <div className="algebra-function-solution"><MathDisplay>{'g(4)=2(4)-5=8-5=3'}</MathDisplay></div>}
      {feedback && <p className={feedback.startsWith('Correct') ? 'algebra-feedback is-correct' : 'algebra-feedback is-incorrect'} role="status">{feedback}</p>}
    </section>
  )
}

export function FunctionExplorer() {
  const [familyId, setFamilyId] = useState('polynomial')
  const [representation, setRepresentation] = useState('graphical')
  const [input, setInput] = useState(2)
  const [showInverse, setShowInverse] = useState(true)
  const family = families.find((item) => item.id === familyId) ?? families[0]
  const output = family.evaluate(input)

  return (
    <div className="algebra-function-module">
      <FunctionMachine />

      <section className="algebra-function-explorer" aria-labelledby="algebra-function-explorer-heading">
        <header className="algebra-lab-heading">
          <div>
            <span className="card-label">Function family explorer</span>
            <h3 id="algebra-function-explorer-heading">One relationship, several representations</h3>
          </div>
          <p>A formula tells us how to calculate, a table samples behavior, and a graph shows the relationship across many inputs at once.</p>
        </header>

        <div className="algebra-family-tabs" role="tablist" aria-label="Choose a family of functions">
          {families.map((item) => (
            <button
              id={`algebra-family-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={familyId === item.id}
              aria-controls="algebra-family-panel"
              className={familyId === item.id ? 'active' : ''}
              onClick={() => setFamilyId(item.id)}
              key={item.id}
            >
              <span>{item.label}</span>
              <MathInline>{item.formula.replace('f(x)=', '')}</MathInline>
            </button>
          ))}
        </div>

        <div id="algebra-family-panel" role="tabpanel" aria-labelledby={`algebra-family-tab-${family.id}`} className="algebra-family-panel">
          <div className="algebra-representation-tabs" role="group" aria-label="Choose how to represent the function">
            {[
              ['algebraic', 'Algebraic'],
              ['numerical', 'Numerical'],
              ['graphical', 'Graphical'],
            ].map(([id, label]) => (
              <button type="button" aria-pressed={representation === id} className={representation === id ? 'active' : ''} onClick={() => setRepresentation(id)} key={id}>{label}</button>
            ))}
          </div>

          <div className="algebra-family-summary">
            <div>
              <small>Selected family</small>
              <h4>{family.label}</h4>
              <MathDisplay>{family.formula}</MathDisplay>
            </div>
            <dl>
              <div><dt>Domain</dt><dd><MathInline>{family.domain}</MathInline></dd></div>
              <div><dt>Range</dt><dd><MathInline>{family.range}</MathInline></dd></div>
            </dl>
          </div>

          <div className="algebra-function-evaluator">
            <label htmlFor="algebra-family-input">
              <span>Evaluate at x = {input}</span>
              <input id="algebra-family-input" type="range" min="-4" max="5" step="0.25" value={input} onChange={(event) => setInput(Number(event.target.value))} />
            </label>
            <div className={output === null ? 'algebra-function-output is-undefined' : 'algebra-function-output'} aria-live="polite">
              <small>Current output</small>
              {output === null
                ? <p><strong>Undefined for this input.</strong> The input lies outside the function’s domain.</p>
                : <MathDisplay>{String.raw`f(${formatDecimal(input)})\approx ${formatDecimal(output)}`}</MathDisplay>}
            </div>
          </div>

          {(family.id === 'exponential' || family.id === 'logarithmic') && (
            <div className="algebra-inverse-toggle">
              <label htmlFor="algebra-show-inverse">
                <input id="algebra-show-inverse" type="checkbox" checked={showInverse} onChange={(event) => setShowInverse(event.target.checked)} />
                <span>Show the inverse and the reflection line <MathInline>{'y=x'}</MathInline></span>
              </label>
            </div>
          )}

          <RepresentationPanel family={family} representation={representation} input={input} showInverse={showInverse} />

          {(family.id === 'exponential' || family.id === 'logarithmic') && (
            <aside className="algebra-inverse-connection" aria-labelledby="algebra-inverse-heading">
              <span className="card-label">Inverse relationship</span>
              <h4 id="algebra-inverse-heading">Exponents and logarithms undo one another</h4>
              <MathDisplay>{String.raw`y=2^x\quad\Longleftrightarrow\quad x=\log_2 y`}</MathDisplay>
              <p>Swapping every input-output pair reflects the graph across <MathInline>{'y=x'}</MathInline>. That is why the domain of one becomes the range of the other.</p>
            </aside>
          )}
        </div>
      </section>

      <FunctionPractice />
    </div>
  )
}

export default FunctionExplorer
