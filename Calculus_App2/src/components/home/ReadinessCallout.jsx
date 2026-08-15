export default function ReadinessCallout({ onOpenReadiness }) {
  const progression = ['Algebra', 'Trigonometry', 'Calculus I', 'Calculus II', 'Calculus III']

  return (
    <section className="home-readiness-section" aria-labelledby="fundamental-review-title">
      <div className="home-readiness-copy">
        <p className="eyebrow">Fundamental Review</p>
        <h2 id="fundamental-review-title">Build the foundation before moving forward.</h2>
        <p className="home-hero-description">
          Review the essential mathematics that connects algebra, trigonometry, and the calculus sequence. Explore definitions, formulas, visualizations, worked examples, guided practice, and mastery checks.
        </p>
        <button className="primary-button" type="button" onClick={onOpenReadiness}>
          START FUNDAMENTAL REVIEW <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <aside className="readiness-preview-card" aria-label="Mathematical learning progression: Algebra, then Trigonometry, then Calculus I, then Calculus II, then Calculus III">
        <span className="card-label">Mathematical progression</span>
        <div className="course-card-track" aria-hidden="true">
          {progression.map((stage, index) => (
            <span key={stage} className="path-chip">
              <span className="chip-label">{stage}</span>
              {index < progression.length - 1 && <span className="chip-arrow">&rarr;</span>}
            </span>
          ))}
        </div>
        <p className="sr-only">Algebra leads to Trigonometry, which leads to Calculus I, Calculus II, and Calculus III.</p>
      </aside>
    </section>
  )
}
