import ReviewRunner from '../../components/review/ReviewRunner'
import { derivativeReviewQuestions, derivativeReviewStations } from '../../data/courseReviews/calculus1'

export default function DerivativesReadinessReview({
  completed,
  onCompletedChange,
  onReviewCenter,
  onHome,
  onContinue,
  eyebrowText = 'Shared Fundamental Review',
}) {
  return (
    <ReviewRunner
      className="derivatives-readiness-review"
      eyebrowText={eyebrowText}
      titleLines={['Derivatives', 'Readiness Review']}
      description="Refresh differentiation rules, connect derivatives to graphs, and practice choosing the right rule before Calculus II."
      topicLabel="Derivative topics"
      topicDescription="Work in order or jump directly to the differentiation rule you want to strengthen."
      stations={derivativeReviewStations}
      questions={derivativeReviewQuestions}
      completed={completed}
      onCompletedChange={onCompletedChange}
      onReviewCenter={onReviewCenter}
      onHome={onHome}
      onContinue={onContinue}
      backLabel="Fundamental Review"
      summaryHeadings={{
        complete: 'Your derivative foundation is ready.',
        nearly: 'Your derivative skills are nearly ready.',
        continue: 'Keep strengthening derivative fluency.',
      }}
      summaryDescription="derivatives"
    />
  )
}
