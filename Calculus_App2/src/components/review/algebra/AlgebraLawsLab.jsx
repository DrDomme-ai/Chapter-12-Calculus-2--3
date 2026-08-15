import { useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const laws = [
  {
    id: 'add-commutative',
    shortLabel: 'Add: order',
    title: 'Commutative Law of Addition',
    formula: 'a+b=b+a',
    explanation: 'Changing the order of two addends changes where we begin counting, but not the total we reach.',
    example: '4+7=7+4=11',
    calculusExample: String.raw`\Delta x+h=h+\Delta x`,
  },
  {
    id: 'add-associative',
    shortLabel: 'Add: grouping',
    title: 'Associative Law of Addition',
    formula: 'a+(b+c)=(a+b)+c',
    explanation: 'When every operation is addition, parentheses may regroup the work without changing the sum.',
    example: '2+(3+4)=(2+3)+4=9',
    calculusExample: String.raw`f(x)+\bigl(g(x)+h(x)\bigr)=\bigl(f(x)+g(x)\bigr)+h(x)`,
  },
  {
    id: 'multiply-commutative',
    shortLabel: 'Multiply: order',
    title: 'Commutative Law of Multiplication',
    formula: 'ab=ba',
    explanation: 'The same rectangle can be described by either side first. Its orientation may change; its area does not.',
    example: String.raw`3\cdot 5=5\cdot 3=15`,
    calculusExample: String.raw`h\,f\prime(x)=f\prime(x)\,h`,
  },
  {
    id: 'multiply-associative',
    shortLabel: 'Multiply: grouping',
    title: 'Associative Law of Multiplication',
    formula: 'a(bc)=(ab)c',
    explanation: 'A product of three factors may be assembled in stages. Regrouping the factors leaves the product intact.',
    example: String.raw`2(3\cdot4)=(2\cdot3)4=24`,
    calculusExample: String.raw`\Delta x\bigl(f(x)g(x)\bigr)=\bigl(\Delta x f(x)\bigr)g(x)`,
  },
  {
    id: 'distributive',
    shortLabel: 'Distribute',
    title: 'Distributive Law',
    formula: 'a(b+c)=ab+ac',
    explanation: 'Multiplying a sum scales every part of that sum. In the area model, one large rectangle is exactly the two smaller rectangles joined together.',
    example: '3(x+4)=3x+12',
    calculusExample: String.raw`h\bigl(f(x)+g(x)\bigr)=hf(x)+hg(x)`,
  },
]

function FactorBlocks({ count, x, y, label, tone }) {
  return (
    <g aria-label={`${count} blocks representing ${label}`}>
      {Array.from({ length: count }, (_, index) => (
        <rect
          key={`${label}-${index}`}
          x={x + index * 31}
          y={y}
          width="25"
          height="38"
          rx="5"
          className={`algebra-law-block algebra-law-block--${tone}`}
        />
      ))}
      <text x={x + ((count - 1) * 31 + 25) / 2} y={y + 25} textAnchor="middle" className="algebra-law-block-label">
        {label}
      </text>
    </g>
  )
}

function AdditionOrderVisual({ a, b, transformed }) {
  const first = transformed ? b : a
  const second = transformed ? a : b
  const firstName = transformed ? 'b' : 'a'
  const secondName = transformed ? 'a' : 'b'
  const firstWidth = first * 31

  return (
    <svg className="algebra-law-svg" viewBox="0 0 620 180" role="img" aria-label={`${firstName} plus ${secondName} gives ${a + b}; the groups may swap without changing the total`}>
      <FactorBlocks count={first} x={48} y={57} label={firstName} tone="teal" />
      <text x={58 + firstWidth} y="83" className="algebra-law-symbol">+</text>
      <FactorBlocks count={second} x={88 + firstWidth} y={57} label={secondName} tone="aqua" />
      <text x="310" y="138" textAnchor="middle" className="algebra-law-result">total = {a + b}</text>
    </svg>
  )
}

function AdditionGroupingVisual({ a, b, c, transformed }) {
  const groups = transformed
    ? [{ label: 'a + b', value: a + b, tone: 'teal' }, { label: 'c', value: c, tone: 'aqua' }]
    : [{ label: 'a', value: a, tone: 'teal' }, { label: 'b + c', value: b + c, tone: 'aqua' }]
  const groupWidth = 230

  return (
    <svg className="algebra-law-svg" viewBox="0 0 620 210" role="img" aria-label={`${transformed ? 'a plus b, then c' : 'b plus c, then a'} gives ${a + b + c}`}>
      {groups.map((group, groupIndex) => (
        <g key={group.label}>
          <rect x={45 + groupIndex * 300} y="40" width={groupWidth} height="92" rx="14" className={`algebra-law-group algebra-law-group--${group.tone}`} />
          <text x={45 + groupIndex * 300 + groupWidth / 2} y="66" textAnchor="middle" className="algebra-law-group-title">{group.label}</text>
          <text x={45 + groupIndex * 300 + groupWidth / 2} y="105" textAnchor="middle" className="algebra-law-group-value">{group.value}</text>
        </g>
      ))}
      <text x="310" y="96" textAnchor="middle" className="algebra-law-symbol">+</text>
      <text x="310" y="174" textAnchor="middle" className="algebra-law-result">same sum: {a + b + c}</text>
    </svg>
  )
}

function MultiplicationOrderVisual({ a, b, transformed }) {
  const horizontal = transformed ? a : b
  const vertical = transformed ? b : a
  const width = 54 * horizontal
  const height = 28 * vertical
  const x = (620 - width) / 2
  const y = (225 - height) / 2

  return (
    <svg className="algebra-law-svg" viewBox="0 0 620 270" role="img" aria-label={`Rectangle ${vertical} by ${horizontal}, area ${a * b}`}>
      <rect x={x} y={y} width={width} height={height} className="algebra-law-area" />
      {Array.from({ length: horizontal - 1 }, (_, index) => (
        <line key={`vertical-${index}`} x1={x + (index + 1) * 54} y1={y} x2={x + (index + 1) * 54} y2={y + height} className="algebra-law-grid" />
      ))}
      {Array.from({ length: vertical - 1 }, (_, index) => (
        <line key={`horizontal-${index}`} x1={x} y1={y + (index + 1) * 28} x2={x + width} y2={y + (index + 1) * 28} className="algebra-law-grid" />
      ))}
      <text x={x + width / 2} y={y - 12} textAnchor="middle" className="algebra-law-dimension">{transformed ? 'a' : 'b'} = {horizontal}</text>
      <text x={x - 18} y={y + height / 2} textAnchor="middle" transform={`rotate(-90 ${x - 18} ${y + height / 2})`} className="algebra-law-dimension">{transformed ? 'b' : 'a'} = {vertical}</text>
      <text x="310" y="252" textAnchor="middle" className="algebra-law-result">area = {a * b} square units</text>
    </svg>
  )
}

function MultiplicationGroupingVisual({ a, b, c, transformed }) {
  return (
    <svg className="algebra-law-svg" viewBox="0 0 620 245" role="img" aria-label={`${transformed ? 'a times b grouped, then multiplied by c' : 'b times c grouped, then multiplied by a'} gives ${a * b * c}`}>
      <rect x="60" y="42" width="500" height="128" rx="16" className="algebra-law-nested algebra-law-nested--outer" />
      <rect x={transformed ? 98 : 205} y="69" width={transformed ? 250 : 250} height="74" rx="12" className="algebra-law-nested algebra-law-nested--inner" />
      <text x="310" y="31" textAnchor="middle" className="algebra-law-group-title">
        {transformed ? `(${a} · ${b}) groups, then × ${c}` : `${a} groups of (${b} · ${c})`}
      </text>
      <text x="310" y="115" textAnchor="middle" className="algebra-law-group-value">{a * b * c}</text>
      <text x="310" y="211" textAnchor="middle" className="algebra-law-result">regrouping changes the stages, not the product</text>
    </svg>
  )
}

function DistributiveVisual({ a, b, c, transformed }) {
  const leftWidth = (b / (b + c)) * 470
  const rightWidth = 470 - leftWidth

  return (
    <svg className="algebra-law-svg algebra-law-svg--distributive" viewBox="0 0 660 300" role="img" aria-label={`Rectangle height ${a} and width ${b} plus ${c}. Total area ${a * (b + c)}, split into areas ${a * b} and ${a * c}.`}>
      <text x="350" y="28" textAnchor="middle" className="algebra-law-dimension">width = b + c = {b + c}</text>
      <rect x="115" y="52" width="470" height="160" className="algebra-law-area algebra-law-area--whole" />
      {transformed && (
        <>
          <rect x="115" y="52" width={leftWidth} height="160" className="algebra-law-area algebra-law-area--left" />
          <rect x={115 + leftWidth} y="52" width={rightWidth} height="160" className="algebra-law-area algebra-law-area--right" />
          <line x1={115 + leftWidth} y1="52" x2={115 + leftWidth} y2="212" className="algebra-law-split-line" />
          <text x={115 + leftWidth / 2} y="83" textAnchor="middle" className="algebra-law-dimension">b = {b}</text>
          <text x={115 + leftWidth + rightWidth / 2} y="83" textAnchor="middle" className="algebra-law-dimension">c = {c}</text>
          <text x={115 + leftWidth / 2} y="148" textAnchor="middle" className="algebra-law-area-label">ab = {a * b}</text>
          <text x={115 + leftWidth + rightWidth / 2} y="148" textAnchor="middle" className="algebra-law-area-label">ac = {a * c}</text>
        </>
      )}
      {!transformed && <text x="350" y="145" textAnchor="middle" className="algebra-law-area-label">a(b + c) = {a * (b + c)}</text>}
      <text x="84" y="132" textAnchor="middle" transform="rotate(-90 84 132)" className="algebra-law-dimension">a = {a}</text>
      <text x="350" y="258" textAnchor="middle" className="algebra-law-result">
        {transformed ? `${a * b} + ${a * c} = ${a * (b + c)}` : `${a}(${b} + ${c}) = ${a * (b + c)}`}
      </text>
    </svg>
  )
}

function LawVisual({ law, a, b, c, transformed }) {
  if (law === 'add-commutative') return <AdditionOrderVisual a={a} b={b} transformed={transformed} />
  if (law === 'add-associative') return <AdditionGroupingVisual a={a} b={b} c={c} transformed={transformed} />
  if (law === 'multiply-commutative') return <MultiplicationOrderVisual a={a} b={b} transformed={transformed} />
  if (law === 'multiply-associative') return <MultiplicationGroupingVisual a={a} b={b} c={c} transformed={transformed} />
  return <DistributiveVisual a={a} b={b} c={c} transformed={transformed} />
}

export function AlgebraLawsLab() {
  const [lawId, setLawId] = useState('distributive')
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [c, setC] = useState(2)
  const [transformed, setTransformed] = useState(false)
  const law = laws.find((item) => item.id === lawId) ?? laws[0]

  const chooseLaw = (nextLaw) => {
    setLawId(nextLaw)
    setTransformed(false)
  }

  const actionLabel = lawId === 'distributive'
    ? (transformed ? 'Recombine the area' : 'Split the rectangle')
    : (transformed ? 'Return to the first form' : 'Reorganize the quantities')

  return (
    <section className="algebra-laws-lab" aria-labelledby="algebra-laws-heading">
      <header className="algebra-lab-heading">
        <div>
          <span className="card-label">Interactive structure lab</span>
          <h3 id="algebra-laws-heading">The rules preserve meaning</h3>
        </div>
        <p>Change the values, then reorganize the picture. The appearance changes while the quantity stays fixed.</p>
      </header>

      <div className="algebra-law-tabs" role="tablist" aria-label="Choose an algebra law">
        {laws.map((item) => (
          <button
            id={`algebra-law-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={lawId === item.id}
            aria-controls="algebra-law-panel"
            className={lawId === item.id ? 'active' : ''}
            onClick={() => chooseLaw(item.id)}
            key={item.id}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>

      <div
        id="algebra-law-panel"
        role="tabpanel"
        aria-labelledby={`algebra-law-tab-${law.id}`}
        className={`algebra-law-panel algebra-law-panel--${law.id}`}
      >
        <div className="algebra-law-copy">
          <span className="card-label">{law.title}</span>
          <MathDisplay>{law.formula}</MathDisplay>
          <p>{law.explanation}</p>
          <dl className="algebra-law-examples">
            <div>
              <dt>Basic example</dt>
              <dd><MathInline>{law.example}</MathInline></dd>
            </div>
            <div>
              <dt>Calculus connection</dt>
              <dd><MathInline>{law.calculusExample}</MathInline></dd>
            </div>
          </dl>
        </div>

        <div className="algebra-law-controls" aria-label="Choose values for the law">
          {[
            { id: 'a', value: a, setter: setA },
            { id: 'b', value: b, setter: setB },
            { id: 'c', value: c, setter: setC },
          ].map((control) => (
            <label key={control.id} htmlFor={`algebra-law-${control.id}`} className={lawId.includes('commutative') && control.id === 'c' ? 'algebra-control--unused' : ''}>
              <span><MathInline>{control.id}</MathInline> = {control.value}</span>
              <input
                id={`algebra-law-${control.id}`}
                type="range"
                min="1"
                max="6"
                step="1"
                value={control.value}
                disabled={lawId.includes('commutative') && control.id === 'c'}
                onChange={(event) => control.setter(Number(event.target.value))}
              />
            </label>
          ))}
        </div>

        <div className={transformed ? 'algebra-law-stage is-transformed' : 'algebra-law-stage'} aria-live="polite">
          <LawVisual law={lawId} a={a} b={b} c={c} transformed={transformed} />
        </div>

        <div className="algebra-law-actions">
          <button type="button" onClick={() => setTransformed((current) => !current)}>
            {actionLabel}
          </button>
          {lawId === 'distributive' && (
            <div className="algebra-distributive-connection" aria-live="polite">
              <span>Algebra translation</span>
              <MathInline>{'3(x+4)=3x+12'}</MathInline>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AlgebraLawsLab
