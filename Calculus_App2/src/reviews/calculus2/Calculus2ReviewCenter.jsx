import ReviewDashboard from '../../components/review/ReviewDashboard'
import Calculus2CourseRoadmap from './Calculus2CourseRoadmap'

export default function Calculus2ReviewCenter({
  progress,
  onHome,
  onOpenModule,
  onContinue,
}) {
  return (
    <div className="review-center-page review-foundation-page">
      <nav className="review-center-toolbar" aria-label="Calculus II review navigation">
        <button type="button" onClick={onHome}><span aria-hidden="true">&larr;</span> Courses</button>
        <button className="review-center-chapter-link" type="button" onClick={onContinue}>
          Continue to Chapter 12 <span aria-hidden="true">&rarr;</span>
        </button>
      </nav>

      <ReviewDashboard
        courseId="calc2"
        completedMaps={progress}
        onOpenModule={onOpenModule}
        onContinue={onContinue}
        continueLabel="Begin Calculus II"
      />

      <section className="review-course-roadmap" aria-label="Calculus II course roadmap">
        <Calculus2CourseRoadmap />
      </section>
    </div>
  )
}
