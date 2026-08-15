import { useEffect, useState } from 'react'
import mockLive from '../../lib/mockLive'

export default function MockLiveStudent({ joinCodeProp }) {
  const [code, setCode] = useState(joinCodeProp || '')
  const [session, setSession] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [participant,setParticipant]=useState(null)
  const [submitted,setSubmitted]=useState(false)
  const [confidence, setConfidence] = useState(3)
  const [muddy, setMuddy] = useState('')
  const [remainingQ, setRemainingQ] = useState('')

  const sessionId = session?.id
  useEffect(() => {
    let unsubSession
    let unsubQ
    if (sessionId) {
      unsubSession = mockLive.subscribeSession(sessionId, (s) => setSession({ ...s }))
      unsubQ = mockLive.subscribeQuestions(sessionId, (q) => {setQuestion(q);if(q.status==='open')setSubmitted(false)})
    }
    return () => {
      unsubSession?.()
      unsubQ?.()
    }
  }, [sessionId])

  const join = () => {
    const s = mockLive.joinByCode(code, { name: 'Student' })
    if (!s) return alert('Session not found')
    setSession({ ...s })
    setParticipant(s.participants[s.participants.length-1])
  }

  const submitAnswer = () => {
    if (!question || selected == null) return
    const result=mockLive.submitResponse(session.id, { participant,participant_id:participant?.id, question_id: question.id, answer: selected })
    if(result)setSubmitted(true)
  }

  const submitComprehension = () => {
    if (!session) return
    const participant = { name: 'Student' }
    const data = { mathCorrect: 0, mathTotal: 3, confidence, muddyPoint: muddy, remainingQuestion: remainingQ }
    mockLive.submitComprehension(session.id, participant, data)
    alert('Comprehension submitted')
  }

  return (
    <div className="page live-student">
      {!session && (
        <div>
          <h2>Join Live Class</h2>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter class code" />
          <button onClick={join}>Join</button>
        </div>
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
          <h3>You're in — {session.lecture_id}</h3>
          {!question?.id&&<p>Waiting for the next question... (Slide {session.current_slide_index})</p>}

          {question?.status==='open' && !submitted && (
            <div className="live-question">
              <h4>{question.prompt}</h4>
              {['mcq','multiple-choice','true-false'].includes(question.type)&&<ul>
                {question.options?.map((opt, i) => (
                  <li key={i}>
                    <label>
                      <input type="radio" name="mcq" checked={selected === i} onChange={() => setSelected(i)} /> {opt}
                    </label>
                  </li>
                ))}
              </ul>}
              {['numerical','mathematical-expression','short-answer','conceptual'].includes(question.type)&&<input value={selected??''} onChange={(e)=>setSelected(e.target.value)} inputMode={question.type==='numerical'?'decimal':'text'} placeholder="Enter your response"/>}
              {question.type==='confidence'&&<div className="confidence-buttons">{[1,2,3,4,5].map((value)=><button className={selected===value?'active':''} onClick={()=>setSelected(value)} key={value}>{value}</button>)}</div>}
              <button onClick={submitAnswer}>Submit answer</button>
            </div>
          )}
          {question?.id&&submitted&&question.status==='open'&&<div className="answer-submitted"><h4>Answer submitted</h4><p>Waiting for the instructor...</p></div>}
          {question?.status&&question.status!=='open'&&<div className="answer-submitted"><h4>Question {question.status.replace('-',' ')}</h4>{question.status==='answer-revealed'&&<p>The instructor has revealed the answer.</p>}</div>}

          {session?.comprehension_open && (
            <div className="comprehension">
              <h4>End-of-lecture comprehension</h4>
              <p>Confidence (1-5)</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setConfidence(n)} style={{ fontWeight: confidence === n ? '700' : '400' }}>{n}</button>
                ))}
              </div>
              <p>Muddy point (optional)</p>
              <textarea value={muddy} onChange={(e) => setMuddy(e.target.value)} placeholder="What was least clear?" />
              <p>Remaining question (optional)</p>
              <textarea value={remainingQ} onChange={(e) => setRemainingQ(e.target.value)} placeholder="What question do you still have?" />
              <div style={{ marginTop: 8 }}>
                <button onClick={submitComprehension}>Submit comprehension</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
