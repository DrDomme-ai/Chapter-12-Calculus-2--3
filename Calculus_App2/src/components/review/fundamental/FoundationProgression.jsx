const defaultStages = ['Algebra', 'Trigonometry', 'Calculus I', 'Calculus II', 'Calculus III']

export default function FoundationProgression({ current, stages = defaultStages, className = '' }) {
  return (
    <div
      className={`algebra-progression ${className}`.trim()}
      aria-label={`${stages.join(', then ')}. Current stage: ${current}.`}
    >
      {stages.map((stage, index) => (
        <span key={stage} className={stage === current ? 'current' : ''}>
          {stage}
          {index < stages.length - 1 && <i aria-hidden="true">→</i>}
        </span>
      ))}
    </div>
  )
}

