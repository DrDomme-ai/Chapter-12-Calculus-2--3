/* CALCULUS I REVIEW — START HERE */

import { limitReviewStations, limitReviewQuestions } from '../../limitsReadiness'
import { expLogReviewStations, expLogReviewQuestions } from '../../expLogReadiness'

export { limitReviewStations, limitReviewQuestions } from '../../limitsReadiness'
export {
  continuityReview,
  derivativesReview,
  derivativesReview as derivativeApplicationsReview,
  integralsReview,
  integralsReview as integralFoundationsReview,
  flattenReviewQuestions,
} from './calculus1FullReviewContent'
export { derivativeReviewStations, derivativeReviewQuestions } from '../../derivativesReadiness'
export * from '../../expLogReadiness'


// Complete review objects let every Calculus I route use the same renderer.
export const limitsReview = {
  titleLines: ['Limits', 'Fundamental Review'],
  description: 'Reconnect graphical, numerical, and algebraic ideas about limits before applying them throughout calculus.',
  topicLabel: 'Limit topics',
  topicDescription: 'Complete the activities in order or jump to the kind of limit you want to practice.',
  stations: limitReviewStations,
  questions: limitReviewQuestions,
}

export const exponentialLogReview = {
  titleLines: ['Exponential, Logarithmic', '& Inverse Trig Derivatives'],
  description: 'Practice derivative structures connecting exponentials, logarithms, inverse trigonometric functions, and the Chain Rule.',
  topicLabel: 'Exponential, logarithmic, and inverse-trig topics',
  topicDescription: 'Complete all activities or jump directly to a family of derivative rules.',
  stations: expLogReviewStations,
  questions: expLogReviewQuestions,
}
