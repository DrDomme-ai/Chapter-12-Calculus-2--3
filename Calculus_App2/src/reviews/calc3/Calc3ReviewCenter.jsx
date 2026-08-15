import ReviewDashboard from '../../components/review/ReviewDashboard'

export default function Calc3ReviewCenter({ progress, onHome, onOpenModule, onContinue }) {
  return (
    <div className="review-center-page review-foundation-page calc3-review-foundation">
      <nav className="review-center-toolbar" aria-label="Calculus III review navigation">
        <button type="button" onClick={onHome}><span aria-hidden="true">&larr;</span> Courses</button>
        <button className="review-center-chapter-link" type="button" onClick={onContinue}>
          Continue to Chapter 12 <span aria-hidden="true">&rarr;</span>
        </button>
      </nav>

      <ReviewDashboard
        courseId="calc3"
        completedMaps={progress}
        onOpenModule={onOpenModule}
        onContinue={onContinue}
        continueLabel="Begin Calculus III"
      />
    </div>
  )
}
