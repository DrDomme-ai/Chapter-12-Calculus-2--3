// Simple in-memory mock live session service for local UI prototyping.
// Not persistent and only intended for local testing of instructor/student flows.

let sessionCounter = 1
const sessions = new Map()
const sessionSubscribers = new Map()
const questionSubscribers = new Map()
const responseSubscribers = new Map()

function makeJoinCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function createSession({ lectureId = 'real-numbers', createdBy = 'instructor' } = {}) {
  const id = sessionCounter++
  const join_code = makeJoinCode()
  const session = {
    id,
    lecture_id: lectureId,
    created_by: createdBy,
    join_code,
    status: 'live',
    current_slide_index: 0,
    question_status: null,
    participants: [],
    questions: [],
    responses: [],
  }
  sessions.set(id, session)
  sessionSubscribers.set(id, new Set())
  questionSubscribers.set(id, new Set())
  notifySession(id)
  return session
}

export function endSession(id) {
  const session = sessions.get(id)
  if (!session) return
  session.status = 'ended'
  notifySession(id)
}

export function changeSlide(id, nextIndex) {
  const session = sessions.get(id)
  if (!session) return
  session.current_slide_index = nextIndex
  notifySession(id)
}

export function openQuestion(id, question) {
  const session = sessions.get(id)
  if (!session) return
  const q = { attempts:1,timer:null,immediateFeedback:false,topic:'General',difficulty:'medium',id: session.questions.length + 1, ...question, status:'open',opened_at:new Date().toISOString(),eligible_participant_ids:session.participants.map((p)=>p.id) }
  session.questions.push(q)
  session.active_question = q
  session.question_status = 'open'
  notifyQuestion(id, q)
  notifySession(id)
  return q
}

function setQuestionStatus(id,status){
  const session=sessions.get(id);if(!session?.active_question)return null
  session.active_question.status=status;session.question_status=status
  notifyQuestion(id,{...session.active_question});notifySession(id);return session.active_question
}
export const closeQuestion=(id)=>setQuestionStatus(id,'closed')
export const showQuestionResults=(id)=>setQuestionStatus(id,'results')
export const revealQuestionAnswer=(id)=>setQuestionStatus(id,'answer-revealed')
export const reopenQuestion=(id)=>setQuestionStatus(id,'open')

export function submitResponse(sessionId, response) {
  const session = sessions.get(sessionId)
  if (!session) return null
  const question=session.questions.find((q)=>q.id===response.question_id)
  if(!question||question.status!=='open')return null
  const participantId=response.participant_id||response.participant?.id
  const attempts=session.responses.filter((item)=>item.question_id===response.question_id&&item.participant_id===participantId).length
  if(question.attempts!=='unlimited'&&attempts>=Number(question.attempts||1))return null
  const answer=response.answer, correct=Array.isArray(question.correctAnswer)?question.correctAnswer.every((v)=>answer?.includes(v))&&answer.length===question.correctAnswer.length:String(answer)===String(question.correctAnswer??question.correct_option_index)
  const r = { id: session.responses.length + 1, submitted_at: new Date().toISOString(),response_time_ms:Date.now()-new Date(question.opened_at).getTime(),correct, ...response,participant_id:participantId }
  session.responses.push(r)
  notifyResponses(sessionId, r)
  notifySession(sessionId)
  return r
}

export function subscribeResponses(id, cb) {
  let subs = responseSubscribers.get(id)
  if (!subs) {
    subs = new Set()
    responseSubscribers.set(id, subs)
  }
  subs.add(cb)
  // send existing responses
  const session = sessions.get(id)
  if (session && session.responses) session.responses.forEach((r) => cb(r))
  return () => subs.delete(cb)
}

function notifyResponses(id, response) {
  const subs = responseSubscribers.get(id)
  if (!subs) return
  subs.forEach((cb) => cb(response))
}

export function openComprehension(sessionId) {
  const session = sessions.get(sessionId)
  if (!session) return
  session.comprehension_open = true
  session.comprehensions = session.comprehensions || []
  notifySession(sessionId)
}

export function submitComprehension(sessionId, participant, data) {
  const session = sessions.get(sessionId)
  if (!session) return null
  session.comprehensions = session.comprehensions || []
  const entry = { id: session.comprehensions.length + 1, participant, data, submitted_at: new Date().toISOString() }
  session.comprehensions.push(entry)
  notifySession(sessionId)
  return entry
}

export function joinByCode(joinCode, participant = {}) {
  for (const session of sessions.values()) {
    if (session.join_code === joinCode) {
      // If the session has ended, return it without adding a participant
      if (session.status === 'ended') return session
      const existing=session.participants.find((item)=>participant.id&&item.external_id===participant.id)
      if(existing){existing.connected=true;existing.last_active_at=new Date().toISOString();notifySession(session.id);return session}
      const p = { id: session.participants.length + 1,external_id:participant.id, ...participant, connected:true,joined_at_question:session.questions.length+1,joined_at: new Date().toISOString(),last_active_at:new Date().toISOString() }
      session.participants.push(p)
      notifySession(session.id)
      return session
    }
  }
  return null
}

export function regenerateJoinCode(sessionId) {
  const session = sessions.get(sessionId)
  if (!session) return null
  session.join_code = makeJoinCode()
  notifySession(sessionId)
  return session.join_code
}

export function subscribeSession(id, cb) {
  const subs = sessionSubscribers.get(id)
  if (!subs) return () => {}
  subs.add(cb)
  // send initial state
  cb(sessions.get(id))
  return () => subs.delete(cb)
}

export function subscribeQuestions(id, cb) {
  const subs = questionSubscribers.get(id)
  if (!subs) return () => {}
  subs.add(cb)
  const active=sessions.get(id)?.active_question
  if(active)cb({...active})
  return () => subs.delete(cb)
}

export function getNonResponders(id,questionId){const s=sessions.get(id);if(!s)return[];const q=s.questions.find((item)=>item.id===questionId)||s.active_question;if(!q)return[];const answered=new Set(s.responses.filter((r)=>r.question_id===q.id).map((r)=>r.participant_id));return s.participants.filter((p)=>q.eligible_participant_ids.includes(p.id)&&!answered.has(p.id))}
export function getParticipationStats(id){const s=sessions.get(id);if(!s)return[];return s.participants.map((p)=>{const available=s.questions.filter((q)=>q.eligible_participant_ids.includes(p.id)).length;const responses=s.responses.filter((r)=>r.participant_id===p.id);const answered=new Set(responses.map((r)=>r.question_id)).size,correct=responses.filter((r)=>r.correct).length;return{participant:p,available,answered,skipped:Math.max(0,available-answered),participation:available?Math.round(answered/available*100):0,correct,incorrect:responses.length-correct,accuracy:responses.length?Math.round(correct/responses.length*100):0}})}
export function getTopicAccuracy(id){const s=sessions.get(id);if(!s)return[];const topics={};s.questions.forEach((q)=>{const rs=s.responses.filter((r)=>r.question_id===q.id);const key=q.topic||'General';topics[key]??={topic:key,correct:0,total:0};topics[key].correct+=rs.filter((r)=>r.correct).length;topics[key].total+=rs.length});return Object.values(topics).map((x)=>({...x,accuracy:x.total?Math.round(x.correct/x.total*100):0}))}

function notifySession(id) {
  const subs = sessionSubscribers.get(id)
  if (!subs) return
  const session = sessions.get(id)
  subs.forEach((cb) => cb(session))
}

function notifyQuestion(id, question) {
  const subs = questionSubscribers.get(id)
  if (!subs) return
  subs.forEach((cb) => cb(question))
}

export default {
  createSession,
  endSession,
  changeSlide,
  openQuestion,
  closeQuestion,showQuestionResults,revealQuestionAnswer,reopenQuestion,getNonResponders,getParticipationStats,getTopicAccuracy,
  joinByCode,
  subscribeSession,
  subscribeQuestions,
  submitResponse,
  subscribeResponses,
  openComprehension,
  submitComprehension,
  regenerateJoinCode,
}
