const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateProjectCode(course = 'calc2') {
  const prefix = course === 'calc3' ? 'P344-' : 'P243-'
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  return prefix + Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('')
}

export function sanitizeFileName(projectCode, file, index = 0) {
  const extension = file.name.includes('.') ? `.${file.name.split('.').pop().toLowerCase()}` : ''
  return `${projectCode}-${index ? `Supporting-${index}` : 'Submission'}${extension}`
}

export function fileMetadata(files, projectCode) {
  return Array.from(files || []).map((file, index) => ({ originalName: file.name, reviewerName: sanitizeFileName(projectCode, file, index), size: file.size, type: file.type, lastModified: file.lastModified }))
}

export function createPeerAssignments(chapter) {
  return [
    { id: 'review-1', projectCode: 'P243-A7K4Q', chapter: chapter || 'Chapter 8 — Applications of Integrals', status: 'not-started', blackboard: 'not-verified' },
    { id: 'review-2', projectCode: 'P243-F9M2X', chapter: 'Chapter 12 — Vectors and Three-Dimensional Space', status: 'not-started', blackboard: 'not-verified' },
  ]
}

export function validateReview(review, categories, questions) {
  const categoryComplete = categories.every(({ id }) => Number(review.scores[id]) >= 1 && review.justifications[id]?.trim().length >= 20)
  const questionsComplete = questions.every((_, index) => review.answers[index]?.trim().length >= 30)
  const gradeComplete = Number(review.recommendedGrade) >= 0 && Number(review.recommendedGrade) <= 100 && review.gradeJustification.trim().length >= 50
  return { categoryComplete, questionsComplete, gradeComplete, complete: categoryComplete && questionsComplete && gradeComplete }
}

