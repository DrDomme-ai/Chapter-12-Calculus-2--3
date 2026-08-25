const sections = [
  ['12.1', 'Three-Dimensional Coordinate Systems', true],
  ['12.2', 'Vectors', true],
  ['12.3', 'The Dot Product', true],
  ['12.4', 'The Cross Product', true],
  ['12.5', 'Equations of Lines and Planes', true],
  ['12.6', 'Cylinders and Quadric Surfaces', true],
]

function ChapterMenu({
  course,
  onBack,
  onOpenLecture,
  onOpenJsonDemo,
  onOpenReview,
  backLabel = 'Courses',
  reviewLabel = 'Open readiness review',
}) {
  return (
    <div className="page chapter-page">
      <button className="text-button" type="button" onClick={onBack}>← {backLabel}</button>
      <header className="chapter-header">
        <p className="eyebrow">{course}</p>
        <p className="chapter-number">Chapter 12</p>
        <h1>Vectors and the<br />Geometry of Space</h1>
        <p>Develop the language and geometric intuition needed to describe mathematics in three dimensions.</p>
      </header>
      <div className="chapter-demo-card">
        <button className="primary-button" type="button" onClick={onOpenReview}>
          {reviewLabel}
        </button>
        <p className="demo-note">Six long, self-paced sections preserve definitions, interactives, formula reconstruction, worked solutions, concept traps, and exam practice.</p>
      </div>
      <div className="chapter-demo-card">
        <button className="primary-button" type="button" onClick={onOpenJsonDemo}>
          Open instructor/student lecture scaffold
        </button>
        <p className="demo-note">This demo shows the JSON-driven lesson with instructor solution controls and student interaction.</p>
      </div>
      <section className="chapter-list" aria-label="Chapter 12 sections">
        {sections.map(([number, title, available]) => (
          <button key={number} type="button" className={`section-card${available ? ' available' : ''}`} onClick={number==='12.1'?onOpenLecture:onOpenReview} disabled={!available}>
            <span className="section-number">{number}</span>
            <span className="section-title">{title}</span>
            <span className={`status ${available ? 'ready' : ''}`}>{available ? 'Begin lecture →' : 'Coming Soon'}</span>
          </button>
        ))}
      </section>
    </div>
  )
}

export default ChapterMenu
