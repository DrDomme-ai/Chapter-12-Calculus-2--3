const methods = [
  {
    label: 'SEE',
    text: 'Use graphs, animations, and geometric models to make abstract ideas visible.',
  },
  {
    label: 'UNDERSTAND',
    text: 'Connect definitions and formulas to the reasoning behind them.',
  },
  {
    label: 'PRACTICE',
    text: 'Work through examples, guided problems, hints, and common mistakes.',
  },
  {
    label: 'MASTER',
    text: 'Use readiness checks and mastery assessments to identify what to review next.',
  },
]

export default function LearningMethods() {
  return (
    <section className="home-methods-section" aria-labelledby="learning-methods-heading">
      <div className="section-heading">
        <p className="eyebrow">How You Will Learn</p>
      </div>
      <div className="methods-grid">
        {methods.map((method) => (
          <div key={method.label} className="method-card">
            <span className="method-label">{method.label}</span>
            <p>{method.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
