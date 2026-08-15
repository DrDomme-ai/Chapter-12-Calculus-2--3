import ChapterCard from '../ChapterCard'

export default function ReviewPathChooser({ onHome, onSelectCourse }) {
  return (
    <div className="page review-path-page">
      <button className="text-button" type="button" onClick={onHome}>
        <span aria-hidden="true">&larr;</span> Home
      </button>

      <header className="review-path-header">
        <p className="eyebrow">Fundamentals review</p>
        <h1>Shared fundamentals review for both calculus tracks.</h1>
        <p>
          Begin on a single shared review platform. Then choose the track that matches your next
          course: MATH 243 or MATH 344.
        </p>
      </header>

      <section className="course-grid" aria-label="Fundamentals review paths">
        <ChapterCard
          number="PREPARING FOR MATH 243"
          title="Calculus II Fundamentals"
          description="Algebra, functions, trigonometry, limits, continuity, derivatives, derivative applications, and integrals."
          actionLabel="Open Calculus II review"
          onClick={() => onSelectCourse('calc2')}
        />
        <ChapterCard
          number="PREPARING FOR MATH 344"
          title="Calculus III Readiness"
          description="Shared fundamentals followed by integration techniques, parametric equations, polar coordinates, sequences, and Taylor series."
          actionLabel="Open Calculus III review"
          onClick={() => onSelectCourse('calc3')}
          accent
        />
      </section>
    </div>
  )
}
