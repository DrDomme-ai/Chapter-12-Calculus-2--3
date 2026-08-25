import { MathDisplay } from '../MathDisplay'

const looksLikeMath = (value) => /\\[a-zA-Z]+|[_^]|\b(?:lim|sin|cos|tan|ln|sqrt)\b/.test(String(value))

function SafeValue({ value, math = false }) {
  if (value == null || value === '') return null
  if (typeof value === 'string' || typeof value === 'number') {
    return math || looksLikeMath(value) ? <MathDisplay>{String(value)}</MathDisplay> : <p>{String(value)}</p>
  }
  if (Array.isArray(value)) {
    return <div className="detailed-solution-list">{value.map((item, index) => <SafeValue value={item} key={index} />)}</div>
  }
  if (value.kind && Object.hasOwn(value, 'value')) {
    if (value.kind === 'math') return <SafeValue value={value.value} math />
    if (value.kind === 'list') return <ol>{value.value.map((item, index) => <li key={index}><SafeValue value={item} /></li>)}</ol>
    return <SafeValue value={value.value} />
  }
  return <div className="structured-solution-object">{Object.entries(value).map(([key, item]) => (
    <section key={key}><strong>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</strong><SafeValue value={item} math={/math|formula|answer|work/i.test(key)} /></section>
  ))}</div>
}

const section = (number, title, value, options = {}) => value == null || value === '' ? null : (
  <section className={`detailed-solution-section ${options.className || ''}`} key={title}>
    <h4>{number}. {title}</h4>
    <SafeValue value={value} math={options.math} />
  </section>
)

export default function DetailedSolutionPanel({ solution = {}, fallbackParts = [], visibleParts, onShowPart, onShowAll, onHide }) {
  const structured = !Array.isArray(solution) && typeof solution === 'object' ? solution : {}
  const parts = structured.steps || structured.stepByStep || fallbackParts
  const shown = visibleParts == null ? parts.length : visibleParts
  const hasParts = parts.length > 0

  return <section className="detailed-solution-panel" aria-label="Detailed solution">
    <header><div><span>Optional learning support</span><h3>Detailed Solution</h3></div><button type="button" onClick={onHide}>Hide solution</button></header>
    {section(1, 'What are we being asked to find?', structured.goal || structured.whatToFind)}
    {section(2, 'How do I recognize the method?', structured.recognition || structured.methodClue)}
    {section(3, 'Formula / idea', structured.formula || structured.idea, { math: true })}
    {hasParts && <section className="detailed-solution-section">
      <h4>4. Step-by-step work</h4>
      <ol className="detailed-solution-steps">{parts.slice(0, shown).map((part, index) => <li key={index}><SafeValue value={part} /></li>)}</ol>
      {shown < parts.length && <button type="button" onClick={onShowPart}>Show next step</button>}
      {shown < parts.length && <button type="button" onClick={onShowAll}>Show all steps</button>}
    </section>}
    {section(5, 'Why did that step work?', structured.why || structured.reasoning)}
    {section(6, 'Final answer', structured.finalAnswer || structured.answer, { math: true, className: 'final-answer-section' })}
    {section(7, 'Does this answer make sense?', structured.quickCheck || structured.check)}
    {section(8, 'Common mistake', structured.commonMistakes || structured.commonMistake, { className: 'mistake-section' })}
    {section(9, 'One thing to remember', structured.takeaway || structured.oneThingToRemember, { className: 'takeaway-section' })}
    {!Object.keys(structured).length && !hasParts && <p>This solution has not yet been authored. Flagged for instructor review.</p>}
  </section>
}

export { SafeValue }
