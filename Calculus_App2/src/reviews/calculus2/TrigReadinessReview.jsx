import ReviewRunner from '../../components/review/ReviewRunner'
import { trigReviewQuestions, trigReviewStations } from '../../data/trigReadiness'

export default function TrigReadinessReview({
  completed,
  onCompletedChange,
  onReviewCenter,
  onHome,
  onContinue,
  eyebrowText = 'Shared Fundamental Review',
  backLabel = 'Trigonometry Overview',
}) {
  return (
    <ReviewRunner
      className="trig-readiness-review"
      eyebrowText={eyebrowText}
      titleLines={['Trigonometry', 'Readiness Review']}
      description="Refresh the angle, identity, graph, inverse-function, and equation skills used throughout Calculus II."
      topicLabel="Trig topics"
      topicDescription="Work in order or jump directly to a skill you want to refresh."
      stations={trigReviewStations}
      questions={trigReviewQuestions}
      completed={completed}
      onCompletedChange={onCompletedChange}
      onReviewCenter={onReviewCenter}
      onHome={onHome}
      onContinue={onContinue}
      backLabel={backLabel}
      summaryHeadings={{
        complete: 'Your trig foundation is ready.',
        nearly: 'You are nearly ready.',
        continue: 'Keep building trig fluency.',
      }}
      summaryDescription="trigonometry"
    />
  )
}
