import ReviewRunner from '../../components/review/ReviewRunner'
import { limitReviewQuestions, limitReviewStations } from '../../data/courseReviews/calculus1'

export default function LimitsReadinessReview({
  completed,
  onCompletedChange,
  onReviewCenter,
  onHome,
  onContinue,
  eyebrowText = 'Shared Fundamental Review',
}) {
  return (
    <ReviewRunner
      className="limits-readiness-review"
      eyebrowText={eyebrowText}
      titleLines={['Limits', 'Readiness Review']}
      description="Reconnect graphical, numerical, and algebraic ideas about limits before applying them throughout Calculus II."
      topicLabel="Limit topics"
      topicDescription="Complete the activities in order or jump to the kind of limit you want to practice."
      stations={limitReviewStations}
      questions={limitReviewQuestions}
      completed={completed}
      onCompletedChange={onCompletedChange}
      onReviewCenter={onReviewCenter}
      onHome={onHome}
      onContinue={onContinue}
      backLabel="Fundamental Review"
      summaryHeadings={{
        complete: 'Your limits foundation is ready.',
        nearly: 'Your limit skills are nearly ready.',
        continue: 'Keep strengthening limit intuition.',
      }}
      summaryDescription="limits"
    />
  )
}
