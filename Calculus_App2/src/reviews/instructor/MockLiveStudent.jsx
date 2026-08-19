import { useEffect, useState } from 'react'
import mockLive from '../../lib/mockLive'

export default function MockLiveStudent({ joinCodeProp }) {
  const [code, setCode] = useState(joinCodeProp || '')
  const [trueName, setTrueName] = useState('')
  const [displayMode, setDisplayMode] = useState('anonymous')
  const [displayName, setDisplayName] = useState('')
  const [session, setSession] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [participant, setParticipant] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [answerError, setAnswerError] = useState('')
  const [comprehensionStatus, setComprehensionStatus] = useState('')
  const [confidence, setConfidence] = useState(3)
  const [muddy, setMuddy] = useState('')
  const [remainingQ, setRemainingQ] = useState('')
  const [clientId] = useState(() => {
    const fallback = `student-${Date.now()}-${Math.random().toString(36).slice(2)}`
    if (typeof window === 'undefined') return fallback
    try {
      const stored = window.sessionStorage.getItem('interactive-calculus:live-student-id')
      if (stored) return stored
      const generated = globalThis.crypto?.randomUUID?.() || fallback
      window.sessionStorage.setItem('interactive-calculus:live-student-id', generated)
      return generated
    } catch {
      return fallback
    }
  })

  const sessionId = session?.id

  useEffect(() => {
    let unsubscribeSession
    let unsubscribeQuestion
    if (sessionId) {
      unsubscribeSession = mockLive.subscribeStudentSession(sessionId, clientId, (nextSession) => {
        if (nextSession) {
          setSession({ ...nextSession })
          setParticipant(nextSession.participants.find((item)=>item.external_id===clientId)||null)
        }
      })
      unsubscribeQuestion = mockLive.subscribeQuestions(sessionId, (nextQuestion) => {
        setQuestion(nextQuestion)
        if (nextQuestion.status === 'open') {
          setSelected(null)
          setSubmitted(false)
          setAnswerError('')
        }
      })
    }
    return () => {
      unsubscribeSession?.()
      unsubscribeQuestion?.()
    }
  }, [sessionId,clientId])

  const join = (event) => {
    event?.preventDefault()
    const identity = trueName.trim()
    if (!identity) {
      setJoinError('Enter your enrolled name for the private instructor roster.')
      return
    }

    if(displayMode==='alias'&&!displayName.trim()){setJoinError('Choose a display name or select another privacy option.');return}

    const joinedSession = mockLive.joinStudentByCode(code, { id: clientId, true_student_id:clientId, true_student_name:identity, display_mode:displayMode, display_name:displayName })
    if (!joinedSession) {
      setJoinError('That class code was not found. Check the six digits and try again.')
      return
    }

    setJoinError('')
    setSession({ ...joinedSession })
    setParticipant(
      joinedSession.participants.find((item) => item.external_id === clientId) || null,
    )
  }

  const changeDisplay=()=>{
    if(!session||!participant)return
    const result=mockLive.updateParticipantDisplay(session.id,participant.id,{display_mode:displayMode,display_name:displayName})
    if(!result.ok){setJoinError(result.error);return}
    setParticipant(result.participant);setJoinError('')
  }

  const submitAnswer = () => {
    if (!question || selected == null || !participant) return
    const result = mockLive.submitResponse(session.id, {
      participant,
      participant_id: participant.id,
      question_id: question.id,
      answer: selected,
    })
    if (result) {
      setSubmitted(true)
      setAnswerError('')
    } else {
      setAnswerError('Your response was not accepted. The question may be closed or your attempt may already be recorded.')
    }
  }

  const submitComprehension = () => {
    if (!session || !participant) return
    const participantSummary = { id: participant.id, name: participant.name }
    const data = {
      mathCorrect: 0,
      mathTotal: 3,
      confidence,
      muddyPoint: muddy,
      remainingQuestion: remainingQ,
    }
    mockLive.submitComprehension(session.id, participantSummary, data)
    setComprehensionStatus('Comprehension submitted. Thank you.')
  }

  return (
    <div className="page live-student">
      {!session && (
        <form onSubmit={join}>
          <h2>Join Live Class</h2>
          <p>Your instructor can identify your participation privately. You choose what classmates would see.</p>

          <label htmlFor="live-student-name">Your enrolled name (instructor only)</label>
          <input
            id="live-student-name"
            value={trueName}
            onChange={(event) => setTrueName(event.target.value)}
            placeholder="Full name on the course roster"
            autoComplete="name"
            maxLength={60}
            required
          />

          <fieldset className="display-mode-picker"><legend>Display as</legend>{[
            ['firstName','My first name'],['alias','Choose a display name'],['anonymous','Anonymous'],
          ].map(([value,label])=><label key={value}><input type="radio" name="display-mode" checked={displayMode===value} onChange={()=>setDisplayMode(value)}/>{label}</label>)}</fieldset>
          {displayMode==='alias'&&<><label htmlFor="live-display-alias">Display name</label><input id="live-display-alias" value={displayName} onChange={(event)=>setDisplayName(event.target.value)} placeholder="BlueFox" maxLength={24}/></>}

          <label htmlFor="live-class-code">Class code</label>
          <input
            id="live-class-code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter six-digit class code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            required
          />

          {joinError && <p role="alert">{joinError}</p>}
          <button type="submit">Join class</button>
        </form>
      )}

      {session && session.status === 'ended' && (
        <div>
          <h2>THIS LIVE SESSION HAS ENDED</h2>
          <p>This session is no longer accepting participants.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => (window.location.hash = '#/instructor')}>View Lecture Notes</button>
            <button onClick={() => (window.location.hash = '#/')}>Return Home</button>
          </div>
        </div>
      )}

      {session && session.status !== 'ended' && (
        <div>
          <h3>You&apos;re in — {session.lecture_id}</h3>
          {participant?.display_name && <section className="student-display-card"><span>You are displaying as</span><strong>{participant.display_name}</strong><div className="display-change-controls"><select value={displayMode} onChange={(event)=>setDisplayMode(event.target.value)}><option value="firstName">My first name</option><option value="alias">Choose a display name</option><option value="anonymous">Anonymous</option></select>{displayMode==='alias'&&<input value={displayName} onChange={(event)=>setDisplayName(event.target.value)} maxLength={24} placeholder="New display name"/>}<button onClick={changeDisplay}>Change display name</button></div>{joinError&&<p role="alert">{joinError}</p>}</section>}
          {!question?.id && (
            <p>Waiting for the next question... (Slide {session.current_slide_index})</p>
          )}

          {question?.status === 'open' && !submitted && (
            <div className="live-question">
              <h4>{question.prompt || question.text}</h4>
              {['mcq', 'multiple-choice', 'true-false'].includes(question.type) && (
                <ul>
                  {question.options?.map((option, index) => (
                    <li key={`${question.id}-${index}`}>
                      <label>
                        <input
                          type="radio"
                          name="mcq"
                          checked={selected === index}
                          onChange={() => setSelected(index)}
                        />{' '}
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              {['numerical', 'mathematical-expression', 'short-answer', 'conceptual'].includes(question.type) && (
                <input
                  value={selected ?? ''}
                  onChange={(event) => setSelected(event.target.value)}
                  inputMode={question.type === 'numerical' ? 'decimal' : 'text'}
                  placeholder="Enter your response"
                />
              )}
              {question.type === 'confidence' && (
                <div className="confidence-buttons">
                  {(question.options||['Very confident','Mostly confident','Unsure','Very confused']).map((label,value) => (
                    <button
                      type="button"
                      className={selected === value ? 'active' : ''}
                      onClick={() => setSelected(value)}
                      key={value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {answerError && <p role="alert">{answerError}</p>}
              <button onClick={submitAnswer}>Submit answer</button>
            </div>
          )}

          {question?.id && submitted && question.status === 'open' && (
            <div className="answer-submitted">
              <h4>Answer submitted</h4>
              <p>Waiting for the instructor...</p>
            </div>
          )}

          {question?.status && question.status !== 'open' && (
            <div className="answer-submitted">
              <h4>Question {question.status.replace('-', ' ')}</h4>
              {question.status === 'answer-revealed' && (
                <p>The instructor has revealed the answer.</p>
              )}
            </div>
          )}

          {session.comprehension_open && (
            <div className="comprehension">
              <h4>End-of-lecture comprehension</h4>
              <p>Confidence (1-5)</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map((number) => (
                  <button
                    key={number}
                    onClick={() => setConfidence(number)}
                    style={{ fontWeight: confidence === number ? '700' : '400' }}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <p>Muddy point (optional)</p>
              <textarea
                value={muddy}
                onChange={(event) => setMuddy(event.target.value)}
                placeholder="What was least clear?"
              />
              <p>Remaining question (optional)</p>
              <textarea
                value={remainingQ}
                onChange={(event) => setRemainingQ(event.target.value)}
                placeholder="What question do you still have?"
              />
              <div style={{ marginTop: 8 }}>
                <button onClick={submitComprehension}>Submit comprehension</button>
              </div>
              {comprehensionStatus && <p role="status">{comprehensionStatus}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
