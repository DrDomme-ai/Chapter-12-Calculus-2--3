import { calculateQuizScore, normalizeQuizQuestion, rankFastestCorrect } from '../instructor/services/liveQuizService.js'

// Local live-class service used by the instructor and student prototypes.
//
// State is kept in localStorage and announced through BroadcastChannel so
// instructor, projector, and student views opened in separate same-origin
// tabs/windows stay in sync. It deliberately makes no network requests.

const STORAGE_KEY = 'interactive-calculus:mock-live:v2'
const CHANNEL_NAME = 'interactive-calculus:mock-live:v2'
const STORAGE_VERSION = 2

let sessionCounter = 1
let currentRevision = ''
const sessions = new Map()
const sessionSubscribers = new Map()
const questionSubscribers = new Map()
const responseSubscribers = new Map()
const questionTimers = new Map()

const browserAvailable = typeof window !== 'undefined'
const transportOrigin = makeToken('tab')

function makeToken(prefix) {
  const randomPart = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
  return `${prefix}-${Date.now()}-${randomPart}`
}

function makeEntityId() {
  // A safe numeric id preserves the existing API while avoiding collisions
  // when several student tabs submit at nearly the same time.
  return Date.now() * 1000 + Math.floor(Math.random() * 1000)
}

function makeJoinCode() {
  let code
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString()
  } while ([...sessions.values()].some((session) => session.status === 'live' && session.join_code === code))
  return code
}

const blockedAliasPattern=/\b(admin|instructor|professor|teacher|fuck|shit|bitch)\b/i
const clean=(value,max=60)=>String(value||'').trim().replace(/\s+/g,' ').slice(0,max)

function publicName(profile, fallbackNumber) {
  const mode=['firstName','alias','anonymous'].includes(profile.display_mode)?profile.display_mode:'anonymous'
  if(mode==='anonymous')return 'Anonymous'
  if(mode==='firstName')return clean(profile.true_student_name).split(' ')[0]||`Student ${fallbackNumber}`
  const alias=clean(profile.display_name,24)
  return alias&&!blockedAliasPattern.test(alias)?alias:`Student ${fallbackNumber}`
}

function normalizeParticipant(participant,index=0){
  const trueName=clean(participant.true_student_name||participant.name||'Student')
  const displayMode=['firstName','alias','anonymous'].includes(participant.display_mode)?participant.display_mode:'anonymous'
  const displayName=publicName({...participant,true_student_name:trueName,display_mode:displayMode},index+1)
  return {...participant,true_student_id:participant.true_student_id||participant.external_id||String(participant.id),true_student_name:trueName,display_mode:displayMode,display_name:displayName,name:displayName}
}

function ensureSubscriberBuckets(id) {
  if (!sessionSubscribers.has(id)) sessionSubscribers.set(id, new Set())
  if (!questionSubscribers.has(id)) questionSubscribers.set(id, new Set())
  if (!responseSubscribers.has(id)) responseSubscribers.set(id, new Set())
}

function normalizeSession(rawSession) {
  if (!rawSession || rawSession.id == null) return null

  const normalized = {
    ...rawSession,
    participants: Array.isArray(rawSession.participants) ? rawSession.participants.map(normalizeParticipant) : [],
    questions: Array.isArray(rawSession.questions) ? rawSession.questions : [],
    responses: Array.isArray(rawSession.responses) ? rawSession.responses : [],
    comprehensions: Array.isArray(rawSession.comprehensions) ? rawSession.comprehensions : [],
  }

  if (rawSession.active_question?.id != null) {
    normalized.active_question = normalized.questions.find(
      (question) => question.id === rawSession.active_question.id,
    ) || rawSession.active_question
  }

  return normalized
}

function mergeUnique(existing = [], incoming = [], keyForItem) {
  const merged = new Map()
  existing.forEach((item) => merged.set(keyForItem(item), item))
  incoming.forEach((item) => {
    const key = keyForItem(item)
    merged.set(key, { ...(merged.get(key) || {}), ...item })
  })
  return [...merged.values()]
}

function mergeSession(existing, incoming) {
  if (!existing) return normalizeSession(incoming)
  const merged = normalizeSession({
    ...existing,
    ...incoming,
    participants: mergeUnique(
      existing.participants,
      incoming.participants,
      (participant) => participant.external_id || participant.id,
    ),
    questions: mergeUnique(existing.questions, incoming.questions, (question) => question.id),
    responses: mergeUnique(existing.responses, incoming.responses, (response) => response.id),
    comprehensions: mergeUnique(
      existing.comprehensions,
      incoming.comprehensions,
      (entry) => entry.id,
    ),
  })

  if (merged.active_question?.id != null) {
    merged.active_question = merged.questions.find(
      (question) => question.id === merged.active_question.id,
    ) || merged.active_question
  }
  return merged
}

function questionSignature(question) {
  if (!question) return ''
  return JSON.stringify({
    id: question.id,
    status: question.status,
    opened_at: question.opened_at,
    prompt: question.prompt || question.text,
  })
}

function readStoredPayload() {
  if (!browserAvailable) return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (!value) return null
    const payload = JSON.parse(value)
    return payload?.version === STORAGE_VERSION && Array.isArray(payload.sessions) ? payload : null
  } catch {
    // Storage can be disabled by browser privacy settings. The in-memory and
    // BroadcastChannel paths remain usable in that case.
    return null
  }
}

function applyPayload(payload, { notify = true } = {}) {
  if (!payload || payload.version !== STORAGE_VERSION || !Array.isArray(payload.sessions)) return
  if (payload.revision && payload.revision === currentRevision) return

  const previousSessions = new Map(sessions)
  payload.sessions.forEach((rawSession) => {
    const incoming = normalizeSession(rawSession)
    if (!incoming) return
    sessions.set(incoming.id, mergeSession(sessions.get(incoming.id), incoming))
    ensureSubscriberBuckets(incoming.id)
  })

  sessionCounter = Math.max(sessionCounter, Number(payload.sessionCounter) || 1)
  currentRevision = payload.revision || currentRevision

  if (!notify) return

  sessions.forEach((session, id) => {
    const previous = previousSessions.get(id)
    const previousResponseIds = new Set((previous?.responses || []).map((response) => response.id))
    session.responses
      .filter((response) => !previousResponseIds.has(response.id))
      .forEach((response) => notifyResponses(id, response))

    if (questionSignature(previous?.active_question) !== questionSignature(session.active_question)) {
      if (session.active_question) notifyQuestion(id, { ...session.active_question })
    }
    notifySession(id)
  })
}

function refreshFromStorage() {
  const payload = readStoredPayload()
  if (payload?.revision !== currentRevision) applyPayload(payload)
}

let liveChannel = null
if (browserAvailable) {
  applyPayload(readStoredPayload(), { notify: false })

  if (typeof window.BroadcastChannel === 'function') {
    liveChannel = new window.BroadcastChannel(CHANNEL_NAME)
    liveChannel.addEventListener('message', (event) => {
      if (event.data?.origin === transportOrigin) return
      applyPayload(event.data)
    })
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      applyPayload(JSON.parse(event.newValue))
    } catch {
      // Ignore malformed storage written by an unrelated script or old build.
    }
  })
}

function persistState() {
  currentRevision = makeToken('revision')
  const payload = {
    version: STORAGE_VERSION,
    origin: transportOrigin,
    revision: currentRevision,
    sessionCounter,
    sessions: [...sessions.values()],
  }

  if (browserAvailable) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Keep the current tab functional if localStorage is unavailable/full.
    }
  }
  liveChannel?.postMessage(payload)
}

function touchSession(session) {
  session.updated_at = new Date().toISOString()
}

function studentSessionView(session,participantId){
  if(!session)return null
  const participant=session.participants.find(item=>item.id===participantId||item.external_id===participantId)
  const reveal=session.active_question?.status==='answer-revealed',active=session.active_question?{...session.active_question,eligible_participant_ids:undefined}:null
  if(active&&!reveal){active.correctAnswer=undefined;active.correctChoiceId=undefined;active.correct_option_index=undefined;active.solution=undefined;active.explanation=undefined}
  return {
    id:session.id,lecture_id:session.lecture_id,join_code:session.join_code,status:session.status,
    self_paced:Boolean(session.self_paced),auto_approve:Boolean(session.auto_approve),
    current_slide_index:session.current_slide_index,question_status:session.question_status,
    active_question:active,
    public_question_leaderboard:['results','answer-revealed'].includes(session.active_question?.status)?rankFastestCorrect(session.responses.filter(response=>response.question_id===session.active_question.id),session.participants,5):[],
    cumulative_leaderboard:session.active_question?.status==='answer-revealed'?getLeaderboard(session).slice(0,3).map(({participant,score,correct,totalTimeMs})=>({displayName:participant.display_name,score,correct,totalTimeMs})):[],
    comprehension_open:Boolean(session.comprehension_open),shared_response:session.shared_response||null,
    participants:participant?[{...participant}]:[],
    own_responses:participant?session.responses.filter(response=>response.participant_id===participant.id).map(response=>({...response,participant:undefined})):[],responses:[],questions:[],
  }
}

export function getProjectorSession(sessionOrId){
  refreshFromStorage()
  const session=typeof sessionOrId==='object'?sessionOrId:sessions.get(sessionOrId)
  if(!session)return null
  return {
    id:session.id,status:session.status,question_status:session.question_status,
    participant_count:session.participants.length,shared_response:session.shared_response||null,
    active_question:session.active_question?{...session.active_question,eligible_participant_ids:undefined,eligible_participant_count:session.active_question.eligible_participant_ids?.length||session.participants.length}:null,
    responses:(session.responses||[]).map(({question_id,answer,correct,points,response_time_ms})=>({question_id,answer,correct,points,response_time_ms})),
    question_leaderboard:session.active_question?rankFastestCorrect(session.responses.filter(response=>response.question_id===session.active_question.id),session.participants,5):[],
    leaderboard:getLeaderboard(session).map(({participant,score,correct})=>({displayName:participant.display_name,score,correct})),
  }
}

export function createSession({ lectureId = 'real-numbers', createdBy = 'instructor', selfPaced = false, joinCode } = {}) {
  refreshFromStorage()
  const id = makeEntityId()
  sessionCounter += 1
  const session = {
    id,
    lecture_id: lectureId,
    created_by: createdBy,
    join_code: String(joinCode||'').trim()||makeJoinCode(),
    status: selfPaced?'self-paced':'live',
    self_paced:Boolean(selfPaced),
    auto_approve:Boolean(selfPaced),
    current_slide_index: 0,
    question_status: null,
    participants: [],
    questions: [],
    responses: [],
    comprehensions: [],
    created_at: new Date().toISOString(),
  }
  touchSession(session)
  sessions.set(id, session)
  ensureSubscriberBuckets(id)
  persistState()
  notifySession(id)
  return session
}

export function getSelfPacedSession(lectureId){
  refreshFromStorage()
  return [...sessions.values()].find(session=>session.lecture_id===lectureId&&session.self_paced&&session.status==='self-paced')||null
}

export function setSelfPacedMode(lectureId,enabled,{joinCode='735862'}={}){
  refreshFromStorage()
  const existing=getSelfPacedSession(lectureId)
  if(enabled){
    if(existing)return existing
    const code=String(joinCode||'735862').trim()
    const conflict=[...sessions.values()].find(session=>session.join_code===code&&session.status!=='ended')
    if(conflict&&conflict.lecture_id===lectureId){
      conflict.self_paced=true;conflict.auto_approve=true;conflict.status='self-paced';touchSession(conflict);persistState();notifySession(conflict.id);return conflict
    }
    return createSession({lectureId,createdBy:'instructor',selfPaced:true,joinCode:conflict?makeJoinCode():code})
  }
  if(existing){existing.status='ended';existing.self_paced=false;existing.auto_approve=false;touchSession(existing);persistState();notifySession(existing.id)}
  return null
}

export function openSelfPacedQuestion(sessionId,question){
  refreshFromStorage()
  const session=sessions.get(sessionId)
  if(!session?.self_paced||!question)return null
  const normalized=normalizeQuizQuestion(question)
  const id=String(normalized.id||question.id)
  let stored=session.questions.find(item=>String(item.id)===id)
  if(!stored){stored={attempts:1,immediateFeedback:false,topic:'Self-paced',...normalized,id,status:'open',opened_at:new Date().toISOString(),expires_at:null,eligible_participant_ids:session.participants.map(item=>item.id)};session.questions.push(stored);touchSession(session);persistState();notifySession(sessionId)}
  return {...stored}
}

export function endSession(id) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session) return
  session.status = 'ended'
  touchSession(session)
  persistState()
  notifySession(id)
}

export function changeSlide(id, nextIndex) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session) return
  session.current_slide_index = nextIndex
  touchSession(session)
  persistState()
  notifySession(id)
}

export function openQuestion(id, question) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session) return null
  question=normalizeQuizQuestion(question)
  const fairTimer = Number(question.timer) || ({easy:45,medium:60,hard:90}[question.difficulty] ?? 60)
  const q = {
    attempts: 1,
    timer: null,
    immediateFeedback: false,
    topic: 'General',
    difficulty: 'medium',
    id: makeEntityId(),
    ...question,
    ...(question.scoring==='speed'?{timer:fairTimer}:{}),
    status: 'open',
    opened_at: new Date().toISOString(),
    expires_at: question.scoring==='speed'?new Date(Date.now()+fairTimer*1000).toISOString():null,
    eligible_participant_ids: session.participants.map((participant) => participant.id),
  }
  const existingIndex=session.questions.findIndex(item=>item.id===q.id)
  if(existingIndex>=0)session.questions[existingIndex]=q
  else session.questions.push(q)
  session.active_question = q
  session.shared_response = null
  session.question_status = 'open'
  touchSession(session)
  persistState()
  notifyQuestion(id, { ...q })
  notifySession(id)
  scheduleQuestionClose(id,q)
  return q
}

function scheduleQuestionClose(sessionId,question){
  const previous=questionTimers.get(sessionId)
  if(previous)clearTimeout(previous)
  if(!question?.expires_at)return
  const delay=Math.max(0,new Date(question.expires_at).getTime()-Date.now())
  const timer=setTimeout(()=>{
    refreshFromStorage()
    const session=sessions.get(sessionId)
    if(session?.active_question?.id===question.id&&session.active_question.status==='open')setQuestionStatus(sessionId,'closed')
    questionTimers.delete(sessionId)
  },delay)
  questionTimers.set(sessionId,timer)
}

function setQuestionStatus(id, status) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session?.active_question) return null
  session.active_question.status = status
  session.question_status = status
  touchSession(session)
  persistState()
  notifyQuestion(id, { ...session.active_question })
  notifySession(id)
  return session.active_question
}

export const closeQuestion = (id) => setQuestionStatus(id, 'closed')
export const showQuestionResults = (id) => setQuestionStatus(id, 'results')
export const revealQuestionAnswer = (id) => setQuestionStatus(id, 'answer-revealed')
export function reopenQuestion(id){
  refreshFromStorage()
  const session=sessions.get(id)
  if(!session?.active_question)return null
  const question=session.active_question
  question.opened_at=new Date().toISOString()
  question.expires_at=question.scoring==='speed'&&question.timer?new Date(Date.now()+Number(question.timer)*1000).toISOString():null
  const reopened=setQuestionStatus(id,'open')
  scheduleQuestionClose(id,reopened)
  return reopened
}

export function submitResponse(sessionId, response) {
  refreshFromStorage()
  const session = sessions.get(sessionId)
  if (!session) return null
  const question = session.questions.find((item) => item.id === response.question_id)
  if (!question || question.status !== 'open') return null
  if(question.expires_at&&Date.now()>=new Date(question.expires_at).getTime()){
    setQuestionStatus(sessionId,'closed')
    return null
  }
  const participantId = response.participant_id || response.participant?.id
  const attempts = session.responses.filter(
    (item) => item.question_id === response.question_id && item.participant_id === participantId,
  ).length
  if (question.attempts !== 'unlimited' && attempts >= Number(question.attempts || 1)) return null

  const answer = response.answer
  const answerId=question.choiceIds?.[Number(answer)]??String(answer)
  const correct = question.graded===false?null:Array.isArray(question.correctAnswer)
    ? question.correctAnswer.every((value) => answer?.includes(value))
      && answer.length === question.correctAnswer.length
    : question.correctChoiceId?String(answerId)===String(question.correctChoiceId):String(answer) === String(question.correctAnswer ?? question.correct_option_index)
  const responseTimeMs = Date.now() - new Date(question.opened_at).getTime()
  const timerMs = Math.max(1000, Number(question.timer || 60) * 1000)
  const points = question.scoring === 'speed' && correct
    ? calculateQuizScore({isCorrect:correct,responseTimeMs,timeLimitMs:timerMs,pointsPossible:question.pointsPossible||1000})
    : correct ? Number(question.points || 0) : 0
  const result = {
    id: makeEntityId(),
    submitted_at: new Date().toISOString(),
    response_time_ms: responseTimeMs,
    correct,
    points,
    selected_choice_id:answerId,
    ...response,
    participant_id: participantId,
  }
  session.responses.push(result)
  touchSession(session)
  persistState()
  notifyResponses(sessionId, result)
  notifySession(sessionId)
  return result
}

export function getLeaderboard(sessionOrId) {
  refreshFromStorage()
  const session = typeof sessionOrId === 'object' ? sessionOrId : sessions.get(sessionOrId)
  if (!session) return []
  return session.participants.map((participant) => {
    const responses = session.responses.filter((response) => response.participant_id === participant.id)
    return {
      participant,
      score: responses.reduce((sum, response) => sum + Number(response.points || 0), 0),
      correct: responses.filter((response) => response.correct).length,
      totalTimeMs: responses.filter((response) => response.correct).reduce((sum, response) => sum + Number(response.response_time_ms || 0), 0),
    }
  }).sort((a, b) => b.score - a.score || b.correct - a.correct || a.totalTimeMs - b.totalTimeMs)
}

export function subscribeResponses(id, callback) {
  refreshFromStorage()
  ensureSubscriberBuckets(id)
  const subscribers = responseSubscribers.get(id)
  subscribers.add(callback)
  sessions.get(id)?.responses?.forEach((response) => callback(response))
  return () => subscribers.delete(callback)
}

function notifyResponses(id, response) {
  responseSubscribers.get(id)?.forEach((callback) => callback(response))
}

export function openComprehension(sessionId) {
  refreshFromStorage()
  const session = sessions.get(sessionId)
  if (!session) return
  session.comprehension_open = true
  session.comprehensions = session.comprehensions || []
  touchSession(session)
  persistState()
  notifySession(sessionId)
}

export function submitComprehension(sessionId, participant, data) {
  refreshFromStorage()
  const session = sessions.get(sessionId)
  if (!session) return null
  session.comprehensions = session.comprehensions || []
  const entry = {
    id: makeEntityId(),
    participant_id:participant.id,
    data,
    submitted_at: new Date().toISOString(),
  }
  session.comprehensions.push(entry)
  touchSession(session)
  persistState()
  notifySession(sessionId)
  return entry
}

export function joinByCode(joinCode, participant = {}) {
  refreshFromStorage()
  const normalizedCode = String(joinCode || '').trim()
  for (const session of sessions.values()) {
    if (session.join_code !== normalizedCode) continue
    if (session.status === 'ended') return session

    const { id: externalId, ...participantProfile } = participant
    const existing = externalId
      ? session.participants.find((item) => item.external_id === externalId)
      : null
    if (existing) {
      existing.true_student_id=participantProfile.true_student_id||existing.true_student_id||externalId
      existing.true_student_name=clean(participantProfile.true_student_name||participantProfile.name||existing.true_student_name)
      existing.display_mode=participantProfile.display_mode||existing.display_mode||'anonymous'
      existing.display_name=publicName({...existing,...participantProfile},session.participants.indexOf(existing)+1)
      existing.name=existing.display_name
      // Student joins are immediate. There is no instructor approval queue.
      existing.approved = true
      existing.connected = true
      existing.last_active_at = new Date().toISOString()
      touchSession(session)
      persistState()
      notifySession(session.id)
      return session
    }

    const now = new Date().toISOString()
    const joinedParticipant = {
      ...participantProfile,
      id: makeEntityId(),
      external_id: externalId || null,
      true_student_id:participantProfile.true_student_id||externalId||null,
      true_student_name:clean(participantProfile.true_student_name||participantProfile.name||'Student'),
      display_mode:participantProfile.display_mode||'anonymous',
      display_name:publicName(participantProfile,session.participants.length+1),
      // Possession of a valid class code grants immediate access.
      approved:true,
      connected: true,
      joined_at_question: session.questions.length + 1,
      joined_at: now,
      last_active_at: now,
    }
    joinedParticipant.name=joinedParticipant.display_name
    session.participants.push(joinedParticipant)
    touchSession(session)
    persistState()
    notifySession(session.id)
    return session
  }
  return null
}

export function joinStudentByCode(joinCode,participant={}){
  const session=joinByCode(joinCode,participant)
  if(!session)return null
  const own=session.participants.find(item=>item.external_id===participant.id)
  return studentSessionView(session,own?.id)
}

export function updateParticipantDisplay(sessionId,participantId,{display_mode,display_name}={}){
  refreshFromStorage()
  const session=sessions.get(sessionId),participant=session?.participants.find(item=>item.id===participantId)
  if(!participant)return {ok:false,error:'Participant not found.'}
  const mode=['firstName','alias','anonymous'].includes(display_mode)?display_mode:participant.display_mode
  const requested=clean(display_name,24)
  if(mode==='alias'){
    if(requested.length<2)return {ok:false,error:'Choose a display name with at least 2 characters.'}
    if(blockedAliasPattern.test(requested))return {ok:false,error:'That display name is not available. Choose another.'}
    if(session.participants.some(item=>item.id!==participant.id&&item.display_name.toLowerCase()===requested.toLowerCase()))return {ok:false,error:'That display name is already in use.'}
  }
  participant.display_mode=mode
  participant.display_name=publicName({...participant,display_mode:mode,display_name:requested},session.participants.indexOf(participant)+1)
  participant.name=participant.display_name
  participant.last_active_at=new Date().toISOString()
  touchSession(session);persistState();notifySession(sessionId)
  return {ok:true,participant:{...participant}}
}

export function shareResponseAnonymously(sessionId,responseId){
  refreshFromStorage()
  const session=sessions.get(sessionId),response=session?.responses.find(item=>item.id===responseId)
  const question=session?.questions.find(item=>item.id===response?.question_id)
  if(!session||!response||!question?.shareableAnonymously)return false
  session.shared_response={text:String(response.answer),shared_at:new Date().toISOString()}
  touchSession(session);persistState();notifySession(sessionId)
  return true
}

export function regenerateJoinCode(sessionId) {
  refreshFromStorage()
  const session = sessions.get(sessionId)
  if (!session) return null
  session.join_code = makeJoinCode()
  touchSession(session)
  persistState()
  notifySession(sessionId)
  return session.join_code
}

export function subscribeSession(id, callback) {
  refreshFromStorage()
  ensureSubscriberBuckets(id)
  const subscribers = sessionSubscribers.get(id)
  subscribers.add(callback)
  callback(sessions.get(id))
  return () => subscribers.delete(callback)
}

export function subscribeStudentSession(id,participantId,callback){
  return subscribeSession(id,session=>callback(studentSessionView(session,participantId)))
}

export function getSessionReport(id,{audience='instructor'}={}){
  refreshFromStorage()
  const session=sessions.get(id)
  if(!session)return null
  if(audience==='class'){
    return {lectureId:session.lecture_id,status:session.status,connected:session.participants.length,leaderboard:getLeaderboard(session).map(({participant,score,correct})=>({displayName:participant.display_name,score,correct})),questions:session.questions.map(question=>({prompt:question.prompt||question.text,category:question.category,responded:new Set(session.responses.filter(response=>response.question_id===question.id).map(response=>response.participant_id)).size,distribution:(question.options||[]).map((option,index)=>({option,count:session.responses.filter(response=>response.question_id===question.id&&Number(response.answer)===index).length}))}))}
  }
    return {lectureId:session.lecture_id,status:session.status,createdAt:session.created_at,updatedAt:session.updated_at,leaderboard:getLeaderboard(session).map(({participant,score,correct})=>({studentId:participant.true_student_id,studentName:participant.true_student_name,score,correct})),participants:session.participants.map(participant=>{const responses=session.responses.filter(response=>response.participant_id===participant.id),comprehension=session.comprehensions.find(entry=>entry.participant_id===participant.id);return{trueStudentId:participant.true_student_id,trueStudentName:participant.true_student_name,displayMode:participant.display_mode,displayName:participant.display_name,connected:participant.connected,joinedAt:participant.joined_at,responses:responses.map(response=>{const question=session.questions.find(item=>item.id===response.question_id);return{question:question?.prompt||question?.text,category:question?.category,answer:response.answer,correct:response.correct,points:response.points||0,responseTimeMs:response.response_time_ms,submittedAt:response.submitted_at}}),comprehension:comprehension?.data||null}})}
}

export function subscribeQuestions(id, callback) {
  refreshFromStorage()
  ensureSubscriberBuckets(id)
  const subscribers = questionSubscribers.get(id)
  subscribers.add(callback)
  const activeQuestion = sessions.get(id)?.active_question
  if (activeQuestion) callback({ ...activeQuestion })
  return () => subscribers.delete(callback)
}

export function getNonResponders(id, questionId) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session) return []
  const question = session.questions.find((item) => item.id === questionId) || session.active_question
  if (!question) return []
  const answered = new Set(
    session.responses
      .filter((response) => response.question_id === question.id)
      .map((response) => response.participant_id),
  )
  return session.participants.filter(
    (participant) => question.eligible_participant_ids.includes(participant.id)
      && !answered.has(participant.id),
  )
}

export function getParticipationStats(id) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session) return []
  return session.participants.map((participant) => {
    const available = session.questions.filter(
      (question) => question.eligible_participant_ids.includes(participant.id),
    ).length
    const responses = session.responses.filter((response) => response.participant_id === participant.id)
    const answered = new Set(responses.map((response) => response.question_id)).size
    const gradedResponses=responses.filter((response)=>response.correct!=null)
    const correct = gradedResponses.filter((response) => response.correct).length
    return {
      participant,
      available,
      answered,
      skipped: Math.max(0, available - answered),
      participation: available ? Math.round((answered / available) * 100) : 0,
      correct,
      incorrect: gradedResponses.length - correct,
      accuracy: gradedResponses.length ? Math.round((correct / gradedResponses.length) * 100) : 0,
    }
  })
}

export function getTopicAccuracy(id) {
  refreshFromStorage()
  const session = sessions.get(id)
  if (!session) return []
  const topics = {}
  session.questions.forEach((question) => {
    const responses = session.responses.filter((response) => response.question_id === question.id)
    const key = question.topic || 'General'
    topics[key] ??= { topic: key, correct: 0, total: 0 }
    const graded=responses.filter((response)=>response.correct!=null)
    topics[key].correct += graded.filter((response) => response.correct).length
    topics[key].total += graded.length
  })
  return Object.values(topics).map((topic) => ({
    ...topic,
    accuracy: topic.total ? Math.round((topic.correct / topic.total) * 100) : 0,
  }))
}

function notifySession(id) {
  const session = sessions.get(id)
  sessionSubscribers.get(id)?.forEach((callback) => callback(session))
}

function notifyQuestion(id, question) {
  questionSubscribers.get(id)?.forEach((callback) => callback(question))
}

export default {
  createSession,
  getSelfPacedSession,
  setSelfPacedMode,
  openSelfPacedQuestion,
  endSession,
  changeSlide,
  openQuestion,
  closeQuestion,
  showQuestionResults,
  revealQuestionAnswer,
  reopenQuestion,
  getNonResponders,
  getParticipationStats,
  getTopicAccuracy,
  joinByCode,
  joinStudentByCode,
  updateParticipantDisplay,
  shareResponseAnonymously,
  subscribeSession,
  subscribeStudentSession,
  getProjectorSession,
  getSessionReport,
  subscribeQuestions,
  submitResponse,
  getLeaderboard,
  subscribeResponses,
  openComprehension,
  submitComprehension,
  regenerateJoinCode,
}
