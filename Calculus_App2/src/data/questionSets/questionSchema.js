export const QUESTION_SCHEMA_VERSION = 1

const asArray = (value) => value == null ? [] : Array.isArray(value) ? value : [value]

export function normalizeImportedQuestion(source = {}) {
  const question = {
    schemaVersion: QUESTION_SCHEMA_VERSION,
    id: source.id,
    sourceFile: source.sourceFile,
    chapter: source.chapter,
    section: source.section,
    questionNumber: source.questionNumber,
    sourceQuestion: source.sourceQuestion ?? source.prompt,
    subparts: asArray(source.subparts),
    figures: asArray(source.figures),
    answerType: source.answerType || source.type || 'expression',
    answer: source.answer,
    acceptedAnswers: asArray(source.acceptedAnswers ?? source.answer),
    hints: asArray(source.hints),
    solution: source.solution || {},
    commonMistakes: asArray(source.commonMistakes ?? source.commonMistake),
    conceptSummary: source.conceptSummary || source.takeaway,
    topicTags: asArray(source.topicTags),
    importStatus: source.importStatus || 'imported',
    verificationStatus: source.verificationStatus || 'unverified',
  }
  return { ...source, ...question }
}

export function auditImportedQuestion(question) {
  const concerns = []
  if (!question.id) concerns.push('Missing stable question id')
  if (!question.sourceFile) concerns.push('Missing source file')
  if (!question.sourceQuestion) concerns.push('Missing original question')
  if (question.answer == null && !question.acceptedAnswers?.length) concerns.push('Missing stored answer')
  if (!question.solution || !Object.keys(question.solution).length) concerns.push('Missing detailed solution')
  if (!question.hints?.length) concerns.push('Missing progressive hints')
  if (question.figures?.some((figure) => !figure?.src && !figure?.data)) concerns.push('Figure reference is not renderable')
  return { ready: concerns.length === 0 && question.verificationStatus === 'verified', concerns }
}

export function buildQuestionSetProgress(questionSets) {
  return questionSets.map((set) => {
    const questions = asArray(set.questions).map(normalizeImportedQuestion)
    const audits = questions.map(auditImportedQuestion)
    return {
      chapter: set.chapter,
      section: set.section,
      questionsImported: questions.length,
      solutionsCompleted: questions.filter((question) => Object.keys(question.solution || {}).length > 0).length,
      solutionsVerified: questions.filter((question) => question.verificationStatus === 'verified').length,
      figuresWorking: questions.filter((question) => !auditImportedQuestion(question).concerns.some((item) => item.includes('Figure'))).length,
      qaPassed: audits.filter((audit) => audit.ready).length,
    }
  })
}
