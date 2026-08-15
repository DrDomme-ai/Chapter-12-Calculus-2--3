import { useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const exponentRules = [
  {
    id: 'product',
    label: 'Product',
    title: 'Multiply powers with one base',
    formula: 'a^m a^n=a^{m+n}',
    condition: 'The bases must match.',
    explanation: 'Each power is a list of repeated factors. Joining the two lists gives a total of m+n copies of the same base.',
    basic: 'x^3x^5=x^8',
    calculus: String.raw`x^2\cdot x^{1/2}=x^{5/2}`,
  },
  {
    id: 'quotient',
    label: 'Quotient',
    title: 'Divide powers with one base',
    formula: String.raw`\frac{a^m}{a^n}=a^{m-n},\quad a\ne0`,
    condition: 'The base cannot be zero because the original denominator would be zero.',
    explanation: 'Matching factors cancel from numerator and denominator. The exponent difference counts the factors that remain and records where they remain.',
    basic: String.raw`\frac{5^6}{5^2}=5^4`,
    calculus: String.raw`\frac{x^7}{x^3}=x^4,\quad x\ne0`,
  },
  {
    id: 'power',
    label: 'Power of a power',
    title: 'Repeat an entire power',
    formula: String.raw`\left(a^m\right)^n=a^{mn}`,
    condition: 'Multiplying the exponents counts n groups of m factors.',
    explanation: 'The inner power contains m copies of a. Repeating that group n times produces mn copies—not m+n copies.',
    basic: String.raw`\left(2^3\right)^4=2^{12}`,
    calculus: String.raw`\left(x^{3/2}\right)^2=x^3,\quad x\ge0`,
  },
  {
    id: 'product-power',
    label: 'Power of a product',
    title: 'Apply a power to every factor',
    formula: String.raw`(ab)^n=a^n b^n`,
    condition: 'This rule distributes over multiplication, not over addition.',
    explanation: 'Repeating ab gives (ab)(ab)… . Reordering the factors gathers all n copies of a and all n copies of b.',
    basic: String.raw`(2\cdot3)^4=2^4 3^4`,
    calculus: String.raw`(3x)^4=81x^4`,
  },
  {
    id: 'zero',
    label: 'Zero exponent',
    title: 'Why a nonzero base to zero is one',
    formula: String.raw`a^0=1,\quad a\ne0`,
    condition: 'The restriction matters: this argument divides by a power of a.',
    explanation: 'Divide a power by itself. The quotient is 1, while subtracting equal exponents gives exponent 0. Those descriptions must agree.',
    basic: String.raw`7^0=1`,
    calculus: String.raw`x^0=1\text{ for }x\ne0`,
  },
  {
    id: 'negative',
    label: 'Negative exponent',
    title: 'A negative exponent changes position',
    formula: String.raw`a^{-n}=\frac{1}{a^n},\quad a\ne0`,
    condition: 'The minus sign belongs to the exponent; it does not make the value negative.',
    explanation: 'Continuing the exponent pattern downward requires dividing by a each time. Crossing exponent zero moves repeated factors into the denominator.',
    basic: String.raw`2^{-3}=\frac1{2^3}=\frac18`,
    calculus: String.raw`\frac1{x^4}=x^{-4}`,
  },
  {
    id: 'fractional',
    label: 'Fractional exponent',
    title: 'Roots are fractional powers',
    formula: String.raw`a^{1/n}=\sqrt[n]{a}`, 
    condition: 'Here n is an integer at least 2. Over the real numbers, an even root requires a≥0; an odd root accepts every real a.',
    explanation: 'The number a^(1/n) is chosen so that raising it to the nth power returns a. The exponent and the root undo one another.',
    basic: String.raw`27^{1/3}=\sqrt[3]{27}=3`,
    calculus: String.raw`\sqrt{x}=x^{1/2}\quad(x\ge0)`,
  },
]

const mistakes = [
  {
    id: 'add-powers',
    statement: 'x^2+x^3=x^5',
    correct: false,
    correction: String.raw`x^2+x^3=x^2(1+x)`,
    reason: 'Exponent addition belongs to multiplication of like bases. These terms are being added, so they are not combined into one power.',
  },
  {
    id: 'power-power',
    statement: String.raw`(x^2)^3=x^6`,
    correct: true,
    correction: String.raw`(x^2)^3=x^{2\cdot3}=x^6`,
    reason: 'Correct: three groups of two factors produce six copies of x.',
  },
  {
    id: 'binomial-cube',
    statement: String.raw`(x+y)^3=x^3+y^3`,
    correct: false,
    correction: String.raw`(x+y)^3=x^3+3x^2y+3xy^2+y^3`,
    reason: 'A power does not distribute over addition. Multiplying three copies of the binomial creates mixed terms.',
  },
  {
    id: 'negative-power',
    statement: 'x^{-4}=-x^4',
    correct: false,
    correction: String.raw`x^{-4}=\frac1{x^4},\quad x\ne0`,
    reason: 'A negative exponent forms a reciprocal. It does not place a negative sign in front of the expression.',
  },
]

const repeatedFactors = (symbol, count) => Array.from({ length: count }, (_, index) => (
  <span className="algebra-factor-token" key={`${symbol}-${index}-${count}`}>
    <MathInline>{symbol}</MathInline>
  </span>
))

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'undefined'
  if (Number.isInteger(value)) return value.toLocaleString('en-US')
  return value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
}

function liveFormula(ruleId, base, m, n) {
  const difference = m - n
  const rootIndex = Math.max(2, n)

  if (ruleId === 'product') return String.raw`${base}^{${m}}\cdot${base}^{${n}}=${base}^{${m + n}}=${formatNumber(base ** (m + n))}`
  if (ruleId === 'quotient') {
    const result = difference >= 0
      ? `${base}^{${difference}}=${formatNumber(base ** difference)}`
      : String.raw`\frac{1}{${base}^{${-difference}}}=\frac{1}{${formatNumber(base ** -difference)}}`
    return String.raw`\frac{${base}^{${m}}}{${base}^{${n}}}=${result}`
  }
  if (ruleId === 'power') return String.raw`\left(${base}^{${m}}\right)^{${n}}=${base}^{${m}\cdot${n}}=${base}^{${m * n}}`
  if (ruleId === 'product-power') return String.raw`\left(${base}\cdot${base + 1}\right)^{${n}}=${base}^{${n}}(${base + 1})^{${n}}`
  if (ruleId === 'zero') return String.raw`\frac{${base}^{${m}}}{${base}^{${m}}}=${base}^{${m}-${m}}=${base}^0=1`
  if (ruleId === 'negative') return String.raw`${base}^{-${n}}=\frac{1}{${base}^{${n}}}=\frac{1}{${formatNumber(base ** n)}}`
  return String.raw`${base}^{1/${rootIndex}}=\sqrt[${rootIndex}]{${base}}\approx${formatNumber(base ** (1 / rootIndex))}`
}

function ExponentPattern({ ruleId, base, m, n }) {
  if (ruleId === 'product') {
    return (
      <div className="algebra-exponent-pattern" aria-label={`${m} factors joined with ${n} factors make ${m + n} factors`}>
        <div><span>First power</span><div className="algebra-factor-row">{repeatedFactors(String(base), m)}</div></div>
        <span className="algebra-pattern-operation">+</span>
        <div><span>Second power</span><div className="algebra-factor-row">{repeatedFactors(String(base), n)}</div></div>
        <span className="algebra-pattern-operation">→</span>
        <div><span>One product</span><div className="algebra-factor-row algebra-factor-row--combined">{repeatedFactors(String(base), m + n)}</div></div>
      </div>
    )
  }

  if (ruleId === 'quotient') {
    const cancelled = Math.min(m, n)
    return (
      <div className="algebra-exponent-cancellation" aria-label={`${cancelled} matching factors cancel`}>
        <div><span>Numerator</span><div className="algebra-factor-row">{repeatedFactors(String(base), m)}</div></div>
        <div className="algebra-fraction-bar" />
        <div><span>Denominator</span><div className="algebra-factor-row">{repeatedFactors(String(base), n)}</div></div>
        <p>{cancelled} matching {cancelled === 1 ? 'factor cancels' : 'factors cancel'}; the uncancelled factors determine the exponent difference.</p>
      </div>
    )
  }

  if (ruleId === 'power') {
    return (
      <div className="algebra-exponent-groups" aria-label={`${n} groups, each containing ${m} factors`}>
        {Array.from({ length: n }, (_, group) => (
          <div className="algebra-factor-group" key={`power-group-${group}`}>
            <small>group {group + 1}</small>
            <div className="algebra-factor-row">{repeatedFactors(String(base), m)}</div>
          </div>
        ))}
        <p>{n} groups × {m} factors per group = {m * n} factors</p>
      </div>
    )
  }

  if (ruleId === 'product-power') {
    return (
      <div className="algebra-exponent-groups" aria-label={`${n} copies of the product ${base} times ${base + 1}`}>
        {Array.from({ length: n }, (_, group) => (
          <div className="algebra-factor-group" key={`product-group-${group}`}>
            <span className="algebra-factor-token algebra-factor-token--first">{base}</span>
            <span className="algebra-factor-token algebra-factor-token--second">{base + 1}</span>
          </div>
        ))}
        <p>Regroup by color: {n} copies of {base} and {n} copies of {base + 1}.</p>
      </div>
    )
  }

  if (ruleId === 'zero') {
    return (
      <div className="algebra-exponent-proof-pattern">
        <MathDisplay>{String.raw`\frac{${base}^{${m}}}{${base}^{${m}}}=1`}</MathDisplay>
        <span aria-hidden="true">and</span>
        <MathDisplay>{String.raw`\frac{${base}^{${m}}}{${base}^{${m}}}=${base}^{${m}-${m}}=${base}^{0}`}</MathDisplay>
        <p>Both expressions describe the same quotient, so <MathInline>{`${base}^0=1`}</MathInline>.</p>
      </div>
    )
  }

  if (ruleId === 'negative') {
    const rows = Array.from({ length: Math.min(4, n + 1) }, (_, index) => {
      const exponent = 1 - index
      const value = exponent >= 0 ? base ** exponent : `1/${base ** -exponent}`
      return { exponent, value }
    })
    return (
      <div className="algebra-exponent-step-pattern">
        {rows.map((row, index) => (
          <div key={row.exponent}>
            <MathInline>{`${base}^{${row.exponent}}`}</MathInline>
            <span>{index ? `÷ ${base}` : 'start'}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
        <p>Moving one exponent step down divides the value by {base}.</p>
      </div>
    )
  }

  const rootIndex = Math.max(2, n)
  return (
    <div className="algebra-exponent-proof-pattern">
      <MathDisplay>{String.raw`\left(a^{1/n}\right)^n=a`}</MathDisplay>
      <MathDisplay>{String.raw`\left(${base}^{1/${rootIndex}}\right)^{${rootIndex}}=${base}`}</MathDisplay>
      <p>The root is the number whose {rootIndex}th power returns {base}.</p>
    </div>
  )
}

function ExponentMistakeLab() {
  const [answers, setAnswers] = useState({})

  const answer = (id, choice) => {
    setAnswers((current) => ({ ...current, [id]: choice }))
  }

  return (
    <section className="algebra-exponent-mistakes" aria-labelledby="algebra-exponent-mistakes-heading">
      <div className="algebra-lab-heading">
        <div>
          <span className="card-label">Exponent mistake lab</span>
          <h3 id="algebra-exponent-mistakes-heading">Does the rule actually apply?</h3>
        </div>
        <p>Classify each statement before opening its correction.</p>
      </div>
      <div className="algebra-mistake-grid">
        {mistakes.map((mistake, index) => {
          const selected = answers[mistake.id]
          const isRight = selected && ((selected === 'correct') === mistake.correct)
          return (
            <article className="algebra-mistake-card" key={mistake.id}>
              <span className="card-label">Statement {index + 1}</span>
              <MathDisplay>{mistake.statement}</MathDisplay>
              <div className="algebra-mistake-actions" role="group" aria-label={`Classify statement ${index + 1}`}>
                <button type="button" aria-pressed={selected === 'correct'} onClick={() => answer(mistake.id, 'correct')}>Correct</button>
                <button type="button" aria-pressed={selected === 'incorrect'} onClick={() => answer(mistake.id, 'incorrect')}>Needs correction</button>
              </div>
              {selected && (
                <div className={isRight ? 'algebra-feedback is-correct' : 'algebra-feedback is-incorrect'} role="status">
                  <strong>{isRight ? 'Good diagnosis.' : 'Look again at the operation.'}</strong>
                  {isRight && (
                    <>
                      <p>{mistake.reason}</p>
                      <MathDisplay>{mistake.correction}</MathDisplay>
                    </>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function ExponentRulesLab() {
  const [ruleId, setRuleId] = useState('product')
  const [base, setBase] = useState(2)
  const [m, setM] = useState(3)
  const [n, setN] = useState(2)
  const rule = exponentRules.find((item) => item.id === ruleId) ?? exponentRules[0]

  const chooseRule = (nextId) => {
    setRuleId(nextId)
    if (nextId === 'fractional' && n < 2) setN(2)
  }

  return (
    <div className="algebra-exponent-module">
      <section className="algebra-exponent-lab" aria-labelledby="algebra-exponent-heading">
        <header className="algebra-lab-heading">
          <div>
            <span className="card-label">Exponent pattern laboratory</span>
            <h3 id="algebra-exponent-heading">Build the rule from repeated factors</h3>
          </div>
          <p><MathInline>{'a^n'}</MathInline> means n copies of a multiplied together when n is a positive integer. The other exponent rules extend that pattern consistently.</p>
        </header>

        <div className="algebra-exponent-tabs" role="tablist" aria-label="Choose an exponent rule">
          {exponentRules.map((item) => (
            <button
              id={`algebra-exponent-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={ruleId === item.id}
              aria-controls="algebra-exponent-panel"
              className={ruleId === item.id ? 'active' : ''}
              onClick={() => chooseRule(item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id="algebra-exponent-panel" role="tabpanel" aria-labelledby={`algebra-exponent-tab-${rule.id}`} className="algebra-exponent-panel">
          <div className="algebra-exponent-rule-copy">
            <span className="card-label">{rule.title}</span>
            <MathDisplay>{rule.formula}</MathDisplay>
            <p>{rule.explanation}</p>
            <p className="algebra-rule-condition"><strong>Use it carefully:</strong> {rule.condition}</p>
            <div className="algebra-exponent-examples">
              <div><small>Basic example</small><MathDisplay>{rule.basic}</MathDisplay></div>
              <div><small>Calculus-ready example</small><MathDisplay>{rule.calculus}</MathDisplay></div>
            </div>
          </div>

          <div className="algebra-exponent-controls" aria-label="Change values in the exponent pattern">
            <label htmlFor="algebra-exponent-base">
              <span>base = {base}</span>
              <input id="algebra-exponent-base" type="range" min="2" max="5" step="1" value={base} onChange={(event) => setBase(Number(event.target.value))} />
            </label>
            <label htmlFor="algebra-exponent-m">
              <span>m = {m}</span>
              <input id="algebra-exponent-m" type="range" min="1" max="5" step="1" value={m} onChange={(event) => setM(Number(event.target.value))} />
            </label>
            <label htmlFor="algebra-exponent-n">
              <span>n = {n}</span>
              <input id="algebra-exponent-n" type="range" min={ruleId === 'fractional' ? '2' : '1'} max="5" step="1" value={n} onChange={(event) => setN(Number(event.target.value))} />
            </label>
          </div>

          <div className="algebra-exponent-live" aria-live="polite">
            <small>Live example</small>
            <MathDisplay>{liveFormula(ruleId, base, m, n)}</MathDisplay>
            <ExponentPattern ruleId={ruleId} base={base} m={m} n={n} />
          </div>
        </div>
      </section>
      <ExponentMistakeLab />
    </div>
  )
}

export default ExponentRulesLab
