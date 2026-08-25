/*
 * CALCULUS I FUNDAMENTAL REVIEW — START HERE
 *
 * This is the single navigation file for all Calculus I review content.
 * Ctrl+click an import path below to jump directly to the content.
 *
 * MODULE ORDER
 * 1. Limits
 * 2. Continuity
 * 3. Derivatives
 * 4. Applications of Derivatives
 * 5. Integral Foundations
 *
 * HOW TO ADD AN ACTIVITY
 * - Open the matching source named below.
 * - Find its `stations` array.
 * - Copy an existing question, give it a unique `id`, and edit its wording,
 *   accepted answers, hints, explanation, and optional math/visual fields.
 * - Press Ctrl+S. The local Vite app refreshes automatically.
 */

// 1. LIMITS — detailed content is maintained here:
export { limitReviewStations, limitReviewQuestions } from './limitsReadiness'

// 2, 4, AND 5 — Continuity, Derivative Applications, and Integrals:
export {
  continuityReview,
  derivativesReview,
  derivativesReview as derivativeApplicationsReview,
  integralsReview,
  integralsReview as integralFoundationsReview,
  flattenReviewQuestions,
} from './courseReviews/calculus1/calculus1FullReviewContent'

// 3. DERIVATIVES — detailed content is maintained here:
export { derivativeReviewStations, derivativeReviewQuestions } from './derivativesReadiness'

// The cards, titles, order, routes, and availability labels are maintained in:
// ./reviewCatalog.js
//
// The shared page renderer is:
// ../components/review/ReviewRunner.jsx
//
// The Fundamental Review landing page is:
// ../components/review/FundamentalReviewPage.jsx
