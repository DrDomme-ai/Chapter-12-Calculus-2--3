import { useEffect, useState } from 'react'
import mockLive from '../../lib/mockLive'
import { MathDisplay } from '../../components/MathDisplay'
import { getLecture } from '../../instructor/data/lectureCatalog'
import { ensureElements } from '../../instructor/services/lectureEditorService'
import SlideCanvas from '../../instructor/components/SlideCanvas'
import '../../instructor/styles/instructor.css'

export default function MockLiveStudent({ joinCodeProp }) {
  const [code, setCode] = useState(joinCodeProp || '')
  const [savedProfile] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(window.localStorage.getItem('interactive-calculus:student-profile') || 'null')
    } catch {
      return null
    }
  })
  const [trueName, setTrueName] = useState(savedProfile?.trueName || '')
  const [displayMode, setDisplayMode] = useState(savedProfile?.displayMode || 'anonymous')
  const [displayName, setDisplayName] = useState(savedProfile?.displayName || '')
  const [session, setSession] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [participant, setParticipant] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [answerError, setAnswerError] = useState('')
  const [pointsAwarded, setPointsAwarded] = useState(null)
  const [secondsRemaining,setSecondsRemaining]=useState(null)
  const [comprehensionStatus, setComprehensionStatus] = useState('')
  const [confidence, setConfidence] = useState(3)
  const [muddy, setMuddy] = useState('')
  const [remainingQ, setRemainingQ] = useState('')
  const [selfPacedSlide,setSelfPacedSlide]=useState(0)
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
  useEffect(()=>{
    const calculate=()=>setSecondsRemaining(question?.expires_at?Math.max(0,Math.ceil((new Date(question.expires_at).getTime()-Date.now())/1000)):null)
    calculate()
    if(!question?.expires_at||question.status!=='open')return undefined
    const timer=setInterval(calculate,250)
    return()=>clearInterval(timer)
  },[question?.id,question?.expires_at,question?.status])

  const sessionId = session?.id
  const selfPacedSlides=session?.self_paced?getLecture(session.lecture_id).slides.map(ensureElements):[]
  const currentSelfPacedSlide=selfPacedSlides[selfPacedSlide]

  const goToSelfPacedSlide=(nextIndex)=>{
    const safeIndex=Math.max(0,Math.min(selfPacedSlides.length-1,nextIndex)),nextSlide=selfPacedSlides[safeIndex]
    setSelfPacedSlide(safeIndex);setAnswerError('');setPointsAwarded(null)
    if(!nextSlide?.question){setQuestion(null);setSelected(null);setSubmitted(false);return}
    const next=mockLive.openSelfPacedQuestion(session.id,{...nextSlide.question,id:nextSlide.id,timer:null,scoring:nextSlide.question.scoring==='speed'?undefined:nextSlide.question.scoring})
    const prior=session.own_responses?.find(response=>String(response.question_id)===String(next?.id))
    setQuestion(next);setSelected(prior?.answer??null);setSubmitted(Boolean(prior));setPointsAwarded(prior?.points??null)
  }

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
          setPointsAwarded(null)
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
    try {
      window.localStorage.setItem('interactive-calculus:student-profile', JSON.stringify({ trueName:identity, displayMode, displayName }))
    } catch {
      // Access still works if browser storage is unavailable.
    }
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
      setPointsAwarded(result.points)
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
          <h2>Enter Your Class</h2>
          <p>A valid class code gives you immediate access. No instructor approval is required.</p>

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
          <button type="submit">Enter student dashboard</button>
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
          {session.self_paced&&<section className="self-paced-student-workspace"><header><div><strong>Self-Paced Lecture</strong><span>Slide {selfPacedSlide+1} of {selfPacedSlides.length}</span></div><nav aria-label="Self-paced slide navigation"><button onClick={()=>goToSelfPacedSlide(selfPacedSlide-1)} disabled={selfPacedSlide===0}>Previous</button><button onClick={()=>goToSelfPacedSlide(selfPacedSlide+1)} disabled={selfPacedSlide>=selfPacedSlides.length-1}>Next</button></nav></header><div className="self-paced-slide-frame">{currentSelfPacedSlide&&<SlideCanvas slide={currentSelfPacedSlide} revealCount={99}/>}</div></section>}
          {participant?.display_name && <section className="student-display-card"><span>You are displaying as</span><strong>{participant.display_name}</strong><div className="display-change-controls"><select value={displayMode} onChange={(event)=>setDisplayMode(event.target.value)}><option value="firstName">My first name</option><option value="alias">Choose a display name</option><option value="anonymous">Anonymous</option></select>{displayMode==='alias'&&<input value={displayName} onChange={(event)=>setDisplayName(event.target.value)} maxLength={24} placeholder="New display name"/>}<button onClick={changeDisplay}>Change display name</button></div>{joinError&&<p role="alert">{joinError}</p>}</section>}
          {!session.self_paced&&!question?.id && (
            <p>Waiting for the next question... (Slide {session.current_slide_index})</p>
          )}

          {question?.status === 'open' && !submitted && (
            <div className="live-question">
              {secondsRemaining!=null&&<div className={`student-challenge-countdown ${secondsRemaining<=10?'ending':''}`}><strong>{secondsRemaining}</strong> seconds remaining</div>}
              <h4>{question.prompt || question.text}{question.mathPrompt&&<MathDisplay>{question.mathPrompt}</MathDisplay>}</h4>
              {['mcq', 'multiple-choice', 'true-false'].includes(question.type) && (
                <div className="student-quiz-grid" role="radiogroup" aria-label="Answer choices">
                  {question.options?.map((option, index) => (
                    <button type="button" role="radio" aria-checked={selected===index} className={selected===index?'selected':''} onClick={()=>setSelected(index)} key={`${question.id}-${question.choiceIds?.[index]||index}`}><b>{String.fromCharCode(65+index)}</b><span>{question.optionMath?.[index] ? <MathDisplay>{question.optionMath[index]}</MathDisplay> : option}</span></button>
                  ))}
                </div>
              )}
              {['numerical', 'mathematical-expression', 'short-answer', 'conceptual'].includes(question.type) && (
                <input
                  value={selected ?? ''}
                  onChange={(event) => setSelected(event.target.value)}
                  inputMode={question.type === 'numerical' ? 'decimal' : 'text'}
                  placeholder="Enter your response"
                />
              )}
              {question.type === 'multiple-select' && (
                <ul>{question.options?.map((option,index)=><li key={`${question.id}-${index}`}><label><input type="checkbox" checked={Array.isArray(selected)&&selected.includes(index)} onChange={()=>setSelected(values=>{const current=Array.isArray(values)?values:[];return current.includes(index)?current.filter(value=>value!==index):[...current,index].sort((a,b)=>a-b)})}/>{' '}{option}</label></li>)}</ul>
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
              {question.scoring === 'speed' && <p>Your score will be shown after the instructor reveals the answer.</p>}
              <p>Waiting for the instructor...</p>
            </div>
          )}

          {question?.status && question.status !== 'open' && (
            <div className="answer-submitted">
              <h4>Question {question.status.replace('-', ' ')}</h4>
              {question.status === 'answer-revealed' && (
                <><p>The instructor has revealed the answer.{question.scoring === 'speed' && pointsAwarded != null ? ` You earned ${pointsAwarded} points.` : ''}</p>{question.solution?.correctAnswer&&<section className="student-quiz-solution"><strong>{question.solution.correctAnswer}</strong>{question.solution.steps?.map((step,index)=><MathDisplay key={index}>{step}</MathDisplay>)}<p>{question.solution.explanation}</p></section>}</>
              )}
              {['results','answer-revealed'].includes(question.status)&&session.public_question_leaderboard?.length>0&&<section className="student-top-five"><h4>Fastest correct answers</h4><ol>{session.public_question_leaderboard.map(row=><li key={`${row.rank}-${row.displayName}`}><b>{row.rank}</b><span>{row.displayName}</span><strong>+{row.points}</strong></li>)}</ol></section>}
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
