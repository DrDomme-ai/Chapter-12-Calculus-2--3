import liveService from '../../lib/mockLive'

// UI code talks only to this boundary. A realtime backend can replace this
// adapter without changing presenter, audience, or student components.
export const createLectureSession = (lectureId) => liveService.createSession({ lectureId })
export const endLectureSession = (sessionId) => liveService.endSession(sessionId)
export const joinLectureSession = (code, participant) => liveService.joinByCode(code, participant)
export const changeLectureSlide = (sessionId, index) => liveService.changeSlide(sessionId, index)
export const openLectureQuestion = (sessionId, question) => liveService.openQuestion(sessionId, question)
export const closeLectureQuestion = (sessionId) => liveService.closeQuestion(sessionId)
export const showLectureResults = (sessionId) => liveService.showQuestionResults(sessionId)
export const revealLectureAnswer = (sessionId) => liveService.revealQuestionAnswer(sessionId)
export const reopenLectureQuestion = (sessionId) => liveService.reopenQuestion(sessionId)
export const submitLectureResponse = (sessionId, response) => liveService.submitResponse(sessionId, response)
export const openLectureComprehension = (sessionId) => liveService.openComprehension(sessionId)
export const submitComprehensionCheck = (sessionId, participant, data) => liveService.submitComprehension(sessionId, participant, data)
export const subscribeToSession = (sessionId, callback) => liveService.subscribeSession(sessionId, callback)
export const subscribeToQuestions = (sessionId, callback) => liveService.subscribeQuestions(sessionId, callback)
export const subscribeToResponses = (sessionId, callback) => liveService.subscribeResponses(sessionId, callback)

export const getParticipants = (session) => session?.participants || []
export const getResponses = (session) => session?.responses || []
export const getComprehensionResults = (session) => session?.comprehensions || []
export const getNonResponders = (session) => session ? liveService.getNonResponders(session.id,session.active_question?.id) : []
export const getParticipationStats = (session) => session ? liveService.getParticipationStats(session.id) : []
export const getTopicAccuracy = (session) => session ? liveService.getTopicAccuracy(session.id) : []
