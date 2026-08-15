import ReviewRunner from '../../components/review/ReviewRunner'
import { expLogReviewQuestions, expLogReviewStations } from '../../data/expLogReadiness'

export default function ExpLogReadinessReview({
  completed,
  onCompletedChange,
  onReviewCenter,
  onHome,
  onContinue,
  eyebrowText = 'Shared Fundamental Review',
}) {
  return (
    <ReviewRunner
      className="exp-log-readiness-review"
      eyebrowText={eyebrowText}
      titleLines={['Exponential, Logarithmic', '& Inverse Trig Derivatives']}
      description="Practice the derivative structures that connect exponentials, logarithms, inverse trigonometric functions, and the Chain Rule."
      topicLabel="Exp, log & inverse-trig topics"
      topicDescription="Complete all activities in order or jump directly to a family of derivative rules."
      stations={expLogReviewStations}
      questions={expLogReviewQuestions}
      completed={completed}
      onCompletedChange={onCompletedChange}
      onReviewCenter={onReviewCenter}
      onHome={onHome}
      onContinue={onContinue}
      backLabel="Fundamental Review"
      summaryHeadings={{
        complete: 'Your exponential and logarithmic derivative foundation is ready.',
        nearly: 'These derivative skills are nearly ready.',
        continue: 'Keep connecting the derivative layers.',
      }}
      summaryDescription="exponential, logarithmic, and inverse-trig derivative"
    />
  )
}
